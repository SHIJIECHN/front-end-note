---
autoGroup-1: 浏览器基础
sidebarDepth: 3
title: 01. DOM/CSS/渲染树、解析与加载、回流与重绘
---

## 解析与加载
HTML、CSS、JavaScript渲染整个页面机制分成两个部分：解析和加载。

### 1. 解析
1. 将HTML节点解析成DOM树。
2. domTree：DOM树，就是把整个HTML结构解析成一个树形结构。深度优先解析原则。
3. DOM树构建实际上就是浏览器引擎当中做的一个HTML节点的一个解析过程。

### 2. 加载
1. DOM树的形成是不管内部资源，html中出现的任何资源都和解析不相关，而相关的是加载。
2. 解析的过程伴随着加载的开始，加载和解析的快慢没有任何关系的。
3. 有了解析才会有加载，而解析和加载的过程是异步的过程。解析完毕并不代表页面加载完毕。

## 渲染renderTree
元素节点display:none，与JS创建元素节点会挂载到DOM树中吗？  
```html
<body>
    <span style="display: none;"></span>
    <script type="text/javascript">
        var oDiv = document.createElement('div');
        document.body.appendChild(oDiv);
    </script>
</body>
```
会的。DOM树不会管样式，只管DOM节点，动态挂载的也是DOM节点。  

cssTree：CSS树。样式结构体。深度优先。浏览器引擎在构建css树的时候，在机制上不会去结合html的，只会去查看html结构中，这个样式对应的这个元素到底是什么关系，通过父子、兄弟关系，构建一个cssTree。   
浏览器引擎是不会直接把css和html结合，只会查看样式类，标签的关系，形成的cssTree。自动忽略去掉浏览器不能识别的样式。

renderTree：渲染树。DOM树与CSS树结合。浏览器根据渲染树绘制页面。
1. 渲染树每个节点都有自己的样式。
2. 不包含隐藏节点，display：none，head之类不需要绘制的节点。在形成渲染树的时候，就已经把对应的CSS树中有display：none的节点剔除了。
3. visibility：hidden相对应的节点是包含在渲染树上的。
4. 渲染树上的每一个节点都会被当做一个盒子box。具有内容填充、边距、边框、位置、大小及其他样式。

## 回流与重绘
产生：当JS对页面的节点操作时，就会产生回流或者重绘。
- 回流：重排（reflow）。
- 重绘（repaint）。

### 1. 定义
回流：一定会引起重绘，重绘不一定是回流产生的后续反应。因为节点的尺寸、布局、display：none block。这些物理改变的时候，渲染树中的一部分或者全部需要重新构建的时候，就叫做回流。一个页面至少有一次回流。   
重绘：回流时浏览器会重新构建受影响部分的渲染树，只要渲染树被改变，就一定引起重绘。回流完成后，浏览器会根据新的渲染树重新绘制回流影响的部分节点，这个重新绘制的过程就叫重绘。   


### 2. 引起回流的因素：
1. DOM节点增加、删除
2. DOM节点位置改变
3. 元素的尺寸、边距、填充、边框、宽高
4. DOM节点 display显示与否
5. 页面渲染初始化
6. 浏览器窗口尺寸的变化 -> resize
7. 向浏览器请求某些样式信息：offset scroll client width height getComputedStyle() currentStyle


### 3. 优化
DOM操作消耗新能，原因就是回流，在DOM操作优化的时候，一切都是避免或减少回流次数。   

回流产生的性能代价比重绘的高。在优化回流时需要考虑两个方面：回流的次数、回流所涉及到的节点也即回流的规模。
```html
<body>
    <div class="box">我是一个孤独的盒子</div>
    <script type="text/javascript">
        var oBoxStyle = document.getElementsByClassName('box')[0].style; // 能够缓存尽量缓存
        // 回流+ 重绘
        oBoxStyle.width = '200px';
        // 回流+重绘
        oBoxStyle.height = '200px';
        // 回流+重绘
        oBoxStyle.margin = '20px';
        // 重绘
        oBoxStyle.backgroundColor = 'green';
        // 回流+重绘
        oBoxStyle.border = '5px solid orange';
        // 重绘
        oBoxStyle.color = '#fff';
        // 回流+重绘
        oBoxStyle.fontSize = '30px';

        // 如果把h1放到最前面，则后面的div都要回流重新构建
        var h1 = document.createElement('h1');
        h1.innerHTML = '我是一个孤独的标题';
        document.body.appendChild(h1);
    </script>
</body>
```

浏览器优化：队列策略。  

减少回流方法：

1. 方法一：使用类名。
```html
    <style type="text/css">
        div {
            width: 100px;
            height: 100px;
            background-color: #000;
        }
        
        div.active {
            width: 200px;
            height: 200px;
            background-color: green;
            border: 5px solid orange;
        }
    </style>

<body>
    <div></div>
    <script type="text/javascript">
        var oDiv = document.getElementsByTagName('div')[0]; // 能够缓存尽量缓存
        oDiv.onmouseover = function() {
            // 引起三次回流 四次重绘
            this.style.width = '200px';
            this.style.height = '200px';
            this.style.backgroundColor = 'green';
            this.style.border = '5px solid orange';

            // 加类名属于批量处理，只有一次回流一次重绘
            this.className += ' active';
        }
    </script>
</body>
```
2. 方法二：cssText。   
如果获取的值是动态的呢？
```html
<body>
    <div></div>
    <script type="text/javascript">
        var oDiv = document.getElementsByTagName('div')[0],
            width = 200,
            height = 200,
            backgroundColor = 'green',
            border = '5px solid orange';

        oDiv.onmouseover = function() {
            // 行内样式
            this.style.cssText = '\
            width: ' + width + 'px;\ 
            height: '+ height +'px;\
            background - color: '+ backgroundColor+';\
            border: '+ border +';\
            ';
        }
    </script>
</body>
```
3. 方法三：使用文档碎片：document.createDocumentFragment()
4. 方法四：display：none
```html
<body>
    <div class="box"></div>
    <script type="text/javascript">
        var oBox = document.getElementsByClassName('box')[0],
            oBoxStyle = oBox.style;

        oBox.onmouseover = function() {
            // 回流两次，重绘两次
            oBoxStyle.display = 'none'; // 一次回流，一次重绘
            oBoxStyle.width = '200px';
            oBoxStyle.height = '200px';
            oBoxStyle.backgroundColor = 'green';
            oBoxStyle.border = '5px solid orange';
            oBoxStyle.display = 'block'; // 一次回流，一次重绘
        }
    </script>
</body>
```

5. 当需要offset时，使用offset时，缓存使用
```js
var oLeft = div.offsetLeft;
div.style.left = oLeft + 10 +'px';
```

5. 动画元素一定要绝对定位。不要用动画。