SEO 的经验
================================

搜索引擎优化（英语：search engine optimization，缩写为SEO）是透过了解搜索引擎的运作规则来调整网站，以及提高目的网站在有关搜索引擎内排名的方式。

## SEO 的三个方面

- 技术
- 内容
- 声望（外链）

### 内容
- 内容的数量
- 内容的质量
    - 尽量使用原创程度高的内容
    - 成人内容 或 儿童内容 需要显式声明
- 内容的更新频率
    - 理想状态下最好每天都更新
    - 更新的时候要同步更新 sitemap
- 关键词
    - 要选择合适的关键词
    - 长尾关键词：将关键词进行多重排列组合；尽量不要使用行业通用词；擅于利用地理位置；确定关键词的价值；长尾词的选择；关键词的时效性；
    - 可以用组织名称和服务内容名
    - 可以参考竞争对手的关键词
    - 关键词要在内容里有所体现
        - title 和 description 包含关键词
        - h 标签里有包含关键词
        - 内容里有包含关键词
        - 图片的 alt 或 title 有包含关键词
        - 包含和关键词相近的词语也是可以的

### 声望（外链）

- 外站链接本站的数量和页面权重 (PageRank)
- 本站链接外站的数量和页面权重 (PageRank)
    - 网页上的链接数量限制在合理范围内（最多几千个）
    - 网页里的链接要保持有效的
- 本站在搜索引擎结果里被点击的次数

## SEO 技术方面的优化

### http
- 使用有意义的 HTTP 状态代码
- 响应速度不要大于 5s
- 要有友好 404 页面， 404 页面最好包含可以返回根网页的链接，还可以提供指向您网站上热门内容或相关内容的链接
- sitemap 里的链接不能返回 404 403
- 不能返回 5xx
- 网站要使用 https
- 网页里的链接要尽量也是 https
- 对已停用的网址使用 301 重定向
- http 都和 html 文档里都应该指明编码，且两个编码要一致
- 确保您的网络服务器能够正确地支持 If-Modified-Since HTTP 标头。此功能可指示您的网络服务器告诉 Google，自我们上次抓取您的网站以来，您的内容是否发生了变化。支持此功能可以节省带宽和开销。

### URL
- 尽量避免使用子域，因为搜索引擎会将子域视为不同的实体，进而分割站点的 SEO 价值
- URL 里不要带着文件后缀（例如 .cgi .pl .php .jsp 这类），动态页面页面最好搞一个伪静态的 URL 重写
- URL 层级最好不超过三级
- URL 最好不要带着 ? 的参数，如果一定要带上 ? 参数，那么参数越少越好
- URL 路径最好用小写英文字母和数字
- URL 使用 - 避免使用驼峰式拼写，下划线和空格
- URL 里最好有一个 slug
    - URL 文件路径里最后的一部分, slug 的词源来在于 出版界 一般是指简短的新闻标题
- URL 尽量与页面标题匹配
- URL 要尽量保持简单，搜索，分页，排序这类 url 可以用 robots.txt 阻止搜索引擎访问
- 文件和目录命名的规范做法是使用英文而不是拼音字母
- 尽可能避免在网址中使用会话 ID 。可考虑改用 Cookie

### HTML 标签
- 返回有完整内容的 html 文件
- html 代码大小最好不要超过200K
- head
    - 要有 tkd 标签
        - 每个页面最好具有唯一专用 title
        - title 需要是简短且描述准确的
        - description 需要准确总结网页内容并且是简短的
    - 最好显示声明 ico 图片
    - 要有 canonical 标签
    - 如果页面有地域属性，可以添加如下代码: `<meta name="location" content="province={信息所在省};city={信息所在城市}" />`
- 内容相关
    - 页面里需要有导航栏
    - 至少有一个 h1 标签
    - 尽量地使用 html5 里那些语义化标签，不要全用 div
    - 避免表格的嵌套，表格嵌套不要超过三层
    - 少用 iframe 标签
- 链接
    - a 标签最好有 title 属性
    - 链接应该使用 a 标签
    - 交互相关的应该使用 button 或 input ，不要使用 a 标签
    - a 标签要能链接到实际的网址，不要用 js 转跳之类的
    - 不需要收录的 a 链接要加上 nofollow 属性
    - 增加首页到内页和内页到首页的链接通路
