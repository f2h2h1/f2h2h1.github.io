draft
================================

***

frp的使用
================================
1. 下载和安装
1. 作为 Windows 远程桌面的代理
1. 作为 xdebug 远程调试的代理
1. 作为代理使得本地的网站能被外网访问
1. 使用子域名的方式在本地部署多个网站


在vscode里调试java
================================
如何手工编译java的项目
一般的java项目
使用springboot的java项目
使用tomcat的javaweb项目
maven的使用


如何实现一个web服务器
================================
七层模型和四层模型
    各层常用的协议
    各层对应的硬件
tcp 和 udp
什么是socket
从socket里读写内容
    最简单的例子，服务端只输出一句话，客户端只接收一次服务端的输出就关闭连接
    一次只能接受一个客户端的 echo 服务器
    能接受多个客户端的 echo 服务器
    最简单的聊天室
http 静态服务
http + cgi
select poll epoll
多线程
多进程
socket 双写
proxy
fastcgi
websocket


seo 的经验
================================

社交媒体优化（英语：Social media optimization，缩写为SMO）是利用一些网点和社区进行宣传，提高产品，服务品牌或活动的认识。
所涉及的社交媒体类型包括RSS订阅，社交新闻和书签网站，以及社交网站，如Facebook，Twitter，影片分享网站和网志网站。
SMO类似于搜索引擎优化，其目的是生成网络流量和网站，并提高网站的认识。

seo
    域名
    url
    http 头
    html head
    html 标签
    html 布局
    网页内容
    网页外链
    sitemap 和 robots.txt
    js 和 css


SPA如何做SEO
一个看上去比较完美的方案是：腾出来一台服务器，搭建 phantomjs 。
定时手动抓取自己的SPA页面，生成纯正的静态HTML文件，当爬虫过来的时候根据UA，把蜘蛛带到phantomjs渲染好的页面上来，左右页面与url显示完全一致。
那这个问题基本就解决了。
当然你可能想到遇到改版怎么办？不要怕，毕竟是非常低频的事件，当改变之后跑一个脚本，重新抓取一下现有的页面重新生成一套就好了。
https://www.zhihu.com/question/24297390/answer/148331845
现在的搜索引擎应该能解释spa的



dns 反查
nslookup -qt=ptr 74.125.128.106


通过ua和dns反查
https://developers.google.com/search/docs/advanced/crawling/verifying-googlebot
https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers
服务端渲染后再返回给爬虫
速度慢
消耗性能
页面可能不完整

通用的seo
针对特定搜索引擎的seo


其实spa能有效地防止爬虫，搜索引擎的爬虫可以单独做一套ssr
图片等静态资源防盗链，http头里的Referer

以开发软件为目标的计算机入门简明指南
================================
## 计算机入门的前置知识
    如果只做业务相关，需要 初等数学 外加一点 数理逻辑
    如果涉及数据库的，还需要一点 集合论
    如果涉及到一些高深的算法，可能还需要 图论 和 组合数学
    如果涉及数据分析，还需要 概率论 和 数理统计
    如果涉及计算机图形，还需要 线性代数
    英语至少要有初中的水平 (要学会使用各类翻译服务 谷歌翻译 百度翻译 必应翻译 ...)
    递归是一个重要的概念
## 计算机学科的相关概念
## 计算机的发展历史
## 计算机的组成
    抽象的计算机组成
    显示的计算机组成
## 从二极管到指令集和汇编语言的抽象
## 操作系统
    环境变量
    抽象的操作系统
    linux 系统的一般使用
## 编程语言
    编译原理
    正则表达式
## 数据库
    抽象的数据库
        sql
    mysql的一般使用
## 计算机网络
## 软件工程
## 一些工具
    git 的一般使用
## 参考


各类安全问题及应对方法
================================
拒绝服务攻击
    dos
    ddos
    cc
旁观者攻击
中间人
sql注入
XSRF/CSRF
XSS/CSS
    反射型
    存储型
    dom 型
SSRF
文件上传
    上传木马
    zip炸弹
XXE


捕获前端的错误
================================
捕获异常
盲水印
外部数据要现判断是否存在再调用，不要把接口的数据直接渲染到视图
前端代码的配置要区分生产环境和开发环境
要把git的commitid写进配置文件里
打包时要保留map，map不能被外部访问
如何记录用户的操作？
    焦点移动
    鼠标移动
    滚动条的移动
    窗口大小的变化
    各种事件（键盘，鼠标，滚动条，窗口）的记录

