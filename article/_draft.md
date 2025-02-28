# draft

````plaintext

如何实现一个web服务器
    拓扑结构
        星型
        环型
        总线
            以太网
        ...
    模型
        七层模型 (由 OSI 提出的)
            应用层 Application
            表示层 Presentation
                负责转化数据格式，并处理数据加密和数据压缩。
                其实 tls 这这种协议可以归类到这一层里
            会话层 Session
                主要是用来管理网络设备的会话连接，建立会话，保持会话，断开会话
            传输层 Transport
            网际层 Internet/Network
            数据链路层 Link/Data link/Network interface
            物理层 Hardware/Physical
        四层模型 ip/tcp
            应用层
            传输层
            网际层
            网络接口层
        五层模型
            应用层 -> data (数据)
            传输层 ->
                TCP -> segment (段)
                UDP -> datagram (数据报文)
            网际层 -> packet (包)
            数据链路层 -> frame (帧)
            物理层 -> bit (比特)
        各层常用的协议
            应用层
                http
                    0.9 1.0 1.1 2 3
                mqtt
                telnet
                    rfc 97 137 153 318
                        854 855 856 857 859 860 861
                        2217
                ftp
                dns
                nntp
                    网络新闻传输协议（Network News Transfer Protocol）
                    USENET 和 NNTP 的关系，大概就是 网站 和 http 的关系差不多
                irc
                xmpp
                ntp (Network Time Protocol) 网络时间协议
                PTP (Precision Time Protocol) 精确时间协议
                dhcp
                smtp
                pop3
                imap
                echo
                discard
                daytime
                chargen
                time
            传输层
                tcp
                    建立连接 三次握手
                        客户端 -> 服务端 syn
                        服务端 -> 客户端 syn+ack
                        客户端 -> 服务端 ack
                        为什么是三次握手？
                        如果是两次握手会有什么问题？
                    断开连接 四次挥手
                        主动关闭 -> 被动关闭 fin
                        被动关闭 -> 主动关闭 ack
                        被动关闭 -> 主动关闭 fin
                        主动关闭 -> 被动关闭 ack
                        主动关闭的那一边，在发送 ack 后还会等待 2msl 才会进入 closed 状态
                        被动关闭的那一边，在收到 ack 后就会立即进入 closed 状态
                        多数情况下都是客户端主动关闭的
                        为什么是四次握手？
                        如果少于四次握手会有什么问题？
                        为什么发送 ack 后还要等待 2msl 才会进入 closed 状态？
                    状态
                        LISTEN SYN-SENT SYN-RECEIVED
                        ESTABLISHED
                        FIN-WAIT-1 FIN-WAIT-2 CLOSE-WAIT LAST-ACK TIME-WAIT CLOSED
                    标志符
                        syn ack fin rst
                        发送 rest ，会立即释放连接，会丢弃发送缓冲区和接收缓冲区的数据，不需要等待对方ack确认
                    流量控制
                        滑动窗口
                    拥堵控制
                        慢启动 与 拥塞避免
                            TCP 慢启动 / 14KB 规则 ？
                        快重传 与 快恢复
                    三个半事件
                        连接建立
                        连接断开
                        消息到达
                        消息发送完毕（这是半个事件）
                    沾包
                        根本原因
                        什么情况下会发生
                        解决方式
                        为什么udp没有沾包
                    tcp的异常中断
                        程序崩溃
                            操作系统会代为发送四次挥手
                        主机宕机
                            没有重启
                                发送端在发送数据等待ack超时后，会强制关闭连接
                            有重启
                                接收端回复 rest 报文，然后重新建立连接
                        还要考虑 KeepAlive ？
                            可以参考主机宕机的情况
                            如果发送端一直没有发送数据，且没有keepalive，且应用层没有心跳，那么发送端的连接会一直保持，会浪费一点内存
                            其实只要重启的速度足够快，且 连接的socket 重新载入内存里，那么另一侧是不会感受到连接中断过的
                        如果客户端的ip有变化，例如 手机网络经过切换
                            那么，服务端会返回一个 rest ，然后重新建立连接
                        如果客户端访问服务端没有开放的端口
                            服务端可能会丢弃客户端的请求，然后客户端等待超时后自己关闭连接
                            服务端也可能直接返回 rest 包
                            这种请求也有可能被前面的防火墙挡下来了，根本到不了监听端口的服务端程序
                udp
                    udp 协议是无连接的，不需要握手建立连接，数据发送后，服务器端不会返回确认信息
                    udp 的数据包发出去就不管的了，没有握手，挥手，ack
                    也可以在应用层里实现 tcp 的那套可靠传输机制
                icmp
            网际层
                ip v4 v6
                    五元组: 源地址 源端口 目标地址 目标端口 传输层协议
                ARP
                    ARP inARP GARP RARP
                IPsec
            数据链路层
                以太网 (Ethernet)
                    以太网帧又分为 Ethernet II 和 IEEE 802.3
                    关注 Ethernet II 就可以了
                        帧间隙 来区分不同的 帧
        各层对应的硬件
            网关 (gateway)
            路由器 (route)
            交换器/交换机 (switch)
            桥接器/网桥 (network bridge)
            集线器 (ethernet hub 又或者 简称 hub)
            中继器 (repeater)
            调制解调器 (modem modulator-demodulator 调制器-解调器)
            和安全相关的硬件
                IPS (Intrusion Prevention System) 入侵检测（旁路部署）
                IDS (Intrusion Detection System) 入侵防御（串行部署）
                FW (FireWall) 防火墙
                WAF (Web Application FireWall) 网页应用防火墙
                UTM (Unified Threat Management) 统一威胁管理
        按照规模划分的网络类型
            pan
            lan
                vlan
                wlan
            can
            man
            wan
            更多
                ban
                san
                han
                ran
                Backbone
                ipx
            从两个计算机直连到广域网
    载波侦听多路访问
        Carrier Sense Multiple Access CSMA
        载波侦听多路访问／碰撞检测（CSMA/CD）
            CSMA with Collision Detection
        载波侦听多路访问／碰撞避免（CSMA/CA）
            CSMA with Collision Avoidance
    路由表和路由算法
        静态路由
        动态路由
            迪达拉算法
            距离向量路由协议（Distance Vector Routing Protocol）：
                RIP（Routing Information Protocol）和IGRP（Interior Gateway Routing Protocol），它们使用跳数作为衡量指标。
            链路状态路由协议（Link State Routing Protocol）：
                OSPF（Open Shortest Path First）和IS-IS（Intermediate System to Intermediate System），它们通过交换链路状态信息来构建网络拓扑图。
    tcp 和 udp
    什么是socket
    从socket里读写内容
        一些限制
            输入输出只考虑 asni ，多字节编码不好处理，这里只关注网络连接
            一次通讯数据包最大的长度为 255 ，因为分包操作也挺麻烦的
        基本套路
            建立连接
                socket
                setsockopt
                服务端
                    bind
                    listen
                    accept
                客户端
                    connect
            发送和接收数据
                read / write -> 通用的文件描述符操作函数
                recv / send -> TCP
                recvfrom / sendto -> UDP
            关闭连接
                shutdown -> 一般只用于socket
                    可以选择关闭读 关闭写 关闭读写，调用后 socket 就会关闭
                close -> 通用的文件描述符操作函数
                    调用后无法读写，但 socket 未必会关闭，
                    调用后 socket 的引用计数会减1，只有当 socket 的引用计数为0时才会关闭连接
                比较保险的方式是先调用 shutdown 再调用 close
            io复用
                select poll epoll
        只输出一个 helloworld
        能接收多次连接的 helloworld
        能同时接收多个连接的 helloworld
        实现最简单的五个协议
            echo (RFC 862) 7 回显服务，把收到的数据发回客户端
            discard (RFC 863) 9 丢弃所有收到的数据
            chargen (RFC 864) 19 服务端 accept 连接之后，不停地发送测试数据
            daytime (RFC 867) 13 务端 accept 连接之后，以字符串形式发送当前时间，然后主动断开连接
            time (RFC 868) 87 服务端 accept 连接之后，以二进制形式发送当前时间的32位时间戳，然后主动断开连接
            只考虑 tcp 的
            用 netcat 作为客户端
        然后是基于 telnet 的 echo
        然后是基于 telnet 的聊天室
        nc telnet http proxy
    http 服务器
        http 协议
            0.9 1.0 1.1 2 3
            请求码 和 响应码
            mime
            缓存
        基本套路
            建立连接
            接收数据
            解释请求
                请求行
                请求头
                请求体
            处理数据
            构造响应
                响应行
                响应头
                响应体
            输出响应
            根据实际情况决定 关闭连接 或 保持连接
        进程模型
            单进程单线程
            单进程多线程
            多进程单线程
            多进程多线程
            io 多路复用
                select
                poll
                epoll
                    水平触发 (level trigger, LT)
                    边缘触发 (edge trigger, ET)
        具体类型
            静态
            动态
                cgi
                fastcgi
            代理
                socket 双写
                位置
                    反向代理
                    正向代理
                类型
                    http代理
                        RFC 2616 7230 7231 7235
                    sockt代理
                        RFC 1928 SOCKS5
                    pac
                        https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Proxy_servers_and_tunneling
            websocket
                WebSocket Secure (wss)
            相关的rfc
                https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Resources_and_specifications
            认证 和 授权
            流量控制
        TLS
            1.2
            1.3
    其它
        带宽 和 宽带 和 位宽 的联系与区别
        代理 网关 隧道 的区别，还有 VPN 和 端口转发
            代理 proxy
                「代为处理」
                代理的类型和作用域
                在各种系统上的代理设置
                    windows
                    linux
                    安卓
                正向代理/转发代理 forward proxy
                反向代理 reverse proxy
            网关 gateway
                「网络关口」「网络海关」
            隧道 tunnel
            端口转发 port forwarding
            虚拟专用网 (Virtual Private Network , VPN)
            虚拟私有云 (Virtual Private Cloud , VPC)
            透明 transparent

以开发软件为目标的计算机入门简明指南
    计算机入门的前置知识
        如果只做业务相关，需要 初等数学 外加一点 数理逻辑
        如果涉及数据库的，还需要一点 集合论
        如果涉及到一些高深的算法，可能还需要 图论 和 组合数学 和 最优化
        如果涉及数据分析，还需要 概率论 和 数理统计
        如果涉及计算机图形，还需要 线性代数
        英语至少要有初中的水平 (要学会使用各类翻译服务 谷歌翻译 百度翻译 必应翻译 ...)
            具体一点就是
                多邻国英语测试（DET） 55 分 或
                国家英语等级考试（NETS） 三级 或
                雅思（LETLS） 3.5 分 或
                欧洲语言共同参考框架（CEFR） A2
            在没有翻译的帮助下达到 A2 的水平，加上翻译达到 B1 的水平（所以熟练地使用各类翻译工具也是一种重要的能力）
            专为程序员编写的英语学习指南
                https://github.com/yujiangshui/A-Programmers-Guide-to-English
                https://a-programmers-guide-to-english.harryyu.me/
        抽象是一个重要的概念，封装是一个重要的概念，递归是一个重要的概念
    计算机学科的相关概念
        计算理论（Theory of computation）
        计算理论的三个主要问题
            采用什么计算模型（即形式语言、自动机）
            解决哪些是可计算的、哪些是不可计算的（即可计算性理论及演算法）
            要用多少时间、要用多少存储（即计算复杂性理论）
        计算模型（model of computation）
            顺序模型（Sequential models）
                图灵机（Turing machine）
                寄存器机（Register machine）
                    随机存取机（英语：Random-access machine，缩写为RAM）
                    随机存取储存程式机（英语：Random-access stored-program machine，缩写为RASP）
            函数式模型（Functional models）
                λ演算（Lambda calculus）
                递归函数（recursive function）
                抽象重写系统（Abstract rewriting system，缩写为ARS）
                    马尔可夫算法（markov algorithm）
            同步模型（Concurrent models）
                元细胞自动机（Cellular automaton，缩写为CA）
                    生命游戏（Game of Life）
        抽象机器（Abstract machine） -> 自动机（Automata） -> 图灵机（Turing machine，缩写为TM）
            半自动机(Semiautomaton)的三元组
                状态集 字母表 转移函数
            自动机的五元组
                状态集 字母表 转移函数 初始状态 最终状态
                初始状态 和 最终状态 都包含在 状态集 里
            图灵机的七元组
                Hopcroft 和 Ullman 对图灵机的定义
                    状态集 字母表 转移函数 初始状态 最终状态(接受状态) 空白符号 磁带字母符号
                另外一种定义？
                    状态集 字母表 转移函数 初始状态 接受状态 拒绝状态 磁带字母符号
        图灵机
            组成
                tape 纸带（TAPE）
                head 读写头（HEAD）
                state register 状态寄存器（REGISTER）
                finite table of instructions 有限的指令表（TABLE）
        通用图灵机（Universal Turing Machine，又称UTM或Machine U）
        图灵完全/图灵完备（Turing complete）
        图灵等价/图灵等效（Turing equivalent）
        自动机理论 和 编译原理 和 语言学 似乎都有联系，而且这个联系似乎还挺紧密的
        计算模型 -> 计算机系统架构 -> 指令集 -> 微架构
        寄存器机 -> 冯诺依曼架构 -> x86指令集 -> Zen4
        冯诺依曼结构
            以运算单元为中心
            数据和指令都以二进制编码
            数据和指令不加区别混合存储在同一个存储器中
            指令由操作码和地址码组成
            顺序执行程序的每一条指令
            由五个部件构成
                运算器 控制器 存储器 输入设备 输出设备
            为什么顺序执行也可以算作冯诺依曼结构特点之一？
        计算问题（Computational problem）
            在理论计算机科学中，计算问题是可以通过算法解决的问题。
            分类
                决策问题
                搜索问题
                计数问题
                优化问题
                功能问题
                承诺问题
                    承诺问题 是 决策问题 的推广
        可计算性（Computability）
            可计算性理论的一个目标是确定在每个计算模型中可以解决哪些问题或问题类别。
                除了 可计算问题，不可计算问题，还有一种 近似可计算问题
            可判定性（Entscheidungsproblem）
            停机问题（halting problem）
                停机问题就是判断任意一个程序是否能在有限的时间之内结束运行的问题。
                该问题等价于如下的判定问题：是否存在一个程序P，对于任意输入的程序w，能够判断w会在有限时间内结束或者死循环。
                艾伦·图灵在1936年用对角论证法证明了，不存在解决停机问题的通用算法。这个证明的关键在于对计算机和程序的数学定义
                停机问题在图灵机上是不可判定问题
                停机问题包含了自我指涉，本质是一阶逻辑的不完备性，类似的命题有理发师悖论、全能悖论等。
        计算复杂性理论（Computational complexity theory）
            复杂度
                时间
                    确定性
                    非确定性
                空间
                    确定性
                    非确定性
                最好，最坏，平均
            复杂度类
                NP问题
                    N non-deterministic 非确定性的
                    P polynomial 多项式的
    计算机的发展历史
        早期工具
            算盘
            计算尺
        模拟计算机
            机械式
            电动式
        机电计算机
            继电器
        电子计算机
            真空管
            晶体管
            集成电路
            超大规模集成电路
    逻辑门的底层
    从与或非逻辑门到指令集和汇编语言的抽象
    计算机的组成
        抽象的计算机组成
            输入设备
            输出设备
            控制器
            运算器
            存储器
        具体的计算机组成
            主板
            电源
            cpu - 控制器 运算器
            内存 - 存储器
            硬盘 - 存储器
            显卡 - 运算器
            键盘 - 输入设备
            鼠标 - 输入设备
            屏幕 - 输出设备
            音箱 - 输出设备
    操作系统
        环境变量
        抽象的操作系统
            组成
                驱动
                内核
                    进程调度 -> cpu
                    内存分配 -> 内存
                    文件系统 -> 硬盘
                    网络栈 其实可以算到驱动里，但现代操作系统的网络很重要，流量控制
                系统调用
                外围程序
                    shell
            可以简单但不严谨地理解
                微内核 仅包括了创建一个系统必需的几个部分 进程调度 内存分配 文件系统
                宏内核 在 微内核的基础上加上 驱动 和 系统调用
        linux 系统的一般使用
            系统安装
            启动过程
            shell 和 treminal
            查看系统信息
                硬件信息
                    cpu
                    内存
                    硬盘
                    网卡
                系统信息
                    linux内核版本
                    系统版本
                网络
                    有多少个网卡
                    ip地址 网关
                    tcp udp 的端口占用情况
                    防火墙
                进程
                用户
                    用户 用户组
                    当前登录的用户
            常用的软件
                gnu 工具链
                四剑客
                    grep
                    sed
                    awk
                    find
                在linux下查找文件
                    查找名为 httpd.conf 的文件或目录
                    find / -name httpd.conf
                    只查找文件
                    find / -name httpd.conf -type f
                    只查找目录
                    find / -name mysql -type d
                    查找以.txt结尾的文件
                    find / -regex '.*\.txt'
                    删除全部扩展名为.tmp 的文件
                    find . -name '*.tmp' -exec rm {} \;
                    查找全部的 PNG 文件并将其转换为 JPG
                    find . -name '*.png' -exec convert {} {}.jpg \;
                        \; 这个符号是一个转义字符，表示命令的结束。
                        因为在 shell 中，分号 ; 通常用于分隔命令，所以需要用反斜杠 \ 来转义，
                        以确保它被正确解析为 -exec 命令的一部分，而不是作为一个新的命令开始。
                    find 搜索路径 条件表达式 动作
                        条件表达式
                            -name
                            -type
                            -empty
                            -amin
                            -atime
                            -cmin
                            -ctime
                            -newermt
                            -newerat
                            -newerct
                            -size
                            -user
                            -group
                            -a
                            -o
                            !
                        动作
                            -print
                            -fprint
                            -ls
                            -file
                            -printf
                            -fprintf
                            -exec
                查找一个命令的位置
                    通过 ps 命令查找
                    type command
                    which command
                    whereis command
            包管理器
                apt
            守护进程
                systemd
            定时任务
                cron
                systemd 的 timer
                at 和 atq
            权限管理
                文件权限
                    chown
                        change owner
                    chgrp
                        change group
                    chmod
                        change mode
                用户
                用户组
            网络
                设置ip
                设置hosts和dns
                设置代理
                设置防火墙
            图形界面
        windows
            配置文件ini和注册表
            策略组
            服务
            计划任务
            防火墙
            命令行，终端和脚本
            事件查看器
            任务管理器
            explorer.exe
    计算机语言
        机器语言
            指令集（机器指令的集合） instruction set
            机器指令 machine instruction
            微程序 micro program
            微指令
            微命令和微操作
        汇编 assembly
            汇编指令
            伪指令
            符号
        高级语言
            编程语言
                c
                c++
                c#
                java
                javascript
                python
                php
                更多
                    lisp go rust ruby lua bash powershell bat vbs
                ...
            标记语言
                xml
                    xsd
                    svg
                    mathml
                    ...
                html
                markdown
            查询语言
                sql
            层叠样式表
                css
        基于字符串的数据格式
            ini
            yaml
            json
        编译原理
            语义设计
                类型系统
                编程范式
                流程控制
            语法设计
            bnf ebnf abnf
            编译分为 4个阶段(Stage)
                1 分词器(tokenizer)，将代码拆解成一个一个的token
                2 词法解析(parse)，将原始的代码经过词法分析转成抽象树
                3 转换器(Transformation)，将抽象树转换成编译器需要的结构
                4 代码生成(Code Generation)，将转换过的抽象树转换成目标代码
                伪代码
                    1. input  => tokenizer   => tokens
                    2. tokens => parser      => ast
                    3. ast    => transformer => newAst
                    4. newAst => generator   => output
                    function compiler(input) {
                        let tokens = tokenizer(input);
                        let ast    = parser(tokens);
                        let newAst = transformer(ast);
                        let output = codeGenerator(newAst);
                        return output;
                    }
            实践
                简单的编译器例子
                    https://github.com/jamiebuilds/the-super-tiny-compiler
                    https://github.com/jht6/the-super-tiny-compiler
                四则运算
                    从左至右
                    有优先级的
                    能识别括号的
                lex/flex ， yacc/bison ， Antlr ， peg.js
                解释 properties ini yaml json xml md
                一个简单的脚本语言
                正则表达式
    数据库
        抽象的数据库
            平面 flat
            层次 hierarchical
            网状 network
            关系 relational
                集合论和谓词逻辑
                各种范式
                sql
        OLAP OLTP HTAP
        索引
        MVCC
        ACID CAP BASE
        nosql 和 newsql
        mysql 的一般使用
            explain sql
    计算机网络
        网络模型
        各层中的协议
        使用系统api来读写网卡中的数据
    数据结构和算法
    软件工程
    中间件
        定时任务
        缓存
        队列
        全文搜索引擎
    虚拟机和容器
    集群和分布式
    一些工具
        git 的一般使用
            github gitlab gitee 其它的 git 服务
        vscode 的一般使用
        chrome 和 firefox 开发者工具的使用
    参考

frp的使用
    下载和安装
    作为 Windows 远程桌面的代理
    作为 xdebug 远程调试的代理
    作为代理使得本地的网站能被外网访问
    使用子域名的方式在本地部署多个网站
在vscode里调试java
    如何手工编译java的项目
    一般的java项目
    使用springboot的java项目
    使用tomcat的javaweb项目
    maven的使用
捕获前端的错误
    捕获异常
    盲水印
    外部数据要先判断是否存在再调用，不要把接口的数据直接渲染到视图
    前端代码的配置要区分生产环境和开发环境
    要把git的commitid写进配置文件里
    打包时要保留map，map不能被外部访问
    如何记录用户的操作？
        焦点移动
        鼠标移动
        滚动条的移动
        窗口大小的变化
        各种事件（键盘，鼠标，滚动条，窗口）的记录
博客
    淘系前端团队 https://fed.taobao.org/
    百度前端 https://fex.baidu.com/
    腾讯 Alloy Team http://www.alloyteam.com/
    腾讯CDC https://cdc.tencent.com/
    美团技术团队 https://tech.meituan.com/
    360奇舞团 https://75.team/
    小米信息部技术团队 https://xiaomi-info.github.io/
    京东零售官方设计共享平台 https://jelly.jd.com/
    凹凸实验室 https://aotu.io/
    阮一峰 https://www.ruanyifeng.com/blog/
    廖雪峰 https://www.liaoxuefeng.com/
    张鑫旭 https://www.zhangxinxu.com
    并发编程网 https://ifeve.com/
    王垠 https://www.yinwang.org/
    风雪之隅 https://www.laruence.com/
    鳥哥的 Linux 私房菜 http://linux.vbird.org/
    Allen https://blog.csdn.net/q1007729991
    O 的笔记 https://ouonline.net/
    halfrost https://halfrost.com/
    blackglory https://blackglory.me/
    黄玄的博客 http://huangxuan.me/
微信公众号
    腾讯技术工程
    哔哩哔哩技术
    数据库开发
    InfoQ
    人人都是产品经理
    瑞典马工
    非法加码
    机器之心
一些网址
文档
    mdn
    msdn
教程
    https://www.runoob.com/
    https://www.edx.org/school/w3cx
    https://www.w3schools.com/
    https://www.w3school.com.cn/
    https://www.w3cschool.cn/
    https://www.yiibai.com/
    http://c.biancheng.net/
    https://zh.javascript.info/
    廖雪峰 和 阮一峰 的博客里也有不少的教程
    mdn 和 msdn 里也有不少的教程
    git 的教程
        https://github.com/pcottle/learnGitBranching
        https://www.liaoxuefeng.com/wiki/896043488029600
        http://git-scm.com/book/zh
        https://backlog.com/git-tutorial/cn/
        http://rogerdudler.github.io/git-guide/index.zh.html
        http://marklodato.github.io/visual-git-guide/index-zh-cn.html
    由 hulu 赞助的 oi wiki https://github.com/OI-wiki/OI-wiki/
    hello算法，一个非常好的 数据结构和算法的教程
        https://github.com/krahets/hello-algo
        https://www.hello-algo.com
    ctf wiki https://github.com/ctf-wiki/ctf-wiki
    并行计算的 wiki 和 oi wiki ctf wiki 差不多 https://github.com/lcpu-club/hpc-wiki
    演算法笔记：台湾师范大学总结的教程 https://web.ntnu.edu.tw/~algo/
    云原生资料库 https://jimmysong.io/docs/
    除了这些文档外，更应该关注各项技术的官方文档
    现在网络上的教程真的非常多，问题不在于寻找教程，而在于选择哪一个去看
社区
    github
    思否
    v2ex
    知乎
    掘金
    learnku.com
    w3ctech
    简书
    StackOverflow
    StackExchange
    即时通讯网 www.52im.net
信息类网站/关注的新闻
    通用的
        新闻联播
        新加坡联合早报
    数码行业的
        cnbeta
        zol
        少数派
    软件行业的
        开源中国 https://www.oschina.net/news
    今日热榜，各种主流app的热搜聚集 https://rebang.today/home?tab=top
git仓库
    github中文社区，一些github仓库的索引 https://www.githubs.cn https://www.github-zh.com
    分享 GitHub 上入门级、有趣的开源项目 https://hellogithub.com
书籍
    鸟哥私房菜
    穿越计算机的迷雾
    网络是怎么连接的
    编码：隐匿在计算机软硬件背后的语言
    图解密码学
    七周七并发
    设计模式：可复用面向对象软件的基础
    Unix 编程艺术
    Unix 环境高级编程
    设计数据密集型应用 https://github.com/Vonng/ddia
    数学之美
    浪潮之巅
    人月神话
    人件
    程序员的数学1~3
    这就是软件售前工程师! https://read.douban.com/ebook/322579268/
    编程语言实现模式 https://book.douban.com/subject/10482195/
    开源的书籍
        https://github.com/EbookFoundation/free-programming-books
        https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-zh.md
浏览器数据持久化缓存技术
    back/forward cache
    HTTP文件缓存
    cookie
    localStorage
    sessionStorage
    Application Cache 和 pwa 相关
    Cache Storage 和 service worker 相关
    WebSQL 关系型数据库，火狐不支持
    IndexedDB 非关系型数据库
    一些浏览器会对 favicon.ico 有特殊的缓存
    origin-private-file-system OPFS https://developer.mozilla.org/zh-CN/docs/Web/API/File_System_API/Origin_private_file_system
    wa-sqlite WebAssembly SQLite
        在前端使用 sqlite ，通过 WebAssembly 和 IndexedDB 和 OPFS 实现
浏览器如何访问本地文件
    https://developer.mozilla.org/en-US/docs/Web/API/FileSystem
    https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API
    https://developer.mozilla.org/en-US/docs/Web/API/Window/requestFileSystem
使用 debian 作为日常用机的系统
    各类硬件驱动
        网卡
        声卡
        显卡
        摄像头
        无线鼠标、键盘
    网卡的配置
    apt源
    桌面环境
    deb snap
    中文输入法
    wine
    加入域
    替代 office
        office 365
        google docs
        wps
        libreoffice
        Calligra Suite(KOffice)
        GNOME Office
        openoffice
    一些常用的 gui 软件
        firefox
        vscode
vscode的使用技巧
    下载 vscode 安装包的墙内加速
        先直接下载 vscode
        复制下载链接
        把链接里的域名改成这个 vscode.cdn.azure.cn
    常用的扩展
        git
            Git History
            GitLens — Git supercharged
        php
            PHP Debug
            PHP Intelephense
        其它
            vscode-icons
            sftp https://marketplace.visualstudio.com/items?itemName=Natizyskunk.sftp
            remote ssh
            Hex Editor 查看文件十六进制的插件 https://github.com/microsoft/vscode-hexeditor
            Excel Viewer https://github.com/jjuback/gc-excelviewer
    显示空格
        "editor.renderControlCharacters": true, // 显示控制字符
        "editor.renderWhitespace": "all", // 渲染全部空白
    显示 .git 文件夹
        "files.exclude": {
            "**/.git": false
        },
    在 Windows 环境下，复制相对路径时使用斜杠
        "explorer.copyRelativePathSeparator"："/"
    使用 git
        关闭自动刷新
            选项->扩展->git->autorefresh
            "git.autorefresh": false
    忽略一些文件的解析
        这个配置是针对这个插件的 PHP Intelephense
        "intelephense.references.exclude": [
            "**/vendor/**",
            "generated",
            "dev",
            "var",
            "pub/media",
            "pub/static"
        ]
    搜索文档内容的技巧
        排除 或 包含
            可以用 , 表示多个条件，例如像这样 .jmx,.js,.css,.less,.xml,.md
            可以用 * 表示通配 app/**/*Test.php
        匹配空行的正则表达式
            ^\s*(?=\r?$)\n
            ^$
    搜索文件的技巧
        ctrl + p 按文件名搜索
    转跳到行数
        Ctrl + G 然后在弹出的框中输入行数
    task的配置
    调试各种语言
        php
        js
        java
        python
        c
    远程开发的配置
    安装和使用 vscode 的网页版
        三种版本
            下载时直接选择 cli 版就可以了，普通版的也可以，直接用这条命令就可以了
                code serve-web
                网页版和普通的的配置和插件是互相独立的
                这样查看帮助
                    code serve-web --help
                    可以指定用户目录和插件目录，但不是所有插件都可以运行在 serve-web 里
                默认端口是 8000 可以这样修改端口
                code serve-web --port 8888
                好像是每个端口都会新建一套配置？
                好像没法设置密码，但可以通过http代理设置的吧
            https://github.com/coder/code-server
            https://github.com/gitpod-io/openvscode-server
        直接访问 vscode.dev 也可以编辑本地文件
    vscodium
        没有微软 遥测/跟踪 代码的 vscode ，但也用不了 微软的vscode插件商店，安装插件似乎会更麻烦一点
        https://vscodium.com/
        https://github.com/VSCodium/vscodium
        https://open-vsx.org/ 可用的插件商店
爬虫与反爬虫的经验
    爬虫
        无视 robots.txt
        使用正则表达式和 xpath 抓取数据
        修改 ua
        构造完整的请求包
        使用代理来规避请求频率的限制
            尽量使用住宅ip
            ip数量要尽量地多，且每个ip要限制访问速度和频率
                即使住宅ip也有可能被拉近黑名单
        使用无头浏览器来执行 js
        使用 playwright 这类工具打开页面，显示窗口，修改ua
            检测浏览器爬虫特征 https://bot.sannysoft.com/
            检测浏览器指纹 https://abrahamjuliot.github.io/creepjs/
            技术足够的话，可以修改浏览器内核来隐藏爬虫特征
        即使速度慢也加载图片
        使用 autoit 这类工具模拟鼠标在页面上的移动
        打开页面后要模拟一下人的操作，例如 移动一下鼠标 移动一下滚动条
        应对验证码
            orc
                在 orc 时遇到闪烁的节点，就在同一位置多截几张图，多张图片合成后再进行 orc
            机器学习
            打码平台
        把步骤分成抓取数据和解释数据两步
        最终目标 抓取到完整的数据
    反爬虫
        站点使用https
        robots.txt 声明禁止爬虫
        使用 http 头 Referer 使图片等静态资源防盗链
        内容里混杂不可见的无用的字符，例如 随机地插入零宽字符
        部分文本使用 css 的伪元素或 svg 显示，例如 数字和英文字母
        禁止爬虫的 ua
        使用 tls 指纹识别爬虫
            指纹和 ua 要互相对比
        内容需要认证才能显示
        限制请求频率
        内容需要执行 js 才能显示，类似于 spa
        节点按一定频率闪烁，人眼无法分辨，用于预防 orc 识别内容
        使用验证码
            判断是否出现验证码
                是否加载图片
                判断 favicon.ico 是否有加载
                鼠标的移动轨迹
                判断 屏幕分辨率 浏览器高度 页面高度 这几个值
                无差别地随机出现
            验证码的类型
                图片字符验证码
                    数字
                    数字+大写英文或小写英文
                    数字+大小写英文
                    数字+大小写英文+噪点
                    数字+大小写英文+噪点+干扰线
                    数字+大小写英文+噪点+干扰线+旋转
                    数字+大小写英文+噪点+干扰线+旋转+多种字体
                    数字+大小写英文+中文+噪点+干扰线+旋转+多种字体
                    数字+大小写英文+中文+噪点+干扰线+旋转+多种字体+四则运算
                滑动验证码
                点击验证码
        防止页面的源码被获取
            全站 https
            js 的代码要经过打包，且不暴漏 map
            js 的代码里要有一个循环的 debugger
            js 的代码要检测开发者工具是否有打开，如果是就清空页面的内容
                https://github.com/AepKill/devtools-detector
                https://github.com/sindresorhus/devtools-detect
            js 的代码要检测是否在无头浏览器里打开，如果是就清空页面的内容
            js 的代码要检测是否在 selenium 等环境里，如果是就清空页面的内容
            js 的代码要判断当前的运行环境是否在 nodejs ，如果是就清空页面的内容
            禁用鼠标右键，禁止f12，ctrl+f10，ctrl+shift+i，禁止选中和复制
        在客户端里加上一些垃圾计算，pow？像预防垃圾邮件那样？
        最终目标
            只允许人访问，访问频率不能太高，限制的内容不能被抓取
            完全杜绝爬虫是很难的，但可以尽量地提高爬虫的成本
        反爬虫的措施太猛可能会使搜索引擎也抓取不了内容
            通过搜索引擎爬虫的ua和ip地址的反查，单独做一个供搜索引擎抓取的版本
                https://developers.google.com/search/docs/advanced/crawling/verifying-googlebot
                https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers
                dns 反查 nslookup -qt=ptr 74.125.128.106
        爬虫和反爬虫搞到最后都是人工智能。。。
            爬虫最大的难点是验证码和ip限制
                解决验证码最后依然是依赖计算机视觉
