# 一段获取CSDN文章主要内容的油猴脚本

只保留了，标题，作者，正文，其它内容全都删除；
允许复制；
但不能应对需要登录才可以查看的情况

```javascript

// ==UserScript==
// @name         csdn 只保留文章内容
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       You
// @include      https://blog.csdn.net/*/article/details/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 2025-05-06

    // 按 xpath 删除节点
    function delByXpath(xpath) {
        try {
            let tag = document.evaluate(xpath, document).iterateNext();
            if (tag != null) {
                tag.parentNode.removeChild(tag);
            }
        } catch {
        }
    }

    // 删除页面内 meta 和 script 标签
    let scriptTag = document.evaluate('//meta | //script | //iframe | //link[@rel != "stylesheet"]', document);
    let scriptTagArr = [];
    for (let d = scriptTag.iterateNext(); d != null; d = scriptTag.iterateNext()) {
        scriptTagArr.push(d);
    }
    for (let i = 0; i < scriptTagArr.length; i++) {
        scriptTagArr[i].parentNode.removeChild(scriptTagArr[i]);
    }

    // 删除文章详情的样式
    let articleTitle = document.evaluate('//descendant::div[contains(@class,"article-header")]', document).iterateNext();
    if (articleTitle != null) {
        articleTitle.style = "width:90%; margin:0 auto 30px; auto;";

        delByXpath('//descendant::a[contains(@class,"href-article-edit slide-toggle")]');
        delByXpath('//descendant::a[contains(@id,"blog_detail_zk_collection")]');

        let articleInfo = document.evaluate('//descendant::div[contains(@class,"article-info-box")]', articleTitle).iterateNext();
        if (articleInfo != null) {
            console.log(articleInfo.innerText);
            articleInfo.innerHTML = "<pre>"+articleInfo.innerText+"</pre>";
        }
    }

    // 获取文章内容的 节点
    let a = document.evaluate('//div[contains(@class,"main_father")]/div[@id="mainBox"]/main/div[contains(@class,"blog-content-box")]/article', document).iterateNext();
    console.log(a);
    if (a != null) {
        // 删除 body 里的所有节点
        let body = document.body;
        var pObjs = body.childNodes;
        for (var i = pObjs.length - 1; i >= 0; i--) { // 一定要倒序，正序是删不干净的，可自行尝试
            body.removeChild(pObjs[i]);
        }
        document.body.setAttribute('style', 'background:rgba(255,255,255,0) !important'); // 把 body 的背景设为透明，防止有背景图片
        // 把文章节点重新加入 body
        a.style = "width:90%; margin:0 auto;padding-bottom:50px;";
        if (articleTitle != null) {
            body.appendChild(articleTitle);
        }
        body.appendChild(a);
        console.log(body);
    }

    delByXpath('//descendant::div[contains(@id,"treeSkill")]');

    // 令 code 可以复制
    let codeDOM = document.evaluate('//article//pre', document);
    let codeArr = [];
    for (let d = codeDOM.iterateNext(); d != null; d = codeDOM.iterateNext()) {
        codeArr.push(d);
    }
    for (let i in codeArr) {
        let c = document.createElement('textarea');
        let codeItem = document.evaluate('//code', codeArr[i]).iterateNext();
        console.log(codeItem);
        if (codeItem != null) {
            c.value = codeItem.innerText;
            codeArr[i].style.userSelect='auto';
            codeArr[i].style.backgroundColor='rgba(255,255,255,0)';
            codeArr[i].innerText = c.value;
        }
    }
    // 令页面的其它内容也可以复制
    document.querySelectorAll('*').forEach(item => {
        item.oncopy = function(e) {
            e.stopPropagation();
        }
    });

    // 滚动条错误
    document.addEventListener('scroll', function(e) {
        // e.preventDefault(); // 阻止默认事件
        e.stopPropagation(); // 阻止事件冒泡
        return false;
    });
})();
```
