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
    - 在后台用 headless 浏览器生成 PDF
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

## 示例代码

### 使用 window.print 事件来生成 PDF

```JavaScript
(function(){
    let printCode = `<h1>test</h1>`;
    var iframe = document.createElement("iframe");
    iframe.id = 'iframe_print_' + Math.round(new Date().getTime());
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentWindow.document.write(printCode); // 一定要用 write 方法， innerHTML 属性有时会打印失败
    iframe.contentWindow.focus();
    setTimeout(function() {
        // 如果太快调用 print 方法，可能会因为节点未渲染完而导致pdf一片空白
        iframe.contentWindow.print();
        setTimeout(function() {
            // 如果还没渲染完pdf就移除 iframe 的标签，会打印失败，等待的时间可以调整，甚至一直留着 iframe 标签都可以
            document.getElementById(iframe.id).parentNode.removeChild(iframe);
        }, 3000);
    }, 1000);
})();
```

把 markdown 转换成 html，再把html转换成 pdf
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Marked in the browser</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
  <div>
  <textarea id="content"># test</textarea>
  <button id="convert">convert</button>
  </div>
  <script>
    document.getElementById('convert').addEventListener('click', function() {
      let printCode = marked.marked(document.getElementById('content').value);
      var iframe = document.createElement("iframe");
      iframe.id = 'iframe_print_' + Math.round(new Date().getTime());
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframe.contentWindow.document.write(printCode); // 一定要用 write 方法， innerHTML 属性有时会打印失败
      iframe.contentWindow.focus();
      setTimeout(function() {
            // 如果太快调用 print 方法，可能会因为节点未渲染完而导致pdf一片空白
            iframe.contentWindow.print();
            setTimeout(function() {
                // 如果还没渲染完pdf就移除 iframe 的标签，会打印失败，等待的时间可以调整，甚至一直留着 iframe 标签都可以
                document.getElementById(iframe.id).parentNode.removeChild(iframe);
          }, 3000);
      }, 1000);
    });
  </script>
</body>
</html>
```

### 使用 jspdf 和 dom-to-image 这两个库来生成 PDF

这是先生成图片再生成pdf

```JavaScript
(function(){
    function addScript(src) {
        tmpNode = document.createElement("script");
        tmpNode.src = src;
        document.body.appendChild(tmpNode);
    }
    addScript("https://cdn.bootcdn.net/ajax/libs/dom-to-image/2.6.0/dom-to-image.js");
    addScript("https://cdn.bootcdn.net/ajax/libs/jspdf/2.1.1/jspdf.umd.js");
    setTimeout(()=>{

        domtoimage.toJpeg(document.body, { quality: 0.95, bgcolor: '#FFFFFF' })
            .then(function (dataUrl) {

                var image = new Image();
                image.onload = function(){

                    var contentWidth = image.width;
                    var contentHeight = image.height;

                    // 这是生成横向 A4
                    // 一页pdf显示html页面生成的canvas高度;
                    var pageHeight = 592.28;
                    // 未生成pdf的html页面高度
                    var leftHeight = contentHeight*(1-0.138);
                    //pdf页面偏移
                    var position = 0;
                    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                    var imgWidth = 841.89;
                    var imgHeight = 841.89/contentWidth * contentHeight;
  
                    // 这是生成纵向 A4
                    // //一页pdf显示html页面生成的canvas高度;
                    // var pageHeight = contentWidth / 592.28 * 841.89;
                    // //未生成pdf的html页面高度
                    // var leftHeight = contentHeight;
                    // //pdf页面偏移
                    // var position = 0;
                    // //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                    // var imgWidth = 595.28;
                    // var imgHeight = 595.28/contentWidth * contentHeight;

                    // var pageData = canvas.toDataURL('image/png', 1.0);
  
                    const { jsPDF } = window.jspdf;
                    // var pdf = new jsPDF('', 'pt', 'a4');
                    var pdf = new jsPDF('landscape', 'pt', 'a4');
  
                    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                    //当内容未超过pdf一页显示的范围，无需分页
                    if (leftHeight < pageHeight) {
                        pdf.addImage(image, 'JPEG', 0, 0, imgWidth, imgHeight );
                    } else {
                        while(leftHeight > 0) {
                            pdf.addImage(image, 'JPEG', 0, position, imgWidth, imgHeight)
                            leftHeight -= pageHeight;
                            position -= 592.28;
                            console.log(leftHeight, position);
                            //避免添加空白页
                            if(leftHeight > 0) {
                                pdf.addPage();
                            }
                        }
                    }
  
                    pdf.save('content.pdf');

                };
                image.src = dataUrl;
            });
    }, 3000)
})();

