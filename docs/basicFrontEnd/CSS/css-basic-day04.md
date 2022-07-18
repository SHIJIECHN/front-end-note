---
autoGroup-1: CSS基础
sidebarDepth: 3
title: day04
---

## 盒子阴影
box-shadow: 水平位置  垂直位置 模糊距离 阴影的尺寸 阴影颜色 阴影的种类
```html
<style>
    .box {
        width: 300px;
        height: 150px;
        margin: 100px;
        background-color: orange;
        /* box-shadow: 10px 20px; */
        box-shadow: 0 10px;
        /* 垂直向下模糊10px */
        box-shadow: 10px 0;
        /*水平向右模糊10px*/
        box-shadow: 10px 10px 5px 5px;
        box-shadow: 0 0 10px 10px;
        /*当偏移量为0时，扩展阴影，四周一圈阴影*/
        box-shadow: 0 15px 10px 10px #f40 inset;
        /*inset 向内扩散 没有inset是向外扩散*/
    }
</style>
```
<img :src="$withBase('/basicFrontEnd/CSS/box-shadow.png')" alt="box-shadow">  

上方阴影遮挡
```html
<style>
    body {
        margin: 0;
    }
    
    .header {
        position: relative;
        z-index: 1;
        /* 层级覆盖遮挡方法*/
        width: 100%;
        height: 60px;
        background-color: yellow;
    }
    
    .box {
        width: 200px;
        height: 200px;
        background-color: orange;
        margin-left: 200px;
        box-shadow: 0 0 10px #000;
        -webkit-box-shadow: 0 0 30px #000;
        /*webkit Chrome safari*/
        -moz-box-shadow: 0 0 30px #000;
        /*firefox*/
        -o-box-shadow: 0 0 30px #000;
        /*presto opera*/
    }
</style>

<div class="header"></div>
<div class="box"></div>
```

<img :src="$withBase('/basicFrontEnd/CSS/box-shadow01.png')" alt="box-shadow"> 

## 边框圆角（border-radius）
```html
<style>
.box1 {
  width: 200px;
  height: 200px;
  background-color: orange;
  border-radius: 20px;
  /*可以设置像素*/
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  -o-border-radius: 20px;
}
.box2 {
  width: 200px;
  height: 200px;
  background-color: orange;
  border-radius: 50%;
  /*宽高相等时设置圆*/
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -o-border-radius: 50%;
}

.box3 {
  width: 200px;
  height: 100px;
  background-color: orange;
  border-radius: 50px;
  /*设置半圆角 height/2 */
}
</style>

<div class="box1"></div>
<div class="box2"></div>
<div class="box3"></div>
```

<img :src="$withBase('/basicFrontEnd/CSS/border-radius.png')" alt="border-radius"> 

圆角容器被非圆角元素遮盖
```html
<style>
    .box {
        width: 468px;
        height: 702px;
        border: 1px solid #000;
        border-radius: 20px;
        overflow: hidden;
        /* 图片溢出的部分隐藏*/
    }
    
    img {
        width: 100%;
        height: 100%;
    }
</style>

<div class="box">
    <img src="https://images.pexels.com/photos/11769686/pexels-photo-11769686.jpeg?cs=srgb&dl=pexels-yuliia-tretynychenko-11769686.jpg&fm=jpg" alt="">
</div>
```

<img :src="$withBase('/basicFrontEnd/CSS/border-radius01.png')" alt="border-radius"> 

## 背景
- 背景颜色：background-color   
- 背景图片：background-image
- 调整尺寸：background-zise   
- 重复显示：background-repeat
- 图片位置：background-position
- 背景图像固定或者滚动：background-attachment

```html
<style>
    .box {
        width: 440px;
        height: 248px;
        margin: 100px;
        border: 1px solid #000;
        background-image: url(https://imgcps.jd.com/img-cubic/creative_server_cia/v2/2000366/42975469816/FocusFullshop/CkRqZnMvdDEvMTkzNzI2LzEwLzEyMTUwLzQ0MTQxMy82MGU2YjUwZkVlZmVmMTg2Ni82NjY4NDYwMjFmMWMwODQyLnBuZxIJNS10eV8wXzU2MAI47ot6QhQKDuWlvei0p-Wkp3BhcnR5EAAYAUITCg_lhajmsJHmiqLotK3kuK0QAUIQCgznq4vljbPmiqLotK0QAkIKCgbnp43ojYkQB1j4waaMoAE/cr/s/q.jpg);
        /*图片的尺寸显示不正确 需要background-size调整尺寸*/
        background-size: 100% 100%;
        background-size: 50% 50%;
        /*导致重复显示 需要background-repeat*/
        background-repeat: no-repeat;
        /*默认repeat，可以设置no-repeat，repeat-x，repeat-y*/
        background-position: center center;
        /*图片居中在大盒子里 (50% 50%), (top, right)...*/
    }
    
    img {
        width: 100%;
        height: 100%;
    }
</style>

<div class="box"></div>
```
<img :src="$withBase('/basicFrontEnd/CSS/background.png')" alt="background"> 

