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
    children: [{
            tag: 'h1',
            // props: ,
            children: '虚拟DOM'
        },
        {
            tag: 'ul',
            props: {
                style: 'color: orange'
            },
            children: [{
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

