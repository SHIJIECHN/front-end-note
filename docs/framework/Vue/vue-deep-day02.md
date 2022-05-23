---
autoGroup-2: Vue
sidebarDepth: 3
title: 认识Vue以及它的基本用法
---

## Vue的核心
Vue的核心：用模板语法的方式 -> 用核心库 -> 编译模板 -> 然后再渲染DOM

```vue
 <!--组件模板-->
<template>
    <div>123</div>
</template>

<!-- 组件逻辑，组件逻辑块-->
<script>
export default {
    name: 'App'
}
  
</script>
<style>
  /* 组件的样式 */
</style>
```
1. 组件逻辑的本质就是一个对象，里面有很多特定的属性。<br>
2. vue将数据与DOM进行关联，并建立响应式关联，也就是说，数据改变，视图更新。<br>
3. Vue做了一件事情： 
数据改变 -> ViewModel核心库帮助  -> 更新视图
数据改变 <- ViewModel核心库帮助  <- 更新视图<br>

4. vue完成了数据双向绑定的机制。我们的业务关注点全部可以放在业务逻辑层，视图交给了ViewModel帮我们完成渲染和更新。

## 基本指令的使用
|<div style="width: 150px;">指令</div>  | 描述   |
| :---------:  | :----: |
| {{}} | 插值表达式 |
| v-on | 绑定事件处理函数 |
| v-bind | 绑定属性 - 引号内部看做变量，vue会对它进行解析 |
| v-model | oninput -> value -> myComment 能轻松实现表单输入和应用状态之间的双向绑定|
| v-for | 可以绑定数组的数据来渲染一个项目列表|
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
        <div class="article">
            <!-- 插值表达式 -->
            <h1>{{ title }}</h1>
            <p>
                <span>{{ author }} {{ dateTime }}</span>
            </p>
            <p>
                <span>Like: {{ like }}</span>
                <!-- v-on -> onclick/addEventListener 绑定事件处理函数-->
                <!-- <button v-on:click="likeThisArticle">Like</button> -->
                <!-- v-* 都是vue的指令-->
                <button v-if="isLogin" @click="likeThisArticle">Like</button>
                <button v-else disable>Please login first!</button>
            </p>
            <p>
                <button @click=followAction>{{ isFollowed ? 'Followed': 'Follow'}}</button>
            </p>
            <!-- <p title="content"></p>-->
            <!-- v-bind 绑定属性 - 引号内部看做变量，vue会对它进行解析-->
            <!-- <p v-bind:title="content">{{ content }}</p> -->
            <p :title="content">{{ content }}</p>
            <div class="form">
                <!-- v-model: input的时候 -> 将value -> 交给myComment-->
                <p>{{ myComment}}</p>
                <input type="text" placeholder="请填写评论" v-model="myComment">
                <button @click="submitComment">Submit</button>
            </div>
            <div class="comment">
                <ul>
                    <!-- key in obj -> 对象
                        item in arr -> 数组
                    -->
                    <li v-for="item of commentList" :key="item.id">
                        <p>
                            <span>{{ item.dateTime }}</span>
                        </p>
                        <p>{{ item.content }}</p>
                    </li>
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
const { createApp } = Vue;

const Article = {
    data() {
        return {
            title: 'This is a TITLE',
            author: 'Xiaoye',
            dateTime: '2022-5-23',
            content: 'This is a CONTENT',
            like: 0,
            isLogin: true,
            isFollowed: false,
            myComment: '',
            commentList: []
        }
    },
    // 组件里的方法
    methods: {
        likeThisArticle() {
            this.like++;
        },
        followAction() {
            this.isFollowed = !this.isFollowed;
        },
        submitComment() {
            if (this.myComment.length > 0) {
                this.commentList.push({
                    id: new Date().getTime(),
                    dateTime: new Date(),
                    content: this.myComment
                })
                console.log(this.commentList);
            }
        }

    }
}

createApp(Article).mount('#app');
```
