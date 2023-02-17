import { marked } from './static/marked.esm.js';
// marked 4.2.3
// console.log(marked);
var md =`
# 关于

## 关于这个页面
1. 这是一个简单的静态博客
2. 文章使用 markdown 格式

## 这个页面所用到的技术
1. marked（渲染 markdown）https://github.com/markedjs/marked
2. 使用到这个 VSCode 的图片插件 [Paste Image](https://github.com/mushanshitiancai/vscode-paste-image)

## 关于作者本人
请浏览作者的 github 主页 https://github.com/f2h2h1

## 做这个博客的目的
记录一下一些开发的经验

## 为什么使用 markdown ？
1. 曾经尝试过 Hexo 这类的静态博客，感觉有点复杂（可能是因为不熟悉 nodejs）。
2. 曾经尝试过 Wordpass typecho 这类 PHP 的博客，但这种又要搞一个服务器。
3. 所以想来想去，最终就搞了一个用 marked 渲染 markdown 文本的，简单的页面（姑且算作博客）
- ~~其实已经改得很复杂很混乱了~~

## 这些年写博客的一些感受
- 排版也是很花时间
- 不必等到一些都准备好时再动笔，有想法就可以动笔记录下来了
- 别纠结是不是原创，别纠结前面有没有人写过相同的问题，这是属于自己的笔记，自己的博客，只要是自己觉得有需要就可以记录下来
- 要时不时回顾一下自己写的笔记
- 往往在回顾的时候会发现一些自己还理解不透彻的地方，然后针对理解不透彻的地方继续学习，继续扩充笔记
- 经历大量实践后，最后记录下来的可能只有简单的几句话
- 一直都不喜欢太多的图片，因为图片体积大，而且不好做版本控制，但是一些内容又很难用文字描述，又不得不使用图片
`;

var html = marked.parse(md.trim());
console.log(html);