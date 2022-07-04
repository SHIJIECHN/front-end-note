---
autoGroup-1: 浏览器基础
sidebarDepth: 3
title: 02. 时间线、解析与渲染、封装文档解析完毕函数
---

## 时间线
什么事时间线？在浏览器开始加载页面的时候，加载页面的那一刻开始，到整个页面加载结束，整个过程中，按顺序发生的每一件事，这就是时间线。

1. documen.write()到底是怎么挂到body中的？
```html
<body>
    <div class="box"></div>
    <script type="text/javascript">
        document.write('<h1>我是H1</h1>'); // 追加
    </script>
</body>
<!--window.onload-->
<body>
    <div class="box"></div>
    <script type="text/javascript">
        window.onload = function(){
            document.write('<h1>我是H1</h1>'); // body中的所有内容被替换
        }
    </script>
</body>
```
2. 步骤
    1. 页面加载的时候会生成document对象，所有的DOM都是基于这个document对象的，#document文档 -> JS就起作用了。
    2. **解析文档**：浏览器从文档第一行HTML，阅读到文档最后一行。传统浏览器实际上只是阅读，什么都不做。在解析文档的同时，涉及到DOM的东西就**构建DOM树**。   
       **document.readyState = 'loading'**
    3. 先遇到link，开新的线程（js引擎做的事情）异步加载css外部文件。这个是和构建DOM树是一个环节，一起做的，包括style里面的css，都会异步解析CSS树，也就是说DOM树和CSS树是同时构建的。
    4. 没有设置异步加载的script，阻塞文档解析。也就是说所有构建DOM树和CSS树都要停止，就要等着script。等待JS脚本加载并且执行完成后，继续解析文档。
    5. 异步加载script，异步加载JS脚本并且执行，不阻塞解析文档（不能使用document.write()）。
    6. 解析文档的时候，如果遇到img，先解析这个节点，src=""创建加载线程，异步加载图片资源，不阻塞解析文档。
    7. **文档解析完成**。（并不等于文档加载完成，只是DOM结构出来。）
       **document.readyState = 'interactive'**
    8.  文档解析完成：如果defer script JS脚本开始按照顺序执行。与async不同，async一旦加载完毕就执行。
    9.  文档解析完成：DOMContentLoaded事件。也就是说我们是可以监控文档什么时候解析完成的，文档解析完成会立马触发DOMContentLoaded事件。这个事件触发，程序就会发生变化：同步的脚本执行阶段 -> 事件驱动阶段转化。
    10. 文档解析完成：async script加载并执行完毕。实际上是异步的无法准确直到到底什么时候执行，如果async script非常大，有可能文档解析完成后，才执行。img等资源加载完毕，window对象的onload事件才触发。
       **document.readyState = 'complete'**


文档加载页面有三个阶段：
1. document.readyState = 'loading'加载中
2. document.readyState = 'interactive'解析完成
3. document.readyState = 'complete'加载完成

只要是文档转态发生变化，都会触发onreadystatechange。基于JS引擎的，不能算作事件驱动阶段，事件驱动阶段一定是开发者或用户去设立的有意图的事件。
```html
<body>
    <h1>123123</h1>
    <script type="text/javascript">
        console.log(document.readyState); // loading

        // 只有等到interactive的时候才会触发onreadystatechange
        document.onreadystatechange = function() {
            console.log(document.readyState); // interactive complete
        }

        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded');
        }, false);

        var h1 = document.getElementsByTagName('h1')[0];
        console.log(h1.innerHTML);
    </script>
</body>
<!--
 * loading
 * 123123
 * interactive
 * DOMContentLoaded
 * complete
 * 
-->
```
DOMContentLoaded和window.onload的区别：DOMContentLoaded是文档解析结束触发，window.onload是页面文档加载完成并且异步加载的资源、图片资源加载完成触发。window.onload不用的主要原因是浪费时间，事件驱动阶段是文档解析完成，就不用等资源加载再执行程序。

## 解析与渲染
first paint：初次绘制。只要解析到HTML文档里面要渲染的东西，浏览器就一边解析一边构建一边渲染，如果script标签放在上面，初次渲染时间就会被延迟，这种情况就可能会有留白。

## script的 defer 和 async 属性有何区别
`<script>` 的 defer 和 async 属性有何区别

- `<script src="xxx.js">` 当解析到该标签时，会暂停 html 解析，并触发 js 下载、执行。然后再继续 html 解析。
- `<script async src="xxx.js">` js 下载和 html 解析可并行，下载完之后暂停 html 解析，执行 js 。然后再继续 html 解析。
- `<script defer src="xxx.js">` js 下载和 html 解析可并行。等待 html 解析完之后再执行 js 。


<img :src="$withBase('/operationEnv/Browser/async-defer.png')" alt="async-defer"> 

## 连环问：preload prefetch dns-prefetch 的区别

- preload 表示资源在当前页面使用，浏览器会**优先**加载
- prefetch 表示资源可能在**未来的页面**（如通过链接打开下一个页面）使用，浏览器将在**空闲时**加载

```html
<head>
  <meta charset="utf-8">
  <title>JS and CSS preload</title>

  <!-- preload -->
  <link rel="preload" href="style.css" as="style">
  <link rel="preload" href="main.js" as="script">

  <!-- prefetch -->
  <link rel="prefetch" href="other.js" as="script">

  <!-- 引用 css -->
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <h1>hello</h1>

  <!-- 引用 js -->
  <script src="main.js" defer></script>
</body>
```

## 连环问：dns-prefetch 和 preconnect 有什么作用？

一个 http 请求，第一步就是 DNS 解析得到 IP ，然后进行 TCP 连接。连接成功后再发送请求。

dns-prefetch 即 DNS 预获取，preconnect 即预连接。<br>
当网页请求**第三方**资源时，可以提前进行 DNS 查询、TCP 连接，以减少请求时的时间。

```html
<html>
  <head>
    <link rel="dns-prefetch" href="https://fonts.gstatic.com/">
    <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>

  </head>
  <body>
      <p>hello</p>
  </body>
</html>
```