一些博客
================================
淘系前端团队 https://fed.taobao.org/
百度前端 https://fex.baidu.com/
腾讯 Alloy Team http://www.alloyteam.com/
腾讯CDC https://cdc.tencent.com/
美团技术团队 https://tech.meituan.com/
360奇舞团 https://75.team/
小米信息部技术团队 https://xiaomi-info.github.io/


浏览器数据持久化缓存技术
================================
HTTP文件缓存
cookie
localStorage
sessionStorage
Application Cache 和 pwa 相关
CacheStorage 和 service worker 相关
WebSQL 关系型数据库，火狐不支持
IndexedDB 非关系型数据库
一些浏览器会对 favicon.ico 有特殊的缓存


使用 debian 作为日常用机的系统
    各类硬件驱动
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
    常用的拓展
        git
            Git History
            GitLens — Git supercharged
        php
            PHP Debug
            PHP Intelephense
            PHP IntelliSense
        其它
            vscode-icons
            sftp https://marketplace.visualstudio.com/items?itemName=Natizyskunk.sftp
            remote ssh
    显示空格
        "editor.renderControlCharacters": true, // 显示控制字符
        "editor.renderWhitespace": "all", // 渲染全部空白
    显示 .git 文件夹
        "files.exclude": {
            "**/.git": false
        },
    使用 git
    搜索文档内容的技巧
        排除 或 包含 可以用 , 表示多个条件，例如像这样 .jmx,.js,.css,.less,.xml,.md
        排除 或 包含 可以用 * 表示通配
        匹配空行的正则表达式 ^\s*(?=\r?$)\n
    搜索文件的技巧
        ctrl+p 按文件名搜索
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
        最终目标 抓取到完整的数据
    反爬虫
        站点使用https
        robots.txt 声名禁止爬虫
        内容里混杂不可见的无用的字符
        禁止爬虫的 ua
        内容需要认证才能显示
        限制请求频率
        内容需要执行 js 才能显示
        使用验证码
            是否加载图片
            判断 favicon.ico 是否有加载
            鼠标的移动轨迹
            判断 屏幕分辨率 浏览器高度 页面高度 这几个值
            无差别地随机出现
        防止页面的源码被获取
            js 的代码要经过打包，且不暴漏 map
            js 的代码里要有一个循环的 debugger
            js 的代码要检测开发者工具是否有打开，如果是就清空页面的内容
            js 的代码要检测是否在无头浏览器里打开，如果是就清空页面的内容
            js 的代码要检测是否在 selenium 等环境里，如果是就清空页面的内容
            js 的代码要判断当前的运行环境是否在 nodejs ，如果是就清空页面的内容
            禁用鼠标右键，禁用f12快捷键，禁止选中和复制
        最终目标 只允许人访问，频率不能太高，限制的内容不能被抓取
        反爬虫的措施太猛可能会使搜索引擎也抓取不了内容
            通过搜索引擎爬虫的ua和ip地址的反查，单独做一个供搜索引擎抓取的版本
如何应对面试
    递归式提问
    递归式寻找答案
    技术的边界
这些年来的生活经验 学习如何学习 如何定位问题 如何寻找问题的解决办法
    如何定位问题
        问题出现的环境
            浏览器版本 用户组 操作系统 之类的
        问题出现的业务场景
            注册 登录 浏览商品 下单 支付 之类的
        有没有错误输出
        寻找对应的日志记录
        了解完整的调用链路
    如何寻找问题的解决办法
        解决问题要从简单的例子入手
        把一个大的问题分解为多个小的问题，然后逐个解决
        在 搜索引擎里搜索
            bing 国内版
            百度
            bing 国际版
            google
            用英文在 google 上搜索
        在 q群里提问
            如何加q群？
            在qq添加那里直接搜索对应的关键字就可以了
            例如，直接搜 php 就会有php的群，然后就申请加入，最好一次多加几个，因为有可能不通过
            在 q群里提问可以以 酬谢 红包感谢 这类字眼结尾
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
            不考虑内存时间的消耗，内存不够就加内存，时间太久就升级cpu
        尝试换一种思路去解决问题
        问题解决之后要做一个记录
        如何描述问题
            描述目标
            描述问题
            描述问题出现的环境
            描述一下为解决这个问题做过的努力
        如何提问 https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md