大背景图片，窗口拖动背景图片不变形。backgound-size
```html
<style>
    body {
        margin: 0;
    }
    
    .banner {
        width: 100%;
        height: 600px;
        background-color: orange;
        background-image: url(https://gw.alicdn.com/imgextra/i3/O1CN01iyYdem1GQd1yGgA0a_!!6000000000617-0-tps-2500-600.jpg);
        background-size: cover;
        /*不管盒子多大，始终占满整个盒子，即banner盒子的宽高始终被占满*/
        background-size: contain;
        /*图片始终完全显示*/
        background-position: center center;
        background-repeat: no-repeat;
    }
</style>

<div class="banner"></div>
```
1. backgound-size: cover。容器始终被图片占满。
<img :src="$withBase('/basicFrontEnd/CSS/background-size01.png')" alt="background-size"> 

2. backgound-size: contain。图片始终完全显示。
<img :src="$withBase('/basicFrontEnd/CSS/background-size.png')" alt="background-size"> 

背景图不滚动，内容可滚动
```html
<style>
    html {
        height: 100%;
        background-color: green;
        background-image: url(https://gw.alicdn.com/imgextra/i3/O1CN01iyYdem1GQd1yGgA0a_!!6000000000617-0-tps-2500-600.jpg);
        background-size: 100% 100%;
        background-attachment: fixed;
        /*背景图不滚动*/
    }
</style>
```
<img :src="$withBase('/basicFrontEnd/CSS/background-size02.png')" alt="background-size"> 

backgound 顺序： background-color background-image background-repeat background-attachment background-position/background-size

## logo
当css加载不出来的时候我们希望网页也能够正常使用。logo部分的处理方案。
```html
<style>
    h1 {
        margin: 0;
    }
    
    .logo {
        width: 142px;
        height: 58px;
    }
    
    .logo h1 .logo-hd {
        display: block;
        width: 142px;
        height: 0;
        padding-top: 58px;
        background: url(img/taobao-logo.png) no-repeat 0 0/142px 58px;
        overflow-y: hidden;
    }
</style>

<div class="logo">
    <h1>
        <!--网站css加载不出来时，网站能正常点击-->
        <a href="" class="logo-hd">淘宝网</a>
    </h1>
</div>
```

## table
table标签中定义border和css中定义border的区别：css中写border属性，单元格中没有边框。
```html
<style>
    table {
        width: 300px;
        height: 300px;
        /* border: 1px solid #000; */
        /*只写这个 单元格没有边框*/
        /* caption-side: bottom; */
        /*标题的位置，默认top*/
        border-collapse: collapse;
        /*单元格之间两个边框合并成一个*/
        table-layout: fixed;
        /*单元格宽度一定，不可调整，还有一个值是automatic(默认)*/
    }
    /*中间一列居中*/
    
    table tr td:nth-child(2) {
        text-align: center;
    }
    /*偶数行背景颜色#eee*/
    
    table tr:nth-child(even) {
        background-color: #eee;
    }
    /*鼠标移入每一行时，发生变法*/
    
    table tr:hover {
        background-color: #ddd;
    }
</style>

<table border="1">
    <caption>测试表格</caption>
    <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
    </tr>
    <tr>
        <td>4</td>
        <td>5</td>
        <td>6</td>
    </tr>
    <tr>
        <td>7</td>
        <td>8</td>
        <td>9</td>
    </tr>
</table>
```

<img :src="$withBase('/basicFrontEnd/CSS/table.png')" alt="table"> 

使用ul模拟table。    
1. 方法一
```html
<style>
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    
    .clearfix::after {
        content: "";
        display: table;
        clear: both
    }
    
    .table {
        width: 300px;
    }
    /*双边框，单元格之间有重合*/
    /* .table li {
        float: left;
        width: 100px;
        height: 100px;
        border: 1px solid #000;
        box-sizing: border-box;
    } */
    
   
    .table li {
        float: left;
        width: 101px;
        /*因为margin-top/letf：-1px；所以宽高都必须加1px，才能填满整个table*/
        height: 101px;
        margin-top: -1px;
        margin-left: -1px;
        border: 1px solid #000;
        box-sizing: border-box;
    }

</style>

<ul class="table clearfix">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
    <li>8</li>
    <li>9</li>
</ul>

```

<img :src="$withBase('/basicFrontEnd/CSS/table01.png')" alt="table"> 

