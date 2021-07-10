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

seo的技巧
网页地址最有是友好的链接，就是不要带着 ? 的参数，如果一点要带上 ? 参数，那么参数越少越好
尽量避免使用子域，因为搜索引擎会将子域视为不同的实体，进而分割站点的 SEO 价值
尽量将 URL 与页面标题匹配
静态页面更容易收录，所以动态页面最好也搞一个伪静态的url重写
页面后端渲染
html head 里有seo关键词，title keywords description
网站上的每个页面最好具有唯一专用标题，这有助于搜索引擎了解该页面与您网站上其他页面的区别。
网站根目录里有sitemap，sitemap要写好
正确地填写这份文件 robots.txt 在网站根目录里
和其他网站互相有友好链接
html 里使用语义化的标签，不要全用div
尽量地使用 html5 里那些语义化标签
img 要有 alt 属性
alt 的描述不能太长
a 标签要能链接到实际的网址，不要用 js 转跳之类的
不需要收录的a链接要加上nofollow属性
如果你的页面有地域属性，可以添加如下代码：<meta name="location" content="province={信息所在省};city={信息所在城市}" />
少用iframe标签
采用web标准进行网站重构，就是html代码要符合标准，css最好也要符合相关标准
网站结构的扁平化规划，目录和内容结构最好不要超过3层，如果有超过三层的，最好通过子域名来调整和简化结构层数。另外目录命名的规范做法是使用英文而不是拼音字母
超链接采用有意义的“文本链接”和Title属性的使用
页面HTML代码大小不要超过200K
增加首页到内页和内页到首页的链接通路
避免表格的嵌套，表格嵌套不要超过三层
url 路径最好用小写英文字母
url 使用 - 避免使用驼峰式拼写、下划线和空格。
尽可能避免在网址中使用会话ID。您可考虑改用Cookie。
url 要尽量保持简单，搜索，分页，排序这类 url 可以用robots.txt文件阻止搜索引擎访问
主动地提交网站地址给搜索引擎
网站要使用 https
网页里的链接要尽量也是 https
网页里的链接要保持有效的
将网页上的链接数量限制在合理范围内（最多几千个）。
确保您的网络服务器能够正确地支持 If-Modified-Since HTTP 标头。此功能可指示您的网络服务器告诉 Google，自我们上次抓取您的网站以来，您的内容是否发生了变化。支持此功能可以节省带宽和开销。
单纯为了视觉效果的图片应该使用 css 引入，其它的图片应该使用 img 标签引入
使用有意义的 HTTP 状态代码
显示实用的 404 页面
网站内容要有效，最好是优质的
避免投放会分散用户注意力的广告
使用简短但具有描述性的文件名和替代文本，就是图片或其它文件的文件名最好有意义
http 都和 html 文档里都应该指明编码，且两个编码要一致
在搜索结果里显示网站图标 <link rel="icon" href="/指向/网站图标/的路径.ico">， robots.txt 不要阻止访问 ico 图片

如果是 google 的 seo 可以添加结构化数据标记，这样可以更好地呈现搜索结果
如果是 google 的 seo 可以使用面包屑导航 https://developers.google.cn/search/docs/data-types/breadcrumb

移动设备的兼容性，可访问性，网站质量在未来也会影响到seo
最好还要考虑一下 Lynx 这样的纯文本浏览器的访问性


显示实用的 404 页面
用户偶尔会因点击损坏的链接或输入错误的网址而转到您网站上不存在的网页。
使用自定义 404 页面30 能够有效引导用户返回到您网站上的正常网页，从而大幅提升用户的体验。
404 页面最好包含可以返回根网页的链接，还可以提供指向您网站上热门内容或相关内容的链接。
确保您的网络服务器配置为：当请求访问不存在的页面时，返回 404 HTTP 状态代码；如果是使用 JavaScript 的网站，则包含 noindex 漫游器元标记


成人内容 或 儿童内容 需要显式声明

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



SEO方法分为三大类：（就是 技术 内容 外链）
技术
    使用语义标记内容HTML. 浏览网站时，抓取工具应该只找到您要编入索引的内容。
撰稿
    使用访问者的词汇编写内容。 使用文本和图像，以便抓取工具可以理解主题。
声望
    当其他已建立的站点链接到您的站点时，您获得最多流量。



谷歌有一个非常完善的教程，可能需要翻墙
https://developers.google.cn/search/docs
https://developers.google.cn/search/docs/beginner/seo-starter-guide




SPA如何做SEO
一个看上去比较完美的方案是：腾出来一台服务器，搭建 phantomjs 。
定时手动抓取自己的SPA页面，生成纯正的静态HTML文件，当爬虫过来的时候根据UA，把蜘蛛带到phantomjs渲染好的页面上来，左右页面与url显示完全一致。
那这个问题基本就解决了。
当然你可能想到遇到改版怎么办？不要怕，毕竟是非常低频的事件，当改变之后跑一个脚本，重新抓取一下现有的页面重新生成一套就好了。
https://www.zhihu.com/question/24297390/answer/148331845
现在的搜索引擎应该能解释spa的


