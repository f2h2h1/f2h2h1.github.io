# telnet的不完整总结

## telnet 的简介

Telnet
(Telecommunication Network)
电信网络

telnet 是最早的互联网协议之一，
telnet ftp 的出现甚至早于 tcp/ip 。
telnet ftp email 最早都出现在 ARPANET ，
telnet ftp 差不多同时出现，
从维基百科的词条来看 telnet 比 ftp 稍微早一点出现

ARPANET
- Advanced Research Projects Agency Network
- 高级 研究 计划 局 网络
- 高级研究计划局网络
- 阿帕网
- ARPANET 就是现在互联网的雏形

主要互联网协议和应用出现的时间顺序
- ARPANET 1969
- telnet 1969
- ftp 1971
- email 1971
- mailing list 1975
- usenet（新闻组） 1980
- telnet bbs 1990
- www 1990
- ssh
- tls
- socket5

telnet 主要用于管理远程服务器和bbs。
通常 telnet 连接成功后启动的是 login 程序。
bbs很早就出现了，但早期的bbs并不使用 internet ，使用 telnet 的 bbs 要到 1990 才出现。
早期的bbs一般叫做 拨号式bbs，拨号式bbs 使用的是 FidoNet。


- telnet 相关的 rfc
| RFC 编号 | 标题 | 内容摘要 |
|----------|------|----------|
| RFC 97   | First Cut at a Proposed Telnet Protocol | 提出了一个初步的 Telnet 协议草案，旨在通过网络虚拟终端（NVT）实现远程终端访问。 |
| RFC 137  | Telnet Protocol - a proposed document | 提出了 Telnet 协议的详细规范，定义了用户站点和服务站点之间的交互方式。 |
| RFC 153  | SRI ARC-NIC status | 描述了 SRI ARC-NIC 的状态和功能，主要涉及网络信息中心的操作。 |
| RFC 318  | Telnet Protocols | 详细说明了 Telnet 协议，包括网络虚拟终端和控制信号的定义。 |
| RFC 854  | Telnet Protocol Specification | 规范了 Telnet 协议，提供了双向、八位字节的通信设施，主要用于终端设备和进程之间的接口。 |
| RFC 855  | Telnet Option Specifications | 详细说明了 Telnet 协议中的选项机制，允许主机之间进行更复杂的通信。 |
| RFC 856  | Telnet Binary Transmission | 定义了 Telnet 二进制传输选项，允许在 Telnet 模块之间进行二进制数据传输。 |
| RFC 857  | Telnet Echo Option | 定义了 Telnet 回显选项，允许远程回显由另一个 Telnet 模块处理。 |
| RFC 859  | Telnet Status Option | 定义了 Telnet 状态选项，允许用户或进程验证 Telnet 选项的当前状态。 |
| RFC 860  | Telnet Timing Mark Option | 提供了一种检查两个 Telnet 模块之间往返路径的方法。 |
| RFC 861  | Telnet Extended Options - List Option | 介绍了 Telnet 扩展选项列表，允许查询和设置多个选项。 |
| RFC 2217 | Telnet Com Port Control Option | 定义了通过 Telnet 控制串行端口的选项，允许远程管理串行设备。 |

## telnet 的使用

### 客户端

客户端的连接命令
```
telnet 地址
telnet 地址 端口
telnets 地址
telnets 地址 端口
```

默认端口
- telnet 23
- telnets 992

现在还活跃的 telnet 服务
https://www.telnet.org/htm/places.htm

https://www.telnet.org/ 这个网址里有对 telnet 详细的描述

### 服务端

#### 使用 inetd
#### 使用单独的进程

<!--


这是安装服务端
apt install -y telnetd
安装完后
通过 find 找到
find / -name telnetd
通过 man 查看文档
man telnetd

这是安装客户端
apt install -y telnet

还有一个这样的程序？这个才是 telnetd 的主程序？
/usr/sbin/in.telnetd