寻找工作
    寻找合适的 岗位 和 公司
        各个招聘平台
        目标公司的官网
        leetcode 牛客 等刷题的平台
        各类程序员的社区 stackoverflow V2EX 思否 简书 知乎 掘金 learnku.com
        要关注的
            岗位描述
            任职要求
            工资福利
            上班地点
            上班时间
            加班情况
            公司的业务类型
            公司的规模
            公司在招聘平台的信息越详细越好
        判断目标公司的口碑
            996icu
            天眼查 企查查 类工具
            在 搜索引擎 和 各类社区 搜索公司 名字 产品 管理层的姓名
                主要是为了看一下公司有没有负面消息
            公司的参保人数
                参保人数太少，或人数和招聘平台的简介里差距有点大的话，这样的公司也可能是坑
            公司的股权结构是怎样的
                一些小公司获得投资后，往往会夸大自己的公司，例如，获得蚂蚁金服的某间子公司投资，就会自称蚂蚁金服旗下的xxx公司
    准备简历
        简历最好只用一种字体，最好是无衬线的字体
        最好要根据 岗位描述和任职要求 来准备简历，最好不要一份简历海投
        如果长得不好看，就不要在简历里放照片
        刚毕业简历尽量不要超过1张单面a4纸，工作五年内不要超过2张单面a4纸
        内容
            个人信息
                姓名 性别 出生年月 期望岗位 期望工资 入职时间
                leetcode主页 github主页 blog
                联系方式
                    邮箱 手机
            教育经历，如果毕业太久了或者内容太多了就把学历放在个人信息里
                校内的经历，获奖情况，参加的社团活动，如果毕业太久了或者内容太多了就不要这段
                毕业的学校，专业，专业的主要课程，时间
            工作经历
                时间 公司名 公司规模 工资
                工作内容
                    STAR Situation（背景）、Task（任务）、Action(行动)、Result(结果)
            个人技能
                各种证书也可以放在这里
            自我评价，内容太多了就不要这段
                随便写一下就好，不要超过100字
        简历要用 word 文档写，但要保存成 pdf 格式
            直接保存成 pdf 又或者
            用 word 文档写完，然后预览，然后截图，然后把图片粘贴进一个新建的 word 文档，最后把有图片的 word 文档另存为 pdf
        简历可以放在 github 里或者写一个前端的页面
        简历命名为
            岗位-名字
            岗位-名字-联系方式
    投递简历
        目标公司的投递渠道
            通常在官网里都有投递简历的渠道
        各种招聘平台
    如何应对面试
        简历里提及的内容都要认真准备
        根据岗位描述和任职要求准备面试
        提前了解公司的业务类型和规模
        根据 岗位描述 任职要求 公司的业务类型 公司的规模 来预判公司在技术上可能存在的难点，并提前准备相关的解决方案
        背下一些常见的面试题
            面试八股的范围超级大，正常人无法记忆全部的
            背常见的问题（随便在百度搜一下就有了，这类内容简中网里非常多）
            再根据预判来背一些小众的问题（上一步的预判）
            笔者反对面试八股，但笔者依然会建议面试之前背下八股文
        准备一份简单的自我介绍
            我是谁
            做过什么项目
            这些项目的数据
                用户数多少
                日活多少
                qps多少这类
            这些项目用到的技术
                x 语言
                x 框架
                x 中间件
            准备一份英文的自我介绍
        技术面试
            网络笔试时，遇到不会的，就直接搜索，除非明确不能搜索答案且遇到一个很强的反作弊机制
            现场笔试时，遇到不会的，就用手机搜索，除非面试官明确不能上网搜索且一直看着你
            根据简历里的内容发散地提问
                在做 xx 时要没有遇到什么问题
                如何解决某个问题
                为什么要用这种方法解决某个问题
                出现某个问题的原因是什么
                这种方法的原理是什么
                解决x问题还有更好的方法吗
                解决方法a和解决方法b有什么区别，什么时候用解决方法a，什么时候用解决方法b
            根据某一技术的提问
                可以参考这个 软件技术通用的学习套路
            递归式提问
                例子
                    如何实现 x 功能
                    实现 x 功能要注意些什么
                    除了用 a 方式实现 x 功能之外还能用什么方式实现
                    用 a 方式实现和用 b 方式实现有什么区别
                    为什么能用 a 方式实现 x 功能
                    ...
                提问的方向可能是纵向的也可能是横向的
                    横向的
                        rest -> aoap -> graphql
                    纵向的
                        https -> http -> tls -> tcp -> ip -> Ethernet
                递归式寻找答案
                技术的边界
                    数学原理
                        例子
                            并发模型 -> 函数式并发 -> 函数式编程 -> Lambda 表达式 -> λ演算 -> 数理逻辑
                            关系型数据库 -> sql -> 一阶谓词演算 -> 数理逻辑
                    物理实现 -> 物理原理
                        关注四种硬件
                            cpu -> 数据处理
                            内存 -> 数据存储
                            硬盘 -> 数据存储 - 持久性的
                            网卡 -> 数据传输
                        例子
                            并发模型 -> 多线程 -> 锁 -> 异常和中断 -> cpu的指令 -> APIC
                            关系型数据库 -> 索引 -> 文件系统 -> 硬盘
            一些常见问题的解决方案（系统设计的问题）
                通过反问让问题具体化，然后具体问题具体分析不要宽泛地描述，例如
                    如何设计一个秒杀
                        问题的业务流程是怎样的
                            业务流程是否已经确定下来了
                                我能不能修改或影响业务流程
                        预计会有多少用户
                        库存有多少
                        有多少预算
                            我能不能增加预算
                        服务器的环境是怎样的
                            只有一台服务器，还是有多台服务器
                            如果是多台服务器，是使用了集群还是就简单的负载均衡
                            我能不能修改服务器的环境
                        工期是多久
                        预测可能存在的瓶颈
                        针对瓶颈做特别的设计
            一些基础的问题
                tcp握手
                线程和进程
                cookie和session
                ...
                八股的三种类型五个方向（简称八股5·3，8·5·3）
                八股的五个方向
                    数据传输
                        计算机网络
                    数据存储
                        数据库
                            mysql
                            mongodb
                            es
                            redis
                        数据结构
                    数据处理
                        操作系统
                        算法
                        各种语言
                            语言的语法
                                基本语法
                                标准库的使用
                            语言的框架
                                例子
                                    java -> Spring
                                    php -> Laravel
                            语言的实现
                                例子
                                    java -> jvm
                                    php -> zend
                        中间件
                            应用防火墙
                            反代
                            缓存
                            队列
                            定时任务
                    数据的可视化
                        前端全家桶
                    系统设计
                        4S分析法
                            Scenario（场景），Service（服务），Storage（存储），Scale（扩展）
                        系统设计原则
                            合适优于先进 > 演化优于一步到位 > 简单优于复杂
                        服务治理
                        集群和分布式
                        “封底计算”（Back-Of-The-Envelope Calculation）？
                八股的三种类型
                    细节
                    底层
                    极端
            不同类型公司的提问套路
                小公司会问前端相关的
                外包会问框架相关的
                大公司会问系统底层和算法
                有自己项目的公司会问一些场景下问题的解决方法
            遇到手写 leetcode 题目或手写红黑树这类问题时要怎么办
                leetcode 题目太多，背不完的
                平时要多做 leetcode 的题目，要保持那种做题的思维
                按着直觉把代码写出来就可以的了，写不完的话，就描述一下自己的思路，写错了也没关系，要把关键集中在自己解题的思路
                手写红黑树可能真的太难了，但一些简单的，例如 二叉树反转 二分搜索 冒泡排序 快速排序 这些全都背下来其实也没多少
            遇到真的不会的问题时怎么办
                为什么不会这个问题
                    没有接触过的新技术
                        例如 平时用 redis 实现队列，但面试时问到了 kafka
                    没有接触过的新场景
                        例如 平时做 curd ，但面试时问到了 音视频处理
                    一些技术细节没有背到
                        例如 问 nginx 配置文件里，某个冷门的配置项的作用
                    在缺少必要资源的情况下解决问题
                        例如 没有mysql和其它数据库软件的情况下如何保存数据，并确保数据的acid
                    极端情况下的设计
                        例子
                            并发放大10倍甚至100倍
                            数据库的数据量放大10倍
                            响应的时间缩小10倍
                        如何应对
                            大公司披露的一些数据
                                让面试官知道你知道业界的上限在哪里
                            成本和效率
                            人的感受
                            物理限制
                            决策者的偏好和取舍
                要传达出一种能力，我不会，是因为没有遇过，我的学习能力很强，只要我遇到了，我就能解决
                    要如何传达出这个感觉？
            遇到对回答不认可的情况怎么办
            还有什么问题
                目的1 了解岗位信息
                    假设成功入职会负责哪方面的工作
                    这个岗位是新增的还是补缺的
                    假设我成功入职，你会是我的上级吗
                    你现在的岗位是什么（如果一开始时面试官没有介绍）
                    你的岗位在这个公司处于一个怎样的位置？（技术合伙人？高管？中层干部？基层打工人？）
                    项目管理的流程是怎样的
                        有使用项目管理工具吗？使用什么样的项目管理工具
                    项目多久进行一次迭代
                    入职后所在的团队有几个成员？他们分别负责哪些工作
                    你们的项目有文档吗
                        代码规范
                        git规范
                        开发流程
                        api文档 -> 给开发者看的，通常是给前端看的，但外部调用的都会用到吧
                        开发文档 -> 给开发者看的
                        项目的使用手册/终端用户文档 -> 给用户看的，对于开发者而言是用来理解业务流程的
                    项目能在本地完整地运行吗
                    项目的测试是如何进行的，有单独的测试岗位吗
                        功能测试？压力测试的？
                    什么时候会有面试的结果
                    后续还有什么流程
                        后续还会有来自人事部门的面试吗
                            如果没有，可以把 人事面试 反问的问题移动到这里询问
                    假设顺利入职，有针对新员工的培训吗
                目的2 了解自己还有哪些方面需要完善
                    这个岗位在我之前，你们已经面试了多少个人了
                        这是第一个面试 或 不知道
                            从我面试的表现来看，你觉得我还有哪些方面需要完善
                        前面有 x 人
                            你觉得我和前面面试的人有哪些劣势
                            你觉得我和前面面试的人有哪些优势
                                如果这个问题没有正面回答，就回到
                                    从我面试的表现来看，你觉得我还有哪些方面需要完善
                    我的简历是由你来筛选的吗
                        如果是
                            我的简历里有哪些地方点吸引到你们，让你们给了我这个面试的机会
                        如果不是
                            你觉得我的简历写得怎样，如果让你来筛选简历，我的简历能获得面试机会吗
                                如果能
                                    回到前一个 如果是 的问题
                                如果不能
                                    你觉得我的简历还有哪些方面需要完善
                    你觉得我笔试题目做得怎样（如果有笔试，且你确认面试官看过你的笔试答案）
                    把前面的某一个问题复述一次，问面试官这类问题你们在工作中是怎么解决的
        人事面试
            常见的问题
                个人职业规划
                有什么缺点
                    至少描述一个缺点，但这个缺点不会影响工作
                有什么优点
                    至少描述一个优点，而且这个优点会促进工作
                上一份工作离职的原因是什么
                你遇到的最大问题或者是困难是什么
                记忆深刻的事情
                有什么崇拜的人吗
                希望去哪里就业
                有什么兴趣爱好，能拿得上台表演的有吗
                你了解这家公司吗
                你能为企业带来什么
                你为什么选择这家公司
                MBIT职业性格测试
                一些迷信的问题
                    八字 生肖 星座 血型
            还有什么问题
                工资多少
                工资的结构是怎样的
                劳动合同上写的工资是多少
                有没有社保
                有没有公积金
                公积金的比例是多少
                试用期是多久
                试用期的工资怎么计算
                上班时间
                下班时间
                上班下班是否需要打卡，如果需要则怎样打卡
                每天需要写日报吗 每周需要写周报吗 每月需要写月报吗 还有季度 年中 年末
                平时工作用什么交流
                    钉钉 企业微信 微信 qq
                有没有双休
                有没有年假
                有没有加班费
                    怎样计算加班费
                请假的流程是怎样的
                中午在哪里吃饭
                是否有团建
                    上一次团建的时间是在工作日吗
                如果是现场面试，还要问一下，上班地点和面试地点是否一致
                你们是几号发工资的
                当前公司大概有多少名员工，主要是和 参保人数对比一下 ，如果 参保人数远小于公司当前员工，那么这家公司就可能是坑
                你在这家公司工作多久了 通过员工的在职时间判断公司是否是好的公司
                你最开始为什么选择了这家公司
                你为什么留在这家公司
                什么时候会有面试的结果
                后续还有什么流程
                有针对新员工的培训吗
                更多的反问可以参考这里 https://github.com/yifeikong/reverse-interview-zh
        如果一些问题面试官没有正面回答的，就不要追问了，不要把气氛弄得太尴尬
        如果觉得面试的公司没有太多诚意的话，就不要勉强自己
        如果是现场面试，还要观察一下公司的办公环境
        一天只面试一场，每次面试完都要记录下面试的过程（如果记不住，就带一支录音笔，手机的电池未必能续航这么久）
            例如，技术面有哪些问题，反问的时候对方是怎么回答的
            一方面可以查漏补缺，另一方面在收到多个 offer 时，可以更好地对比不同的公司
            列一个表格，对比各家公司的条件
                公司规模 办公环境 工作地点 是否双休 上班时间 有没有加班费 工资 试用期工资 试用期长度 社保 公积金 其它补贴（补充医疗 餐补 通勤补贴 通讯补贴 租房补贴） 奖金 期权 工作内容 技术栈 调薪或晋升体系 通勤时间 公司周边的房租。。。
        去面试之前，一定要先认真地准备，最好预留一周的时间，认真地准备面试
            主要是复习各类基础知识和背面试题目
        可以先找几家不是目标公司面试，先积累一下面试的感觉
        先准备一周，然后随便面试一周，最后才是目标公司的面试（但准备这么久目标公司的岗位可能已经没有了）
        面试的关键在于 预判面试官的问题，预判面试官对问题答案的期待
        面试技巧是锦上添花，不能作为核心竞争力
        面试技巧最主要的作用是向招聘单位准确全面地展示自己的能力，尽量地收集招聘单位的信息，保持必要的体面
    拒绝不合适的公司
        要对比已经收到的 offer
    试用期期间要考虑去留
        面试时承诺的工资福利是否给到位
            工资发放是否准时
        工作内容
            是否和面试时描述的一致
            是否能提升自己的能力
            是否为自己感兴趣的
        工作氛围
            和同事相处是否融洽
            和上级相处是否融洽
        工作环境
            办公室里是否有 wifi ，办公室的网速如何
            办公用的电脑性能是否足够
            工位坐得舒服吗 办公椅和工位面积
            办公室是否有茶水间
            办公室有没有免费的茶或咖啡提供
            洗手间的环境怎样
            新装修的，有甲醛
            写字楼太残旧了
    如何融入工作环境
        刚入职时遇到问题要多问同事和上级
        要重视第一个工作任务
        要记录工作任务和解决问题的流程
    如何离职
        要先了解离职的流程
            问人事
            问其它同事
            从员工手册里寻找相关流程
            最好入职时就找人事问清楚，等到真的要离职时才找人事问离职的流程，就很容易暴露自己离职的想法了
        要在各个招聘平台屏蔽当前公司，最好就是离职完了，才开始找下一份工作
        不要被其它同事察觉你要离职
        一旦提了离职，就必须跑路
    实在找不到合适的公司时怎么办
        继续坚持
        通过面试的记录（就是面试完之后记录了），判断自己哪方面薄弱，着重加强哪方面
        先停下来，别去面试，先完善好自己薄弱的地方再出去面试（一周左右就差不多了）
        如果没钱了怎么办
            先找一家小公司入职，然后在试用期结束之前跑路（快则一个月，慢则三个月），期间要保持学习
    为什么总是找不到好的工作
        主观的原因
            年龄大了
            不愿意或没有勇气 润
                不是出国才叫润，润去更好的省份，更好的城市也可以算润
            没有能力 润
                有没有勇气润和有没有能力润是两个不一样的问题
            基础还是不够好
            准备不够充分
            面试时太紧张了，未能完整地向招聘的企业展示自己的能力
            一些情况下 OverQuality 也是面试失败的原因
        客观的原因
            市场已经萎缩 这是根本原因
                求职者多，岗位少
                招聘的企业会不断地提高入职的门槛，即使远超岗位要求
                招聘的企业会不断地附加入职的条件，即使和工作一点也不相关
            面试的时候，面试官的水平太低
                只想着用困难的题目拦着求职者，而忽略公司实际的业务需求和工作环境
                这使得求职者的情况和公司的需求即使互相适合，求职者也无法顺利地通过面试
            面试时的问题和 岗位描述 任职要求 差距很大，面试之前又刚好没准备到相关的知识，导致面试的表现不好
                例如，岗位描述里是后端开发，但在面试时又问了很多前端相关的知识
            用人单位没有能力准确地判断应聘者的水平
                通常情况下，招聘的企业会通过这几个方面了解应聘者的水平
                    简历
                    学历
                    证书
                    上一家公司的规模
                    上一份工作的内容
                    上一份工作的工资
                    面试的表现
                    笔试的表现
                    github
                    leetcode
                    博客
软件技术通用的学习套路？
    主要的应用场景
    出现的背景
        解决了什么问题
    相关概念
    如何使用
        下载
            官网
            github
            应用商店
        安装
            包管理器
            源码编译
            docker
            安装包
            绿色版
        有哪些配置项
        基本使用
            有哪些功能，每个功能对应的场景
            在各种场景下的使用方式
    常见问题及应对方法
    和其它同类技术的比较
        有什么优势
        有什么劣势
    底层实现原理
        这项技术 或 这项技术中得某个功能 是如何实现的
        这项技术 或 这项技术中得某个功能 为什么会这样实现
            做了哪些取舍
            例如 apache 为什么选择了 多进程模型 ， nginx 为什么选择了 epoll
    这个服务或产品背后的文档和标准
        例如 nginx 的文档 和 http 的 rfc
        标准是标准，实现是实现，
        很多时候实现不一定会跟着标准来
        标准有时会指导实现，实现有时又会被标准追认（例如 http 的代理 rfc 2730 2731）
    例子
        telnet inetd
这些年来的生活经验 学习如何学习 如何定位问题 如何寻找问题的解决办法
    这些年来的生活经验
        要有一个博客记录开发的经验
        要有一个 github 并上传一些代码
            每个仓库的代码尽量是完整的，可以运行的
            每个仓库都需要有一个 README.md
            仓库的 README.md 至少包含这几部分
                简单的介绍
                如何安装
                如何使用
                LICENSE
        尽量参与一些开源项目
        要在 leetcode 刷题，也不用刷很多，起码一星期一题保持手感
        要重视基础
            操作系统
            计算机网络
            数据库
            数据结构
            算法
            软件工程
            信息安全
        要了解新技术
            新技术出现的背景
            新技术解决了什么问题
            理解新技术相关的概念
            实践新技术
        要看新闻，特别是业界的新闻，但又不能只看业界的新闻，其他领域的新闻也要留意一下
        参与一些社群，多和同行交流
        英语水平起码要达到 能看懂文档，能在 issues 用英文和其它人交流
        即使不想跳槽，每年至少也要出去面试一次，这样能了解自己的水平，工资的行情，技术的发展方向
        即使不需要面试，也要每三个月更新一次简历，回顾这三个月自己的工作和学习，判断技能是否有提升
        要学会投资理财
        知识和经验是一个有向图，树形结构不能完整地表示
        知识原子化，理清楚知识之间的依赖，就像 composer 处理依赖那样，像管理 依赖/包 一样，管理知识和经验
        不谋全局者，不足以某一域，所以，计算机领域的知识应该要全都会，才能做好某一方面的工作
        不要只关注技术，其它领域也要留意
            平面设计
            产品设计
                产品需求文档
                原型设计
                竞品分析
            产品运营
                策划
                文案
            团队管理
            财务管理
        在实现财富自由之前，能赚钱的技术才是好的技术
        每年都要体检一次
        要尽力保持一个健康的生活方式
    学习如何学习
        从问题出发
        从兴趣出发
        要抓住关键的问题，不要沉迷在细节里
        各种标准
            rfc
            ieee
            w3c
            iso
        各种文档
            mdn
            msdn
            对应工具的官方文档
        各种教程
            对应工具的官方教程
            第三方教程
        教程文档要和实际使用的版本对应上
        各种社区，论坛和博客
        各种命令行提示
            h help -h --hep /h /? /help
            man
            info
        在 github 寻找相关仓库并阅读源码
            特别是各种协议的实现，有时候 rfc 文档也未能会写清楚，去看一下对应的开源实现是一个好的选择
        要主动地实践
        要记录经验
    如何发现问题
        开发者要理解业务流程才能改好地发现问题
        发现问题和寻找瓶颈的套路是基本一致的
        要重视测试
            最好要有单独的测试岗位
            开发者要测试自己写的代码
            开发者要写测试用例
            最好有单独的测试环境
            代码上线前最好先经过测试环境
        要有单元测试
            部署上线前要通过单元测试
        至少要有一个由用户上报问题的渠道
        平时要监控服务器的状态
            各种系统参数
                cpu 使用率
                内存 使用率
                磁盘 I/O
                网络 I/O
                内核参数
                    信号量
                    打开文件数
            Nginx 和 Apache
                nginx 错误日志
                nginx 响应日志
            fpm
                php-fpm的执行日志
                php-fpm的慢执行日志
            MySQL 慢查询日志
            redis
            定时任务
            守护进程
            各类中间件的监控
            日志记录要完整
                要有完整的调用链路
                要有完整的栈堆
                遇到 mysql 的死锁异常要记录死锁日志 show engine innodb status
                要尽可能地多记录一些信息
            等等。。。
        发现异常要及时警报
            短信 邮件
        通过 xdebug 的 profiler 和 trace
            但 xdebug 肯定不能用在生产环境
    如何定位问题
        判断问题是什么
            问题出现的环境
                浏览器版本 用户组 操作系统 之类的
            问题出现的业务场景
                注册 登录 浏览商品 下单 支付 之类的
            出现问题之前都进行了哪些操作
            问题是由谁发现的
                开发者 测试 运营 用户 上级同事 之类的
            发现问题的人是如何描述问题的
        尽量收集问题相关的信息
            有没有错误输出
            寻找对应的日志记录
                知道哪些位置有日志可以查看
                能看懂日志，从日志中获取有用的信息
                最好能把问题和日志记录对应上
        了解完整的调用链路
            从浏览器输入 url 到页面展现的完整过程
            请求经历了多少次转发，调用了哪些服务
            进程执行文件的位置，进程配置文件的位置，执行这个进程的用户
    如何寻找问题的解决办法
        解决问题要从简单的例子入手
        把一个大的问题分解为多个小的问题，然后逐个解决
        在 搜索引擎里搜索
            bing 国内版
            百度
                百度开发者搜索 https://kaifa.baidu.com/
            bing 国际版
            google
            用英文在 google 上搜索
        在q群里提问
            如何加q群？
                在qq添加那里直接搜索对应的关键字就可以了
                例如，直接搜 php 就会有php的群，然后就申请加入，最好一次多加几个，因为有可能不通过
            在q群里提问可以以 酬谢 红包感谢 这类字眼结尾
            除了q群之外，还可以找钉钉群 微信群之类的
        在 stackoverflow segmentfault 等技术类的网站搜索
        如果是某个特定软件的问题，
            去看官方的文档
            去官方的论坛（如果有）上搜索
            去 github iusess 上搜索
        如果用中文搜不到，就把问题翻译成英文再搜一次
        如果遇到英文网站看不懂就用谷歌翻译
        问一下朋友，同事，同学，把问题发到朋友圈上
        问一下 chatGPT newbing 这类 AI
        在 segmentfault 知乎 等网站找大佬，付费提问
        尝试一下大力奇迹
            把当前的问题特例化，不考虑通用的情况，把当前问题解决了再算
            不考虑内存和时间的消耗，内存不够就加内存，时间太久就升级cpu
        尝试换一种思路去解决问题
        问题解决之后要做一个记录
        如何描述问题
            描述目标
            描述问题
            描述问题出现的环境
            描述一下为解决这个问题做过的努力
        如何提问 https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md
    和业务相关的问题？
如何进行技术选型
    要做什么
    当前有哪些资源可以使用
        有多少预算？
    我们能做什么
        在当前的资源下我们能做什么？
    时间限制？
    对项目发展的预期是怎样的
    大多数情况下，开发效率比运行效率重要
        因为大多数情况下，硬件成本比人力成本低
电子邮件
    名词
        email
        e-mail
        Electronic Mail
        电子的 邮件
        电子邮件
        电邮
    组成
        mta mua mda
    主流的操作系统都有预装邮件客户端（mua）
        Microsoft Mail 更早的，从dos时代开始
        Windows Messaging 95 ， win95里的 ie3.0 也可以作为mua，这个mua后续发展出 Outlook Express
        Outlook Express 98-xp
        Windows Live Mail vista-7
        Windows Mail 8-11
        Outlook For Windows 10-11
        unix/linux 里的 mailx
        iOS 安卓 winphone 塞班 S40 都有预装邮件客户端，就像浏览器一样是一个重要的系统组件
如何搭建一个邮件服务器
    单机的在不同用户间发送邮件
        apt install -y mailutils
        这句命令安装的是 exim
        如无意外，安装完后就能直接用 sendmail mail mailx 命令了
            mail 和 mailx 链接到 mail.mailutils
            sendmail 链接到 exim4
            增加一个用户 useradd -m user1
        发送邮件给其它用户
            使用 mailx 命令发送
            echo "test mail content" | mailx -s "test mail subject" root
            echo 邮件内容 | mailx -s 邮件主题 用户名
            使用 sendmail 命令发送
            echo -e "From: root\nTo: root\nSubject: 问候\n\n我是 root 用户，这是一封用 sendmail 命令发送的邮件。" | sendmail -t
            sendmail -t <<EOF
            From: root
            To: root
            Subject: 问候

            我是 root 用户，这是一封用 sendmail 命令发送的邮件。
            EOF;
        查看用户的邮件
            mail -u root
            mail -u 用户名
            mail -f /var/spool/mail/mail
            mail -f /var/mail/mail root用户要用这种方式才能查看接收的邮件
            mail -f 用于保存邮件的文件路径
            mail -f /var/mail/user1
        邮件保存的位置
            目录
                /var/spool/mail 这个目录会软连接到 /var/mail
                /var/mail 这个是实际的目录
            文件
                /var/mail/root
                /var/mail/mail
                /var/mail/用户名
        日志
            日志文件的目录
                /var/log/exim4
            日志文件
                /var/log/exim4/mainlog
            预防万一可以先事先新建一个
                ls -l /var/log/exim4
                mkdir -p /var/log/exim4
                touch /var/log/exim4/mainlog
                chmod 777 /var/log/exim4/mainlog
            查看日志
                cat /var/log/exim4/mainlog
    在局域网里自娱自乐
        至少需要搭建 smtp 和 imap
            至少要开启这两个端口 smtp(25) imap(143)
            最好再加上这两个 smtps(587) imaps(993)
            还有这几个 smtps(465) pop3(110) pop3s(995) smtp(2525)
                587 才是标准的 smtps 端口 rfc3207
                465 比 587 更早出现
                    465 是一开连接就启用 tls
                    465 很长一段时间都不是标准，直到 rfc8314
                    587 是连接完成后再通过 STARTTLS命令 启用 tls
                        除了 smtps 之外，还有不少的协议使用这种明文命令的形式启用 tls
                        这种 tls 被称为 机会型TLS（Opportunistic TLS）
                有些电子邮件服务通过端口 2525 提供 SMTP 传输。但它并不是电子邮件的标准端口
        假设已经安装好 exim
            修改配置文件
            启动
            尝试通过ip发送邮件
    能收发外网的邮件
        除了 搭建 smtp 和 imap 之外，还要做好域名的解释
        域名解释才是最困难的部分
            域名解释
                A 记录
                    @ 指向 ip
                CNAME 记录
                    mail 指向 A 记录
                MX 记录
                    @ 指向 CNAME 记录
                TXT 记录
                    spf dkim dmarc DANE MTA-STS
                PTR 记录
                    域名 指向 ip
            各种代理
                mua webmail RainLoop
                mta exim Postfix sendmail
                    amavisd-new 调度 ClamAV 和 SpamAssassin
                    ClamAV 邮件反病毒
                    SpamAssassin 过滤垃圾邮件
                mda Dovecot
                msa
                mra
                maa
            opendkim
            还有更多？ bimi RUA RUF MTA-STS TLS-RPT
        要确保这几个端口的开放
            25 465 143 993
            除了安全组，防火墙，还要向运营商确认这几个端口有没有开放
    mta
        Mail Transfer Agent(邮件传输代理)
            这个是邮件系统的核心
            主要用于
                接收邮件
                把邮件转发给其它mta
                把邮件转发给mda或保存在本地
            常见的 mta 有三种
                sendmail
                    最古老的 mta 之一
                    可以通过命令行发送邮件
                    可以作为 smtp 服务器运行
                postfix
                    Postfix 是为了替代 Sendmail 而设计的，提供了更现代化的特性和更高的安全性
                    兼容一部分 sendmail 的命令
                exim4
                    兼容一部分 sendmail 的命令
如何实现一个搜索引擎？
    搜索引擎的原理
        倒排索引
        Lucene
        es
        mysql的全文搜索
客户端的动画？
    动画是如何实现的？
        js
            setInterval
            requestAnimationFrame
        css3
            transform
            transition
            animation
        jq
            显示和隐藏
                show hide toggle
            淡入和淡出
                fadeIn fadeOut fadeToggle fadeTo
            滑动
                slideDown slideUp slideToggle
            延迟执行 delay
            通用的动画方法 animate
            可以链式执行
        还有哪些库？
            animate.css
            animate.js
            Three.js
            Popmotion 这个是 bootstrap 采用的
        古早时期的动画
            通过 setInterval 实现的，或者直接用 jq 的库
        css 和 js 的动画最大的区别是
            css 不能新增节点，js可以新增节点
            css 的代码看起来能更简洁一些
        动画的实现方式
            DOM 一般语境下的动画都是通过dom来实现的
            Canvas
            SVG
    实现原理？
        绘制函数 -> 需要改变的属性
        持续时间 -> 持续的秒数
        时序函数 ->
            连续的 ->
                线性 linear
                    关键字 linear 等价于 linear(0, 1) 等价于 cubic-bezier(0, 0, 1, 1)
                三次贝塞尔曲线 cubic-bezier
                    ease 等价于 cubic-bezier(0.25, 0.1, 0.25, 1.0)
                    ease-in 等价于 cubic-bezier(0.42, 0, 1.0, 1.0)
                    ease-out 等价于 cubic-bezier(0, 0, 0.58, 1.0)
                    ease-in-out 等价于 cubic-bezier(0.42, 0, 0.58, 1.0)
            离散的 -> 阶跃函数 steps
                jump-start
                jump-end
                jump-none
                jump-both
                start 等价于 jump-start
                end 等价于 jump-end
                step-start
                step-end
        延迟执行 -> 延迟多少秒执行
    分类？
        改变形状
        改变颜色
        平移
        旋转
        改变透明度
        Z 轴顺序
        显示和隐藏
        本质上是改变属性？
    相关的单词
        effect n. 效果
        transition n. 过渡
        animation n. 动画
        animate vt. 把…制作成动画片
        transform n. 变换, vt. 使…改变
使用正则表达式实现的关键词过滤
    定义关键词列表
    把关键词转换为正则表达式
        一般的例子
            例子 -> /(?<tag>例子)/iu
        排除中间的干扰字符
            例子 -> /(?<tag>例[\s\x{3000}\.\-_]*子)/iu
    判断是否包含关键词
    把关键词替换成其它字符
    一般文本
        渲染文本->orc->文本->tts->语音识别->识别后的文本->语义分析->判断是否违规
            即使是一般文本也要渲染一次，因为 unicode 有组合字，有控制文本方向的字符，还有各种不可见的空格
            可以通过控制文本方向来规避检测，例如这样
                rlo词键关 渲染后就是 关键词
    富文本
        渲染文本->orc->文本->tts->语音识别->识别后的文本->语义分析->判断是否违规
    后台管理员要随机抽查
    要有一个由用户举报的渠道
