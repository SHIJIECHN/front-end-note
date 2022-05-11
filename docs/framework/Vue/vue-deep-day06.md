---
autoGroup-2: Vue
sidebarDepth: 3
title: methods
---

## methods
向组件实例添加方法
```javascript
var app = Vue.createApp({
    data() {
        return {
            title: 'This is my title'
        }
    },
    template: `
        <h1>{{ title }}</h1>
        <h2>{{ yourTitle() }}</h2>
        <button @click="changeTitle('This is your title')">CHNAGE TITLE</button>
    `,
    methods: {
        /**
         * 1. Vue创建实例时，会自动为methods绑定当前实例this
         *    保证在事件监听时，回调始终指向当前组件实例。
         *    方法要避免使用箭头函数，箭头函数会阻止Vue正确绑定组件实例this
         */

        /**
         * @click="changeTitle('This is your title')"
         * 
         * 函数名 + () 不是执行符号，传入实参的容器
         * 
         * onclick = "() => changeTitle('This is your title')"
         * 
         * onclick = { () => changeTitle('This is your title') }
         * onclick = { changeTitle.bind(this, 'This is your title') }
         * 
         */
        changeTitle(title) {
            this.title = title
        },
        /**
         * 模板直接调用的方法尽量避免副作用操作
         * 更改数据、异步操作等
         * 
         */

        yourTitle() {
            return 'This is your title'
        }
    }
})

const vm = app.mount('#app');

// 实例中直接挂载methods中的每一个方法
console.log(vm);
```