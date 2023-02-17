import {marked} from '/static/marked.esm.js';
'use strict';
var Application = (function(){
    var articleList = {};
    var indexList;
    var article;
    var appData = {
        hostname: '',
        sitename: '',
    };
    var application = function(params) {
        appData.hostname = params.hostname;
        appData.sitename = params.sitename;
    };
    function ajax(options) {
        options = options || {};
        options.type = (options.type || 'GET').toUpperCase();
        if (!options.url) {
            return;
        }
        let params = options.data || '';
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else {
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    let result = xhr.responseText;
                    if (options.dataType && options.dataType == 'json') {
                        result = JSON.parse(result);
                    }
                    options.success && options.success(result, xhr);
                } else {
                    options.error && options.error(status, xhr.responseText, options.error);
                }
                options.complete && options.complete();
            }
        }
        if (options.type == 'GET') {
            if (params != '') {
                xhr.open('GET', options.url + '?' + params, true);
            } else {
                xhr.open('GET', options.url, true);
            }
            xhr.send(null);
        } else if (options.type == 'POST') {
            xhr.open('POST', options.url, true);
            if (!options.contentType) {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            } else {
                xhr.setRequestHeader("Content-Type", options.contentType);
            }
            xhr.send(params);
        }
    }
    var scriptManager = (function () {
        let scriptManager = function() {};
        scriptManager.prototype.addScriptList = function(srcList) {
            for (let i = 0; i < srcList.length; i++) {
                scriptManager.prototype.addScript(srcList[i]);
            }
        };
        scriptManager.prototype.addScript = function(src) {
            let tmpNode = document.createElement("script");
            tmpNode.src = src;
            document.body.appendChild(tmpNode);
        }
        return new scriptManager();
    })();
    var urlManager = (function() {
        var RouteMode = {
            HASH: 1,
            HISTORY: 0,
        };
        let urlManager = function() {
            this.url = {
                protocol: window.location.protocol || '',
                hostname: window.location.hostname || '',
                port: window.location.port || '',
                pathname: window.location.pathname || '',
                search: this.getKey(null, 'search'),
                hash: this.getKey(null, 'hash'),
            }
        };
        urlManager.prototype.routeMode = RouteMode.HASH;
        urlManager.prototype.init = function(indexList, article) {
            if (window.location.hostname == appData.hostname) {
                urlManager.prototype.routeMode = RouteMode.HISTORY;
                let handleUrl = function (href, target, popstate) {
                    let title =  appData.sitename;
                    let url = new URL(href);
                    // console.log(url);
                    let homepage = window.location.protocol + '//' + window.location.host + '/';
                    if ((target && target.id == 'homepage') || homepage == href) {
                        indexList.render();
                        href = homepage;
                        let state = { 'title': title, 'href': href };
                        if (popstate) {
                            history.replaceState(state, title, href);
                        } else {
                            history.pushState(state, title, href);
                        }
                        return false;
                    }
                    let match = (new RegExp('/articles/(.*)\.html', 'g')).exec(url.pathname);
                    if (match) {
                        for (let i = articleList.length - 1, len = 0; i >= len; i--) {
                            if (encodeURI(articleList[i].title) === match[1]) {
                                title = articleList[i].title;
                                article.render(title);
                                let state = { 'title': title, 'href': href };
                                if (popstate) {
                                    history.replaceState(state, title, href);
                                } else {
                                    history.pushState(state, title, href);
                                }
                                return false;
                            }
                        }
                    }
                    return true;
                }
                if (handleUrl(window.location.href, null, false) !== false) {
                    indexList.render();
                }
                document.body.addEventListener('click', function(event) {
                    let target = event.target;
                    // 判断是否匹配目标元素
                    if (target.nodeName.toLocaleLowerCase() === 'a') {
                        console.log('当前点击的 a 标签: ', target);
                        // console.log(target.href);
                        if (handleUrl(target.href, target, false) === false) {
                            event.preventDefault();
                        }
                    }
                });
                window.addEventListener('popstate', (event) => {
                    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
                    if (event.state && event.state.href) {
                        handleUrl(event.state.href, null, true)
                    }
                });
            } else {
                urlManager.prototype.hashChangeFire();
                window.addEventListener('hashchange', urlManager.prototype.hashChangeFire);
            }
        }
        urlManager.prototype.getKey = function(key, type) {
            type = type || 'hash';
            let url;
            if (type == 'search') {
                url = location.search.replace(/^\?/, '').split('&');
            } else {
                url = location.hash.replace(/^\#/, '').split('&');
            }
            var paramsObj = {};
            for (var i = 0, iLen = url.length; i < iLen; i++) {
                var param = url[i].split('=');
                paramsObj[param[0]] = param[1];
            };
            if (key) {
                return paramsObj[key] || '';
            };
            return paramsObj;
        };
        urlManager.prototype.getTitle = function(type) {
            type = type || 'article';
            if (type == 'article') {
                if (urlManager.prototype.routeMode == RouteMode.HASH) {
                    return urlManager.prototype.getKey('title');
                } else {
                    return '/article/';
                }
            } else if (type = 'page') {
                return '#';
            } else {
                return '#';
            }
        }
        urlManager.prototype.createUrl = function(title, type) {
            type = type || 'article';
            if (type == 'article') {
                if (urlManager.prototype.routeMode == RouteMode.HASH) {
                    return '#title=' + title;
                } else {
                    return '/articles/' + title + '.html';
                }
            } else if (type = 'page') {
                return '#';
            } else {
                return '#';
            }
        }
        urlManager.prototype.hashChangeFire = function() {
            let title = urlManager.prototype.getTitle();
            if (title === '') {
                indexList.render();
            } else {
                article.render(title);
            }
        }
        return new urlManager();
    })();
    function insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            // 如果最后的节点是目标元素，则直接添加。因为默认是最后
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
            //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
        }
    }
    function timetostr(timestamp) {
        return new Date(parseInt(timestamp + '000')).toLocaleString();
    }
    function timespan(articleInfo) {
        // let div = document.createElement('div');
        // div.classList.add('timespan');
        // function createCol(str) {
        //     let col = document.createElement('div');
        //     col.innerHTML = str;
        //     return col;
        // }
        // if (articleInfo.createTime) {
        //     div.appendChild(createCol('created at: ' + timetostr(articleInfo.createTime)));
        // }
        // if (articleInfo.updateTime) {
        //     div.appendChild(createCol('updated at: ' + timetostr(articleInfo.updateTime)));
        // }
        // return div;
        // return 'create time: ' + timetostr(articleInfo.createTime) + '&nbsp&nbsp update time: ' + timetostr(articleInfo.updateTime);
        let div = '';
        let createTime = '';
        let updateTime = '';
        if (articleInfo.createTime) {
            createTime = `<div>created at: ${timetostr(articleInfo.createTime)}</div>`;
        }
        if (articleInfo.updateTime) {
            updateTime = `<div>'updated at: ${timetostr(articleInfo.updateTime)}</div>`;
        }
        div = `<div class="timespan">${createTime}${updateTime}</div>`;
        return div;
    }
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    function findArticleInfo(articleList, title) {
        for (let i = articleList.length - 1, len = 0; i >= len; i--) {
            if (articleList[i].title === title) {
                return articleList[i];
            }
        }

        return null;
    }
    var IndexList = (function() {
        var DOM;
        var DATA;
        function IndexList(initDOM, initData) {
            DOM = initDOM;
            DATA = initData;
        }
        IndexList.prototype.render = function() {
            let content = DOM;
            let articleList = DATA;
            let indexList = '';
            for (let i = 0, len = articleList.length ; i < len; i++) {
                let articleTitle = articleList[i].title;
                let articleUrl = urlManager.createUrl(articleTitle);
                let timestamp = timespan(articleList[i]);
                indexList += `<div><h2><a href="${articleUrl}">${articleTitle}</a></h2>${timestamp}</div>`;
            }
            let html = `<div id="index_list">${indexList}</div>`;
            content.innerHTML = html;
            // let divIndexList = document.createElement("div");
            // divIndexList.setAttribute('id', 'index_list');
            // content.innerHTML = '';
            // for (let i = 0, len = articleList.length ; i < len; i++) {
            //     let div = document.createElement("div");
            //     let a = document.createElement("a");
            //     let h2 = document.createElement("h2");
            //     let articleTitle = articleList[i].title;

            //     // h2.innerHTML = articleTitle;
            //     // a.appendChild(h2);
            //     a.href = urlManager.createUrl(articleTitle);
            //     a.innerHTML = articleTitle;
            //     h2.appendChild(a);
            //     div.appendChild(h2);
            //     // div.appendChild(a);
            //     div.appendChild(timespan(articleList[i]));
            //     divIndexList.appendChild(div);
            // }
            // content.appendChild(divIndexList);
            document.querySelector('title').innerText = appData.sitename;
        }
        return IndexList;
    })();
    var ArticleList = (function() {
        var DOM;
        var DATA;
        function ArticleList(initDOM, initData) {
            DOM = initDOM;
            DATA = initData;
        }
        ArticleList.prototype.render = function() {
            let content = DOM;
            let articleList = DATA;
            content.innerHTML = '';
            let html = '';
            // let dt = document.createElement('dt');
            // dt.innerText = 'Article list';
            // content.appendChild(dt);
            html += "<dt>Article list</dt>";
            let i = 0;
            for (let len = articleList.length ; i < len; i++) {
                // let dd = document.createElement("dd");
                // let a = document.createElement("a");
                // let articleTitle = articleList[i].title;
                // a.innerHTML = articleTitle;
                // a.href = urlManager.createUrl(articleTitle);
                // dd.appendChild(a);
                // content.appendChild(dd);
                let articleTitle = articleList[i].title;
                let articleUrl = urlManager.createUrl(articleTitle);
                html += `<dd><a href="${articleUrl}">${articleTitle}</a></dd>`;
            }
            // let dd = document.createElement("dd");
            // dd.innerText = '共计 ' + i + ' 篇文章';
            html += `<dd>共计 ${i} 篇文章</dd>`;
            content.innerHTML = html;
            // content.appendChild(dd);
        }
        return ArticleList;
    })();
    var Article = (function() {
        var DOM;
        var DATA;
        function Article(initDOM, initData) {
            DOM = initDOM;
            DATA = initData;
        }
        Article.prototype.render = function(title) {
            let content = DOM;
            let articleList = DATA;
            content.innerHTML = '';
            let url = '/article/' +  title + '.md';
            // if (urlManager.prototype.routeMode == RouteMode.HISTORY) {
            //     url = '/' + url;
            // }
            ajax({
                type: 'GET',
                url: url,
                dataType: "text",
                success: function (result) {
                    let articleHtml = marked.parse(result);
                    topFunction();
                    let tableList = document.getElementsByTagName('table');
                    for (let i = 0, len = tableList.length; i < len; i++) {
                        tableList[i].className = 'table';
                    }
                    title = decodeURIComponent(title);
                    let articleInfo = findArticleInfo(articleList, title);
                    let createdAt = timetostr(articleInfo.createTime);
                    let updatedAt = timetostr(articleInfo.updateTime);
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
                    content.innerHTML = articleHtml;
                    if (new Date().getTime() / 1000 - articleInfo.updateTime > 15552000) {
                        let h1 = content.querySelector('h1');
                        let newElement = document.createElement("p");
                        newElement.innerText = "这篇文章最后更新的时间在六个月之前，文章所叙述的内容可能已经失效，请谨慎参考！";
                        newElement.classList.add('expired-prompt');
                        let tips = '<p class="expired-prompt">这篇文章最后更新的时间在六个月之前，文章所叙述的内容可能已经失效，请谨慎参考！</p>';

                        if (h1) {
                            insertAfter(newElement, h1);
                        } else {
                            content.insertBefore(newElement, content.firstChild);
                        }
                    }

                    document.querySelector('title').innerText = title;
                },
                error: function () {
                    document.querySelector('title').innerText = '404';
                    content.innerHTML = '<div class="jumbotron"><h1>404</h1><button onclick="history.back()">go back</button></div>';
                }
            });
        }
        return Article;
    })();
    var LinkExchange = (function() {
        var DOM;
        function LinkExchange(initDOM) {
            DOM = initDOM;
        }
        LinkExchange.prototype.render = function() {
            ajax({
                type: 'GET',
                url: '/exchangeList.json',
                dataType: "json",
                success: function (result) {
                    let linkExchangeList = result;
                    let LinkExchangeListHtml = '';
                    for (let i in linkExchangeList) {
                        // DOM.appendChild((function(item) {
                        //     let span = document.createElement('span');
                        //     let a = document.createElement('a');
                        //     let desc = item.name;
                        //     if (item.desc && item.desc != '') {
                        //         desc = item.desc;
                        //     }
                        //     a.setAttribute('target', '_blank');
                        //     a.setAttribute('rel', 'noreferrer');
                        //     a.setAttribute('href', item.href);
                        //     a.setAttribute('title', desc);
                        //     a.innerText = item.name;
                        //     span.appendChild(a);
                        //     return span;
                        // })(linkExchangeList[i]));
                        let item = linkExchangeList[i];
                        let desc = item.name;
                        if (item.desc && item.desc != '') {
                            desc = item.desc;
                        }
                        LinkExchangeListHtml += `<span>
                        <a target="_blank" rel="noreferrer" href="${item.href}" title="${desc}">${item.name}</a>
                        </span>
                        `;
                    }
                    DOM.innerHTML += LinkExchangeListHtml;
                },
                error: function () {},
                complete: function () {}
            });
        }
        return LinkExchange;
    })();
    async function getArticleList() {
        if (Object.getOwnPropertyNames(articleList).length === 0) {
            articleList = await (function(){
                return new Promise((resolve, reject) => {
                    ajax({
                        type: "GET",
                        url: "/articleList.json",
                        dataType: "json",
                        success: (data) => {
                            resolve(data);
                        },
                        error: (XMLHttpRequest, textStatus, errorThrown) => {
                            reject(errorThrown);
                        }
                    });
                });
            })();
        }
        return articleList;
    }
    function changeTheme(themeFlg) {
        var themeBtn = document.getElementById('theme_btn');
        if (themeFlg) {
            themeBtn.checked = true;
            document.body.style.animation = 'l2d 1s 1 normal forwards';
        } else {
            themeBtn.checked = false;
            document.body.style.animation = 'd2l 1s 1 normal forwards';
        }
    }
    async function init() {
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
        (new LinkExchange(document.getElementById('link_exchange'))).render();
        try {
            articleList = await getArticleList();
            let content = document.getElementById('content');
            indexList = new IndexList(content, articleList);
            article = new Article(content, articleList);
            urlManager.init(indexList, article);

            (new ArticleList(document.getElementById('article_list'), articleList)).render();
        } catch (e) {
            console.log(e);
            document.querySelector('title').innerText = '500';
            content.innerHTML = '<div class="jumbotron"><h1>500</h1><button onclick="window.location.reload()">reload</button></div>';
            return;
        }

    }
    application.prototype.run = function() {
        console.log('application.run');
        var delay = 1000;
        if (document.body.querySelector('main')) {
            setTimeout(init, delay);
        } else {
            ajax({
                type: "GET",
                url: "/template.html",
                dataType: "html",
                success: (data, XMLHttpRequest) => {
                    // let div = document.createElement('div');
                    // div.innerHTML = data;
                    // document.body.appendChild(div);
                    document.body.innerHTML = data;
                    setTimeout(init, delay);
                },
                error: (XMLHttpRequest, textStatus, errorThrown) => {
                    // reject(errorThrown);
                }
            });
        }
        // scriptManager.addScriptList([
        //     '/static/marked.min.js',
        // ]);
    };
    return application;
})();

let config = {
    hostname: 'f2h2h1.github.io',
    // hostname: '127.0.0.1',
    sitename: 'f2h2h1\'s blog',
};
window.addEventListener('load', function() {
    (new Application(config)).run();
});

/*

判断环境
    预渲染环境
        主页
        文章页
    前端渲染环境
        主页
        文章页
let config = {
    hostname: 'f2h2h1.github.io',
    // hostname: '127.0.0.1',
    sitename: 'f2h2h1\'s blog',
};
if (this === window) {
    window.addEventListener('load', function() {
        (new Application(config)).run();
    });
} else {
    (new Application(config)).run();
}


a = a.replace(/<article id="content">[ |\t]*<h1.*>.*<\/h1>/i, "$& asd");
console.log(a);

要有一个重建标题的过程


*/
