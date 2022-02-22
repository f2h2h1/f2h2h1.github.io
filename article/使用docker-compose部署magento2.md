# 使用 docker-compose 部署 magento2

## 环境
- centos 7
    - 2核8g
- docker 1.13.1
- docker-compose 1.24.1

各个容器的版本
- php:7.3-fpm-buster
- mysql:8.0
- nginx:1.21
- redis:6.2
- frp
    - 使用 debian:10-slim 作为基础镜像构建
    - 具体的版本是 0.38.0
    - frp 的主要作用是作为 xdebug 的代理
- elasticsearch:7.9

magento 的版本是 2.3.4

下文会假设 docker 和 docker-compose 已经安装好了。

这是作为一个开发环境，所以代码不会打包进镜像里。

为了方便表述，下文会假设 magento 的根目录是 /var/html/www

## 配置文件

1. 在 magento 的根目录新建一个文件夹 docker ，在 docker 里再新建一个 vm 文件夹
    ```
    mkdir -p docker/vm
    ```
1. 在 vm 文件夹里新建
    - Dockerfile
    - docker-compose.yml
    - nginx 文件夹
    - frps 文件夹
    ```
    touch Dockerfile docker-compose.yml
    mkdir nginx frps
    ```
1. 在 /var/html/www/docker/vm/Dockerfile 文件里写入以下内容
    ```
    FROM php:7.3-fpm-buster

    RUN curl -sS -o composer.phar https://getcomposer.org/composer-1.phar && \
        chmod 0755 composer.phar && \
        mv composer.phar /usr/local/bin/composer

    RUN apt-get update && \
        requirements="git cron rsync vim libpng-dev libmcrypt-dev libmcrypt4 libcurl3-dev libfreetype6 libjpeg62-turbo libjpeg62-turbo-dev libpng-dev libfreetype6-dev libicu-dev libxslt1-dev libzip-dev  unzip libc-client-dev libkrb5-dev" && \
        apt-get install -y $requirements && \
        rm -rf /var/lib/apt/lists/*

    RUN docker-php-ext-install -j$(nproc) pdo_mysql && \
        docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
        docker-php-ext-install -j$(nproc) gd && \
        docker-php-ext-install -j$(nproc) mbstring && \
        docker-php-ext-install -j$(nproc) zip && \
        docker-php-ext-install -j$(nproc) intl && \
        docker-php-ext-install -j$(nproc) xsl && \
        docker-php-ext-install -j$(nproc) soap && \
        docker-php-ext-install -j$(nproc) bcmath && \
        docker-php-ext-install -j$(nproc) opcache && \
        docker-php-ext-configure imap --with-kerberos --with-imap-ssl && \
        docker-php-ext-install -j$(nproc) imap && \
        docker-php-ext-install -j$(nproc) sockets && \
        requirementsToRemove="libpng-dev libmcrypt-dev libcurl3-dev libpng-dev libfreetype6-dev libjpeg62-turbo-dev" && \
        apt-get purge --auto-remove -y $requirementsToRemove && \
        printf "\n\n\n" | pecl install redis-4.0.0 && \
        docker-php-ext-enable redis

    RUN pecl install xdebug-2.9.8 && \
        docker-php-ext-enable xdebug && \
        echo "xdebug.remote_enable=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.remote_host=frps" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.remote_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.show_local_vars=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.default_enable=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.idekey=vscode" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

    RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini && \
        sed -i 's/short_open_tag = Off/short_open_tag = On/g' /usr/local/etc/php/php.ini && \
        sed -i 's/memory_limit = 128M/memory_limit = 4G/g' /usr/local/etc/php/php.ini && \
        sed -i 's/;max_input_vars = 1000/max_input_vars = 10000/g' /usr/local/etc/php/php.ini && \
        sed -i 's/;date.timezone=/date.timezone = "Asia\/Hong_Kong"/g' /usr/local/etc/php/php.ini && \
        sed -i 's/;opcache.enable=1/opcache.enable=1/g' /usr/local/etc/php/php.ini && \
        sed -i 's/;opcache.enable_cli=0/opcache.enable_cli=1/g' /usr/local/etc/php/php.ini && \
        sed -i 's/max_execution_time = 30/max_execution_time = 900/g' /usr/local/etc/php/php.ini && \
        sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/g' /usr/local/etc/php/php.ini && \
        sed -i 's/post_max_size = 8M/post_max_size = 128M/g' /usr/local/etc/php/php.ini && \
        sed -i 's/max_input_time = 60/max_input_time = 300/g' /usr/local/etc/php/php.ini && \
        sed -i 's/pm = dynamic/pm = static/g' /usr/local/etc/php-fpm.d/www.conf && \
        sed -i 's/pm.max_children = 5/pm.max_children = 32/g' /usr/local/etc/php-fpm.d/www.conf && \
        sed -i 's/;pm.max_requests = 500/pm.max_requests = 500/g' /usr/local/etc/php-fpm.d/www.conf

    WORKDIR /var/www/html
    RUN chown root:root -R /var/www && \
        chmod 777 -R /var/www
    ```
