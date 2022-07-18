---
autoGroup-1: CSS基础
sidebarDepth: 3
title: day03
---

## 盒子模型
盒子模型(box model)组成：
1. 宽高所划分的区域
2. 边框
3. 内边距
4. 外边距

padding不是定义在原本定义的盒子的宽高内，是在原本的基础上扩大相应的内边距的值，边框也不占用宽高的值。即内边距和边框是不占用盒子内部宽高的。
```html
<style>
  .outer-box{
    width: 200px;
    height: 200px;
    border: 10px  solid green;
    padding: 50px;
    margin: 50px;
    background-color: lightcoral;
  }

  .outer-box .inner-box{
    width: 100px;
    height: 100px;
    background-color: orange;
  }
</style>

<div class="outer-box">
  <div class="inner-box"></div>
</div>
```
此时盒子的可视化区域是多少？   
200+ 50\*2 + 10\*2 = 320px;  

<img :src="$withBase('/basicFrontEnd/CSS/box01.png')" alt="box"> 

### 内盒子居中
利用内边距padding不占用盒子宽高的属性。   
```html
<style>
  .box{
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    padding: 30px; /*利用内边距居中*/
  }

  .box .box1{
    width: 100px;
    height: 100px;
    background-color: orange;
  }
</style>

<div class="box">
  <div class="box1"></div>
</div>
```

<img :src="$withBase('/basicFrontEnd/CSS/box02.png')" alt="box"> 

以外层盒子定宽高，内盒子宽高继承于外层盒子，即宽高为100%。普遍使用这种方法。
```html
<style>
  .box{
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    padding: 70px;
  }

  .box .box1{
    width: 100%;
    height: 100%;
    background-color: orange;
  }
</style>

<div class="box">
  <div class="box1"></div>
</div>
```
<img :src="$withBase('/basicFrontEnd/CSS/box03.png')" alt="box"> 

### box-sizing
box-sizing: 
- border-box: 以边界为基准固定盒子的尺寸。把边框和内边距收到盒子内部，也就是说在盒子内部绘制边框和内边距。     
- content-box：以盒子内的内容为基准固定盒子的尺寸。    
- 
要求加了内边距和边框后，最外层盒子的可视化区域始终为100px x 100px。

```html
<style>
  .box{
    width: 200px;
    height: 200px;
    padding: 30px;
    border: 10px solid #000;
    box-sizing: border-box; /**/
    -moz-box-sizing: border-box; /*fireFox*/
    -webkit-box-sizing: border-box; /*chrome safari*/
    -ms-box-sizing: border-box; /*IE8以下*/
    -moz-box-sizing: border-box; /*presto opera*/
  }

  .box .box1{
    width: 100%;
    height: 100%;
    background-color: orange;
  }
</style>

<div class="box">
  <div class="box1"></div>
</div>
```
<img :src="$withBase('/basicFrontEnd/CSS/box04.png')" alt="box"> 

以后使用，以后都不用管div的设置了。
```html
<style>
  div{
      box-sizing: border-box; /**/
      -moz-box-sizing: border-box; /*fireFox*/
      -webkit-box-sizing: border-box; /*chrome safari*/
      -ms-box-sizing: border-box; /*IE8以下*/
      -moz-box-sizing: border-box; /*presto opera*/
    }
</style>
```
解开border-box设置
```html
<style>
  .box{
    width: 200px;
    height: 200px;
    padding: 30px;
    border: 10px solid #000;
    box-sizing: content-box; /*解开border-box设置*/
  }
</style>
```
如果多个地方需要解开，就编写一个类专门处理此类问题，在需要解开的地方添加此类。
```html
<style>
  div{
    box-sizing: border-box; 
    -moz-box-sizing: border-box; /*fireFox*/
    -webkit-box-sizing: border-box; /*chrome safari*/
    -ms-box-sizing: border-box; /*IE8以下*/
    -moz-box-sizing: border-box; /*presto opera*/
  }
  .content-box{
    box-sizing: content-box; 
    -moz-box-sizing: content-box; /*fireFox*/
    -webkit-box-sizing: content-box; /*chrome safari*/
    -ms-box-sizing: content-box; /*IE8以下*/
    -moz-box-sizing: content-box; /*presto opera*/
  }

  .box{
    width: 200px;
    height: 200px;
    padding: 30px;
    border: 10px solid #000;
  }

  .box .box1{
    width: 100%;
    height: 100%;
    background-color: orange;
  }
</style>

<div class="box content-box">
  <div class="box1"></div>
</div>
```
<img :src="$withBase('/basicFrontEnd/CSS/box05.png')" alt="box"> 

