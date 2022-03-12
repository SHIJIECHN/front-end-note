---
autoGroup-1: CSS基础
sidebarDepth: 3
title: day01 
---

## 权重
| 选择器 | 权重
|--------|--------|
|\*   | 0 |
|标签，伪元素 | 1  |
|class, 属性，伪类  |  10  |
|id  | 100|
|内联样式| 1000|
|!important | 正无穷 |

并列选择器（不用）
```html
<style type="text/css">
    h1.title{
        color: blue;
    }
    p.title{
        color: red;
    }
</style>

<h1 class="title"></h1>
<p class="title"></p>
```

文本提示样式类
所有文本都是粗体
1、success 成功的提示 green
2、warning 警告的提示 orange
3、danger 失败的提示 red
```html
<style type="text/css">
    .tip{
        font-weight: bold;
    }

    .tip.tip-success{
        color: green;
    }
    .tip.tip-warning{
        color: orange;
    }
    .tip.tip-danger{
        color: red;
    }
</style>

<p class="tip tip-success">1、success 成功的提示 green</p>
<p class="tip tip-warning">2、warning 警告的提示 orange</p>
<p class="tip tip-danger">3、danger 失败的提示 red</p>
```

分组选择器
```html
<style>
    input,
    textarea {
        outline: none;
    }
</style>

<input type="text">
<br/>
<textarea name="" id="" cols="30" rows="10"></textarea>
```
轮廓：outline: none;
- outline-color: green;
- outline-style: dotted | dashed...
- outline-width: 3px;
开发的过程中只用到outline: none;设置无轮廓，其他几乎不会用到，只需要了解。

## 匹配规则
浏览器对父子选择器的匹配规则：
```html
<style>
    .nav header h3 span{

    }
</style>
```
从右到左，从下到上

button标签
```html
<button type="submit">按钮</button>
<input type="submit" value="按钮">
```
两者区别：
submit是在form表单中提交数据的，submit并没有获取任何值，直接把form表单中所有的数据都提交。按钮还可以当其他的用途。
```html
<style>
    button {
        font-size: 14px;
        color: white;
        border: none; /**去掉边框*/
        background-color: green;
    }
</style>

<button>按钮</button>
```

写一个简单的button样式类。  
要求：   
1、所有的按钮字体颜色是白色   
2、所有的按钮无边框   
3、所有的按钮高度34px   
4、所有的按钮字体大小14px；

总类名： btn  
二级类名  
- btn-success  背景颜色#5cb85c
- btn-warning 背景颜色#f0ad4e
- btn-danger 背景颜色#d9534f

```html
<style>
    .btn {
        color: white;
        border: none;
        height: 34px;
        font-size: 14px;
    }
    
    .btn.btn-success {
        background-color: #5cb85c;
    }
    
    .btn.btn-warning {
        background-color: #f0ad4e;
    }
    
    .btn.btn-danger {
        background-color: #d9534f;
    }
</style>

<button class="btn btn-success">按钮</button>
<button class="btn btn-danger">按钮</button>
<button class="btn btn-warning">按钮</button>
```

## 宽高
width height min-width min-height max-width max-height
overflow: 
- hidden 隐藏溢出的部分  
- scroll 滚动条，任何时候都有滚动条
- auto 溢出自动生成滚动条
滚动条(17px)占用盒子内部宽度。



## 字体
浏览器默认的字体大小是16px。字体调整是以高度为基准，宽度自动缩放。常用12px, 14px, 16px。   
font-size  
font-weight: lighter | normal | bold | bolder  100 - 900
```html
<style type="text/css">
    p{
        font-size: 14px;
    }
</style>

<p>你好</p>
```

字体风格样式：
font-style: 
- italic 斜体
- oblique 倾斜。不是所有字体都有倾斜样式，这时就需要italic
- normal
  
font-family: "Time New Roman", Georgia, serif; 复合，当第一个字体不兼容时，会选择第二个字体。引号：中文、有空格的字体表示是需要引号的。  
通用字体：arial

## 边框
border: 1px solide #000;
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
此时边框的可视化宽高为102px，边框的宽高是设置在盒子容器之外的。   
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
border-style: dotted | dashed | solid | double...   
单独设置border-color：
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
现在设置的100px是谁？是等腰三角形的高度。  

## 文本对齐
text-align: center | left | right
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
默认是22px，一行所占用的高度。
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
text-indent: 10px;    
用在input上
```html
<style>
    input {
        text-indent: 10px;
    }
</style>

<input type="text" />
```
文本缩进：text-indent: 2em;
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
绝对单位：无论在任何环境，且环境变化，不会导致实际量的变化。  
相对单位：环境的变化会导致实际量的变化。  
em：当前元素内文本宽度的倍数。默认字体大小是16px，所以当前1em = 16px。则1.2em = 1.2 * 16px。如果设置当前字体大小是14px，则1em = 14px。   
通常为了使用方便使，1em = 16px，10px = 0.625em，会在html或body元素上设置font-size：62.5%；在需要设置字体的地方在设置font-size: 1.6em; 即字体就是16px。
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


