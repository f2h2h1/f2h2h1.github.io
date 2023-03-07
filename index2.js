import {marked} from './static/marked.esm.js';
'use strict';
// var Application = (function(){
//     var articleList = {};
//     var indexList;
//     var article;
//     var appData = {
//         hostname: '',
//         sitename: '',
//     };
//     var application = function(params) {
//         appData.hostname = params.hostname;
//         appData.sitename = params.sitename;
//     };


//     var urlManager = (function() {

//     })();

//     application.prototype.init = function() {

//     }

//     application.prototype.init = function() {
//         console.log('application.init');
//     }
//     application.prototype.run = function() {
//         console.log('application.run');
//         this.init();
//     };
//     return application;
// })();

class Application {
    articleList = [];
    linkExchangeList = [];
    template = '';
    templateInit = '';
    constructor(params) {

    }
    setArticleList(articleList) {
        this.articleList = articleList;
    }
    setLinkExchangeList(linkExchangeList) {
        this.linkExchangeList = linkExchangeList;
    }
    setTemplate(template) {
        this.template = template;
    }
    setTemplateInit(templateInit) {
        this.templateInit = templateInit;
    }
    beforeBuildPage() {

        let template = this.template;

        let linkExchangeList = this.linkExchangeList;
        let linkExchangeListHtml = '';
        for (let i in linkExchangeList) {
            let item = linkExchangeList[i];
            let desc = item.name;
            if (item.desc && item.desc != '') {
                desc = item.desc;
            }
            linkExchangeListHtml += `<span>
            <a target="_blank" rel="noreferrer" href="${item.href}" title="${desc}">${item.name}</a>
            </span>
            `;
        }

        let articleList = this.articleList;
        let articleListHtml = '';
        articleListHtml += "<dt>Article list</dt>";
        let i = 0;
        for (let len = articleList.length ; i < len; i++) {
            let articleTitle = articleList[i].title;
            // let articleUrl = urlManager.createUrl(articleTitle);
            let articleUrl = 'https://f2h2h1.github.io/article/' + articleTitle + '.html';
            articleListHtml += `<dd><a href="${articleUrl}">${articleTitle}</a></dd>`;
        }
        articleListHtml += `<dd>共计 ${i} 篇文章</dd>`;

        // /(?<=<div id=\"link_exchange\">).*?(?=<\/div>)/s
        // /(?<=<article id=\"content\">).*?(?=<\/article>)/s
        // /(?<=<dl id=\"article_list\">).*?(?=<\/dl>)/s
        // (/(?<=<!-- articleList -->).*(?=<!-- articleList -->)/ims)[Symbol.replace](readme, '\n' + listStr);
        template = (/(?<=<div id="link_exchange">).*?(?=<\/div>)/s)[Symbol.replace](template, linkExchangeListHtml);
        template = (/(?<=<dl id="article_list">).*?(?=<\/dl>)/s)[Symbol.replace](template, articleListHtml);

        this.setTemplateInit(template);
    }
    buildPage(articleInfo) {
        if (!this.templateInit) {
            this.beforeBuildPage();
        }
        
        let templateInit = this.templateInit;
        let pageHtml = marked.parse(articleInfo['md']);
        let title = articleInfo['title'];
        let createdAt = articleInfo['createTime'];
        let updatedAt = articleInfo['updateTime'];
        pageHtml += `<aside id="article_footer">
            <p><a target="_blank" rel="noreferrer" href="https://github.com/f2h2h1/f2h2h1.github.io/blob/master/article/${title}.md">原文链接</a></p>
            <p>created at: ${createdAt}</p>
            <p>updated at: ${updatedAt}</p>
            <p>如果文章内容有什么错误的地方，恳请各位大佬能通过 issues 或 邮件 的方式告诉作者</p>
            <p><img alt="知识共享许可协议" width="87" height="30" src="/static/cc4.0.webp">
                本作品采用
                <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">知识共享署名 4.0 国际许可协议</a>
                进行许可。</p>
                </aside>`;
        if (new Date().getTime() / 1000 - articleInfo['updateTime'] > 15552000) {
            let tips = '<p class="expired-prompt">这篇文章最后更新的时间在六个月之前，文章所叙述的内容可能已经失效，请谨慎参考！</p>';
            pageHtml = pageHtml.trim();
            pageHtml = pageHtml.replace(/<h1.*>.*<\/h1>/i, "$& " + tips);
        }

        templateInit = (/(?<=<title>).*?(?=<\/title>)/s)[Symbol.replace](templateInit, articleInfo['title']);
        templateInit = (/(?<=<article id="content">).*?(?=<\/article>)/s)[Symbol.replace](templateInit, pageHtml);

        return templateInit;
    }
    buildPageAll() {
    }
    init() {
        console.log('application.init');
    }
    run() {
        console.log('application.run');
        this.init();
    }
}

export { Application };

/*

判断环境
    前端渲染环境
        主页
        文章页
    预渲染环境
        主页
        文章页

let config = {
    hostname: 'f2h2h1.github.io',
    // hostname: '127.0.0.1',
    sitename: 'f2h2h1\'s blog',
};
if (this === window) { // browser
    window.addEventListener('load', function() {
        (new Application(config)).run();
    });
} else { // node
    (new Application(config)).run();
}


a = a.replace(/<article id="content">[ |\t]*<h1.*>.*<\/h1>/i, "$& asd");
console.log(a);

要有一个重建标题的过程


*/