KiB 和 KB 和 Kb 和 Kbps 的联系与区别
    b 是 bit 的缩写 比特
    B 是 Byte 的缩写 字节
    bit 是计算机里最小的单位，只有 0 和 1
    byte 是程序访问内存的最小单位
        绝大多数情况下 1 Byte = 8 bit
    byte 是 SI 里用于描述信息量的单位
    国际电工委员会IEC的单位
        1KiB = 1 Kibibyte = 1 kilo binary byte = 2^10 byte = 1024 byte
        1MiB = 1 Mebibyte = 1 Mega binary byte = 2^20 byte = 1048576 byte
        1GiB = 1 Gibibyte = 1 Giga binary byte = 2^30 byte = 1073741824 byte
        1TiB = 1 Tebibyte = 1 Tera binary byte = 2^40 byte = 1099511627776 byte
        1PiB = 1 Pebibyte = 1 Peta binary byte = 2^50 byte = 1125899906842624 byte
        1EiB = 1 Exbibyte = 1 Exa binary byte = 2^60 byte = 1152921504606846976 byte
        1ZiB = 1 Zebibyte = 1 Zetta binary byte = 2^70 byte = 1180591620717411303424 byte
        1YiB = 1 Yobibyte = 1 Yotta binary byte = 2^80 byte = 1208925819614629174706176 byte
    国际单位制SI的单位
        SI的单位都是十进制的
        1KB = 1 Kilo byte = 10^3B = 1000 byte
        1MB = 1 Mega byte = 10^6B = 1000000 byte
        1GB = 1 Giga byte = 10^9B = 1000000000 byte
        1TB = 1 Tera byte = 10^12B = 1000000000000 byte
        1PB = 1 Peta byte = 10^15B = 1000000000000000 byte
        1EB = 1 Exa byte = 10^18B = 1000000000000000000 byte
        1ZB = 1 Zetta byte = 10^21B = 1000000000000000000000 byte
        1YB = 1 Yotta byte = 10^24B = 1000000000000000000000000 byte
    乘数词头对应的中文
        kilo 千
        mega 兆
        giga 吉
        tera 太
        peta 拍
        exa 艾
        zetta 泽
        yotta 尧
    KiB 和 KB
        KiB 是基于2次冥
        KB 是基于10次方
        在 windows 里 KB 就是 KiB
        在 linux 和 mac 里会区分 KB 和 KiB
        KB 这种单位一般用于描述硬盘或内存的容量
        换算
            1. 找到同级单位的比例
            2. 乘以同级单位的比例
            例子
                1KiB = 1.024KB
                2KB = ?
                    1 * x=1.024
                    x = 1 / 1.024
                2KB = 2 * x
                     = 2 * 1 / 1.024
                     = 1.953125KiB
                2KiB = ?
                     1 = 1.024 * x
                     x = 1.024 / 1
                2KiB = 2 * x
                     = 2 * 1.024
                     = 2.024
    Kbps
        bps
            bit per second
            位  每   秒
            每秒能传输的位
        1 Kbps = 1 Kilo per second = 1000 per second
        1 Mbps = 1 Mega per second = 1000000 per second
        1M 带宽是指 1Mbps
            实际速度还要考虑各种头信息和各种控制信号
        带宽用2次冥还是10次方？维基里显示的是用10次方，但中文互联网很多文章都是用2次冥
            个人倾向于应该是用10次方的，因为一般硬件厂商都是用10次方的
        这种单位一般用于描述网速
    KiB/sec
        KiB/sec = KiB/s
        sec = second
        1 KiB/sec = 1 KiB 每秒
        这种单位一般用于描述硬盘的读写速度
    总结
        b 是 bit
            类推 Kb 是 Kilo bit
        B 是 byte
            类推 KB 是 Kilo byte
        中间没有 i 的是基于10次方，中间有 i 的是基于2次冥
        后面带着 ps 或 sec 的是每秒的意思，一般用于描述速度
        硬件一般用基于10次方
        软件一般用基于2次冥
        2次冥 > 10 次方
            单位越大差距越大
        大多数语境下 KB 和 KiB 会混用
            特别是口语里只会说 xxK 或 xxM 很少会说 xxKiB 这种
        在编程开发中，尽量使用 KiB
        http://www.elecfans.com/tools/zijiehuansuan.html
带宽 和 宽带 和 位宽 的联系与区别
    带宽（Bandwidth）一开始的意思是电磁波频率的范围，最高频率和最低频率之间的差值
    在计算机领域中的带宽一般是指数据传输的速度，包括但不限于，网速，内存速度，接口速度
    计算机领域的带宽，其实是在描述理论上的最高速度
        例如 512Kbps 的带宽，是指最高速度达到 512Kbps ，实际上的速度应该是会小于等于 512Kbps 的
    带宽的单位是 bps
    宽带（Broadband）是指较宽的带宽，一般是指比较快的网速
        最开始是把 56Kbps 以上的带宽称为宽带，56kbps 以下的称为窄带（Narrowband）
        后来又变成了 512Kbps 以上的带宽才能称为宽带
        再后来又变成了 4Mbps 以上的带宽才能称为宽带
        感觉宽带就是一个营销术语
        ps 墙内的运营商的家用宽带一般都是指下行速度
    位宽是指一次能传输的数据量，就是一次能传输的比特位数
        例如， 64位的位宽就是指一次能传输64个比特位，通常位简称为 64位（64bit）
        内存带宽一般是 内存频率*内存位宽 ，显存带宽也是一样的计算
浏览器引擎 渲染引擎 js引擎 的联系与区别
    各种名词
        浏览器（Browser）
        浏览器引擎（Browser Engine）
        浏览器内核（Browser Kernel）
        排版引擎（Layout Engine）
        渲染引擎（Rendering Engine）
        JavaScript 引擎（JavaScript Engine）
        WebView
    理解
        Browser = Browser Engine + 一堆外围功能
        Browser Engine = Browser Kernel
        Rendering Engine = Layout Engine
        Browser Engine
            广义的 Browser Engine = Rendering Engine + JavaScript Engine
            狭义的 Browser Engine = Rendering Engine
        JavaScript Engine
            在浏览器引擎中的 JavaScript 运行时
        WebView
            嵌入在其它应用的浏览器 或 一个精减版的浏览器
            webviw 通常以组件的形式出现，不能单独运行
            现代操作系统大多会提供 webview 组件
        Chrome Chromium Blink 之间的联系
            Chromium 是一个基于 Blink 的开源的浏览器
            Chrome = Chromium + 谷歌服务 类似于 安卓 = AOSP + 谷歌服务
            新版的 Edge = Chromium + 微软服务
            Blink 是一个派生自 Webkit 的开源的引擎
            古早版本的 Chromium = Webkit + v8 ， Webkit 中的 JavaScriptCore 被 v8 替换了
    常见的浏览器引擎
        Khtml -> Konqueror
            Khtml 现在也停止开发了，kde转投 Chromium 了
            KDEWebKit
        Gecko -> firefox
        Webkit -> safari
            在 webkit 的文档中有明确地提及到
            WebCore 是 Rendering Engine
            JavaScriptCore 是 JavaScript Engine
            Webkit 一开始是 Khtml 的一个分支
        Blink -> chrome, 新版的 Edge, 新版的 Opera
        Trident -> ie
        EdgeHTML -> 旧版的 Edge
            EdgeHTML 是 Trident 的一个分支
        Presto -> 旧版的 Opera
    常见的 JavaScript 引擎
        monkey -> firefox
        KJS -> Konqueror
        V8 -> chrome, 新版的 Edge, 新版的 Opera
        JavaScriptCore -> Webkit
        Jscript -> 旧版的 ie
        Chakra -> 新版的 ie, 旧版的 Edge
        Carakan -> 旧版的 Opera
    安卓的浏览器
        Chrome和Android在Google属于完全不同的两个团队，Android是收购来的项目
        Android的原生浏览器是一个基于Webkit的实现
        所以原生的安卓webview也是WebKit内核
        但4.4之后，安卓的原生浏览器就换成使用 Chromium 实现的了
        同样地4.4之后的 webview 也是 Chromium
        一些浏览器的实现会直接使用系统的 webview 例如 chrome lite
        一些浏览器则会自己带着一个 webview 例如 chrome
            可以在系统设置里修改 webview 的实现，前提是有安装其它 webview
        ios 里的浏览器和webview全都是safari的套壳
    无头浏览器（headless）
        无头浏览器起码要能执行js
        常见的无头浏览器
            基于 Webkit 的 PhantomJS
            基于 Gecko 的 SlimerJS
            基于 Rhnio 的 HtmlUnit
            基于 Webkit 的 Splash
        浏览器的无头模式
            chrome edge firefox 都有无头模式
        Playwright 和 Selenium 都要配合浏览器使用，不是无头浏览器
    除了浏览器之外的 js 运行环境
        nodejs 基于 V8
        deno 基于 JavaScriptCore
        bun 基于 TypeJavaScript
        QuickJS
        在java中的
            Rhino
            Nashorn
        Atom Shell -> Electron
        Node-Webkit -> NW.js
    文本浏览器/终端浏览器/命令行浏览器
        能运行在 终端 中的浏览器
        w3m
        Lynx
        Links
    嵌入式的浏览器
        JavaFX WebView
            也是用 Webkit
        jxbrowser
            也是基于 java
            运行完整的 Chromium
            但这个是商业库
        QtWebkit 和 QtWebEngine
            QtWebkit 用的是 Webkit
            Qt 5.4 QWebEngine 出现
            Qt 5.5 QtWebEngine 和 QtWebkit 共存
            Qt 5.6 QWebKit 废弃
            QtWebEngine 用的是 Chromium
            KDE 里有两个浏览器也是用 QtWebEngine
                Falkon 用于桌面的
                Angelfish 用于移动设备的
                新版的 Konqueror 也是用 QtWebEngine 了
                看来不止 windows 即使是 linux 也没有几个浏览器用 webkit 了
        gtk 也有类似的项目 webkitgtk
            也是用 Webkit
            GNOME Web
        CEF
            Chromium Embedded Framework
程序 软件 应用 的联系与区别
    英文
        软件 software
        应用 application
        程序 progrem
    含义的范围
        software > application > progrem
    具体的解释
        application 是为最终用户设计的 software
            application 有时会被翻译为 应用程序
            application 是 application software 的缩写，是一种 software
            除了 application software 还有 system software 还有 middleware
        software 由 程序、数据、文档 组成
        progrem 是 software 的组成部分，一个软件至少包含一个 progrem
    更多的名词
        软件 software
        应用 application
        命令行 command line
        命令 command
        内置命令 builtin command / built-in command
            普通的命令，shell 会 fork 一个子进程来运行
            内置命令，shell 自己就能解释，一般不会 fork 子进程
        文件 File
        文件夹 Folder
            文件夹（Folder）是GUI对象，是一个逻辑概念，不一定映射到物理目录，
            文件夹概念一般用在Windows操作系统或者Linux的图形界面。
            目录（Directory）是文件系统对象，大部分时候可以与文件夹概念互换。
            在命令行控制台中查看时通常称为目录，
            但如果通过图形文件管理器访问，有时可将其称为文件夹。
        目录 Directory
        文本文件 Text File
        二进制文件 Binary File
        可执行文件 Executable File
        程序 progrem
        进程 process
        线程 thread
        协程 coroutine
        生成器 generator
        迭代器 iterator
        容器 container
        异步 asynchronous
        同步 synchronous
        文档 document
        数据 data
        配置 configuration
        中间件 middleware
        网页 webpage
        网站 website
        常量 constant
        变量 variable
        值 value
        开关 switch
        选项 option
        代码 code
        脚本 script
            可以被解释执行的代码
        扩展 extension
        插件 plugin
        组件 component
        模块 module
        框架 framework
        库 library
        包 package
        代码片段 code snippet
        函数 function
        功能 function
        方法 method
        对象 object
        类 class
        实体 entity
        预装 pre-install
        内置 builtin
            内置 和 预装 的一般区别
                内置不可以卸载
                预装可以卸载
        服务 service
        平台 platform
        产品 product
        解决方案 solution
        小部件 widgets
        工具 Utils Utility
        杂项 MISC Miscellaneous
        加载项
            plugins
            addins
            addons
            add-ins
            add-ons
            plugin
            addin
            addon
            加 s 是一个版本，加 - 是一个版本
            根据现有的 api 重新组合新功能的是 插件
            通过增加 api 而添加新功能的是 扩展
            其实多数情况下会被混用
            个人的理解
                脚本 重新组织 api 的使用
                插件 编译后的脚本
                扩展 增加新的 api
        计算
            operation
            arithmetic
            calculation
            compute
            counting
            algorism
        option config setting 的区别
            option n. 选项，可选项
            setting n. 设置
            config
                configuration n. 配置
                configure v. 配置
            profile n. 配置集
            preference n. 偏好
            option configuration profile preference 可以简单但不严谨地理解为都是同义词，混用关系也不大
            option 是可选的设置，可以被忽略的
            configuration 是面向开发者的设置，例如 数据库连接
            setting 是面向用户的设置，侧重于程序的功能和行为
            profile 通常用于用户信息，例如 昵称 简介
            preference 通常用于个性化用户体验，例如 外观 主题颜色 快捷键
        参数
            parameter
            argument
        属性
            attribute attributes
            property properties
            attribute 和 property 在不同的编程语言下会有不同的含义
            通常都能翻译成 属性
            有时会把 attribute 翻译成 特性 ， 把 property 翻译成 属性
        解决方案=以解决问题为导向的，产品和服务的集合
        产品=软件产品
        服务=软件服务
        平台=一堆服务的集合
        系统=服务+数据存储
        应用=面向终端用户的软件
        软件=程序+数据
        程序=算法+数据结构
        算法=逻辑+控制？
        数学=逻辑+计算（计算这个词有歧义）？
        进程=运行中的程序
        守护进程=在后台一直运行的进程
        定时任务=一个不断判断是否有任务需要执行的守护进程
        操作系统=一堆守护进程的集合
        中间件=服务于其它软件的软件？
        数据结构=类型+结构    结构是什么？
        控制=顺序+分支+跳转（goto）
        循环可以用分支+跳转实现
        逻辑=推理+归纳？
        命令=内置命令/函数或别名/外部命令 + 参数
        外部命令=可执行文件或可执行的脚本
        站点=网站
        网站=一堆网页的集合
        网页=一个经过浏览器渲染的html文件
        互联网/英特网 internet
        以太网 Ethernet
        万维网 World Wide Web
        电子 electric adj. 电子的
        数字 digital adj. 数字的 数码的
        IT 行业中各种名词的解释？
        IT 是 Information Technology 信息技术
        信息 information
        数据 data
        信号 signal
        知识 knowledge
        消息 message
        新闻 news
        讯息 在英文里没有直接对应的单词，一般翻译成 message
            在新文化运动时出现的新词
            权威的消息 最新的消息
        资讯 在英文里没有直接对应的单词，一般翻译成 news 或者 information
            资讯是一种信息，涵盖的不只是新闻，还可以包括其他媒介。
            资讯有时效性和地域性，它必须被消费者利用。
            并且“提供－使用（阅读或利用）－反馈”之间能够形成一个长期稳定的消费链，
            具有这些特点的消息才可以称之为资讯。
        情报 在英文里没有直接对应的单词，一般翻译成 information 或者 intelligence
        资料 在英文里没有直接对应的单词，一般翻译成 data 或者 information
        信息 和 数据 的区别？
            可以套用字符编码里的概念
            信息 -> 抽象的汉字 一
            数据 -> 具体的编码 E4B880
        信号是指数据的电气或电磁表现
            电磁 电气 的区别？
            电磁 简单但不严谨地理解 就是 无线信号 就是 电磁波
            电气 简单但不严谨地理解 就是 有线信号 就是 电流的高低电平
            信号 -> 传输介质的变化？
如何做一个npm库
    去npm官方文档注册账号,并验证邮箱 官网地址:https://www.npmjs.com/
    在github新建一个空仓库，并克隆到本地
    在仓库根目录内执行初始化指令(npm init)并设置包的参数
        接着就依次填写, 不想填写的话也可以一路Enter
        name: 模块名，之后发布之后就可以让用户npm install xxxx来引用你的开源模块了
        version: 版本号，语义版本号分为X.Y.Z三位，分别代表主版本号、次版本号和补丁版本号。当代码变更时，版本号按以下原则更新。
            如果只是修复bug，需要更新Z位。 如果是新增了功能，但是向下兼容，需要更新Y位。
            如果有大变动，向下不兼容，需要更新X位。
        description: 简单介绍自己的模块
        main: 入口文件，必要，当通过require('xxx')时，是读取main里声明的文件
        test command: 测试命令
        git repository: git仓库地址
        keywords: 关键词，可以通过npm搜索你填写的关键词找到你的模块
        author: 作者信息，可以之后编辑更详细一些
        license(ISC): 代码授权许可
        以上放心可以大胆写，因为之后反正要改。
        初始化项目完成，可以看到目录中出现了一个叫 package.json 的文件
    新建一个 index.js 文件，并写入你的 js 方法
    执行 npm install -g 检查是否报错
    执行 npm link (旨在安装开发包并实时查看更改，而无需继续重新安装)
    执行 npm login 登录npm账号
    执行 npm publish 上传代码到npm包管理库
spa 的 ssr
一些文章
  标题 简介 原文链接 快照链接
git的一般使用指南
如何制作一个 php 框架
    组件
        解释http请求 和 发送响应 symfony/http-foundation
        路由组件 symfony/routing
        渲染视图 原生php 或 twig/twig
        控制器 symfony/http-kernel
        事件调度 symfony/event-dispatcher
        依赖注入 symfony/dependency-injection
        错误处理 symfony/error-handler
        日志 monolog/monolog
        文件管理 symfony/finder
        数据库 doctrine/orm
        命令行 symfony/console
        缓存 symfony/cache
        邮件 swiftmailer/swiftmailer
        数据库迁移 doctrine/migrations
        测试数据 fzaninotto/faker 虽然作者已经声明不维护了，但好像没有更好的实现
        国际化 symfony/intl
        http客户端 symfony/http-client
        认证和授权 symfony/security-core
        转义 ezyang/htmlpurifier
        验证 respect/validation
        单元测试 phpunit
        静态分析 vimeo/psalm
        格式检查 friendsofphp/php-cs-fixer
        突变测试 infection/infection
    php的小型框架
        https://github.com/slimphp/Slim
        https://github.com/jadephp/jade
        https://github.com/silexphp/Silex 基于 Symfony2 的，现在已经不更新了
    php的大型框架
        ci
        thinkphp
        laravel
        yii
        cakephp
        symfony
        yaf
        ZendFramework
        Phalcon
        workman
            GatewayWorker
            webman
        swoole
            easyswoole
            hyperf
    模板引擎
        Smarty
        Twig
        Blade
    参考
        https://symfony.com/doc/current/the-fast-track/zh_CN/index.html
        https://symfony.com/doc/current/create_framework/index.html
        http://www.symfonychina.com/doc/current/create_framework/index.html
        https://github.com/CraryPrimitiveMan/create-your-own-php-framework
        https://github.com/learnku-xxh-cds/php_frame
        https://github.com/yeszao/fastphp
        https://github.com/coolephp/skeleton
        https://www.awaimai.com/128.html
        https://learnku.com/articles/6271/build-a-micro-framework-for-your-project-using-composer
        https://learnku.com/articles/52099
        https://learnku.com/laravel/t/9365/teach-you-to-write-modern-php-code-without-using-a-framework
    把框架做成一个 composer project template
    框架的各个部分都用了哪些设计模式
    一般的运行流程
        先加载 composer
        再加载配置文件
        根据配置实例化 app 类
        接收和解释输入
        根据输入匹配路由
        根据匹配的路由实例化控制器
        执行控制器获得输出
        输出结果
一些未能分类的经验
    如何做一个 composer 包
        申请一个 composer 账号
        新建一个 github 仓库
        clone 到本地
        在仓库根目录里运行这句 composer init
    如何给其它 github 仓库提交 pr
        假设已经拥有一个 github 账号
        fork 仓库
        把 fork 的仓库 clone 到本地
        在本地修改，提交，推送到 github
        在原本的仓库新建一个 pr
一般的项目开发流程
    工具
        注册域名
        tls 证书
            自动申请 tls 证书的脚本 https://github.com/acmesh-official/acme.sh
            windows 需要用 git bash 或者用这个库 https://github.com/win-acme/win-acme
            其实不少域名注册商都能根据域名提供一个免费的证书
        LDAP
            openldap
            PhpLDAPAdmin
            linux 的账号管理
            公司内网的域管理
            其它信息系统的关联
                email
                oa
                hrm
                erp
                itam
                crm
        邮箱
            自建邮箱服务
            企业邮箱
            通讯录
                CardDAV
                ad 域或 ldap 的组织架构
        项目管理
            Redmine
            开发新功能
            bug管理
        流水线
            jenkins GitLab-CI
            代码格式检测
            代码静态检测
            测试
                单元测试
                突变测试
            构建镜像并提交到镜像仓库
            把镜像部署到对应的服务器（测试，生产）
        git 仓库
            GitLab gitblit gitea
            分支模型
                Git Flow
                Github Flow
                Trunk Based Development
                Aone Flow
        容器运行时
            docker
        镜像仓库
            Harbor Portus
        容器编排
            k8s
        服务器监控
            Prometheus Grafana kiali Zabbix
        中间件
            搜索引擎/全文搜索
                ElasticSearch
            缓存
                redis
                memcache
                squid
                varnish
                Apache Traffic Server (ATS)
            队列
                redis 的 disque 模块
                RabbitMQ ActiveMQ RocketMQ ZeroMQ OpenMQ
                Kafka Artemis Apollo Distributedlog
        数据库
            关系型 mysql mariadb PostgreSQL
            文档型 MongoDB
            图
            时序
            列
        日志
            elk loki
        内部文档
            入职用的文档，让新成员能迅速地熟悉工作流程，最好有纸质版（最好过塑或者套个塑料封套，因为会多次使用），因为电脑的配置可能需要一些时间
            公司的一些规章制度，例如 员工手册 之类的
            项目部署和开发的文档，让新成员能迅速上手项目的开发
        im
            企业微信
            钉钉
            qq
            其它内部im
                XMPP
                    Openfire
        文件共享
            webdav
            smb
            ftp
            网盘
                自建的网盘
                第三方网盘
        防火墙
            网络防火墙
                ufw
                firewall
                iptables
                TCP_Wrappers
                Netfilter
            web 防火墙
                ModSecurity
                Naxsi
                OpenWAF
                unixhot
                VeryNginx
        堡垒机
            shell 审计
            sql 审计
magento2 配置 paypal
数据结构和算法的学习笔记
数据结构
    基本概念和术语
        数据结构研究的内容
        数据
        数据元素
        数据项
        数据对象
        数据类型
        抽象数据类型
    算法和算法分析
        算法的定义
        算法的特性
            有穷性
            正确性
            可行性
            输入
            输出
        算法分析
            评价算法优劣的基本标准
                正确性
                可读性
                健壮性
                高效性
            算法效率分析
                算法效率分析分析的目的
                    算法是否实际可行
                    从多个算法中选出最优算法
                算法效率分析的方法
                    事后统计法
                    事前分析估算法
                时间复杂度
                    定义
                    问题规模
                    语句频度
                    最好时间复杂度
                    最坏时间复杂度
                    平均时间复杂度
                空间复杂度
    数据运算
        生成
        销毁
        插入
        删除
        遍历
        修改
        查找
            基本概念
            线性表的查找
                顺序查找
                折半查找
                分块查找
            树表的查找
                二叉树排序
                平衡二叉树
                B-树
                B+树
            散列表的查找
                散列表的基本概念
                散列函数的构造方法
                处理冲突的方法
                散列表的查找
        排序
            基本概念
                排序
                排序的稳定性
                待排序记录的存储方式
                    顺序表
                    链表
                    地址排序
                排序算法效率的评价指标
                    执行时间
                    辅助空间
                排序的基础是查找
            内部排序
                插入排序
                    直接插入排序
                    折半插入排序
                    希尔排序
                交换排序
                    冒泡排序
                    快速排序
                选择排序
                    简单选择排序
                    树形选择排序
                    堆排序
                归并排序
                分配排序
                    基数排序
                        多关键字的排序
                        链式基数排序
            外部排序
                外部排序的基本方法
                多路平衡归并的实现
                置换-选择排序
                最佳归并树
    存储结构
        顺序结构
        链式结构
        索引
        散列（哈希）
    逻辑结构
        集合结构
        线性结构
            一般线性表
                线性表
                    定义
                    特点
                    ADT定义
                        数据对象
                        数据关系
                        基本操作
                    顺序表示和实现
                        顺序表
                    链式表示和实现
                        链表
                            单链表
                                循环单链表
                                双向单链表
                            双链表
                                循环双链表
                                双向双链表
                    顺序表和链表的比较
                        空间性能的比较
                        时间性能的比较
                    应用
                        线性表的合并
                        有序表的合并
            特殊线性表
                栈
                    定义
                    特点
                    ADT定义
                        数据对象
                        数据关系
                        基本操作
                    顺序表示和实现
                        顺序栈
                    链式表示和实现
                        链栈
                    栈与递归
                队列
                    定义
                    特点
                    ADT定义
                        数据对象
                        数据关系
                        基本操作
                    顺序表示和实现
                        循环队列
                    链式表示和实现
                        链队
                串
                    定义
                    ADT定义
                        数据对象
                        数据关系
                        基本操作
                    存储结构
                        顺序存储
                        链式存储
                    运算
            线性表的推广
                数组
                    ADT定义
                        数据对象
                        数据关系
                        基本操作
                    顺序存储
                    特殊矩阵的压缩存储
                广义表
                    定义
                    ADT定义
                        数据对象
                        数据关系
                        基本操作
                    存储结构
                        头尾链表的存储结构
                        拓展链表的存储结构
        树形结构
            树
                定义
                基本术语
                存储结构
                    双亲表示法
                    孩子表示法
                    孩子兄弟法
                        比较常用，把一般树转换为二叉树，孩子在左边，兄弟在右边
                种类
                    无序树
                    有序树
                        二叉树
                            定义
                            性质
                            ADT定义
                                数据对象
                                数据关系
                                基本操作
                            存储结构
                                顺序存储结构
                                链式存储结构
                            完全二叉树
                                满二叉树
                            遍历二叉树
                                前序
                                中序
                                后序
                            线索二叉树
                                如果没有左孩子，则指向前驱，如果没有右孩子则指向后继
                            应用
                                哈夫曼树
                                    基本概念
                                    构造算法
                                        构造过程
                                        算法实现
                                    哈夫曼编码
                                        主要思想
                                            关于编码的两个概念
                                                前缀编码
                                                哈夫曼编码
                                            性质
                                                哈夫曼编码是前缀编码
                                                哈夫曼编码是最优前缀编码
                                        算法实现
                                        文件的编码和译码
                遍历
                    先根遍历
                    后根遍历
                森林
                    遍历
                        先序遍历
                        中序遍历
                    与二叉树的转换
                        森林转换成二叉树
                        二叉树转换成森林
        图形结构
            图
                定义
                基本术语
                    顶点
                    边
                    弧
                    子图
                    完全图
                        有向完全图
                        无向完全图
                    稀疏图和稠密图
                        稀疏图
                        稠密图
                    权，网
                        权
                        网
                    邻接点
                    度，入度，出度
                        度
                        入度
                        出度
                    路劲和路劲长度
                        路径
                        路径长度
                    回路或环
                    简单路径，简单回路或简单环
                        简单路径
                        简单回路或简单环
                    连通，连通图，连通分量
                        连通
                        连通图
                        连通分量
                    强连通图，强连通分量
                        强连通图
                        强连通分量
                    连通图和生成树
                    有向树，生成森林
                        有向树
                        生成森林
                ADT定义
                    数据对象
                    数据关系
                    基本操作
                存储结构
                    邻接矩阵
                    邻接表
                    十字链表
                    邻接多重表
                种类
                    有向图
                    无向图
                遍历
                    深度优先搜索
                    广度优先搜索
                应用
                    最小生成树
                    最短路径
                    拓扑排序
                    关键路径

