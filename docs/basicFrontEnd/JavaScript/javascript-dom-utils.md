---
autoGroup-3: DOM
sidebarDepth: 3
title: DOM 操作工具类
---

## 找出元素节点的方法
```javascript
function elemChildren(node) {
    var arr = [],
        children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        var childItem = children[i];
        // 找出元素节点 
        if (childItem.nodeType === 1) {
            arr.push(childItem);
        }
    }
    return arr;
}

console.log(elemChildren(div));
```
## 滚动条距离兼容性写法
```javascript
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

## 浏览器可视区域的尺寸
```javascript
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

## 页面宽高兼容性写法
```javascript
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

## 查看盒子到页面边缘的距离
```javascript
/**
 * 封装合并子盒子与父盒子到左侧/上侧 到 页面左侧/上侧的 距离
 */
function getElemDocPosition(el) {
    // 找到有定位的父级盒子
    var parent = el.offsetParent, // 有定位的父级
        //找到当前盒子左侧/上侧到页面左侧/上侧的距离
        offsetLeft = el.offsetLeft,
        offsetTop = el.offsetTop;

    // parent存在，说明本次循环出来的肯定是元素
    while (parent) {
        // 循环出来的parent是定位元素
        offsetLeft += parent.offsetLeft;
        offsetTop += parent.offsetTop;
        // 重新赋值parent，找到外层盒子继续加
        parent = parent.offsetParent;
    }
    return {
        left: offsetLeft,
        top: offsetTop
    }
}
```

## 获取元素属性
```javascript
/**
 * 获取元素属性
 * 避免使用offsetWidth&offsetHeight
 * @elem 元素
 * @prop 属性
 */
function getStyles(elem, prop) {
    //检测getComputedStyle是否存在
    if (window.getComputedStyle) {
        if (prop) {
            //存在，打印具体属性值
            return parseInt(window.getComputedStyle(elem, null)[prop]);
        } else {
            //不存在，打印集合
            return window.getComputedStyle(elem, null)
        }
    } else {
        if (prop) {
            return parseInt(elem.currentStyle[prop]);
        } else {
            return elem.currentStyle;
        }
    }
}
```