1. 在 /var/html/www/docker/vm/nginx 文件夹执行这条命令，主要是用于生成 https 的证书
    ```
    openssl req -newkey rsa:4096 -nodes -keyout rsa_private_key.pem -x509 -days 365 -out domain.crt -subj "/C=CN/ST=State/L=City/O=Ltd/OU=Section/CN=test.magento2.com"
    ```
1. 在 /var/html/www/docker/vm/nginx 文件夹里新建一个名为 nginx.conf 的文件并写入以下内容
    ```
    user  root;
    worker_processes  auto;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;


    events {
        worker_connections  1024;
    }


    http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;

        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

        access_log  /var/log/nginx/access.log  main;

        sendfile        on;
        #tcp_nopush     on;

        keepalive_timeout  65;

        #gzip  on;

        include /etc/nginx/conf.d/default.conf;

        upstream fastcgi_backend {
            server  php:9000;
        }
        server {
            listen 80;

            listen 443 ssl http2;
            ssl_certificate  ./cert/domain.crt;
            ssl_certificate_key ./cert/rsa_private_key.pem;

            access_log  /var/log/nginx/magento.access.log;
            error_log  /var/log/nginx/magento.error.log;

            server_name test.magento2.com; # 这里的域名要和证书的域名一致
            set $MAGE_ROOT /var/www/html; # 这里是 magento 的根目录
            set $MAGE_DEBUG_SHOW_ARGS 1;
            include /var/www/html/nginx.conf.sample; # 这里是 magento 的根目录里的 nginx.conf.sample
            fastcgi_buffers 16 16k;
            fastcgi_buffer_size 32k;
            proxy_buffer_size 128k;
            proxy_buffers 4 256k;
            proxy_busy_buffers_size 256k;
        }
    }
    ```
1. 在 /var/html/www/docker/vm/frps 文件夹里新建一个名为 frps.ini 的文件并写入以下内容
    ```
    [common]
    bind_port=8999
    token=sdfjsldfwqefwnjnvosadfp
    ```
1. 在 /var/html/www/docker/vm/frps 文件夹里新建一个名为 Dockerfile 的文件并写入以下内容
    ```
    FROM debian:10-slim

    ARG FRP_VERSION=0.38.0

    RUN apt update \
        && apt install -y wget

    WORKDIR /tmp
    RUN set -x \
        && wget https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz \
        && tar -zxf frp_${FRP_VERSION}_linux_amd64.tar.gz \
        && mv frp_${FRP_VERSION}_linux_amd64 /var/frp \
        && mkdir -p /var/frp/conf \
        && apt remove -y wget \
        && apt autoremove -y \
        && rm -rf /var/lib/apt/lists/*

    COPY frps.ini /var/frp/conf/frps.ini

    WORKDIR /var/frp
    ENTRYPOINT ./frps -c ./conf/frps.ini
    ```