网站性能优化的一般思路
    第一步是要寻找可以优化的地方，这一步可以参考 如何发现问题
    cpu
        升级服务器
            增加cpu数量
            更换更先进的cpu架构
            换成计算型的服务器
        优化代码
        前端渲染
        更换语言
    io
        升级服务器
            换成速度更快的硬盘，例如ssd之类的
        使用缓存
        更换数据库
        使用协程
            现在的php使用协程也提升不了io
            协程必须配合多线程或异步io来使用
        使用多线程或多进程
        优化数据库
            优化sql语句
                limit
                当只要一行数据时使用LIMIT1
                减少select字段
                避免 SELECT *
                要显式声明字段
                别除非必须，查询时不要显式加锁
            获取数据尽量只查询一次
            添加索引
                为搜索字段建索引
                where 和 on 要尽量用到索引
                索引要遵循最左原则
                更新频繁字段不适合创建索引
                若是不能有效区分数据的列不适合做索引列(如性别，男女未知，最多也就三种，区分度实在太低)
                对于定义为text、image和bit的数据类型的列不要建立索引
            使用存储过程
                少了sql语句解释的过程，执行速度会快一点
            从PROCEDURE ANALYSE()取得建议
            使用 explain 来判断 sql 的执行效率
            使用ENUM而不是VARCHAR
                使用tinyint会更好
            固定长度的字段会更快
            使用mysql的分区
            数据库读写分离
                一主一从
                一主多从
            适当增加冗余，避免多表查询
            搞分布式数据库，或者搞数据库集群
            适当使用nosql或new sql
                根据数据结构和业务来选择数据持久化的方案，不用把全部数据都存进关系型数据库里的
                例如 MongoDB 和 es
            通过系统拆分或微服务来达到分库
            极端情况下，如果一个表确定不会有修改操作，在遇到性能瓶颈时可以使用MyISAM 
            使用单独的数据库
                最好在同一个地区，可以内网访问那种
                最好是ssd硬盘的
        关闭非必要的日志
        临时文件可以存放在 /dev/shm ，如果不想改变原本的路径可以加个软连接
    php
        缓存模板文件
        启用 opcode
        如果可以还可以使用预加载
        php8要启用jit
        composer
            composer dump-autoload
            composer dump-autoload -o 
            composer dump-autoload -o --no-dev
            composer dump-autoload -o --apcu --no-dev
            删掉无用的库
            升级到composer2
                一些旧的框架可能会不支持
        一些对象只在首次使用时初始化
            对象 延迟实例化
        对于可以异步处理的任务
            提前返回
                要记得关闭 session ，如果有开启 session
            用队列
        显式声明类型
        使用严格模式 declare(strict_types=1);
        不要总是数组一把梭，可以留意一下spl
        session存到 memcache 或者redis或者/dev/shm
        fpm环境下要使用pdo的持久连接
        不要有太多重的循环
        有时foreach会比for快
            因为少了一个判断
        那堆数组的函数性能都不怎么高，使用时要注意性能和可读性维护性的取舍
        curl请求要设置超时
        日志记录使用专门的时序数据库（例如 InfluxDB 这类），而不是写文件或写mysql
        对日志进行分级
            详细的记录
            一般的记录
            不记录
    带宽
        提升带宽
        压缩/合并 js和css文件
        静态资源缓存
        切图（雪碧图）
            合并一些图片，使用切图的方式展示，这样可以减少http请求
            SVG雪碧图 替代 css雪碧图
        使用cdn
        前端渲染
        减少HTTP请求
        减小HTTP响应内容的大小
            减少不必要的http头
                例如 X-Powered-By 这种
                这样可以稍微减少一点http响应的大小
        dns加速
        压缩图片
        使用压缩率高的图片格式
            webp
        开启gzip压缩/提高gizp压缩级别
            这个会增加cpu的压力
        域名分片
        使用http2
        启用 http2 的 服务端推送（Server Push）
        http缓存
            强缓存
            协商缓存
        更换https的加密方式
            用 ECDH 作为密钥交换算法
        开启hsts
        http 301 重定向至 https
        避免重定向
    内存
        升级服务器
            增加内存
            或者换成内存型的服务器
        优化代码
            主动释放变量
            使用逐行读取的方式读取大文件 
        更换语言
        swap
    前端
        页面渲染
            首屏使用后端渲染
            把js文件放在body的最后
            把css文件放在head里
            js异步加载
                HTML5新属性
                    defer
                        如果script标签设置了该属性，则浏览器会异步的下载该文件并且不会影响到后续DOM的渲染；
                        如果有多个设置了defer的script标签存在，则会按照顺序执行所有的script；
                        defer脚本会在文档渲染完毕后，DOMContentLoaded事件调用前执行。
                        文档解析时，遇到设置了defer的脚本，就会在后台进行下载，但是并不会阻止文档的渲染，当页面解析&渲染完毕后。 会等到所有的defer脚本加载完毕并按照顺序执行，执行完毕后会触发DOMContentLoaded事件。
                    async
                        async脚本会在加载完毕后执行。
                        async脚本的加载不计入DOMContentLoaded事件统计
                    使用场景
                        如果不太能确定的话，用defer总是会比async稳定。。。
                        defer 和 async 在网络下载这块儿是一样的，相较于 HTML 解析都是异步的。不同点在于脚本下载完之后何时执行，defer是在HTML完全解析后再最后执行，async是下载完立即执行
                        async
                            如果你的脚本并不关心页面中的DOM元素（文档是否解析完毕），并且也不会产生其他脚本需要的数据。
                            例如 百度统计
                        defer
                            如果你的脚本代码依赖于页面中的DOM元素（文档是否解析完毕），或者被其他脚本文件依赖。
                            例如 评论框
                ajax加载
                    Injection（注入）
                        创建一个script标签插入到dom中
                    Eval
                        返回js代码，直接放到eval里执行
                onload时的异步加载
                    例如jq的ready事件
                Script In Irame
                    在父窗口插入一个iframe元素，然后再iframe中执行加载JS的操作。
                页内JS内容被注释，所以不会执行，在需要的时候，获取script中的text内容去掉注释，调用eval()执行
            减少dom查询，尽量把多次操作合并到一起
            dom 节点不要太多，dom 节点的深度不要太大
            减少内联 js
                dom 节点不能太多，dom 节点的深度不能太大
            减少内联css
            减少 iframe 的使用
            避免图片的src为空
            图片要显式声明宽度
            使用媒体查询加载不同尺寸的图片
                https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/picture
            页面的动画效果尽可能用css完成
                因为要减少重排
            避免使用table做布局
                table及其内部元素除外，它可能需要多次 计算才能确定好其在渲染树中节点的属性
            减少重排，重绘
                dom操作会引起重排和重绘
                修改样式会引起重绘
                页面样式的变动尽可能只使用css完成
            一些消耗cpu但有不用操作dom的，可以扔进worker里
            使用insights
                查看优化建议
                https://developers.google.com/speed/pagespeed/insights
            提高加载速度
        图片懒加载
            img 标签加上 lazy 属性
        加入友好的等待动画
    并发
        使用负载均衡
            nginx的负载均衡
            lvs的负载均衡
            基于域名的负载均衡
        消息队列
        并发读 加缓存
        并发写 加锁
        并发读写 加缓存 加锁
    其它
        禁用服务器不使用的模块
        热点数据都放在缓存，且不过时，只能主动更新
        缓存预热
        多级缓存
            前端
            http
            nginx
            redis或memcache
            最后才是数据库
        如果可以使用内网ip或Unix域套接字(Unix Domain Socket) 实现各个组件之间的通讯
            例如 nginx的fastcgi配置里
                php fpm 的 socket unix 可以放到 /dev/shm 那里
            如果是那种微服务架构的估计就不行了
        nginx 和 fpm 的 backlog 可以设置高一点，甚至设为 -1 无限制
            backlog数，设置 listen 的半连接队列长度
        使用原生部署，不要用容器
            这样会增加运维的难度
        预编译正则表达式
            虽然php里没有这个
        正则表达式里可以忽略不需要的分组
        从mysql的慢查询日志寻找可以优化的地方
        从fpm的慢执行日志寻找可以优化的地方
        调整一些linux参数
            Huagepage
            打开的最大文件数
            tcp参数调优
                开启TCP BBR
            linux内核调优
        针对业务调整配置文件
            nginx配置
            fpm配置
            php配置
            mysql配置
        限流 降级 熔断
            这个有点抽象
            一般就限流比较容易实现
        系统拆分/微服务
        优化要针对瓶颈，麻木优化会可能增加系统运维成本/风险
        达到预期效果就可以停止优化的了，不要麻木优化
        优化手段的实施顺序
            容易实现，效果明显
            容易实现，效果不明显
            不容易实现，效果明显
            不容易实现，效果不明显
        真的解决不了性能上的瓶颈就解决业务场景
        当无法有效提升『实际性能』时，可以考虑适当转移用户的注意力，来缩短某项操作的感知时间，改善感知性能。
        优化不应该只有技术层面上的，产品层面上的优化也很重要
安全
    常见攻击
        DOS
            DDOS
                当黑客使用网络上两个或以上被攻陷的电脑作为“僵尸”向特定的目标发动“拒绝服务”式攻击时，称为分布式拒绝服务攻击（distributed denial-of-service attack，简称DDoS攻击）
            防范方式
                设置ip黑名单
                限制单个ip在短时间内的访问次数
                session，接口都要有访问频率的限制
                防火墙仅允许特定的端口和协议访问
                syn
                    网关超时设置
                        防火墙计数器到时，还没收到第3次握手包，则往服务器发送RST包，以使服务器从对列中删除该半连接。
                        网关超时设置，不宜过小也不宜过大。过小影响正常通讯，过大，影响防范SYN攻击的效果。
                    SYN网关
                         SYN网关将数据包转发给服务器，需要第3次握手包时，SYN网关以客户端名义给服务器发第3次握手包。
                        一般服务器所承受的连接数量比半连接数量大得多。可以减轻SYN攻击。
                    增加最大半连接数
                禁用icmp
                    仅允许白名单下的ip ping
                流量清洗 
                    通过DDoS防御软件的处理，将正常流量和恶意流量区分开，正常的流量则回注回客户网站，反之则屏蔽。这样一来可站点能够保持正常的运作，仅仅处理真实用户访问网站带来的合法流量。
                    但问题在于怎样区分恶意流量和正常流量
                购买云服务器提供的ddos防护
            带宽消耗型攻击
                UDP洪水攻击（User Datagram Protocol floods）
                ICMP洪水攻击（ICMP floods）
                死亡之Ping（ping of death）
                泪滴攻击
            资源消耗型攻击
                半连接攻击(SYN攻击)
                    发生在TCP 3次握手中。如果A向B发起TCP请求，B也按照正常情况进行响应了，但是A不进行第3次握手，这就是半连接攻击。 
                全连接攻击
                    客户端仅仅“连接”到服务器，然后再也不发送任何数据，直到服务器超时处理或者耗尽服务器的处理进程。
                CC
        SQL注入
            防范方式
                对输入进行严格的转义和过滤
                使用参数化
                使用存储过程
        XSRF/CSRF
            Cross Site Request Forgery
                跨站请求伪造
                客户端请求伪造
            防范方式
                阻止不明外域的访问
                    Samesite Cookie
                        Strict
                            这种称为严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie，绝无例外
                            在http头里这样设置
                                Set-Cookie: foo=1; Samesite=Strict
                        lax
                            这种称为宽松模式，比 Strict 放宽了点限制：假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个GET请求，则这个Cookie可以作为第三方Cookie
                            在http头里这样设置
                                Set-Cookie: foo=2; Samesite=Lax
                        缺点
                            不支持子域
                            浏览器支持不够友好
                                好像只有谷歌和火狐支持
                    同源检测
                        Origin
                            因为要保护隐私的原因，这个值可能不够准确
                        Referer
                            可以参考 MDN 的 Referrer Policy 的规定
                        如果http头没有这两个参数就直接拒绝掉请求 403
                        直接在地址栏里输这个地址是没有这两个参数的
                        好像只有页面接口请求时才有这两个参数
                        验证 Sec-Fetch-* 
                            这些请求头都是Forbidden header ，理论上不能在浏览器里的js修改
                            旧版浏览器不支持
                提交时要求附加本域才能获取的信息
                    每一个请求都要携带一个token (CSRF Token)
                        最好是通过计算的方式校验
                            这样能减少io
                    双重Cookie验证
                        在用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串（例如csrfcookie=v8g9e4ksfhw）。
                        在前端向后端发起请求时，取出Cookie，并添加到URL的参数中（接上例POST  域名/comment?csrfcookie=v8g9e4ksfhw）。
                        后端接口验证Cookie中的字段与URL参数中的字段是否一致，不一致则拒绝。
                其它
                    保证页面的幂等性，后端接口不要在GET页面中做用户操作
                    http响应头添加Header X-Content-Type-Options: nosniff
                        下面两种情况的请求将被阻止：
                        请求类型是"style" 但是 MIME 类型不是 "text/css"，
                        请求类型是"script" 但是 MIME 类型不是  JavaScript MIME 类型
                    不要直接使用用户填写的链接
                        包括但不限于
                            图片链接
                            文件下载的链接
                            其他站点的链接
        XSS/CSS
            注入一段js代码
            反射型
            存储型
            Dom 型
            防范方式
                输出进行转义
                CSP
                    Content-Security-Policy
                        内容安全策略
                    在http头或meta标签里设置csp
                    例子
                        Content-Security-Policy: default-src 'self'
                            所有内容均来自站点的同一个源 (不包括其子域名)
                        Content-Security-Policy: default-src 'self' *.trusted.com
                            允许内容来自信任的域名及其子域名
                        更多例子可以查看 mdn 的文档，可以设置图片，媒体，脚本的域名来源
                Http Only cookie
                    那么通过js脚本将无法读取到cookie信息
                    响应头设置 cookie 的例子 Set-Cookie: timeout=30; Path=/test; HttpOnly
        SSRF
            服务请求伪造
            SSRF(Server-Side Request Forgery:服务请求伪造)是一种由攻击者构造，从而让服务端发起请求的一种安全漏洞，
            它将一个可以发起网络请求的服务当作跳板来攻击其他服务，SSRF的攻击目标一般是内网。
            当服务端提供了从其他服务器获取数据的功能(如:从指定URL地址获取网页文本内容、加载指定地址的图片、下载等)，
            但是没有对目标地址做过滤与限制时就会出现SSRF。
            防范方式
                过滤返回的信息，甚至必要情况下不返回
                限制http端口，仅可使用http https
                检查IP是否为内网IP，进行黑名单过滤
                禁止不需要的协议，gopher,ftp,file协议等
        文件上传
            防范方式
                检查文件后缀
                检查文件mime，mime要和后缀对应
                上传目录外网不能直接访问
                上传目录没有执行权限
                对上传的文件进行重命名且重命名的文件名要有随机性
            一般是用来上传木马
            zip炸弹
                上传一个小的zip文件，但解压后文件非常大，解压时会消耗cpu，解压完后会消耗硬盘容量
                动态检测解压文件的大小，超过某个大小就报错
                限制压缩包里文件的数量，超过某个数量也报错
        php独有的问题
        中间人攻击
            防范方式
                https
                hsts
                禁用了不安全的SSL/TLS协议
                参数的字段里带一个mac
            更多是在客户端层面的防范
        ShellCode
        XXE
            XML External Entity
                XML 外部实体
            由于程序在解析输入的XML数据时，解析了攻击者伪造的外部实体而产生的
            利用xxe漏洞可以进行文件读取，拒绝服务攻击，命令(代码)执行，SQL(XSS)注入，内外扫描端口，入侵内网站点等
            防范方式
                禁用外部实体的方法
                    其实把php升级到8就可以了，php8要开启外部实体的加载其实挺麻烦的
                过滤用户提交的XML数据
                    过滤关键词：<!DOCTYPE和<!ENTITY，或者SYSTEM和PUBLIC。
                把xmllib升级到2.9.0以后的版本
                    xmllib2.9.0以后，是默认不解析外部实体的
        IDOR
        来自业务逻辑的漏洞
    防御
        ssh不要用默认端口
        安全组和防火墙不要开放全部端口，要用端口白名单
        远程数据库只开放给对应的服务器ip，本地连接用ssh代理
        nginx fpm 之类用 www 用户执行，mysql 用 mysql 用户执行
    加密算法
        加密
            对称加密
                des
                3des
                aes
            不对称加密
                rsa
        数字摘要
            sha1
            md5
    漏洞

开发php扩展
    安装必要依赖
        更新源 apt-get update
        apt-get -y install \
            curl libxml2-dev libsqlite3-dev \
            gcc make autoconf automake pkg-config
        curl 是为了下载 php 源码
        gcc make pkg-config 编译主体必须的
        autoconf 编译扩展必须的
        autoconf 依赖 automake
        除非禁用了相关编译参数，不然这两个包是必须的 libxml2-dev libsqlite3-dev
    下载源码
        curl -L -C - https://www.php.net/distributions/php-7.4.23.tar.gz -o php-7.4.23.tar.gz
        tar -xzf php-7.4.23.tar.gz
    编译
        ./configure
            如果内存小于 1g ，要加上 --disable-fileinfo
            像这样 ./configure --disable-fileinfo
        make
        make install
    配置文件
        寻找php的安装目录
            直接运行这句 php-config
            其实可以在 configure 指定安装目录的，但默认情况下可以直接加入环境变量 ./configure --prefix=/root/php-7.4.23/target
        找到 --ini-path 的位置，把配置文件复制到 --ini-path
        cp php.ini-development /usr/local/lib/php.ini
    新建扩展骨架
        进入扩展目录
        运行 php ext_skel.php --ext helloworld
        这样就能生成一个示例扩展
        编译扩展
            phpize
            ./configure --with-php-config=/usr/local/bin/php-config
                --with-php-config 的路径要填绝对路径，
                    whereis php-config
                    whcih php-config
                    php-config 一般和 php 的可执行文件在同一个目录下
            make
            make install
            默认情况下扩展是动态编译的，就是直接把编译后的 so 文件路径加入到 php.ini 就可以了
        把扩展的路径加到 php.ini
            echo "extension=/root/php-7.4.23/ext/helloworld/modules/helloworld.so" >> /usr/local/lib/php.ini
        验证扩展
            php -m | grep helloworld
            php -r "helloworld_test1();"
            php -r "helloworld_test1();echo helloworld_test2('world');echo PHP_EOL;"
        helloworld_test1 和 helloworld_test2 是扩展骨架里自带的函数，可以根据这两个示例来开发自己的扩展
    docker
        dockerfile
            FROM debian:bullseye-slim
            ARG PHP_VERSION=7.4.23
            ARG PHP_DIR=/root
            WORKDIR ${PHP_DIR}
            RUN apt-get update
            RUN apt-get install -y curl
            RUN curl -L -C - https://www.php.net/distributions/php-${PHP_VERSION}.tar.gz -o php-${PHP_VERSION}.tar.gz && tar -xzf php-${PHP_VERSION}.tar.gz
            RUN apt-get -y install \
                gcc make automake autoconf pkg-config \
                libxml2-dev libsqlite3-dev
            RUN cd php-${PHP_VERSION} && ./configure --disable-fileinfo && make && make install
        docker build -t asd/php_ext:0.1 .
        docker run -it --rm asd/php_ext:0.1 /bin/bash
composer
    composer提供了四种方式加载第三方包，分别是
        PSR-0
        PSR-4
            psr-0 和 psr-4 都是根据命名空间名从文件系统中载入类文件
        class-map
            class-map 则是直接一个 命名空间 => 文件 的数组， 加载速度会比 psr-0 和 psr-4 快
        直接包含files
            files 直接包含文件，主要是为了包含一些 公共函数
    加载流程
        vendor/autoload.php
            vendor/composer/autoload_real.php
                vendor/composer/autoload_psr4.php
                vendor/composer/autoload_classmap.php
                vendor/composer/autoload_files.php
                vendor/composer/autoload_namespaces.php
        composer dumpautoload 命令会根据 composer.json 更新这四个文件
            autoload_psr4.php -> psr-4
            autoload_classmap.php -> classmap
            autoload_files.php -> files
            autoload_namespaces.php -> psr-0
        如果更新过 composer.json 的 autoload 或 autoload-dev ，就需要运行一次 composer dumpautoload
        composer dumpautoload 的参数
            -o PSR-4/PSR-0 的规则转化为了 classmap 的规则， 因为 classmap 中包含了所有类名与类文件路径的对应关系，所以加载器不再需要到文件系统中查找文件了。
                可以从 classmap 中直接找到类文件的路径。
            -a （权威的 Authoritative）在 classmap 搜索不到就会报错， -o 当加载器找不到目标类时，仍旧会根据PSR-4/PSR-0 的规则去文件系统中查找 
            --apcu 使用 apcu 缓存
            --no-dev 不加载 autoload-dev 规则
        install 和 update 运行完之后都会运行一次 没有参数的 dumpautoload
        spl_autoload_register 这个方法就是自动加载的关键
    在项目根目录下运行这句，能归档整个项目，可以用来备份代码
        composer archive --format=zip
        composer archive --format=zip --file=archiveFileName
        归档的文件名会自动加上 .zip 的后缀
        归档的代码并不包含 vendor
        可以在 composer.json 里设置忽略的归档文件
            "archive": {
                "exclude": ["var/cache/", "tmp", "/*.test", "!/var/di/"]
            }
        git 也有类似的打包功能
            在项目根目录下运行这句，
            git archive --format=tar --output=archiveFileName.tar HEAD
            git archive --format=zip --output=archiveFileName.zip HEAD
    给composer里的库打补丁
        下载这个库 cweagans/composer-patches
            composer require cweagans/composer-patches
        在项目的根目录里新建一个 patches 文件夹
        在 patches 文件夹里新建补丁文件
        补丁文件通常是这样子的
            --- Model/Product/Copier.php    2022-02-23 15:08:21.521148335 +0800
            +++ Model/Product/Copier.php    2022-02-23 15:07:56.013242367 +0800
            @@ -104,10 +104,7 @@ class Copier
                    $this->setDefaultUrl($product, $duplicate);
                    $this->setStoresUrl($product, $duplicate);
                    $this->optionRepository->duplicate($product, $duplicate);
            -        $product->getResource()->duplicate(
            -            $product->getData($metadata->getLinkField()),
            -            $duplicate->getData($metadata->getLinkField())
            -        );
            +
                    return $duplicate;
                }
        可以用这样的方式生成 patch 文件
            找到需要修改的文件
            复制这个需要修改的文件
            在复制的文件里修改
            用diff命令输出两份文件不一样的地方
            patch 的文件结尾要有一个空行
            例子
                假设现在有一个库，名为 username/test
                这个库的根目录下有一个名为 d1.php 的文件
                    这是d1.php 的内容
                        <?php
                        echo "d1";
                    可以用这样的方式生成 d1.php
                        echo -e '<?php\necho "d1";' > d1.php
                先 cd 进这个库的根目录
                复制 d1.php
                    cp d1.php d2.php
                修改 d2.php
                    sed -i 's/echo "d1";/echo "d2";/g' d2.php
                使用 diff 对比 d1.php 和 d2.php 并把结果输出到一个文件里
                    diff -up d1.php d2.php > d1.patch
                    一个 patch 可以包含多个文件的补丁，例如这样
                        diff -up a1.php a2.php >> d1.patch
                        diff -up b1.php b2.php >> d1.patch
                打开 d1.patch ，把文件开头的 d2.php 的路径修改为和 d1.php 一样的路径
                    开头的两个文件的路径，应该是相对于库根目录的路径
                把 d1.patch 文件复制进 patches 文件夹里
            大多数linux发行版和git for windows都有 diff 这个命令
        在composer.json里加上这段
            "extra": {
                "enable-patching": true,
                "patches": {
                    "drupal/core": { // 需要补丁的库名
                        "patch1 information": "patch1 file path", // 键是补丁的描述，值是补丁的路径
                        "test patch": "patches/d1.patch"
                    },
                    "需要补丁的库名": {
                        "补丁的描述": "补丁的路径"
                    }
                }
            }
        完成上面的步骤后，再运行一次 composer install
            环境变量里需要有 patch 这个命令
            一般情况下 windwos 的 cmd 和 powershell 都没有这个命令
            但 git for windows 的 bash 里有这个命令
            所以在 windows 环境下最好用 git for windows 的 bash 来运行 composer install
        如果遇到 patch 失败的情况，可以加上 -vvv 参数参看详细的输出 composer install -vvv
        patch 给文件打补丁的命令
            查看帮助 patch --help
            加上 --verbose 可以输出详细信息
            一次修改一个文件
                patch 源文件 < 差异文件
                patch -d 目录 源文件 < 差异文件
            一次修改一个文件，差异文件里要包含多个文件
                patch -d 目录 < 差异文件
        cweagans/composer-patches 会按照这样的格式生成 patch 命令
            patch %s --no-backup-if-mismatch -d %s < %s
        cweagans/composer-patches 会依次尝试四条命令，只要其中一条成功，就当是打补丁成功了
            patch -p1 --no-backup-if-mismatch -d 库目录的完整路径 < 差异文件
            patch -p0 --no-backup-if-mismatch -d 库目录的完整路径 < 差异文件
            patch -p2 --no-backup-if-mismatch -d 库目录的完整路径 < 差异文件
            patch -p4 --no-backup-if-mismatch -d 库目录的完整路径 < 差异文件
            -p1 -p4 这类参数的意思是忽略差异文件里目标文件路径前面的目录
            -p0 是都不忽略 -p1 是忽略一层目录
            --no-backup-if-mismatch 这个参数的意思是不生成备份文件
        cweagans/composer-patches 生成和运行 patch 命令的文件
            vendor\cweagans\composer-patches\src\Patches.php
                postInstall
                getAndApplyPatch
        cweagans/composer-patches 生成命令的例子
            windows环境
                patch -p1 --no-backup-if-mismatch -d "C:\Users\a\magento2\vendor/magento/module-sales-rule" < patches/composer/sales_rule.patch
                patch -p0 --no-backup-if-mismatch -d "C:\Users\a\magento2\vendor/magento/module-sales-rule" < patches/composer/sales_rule.patch
                patch -p2 --no-backup-if-mismatch -d "C:\Users\a\magento2\vendor/magento/module-sales-rule" < patches/composer/sales_rule.patch
                patch -p4 --no-backup-if-mismatch -d "C:\Users\a\magento2\vendor/magento/module-sales-rule" < patches/composer/sales_rule.patch
            linux环境
                patch -p1 --no-backup-if-mismatch -d "/var/www/magento2/vendor/magento/module-sales-rule" < patches/composer/sales_rule.patch
                patch -p0 --no-backup-if-mismatch -d "/var/www/magento2/vendor/magento/module-sales-rule" < patches/composer/sales_rule.patch
                patch -p2 --no-backup-if-mismatch -d "/var/www/magento2/vendor/magento/module-sales-rule" < patches/composer/sales_rule.patch
                patch -p4 --no-backup-if-mismatch -d "/var/www/magento2/vendor/magento/module-sales-rule" < patches/composer/sales_rule.patch
        在项目根目录里运行 patch ，可以不用绝对路径，像这样
            patch -p0 --no-backup-if-mismatch -d vendor/magento/module-sales-rule < patches/composer/sales_rule.patch
            需要根据 patch 文件的内容，适当地修改 -p 参数的值
            这种命令可以直接打补丁，不需要运行 composer 的命令
        另一个补丁库 https://github.com/vaimo/composer-patches
        git diff 命令也可以生成 patch 文件
    可以通过硬改 composer.lock 里的 url 和 shasum 的 方式来安装一些需要登录的包
        先从一个已经有对应包的项目里打包
            composer archive vendor-name/component-name version --format=zip
        然后生成 shasum
        把对应的包上传到可以下载的位置
            需要 https 和 不是自签证书，也可以让 composer 允许 http
        修改 url 和 shasum
    composer.lock 里的 shasum 是 sha1
        可以用 sha1sum 或 openssl 生成
            sha1sum 文件路径
            openssl dgst -sha1 文件路径
    让 composer 允许 http 下载
        composer 安装包里的路径有 http 会安装失败
        现在的 composer 会默认 https
        需要在 composer.json 的 config 加上这样一句
            "secure-http": false,
        例如象这样
            "config": {
                "secure-http": false,
                ...
            },
最简单的 pwa
    准备两张用于图标（icons）的图片，png格式的，一张512x512，一张192x192 
    在页面的head标签里加上这三行，具体参数要按照实际情况来修改
        <link rel="manifest" href="/manifest.webmanifest">
        <meta name="theme-color" content="#fff">
        <link rel="apple-touch-icon" href="/icons8-document-512.png">
    新建一个 manifest.json 文件，并至少拥有这几个属性， icons 声明的属性要和实际的属性一致
        {
            "name": "f2h2h1's blog",
            "short_name": "f2h2h1",
            "start_url": "./index.html",
            "display": "standalone",
            "theme_color":"#fff",
            "background_color": "#fff",
            "description": "This is a blog used by a programmers to record experience",
            "prefer_related_applications": true,
            "icons": [
                {
                    "src": "icons8-document-512.png",
                    "sizes": "512x512",
                    "type":"image/png",
                    "purpose": "any maskable"
                },
                {
                    "src": "icons8-document-512.png",
                    "sizes": "192x192",
                    "type":"image/png"
                }
            ]
        }
    新建一个 sw.js 文件，并页面里注册
        if ('serviceWorker' in navigator) {
            // 在 load 事件触发后注册 Service Worker，确保 Service Worker 的注册不会影响首屏速度
            window.addEventListener('load', function () {
                // 注册 Service Worker
                navigator.serviceWorker.register('/sw.js').then(function (registration) {
                    // 注册成功
                    console.log('ServiceWorker registration successful with scope: ', registration.scope)
                }).catch(function (err) {
                    // 注册失败 :(
                    console.warn('ServiceWorker registration failed: ', err)
                })
            })
        }
    sw.js 里要监听 install activate fetch 几个事件，并且能利用 CacheStorage ，让页面离线后，仍然能通过 CacheStorage 获取数据
    sw.js 的例子
        const CACHE_NAME = "fed-cache";
        var util = {
            fetchPut: function (request, callback) {
                return fetch(request).then(response => {
                    // 跨域的资源直接return
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        return response;
                    }
                    util.putCache(request, response.clone());
                    typeof callback === "function" && callback();
                    return response;
                });
            },
            putCache: function (request, resource) {
                // 后台不要缓存，preview链接也不要缓存
                if (request.method === "GET" && request.url.indexOf("wp-admin") < 0 
                    && request.url.indexOf("preview_id") < 0) {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, resource);
                    });
                }
            }
        };
        this.addEventListener("install", function(event) {
            // this.skipWaiting();
            console.log("install service worker");
            // 创建和打开一个缓存库
            caches.open(CACHE_NAME);
            // 首页
            let cacheResources = [
                '/index.html',
                '/static/marked.min.js',
                '/static/cc4.0.webp',
                '/articleList.json',
                '/exchangeList.json',
            ];
            event.waitUntil(
                // 请求资源并添加到缓存里面去
                caches.open(CACHE_NAME).then(cache => {
                    cache.addAll(cacheResources);
                })
            );
        });
        // 激活
        self.addEventListener('activate', function (e) {
            // 激活的状态，这里就做一做老的缓存的清理工作
        });
        this.addEventListener("fetch", function(event) {
            event.respondWith(
                caches.match(event.request).then(response => {
                    // cache hit
                    if (response) {
                        return response;
                    }

                    return util.fetchPut(event.request.clone());
                })
            );
        });
    PWA 有三个关键的技术
        Service Worker
        Manifest （应用清单）
        应用通知 （Web Push 和 Notification Api）
    参考
        https://github.com/lavas-project/pwa-book
        https://lavas-project.github.io/pwa-book/
    要怎样才能知道当前有多少缓存？
    如何制作一个 安卓套壳app
        调用系统内的 webview
        自包含一个 Chromium
        在套壳里的 pwa
前端的模块化方案
    早期的解决方式
        闭包
            moduleA = function（） {
                var a,b;
                return {
                    add: function (c){
                        return a + b + c;
                    };
                }
            }()
        命名空间
            Yahoo的YUI早期的做法
            app.tools.moduleA.add = function(c){
                return app.tools.moduleA.a + c;
            }
    commonJS
        nodejs的模块规范
        不兼容浏览器
        Common不兼容浏览器的原因是缺浏览器少一些Node环境的变量，例如 module exports require global
        Node以及Webpack是采用CommonJS的形式来写的
    AMD (Asynchronous Module Definition)
        requireJS是参照AMD规范实现的
        RequireJS是一个JavaScript文件和模块加载器。它针对浏览器内使用进行了优化，但可以在其他JavaScript环境中使用
        提前执行（异步加载：依赖先执行）+延迟执行
    CMD (Common Module Definition)
        CMD是在AMD基础上改进的一种规范，和AMD不同在于对依赖模块的执行时机处理不同，CMD是就近依赖，而AMD是前置依赖。
        seajs是参照UMD规范实现的，requireJS的最新的几个版本也是部分参照了UMD规范的实现
        延迟执行（运行到需加载，根据顺序执行）
    UMD (Universal Module Definition)
        兼容AMD和commonJS规范的同时，还兼容全局引用的方式
        通常能兼容浏览器或服务器环境
        无导入导出规范，只有一个常规写法
    ES6 module
在 es6 之前如何写 js 的类和模块
js 中和二进制相关的对象
    File
    Blob
        Data URL
    ArrayBuffer
    FileReader
    TypedArray
    DataView
    Buffer
js 中的任务和微任务
    https://developer.mozilla.org/zh-CN/docs/Web/API/queueMicrotask
    https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide
    https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth
    https://zh.javascript.info/event-loop
MutationObserver？
浏览器相关的经验
    启动参数
        --no-sandbox
        --headless
        --disable-gpu
        输出 pdf ， 输出 html ，截图
        --print-to-pdf --dump-dom --screenshot
        使用默认设置，通常和 --user-data-dir 一起使用，因为第一次启动时会询问各种设置
        --profile-directory=Default
        --auto-open-devtools-for-tabs
        --user-agent=
        自定义用户数据的存储目录
        --user-data-dir=
        --disk-cache-dir=
        --app 以 app 形式启动浏览器
            --app=http://www.baidu.com
        --new-window 在一个新窗口打开
        --disable-javascript
        --proxy-pac-url
        不使用图片
        --blink-settings=imagesEnabled=false
        忽略证书错误
        --ignore-certificate-errors
        允许不安全内容
        --allow-running-insecure-content
        允许从本地主机加载的资源使用无效证书
        --allow-insecure-localhost
        允许访问本地文件，这样chrome就能通过file协议加载文件
        --allow-file-access-from-files
        允许跨域，新版的 chrome 除了 --disable-web-security 设置还需要单独设置 --user-data-dir
        --disable-web-security
        --args --disable-web-security
        --args --disable-web-security --user-data-dir=C:\MyChromeDevUserData
        --args --disable-web-security --user-data-dir=C:\MyChromeDevUserData --profile-directory=Default
    清空 dns
        edge://net-internals/#dns
        chrome://net-internals/#dns
    输入 chrome://about 或者 about:about 命令，将集中列出 Chrome 浏览器支持的所有的命令，Chromium 的浏览器应该都支持这个命令
    命令行参数 --enable-features=msEdgeAreaSelect ，启用新版 edge 不再支持的 网页选择 功能
    火狐不显示图片
        about:config
        permissions.default.image 把这个值由 1 改成 2
    火狐输出命令行帮助
        在 git bash 里运行 firefox --help
        只有在 git bash 里有效，在 bat powershell 里都没有效果
        https://wiki.mozilla.org/Firefox/CommandLineOptions
    火狐的缺点
        火狐不能直接从命令行生成 网页截图 和 pdf
        火狐不能把页面另存为单个文件的 mhtml 也不能打开 mhtml 文件
        input 对时间的支持不够好
            input type不支持这几个值
                datetime
                month
                week
            input type 的 datetime-local 和 time 选择时间时，没有下拉框
        火狐的响应式调式和网络调试和 chrome 有一点差距
            响应式的设计工具没有 chrome 好
            network 没有截图
            没有 lighthouse
        不支持 dialog
