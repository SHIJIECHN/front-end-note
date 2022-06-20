---
autoGroup-1: Vue-Router
sidebarDepth: 3
title: 5. 实现VueRouter
---

## 两种模式介绍
### 1. 改变hash值与hash值改变监听
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
    <button id="myBtn">点击</button>

    <script>
        // http://127.0.0.1:5500/VueRouterTest/vue-app/test.html#/

        // 首次加载 hash值是多少？监听DOM内容加载完毕事件
        // hash值在location中
        window.addEventListener('DOMContentLoaded', () => {
            console.log(location.hash); // #/
        })

        // 改变hash值
        const myBtn = document.getElementById('myBtn');
        myBtn.addEventListener('click', () => {
            console.log(location);
            location.hash = '#/user'; // http://127.0.0.1:5500/VueRouterTest/vue-app/test.html#/user
        })

        // 监听hash值变化：hashchange
        window.addEventListener('hashchange', () => {
            console.log('hash', location.hash);
        })
    </script>
</body>
</html>
```
总结：
1. 可以通过location.hash获得hash值
2. 通过hashchange事件监听到hash值的变化，当hash值发生改变我们就可以渲染需要的页面。

### 2. pushState与popstate
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
    <button id="myBtn">点击</button>

    <script>
        /**
         * 在history模式下，访问的路径应该是
         * http://127.0.0.1:5500/VueRouterTest/vue-app/test.html/user
         * 怎么获得 /user 呢？
         */

        // 首次加载访问路径为
        // http://127.0.0.1:5500/VueRouterTest/vue-app/test.htm
        window.addEventListener('DOMContentLoaded', () => {
            console.log(location.pathname); // /VueRouterTest/vue-app/test.html
        })

        // 切换路由：pushState
        const myBtn = document.getElementById('myBtn');
        myBtn.addEventListener('click', () => {
            const state = {
                name: 'user'
            };
            // 第一个参数：state
            // 第二个参数是title，目前不会用到设置为空字符串
            // 第三个参数url，传入'user'
            history.pushState(state, '', 'user');
            console.log('切换路由到了user');
            console.log(location.pathname); // /VueRouterTest/vue-app/user
        })

        // 监听浏览器前进后退按钮变化：popstate
        window.addEventListener('popstate', () => {
            console.log(location.pathname); 
            // /VueRouterTest/vue-app/test.html 
            // /VueRouterTest/vue-app/user
        })
    </script>

</body>

</html>
```
总结：
1. pushState切换到不同路由，渲染不同的组件。
2. popstate监听浏览器前进后退按钮事件。

## 实现hash模式
1. 插件install方法
2. 路由变化监听
3. 创建路由映射表
```javascript
let Vue; // 声明一个全局变量Vue，用来接收传入进来的Vue类

export default class VueRouter {
    constructor(options) {
        this.$options = options;
        // 保存路由映射表
        this.routerMap = {};
        // vm 保存实例化Vue
        this.vm = new Vue({
            data() {
                return {
                    currentPath: '/'
                }
            }
        })
    }

    init() {
        // 监听hash值变化
        this.bindEvent();
        // 创建路由映射表
        this.createRouterMap();
        // 初始化router-view、router-link
        this.initRouteComponent();
    }

    bindEvent() {
        // 首次加载完成监听路由变化
        window.addEventListener('DOMContentLoaded', this.handleHashChange.bind(this));
        // 路由变化监听
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
    }

    // 获取hash值
    getHashValue() {
        return window.location.hash.slice(1) || ''; // #/about -> /about
    }

    // 解决：Unknown custom element: <router-link>...
    initRouteComponent() {
        // 注册组件：router-view
        Vue.component('router-view', {
            render: h => {
                // 获取组件
                const component = this.routerMap[this.vm.currentPath].component;
                return h(component)
            }
        })

        Vue.component('router-link', {
            props: {
                // 接收to属性
                to: String
            },
            render(h) {
                return h('a', {
                    attrs: {
                        href: '#' + this.to
                    }
                }, this.$slots.default); // 插槽中的内容会传到this.$slots.default属性上
            }
        })
    }

    // 传进来的router是数组，需要访问每一项时，需要遍历
    createRouterMap() {
        this.$options.routes.forEach(item => {
            this.routerMap[item.path] = item;
        })
    }

    handleHashChange() {
            // 监听hash的变换，为了可以设置currentPath
            const hash = this.getHashValue(); // / 或者 /about
            this.vm.currentPath = hash;
        }
        // Uncaught TypeError: Cannot call a class as a function
        // static让install变成静态方法，就可以通过VueRouter.install访问
        // 没有static，install是实例方法，需要new VueRouter().install()访问
    static install(_Vue) {
        Vue = _Vue;
        Vue.mixin({
            beforeCreate() {
                // 找到根Vue实例，然后取出里面的router实例，并执行init方法
                if (this.$options.router) {
                    this.$options.router.init();
                }
            }
        })
    }
}
```