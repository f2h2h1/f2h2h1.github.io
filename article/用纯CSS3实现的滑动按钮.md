用纯 CSS3 实现的滑动按钮
================================

## 原理

0. checkbox 要有 label 标签且在 label 标签里面
0. label 标签里面还要有一个 span 标签
0. 用一个 div 包裹 checkbox ，方便添加样式
0. checkbox 要隐藏起来
0. span 标签用伪元素画出滑动按钮
    - ::before 作为背景
    - ::after 作为滑块
0. 用 :checked 来区分 checkbox 选中和未选中的状态
    - 当 checkbox 为选中状态时更改 span::before 的背景颜色和 span::after 的位置

<!-- 加上动画 -->

## 完整的代码

```html
<style>
.switch {
    position: relative;
}
.switch input[type=checkbox] {
    display:none;
}
.switch span {
    cursor: pointer;
    position: absolute;
    display: block;
    text-align: center;
    padding-left: 50px;
}
.switch span::before {
    content: "";
    cursor: pointer;
    width: 40px;
    height: 24.5px;
    border: 1px solid rgb(156, 155, 155);
    background-color: rgb(179, 176, 176);
    border-radius: 25px;
    position: absolute;
    left: 0px;
    display: inline-block;
}
.switch span::after {
    content: "";
    cursor: pointer;
    width: 25px;
    height: 25px;
    background-color: rgb(255, 255, 255);
    border-radius: 25px;
    position: absolute;
    left: 0px;
    top:0px;
    display: inline-block;
}
.switch input[type=checkbox]:checked + span::before {
    background-color: green;
}
.switch input[type=checkbox]:checked + span::after {
    margin-left:15px;
}
</style>
<div class="switch">
    <label>
        <input type="checkbox" />
        <span>label</span>
    </label>
</div>
```
