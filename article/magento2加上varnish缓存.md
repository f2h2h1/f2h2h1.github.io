# magento2 加上 varnish 缓存

假设已经安装好 magneto2 和 docker

1. 拉取 varnish 的镜像
    ```
    docker pull varnish:6.0
    ```
1. 生成 varnish 的配置文件
    - 在管理后台生成
        ```
        Admin > Stores > Settings > Configuration > Advanced > System > Full Page Cache
        ```
        把 full page cache 的类型改成 varnish 后，要先保存设置再生成配置文件
        好像还要开启url重写才有效
    - 用命令行生成
        ```
        php bin/magento varnish:vcl:generate --access-list localhost --backend-host localhost --backend-port 8080 --export-version 6 --grace-period 300 --output-file var/default.vcl
        ```
    - 配置文件生成后通常能直接使用，也可以根据项目的具体情况进行修改
        - 配置文件的修改可以参考 varnish 文档 https://varnish-cache.org/docs/
    - 这是各个配置项的解释
        - access-list 管理地址，用于使缓存失效
        - backend-host 后端地址
        - backend-port 后端接口
        - grace-period 宽限期，后端接口没有响应时， varnish 至多能提供多久之前的内容，默认是 300 秒
        - export-version 配置文件的版本
        - output-file 配置文件的生成位置
1. 用生成的配置文件启动或重启 varnish
    - 启动
        ```
        docker run --name varnishd --restart always -d -v var/default.vcl:/etc/varnish/default.vcl:ro --tmpfs /var/lib/varnish:exec varnish
        ```
    - 重启
        ```
        docker cp `pwd`/var/default.vcl varnishd:etc/varnish/default.vcl
        docker exec varnishd varnishreload
        ```
    - 要注意容器的端口映射
1. 修改 nginx 或 apahce 的配置
    - 通常情况下 varnish 会部署在 http 服务的前面，如果 varnish 和 http 服务部署在同一个服务器里，可能需要修改 http 服务的端口，然后由 varnish 监听 80 端口。
    - 又因为 varnish 不支持 https 所以，在 varnish 前面还需要有一个 tls 的代理。
        - tls 代理通常是 nginx 或 stunnel
        - https://varnish-cache.org/docs/6.0/phk/ssl_again.html
    - varnish 商业版是支持 tls 的 https://www.varnish-software.com/solutions/varnish-enterprise/ssl-tls-support/
1. 确认部署好后
    - 删除 var/page_cache 文件夹里的内容
    - 打开 magento 的开发者模式
    - 然后访问首页，多访问几次
    - 如果 http 响应头里出现这类值，则表示 varnish 已经生效了
        ```
        X-Magento-Cache-Debug: MISS
        X-Magento-Cache-Debug: HIT
        ```
    - varnish 生效时， var/page_cache 里应该是没有文件的
    - 可以在 varnish 的容器里运行 varnishlog 命令，更好地观察是否有生效
1. 清除缓存
    <!-- - varnish 清理缓存的策略比想象中的要复杂不少 -->
    - varnish 可以用 命令行 telnet http 三种方式发送清除缓存的命令
    - varnish 清理缓存 purge 和 ban
        - purge 是使缓存失效
            - --access-list 的地址就是用在这里的
            - 如果要是某个 url 的缓存失效，可以这样访问
                ```
                假设原本的 url 是 magento.localhost/test1
                假设 access-list 的地址是 purge.localhost
                那么删除 /test1 的缓存，就只需要请求一次 purge.localhost/test1
                ```
        - ban 是忽略缓存直接访问后端
    - 参考 https://varnish-cache.org/docs/6.0/users-guide/purging.html
1. 其它
    - varnish 配置文件模板的路径
        ```
        vendor\magento\module-page-cache\etc\varnish6.vcl
        ```
    - 原生的安装方式可以参考 magento 文档
        https://devdocs.magento.com/guides/v2.4/config-guide/varnish/config-varnish-magento.html

<!--

# VCL version 5.0 is not supported so it should be 4.0 even though actually used Varnish version is 6
vcl 4.0;

import std;
# The minimal Varnish version is 6.0
# For SSL offloading, pass the following header in your proxy server or load balancer: 'X-Forwarded-Proto: https'

