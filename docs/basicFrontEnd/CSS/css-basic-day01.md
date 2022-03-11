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

