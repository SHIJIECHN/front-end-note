---
autoGroup-1: Vuex
sidebarDepth: 3
title: 原理
---
## 核心原理
1. Vuex本质是一个对象
2. Vuex对象有两个属性，一个是install方法，一个是Store这个类
3. install方法的作用是将store这个实挂载到所有的组件上，注意是同一个store实例
4. Store这个类拥有commit，dispatch这些方法，Store类里将用户传入的state包装成data，作为new Vue的参数，从而实现了state值的响应式。

## 剖析Vuex本质
1. 通过new Vuex.Store({})获得一个store实例，也就是说，引入的Vuex中有Store这个类作为Vuex对象的属性。因为通过import引入的，实质上就是导出一个对象的引用。
```js
class Store{

}

let Vuex = {
  Store
}

```

2. 还要使用Vue.use()，而Vue.use的一个原则就是执行对象的install这个方法。所以，可以再一步假设Vuex有install这个方法.
```js
class Store{

}

let install = function(){

}

let Vuex = {
  Store,
  install
}

// 导出 Vuex 对象
export default Vuex

```

## 分析Vue.use
Vue.use(plugin);
### 1. 参数
{ Object | Function } plugin
### 2. 用法
安装Vue.js插件。如果插件是一个对象，必须提供install方法。如果插件是一个函数，它会被作为install方法。调用install方法时，会将Vue作为参数传入。install方法被同一个插件多次调用时，插件也只会被安装一次。
### 3. 作用
注册插件，此时只需要调用install方法并将Vue作为参数传入即可。但在细节上有两部分逻辑要处理：
1. 插件的类型，可以是install方法，也可以是一个包含install方法的对象。
2. 插件只能被安装一次，保证插件列表中不能有重复的插件。
### 4. 实现
```js
Vue.use = function(plugin){
  const installedPlugins = (this._installedPlugins ||(this._installedPlugins = []))
  if(installedPlugins.indexOf(plugin) > -1){
    return this;
  }

  const args = toArray(arguments, 1);
  args.unshift(this);
  if(typeof plugin.install === 'function'){
    plugin.install.apply(plugin, args)
  }else if(typeof plugin === 'function'){
    plugin.apply(null, plugin, args);
  }

  installedPlugins.push(plugin);
  return this;
}
```
1. 在Vue.js上新增了use方法，并接收一个参数plugin
2. 首先判断插件是不是已经别注册过，如果被注册过，则直接终止方法执行，此时只需要使用indexOf方法即可。
3. toArray方法就是将类数组转成真正的数组。使用toArray方法得到。arguments。除了第一个参数之外，剩余的所有参数将得到的列表赋值给args，然后将Vue添加到args列表的最前面。这样做的目的是保证install方法被执行时第一个参数是Vue，其余参数是注册插件时传入的参数。
4. 由于plugin参数支持对象和函数类型，所以通过判断plugin.install和plugin哪个是函数，即可知用户使用哪种方式祖册的插件，然后执行用户编写的插件并将args作为参数传入。
5. 最后，将插件添加到installedPlugins中，保证相同的插件不会反复被注册

## install方法

### 1. 实现
通过Vue.use(Vuex) 使得每个组件都可以拥有store实例。
```js
let install = function(){
  Vue.mixin({
    beforeCreate(){
      if(this.$options && this.$options.store){
        // 如果是根组件
        this.$store = this.$options.store;
      }else{
        // 如果是子组件
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}
```
分析：
1. 参数Vue。在执行install的时候，将Vue作为参数传进去。
2. mixin的作用是将mixin的内容混合到Vue的初始参数options中
3. 为什么是beforeCreate而不是created呢？因为如果是在created操作的话，$options已经初始化好了。
4. 如果判断当前组件是根组件的话，就将我们传入的store挂在到根组件实例上，属性名为$store。
5. 如果判断当前组件是子组件的话，就将我们根组件的$store也复制给子组件。注意是引用的复制，因此每个组件都拥有了同一个$store挂载在它身上。

为什么判断当前组件是子组件，就可以直接从父组件拿到$store呢？

### 2. 父组件和子组件的执行顺序
父beforeCreate-> 父created -> 父beforeMounte -> 子beforeCreate ->子create ->子beforeMount ->子 mounted -> 父mounted。

在执行子组件的beforeCreate的时候，父组件已经执行完beforeCreate了，那理所当然父组件已经有$store了。

## 实现state
1. 类Store中获取state。由于state是作为参数对象传入，因此可以在constructor中获得state。
```js
class Store{
  constructor(options){
    this.state = options.state || {};
  }
}
```
2. state中的数据是响应式的。如何实现？new Vue()的时候，传入的data是响应式的，name是不是可以new一个Vue，然后把state当做data传入呢？
```js
class Store{
  constructor(options){
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })
  }
}
```
3. 怎么获得state呢？只能通过this.$store.vm.state。而平时是this.$store.state获得的，因此需要转化。给Store类添加一个state属性，这个属性自动触发get接口。
```js
class Store{
  constructor(options){
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })
  }
  // 新增
  get state(){
    return this.vm.state;
  }
}
```

问题：vuex中的state和全局变量有什么区别？state是响应式数据。


## 实现getter
```js
class Store{
  constructor(options){
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    // 新增
    let getters = options.getter || {};
    this.getters = {}
    Object.keys(getters).forEach(getterName => {
      Object.defineProperty(this.getters, getterName, {
        get: ()=>{
          return getters[getterName](this.state)
        }
      })
    })
  }
  
  get state(){
    return this.vm.state;
  }
}
```
把用户传进来的getter保存到getters数组里。    
**为什么用getter的时候不用写括号。**这个问题就像问我们平时写个变量，为什么不用括号一样。（如{{num}},而不是{{num()}}）。利用了Object.defineProperty。


