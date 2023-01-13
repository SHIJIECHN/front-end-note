---
autoGroup-4: Vue3
sidebarDepth: 3
title: 4. Vue3
---

# 快速上手
## 1. 创建一个应用
```javascript
// 安装并执行create-vue指令
npm init vue@latest
// 安装依赖
npm install
// 运行项目
npm run dev
// 项目打包
npm run build
```

<img :src="$withBase('/framework/Vue/vue3-day04-01.jpg')" alt="" />

## 2. 使用CDN
通过CDN使用Vue时，不涉及“构建步骤”
```javascript
// 使用全局构建版本
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

// 使用ES模块构建版本。注意使用<script type="module"></script>
<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({...})
</script>
```

# 创建一个Vue应用
1. 应用实例
2. 根组件实例

## 1. 应用实例
通过createApp创建应用实例。
```javascript
import {createApp} from 'vue'

// app是应用实例
const app = createApp({
    /**根组件选项 */
})
```

## 2. 根组件
传入createApp的对象实际上是一个组件。每个应用都需要一个“根组件”。
```javascript
import {createApp} from 'vue'
// 从一个单文件组件中导入根组件
import App from './App.vue'

const app = createApp(App);
```

## 3. 挂载应用
应用实例调用mount()方法后才会渲染出来。

mount()方法接收一个“容器”参数，可以是一个实际的DOM元素或是一个CSS选择器字符串。返回值是根组件实例。
```javascript
app.mount('#app'); // 返回根组件实例
```

# 模板语法
1. 文本插值：`{{ }}`
2. 原始HTML： v-html
3. 属性绑定：v-bind 或 ：。布尔型属性disabled，当其值为真值或者一个空字符串时，元素会包含这个disabled属性。为假值时不包含disabled被忽略。
4. 指令： v- 。指令的任务时在其表达式的值变化时响应式地更新DOM。参数href: v-bind:href="url"，动态参数：`v-bind:[attributeName]="url"`，修饰符：@submit.prevent="onSubmit"。

# 响应式基础
```vue
<script>
// 1. 引入reactive
import {reactive} from 'vue'

export default {
  // 2. setup 是一个专门用于组合式 API 的特殊钩子函数
  setup(){
    const state = reactive({count:0});
    function increment(){
      state.count++;
    }
    // 3. 暴露数据和increment函数给模板使用
    return {
      state,
      increment
    }
  }
}
</script>
<template>
  <!--4. 模板-->
  <button @click="increment">
    {{state.count}}
  </button>
</template>

```
使用`<script setup>`
```vue
<script setup lang="ts">
import { reactive } from "vue";

const state = reactive({ count: 0 });

function increment() {
  state.count++;
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

## 1. DOM 更新时机
DOM的更新并不是同步的。Vue会缓冲它们直到更新周期的“下个时机”以确保无论进行了多少次状态更改，每个组件都值会更新一次。

若要等待一个状态改变后的DOM更新完成，使用**nextTick**.

问题：nextTick的实现原理？

## 2. 深层响应式
Vue中状态默认深层响应式的。意味着更深层次的对象和数组发生改动也能被检测到。

问题：实现原理。

## 3. 响应式代理 vs 原始对象
1. reactive返回的是一个原始对象的Proxy。它与原始对象是不相等的。
2. 对同一个原始对象调用reactive()总是返回同样的代理对象，而对一个已存在的代理对象调用reactive()会返回其本身。
3. 响应式对象内的嵌套对象依然是代理。

## 4. reactive()局限性
1. 仅对对象类型有效（对象、数组、Map、Set），而对string、number、boolean原始类型无效。
2. 不可随意“替换”一个响应式对象，这将导致对初始引用的响应性连接丢失。当我们将响应式对象赋值或解构至本地变量时，或将该属性传入一个函数时，就会失去响应性。

## 5. ref()
ref()：创建任何值类型的响应式。将传入参数的值包装为一个带.value属性的ref对象。
```javascript
import { ref } from "vue";

const count = ref(0);
console.log(count); 
/**
RefImpl {
  dep: undefined,
  __v_isRef: true,
  __v_isShallow: false,
  _rawValue: 0,
  _value: 0,
  value: 0
} 
 */
```
ref的.value属性也是响应式的。同时，当值为对象类型时，会用reactive()自动转换它的.value

特点：

1. 一个包含对象类型值的ref可以响应式的替换整个对象
2. ref被传递给函数或是从一般对象上被解构时，不会丢失响应性。

ref解包：

1. ref在模板中作为**顶层属性**被访问时会自动解包，不需要使用.value。
```vue
<script setup>
import { ref } from "vue";

const count = ref(0); // 顶层属性
const obj1 = { foo: ref(1) }; // foo不是顶层属性
const { foo } = obj1; // 顶层属性
</script>

<template>
  <div>
    <p>count: {{ count + 1 }}</p>
    <p>obj1.foo: {{ obj1.foo + 1 }}</p>
    <p>foo: {{ foo + 1 }}</p>
    <!--注意：如果是文本插值，将会被解包-->
    <p>obj1.foo: {{ obj1.foo }}</p>
  </div>