- 图片和其它文件
    - 图片的体积不能太大，最好是 webp 格式的
    - 图片或其它文件的文件名最好是有意义的
    - 链接需要保持有效
    - img 要有 alt 属性
    - img 的 alt 和 title 需要是简短且有描述性的
    - 单纯为了视觉效果的图片应该使用 css 引入，其它的图片应该使用 img 标签引入
- 移动设备适应
    - 自适应（推荐）
    - 通过 ua 来判断浏览器，然后返回不同的版本
    - 或者使用单独的域名，例如 m.qq.com 这类的
- RTL
- i18n l10n G11N
- a11y
    - 网页的配色方案要保持良好的对比度
    - 表单的输入项 input 最好有对应的 label
    - 尽量使用表单验证而不是用 js 验证表单的数据
    - 尽量减少输入项，可以尝试使用 select 替代输入项，使用合适的输入类型和原生的输入框
    - 可聚焦元素应该要有聚焦样式
    - 不要删除 a 标签的伪类
    - 使用语义化标签，布局要现代化
    - 理想状态下，页面的全部内容都应该可以用键盘访问
    - 如果浏览器的原生多媒体控件，不能通过键盘访问，那么应该用 js 来实现
    - 音频和视频最好有描述和文本轨道
- 不要搞 SEO 的作弊

### sitemap 和 robots.txt
- 正确地填写 sitemap 并放在网站根目录里
- 正确地填写 robots.txt 并放在网站根目录里
- robots.txt 声明不需要抓取的页面
- robots.txt 不要阻止访问 ico 图片
- sitemap 更新要及时

### 其它
- html 代码要符合标准， css 最好也要符合相关标准
- 网站结构的扁平化规划，目录和内容结构最好不要超过3层，如果有超过三层的，最好通过子域名来调整和简化结构层数
- 避免投放会分散用户注意力的广告
- 主动地提交网站地址给搜索引擎
- 使用搜索引擎提供的站长工具
- 使用一个站点分析工具
- 除了 sitemap 和 robots.txt 之外，还可以加一个 rss

## SEO 的辅助工具

### 搜索引擎的站长工具
- Google Search Console https://search.google.com/search-console/about
- 必应站长工具 https://www.bing.com/webmasters/about
- 百度搜索资源平台 https://ziyuan.baidu.com/site/index

### 页面检测
- insights https://developers.google.com/speed/pagespeed/insights
- 是否适合移动设备浏览 https://search.google.com/test/mobile-friendly
- 检查 html https://validator.w3.org/nu/
- 检查 css http://jigsaw.w3.org/css-validator/
- 检查 https https://myssl.com/ssl.html
- Web 辅助功能评估工具 https://wave.webaim.org/
- 站长之家 http://tool.chinaz.com/

### SEO 分析工具
- Soovle
- KWFinder
- MOZ
- ahrefs
- Semrush
- Answerthepublic

### 站点分析
- Google Analytics https://analytics.withgoogle.com/
- 百度统计 https://tongji.baidu.com/

一个站点里只需要一个站点工具

## SPA 如何做 SEO

基本原则是页面被 spider 抓取时，返回完整的页面内容。

- 预渲染
- SSR
    - 全站 SSR
        - 使用 node 实现的 SSR
        - 使用 headless 浏览器实现的 SSR
    - 首屏 SSR ，其它页面依然保持 CSR

- 谷歌的爬虫是能执行 js 的，如果只做谷歌的 SEO ， SPA 其实可以不做 SSR 的，但是爬虫执行 js 有时间限制，如果渲染的速度太慢，页面可能渲染不完整。

## 需要重视的平台

### 搜索引擎
- 国内
    - 百度
    - 360
    - 搜狗
    - 神马
- 国外
    - Google
    - Bing
    - Yahoo
    - Yandex
    - DuckDuckGo

### 社交平台
- 国内
    - 微信
    - 微博
- 国外
    - 推特
    - 脸书

这几个平台都有特定的分享标签和分享 api

## 参考

https://zh.wikipedia.org/wiki/%E6%90%9C%E5%B0%8B%E5%BC%95%E6%93%8E%E6%9C%80%E4%BD%B3%E5%8C%96

https://developers.google.cn/search/docs

https://developers.google.cn/search/docs/beginner/seo-starter-guide
