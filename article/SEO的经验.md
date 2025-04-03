SEO 的经验
================================

搜索引擎优化（英语：search engine optimization，缩写为SEO）是透过了解搜索引擎的运作规则来调整网站，以及提高目的网站在有关搜索引擎内排名的方式。

SEO 的方法要跟随搜索引擎的规则不断调整。如果没有精力研究 SEO 的技巧，那么只需要记住内容是满足用户需求的，有价值的。这样不管规则怎么改动，站点都不会受到太大的影响。

## SEO 的三个方面

- 内容
- 声望（外链）
- 技术

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
    - 3-5 个
    - 长尾关键词：将关键词进行多重排列组合；尽量不要使用行业通用词；擅于利用地理位置；确定关键词的价值；长尾词的选择；关键词的时效性；
    - 可以用组织名称和服务内容名
    - 可以参考竞争对手的关键词
    - 可以参考搜索下拉框和相关搜索的推荐
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
    - 移除网页中的死链
- 本站在搜索引擎结果里被点击的次数

## SEO 技术方面的优化

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

### HTTP
- 使用有意义的 HTTP 状态代码
- 响应速度不要大于 5s
- 要有友好 404 页面， 404 页面最好包含可以返回根网页的链接，还可以提供指向您网站上热门内容或相关内容的链接
- sitemap 里的链接不能返回 404 403
- 不能返回 5xx
- 网站要使用 https
- 网页里的链接要尽量也是 https
- https 的 tls 尽量使用 1.2 或以上版本
- 对已停用的网址使用 301 重定向
- http 都和 html 文档里都应该指明编码，且两个编码要一致
- 确保您的网络服务器能够正确地支持 If-Modified-Since HTTP 标头。此功能可指示您的网络服务器告诉 Google，自我们上次抓取您的网站以来，您的内容是否发生了变化。支持此功能可以节省带宽和开销。

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
    - 至少有一个 h1 标签，h1 尽量靠近 body 标签
    - 尽量地使用 html5 里那些语义化标签，不要全用 div
    - 网页的 节点结构 要对 seo 友好
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
    - Right-to-Left 从右到左
    - 指的是文本和元素的布局方向，主要用于支持从右到左书写的语言，如阿拉伯语和希伯来语
    - 支持 RTL 布局是 i18n 和 l10n 工作的重要部分
- i18n l10n G11N
    - Internationalization 国际化
    - Localization 本地化
    - Globalization 全球化
- a11y
    - Accessibility 可访问性
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

### sitemap 和 robots.txt
- 正确地填写 sitemap 并放在网站根目录里
- 正确地填写 robots.txt 并放在网站根目录里
- robots.txt 声明不需要抓取的页面
- robots.txt 不要阻止访问 ico 图片
- sitemap 更新要及时
- sitemap 要根据内容跟新，不要 sitemap 更新了，但内容没更新
- robots.txt 里的 sitemap 地址要用绝对 URL

### 其它
- html 代码要符合标准， css 最好也要符合相关标准
- 网站结构的扁平化规划，目录和内容结构最好不要超过3层，如果有超过三层的，最好通过子域名来调整和简化结构层数
- 避免投放会分散用户注意力的广告
- 主动地提交网站地址给搜索引擎
- 使用搜索引擎提供的站长工具
- 使用一个站点分析工具
- 除了 sitemap 和 robots.txt 之外，还可以再加上 atom 和 rss 和 JSONFeed
- 重视链接的分享
- js 和 css 等静态资源尽量合并和压缩
- 静态资源和图片如果可以就加上 CDN
- 加速页面的打开速度也是 SEO 优化的一部分
- tls 证书要及时更新
- 如果条件允许就不要用太冷门的域名
- 不要搞 SEO 的作弊

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
- 苹果的 ats https://myssl.com/ats.html
- Web 辅助功能评估工具 https://wave.webaim.org/
- 站长之家 http://tool.chinaz.com/
- 另一个网页评价工具 https://www.webpagetest.org/

