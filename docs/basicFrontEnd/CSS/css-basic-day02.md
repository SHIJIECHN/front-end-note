---
autoGroup-1: CSS基础
sidebarDepth: 3
title: day02
---

## 宽高
`width`, `height`, `min-width`, `min-height`, `max-width`, `max-height`
`overflow`: 
- `hidden` 隐藏溢出的部分  
- `scroll` 滚动条，任何时候都有滚动条
- `auto` 溢出自动生成滚动条

滚动条(`17px`)占用盒子内部宽度。

## 字体
浏览器默认的字体大小是`16px`。字体调整是以高度为基准，宽度自动缩放。常用`12px`, `14px`, `16px`。   
字体大小：`font-size`  
字体粗细：`font-weight`: `lighter` | `normal` | `bold` | `bolder` | `100 - 900`
```html
<style type="text/css">
    p {
        font-size: 14px;
    }
</style>

<p>你好</p>
```

字体风格样式
`font-style`: 
- `italic` 斜体
- `oblique` 倾斜。不是所有字体都有倾斜样式，这时就需要`italic`
- `normal`
  
`font-family: "Time New Roman", Georgia, serif;` 复合，当第一个字体不兼容时，会选择第二个字体。引号：中文、有空格的字体表示是需要引号的。  
通用字体：`arial`。·

## 边框
`border: 1px solide #000;`
```html
<style>
    div {
        width: 100px;
        height: 100px;
        border: 1px solid #000;
    }
</style>

<div></div>
```
此时边框的可视化宽高为`102px`，边框的宽高是设置在盒子容器之外的。   
单独设置边框的属性：
```html
<style>
    div {
        width: 100px;
        height: 100px;
        border-top: 1px solid red;
        border-right: 3px solid blue;
        border-bottom: 5px solid green;
        border-left: 8px solid pink;
    }
</style>
```
复合值分解：
```html
<style>
    div {
        width: 100px;
        height: 100px;
        /* border: 1px solid #000; */
        border-width: 1px; /* 上下左右为1px*/
        /* border-width: 5px 10px; 设置上下为5px 左右为10px*/
        border-style: solid;
        border-color: #000;
    }
</style>
```
`border-style`: `dotted` | `dashed` | `solid` | `double`...   
单独设置`border-color`：
```html
<style>
    div {
        width: 100px;
        height: 100px;
        border: 1px solid #000;
        border-width: 30px;
        border-style: solid;
        border-top-color: red;
        border-right-color: green;
        border-bottom-color: blue;
        border-left-color: orange;
    }
</style>
```
查看border的分界线是斜的，border是梯形，怎么让边框变成三角形呢？  
只需要将宽高设置为0px。
```html
<style>
    div {
        width: 0px;
        height: 0px;
        border: 1px solid #000;
        border-width: 100px;
        border-style: solid;
        border-top-color: red;
        border-right-color: green;
        border-bottom-color: blue;
        border-left-color: orange;
    }
</style>
```
如果想要向右的三角形呢？   
其他三个颜色设置transparent
```html
<style>
    div {
        width: 0px;
        height: 0px;
        border: 1px solid #000;
        border-width: 100px;
        border-style: solid;
        border-top-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        border-left-color: orange;
    }

    /* 简化写法 */
    div {
        width: 0px;
        height: 0px;
        border: 1px solid #000;
        border-width: 100px;
        border-style: solid;
        border-color: transparent;
        border-left-color: orange;
    }
</style>
```
现在设置的`100px`是谁？是等腰三角形的高度。  

## 文本对齐
`text-align: center | left | right`
对齐必须是对一个有宽高的容器内部。
```html
<style>
    div {
        width: 200px;
        height: 200px;
        border: 1px solid #000;
        text-align: center;
    }
</style>

<div>你好</div>
```

## 文本行高
默认是`22px`，一行所占用的高度。
```html
<style>
    div {
        width: 200px;
        height: 200px;
        border: 1px solid #000;
        line-height: 23px;
    }
</style>

<div>你好，班主任</div>
```
水平垂直居中
```html
<style>
    div {
        width: 200px;
        height: 200px;
        border: 1px solid #000;
        text-align: center;
        line-height: 200px; /*设置行高为盒子的高度*/
    }
</style>

<div>你好，班主任</div>
```
## 缩进
`text-indent: 10px; `   
用在`input`上
```html
<style>
    input {
        text-indent: 10px;
    }
</style>

<input type="text" />
```
文本缩进：`text-indent: 2em;`
```html
<style>
    div {
        width: 200px;
        height: 500px;
        border: 1px solid #000;
    }
    
    p {
        text-indent: 2em;
    }
</style>

<div class="box">
    <p>
        你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。
    </p>
    <p>
        你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。
    </p>

</div>
```

## 单位
绝对单位：无论在任何环境，且环境变化，不会导致实际量的变化。 例如公里。 
相对单位：环境的变化会导致实际量的变化。  
`em`：当前元素内文本宽度的倍数。默认字体大小是`16px`，所以当前1em = 16px。则1.2em = 1.2 * 16px。如果设置当前字体大小是14px，则1em = 14px。   
通常为了使用方便，1em = 16px，10px = 0.625em，会在`html`或`body`元素上设置`font-size：62.5%`；在需要设置字体的地方在设置`font-size: 1.6em;` 即字体就是`16px`。
```html
<style>
    html {
        font-size: 62.5%;
    }
    
    div {
        width: 200px;
        height: 500px;
        border: 1px solid #000;
    }
    
    p {
        font-size: 1.6em;
        text-indent: 2em;
    }
</style>

<div class="box">
    <p>
        你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。你好，世界。
    </p>
</div>
```
题目：行高1.2倍
```html
<style>
    p{
        line-height: 1.2em;
    }

</style>
```