1. 在 /var/html/www/docker/vm/docker-compose.yml 文件里写入以下内容
    ```
    version: '3.2'
    services:
    php:
        build:
        context: . # 相对于 docker-compose.yml 的路径
        dockerfile: Dockerfile # 相对于 context 的路径
        restart: always
        container_name: php
        depends_on:
            - mysqld
            - redis
            - frps
        volumes:
            - ./../../:/var/www/html # 相对于 docker-compose.yml 的路径
        command: ["php-fpm"]
        environment:
            TZ: Asia/Shanghai

    nginx:
        image: nginx:1.21
        restart: always
        container_name: nginx
        ports:
            - 80:80
            - 443:443
        depends_on:
            - php
        volumes:
            - ./../../:/var/www/html:ro
            - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
            - ./nginx/domain.crt:/etc/nginx/cert/domain.crt:ro
            - ./nginx/rsa_private_key.pem:/etc/nginx/cert/rsa_private_key.pem:ro
        user: root
        environment:
            TZ: Asia/Shanghai

    mysqld:
        image: mysql:5.7
        restart: always
        container_name: mysqld
        ports:
            - 3306:3306
        volumes:
            - ~/mysql-data:/var/lib/mysql
        environment:
        MYSQL_DATABASE: magento234
        MYSQL_ROOT_PASSWORD: 123456
            TZ: Asia/Shanghai

    redis:
        image: redis:6.2
        restart: always
        container_name: redis
        ports:
            - 6379:6379
        environment:
            TZ: Asia/Shanghai

    frps:
        build:
        context: ./frps
        dockerfile: Dockerfile
        container_name: frps
        ports:
            - 8999:8999
            - 9003:9003

    elasticsearch:
        image: elasticsearch:7.9.3
        restart: always
        ports:
            - 9200:9200
            - 9300:9300
        environment:
            discovery.type: single-node
    ```

## 构建和运行

1. 构建镜像，在 magento 的根目录运行这条命令
    ```
    docker-compose -f ./docker/vm/docker-compose.yml build
    ```
1. 运行容器，在 magento 的根目录运行这条命令
    ```
    docker-compose -f ./docker/vm/docker-compose.yml up -d
    或
    docker-compose -f ./docker/vm/docker-compose.yml up
    ```
1. 停止容器，在 magento 的根目录运行这条命令，如果不是后台运行，直接 ctrl-c 就可以了
    ```
    docker-compose -f ./docker/vm/docker-compose.yml stop
    ```
1. 卸载容器，在 magento 的根目录运行这条命令
    ```
    docker-compose -f ./docker/vm/docker-compose.yml down
    ```

## 注意的事项和参考

如果修改了 Dockerfile 就必须重新构建镜像。

要注意容器挂在目录的权限问题， fpm 和 nginx 都需要有权限访问 magento 的目录。

容器启动后需要进入 fpm 的容器运行 magento 的构建命令，这里假设 fpm 的容器名是 php 。
```
docker ps -a
docker exec -it php /bin/bash
```

如果是已经存在的 magento 项目，在运行构建命令之前，要先导入数据库，然后改好 core_config_data 表相关的字段。

要记得修改 hosts 文件。

xdebug 的调试可以参考这篇文章 《在 VSCode 里使用 Xdebug 远程调试 PHP》

magento 的构建可以参考这篇文章 《在 Windows 下安装 Magento2》

## 一键部署脚本

假设已经安装好 docker 和 docker-compose ，
对应的端口没有被占用