backend default {
    .host = "localhost";
    .port = "8080";
    .first_byte_timeout = 600s;
    .probe = {
        .url = "/pub/health_check.php";
        .timeout = 2s;
        .interval = 5s;
        .window = 10;
        .threshold = 5;
   }
}

acl purge {
    "localhost";
}

sub vcl_recv {
    if (req.restarts > 0) {
        set req.hash_always_miss = true;
    }

    if (req.method == "PURGE") {
        if (client.ip !~ purge) {
            return (synth(405, "Method not allowed"));
        }
        # To use the X-Pool header for purging varnish during automated deployments, make sure the X-Pool header
        # has been added to the response in your backend server config. This is used, for example, by the
        # capistrano-magento2 gem for purging old content from varnish during it's deploy routine.
        if (!req.http.X-Magento-Tags-Pattern && !req.http.X-Pool) {
            return (synth(400, "X-Magento-Tags-Pattern or X-Pool header required"));
        }
        if (req.http.X-Magento-Tags-Pattern) {
          ban("obj.http.X-Magento-Tags ~ " + req.http.X-Magento-Tags-Pattern);
        }
        if (req.http.X-Pool) {
          ban("obj.http.X-Pool ~ " + req.http.X-Pool);
        }
        return (synth(200, "Purged"));
    }

    if (req.method != "GET" &&
        req.method != "HEAD" &&
        req.method != "PUT" &&
        req.method != "POST" &&
        req.method != "TRACE" &&
        req.method != "OPTIONS" &&
        req.method != "DELETE") {
          /* Non-RFC2616 or CONNECT which is weird. */
          return (pipe);
    }

    # We only deal with GET and HEAD by default
    if (req.method != "GET" && req.method != "HEAD") {
        return (pass);
    }

    # Bypass customer, shopping cart, checkout
    if (req.url ~ "/customer" || req.url ~ "/checkout") {
        return (pass);
    }

    # Bypass health check requests
    if (req.url ~ "^/(pub/)?(health_check.php)$") {
        return (pass);
    }

    # Set initial grace period usage status
    set req.http.grace = "none";

    # normalize url in case of leading HTTP scheme and domain
    set req.url = regsub(req.url, "^http[s]?://", "");

    # collect all cookies
    std.collect(req.http.Cookie);

    # Compression filter. See https://www.varnish-cache.org/trac/wiki/FAQ/Compression
    if (req.http.Accept-Encoding) {
        if (req.url ~ "\.(jpg|jpeg|png|gif|gz|tgz|bz2|tbz|mp3|ogg|swf|flv)$") {
            # No point in compressing these
            unset req.http.Accept-Encoding;
        } elsif (req.http.Accept-Encoding ~ "gzip") {
            set req.http.Accept-Encoding = "gzip";
        } elsif (req.http.Accept-Encoding ~ "deflate" && req.http.user-agent !~ "MSIE") {
            set req.http.Accept-Encoding = "deflate";
        } else {
            # unknown algorithm
            unset req.http.Accept-Encoding;
        }
    }

    # Remove all marketing get parameters to minimize the cache objects
    if (req.url ~ "(\?|&)(gclid|cx|ie|cof|siteurl|zanpid|origin|fbclid|mc_[a-z]+|utm_[a-z]+|_bta_[a-z]+)=") {
        set req.url = regsuball(req.url, "(gclid|cx|ie|cof|siteurl|zanpid|origin|fbclid|mc_[a-z]+|utm_[a-z]+|_bta_[a-z]+)=[-_A-z0-9+()%.]+&?", "");
        set req.url = regsub(req.url, "[?|&]+$", "");
    }

    # Static files caching
    if (req.url ~ "^/(pub/)?(media|static)/") {
        # Static files should not be cached by default
        return (pass);

        # But if you use a few locales and don't use CDN you can enable caching static files by commenting previous line (#return (pass);) and uncommenting next 3 lines
        #unset req.http.Https;
        #unset req.http.X-Forwarded-Proto;
        #unset req.http.Cookie;
    }

    # Bypass authenticated GraphQL requests without a X-Magento-Cache-Id
    if (req.url ~ "/graphql" && !req.http.X-Magento-Cache-Id && req.http.Authorization ~ "^Bearer") {
        return (pass);
    }

    return (hash);
}