DNS
    域名
        FQDN(fully qualified domain name 完全限定域名)
            可以简单但不严谨地理解为 带有主机名的域名
        根域
        顶级域 TLD
        二级域 2LD
        三级域 3LD
        主机名
    DNS系统可以分为三层
        根 DNS 服务器
        顶级域 DNS 服务器
        权威域名服务器
    查询的流程
        迭代查询
        递归查询
    dns 客户端和服务器类型
        dns 客户端
        权威DNS
        递归DNS
        转发DNS
    请求报文 和 响应报文
        DNS报文格式，不论是请求报文还是DNS服务器返回的应答报文，都使用统一的格式
        Header 报文头
        Question 查询的问题
        Answer 应答
        Authority 授权应答
        Additional 附加信息
    domain 和 zone
        对应的翻译
            域名 domain name
            域 domain
            区域 zone
        domain 这个比较容易理解
            就是直接用域名来区分
            例如
                com 是一个域
                cloudflare.com 是一个域
                www.cloudflare.com 是一个域
                cloudflare.com 是 com 的子域
                www.cloudflare.com 是 cloudflare.com 的子域
        zone 比较难理解，起码不能直接通过域名区分
        domain 是以域名进行分界的，而 zone 是以授权范围来定界的。
            例子
                com 是一个 zone
                cloudflare.com 是一个 zone
                blog.cloudflare.com 是一个 zone
                cloudflare.com 由 com 授权
                blog.cloudflare.com 由 cloudflare.com 授权
                community.cloudflare.com 和 sopport.cloudflare.com 则不是一个 zone
                community.cloudflare.com 和 sopport.cloudflare.com 包含在 cloudflare.com 里
            参考 https://www.cloudflare.com/zh-cn/learning/dns/glossary/dns-zone/
    EDNS
    DNSSEC
    BIND
        BIND（Berkeley Internet Name Domain）是现今互联网上最常使用的DNS软件
        bind-utils
            host
            nslookup (name server lookup)
            dig (Domain Information Groper)
            bind
    DNSCrypt
    DoH 和 DoT
    powershell 的 Resolve-DnsName
    dns服务
        由isp提供的
        公共的
        自建的
    相关的 rfc
        1034
        1035
        2606
        7871
        8484 DoH
        2065 DNSSEC
        2535 DNSSEC
        3225 DNSSEC
        4033 DNSSEC
        4034 DNSSEC
        4035 DNSSEC
        2671 EDNS
        2673 EDNS
        6891 EDNS
        3490 IDNA
        4431 DLV DNSSEC
IT领域战争
    编辑器之战
        vim emacs
        笔者认为，在 gui 上是 vscode 取得了最后的胜利
        emace 的生态位似乎在被 vscode 侵占，看来还是 vim 笑到最后
    浏览器大战
    unix战争
    操作系统内核之争
        宏内核 和 微内核
    编程语言之争
    代码风格之战
        缩进
            空格和制表
            长度
                2 4 8
        右括号是否换行
        一行代码多少个字符
    协议战争
        tcp/ip 和 osi
    指令集？
        精简 和 复杂
    systemd 和 sysvinit
    主机大战（video game console war）
    从结果上看，
        开源 战胜 闭源
        工程 战胜 学院
linux 中的各种 id
    用户ID (UID, User ID)
    父进程ID (PPID, Parent Process ID)
    进程ID (PID, Process ID)
    会话期ID (SID, Session ID)
        创建session的场景有两个：
            （1）一次登录会形成一个session（login session）。
            （2）系统的daemon进程会在各自的session中（daemon session）。
        无论哪一个场景，都是通过setsid函数建立一个新的session
    控制终端 (TT, TTY)
        ? 是没有控制终端
    进程组ID (PGID, Process Group ID)
        进程组（process group）也是一组进程的集合，进程组id就是这个进程组中leader的进程ID
        对大部分进程来说，它自己就是进程组的leader，并且进程组里面就只有它自己一个进程
        shell里面执行类似 ls|more 这样的以管道连接起来的命令时，两个进程就属于同一个进程组，ls是进程组的leader。
        shell里面启动一个进程后，一般都会将该进程放到一个单独的进程组，然后该进程fork的所有进程都会属于该进程组，
        比如多进程的程序，它的所有进程都会属于同一个进程组，当在shell里面按下CTRL+C时，该程序的所有进程都会收到SIGINT而退出。
    终端进程组ID (TPGID, TTY Process Group ID)
        TPGID == 在前台的进程组ID
        如果一个进程属于后台进程组 ，那么 TPGID 为 -1
        通过 TPGID 来判断一个进程是属于前台进程组，还是后台进程组
        TTY Process Group ID 的作用是用来控制终端设备的输入和输出，以及发送信号给相应的进程组。
        例如，当我们在终端上按下 Ctrl-C 时，就会发送一个 SIGINT 信号给当前的 TTY Process Group
    SPID System Process ID
        多数情况下就是 pid
    上面几个id都可以用这个命令查看 `ps axj -T`
        a: 显示所有
        x: 显示没有控制终端的进程
        j: 显示与作业有关的信息(显示的列): 包括会话期ID(SID), 进程组ID(PGID), 控制终端(TTY)和终端进程组ID(TPGID)
        T: 显示每个进程的线程信息，包括 SPID（线程ID）和 NLWP（线程数）等字段
    jobid ，用命令查看 jobs -l
        进程和作业的区别也不是很理解，但在实践的过程中 一个作业（job）等同于一个进程组
        jobid 其实是按当前的 job 来算的
        假设当前没有 job 那么新建一个 job 那么这个 job 的 jobid 就是 1
        然后再新建的 job 的 jobid 就是 2
        当 1 结束时，但 2 未结束，又新建了 job 那么新建的 job 的 jobid 就是 3
        如果 2 和 3 都结束了，再新建一个 job 那么这个新建的 job 的 jobid 就是 1
        kill 命令也可以用 jobid
            kill %1
            kill jobid 为 1 的 job
串行 并行 并发
    串行 依照顺序一次只执行一个任务
    并发 多个任务交替执行，因为交替的速度非常快，从人的主观感受看，这些任务也是同时执行
    并行 多个任务同时执行
    并发 和 并行 不是互斥的概念，往往都会同时存在
        例如 一个超级简化的例子
            cpu 有两个逻辑核心，然后当前运行的进程有四个线程，那么这四个线程看起来是并发的，
            然后又因为 cpu 有两个逻辑核心，所以同一时刻可以有两个线程运行，所以有两个线程并行
    多核cpu，超线程，逻辑核心，还有多个cpu的主机
    并行计算（parallel computing）
    并发计算（concurrent computing）
    分布式计算（distributed computing）
    并发模型
        并发模型往往会依赖
            io模型
            多进程 和 多线程 和 协程
            锁
            中断
        基于消息传递
            actor
            CSP
        io复用
            Reactor
            Proactor
        线程池
            Half-Sync/Half-Async HSHA
            Leader-Follower LF
        事件驱动
            libhv
            libevent
            libev
            libuv
    并行模型
        并行模型也有不少，但笔者工作时基本遇不到，所以就先不记录了
    异步
        回调函数
        Future与promise
            future n. 未来
            promise n. 承诺
            delay n. v. 延迟
            deferred v. 延期
        async/await
        规范 Promises/A+ https://promisesaplus.com/
        js中的异步编程和 Promises/A+ 规范
            回调
            事件监听 观察者模式 发布订阅模式
            Promises async/await
            生成器
            响应式编程
            jQuery 的 deferred
            ES6 中的原生 Promise
多进程 和 多线程 和 协程
    多进程讲究的是进程间通讯
        管道 pipe
        命名管道 fifo
        消息队列 MessageQueue
        共享内存 SharedMemory
        信号量 semaphore
        信号 signal
        套接字 socket
    多线程讲究的是数据的一致性（多个线程操作同一个变量时不要有冲突）
        通常是通过锁来实现的
    多进程 和 多线程 是通过 中断 来实现的
    无论是哪一种，最后都是依赖 多线程 和 信号
    多进程/多线程 和 信号 依赖的是 中断
    从写代码的角度来看，这些都是依赖 系统调用
    为什么进程的开销比线程大？
        独立的地址空间：
            每个进程都有自己的独立地址空间，而线程则共享其所属进程的地址空间。
            进程之间的切换需要切换整个地址空间，这涉及到更多的内存操作和资源消耗。
        资源分配和管理：
            进程是操作系统资源分配的基本单位，它拥有独立的代码和数据空间、文件描述符、环境变量等。
            线程作为轻量级的进程，共享大部分资源，因此资源管理的复杂度和开销相对较小。
    为什么线程的开销比协程大？
        用户空间与内核空间切换：
            线程的切换涉及到用户空间和内核空间之间的切换，
            这是一个特权模式切换，需要操作系统的调度模块完成。
            而协程切换完全在用户空间进行，不需要这种模式切换，因此开销更小。
    协程
        无栈协程
            生成器 generator
        有栈协程
    还有 线程池/进程池 (pool)
io 模型
    五种模型
        阻塞 （blocking I/O）
            最传统的io
        非阻塞 （non-blocking I/O）
            通过 fnctl 把 fd 加上非阻塞的 flg ，read 没完成是就会返回 EAGAIN 或 EWOULDBLOCK
            这似乎只有 linux 才有的特性
        信号驱动io （signal-driven IO）
            信号驱动io 是 边缘触发
        io复用 （I/O Multiplexing）
            select poll epoll
            select 和 poll 是水平触发
            epoll 可以支持 水平触发 和 边缘触发
            虽然 epoll 被归类在 io多路复用 ，但我认为 epoll 更像是 poll 和 信号驱动io 的合体
            和 epoll 类似的， windows 的 iocp ， freebsd 的 kqueue
        异步io （asynchronous I/O）
            异步io 更严谨的描述应该是 信号驱动的异步io
            信号驱动io和异步io都需要通过信号来接收内核的通知
            信号驱动io接收到通知后，依然需要通过系统调用把数据从内核复制到用户态
            异步io收到通知后，数据就已经在用户态了，内核已经把数据复制到用户态
    两种分类
        一个IO操作其实分成了两个步骤
            发起IO请求		向 cpu 发起 io 请求
            处理IO请求		把数据复制进用户态的内存
        阻塞和非阻塞
            如果 发起IO请求 是 阻塞的，就是 阻塞
            如果 发起IO请求 是 非阻塞的，就是 非阻塞
            所以，除了 阻塞io 之外，其它的都是非阻塞io
        同步和异步
            如果 处理IO请求 是 阻塞的，就是 同步 （synchronous I/O）
            如果 处理IO请求 是 非阻塞的，就是 异步
            所以，除了 异步io 之外，其它的都是同步io
    还有 零拷贝（Zero-copy） 和 写时复制（Copy-on-write，简称COW）
锁（lock）
    锁的目的是避免数据的争用，避免脏数据的产生，保证数据的一致性
    先访问锁，获得锁之外再访问资源
    原理
        原子操作 (atomic operation)
            不可中断的一个或一系列操作
            CAS 指令 Compare And Swap 指令 比较与交换
            TAS 指令 Test-And-Set 指令 测试与设置
            DCAS double-length CAS
            TTAS Test and test-and-set
            FFA Fetch-and-add
        竞争条件 (race condition)
        临界区 (critical region)
    理论上的锁
        乐观锁 (Optimistic Lock)
            先假设冲突不会发生，修改完数据后再判断是否有冲突
        悲观锁 (Pessimistic Lock)
            假设冲突会发生，先获得锁再修改数据
        劝告锁 (advisory lock)
            不是强制的锁
        强制锁 (mandatory lock)
            强制的锁
        死锁 (Deadlock)
    实现上的锁
        信号量 (semaphore)
        文件锁 (file lock)
            从写代码的角度来看，就是各种系统调用
            文件锁到底是怎么实现的？
        mysql锁
            死锁
        redis锁
    分布式锁 (Distributed lock)
信号量 (semaphore)
管程 (monitors)
事务 (transaction)
中断和异常
    异常是一种中断
    现在的中断，大多最后都是 cpu 中的 apic
    软中断(softirq)和硬中断(hardirq)
    irq interrupt request 中断请求
    Kernel signal 内核信号
    system call 系统调用
    signal 信号
    interrupt 中断
    exception 异常
    traps 陷阱
    PIC (Programmable Interrupt Controller, 可编程中断控制器)
    APIC (Advanced Programmable Interrupt Controller, 高级可编程中断控制器)
    异常到底是怎么实现的？
CPU的工作模式
    CPU的工作模式是指CPU的寻址方式、寄存器大小等用来反应CPU在该环境下如何工作的概念。
    现代计算机只有在开机时CPU工作在实模式，而后的一切工作都是在保护模式下进行
    实模式
        实模式的“实”更多地体现在其地址是真实的物理地址
        实模式是不安全的，程序可以随意访问任何物理地址
        实模式是相对于保护模式而言的，在保护模式出现之前并没有实模式这样的称呼
    保护模式
        特权级别（Privilege Level）
            ring0 - ring3
        4个特权级 ring0 - ring3 是在保护模式下的
        0为最高特权级，为内核代码所运行级别，
        3为最低特权级，为用户程序所运行级别。
        1 和 2 是系统程序
        驱动一般也是运行在 1 和 2 ，但也可以运行在 0
        ring3 是用户态
        ring0 - 2 都可以算是内核态
        4个特权级是来自 x86 的概念， arm 里只有内核态和用户态
        对于一个写上层应用的程序员而言，绝大多数情况下只需要考虑 0 和 3
        CPU处于不同的特权级，它能访问的计算机资源范围不同，
        计算机资源包括内存段（代码段，数据段，栈段）,IO设备，核心数据结构。
        GDT 是在保护模式下一个重要的数据结构。
            Global Descriptor Table
            全局描述表
            特权级 和 GDT 密切相关
    长模式
        长模式可以简单但不严谨地理解为 运行在64位cpu上的保护模式
    实模式 和 保护模式 下的中断过程是不一样的
系统调用的本质是什么？
    系统调用 是应用程序和系统的接口，系统调用是操作系统提供的api
    现代cpu通常有多种特权级别，一般来说特权级总共有4个，编号从Ring 0（最高特权）到Ring 3（最低特权）
        在Linux上只用到Ring 0和RIng 3，用户态对应Ring 3，内核态对应Ring 0。
        一般的程序运行在用户态
        系统调用是运行在内核态的
    在没有保护模式之前的系统调用是怎样的？
        保护模式从 80286 就开始有了，
        80286 是 16 位 cpu
        linux 其实是从 80386 开始的
        80386 是 x86 的第一款 32 位 cpu
        好像直到 2012 年 linux 才停止支持 80386
ELF格式
    Executable and Linking Format
    可执行和可链接的格式
    ELF UNIX类操作系统中普遍采用的目标文件格式 
    目标文件有四种类型：
        1. 可重定位文件（Relocatable File）
        2. 可执行文件（Executable File）
        3. 共享目标文件（Shared Object File）
        4. 内核转储（core dumps）
    ELF文件格式提供了两种视图
        链接视图
            以节（section）为单位
            链接时用到的视图
            大致组成
                ELF头部 (ELF header)
                程序头部表 (Program header table)
                节区1 节区2 节区3 ... 节区n
                节区头部表 (Section header table)
        执行视图
            以段（segment）为单位
            执行时用到的视图
            大致组成
                ELF头部 (ELF header)
                程序头部表 (Program header table)
                段1 段2 段3 ... 段n
                    栈 和 堆 都在 .data 里
                节区头部表 (Section header table) 名称和链接视图的一样
        内存映射
            链接视图 到 执行视图 的映射
            执行视图 约等于 内存布局 约等于 内存寻址模型
    静态链接
    动态链接
    可执行文件的装载
        程序（可执行文件）和进程的区别
            程序是静态的概念，它就是躺在磁盘里的一个文件。
            进程是动态的概念，是动态运行起来的程序。
        现代操作系统如何装载可执行文件
            给进程分配独立的虚拟地址空间
            将可执行文件映射到进程的虚拟地址空间（mmap）
            将CPU指令寄存器设置到程序的入口地址，开始执行
    源码 -> 编译器 -> elf文件
    elf文件格式->elf可执行文件的装载->程序运行时的内存布局
    查看文件格式 `file 文件路径`
    查看 elf 文件类型 `readelf -h 文件路径`
    32位和64位的格式会有一些差异
leetcode做题的一般套路
    要把问题抽象成数学问题
        要抽象成类似这样的函数
            答案=解答(输入)
        从写代码的角度大概就是三步
            读取和解释输入
            处理输入
            格式化输出
        多数 leetcode 的题目都会自动处理好第一步和第三步
    要准确地理解问题，然后选择正确的数据结构和算法
    先学好理论再去做题
    如果一道题一直没思路就直接看答案
算法思想
    主要的算法思想 (algorithmic paradigm)
        穷举 (exhaustion) Brute 暴力
        递归 (recursion)
        贪心 (greedy)
        分治 (divide and conquer)
        剪支和搜索 (prune and search)
        回溯 (backtracking)
        动态规划 (Dynamic programming, DP)
            动态规划 约等于 深度优先搜索 + 回溯
        分支界限 (Branch and bound, BB B&B BnB)
            分支界限 约等于 广度优先搜索 + 回溯
    算法思想之所被称为思想是因为算法思想可以应用到不同的数据结构里
    一个具体的算法肯定是基于至少一个具体的数据结构
    一种数据结构通常至少会有三种算法
        遍历 搜索 排序
    简单但不严谨的比喻
        数据结构 是 食材
        算法 是 菜谱
        算法思想 是 烹饪方式
    为什么穷举也可以算作一种算法思想？
    迭代，递归，循环的区别
        循环 loop
            循环 强调 重复同一个操作
        迭代 iteration
            迭代 强调 下一次的输入会依赖上一次的输出
        递归 recursion
            递归 强调 函数自己调用自己
        递推是什么？
            递推没有对应的英文
            递推可能是指递归也可能是指迭代
            简中网的文章大多会强调递推是自底向上
    算法思想 通常是来自数学上相关的学科 例如 运筹学 最优化 组合数学 这类
    有多种方法可以对算法进行分类
        根据应用分：
            按照算法的应用领域，可以分为
            基本算法，数据结构相关算法，几何算法，图论算法，规划算法，数值分析算法，加密解密算法，排序算法，查找算法，并行算法，数值算法……
        根据确定性分：
            确定性算法：有限时间内完成，得到结果唯一。
            非确定性算法：有限时间内完成，得到结果不唯一，存在多值性。
        根据算法的思路分：
            递归算法，穷举算法，贪婪算法，分治算法，动态规划算法等。
动态规划(Dynamic programming, DP)
    递归
    深度优先搜索
    回溯和剪支
        回溯算法在尝试和回退中穷举所有可能的解，并通过剪枝避免不必要的搜索分支
    记忆化递归
    制表
        这个和滚动数组有什么联系？
    一些语境下，
        记忆（Memoization） 和 制表（Tabulation） 会被区分开来，
        把 记忆 称为 记忆化递归 或 备忘录；把 制表 称为 动态规划。
        或者把 记忆 和 制表 统称称为广义动态规划，把 制表 称为狭义动态规划。
    制表 可以看作是 优化后的 记忆
    通常情况下使用 记忆 需要更多的内存，
        在力扣刷题时，一些题目有内存限制，使用 记忆 可能会无法通过，
        但存在一些问题 制表 是无法解决的，依然需要使用 记忆 的方法
数据分析/机器学习/数据挖掘/数据科学/大数据
    名词
        artificial intelligence AI
        big data 大数据
        statistic 统计
        statistical analysis 统计分析
        Data Analysis 数据分析
        Data Mining 数据挖掘
        Machine Learning 机器学习
        data scientist 数据科学
        data source 数据源
        Data mesh 数据网络
        OLTP
            online transaction processing
            在线 事务 处理
        OLAP
            online analytical processing
            在线 分析 处理
        HTAP
            Hybrid Transaction and Analytical Process
            混合 事务 和 分析 处理
        DB
            Data Base
            数据 库
        DL
            Data Lake
            数据 湖
        DW / DWH
            Data Warehouse
            数据 仓库
        DM
            Data Mart
            数据 集市
        KB
            Knowledge Base
            知识 库
        ETL
            Extract-Transform-Load
            抽取-转换-加载
        ELT
            Extract-load-transform
            抽取-加载-转换
        DSS
            Decision Support System
            决策 支持 系统
        BI
            Business Intelligence
            商业 智能
        data viz/vis
            Data visualization
            数据 可视化
        data lakehouse
            数据 湖仓一体
        data architecture
            数据 架构
    数据分析 使用 统计学 的方法 从已有的数据中 验证预设的假设或回答特定的业务问题
    机器学习 把已有的数据作为训练集，建立模型，用模型处理新的数据
    数据挖掘 使用 统计学 和 机器学习 的方法 从已有的数据中 发现 关联 或 趋势
    大数据
        大数据通常是指对大量的数据进行数据分析或数据挖掘
        只要数据量足够大就可以自称大数据
        大数据往往需要用到这些工具
            Hadoop系列
                hive hadoop MapReduce Lucene NDFS/HDFS Hbase Nutch
            google
                BigTable GFS
            流式处理框架
                ApacheSpark ApacheFlink ApacheSamza ApacheStorm
    数据平台
        数据管理
            数据采集
            数据存储
        数据分析（Data Analysis）
            数据统计/统计分析（狭义的数据分析）
            数据挖掘（机器学习）
        数据应用
            推荐
            广告
            数据可视化
    统计是总结过去，概率是预测未来，通过统计过去来预测未来？
    数据分析 可以由业务人员独立完成
    机器学习 和 数据挖掘 通常由it主导
    文档型数据库和关系型数据库本质上有些什么区别？文档型数据库出现的背景？
    列数据库和关系型数据库本质上有些什么区别？
    Symbolic AI
    Explainable AI
    Neuro-symbolic AI
    weak AI
    strong AI
    artificial general intelligence，AGI
    相关的职业
        数据科学家（Data scientist）
            数据科学家分析复杂的数字数据，帮助企业做出决策。
            他们利用数据科学培训和先进的分析技术，包括机器学习和预测建模，发掘数据中隐藏的洞察分析。
        数据分析师（Data analyst）
            数据分析师将数据转化为信息，将信息转化为洞察力。
            他们使用统计方法从数据集中分析和提取有意义的趋势，通常是为了为业务策略和决策提供信息。
        数据工程师（Data engineer）
            数据工程师负责准备、处理和管理大数据基础设施和工具。
            还在组织内开发、维护、测试和评估数据解决方案，经常处理大量数据集来协助分析项目。
        机器学习工程师（Machine learning engineer）
            机器学习工程师专注于设计和实施机器学习应用。
            他们开发复杂的算法，可以从数据中学习并进行预测。
        商业智能分析师（Business intelligence analyst）
            商业智能 (BI) 分析师通过分析数据得出切实可行的洞察，帮助企业做出数据驱动的明智决策。
            他们通常使用 BI 工具将数据转换为易于理解的报告和可视化图表，以供业务利益相关者查看。
        数据可视化专家（Data visualization specialist）
            这些专家专注于数据的可视化表示。
            他们创建数据可视化，通过将数据置于可视化环境中来帮助最终用户了解数据的重要性。
        数据构架师（Data architect）
            数据构架师设计、创建、部署和管理组织的数据架构。
            他们定义不同数据实体和 IT 系统如何存储、使用、集成和管理数据。
人工智能
    概述
        是什么
            用机器模拟人脑
        能做什么
            理想状态下，人能做什么，ai就能做什么
        有哪些流派
            符号主义（Symbolists）
            联结主义（Connectionists）
            行为主义（Behaviorism）
    发展历史
        经典的机器学习 -> 神经网络 -> 深度学习 -> 大语言模型
    数学基础
        初等数学
        四门基础
            微积分 线性代数 概率论 数理统计
        离散数学
            数理逻辑 集合论 组合数学 图论 运筹学 博弈论 信息论
        最优化
        数学建模
    计算机基础
        理论计算机科学
        408全家桶
            数据结构 计算机组成原理 操作系统 计算机网络
        数据库
        前端三件套
        软件工程
        常用的工具
    经典的机器学习
        五大流派
            符号主义（Symbolists）
            联结主义（Connectionists）
            贝叶斯派（Bayesians）
            进化主义（Evolutionists）
            类推主义（Analogizers）
            符号主义和联结主义和人工智能中的分类是一样的
            人工智能中的行为主义似乎没有什么存在感
            贝叶斯 进化主义 类推主义 在人工智能的流派中好像没有对应的分类
        GOFAI
            1985年，约翰·豪格兰在他的书《 人工智能：非常的想法 》中探讨了人工智能研究的哲学含义，
            将符号人工智能命名为GOFAI（Good Old-Fashioned Artificial Intelligence，指的是“有效的老式人工智能）。
            在机器人学领域 ，类似的术语是GOFR （“有效的老式机器人学”）。
            https://en.wikipedia.org/wiki/GOFAI
        支持向量机 (Support Vector Machine, SVM)
    神经网络（neural network）
    深度学习（Deep Learning）
    大语言模型（Large Language Model, LLM）
        提示工程（Prompt Engineering）
        AI Agent/bot/Generative AI/上下文窗口/微调/RAG/MOE
            微调（Fine-Tuning，FT）是再训练一次并加入新数据
            rag是在上下文或提示词里加入新数据
                rag 就是 知识库
            AI Agent 就是 bot
                提示工程 是 Agent
                rag 是 Agent
            插件 就是 调用外部api
                在 工作流 里会用到 插件
            工作流 就是 字面意思
                和 cicd 里的工作流是一样的，只是过程中有大模型的参与
                参考一下腾讯的 混元 元宝 元器
        满血版>满血版量化>蒸馏版>量化版(蒸馏量化版)
            满血就是没经过改动的
            量化就是可以运行在内存里的
            蒸馏就是阉割版
            量化版，一般语境下的量化版就是蒸馏量化版，就是可以运行在内存里的蒸馏版
            ollama 下载的都是量化版
            满血或蒸馏版
                显存 大于 模型的尺寸
            量化版
                显存+内存 大于 模型的尺寸
        那些生成图片，生成视频的模型和LLM有什么关系？
        chat模型 和 embedding模型 有什么区别？
        模态
            输入或输出的类型，例如 文本 文档 图片 视频 音频
            多模态 可以接收多种输入类型或可以输出多种类型
        局限性
            幻觉
            偏差
    著名的公司
        ai 四巨头
            openai 谷歌 Anthropic xai
            Anthropic 就是那个 Claude
            Anthropic 是由 openai 前员工创立的
            xai 就是 马斯克 那个 Grok
            DeepMind 就是做 AlphaGo 那个，现在是 谷歌的全资子公司
        国内的
            幻方量化/深度求索
            百度 阿里 腾讯 字节 华为 科大讯飞 月之暗面 太多了，几乎所有公司都有大模型
            四小龙
                商汤、旷视、云从、依图
            五虎？
                四小龙 + ？
    热门的大模型
        gpt 2022
        deepseek 2024
        Claude
        Grok
        Gemini
        LLaMA mate
        Phi 微软的
        BLOOM 来自法国的，也是开源的
        Mistral 来自法国的，也是开源的
        通义千问
        文心一言
        豆包 字节
        kimi 月之暗面
        混元
        星火 科大讯飞
        大模型的排行榜
            https://github.com/jeinlee1991/chinese-llm-benchmark
            https://www.superclueai.com/
            https://super.gluebenchmark.com/leaderboard
            https://web.lmarena.ai/leaderboard
            https://cevalbenchmark.com/static/leaderboard_zh.html
            https://llm-stats.com/
    应用
        生成文本 对话 生成图片 生成视频 生成音频 视频换脸
    有影响力的人
        AI 三巨头
            Geoffrey Hinton：中文名是 杰弗里·辛顿
            Yann LeCun：中文名是 杨立昆
            Yoshua Bengio：中文名是 约书亚·本吉奥
        华人
            李开复
            李宏毅
            李飞飞
            吴恩达
            陆奇
            黄仁勋
            苏姿丰
            梁见后 超微电脑（Super Micro Computer） 主要是做服务器的
            梁文峰
    相关的框架
        Torch
        TensorFlow
        Keras
        ML.NET
        Apache SINGA
        Apache Spark MLlib
    相关的书籍和仓库
        Deep Learning 中文翻译 https://github.com/exacity/deeplearningbook-chinese
        深度学习500问 https://github.com/scutan90/DeepLearning-500-questions
        数学要素 https://github.com/Visualize-ML/Book3_Elements-of-Mathematics
            这是一套系列丛书，一共有七本 https://github.com/Visualize-ML/Book3_Elements-of-Mathematics/blob/main/鸢尾花书_整体布局.pdf
        如何入门人工智能科研 https://github.com/WengLean/hands-on-research-tutorial
        动手学深度学习（Dive into Deep Learning，D2L.ai） https://github.com/d2l-ai/d2l-zh
        ApacheCN
            https://github.com/apachecn/Interview
            https://github.com/apachecn/ailearning
            https://github.com/apachecn/ai-roadmap
        AI工具集 https://ai-bot.cn/
    Kaggle
        这是一个类似 leetcode 的平台，题目内容是数据分析相关的
        官网 https://www.kaggle.com/
        《Python机器学习及实践：从零开始通往Kaggle竞赛之路（2022年度版）》
            https://book.douban.com/subject/36143721/
            https://github.com/godfanmiao/ML-Kaggle-Github-2022
        Kaggle 的官方入门书籍，但没有中文版
            https://github.com/PacktPublishing/The-Kaggle-Book
        ApacheCN 中对 kaggle 的介绍
            https://github.com/apachecn/Interview/tree/master/docs/Kaggle
            https://github.com/apachecn/Kaggle
    现在的人工智能缺乏可解释性，可能就像过去的微积分的无穷小一样，虽然无穷小的定义在第二次数学危机才算解决了，但是并不妨碍十七，十八，十九世纪的数学家和工程师使用微积分
MySQL 和 PostgreSQL
    比较 MySQL 和 PostgreSQL
        pg 和 mysql 在语法有一些差异
        mysql 可以使用多种存储引擎
        mysql 在集群上有更成熟的方案
        连接模型：MySQL采用在每个连接上生成一个新线程，而PostgreSQL采用在每个连接上生成一个新进程，PostgreSQL提供了更好的隔离性，但也消耗了更多的资源
        PostgreSQL 支持物化视图
        pg 更倾向于 OLAP 在 OLTP 的性能上可能追不上 mysql
        但因为 pg 的软件协议更加宽松，使得我在情感上更加倾向于 pg
        或许 MariaDB 是相对折中和务实的选择
        PGsql 也有类似于mysql ON DUPLICATE KEY UPDATE 的语法，注意，ON CONFLICT 只在 PostgreSQL 9.5 以上可用。
        https://aws.amazon.com/cn/compare/the-difference-between-mysql-vs-postgresql/
    MySQL 为什么比 PostgreSQL 流行
        pg 早期版本不支持 windows
        lamp 的流行，还有 WordPress 这类博客
        阿里的去 ioe 使 mysql 更流行
        pg 的中文用户组到 2011 年才组建起来
        pg 的集群没有MySQL简单
        pg 的高级特性，互联网公司用不到
        据说 PostgreSQL 正在逐步超越 MySQL
    mysql 全家桶
        文档型数据
            用json类型的字段存储
        搜索
            用全文索引
        缓存
            用内存表
        定时任务
            用事件调度器(Event Scheduler)
        队列
            也是用内存表，其实不用内存表也可以
    PostgreSQL 全家桶
        文档型数据
            用这几种类型 json jsonb xml hstore
        全文搜索
            本来就支持，tsvector和tsquery 类型，gin索引
            中文的全文搜索和mysql一样要装插件
        缓存
            pg 中没有类似于 mysql 的内存表
            使用RAM Disk。创建一个表空间到Ram Disk上，然后建表的时候指定表空间到该 Ram Disk
            unlogged table
        定时任务
            pg_cron 扩展 或 PgAgent 扩展
        队列
            使用 PostgreSQL 的 listen/notify 机制 或 queue_classic 扩展
        pg 的扩展机制，使得 pg 的功能可以一直扩展
            时序数据库
            图数据库
            空间数据(gis)
    其实 mssql 也有全家桶，类似地 Oracle 和 db2 应该也有全家桶吧？
openbsd-inetd
    ```
    # 拉取镜像
    docker pull debian:11
    # 运行容器
    docker run \
        -it \
        --rm \
        debian:11 /bin/bash
    # debian11 换成阿里云的源
    cp /etc/apt/sources.list /etc/apt/sources.list_bak && \
    sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    apt update
    # 安装必要的软件
    apt install -y vim && \
    apt install -y net-tools && \
    apt install -y netcat && \
    apt install -y openbsd-inetd && \
    apt install -y procps
    # 修改 inetd 的配置，启用相关的协议
    vim /etc/inetd.conf
        echo       stream  tcp     nowait  root    internal
        daytime    stream  tcp     nowait  root    internal
        time       stream  tcp     nowait  root    internal
        discard    stream  tcp     nowait  root    internal
        chargen    stream  tcp     nowait  root    internal
    # 启动 inetd
    /etc/init.d/openbsd-inetd start
    # 查看 inetd 的状态
    /etc/init.d/openbsd-inetd status
    # 查看当前系统端口的占用情况
    netstat -l
    netstat -a
    # 使用 nc 验证五个协议
    nc 127.0.0.1 7
    nc 127.0.0.1 9
    nc 127.0.0.1 19
    nc 127.0.0.1 13
    nc 127.0.0.1 37
    # RFC 868 输出的是二进制数据，需要经过转换才可读
    # 转换为 10 位时间戳
    nc 127.0.0.1 37 | od -t u4 --read-bytes=4 --endian=big --address-radix=n | awk '{print ($1-2209017600)}'
    # 转换为时间字符串
    nc 127.0.0.1 37 | od -t u4 --read-bytes=4 --endian=big --address-radix=n | awk '{print ($1-2209017600)}' | xargs -I{} date --date='TZ="Asia/Shanghai"' -d "@{}" +%FT%H:%M:%S%:z
    # 修改完 /etc/inetd.conf 文件后，需要重启 openbsd-inetd 服务
    /etc/init.d/openbsd-inetd restart
    ```
    inetd（internet daemon）
    感觉 inetd 就像是守护进程版的 nc
    和 nc 一样只处理连接，然后把socket的输入和输出重定向到标准输入和标准输出