- 2.3
```bash
#!/bin/bash

# 假设已经安装好 docker 和 docker-compose

# 下载源码

for ((i=0;i<100;i++))
do
    curl -L -o magento2.tar.gz --connect-timeout 120 --max-time 3600 --retry 100 --retry-delay 5 https://github.com/magento/magento2/archive/refs/tags/2.3.4.tar.gz
    if [ $? -eq 0 ]; then
        break
    fi
done
if [ $? != 0 ]; then
    echo "can not download magento source code"
    exit 1;
fi

# 解压源码

tar -zxf magento2.tar.gz
mv magento2-2.3.4 magento234

# 在新建对应的文件

cd magento234
rm -r .github
mkdir -p docker/vm
cd docker/vm
touch Dockerfile docker-compose.yml
mkdir nginx frps

cd nginx
openssl req -newkey rsa:4096 -nodes -keyout rsa_private_key.pem -x509 -days 365 -out domain.crt -subj "/C=CN/ST=State/L=City/O=Ltd/OU=Section/CN=test.magento2.com"

cat > nginx.conf << EOF
user  root;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status $body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/default.conf;

    upstream fastcgi_backend {
        server  php:9000;
    }
    server {
        listen 80;

        listen 443 ssl http2;
        ssl_certificate  ./cert/domain.crt;
        ssl_certificate_key ./cert/rsa_private_key.pem;

        access_log  /var/log/nginx/magento.access.log;
        error_log  /var/log/nginx/magento.error.log;

        server_name test.magento2.com; # 这里的域名要和证书的域名一致
        set \$MAGE_ROOT /var/www/html; # 这里是 magento 的根目录
        set \$MAGE_DEBUG_SHOW_ARGS 1;
        include /var/www/html/nginx.conf.sample; # 这里是 magento 的根目录里的 nginx.conf.sample
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
}
EOF

cd ..
cd frps
cat > frps.ini << EOF
[common]
bind_port=8999
token=sdfjsldfwqefwnjnvosadfp
EOF

cat > Dockerfile << EOF
FROM debian:10-slim

ARG FRP_VERSION=0.38.0

RUN apt update \
    && apt install -y wget

WORKDIR /tmp
RUN set -x \
    && wget https://github.com/fatedier/frp/releases/download/v\${FRP_VERSION}/frp_\${FRP_VERSION}_linux_amd64.tar.gz \
    && tar -zxf frp_\${FRP_VERSION}_linux_amd64.tar.gz \
    && mv frp_\${FRP_VERSION}_linux_amd64 /var/frp \
    && mkdir -p /var/frp/conf \
    && apt remove -y wget \
    && apt autoremove -y \
    && rm -rf /var/lib/apt/lists/*

COPY frps.ini /var/frp/conf/frps.ini

WORKDIR /var/frp
ENTRYPOINT ./frps -c ./conf/frps.ini
EOF

cd ..
cat > Dockerfile << EOF
FROM php:7.3-fpm-buster

RUN curl -sS -o composer.phar https://getcomposer.org/composer-1.phar && \
    chmod 0755 composer.phar && \
    mv composer.phar /usr/local/bin/composer

RUN apt-get update && \
    requirements="git cron rsync vim libpng-dev libmcrypt-dev libmcrypt4 libcurl3-dev libfreetype6 libjpeg62-turbo libjpeg62-turbo-dev libpng-dev libfreetype6-dev libicu-dev libxslt1-dev libzip-dev unzip libc-client-dev libkrb5-dev" && \
    apt-get install -y \$requirements && \
    rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install -j\$(nproc) pdo_mysql && \
    docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-install -j\$(nproc) gd && \
    docker-php-ext-install -j\$(nproc) mbstring && \
    docker-php-ext-install -j\$(nproc) zip && \
    docker-php-ext-install -j\$(nproc) intl && \
    docker-php-ext-install -j\$(nproc) xsl && \
    docker-php-ext-install -j\$(nproc) soap && \
    docker-php-ext-install -j\$(nproc) bcmath && \
    docker-php-ext-install -j\$(nproc) opcache && \
    docker-php-ext-configure imap --with-kerberos --with-imap-ssl && \
    docker-php-ext-install -j\$(nproc) imap && \
    docker-php-ext-install -j\$(nproc) sockets && \
    requirementsToRemove="libpng-dev libmcrypt-dev libcurl3-dev libpng-dev libfreetype6-dev libjpeg62-turbo-dev" && \
    apt-get purge --auto-remove -y \$requirementsToRemove && \
    printf "\n\n\n" | pecl install redis-4.0.0 && \
    docker-php-ext-enable redis

RUN pecl install xdebug-2.9.8 && \
    docker-php-ext-enable xdebug && \
    echo "xdebug.remote_enable=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_host=frps" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.show_local_vars=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.default_enable=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.idekey=vscode" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini && \
    sed -i 's/short_open_tag = Off/short_open_tag = On/g' /usr/local/etc/php/php.ini && \
    sed -i 's/memory_limit = 128M/memory_limit = 4G/g' /usr/local/etc/php/php.ini && \
    sed -i 's/;max_input_vars = 1000/max_input_vars = 10000/g' /usr/local/etc/php/php.ini && \
    sed -i 's/;date.timezone=/date.timezone = "Asia\/Hong_Kong"/g' /usr/local/etc/php/php.ini && \
    sed -i 's/;opcache.enable=1/opcache.enable=1/g' /usr/local/etc/php/php.ini && \
    sed -i 's/;opcache.enable_cli=0/opcache.enable_cli=1/g' /usr/local/etc/php/php.ini && \
    sed -i 's/max_execution_time = 30/max_execution_time = 900/g' /usr/local/etc/php/php.ini && \
    sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/g' /usr/local/etc/php/php.ini && \
    sed -i 's/post_max_size = 8M/post_max_size = 128M/g' /usr/local/etc/php/php.ini && \
    sed -i 's/max_input_time = 60/max_input_time = 300/g' /usr/local/etc/php/php.ini && \
    sed -i 's/pm = dynamic/pm = static/g' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/pm.max_children = 5/pm.max_children = 32/g' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/;pm.max_requests = 500/pm.max_requests = 500/g' /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/html
RUN chown root:root -R /var/www && \
    chmod 777 -R /var/www
EOF

cat > docker-compose.yml << EOF
version: '3.2'
services:
  php:
    build:
      context: . # 相对于 docker-compose.yml 的路径
      dockerfile: Dockerfile # 相对于 context 的路径
    restart: always
    container_name: php
    depends_on:
      - mysqld
      - redis
      - frps
    volumes:
      - ./../../:/var/www/html # 相对于 docker-compose.yml 的路径
    user: root
    command: ["php-fpm"]
    environment:
      TZ: Asia/Shanghai

  nginx:
    image: nginx:1.21
    restart: always
    container_name: nginx
    ports:
      - 80:80
      - 443:443
    depends_on:
      - php
    volumes:
      - ./../../:/var/www/html:ro
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/domain.crt:/etc/nginx/cert/domain.crt:ro
      - ./nginx/rsa_private_key.pem:/etc/nginx/cert/rsa_private_key.pem:ro
    user: root
    environment:
      TZ: Asia/Shanghai

  mysqld:
    image: mysql:5.7
    restart: always
    container_name: mysqld
    ports:
      - 3307:3306
    volumes:
      - ~/mysql-data:/var/lib/mysql
    environment:
      MYSQL_DATABASE: magento234
      MYSQL_ROOT_PASSWORD: 123456
      TZ: Asia/Shanghai

  redis:
    image: redis:6.2
    restart: always
    container_name: redis
    ports:
      - 6379:6379
    environment:
      TZ: Asia/Shanghai

  frps:
    build:
      context: ./frps
      dockerfile: Dockerfile
    container_name: frps
    ports:
      - 8999:8999
      - 9003:9003

  # elasticsearch:
  #   image: elasticsearch:7.9.3
  #   restart: always
  #   container_name: elasticsearch
  #   ports:
  #     - 9200:9200
  #     - 9300:9300
  #   environment:
  #     discovery.type: single-node
EOF

cd ..
cd ..
pwd

# 运行构建命令

docker-compose -f ./docker/vm/docker-compose.yml build

docker-compose -f ./docker/vm/docker-compose.yml up -d

sleep 10

cat > init.sh << EOF
#!/bin/bash

chmod 777 -R /var/www

composer install

php bin/magento setup:install \
    --base-url=https://localhost-magento/ \
    --db-host=mysqld \
    --db-name=magento234 \
    --db-user=root \
    --db-password=123456 \
    --cleanup-database \
    --admin-firstname=admin \
    --admin-lastname=admin \
    --admin-email=admin@admin.com \
    --admin-user=admin \
    --admin-password=admin123 \
    --backend-frontname=admin \
    --language=en_US \
    --currency=USD \
    --timezone=Asia/Shanghai \
    --use-rewrites=1

php bin/magento setup:config:set --cache-backend=redis --cache-backend-redis-server=redis --cache-backend-redis-db=0
php bin/magento setup:config:set --page-cache=redis --page-cache-redis-server=redis --page-cache-redis-db=1

php bin/magento deploy:mode:set developer
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy -f
php bin/magento indexer:reindex
php bin/magento cache:flush

chmod 777 -R /var/www

EOF

chmod 777 init.sh
docker cp `pwd`/init.sh php:/var/www/html/init.sh
sleep 1
docker exec php /var/www/html/init.sh

# curl http://doututuan.com/test.sh|bash
# vim install23.sh
# chmod 755 install23.sh
# ./install23.sh
# time ./install23.sh
# docker-compose -f ./magento234/docker/vm/docker-compose.yml stop
# rm magento2.tar.gz && rm -r magento234 && rm -r mysql-data
# docker rm `docker ps -a | grep Exited | awk '{print $1}'`

```

