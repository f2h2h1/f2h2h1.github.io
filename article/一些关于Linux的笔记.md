# 一些关于 Linux 的笔记

- 查看守护进程
````shell
ps -x
````

- 查看linux的80端口是否关闭
````shell
netstat -an | grep :80
````

- 将文件mirror重命名为php-7.1.0.tar.gz
````shell
mv mirror php-7.1.0.tar.gz
````

- linux下查找nginx里的nginx.conf文件地址方法
````shell
nginx -t
````

- 下载文件
````shell
wget http://cn2.php.net/get/php-7.1.0.tar.gz/from/this/mirror
````

- 显示当前路径
````shell
pwd
````

- 查看 ip
````shell
ip addr
ifconfig
````

- 查看系统负载
````shell
top
vmstat
w
uptime
````

- 查看磁盘负载
````shell
iostat
````

- 查看 linux 版本
````shell
uname -a
````

- 查看 centos 版本
````shell
cat /etc/redhat-release
````

- 把 mynginx 目录下的文件打包
````shell
tar -cf mynginx4.tar mynginx/*
````

- 将多个文件打包成一个tar
````shell
tar -cf d.tar a b c
````

- 解压tar文件
````shell
tar -xf all.tar
````

- 解压tar文件到指定目录
````shell
tar -xf bbs.tar -C /zzz/bbs
````

- 通过文件名查找文件
````shell
find / -name httpd.conf
````

- 查找某个文件
````shell
find –name nginx.conf
````

- 查找某个文件夹
````shell
find / -name mysql -type d
````

- 创建test.c这个文件
````shell
touch test.c
````

- 新建一个文件夹
````shell
mkdir 文件夹名
````

- 更新yum仓库
````shell
yum -y update
````

- linux下重命名文件或文件夹的命令mv既可以重命名，又可以移动文件或文件夹.
````shell
例子：将目录A重命名为B
mv A B
例子：将/a目录移动到/b下，并重命名为c
mv /a /b/c
````

- 查找当前系统是否已经安装sshd
````shell
rpm -qa |grep ssh 
````

- linux 查看已安装软件
````shell
rpm -qa
````

- 处理木马程序可能要用到的命令
````shell
top
ps
lsof
````

- 查看由网络连接的进程
````shell
lsof -i
````

- 查看所有进程
````shell
ps -ef
````

- 使用-p查看指定进程ID已打开的内容
````shell
lsof -p 10075
````

- 安装某个 包/库/软件
````shell
yum –y httpd-devel
````

- 返回上一级目录
````shell
cd ..
````

- 将 /home/user1目录下的所有东西拷到/root/temp/下而不拷贝user1目录本身。
即格式为：cp -Rf 原路径/ 目的路径/
````shell
cp -Rf /home/user1/* /root/temp/
````

- 复制文件夹
````shell
cp -R data /root
````

- 立刻重启(root用户使用)
````shell
shutdown -r now
````

- 普通 curl
````shell
curl -i http://localhost
````

- post数据的 curl
````shell
curl -i -d a=asd 127.0.0.1
````

- 列出文件夹里的文件
````shell
ls
ll
````

- 关闭端口
````shell
iptables -A INPUT -p tcp --dport 111 -j DROP
````

- 打开端口
````shell
iptables -A INPUT -p tcp --dport 111 -j ACCEPT
````

- 删除文件
````shell
rm 文件名
````

- 删除文件夹，只能删除空文件夹
````shell
rm -d 文件夹名
````

- 删除文件夹下的全部内容，文件夹里每个文件都需要确认一次
````shell
rm -r 文件夹名
````

- 删除文件夹，不需要确认
````shell
rm –rf 文件夹名
````

- 安装openssh-sever服务器
````shell
yum install openssh-server
````

- 查看正在开放的端口
````shell
netstat -tanp
````

- 处理木马程序可能要用到的命令
````shell
top
ps
lsof
````

- 查看由网络连接的进程
````shell
lsof -i
````

- 使用-p查看指定进程ID已打开的内容
````shell
lsof -p 10075
````

- 解压tar.xz文件，先 xz -d xxx.tar.xz 将 xxx.tar.xz解压成 xxx.tar 然后，再用 tar xvf xxx.tar来解包
````shell
xz -d xxx.tar.xz
tar xvf xxx.tar
````

- 创建tar.xz文件，要先 tar cvf xxx.tar xxx/ 这样创建xxx.tar文件先，然后使用 xz -z xxx.tar 来将 xxx.tar压缩成为 xxx.tar.xz
````shell
tar cvf xxx.tar xxx/
xz -z xxx.tar
````

- linux查看权限
````shell
ls -l 文件名或目录名
````

- 如何理阶 ls -l 的输出
````shell
 -rwxrwxrwx
第一位是 d 或 -
代表目录或文件
接着三位是所有者的权限
接着三位是同组用户的权限
接着三位是其它用户的权限
r 读 4
w 写 2
x 执行 1
 -无权限 0
````

- linux修改文件权限
````shell
chmod 数字 文件名
````

- 给修改目录下所有文件和子目录的权限
````shell
chmod -R 数字 目录名
例子
chmod -R 777 ci3
````

- linux 后台运行
````shell
nohup 命令 &
````

- 查看命令是否在运行
````shell
ps -ef | gerp 命令
````

- 停止进程， pid 通过 查看命令是否在运行 获取
````shell
kill pid
````

- linux 查看用户
````shell
cat /etc/passwd
用户名:密码:UID:GID:用户信息:HOME目录路径:用户shell
````

- linux 查看用户组
````shell
cat /etc/group
用户组名:组密码:GID:组内帐号（多个帐号用逗号分隔）
````

- mobaxterm ssh连接设置不超时
````
原因：服务器为了节省资源采取了一些措施，其中一条就是如果检测一个会话(session)几分钟或者几小时没有数据流入或者流出就会断开这个链接；
解决方案：设置SSH keepalive，settings->configuration->SSH->Sessions Settings->勾选SSH keepalive；
````

## php 相关

- 安装php-fpm
````shell
yum –y install php-fpm
````

- 测试 php-fpm 是否安装成功
````shell
php-fpm -t
````

- 查看 php 配置文件的目录
````shell
php -ini
````

- 启动 php 进程服务
````shell
service php-fpm start
````

- 查看 php 进程服务是否启动成功
````shell
ps -aux|grep php
````

- 查看 php 安装路径
````shell
whereis php
````

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
````
例子

 // create_function('$cfgValue', 'return (int) $cfgValue === 0;'),
function ($cfgValue) {return (int) $cfgValue === 0;},
````

- 使用 composer 自动加载
1. 在 composer.json 里添加一项， Acme 是名命空间， src/ 是路径
````json
    "autoload": {
        "psr-4": {"Acme\\": "src/"}
    }
````
2. 在命令行里运行
````shell
composer dump-autoload
````
3. 也可在代码里添加名命空间，像这样
````php
$loader = require 'vendor/autoload.php';
$loader->add('Acme\\Test\\', __DIR__);
````


## git 相关

- 在当前目录创建 git 仓库
````
git init
````

- 把文件添加到暂存区
````
git add 文件名
````

- 把暂存区的内容提交到当前分支
````
git commit -m "这是注释"
````

- 克隆远程仓库
````
git clone 远程仓库地址
````

- 克隆到指定的目录
````
git clone 远程仓库地址 目录
````

- 把远程仓库的修改更新到本地
````
git pull
````

- 把本地修改推送到远程仓库，master 是远程分支名，这里可以替换成其它分支名
````
git push origin master
````

- 新建 git 分支
````
git branch 分支名
````

- 切换到分支
````
git checkout 分支名
````

- 查看本地分支
````
git branch
````

- 查看所有分支
````
git branch -a
````

- 运行git命令时，遇到end符号且不能退出时，可以尝试按下键盘的q键
- git 在 merge（合并）或 pull（拉取） 之前要提交所有修改

- git 删除本地分支
````
git branch -D 分支名
````

- 合并本地分支，把 某个分支 合并到当前分支
````
git merge 分支名
````

- 合并远程分支，把 某个分支 合并到当前分支
````
git merge 远程仓库名/分支名
````

- 查看git日志
````
git log
````

- 新增远程仓库
````
git remote add 远程仓库名 远程仓库地址
例子
git remote add test3 ssh://username@127.0.0.1//alidata/www/.git
````

- 推送到不是 origin 的远程仓库
````
git push 远程仓库名
````

- 拉取不是 origin 的远程仓库
````
git pull 远程仓库名
````

- 查看远程仓库信息
````
git remote -v
````

- 远程仓重命名
````
git remote rename 旧名字 新名字
````

- 删除远程藏
````
git remote rm 仓库名
````

- 显示工作目录和暂存区的状态。使用此命令能看到那些修改被暂存到了, 哪些没有, 哪些文件没有被Git tracked到。
````
git status
````

- vscode git 的使用
````
更改->暂存的更改（add）->提交（commit）（提交暂存文件）->推送（push）
````

- git fetch 和 git pull 的区别
````
1. git fetch：相当于是从远程获取最新版本到本地，不会自动合并。
$ git fetch origin master
$ git log -p master..origin/master
$ git merge origin/master
以上命令的含义：
首先从远程的origin的master主分支下载最新的版本到origin/master分支上然后比较本地的master分支和origin/master分支的差别最后进行合并
上述过程其实可以用以下更清晰的方式来进行：
$ git fetch origin master:tmp
$ git diff tmp 
$ git merge tmp

2. git pull：相当于是从远程获取最新版本并merge到本地 
git pull origin master
上述命令其实相当于git fetch 和 git merge在实际使用中，git fetch更安全一些，
因为在merge前，我们可以查看更新情况，然后再决定是否合并。
````