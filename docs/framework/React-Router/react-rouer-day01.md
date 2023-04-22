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

createHashHistory方法返回一个对象，包含属性：
- action：当前的动作
- location
- go()
- goBack()：回退方法。内部实现是go(-1)
- goForward()：前进方法。内部实现是go(1)
- listen(): 监听方法，返回一个取消监听的方法
监听hash值的变化hashChange事件，如果hash值发生改变，就执行回调函数。hash路由需要自己维护栈和state。

HashRouter组件实现：调用createHashHistory方法，返回一个history对象，将history对象传递给Router组件。

Router组件实现，主要是render时使用Provider，传递value，value包含属性：history和location

Route组件实现，通过contextType获得Router组件传递的value，value包含history和location。通过比较路径path，得到match值。将三个属性：
- location
- history
- match
组装成props传递给路由。

createBrowserHistory实现：
1. 定义一个globalHistory对象，是原生的window.history
2. go调用的原生方法
3. notify主要是为了更新location和action，让页面更新
4. push方法中  
   1. 调用原生的pushState方法，更新地址栏 
   2. 调用notify方法，更新location和action
5. 监听onpopstate事件，当你回退（goBack）或前进的时候会执行，这个监听是浏览器自带的，默认支持。再调用notify方法，更新location和action。


路径正则匹配

Switch：如果路径匹配上了，后面的就不再匹配