// 用于应对 CSP ，一些情况下，通过控制台无法引用外部的js链接
(function(){
    // 检查是否存在 head 标签
    if (!document.head) {
        // 创建一个新的 head 标签
        var head = document.createElement('head');
        // 将新创建的 head 标签插入到 html 标签中
        document.documentElement.insertBefore(head, document.documentElement.firstChild);
    }
    var meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', 'script-src https://cdn.bootcdn.net');
    // 将新创建的 meta 标签插入到 head 标签中
    document.getElementsByTagName('head')[0].appendChild(meta);
})();


// 如果一些资源无法加载，例如 谷歌字体 这种，那么图片可能会生成失败
(function(){
    function addScript(src) {
        tmpNode = document.createElement("script");
        tmpNode.src = src;
        document.body.appendChild(tmpNode);
    }
    addScript("https://cdn.bootcdn.net/ajax/libs/dom-to-image/2.6.0/dom-to-image.js");
    setTimeout(()=> {
        domtoimage.toJpeg(document.body, { quality: 0.95, bgcolor: '#FFFFFF' })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'image-' + Date.now() + '.jpeg';
                link.href = dataUrl; // 这是 base64 的字符串，好像直接用那种 blob 对象也可以
                link.click();
            });
    }, 3000)
})();
```

### 使用 Chrome 的命令行参数来生成 PDF

```
"C:\Users\a\AppData\Local\Google\Chrome\Application\chrome.exe" \
    --headless=new \
    --no-sandbox \
    --disable-gpu \
    --window-size=1920,1080 \
    --ignore-certificate-errors \
    --no-pdf-header-footer \
    --print-to-pdf=f2h2h1.pdf \
    "https://f2h2h1.github.io/"

--headless：启用无头模式，无需 GUI 环境即可运行。
--no-sandbox：禁用沙盒模式，某些环境下可能需要此选项以避免权限问题。
--disable-gpu：禁用 GPU 硬件加速，有助于在不支持 GPU 或驱动有问题的系统上提高稳定性。
--window-size：设置浏览器窗口大小，这对于页面布局可能很重要。
--print-to-pdf：指定输出的 PDF 文件名和路径。
--incognito：使用无痕模式打开页面
--ignore-certificate-errors 忽略证书错误
--timeout 定义了最长等待时间（以毫秒为单位）
--no-pdf-header-footer 不要页眉 不要页脚
最后一个参数是需要导出为 PDF 的网页 URL。

--headless=new
这个参数可以用新的headless模式，生成的pdf能保留更多的css样式。但笔者认为还是旧模式生成的pdf好看一点

--virtual-time-budget
在某种程度上对于任何具有时效性的代码（例如，setTimeout/setInterval），虚拟时间可充当“快进”。
它会强制浏览器尽快执行相应网页的任何代码，同时让网页相信时间实际上会经过。
下面展示了如何捕获网页在 42 秒后的状态并将其保存为 PDF 格式：
chrome --headless=new --print-to-pdf --virtual-time-budget=42000 https://mathiasbynens.be/demo/time

```

导出 html 代码或截图，就把 --print-to-pdf 替换成 --dump-dom 或 --screenshot 。
如果pdf输出的路径不是绝对路径，那么pdf可能会生成在chrome 的安装根目录下， 要确保浏览器在对应的目录有写入的权限。
edge 也可以用类似的命令，但火狐却没有生成PDF的命令

### 使用 Playwright 生成 PDF

- python 3.12
- playwright 1.45
- 这个是很简单的例子，在 pdf 方法里还有不少参数可以设置，例如设置 页码 页眉 这些
- 参考
    - https://playwright.dev/python/docs/api/class-playwright
    - https://playwright.dev/python/docs/api/class-browsertype#browser-type-launch
    - https://playwright.dev/python/docs/api/class-page#page-pdf
- Puppeteer 和 Selenium 也有类似的操作

```python
import time
from playwright.sync_api import sync_playwright, Playwright

