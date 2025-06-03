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

```html
<style>
details summary {
    list-style: none;
    cursor: pointer;
}
details summary .label {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
}
details summary .arrow-icon {
    width: 16px;
    padding-left: 6px;
    padding-right: 6px;
    flex-shrink: 0;
}
details[open] summary .arrow-icon {
    transform: rotate(180deg);
}
</style>
<details class="field" id="" >
    <summary>
        <div class="label">
            <p>title</p>
            <svg class="arrow-icon" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7529 0.26612C16.0892 0.613178 16.0804 1.16713 15.7334 1.5034L8.73339 8.28594C8.39405 8.61473 7.85497 8.61473 7.51563 8.28594L0.515631 1.5034C0.168573 1.16713 0.159833 0.613177 0.496109 0.26612C0.832384 -0.0809374 1.38633 -0.0896779 1.73339 0.246597L8.12451 6.43917L14.5156 0.246598C14.8627 -0.0896773 15.4166 -0.0809368 15.7529 0.26612Z" fill="#777777" /></svg>
        </div>
    </summary>
    content
</details>
```
