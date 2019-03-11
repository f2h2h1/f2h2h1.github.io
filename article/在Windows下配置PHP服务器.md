# 在Windows下配置PHP服务器

## 0. 目标
- 搭建一个 wamp 服务器
- Windows 10 (x64)
- apache 2.4
- MySQL 8
- php 7.3

## 1. 下载 php
```plaintext
http://php.net/downloads.php
```
这里要注意，选择 7.3 版本和 ts 版， ts 版 才有这个模块 php7apache2_4.dll

## 2. 下载并安装对应版本的 vc 库
php 7.3 的 vc 版本是 vc 15
```plaintext
https://www.microsoft.com/zh-cn/download/details.aspx?id=48145
```
这里要注意，选择简体中文和 64 位的版本

## 3. 配置 php
1. 解压下载下来的压缩包
2. 把解压后的文件夹重命名为 php
3. 把 php 文件夹复制到 C 盘的根目录下（这里可以是任意目录）
4. 把 php 文件夹的路径添加到环境变量
5. 进入 php 文件夹，把 php.ini-development 复制一份，并把复制那份文件重命名为 php.ini
6. 打开 php.ini，并开启以下拓展
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

## 4. 下载 Apache
```plaintext
https://www.apachelounge.com/download/
```
Apache 官方只提供源码，二进制文件都是第三方编译的，这里选择 Apache Lounge 提供的二进制文件

## 5. 配置 Apache
1. 把 Apache 添加进环境变量
2. 把 php 目录下的 php7apache2_4.dll 复制到 Apache 目录下的 modules
3. 打开 Apache 的配置文件 httpd.conf，往 httpd.conf 里添加 php 的模块，httpd.conf 这个文件在 Apache 安装目录的 conf 文件夹里

    ```plaintext
    LoadModule php7_module modules/php7apache2_4.dll

    AddHandler application/x-httpd-php .php
    PHPIniDir "C:/php"
    ```

这段配置，加在 httpd.conf 的 179 行左右，就是加载模块那部分的尾部

4. 打开 httpd.conf，将里面的 #ServerName localhost:80 注释去掉。

5. 在 httpd.conf 里找到这一段

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

6. 把 httpd.conf 里的 #Include conf/extra/httpd-vhosts.conf 注释去掉。
7. 打开 httpd-vhosts.conf，把里面的例子删掉
8. 在 httpd-vhosts.conf 里添加一个站点
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

9. 启动 Apache，在命令行里运行
```plaintext
httpd
```
10. 以服务的应式运行 Apache，先注册服务，然后再启动服务。停止 Apache 的时候就停止服务，卸载 Apache 的时候需要先移除服务。
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
注意，在调用 httpd 注册 Apache 的服务时，弹出这句话
```
Errors reported here must be corrected before the service can be started
```
并不是error，而是提示：如果这行下边出现错误则解决错误后再启动！

## 6. 下载 MySQL
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

## 7. 配置 MySQL
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
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8
```
- my.ini 的编码必须为 utf-8 无 bom，换行符使用 \n
- 遇到错误时，可以去查看 data 文件夹里，err后缀的文件
5. 注册服务，在管理员模式的命令行下 cd 进 C:/mysql/bin 目录，以次运行以下命令，虽然已经添加进环境变量，但然要在目录下运行
```plaintext
mysqld --initialize --console
mysqld install
net start mysql
```
注意，执行完 mysqld --initialize --console 之后，会自动生成一个密码，这个密码需要记下来，这个是命令行登录的密码
6. 添加密码，以次运行以下命令
```
mysql -uroot -p
use mysql;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码';
```
7. MySQL 的 ZIP 版本配置起来很麻烦，会出现很容易出现各种奇怪的错误，如果可以尽量使用安装版

## 8. phpmyadmin
1. 下载 phpmyadmin
```
https://www.phpmyadmin.net/
```
下载完后，解压到网站根目录，并把文件夹重命名为 phpmyadmin

2. 打开这两个文件 phpmyadmin/libraries/config.default.php phpmyadmin/config.sample.inc.php ，设置这两个文件里的这个值
```
$cfg['blowfish_secret'] = ''
```
这个值的长度要大于 64

## 9. composer
1. 下载安装脚本
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
```

3. 安装
```
php composer-setup.php
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
@php "%~dp0composer.phar" %*
```
