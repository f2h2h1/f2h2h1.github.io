在 Windows 下安装 Magento2
================================

[TOC]

## 环境依赖

- windows10 20H2
- git for windows 2.33
- php 7.3 64 位 nts 版
- composer 1.10.22
- mysql 5.7
- nginx 1.12
- magento 2.3.7

需要注意的事项
- 环境的搭建可以参考这篇文章 《在Windows下配置PHP服务器》
- php 需要安装 vc 依赖，在 php 下载页面的左边有 vc 库的下载链接的，用心找一下
- composer 需要 1 的版本，现在下载的 composer 默认是 2 的版本，可以用这句命令把 composer 降级 `composer self-update --1`
- composer 和 magento 的命令最好在有管理员权限的 git bash 下运行
- php 需要开启这些拓展
    ```
    curl
    fileinfo
    gd2
    intl
    mbstring
    exif
    openssl
    pdo_mysql
    soap
    sockets
    sodium
    tidy
    xsl
    ```
- php 需要修改配置文件
    ```
    post_max_size = 128M
    memory_limit = 2048M
    upload_max_filesize = 64M
    short_open_tag = On
    max_execution_time = 900
    max_input_time = 300
    max_input_vars = 500
    ```
- php 最好启用 opcache ，因为 magento2 真的很慢
- 调整这两个值能有效地提升性能
    ```
    PHP_FCGI_CHILDREN
    PHP_FCGI_MAX_REQUESTS

    大概就是在环境变量里设置
    set PHP_FCGI_MAX_REQUESTS=1000
    set PHP_FCGI_CHILDREN=32
    ```
- mysql 需要提前新建对应的数据库，并且默认编码是 utf-8
- magento2.3 不支持 xdebug3.0
- magento2 里有大量的静态文件需要加载，启用 http2 能稍微提升一下速度
- nginx 的配置 worker_processes 要设为 cpu 逻辑核心数的两倍，例如 cpu 是 2 核 4 线程，那么 worker_processes 就是 8
- nginx php-cgi mysql 最好以管理员运行，这样可以有效避免权限的问题
- nginx php mysql 等软件和 magento2 的源码，最好不要放在系统盘，这样可以有效避免权限的问题
- 软件和源码最好都放在固态硬盘里，这样能有效地提升速度。
- nginx 的命令需要在 nginx 的安装目录里运行
- nginx 最好用信号的形式关闭，用信号形式关闭的 nginx 需要等待一段时间 nginx 的进程才会完全终止
    ```
    nginx -s quit
    ```
- nginx 最好用信号的形式重启
    ```
    nginx -s reload
    ```
- nginx 在启动之前可以用这个命令来测试配置文件
    ```
    nginx -T
    ```
- 一些可能会用到的命令
    ```
    查看被占用端口对应的 PID
    netstat -aon|findstr "8081"
    查看指定 PID 的进程
    tasklist|findstr "9088"
    查看 IMAGENAME 为 nginx.exe 的进程
    tasklist /V /FI "IMAGENAME eq nginx.exe"
    结束进程 强制（/F参数）杀死 pid 为 9088 的所有进程包括子进程（/T参数）
    taskkill /T /F /PID 9088
    结束进程 强制（/F参数）杀死 IMAGENAME 为 nginx.exe 的所有进程包括子进程（/T参数）
    taskkill /T /F /FI "IMAGENAME eq nginx.exe"
    ```

## 安装 Magento2.3

1. 申请一个 magento 的账号
1. 生成一个用于 composer 的 access kye
1. 在安装的目录里运行这句命令，要留意命令最后的 `.` ，命令最后的参数是安装目录， `.` 是安装到当前目录
    ```
    composer create-project --repository=https://repo.magento.com/ magento/project-community-edition=2.3.7 .
    ```
1. 安装的过程中会要求输入 magento 的 access kye
    - 用 composer 下载 magento 时， puliic key 就是 username ， private key 就是 password
