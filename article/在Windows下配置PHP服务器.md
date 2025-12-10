# 在Windows下配置PHP服务器

## 环境依赖
- Windows 10 (x64) 20H2
- php 7.4
- MySQL 8 或 5.7
- apache 2.4
- nginx 1.12
- redis 7.0
- elasticsearch 7.9.3
- kibana 7.6.2
- git for windows 2.33
    - 虽然 git 和运行 php 没有关系，但用 composer 安装依赖时有些时候会直接从 github 里拉取代码，如果这时系统里没有安装 git 可能会报错
    - git 也要加到环境变量里（一般安装完后重启一次环境变量里就有 git 的了）

## php

### 下载 php
```plaintext
http://php.net/downloads.php
```
这里要注意，如果用 apahce_mod 运行 php ， 那么 php 需要是 ts 版， 因为 ts 版才有这个模块 php7apache2_4.dll

php 需要安装 vc 依赖，在 php 下载页面的左边有 vc 库的下载链接的，用心找一下

不同版本的 php 对应 的 vc 版本是不一样的，如果不清楚这个对应关系，就把全部的 vc 版本都安装一次（只要能安装上）

### 配置 php
1. 解压下载下来的压缩包
1. 把解压后的文件夹重命名为 php
1. 把 php 文件夹复制到 C 盘的根目录下（这里可以是任意目录）
1. 把 php 文件夹的路径添加到环境变量
1. 进入 php 文件夹，把 php.ini-development 复制一份，并把复制那份文件重命名为 php.ini
1. 打开 php.ini
    - 修改拓展目录 `extension_dir = "ext"`
    - 开启以下拓展，这些只是比较常用的拓展，拓展的开关要根据实际需求来确定
        ```plaintext
        extension=curl
        extension=fileinfo
        extension=gd2
        extension=gettext
        extension=gmp
        extension=intl
        extension=mbstring
        extension=exif
        extension=mysqli
        extension=openssl
        extension=pdo_mysql
        extension=pdo_sqlite
        extension=sockets
        extension=sqlite3
        extension=xsl
        ```
    - 除了拓展之外，还有一些比较常用的配置修改
        ```
        file_uploads 是否允许上传文件
        upload_max_filesize 上传文件的最大值
        max_file_uploads 上传文件数量的最大值
        post_max_size post 请求的最大值
        short_open_tag 是否开启短标签
        memory_limit 运行内存的最大值
        max_execution_time 运行时间的最大值
        short_open_tag 是否启用短标签
        ```
1. 最好也启用 opcache ，启用 opcache 需要在配置文件的 [opcache] 下加上这样一句 
    ```
    zend_extension = "php path\ext\php_opcache.dll" # 如果 php_opcache.dll 在其它目录就填这句，这是绝对路径
    zend_extension = "php_opcache.dll" # 如果 php_opcache.dll 在 ext 目录就填这句
    ```
    
1. 还有就是命令行运行也启用 opcache `opcache.enable_cli=1`

### composer

- 下面的命令要在 php 的安装目录里运行