## 实现mutation
```js
class Store{
  constructor(options){
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    let getters = options.getter || {}
    this.getters = {}
    Object.keys(getters).forEach(getterName=>{
        Object.defineProperty(this.getters,getterName,{
            get:()=>{
                return getters[getterName](this.state)
            }
        })
    })

    // 新增代码
    let mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = (arg) => {
        mutations[mutationName](this, state, arg)
      }
    })
  }
  
  get state(){
    return this.vm.state;
  }
}
```
mutations跟getter一样，还是用mutations对象将用户传入的mutations存储起来。但是怎么触发呢？回忆一下，我们是怎么触发mutations的。
```js
this.$store.commit('incre',1)
```
可以看出store对象有commit这个方法。而commit方法触发了mutations对象中的某个对应的方法，因此我们可以给Store类添加commit方法。
```js
class Store{
  constructor(options){
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    let getters = options.getter || {}
    this.getters = {}
    Object.keys(getters).forEach(getterName=>{
        Object.defineProperty(this.getters,getterName,{
            get:()=>{
                return getters[getterName](this.state)
            }
        })
    })

    let mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = (arg) => {
        mutations[mutationName](this, state, arg)
      }
    })
  }

  // 新增代码
  commit(method, arg){
    this.mutations[method](arg)
  }
  
  get state(){
    return this.vm.state;
  }
}

```

## 实现actions
```js
class Store{
  constructor(options){
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    let getters = options.getter || {}
    this.getters = {}
    Object.keys(getters).forEach(getterName=>{
        Object.defineProperty(this.getters,getterName,{
            get:()=>{
                return getters[getterName](this.state)
            }
        })
    })

    let mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = (arg) => {
        mutations[mutationName](this.state, arg)
      }
    })

    // 新增代码
    let actions = options.actions
    this.actions = {}
    Object.keys(actions).forEach(actionName => {
      this.actions[actionName] = (arg) => {
        actions[actionName](this, arg) // this 代表的是 store 实例本身
      }
    })
  }

  // 新增代码
  dispatch(method, arg){
    this.actions[method](arg);
  }

  commit(method, arg){
    this.mutations[method](arg)
  }
  
  get state(){
    return this.vm.state;
  }
}

```
actions使用是这样的
```js
actions: {
    asyncIncre({commit}, arg){
      setTimeout(()=>{
        commit('incre', arg)
      }, 1000)
    }
  }
```
其实{commit} 就是对this，即store实例的解构

## 功能验证
### 1. 目录结构
<img :src="$withBase('/framework/Vuex/catalogue.png')" alt="catalogue" />  

### 2. 代码

#### main.js
```js
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");

```

#### App.vue
```vue
<template>
  <div>
    <p>state: {{this.$store.state.num}}</p>
    <p>getter: {{this.$store.getters.getNum}}</p>
    <button @click="add">+1</button>
    <button @click="asyncAdd">异步+2</button>
  </div>
</template>

<script>


export default {
  name: "App",
  methods: {
    add(){
      this.$store.commit('incre', 1)
    },
    asyncAdd(){
      this.$store.dispatch('asyncIncre',2)
    }
  },
};
</script>

```

#### index.js
```js
import Vue from "vue";
import Vuex from "./myVuex";  // 引入

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    num: 1
  },
  getter:{
    getNum:(state)=>{
      return state.num
    }
  },
  mutations: {
    incre(state, arg){
      state.num += arg;
    }
  },
  actions: {
    asyncIncre({commit}, arg){
      setTimeout(()=>{
        commit('incre', arg)
      }, 1000)
    }
  },
  modules: {},
});

```

#### myVuex.js
```js
import Vue from "vue"

class Store{
  constructor(options){
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    let getters = options.getter || {}
    this.getters = {}
    Object.keys(getters).forEach(getterName=>{
        Object.defineProperty(this.getters,getterName,{
            get:()=>{
                return getters[getterName](this.state)
            }
        })
    })

    let mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = (arg) => {
        mutations[mutationName](this.state, arg)
      }
    })

    let actions = options.actions
    this.actions = {}
    Object.keys(actions).forEach(actionName => {
      this.actions[actionName] = (arg) => {
        actions[actionName](this, arg) // this 代表的是 store 实例本身
      }
    })
  }

  dispatch(method, arg){
    this.actions[method](arg);
  }

  commit=(method,arg)=>{
    this.mutations[method](arg)
  }
  
  get state(){
    return this.vm.state;
  }
}

let install = function(){
  Vue.mixin({
    beforeCreate(){
      if(this.$options && this.$options.store){
        // 如果是根组件
        this.$store = this.$options.store;
      }else{
        // 如果是子组件
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

let Vuex = {
  Store,
  install
}

export default Vuex

```
** 注意 **   
如果commit使用普通函数，则会报错
<img :src="$withBase('/framework/Vuex/commit-error.png')" alt="commit-error" />  

错误是说执行到这里发现这里的this是undefined
```js
commit(method,arg){
  console.log(this); // undefined
  this.mutations[method](arg)
}
```
分析：
```js
this.$store.commit('incre',1)
```
执行这段代码的时候，执行commit的时候，this是谁调用就指向谁，所以this指向$store。
```js
this.$store.dispatch('asyncIncre',2)
```
执行这段代码，就会执行
```js
asyncIncre({commit},arg){
  setTimeout(()=>{
    commit('incre',arg)
  },1000)
}
```
谁调用commit？？是$store吗？并不是。所以要解决这个问题，我们必须换成箭头函数