1. 安装的过程有点慢，要耐心地等待
1. magento2 的依赖有点多，最好准备一个 github-oauth
1. 修改源码
    1. `vendor\magento\framework\Image\Adapter\Gd2.php` 大概在 90 行左右的位置
    <!-- lib\internal\Magento\Framework\Image\Adapter\Gd2.php -->
        ```
        private function validateURLScheme(string $filename) : bool
        {
            if (!file_exists($filename)) { // if file not exist
                $allowed_schemes = ['ftp', 'ftps', 'http', 'https'];
                $url = parse_url($filename);
                if ($url && isset($url['scheme']) && !in_array($url['scheme'], $allowed_schemes)) {
                    return false;
                }
            }

            return true;
        }
        ```
    1. `vendor\magento\framework\View\Element\Template\File\Validator.php` 大概在 140 行左右的位置
    <!-- lib\internal\Magento\Framework\View\Element\Template\File\Validator.php -->
        ```
        protected function isPathInDirectories($path, $directories)
        {
            if (!is_array($directories)) {
                $directories = (array)$directories;
            }
            // $realPath = $this->fileDriver->getRealPath($path);
            $realPath = str_replace('\\', '/', $this->fileDriver->getRealPath($path));
            foreach ($directories as $directory) {
                if (0 === strpos($realPath, $directory)) {
                    return true;
                }
            }
            return false;
        }
        ```
1. 修改 hosts 文件，把域名 localhost-magento 指向本地 ip （其实这步没有也没关系，但为了方便下文的描述还是加上了这步）
1. 在数据库里新建对应的库
    ```
    create database magento2ce;
    ```
