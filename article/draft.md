draft
================================

***

frp的使用
================================
1. 下载和安装
2. 作为 Windows 远程桌面的代理
3. 作为 xdebug 远程调试的代理
4. 作为代理使得本地的网站能被外网访问
5. 使用子域名的方式在本地部署多个网站


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


# 在vscdoe里调试c语言
# 使用 debian 作为日常用机的系统
# 浏览器和服务器通讯的方法总结
# vscode的使用技巧
# 爬虫与反爬虫的经验
# 如何应对面试
# 这些年来的生活经验 学习如何学习
# 如何写一篇xx管理系统的论文
# 使用正则表达式实现的关键词过滤
# KiB 和 KB 和 Kb 和 Kbps 的联系与区别
# 如何做一个js库
# 如何定位和解决问题
# spa 的 ssr
# 一些博客
# 一些文章
    原文链接 快照链接
# git的一般使用指南
# 如何制作一个php框架


自由软件托管服务比较
版本控制软件比较
除了git的其它版本管理工具
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

