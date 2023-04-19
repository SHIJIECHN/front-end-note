---
autoGroup-1: React Router
sidebarDepth: 3
title: 路由原理
---

## hash路由

React-Router两种路由方式，一种是hash路由，一种是browser路由，browser路由是通过监听浏览器的history对象来实现的。

- hash路由是通过监听浏览器hashChange事件来实现的，当hash值改变时，就会触发hashChange事件，然后我们可以在hashChange事件中获取到hash值，根据hash值来渲染对应的组件。

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

browser路由是通过监听浏览器的history对象来实现的。

- history对象是浏览器提供的一个全局对象，可以通过它来操作浏览器的历史记录，它有三个方法：pushState、replaceState、go。

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

## React-Router基本使用

特点：每个都要匹配到，无论第一个有没有匹配到，后面都还会继续匹配。exact={true} 精确匹配。

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route} from 'react-router-dom';
/** 路由容器 -> Router， 路由规则/路由配置 -> Route */
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';

ReactDOM.render(
    <Router>
        {/* exact={true} 精确匹配 */}
        <Route exact={true} path="/" component={Home}/>
        <Route path="/user" component={User}/>
        <Route path="/profile" component={Profile}/>
     </Router>
    , 
    document.getElementById('root'))
```

## 实现

react-router-dom引用了history和react-router。

- history 是history这个包实现的，内部实现的方式有两种，一种是hash，一种是html5的history
- react-router主要实现Router和Route组件，Router组件是一个路由容器，Route组件是路由规则，它们都是通过context来实现的。