- 2.4
```bash
#!/bin/bash

# 假设已经安装好 docker 和 docker-compose

# 下载源码

for ((i=0;i<100;i++))
do
    curl -L -o magento2.tar.gz --connect-timeout 120 --max-time 3600 --retry 100 --retry-delay 5 https://github.com/magento/magento2/archive/refs/tags/2.4.2.tar.gz
    if [ $? -eq 0 ]; then
        break
    fi
done
if [ $? != 0 ]; then
    echo "can not download magento source code"
    exit 1;
fi

# 解压源码

tar -zxf magento2.tar.gz
mv magento2-2.4.2 magento242

# 在新建对应的文件

cd magento242
rm -r .github
mkdir -p docker/vm
cd docker/vm
touch Dockerfile docker-compose.yml
mkdir nginx frps

cd nginx
openssl req -newkey rsa:4096 -nodes -keyout rsa_private_key.pem -x509 -days 365 -out domain.crt -subj "/C=CN/ST=State/L=City/O=Ltd/OU=Section/CN=test.magento2.com"

cat > nginx.conf << EOF
user  root;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status $body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/default.conf;

    upstream fastcgi_backend {
        server  php:9000;
    }
    server {
        listen 80;

        listen 443 ssl http2;
        ssl_certificate  ./cert/domain.crt;
        ssl_certificate_key ./cert/rsa_private_key.pem;

        access_log  /var/log/nginx/magento.access.log;
        error_log  /var/log/nginx/magento.error.log;

        server_name test.magento2.com; # 这里的域名要和证书的域名一致
        set \$MAGE_ROOT /var/www/html; # 这里是 magento 的根目录
        set \$MAGE_DEBUG_SHOW_ARGS 1;
        include /var/www/html/nginx.conf.sample; # 这里是 magento 的根目录里的 nginx.conf.sample
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
}
EOF

cd ..
cd frps
cat > frps.ini << EOF
[common]
bind_port=8999
token=sdfjsldfwqefwnjnvosadfp
EOF

cat > Dockerfile << EOF
FROM debian:10-slim

ARG FRP_VERSION=0.38.0

RUN apt update \
    && apt install -y wget

WORKDIR /tmp
RUN set -x \
    && wget https://github.com/fatedier/frp/releases/download/v\${FRP_VERSION}/frp_\${FRP_VERSION}_linux_amd64.tar.gz \
    && tar -zxf frp_\${FRP_VERSION}_linux_amd64.tar.gz \
    && mv frp_\${FRP_VERSION}_linux_amd64 /var/frp \
    && mkdir -p /var/frp/conf \
    && apt remove -y wget \
    && apt autoremove -y \
    && rm -rf /var/lib/apt/lists/*

COPY frps.ini /var/frp/conf/frps.ini

WORKDIR /var/frp
ENTRYPOINT ./frps -c ./conf/frps.ini
EOF

cd ..
cat > Dockerfile << EOF
FROM php:7.4-fpm-buster

RUN curl -sS -o composer.phar https://getcomposer.org/composer.phar && \
    chmod 0755 composer.phar && \
    mv composer.phar /usr/local/bin/composer

RUN apt-get update && \
    requirements="git cron rsync vim libpng-dev libmcrypt-dev libmcrypt4 libcurl3-dev libfreetype6 libjpeg62-turbo libjpeg62-turbo-dev libpng-dev libfreetype6-dev libicu-dev libxslt1-dev libzip-dev unzip libc-client-dev libkrb5-dev libonig-dev" && \
    apt-get install -y \$requirements && \
    rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install -j\$(nproc) pdo_mysql && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j\$(nproc) gd && \
    docker-php-ext-install -j\$(nproc) mbstring && \
    docker-php-ext-install -j\$(nproc) zip && \
    docker-php-ext-install -j\$(nproc) intl && \
    docker-php-ext-install -j\$(nproc) xsl && \
    docker-php-ext-install -j\$(nproc) soap && \
    docker-php-ext-install -j\$(nproc) bcmath && \
    docker-php-ext-install -j\$(nproc) opcache && \
    docker-php-ext-configure imap --with-kerberos --with-imap-ssl && \
    docker-php-ext-install -j\$(nproc) imap && \
    docker-php-ext-install -j\$(nproc) sockets && \
    requirementsToRemove="libpng-dev libmcrypt-dev libcurl3-dev libpng-dev libfreetype6-dev libjpeg62-turbo-dev" && \
    apt-get purge --auto-remove -y \$requirementsToRemove && \
    printf "\n\n\n" | pecl install redis-4.0.0 && \
    docker-php-ext-enable redis

RUN apt-get -y install libonig-dev && \
    pecl install xdebug-2.9.8 && \
    docker-php-ext-enable xdebug && \
    echo "xdebug.remote_enable=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_host=frps" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.show_local_vars=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.default_enable=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.idekey=vscode" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini && \
    sed -i 's/short_open_tag = Off/short_open_tag = On/g' /usr/local/etc/php/php.ini && \
    sed -i 's/memory_limit = 128M/memory_limit = 4G/g' /usr/local/etc/php/php.ini && \
    sed -i 's/;max_input_vars = 1000/max_input_vars = 10000/g' /usr/local/etc/php/php.ini && \
    sed -i 's/;date.timezone=/date.timezone = "Asia\/Hong_Kong"/g' /usr/local/etc/php/php.ini && \
    sed -i 's/;opcache.enable=1/opcache.enable=1/g' /usr/local/etc/php/php.ini && \
    sed -i 's/;opcache.enable_cli=0/opcache.enable_cli=1/g' /usr/local/etc/php/php.ini && \
    sed -i 's/max_execution_time = 30/max_execution_time = 900/g' /usr/local/etc/php/php.ini && \
    sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/g' /usr/local/etc/php/php.ini && \
    sed -i 's/post_max_size = 8M/post_max_size = 128M/g' /usr/local/etc/php/php.ini && \
    sed -i 's/max_input_time = 60/max_input_time = 300/g' /usr/local/etc/php/php.ini && \
    sed -i 's/pm = dynamic/pm = static/g' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/pm.max_children = 5/pm.max_children = 32/g' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/;pm.max_requests = 500/pm.max_requests = 500/g' /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/html
RUN chown root:root -R /var/www && \
    chmod 777 -R /var/www
EOF

cat > docker-compose.yml << EOF
version: '3.2'
services:
  php:
    build:
      context: . # 相对于 docker-compose.yml 的路径
      dockerfile: Dockerfile # 相对于 context 的路径
    restart: always
    container_name: php
    depends_on:
      - mysqld
      - redis
      - frps
    volumes:
      - ./../../:/var/www/html # 相对于 docker-compose.yml 的路径
    user: root
    command: ["php-fpm"]
    environment:
      TZ: Asia/Shanghai

  nginx:
    image: nginx:1.21
    restart: always
    container_name: nginx
    ports:
      - 80:80
      - 443:443
    depends_on:
      - php
    volumes:
      - ./../../:/var/www/html:ro
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/domain.crt:/etc/nginx/cert/domain.crt:ro
      - ./nginx/rsa_private_key.pem:/etc/nginx/cert/rsa_private_key.pem:ro
    user: root
    environment:
      TZ: Asia/Shanghai

  mysqld:
    image: mysql:8.0
    restart: always
    container_name: mysqld
    ports:
      - 3307:3306
    volumes:
      - ~/mysql-data:/var/lib/mysql
    environment:
      MYSQL_DATABASE: magento242
      MYSQL_ROOT_PASSWORD: 123456
      TZ: Asia/Shanghai

  redis:
    image: redis:6.2
    restart: always
    container_name: redis
    ports:
      - 6379:6379
    environment:
      TZ: Asia/Shanghai

  frps:
    build:
      context: ./frps
      dockerfile: Dockerfile
    container_name: frps
    ports:
      - 8999:8999
      - 9003:9003

  elasticsearch:
    image: elasticsearch:7.9.3
    restart: always
    container_name: elasticsearch
    ports:
      - 9200:9200
      - 9300:9300
    environment:
      discovery.type: single-node
EOF

cd ..
cd ..
pwd

# 运行构建命令

docker-compose -f ./docker/vm/docker-compose.yml build

docker-compose -f ./docker/vm/docker-compose.yml up -d

sleep 10

cat > init.sh << EOF
#!/bin/bash

chmod 777 -R /var/www

composer install

php bin/magento setup:install \
    --base-url=https://localhost-magento/ \
    --db-host=mysqld \
    --db-name=magento242 \
    --db-user=root \
    --db-password=123456 \
    --cleanup-database \
    --admin-firstname=admin \
    --admin-lastname=admin \
    --admin-email=admin@admin.com \
    --admin-user=admin \
    --admin-password=admin123 \
    --backend-frontname=admin \
    --language=en_US \
    --currency=USD \
    --timezone=Asia/Shanghai \
    --use-rewrites=1 \
    --search-engine=elasticsearch7 \
    --elasticsearch-host=elasticsearch \
    --elasticsearch-port=9200 \
    --elasticsearch-index-prefix=magento2

php bin/magento setup:config:set --cache-backend=redis --cache-backend-redis-server=redis --cache-backend-redis-db=0
php bin/magento setup:config:set --page-cache=redis --page-cache-redis-server=redis --page-cache-redis-db=1

php bin/magento deploy:mode:set developer
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy -f
php bin/magento indexer:reindex
php bin/magento cache:flush

chmod 777 -R /var/www

EOF

chmod 777 init.sh
docker cp `pwd`/init.sh php:/var/www/html/init.sh
sleep 1
docker exec php /var/www/html/init.sh

# curl http://doututuan.com/test.sh|bash
# vim install24.sh
# chmod 755 install24.sh
# ./install24.sh
# time ./install24.sh
# docker-compose -f ./magento242/docker/vm/docker-compose.yml stop
# rm magento2.tar.gz && rm -r magento242 && rm -r mysql-data
# docker rm `docker ps -a | grep Exited | awk '{print $1}'`

```