sub vcl_hash {
    if ((req.url !~ "/graphql" || !req.http.X-Magento-Cache-Id) && req.http.cookie ~ "X-Magento-Vary=") {
        hash_data(regsub(req.http.cookie, "^.*?X-Magento-Vary=([^;]+);*.*$", "\1"));
    }

    # To make sure http users don't see ssl warning
    if (req.http.X-Forwarded-Proto) {
        hash_data(req.http.X-Forwarded-Proto);
    }
    

    if (req.url ~ "/graphql") {
        call process_graphql_headers;
    }
}

sub process_graphql_headers {
    if (req.http.X-Magento-Cache-Id) {
        hash_data(req.http.X-Magento-Cache-Id);

        # When the frontend stops sending the auth token, make sure users stop getting results cached for logged-in users
        if (req.http.Authorization ~ "^Bearer") {
            hash_data("Authorized");
        }
    }

    if (req.http.Store) {
        hash_data(req.http.Store);
    }

    if (req.http.Content-Currency) {
        hash_data(req.http.Content-Currency);
    }
}

sub vcl_backend_response {

    set beresp.grace = 3d;

    if (beresp.http.content-type ~ "text") {
        set beresp.do_esi = true;
    }

    if (bereq.url ~ "\.js$" || beresp.http.content-type ~ "text") {
        set beresp.do_gzip = true;
    }

    if (beresp.http.X-Magento-Debug) {
        set beresp.http.X-Magento-Cache-Control = beresp.http.Cache-Control;
    }

    # cache only successfully responses and 404s that are not marked as private
    if (beresp.status != 200 &&
            beresp.status != 404 &&
            beresp.http.Cache-Control ~ "private") {
        set beresp.uncacheable = true;
        set beresp.ttl = 86400s;
        return (deliver);
    }

    # validate if we need to cache it and prevent from setting cookie
    if (beresp.ttl > 0s && (bereq.method == "GET" || bereq.method == "HEAD")) {
        unset beresp.http.set-cookie;
    }

   # If page is not cacheable then bypass varnish for 2 minutes as Hit-For-Pass
   if (beresp.ttl <= 0s ||
       beresp.http.Surrogate-control ~ "no-store" ||
       (!beresp.http.Surrogate-Control &&
       beresp.http.Cache-Control ~ "no-cache|no-store") ||
       beresp.http.Vary == "*") {
        # Mark as Hit-For-Pass for the next 2 minutes
        set beresp.ttl = 120s;
        set beresp.uncacheable = true;
   }

   # If the cache key in the Magento response doesn't match the one that was sent in the request, don't cache under the request's key
   if (bereq.url ~ "/graphql" && bereq.http.X-Magento-Cache-Id && bereq.http.X-Magento-Cache-Id != beresp.http.X-Magento-Cache-Id) {
      set beresp.ttl = 0s;
      set beresp.uncacheable = true;
   }

    return (deliver);
}

sub vcl_deliver {
    if (resp.http.x-varnish ~ " ") {
        set resp.http.X-Magento-Cache-Debug = "HIT";
        set resp.http.Grace = req.http.grace;
    } else {
        set resp.http.X-Magento-Cache-Debug = "MISS";
    }

    # Not letting browser to cache non-static files.
    if (resp.http.Cache-Control !~ "private" && req.url !~ "^/(pub/)?(media|static)/") {
        set resp.http.Pragma = "no-cache";
        set resp.http.Expires = "-1";
        set resp.http.Cache-Control = "no-store, no-cache, must-revalidate, max-age=0";
    }

    if (!resp.http.X-Magento-Debug) {
        unset resp.http.Age;
    }
    unset resp.http.X-Magento-Debug;
    unset resp.http.X-Magento-Tags;
    unset resp.http.X-Powered-By;
    unset resp.http.Server;
    unset resp.http.X-Varnish;
    unset resp.http.Via;
    unset resp.http.Link;
}

sub vcl_hit {
    if (obj.ttl >= 0s) {
        # Hit within TTL period
        return (deliver);
    }
    if (std.healthy(req.backend_hint)) {
        if (obj.ttl + 300s > 0s) {
            # Hit after TTL expiration, but within grace period
            set req.http.grace = "normal (healthy server)";
            return (deliver);
        } else {
            # Hit after TTL and grace expiration
            return (restart);
        }
    } else {
        # server is not healthy, retrieve from cache
        set req.http.grace = "unlimited (unhealthy server)";
        return (deliver);
    }
}


-->