def run(playwright: Playwright):
    chromium = playwright.chromium
    browser = chromium.launch(devtools=True, headless=False, executable_path="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")

    # 其它一些可能会用到的参数
    # args=args, executable_path=executablePath, devtools=devtools, headless=headless, user_data_dir='./playwright_temp/user', user_agent=ua, viewport=windowSize, is_mobile=isMobile

    page = browser.new_page()

    targetUrl = "https://f2h2h1.github.io/article/%E6%8A%8A%E7%BD%91%E9%A1%B5%E5%AF%BC%E5%87%BA%E6%88%90PDF.html"
    waittime = 3
    load_script = '''
        console.log(123);
    '''

    if load_script != None:
        page.on("load", lambda :page.evaluate(load_script))

    page.goto(targetUrl)

    page.wait_for_load_state('load')
    time.sleep(waittime)

    # page.pdf(path="page.pdf")
    with open('page.pdf', 'wb') as file:
        file.write(page.pdf())

    browser.close()

if __name__ == '__main__':
    with sync_playwright() as playwright:
        run(playwright)
```

## PS
Opera 浏览器（77.0.4054.203）有一个把页面另存为 PDF 的功能（不是打印预览），几乎可以把页面的样式完整地保留下来（不是打印的样式就是当前渲染的样式）而且还能保持 a 标签的链接。但只能通过图形界面操作，没有命令行参数，也不能通过 Playwright 这类工具来操作浏览器生成。
可以弄一个单独的 Windows 服务器，用 autoit 这类工具操作 Opera 浏览器把页面另存为 PDF 。

Adobe Acrobat 的浏览器扩展也可以生成 PDF ，但这个扩展似乎需要在系统里安装 Adobe Acrobat ，
Adobe Acrobat 似乎没有免费的版本，虽然破解版也不是不能用，但商业使用的话始终有风险
- https://helpx.adobe.com/cn/acrobat/using/converting-web-pages-pdf.html
- https://helpx.adobe.com/cn/acrobat/kb/acrobat-pro-edge-extension.html
- https://helpx.adobe.com/cn/acrobat/kb/install-acrobat-pro-chrome-extension.html

save as pdf 和 pirnt to pdf 是不一样的，
具体区别还不清楚，其中一个区别是 save as pdf 里的文字是可以选中的， save as pdf 可以保留链接
- https://community.adobe.com/t5/framemaker-discussions/quot-save-as-pdf-quot-vs-quot-print-quot-as-pdf/m-p/3571101
- https://answers.microsoft.com/en-us/msoffice/forum/all/save-as-pdf-vs-print-to-pdf-quality-issues/28c536c6-6fb2-4484-b28b-1e15ce4aac75

thead 标签可以在表格被分页时，每一页都保持一个表头

<!--

右键菜单的打印
ctrl+p
浏览器菜单的打印
直接调用 print 事件
这四种操作生成的pdf效果是一样的

有哪些可以导出pdf的浏览器插件

其实可以把上面几段js写成Tampermonkey脚本吧

看上去挺厉害的一个工具，用于把网页保存为pdf，但本质上依然是用浏览器实现的，这是用 Qt WebKit
https://wkhtmltopdf.org/
https://github.com/wkhtmltopdf/wkhtmltopdf
因为用了 qt 所以可以跨平台运行
但从 github 的仓库来看，好像已经处于不活跃的阶段了

我也写一个，封装一个浏览器在里面，然后做到开箱即用
其实可以不单输出 pdf ，输出 图片 html 代码也是可以的吧
把那个 seo 的仓库再改一下
面向一般用户的，面向开发者的


afterprint 和 beforeprint 事件允许页面在打印开始之前更改其内容（例如，也许是移除 banner）然后在打印完成后还原这些更改。
window.addEventListener("beforeprint", (event) => {
  console.log("打印前");
});
window.addEventListener("afterprint", (event) => {
  console.log("打印后");
});


@media print { ... }

<link rel="stylesheet" src="styles.css" media="print" />

-->