2. 方法二
```html
<style>
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    
    .clearfix::after {
        content: "";
        display: table;
        clear: both
    }
    
    .table {
        width: 300px;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
    }
    
    .table li {
        float: left;
        width: 100px;
        height: 100px;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
        box-sizing: border-box;
    }
</style>

<ul class="table clearfix">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
    <li>8</li>
    <li>9</li>
</ul>
```

<img :src="$withBase('/basicFrontEnd/CSS/table02.png')" alt="table"> 

外层左右边框不显示
```html
<style>
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    
    .clearfix::after {
        content: "";
        display: table;
        clear: both
    }
    
    .box {
        width: 300px;
        overflow: hidden;
    }
    
    .table {
        width: 302px;
        margin-left: -1px;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
    }
    
    .table li {
        float: left;
        width: 33.33%;
        height: 100px;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
        box-sizing: border-box;
    }
</style>

<div class="box">
    <ul class="table clearfix">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        <li>9</li>
    </ul>
</div>

```

<img :src="$withBase('/basicFrontEnd/CSS/table03.png')" alt="table"> 

## BFC特性
BFC(block formatting contexts)块级格式化上下文。  
控制元素布局方案：普通流、浮动流（float flow）、绝对定位（absolute position）。  

BFC元素：
- body
- float: left | right
- position: absolute | fixed
- display: inline-block | table-cell
- overflow: hidden | auto | scroll

BFC可以解决的问题  
1. margin合并问题
```html
<style>
    .box {
        width: 100px;
        height: 100px;
    }
    
    .box.box1 {
        background-color: green;
        margin-bottom: 100px;
    }
    
    .box.box2 {
        background-color: orange;
        margin-top: 100px;
        /*不起作用*/
    }
</style>

<div class="box box1"></div>
<div class="box box2"></div>
```
<img :src="$withBase('/basicFrontEnd/CSS/BFC01.png')" alt="BFC"> 

box1设置了margin-buttom导致box2设置margin-top无效。可以使用BFC元素包裹
```html
<style>
    .container {
        overflow: hidden;
    }
    
    .box {
        width: 100px;
        height: 100px;
    }
    
    .box.box1 {
        background-color: green;
        margin-bottom: 100px;
    }
    
    .box.box2 {
        background-color: orange;
        margin-top: 100px;
        /*不起作用*/
    }
</style>

<div class="container">
    <div class="box box1"></div>
</div>
<div class="container">
    <div class="box box2"></div>
</div>
```

<img :src="$withBase('/basicFrontEnd/CSS/BFC02.png')" alt="BFC"> 

2. 浮动流造成父级元素坍塌问题
```html
<style>
    .box {
        /* float: left; */
        /* overflow: hidden; */
        /* position: absolute; */
        display: inline-block;
        width: 200px;
        border: 10px solid #000;
    }
    
    .box1 {
        float: left;
        width: 100px;
        height: 100px;
        background-color: green;
    }
    
    .box2 {
        float: left;
        width: 100px;
        height: 100px;
        background-color: orange;
    }
</style>

<div class="box">
    <div class="box1"></div>
    <div class="box2"></div>
</div>
```
<img :src="$withBase('/basicFrontEnd/CSS/BFC03.png')" alt="BFC"> 

3. margin-top父级元素坍塌问题
```html
<style>
    .box1 {
        width: 300px;
        height: 300px;
        background-color: #000;
        /* 解决方法 */
        /* overflow: hidden; */
        /* display: inline-block;    */
        /* float: left; */
        position: absolute;  
    }
    
    .box2 {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        margin-top: 100px;
        /*会带着box1父级盒子一起下移10px*/
        background-color: orange;
    }
</style>

<div class="box1">
    <div class="box2"></div>
</div>
```
解决：让父级元素触发BFC，塌陷就可以解决。

<img :src="$withBase('/basicFrontEnd/CSS/BFC04.png')" alt="BFC"> 

4. 浮动元素覆盖问题
```html
 <style>
    .box1 {
        width: 100px;
        height: 100px;
        background-color: #000;
        float: left;
    }
    /* box2不要在浮动盒子box1底下*/
    
    .box2 {
        /* float: left; */
        /* display: inline-block; */
        overflow: hidden;
        width: 200px;
        height: 200px;
        background-color: orange;
    }
</style>

<div class="box1">我是float</div>
<div class="box2">我是可怜的元素我是可怜的元素我是可怜的元素我是可怜的元素我是可怜的元素我是可怜的元素</div>
```

## 规范
css书写顺序
显示属性：display, position, float, clear   
自身属性：width, height, margin, padding, border, background  
文本属性：color, font, text-align, vertical-align, white-space   

font:   
font-style font-weight font-size line-weight font-family

## 选择器命名
选择器复合单词 -> 中横线-   
JS钩子ID -> 下划线_    
选择器 -> 小写