rel=”canonical” 这个标签已经推出很久了，canonical 是 Google、雅虎、微软等搜索引擎一起推出的一个标签，它的主要作用是用来解决由于网址形式不同内容相同而造成的内容重复问题。
这个标签对搜索引擎作用非常大，简单的说它可以让搜索引擎只抓取你想要强调的内容。
举个简单的例子，来看下如下的网址：
http://www.yzznl.cn/archives/2011-snow.html
http://www.yzznl.cn/archives/2011-snow.html?comments=true
http://www.yzznl.cn/archives/2011-snow.html?postcomment=true
这三个网址形式不同，第一个才是我们想显示给搜索引擎和用户的网址，但是打开它们网站的内容却是相同的。
一般像这种状况搜索引擎是很难分辨出来哪个才是网站主想要强调的网址，这样会直接造成搜索引擎在你的站里面收录到大量重复的内容，现在我们通过 canonical 标签就可以解决这些棘手的问题了。
像上面的状况，我们只需要在网址的 head 区域添加如下代码：
<link rel='canonical' href='http://www.yzznl.cn/archives/2011-snow.html' />
这样的话 Google 等搜索引擎最终都会只收录 canonical 标签指定的这个网址，搜索引擎会将其它页面作为重复内容，这些重复的内容不再参与页面的权重分配（如 Google 的 PR 值）。


在谷歌判断网站是否有收录
site: domain.com

谷歌的网站测速，可以看到优化建议
https://developers.google.com/speed/pagespeed/insights
是否适合移动设备浏览
https://search.google.com/test/mobile-friendly
检查 html
https://validator.w3.org/nu/
检查 css
http://jigsaw.w3.org/css-validator/
检查 https
https://myssl.com/ssl.html
https://myssl.com/ats.html

Web 辅助功能评估工具
https://wave.webaim.org/

另一个网页评价工具
https://www.webpagetest.org/


还要考虑加上 Open Graph 和 Twitter Card 的标签


其中Google Search Console是必须要用到的。
Google Analytics也是做Google SEO必须用到的工具。
其他一些免费或者付费的SEO工具：
Soovle 关键词分析，免费，可以给你自动生成多个网站用户的搜索相关词语。
KWFinder 关键词分析，付费，可免费试用。
MOZ 多种SEO工具，付费，30天免费试用。
ahrefs 多种SEO工具，带中文，支持7天试用，很多人用这个。
Semrush 多种SEO工具，免费账号有限制，支持中文。
Answerthepublic 通过关键词分析用户经常搜索和提问的句子，带Pro版本。
请记住，SEO工具只是辅助，关键还是网站内容和基础的SEO优化。

http://seo.chinaz.com

sitemap 要根据内容跟新，不要更新了，但内容没更新
网页的 节点结构 要对 seo 友好

最后要提醒的是，Google SEO的方法要跟着Google的规则不断学习和调整，搜索引擎每天都在进步，可能一些过时的教程已经并不实用了。
如果你没精力去研究最新的Google SEO技巧，那么只需要记住你的内容是满足用户需求的，有价值的。
那么不管规则怎么改动，你都不会受到太大的影响。

还要考虑使用谷歌的结构化数据


使用语义化标签，有利于seo，无障碍访问，和代码的可读性

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

搜索引擎
    国内
        百度 1.3
        360
        搜狗
        神马
    国外
        Google 91.3
        Bing 必应 2.6
        Yahoo 1.4
        Yandex 1
        DuckDuckGo 0.6

google
baidu
sougou
bing
yandex
yahoo
360
神马
DuckDuckGo

其实spa能有效地防止爬虫，搜索引擎的爬虫可以单独做一套ssr
图片等静态资源防盗链，http头里的Referer

搜索引擎爬虫访问网站时不要返回 5xx
搜索引擎爬虫根据 sitemap 访问网站时不要返回 4xx

slug 就是 url 文件路径里最后的一部分
一般只在seo里才有提及到，就是把关键字用-拼接在一起作为 url 文件路径里最后的一部分
slug 的词源来在于 出版界 一般是指简短的新闻标题


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
# 各种支付的接入指南

自由软件托管服务比较
版本控制软件比较
除了git的其它版本管理工具
https://download.libsodium.org/libsodium/releases/
一些未能分类的经验

python + openssl
c + openssl

windows 更新 python
cmd 下
1、先通过 pip freeze > requirements.txt   将你的旧版本中的第三方库的名字，输出到requirements.txt 文件中。
2、卸载python，重启电脑
3、安装新的python ，安装时一定要添加选择path
4、重启电脑
5、pip install -r requirements.txt

