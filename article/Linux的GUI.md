Linux 的 GUI
================================

图形用户界面（Graphical User Interface，简称 GUI，又称图形用户接口）是指采用图形方式显示的计算机操作用户界面。

一个典型的 Linux 发行版通常包括：
- Linux 内核
- 一些 GNU 程序库和工具
- 桌面环境

一个 Linux 桌面环境 (DE, Desktop Environment)  (DE, Desktop Environment) 通常包含
- 窗口管理器 (WM, Window Manager) (WM, Window Manager)
- 显示管理器 (DM, Display Manager) (DM, Display Manager)
- 会话管理器 (Session Manager) (Session Manager)
- 一系列配套软件
    - 文件管理器
    - 终端模拟器
    - ......

## X Window System

X Window System = X11

X11 是一套在 类Unix 里实现 GUI 的规范，是雅典娜计划的其中一项成果。

X11 采用 C/S 架构， X服务器 和 X客户端 可以运行在不同的主机上。

X.Org 基金会是负责 X11 开发的团体。

X11 通常运行在 runlevel 3 和 runlevel 5
- runlevel 3 ，登录后进入命令行界面（就是一般的登录），可以在命令行界面里启动 X11
- runlevel 5 ，登录后进入图形界面

### X11 的组成
- X服务器 (X Server)
- X客户端 (X Client)
- X窗口管理器 (X Window Manager)
- X显示管理器 (X Display Manager)
- X会话管理器 (X Session Manager)

### X服务器
负责输出（输出给显卡，声卡）和接收输入（从键盘/鼠标等设备接收输入）的程序。

### X客户端
接收来自 X服务器 的数据，处理完后再发送给 X服务器 。

### X Protocol
X服务器 和 X客户端 进行通讯的协议。

### X窗口管理器
- 负责管理与定位窗口的移动、最大化、最小化、改变大小以及关闭等工作的程序。
- 理论上 X客户端 可以单独运行，但大多数情况下会先运行 X窗口管理器 再运行其它 X客户端 。
- X窗口管理器 是一个 特殊的 X客户端 。
- 通常情况下 X窗口管理器 是第一个连接 X服务器 的 X客户端 。
- 当视窗管理器开始运作时，X服务器和客户端之间的交互，会重定向到视窗管理器。
- 每当要显示一个新视窗时，这个请求便会被重定向到视窗管理器，它会决定视窗的初始位置。
- 此外，大部分较新的视窗管理器会改变视窗的亲属关系，通常会在视窗顶部加上标题栏，并在视窗周围加上装饰性的框架。

ICCCM
客户间通信协定手册（Inter-Client Communication Conventions Manual：缩写为 ICCCM 或 I39L）是X窗口系统的标准协议。
它规定有一个共同的X服务器的客户间的通信。它主要用于在窗口管理器和X服务器的其他客户之间的通信。

EWMH
扩展窗口管理器提示（Extended Window Manager Hints：缩写为NetWM或Net WM）是针对窗口管理器的X窗口系统标准。
它定义在窗口管理器、实用工具和应用等完整桌面环境的所有部分之间的各种交互。它建造在客户间通信协定手册（ICCCM）的功能之上。

### X显示管理器
Xdm 是 X Display Manager的缩写，由它来启动 X Window 服务器，并管理图形客户端程序的登录、会话(登录成功后开启新的session)、启动窗口管理器等。
简单但又不够严谨地理解为类似于 Windows 的登录界面。
X显示管理器 和 X服务器 之间使用 X显示管理器控制协议（XDMCP , X Display Manager Control Protocol） 通讯。

### X会话管理器
一个会话是指给定时间的桌面状态：一组窗口以及它当前的内容。更精确的说，一个会话是一组管理窗口或与窗口有关的客户端以及允许这些程序恢复所需窗口的相关信息。
通常，会话能在任意时刻保存或装载，即使用户没有登录或退出。保存一系列不同的会话并按用户的选择装载其中一个，这是可能的。也可以将一系列程序组合成一个会话。结果是，用户能够保存一些不同的会话，也能存储当前运行程序的状态或明确的将一些程序组合为一个会话。这样，用户可稍后决定装载某个会话。
为了能让会话包括程序的状态，程序必须能在适当的时候保存和装载它当前的状态。