c有哪些缺点？
    没有面向对象
        这个c++或oc可以勉强解决
    没有好用的字符串处理方式
        这个c++也解决不了
    没有好用的包管理工具
    多数情况下需要自行处理跨平台的特性
    用c来写网页，到最后其实就是重新发明一次php，php就是c的模板语言
php有哪些缺点？
php要如何实现并发？
bash 如何实现并发
    使用 &
    使用 &+wait
    模拟一个队列
    使用 fifo
    使用 xargs -P
    使用 parallel
        parallel 通常不预装在系统里
bash 如何接收标准输入和环境变量？
    接收标准输入
        我突然意识到，判断 标准输入 里有没有数据 和 完整地读取 标准输入 里的数据，似乎也是一件困难的事
        这一段似乎只能用在文件里，可能和变量的作用域有关？
        stdin=""
        while read -r line; do
            echo "$line";
            stdin=$stdin$(echo "\n")$(echo "$line");
        done;
        echo -e $stdin
    环境变量
        echo $PATH;
        printenv PATH;
    如果遇到需要处理二进制数据的情况，可以尝试使用 xxd od hexdump 这类命令
bash 里如何实现多维数组？
bash 里如何实现一个 trim
    echo "   your string   " | sed 's/^[ \t]*//;s/[ \t]*$//'
    echo "   your string   " | xargs
    echo "   your string   " | awk '{$1=$1;print}'
    # 定义 trim 函数
    trim() {
        local str="$1"
        # 使用参数扩展去除首尾空格
        str="${str##*( )}"
        str="${str%%*( )}"
        echo "$str"
    }
    # 使用示例
    input="   your string   "
    trimmed_str=$(trim "$input")
    echo "Trimmed string: '$trimmed_str'"
