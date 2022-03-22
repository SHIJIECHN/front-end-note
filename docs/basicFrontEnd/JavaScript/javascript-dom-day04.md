---
autoGroup-3: DOM
sidebarDepth: 3
title: day04
---

## 滚动距离与高度
查看滚动条的距离。   
常规：window.pageXOffset/pageYOffset。IE9/IE8及以下不支持。   
IE9/IE8及以下：document.body.scrollLeft/scrollTop或者document.documentElement.scrollLeft/scrollTop。不会同时可用。  
不常见：window.scrollX/scrollY   
滚动条距离兼容性写法：
```js
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
    } else {
        return {
            left: document.body.scrollLeft + document.documentElement.scrollLeft,
            top: document.body.scrollLeft + document.documentElement.scrollTop
        }
    }
}
```

## 浏览器的怪异模式和标准模式
判断模式：document.compatMode   
当文档最上方写\<!DOCTYPE html>时，返回CSS1Compat，这是兼容W3C规范的标准模式。   
当文档最上方没有写\<!DOCTYPE html>时，返回BackCompat，这是浏览器默认的向后兼容的模式，就是怪异模式。

## 可视区域
浏览器可视区域的尺寸（窗口的宽高）。  
常规：window.innerWidth/innerHeight    
IE9/IE8及以下：document.documentElement.clientWidth/clientHeight（标准模式），document.body.clientWidth/clientHeight（怪异模式）
```js
function getViewportSize() {
            if (window.innerWidth) {
                return {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            } else {
                if (document.compatMode === 'BackCompat') {
                    return {
                        width: document.body.clientWidth,
                        height: document.body.clientHeight
                    }
                } else {
                    return {
                        widht: document.documentElement.clientWidth,
                        height: document.documentElement.clientHeight
                    }
                }
            }
        }
```

## 整个页面宽高
不管看不看得见，就是整个HTML文档的宽高
document.body.scrollHeight/scrollWidth  
document.documentElement.scrollHeight/scrollWidth   
window.innerWidth + window.pageXOffset
```js
function getScrollSize(){
    if(document.body.scrollWidth){
        return {
            width: document.body.scrollWidth,
            height: document.body.scrollHeight,
        }
    }else{
        return {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight
        }
    }
}
```

## getBoundingClientRect
```html
<style>
    .box {
        position: absolute;
        top: 200px;
        left: 200px;
        width: 200px;
        height: 200px;
        background-color: green;
    }
</style>

<div class="box"></div>
<script type="text/javascript">
    var box = document.getElementsByClassName('box')[0];
    var info = box.getBoundingClientRect();
    console.log(info);
</script>
```
