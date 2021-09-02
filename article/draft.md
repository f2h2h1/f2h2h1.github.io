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
## 计算机学科的相关概念
## 计算机的发展历史


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


使用 debian 作为日常用机的系统
    各类硬件驱动
    网卡的配置
    apt源
    桌面环境
    deb snap
    中文输入法
    wine
    加入域
    一些常用的 gui 软件
        firefox
        vscode
vscode的使用技巧
    常用的拓展
    显示空格
    显示 .git 文件夹
    使用 git
    搜索文档内容的技巧
    搜索文件的技巧
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
        内容里混杂无用的字符
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
这些年来的生活经验 学习如何学习 如何定位问题 如何寻找问题的解决办法
如何写一篇xx管理系统的论文
使用正则表达式实现的关键词过滤
KiB 和 KB 和 Kb 和 Kbps 的联系与区别
如何做一个js库
如何定位和解决问题
spa 的 ssr
一些博客
一些文章
  原文链接 快照链接
git的一般使用指南
如何制作一个php框架
magento2 配置 paypal
数据结构和算法的学习笔记


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
一些未能分类的经验
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
    add section 更新的内容
    update section 更新的内容
只更新了一点内容
    update fraction
修改 错别字 标点 格式
    update format
更新 sitemap 之类的文件
    update auxiliary