termux
    下载和安装
        要先下载和安装 f-droid https://f-droid.org/
        然后 f-droid 换源 https://mirrors.tuna.tsinghua.edu.cn/help/fdroid/
        然后在 f-droid 里下载和安装 termux
            https://f-droid.org/en/packages/com.termux/
        termux 安装参考
            https://github.com/termux/termux-app#github
            https://github.com/termux/termux-app#f-droid
        termux 安装完后也要换源
            先运行这句 termux-change-repo
            在 tui 的界面里选 tua 的镜像源
            选好退出后再运行这句
            换源之后要运行这句 pkg update
            tremux 换源参考 https://mirrors.tuna.tsinghua.edu.cn/help/termux/
        运行这句 termux-setup-storage 获得 共享存储 和 外部存储 的访问权限
            运行这句 termux-setup-storage 后应该会弹出授权的确认框
            Termux 有三种不同的存储
                Internal storage 内部存储
                    Termux 的主目录，位于 /data/data/com.termux/files/home，只有 Termux 可以访问，不需要额外的权限
                    直接在 Termux 终端中输入命令，cd ~ 切换到主目录
                Shared storage 共享存储
                    在 Termux 终端中输入 termux-setup-storage 命令，并允许 Termux 访问存储权限。这样，Termux 主目录下会生成一个 storage 子目录，它是共享存储的符号链接
                External storage 外部存储
            如果不运行 termux-setup-storage ，就只能访问 Internal storage
        安装一些必要的包
            pkg install proot 模拟 root 环境
                安装完后，输入 termux-chroot 进入 proot 环境
                如果没有其它特别的设置或更新，每个新的会话都要先运行 termux-chroot 才能进入 proot 环境
            pkg install root-repo 对 root 用户有用的软件包
            pkg install vim
    sshd
        安装ssh: pkg install openssh ，提示全部按回车键默认即可。
        设置密码: passwd ，然后输入密码，第二次确认密码。
        开启sshd服务: sshd ，只要输入了这句命令就可以了， sshd 的默认端口是 8022
        查看IP地址：ifconfig（手机电脑在同一局域网内）
        在远程电脑连接
            ssh -o ServerAliveInterval=60 ip地址 -p 8022
            远程电脑就当作普通的 sshd 连接就可以了
        如果没有其它特别的设置或更新，每次重启都要手动启动 sshd
        可以通过 kill 的方式结束 kill 的进程
            通过 ps -elf 找到对应的 pid
                ps -elf 因为只要很少进程，所以直接运行 ps 也能很容易就找到 sshd 的进程
            通过 pid 杀掉对应的进程
                kill pid
    proot-distro
        可以模拟 arm 版的linux，不是虚拟机那种模拟，性能损失比较小
        pkg install proot-distro
        proot-distro list 可以通过这条命令查看发行版的信息
        proot-distro install debian
        proot-distro login debian
        安装完 debian 后也要记得换源 https://mirrors.tuna.tsinghua.edu.cn/help/debian/
    qemu
        只能运行在 proot-distro 中
        这就是完整的系统了，性能损失比较大
        可以模拟x86linux和windows
    docker
        只能运行在 proot-distro 或 qemu 中
        如果运行在 proot-distro 那么只支持 arm 的镜像
            按照官网的步骤一步一步安装就可以了， arm 版的的 docker
            很多镜像都没有 arm 版
    gui
        https://wiki.termux.com/wiki/Graphical_Environment
        pkg install x11-repo
        pkg install tigervnc
        运行 vncserver
            vncserver -localhost
                仅允许 本地连接
            vncserver -localhost no
                允许不是本地连接
        这句第一次运行时要设置密码
        查看 vnc 的守护进程
            ps -elf | grep vnc
        关闭 vncserver
            通过 kill pid 的形式
            或
            vncserver -kill :1
        查看 vncserver 的日志
            日志一般的路径
                /home/用户名/.vnc/localhost:端口号.log
                /home/用户名/.vnc/*.log
            通过查看日志获得 vncserver 监听的端口
            vncserver 监听的端口的规律
                vncserver :1 -> 监听 5091 端口
                vncserver :2 -> 监听 5092 端口
                如此类推
                vncserver -kill :1 这里的 :1 就是启动时的 :1
        可以通过 vncserver -list 查看当前的会话数量
        vncserver 启动后要设置环境变量
        pkg install xfce4
        ~/.vnc/xstartup 注释掉原本的内容，写入下面的内容
            #!/data/data/com.termux/files/usr/bin/sh
            xfce4-session &
        vnc -> x11/Wayland -> rdp
    vnc
        server
            apt install tightvncserver
        client
            vnc view 大部分应用商店都有这个
            如果vnc出现灰屏，就查看 vncserver 的日志
            似乎还差一点。现在打开vnc依然是黑屏
            使用 proot-distro debian 的 vncserver 是成功了
                全部工具都装在 proot-distro debian 里，分辨率应该还需要再调整一下
        termux 不支持 snap
    如何从外网访问 termux
        0 需要先有一台有公网ip的服务器
        1 在服务器的防火墙和安全组放行 8022 端口
        2 在 termux 里运行这句，运行这句之前要先确保 sshd 的服务已经启动了
            ssh -o ServerAliveInterval=60 -f -N -C -g -R 127.0.0.1:8022:127.0.0.1:8022 用户名@远程服务器地址
        3 在远程计算机里运行这句
            ssh -o ServerAliveInterval=60 -f -N -C -g -L 127.0.0.1:8022:127.0.0.1:8022 用户名@远程服务器地址
        4 在远程计算机里运行这句，这样就能通过外网连回手机的 termux 了
            ssh -o ServerAliveInterval=60  用户名@127.0.0.1 -p 8022
虚拟化技术
    模拟器 虚拟机 容器 兼容层 kvm k8s chroot/schroot/proot
    硬件 系统 软件 隔离
    目标系统/宿主系统
        windows linux Android macOS
    下载 安装 使用
    wsl
        前置条件
            cpu和主板要支持虚拟化
            Windows 10 2004 及更高版本
            系统设为开发者模式
            启用linux子系统
            启用虚拟机，只启用linux子系统不启用虚拟机的话只能用wsl1
        安装
            一般情况下不需要特别下载，直接在命令行里运行
                wsl --install
            如果这句无效就试试
                wsl --list --online
            如果遇到这种错误 0x80072ee7 ，就是需要翻墙，而且是全局翻墙的那种
            安装完成后把 wsl 的默认版本设为 2
                wsl --set-default-version 2
                修改完默认版本后最后更新一下
                    wsl --update
            检查每个发行版的状态和 WSL 版本
                wsl -l -v
                如果遇到 version 1 最好把版本也改成 2
                wsl --set-version <distro name> 2
        使用
            查看帮助
                wsl --help
            查看状态
                wsl --status
            查看支持的发行版
                wsl --list --online
            检查每个发行版的状态和 WSL 版本
                wsl -l -v
            启动一个发行版，运行完这个命令就自动进入发行版的命令行了，从命令行退出发行版也不会退出
                wsl -d <distro name>
            停止全部发行版
                wsl --shutdown
            停止特定发行版
                wsl --terminate <distro name>
            wsl2 支持嵌套虚拟
            导出第一个实例
                wsl --export <发行版名称> <导出文件路径>
            导入第一个实例
                wsl --import <新实例名称> <安装路径> <导出文件路径>
            导入导出例子
                导出 wsl --export Debian D:/debian-base.vhdx --vhd
                导入 wsl --import debian-email D:/debian-email D:/debian-base.vhdx --vhd --version 2
                启动新导入的实例 wsl -d debian-email
            安装完 wsl2 后就可以安装 Docker Desktop 了
            网络
                WSL 每次启动的时候都会有不同的 IP 地址
                获取宿主机ip 这个ip是可以用于和虚拟机通讯的
                    cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }'
                获取虚拟机ip 这个ip是可以用于和宿主机通讯的
                    hostname -I | awk '{print $1}'
                windows主机ip
                    ip route show | grep -i default | awk '{ print $3}'
                    在宿主机里运行 ipconfig ，网卡名字里带有 wsl 的ip也可以
                如果无法和宿主通讯，可能是被 Windows 的防火墙给拦截了
                如果需要从外部访问wsl2的网络服务还需要更复杂的设置
                https://learn.microsoft.com/zh-cn/windows/wsl/networking
            gui
                单一窗口
                    直接安装就可以运行了
                        sudo apt install x11-apps -y
                        安装完后就可以直接运行了 xeyes
                    如果安装失败就更新一下 apt ， sudo apt-get update
                    https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/gui-apps
                安装 snap
                    apt install snap
                    在 /etc/wsl.conf 里加入以下内容（如果不存在就新建一个）
                        vi /etc/wsl.conf
                        [boot]
                        systemd=true
                    退出 wsl
                    重启
                        wsl --shoutdown
                        wsl -d 发行版名称
                    snap install snap
                    snap install 需要安装的软件名
                    例如
                        snap install firefox
                        安装完后直接在命令行里运行 firefox 就可以了
                    还有字体的问题没有解决
                安装 flatpak
                        apt install flatpak
                    安装flatpakref后缀文件
                        flatpak install --from /path/to/flatpakref
                    查找已安装的包
                        flatpak list
                    启动应用
                        flatpak run <app id>
                有完整的桌面环境
                默认是使用 Wayland ，可以通过配置文件禁用 Wayland ，然后再自己装 x11 环境
                    https://ivonblog.com/posts/wsl-x-server/
                理论上还可以通过 Waydroid 来运行安卓应用
            取消 Windows 的路径
                WSL2 默认会将 Windows 的 $PATH 附加到 WSL 的 $PATH 中，这样就可以了在 WSL 中直接用 Windows 的命令和程序了，
                但 shell 中使用命令自动补全时产生了大量的无关程序。
                在 /etc/wsl.conf 中可以进行设置（如果没有这个文件就自己新建一个），里面加上
                [interop]
                appendWindowsPath = false
            跨文件系统
                在宿主机访问wsl
                    cmd 和 powershell
                        dir \\wsl$\debian-email
                    git for windows
                        ls "\\\\wsl$\\debian-email"
                        cygpath -u "\\\\wsl$\\debian-email"
                        ls //wsl$/debian-email
                    wsl$ 可以用 wsl.localhost 替代
                    debian-email 是镜像名
                在wsl访问宿主机
                    ls /mnt/c
            通过资源管理器直接访问 wsl 里的目录
                直接在地址栏里输入
                    \\wsl.localhost\镜像名
                    \\wsl$\镜像名
                例子
                    \\wsl.localhost\debian-email
                    \\wsl$\debian-email
                在 此电脑 右键 添加一个网络位置，输入这个路径，就可以像访问普通盘符一样访问wsl里的目录
            git
                虽然 git 安装在 wsl 可以同时操作 宿主机和wsl的文件
                但我个人还是比较倾向于宿主机和wsl各自安装一个git
                https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-git
            新版的 wsl 支持 直连显卡，这个对 机器学习而言似乎很重要，但我不会这个
    Docker Desktop
        windows 版的 Docker Desktop 通常用 wsl2 或 Hyper-V 作为后端
        官方并不推荐在 wsl2 里安装 docker ，而是直接在宿主系统安装 Docker Desktop 然后用 wsl2 作为后端
        安装完 Docker Desktop 就能直接使用 docker 和 docker-compose 命令了，但对应的 wsl2 实例要保持启用
    qemu
        qemu 的官网
            https://www.qemu.org/
        下载 qemu
            https://www.qemu.org/download/
            https://qemu.weilnetz.de/w64/
        关键的两个命令 qemu-img qemu-system-x86_64
        一般的流程
            下载iso文件
            创建镜像
                qemu-img create -f qcow2 debian11.img 30G
            启动虚拟机时通过iso文件安装系统
                qemu-system-x86_64.exe debian11.img -usbdevice tablet -cdrom C:\Users\a\Downloads\debian-11.5.0-amd64-netinst.iso
            安装完系统后启动虚拟机就不需要iso文件了
                qemu-system-x86_64.exe debian11.img -usbdevice tablet
            好像不用特别设置，就能联网了
            -usbdevice tablet 这个参数可以确保虚拟机内的鼠标不漂移
            -m 4096 -smp 4 限制内存和cpu
            -display vnc=:1 通过 vnc 启动
            加上硬件加速
                -accel whpx
                -accel whpx,kernel-irqchip=off
                在宿主机支持硬件虚拟化的前提下
                linux 用 kvm
                    x86 应该没问题， arm 要看具体的 cpu
                windows 用 whpx
                    不管是 x86 还是 arm 都可以
                mac 用 hvf
                    不管是 x86 还是 arm 都可以
                TCG
                    Tiny Code Generator
                    这是 qemu 的默认加速器，纯软件模拟，不依赖硬件
        qemu-img 镜像
            qemu-img create 创建镜像
                qemu-img create -f qcow2 debian11.img 30G
            qemu-img convert 转换镜像文件格式
                qemu-img convert -f 源类型 -O 目标类型 源磁盘映像路径 输出磁盘映像路径
                qemu-img convert -f vdi -O qcow2 androidImage.vdi androidImage.img
            qemu-img info 查看镜像文件格式
                qemu-img info debian11.img
            qemu-img --help
                在 help 的输出里可以看到支持的镜像格式 Supported formats
        qemu-system-x86_64 虚拟机
            qemu-system-x86_64 -version
            qemu-system-x86_64 --help
            qemu-system-x86_64 -m 4096 -smp 12 debian11.img -usbdevice tablet -accel whpx,kernel-irqchip=off
            qemu-system-x86_64 -m 4096 -smp 12 win10.img -usbdevice tablet -accel whpx,kernel-irqchip=off -machine q35
        图形界面
            GNOME Boxes
            virt-manager
            EmuGUI
    Hyper-V
    VirtualBox
    VMware
        墙内最流行的虚拟机我却几乎没有用过，虽然早年有 VMware Player 和现在的 VMware 也免费了，但我也一直没用，大概是因为不喜欢吧而且开源替代也很好用
    Bochs
        https://bochs.sourceforge.io/
        https://github.com/bochs-emu/Bochs
        专门的x86模拟器
        墙内似乎有很多人喜欢用这个在安卓里模拟 windows
    Multipass
        Multipass 是一个轻量虚拟机管理器，
        是由 Ubuntu 运营公司 Canonical 所推出的开源项目。
        运行环境支持 Linux、Windows、macOS。
        在不同的操作系统上，使用的是不同的虚拟化技术。
        在 Linux 上使用的是 KVM、Window 上使用 Hyper-V、macOS 中使用 HyperKit
    各种镜像格式
        raw qcow qcow2 cow vdi vmdk vpc(vhd) vhdx
linux 应用的一般启动套路
    至少一个启动脚本
        检测或启动一些前置依赖
        设置一些环境变量
    至少一个主体程序
        主体程序启动时会依次读取配置文件
            全局的 和 用户的
        配置文件可以有多种方式声明
        配置文件的声明有优先级且可以覆盖
            默认的配置
            全局的配置文件
            用户的配置文件
            环境变量
            命令行里的配置文件
            命令行参数
        一些配置在运行时也可以更改
        配置的优先级
            默认的 < 环境变量 < 配置文件 < 命令行参数 < 运行时修改
    配置文件虽然一些有约定俗成的规定，但通常依然会散落到各个位置
    通过包管理安装的软件和编译安装的软件往往会有一些差异
        （现在我似乎有一点理解为什么 Gentoo 会坚持编译安装软件了）
    程序配置的时机
        编译时，安装时，启动时，运行时
垃圾回收
    什么是垃圾
    为什么要进行垃圾回收
    手动回收 -> 就是 c c++ 那一套
    自动回收 -> 这是讨论得最多的，特别是那些搞 java 的
        引用计数
        四色标记
        标记-清除
        三色标记
        分代收集
    php的垃圾回收
打包和压缩
    打包和压缩是两个不同的过程，通常是先打包后压缩
        打包是把一个或多个文件（目录）合并成一个文件
        压缩是减少一个文件的体积
    一些软件只支持打包，一些软件只支持压缩，一些软件两个都支持
    压缩算法有很多种，可以单独地使用一种或组合地使用多种
    压缩又分为无损压缩和有损压缩
        根据信息论压缩是有极限的
        对于一般文件而言都是无损压缩
        只有对 图片 音频 视频 这类文件才会使用有损压缩
    tar
        tape archive (磁带 存档)
        大多数linux发行版都会有 tar
        git fow windows 里也有一个 tar
        原版的 tar 只支持打包，新版的 tar 能自动调用压缩工具，需要系统里也包含 gzip
        所以现在的 tar 命令能同时执行打包和压缩的操作
        windows10 1803 及以后的版本都内置了 tar
        unix 上有一个名为 ar 的工具，但现在已经被 tar 取代
            生成以 .a .ar 为后缀的文件
            ar 应该会和 compress 搭配使用吧。。。
        例子
            tar -cvf test.tar test
                把名为 test 的文件或目录打包，最后生成的文件命名为 test.tar
            tar -cvzf test.tar.gz test
                把名为 test 的文件或目录打包并使用 gzip 压缩，最后生成的文件命名为 test.tar.gz
            tar -cvjf test.tar.bz2 test
                把名为 test 的文件或目录打包并使用 bzip2 压缩，最后生成的文件命名为 test.tar.bz2
            c 新建打包文件
            x 提取所有文件
            v 显示打包和压缩的过程
            f 指定生成的文件路径
            z 使用 gzip 压缩或解压缩
            j 表示使用 bzip2 压缩或解压缩
            还可以这样显式指定压缩的算法，但通常都要先安装好对应的程序
                -j --bzip2
                -J --xz
                   --lzip
                   --lzma
                   --lzop
                   --zstd
                -z --gzip
                -Z --compress
                   --use-compress-program 指定特定的程序作为压缩程序
                -a --auto-compress 根据文件后缀自动选择压缩程序
                tar --zstd -cvf test.tar.gz test
                tar --use-compress-program=pigz -cvf test.tar.gz test
                tar -cf archive.tar.gz -I 'gzip -9 -n' subdir
                也可以通过管道的方式调用其它压缩程序
                tar -cf - subdir | gzip -9 -n > archive.tar.gz
        从 tar 的帮助信息来看，其实 打包 也有很多种格式
    压缩
        算法 压缩格式 容器格式
            哈夫曼编码（Huffman Coding）
            LZW (Lempel-Ziv-Welch)
            Deflate
            LZMA
            LZMA2
            brotli
            压缩 和 加密 似乎有紧密的联系
            压缩算法的专利保护，似乎只保护压缩，不保护解压
        工具
            lzip
                lzip 是一种基于 LZMA 算法的压缩工具
                成的文件通常以 .lz 或 .lzip 结尾
            xz
                xz 是一种基于 LZMA 算法的压缩工具
                成的文件通常以 .xz 或 .lzma 结尾
                xz 的压缩速度虽然慢，但 xz 5.2 之后的版本支持多线程
                xz 使用多线程
                    使用两个线程
                        tar cf - subdir | xz --threads=2 > archive.tar.xz
                    自动设置多线程
                        tar cf - subdir | xz --threads=0 > archive.tar.xz
                    在 tar 里调用
                        tar -cf archive.tar.gz -I 'xz --threads=0' subdir
            bzip2
                成的文件通常以 .bz2 或 .bz 结尾
            Info-ZIP
                zip 用于压缩
                unzip 用于解压
                大多数 linux 发行版包含 unzip 但不包含 zip
                在 windows 下是 wiz
                http://www.info-zip.org
            compress
                成的文件通常以 .Z 结尾
                compress 是一个古老的压缩程序
                使用 LZW 算法
                compress 用于压缩
                uncompress 用于解压
                gzip 基本取代了 compress
                以前还会预装在发行版里，现在要单独安装了
                在 debian 的安装命令
                    apt install -y ncompress
            gzip 和 gunzip
                gzip 用于压缩
                gunzip 用于解压
                大多数 linux 发行版包含的是这两个
                这两个是来自 GNU
                gzip 只能压缩单个文件，所以通常会配合 tar 一起使用
            7z
                7zfm.exe（7-zip File Manager）是7-Zip软件的GUI主程序，一般来说，只使用7zfm.exe就可以了
                7z.exe 是纯命令行工具
                7zg.exe 是7-Zip软件的GUI模块，也可以在命令行中使用，但会显示一个图形界面的进度窗口，7zfm实际上也是调用7zg
            windows 下的软件
                windows 的 explorer 能直接支持 zip ，从windows me开始
                现在的 win10 win11 好像也直接支持 tar 和 gzip 了
                winzip 也是商业软件，也支持多种格式
                winrar 支持 zip 和 rar 还有其它格式，是收费的商业软件，中国特供版有免费的但会有广告
                Bandizip 支持多种格式，有免费版和收费版
                国产全家桶里的压缩软件 好压 快压 速压 360压缩 2345压缩
    分卷压缩
        在linux环境下
            压缩完文件直接用 split 分割就可以了。。。
                两句命令
                    tar -zcvf test.tar.gz test; split -b 50m -d test.tar.gz test.tar.gz-
                一句命令
                    tar -zcf - test | split -b 50m -d - test.tar.gz-
                -b 50m 每个分片50m
                -d 使用数字编号
                - 来自标准输入
                test.tar.gz- 分片的前缀
            使用cat命令合并，要注意分卷文件的顺序，要按顺序合并
                cat test.tar.gz-* > test.tar.gz
                cat test.tar.gz-00 cat test.tar.gz-01 cat test.tar.gz-02 > test.tar.gz
            合并完后再解压
                tar -zxvf test.tar.gz
    自解压
        自释放压缩包（英语：self-extracting archive，缩写为SFX或SEA）是一种可执行程序，
        它包含一个被压缩的文件，以及一个用于提取压缩包内文件的计算机程序。
        此类压缩包不需要使用其他压缩程序就可以直接运行并解压缩。 
        主流的压缩软件都支持自解压，但 gzip 不支持
        在 linux 环境下的自解压？
        其实我觉得 自解压 可以作为软件的安装包
    密码保护
        在linux环境下
            压缩完文件直接用 openssl 加密就可以了。。。
                tar -zc test | openssl enc -e -des3 -salt -k 123456 -out test.tar.gz
            同样地，解密就是先用 openssl 解密，然后再解压
                openssl enc -d -des3 -salt -k 123456 -in test.tar.gz | tar -zxvf test
    压缩软件比较 https://en.wikipedia.org/wiki/Comparison_of_file_archivers
        性能比较
            压缩率 压缩速度 解压速度
        功能比较
            密码保护 加密文件名 支持unicode 分卷压缩 自解压 文件修复 是否支持多线程
        协议，价格，活跃状态比较
        xz 和 7z 的压缩率应该是最高的
        lzip 的压缩率低于 xz ，但 lzip 提供了一定的文件修复能力
        .iso .msi .msix .appx .deb .rpm .jar .war .crx .pkg .phar .docx 这些都是打包+压缩的文件
    HTTP 协议中的数据压缩 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Compression
        gzip
        br
            brotli 这种算法好像没有单独的命令行工具
            https://github.com/google/brotli
            https://github.com/google/brotli/blob/master/python/bro.py
            pip install brotli
            echo -n "123" | python -c 'import sys;import brotli;sys.stdout.buffer.write(brotli.compress(sys.stdin.buffer.read()))'
            https://docs.python.org/zh-cn/3/library/sys.html#sys.stdout
    zlib https://github.com/madler/zlib
    归档格式
        仅归档
        仅压缩
        归档并压缩
        软件打包和分发
        容器文件技术
    一些例子
        apt install zip unzip 7z-full 7z-rar
            7z-full 是 7z 的常规版，如果要让 7z 支持 rar 格式还需要格外安装 7z-rar
        把当前目录下的 wp-plugin 文件或目录 压缩成 wp-plugin.zip 文件
            zip -r wp-plugin.zip wp-plugin
            7z a -tzip wp-plugin.zip wp-plugin
wordpress
    word press 文字出版社
    word n. 文字
    press n. 出版社
    前置依赖
        php 和 mysql
    安装和配置
        直接下载源码就可以啦
        要先创建库，才能运行安装程序
    wp-cli
        下载和安装
            从 github 下载 wp-cli.phar ， 这是文档推荐的，下载到 wp的根目录里
                curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
                像这样使用 php wp-cli.phar --info
                然后可以搞一个别名 alias wp="php wp-cli.phar"
            通过 composer 安装
                通过命令行 composer require wp-cli/wp-cli-bundle
                通过配置文件，然后 composer install
                {
                    "require": {
                        "wp-cli/wp-cli-bundle": "*"
                    }
                }
                像这样使用
                    composer exec -v -- wp --info
                    ./vendor/bin/wp info
                别名
                    alias wp="composer exec -v -- wp "
                    alias wp="./vendor/bin/wp "
            wp-cli 还可以通过 docker 安装
        一般命令
            wp info
            创建 wp-config.php 文件
                wp config create --dbname=wp --dbuser=root --dbpass=1234
            运行 web server ，这个需要先创建 wp-config.php 文件
                wp server --host=127.0.0.1 --port=80
            忘记密码后用来修改密码的， 1 是userid
                php wp-cli.phar user update 1 --user_pass=password
        如果是使用 composer exec 来运行 wp server 则需要设置 compoer 的 timeout ， composer 的 timeout 默认是 300 秒
            通过配置文件设置
                {
                    "config": {
                        "process-timeout": 0
                    }
                }
            通过环境变量设置
            export COMPOSER_PROCESS_TIMEOUT=0
    WooCommerce 安装和配置
        示例数据
            商品数据
        支付方式
    页面构建器（page builder）
        Gutenberg
        Elementor
        WPBakery Page Builder
        Beaver
    其它常用的插件
        wp-cron
    如何开发一个插件？
        wp 没有composer
        wp 核心没有面向对象
        WordPress是由三大部分组成的，
            即WordPress核心、主题和插件
            主题：决定了网站的外观、设计、界面，基本上理解为访客所看到的网站的样子；
            插件：扩展WordPress核心的各种功能，达到自己网站的功能定制。
            WordPress开发，指的是主题和插件的定制开发。
        插件 基本上就是 函数 和 钩子(Hook)
            钩子又分为两类 动作(Actions)和过滤器(Filters)
            do_action apply_filter
            add_action add_filter
            remove_action remove_filter
            动作不需要返回值，动作是有副作用的，动作可以操作数据库和直接输出
            过滤器需要返回值，过滤器不应该有副作用
            简单来说，Action 用来添加功能，Filter 用来修改数据
            其实两种 Hook 的运作方式几乎一样，只差在增加 Action Hook 函式不需回传值
            例子
                add_action('example_action', function(){
                    echo 'example';
                });
                add_filter('example_filter', function($msg){
                    return $msg;
                });
                do_action('example_action');
                echo apply_filters('example_filter', 'example');
        最简单的插件例子，只需要一个文件 wp-content/plugins/example.php
        一般的例子，一个文件夹 wp-content/plugins/example/
        创建插件时需要的 3 个基础钩子是  register_activation_hook()，register_deactivation_hook()  和 register_uninstall_hook()。
            register_activation_hook 我们激活插件时会运行，我们可以使用这个钩子挂载一个函数来设置我们的插件，例如在数据表中添加一些默认设置。
            register_deactivation_hook 在我们禁用插件时运行，我们可以挂载一个清理插件数据的函数来清理一些临时数据。
            register_uninstall_hook 在我们卸载插件时运行，我们可以挂载一个清理插件所有数据的函数来清理数据库中不再需要的插件数据。
        插件的配置保存在哪里？
    如何开发一个主题？
    wp 有多少个入口文件？
    wp 的运行原理？
    如何调试 wp ？
    如何加速 wp ？
    在 wp 中如何使用 composer
        主题 和 插件 是可以通过 composer 安装的
        主题 在 composer 中的 type 是 wordpress-theme
        插件 在 composer 中的 type 是 wordpress-plugin 或 wordpress-muplugin ，通常都是 wordpress-plugin
        只要正确的修改 composer 的配置，就能把插件安装到对应的目录
        "extra": {
            "installer-paths": {
                "wp-content/plugins/{$name}/": [
                    "type:wordpress-plugin"
                ]
                "wp-content/themes/{$name}/": [
                    "type:wordpress-theme"
                ]
            }
        }
    能用于 wp 的 dockerfile 和 docker-compose.yml ？
    WP_HOME 和 WP_SITEURL 有什么区别
        WP_HOME
            是设置里的 wordpress address
            是 wp_options 表里的 home
            指的是 wordpress 的地址
        WP_SITEURL
            是设置里的 site address
            是 wp_options 表里的 siteurl
            指的是网站地址
        通常这两个值是一样的
        不一样的情况，例子
            网站根目录下有两个文件夹
                wordpress phpmyadmin
            WP_SITEURL 填的是 网站域名
            WP_HOME 填的就是 网站域名/wordpress
    如何给 woo 增加支付方式 ？
    wordpress 如何实现 国际化/多语言 ？
    wordpress 如何实现 群站 ？
    如何把 wp 建设成 询盘型的外贸企业站 ？
    如何把 wp 建设成 B2C外贸卖货网站 ？
    如何发货
        直接用这几个快递就可以了
            ups FedEx ems
        还要考虑 包装 和 打包 和 在包裹外面贴一个发货标签
        但发到海外可能需要海关申报这一类的？
            出境的海关 和 入境的海关
            海关申报这类需要找 申报代理
            一般的企业是没有进出口的资质的（这个门槛比较高，好像需要注册资本300万）
            一些快递公司也可以代理申报
                递四方 云途 燕文
        什么是海外仓？
        直接当普通的个人包裹寄到到外国应该也可以吧
    如何收款
        平台电商都有各自的收款渠道
        独立站如何收款
            stripe
            paypal
            注册需要的门槛？
    电商平台
        墙内
            淘宝/天猫/1688
            京东
            拼多多
        墙外
            速卖通/Lazada/阿里巴巴国际站
            亚马逊
            ebay
            shopee
            shopify
    在 wp 中如何跟踪物流信息？
        这个插件 17track ？
    遇到退款退货时要怎么处理？
    遇到纠纷时要怎么处理？
    WordPress如何使用SQLite？
        分两种情况，
        一是全新的WordPress站点，
        二是已经有数据的WordPress站点。
        https://make.wordpress.org/core/2022/09/12/lets-make-wordpress-officially-support-sqlite/
        https://wpmore.cn/wordpress-%e5%8f%91%e5%b8%83%e4%ba%86%e7%8b%ac%e7%ab%8b%e7%9a%84-sqlite-%e6%8f%92%e4%bb%b6.html
        既然可以使用 sqlite ，那么使用 PostgreSQL 也是可以的吧
            https://wordpress.org/support/topic/configuring-wordpress-with-postgresql/
            https://github.com/PostgreSQL-For-Wordpress/postgresql-for-wordpress
    如何寻找前1000个用户 https://github.com/naxiaoduo/1000UserGuide
接入 alipay+ 的过程
    注册和设置
    支付
    回调
    退款
    查询支付结果
各种帮助文件
    man info
    hlp chm hsx mshc h1s
    javadoc 和 javahelp
        javadoc 是文档生成器，生成的是 html 文件
        javahelp 类似于 chm ，也是用 html ，最后生成的是一个 gui 程序
    documentation generator 文档生成器
    这类东西在维基百科里被称为 帮助系统(help system)

如何用 history 和 hash 做一个路由
    初始化
    监听路由的变化
    匹配路由并渲染对应的内容
    放行不匹配的路由
如何用一条命令关闭windows的屏幕
    这一句只能运行在 cmd 里
        powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)
    这一段效果是一样的，能运行在 powershell 里，但一个 powershell 窗口只能运行一次，因为类型不能重复定义
        $Code = @'
        [DllImport("user32.dll")]
        public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);
        '@
        (Add-Type -MemberDefinition $Code -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)
    这一句效果是一样的，能运行在 powershell 里，但一个 powershell 窗口只能运行一次，因为类型不能重复定义
        (Add-Type -MemberDefinition '[DllImport("user32.dll")] public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)
如何用命令行打开windows的控制面板
    按下 Win 键 + R 键，打开运行对话框，输入 control ，然后按回车键
    在 cmd 或 powershell 或 其他终端里，输入 control ，然后按回车键
在没有管理员权限的前提下
    运行需要管理员权限的程序
        设置环境变量，通过 cmd 或 powershell 修改当前进程的环境变量，这个是不需要权限的
        set __COMPAT_LAYER=RUNASINVOKER
        export __COMPAT_LAYER=RUNASINVOKER;
        [Environment]::SetEnvironmentVariable('__COMPAT_LAYER', 'RUNASINVOKER', [EnvironmentVariableTarget]::Process)
    如果是安装程序，那么安装的路径不能在系统盘里，
        先把安装程序复制到 不是系统盘的目录，或者这个目录 %USERPROFILE%
        然后再设置环境变量
        安装的路径可以选择 %USERPROFILE%\AppData\Local
    修改环境变量
        只修改当前用户的环境变量，不修改系统的环境变量
        在 git for windows 中，可以修改这个文件来添加环境变量 /etc/profile.d/env.sh
        例如这样
            export PATH=/d/python-3.12.3-embed-amd64:/d/node-v22.11.0-win-x64:$PATH
    无法修改 hosts 文件
        自建一个 dns 服务，并设为网卡的首选dns
        https://github.com/NLnetLabs/unbound
        要记得把原本的 dns 设为转发地址
判断服务是否可用
    假设客户端是没有问题的情况下
    判断域名解释
        nslookup -debug test.com
        nslookup -debug -querytype=any test.com
        nslookup -debug -querytype=any test.com 8.8.8.8
        Resolve-DnsName test.com
        Resolve-DnsName test.com -type ALL
        Resolve-DnsName test.com -type ALL -server 8.8.8.8 
    判断是否能ping通
        ping -n 4 test.com
        ping -n 4 127.0.0.1
        traceroute -I 127.0.0.1
        Test-NetConnection -ComputerName "127.0.0.1" -InformationLevel "Detailed"
        Test-NetConnection -ComputerName "127.0.0.1" -TraceRoute -InformationLevel "Detailed"
    判断端口是否开放
        nc -v -i 1 127.0.0.1 801
        Test-NetConnection -ComputerName "test.com" -Port 80 -InformationLevel "Detailed"
        curl -v telnet://127.0.0.1:801
            如果连接成功，curl会显示Connected信息。如果一直显示Trying，则表示连接不通。使用Ctrl+C可以退出
        (echo >/dev/tcp/www.baidu.com/80) >/dev/null 2>&1 && echo "www.baidu.com 80 open"
            这个只能在 bash 中使用，如果一直没有输出，则表示连接不通。使用Ctrl+C可以退出
    判断服务是否可用
        http服务
            访问首页 curl -v -L http://test.com
            访问HealthCheck curl -v -L http://test.com/HealthCheck
        代理服务
            curl -v -L --proxy 127.0.0.1:6080 https://www.google.com.hk
            curl -v -L --ssl-no-revoke --proxy 127.0.0.1:6080 https://www.google.com.hk
            curl -v -L -k --proxy 127.0.0.1:6080 https://www.google.com.hk
在windows中，通过 pid 获取进程的命令行
    $process = Get-WmiObject Win32_Process -Filter "ProcessId = 49532"; if ($process) {return $process.CommandLine} else {return $null}
    Get-WmiObject -Class Win32_Process -Filter "name = 'php-cgi.exe'"
计算机科学的五次浪潮
    大型机     1945 第一台通用的电子计算机
    个人计算机 1975 微软成立
    互联网     1990 互联网Internet第一个网页浏览器WorldWideWeb由提姆·柏纳-李设计面世
    移动互联网 2007 iphone 的出现
    ai        2012 AlexNet
数据存储 data storage
    数据存储是指在不同类型的介质上保留数据以供计算机和其他设备使用
    分类
        模拟 和 数字
        易失性 和 非易失性
        存储介质
        存储层次结构
    存储介质
        光学
            光盘
                cd dvd 蓝光
        磁性
            磁盘
                硬盘
                软盘
            磁带
        半导体
            Flash memory （闪存）
        其它
            Paper data storage （纸张数据存储）
                打孔纸带
                打孔卡
                一维码
                二维码
            胶卷
            黑胶/留声机圆筒
            真空管
    存储层次结构
        主存储 一级
            寄存器
            cpu缓存
            内存
        辅助存储 二级
            硬盘
        近线存储 三级
            云存储
            不能立即用于 IO ，但可以在没有人工干预的情况下快速在线进行
        离线存储 脱机存储
            与三级存储不同，如果没有人工干预，它就无法访问
文件系统
    POSIX文件接口
    VFS
    FUSE
    文件系统
        FAT
            8 12 16 32 exFAT
        NTFS
        EXT
            1 2 3 4
        macOS
            HFS HFS+ APFS
        XFS
        ZFS
    云存储
        块存储
        文件存储
        对象存储
    网络存储
        NFS
        CIFI/SMB
        SCSI
        SAN
            iSCSI
            FC
            SAS
        NAS
        DAS
    链接文件和快捷方式
        链接文件 是 文件系统里的概念
        快捷方式 是 explorer.exe 里的概念
            windows 的快捷方式 更接近于 unix 里的启动脚本
                其实 linux 里的 窗口管理器 也会提供类似的功能，只是 linux 的桌面环境太过碎片化，很少有人留意到
硬盘
    硬盘 Hard Disk
        HDD Hard Disk Drive
        HHD Hybrid Hard Drive
        disk n. 磁盘；磁碟
        disc n. 圆盘；(计算机)磁盘，磁碟；
    逻辑结构
        就是文件系统
        簇 和 块
            簇 和 块是操作系统中最小的逻辑存储单位。操作系统与磁盘打交道的最小单位是磁盘块
            簇 cluster
            数据簇 data cluster
            分配单位 allocation unit
            块 block
        DOS 4.0版之后，术语cluster变成了allocation unit，但cluster仍然广泛使用。
        操作系统规定，一个簇中只能放置一个文件的内容，
        因此文件所占用的空间只能是簇的整数倍，
        而如果文件实际大小小于一簇，它也要占一簇的空间。
        所以一般情况下文件所占空间要略大于文件的实际大小，
        只有在少数情况下，即文件的实际大小恰好是簇的整数倍时，文件的实际大小才会与所占空间完全一致。
    物理结构
        盘片（platter）
        磁头（head）
        磁道（track）
        扇区（sector）
        柱面（cylinder）
        CHS
            cylinder-head-sector
            柱面-磁头-扇区
        磁盘容量计算
        磁道响应时间
        机械硬盘有 CHS ，那么固态硬盘的结构是怎样的？不一样的结构对文件系统会有什么影响？
    接口和协议
        物理接口
            sata
            mini-SATA(mSATA)
            SATA Express
            pcie
            m2
                M-Key
                B-Key
                B&M-Key
            u2
            sas
            AIC
        传输协议 总线
            sata
            pcie
            sas
        上层协议
            AHCI
            NVMe
            scsi
    什么是4k对齐，为什么需要4k对齐
各种文件的格式
    可执行文件，文档格式，音频格式，图片格式，视频格式
nas
    软件
        虚拟化
            PVE ESXi
        文件系统
            磁盘阵列
        操作系统
        网络
            内网穿透 和 动态代理
        应用
            网盘
            笔记
    硬件
        就普通的服务器，然后再加上 ups
        至少两块硬盘
    RAID
        Redundant Array of Independent Disks 独立磁盘冗余阵列，简称为「磁盘阵列」
        常见的 RAID
            0 1 5 6 10 50 53 60
    网
        宽带
            双路宽带？
        蜂窝移动通信网络
            双卡双待？
    电
        市电
        ups
        超级电容
    nas 有哪些流媒体解决方案？
        ftp
        smb
        nfs
        WebDAV
        DLNA
        Miracast
        单独建一个网站或app
            直出视频文件
            使用hls
    除了视频之外还可以继续有 音频 图片 文档 漫画 小说 游戏等等
    更多？
        成品 or DIY ？
        连接其它设备？物联网？智能家电？软路由？htpc？电视机顶盒？游戏主机？HomeLab？all in one？算存网分离？
            忽略 猫 和 路由 ？
        始终至少需要一个外网的服务器
        更多的存储设备
            用于冷备的硬盘
            网盘上再放一份数据？
        可以自建的其它服务？
            邮局 dns ntp web（博客，笔记，wiki，git，密码管理器，2fa/mfa/totp，rss阅读器） 旧的游戏
        放在哪里？体积？噪声？辐射？
        费用？
            硬件费用，电费，网费
    中年男人三大爱好
        nas 路由器 充电器
        路由器 和 充电器 有什么好折腾的？
和声音相关的笔记
    声音
        声音是振动产生的声波，通过介质（气体、固体、液体）传播并能被人或动物听觉器官所感知的波动现象
        物体是如何发出声音的
            声音是由物体振动产生的机械波，它可以在空气、水或者其他介质中传播。
        人是如何发出声音的
        人是如何感受声音的
            声波是通过空气传达到人的耳朵的（忽略骨传导的情况）
        振动 的本质是什么？
        波长 和 频率 的本质是什么？
        音质 音色 声调 响度
    音乐
        乐谱
            五线谱：是世界上通用的一种记谱法，数字1~7来表示音的高低，用短横线、附点、升降号等符号来表示音的时值和变化
            简谱：是指一种简易的记谱法
            六线谱：
                是专为吉他设计的谱。
                六线谱有六条线，每一条线代表一根琴弦，与吉他的弦一一对应。
                从上到下分别是1到6弦，上面细下面粗。线上的数字表示在吉他的第几品。
                六线谱主要有独奏（旋律）记谱、分解和弦伴奏记谱和扫弦节奏记谱三种方式。
            四线谱：
                和吉他谱很像，主要是用于尤克里里，也是上面细，下面粗，但是四条线，而且每条线跟吉他谱的不太一样。
                右边标识的是空弦音。四线谱也有数字表示品格位置，x表示按住和弦拨弦，↑↓表示扫弦方向。
        歌
            包含人声的
            纯音乐
            作曲 编曲 填词 演唱 演奏
        乐器
            按地域分，可分为西洋乐器、中国民族乐器、日本雅乐乐器等。
            按演奏方式分，可分为管乐器、弦乐器、打击乐器、键盘乐器等。
            按发声原理分，可分为气鸣乐器、弦鸣乐器、膜鸣乐器、体鸣乐器、电鸣乐器等。
        分类方式
        曲 和 词
        风格 和 流派
        交响乐 就是 管弦乐
钢琴
    分类
        三角琴 立式钢琴 电钢琴(Electric piano)、数位钢琴(Digital piano)、电子琴(Electronic piano)、合成器 的区别？
    组成
        琴键
            88 (1+2)+12*7+1
            85 12*7+1
            76 (1+2)+12*6+1
            73 12*6+1
            66 12*5+(3+2)+1
            64 (1+2)+12*5+1
            61 12*5+1
            49 12*4+1
            44 12*3+(4+3)+1
            37 12*3+1
            25 12*2+1
        脚踏板
            三角琴
                左踏板 柔音踏板
                中踏板 不理解有什么作用，但以我的水平大概率用不到
                右踏板 延音踏板
            立式钢琴
                左踏板 弱音踏板
                中踏板 静音踏板 就是降低音量用的
                右踏板 延音踏板
            电子琴/电钢琴
                单踏板 延音踏板
                三踏板 和 三角琴相同
        88 键是标准
            一组 = 7个白键+5个黑键
            低音区
                大字二组 (1+2) 1个白键+2个黑键
                2组
                    大字一组
                    大字组
            中音区
                3组
                    小字组
                    小字一组
                    小字二组
                最中间那一组被称为 中央C
            高音区
                2组
                    小字三组
                    小字四组
                小字五组 1 1个白键
    以右手为主，右手弹主旋律，左手弹和弦
        绝大多数乐谱都是只有右手的
    有哪些经典的曲目？
    怎样找到流行曲的乐谱？
    乐理是什么？
    左右合手似乎有一点困难
    乐谱里的信息并不完整
    钢琴与钢琴之间是有差别的
    这些都是什么？
        八度 音程 音组 音级 音名 音区 十二平均律
    我的耳朵可能听不出来，但可以把声音转换成图形用眼睛看？
    有没有一种软件或硬件可以把听到的音乐自动转换成乐谱？
    github
        https://github.com/Wscats/piano
        https://github.com/AutoPiano/AutoPiano
从符号到文学
    符号学（symbology）
        文字是一种符号，语言也是一种符号
        通产是现有语言后又文字
        所有文化当中，口语都是语言的默认形式
        符号学（symbology）的三个分支
            语法学 syntactics
            语义学 semantics
            语用学 pragmatics
        一般把语言看作是一种由三部分组成的符号交流系统：
            记号，意义和连接两者的符码
            记号 是输入
            符码 是函数
            意义 是输出
    语言学
        学习一门自然语言，大概就是在学习
            语音 文字 语法
        语言学里的 语言 和 言语 分别是指什么？
        语法学
            语法范畴 (Grammatical category) 或者叫做 语法特征（Grammatical feature）
            词类 (word class) 或者叫做 词性 (part of speech)
            词法 (Morphology)
            句法 (Syntax)
        语义学
            意义的研究
        语用学
            在上下文中的意思的研究
        语音学
            研究语音的产生
            人是如何发出声音的？
            人都有哪些发音器官？
        音系学
            研究语音的功能
            音素（phone）/音位（phoneme）
                某一语言中用于区别意义的最小语音单位
            音拍（mora）
                在大多数汉语中，每一个音节的长度几乎是一样的
                （例如普通话中，“酣”han和“哈”ha长度相同），
                可以说音节就是拍，
                因此，汉语历史上没有发展出独立于音节的拍的概念。
            音段（segment）
                可以简单但不严谨地理解为 音素 的同义词
            音节（syllable）
                辅音 元音 音调
        音韵学
            在汉语语境下的“音韵学、声韵学”通常指汉语音韵学
    符号学 -> 语言学 -> 传播学 -> 新闻学 和 广告学
    符号学 -> 语言学 -> 文学 -> 叙事学
    文字 -> 语言 -> 发声 -> 唱歌 -> 音乐
    光 -> 颜色 -> 配色 -> 绘画 -> 设计
    除此之外还要关注 信息论 和 心理学
    艺术是围绕 五感 进行的
        主要是 视觉 和 听觉
            文学也是艺术的一种？
    乔姆斯基 的理论？
    语文
        语言
            语音
                生理语音学
                物理语音学
                心理语音学
            文字
                拼音 -> 字母
                表意字
            语法
                语法范畴
                词类
                词法
                句法
        文学
            阅读理解
            写作
            文学内容
                文学作品所反映的社会生活和人类思想感情
            文学形式
                文学作品的外在表现方式，包括文学体裁、文学样式、文学语言等
教育学（Pedagogy）
    文理七艺
        博艺教育 Liberal arts
        文理七艺/自由七艺 seven liberal arts
            三艺 Trivium
                文法 grammar
                修辞 rhetoric
                逻辑 logic
            四艺 Quadrivium
                算术 arithmetic
                几何 geometry
                音乐 music
                占星（天文） astronomy
    古六艺
        礼、乐、射、御、书、数
        四书五经六艺
        汉代以来六艺亦指六经，即诗、书、礼、乐、易、春秋
艺术
    视觉艺术
        游戏
            游戏是第九艺术？
            五
                建筑、雕塑、绘画、音乐、诗歌
            六
                建筑、雕塑、绘画、音乐、诗歌、舞蹈
            七
                建筑、雕塑、绘画、音乐、诗歌、舞蹈、电影
            八
                建筑、雕塑、绘画、音乐、诗歌、舞蹈、戏剧、电影
            九
                电游，中国人吴冠军于1997年指称电子游戏为第九艺术，此说流行于中国。
                漫画，法国评论家Claude Beylie于1964年和评论家弗朗西斯·拉卡森于1971年指称漫画为第九艺术，此说流行于欧美。
            总而言之游戏也是一种艺术
    表演艺术
    文学
    生活方式
        烹饪 茶艺 调酒 咖啡 香水
天文（Astronomy）
    天体测量学（Astrometry） 研究天体运行的精确计算，预测日食或流星雨等现象
    天体力学（Celestial mechanics） 研究天体的力学运动和形状
    天体物理学（Astrophysics） 天体物理学试图用物理模型去解释宇宙的小到中尺度的结构
    宇宙学（Cosmology） 研究宇宙的起源和发展
    航空（Aeronautical Engineering） 大气层内的飞行
    航天（Spaceflight） 大气层外的飞行
    气象（meteorology） 做天气预报的
物理
    物质 能量 时间 空间
    物质本质上是 能量
    时间 和 空间 可以合并为 时空
    所以 物理的 本质 是 能量 和 时空
    数学和物理的交汇点在于数学为物理提供了一种语言和工具，以描述和预测自然现象。
    物理学和化学的交汇点主要在于它们都研究物质的基本组成和性质，但从不同的角度和尺度进行。物理学关注的是物质的基本粒子和力的规律，而化学则专注于物质的化学性质和反应。
    化学和生物学的交汇点在于它们共同探索生命过程中的分子机制。这一领域被称为生物化学，它研究生物体内发生的化学反应
    生物学和医学的交汇点在于它们共同关注生命过程及其对健康的影响。生物学提供了对生命现象的基本理解，而医学则将这些知识应用于疾病的预防、诊断和治疗。
    围绕这三个方面
        数学 物理 人
    两暗一黑三起源
        暗物质 暗能量
        黑洞
        宇宙起源 生命起源 意识起源
        还有反物质
    社会学 -> 心理学 ->  医学 -> 生物 -> 化学 -> 物理 -> 数学
    经济 -> 政治 -> 历史 -> 人类学 -> 医学 -> 生物 -> 化学 -> 物理 -> 数学
    数学和物理谁是本源？
各种笔记软件 或 gtd 或 wiki 或 pkm 或 思维导图 的总结
    笔记(note)
        印象笔记
        有道笔记
        思源笔记
        为知笔记
        云雀
        飞书
        OneNote
        Google Keep
        Obsidian
        Logseq
        Roam Research
        TiddlyWiki
        Flomo
        Notion
    gtd (Getting Things Done)
    pkm (Personal Knowledge Management, 个人知识管理)
    PIM (Personal Information Management, 个人信息管理)
    思维导图(mind map)
        DesktopNaotu
        jsMind
        MyMind
        freeMind
        freePlane
        TiddlyMap
    wiki
    各种图数据库
        neo4j
        JanusGraph
        HugeGraph
        OrientDB
        ArangoDB
        arcadedb
    还有类似的
        备忘录(memo)
        日历(calendar)
        任务管理(todo)
        看板(Kanban)
        知识库（Knowledge base）
        项目管理(Project Management System, PMS)
            Microsoft Project
            Redmine
            dotProject https://github.com/dotproject/dotProject
            产品生命周期管理（Product Life Cycle Management，PLM）
            产品数据管理（Product Data Management，PDM）
            https://zh.wikipedia.org/wiki/%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E8%BD%AF%E4%BB%B6%E6%AF%94%E8%BE%83
            类似的软件还有非常多
            番茄工作法
            四象限分类和时间盒子
            艾宾浩斯遗忘曲线
    总结一下需求
        收集 知识和信息
        整理 知识和信息
        方便地检索 知识和信息
        需要做什么
汽车，飞机和模拟器
    如何驾驶汽车
        汽车的分类
        汽车的组成
        自动驾驶
            openpilot
    如何驾驶飞机
        固定翼
            执照的种类
        直升机
            执照的种类
游戏机的模拟器
    平台
        街机 家机 掌机 pc 手机 其它
    类型
        ACT	Action	动作
        AAVG	Action Adventure Game	动作冒险
        FTG	Fighting Game	格斗游戏
        SLG	Simulation Game	模拟游戏
        MUG Music Game	音乐游戏
        RPG	Role-Playing Game	角色扮演
        MMORPG	Massively Multiplayer Online Role-Playing Game	大型多人在线角色扮演游戏
        RTS	Real-Time Strategy	即时战略
        FPS	First-Person Shooter	第一人称射击游戏
        SPG	Sports Game	运动游戏
        RCG	Racing Game	赛车游戏
    模拟飞行
        DCS
        X-Plane
        MFS
        FSX/P3D
    模拟汽车驾驶
        极品飞车 ea
        gt赛车 sony
        极限竞速 微软
        山脊赛车
        岸湾
        头文字D
        狂野飙车
        首都高赛车
    策略或模拟经营类的游戏
        文明 全面战争 P社四萌 城市天际线 坎巴拉太空计划
    小时候玩过的游戏
        碧海银沙
            炸弹人
            PANG 96
        红警
            95 2 尤里的复仇 3 起义时刻
        魔兽
            3 冰封王座
        国家的崛起
        帝国时代3
        罗马的复仇
        三国群英传
        极品飞车6
        fifa 2006
        街机
            战斧
            拳皇
            街头霸王
            合金弹头
            龙与地下城
            名将
            圆桌骑士
            忍者棒球
            恐龙快打
        掌机
            ga/gba
            psp
                三国志
                大航海时代
                真三国无双
        falsh
            闪客快打
            拳皇win
            死神与火影
            绿巨人
        暴力摩托
        大富翁
        qq游戏
            祖玛 泡泡龙 连连看 对对碰 泡泡堂
        qq空间
        网游
媒体相关的经验
    multimedia
    multi-media
    medium
    图像
    视频
    音频
    流媒体
    媒介
    媒体
    多媒体
    网络媒体
    社交媒体
    自媒体
    新媒体
    全媒体
    融媒体
    传统媒体或旧媒体
        书刊
        报纸
        广播
        电视
    出版物或出版品（英语：Publication）指以传播信息、文化、知识为目的的各种产品包括印刷品、电子产品的总称，属于传播文化知识的媒体。
    媒介 和 媒体 有什么区别？
    在中文互联网里，解释很混乱
    但让我感到欣慰的是，英文互联网里，解释也很混乱
    Media vs Medium vs Mediums
    个人的理解
        媒介 和 媒体 在旧时代的同义词
        媒介 和 媒体 在新时代，有不一样的含义
            媒介 是指 信息 传播的 载体，
                例如 报纸 广播 电视 这类
            媒体 是指 分发 信息的 机构 或 个人，
                例如 出版社 电台 电视台 自媒体
    媒质 又是 什么？
从ed到perl还有正则表达式
    qed ed ex vi vim grep sed awk perl
    qed
        quick editor
    ed
        editor
        编辑器ed 汇编器as 外壳shell 被称为早期unix三个关键要素
    ex
        extended editor
    vi
        visual
        源于ex的命令visual
    vim
        最初的简称是Vi IMitation（仿造的vi），随着功能的不断增加，正式名称改成了Vi IMproved（改良的vi）
        vim 有五个版本
            T   tiny
            S   small
            N   normal
            B   big
            H   huge
            多数情况下预装的是 small
            通过包管理器装的是 huge
            多数情况下 vi 也只是 vim 的别名
            多数情况下 ex 也只是 vim 的别名
            gvim 也是 huge
            gvim 也叫做 vim-gnome
        windows 下的vim就是gvim
            https://github.com/vim/vim-win32-installer
            https://github.com/vim/vim-win32-installer/releases
        vim 编译时可以通过这个参数来指定版本
            --with-features=huge
        vim 编译时可以通过这个参数来生成 gvim
            例如
                --enable-gui=gnome
        ./configure --help
            命令来查看所有可用的编译参数
        vim --version
            查看 vim 的版本，配置文件路径，可用的功能
    grep
        grep这个应用程序最早由肯·汤普逊写成。grep原先是ed下的一个应用程序，
        名称来自于g/re/p（globally search a regular expression and print，以正则表达式进行全局查找以及打印）。
        在ed下，输入g/re/p这个命令后，会将所有符合先定义样式的字符串，以行为单位打印出来。
    sed
        stream editor
    awk
        其名称得自于它的三位创始人的姓氏首字母
        Alfred Aho, Peter Weinberger, Brian Kernighan
    perl
        Practical Extraction and Report Language
        实用 提取 和 报告 语言
    emacs
        Editor Macros
        宏编辑器
    editor 编辑器
    text editor 文本编辑器
    word processor (WP) 文字处理器
        AbiWord
        Calligra Words
        OpenOffice Writer
        LibreOffice Writer
        Kingsoft Writer
        Microsoft Word
        WordPad
            Microsoft 在 Windows 11 24H2 中删除了写字板，并且没有继任者
    desktop publishing (DTP)
        Microsoft Publisher
        Adobe InDesign
        QuarkXPress
        LyX
    文本编辑器通常是处理纯文本 plain text
    文字处理器通常是处理富文本 rich text
    除了 vi/vim 和 emacs 的编辑器
        Neovim
        nano
        Pico (Pine composer)
    在浏览器中的富文本编辑器
    富文本编辑器，页面构造器，代码编辑器
        页面构造器（page builder）
        富文本编辑器（rich text editor）
        代码编辑器（code editor）
        文本编辑器（text editor）
            ACE
            Atom
            Code Mirror
            Monaco Editor
            codejar
            下面这三个都是 ECD
                Eclipse Che
                Eclipse Theia
                Orion
                Eclipse Cloud Development (ECD) https://wiki.eclipse.org/ECD
            https://en.wikipedia.org/wiki/Comparison_of_JavaScript-based_source_code_editors
            有哪些类似于 vscode 的编辑器
                能兼容 vscode 插件的
                    VSCodium
                    atom
                    fleet
                    ECD 三兄弟
                        Eclipse Che
                        Eclipse Theia
                        Orion
                不能兼容 vscode 插件的
                    brackets
                vscode 是基于 Monaco Editor
                brackets 是基于 Code Mirror
        视图
            源码（source code）
            分屏预览（SV, Split View）
            所见即所得（WYSIWYG, What You See Is What You Get）
            即时渲染（IR, Immediate Rendering）
        功能是否满足需求 活跃程度 是否可商用 是否免费 是否开源 文档是否完善
正则表达式



正则表达式的核心是匹配。
原始的正则表达是是没有替换的。
判断一个字符串是否符合正则表达式，就看有没有匹配结果。
正则表达式匹配的结果是一个数组。
正则表达式里，一个组括号就是一个分组，有多少个分组结果就有多少个数组，
有些语言的实现，有命名的分组是额外的，
例如 php 里，一个正则表达是有九个分组，然后有三个分组有命名，
结果就是 九个分组 + 三个有名命的数组。


Regular Expression
regexp
RegExp
REGEXP
re
RE
常规的表达式
规则的表达式
有规律的表达式
正则表达式


PCRE
Perl Compatible Regular Expressions
Perl 兼容正则表达式
PCRE 是一个用C语言编写的正则表达式函数库
PCRE C++实现版本是PCRE++
PCRE 是一个轻量级的函数库，比Boost之类的正则表达式库小得多。
PCRE十分易用，同时功能也很强大，性能超过了POSIX正则表达式库和一些经典的正则表达式库
和Boost正则表达式库的比较显示，双方的性能相差无几，
PCRE在匹配简单字符串时更快，Boost则在匹配较长字符串时胜出，
但两者差距很小，考虑到PCRE的大小和易用性，我们可以认为PCRE更值得考虑。
PCRE被广泛使用在许多开源软件之中，最著名的莫过于Apache HTTP服务器和PHP脚本语言、R脚本语言，
此外，正如从其名字所能看到的，PCRE也是perl语言的缺省正则库。


正则就是有规律的意思

在 linux 和 osx 下, 常见的正则表达式, 至少有以下三种:
	基本的正则表达式( Basic Regular Expression 又叫 Basic RegEx 简称 BREs )
	扩展的正则表达式( Extended Regular Expression 又叫 Extended RegEx 简称 EREs )
	Perl 的正则表达式( Perl Regular Expression 又叫 Perl RegEx 简称 PREs )


目前正则引擎有两种, DFA 和 NFA, NFA又可以分为传统型NFA和POSIX NFA.
	DFA Deterministic finite automaton 确定型有穷自动机
	NFA Non-deterministic finite automaton　非确定型有穷自动机
		Traditional NFA
		POSIX NFA

正则表达式在计算机科学中，是指一个用来描述或者匹配一系列符合某个句法规则的字符串的单个字符串。
在很多文本编辑器或其他工具里，正则表达式通常被用来检索和/或替换那些符合某个模式的文本内容。
正则表达式这个概念最初是由Unix中的工具软件（例如sed和grep）普及开的。
正则表达式通常缩写成“regex”，单数有regexp、regex，复数有regexps、regexes、regexen。

正则表达式零宽断言
(?=exp)	 零宽度 正向 先行 断言(zero-width positive lookahead assertion)，它断言自身出现的位置的后面能匹配表达式 exp 。
(?<=exp) 零宽度 正向 后行 断言(zero-width positive lookbehind assertion)，它断言自身出现的位置的前面能匹配表达式 exp 。
(?!exp)	 零宽度 负向 先行 断言(zero-width negative lookahead assertion)，它断言此位置的后面不能匹配表达式 exp 。
(?<!exp) 零宽度 负向 后行 断言(zero-width negative lookbehind assertion)，它断言此位置的前面不能匹配表达式 exp 。

断言用来声明一个应该为真的事实。正则表达式中只有当断言为真时才会继续进行匹配。


(exp) ：目标字符串需要匹配exp,并将该分组匹配的子文本保存到自动命名的组里；
(?<name>exp)：目标字符串需要匹配exp,并将该分组匹配的子文本保存到名称为name的组里

正则表达式的三个主要组件：锚点、字符集和修饰符。


零宽度断言，只有一个有效果？


常用分组语法
分类	代码/语法	说明
捕获
	(exp) 			匹配exp,并捕获文本到自动命名的组里
	(?<name>exp)	匹配exp,并捕获文本到名称为name的组里，也可以写成(?'name'exp)
	(?:exp) 		匹配exp,不捕获匹配的文本，也不给此分组分配组号
零宽断言
	(?=exp) 	匹配exp前面的位置
	(?<=exp) 	匹配exp后面的位置
	(?!exp) 	匹配后面跟的不是exp的位置
	(?<!exp) 	匹配前面不是exp的位置
注释
	(?#comment) 	这种类型的分组不对正则表达式的处理产生任何影响，用于提供注释让人阅读

(?> 子表达式 ) 	非回溯（也称为"贪婪"）子表达式。 	[13579](?>A+B+) 	"1ABB 3ABBC 5AB 5AC" 中的 "1ABB"、"3ABB" 和 "5AB"

常用的限定符/数量词
代码/语法 	说明
* 	重复零次或更多次
+ 	重复一次或更多次
? 	重复零次或一次
{n} 	重复n次
{n,} 	重复n次或更多次
{n,m} 	重复n到m次

*? 	重复任意次，但尽可能少重复
+? 	重复1次或更多次，但尽可能少重复
?? 	重复0次或1次，但尽可能少重复
{n,m}? 	重复n到m次，但尽可能少重复
{n,}? 	重复n次以上，但尽可能少重复


正则就是用有限的符号，表达无限的序列，


内置字符集对应的自定义字符集
	. 匹配除了换行符（\n）以外的任意一个字符 = [^\n]
	\w = [0-9a-Z_]
	\W = [^0-9a-Z_]
	\s = [ \f\n\r\t\v]
	\S = [^ \f\n\r\t\v]
	\d = [0-9]
	\D = [^0-9]


定位点
	^ 	默认情况下，必须从字符串的开头开始匹配；在多行模式中，必须从该行的开头开始。 	^\d{3} 	"901-333-" 中的 "901"
	$ 	默认情况下，匹配必须出现在字符串的末尾，或在字符串末尾的 \n 之前；在多行模式中，必须出现在该行的末尾之前，或在该行末尾的 \n 之前。 	-\d{3}$ 	"-901-333" 中的 "-333"
	\A 	匹配必须出现在字符串的开头。 	\A\d{3} 	"901-333-" 中的 "901"
	\Z 	匹配必须出现在字符串的末尾或出现在字符串末尾的 \n 之前。 	-\d{3}\Z 	"-901-333" 中的 "-333"
	\z 	匹配必须出现在字符串的末尾。 	-\d{3}\z 	"-901-333" 中的 "-333"
	\G 	匹配必须出现在上一个匹配结束的地方。 	\G\(\d\) 	"(1)(3)(5)[7](9)" 中的 "(1)"、"(3)" 和 "(5)"
	\b 	匹配必须出现在 \w （字母数字）和 \W （非字母数字）字符之间的边界上。 	\b\w+\s\w+\b 	"them theme them them" 中的 "them theme" 和 "them them"
	\B 	匹配不得出现在 \b 边界上。 	\Bend\w*\b 	"end sends endure lender" 中的 "ends" 和 "ender"


字符
	普通字符
	转义字符
	字符集
		内置字符集
		自定义字符集 []
	反义 ^
	数量词
	定位点
分组
	(exp)
	(?<name>exp)
	(?:exp)
	(?=exp)
	(?<=exp)
	(?!exp)
	(?<!exp)
	(?#comment)
	(?>exp)
分支条件
	| 	匹配以竖线 (|) 字符分隔的任何一个元素。 	th(e|is|at)
	(?( expression ) yes | no ) 	如果由 expression 指定的正则表达式模式匹配，则匹配 yes ；否则，匹配可的 no 部分。 expression 解释为零宽度的断言。 	(?(A)A\d{2}\b|\b\d{3}\b)
	(?( name ) yes | no ) 	如果 name (已命名或已编号的捕获组）具有匹项，则匹配 yes；否则，匹配可的 no。 	(?<quoted>")?    (?(quoted).+?"|\S+\s)
处理选项/模式修饰符/正则表达式选项
	i 	使用不区分大小写的匹配。
	m 	使用多行模式。 ^ 和 $ 匹配行的开头和结尾，但不匹配字符串的开头和结尾。
	n 	不捕获未命名的组。
	x 	忽略正则表达式模式中的非转义空白。
反向引用
平衡组/递归匹配


https://docs.microsoft.com/zh-cn/dotnet/standard/base-types/regular-expressions
https://docs.microsoft.com/zh-cn/dotnet/standard/base-types/best-practices
正则表达式的最佳实践
	考虑输入源
		受约束的输入
		不受约束的输入
			与正则表达式模式匹配的文本
			与正则表达式模式不匹配的文本
			与正则表达式模式大致匹配的文本
				由于开发此正则表达式时只考虑了要匹配的输入的格式，因此未能考虑与模式不匹配的输入。 这反过来会使与正则表达式模式近似匹配的不受约束输入的性能显著降低。
				开发模式时，应考虑回溯对正则表达式引擎的性能的影响程度，特别是当正则表达式设计用于处理不受约束的输入时。
				使用无效输入、接近有效的输入以及有效输入对正则表达式进行完全测试。
	适当处理对象实例化
		使用已编译的正则表达式，php貌似没有
	控制回溯
		在许多情况下，在将正则表达式模式与输入文本匹配时，回溯很重要。 但是，过度回溯会严重降低性能
	使用超时值
		这个好像只在 .NET 中有
	只在必要时捕获
		使用显式捕获
		使用这种不捕获的分组(?:exp)



PCRE 函数，就是preg开头的那些函数
filter_var
mb_ereg 系列函数
POSIX Regex 也有正则表达式，但现在基本不用了


// 匹配失败会返回 false ，匹配成功会返回原字符串
filter_var($string, FILTER_VALIDATE_REGEXP, ["options" => ["regexp" => "/^M(.*)/"]])

preg
php regular



grep （缩写来自Globally search a Regular Expression and Print）是一种强大的文本搜索工具


pattern
n.模式；方式；图案；模型
v.构成图案（或花样）；促成（某行为模式）；网络样式；式样；图形



不捕获
    不捕获就是在分组的前边加上?:，可以在不需要捕获分组的表达式中使用，加快表达式执行速度。
    就拿匹配<title>xxx</title>标签来说，通过分组可以简写为
    <(title)>.*</\1> 
    但是如果是(?:title),则\1就不能捕获到这个子组了，只能捕获第一个出现的非?:的分组作为\1
    同时注意(?:title)本身会在完整匹配中，只是不在子组中，注意和断言的区别
断言
    所谓断言，就是指明某个字符串前边或者后边，将会出现满足某种规律的字符串。
    就拿匹配<title>xxx</title>标签来说，我们想要的是xxx，它没有规律，但是它前边肯定会有<title>，后边肯定会有</title>，这就足够了。
    想指定xxx前肯定会出现<title>，就用正后发断言，表达式：(?<=<title>).*
    想指定xxx后边肯定会出现</title>，就用正先行断言，表达式：.*(?=</title>)
    两个加在一起，就是(?<=<title>).*(?=</title>)
    这样就能匹配到xxx，匹配的内容不包括断言的内容，即完整的匹配就是xxx，不会包含<title>和</title>,子组中也不包含。
对正后发和正先行的解释：
    其实掌握了规律，就很简单了，无论是先行还是后发，都是相对于xxx而言的，也就是相对于目标字符串而言。
    假如目标字符串后边有条件，可以理解为目标字符串在前，就用先行断言，放在目标字符串之后。
    假如目标字符串前边有条件，可以理解为目标字符串在后，就用后发断言，放在目标字符串之前。
    假如指定满足某个条件，就是正。
    假如指定不满足某个条件，就是负。
    断言只是条件，帮你找到真正需要的字符串，本身并不会匹配！


基本匹配
元字符
简写字符集
断言
标记
    i    不区分大小写：将匹配设置为不区分大小写。
    g    全局搜索：搜索整个输入字符串中的所有匹配。
    m    多行匹配：会匹配输入字符串每一行。

标记还有很多种
IgnoreCase	i	使用不区分大小写的匹配。 有关更多信息，请参见不区分大小写的匹配。
Multiline	m	使用多线模式，其中 ^ 和 $ 匹配每行的开头和末尾（不是输入字符串的开头和末尾）。 有关更多信息，请参见多行模式。
Singleline	s	使用单行模式，其中的句号 (.) 匹配每个字符（而不是除了 \n 以外的每个字符)。 有关详细信息，请参阅单行模式。
ExplicitCapture	n	不捕获未命名的组。 唯一有效的捕获是显式命名或编号的 (?<name> subexpression) 形式的组 。 有关更多信息，请参见仅显式捕获。
IgnorePatternWhitespace	x	从模式中排除保留的空白并启用数字符号 (#) 后的注释。 有关更多信息，请参见忽略空白。
sticky	y
unicode	u


一个经常被问到的问题是：是不是只能同时使用多行模式和单行模式中的一种？答案是：不是。这两个选项之间没有任何关系，除了它们的名字比较相似（以至于让人感到疑惑）以外。
事实上，为了避免混淆，在最新的 JavaScript 中，单行模式其实名叫 dotAll，意为点可以匹配所有字符，然而在指定该选项时，用的还是 Singleline 的首字母 s.


不捕获 分组能稍微提高正则表达式的性能

js 的正则表达式 和那种 规范化的正则表达式 是有一点不一样的
ECMAScript 匹配行为



    printf 中的格式化字符串 和 正则表达式 有没有关系？
    正则表达式 的 匹配 和 分组 是不一样的吗？
    邮箱的正则表达式 https://docs.microsoft.com/zh-cn/dotnet/standard/base-types/how-to-verify-that-strings-are-in-valid-email-format


regdos
正则表达式拒绝服务攻击


正则表达式引擎/风味对比
https://deerchao.cn/tutorials/regex/diffs.html



sed（意为流编辑器，源自英语“stream editor”的缩写）是一个使用简单紧凑的编程语言来解析和转换文本Unix实用程序。
sed由贝尔实验室的李·E·麦克马洪于1973年至1974年开发，并且现在大多数操作系统都可以使用。 
sed基于交互式编辑器ed（“editor”，1971）和早期qed（“quick editor”，1965-66）的脚本功能。
sed是最早支持正则表达式的工具之一，至今仍然用于文本处理，特别是用于替换命令。

ex命令是一个基于行编辑的文本编辑器，它是vi编辑器的前身。ex命令可以在不使用显示器的情况下，对文本文件进行编辑和修改。ex命令的名称来自于“extended”（扩展）的缩写，因为它比ed命令提供了更多的功能和选项

sed和AWK常被认为Perl的祖先和灵感来源，
并且影响了Perl的语法和语义，尤其影响了匹配和替换运算符。


特殊字符
正则表达式
记忆方式

换行符
\n
new line

换页符
\f
form feed

回车符
\r
return

空白符
\s
space

制表符
\t
tab

垂直制表符
\v
vertical tab

回退符
[\b]
backspace,之所以使用[]符号是避免和\b重复



匹配区间
正则表达式
记忆方式

除了换行符之外的任何字符
.
句号,除了句子结束符

单个数字, [0-9]
\d
digit

除了[0-9]
\D
not digit

包括下划线在内的单个字符，[A-Za-z0-9_]
\w
word

非单字字符
\W
not word

匹配空白字符,包括空格、制表符、换页符和换行符
\s
space

匹配非空白字符
\S
not space

0|1 ?
>=0 *
>=1 +

特定次数
{x}: x次
{min, max}： 介于min次到max次之间
{min, }: 至少min次
{0, max}： 至多max次


边界和标志
正则表达式
记忆方式

单词边界
\b
boundary

非单词边界
\B
not boundary

字符串开头
^
小头尖尖那么大个

字符串结尾
$
终结者，美国科幻电影，美元符$

多行模式
m标志
multiple of lines

忽略大小写
i标志
ignore case, case-insensitive
这个是只包含英文字母还是包含全部的拉丁字母？

全局模式
g标志
global


所谓回溯引用（backreference）指的是模式的后面部分引用前面已经匹配到的子字符串。
你可以把它想象成是变量，回溯引用的语法像\1,\2,....,其中\1表示引用的第一个子表达式，\2表示引用的第二个子表达式，以此类推。
而\0则表示整个表达式。
假设现在要在下面这个文本里匹配两个连续相同的单词，你要怎么做呢？
Hello what what is the first thing, and I am am scq000.
复制代码利用回溯引用，我们可以很容易地写出\b(\w+)\s\1这样的正则。


在正则里面，默认的正则规则都是与的关系所以这里不讨论。
而非关系，分为两种情况：一种是字符匹配，另一种是子表达式匹配。
在字符匹配的时候，需要使用^这个元字符。
在这里要着重记忆一下：只有在[和]内部使用的^才表示非的关系。
子表达式匹配的非关系就要用到前面介绍的前向负查找子表达式(?!regex)或后向负查找子表达式(?<!regex)。
或关系，通常给子表达式进行归类使用。
比如，我同时匹配a,b两种情况就可以使用(a|b)这样的子表达式。

正则表达式的基本组成元素可以分为：字符和元字符。

正则表达式到底是什么
    从字符出发
        单个字符
        多个字符
    循环与重复
        0 | 1
        >= 0
        >= 1
        特定次数
    位置边界
        单词边界
        字符串边界
    子表达式
        分组
        回溯引用
            前向查找
            后向查找
    逻辑处理

    常用的正则表达式
        电子邮件地址
        网址
        ipv4地址
        ipv6地址
        身份证
        手机号
        邮编

时间
    UTC（Universal Time Coordinated） 协调世界时
        根据原子钟计算出来的时间
    GMT（Greenwich Mean Time） 格林尼治标准时间
        这是以英国格林尼治天文台观测结果得出的时间，
        这是英国格林尼治当地时间，这个地方的当地时间过去被当成世界标准的时间。
    UTC 和 GMT 的联系
        协调世界时不与任何地区位置相关，也不代表此刻某地的时间，所以在说明某地时间时要加上时区
        也就是说GMT并不等于UTC，而是等于UTC+0，只是格林尼治刚好在0时区上。
        GMT = UTC+0
    常见的地区时间
        GMT（格林威治时间）
        CST（北京时间）
        PST（太平洋时间）
        CST（美国的中部标准时间）
        地区时间的缩写可能有重复，写成 UTC+8 这种可以避免歧义
    时间戳是 UTC 的时间戳
        Unix 时间戳是从1970年1月1日（UTC/GMT的午夜）开始所经过的秒数，不考虑闰秒。
        一个小时表示为UNIX时间戳格式为：3600秒；一天表示为UNIX时间戳为86400秒，闰秒不计算。
        在大多数的 Unix 系统中 Unix 时间戳存储为 32 位，这样会引发 2038 年问题或 Y2038。
    excel 的时间计算
    现代的报时方式
        短波授时
            频率范围：通常在3 MHz到30 MHz之间。
            传播方式：通过天波传播，适合远距离传输，但受天气和地形影响较大。
        长波授时
            频率范围：通常在30 kHz到300 kHz之间。
            传播方式：主要通过地波传播，覆盖范围广，信号稳定。
        短波和长波授时指的是使用的频率范围，既可以用低频电码也可以传播授时的声音
        低频电码授时
            全世界共有6个民用基站
            五地六局
            美国 英国 德国 日本 中国
            科罗拉多 伦敦 法兰克福 九州 福岛 商丘
            手表的六局电波指的就是 低频电码授时
            还可以通过耳机来伪造电波信号来完成授时
                https://blog.csdn.net/ufo2006/article/details/60955887
                https://github.com/bg6cq/web-bpc
                https://github.com/shogo82148/web-jjy
        卫星授时（gps授时）
            定位系统都有授时功能
                定位就是通过时间来实现的
        网络授时
            sntp 简单网络协议（Simple Network Time Protocol）
                ntp 的简化版，一般用在嵌入式设备
            ntp 网络时间协议（Network Time Protocol）
                在理想的局域网环境中可以实现超过1毫秒的精度。不对称路由和拥塞控制可能导致100毫秒（或更高）的误差。
                1秒=1000毫秒
                udp 123端口
            ptp 精确时间协议（Precision Time Protocol）
                亚微秒级
                1毫秒=1000微秒
                三个版本
                v1   IEEE 1588-2002
                v2   IEEE 1588-2008 不兼容v1
                v2.1 IEEE 1588-2019 兼容v2 不兼容v1
                v2 的精度能达到30纳秒
                应用在 金融 电信 数据中心 汽车
        电话授时
            国家授时中心的标准时间语音报时服务电话：029-83895117
            12117 授时电话平台
        电视授时
            新闻联播里的报时
        收音机的整点报时
    原子钟
    时间服务器
        这类设备一般被称为
            GPS time server
            ntp time server
            ntp server
    古早的报时方式
        晨钟暮鼓
        打更报时
        午炮报时
        落球报时
        点灯
        入夜仪式/马刀开香槟
    和时间相关的标准有哪些
国际化和本地化
    i18n Internationalization 国际化
    l10n Localization 本地化
    G11N Globalization 全球化
    先国际化再本地化
        本地单一市场 -> 国际化 -> 其它地区的本地化
    需要关注的要点
        文字 语言 时间/日期格式 单位（货币，质量，体积） 法律
    最终目标都是为了满足不同市场的需求，提升用户体验和市场竞争力。
    https://www.w3.org/International/questions/qa-i18n
    https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/
    https://en.wikipedia.org/wiki/Internationalization_and_localization
无障碍化
    Accessibility ，简称 A11y
    Web accessibility 网页可访问性
        有一个更好的翻译
        网页亲和力
    WCAG
        Web Content Accessibility Guidelines
        网页 内容 可访问性 指南
    障碍
        视觉
        听觉
        行动
        认知
    WCAG 2.1 包含有四个用于无障碍设计的关键原则，有时由首字母缩写 POUR 表示。这四个关键原则分别是：
        可感知：用户能否感知到相关 Web 内容？
        可操作：用户能否导航、输入数据或与 Web 内容进行交互？
        可理解：用户能否处理并理解呈现给他们的 Web 内容？
        强健：Web 内容是否可以按预期方式在各种浏览环境（包括旧版和新兴的浏览环境）中可用？
        可感知性、可操作性、可理解性和鲁棒性
        易于感知的（Perceivable）
        便于操作的（Operable）
        稳定理解的（Understandable）
        稳定耐用的（Robust）
    可访问性除了给残障人士使用外，还可以给文本浏览器使用
那些需要写代码但又不是软件开发的领域
    运维 网络 信息安全 嵌入式 物联网 游戏 gis 生物信息 高频交易 多媒体处理 数据分析 人工智能 3D打印
那些和计算机相关的学科
    工学 engineering
        机械工程 mechanical engineering
            机械设计制造及其自动化 机械制造及其自动化 机械工程及自动化
            材料成型及控制工程
            机械电子工程
            工业设计
            过程装备与控制工程
            车辆工程
            汽车服务工程
    EE Electrical Engineering 电气工程
    EE Electronic Engineering 电子工程
    power engineering 电力工程
    CS Computer Science 计算机科学
    CE Computer Engineering 计算机工程
    ECE Electronic and Computer Engineering 电子与计算机工程
    SE Software Engineering 软件工程
    EECS Electronic Engineering and Computer Science 电子工程与计算机科学
    IE Information Engineering 信息工程
    Communication Engineering 通信工程
    Telecommunication Engineering 电信工程
    CT Communication Technology 通信技术
    IT Information Technology 信息技术
    电子科学与技术
    微电子科学与工程
    通信 通讯 电信 电讯 这几个有什么关系和区别？
        电信 -> 电子通信
        电讯 -> 电子通讯
    机器 机构 机械 零件 这几个有什么关系和区别？
    科学 技术 工程 这几个有什么关系和区别？
    强电 和 弱电
        强电 和 电线 电路 供电 相关的
        弱电 和 电相关的，需要供电的设备
        电气工程 电力工程 算 强电
        电子工程 信息工程这些 算 弱电
    英文
        electrical appliance 电器
        electric ：[ɪˈlektrɪk] adj.电的，带电的，通电的，电动的
        electrical ：[ɪˈlektrɪkl] adj.电的，电气的
        electricity ：[ɪˌlekˈtrɪsəti] n.电流，电力
        electron n. 电子
        electronic adj.电子的
        electr 是一个词根
            al 是形容词的后缀
            ity 是抽象名词的后缀
        electric 和 electrical 都是形容词
        electric 和电气强相关 物体确实有电流通过 例如 电灯 electric light
        electrical 和电气弱相关 例如 电气工程 Electrical Engineering
        communication 通讯
        telecommunication 电信
        telegraph 电报
        telephone 电话
        telefax 传真
        Science n. 科学
        Technology n. 技术
        Engineering n. 工程
        Science and Technology n. 科技 科学和技术
    三论
        旧三论
            系统论、控制论、信息论
        新三论
            结构论、协同论、突变论
        还有一个 复杂系统科学
如何判断自己是否学会了某一项技能？
    特别是数学相关的？
        感觉看原理时一看就懂，实践时一做就错
从零开始学习数学建模
为什么网络上的文章作用不是很大？
    没有描述运行环境
    没有描述软件版本
    描述不够详细
        问题
        解决方式
    没有描述前置知识/背景信息
    一些信息或知识没有引用出处
    存在歧义的名词
        又有一个新问题，为什么总是出现有歧义的名词？
        歧义的名词
            从一开始就存在歧义
            翻译的问题
            营销名词
                特征
                    是新的，至少含义是新的
                    无法从字面理解具体含义
                    会被强调，是用来取代旧事物的新事物，是未来发现的方向
                为什么会出现营销术语
                    现有的市场已经饱和
                不能麻木相信营销术语
                不能完全否定营销术语
                因为是新名词，所以可以自己把握解释权
                对消费者 -> 买买买
                对投资人 -> 加大投资
                每隔一段时间就会有新的名词出现
        同一个名词有多种解释，同一个事物有多个名词
            这些都可能会导致知识的混乱
            这似乎是很普遍的现象
            一些是由翻译导致的，
            一些是由缩写导致的，
            一些是由错误的理解被广泛传播导致的，
            一些是营销名词故意混肴普通人的理解
        事物 和 名词
            可能是平行关系 可能是包含关系 也可能是没有关系
            同一事物不同部分的描述
            不同语境下，同一名词会有不同解释
            同一事物，在不同的发展阶段会有不同的名称
            可能是过去的名称依然在沿用，
            也可能是现在的名称太流行，也用于描述过去的版本
        在 计算机科学 里这个现象特别严重，不论中文还是英文
            其它领域也有类似的现象
            根据维基百科中的描述，数据挖掘也是一个营销名词，
            心理学 上的新名词，例如 x效应/x心理/x人格
            选取 一些属性 或 一些行为 ，然后就可以把有这些属性或行为的人称为 x效应/x心理/x人格 ，最后再扩大化解释一轮，加上其它属性和行为
            例子
                如果一个人有 a属性 b属性 c行为
                那么这种人就是 x效应/x心理/x人格
                这种 x效应/x心理/x人格 的人还会有 d属性 e属性 f行为

信息技术的本质是什么？
    现实 -> 数字？
财政、经济、金融
国家和社会的区别和联系
政治
历史
    过去发生的事
    对过去发生的事的总结
    对过去发生的事的评价
    过去的政治
企业
    总务 业务 管理
电子支付，区块链，数字货币
    名词
        数字货币 digital currency
        虚拟货币 virtual currency
        加密货币 crypto currency
        电子货币 electronic currency
        电子支付 electronic payment
        电子现金 electronic cash
        区块链 block chain
    电子支付
    区块链的相关介绍
        共识算法
        有哪些基于区块链的应用
    数字货币
    比特币的相关介绍(Bitcoin)
    除了比特币之外的主要的数字货币
        以太坊 (Ethereum, ETH): 以太坊是一个支持智能合约的区块链平台，允许开发者构建去中心化应用（DApps）。
        泰达币 (Tether, USDT): 作为一种稳定币，USDT 的价值与美元挂钩，通常用于在加密货币市场中作为交易媒介。
        瑞波币 (XRP): 瑞波币旨在为银行和金融机构提供快速、低成本的跨境支付解决方案。
        币安币 (BNB): 由币安交易所发行，最初用于支付交易手续费，现在也用于其生态系统中的多种应用。
        卡尔达诺 (Cardano, ADA): 一个以科学研究为基础的区块链平台，旨在提供更安全和可扩展的智能合约功能。
    比特币的衍生币
    以太坊(Ethereum)
    什么是智能合约(Smart Contract)
    交易所
        币安
    什么是NFT(非同质化代币 Non-Fungible Token)
    什么是元宇宙(Metaverse)
        元宇宙一词起源于1992年的科幻小说《雪崩》，是“元(meta)”和“宇宙(universe)”的合成词。
    什么是密码朋克(Crypto punk)
java
    命令行
        纯手工管理依赖和编译
        Ant
            ant 的作用类似于 make 并不能管理依赖
        Maven
            pom.xml
            Maven Wrapper
            在没有maven的年代是如何实现包管理的？
        Gradle
            Gradle Wrapper
        JavaBean
        JDBC（Java Data Base Connectivity,java数据库连接）
    gui
        AWT（Abstract Window Toolkit）
            Swing
                JFC （Java Foundation Classes， Java基础类）
        swt（Standard Widget Toolkit）
            JFace
        JavaFX
    web
        大致包括两部分
            客户端
                applet 和 java web start
                这两个都是过时的技术了
            服务端
                servlet 和 jsp
                jsp 也过时了
                servlet 虽然还活跃，但很少会直接写 servlet 了
        Applet（Application）
            Applet 是一个新造的单词，大意是小的应用程序
        servlet（Server Applet）
            四个作用域
                application
                session
                request
                page
        jsp（Java Server Page）
            jsp 就是 servlet ，jsp 最终都会被编译成 servlet 再执行
            JSP的视图代码可以是任何文本内容
                包括但不限于 html xml json txt
            jsp 文件里有两种内容
                模板数据/模板元素 -> 就是指 html 代码，就是指 静态内容
                jsp 元素 -> jsp 的标签 脚本 动作 指令。。。
            scriptlet
                <%  %>
                <jsp:scriptlet> </jsp:scriptlet>
            JSP声明
                <%!  %>
                <jsp:declaration> </jsp:declaration>
            JSP表达式
                一个JSP表达式中包含的脚本语言表达式，先被转化成String，然后插入到表达式出现的地方
                表达式元素中可以包含任何符合Java语言规范的表达式，但是不能使用分号来结束表达式
                <%= 表达式 %>
                <jsp:expression>表达式</jsp:expression>
            JSP注释(Comment)
                <%-- %>
                <% // %>
                <% /* */ %>
            EL（Expression Language，表达式语言）
                ${}
                隐藏对象
                el函数
                el自定义函数
            JSP Directives (jsp 指令)
                <%@ %>
                <jsp:directive.page attribute="value" />
                page 声明页面属性
                include 包含其它jsp页面
                taglib 导入标签库
                    JSTL(JSP Standard Tag Library，JSP标准标签库)
                    第三方标签库
                    自定义标签库
                    不过 jstl 和 el 通常要单独引入对应的 jar
            JSP Actions
                jsp:include 	在页面被请求的时候引入一个文件。
                jsp:forward 	把请求转到一个新的页面。
                jsp:param 	设置请求参数
                jsp:useBean 	寻找或者实例化一个JavaBean。
                jsp:setProperty 	设置JavaBean的属性。
                jsp:getProperty 	输出某个JavaBean的属性。
            九个内置对象
        tomcat
            普通的tomcat
                可以直接把 jsp 文件放进 tomcat 根目录里运行，就像 php 那样
                war 就是 jar 只是文件后缀不一样而已，打包命令是一样的
                war 也是直接放在tomcat根目录下的webapps
                    tomcat 默认情况下启动后会自动解压 war 的
            嵌入式的tomcat
            常见的 jar
                servlet
                jsp
                jstl
                jackson
                Apache Commons
                mysql-connector-java
                log4j
                sqlite-jdbc
            servlet 的一般目录结构
                .setting     一般的eclipse项目都有这个
                src          就是放源码的
                    要正确地编译servlet
                        编译时要加上tomcat下的lib包，虽然不是全都能用上，但没心思区分哪个有用哪个没用了
                        编译好的servlet要放在正确的目录里，一般是网站根目录的WEB-INF/classes目录下
                WebContent   这个是网站的根目录，一般把这个目录直接放到tomcat根目录下的webapps里就可以运行了，
                        放静态文件，jsp，lib，编译好的java类，一般会新建一些文件夹来放jsp文件
                    META-INF 不知道是放什么的
                    WEB-INF  放lib和编译好的servlet和其它java类的，也可以放一些不能被外部访问的文件
                        classes 编译好的java类，包含servlet
                        lib     放lib的，一般有servlet，jsp，和其它第三方的lib
                        web.xml tomcat的配置文件
                .classpath   一般的eclipse项目都有这个
                .project     一般的eclipse项目都有这个
        ssh
            Struts2
            Spring
            Hibernate
        ssm
            SpringMVC
            Spring
            MyBatis
        springBoot
            JPA (Java Persistence API, JAVA持久API)
            Thymeleaf
    eclipse
    java的debug是如何实现的？
        特别是 eclipse 里 tomcat 那种 debug
    旧时代的java
        java card
        jave me
        jave se
        jave ee