如何写一篇xx管理系统的论文
使用正则表达式实现的关键词过滤
KiB 和 KB 和 Kb 和 Kbps 的联系与区别
如何做一个js库
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
如何定位和解决问题
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
        测试数据 fzaninotto/faker 虽然作者已经声名不维护了，但好像没有更好的实现
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
一些未能分类的经验
    如何做一个 composer 包
        申请一个 composer 账号
        新建一个 github 仓库
        clone 到本地
        在仓库根目录里运行这句 composer init
    如何给其它 github 仓库提交 pr
        假设已经拥有一个 github 账号
        fork 仓库
        clone 到本地
        在本地修改，提交，推送到 github
        新建一个 pr
一般的项目开发流程
    工具
        注册域名
        LDAP
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
                域名 mx 记录
                mta Postfix
                    amavisd-new 调度 ClamAV 和 SpamAssassin
                    ClamAV 邮件反病毒
                    SpamAssassin 过滤垃圾邮件
                mda Dovecot
                mua webmail RainLoop
            企业邮箱
            通讯录
                CardDAV
                ad 域或 ladp 的组织架构
        项目管理
        流水线
        git 仓库
        镜像仓库
        内部文档
            入职用的文档，让新成员能迅速地熟悉工作流程
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
magento2 配置 paypal
颜色
    色域是一个三维空间
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
    对比度
        对比度是画面黑与白的比值，也就是从黑到白的渐变层次。
        比值越大，从黑到白的渐变层次就越多，从而色彩表现越丰富。
        对比度对视觉效果的影响非常关键，一般来说对比度越大，图案越清晰醒目，色彩也越鲜明艳丽；而对比度小，则会让整个画面都灰蒙蒙的。
        高对比度对于图片的清晰度、细节表现、灰度层次表现都有很大帮助。
    锐度
        锐度指的是增加分割画面区域的边缘线周边的对比度，从而达到刻痕的效果，使得内容更加锐利。锐化仅会影响少部分边缘像素的对比度，整个画面并不会受到大量的影响。
        由于人类视觉系统的特性，高锐度的图像看起来更加清晰，但是实际上锐度的增加并没有提高真正的分辨率。
    YUV
    Alpha
    色彩空间
        CIE 1931
        sRGB
        Adobe RGB
        Adobe宽色域RGB
        DCI-P3
    位深度 ColorDepth
        显示一个颜色需要用多少位
        如果位深度 1 就是只能显示一种颜色
        位深度 2 就是能显示两种颜色
        位深度 8 就是能显示 2^8 种颜色
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
    配色
        单色配色
        互补配色
        近似配色
        三等分配色
        矩形配色
    彩虹
        红、橙、黄、绿、蓝、靛、紫
        红、橙、黄、绿、青、靛、紫
        红、橙、黄、绿、青、蓝、紫
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
    类似色
        色环中相邻的两色
    一级色 原色 只有一种颜色
    二级色 间色 两种一级色混合
    三级色 三次色 三种颜色混合
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
                视锥细胞
                    蓝(S) 绿(M) 红(L)
                    S锥：对短波长光敏感，峰值420nm
                    M锥：对中波长光敏感，峰值530nm
                    L锥：对长波长光敏感，峰值560nm
                    色盲 缺少某一种色觉细胞
                    色弱 某一种色觉细胞较少
                视杆细胞
            灵长类三色，哺乳类二色，爬行类四色
            彩色视觉（color vision）是一个生物体或机器基于物体所反射，发出或透过的光的波长（或频率） 以区分物体的能力。
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
                要显示声明字段
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
            适当使用nosql
                例如 momgo 和 es
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
        更换语言
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
            页面的动画效果尽可能用用css完成
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

版本控制软件比较
    git
        github
        gitlab
        gitee
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

新增一篇文章
    add 文章标题
大幅更新某一篇文章的内容
    add section 文章标题 更新的内容
    update section 文章标题 更新的内容
    update article 文章标题
只更新了一点内容
    update fraction
修改 错别字 标点 格式
    update format
更新 sitemap 之类的文件
    update auxiliary