</template>
```
结果：
```text
count: 1
obj1.foo: [object Object]1
foo: 2
obj1.foo: 1
```

2. 当ref被嵌套在一个响应式对象中，作为属性被访问或更改时，会自动解包。因此表现和一般属性一样。只有嵌套在深层响应对象中，ref才会自动解包。
3. 当ref作为响应式数组或像Map这种原生集合类型的元素被访问时，不会进行解包。

# 计算属性
computed()方法期望接收一个getter函数，返回值为一个计算属性ref
```javascript
import { reactive, computed } from "vue";

const author = reactive({
  name: "John Doe",
  books: ["Vue 2", "Vue 3", "Vue 4"],
});

const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? "Yes" : "No";
});
console.log(publishedBooksMessage); // ref对象
/**
ComputedRefImpl{
 ...
 value: 'Yes' 
}
 */
// 访问值
console.log(publishedBooksMessage.value); // Yes
```

## 1. 计算属性缓存 vs 方法
计算属性值会基于其响应式依赖被缓存，只有依赖发生改变时才会重新计算。方法调用总是会在重渲染发生时再次执行函数。

## 2. 可写计算属性
计算属性默认是只读的。可以通过提供getter和setter来创建可写的属性。
```javascript
const fullName = computed({
  // getter
  get() {
    return firstName.value + " " + lastName.value;
  },
  // setter
  set(newValue) {
    // 使用解构赋值语法
    [firstName.value, lastName.value] = newValue.split(" ");
  },
});
```

注意：

1. 计算属性的getter应只做计算而没有任何其他副作用。如不要再getter中做异步请求或更改DOM。
2. 避免直接修改计算属性值。应该更新它所依赖的源状态触发新的计算。

# 类和样式绑定
## 1. 绑定class
```javascript
// 绑定对象
// 1. 根据isActive的真假值，决定active是否存在
<div :class="{ active: isActive }"></div>
// 2. :class 与 class可以共存
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
// 3. 绑定一个返回对象的计算属性
const isActive = ref(true);
const error = ref(null);
const classObject = computed(()=>({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))

<div :class="classObject"></div>

// 绑定数组
// 1. 渲染多个class
const activeClass = ref('active');
const errorClass = ref('text-danger');
<div :class="[activeClass, errorClass]"></div>

// 2. 使用三元表达式条件渲染某个class
<div :class="[isActive ? activeClass : '', errorClass]"></div>

// 3. 某个class一直存在，其他class条件显示
<div :class="[{active: isActive}, errorClass]"></div>

// 在组件上使用
// 1. 单个根节点
// 子组件模板
<p class="foo bar">Hi!</p>
// 在使用组件时
<MyComponent class="baz boo" />
// 被渲染为
<p class="foo bar baz boo">Hi</p>

// 2. 多个根节点：
// MyComponent 模板使用 $attrs 时
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
// 在使用组件时
<MyComponent class="baz" />
// 被渲染为
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

## 2. 绑定内联样式
```javascript
// 绑定对象
// 1. 绑定HTML元素的style属性
const activeColor = ref('red');
const fontSize = ref(30);
<div :style="{color: activeColor, fontSize: fontSize+ 'px'}"></div>
// 2. 绑定一个样式对象
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
<div :style="styleObject"></div>

// 绑定数组
<div :style="[baseStyles, overridingStyles]"></div>
```

# 条件渲染
v-if, v-show

## 1. v-if vs v-show
1. v-if 可以在`<template>`元素上使用，v-show不可以
2. v-if 删掉整个DOM元素。v-show在渲染中保留该元素，仅切换了该元素上名为display: none的CSS属性
3. v-if 有更高的切换开销，而v-show有更高的初始渲染开销。因此需要频繁切换，则使用v-show较好，如果在运行时绑定条件很少改变，则v-if更合适。

v-if 与 v-for同时存在于一个元素上的时候，v-if会首先执行

# 列表渲染
key的作用：当数据项顺序发生改变时，Vue不会随之移动DOM元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲。但只适用于列表渲染输出的结果不依赖子组件或者临时DOM状态的情况。为了给Vue一个提示，以便它可以跟踪每个节点的标识，从而重用和重新排序现有的元素，需要为每个元素对应的块提供一个唯一的key。

key主要作为Vue的虚拟DOM算法提示，在比较新旧节点列表时用于识别vnode。

问题：key的作用

数组变化侦测：
1. Vue能够侦听响应式数组的变更方法包括：push, pop, shift, unshift, splice, sort, reverse
2. 其他数组方法会返回新的数组

注意：在计算属性中使用reverse()和sort()时，需要先创建一个原数组的副本。
```js
return [...numbers].reverse()
```

# 事件处理
内联处理器中调用方法
```js
// 1. 方法事件处理器会自动接收原生DOM事件并触发执行
<button @click="greet">Click</button>
function greet(event){}

// 2. 访问事件参数：向处理器方法传入一个特殊变量 $event 或者使用箭头函数
<button @click="warn('test', $event)">Submit</button>
// 或者
<button @click="(event) => warn('test', event)">Submit</button>
function warn(message, event){}
```

事件修饰符：.stop, .prevent, .self, .capture, .once, .passive。注意调用顺序。