客户端 和 会话管理器 之间使用 X会话管理协议 (XSMP , X Session Manager Protocol) 通讯。

依照XSMP协议，只要能够运行和控制其他程序状态的程序都可以是会话管理器。所以，一个客户端本身可以成为其他客户端的会话管理器。

### Xorg
Xorg 是 X.Org 基金会的 X11 开源实现，是 X11 的官方参考实现。

Xorg 的部分组件
- X.Org Server X服务器
- twm (Tab Window Manager) X窗口管理器
- xdm (X Display Manager) X显示管理器
- xsm (X Session Manager) X会话管理器
- Xlib X.Org 的 X客户端库
- Xt (X Toolkit) 在 Xlib 基础上封装的 X客户端库
- Xaw (X Athena Widgets) 在 Xt 基础上封装的 X客户端库

x11-apps 是 Xorg 的应用和工具的其他集合
https://www.x.org/wiki/UserDocumentation/GettingStarted/

X.Org 基金会的文档
https://www.x.org/releases/current/doc/index.html

## Wayland

## 流行的 Linux 桌面环境
- GNOME (GNU Network Object Model Environment)
- KDE (K Desktop Environment)
- XFce
- CDE (Common Desktop Environment)

## 其它
GNOME 和 XFce 是基于 GTK 的。
KDE 是基于 Qt 的。
CDE 是基于 Motif 的。

Qt GTK Tk 和 SDL 都是 直接调用 Xlib 的。
Xaw 和 Motif 是基于 Xt 的。

大多数 Unix 工作站会采用 CDE 作为桌面环境， 2012 年后 CDE 以 GPL 开源，此后 CDE 移植到其它 Linux 系统上。

Xaw 也是雅典娜计划的其中一项成果。

## 参考

https://en.wikipedia.org/wiki/Comparison_of_X_Window_System_desktop_environments

<!--


## 在 Debian 里使用 GUI

### 安装


de desktop environment
wm window managers


X11 X Window System



X11 或 Wayland
Qt 或 GTK+ 或 Motif
wm
de

X11
    X服务器
        X.Org Server（全称X.Org Foundation Open Source Public Implementation of X11）是X Window System的官方参考实现，它是开放源代码的自由软件。这一项目由X.Org基金会运作，存放于freedesktop.org的主机上。
    X客户端
    X窗口管理器
    X显示管理器 登录用的
    X会话管理器


X窗口系统包含了默认的会话管理器，名字叫xsm。特定的桌面系统也开发了自己的会话管理器：例如，ksmserver是KDE默认的会话管理器。
X Session Management Protocol (XSMP)
X 会话管理协议 (XSMP)指定程序与会话管理器该如何交互。特别重要的是窗口管理器能够与会话管理器通信，因为窗口管理器对窗口的位置和最小化有管理的责任。不能保存状态的程序也包括在会话中，但它们不能在会话中维持自己的状态。


客户间通信协定手册（Inter-Client Communication Conventions Manual：缩写为ICCCM或I39L即“I, 39个字母, L”）
是X窗口系统的标准协议。它规定有一个共同的X服务器的客户间的通信。它主要用于在窗口管理器和X服务器的其他客户之间的通信。


x server負責輸出（給顯卡）、接收鍵盤/鼠標的原始輸入等；
而每個工作在x上的應用程序是一個x client，
x server在接收到輸入後會將輸入發送到對應的x client。

