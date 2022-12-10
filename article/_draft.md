# draft

```

如何实现一个web服务器
    拓扑结构
        星型
        环型
        总线
            以太网
        ...
    模型
        七层模型 (由 OSI 提出的)
            应用层
            表示层
                负责转化数据格式，并处理数据加密和数据压缩。
            会话层
                主要是用来管理网络设备的会话连接，建立会话，保持会话，断开会话
            传输层
            网际层
            数据链路层
            物理层
        四层模型 ip/tcp
            应用层
            传输层
            网际层
            网络接口层
        五层模型
            应用层 -> data (数据)
            传输层 -> segment (段)
            网际层 -> packet (包)
            数据链路层 -> frame (帧)
            物理层 -> bit (比特)
        各层常用的协议
            应用层
                http
                    0.9 1.0 1.1 2 3
                mqtt
                telnet
                ftp
                dns
                nntp
                irc
                xmpp
                ntp
                dhcp
                stmp
                pop3
                imap
            传输层
                tcp
                    建立连接 三次握手
                    断开连接 四次挥手
                    流量控制
                        滑动窗口
                    拥堵控制
                        慢开始 与 拥塞避免
                        快重传 与 快恢复
                dup
                icmp
            网际层
                ip v4 v6
                IPsec
            数据链路层
                以太网 (Ethernet)
        各层对应的硬件
            网关 (gateway)
            路由 (route)
            交换机 (switch)
            网桥 (bridge)
            集线器 (ethernet hub 又或者 简称 hub)
            中继器 (repeater)
            和安全相关的硬件
                IPS (Intrusion Prevention System) 入侵检测（旁路部署）
                IDS (Intrusion Detection System) 入侵防御（串行部署）
                FW (FireWall) 防火墙
                WAF (Web Application FireWall) 网页应用防火墙
                UTM (Unified Threat Management) 统一威胁管理
    路由表和路由算法
        静态路由
        动态路由
            迪达拉算法
    tcp 和 udp
    什么是socket
    从socket里读写内容
        一些限制
            输入输出只考虑 asni ，多字节编码不好处理，这里只关注网络连接
            一次通讯数据包最大的长度为 255 ，因为分包操作也挺麻烦的
        最简单的例子，服务端只输出一句话，客户端只接收一次服务端的输出就关闭连接
        一次只能接受一个客户端的 echo 服务器
        能接受多个客户端的 echo 服务器 rfc 862
        最简单的聊天室
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
            select poll epoll
        具体类型
            静态
            动态
                cgi
                fastcgi
            代理
                socket 双写
                反向代理
                正向代理
                    RFC 2616
                    RFC 7230
                    RFC 7231
                    RFC 1928 SOCKS5
                    pac
            websocket
        TLS

以开发软件为目标的计算机入门简明指南
    计算机入门的前置知识
        如果只做业务相关，需要 初等数学 外加一点 数理逻辑
        如果涉及数据库的，还需要一点 集合论
        如果涉及到一些高深的算法，可能还需要 图论 和 组合数学
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
        图灵机
        冯诺依曼结构
            以运算单元为中心
            数据和指令都以二进制编码
            数据和指令不加区别混合存储在同一个存储器中
            顺序执行程序的每一条指令
            由五个部件构成
                运算器 控制器 存储器 输入设备 输出设备
    计算机的发展历史
        早期工具
            算盘
            计算尺
        模拟计算机
            机械式
            电动式
        电子计算机
            继电器
            真空管
            晶体管
            集成电路
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
                    网络栈 其实可以算到驱动里，但现代操作系统的网络很重要
                系统调用
                外围程序
                    shell
            可以简单但不严谨地理解
                微内核 仅包括了创建一个系统必需的几个部分 进程调度 内存分配 文件系统
                宏内核 在 微内核的基础上加上 驱动 和 系统调用
        linux 系统的一般使用
    计算机语言
        机器语言
            指令集（机器指令的集合）
            机器指令
            微程序
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
            abnf
            实践
                四则运算
                    从左至右
                    有优先级的
                    能识别括号的
                lex/flex ， yacc/bison ， Antlr ， peg.js
                解释 ini yaml json xml
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
        ACID CAP BASE
        nosql 和 newsql
        mysql 的一般使用
    计算机网络
        网络模型
        各层中的协议
        使用系统api来读写网卡中的数据
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
    阮一峰 https://www.ruanyifeng.com/blog/
    廖雪峰 https://www.liaoxuefeng.com/
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
git仓库
    github中文社区，一些github仓库的索引 https://www.githubs.cn
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
    常用的拓展
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
    使用 git
        关闭自动刷新
            选项->拓展->git->autorefresh
            "git.autorefresh": false
    搜索文档内容的技巧
        排除 或 包含
            可以用 , 表示多个条件，例如像这样 .jmx,.js,.css,.less,.xml,.md
            可以用 * 表示通配 app/**/*Test.php
        匹配空行的正则表达式 ^\s*(?=\r?$)\n
    搜索文件的技巧
        ctrl+p 按文件名搜索
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
爬虫与反爬虫的经验
    爬虫
        无视 robots.txt
        使用正则表达式和 xpath 抓取数据
        修改 ua
        构造完整的请求包
        使用代理来规避请求频率的限制
        使用无头浏览器来执行 js
        即使速度慢也加载图片
        使用 playwright 这类工具打开页面，显示窗口，修改ua
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
        最终目标
            只允许人访问，频率不能太高，限制的内容不能被抓取
            完全杜绝爬虫是很难的，但可以尽量地提高爬虫的成本
        反爬虫的措施太猛可能会使搜索引擎也抓取不了内容
            通过搜索引擎爬虫的ua和ip地址的反查，单独做一个供搜索引擎抓取的版本
                https://developers.google.com/search/docs/advanced/crawling/verifying-googlebot
                https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers
                dns 反查 nslookup -qt=ptr 74.125.128.106
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
                姓名 性别 出生年月 期望工位 期望工资 入职时间
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
                应用场景
                如何使用
                    如何安装
                    基本使用
                    配置文件
                    api调用
                    在各种场景下的使用方式
                出现的背景
                    解决了什么问题
                常见问题及应对方法
                和其它同类软件的比较
                    有什么优势
                    有什么劣势
                底层实现原理
            递归式提问
                如何实现 x 功能
                实现 x 功能要注意些什么
                递归式寻找答案
                技术的边界
                    数学原理
                    物理实现
                        多线程 -> 锁 -> 异常和中断 -> cpu的指令 -> APIC
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
                    要传达出一种能力，我不会，是因为没有遇过，我的学习能力很强，只要我遇到了，我就能解决
                极端情况下的设计
                    例子
                        并发放大10倍甚至100倍
                        数据库的数据量放大10倍
                        响应的时间缩小10倍
                    如何应对
                        大公司披露的一些数据
                        成本和效率
                        人的感受
                        物理限制
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
                        api文档
                        项目的使用手册
                    项目能在本地完整地运行吗
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
                    至少描述一个缺点，但这个优点会促进工作
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
                什么时候会有面试的结果
                后续还有什么流程
                有针对新员工的培训吗
        如果一些问题面试官没有正面回答的，就不要追问了，不要把气氛弄得太尴尬
        如果觉得面试的公司没有太多诚意的话，就不要勉强自己
        如果是现场面试，还要观察一下公司的办公环境
        一天只面试一场，每次面试完都要记录下面试的过程（如果记不住，就带一支录音笔，手机的电池未必能续航这么久）
            例如，技术面有哪些问题，反问的时候对方是怎么回答的
            一方面可以查漏补缺，另一方面在收到多个 offer 时，可以更好地对比不同的公司
            列一个表格，对比各家公司的条件
                公司规模 办公环境 工作地点 是否双休 上班时间 有没有加班费 工资 试用期工资 试用期长度 社保 公积金 其它补贴（补充医疗 餐补 通勤补贴 通讯补贴 租房补贴） 奖金 期权 工作内容 技术栈 调薪或晋升体系 。。。
        去面试之前，一定要先认真地准备，最好预留一周的时间，认真地准备面试
            主要是复习各类基础知识和背面试题目
        可以先找几家不是目标公司面试，先积累一下面试的感觉
        先准备一周，然后随便面试一周，最后才是目标公司的面试
        面试的关键在于 预判面试官的问题，预判面试官对问题答案的期待
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
            不愿意或没有勇气跑路去大城市
            没有能力 润
            基础还是不够好
            准备不够充分
            面试时太紧张了，未能完整地向招聘的企业展示自己的能力
            一些情况下 OverQuality 也是面试失败的原因
        客观的原因
            市场已经萎缩 这是根本原因
                求职者多，岗位少
                招聘的企业会不断地提供入职的门槛，即使远超岗位要求
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
            特别是各种协议的实现，有时候 rfc 文档也未能会写清除，去看一下对应的开源实现是一个好的选择
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
如何进行技术选型
    要做什么
    当前有哪些资源可以使用
    我们能做什么
    时间限制？
    对项目发展的预期是怎样的
    大多数情况下，开发效率比运行效率重要
        因为大多数情况下，硬件成本比人力成本低
如何搭建一个邮件服务器
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
  原文链接 快照链接
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
    php的型框架
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
                域名解释
                    A 记录
                        @ 指向 ip
                    CNAME 记录
                        mail 指向 A 记录
                    MX 记录
                        @ 指向 CNAME 记录
                    TXT 记录
                        spf dkim dmarc
                    PTR 记录
                        域名 指向 ip
                mta Postfix
                    amavisd-new 调度 ClamAV 和 SpamAssassin
                    ClamAV 邮件反病毒
                    SpamAssassin 过滤垃圾邮件
                mda Dovecot
                mua webmail RainLoop
                opendkim
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
                ActiveMQ RocketMQ RabbitMQ ZeroMQ OpenMQ
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
颜色
    色彩模型 Color Model
        是一种抽象数学模型，通过一组数字来描述颜色
        RYB
            R:Red = 红色
            Y:Yellow = 黄色
            B:Blue = 蓝色
            减色模型
            油漆和颜料的三原色
        RGB
            R:Red = 红色
            G:Green = 绿色
            B:Blue = 蓝色
            三原色光模式
            色光三原色  红 绿 蓝
            加色模式 三种颜色加起来就是白色
            直角坐标
        CMYK
            C:Cyan = 青色，又称为'天蓝色'或是'湛蓝'
            M:Magenta = 品红色，又称为'洋红色'
            Y:Yellow = 黄色
            K:blacK = 黑色
            印刷四分色模式
            色料三原色  青 品红 黄
            减色模型 三种颜色加起来就是黑色
            直角坐标
        HSL HSI HSV HSB
            HSV 模型在1978年由埃尔维·雷·史密斯创立，它是三原色光模式的一种非线性变换。
            CSS3 支持 HSL
            圆柱坐标
            HSL = HSI
            HSV = HSB
            HSL
                色相 Hue
                饱和度 Saturation
                亮度 Lightness
            HSI
                色相 Hue
                饱和度 Saturation
                强度 Intensity
            HSV
                色相 Hue
                饱和度 Saturation
                明度 Value
            HSB
                色相 Hue
                饱和度 Saturation
                明度 Brightness
            在原理和表现上，HSL 和 HSB 中的 H（色相） 完全一致，
            但二者的 S（饱和度）不一样， L 和 B （明度 ）也不一样：
                HSB 中的 S 控制纯色中混入白色的量，值越大，白色越少，颜色越纯；
                HSB 中的 B 控制纯色中混入黑色的量，值越大，黑色越少，明度越高
                HSL 中的 S 和黑白没有关系，饱和度不控制颜色中混入黑白的多寡；（据说这里的 S 是指灰色）
                HSL 中的 L 控制纯色中的混入的黑白两种颜色。
            YUV
            Alpha
    色彩空间 Color Space
        色彩空间至少包含 色域 和 伽马值 和 白点
        CIE 1931 所有的人类可见色彩
        DCI-P3 一种应用于数字影院的色域
        Adobe RGB
        NTSC
        sRGB
    色域 (Gamut, Color Gamut)
        色域是一个三维空间？（大概是因为，大多数颜色模型都是三个参数）
        色彩空间与色域有些不同。大部分时候，两个单词可以互相调换
        色域是泛指在某种色彩模式下的整个可见光的色彩范围
        色域的词源来自音域
    饱和度
        饱和度被定义为一个 0-1 之间的值，它表示 RGB 三个分量中最大值和最小值的差距有多大
        HSV(HSB) 和 HSL 的饱和度计算公式是不一样的
    对比度
        对比度是画面黑与白的比值，也就是从黑到白的渐变层次。
        比值越大，从黑到白的渐变层次就越多，从而色彩表现越丰富。
        对比度对视觉效果的影响非常关键，一般来说对比度越大，图案越清晰醒目，色彩也越鲜明艳丽；而对比度小，则会让整个画面都灰蒙蒙的。
        高对比度对于图片的清晰度、细节表现、灰度层次表现都有很大帮助。
        测试颜色对比度 https://hexcolor.co/color-contrast-checker
    锐度
        锐度指的是增加分割画面区域的边缘线周边的对比度，从而达到刻痕的效果，使得内容更加锐利。锐化仅会影响少部分边缘像素的对比度，整个画面并不会受到大量的影响。
        由于人类视觉系统的特性，高锐度的图像看起来更加清晰，但是实际上锐度的增加并没有提高真正的分辨率。
    位深度 ColorDepth
        显示一个颜色需要用多少位
        位深度 1 能显示 2^1 种颜色
        位深度 2 能显示 2^2 种颜色
        位深度 8 能显示 2^8 种颜色
        位深度 16 能显示 2^16 种颜色
            5bitR 6bitG 5bitB
        位深度 24 能显示 2^24 种颜色
            这个数量已经接近人能分辨的全部颜色，被称为真色彩（true color），色彩 16.7M
                16.7M=16.7million16.7百万=1670万=2^24
            刚好一种颜色占用一个字节
        32 位深度，通常是指 24位深加上8位的alpha通道，alpha用来控制透明
    基本16色
        在HTML 4.01版本中，确定了16种颜色的英语名称
            CSS 标准 1 只接受 16 个基本颜色，称为VGA颜色，因为它们来源于 VGA 显卡所显示的颜色集合而被称为 VGA colors （视频图形阵列色彩）
        CSS2.1 橙色 orange
        CSS3
            透明 transparent
            X11颜色（或称SVG颜色）
            由于一些早期浏览器是 X11 应用程序，这些颜色大多数是 X11 命名的颜色列表，虽然有一点不同。SVG 1.0 是首个正式定义这些关键字的标准；CSS 色彩标准 3 也正式定义了这些关键字。它们经常被称作扩张的颜色关键字， X11 颜色或 SVG 颜色 。
    网页安全色
        网络安全色是当红色（Red）、绿色（Green）、蓝色（Blue）颜色数字信号值（DAC Count）为0、51、102、153、204、255时构成的颜色组合，它一共有 6 * 6 * 6 = 216 种颜色（其中彩色为210种，非彩色为6种
    网页最安全色
        关于网页安全色的文章，提到 22 种网页最安全色（包含一部分基本16色）
        https://www.asc.ohio-state.edu/wilkins.5/color/websafecolors.html
    配色
        单色配色
        互补配色
        近似配色
        三等分配色
        矩形配色
    彩虹
        红、橙、黄、绿、蓝、靛、紫
        红、橙、黄、绿、青、靛、紫
        红、橙、黄、绿、青、蓝、紫 (个人比较认可这种)
        红、橙、黄、绿、蓝、紫
    黑 红 绿 蓝 青 品红 黄 白 这八种颜色刚好是一个长方体的四个点
        b k g c
        m r y w
    互补色 对比色 在色域空间里，长方体对角线的颜色
    色环
        十二色
        中性色
            绿 紫
        暖色
            红 橙 黄
        冷色
            绿 蓝绿 蓝
        HSV 色环 就是普通的色环中间多了一个三角形用来选 饱和度 和 明度
        色环 其实 是一个三角型
            三个角刚好对应三种不同的色椎细胞
    类似色
        色环中相邻的两色
    一级色 原色 只有一种颜色
    二级色 间色 两种一级色混合
    三级色 复色/三次色 三种颜色混合
    色彩三要素
        色相
        明度
            明度，也称为色值或色调
        彩度
            色度指的是色彩的纯度，也叫饱和度或彩度
    格式
        rgb(128,128,128)
        rgb(ff,ff,ff)
        #128128128
        #ffffff
        名称
    其它
        生物
            感光细胞
                视锥细胞（cone cells）
                    蓝(Short) 绿(Medium) 红(Long)
                    S锥：短波锥细胞（short wave cones） 对短波长光敏感，峰值420nm
                    M锥：中波锥细胞（medium wave cones） 对中波长光敏感，峰值530nm
                    L锥：长波锥细胞（long wave cones） 对长波长光敏感，峰值560nm
                    色盲 缺少某一种色觉细胞
                    色弱 某一种色觉细胞较少
                视杆细胞
            灵长类三色，哺乳类二色，爬行类四色
            彩色视觉（color vision）是一个生物体或机器基于物体所反射，发出或透过的光的波长（或频率） 以区分物体的能力。
            通常情况下会用 波长 来区分不同的颜色
        物理
            颜色可以以不同的方式被测量和量化
            色彩属性和物理学中的光谱并不是完全对应的，物理学的人类可见光谱是有两个端点的直线形，并不能形成一个环。
            当然每种颜色都可以找到相应的光波长，但都有一个范围，并不是单一的波长。
            明度一般和具体某种颜色的光波能量相当，但和整个光谱的能量无关（因为每种波长的光的能量都不相同）。
            电磁波谱
                伽马射线 X射线 紫外线 可见光 红外线 兆赫辐射 微波 无线电波
                波长越短 频率越高
                波长越长 频率越低
                可见光
                    光学频谱，简称光谱，是复色光通过色散系统（如光栅、棱镜）进行分光后，依照光的波长（或频率）的大小顺次排列形成的图案。
                    光谱中的一部分可见光谱是电磁波谱中人眼可见的唯一部分，在这个波长范围内的电磁辐射被称作可见光。
                    光谱并没有包含人类大脑视觉所能区别的所有颜色，譬如褐色和粉红色，其原因是粉红色并不是由单色组成，而是由多种色彩组成的。
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
        autoconf 编译拓展必须的
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
    给composer里的库打补丁
        下载这个库 cweagans/composer-patches
            composer require cweagans/composer-patches
        在项目的根目录里新建一个 patches 文件夹
        在 patches 文件夹里新建补丁文件
        补丁文件通常是这样子的
            --- /Model/Product/Copier.php    2022-02-23 15:08:21.521148335 +0800
            +++ /Model/Product/Copier.php    2022-02-23 15:07:56.013242367 +0800
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
    火狐不显示图片
        about:config
        permissions.default.image 把这个值由 1 改成 2
    火狐输出命令行帮助
        在 git bash 里运行 firefox --help
        只有在 git bash 里有效，在 bat powershell 里都没有效果
        https://wiki.mozilla.org/Firefox/CommandLineOptions
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
分片上传 和 断点下载
    分片上传
        计算md5
        分隔文件
        计算每个分隔文件的md5
        ajax
        判断每个分隔文件的md5是否一致
        后台按顺序合并
        判断合并后的md5是否和原本的一致
    断点下载
        http头
        Range
        Content-Range
    实现例子 php 和 js
如何用 history 和 hash 做一个路由
    初始化
    监听路由的变化
    匹配路由并渲染对应的内容
    放行不匹配的路由
淘宝的镜像
    https://registry.npmmirror.com/binary.html
    可以用来下载各种开发的软件 git for windows, selenium, node, python, ...
如何不登录微软帐号安装uwp应用
    找到应用网页链接，在 微软商店里选择，分享，复制链接
    在这个网站里搜索 https://store.rg-adguard.net/
    下载一个带有 .appxbundle 或者 .appx 后缀的文件即可 (版本区别)
    安装 uwp 应用时可能需要管理员权限
中文文案排版指北 https://github.com/sparanoid/chinese-copywriting-guidelines
中文技术文档的写作规范 https://github.com/ruanyf/document-style-guide
让长文章更容易阅读的十项原则 https://www.uisdc.com/10-typeset-make-article-readable
命令行的艺术 https://github.com/jlevy/the-art-of-command-line/blob/master/README-zh.md
微软的写作风格指南
    https://docs.microsoft.com/zh-cn/contribute/style-quick-start
    https://docs.microsoft.com/zh-cn/style-guide/welcome/
程序员延寿指南 https://github.com/geekan/HowToLiveLonger
程序员做饭指南 https://github.com/Anduin2017/HowToCook
开源软件指南
    https://github.com/github/opensource.guide
    https://opensource.guide/zh-hans/
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
修改 错别字 标点 格式
    update format
更新 sitemap 之类的文件
    update auxiliary 具体内容
    update auxiliary 日期
    update auxiliary 20211223
    update auxiliary article

```