各种各样的版本
    versionn
    edition
如何测试高并发？
    压力机
    测试机
    怎样才能复现出 超卖 或 503 的情况？
收集各种镜像站点
    大学的
    https://mirrors.tuna.tsinghua.edu.cn/
    https://mirrors.bfsu.edu.cn/
    https://mirrors.ustc.edu.cn/
    企业的
    https://developer.aliyun.com/mirror/
    https://mirrors.cloud.tencent.com/
    https://mirrors.sohu.com/
    https://mirrors.163.com/
公共的cdn
    百度静态资源公共库 https://cdn.code.baidu.com/
    BootCDN开源项目加速服务 http://www.bootcdn.cn/
    七牛云免费开放公共库 https://www.staticfile.org/
    又拍云免费JS库 https://jscdn.upai.com/
    新浪云计算CDN公共库 https://lib.sinaapp.com
    jsdelivr https://www.jsdelivr.com
    cdnjs https://cdnjs.com/
淘宝的镜像
    https://registry.npmmirror.com/binary.html
    可以用来下载各种开发的软件 git for windows, selenium, node, python, ...
如何不登录微软帐号安装uwp应用
    找到应用网页链接，在 微软商店里选择，分享，复制链接
    在这个网站里搜索 https://store.rg-adguard.net/
    下载一个带有 .appxbundle 或者 .appx 后缀的文件即可 (版本区别)
    安装 uwp 应用时可能需要管理员权限
计算机自学指南 https://github.com/PKUFlyingPig/cs-self-learning
hello 算法 https://github.com/krahets/hello-algo
中文文案排版指北 https://github.com/sparanoid/chinese-copywriting-guidelines
中文技术文档的写作规范 https://github.com/ruanyf/document-style-guide
让长文章更容易阅读的十项原则 https://www.uisdc.com/10-typeset-make-article-readable
命令行的艺术 https://github.com/jlevy/the-art-of-command-line/blob/master/README-zh.md
微软的写作风格指南
    https://docs.microsoft.com/zh-cn/contribute/style-quick-start
    https://docs.microsoft.com/zh-cn/style-guide/welcome/
程序员延寿指南 https://github.com/geekan/HowToLiveLonger
人体系统调优不完全指南 https://github.com/zijie0/HumanSystemOptimization
程序员做饭指南 https://github.com/Anduin2017/HowToCook
开源软件指南
    https://github.com/github/opensource.guide
    https://opensource.guide/zh-hans/
GitHub中文排行榜 https://github.com/GrowingGit/GitHub-Chinese-Top-Charts https://gitee.com/GrowingGit/GitHub-Chinese-Top-Charts
中国程序员容易发音错误的单词 https://github.com/shimohq/chinese-programmer-wrong-pronunciation
收录基于Cloudflare的开源工具 https://github.com/zhuima/awesome-cloudflare
计算机教育中缺失的一课 https://github.com/missing-semester-cn/missing-semester-cn.github.io
版本控制软件比较
    git
        github
        gitlab
        gitee
        coding
    mercurial hg
        Bitbucket
    Subversion SVN
    Perforce
https://download.libsodium.org/libsodium/releases/
SSL双向认证

python + openssl
c + openssl

windows 更新 python
cmd 下
1、先通过 pip freeze > requirements.txt   将你的旧版本中的第三方库的名字，输出到requirements.txt 文件中。
2、卸载python，重启电脑
3、安装新的python ，安装时一定要添加选择path
4、重启电脑
5、pip install -r requirements.txt

git add articleList.json sitemap.xml rss.xml README.md; git commit -m "update auxiliary"

git reset --soft 884444e1fe8f918ffe1ab5ee53799a9a89d98869

php updateMetadata.php

node cli.js --build="updateMatedata" --config-host="https://f2h2h1.github.io" --config-sitename="f2h2h1's blog" --config-thirdPartyCode=true

node cli.js --build="createPage" --config-host="https://blog.complexcloud.site" --config-sitename="f2h2h1's blog" --config-thirdPartyCode=false

git checkout -- . ; git pull;
node cli.js --build="updateMatedata|createPage" --config-host="https://blog.complexcloud.site" --config-sitename="f2h2h1's blog" --config-thirdPartyCode=false

node cli.js --build="updateMatedata|createPage" --config-host="http://127.0.0.1:8022" --config-sitename="f2h2h1's blog" --config-thirdPartyCode=false

tar -zcvf UrsaMinor-`date +%g%m%d%H%M`.tar.gz UrsaMinor
tar --xz -cf UrsaMinor-`date +%g%m%d%H%M`.tar.xz UrsaMinor

不要同时提交两篇文章

新增一篇文章
    add [文章标题]
大幅更新某一篇文章的内容
    add section [文章标题] 更新的内容
    update section [文章标题] 更新的内容
    update article [文章标题]
只更新了一点内容
    update fraction 日期
    update fraction 20211223
    pwd; sleep 8000; git commit -m "update fraction "$(date +%Y%m%d); git push;
    date +%g%m%d%H%M
    date +%Y%m%d%H%M
修改 错别字 标点 格式
    update format
更新 sitemap 之类的文件
    update auxiliary 具体内容
    update auxiliary 日期
    update auxiliary 20211223
    update auxiliary article
    git commit -m "update auxiliary "$(date +%Y%m%d); git push;

静态文件的index.html ？
把 title 换成文章标题
压缩生成后的 html ？

有疑问的事
想了解的事
想做的事
需要做的事

学了那么多，感觉也都是 茴 字的四种写法

````