## 文本修饰
`text-decoration: none | underline | line-through | overline   `
语义化标签：
\<ins>\</ins>下横线   
\<del>\</del>上横线

## 光标
`cursor: pointer | not-allowed | help | resize`
```html
<style>
    span {
        color: purple;
        text-decoration: underline;
        cursor: pointer;
    }
    
    button,
    input[type="submit"] {
        cursor: not-allowed;
    }
</style>
<a href="">百度一下，你就知道了。</a>
<span>
    百度一下，你就知道了。
</span>
<br>
<button disabled="disabled">提交</button>
<input type="submit" disabled="disabled" />
```

## 文本显示 
单行文本截断和显示省略号的三大件
```html
<style>
    div {
        width: 200px;
        height: 22px;
        border: 1px solid #000;
        white-space: nowrap;
        /*不换行*/
        overflow: hidden;
        text-overflow: ellipsis;
        /*隐藏部分加省略号*/
    }
</style>

<div>
    <span>我想非常想成为优秀的前端工程师</span>
</div>
```

## display
`display: inline | inline-block | block`

内联或者内联块只要有换行，都会当成一个文本分隔符。

## 伪类选择器
- `:hover`
```html
<style>
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    
    a {
        text-decoration: none;
    }
    
    .header {
        width: 100%;
        min-width: 1024px;
        height: 60px;
        background-color: #000;
    }
    
    .header ul {
        height: 100%;
    }
    
    .header ul li {
        float: left;
        width: 150px;
        height: 100%;
    }
    
    .header ul li a {
        display: block;
        width: 100%;
        height: 100%;
        color: #fff;
        line-height: 60px;
        text-align: center;
        font-size: 16px;
    }
    
    .header ul li.active a {
        color: #FD5;
        background-color: #333;
    }
    
    .header ul li a:hover {
        color: #FD5;
        background-color: #333;
    } 
</style>

<div class="header">
    <ul>
        <li class="active">
            <a href="">首页</a>
        </li>
        <li>
            <a href="">服务号</a>
        </li>
        <li>
            <a href="">微课堂</a>
        </li>
        <li>
            <a href="">系列课</a>
        </li>
    </ul>
</div>
```

- `:disable ` 
按钮禁用状态
```html
<style>
    button:disabled {
        background-color: #333;
    }
</style>

<button disabled="disabled">按钮</button>
```
- `checked`
相关内容：
    - 1. 透明度`opacity`
    - 2. \+ 兄弟选择器：同父级、相邻、再其之后
```html
<style>
    .checkbox {
        width: 40px;
        height: 40px;
        border: 2px solid #000;
        border-radius: 50%;
    }
    
    .checkbox label {
        display: block;
        width: 20px;
        height: 20px;
        margin: 10px;
        background-color: #000;
        opacity: 0;
        filter: alpha(opacity=0);
        border-radius: 50%;
    }
    
    .checkbox input[type="checkbox"] {
        display: none;
    }
    
    .checkbox input[type="checkbox"]:checked+label {
        opacity: 1;
        filter: alpha(opacity=100)
    }
</style>

<div class="checkbox">
    <input type="checkbox" id="checkbox">
    <label for="checkbox"></label>
</div>
```
:::tip
`display:none`和`visibility:hidden`的区别：   
`visibility:hidden`保留占据的文档空间，`display:none`不保留占据的文档空间。
:::

选择第一个和最后一个元素：
- `:first-child`
- `:last-child`
- `nth-child(n | odd | even)`

## 文本对齐
行内块元素和行内元素之间文本对齐：  
`vertical-align: top | bottom | middle | 像素`
```html
<style>
    img {
        width: 150px;
        border: 1px solid #000;
        vertical-align: middle;
    }
</style>

<img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" alt="">
<span>123</span>
```
没有文本的行内块元素对齐是在最下面的，有文本的时候对齐是最上面的。
```html
<style>
    .block {
        display: inline-block;
        width: 150px;
        height: 60px;
        border: 1px solid #000;
        vertical-align: middle;
    }
</style>

<span class="block">123</span>
<span>123</span>
```

容器内多行文本居中的方法：
- 1.将容器的`display`设置为`table`
- 2.将容器内的文本设置成`table-cell`（表格单元格属性）
- 3.容器内的文本的`vertical-align`设置成`middle`
```html
<style>
    div {
        display: table;
        width: 100px;
        height: 100px;
        font-size: 12px;
        border: 1px solid #000;
    }
    
    span {
        display: table-cell;
        vertical-align: middle;
    }
</style>

<div>
    <span>百度一下，你就知道！百度一下，你就知道！百度一下，你就知道！</span>
</div>
```
多张图片之间的空格处理
```html
<style>
    img {
        width: 100px;
        border: 1px solid #000;
    }
</style>

<img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" alt="">
<img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" alt="">
<img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" alt="">
<img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" alt="">
```


