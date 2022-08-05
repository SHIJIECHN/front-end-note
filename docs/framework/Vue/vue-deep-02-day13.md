---
autoGroup-2: Vue
sidebarDepth: 3
title: 模板语法
---

## 模板语法
`template`里面的`HTML`字符串， 内部除了`HTML`特性以外还有一些`Vue`的特性，比如表达式、属性、指令等，这些都是`Vue`提供的。    
`vue`的模板都是基于`HTML`。模板中直接写`HTML`都是能够被`HTML`解析器解析，`Vue`对自定义属性、指令、表达式等，`Vue`有一套模板编译系统。开发者写的`template`，分析`HTML`字符串变成`AST`树，利用`AST`树把自定义属性、指令进行转化成原生的`HTML`，形成虚拟`DOM`树，虚拟`DOM`变成真实`DOM`再`render`出来。   
模板编译过程：`template`->分析`HTML`字符串 -> `AST` -> 表达式、自定义属性、指令 -> 虚拟`DOM`树 -> 解析真实`DOM` -> `render`

插值表达式`Mustache`
```javascript
const App = {
    data() {
        return {
            title: 'This is my TITLE.',
            author: 'Xiaoye',
            dateTime: new Date(),
            content: 'This is my CONTENT'
        }
    },
    template: `
        <div>
            <h1 class="title">{{ title }}</h1>
            <p>
                <span class="author">{{ author }}</span> - {{ dateTime }}
            </p>
            <p :title="content">{{ content }}</p>
        </div>
    `
}

Vue.createApp(App).mount('#app');
```
不仅可以使用`template`，还可以使用`h`函数，也就是直接写虚拟节点一样的模板。`template`并不直接就是`HTML`，还可以用`render`函数来进行渲染. 
将`template`转成h函数表示：  
```javascript
render() {
    return h(
        'div', 
        {}, 
        [
            h(
                'h1',
                {
                    class: 'title'
                },
                this.title
            ),
            h(
                'p', 
                {}, 
                [
                    h(
                        'span', 
                        {
                            class: 'author'
                        },
                        this.author
                    ),
                    ` - ${this.dateTime}`
                ]
            ),
            h(
                'p', 
                {
                    title: this.content
                },
                this.content
            )
        ]
    )
}
```

能够更新视图： `data`、父组件传的属性`props`。

## 指令
`directive`指令。所有在`Vue`中，模板上属性的`v-*`都是指令。   
为什么叫指令？   
模板应该按照怎样的逻辑进行渲染或绑定行为。   


`Vue`提供了大量的内置指令：`v-if`，`v-else`, `v-for`...。开发者也可以给`Vue`扩展指令，自定义指令，v-取名。


`v-once`：一次插值，永不更新，不建议这么做
```javascript
const TITLE = 'This is my TITLE2';
const App = {
    data() {
        return {
            title: 'This is my TITLE1',
            author: 'Xiaoye'
        }
    },
    methods: {
        changeTitle() {
            this.title = 'This is your title',
                this.author = 'xiaoyesensen'
        }
    },
    // 视图上Vue指令的插入方式的数据变量必须声明在实例上, 两个h1显示效果一样
    template: `
        <div>
            <h1 v-once>{{ title }} - <span>{{ author }}</span></h1>
            <h1>${ TITLE }</h1>
            <button @click="changeTitle">Change Title</button>
        </div>
    `
}

Vue.createApp(App).mount('#app');
```

`v-html`：主要是提供解决插值里面无法进行`HTML`标签解析的解决方案
插值不会解析`HTML`，因为插值是`JS`表达式，没有对`DOM`的操作，`rawHTML`。   
不要试图用`v-html`做子模板， `vue`本身有一个底层的模板编译系统，而不是直接使用字符串来渲染的。子模板放到子组件中，让模板的重用和组合更强大。    
不要把用户提供的内容作为`v-html`的插值，这种插值容易导致`XSS`攻击。    
`v-html`动态渲染`HTML`，使用基本是`innerHTML`。`innerHTML`有时候会容易导致`XSS`攻击。

## 属性
`attribute`: `HTML`的扩展 `title`，`src`，`href`   -> `attr`
`property`：在对象内部存储数据，通常用来描述数据结构  -> `prop`  

在`Mustache`中是不支持在`HTML`属性中插值，`Vue`中因为用底层的模板编译系统，支持`Vue`内置的属性。

`v-bind`：在`html`中插入`JS`表达式，可以使用`v-bind`。   
`disable="true"`    
对于模板解析，`true`是个字符串，并不是逻辑真。   
`:disable="true"` 逻辑真。   


`falsy`: `false`, `0`, `""`, `null`, `undefined`, `NaN` 的集合表示
`truthy`: 除`falsy`以外的值。  

