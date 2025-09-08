# 一段获取CSDN文章主要内容的油猴脚本

只保留了，标题，作者，正文，其它内容全都删除；
允许复制；
可以直接复制到控制台里使用；
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
    // 2025-09-08

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
            codeArr[i].style.backgroundColor='rgba(0, 0, 0, 1)';
            codeArr[i].style.color='rgba(255, 255, 255, 1)';
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


这两段 油猴脚本 是用于检测，在 gitlab 提交合并请求时，阻止目标为 master 的的合并请求。
因为 master 是默认的分支，我总是一时手快就点 提交了 。
```javascript
// ==UserScript==
// @name         GitLab Master Branch Alert before
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  油猴脚本，在 gitlab 阻止分支合共到 master ，适用于 16.11
// @author       You
// @match        https://gitlab.dev.com/group/subgroup/magento-ce/-/merge_requests/new
// @match        https://gitlab.dev.com/group/subgroup/magento-ce/-/merge_requests/new?*
// @grant        none
// ==/UserScript==

console.log('油猴脚本，在 gitlab 阻止分支合共到 master ');
(function() {
    'use strict';


    var isHasMaster = true;

    function checkForMaster() {

        let targetBranchTitle = document.getElementById('js-target-branch-title');
        if (targetBranchTitle && targetBranchTitle.innerText) {
            if (targetBranchTitle.innerText.trim() == 'master') {
                return true;
            }
        }
        return false;

        const parsedUrl = new URL(window.location.href);
        const queryString = parsedUrl.search; // 包括 ?，例如 "?a=1&b=2"
        const queryStringWithoutQuestion = queryString.slice(1); // 去掉开头的 ?
        const decodedQueryString = decodeURIComponent(queryStringWithoutQuestion);
        // console.log(decodedQueryString);

        // 1. 按 & 分割成数组
        const pairs = decodedQueryString.split('&');
        // 2. 遍历数组，查找 merge_request[target_branch] 的值
        let targetBranch = null;

        for (const pair of pairs) {
            const [key, value] = pair.split('=', 2); // 只分割第一个 =
            if (key === 'merge_request[target_branch]') {
                targetBranch = value;
                break;
            }
        }
    }
    function showCustomAlert(alertText) {
        // 创建自定义提示框
        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff5722;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
    `;
        alertBox.innerHTML = alertText;

        document.body.appendChild(alertBox);

        // 5秒后自动移除
        setTimeout(() => {
            if (alertBox.parentNode) {
                alertBox.parentNode.removeChild(alertBox);
            }
        }, 5000);

        // 等待页面加载完成
        window.addEventListener('load', function() {
            // 检查页面中是否包含 "master"
            checkForMaster();
        });
    }
    function showAlert(alertText) {
        // 弹出提示
        console.log(alertText);
        // alert(alertText);
        showCustomAlert(alertText);
    }

    window.addEventListener('load', () => {
        if (checkForMaster()) {

//             // 方法1: 阻止所有表单的submit事件
//             document.addEventListener('submit', function(event) {
//                 event.preventDefault();
//                 event.stopPropagation();
//                 console.log('表单提交已被阻止:', event.target);
//                 alert('当前页面禁止提交表单！');
//                 return false;
//             }, true);

//             // 方法2: 重写所有表单的submit方法
//             HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
//             HTMLFormElement.prototype.submit = function() {
//                 console.log('表单submit()方法已被阻止:', this);
//                 alert('当前页面禁止提交表单！');
//                 return false;
//             };

            const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"]');
            submitButtons.forEach(button => {
                button.disabled = true;
                // button.title = '当前页面禁止提交表单';
                console.log('已禁用提交按钮:', button);
            });
            showAlert('警告：页面中检测到 master 分支！');
        }
    });
})();
```

```javascript
// ==UserScript==
// @name         GitLab Master Branch Alert before
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  油猴脚本，在 gitlab 阻止分支合共到 master ，适用于 16.11
// @author       You
// @match        https://gitlab.dev.com/group/subgroup/magento-ce/-/merge_requests/new
// @match        https://gitlab.dev.com/group/subgroup/magento-ce/-/merge_requests/new?*
// @grant        none
// ==/UserScript==