可以根据 insights 的建议来优化页面

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

一个站点里只需要一个站点分析工具

### 搜索引擎的搜索指令

可以使用这类的搜索指令来判断搜索引擎的收录情况

这是谷歌的搜索指令，其它搜索引擎也会有类似的指令
```
site: 域名
关键字 site: 域名
```

谷歌更多的搜索指令可以参考这里
https://www.google.com/advanced_search

## SPA 如何做 SEO

基本原则是页面被搜索引擎爬虫访问时，返回完整的页面内容。

- SSG (Static Site Generation , 静态站点生成)
    - 提前生成静态页面，对于中小型网站或更新不频繁的网站这是一个很好的解决方案
    - 但如果页面里有动态的内容，例如 留言 评论 这类的，就不好处理了
- 预渲染 (pre render)
    - 类似于 SSG ，但一部分内容还是通过接口获取
    - 大多数情况下预渲染并不能很好地应对 SEO ，因为大多数情况下，预渲染只是预渲染了前端的框架部分和一些很少修改的页面，页面的主要内容还是会通过接口请求
    - 其实可以把 SSG 看作预渲染的一种
- SSR (Server Side Rendering , 服务端渲染)
    - 全站 SSR
    - 首屏 SSR ，其它页面依然保持 CSR

- 谷歌的爬虫是能执行 js 的，如果只做谷歌的 SEO ， SPA 其实可以不做 SSR 的，但是爬虫执行 js 有时间限制，如果渲染的速度太慢，页面可能渲染不完整。

### SPA 的 SSR
- 使用 node 实现的 SSR
    - 使用 nuxt 这类框架实现，需要改动前端的代码
    - 虽然 vue 和 react 都有提供原生的 SSR 方案，但都比较简陋
- 使用 headless 浏览器实现的 SSR
    - 可以在不改动前端代码的前提下实现，通过 ua 来转发搜索引擎爬虫的请求，所以只能针对搜索引擎
        - 通过 ua 来判断搜索引擎的爬虫，其实不是很好，最好的方式还是通过 dns 反查来确定请求的来源
        - 实时渲染速度可能有点慢，可以定时生成纯静态的 HTML 文件，类似于 SSG
    - 具体的实现可以参考笔者的这个仓库 https://github.com/f2h2h1/seo-ssr
    - 现在的网站推广仅针对搜索引擎是不够的，还要考虑各种社交平台和内容平台

笔者比较推荐的还是使用 nuxt 这类框架，因为这类框架能很好地实现首屏 SSR ，其它页面依然保持 CSR ，同时能应对 SEO 和其它各种平台，
虽然对前端的代码改动有点大，但如果一开始就使用这类框架，开发体验和普通的 CSR 基本没区别

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
    - 小红书
    - 抖音
    - 快手
    - bilibili
    - 知乎
    - 豆瓣
- 国外
    - X
    - 脸书
    - tiktok
    - Instagram
<!--
LinkedIn
zolo
line
telegram
-->

这几个平台都有特定的分享标签和分享 api 。
例如 谷歌的结构化数据， Open Graph 和 Twitter Card 标签。
谷歌的结构化数据可以更好地呈现搜索结果 https://developers.google.cn/search/docs/advanced/structured-data/intro-structured-data

使用通用的 Web Share API ，虽然还只是草案，但 Chrome Edge 和 Safari 都已经支持了
https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API

针对社交平台的优化会被称为 SMO (Social Media Optimization 社交媒体优化)

<!--
微数据
    https://developer.mozilla.org/en-US/docs/Web/HTML/Microdata
    https://schema.org/
微格式
    https://developer.mozilla.org/en-US/docs/Web/HTML/microformats
    https://microformats.org/
JSON-LD

用于添加结构化数据的工具（面向新手）
    https://support.google.com/webmasters/topic/4599161

AMP 是什么？
    加速移动页面（Accelerated Mobile Pages）：一种由 Google 推出的开源项目，旨在提高移动网页的加载速度和性能