### 盒子水平居中
盒子相对于浏览器水平居中：   
margin: 0 auto;
```html
<style>
  .text{
    width: 200px;
    height: 200px;
    background-color: orange;
    margin: 0 auto;
  }
</style>

<div class="text"></div>
```
<img :src="$withBase('/basicFrontEnd/CSS/box06.png')" alt="box"> 

margin塌陷问题。

### 盒子默认边距
body外边距：
- IE8 上下16px 左右8px
- IE7 上下16px 左右11px
- 默认8px
```html
<style>
  .header {
    width: 100%;
    height: 60px;
    background-color: #000;
  }
</style>

<div class="header"></div>
```

## 定位
position设置定位。   
### 绝对定位
position: absolute; 在现有的文档层上新开了一层，让定位元素在新开的一层上。原来的位置不保留。与top/bottom, left/right使用。
```html
<style>
  .box1{
    position: absolute;
    left: 10px;
    top: 20px;
    width: 100px;
    height: 100px;
    background-color: green;
  }
</style>

<div class="box1"></div>
```
letf/right，top/bottom也只能跟定位元素一起使用。 

<img :src="$withBase('/basicFrontEnd/CSS/position01.png')" alt="position"> 

### 相对定位
position: relative; 也是在新的一层中，但是原来的位置是会保留的。
```html
<style>
  .box1{
    position: relative;
    top: 10px;
    left: 10px;
    width: 100px;
    height: 100px;
    background-color: green;
  }

  .box2{
    width: 200px;
    height: 200px;
    background-color: orange;
  }
</style>

<div class="box1"></div>
<div class="box2"></div>
```

<img :src="$withBase('/basicFrontEnd/CSS/position02.png')" alt="position">

### absolute和relative一起使用
1. .box3中的position会往上找，在父级中没有发现定位元素，则相对于整个html文档定位。
```html
<style>
  .box1{
    width: 400px;
    height: 400px;
    margin: 100px 0 0 100px;;
    border: 1px solid #000;
  }

  .box1 .box2{
    width: 200px;
    height: 200px;
    background-color: green;
  }
  .box1 .box2 .box3{
    position: absolute; 
    top: 0px;
    left: 0px;
    width: 50px;
    height: 50px;
    background-color: orange;
  }
</style>

<div class="box1">
  <div class="box2">
    <div class="box3"></div>
  </div>
</div>
```

<img :src="$withBase('/basicFrontEnd/CSS/position03.png')" alt="position"> 

2. .box3中的position会往上找，在.box2的地方发现position:relative; 此时.box3会相对于.box2定位。
```html
<style>
  .box1{
    position: relative;
    width: 400px;
    height: 400px;
    margin: 100px 0 0 100px;;
    border: 1px solid #000;
  }

  .box1 .box2{
    position: relative;
    width: 200px;
    height: 200px;
    background-color: green;
  }
  .box1 .box2 .box3{
    position: absolute; 
    /*往上找，在父级发现 没有定位元素，则相对于整个html文档定位*/
    bottom: 0px;
    left: 0px;
    width: 50px;
    height: 50px;
    background-color: orange;
  }
</style>

<div class="box1">
  <div class="box2">
    <div class="box3"></div>
  </div>
</div>
```

<img :src="$withBase('/basicFrontEnd/CSS/position04.png')" alt="position"> 

3. box1会在box2的上层。因为box1是新开了一层。
```html
<style>
  .box1{
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: #000;
  }

  .box2{
    width: 100px;
    height: 100px;
    background-color: orange;
  }

</style>

<div class="box1"></div>
<div class="box2"></div>
```
<img :src="$withBase('/basicFrontEnd/CSS/position05.png')" alt="position"> 