1. 下载安装脚本
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
```

3. 安装
```
# 安装最新的版本
php composer-setup.php
# 安装版本 2.2 ， 2.2 是 lts
php composer-setup.php --2.2
# 安装版本 2 中最新的版本
php composer-setup.php --2
# 安装版本 1 中最新的版本
php composer-setup.php --1
```

安装 composer 时遇到这种错误
```
PHP Warning: copy(): SSL operation failed with code 1
```

在 php 的安装目录里运行这句
```
curl --remote-name cacert.pem https://curl.se/ca/cacert.pem
```

然后修改 php.ini
```
openssl.cafile = "/etc/ssl/certs/cacert.pem" # 如果 cacert.pem 在其它目录就填这句，这是绝对路径
openssl.cafile = ./cacert.pem # 如果 cacert.pem 在php的安装目录就填这句
```

4. 删除安装脚本
```
php -r "unlink('composer-setup.php');"
```

5. 使用中国镜像
```
composer config -g repo.packagist composer https://packagist.phpcomposer.com
```

6. 在 PHP 的文件夹下新建一个名为 composer.bat 的文件，把以下内容复制进去，然后保存
```
@"%~dp0php.exe" "%~dp0composer.phar" %*
```

7. 在 PHP 的文件夹下新建一个名为 composer 的文件，把以下内容复制进去，然后保存，这样在 git bash 里也可以直接用 composer 的命令了
```
#!/usr/bin/env sh
dp0=$(dirname "$0")
"$dp0"/php.exe "$dp0"/composer.phar $*
```

写成别名的形式，加到 ~/.bashrc 里也是可以的，但 composer.phar 要写成绝对路径
```
alias composer="php /c/Users/a/dev/php/composer.phar"
```

powershell 的版本 composer.ps1
```powershell
$dp0 = Split-Path -Parent $MyInvocation.MyCommand.Source
$php = (Join-Path -Path $dp0 -ChildPath php.exe)
$composer = (Join-Path -Path $dp0 -ChildPath composer.phar)
PowerShell -command $php $composer $args
```

composer 的脚本文件使用绝对路径是为了方便安装多个版本的 php
```
bat 下的绝对路径
"%~dp0php.exe"
powershell 下的绝对路径
Split-Path -Parent $MyInvocation.MyCommand.Source
sh 下的绝对路径
"$(dirname "$0")"/php.exe
```

8. 最好提前准备好 github 的 oauth toekn
    - 因为 composer 下载包时会经常从 github 里下载，如果没有 token 会很快就出发匿名 api 的访问限制
    - https://getcomposer.org/doc/articles/authentication-for-private-packages.md#github-oauth
    - 同样地最好提前设置好代理，因为 github 总是间歇性访问不了
    - oauth token 填在 auth.json 里
        ```
        这个文件 auth.json 可以放在项目的根目录里，
        也可以放在全局的配置里 C:\Users\a\AppData\Roaming\Composer\auth.json
        {
            "github-oauth": {
                "github.com": "123qwMbCqG4nOVFc1wx3kuwvZ3lwObrWny2nRe39"
            }
        }
        ```

### pear 和 pecl

可以参考这篇文章 《在 Windows 下安装 pear》
安装完毕后就可以在命令行里使用 pear 和 pecl 命令

### xdebug

xdebug 的配置可以参考这篇文章 《在 VSCode 里调试 PHP》

##  MySQL

### 下载 MySQL
0. 目标，下载 MySQL 8 的社区版的 ZIP 版本
1. 打开 MySQL 的官网
```plaintext
https://dev.mysql.com/
```
2. 点击上方的 DOWNLOAD
3. 拉到页面的最下面，点击 Community (GPL) Downloads ，这个是社区版，只有社区版是免费的
4. 点击 MySQL Community Server
5. 拉到页面下面，找到 Other Downloads 选择里面的 ZIP 版本，点击 Download
6. 点击 No thanks, just start my download

### 配置 MySQL
1. 在 C 盘的根目录下新建一个名为 mysql 的文件夹，解压下载后的文件，把文件解压到 C:/mysql （这里可以是任意目录）
2. 把 C:/mysql/bin 添加进环境变量 Path
3. 在 mysql 文件夹里新建一个名为 data 的文件夹
4. 在 mysql 文件夹里新建一个名为 my.ini 的文件
    ```ini
    [mysqld]
    # 设置3306端口
    port=3306
    # 设置mysql的安装目录
    basedir=C:\\mysql
    # 设置mysql数据库的数据的存放目录
    #datadir=C:\\mysql\\data
    # 允许最大连接数
    max_connections=200
    # 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
    max_connect_errors=10
    # 服务端使用的字符集默认为UTF8
    character-set-server=utf8mb4
    # 创建新表时将使用的默认存储引擎
    default-storage-engine=INNODB
    [mysql]
    # 设置mysql客户端默认字符集
    default-character-set=utf8mb4
    [client]
    # 设置mysql客户端连接服务端时默认使用的端口
    port=3306
    default-character-set=utf8mb4
    ```
    - my.ini 的编码必须为 utf-8 无 bom，换行符使用 \n
    - 遇到错误时，可以去查看 data 文件夹里， err 后缀的文件

5. 初始化
    - 初始化命令
        ```
        mysqld --initialize
        ```
    - 注意，执行完之后，会自动生成一个密码，这个密码需要记下来，这个是命令行登录的密码。如果命令行里没有输出密码，那么就去 data 文件夹里，找到 err 后缀的文件，密码再这里面
    - 初始化后，第一次运行 mysqld ，要用命令行登录，然后修改密码。初始化的密码如果不修改好像不能通过 php 或其它客户端连接
    - 第一次运行时的密码修改
        ```
        # 以这样的方式运行 mysqld
        mysqld --skip-grant-tables --shared-memory --console
        # 使用 mysql 登录并修改密码
        mysql -uroot -p
        use mysql;
        flush privileges;
        ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';
        flush privileges;
        quit
        ```
6. 运行
    - 直接在命令行运行
        ```
        mysqld --console
        ```
    - 以服务的形式运行
        在管理员模式的命令行下 cd 进 C:/mysql/bin 目录，以次运行以下命令，虽然已经添加进环境变量，但然要在目录下运行。
        - 注册服务 `mysqld install mysql`
        - 启动服务 `net start mysql`
        - 停止服务 `net stop mysql`
        - 移除服务 `mysqld remove mysql`
        - 上面命令的服务名是 mysql ，这个服务名可以自定以的。启动服务前需要先注册服务，移除服务前需要先停止服务。
    - 只能以一种方式运行，因为是 zip 版，笔者更倾向于用 命令行运行

7. 修改密码，依次运行以下命令
    ```
    # 登入 mysql
    mysql -uroot -p
    # 使用 mysql 库
    use mysql;
    # 修改密码
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码';
    # 刷新权限
    flush privileges;
    ```

8. MySQL 的 ZIP 版本容易出现各种奇怪的错误，安装版能省心一点

9. 如果 mysql8 遇到这种错误
    ```
    Please use caching_sha2_password instead
    ```

    用命令行进入 mysql 再修改一次密码
    ```
    ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY '新密码';
    flush privileges;
    ```

    查看用用户的验证器插件
    ```
    select Host, User, Plugin from user;
    ```

10. 如果遇到这种错误，用命令行登录一次，然后改密码就好了
    ```
    Your password has expired. To log in you must change it using a client that supports expired
    ```

### 5.7
1. 下载 zip 版
1. 从官网下载时，要用心找一下，因为 5.7 算是旧版了，下载地址不像 8 那样显眼
1. 5.7 的配置和 8 基本一致
1. 如果没有加入到环境变量，需要显式声明配置文件的地址，像这样
    ```
    初始化 mysql
    mysqld --defaults-file="C:\Program Files\mysql-5.7.34-winx64\my.ini" --initialize
    ```
1. 5.7 第一次运行时使用这样的命令， --skip-grant-tables 是忽略权限验证的意思
    ```
    mysqld --defaults-file="C:\Program Files\mysql-5.7.34-winx64\my.ini" --console --skip-grant-tables
    ```
    1. 第一次运行时要修改 root 密码
    1. 用命令行运行mysql的客户端
        ```
        mysql -uroot -p
        ```
    1. 进入 mysql 后，依次运行下面的命令
        ```
        use mysql;
        update user set authentication_string=password('1234') where user='root';
        flush privileges;
        ```
1. 之后就可以退出mysql客户端和mysqld了，关掉 mysqld ，以后运行 mysqld 就用这样的命令
    ```
    mysqld --defaults-file="C:\Program Files\mysql-5.7.34-winx64\my.ini" --console
    ```
1. 因为没有加入到环境变量，所以需要显式声明配置文件的路径，运行目录也需要是 安装路径/bin
1. 从安装配置的角度来看， 5.7 和 8 最大的不同是，修改密码的方式
    - 5.7 和 8 修改密码的 sql 语句也有一点差别

## Apache

<!--

https，http2，http长连接
目录索引，cgi，fcgi，重定向，url重写，反向代理，fpm，负载均衡，虚拟站点
WebSocket，WebSocket Secure
Basic认证，Digest认证
http压缩，http缓存，伪静态，mpm（Multi-Processing Modules）
日志文件，SSI（Server Side Includes）
servertype 的 standalone模式 和 inetd模式
限速
    mod_ratelimit
    apache 原生的限速模块没有 nginx 的好用
ip 白名单/黑名单
主动返回 403 429

mod_proxy
mod_proxy_http
mod_proxy_connect

这一段加在 VirtualHost 里
    ProxyPreserveHost On
    # 将客户端请求转发到后端服务器
    ProxyPass / http://localhost:3000/
    # 将后端服务器返回的 URL 地址替换成前端域名地址，防止暴露内部地址
    ProxyPassReverse / http://localhost:3000/


mod_proxy_wstunnel
mod_rewrite

这一段加在 VirtualHost 里
    RewriteEngine On
    RewriteCond          "%{HTTPS}" "!=on"
    RewriteRule ^/?(.*)$ https://%{HTTP_HOST}/$1 [L,R=302]


要实现某项功能 -> 需要写什么样的配置 -> 这些配置依赖哪个模块


apache2 httpd apachectl
service httpd
systemctl restart apache2

伪静态（Fake Static）是URL重写（URL Rewriting）的一种常见应用场景 ，但两者并非完全等同。
除了 url重写 外可以实现伪静态的方式
404时转发到默认页面index.php，然后用php的$_SERVER['PATH_INFO']获取路由，进而实现伪静态
需要配置服务器，允许 PATH_INFO


目录索引
    直接加上这一句就可以了
    Options +Indexes

cgi
    1 启用 cgi 模块
        如果是 非线程化的mpm 和 windows 环境下，则启用 mod_cgi.so

        如果是 线程化的mpm ，则启用 mod_cgid.so
    2 修改配置
    3 确保运行 apache 的用户有执行 cgi程序 或 cgi脚本的权限

    参考
    https://httpd.apache.org/docs/current/howto/htaccess.html
    https://httpd.apache.org/docs/current/howto/cgi.html

https://www.rfc-editor.org/rfc/rfc3875.html
https://www.w3.org/CGI/


windows 下也没有这个工具 apachectl
信号
    TERM stop
    USR1 graceful
    HUG restart
    WINCH graceful-stop

apachectl -k stop
apachectl -k graceful
apachectl -k restart
apachectl -k graceful-stop

apachectl 是一个控制脚本
apachectl 有两种工作模式，一种是作为简单的控制脚本，一种是作用 initv 或 systemctl 守护进程的脚本

找到 pid 文件然后直接发送信号也可以
kill -TERM `cat /usr/local/apache2/logs/httpd.pid`
kill -TERM `cat /usr/local/apache2/logs/httpd.pid`
kill -TERM `cat /usr/local/apache2/logs/httpd.pid`
kill -TERM `cat /usr/local/apache2/logs/httpd.pid`

使用 httpd 程序本体也可以
httpd -k stop
httpd -k graceful
httpd -k restart
httpd -k graceful-stop

apache 的文档推荐使用 apachectl
https://httpd.apache.org/docs/2.4/stopping.html
https://httpd.apache.org/docs/2.4/programs/httpd.html
https://httpd.apache.org/docs/2.4/programs/apachectl.html


一些文章里会提及 apache 有 reload 的参数，这个实质也是发送 USER1 信号，和 graceful 没有区别

httpd -k graceful 好像也能用在 windows 里

apache 再加上 mpm 能达到类似 nginx 的效果

在 windows 环境下， apache 的 php 支持平滑重启，但 nginx 的不行，因为 windows 下的 php-cgi 没有平滑重启


Event MPM 和 Worker MPM 都是多进程多线程模型
总结来说，Event MPM 是 Worker MPM 的改进版本，
特别是在处理长连接和高并发请求时表现更好。
如果你的应用需要处理大量的并发请求，Event MPM 可能是更好的选择。
Event MPM 在遇到不兼容的模块时，会回退到 Worker 模式。

prefork 是多进程模型，性能不好，但兼容性最好


把 apache 里的常用模块都编译成静态模块应该也能提升性能的吧？

-->

### 下载 Apache
```plaintext
https://www.apachelounge.com/download/
```
Apache 官方只提供源码，二进制文件都是第三方编译的，这里选择 Apache Lounge 提供的二进制文件。
除了 Apache Lounge 之外还有 WampServer 和 XAMPP ，选 Apache Lounge 的原因是， php 的下载页面也是推荐用 Apache Lounge 。

### 配置 Apache
1. 把 Apache 添加进环境变量
2. 配置 php
    - php_module
        1. 把 php 目录下的 php7apache2_4.dll 复制到 Apache 目录下的 modules
        2. 打开 Apache 的配置文件 httpd.conf，往 httpd.conf 里添加 php 的模块，httpd.conf 这个文件在 Apache 安装目录的 conf 文件夹里
            ```plaintext
            LoadModule php7_module modules/php7apache2_4.dll

            AddHandler application/x-httpd-php .php
            PHPIniDir "C:/php"
            ```
            - 这段配置，加在 httpd.conf 的 179 行左右，就是加载模块那部分的尾部
            - 如果遇到这种错误
                ```
                httpd.exe: Syntax error on line 187 of Apache24/conf/httpd.conf: Cannot load modules/php8apache2_4.dll into server:
                ```
            - 可以尝试这样解决
                - 检查 httpd.conf 里的 SRVROOT 是否有填好
                - 检查 Apache 与 PHP 版本的位数是否一致
                    - 必须是 都是 32 位或都是 64 位
                - 试试 模块名由 php8_module 改成没有版本号的 php_module
                - 试试 模块的路径填绝对路径
                    - 例如 这样 C:/php/php8apache2_4.dll
                    - 但 这样的路径却不行 C:/apache/modules/php8apache2_4.dll ，虽然不知道为什么
    - fast cgi
        - 假设使用 mod_proxy_fcgi 模块
            - 除了 mod_proxy_fcgi 之外，还有 mod_fcgid 和 mod_fastcgi
        - 把这几行的注释删掉
            ```
            LoadModule proxy_module modules/mod_proxy.so
            LoadModule proxy_connect_module modules/mod_proxy_connect.so
            LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so
            ```
        - 然后在配置站点的位置加上
            ```
            <LocationMatch "^/(.*\.php(/.*)?)$">
                ProxyPass fcgi://127.0.0.1:9000/var/www/html/
            </LocationMatch>
            ```
        - 127.0.0.1:9000 是 fast cig 的地址
        - /var/www/html/ 是站点根目录

3. 打开 httpd.conf，将里面的 #ServerName localhost:80 注释去掉。

4. 在 httpd.conf 里找到这一段

```plaintext
<Directory />
    AllowOverride none
    Require all denied