Server运行在用户的本地机器上，在屏幕上完成低层的绘图操作。因为X Server直接向显卡发送信号，因此必须使用一个适合本机显卡的X Server，并配置好合适的分辨率，刷新率，颜色深度等，现在一般在/etc/X11/xorg.conf的文件就是Xorg Server的配置文件。 X Server通过鼠标和键盘监听用户的输入，并将键盘按键和鼠标点击传输给X Client，这些信息叫事件（event），它们构成了GUI编程的一个关键元素。它的逻辑扩展，MFC叫消息，GTK和Qt叫信号。

X Client是以X Window作为GUI的任何程序，如xterm，QQ和类似的更高级的应用程序，通常情况下，X Client等待X Server传送的用户事件，然后通过给X Server发送重绘消息来响应，X Client不需要和X Server运行在同一台机器上，这就是为什么xterm也能远程使用。

X Protocol X Client与X Server使用X Protocol进行通信，使得客户端和服务器能够在网络中分离，实际上是X Server和X display manager之间使用XDMCP（X Display Manager Control Protocol）协议进行通信，使用端口为UDP：177。

Xorg,X.Org Server是X窗口系统这一设计的参考实现，当前版本是X11R7.5,是一个对x窗口系统的具体软件实现.

Xdm是X Display Manager的缩写，由它来启动X Window服务器，并管理图形客户端程序的登录、会话(登录成功后开启新的session)、启动窗口管理器等。如果Xdm是在本地运行，它会启动X Server，就像命令行登录的init，getty和login所做的事情一样；如果Xdm在网络上某台计算机上运行，它的行为就如同一个telnet server，验证用户名与密码，然后开始一个远程会话（Remote Session）。

KDE,Gnome,deepin等桌面环境也提供了自己的xdm的实现，分别叫kdm和gdm,lightdm。

xwm窗口管理器是在图形用户界面的视窗系统中，控制窗口位置与外观的软件。它是负责管理与定位窗口的移动、最大化、最小化、改变大小以及关闭等工作,简而言之，就是给一个窗口加上最大化，最小化，关闭按钮标题栏和框架。Twm（Tom Window Manager）就是X.org提供的简单的窗口管理器。


GNOME Shell，是GNOME桌面环境3.0及其后续版本中的核心用户界面
GNOME Shell使用mutter作为窗口管理器


X显示管理器控制协议（XDMCP）


跟Windows和Mac OS X这些操作系统不一样的是，X并没有指定一个专用的窗口管理器，也没有定义窗口管理器的行为。正因为这个决定，今儿的我们才可以看到X下窗口管理器的多样性。
X不同于其他窗口系统的一个地方在于其没有指定一个窗口管理器。因为X的开发者希望X能够尽可能的摆脱窗口管理器和用户接口策略的影响。
事实上，X甚至根本不需要窗口管理器。



正如你已经知道的，X以一种服务端-客户端的架构运行。X的服务端能够控制多个物理显示设置和输入设备。应用程序以X客户端的角色来跟这些设备完成交互。当X服务端和客户端运行在同一台设备上的时，他们使用domain socket来进行通信。若处于不同的设备，他们可以使用TCP/IP来完成通信。

窗口管理器的本质上就是一个常规的X客户端，它并没有超级用户的权限来使用内核后门。对于X服务器而言，窗口管理器就是一个普通的用户进程，并且这个进程能够让X使用一系列的特殊APIs。
当一个客户端已经成功连接了这些特定API的时候，若有其他客户端试图连接，X会直接拒绝掉，通过这样的方式能够确保系统在任一时刻，至多只会有一个窗口管理器的存在。而第一个程序总是可以成功的连接上这些特殊的APIs。

当视窗管理器开始运作时，X服务器和客户端之间的交互，会重定向到视窗管理器。
每当要显示一个新视窗时，这个请求便会被重定向到视窗管理器，它会决定视窗的初始位置。
此外，大部分较新的视窗管理器会改变视窗的亲属关系，通常会在视窗顶部加上标题栏，并在视窗周围加上装饰性的框架。