1. 运行安装命令
    ```
    php bin/magento setup:install `
        --base-url=http://localhost-magento/ `
        --db-host=localhost `
        --db-name=magento2ce `
        --db-user=root `
        --db-password=1234 `
        --admin-firstname=admin `
        --admin-lastname=admin `
        --admin-email=admin@admin.com `
        --admin-user=admin `
        --admin-password=admin123 `
        --language=en_US `
        --currency=USD `
        --timezone=America/Chicago `
        --use-rewrites=1
    ```
1. 运行一些必要的命令
    ```
    php bin/magento setup:upgrade
    php bin/magento setup:di:compile
    php bin/magento setup:static-content:deploy -f
    php bin/magento indexer:reindex
    php bin/magento cache:flush
    ```
1. 修改 nginx 的配置
    ```
    upstream fastcgi_backend {
        server  127.0.0.1:9001;
    }
    server {
        listen 80;

        access_log  logs/localhost-magento.access.log;
        error_log  logs/localhost-magento.error.log;

        server_name  localhost-magento;
        set $MAGE_ROOT C:/code/magento-community; # 这里是 magento 的根目录
        set $MAGE_DEBUG_SHOW_ARGS 1;
        include C:/code/magento-community/nginx.conf.sample; # 这里是 magento 的根目录里的 nginx.conf.sample
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    ```
1. 重启 nginx 然后在浏览器里输入 localhost-magento ，如无意外能看到 magento 的 home page
1. 安装示例数据，这一步不是必须的
    1. 查看当前模式
    ```
    php bin/magento deploy:mode:show
    ```
    1. 调整到开发者模式，安装时的默认模式是 default
    ```
    php bin/magento deploy:mode:set developer
    ```
    1. 下载示例数据。这一步也是需要 magento 的账号密码，如果失败，就多试几次
    ```
    php bin/magento sampledata:deploy
    ```
    1. 更新
    ```
    php bin/magento setup:upgrade
    ```

需要注意的事项
- 如果没有对应的语言包就不要修改语言设置，因为没有对应的语言包但又修改了语言设置，可能会导致一些 css 加载失败
- 日志在这个位置 `var/log` ，安装过程中遇到什么问题可以在这里找日志看
- 可以在这个文件 `app/etc/env.php` 里查看 admin 的 url ，运行完安装命令后也会输出 admin 的 url
    ```
    'backend' => [
        'frontName' => 'admin_1a3uev'
    ],
    ```
- 支付的设置在这里
    ```
    admin >> STORE >> Configuration >> SALES >> Payment Methods
    ```
    - 支付设置的相关文档 https://docs.magento.com/user-guide/payment/payments.html
- magento2 的运行效率真的很低
- 可以在 magento 的根目录里运行这样的命令启动 php 的内置 web server ，但速度真的很慢，要注意修改 base-url
    ```
    php -S 127.0.0.1:8082 -t ./pub/ ./phpserver/router.php
    ```
- magento2 的缓存十分严重，如果发现一些修改没有生效，可以尝试运行这几条命令刷新缓存
    ```
    php bin/magento cache:clean
    php bin/magento indexer:reindex
    php bin/magento cache:flush
    ```
- 如果运行了上面几句命令都没有效果，可以试试直接删掉对应的临时文件，像这样
    ```
    rm -rf var/di/* var/generation/* var/cache/* var/page_cache/* var/view_preprocessed/* var/composer_home/cache/*
    rm -rf generated/code/* generated/metadata/*
    rm -rf pub/static/*
    ```
- 可以修改 app/etc/env.php 使用 redis 作为缓存，这是 redis 大致的配置，使用 redis 后能有效地提升速度
    ```
    'session' => [
        'save' => 'redis',
        'redis' => [
            'host' => '127.0.0.1',
            'port' => '6379',
            'password' => '',
            'timeout' => '2.5',
            'persistent_identifier' => '',
            'database' => '2',
            'compression_threshold' => '2048',
            'compression_library' => 'gzip',
            'log_level' => '4',
            'max_concurrency' => '6',
            'break_after_frontend' => '5',
            'break_after_adminhtml' => '30',
            'first_lifetime' => '600',
            'bot_first_lifetime' => '60',
            'bot_lifetime' => '7200',
            'disable_locking' => '0',
            'min_lifetime' => '60',
            'max_lifetime' => '2592000'
        ]
    ],
    'cache' => [
        'frontend' => [
            'default' => [
                'backend' => 'Cm_Cache_Backend_Redis',
                'backend_options' => [
                    'server' => '127.0.0.1',
                    'database' => '0',
                    'port' => '6379'
                ],
            ],
            'page_cache' => [
                'backend' => 'Cm_Cache_Backend_Redis',
                'backend_options' => [
                    'server' => '127.0.0.1',
                    'port' => '6379',
                    'database' => '1',
                    'compress_data' => '0'
                ]
            ]
        ]
    ],
    ```
- 为了开发方便，可以关掉 merge_files 和 minify_files ， css 和 js 的都关掉，但加载一大堆小文件也会拖慢速度，在 app/etc/config.php 里配置
    ```
    'system' => [
        'default' => [
            'dev' => [
                'js' => [
                    'merge_files' => '0',
                    'minify_files' => '0',
                    'enable_js_bundling' => '0'
                ],
                'css' => [
                    'minify_files' => '0',
                    'merge_css_files' => '0'
                ],
            ]
        ]
    ],
    ```
- 在 php 的配置文件启用命令行的 opcace `opcache.enable_cli=1`
- 使用开发者模式可以不用编译，但运行速度会变得更慢
- 关掉 xdebug 后速度也有提升
- 运行这句 composer 命令 `composer dumpautoload -o` 后速度也有提升
    - 这句需要运行在 `php bin/magento setup:di:compile` 后面
    - 这句需要运行在 `php bin/magento setup:static-content:deploy -f` 前面
    - 如果是开发者模式就不要运行这句
- 打开浏览器的开发者工具时，关掉禁用缓存的选项也能提升速度， magento2 的静态文件真的非常多，但有时又会因为浏览器的缓存这样观察不到更新
- 使用 imdisk 这类内存硬盘能有效地提升速度。但内存硬盘存在断电后数据丢失的风险，而且真的非常消耗内存，内存至少也要有 16G
    - 只把生成的目录和文件放在内存硬盘里，这里需要用软连接把 var 和 generated 文件夹映射到内存硬盘
    - 把整套项目源码放在内存硬盘里
    - 把整套项目源码和数据库都放在内存硬盘里
- 可以使用 Papercut-SMTP 这类软件来接收测试的邮件
- 浏览器禁用图片的加载也能有效地提升速度

除了可以通过 compoer 安装外，还可以通过 github 的仓库安装。
- 通过 github 安装就可以不申请 magento 的帐号了。
- clone 的命令
    ```
    clone 整个仓库后再切换分支
    git clone https://github.com/magento/magento2.git .
    git pull
    git switch 2.4.2-p1
    只 clone 一个分支
    git clone -b 2.4.2-p1 https://github.com/magento/magento2.git .

    切换到对应的 tag
    git pull
    git checkout 2.4.5

    通过 github 拉取源码的需要运行一次 composer install
    ```
- 通过 composer 安装的 magento 的框架文件在这个目录里 `vendor/magento/framework`
- 通过 github 源码安装的 magento 的框架文件在这个目录里 `lib/internal/Magento/Framework`
- 如果是通过 github 修改源码的，要记得替换架的路径
- github 代码里的 app/magento/ 下那一堆 模块 对应 通过 composer 安装的 vendor/magento/module-* 的模块
- 如果 clone 速度太慢，可以在 releases 那里下载源码的压缩包（如果还是太慢就用一些下载工具来下载 releases 的压缩包）

配置 vscode 的 xml 文件语法高亮
1. vscode 里装上这个插件
    ```
    XML Language Support by Red Hat
    ```
1. 在项目根目录运行这句命令
    ```bash
    php bin/magento dev:urn-catalog:generate --ide vscode -- .vscode/misc.xml
    ```
1. 在 vscode 的配置文件 `.vscode/settings.json` 里加上这几句
    ```
    {
        "xml.catalogs": [
            ".vscode\\misc.xml"
        ],
        "xml.validation.resolveExternalEntities": true,
        "xml.codeLens.enabled": true,
    }
    ```

## 安装 2.4

笔者发现 magento2 的每个小版本的系统依赖都有一点不一样
https://devdocs.magento.com/guides/v2.4/install-gde/system-requirements.html

2.3 和 2.4 的主要区别是
- 必须使用 Elasticsearch
- mysql 需要 8.0
- php 需要 7.4
- 还有就是 composer 需要 2 以上版本

因为 Elasticsearch 的存在使得门槛高了不少。笔者感觉奥多比正在抛弃中小用户。

安装流程和注意事项和 2.3 的基本一致。

### 安装 Elasticsearch

2.4.0 依赖的 elasticsearch 版本为 7.6 。

直接从官网下载就可以了，下载后解压，然后运行 bin/elasticsearch.bat 。压缩包里原本就带着 jdk 。

magento2 的官网推荐使用 nginx 做 es 的反向代理，这样就可以给 es 加上 http 认证。

### 安装步骤和 2.3 的区别

1. 下载 magento2 的命令要把版本号改为 2.4.0
    ```
    composer create-project --repository=https://repo.magento.com/ magento/project-community-edition=2.4.0 .
    ```

1. 修改源码
    1. `vendor\magento\framework\App\StaticResource.php` 大概在 278 行左右的位置
    <!-- lib\internal\Magento\Framework\App\StaticResource.php -->
    ```
    private function isThemeAllowed(string $theme): bool
    {
        $theme = str_replace('\\', '/', $theme); // fix windows path
        return in_array($theme, array_keys($this->themePackageList->getThemes()));
    }
    ```

    1. `vendor\magento\framework\Interception\PluginListGenerator.php` 大概在 156 行左右的位置
    <!-- lib\internal\Magento\Framework\Interception\PluginListGenerator.php -->
    ```
    // $cacheId = implode('|', $this->scopePriorityScheme) . "|" . $this->cacheId;
    $cacheId = implode('-', $this->scopePriorityScheme) . "-" . $this->cacheId;
    ```

1. 安装命令要加上 Elasticsearch 的配置
    ```
    php bin/magento setup:install  \
        --base-url=http://localhost-magento/  \
        --db-host=localhost  \
        --db-name=magento2ce2  \
        --db-user=root  \
        --db-password=1234  \
        --admin-firstname=admin  \
        --admin-lastname=admin  \
        --admin-email=admin@admin.com  \
        --admin-user=admin  \
        --admin-password=admin123  \
        --language=en_US  \
        --currency=USD  \
        --timezone=America/Chicago  \
        --use-rewrites=1  \
        --search-engine=elasticsearch7  \
        --elasticsearch-host=localhost  \
        --elasticsearch-port=9200  \
        --elasticsearch-index-prefix=magento2
    ```

1. 进入后台之前需要禁用两步验证的模块和刷新缓存，不然会因为没有两步验证而无法进入后台
    ```
    php bin/magento module:disable Magento_TwoFactorAuth
    php bin/magento cache:flush
    ```

## 使用 patch 修改源码

这是上面几个需要修改的文件的合集。
这个 patch 要在项目的根目录下运行，
这个 patch 要在 composer install 之后运行， php bin/magento setup:upgrade 前运行

patch 文件的内容
```patch
--- lib/internal/Magento/Framework/Image/Adapter/Gd2.php	2023-12-19 17:16:58.149464800 +0800
+++ lib/internal/Magento/Framework/Image/Adapter/Gd2.php	2023-12-19 17:22:09.469880100 +0800
@@ -91,10 +91,12 @@ class Gd2 extends AbstractAdapter
      */
     private function validateURLScheme(string $filename) : bool
     {
-        $allowed_schemes = ['ftp', 'ftps', 'http', 'https'];
-        $url = parse_url($filename);
-        if ($url && isset($url['scheme']) && !in_array($url['scheme'], $allowed_schemes)) {
-            return false;
+        if (!file_exists($filename)) { // if file not exist
+            $allowed_schemes = ['ftp', 'ftps', 'http', 'https'];
+            $url = parse_url($filename);
+            if ($url && isset($url['scheme']) && !in_array($url['scheme'], $allowed_schemes)) {
+                return false;
+            }
         }
 
         return true;
--- lib/internal/Magento/Framework/View/Element/Template/File/Validator.php	2023-12-19 17:17:02.495932300 +0800
+++ lib/internal/Magento/Framework/View/Element/Template/File/Validator.php	2023-12-19 17:23:23.889091300 +0800
@@ -135,7 +135,8 @@ class Validator
         if (!is_array($directories)) {
             $directories = (array)$directories;
         }
-        $realPath = $this->fileDriver->getRealPath($path);
+        // $realPath = $this->fileDriver->getRealPath($path);
+        $realPath = str_replace('\\', '/', $this->fileDriver->getRealPath($path));
         foreach ($directories as $directory) {
             if ($directory !== null && 0 === strpos($realPath, $directory)) {
                 return true;
--- lib/internal/Magento/Framework/App/StaticResource.php	2023-12-19 17:16:54.560803000 +0800
+++ lib/internal/Magento/Framework/App/StaticResource.php	2023-12-19 17:21:47.440984600 +0800
@@ -285,6 +285,7 @@ class StaticResource implements \Magento
      */
     private function isThemeAllowed(string $theme): bool
     {
+        $theme = str_replace('\\', '/', $theme); // fix windows path
         return in_array($theme, array_keys($this->themePackageList->getThemes()));
     }
 }
--- lib/internal/Magento/Framework/Interception/PluginListGenerator.php	2023-12-19 17:16:58.383831000 +0800
+++ lib/internal/Magento/Framework/Interception/PluginListGenerator.php	2023-12-19 17:22:39.196325500 +0800
@@ -153,7 +153,8 @@ class PluginListGenerator implements Con
                 if (false === in_array($scope, $this->scopePriorityScheme, true)) {
                     $this->scopePriorityScheme[] = $scope;
                 }
-                $cacheId = implode('|', $this->scopePriorityScheme) . "|" . $this->cacheId;
+                // $cacheId = implode('|', $this->scopePriorityScheme) . "|" . $this->cacheId;
+                $cacheId = implode('-', $this->scopePriorityScheme) . "-" . $this->cacheId;
                 [
                     $virtualTypes,
                     $this->scopePriorityScheme,

```

这是针对使用 github 新建的项目，如果是通过 composer 新建的项目，要替换一些路径
```
sed -i 's/lib\/internal\/Magento\/Framework\//vendor\/magento\/framework\//g' windows.patch;
```

执行 patch 的命令，要在项目的根目录运行
```
patch --verbose -p0 --no-backup-if-mismatch < windows.patch;
```

生成 patch 文件的方式
```php
\define('PATCH_FILE', 'windows.patch');
$targetArr = [
    'lib/internal/Magento/Framework/Image/Adapter/Gd2.php',
    'lib/internal/Magento/Framework/View/Element/Template/File/Validator.php',
    'lib/internal/Magento/Framework/App/StaticResource.php',
    'lib/internal/Magento/Framework/Interception/PluginListGenerator.php',
];

echo "
先确定好哪些文件需要修改
复制一份
修改文件
生成 patch 文件，patch 的文件结尾要有一个空行
替换 patch 文件里的路径
在项目根目录执行 patch
";

echo PHP_EOL . PHP_EOL;

$cpArr = array_map(function($item) {
    return 'cp ' . $item . ' ' . str_replace('.php', '2.php', $item);
}, $targetArr);

$diffArr = array_map(function($item) {
    return str_replace('cp ', 'diff -up ', $item) . ' >> ' . PATCH_FILE;
}, $cpArr);

$sedArr = array_map(function($item) {
    $item = str_replace('/', '\/', $item);
    $a = str_replace('.php', '2.php', $item);
    $b = $item;
    return sprintf("sed -i 's/%s/%s/g' " . PATCH_FILE, $a, $b);
}, $targetArr);

array_map(function($item) {
    echo join(';' . PHP_EOL, $item) . PHP_EOL . PHP_EOL;
    return $item;
}, [$cpArr, $diffArr, $sedArr]);

echo 'patch --verbose -p0 --no-backup-if-mismatch < ' . PATCH_FILE . PHP_EOL;
```

<!--

cat > windows.patch <<- 'EOF'

EOF
cat windows.patch; \
patch --verbose -p0 --no-backup-if-mismatch < windows.patch;


if [ -d lib/internal/Magento/Framework ]; \
then  patch -p0 --no-backup-if-mismatch -d lib/internal/Magento/Framework < windows.patch; \
else  patch -p0 --no-backup-if-mismatch -d vendor/magento/framework < windows.patch; fi

sed -i 's/lib\/internal\/Magento\/Framework\///g' windows.patch
sed -i 's/lib\/internal\/Magento\/Framework\//vendor\/magento\/framework\//g' windows.patch
sed -i 's/vendor\/magento\/framework\//lib\/internal\/Magento\/Framework\//g' windows.patch

php -a <<- 'EOF'

EOF

-->

## 参考

用户指南 https://docs.magento.com/user-guide/

开发文档 https://devdocs.magento.com/

github https://github.com/magento/magento2

magento 相关的博客
- https://www.yshuq.com/
- https://forum.magentochina.org/
- https://www.mageoo.com/
- http://www.sbboke.com/
- https://bbs.mallol.cn/

<!--

暂时最完善的构建脚本
startAtTimestamp=$(date +%s); \
startAt=$(date -d @$startAtTimestamp +%FT%T%:z); \
echo startAt: $startAt; \
rm -rf var/di/* var/generation/* var/cache/* var/page_cache/* var/view_preprocessed/* var/composer_home/cache/*  var/tmp/* && \
rm -rf generated/code/* generated/metadata/* pub/static/* && \
php bin/magento setup:upgrade && \
php bin/magento setup:di:compile && \
php bin/magento setup:static-content:deploy -f && \
php bin/magento indexer:reindex && \
php bin/magento cache:flush; \
endAtTimestamp=$(date +%s); \
endAt=$(date -d @$endAtTimestamp +%FT%T%:z); \
seconds=$(echo $startAtTimestamp $endAtTimestamp | awk '{printf("%d", $2-$1)}') ; \
hour=$(echo $seconds | awk '{printf("%d", $1/3600)}'); \
min=$(echo $seconds $hour | awk '{printf("%d", ($1-$2*3600)/60)}'); \
sec=$(echo $seconds $hour $min | awk '{printf("%d", $1-$2*3600-$3*60)}'); \
echo startAt: $startAt; \
echo endAt: $endAt; \
echo $hour $min $sec | awk '{printf("Runtime: %02d:%02d:%02d\n", $1, $2, $3)}'; \
echo $startAtTimestamp $endAtTimestamp | awk '{printf("Runtime: %d\n", $2-$1)}'

查看当前版本
php bin/magento --version
-->
