简介
================================

1. 这是一个简单的静态博客
2. 文章使用 markdown 格式
3. https://f2h2h1.github.io/
4. 这个博客十分需要友链

## 列表

<!-- list -->
- [如何完成以xx管理系统为选题的毕业设计](article/如何完成以xx管理系统为选题的毕业设计.md)
- [DNSSEC简介](article/DNSSEC简介.md)
- [在Windows下安装Magento2](article/在Windows下安装Magento2.md)
- [用纯CSS3实现的滑动按钮](article/用纯CSS3实现的滑动按钮.md)
- [Linux的GUI](article/Linux的GUI.md)
- [使用Tesseract识别字符验证码](article/使用Tesseract识别字符验证码.md)
- [开发Magento2的模块](article/开发Magento2的模块.md)
- [浏览器和服务器通讯方式的不完整总结](article/浏览器和服务器通讯方式的不完整总结.md)
- [HTTP认证方式的不完整总结](article/HTTP认证方式的不完整总结.md)
- [PHP各种运行方式的不完整总结](article/PHP各种运行方式的不完整总结.md)
- [把网页导出成PDF](article/把网页导出成PDF.md)
- [FirstData后台的设置](article/FirstData后台的设置.md)
- [SEO的经验](article/SEO的经验.md)
- [微信支付的不完整接入指南](article/微信支付的不完整接入指南.md)
- [paypal，firtdata，支付宝的不完整接入指南](article/paypal，firtdata，支付宝的不完整接入指南.md)
- [观察网站性能](article/观察网站性能.md)
- [git的笔记](article/git的笔记.md)
- [密码学入门简明指南](article/密码学入门简明指南.md)
- [使用docker部署nuxt](article/使用docker部署nuxt.md)
- [在Windows下搭建git服务](article/在Windows下搭建git服务.md)
- [用docker-compose部署lnmp环境](article/用docker-compose部署lnmp环境.md)
- [mongodb分片](article/mongodb分片.md)
- [练习](article/练习.md)
- [一些开发笔记](article/一些开发笔记.md)
- [一些关于Linux的笔记](article/一些关于Linux的笔记.md)
- [在Windows下安装pear](article/在Windows下安装pear.md)
- [在VSCode里使用Xdebug远程调试PHP](article/在VSCode里使用Xdebug远程调试PHP.md)
- [下载AcFun视频](article/下载AcFun视频.md)
- [在Windows下配置Tomcat服务器](article/在Windows下配置Tomcat服务器.md)
- [在Windows下配置PHP服务器](article/在Windows下配置PHP服务器.md)
- [关于字符编码的一些坑](article/关于字符编码的一些坑.md)
- [在VSCode里调试PHP](article/在VSCode里调试PHP.md)
- [安装PHP7的GUI扩展](article/安装PHP7的GUI扩展.md)
- [关于](article/关于.md)
<!-- list -->

## 在本地运行

- 用 vscode 或其它能渲染 markdown 的软件浏览
- 运行一个静态的服务器，然后在浏览器里打开
    1. php
        ```
        php -S 127.0.0.1:9012
        ```
    1. python
        ```
        python -m http.server -b 127.0.0.1 9012
        ```
- 使用 gitbook
- ~~其实直接用记事本打开也是可以的，只是没有图片和样式~~

## gitbook

### 依赖
- node 14.17
- npm 7.24
- gitbook-cli 2.3.2

### 安装 gitbook

```
npm install gitbook-cli -g
```

### 运行 gitbook

构建和运行，默认会占用 4000 端口
```
gitbook serve
```

只构建
```
gitbook build
```

### 其它

gitbook 的项目地址

https://github.com/GitbookIO/gitbook

https://github.com/GitbookIO/gitbook-cli

gitbook 已经不更新了。真的好可惜。