通过写博客，在论坛发帖，在论坛回复 等形式发布软文？使得自己站点的链接出现在其它站点里？

EDM
Email Direct Marketing
电子邮件 直接 营销
电子邮件营销

Internet marketing
网络营销

购买 流量/排名/广告 ？

电话/短信/sns私信/广告联盟

主动寻找目标用户
提高产品的知名度

SEM
Search Engine Marketing
搜索引擎营销
大概就是在搜索引擎里买排名，买广告

SMM
Social Media Marketing
社交媒体营销
大概就是在社交媒体里买广告

ASO
App Store Optimization
应用商店优化

ASA
App Store Ads
应用商店广告

ASM
App Store Marketing
应用商店营销


NavBoost
    Navboost 是 Google 搜索算法中的一个重要组成部分，
    主要用于处理用户的 导航类查询（Navigational Queries） 和优化搜索结果的个性化排序。
    它的核心目标是根据用户的历史行为（如点击、浏览习惯）和搜索意图，
    优先展示用户可能想要直接访问的页面（例如品牌官网或用户常访问的页面）。
EEAT
    Experience 经验
    Expertise 专业知识
    Authoritativeness 权威
    Trustworthiness 诚信度
    EEAT 不是直接的排名因素。但是谷歌会通过其它算法来检测”EEAT”，


### 什么是 Navboost？

Navboost 是 Google 内部用于改进搜索结果排序的一个算法机制。它的核心目标是通过分析用户的行为信号（如点击、导航和互动）来优化搜索结果的相关性，从而提升用户体验。Navboost 的工作原理基于一种假设：如果用户在搜索某个关键词后频繁点击某些特定页面，并且这些页面能够满足用户的查询需求，那么这些页面可能比其他页面更相关。

Navboost 的名称来源于两个关键概念：
1. **Nav**：指代用户导航行为，包括点击搜索结果、访问页面以及返回搜索结果页等操作。
2. **Boost**：指代对某些页面的排名进行提升或增强。

需要注意的是，Navboost 并不是 Google 官方公开承认的算法名称，而是通过一些泄露信息（例如 2023 年的“Google Leaked Documents”事件）被外界所知。尽管如此，它被认为是一个真实存在的机制，广泛应用于 Google 的搜索排名系统中。

---

### Navboost 的工作原理

Navboost 的运行依赖于用户与搜索结果之间的交互数据。以下是其主要工作流程的详细描述：

#### 1. **收集用户行为信号**
   - 当用户输入一个查询并点击某个搜索结果时，Google 会记录用户的行为数据，包括但不限于以下内容：
     - 用户点击了哪个链接。
     - 用户在目标页面上的停留时间（即页面停留时间，简称 Dwell Time）。
     - 用户是否快速返回到搜索结果页（即“Pogo-sticking”行为）。
     - 用户是否继续浏览该页面的其他部分（滚动深度）。
   - 这些信号共同构成了对页面质量的初步评估。

#### 2. **评估页面的相关性和满意度**
   - Google 会根据上述行为信号判断某个页面是否真正满足了用户的查询意图。例如：
     - 如果用户点击了一个页面并长时间停留在该页面上，则表明该页面可能是高质量的。
     - 如果用户点击了一个页面但很快返回搜索结果页并尝试其他结果，则表明该页面可能无法满足用户需求。
   - 通过这种方式，Google 可以动态地评估页面与特定查询的相关性。

#### 3. **调整搜索排名**
   - 基于用户行为信号，Google 会对某些页面的排名进行调整：
     - 对于表现良好的页面（即用户行为信号积极），Navboost 会给予更高的排名权重。
     - 对于表现较差的页面（即用户行为信号消极），Navboost 会降低其排名权重。
   - 这种调整通常是动态的，可以根据新的用户行为数据不断更新。

