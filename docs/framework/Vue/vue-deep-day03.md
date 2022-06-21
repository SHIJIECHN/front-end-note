---
autoGroup-2: Vue深度学习系列
sidebarDepth: 3
title: 3. 认识Vue以及组件化构建
---

## 组件化
1. Vue组件化 -> 核心组件系统
2. Vue利用ES模块化 -> Vue组件系统的构建
3. 组件化 —> 抽象一个小型的、独立的、可预先定义配置的、复用的组件
     - 小型 -> 页面的构成拆分成一个一个的小单元
     - 独立 -> 每一个小单元尽可能都独立开发
     - 预先定义 -> 小单元都可以先定义好，在需要的时候导入使用
     - 预先配置 -> 小单元可以接收一些在使用的时候需要的一些配置
     - 可复用 -> 小单元可以在多个地方使用。
4. 可复用性要适当的考量，有些组件确实是不需要复用，可配置性越高，功能性越强。
5. 组件最大的作用是独立开发，预先配置，都是为了更好的维护和扩展。
6. 组件的嵌套形成一个组件树

## 实现todo-list

### index.html
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
    <div id="app">
        <div class="todo-list">
            <div>
                <todo-form @add-todo="addTodo" />
            </div>
            <div>
                <ul>
                    <todo-item v-for="item of todoList" :key="item.id" :todo="item" @change-completed="changeCompleted" @remove-todo="removeTodo" />
                </ul>
            </div>
        </div>
    </div>
    <script src="https://unpkg.com/vue@3.1.2/dist/vue.global.js"></script>
</body>
</html>
```

### main.js
```javascript
/**
 * {
 *  id: new Date().getTime(),
 *  content: inputValue,
 *  completed: false
 * }
 * 
 * TodoList 组件
 *  data
 *      todoList
 *  methods：
 *      removeTodo      id
 *      addTodo         inputValue
 *      changeCompleted id
 *  todo-form
 *  todo-list ul  view
 *      todo-item v-for  view
 */

const { createApp } = Vue;

const TodoList = {
    data() {
        return {
            todoList: [{
                    id: 1,
                    content: '123',
                    completed: false
                },
                {
                    id: 2,
                    content: '234',
                    completed: false
                },
                {
                    id: 3,
                    content: '345',
                    completed: false
                },
            ]
        }
    },
    methods: {
        removeTodo(id) {
            this.todoList = this.todoList.filter(item => item.id !== id);
        },
        addTodo(value) {
            this.todoList.push({
                id: new Date().getTime(),
                content: value,
                completed: false
            })
        },
        changeCompleted(id) {
            this.todoList = this.todoList.map(item => {
                if (item.id === id) {
                    console.log(id);
                    item.completed = !item.completed;
                }
                return item;
            })
        }
    }
}

const app = createApp(TodoList);
app.component('todo-form', {
    data() {
        return {
            inputValue: ''
        }

    },
    template: `
        <div>
            <input type="text" placehoder="请填写"  v-model="inputValue"/>
            <button @click="addTodo">增加</button>
        </div>
    `,
    methods: {
        addTodo() {
            this.$emit('add-todo', this.inputValue);
            this.inputValue = '';
        }
    }
})

app.component('todo-item', {
    props: ['todo'],
    emits: ['change-completed', 'remove-todo'],
    template: `
        <li>
            <input  
                type="checkbox"
                :checked="todo.completed"
                @click="changeCompleted(todo.id)"
            />
            <span
                :style="{
                    textDecoration:
                        todo.completed ? 'line-through' : 'none'
                }"
            >
                {{ todo.content}}
            </span>
            <button @click="removeTodo(todo.id)">删除</button>
        </li> 
    `,
    methods: {
        changeCompleted(id) {
            this.$emit('change-completed', id);
        },
        removeTodo(id) {
            this.$emit('remove-todo', id)
        }
    }
})
app.mount('#app');
```

子组件自定义事件发生警告：
`[Vue warn]: Extraneous non-emits event listeners (changeCompleted) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the “emits” option.`   
解决方法：声明下自定义事件名称即可
```javascript
emits: ['change-completed']
```