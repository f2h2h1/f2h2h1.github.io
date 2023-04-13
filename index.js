import {marked} from './static/marked.esm.js';
import {AppData} from './appData.js';
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
    /** @type {AppData} */
    appData = {
        host: '',
        articlePath: '/article/',
        sitename: 'blog',
        runningtime: '',
    };
    constructor(appData) {
        this.appData = appData;
    }

    isBowser() {
        if (this.appData.runningtime == AppData.RT_BROWSER) {
            return true;
        }
        return false;
    }
    isNodeJS() {
        return !this.isBowser();
    }
    createUrl(title, type) {
        let url = '';
        switch (type) {
            case 'md':
                url = this.appData.articlePath + title + '.md';
                break;
            case 'html':
            default:
                let URLprefix = this.appData.host + this.appData.articlePath;
                url = URLprefix + title + '.html';
                // $url = 'https://f2h2h1.github.io/#title=' . urlencode($title);
        }
        return url;
    }

    /** 
     * @returns {string}
     */
    setleadingZero(num) {
        num = num.toString();
        while (num.length < 2) num = "0" + num;
        return num;
    }
    getTimeZone(separate) {
        if (!separate) {
            separate = '';
        }
        let timezoneOffset = (new Date()).getTimezoneOffset();
        let leadSymbol = '-';
        if (timezoneOffset <= 0) {
            timezoneOffset = timezoneOffset * -1;
            leadSymbol = '+';
        }
        let hours = this.setleadingZero(Math.floor(timezoneOffset/60));
        let minutes = this.setleadingZero(timezoneOffset%60);
        return leadSymbol + hours + separate + minutes;
    }
    timeFormat(timestamp, type) {
        let timer = new Date(timestamp * 1000);
        let format = timer.toLocaleString();
        switch(type) {
            case 'rss':
                let weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                format = weekArr[timer.getDay()] + ', '+
                    this.setleadingZero(timer.getDate()) + ' ' +
                    monthArr[timer.getMonth()] + ' ' +
                    timer.getFullYear() + ' ' +
                    this.setleadingZero(timer.getHours()) + ':' +
                    this.setleadingZero(timer.getMinutes()) + ':' +
                    this.setleadingZero(timer.getSeconds()) + ' ' +
                    this.getTimeZone('');
                break;
            case 'sitemap':
            case 'atom':
            default:
                format = timer.getFullYear() + '-' +
                    this.setleadingZero(timer.getMonth() + 1) + '-' +
                    this.setleadingZero(timer.getDate()) + 'T' +
                    this.setleadingZero(timer.getHours()) + ':' +
                    this.setleadingZero(timer.getMinutes()) + ':' +
                    this.setleadingZero(timer.getSeconds()) +
                    this.getTimeZone(':');
                break;
        }

        return format;
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
            let articleUrl = this.createUrl(articleTitle, 'html');
            articleListHtml += `<dd><a href="${articleUrl}">${articleTitle}</a></dd>`;
        }
        articleListHtml += `<dd>共计 ${i} 篇文章</dd>`;

        // /(?<=<div id=\"link_exchange\">).*?(?=<\/div>)/s
        // /(?<=<article id=\"content\">).*?(?=<\/article>)/s
        // /(?<=<dl id=\"article_list\">).*?(?=<\/dl>)/s
        // (/(?<=<!-- articleList -->).*(?=<!-- articleList -->)/ims)[Symbol.replace](readme, '\n' + listStr);
        template = (/(?<=<div id="link_exchange">)(.*?)(?=<\/div>)/s)[Symbol.replace](template, '$1' + linkExchangeListHtml);
        template = (/(?<=<dl id="article_list">).*?(?=<\/dl>)/s)[Symbol.replace](template, articleListHtml);

        this.setTemplateInit(template);
    }
    buildIndex(articleList) {
        let indexList = '';
        for (let i = 0, len = articleList.length ; i < len; i++) {
            let articleInfo = articleList[i];
            let articleTitle = articleInfo.title;
            let articleUrl = this.createUrl(articleTitle);
            let timestamp = '';
            let createTime = '';
            let updateTime = '';
            if (articleInfo.createTime) {
                createTime = `<div>created at: ${this.timeFormat(articleInfo.createTime)}</div>`;
            }
            if (articleInfo.updateTime) {
                updateTime = `<div>updated at: ${this.timeFormat(articleInfo.updateTime)}</div>`;
            }
            timestamp = `<div class="timespan">${createTime}${updateTime}</div>`;
            indexList += `<div><h2><a href="${articleUrl}">${articleTitle}</a></h2>${timestamp}</div>`;
        }
        return indexList;
    }

    /** 
     * @returns {string}
     */
    buildArticle(articleInfo) {
        let articleHtml = marked.parse(articleInfo['md']);
        let title = articleInfo['title'];
        let createdAt = this.timeFormat(articleInfo['createTime']);
        let updatedAt = this.timeFormat(articleInfo['updateTime']);
        articleHtml += `<aside id="article_footer">
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
            articleHtml = articleHtml.trim();
            articleHtml = articleHtml.replace(/<h1.*>.*<\/h1>/i, "$& " + tips);
        }

        return articleHtml;
    }
    buildConetnt(title, html) {
        if (!this.templateInit) {
            this.beforeBuildPage();
        }
        let templateInit = this.templateInit;
        templateInit = (/(?<=<title>).*?(?=<\/title>)/s)[Symbol.replace](templateInit, title);
        templateInit = (/(?<=<article id="content">).*?(?=<\/article>)/s)[Symbol.replace](templateInit, html);

        if (this.isNodeJS()) {
            let articleList = this.articleList;
            let linkExchangeList = this.linkExchangeList;
            articleList.forEach((article) => {
                if (article.md) {
                    delete article.md;
                }
                if (article.html) {
                    delete article.html;
                }
            });
            let initData = `
            <script>
            var articleList = ${JSON.stringify(articleList)};
            var exchangeList = ${JSON.stringify(linkExchangeList)};
            </script>
            `
            templateInit = (/(?<=<\/script>)(.*?)(?=<\/body>)/s)[Symbol.replace](templateInit, '$1' + initData);

            if (!this.appData.thirdPartyCode) {
                templateInit = (/(?<=<!-- third party code -->).*?(?=<!-- third party code -->)/s)[Symbol.replace](templateInit, '');
            }
        }

        return templateInit;
    }
    buildPage(articleInfo) {

    }
    buildPageAll() {
    }
    init() {
        console.log('application.init');
        if (this.isBowser()) {
            let changeTheme = function(themeFlg) {
                var themeBtn = document.getElementById('theme_btn');
                if (themeFlg) {
                    themeBtn.checked = true;
                    document.body.style.animation = 'l2d 1s 1 normal forwards';
                } else {
                    themeBtn.checked = false;
                    document.body.style.animation = 'd2l 1s 1 normal forwards';
                }
            }
            var themeBtn = document.getElementById('theme_btn');
            var mql = window.matchMedia('(prefers-color-scheme: dark)');
            if (mql.matches) {
                themeBtn.checked = true;
            } else {
                themeBtn.checked = false;
            }
            mql.addEventListener('change', function(e) {
                changeTheme(e.matches);
            });
            themeBtn.addEventListener('click', function() {
                changeTheme(themeBtn.checked);
            });
        }
    }
    run() {
        console.log('application.run');
        if (this.isBowser()) {
            window.addEventListener('load', this.init())
        } else {
            this.init();
        }
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