</Directory>
```
把这一段修改为
```plaintext
<Directory />
    AllowOverride none
    Require all granted
</Directory>
```

5. 把 httpd.conf 里的 #Include conf/extra/httpd-vhosts.conf 注释去掉。
6. 打开 httpd-vhosts.conf，把里面的例子删掉
7. 在 httpd-vhosts.conf 里添加一个站点
```plaintext
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host3.example.com
    # 站点根目录
    DocumentRoot "C:\www\wwwroot\dummy-host2.example.com.cn"
    # 站点域名
    ServerName dummy-host2.example.com.cn
    # 错误日志
    ErrorLog "C:\www\wwwlog\dummy-host2.example.com-error.log"
    # 日志
    CustomLog "C:\www\wwwlog\dummy-host2.example.com-access.log" common
    # 默认文件名
    <IfModule dir_module>
        DirectoryIndex index.html index.php
    </IfModule>
</VirtualHost>
```
注意，这里的站点目录和日志目录需要在自己新建

测试配置文件
```
httpd -t
```

查看帮助
```
httpd -h
```

9. 启动 Apache，在命令行里运行
```plaintext
httpd
```
10. 以服务的形式运行 Apache，先注册服务，然后再启动服务。停止 Apache 的时候就停止服务，卸载 Apache 的时候需要先移除服务。
- 注册服务
```plaintext
httpd -k install
```
- 移除服务
```plaintext
httpd -k uninstall
```
- 启动服务
```plaintext
httpd -k start
```
- 停止服务
```plaintext
httpd -k stop
```
- 重启服务
```plaintext
httpd -k restart
```

注意，在调用 httpd 注册 Apache 的服务时，弹出这句话
```
Errors reported here must be corrected before the service can be started
```
并不是 error ，而是提示：如果这行下边出现错误则解决错误后再启动！

11. https 配置
    1. 安装 ssl 模块 mod_ssl.so 和 mod_socache_shmcb.so ，大多数情况下 mod_ssl.so 和 mod_socache_shmcb.so 是默认安装好的
    1. 启用 mod_ssl.so ，就是在 httpd.conf 文件里把那句 mod_ssl.so 的注释删掉
    1. 启用 mod_socache_shmcb.so ，就是在 httpd.conf 文件里把那句 mod_socache_shmcb.so 的注释删掉
    1. 把 httpd.conf 里的 #Include conf/extra/httpd-ssl.conf 注释去掉。
    1. 把 httpd-ssl.conf 里的 VirtualHost 配置删掉或注释掉
    1. 在 VirtualHost 里至少加上这几个字段
        ```
        SSLEngine on
        SSLCertificateFile "${SRVROOT}/conf/ssl/domain.crt"
        SSLCertificateKeyFile "${SRVROOT}/conf/ssl/rsa_private_key.pem"
        ```
    1. 大概的例子
        ```
        <VirtualHost _default_:443>
        DocumentRoot "${SRVROOT}/htdocs"
        ServerName 2.example.com:443
        ServerAlias 3.example.com 4.example.com
        SSLEngine on
        SSLCertificateFile "${SRVROOT}/conf/ssl/domain.crt"
        SSLCertificateKeyFile "${SRVROOT}/conf/ssl/rsa_private_key.pem"
        </VirtualHost>
        ```
12. http2 配置
    1. 安装 ssl 模块 mod_http2.so ，大多数情况下 mod_http2.so 是默认安装好的
    1. 启用 mod_http2.so ，就是在 httpd.conf 文件里把那句 mod_http2.so 的注释删掉
    1. 在 VirtualHost 里至少加上这个字段
        ```
        Protocols h2 h2c http/1.1 http/1.0
        ```
    1. 大概的例子
        ```
        <VirtualHost _default_:443>
        DocumentRoot "${SRVROOT}/htdocs"
        ServerName 2.example.com:443
        ServerAlias 3.example.com 4.example.com
        SSLEngine on
        SSLCertificateFile "${SRVROOT}/conf/ssl/domain.crt"
        SSLCertificateKeyFile "${SRVROOT}/conf/ssl/rsa_private_key.pem"
        Protocols h2 h2c http/1.1 http/1.0
        </VirtualHost>
        ```
    1. 启用 http2 必须先启用 https

## nginx

### 下载 nginx
```plaintext
http://nginx.org/download/nginx-1.21.1.zip
```

### 配置 nginx

1. 解压下载的压缩包
2. 修改 config/nginx.conf 这个文件
    - worker_processes 设为 cpu 逻辑核心数的两倍，例如 cpu 是 2 核 4 线程，那么 worker_processes 就是 8 ，但 worker_processes 的值最好不要超过 8
    - 加上站点的配置， nginx.conf 里原本就有一个站点的配置例子，可以在那个例子上修改，或者把那个例子整个注释掉，然后加上这段配置
        ```
        server {
            listen       80;
            server_name  localhost;

            access_log  logs/localhost.access.log;
            error_log  logs/localhost.error.log;

            location / {
                root   C:/wwwroot; # 这是站点根目录的路径
                index  index.html index.htm;
            }

            location ~ \.php$ {
                root           C:/wwwroot; # 这是站点根目录的路径
                fastcgi_pass   127.0.0.1:9001;
                fastcgi_index  index.php;
                include        fastcgi.conf;
            }
        }
        ```

<!--
nginx 的配置文件只能用一次 include ，不能多个配置文件嵌套
但可以用 * 作为通配符

-->

3. https 的配置
    - 在 server 块里加上这三句
    - ssl_certificate 是证书路径， ssl_certificate_key 是私钥路径
    - ssl_certificate 和 ssl_certificate_key 的路径，要么填绝对路径，要么填相对于 nginx 根目录的路径
    - http2 不是必须的，但现在的浏览器都支持了，多加一句能稍微提升一下性能
    ```
    listen       443 ssl http2;
    ssl_certificate  ./crt/127.0.0.1/domain.crt;
    ssl_certificate_key ./crt/127.0.0.1/rsa_private_key.pem;
    ```

### 启动 nginx

1. 启动 php-cgi ，端口号要和 nginx 的配置里一致， PHP_FCGI_CHILDREN 如果不设置，默认值是 1 ，性能会比较差，大部分情况下和 nginx 的 worker_processes 设为一样就可以了
    ```
    set PHP_FCGI_CHILDREN=8
    php-cgi -b 127.0.0.1:9001
    ```

2. 启动 nginx ，直接在 nginx 的根目录下运行 nginx 就可以了
3. 一些常用的命令，这些命令也是需要在 nginx 的根目录下运行
    - 退出 nginx `nginx -s quit`
    - 停止 nginx `nginx -s stop`
    - 重载配置 `nginx -s reload`
    - 测试配置文件 `nginx -T`
    - 查看帮助 `nginx -h`
4. 退出 nginx 最好使用信号的方式退出，直接关掉 nginx 的进程，可能会有 nginx 子进程残留

## redis

### 下载 redis
```plaintext
https://github.com/MicrosoftArchive/redis/releases

