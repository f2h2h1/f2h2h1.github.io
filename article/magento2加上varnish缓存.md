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
