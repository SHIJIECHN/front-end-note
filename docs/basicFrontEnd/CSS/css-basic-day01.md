---
autoGroup-1: CSS基础
sidebarDepth: 3
title: day01 
---

## 样式
书写格式
```css
选择器 {
  属性名: 属性值;
}
```
样式类型：
1. 内联样式
```html
<div style="width: 100px; height: 100px;">
```
2. 内部样式表  
在\<head>\</head>标签内部
```html
<style type="text/css">
  div{
    width: 100px;
    height: 100px;
  }
</style>
```
3. 引用外部文件
```html
<link rel="stylesheet" type="text/css" href="css/index.css" />
```
三种样式权重优先级：内联样式 > 内部样式表 > 引用外部文件。

## 选择器
### 选择器类型
1. id选择器  
```html
<div id="box"></div>

<style type="text/css">
  #box{...}
</style> 
```

2. 类选择器
```html
<div class="box"></div>

<style type="text/css">
  .box{...}
</style> 
```

3. 标签选择器
```html
<div></div>

<style type="text/css">
  div{...}
</style> 
```

4. 通配符选择器*

5. 属性选择器
```html
<div id="box"></div>
<a href=""></>

<style type="text/css">
  [id="box"]{

  }

  [href]{
    text-decoration: none;
  }
</style> 
```

### 选择器权重
!important > id> class | 属性 > 标签 > *

派生选择器 父子选择器
```html
<strong>
  <em>hello</em>
</strong>
<p>
  <em>world</>
</p>

<style type="text/css">
  strong em{
    color: red;
  }
</style>
```
标签嵌套标签、标签嵌套类、类嵌套标签、类嵌套类...

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