4. 如果想要box2排到box1的上面，只需要在box2中新增定位position: relative。box2也新开一层。
```html
<style>
  .box1{
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: #000;
  }

  .box2{
    position: relative;
    width: 100px;
    height: 100px;
    background-color: orange;
  }

</style>

<div class="box1"></div>
<div class="box2"></div>
```

<img :src="$withBase('/basicFrontEnd/CSS/position06.png')" alt="position"> 

5. 如果两个position: absolute;，想让box1排在上面，需要box1设置z-index.
```html
<style>
  .box1{
    position: absolute;
    z-index: 1;
    width: 100px;
    height: 100px;
    background-color: #000;
  }

  .box2{
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: orange;
  }

</style>

<div class="box1"></div>
<div class="box2"></div>
```
<img :src="$withBase('/basicFrontEnd/CSS/position05.png')" alt="position"> 


### 两栏设计
一个有用的tip：绝对定位中的两栏设计。
```html
<style>
  .left{
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 300px;
    background-color: green;
  }

  .right{
    height: 100%;
    margin-left: 300px;
    background-color: orange;
  }
</style>

<div class="left"></div>
<div class="right"></div>
```
左侧进行绝对定位，右侧根据左侧的宽度设置margin-left值。    

<img :src="$withBase('/basicFrontEnd/CSS/position07.png')" alt="position"> 

## 浮动（float）   
### 1. 案例一
```html
<style>
  .box1{
    float: left;
    width: 100px;
    height: 100px;
    background-color: green;
  }

  .box2{
    width: 200px;
    height: 200px;
    background-color: orange;
  }

</style>

<div class="box1"></div>
<div class="box2"></div>
```
box2无法识别浮动流，因此会占据box1的位置。  

<img :src="$withBase('/basicFrontEnd/CSS/float01.png')" alt="float"> 

### 2. 案例二
```html
<style>
  .box1{
    float: left;
    width: 100px;
    height: 100px;
    background-color: green;
  }

  .box2{
    width: 200px;
    height: 200px;
    background-color: orange;
    overflow: hidden; /*溢出隐藏*/
  }

</style>

<div class="box1"></div>
<div class="box2"></div>
<!--内联-->
<span>123</span>
<!--内联块-->
<img src="http://xxx.com" alt="">
```

<img :src="$withBase('/basicFrontEnd/CSS/float02.png')" alt="float"> 

总结：浮动流，块级元素无法识别浮动流元素的位置。内联、内联块、浮动、溢出隐藏、纯文本都可以识别浮动元素的位置，除了块级元素。   


### 清除浮动
```html
<style>
  .box{
    width: 200px;
    /* height: 100px; */
    border: 10px solid #000;
  }
  .box .box1{
    float: left;
    width: 100px;
    height: 100px;
    background-color: green;
  }
  .box .box2{
    float: left;
    width: 100px;
    height: 100px;
    background-color: orange;
  }
  .text-box{
    width: 100px;
    border: 1px solid #000;
  }

</style>

<div class="box">
  <div class="box1"></div>
  <div class="box2"></div>
</div>
<div class="text-box">
  百度一下，你就知道！
  百度一下，你就知道！
  百度一下，你就知道！
  百度一下，你就知道！
</div>
```
<img :src="$withBase('/basicFrontEnd/CSS/float03.png')" alt="float"> 

块级元素box无法识别浮动流的高度，导致后面text-box显示错乱。   
解决方法：清除浮动。注意清除浮动时，使用的一定是块级元素标签。  
```html
<style>
  .box{
    width: 200px;
    /* height: 100px; */
    border: 10px solid #000;
  }
  .box .box1{
    float: left;
    width: 100px;
    height: 100px;
    background-color: green;
  }
  .box .box2{
    float: left;
    width: 100px;
    height: 100px;
    background-color: orange;
  }
  .text-box{
    width: 100px;
    border: 1px solid #000;
  }

  /* 新增：清除浮动 */
  .clearfix{
    clear: both;
  }

</style>

<div class="box">
  <div class="box1"></div>
  <div class="box2"></div>
  <p class="clearfix"></p> <!--使用块级元素标签进行清除浮动设置，使用span则无效-->
</div>
<div class="text-box">
  百度一下，你就知道！
  百度一下，你就知道！
  百度一下，你就知道！
  百度一下，你就知道！
</div>
```
<img :src="$withBase('/basicFrontEnd/CSS/float04.png')" alt="float"> 

