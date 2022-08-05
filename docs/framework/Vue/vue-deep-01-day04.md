---
autoGroup-2: Vue深度学习系列
sidebarDepth: 3
title: 4. 应用实例、组件实例与根组件实例
---


## 应用实例
应用实例(`app`)： 通过`creatApp`创建`App`，返回一个应用实例。应用实例主要是用来注册全局组件。

main.js
```javascript
const { createApp } = Vue;

// Application 应用
const app = Vue.createApp({}) // {}为根组件

// 返回原本的应用实例
const app2 = app.component('MyTitle', {
        data() {
            return {
                title: 'I love Vue'
            }
        },
        template: `<h1 v-to-lower-case>{{title}}</h1>`
    })
    .directive('toLowerCase', {
        mounted(el) {
            el.addEventListener('click', function() {
                this.innerText = this.innerText.toLowerCase();
            }, false)
        }
    });

console.log(app2 === app); // true

app2.mount('#app');
```
应用实例时直接由`createApp`创建出来的。在实例上暴露了很多方法：
 * component 注册组件
 * directive 注册指令
 * filter 注册过滤器
 * use 使用插件
大多数这样的方法都会返回createApp创建出来的应用实例，这样是为了允许链式操作。

## 根组件实例
1. 根组件的本质就是一个对象。
2. createApp执行的时候需要一个根组件 createApp({})。也就是说，当你执行createApp的时候里面至少放过对象
3. 根组件是Vue渲染的起点。它在渲染的时候，必须得有一个根组件才能正常的渲染。外面总需要一个东西包裹，不能只有一堆组件。只有有了根组件才能形成组件树。
4. 根元素是一个HTML元素。createApp执行创建Vue应用实例时，需要一个HTML元素：`<div id="app"></div>`。<br> 
5. mount方法执行返回的是根组件实例(`vm`)。
6. vm来源于 -> viewModel -> MVVM -> VM。 Vue不是一个完整的MVVM模型
main.js
```javascript
const RootComponent = {
    data() {
        return {
            a: 1,
            b: 2,
            total: 0
        }
    },
    mounted() {
        this.plus();
    },
    methods: {
        plus() {
            this.total = this.a + this.b
        }
    },
    template: `<h1>{{a}} + {{b}} = {{total}} </h1>`
}

const app = Vue.createApp(RootComponent);

const vm = app.mount('#app');
console.log(vm.a, vm.b, vm.total);
```

## 组件实例
1. 每个组件都有自己的组件实例。
2. 一个应用中所有的组件都共享一个应用实例（app），都是app下面的东西。
3. 无论是根组件还是应用内其他组件，配置选项、组件的行为都是一样的。
4.  组件实例可以添加一些属性 property。data/props/components/methods....
5.  组件实例this -> 可以访问$attrs/$emit Vue组件实例内置方法
```javascript
const MyTitle = {
    props: ['content'],
    template: `
        <h1 :title="content">
            <slot></slot>
        </h1>
    `,
    mounted() {
        console.log(this); // 组件实例
    }
};

const MyAuthor = {
    template: `
        <p>
            Author: <slot></slot>
        </p>
    `
};

const MyContent = {
    template: `
        <p @click="toLowerCase">
            <slot></slot>
        </p>
    `,
    methods: {
        toLowerCase() {
            this.$emit('to-lower-case')
        }
    }
};

const App = {
    components: {
        /** title author content */
        MyTitle,
        MyAuthor,
        MyContent
    },
    data() {
        return {
            title: 'This is TITLE',
            author: 'Tom',
            content: 'This is CONTENT'
        }
    },
    template: `
        <div>
            <my-title :content="content">{{title}}</my-title>
            <my-author>{{author}}</my-author>
            <my-content @to-lower-case="toLowerCase">{{content}}</my-content>
        </div>
    `,
    methods: {
        toLowerCase() {
            this.content = this.content.toLowerCase();
        }
    }
}



const app = Vue.createApp(App);
const vm = app.mount('#app');
console.log(vm);
```

## 生命周期函数
组件是有一个初始化过程的。在这个过程中，Vue提供了很多每个阶段运行的函数，函数会在对应的初始化阶段自动运行。

| <div style="width: 150px;">生命周期</div> | <div style="width: 150px;">描述</div> |
| :--------:   | :------: |
|beforeCreate|组件实例被创建之初|
|create|组件实例已完全创建|
|beforeMount|组件挂载之前|
|mounted|组件挂载到实例上去之后|
|beforeUpdate|组件数据发生改变，更新之前|
|updated|组件数据更新之后|
|beforeDestroy|组件实例销毁之前|
|destroyd|组件实例销毁之后|
|activated|keep-alive缓存的组件激活时|
|deactivated|keep-alive缓存的组件停用时调用|
|errorCaptured|捕获一个来自子孙组件的错误时被调用|

<img :src="$withBase('/framework/Vue/生命周期函数.png')" alt="生命周期函数" />

