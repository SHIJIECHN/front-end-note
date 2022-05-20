---
autoGroup-1: Vue
sidebarDepth: 3
title: 组件注册/组件传值
---

## 组建的注册
1. 全局注册
```javascript
// 1. 全局注册（驼峰式命名）
Vue.component('TodoItem', {
    template: '<li>今天你吃饭了吗？</li>'
})

// 短横线命名方式
Vue.component('todo-item', {
    template: '<li>今天你吃饭了吗？</li>'
})

// 2. 使用
<todo-item></todo-item>
// 在注册组件的时候使用“驼峰式命名”或“短横线分割命名”，使用时都要使用“短横线分割命名”
```

2. 局部注册
```html
<body>
    <div id="root">
        <!--3. 使用组件-->
        <todo-item content="Hello"></todo-item>
    </div>

    <script type="text/javascript">
        // 1. 局部组件定义
        var TodoItem = {
            props: ['content'],
            template: '<li>{{ content}}</li>'
        }
        const vm = new Vue({
            el: '#root',
            // 2. 注册组件
            components: {
                'todo-item': TodoItem
            },
            data() {
                return {}
            }
        })
    </script>
</body>
```

## 组件传值
1. 静态传值
```html
<body>
<div id="root">
    <!--传入content-->
    <todo-item content="hello world"></todo-item>
</div>

<script type="text/javascript">
    Vue.component('todo-item', {
        props: ['content'], // 使用props接收
        template: '<li>{{ content}}</li>'
    })
    const vm = new Vue({
        el: '#root',
        data() {
            return {}
        }
    })
</body>
```

2. 动态传值: v-bind
```html
<body>
    <div id="root">
        <todo-item v-bind:content="item" v-for="item in list"></todo-item>
    </div>
</body>
```

## 父子组件传值
父向子传值：props    
子向父传值：$emit
```html
<body>
    <div id="root">
        <todo-item v-for="(item, index) in content" @delete="itemClick" :content="item" :index="index"></todo-item>
    </div>

    <script type="text/javascript">
        var TodoItem = {
            props: ['content', 'index'], // 父组件向子组件传值
            template: '<li @click="handleClick(index)">{{ content}}</li>',
            methods: {
                handleClick(index) {
                    this.$emit('delete', index); // 子组件向父组件传值
                }
            }
        }
        const vm = new Vue({
            el: '#root',
            components: {
                'todo-item': TodoItem
            },
            data() {
                return {
                    content: ['one', 'two', 'three']
                }
            },
            methods: {
                itemClick(index) {
                    console.log(index);
                }
            }
        })
    </script>
</body>
```

## 非父子组件传值
1. vuex
2. 总线传值

总线传值
```html
<body>
    <div id="root">
        <child content="hello"></child>
        <child content="Bye"></child>
        <child content="123"></child>
    </div>

    <script type="text/javascript">
        // 在Vue原型上挂载一个属性bus
        Vue.prototype.bus = new Vue();

        Vue.component('child', {
            props: ['content'],
            data() {
                return {
                    selfContent: this.content
                }
            },
            template: `<div @click='handleClick'>{{ selfContent }}</div>`,
            methods: {
                handleClick() {
                    // 在Vue的实例可以访问bus属性
                    this.bus.$emit('change', this.selfContent);
                }
            },
            mounted: function() {
                var _self = this;
                // $on 监听实例上触发的自定义事件
                this.bus.$on('change', function(msg) {
                    _self.selfContent = msg;
                })
            }
        })
        const vm = new Vue({
            el: '#root',
            data() {
                return {
                    content: 123
                }
            }
        })
    </script>
</body>
```

直接修改props报错：Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value.   

解决方法:
```javascript
props:['content'],
data() {
    return {
        selfContent: this.content // 修改selfContent
    }
}
```
