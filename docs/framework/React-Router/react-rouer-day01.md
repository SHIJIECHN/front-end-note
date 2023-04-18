---
autoGroup-1: React Router
sidebarDepth: 3
title: 路由原理
---

## hash路由

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
    <ul>
        <li><a href="#/a">/a</a></li>
        <li><a href="#/b">/b</a></li>
    </ul>
    <script>
        // 每当hash值改变时，都会触发hashChange事件
        window.addEventListener('hashChange', ()=>{
            console.log('hashChange')
            let pathname = window.location.hash.slice(1);
            document.getElementById('root').innerHTML = pathname;
        })
     
    </script>
</body>
</html>
```

## browser路由

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>

    <script>
        // 这个history是一个全局管理对象，可以通过它来操作浏览器的历史记录
        let globalhistory = window.history;
        let oldgHistoryLength = globalhistory.length;// 历史条目的长度
        // 延时1秒后，向浏览器历史记录中添加一个新的条目
        setTimeout(()=>{ 
            // ['page1']
            globalhistory.pushState({page:1}, {title: 'page1'},'/page1');
            console.log(globalhistory.length - oldgHistoryLength);// 1
        }, 1000)
        // 延时2秒后，向浏览器历史记录中添加一个新的条目
        setTimeout(()=>{
            // ['page1', 'page2']
            globalhistory.pushState({page:2}, {title: 'page2'},'/page2');
            console.log(globalhistory.length - oldgHistoryLength); // 2
        }, 2000)
        // 延时3秒后，向浏览器历史记录中添加一个新的条目
        setTimeout(()=>{
            // ['page1', 'page2', 'page3']
            globalhistory.pushState({page:3}, {title: 'page3'},'/page3');
            console.log(globalhistory.length - oldgHistoryLength); // 3
        }, 3000)
        // 3秒后，返回上一个历史条目
        setTimeout(()=>{
            // ['page1', 'page2', 'page3']
            globalhistory.back();// 回退到上一个历史条目
            console.log(globalhistory.length - oldgHistoryLength); // 3
        }, 4000)
        // 延时4秒后，向浏览器历史记录中添加一个新的条目。
        setTimeout(()=>{
            globalhistory.pushState({page:4}, {title: 'page4'},'/page4');
            console.log(globalhistory.length - oldgHistoryLength); // 3
        }, 5000);
        setTimeout(()=>{
            // ['page1', 'page2', 'page4']
            globalhistory.go(1);
            console.log(globalhistory.length - oldgHistoryLength); // 3
        }, 6000);
    </script>
</body>
</html>
```