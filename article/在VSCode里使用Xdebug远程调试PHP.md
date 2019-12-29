# 在 VSCode 里使用 Xdebug 远程调试 PHP

## 0.
1. 本地的 VSCode 需要安装好 PHP Extension Pack
2. 远程服务器的 PHP 需要正确安装好 Xdebug 拓展
3. 需要额外的一部服务器用作代理
4. 因为一般本地开发的电脑不会有公网 ip ，所以这里多加了一部服务器用作代理
5. 请求的流程
```plaintext
客户端->服务器->php->代理服务器->VSCode
```

## 1. 远程服务器的 PHP 安装 Xdebug 拓展
1. 在命令行里运行
```plaintext
php -i
```
2. 打开这个网址 https://xdebug.org/wizard.php 把第一步输出的结果复制进去，然后获得对应版本 Xdebug 的下载地址，当然如果你知道熟悉 PHP 的版本也可以直接选择相应的版本下载
3. 解压下载后的压缩包，把 Xdebug 的拓展复制进 PHP 的拓展目录里，PHP 的拓展目录一般是安装目录里的 ext 文件夹

## 2. 修改 php.ini
在 php.ini 的最后加上如下内容
```plaintext
[Xdebug]
; Xdebug 拓展路径
zend_extension=""
; 分析器输出路径
xdebug.profiler_output_dir=""
; 日志路径
xdebug.remote_log=""
; 跟踪输出路径
xdebug.trace_output_dir=""
; 是否开启远程调试
xdebug.remote_enable=on
; 是否开启分析器
xdebug.profiler_enable=on
; 允许调试的客户端IP
xdebug.remote_host=127.0.0.1
; 远程调试的端口
xdebug.remote_port=9002
; 开启远程调试自动启动
xdebug.remote_autostart=on
; 显示局部变量
xdebug.show_local_vars = on
; 显示默认的错误信息
xdebug.default_enable = on
; ide key
xdebug.idekey = "vscode"
```
请根据实际填写以下参数
```plaintext
; Xdebug 拓展路径
zend_extension=""
; 分析器输出路径
xdebug.profiler_output_dir=""
; 日志路径
xdebug.remote_log=""
; 跟踪输出路径
xdebug.trace_output_dir=""
; 允许调试的客户端 IP
xdebug.remote_host=127.0.0.1
; 远程调试的端口
xdebug.remote_port=9002
```
这里的 允许调试的客户端 IP 就是代理服务器的 IP，远程调试的端口 就是代理服务器的端口

## 3. 配置代理服务器
1. 下载 frp 到代理服务器里，这是使用的是 frp 0.29.0，https://github.com/fatedier/frp/releases
2. 新建一个 frps.ini 文件，并添加以下内容
````ini
[common]
bind_port = 7080
token = sl12321dfkjsldfjsld3
````

3. 启动 frp
````plaintext
frps -c frps.ini
````

## 4. 在本地开发的电脑配置 frp
1. 下载 frp

2. 新建一个 frpc.ini 文件，并添加以下内容
````ini
[common]
server_addr = 192.168.xxx.xxx
server_port = 7080
token = sl12321dfkjsldfjsld3
[xdebug]
type = tcp
local_ip = 0.0.0.0
local_port = 9098
remote_port = 9098
````
server_addr 填的是代理服务器的 ip ，server_port 需要和代理服务器的端口一致，服务器的 token 和本地的 token 需要一致

3. 启动 frp
````plaintext
frpc -c frpc.ini
````

## 5. 设置 VSCode
0. 安装 VSCode 的 PHP 拓展包，在 VSCode 的拓展里搜索 PHP Extension Pack 然后选择安装即可
1. 使用 VSCode 打开需要调试的 PHP 项目的目录
2. 添加一个调试配置，在环境选择的时候选 PHP
3. 在新建的配置里，添加两个值 localSourceRoot 和 serverSourceRoot ，localSourceRoot是本地代码路径， serverSourceRoot 是服务器代码的路径， Xdebug 需要路径一致才能击中断点，调试时 localSourceRoot 会映射为 serverSourceRoot。
4. 把 port 的值修改为 frpc.ini 的 local_port 一样的值
5. 完整的配置
````json
{
    "name": "Listen for remote XDebug",
    "type": "php",
    "request": "launch",
    "localSourceRoot": "D:\\phpStudy\\PHPTutorial\\WWW",
    "serverSourceRoot": "C:\\phpStudy\\PHPTutorial\\WWW",
    "port": 9098,
    "env": {
        "DBGP_IDEKEY":"vscode"
    }
}
````

## 注意
代理服务器的安全组和防火墙需要放行相应的端口，这里需要放行的端口是 7080 和 9098
## 参考
<a href="#title=在VSCode里调试PHP">在VSCode里调试PHP</a>