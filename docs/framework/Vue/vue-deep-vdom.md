---
autoGroup-2: Vue
sidebarDepth: 3
title: 虚拟DOM
---

## 为什么要有虚拟DOM
jQuery/原生JS是自己控制DOM操作。   
Vue/React是通过修改数据，数据变化，视图更新（DOM操作）。也就是数据驱动视图，Vue内部操作DOM。  


如何有效控制DOM操作频率？   
1. 虚拟DOM。页面发生变化先不直接操作DOM渲染，而是JS计算好，我哪些地方需要做改变，再去操作我们的真实DOM。
2. 虚拟DOM就是JS计算好变化，再操作我们的真实DOM。
3. 操作DOM的成本很高，执行JS很快比DOM改变快。所以使用虚拟DOM。

## 虚拟DOM
```js
// html结构
<div id="app" class="container">
    <h1>虚拟DOM</h1>
    <ul style="color: orange">
        <li>第一项</li>
        <li>第二项</li>
        <li>第三项</li>
    </ul>
</div>

// JS对象的形式表示html结构
{
    tag: 'div',
    props: {
        id: app,
        class: 'container'
    },
    children: [
        {
            tag: 'h1',
            // props: ,
            children: '虚拟DOM'
        },
        {
            tag: 'ul',
            props: {
                style: 'color: orange'
            },
            children: [
                {
                    tag: 'li',
                    // props: ,
                    children: '第一项'
                },
                {
                    tag: 'li',
                    // props: ,
                    children: '第二项'
                },
                {
                    tag: 'li',
                    // props: ,
                    children: '第三项'
                }
            ]
        }
    ]
}
```
总结：
每一个对象都有属性
   1. tag：标签名
   2. props：属性值
   3. children子元素

## snabbdom
一个虚拟DOM库。   
### 1. index.html
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
    <div id="container"></div>

    <!--引入库文件-->
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-class.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-props.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-style.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-eventlisteners.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/h.js"></script>
    <script src="index.js"></script>
</body>

</html>
```
### 2. index.js
```javascript
const snabbdom = window.snabbdom; // 获取snabbdom
const h = snabbdom.h; // h函数

// patch 函数
const patch = snabbdom.init([
    snabbdom_class,
    snabbdom_props,
    snabbdom_eventlisteners
])

// 获取节点
const container = document.getElementById('container');

/**
 * vnode实际上是一个html结构
 */
const vnode = h(
    "div#container.two.classes", {
        on: {
            click: () => {

            }
        }
    }, [
        h("span", { style: { fontWeight: "bold" } }, "This is bold"),
        " and this is just normal text",
        h("a", { props: { href: "/foo" } }, "I'll take you places!"),
    ]);

console.log(vnode);
/**
    children: (3) [{…}, {…}, {…}]
    data: {on: {…}}
    elm: undefined
    key: undefined
    sel: "div#container.two.classes"
    text: undefined
 */

// 将html渲染到页面上，使用patch函数。首次渲染
patch(container, vnode)
```
结果：
<img :src="$withBase('/framework/Vue/vdom.png')" alt="vdom" />

### 3. 自定义html结构
#### index.html
```html
<body>
    <div id="container"></div>
    <!--新增-->
    <button id="btn">点击</button>

    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-class.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-props.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-style.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-eventlisteners.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/h.js"></script>
    <script src="index.js"></script>
</body>
```
#### index.js
```javascript
const snabbdom = window.snabbdom;
const h = snabbdom.h;

const patch = snabbdom.init([
    snabbdom_class,
    snabbdom_props,
    snabbdom_eventlisteners
])

const container = document.getElementById('container');
const btn = document.getElementById('btn'); // 新增

/**
 * html结构
 */
let vnode = h(
    'ul#list', {}, [
        h('li.item', {}, '第一项'),
        h('li.item', {}, '第二项')
    ]
);

// 将html渲染到页面上，使用patch函数。
// 首次渲染
patch(container, vnode);

// 新增
btn.addEventListener('click', () => {
    // 创建新的vnode
    const newVnode = h(
        'ul#list', {}, [
            h('li.item', {}, '第一项'),
            h('li.item', {}, '第二项111'),
            h('li.item', {}, '第三项'),
        ]
    )

    // 视图更新
    patch(vnode, newVnode);

    // 下一次，新的newVnode就变为老的，再创建新的vnode再去更新vnode
    vnode = newVnode;
})
```

### 4. 根据数据结构实现页面
#### index.html
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
    <div id="container"></div>
    <button id="btn">点击</button>

    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-class.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-props.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-style.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/snabbdom-eventlisteners.js"></script>
    <script src="https://cdn.bootcdn.net/ajax//libs/snabbdom/0.7.4/h.js"></script>
    <script src="index.js"></script>
</body>

</html>
```
#### index.js
```javascript
const snabbdom = window.snabbdom;
const h = snabbdom.h;

const patch = snabbdom.init([
    snabbdom_class,
    snabbdom_props,
    snabbdom_eventlisteners
])

const container = document.getElementById('container');
const btn = document.getElementById('btn'); // 新增

const data = [{
        name: 'Tom',
        age: 10,
        city: 'Beijing'
    },
    {
        name: 'Ash',
        age: 11,
        city: 'Shanghai'
    },
    {
        name: 'Ally',
        age: 8,
        city: 'Guangzhou'
    },
]

data.unshift({
    name: '姓名',
    age: '年龄',
    city: '城市'
})

let vnode;

function render(data) {
    let newVnode = h(
        'table', {},
        data.map(item => {
            const tds = []
            for (let i in item) {
                tds.push(item[i]);
            }
            return h('tr', {}, tds)
        })
    )

    // vnode 老vnode newVnode 新vnode
    if (vnode) {
        // 视图更新
        patch(vnode, newVnode);
    } else {
        // 首次渲染
        patch(container, newVnode);
    }
    vnode = newVnode
}

render(data);

btn.addEventListener('click', () => {
    data[1].age = 21;
    data[2].city = 'Shenzhen';
    render(data)
})
```


总结：
1. 虚拟DOM的好处：通过patch函数比较vnode的变化，计算出最少的DOM操作，再更新视图（操作DOM）————diff算法。
2. h函数创建vnode，三个参数：标签，属性，子节点。
3. vnode：组成虚拟DOM的节点
4. patch首次渲染第一个参数是container，第二个参数是vnode。视图更新时第一个参数是就的老的vnode，第二个参数是新的vnode。