这是新的 redis windows 版，虽然不是官方版本，但总比没有好
https://github.com/redis-windows/redis-windows
```
这里推荐下载 zip 版

redis 的 windows 版已经很久没更新了。
redis 的官方好像是推荐用 wsl2 在 windows 里安装 redis
- https://redis.com/blog/redis-on-windows-10/
- https://redis.io/docs/getting-started/installation/install-redis-on-windows/

据说 redis 无法支持 windows 的原因是 windows 没有 fork 系统调用（和 fpm 不支持 windows 的原因是一样的）。
好像是没有 fork 功能，redis 就无法执行某些必要的数据库保存方法。

### 运行 redis
下载完后解压，然后 cd 进目录，然后运行这段
```
redis-server.exe redis.windows.conf
或
redis-server.exe redis.conf
```

### php 的 redis 扩展

下载 https://pecl.php.net/package/redis

下载完后，把 dll 文件放在 php 的 ext 目录。

然后修改 php.ini ，加上下面这一行，最好加在那些拓展的位置
```
extension=php_redis.dll
```

### 参考

https://www.redis.com.cn/redis-installation.html

## elasticsearch 和 kibana

elasticsearch 和 kibana 都在这里下载
https://www.elastic.co/cn/downloads/past-releases

elasticsearch 下载完后解压，然后运行这个文件 `bin/elasticsearch.bat`
然后用浏览器访问这个地址 http://127.0.0.1:9200/_cat/nodes?v

kibana 下载完后解压，然后运行这个文件 `bin/kibana.bat`
然后用浏览器访问这个地址 http://127.0.0.1:5601
然后进入Kibana的DevTools界面操作ES

要先运行 elasticsearch 后运行 kibana
kibana 的版本要和 elasticsearch 对应，不然 kibana 运行不了
如果运行失败要留意命令行的输出

只要双方都是默认配置，那么就可以直接运行的了
- elasticsearch 的配置文件 config/elasticsearch.yml
- kibana 的配置文件 config/kibana.yml

<!--

curl -v 'http://127.0.0.1:9200'

查看节点信息
curl -v --user user:passwd 'http://localhost:9200/_cat/nodes?v'
curl -v 'http://127.0.0.1:9200/_cat/nodes?v'

ES默认的分词器是standard，对英文比较友好，
例如：hello world 会被分解成 hello和world两个关键词，
如果是中文会分解成一个一个字，例如：上海大学 会分解成: 上、海、大、学。

analysis-smartcn 中文分词 ES官方推荐的中文分词插件
analysis-stconvert 简体繁体转换 这个不是官方插件
    https://github.com/infinilabs/analysis-stconvert

ik分词器
elasticsearch-plugin install https://get.infini.cloud/elasticsearch/analysis-ik/7.17.0

{ES安装目录}/bin/elasticsearch-plugin install analysis-smartcn
安装完后记得重启
    前台运行就直接 ctrl+c 结束进程然后重新启动
        bin/elasticsearch
    后台启动
        用 ps 找到进程id
            ps -ef|grep elastic
        用 kill 结束进程
            kill -9 1302
        重新启动
            bin/elasticsearch -d

docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.17.28
docker exec -it elasticsearch /bin/bash

查看已安装的插件
bin/elasticsearch-plugin list
curl -X GET "http://localhost:9200/_cat/plugins?v"

查看版本信息
curl -X GET "http://localhost:9200/_nodes/settings?pretty"

-->

## 其它

nginx 和 apache 大多数情况下安装一个就可以，当然啦 nginx 反代 apache 也是可以的。

相比于 xampp 和 wampp 这类集成环境，笔者更喜欢，全部软件都自行安装。因为这样可以更好地控制各个软件的配置，和方便地安装同一个软件的多个版本 ~~（所以这篇文章里的 mysql 才会选 zip 版来安装）~~ 。

笔者对 Windows 的服务并不了解，所以大多数软件都是通过命令行直接运行的。

可以用 NSSM 把像 php-cgi 这类在命令行运行的程序封装成服务。
或者用 instsrv 和 srvany 配合，也可以把任意 exe 封装成服务。
instsrv.exe 和 srvany.exe 是 Microsoft Windows Resource Kits 工具集中的两个实用工具。

https 自签证书的生成，可以参考这篇文章 《密码学入门简明指南》 的这个章节 OpenSSL 的一般使用 。

### phpmyadmin
1. 下载 phpmyadmin
    ```
    https://www.phpmyadmin.net/
    ```
1. 下载完后解压
1. 打开这两个文件 `/libraries/config.default.php` `/config.sample.inc.php` ，设置这两个文件里的这个值，这个值的长度要大于 64
    ```
    $cfg['blowfish_secret'] = ''
    ```
1. 可以在这个文件里 `/config.sample.inc.php` 修改 mysql 的连接参数
1. 配置好站点就可以直接运行了，当然也可以在根目录里用 php 的内置服务器运行
1. 除了 phpmyadmin 外，这里还推荐使用 Adminer 或 CloudBeaver 或 DBeaver 或 heidisql 作为数据库的管理工具

<!-- 5.2 -->

### phpredisadmin
1. 下载 phpredisadmin
    ```
    https://github.com/ErikDubbelboer/phpRedisAdmin
    ```
1. 解压后，修改配置文件
    - 直接修改 includes/config.sample.inc.php
    - 或者把 includes/config.sample.inc.php 复制到 includes/config.inc.php 再修改

1. 安装依赖 composer install

1. 配置好站点就可以直接运行了，当然也可以在根目录里用 php 的内置服务器运行

1. 现在的 redis 也提供 gui 工具了 https://redis.com/redis-enterprise/redis-insight/

<!-- 1.21 -->

### mailpit

可以用这个仓库来测试邮件的发送
- https://github.com/axllent/mailpit
- 启动命令
    ```
    mailpit --listen 127.0.0.1:8025 --smtp 127.0.0.1:25 --smtp-auth-accept-any --smtp-auth-allow-insecure
    ```
- 启动完后用浏览器访问 listen 的地址

<!--
mailpit 的版本是 v1.20
邮件里如何加上附件？

其它类似的项目，这类项目被称为 邮件测试网关类应用
https://github.com/maildev/maildev
https://github.com/sj26/mailcatcher
-->

### hosts

hosts 是用来修改本地的域名解释

hosts 的文件位置是 `%WINDIR%\System32\drivers\etc\hosts`

其中 %WINDIR% 是系统所在目录，一般是 `%HOMEDRIVE%\WINDOWS`

其中 %HOMEDRIVE% 是系统所在分区，一般是 `C:`

所以一般情况下 hosts 的文件位置是 `C:\WINDOWS\System32\drivers\etc\hosts`

修改 hosts 需要管理员权限，直接用记事本修改会保存失败的，可以用 vscode 修改

或者打开管理员的命令行，再在命令行里打开记事本，再用记事本打开 hosts
或者用 vscode 打开， vscode 在保存时会自动提示管理员权限的授权
例如这样
```
notepad %WINDIR%\System32\drivers\etc\hosts
notepad $env:windir\system32\drivers\etc\hosts
notepad "$WINDIR/system32/drivers/etc/hosts"

