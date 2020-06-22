用 docker-compose 部署 lnmp 环境
==============================
## 运行环境
- 宿主机系统 CentOS Linux release 7.2.1511 (Core)
- docker 版本 19.03
- docker-compose 版本 1.26.0
- nginx:1.19
- php:7.4-fpm-buster
- mysql:8.0
- phpmyadmin:5

## 安装 docker
```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine

sudo yum install -y yum-utils

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install -y docker-ce docker-ce-cli containerd.io

sudo systemctl start docker

# 设为开机启动
sudo systemctl enable docker.service

sudo docker run hello-world
```

## 安装 docker compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 拉取镜像
```bash
docker pull nginx:1.19
docker pull php:7.4-fpm-buster
docker pull mysql:8.0
docker pull phpmyadmin/phpmyadmin:5
```

## 新建相关的文件夹
```bash
# 下文的其它操作都在 lnmp 目录下进行
mkdir ./lnmp
cd lnmp
mkdir ./config
mkdir ./log
# 网站根目录
mkdir ./www
touch docker-compose.yml
# 因为官方镜像的php没有 pdo_mysql 和 redis 拓展，所以这里要重新构建一个镜像
touch dockerfile-php.yml
```

## 修改 nginx 的配置
1. 把 nginx 的配置文件从容器里复制出来
```bash
# 先运行一次 nginx 容器
docker run --rm -d --name nginx nginx:1.19
# 把配置文件复制出来
docker cp nginx:/etc/nginx ./config/
# 修改配置文件
vi ./config/nginx/conf.d/default.conf
```

2. 把 default.conf 文件改成这样子
```
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        # root   /usr/share/nginx/html;
        root    /var/www;
        index  index.php index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php$ {
       root           /var/www;
       fastcgi_pass   php:9000;
       fastcgi_index  index.php;
       fastcgi_param  SCRIPT_FILENAME  /var/www$fastcgi_script_name;
       include        fastcgi_params;
    }

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

主要是删掉了 `location ~ \.php$` 部分的注释，
和修改了这三句，这三个的值要保持一致。
```
location / root 的路径
location ~ \.php$ root 的路径
location ~ \.php$ fastcgi_param SCRIPT_FILENAME
```
还有 fastcgi_pass 要改为 php 容器的 ip 或容器名

## dockerfile-php.yml
```bash
vi dockerfile-php.yml
```

```
FROM php:7.4-fpm-buster

RUN usermod -u 1000 www-data \
    && apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        openssl \
        libssl-dev \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql

RUN pecl install redis-4.0.0 \
    && pecl install mongodb-1.4.2 \
    && docker-php-ext-enable redis mongodb
EXPOSE 9000
CMD ["php-fpm"]
```

## docker-compose.yml
```bash
vi docker-compose.yml
```

```
version: '3'
services:
  php:
    build:
      context: .
      dockerfile: Dockerfile-php
    restart: always
    volumes:
      - ./www:/var/www
    environment:
      TZ: Asia/Shanghai

  nginx:
    image: nginx:1.19
    restart: always
    ports:
      - 80:80
    depends_on:
      - php
    volumes:
      - ./www:/var/www
      - ./config/nginx:/etc/nginx
    environment:
      TZ: Asia/Shanghai

  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      TZ: Asia/Shanghai

  phpmyadmin:
    image: phpmyadmin/phpmyadmin:5
    restart: always
    ports:
      - 8080:80
    depends_on:
      - mysql
    environment:
      PMA_HOST: mysql
      TZ: Asia/Shanghai

```

## 运行
第一次启动
```
docker-compose up -d
```
停止
```
docker-compose stop
```
停止后再次启动
```
docker-compose start
```
删除
```
docker-compose down
```
> 这些命令都是在 lnmp 目录下使用