设置float以后，元素就变成了内联块元素。

### 左右浮动
1. left和right都是块级元素，都需要加float。
```html
<style>
  .header{
    width: 100%;
    height: 60px;
    background-color: #000;
  }

  .left{
    float: left; 
    width: 300px;
    height: 60px;
    background-color: green;
  }

  .right{
    float: right;
    width: 300px;
    height: 60px;
    background-color: orange;
  }

</style>

<div class="header">
  <div class="left"></div>
  <div class="right"></div>
</div>
```
<img :src="$withBase('/basicFrontEnd/CSS/float05.png')" alt="float"> 

2. left和right是行内元素，left就可以不用加float
```html
<style>
  .header{
    width: 100%;
    height: 60px;
    line-height: 60px;
    color: orange;
    background-color: #000;
  }

  .right{
    float: right;
  }

</style>

<div class="header">
  <span class="left">123</span>
  <span class="right">456</span>
</div>
```

<img :src="$withBase('/basicFrontEnd/CSS/float06.png')" alt="float"> 

## 伪类
伪类：`:before`和`:after`。   
伪元素：`::before`和`::after`。   
1. 必须有content属性。
```html
<style>
  p:before{
    content: "html";
  }

  p:after{
    content: "css";
  }

</style>

<p>学习前端</p>
```
<img :src="$withBase('/basicFrontEnd/CSS/before.png')" alt="before"> 

2. 伪元素属于内联元素。
```html
<style>
  p::before{
    content: "";
    display: inline-block;
    width: 100px;
    height: 100px;
    background-color: green;    
  }

  p::after{
    content: "";
    display: inline-block;
    width: 200px;
    height: 200px;
    background-color: orange; 
  }

</style>

<p>学习前端</p>
```

<img :src="$withBase('/basicFrontEnd/CSS/before01.png')" alt="before"> 

3. 利用伪元素清除浮动
```html
<style>
  ul::after,
  div::after{
    content: "";
    display: block;
    clear: both;
  }

  .box{
    width: 200px;
    border: 10px solid #000;
  }
  .box .box1{
    float: left;
    width: 100px;
    height: 100px;
    background-color: green;
  }
  .box .box2{
    float: left;
    width: 100px;
    height: 100px;
    background-color: orange;
  }
  .text-box{
    width: 100px;
    border: 1px solid #000;
  }

</style>

<div class="box">
  <div class="box1"></div>
  <div class="box2"></div>
</div>
```
相当于在box后面再增加了一个元素，并且元素为block，在此元素上面进行clear: none，清除浮动。 

<img :src="$withBase('/basicFrontEnd/CSS/before02.png')" alt="before">   

## 练习：使用伪类元素做轮播图点
```html
<style>
  .slider{
    position: relative;
    width: 590px;
    height: 470px;
  }
  .slider .indicator{
    width: 152px;
    height: 18px;
    position: absolute;
    left: 46px;
    bottom: 20px;
  }

  .slider .indicator .indicator-dot{
    float: left;
    display: block;
    position: relative;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
  }

  .slider .indicator .indicator-dot.active::before{
    content: "";
    display: block;
    width: 18px;
    height: 18px;
    background-color: #fff;
    opacity: .2;
    border-radius: 50%;
  }


  .slider .indicator .indicator-dot::after{
    content: "";
    display: block;
    position: absolute;
    left: 4px;
    top: 4px;
    width: 6px;
    height: 6px;
    border: 2px solid #fff;
    border-radius: 50%;
    opacity: .4;
  }
  .slider .indicator .indicator-dot.active::after{
    opacity: 1;
    background-color: #fff;
  }

</style>

<div class="slider">
  <div class="indicator">
    <i class="indicator-dot active"></i>
    <i class="indicator-dot"></i>
    <i class="indicator-dot"></i>
    <i class="indicator-dot"></i>
    <i class="indicator-dot"></i>
    <i class="indicator-dot"></i>
    <i class="indicator-dot"></i>
    <i class="indicator-dot"></i>
  </div>
  <img src="https://imgcps.jd.com/ling4/10036810399872/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5f3a47329785549f6bc7a6f5/d3f23fe3/cr/s/q.jpg" alt="">
</div>
```