#### 4. **长期积累的信任度**
   - Navboost 不仅关注短期的用户行为信号，还会对页面的历史表现进行累计评估。例如，如果某个页面在过去多次查询中都表现出色，则该页面可能会获得更高的初始信任度。
   - 这种机制有助于防止新页面因缺乏历史数据而被低估，同时也确保了高质量页面能够持续获得较高的排名。

---

### Navboost 的重要性

Navboost 在 Google 搜索算法中的作用不可忽视，尤其是在以下几个方面：

#### 1. **提升搜索结果的相关性**
   - 通过分析真实的用户行为，Navboost 能够发现传统算法可能忽略的相关性信号，从而进一步优化搜索结果的质量。

#### 2. **动态适应用户需求**
   - 用户的需求和偏好是不断变化的，Navboost 能够实时捕捉这些变化，并快速调整搜索结果以满足最新的用户期望。

#### 3. **打击低质量内容**
   - 如果某些页面虽然在技术指标上表现良好（如关键词匹配度高），但实际无法满足用户需求，Navboost 会将其排名降低，从而减少低质量内容的曝光。

#### 4. **支持个性化搜索**
   - Navboost 的信号可能是个性化的，这意味着不同用户可能会看到不同的搜索结果，具体取决于他们的历史行为和偏好。

---

### Navboost 的潜在挑战

尽管 Navboost 在提升搜索质量方面具有显著优势，但它也面临一些潜在问题和争议：

#### 1. **用户行为偏差**
   - 用户行为并不总是可靠的。例如，某些用户可能因为品牌知名度或广告影响而点击特定页面，但这并不意味着该页面真的满足了他们的需求。
   - 此外，用户的行为可能受到外部因素（如网络速度、设备类型）的影响，从而导致不准确的信号。

#### 2. **对新页面的不公平**
   - 新发布的页面通常缺乏足够的用户行为数据，因此可能在 Navboost 的评估中处于劣势。这可能导致“强者愈强，弱者愈弱”的马太效应。

#### 3. **隐私问题**
   - Navboost 需要大量用户行为数据的支持，而这可能引发隐私方面的担忧。如何在保护用户隐私的同时有效利用这些数据，是 Google 面临的一大挑战。

---

### 如何优化网站以应对 Navboost？

尽管 Navboost 具体的运作细节并未完全公开，但 SEO 从业者可以通过以下方法优化网站，以更好地适应这一机制：

#### 1. **提供高质量内容**
   - 确保页面内容能够全面、准确地回答用户的查询问题，避免出现误导性或低质量的信息。

#### 2. **优化用户体验**
   - 提高页面加载速度、改善移动端适配、设计清晰的导航结构，以减少用户的跳出率。

#### 3. **吸引用户互动**
   - 添加评论区、问答功能或相关内容推荐，鼓励用户在页面上停留更长时间。

#### 4. **监控用户行为数据**
   - 使用工具（如 Google Analytics 或 Search Console）分析用户在页面上的行为，找出需要改进的地方。

#### 5. **建立长期信任**
   - 持续发布高质量内容并积累用户的好评，以提升页面在 Navboost 中的初始信任度。

---

### 总结

Navboost 是 Google 搜索算法中一个重要的动态调整机制，它通过分析用户行为信号来优化搜索结果的相关性和质量。虽然其具体实现细节尚未完全公开，但我们可以确定的是，Navboost 强调用户体验和页面满意度，这对 SEO 从业者提出了更高的要求。为了在 Navboost 的影响下取得更好的排名，网站运营者需要专注于提供优质内容、优化用户体验，并不断监测和改进网站的表现。

如果你有更多关于 Navboost 或其他 SEO 相关的问题，请随时补充说明！


所以一个网页最好有 导航栏 和 页脚 ？


-->

## 参考

https://zh.wikipedia.org/wiki/%E6%90%9C%E5%B0%8B%E5%BC%95%E6%93%8E%E6%9C%80%E4%BD%B3%E5%8C%96

https://developers.google.cn/search/docs

https://developers.google.cn/search/docs/beginner/seo-starter-guide

https://backlinko.com/introducing-content-marketing-hub-2-0
