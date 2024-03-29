把网页导出成 PDF
================================

把网页导出成 PDF 本质上就是把 html 代码（包括 css 样式）转换成 PDF

## 生成 PDF 的方式

1. 用浏览器的 api 生成 PDF
    - 在前端调用浏览器的 api 生成 PDF
        1. 直接调用 print 事件
            - 实现简单，生成速度快，能保留 a 标签，但需要适应打印样式
        1. 把 html 代码添加进一个隐藏的 iframe 标签里，然后调用 iframe 标签的 print 事件
            - 比直接调用 print 事件稍微复杂一点，但能剔除一些不需要的内容，样式控制起来也更简单，在 iframe 里可以重新写一套样式
    - 在后用 headless 浏览器生成 PDF
        1. 直接使用命令行生成
            - 这种方式实现起来也很简单，但会占用服务器资源，生成速度不及在前端调用 print 事件，对 spa 的支持也不是很好，可能会遗漏一些内容
        1. 用 Playwright 这类工具操作浏览器生成
            - 实现方式复杂一点，生成速度应该是最慢的了，但能很好地支持 spa
2. 用各类工具库把 html 生成 PDF
    - 在前端生成
        1. 先通过 html2canvas 把网页转换成图片，再用 jsPDF 来生成 pdf
            - 存在分页的问题，就是一张图片或一行文字有可能被分在两页，而且不能保留 a 标签
        1. 只使用 jsPDF 来生成 pdf
            - 如果样式复杂的话，这样工作量会非常大，而且样式调整会很麻烦
    - 在后台生成
        1. 用 spipu/html2pdf 这类库解释 html 后生成 pdf
            - 实现起来比较简单，但对 css 样式的支持不完善

||用浏览器的 api 生成|用各类工具库把 html 生成 PDF|
|:-|:-|:-|
|在前端生成|1. 直接调用 print 事件 <br /> 2. 把 html 代码添加进一个隐藏的 iframe 标签里，然后调用 iframe 标签的 print 事件|1. 先通过 html2canvas 把网页转换成图片，再用 jsPDF 来生成 PDF <br /> 2. 只使用 jsPDF 来生成 PDF|
|在后台生成|1. 直接用 headless 浏览器的命令行生成 <br /> 2. 用 Playwright 这类工具操作 headless 浏览器生成|用 spipu/html2pdf 这类库解释 html 后生成 PDF|


在后台生成，能保持一致的样式，且不需要浏览器支持，但会占用服务器资源。生成速度大概率会比在前端慢。

在前端生成，各个浏览器生成的 PDF 样式可能会有一点差异，但不占用服务器资源。如果是调用 print 事件方式生成的，速度肯定比在后台生成快。

<!--
实现难度
样式一致
a 标签
缺点
-->

## 生成 PDF 的 html 代码

1. 直接使用当前的 html 代码
    - 大部分情况下，除非一开始就考虑打印样式，不然直接调用 print 事件， PDF 的样式多少都会有一点混乱
1. 使用当前的 html 代码，并在此基础上做好打印样式的适应
    - 这是比较理想的方式，但现在各类前端的框架其实都没有很好地考虑打印样式，特别是历史项目，不是每一个程序员都有耐心修改打印样式的
1. 单独写一份用于打印样式的 html 代码
    - 比较折中的方式，看上去多写一套不好维护，但实际上，笔者多年的实践，大部分情况下，重构页面会比修改简单

## 个人认为的最佳实践

1. 用浏览器的 api 实现，各类工具库无论怎么完善，对 html 的渲染肯定不及浏览器的。
1. 在项目开始的时候就考虑导出 PDF 的需求， html 代码从一开始就适应打印样式。直接在浏览器调用 print 事件就可以了。
1. 如果导出 PDF 的需求是中途出现的
    - 如果没有样式的需求，单独写一份用于打印的 html 代码，用隐藏的 iframe 标签生成 PDF
    - 如果有样式的需求，就尽量在原有的代码里修改样式适应打印，如果改不动了，还是单独写一份用于打印的 html 代码，再用隐藏的 iframe 标签生成 PDF
1. 如果想让生成的 PDF 样式保持一致，最好还是在后台生成。但笔者认为，大部分情况下浏览器之间微小的差异是可以忽略的。

## 示例的代码

```
(function(){
    let printCode = `<h1>test</h1>`;
    var iframe = document.createElement("iframe");
    iframe.id = 'iframe_print_' + Math.round(new Date().getTime());
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentWindow.document.write(printCode); // 一定要用 write 方法， innerHTML 属性有时会打印失败
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(function(){
        // 如果还没渲染完pdf就移除 iframe 的标签，会打印失败，等待的时间可以调整，甚至一直留着 iframe 标签都可以
        document.getElementById(iframe.id).parentNode.removeChild(iframe);
    }, 3000);
})();
```

## PS
Opera 浏览器（77.0.4054.203）有一个把页面另存为 PDF 的功能（不是打印预览），几乎可以把页面的样式完整地保留下来（不是打印的样式就是当前渲染的样式）而且还能保持 a 标签的链接。但只能通过图形界面操作，没有命令行参数，也不能通过 Playwright 这类工具来操作浏览器生成。

可以弄一个单独的 Windows 服务器，用 autoit 这类工具操作 Opera 浏览器把页面另存为 PDF 。

save as pdf 和 pirnt to pdf 是不一样的，
具体区别还不清楚，其中一个区别是 save as pdf 里的文字是可以选中的， save as pdf 可以保留链接

https://community.adobe.com/t5/framemaker-discussions/quot-save-as-pdf-quot-vs-quot-print-quot-as-pdf/m-p/3571101

https://answers.microsoft.com/en-us/msoffice/forum/all/save-as-pdf-vs-print-to-pdf-quality-issues/28c536c6-6fb2-4484-b28b-1e15ce4aac75

thead 标签可以在表格被分页时，每一页都保持一个表头
