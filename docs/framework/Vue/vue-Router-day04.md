---
autoGroup-4: Vue-Router
sidebarDepth: 3
title: 4. VueRouter介绍、两种模式、编程式导航
---

## Vue路由
### 1. 为什么使用VueRouter
单页面应用只请求一次index.html。http://localhost:8080/#/user，可以理解为 http://localhost:8080 是向服务器请求index.html文件，#后面user是给VueRouter解析使用。

### 2. 设置路由、加载路由
```javascript
const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/user',
        component: User
    }
]

const router = new VueRouter({
    routes
})

export default router;
```

### 3. hash模式与history模式
hash模式是默认模式，使用hash模式可以不用配置服务器。   
history模式配置：  
第一点是传入mode参数
```javascript
const router = new VueRouter({
    routes,
    mode: 'history'
})
```
第二点需要服务器配置，无论访问哪个地址都返回index.html页面。
```javascript
location / {
  try_files $uri $uri/ /index.html;
}
```
本地使用history需要配置吗？不需要的，因为启动项目使用npm run dev时，webpack自动配置好了，无论访问什么地址都会返回index.html。

### 4. 使用\<router-link>
#### a标签与\<router-link>的区别
1. a标签可以配置项太少了，不能满足做路由时需要的配置。
2. 点击a标签会向服务器发送请求，这是a标签的默认行为。
3. \<router-link>会满足配置，也默认禁止发送请求。

#### \<router-link>使用
```javascript
<li>
    <router-link to="/">首页</router-link>
</li>
<li>
    <router-link to="/user">用户</router-link>
</li>
```
会转成a标签展示
```javascript
<li>
    <a href="/"  class="router-link-active router-link-exact-active">首页</a>
</li>
<li>
    <a href="/user" class>用户</a>
</li>
```
点击会动态添加两个类名：router-link-active和router-link-exact-active

### 5. 设置active的链接样式
#### 点击默认的class样式
\<router-link>是根据什么逻辑添加router-link-active和router-link-exact-active的？   
1. 当首次进入页面，默认选中“首页”，此时
```javascript
<li>
    <a href="/"  class="router-link-active router-link-exact-active">首页</a>
</li>
<li>
    <a href="/user" class>用户</a>
</li>
```
2. 点击“用户”，此时为在“首页”中也有class属性值。
```javascript
<li>
    <a href="/"  class="router-link-active">首页</a>
</li>
<li>
    <a href="/user" class="router-link-active router-link-exact-active">用户</a>
</li>
```

#### 自定义active样式
```javascript
<li>
    <router-link to="/" active-class="active">首页</router-link>
</li>
<li>
    <router-link to="/user" active-class="active">用户</router-link>
</li>

// 改变的是router-link-active类
<li>
    <a href="/"  class="active">首页</a>
</li>
<li>
    <a href="/user" class="active router-link-exact-active">用户</a>
</li>
```
如果想让渲染出来的active类放到li标签上，而不是a标签呢？   
tag 属性指定router-link最终渲染成怎样的html标签
```javascript
<router-link tag="li" to="/" active-class="active">
    <a>首页</a>
</router-link>
<router-link tag="li" to="/user" active-class="active">
    <a>用户</a>
</router-link>

// 渲染结果
<li class="active router-link-exact-active">
    <a href="/">首页</a>
</li>
<li class>
    <a href="/user" >用户</a>
</li>


// 点击用户两个都会变成激活链接。这个是两个都添加active造成的。
// 怎么添加active类的？
// url为http://localhost:8080/时 就会去找 router-link中哪一个to是/。
// url为http://localhost:8080/user时 就会去找 router-link中哪一个to是/user。同时匹配的是/开始的。
// 解决：使用属性exact精确匹配
<router-link tag="li" to="/" active-class="active" exact>
    <a>首页</a>
</router-link>
<router-link tag="li" to="/user" active-class="active">
    <a>用户</a>
</router-link>
```
总结：
1. 使用active-class自定义类名
2. rag设置渲染成的标签
3. exact精确匹配

### 6. 编程时导航
```vue
<template>
    <button @click="navigateToHome">回到首页</button>
</template>

<script>
    export default{
        methods: {
            navigateToHome(){
                // 第一种形式
                this.$touter.push('/');
                // 第二种形式
                this.$touter.push({ path: '/' });
            }
        }
    }
</script>
```
this.$touter.push('/')就是实现了router-link的功能。实际上router-link就是通过这种方式实现的路由跳转。

后续补充：
7. 路由参数
8.  嵌套路由
9.  命名路由
10.  查询参数
11.  命名视图
12. 重定向
13. 捕获所有路由
14. 过渡动效
15. Hash片段
16. 滚动行为
17. 导航守卫
18. 路由懒加载