twm（Tab Window Manager）是X窗口系统的窗口管理器。
twm是早年的突破性成就，但已经很大程度上被其他窗口管理器所超越，它们与twm不同，使用部件工具箱，而不再直接基于Xlib来书写。
twm仍是X.Org Server的标准，并可作为很多X窗口系统实现的一部分而获得到。



Intrinsics又名Xt或X Toolkit,是X Window的函式库。
Intrinsics首先提供面向对象的程式设计架构，并引进了“widget”的概念。Motif、OpenLook和Lesstif等即以Xt为基础。Athena Toolkit也是衍生自Xt Library。
但一些知名的工具箱如FLTK, GTK,和Qt并不使用Xt library,反是直接使用Xlib.

Xaw 和 Motif 是基于 Xt 的
QT 和 GTK 是直接调用 Xlib 的
Tk SDL 也是调用 Xlib 的


XCB（X C Binding）是一套以 C语言撰写，并用于绑定（Binding） X Window System之上。XCB是一套免费的软件，目标在于取代 Xlib。

Xlib 和 XCB 都是客户端库

X服务器
    X.Org Server
    Cygwin/X
    Xming


Unix /Linux最流行的桌面环境是：
    GNOME mutter
    KDE KWin
    CDE
    XFce Xfwm

CDE
Common Desktop Environment

KDE
K Desktop Environment

IEEE 1295


雅典娜(Athena)工程是MIT、DEC以及IBM的一个联合工程，本计划五年，在1988年1月又增加了三年，总共历时八年，于1991年6月30日告一段落。
该工程为解决如何将计算创新的应用到MIT的课程中，意图建立一个计算机环境，容纳多达一万台工作站，以及各种硬件，以保证不管是学生还是教职工都可以随时使用。用户可以访问其中的任何工作站，存取任何文件、程序，但在用户界面以及服务传递上，看起来不会有大的区别。
这个工程产生了许多现在被广为使用的技术，比如X Window System、Kerberos。雅典娜工程开发的其他技术包括Xaw部件工具箱、Zephyr通知服务、第一个即时通讯服务，以及Hesiod名，还有目录服务。

DEC
Digital Equipment Corporation
数字设备公司
1998年1月DEC公司被康柏(Compaq)以96亿美元的价格收购。
DEC 曾经生产过很多款流行的终端 vt50 vt52 vt100 vt220

康柏电脑，是由三位来自德州仪器公司的高级经理罗德·肯尼恩（Rod Canion），吉米·哈里斯（Jim Harris）和比尔·默顿（Bill Murto）于1982年2月分别投资1000美元共同创建的。2002年康柏公司被惠普公司收购。



GDM（由GNOME提供）
KDM（由KDE提供）允许用户在登录界面图形化的选择某个窗口管理器或桌面环境
XDM是X窗口系统的默认显示管理器


登录时直接打开图形界面
登录后才打开图形界面


窗口管理器 和 桌面环境 都可以算作 gui shell

EWMH
扩展窗口管理器提示（Extended Window Manager Hints：缩写为NetWM或Net WM）是针对窗口管理器的X窗口系统标准。
它定义在窗口管理器、实用工具和应用等完整桌面环境的所有部分之间的各种交互。它建造在客户间通信协定手册（ICCCM）的功能之上。


xinit
startx只是一个bash脚本，干活的是xinit
xinit先启动先启动X服务器，再启动基于X的应用程序


xinit是一个二进制文件，并非是一个脚本。通常位于/usr/bin下。它的主要功能是启动一个X服务器，同时启动一个基于X的应用程序。




运行级别
Linux拥有7个运行级别(runlevel)：
    运行级别0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动
    运行级别1：单用户工作状态，root权限，用于系统维护，禁止远程登陆
    运行级别2：多用户状态(没有NFS)
    运行级别3：完全的多用户状态(有NFS)，登陆后进入控制台命令行模式
    运行级别4：系统未使用，保留
    运行级别5：X11控制台，登陆后进入图形GUI模式
    运行级别6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动
