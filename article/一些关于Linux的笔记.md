# 一些关于 Linux 的笔记

- 查看守护进程
```shell
ps -x
```

- 查看linux的80端口是否关闭
```shell
netstat -an | grep :80
```

- 将文件mirror重命名为php-7.1.0.tar.gz
```shell
mv mirror php-7.1.0.tar.gz
```

- linux下查找nginx里的nginx.conf文件地址方法
```shell
nginx -t
```

- 下载文件
```shell
wget http://cn2.php.net/get/php-7.1.0.tar.gz/from/this/mirror
```

- 显示当前路径
```shell
pwd
```

- 查看 ip
```shell
ip addr
ifconfig
```

- 查看系统负载
```shell
top
vmstat
w
uptime
```

- 查看磁盘负载
```shell
iostat
```

- 查看 linux 版本
```shell
uname -a
```

- 查看 centos 版本
```shell
cat /etc/redhat-release
```

- 把 mynginx 目录下的文件打包
```shell
tar -cf mynginx4.tar mynginx/*
```

- 将多个文件打包成一个tar
```shell
tar -cf d.tar a b c
```

## php 相关

- 安装php-fpm
```shell
yum –y install php-fpm
```

- 测试 php-fpm 是否安装成功
```shell
php-fpm -t
```

- 查看 php 配置文件的目录
```shell
php -ini
```

- 启动 php 进程服务
```shell
service php-fpm start
```

- 查看 php 进程服务是否启动成功
```shell
ps -aux|grep php
```

- 查看 php 安装路径
```shell
whereis php
```