还有一个这样的程序？这个程序是跟随 inetd 安装的
/usr/sbin/tcpd
在 inetd 默认的配置中 telnetd 是通过这个程序启动的

还有一个这样的程序？这个就是默认情况下，在telnetd里连接成功后的登录程序，这个程序是跟随 telnetd 安装的
/usr/lib/telnetlogin

从文档来看
安装完 telnetd 和 inetd 后
只要改好配置文件 /etc/inetd.conf
    大概就是把配置写成这个样子
    telnet          stream  tcp     nowait  telnetd /usr/sbin/tcpd  /usr/sbin/in.telnetd
重启 inetd 
就可以成功开启 telnetd 服务了

-->

## telnet 的原理

<!--

https://github.com/mirror/busybox/blob/master/networking/telnet.c
https://github.com/mirror/busybox/blob/master/networking/telnetd.c

https://docs.python.org/zh-cn/3/library/telnetlib.html
https://github.com/python/cpython/tree/3.12/Lib/telnetlib.py
    这个文件似乎能直接左右 telnet 客户端使用
    python telnetlib.py [-d] ... [host [port]]
https://www.cnblogs.com/mrlayfolk/p/15154813.html

https://github.com/search?q=telnet+language%3AC&type=repositories&l=PHP&s=stars&o=desc
https://github.com/fijiwebdesign/php-telnet
https://github.com/diotteo/TelnetClient.php

python已经放弃了 telnet
https://peps.python.org/pep-0594/#telnetlib
cgi smtpd 也都被抛弃了。。。

https://packages.debian.org/search?keywords=telnet
https://www.gnu.org/software/inetutils

-->

## 其他远程管理工具

telnet 是最古老的，然后是 rlogin ， 然后是 ssh

### rlogin

rexec/rlogin/rsh 都属于 rsh-server 包，又或者叫做 Berkeley r-commands

包含了这几个命令
- rlogin
    - rlogin 类似于 telnet ，但因为是专用于远程shell的协议，所以实现起来比 telnet 更简单，连接速度也会稍微快一点，但也是只支持交互式的shell
- rexec
    - rexec 和 rlogin 差不多但只支持非交互式shell，就是一次只能执行一行命令
- rsh
    - 既支持交互式 shell 也支持非交互式 shell ，可以简单地看作 rlogin + rexec
    - rsh 和现代的 ssh 很类似了，只是少了加密的功能
- rcp
- rstat 从内核返回性能统计信息。
- ruptime 显示自上次重新启动以来 Unix 系统运行了多长时间
- rwho 列出登录到本地网络上所有多用户 Unix 系统的用户

在 gnu 的 inetutils 包里也有包含 rlogin 命令

### ssh

### 其它

- r rcmd rscript rtrem
    - 这几个是 dos 或 windows 的
- RFB 和 RDP 都是用于图形界面的
    - RFB 就是 vnc 使用的协议
    - RDP 就是 windows 远程桌面使用的协议
- 无论是哪一种，本质上都是建立连接然后传输数据，传输控制数据和图像数据

## 如何实现一个 telnet
### 服务端
### 客户端

<!--

c 如何实现一个交互式的命令行？
php 如何实现一个交互式的命令行？
python 如何实现一个交互式的命令行？

个人感觉 python 的 api 不稳定，总是有变动，
c 不能方便地跨平台编译而且处理字符串也很麻烦，
php 的多进程不好用，


没想到在 busybox 里也有有一个 telnet 和 telnetd
虽然windows版里没有，
但登录后只能启动shell，目测 telnetd 默认启动的是 /bin/login
指定了 -l 参数，就可以启动其它程序，但似乎这个又不需要登录了
如果 -l 的程序退出了，连接也会跟着关闭

所以这两条命令效果是一样的
telnetd
telnetd -l /bin/login


猜测 ssh telnet 等登录方式都是调用 /bin/login



telnet telehack.com
直接用浏览器打开也可以


telnet 似乎也可以作为 ftp 的客户端？
https://blog.csdn.net/nowhere_/article/details/44877439




-->