我们启动X便就是从运行级别3启动X服务器，转至运行级别5。
启动X需要在运行级别3(默认)，切换运行级别：init [运行级别]，查看运行级别：runlevel



TTY原指电传打字机(Teletype)，在这里指虚拟控制台，也就是不启动X时的只有文本的界面。Debian系发行版默认开启tty1~tty6六个TTY，你可以使用Ctrl+Alt+F1~F6进行切换。(各发行版会有不同，根据实际操作)

X终端(XTerm)就是在X界面中虚拟终端(Virtual Terminal)的一种实现。
XTerm 是一个 gui 程序

DISPLAY
我们在桌面环境运行shell，输入set查看当前变量，可以发现有一个是DISPLAY=:0.0的变量，这决定了当前环境下X客户端在哪个X服务器上显示——这对于想要远程控制的朋友是很重要的(但是本文暂时不讲)。格式是DISPLAY=[主机名]:[显示界面号].[屏幕号]。主机名不需要多讲，可以为IP地址，为空代表本地主机；显示界面号是每个X服务器对应的号码，从0数起；屏幕号正如其名，多数情况不用管，常为0。PS：在原用户使用xhost +可允许其它用户将X客户端连接原用户的X服务器。

startx与xinit
startx、xinit和X(本体)均是启动X的方式，
理论上startx是xinit的壳子，而xinit又是X的壳子。
startx能自动帮你读取配置文件的参数。这些参数决定了X服务器的呈现方式、DPI、显示界面号等，决定了需要启动的X客户端(包括桌面环境)。
以下是命令参数：
startx [X客户端参数] -- [X服务端参数]
xinit [X客户端参数] -- [X服务端参数]
是的，这两个命令的参数是一致的，参数各有优先级，
如下(顺序排列)：
X服务器：
    命令后接的参数；
    ~/.xserverrc；
    /etc/X11/xinit/xserverrc；
    无参数则直接执行X。

X客户端：
    命令后接的参数；
    ~/.xinitrc；
    etc/X11/xinit/xinitrc；
    无参数则直接执行xterm。


在命令行里运行桌面环境
在命令行里运行单个的gui程序
登录时直接显示登录界面


Wayland 和 X 的区别是什么
这两个要怎么兼容对方

在本地
    登录时打开显示管理器
    进入命令行后
        打开桌面环境
        打开单个gui
在远程
    登录时打开显示管理器
    进入命令行后
        打开桌面环境
        打开单个gui

远程的 X 和 vnc 有什么区别
    远程的 X 的 xerver 运行在远程
    vnc 的 xerver 运行在本地

vnc 传输的是图像和控制信号


和 X 相关的配置文件有哪些


在安装的时候选这两个，就能有 gui 界面了
debian desktop environment
gnmoe


x11-apps 包含了一系列的 X11 的程序
- xeyes
- xclock
- xterm

xterm 是 虚拟终端， 是 X客户端 。
虽然不是 Xorg 发布的，但也包含在 x11-apps 里。


Display Manager完成三个任务：
1, X Server的启动;
2, X session的初始化;
3, X session的管理


Xfce 这个词的发音为X-f-c-e(即四个字母一个一个的读）
“Xfce”项目起源于1996年，"Xfce" 的名字最初是代表的是"XForms Common Environment"，这是因为起初开发使用XForms作为工具包。 但是之后Xfce被重写了两次并且放弃了使用XForms工具包。这个名字虽然仍被保留下来，但是它的全名英文缩写不再是 "XFCE"，而变成了"Xfce"。

XForms 是一个基于 Xlib 的 GUI 工具包

Widget toolkit
部件 工具包



窗口管理器根据管理窗口的方式不同，被分为几个门类。
    合成式窗口管理器(compositing window manager)
    堆叠式窗口管理器(stacking window manager)
    瓷砖式窗口管理器(tiling window manager)
    动态窗口管理器(dynamic window manager)



X Window System core protocol
X Window 系统核心协议

如何把 gui 程序塞进 docker 里？
真的可以这样吗？

-->
