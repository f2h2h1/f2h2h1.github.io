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
0. 用 transition 属性来实现动画

## 完整的代码

```html
<style>
.switch {
	--button-width: 25px;
	--bg-width: 50px;
	--transition-fun: 0.3s ease;
}
.switch input[type=checkbox] {
    display:none;
}
.switch span {
    cursor: pointer;
    display: flex;
    text-align: center;
    align-content: center;
    align-items: center;
    justify-content: flex-start;

}
.switch span::before {
    content: "";
    cursor: pointer;
    width: var(--bg-width);
    height: var(--button-width);
    border: 1px solid rgb(156, 155, 155);
    background-color: rgb(179, 176, 176);
    border-radius: var(--button-width);
	margin-right: 5px;
    display: inline-block;
	transition: background-color var(--transition-fun);
}
.switch span::after {
    content: "";
    cursor: pointer;
    width: var(--button-width);
    height: var(--button-width);
    background-color: rgb(255, 255, 255);
    border-radius: var(--button-width);
	position: absolute;
    display: inline-block;
	transition: margin-left var(--transition-fun);
}
.switch input[type=checkbox]:checked + span::before {
    background-color: green;
	transition: background-color var(--transition-fun);
}
.switch input[type=checkbox]:checked + span::after {
    margin-left: calc(var(--bg-width) - var(--button-width));
	transition: margin-left var(--transition-fun);
}
</style>
<div class="switch">
    <label>
        <!-- <input type="checkbox" checked /> 如果需要默认选中，就在标签里加上 checked 属性 -->
        <input type="checkbox" />
        <span>label</span>
    </label>
</div>
```