code %WINDIR%\System32\drivers\etc\hosts
code $env:windir\system32\drivers\etc\hosts
code "$WINDIR/system32/drivers/etc/hosts"
```

hosts 修改后，要记得刷新 DNS ，可以用这个命令刷新 DNS
```
ipconfig /flushdns
```

hosts 修改后，可以用这个命令 `nslookup 域名` 来判断有没有生效

windows 的 hosts 文件需要是 ascii 编码或 ansi 编码，用其它编码 hosts 可能会无效

如果没有权限修改 hosts 文件，可以在本地自建一个 DNS 服务

### 一些实用的命令

- netstat
    ```
    查看端口占用，第二列是本地监听的地址和端口，第二列是远程监听的地址和端口，最后一列是 pid
    netstat -ano
    列出进程名
    netstat -anob
    只查看 TCP
    netstat -anob -p TCP
    查看 TCP 下的 80 端口占用
    netstat -anob -p TCP | findstr "80"
    ```

- tasklist
    ```
    tasklist /V /FI "WINDOWTITLE eq titlename"
    tasklist /V /FI "PID eq 9088"
    tasklist /V /FI "IMAGENAME eq nginx.exe"
    tasklist /V /FI "IMAGENAME eq nginx.exe" /FI "WINDOWTITLE eq titlename"
    ```

<!--
    查看被占用端口对应的 PID
    netstat -aon|findstr "8081"
    查看指定 PID 的进程
    tasklist|findstr "9088"
-->

- taskkill
    ```
    taskkill /T /F /FI "WINDOWTITLE eq titlename"
    taskkill /T /F /FI "PID eq 9088"
    taskkill /T /F /FI "IMAGENAME eq nginx.exe"
    ```

<!--
各种启动脚本
bat

nginx.bat
```
title nginx
chcp 65001
C:
cd C:\Users\a\dev\nginx-1.21.4
call nginxquit.bat
nginx -T
nginx || echo %errorlevel% & pause
exit
```

nginxquit.bat
```
C:
cd C:\Users\a\dev\nginx-1.21.4
nginx -s quit
timeout 6
taskkill /T /F /FI "IMAGENAME eq nginx.exe"
```

php-cgi.bat
```
title php-cgi
chcp 65001
C:
cd C:\Users\a\dev\php-8.1.16-nts-Win32-vs16-x64
set PHP_FCGI_CHILDREN=16
set PHP_FCGI_MAX_REQUESTS=100
php-cgi -b 127.0.0.1:9001 || echo %errorlevel% & pause
```

elasticsearch.bat
```
title elasticsearch
chcp 65001
C:
cd C:\Users\a\dev\elasticsearch-7.9.3\bin
elasticsearch.bat
```

mysql.bat
```
title mysqld
chcp 65001
C:
cd C:\Users\a\dev\mysql-8.0.27-winx64\bin
mysqld --defaults-file="C:\Users\a\dev\mysql-8.0.27-winx64\my.ini" --console || echo %errorlevel% & pause
```

redis.bat
```
title redis
chcp 65001
C:
cd C:\Users\a\dev\Redis-x64-3.2.100
redis-server.exe || echo %errorlevel% & pause
```

一次启动全部 startup.bat
```
cmd /c start php-cgi.bat
cmd /c start nginx.bat
cmd /c start mysql.bat
cmd /c start redis.bat
cmd /c start elasticsearch.bat
```

一次关闭全部 shutdown.bat
```
taskkill /T /F /FI "WINDOWTITLE eq php-cgi"
taskkill /T /F /FI "WINDOWTITLE eq mysqld"
taskkill /T /F /FI "WINDOWTITLE eq elasticsearch"
taskkill /T /F /FI "WINDOWTITLE eq redis"
call nginxquit.bat
```

一次重启全部 reload.bat
```
cmd /c shutdown.bat
timeout 2
cmd /c startup.bat
```


```
title apache httpd
cd C:\Users\a\dev\Apache24\bin
httpd.exe  -t
httpd.exe  || pause
```



加上 apache 和 nginx http 重定向到 https 的配置

apache 在 Windows 环境下的 mpm
apache 如何设置 server-status 和 server-info
apache 2.2 和 2.4 的区别
    关注这个模块 mod_access_compat.so

mod_md.so 是 Apache HTTP 服务器的一个模块，主要用于管理域名和自动化证书管理。
md 应该是 Managing domains 的缩写

现在新版的 nginx 似乎也可以自动管理证书了


-->