console.log('油猴脚本，在 gitlab 阻止分支合共到 master ');
(function() {
    'use strict';


    var isHasMaster = true;

    function checkForMaster() {

        let targetBranchTitle = document.getElementById('js-target-branch-title');
        if (targetBranchTitle && targetBranchTitle.innerText) {
            if (targetBranchTitle.innerText.trim() == 'master') {
                return true;
            }
        }
        return false;

        const parsedUrl = new URL(window.location.href);
        const queryString = parsedUrl.search; // 包括 ?，例如 "?a=1&b=2"
        const queryStringWithoutQuestion = queryString.slice(1); // 去掉开头的 ?
        const decodedQueryString = decodeURIComponent(queryStringWithoutQuestion);
        // console.log(decodedQueryString);

        // 1. 按 & 分割成数组
        const pairs = decodedQueryString.split('&');
        // 2. 遍历数组，查找 merge_request[target_branch] 的值
        let targetBranch = null;

        for (const pair of pairs) {
            const [key, value] = pair.split('=', 2); // 只分割第一个 =
            if (key === 'merge_request[target_branch]') {
                targetBranch = value;
                break;
            }
        }
    }
    function showCustomAlert(alertText) {
        // 创建自定义提示框
        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff5722;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
    `;
        alertBox.innerHTML = alertText;

        document.body.appendChild(alertBox);

        // 5秒后自动移除
        setTimeout(() => {
            if (alertBox.parentNode) {
                alertBox.parentNode.removeChild(alertBox);
            }
        }, 5000);

        // 等待页面加载完成
        window.addEventListener('load', function() {
            // 检查页面中是否包含 "master"
            checkForMaster();
        });
    }
    function showAlert(alertText) {
        // 弹出提示
        console.log(alertText);
        // alert(alertText);
        showCustomAlert(alertText);
    }

    window.addEventListener('load', () => {
        if (checkForMaster()) {

//             // 方法1: 阻止所有表单的submit事件
//             document.addEventListener('submit', function(event) {
//                 event.preventDefault();
//                 event.stopPropagation();
//                 console.log('表单提交已被阻止:', event.target);
//                 alert('当前页面禁止提交表单！');
//                 return false;
//             }, true);

//             // 方法2: 重写所有表单的submit方法
//             HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
//             HTMLFormElement.prototype.submit = function() {
//                 console.log('表单submit()方法已被阻止:', this);
//                 alert('当前页面禁止提交表单！');
//                 return false;
//             };

            const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"]');
            submitButtons.forEach(button => {
                button.disabled = true;
                // button.title = '当前页面禁止提交表单';
                console.log('已禁用提交按钮:', button);
            });
            showAlert('警告：页面中检测到 master 分支！');
        }
    });
})();
```

```html

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>悬浮表单</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            height: 2000px; /* 为了演示滚动效果 */
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
        }

        /* 悬浮表单容器 */
        .floating-form {
            position: fixed;
            top: 100px;
            left: 100px;
            width: 300px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            border: 1px solid #ddd;
            overflow: hidden;
            transition: box-shadow 0.3s ease;
        }

        .floating-form:hover {
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        /* 表单头部 */
        .form-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }

        .form-title {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
        }

        .header-buttons {
            display: flex;
            gap: 8px;
        }

        .header-btn {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;
        }

        .header-btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        .minimize-btn {
            font-size: 14px;
        }

        /* 表单内容 */
        .form-content {
            padding: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }

        .form-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
            transition: border-color 0.2s ease;
        }

        .form-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .form-textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
            resize: vertical;
            min-height: 80px;
            transition: border-color 0.2s ease;
        }

        .form-textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .submit-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:active {
            transform: translateY(0);
        }

        /* 拖拽时的样式 */
        .floating-form.dragging {
            opacity: 0.8;
            transform: scale(1.02);
        }

        /* 收纳状态样式 */
        .floating-form.minimized {
            width: 200px;
            height: 50px;
        }

        .floating-form.minimized .form-content {
            display: none;
        }

        .floating-form.minimized .form-header {
            border-radius: 10px;
        }

        /* 触发按钮 */
        .trigger-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .trigger-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        /* 隐藏状态 */
        .floating-form.hidden {
            display: none;
        }
    </style>
</head>
<body>
    <h1>页面内容</h1>
    <p>这是一个很长的页面，你可以滚动查看效果。点击右下角的按钮可以显示悬浮表单。</p>
    
    <!-- 触发表单的按钮 -->
    <button class="trigger-btn" id="triggerBtn">📝</button>

    <!-- 悬浮表单 -->
    <div class="floating-form" id="floatingForm">
        <div class="form-header" id="formHeader">
            <h3 class="form-title">联系表单</h3>
            <div class="header-buttons">
                <button class="header-btn minimize-btn" id="minimizeBtn" title="收纳">−</button>
                <button class="header-btn close-btn" id="closeBtn" title="关闭">×</button>
            </div>
        </div>
        <div class="form-content">
            <form id="contactForm">
                <div class="form-group">
                    <label class="form-label" for="name">姓名</label>
                    <input type="text" id="name" name="name" class="form-input" placeholder="请输入您的姓名" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="email">邮箱</label>
                    <input type="email" id="email" name="email" class="form-input" placeholder="请输入您的邮箱" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="phone">电话</label>
                    <input type="tel" id="phone" name="phone" class="form-input" placeholder="请输入您的电话">
                </div>
                <div class="form-group">
                    <label class="form-label" for="message">留言</label>
                    <textarea id="message" name="message" class="form-textarea" placeholder="请输入您的留言" required></textarea>
                </div>
                <button type="submit" class="submit-btn">提交</button>
            </form>
        </div>
    </div>

    <script>
        class FloatingForm {
            constructor() {
                this.form = document.getElementById('floatingForm');
                this.header = document.getElementById('formHeader');
                this.minimizeBtn = document.getElementById('minimizeBtn');
                this.closeBtn = document.getElementById('closeBtn');
                this.triggerBtn = document.getElementById('triggerBtn');
                this.contactForm = document.getElementById('contactForm');
                this.formContent = document.querySelector('.form-content');
                
                this.isDragging = false;
                this.isMinimized = false;
                this.currentX = 0;
                this.currentY = 0;
                this.initialX = 0;
                this.initialY = 0;
                this.xOffset = 0;
                this.yOffset = 0;
                
                // 保存展开状态时的尺寸
                this.originalWidth = '300px';
                this.originalHeight = 'auto';
                
                this.init();
            }

            init() {
                // 绑定事件
                this.bindEvents();
                
                // 确保表单始终在最顶层
                this.keepOnTop();
            }

            bindEvents() {
                // 拖拽相关事件
                this.header.addEventListener('mousedown', this.dragStart.bind(this));
                document.addEventListener('mouseup', this.dragEnd.bind(this));
                document.addEventListener('mousemove', this.drag.bind(this));

                // 收纳按钮事件
                this.minimizeBtn.addEventListener('click', this.toggleMinimize.bind(this));

                // 关闭按钮事件
                this.closeBtn.addEventListener('click', this.hideForm.bind(this));

                // 触发按钮事件
                this.triggerBtn.addEventListener('click', this.showForm.bind(this));

                // 表单提交事件
                this.contactForm.addEventListener('submit', this.handleSubmit.bind(this));

                // 窗口滚动时保持层级
                window.addEventListener('scroll', this.keepOnTop.bind(this));

                // 窗口大小改变时保持层级
                window.addEventListener('resize', this.keepOnTop.bind(this));
            }

            dragStart(e) {
                if (e.target === this.minimizeBtn || e.target === this.closeBtn) return;

                this.initialX = e.clientX - this.xOffset;
                this.initialY = e.clientY - this.yOffset;

                if (e.target === this.header) {
                    this.isDragging = true;
                    this.form.classList.add('dragging');
                }
            }

            dragEnd() {
                this.initialX = this.currentX;
                this.initialY = this.currentY;

                this.isDragging = false;
                this.form.classList.remove('dragging');
            }

            drag(e) {
                if (this.isDragging) {
                    e.preventDefault();
                    
                    this.currentX = e.clientX - this.initialX;
                    this.currentY = e.clientY - this.initialY;

                    this.xOffset = this.currentX;
                    this.yOffset = this.currentY;

                    this.setTranslate(this.currentX, this.currentY);
                }
            }

            setTranslate(xPos, yPos) {
                this.form.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            }

            toggleMinimize() {
                if (this.isMinimized) {
                    this.expandForm();
                } else {
                    this.minimizeForm();
                }
            }

            minimizeForm() {
                this.isMinimized = true;
                this.form.classList.add('minimized');
                this.minimizeBtn.textContent = '+'; // 改为展开图标
                this.minimizeBtn.title = '展开';
            }

            expandForm() {
                this.isMinimized = false;
                this.form.classList.remove('minimized');
                this.minimizeBtn.textContent = '−'; // 改为收纳图标
                this.minimizeBtn.title = '收纳';
            }

            showForm() {
                this.form.classList.remove('hidden');
                if (this.isMinimized) {
                    this.expandForm(); // 显示时自动展开
                }
                this.keepOnTop();
            }

            hideForm() {
                this.form.classList.add('hidden');
            }

            keepOnTop() {
                // 确保表单始终保持在最顶层
                this.form.style.zIndex = '9999';
            }

            handleSubmit(e) {
                e.preventDefault();
                
                // 获取表单数据
                const formData = new FormData(this.contactForm);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }

                // 这里可以添加实际的提交逻辑
                console.log('表单数据:', data);
                
                // 显示提交成功提示
                alert('表单提交成功！');
                
                // 重置表单
                this.contactForm.reset();
            }
        }

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', function() {
            new FloatingForm();
        });

        // 额外的全局函数，方便外部调用
        window.showFloatingForm = function() {
            document.getElementById('floatingForm').classList.remove('hidden');
        };

        window.hideFloatingForm = function() {
            document.getElementById('floatingForm').classList.add('hidden');
        };

        window.toggleFloatingForm = function() {
            const form = document.getElementById('floatingForm');
            if (form.classList.contains('hidden')) {
                window.showFloatingForm();
            } else {
                window.hideFloatingForm();
            }
        };

        /*

画出界面
是否还有下一页
下一页
获取地址列表
访问地址
等待5秒
要适应各种搜索引擎
百度 360 搜狗 神马 Google Bing Yahoo Yandex DuckDuckGo
判断当前的搜索引擎？

一份源码打包出不同的版本
可以直接运行在 控制台 的版本 可以保存在开发者工具里的“脚本代码片段”(Snippets)
    只可以获取搜索页的邮箱
    好像没什么作用， Snippets 不能自动运行，页面转跳之后就无效了，只能获取当前页面的内容
运行在 油猴 的版本
    调用官方api的版本
    直接请求页面
nodejs版本
    后端
        调用官方api的版本
        使用 playwright 的版本
    前端
        命令行
        api
        网页
powershell + api 版
python tk + api 版

可以使用关键词筛选邮箱？
允许导出成 txt 或 csv 文件

找到邮箱后如何发送营销短信？

        [a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+

        GM_xmlhttpRequest
        https://www.tampermonkey.net/documentation.php#api:GM_xmlhttpRequest
        */

        (function(){
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
            delByXpath('//script | //link', document);

        })()
        (function(){
        function extractEmails(str) {
        // 定义匹配邮箱的正则表达式
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        
        // 使用 match 方法提取所有匹配的邮箱地址
        const matches = str.match(emailRegex);
        
        // 如果没有匹配到邮箱，返回空数组，否则返回匹配结果
        return matches ? matches : [];
        }
        const text = "请联系我们 at admin@example.com 或者 support@domain.co.uk 获取更多信息。";
        console.log(extractEmails(text));
        // 输出: ["admin@example.com", "support@domain.co.uk"]

        const noEmailText = "这是一个没有邮箱的文本。";
        console.log(extractEmails(noEmailText));
        // 输出: []

        const invalidEmailText = "错误的邮箱格式：user@domain.c";
        console.log(extractEmails(invalidEmailText));
        // 输出: []

        const invalidEmailText2 = "错误的邮箱格式：user@domain.cc汉字";
        console.log(extractEmails(invalidEmailText2));
        // 输出: []
        })()

        (function(){
        function extractEmails(str) {
        // 定义匹配邮箱的正则表达式
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        
        // 使用 match 方法提取所有匹配的邮箱地址
        const matches = str.match(emailRegex);
        
        // 如果没有匹配到邮箱，返回空数组，否则返回匹配结果
        return matches ? matches : [];
        }

        console.log(extractEmails(document.body.innerText));

        })()
    </script>
</body>
</html>

```
