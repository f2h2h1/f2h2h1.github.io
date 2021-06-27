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

- 解压tar文件
```shell
tar -xf all.tar
```

- 解压tar文件到指定目录
```shell
tar -xf bbs.tar -C /zzz/bbs
```

- 通过文件名查找文件
```shell
find / -name httpd.conf
```

- 查找某个文件
```shell
find –name nginx.conf
```

- 查找某个文件夹
```shell
find / -name mysql -type d
```

- 创建test.c这个文件
```shell
touch test.c
```

- 新建一个文件夹
```shell
mkdir 文件夹名
```

- 更新yum仓库
```shell
yum -y update
```

- linux下重命名文件或文件夹的命令mv既可以重命名，又可以移动文件或文件夹.
```shell
例子：将目录A重命名为B
mv A B
例子：将/a目录移动到/b下，并重命名为c
mv /a /b/c
```

- 查找当前系统是否已经安装sshd
```shell
rpm -qa |grep ssh 
```

- linux 查看已安装软件
```shell
rpm -qa
```

- 处理木马程序可能要用到的命令
```shell
top
ps
lsof
```

- 查看由网络连接的进程
```shell
lsof -i
```

- 查看所有进程
```shell
ps -ef
```

- 使用-p查看指定进程ID已打开的内容
```shell
lsof -p 10075
```

- 安装某个 包/库/软件
```shell
yum –y httpd-devel
```

- 返回上一级目录
```shell
cd ..
```

- 将 /home/user1目录下的所有东西拷到/root/temp/下而不拷贝user1目录本身。
即格式为：cp -Rf 原路径/ 目的路径/
```shell
cp -Rf /home/user1/* /root/temp/
```

- 复制文件夹
```shell
cp -R data /root
```

- 立刻重启(root用户使用)
```shell
shutdown -r now
```

- 普通 curl
```shell
curl -i http://localhost
```

- post数据的 curl
```shell
curl -i -d a=asd 127.0.0.1
```

- 列出文件夹里的文件
```shell
ls
ll
```

- 关闭端口
```shell
iptables -A INPUT -p tcp --dport 111 -j DROP
```

- 打开端口
```shell
iptables -A INPUT -p tcp --dport 111 -j ACCEPT
```

- 删除文件
```shell
rm 文件名
```

- 删除文件夹，只能删除空文件夹
```shell
rm -d 文件夹名
```

- 删除文件夹下的全部内容，文件夹里每个文件都需要确认一次
```shell
rm -r 文件夹名
```

- 删除文件夹，不需要确认
```shell
rm –rf 文件夹名
```

- 安装openssh-sever服务器
```shell
yum install openssh-server
```

- 查看正在开放的端口
```shell
netstat -tanp
```

- 处理木马程序可能要用到的命令
```shell
top
ps
lsof
```

- 查看由网络连接的进程
```shell
lsof -i
```

- 使用-p查看指定进程ID已打开的内容
```shell
lsof -p 10075
```

- 解压tar.xz文件，先 xz -d xxx.tar.xz 将 xxx.tar.xz解压成 xxx.tar 然后，再用 tar xvf xxx.tar来解包
```shell
xz -d xxx.tar.xz
tar xvf xxx.tar
```

- 创建tar.xz文件，要先 tar cvf xxx.tar xxx/ 这样创建xxx.tar文件先，然后使用 xz -z xxx.tar 来将 xxx.tar压缩成为 xxx.tar.xz
```shell
tar cvf xxx.tar xxx/
xz -z xxx.tar
```

- linux查看权限
```shell
ls -l 文件名或目录名
```

- 如何理解 ls -l 的输出
```shell
 -rwxrwxrwx
第一位是 d 或 -
代表目录或文件
接着三位是所有者的权限
接着三位是同组用户的权限
接着三位是其它用户的权限
r 读 4
w 写 2
x 执行 1
- 无权限 0
```

- linux修改文件权限
```shell
chmod 数字 文件名
```

- 给修改目录下所有文件和子目录的权限
```shell
chmod -R 数字 目录名
例子
chmod -R 777 ci3
```

- linux 后台运行
```shell
nohup 命令 &
```

- 查看命令是否在运行
```shell
ps -ef | gerp 命令
```

- 停止进程， pid 通过 查看命令是否在运行 获取
```shell
kill pid
```

- linux 查看用户
```shell
cat /etc/passwd
用户名:密码:UID:GID:用户信息:HOME目录路径:用户shell
```

- linux 查看用户组
```shell
cat /etc/group
用户组名:组密码:GID:组内帐号（多个帐号用逗号分隔）
```

- mobaxterm ssh连接设置不超时
```
原因：服务器为了节省资源采取了一些措施，其中一条就是如果检测一个会话(session)几分钟或者几小时没有数据流入或者流出就会断开这个链接；
解决方案：设置SSH keepalive，settings->configuration->SSH->Sessions Settings->勾选SSH keepalive；
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

- 当php的curl遇到这种问题时
curl: (60) SSL certificate problem: unable to get local issuer certificate

1. 下载一个证书
php -r "readfile('https://raw.githubusercontent.com/bagder/ca-bundle/e9175fec5d0c4d42de24ed6d84a06d504d5e5a09/ca-bundle.crt');" > ca-bundle.crt

2. 把下载的证书复制到 php目录/extras/ssl 下

3. 修改 php.ini
curl.cainfo="php目录/extras/ssl/ca-bundle.crt"

- 如何替换 symfony 4.2 以下版本的 create_function
1. 全局搜索 create_function
2. 把 create_function 替换为匿名函数
```
例子

 // create_function('$cfgValue', 'return (int) $cfgValue === 0;'),
function ($cfgValue) {return (int) $cfgValue === 0;},
```

- 使用 composer 自动加载
1. 在 composer.json 里添加一项， Acme 是名命空间， src/ 是路径
```json
    "autoload": {
        "psr-4": {"Acme\\": "src/"}
    }
```
2. 在命令行里运行
```shell
composer dump-autoload
```
3. 也可在代码里添加名命空间，像这样
```php
$loader = require 'vendor/autoload.php';
$loader->add('Acme\\Test\\', __DIR__);
```
