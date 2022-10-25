---
autoGroup-4: Vue3
sidebarDepth: 3
title: 1. Vue3.0基础
---

## 概述
vue2.0的局限性：
1. 当组件变得庞大复杂起来后，代码可阅读性降低
2. 代码复用有明显的缺陷
3. Typescript支持非常有限

## 组合API
hooks是vue3底层提供的钩子实现函数方式（不像Vue2 options API），开发者只需写提供钩子里面的逻辑。     
基于函数抽离的组合各种方法函数实现高内聚的情况。vue2.0有横向拆分，各个组件都有如data、method、computed

### 1. CompositionAPI
解决了vue2.0中当组件变得庞大复杂起来后，代码可阅读行降低。

> 什么时候使用CompositionAPI？

- 希望有最理想的TypeScript支持
- 当组件的内容变得庞大复杂起来的时候，并且希望通过功能来管理组件
- 可能会有一些想要在不同的组件里使用的代码（代码复用）
- 团队倾向新的CompositionAPI

```js
// vue2.0写法：
export default {
  data() {
    return {
      search,
      sorting
    }
  },
  methods: {
    search,
    sorting
  },
  props: {
    search,
    sorting
  }
}
```
```js
//vue3.0写法：(可选/不影响2.0使用)
export default {
  setup() {
    //Composition API语法
    search,
    sorting
  }
}
```
```js
export default {
  setup() {
    //Composition functions
    return {
      ...useSearch(),
      ...useSorting()
    }
  }
}

//搜索
function useSearch() {}
//排序
function useSorting() {}
```

### 2. vue2.0代码复用的三种方式
1. mixin提取公共代码到数据管理
2. Mixin Factories工厂
3. Scoped Slots作用域插槽方式
```js
//方式一：mixins
//存在优点：
//1.根据不同的功能进行归类

//存在缺点：
//1.容易产生重复定义冲突
//2.复用性不高

const productSearchMixin = {
  data() {
    search
  },
  methods: {
    search
  }
}

const resultSortMixin = {
  data() {
    sorting
  },
  methods: {
    sorting
  }
}

export default {
  mixins: [productSearchMixin, resultSortMixin]
}
```

```js
//方式二：Mixin Factories
//存在优点：
//1.提高可复用性

//存在缺点：
//1.命名空间需要有严格的规范
//2.暴露的属性需要进入到Mixin工厂函数的定义文件里查看
//3.Factories不能动态生成

//组件部分：
import searchMixinFactory from '@mixins/factories/search';
import sortingMixinFactory from '@mixins/factories/sorting';

export default {
  mixins: [
    searchMixinFactory({
      namespace: 'productSearch',
      xxx
    }),
    sortingMixinFactory({
      namespace: 'productSorting',
      xxx
    }),
  ]
}

//逻辑部分：
export default function sortingMixinFactory(obj) { }
```
```js
//方式三：Scoped Slots
//存在优点：
//1.解决Mixins大多数问题

//存在缺点：
//1.配置需要模板完成，理想的状态模板只定义需要渲染的内容
//2.缩进降低代码的可阅读性
//3.暴露的属性只能够在模板里使用
//4.3个组件比1个组件，性能开销上升

//generic-search.vue组件部分：
<script>
  export default {
    props:['getResults']
  }
</script>

<template>
  <div>
    <slot v-bind="{query, results, run}"></slot>
  </div>
</template>

//generic-sorting.vue组件部分：
<script>
  export default {
    props:['input', 'options']
  }
</script>

<template>
  <div>
    <slot v-bind="{options, index, output}"></slot>
  </div>
</template>

//search.vue组件部分：
<template>
  <div>
    <generic-search
      :get-results="getProducts"
      :v-slot="productSearch"
    >
      <generic-sorting
        :input="productSearch.results"
        :options="resultSortingOptions"
        v-slot="resultSorting"
      ></generic-sorting>
    </generic-search>
  </div>
</template>

<script>
  export default {}
</script>
```

### 3. 如何使用CompositionAPI
```js
//安装
npm i -S @vue/composition-api

//引用
import VueCompositionApi from '@vue/composition-api';

//注册
Vue.use(VueCompositionApi);
```

## setup
1. 一个组件选项，在组件被创建之前，props被解析之后执行。    
2. 它是组合式API的入口。    
3. setup返回一个对象，对象里的属性将被合并到render函数执行期上下文里，所以视图模板可以使用对象的数据。
4. 当视图模板访问对象属性是，不需要.value写法
5. setup方法必须返回vew模板里定义的数据和方法
6. setup函数在Components/props/data/methods/computed/lifecycle之前执行。

```javascript
import {ref} from '@vue/composition-api'
import {watch} from 'vue'

export default{
    props: {
        // 定义一个属性
        name: String
    }
    // 将props传入setup中。不能访问this，可以访问context
    // 两个参数props和context
    setup(props, context){
        // 观察监听props里面的属性
        watch(()=>{
            console.log(props.name)
        })
        //因为不能访问this,但通过context可访问：
        //context.attrs/slots/parent/root/listeners

    }
}
```
**参数**
- 接收的第一个参数为：被解析后的props
- 接收的第二个参数为：执行期上下文

```javascript
setup(props){}

console.log(props); // Proxy{...}

console.log(ctx);
/**
 * {
 *   attrs: (...),
 *   emit: (...), 这里emit代替vue2 this.$emit
 *   expose: exposed => {…},
 *   slots: (...),
 *   get attrs: ƒ attrs(),
 *   get slots: ƒ slots()
 * }
 */
```
> 注意：接收的props已经被响应式代理了对象，切不要解构props否则失去响应式。

参数二可以解构使用：
```js
setup(props, {attrs, emit, slots}){...}

setip(props, ctx){
    const {attrs, emit, slots} = ctx
}
```


## ref
接收一个内部值并返回一个响应式且可变的ref对象。ref对象仅有一个.value属性，指向该内部值。  
如果将对象分配为ref值，则它将被reactive函数处理为深层响应式对象。
```javascript
const obj = ref({
  a: 1,
  b: 2
});

/**
 * RefImpl{
 *   ...,
 *   value: Proxy{...}
 * }
 */

//value会做reactive响应式处理
```
reactive 将解包所有深层的refs同时维持 ref的响应性。
```javascript
import {reactive} from '@vue/composition'


```

### 1. 响应式引用值作用（ref())
选择性暴露响应式对象数据有利于后期代码维护，也能更好的追踪到模板里的属性定义的位置

```javascript
s<div>容量：{{ capacity }}</div>

import { ref } from '@vue/composition-api';

export default {
  setup(){
    //传入原始值并执行会创建ref对象
    //ref() => ref对象 => 响应式属性
    const capacity = ref(3);

    console.log(capacity);
    /**
    * RefImpl:
    * {
    *   value: 3,
    *   get value(){}
    *   set value(){}
    * }
    */
    console.log(capacity.value); // 3

    //必须返回对象才能供模板表达式使用
    //不返回会报错：模板使用了但未定义
    return { capacity };
  }
}

```

### 2. 方法定义
```html
<div>容量：{{ capacity }}</div>
<button @click="increaseCapacity()">增加容量</button>
```
```javascript
import { ref } from '@vue/composition-api';

export default {
  setup(){
    const capacity = ref(3);
    function increaseCapacity(){
      capacity.value ++;
    };
    return { capacity, increaseCapacity };
  }
}
```

### 3. 计算方法
```html
<p>座位容量：{{ capacity }}</p>
<p>剩余座位容量：{{spacesLeft}}/{{capcity}}</p>
<button @click="increaseCapacity()">增加容量</button>
<h2>参加人员</h2>
<ul>
  <li v-for="(name, index) in attending" :key="index">
    {{name}}
  </li>
</ul>
```
```javascript
//引入computed计算函数
import { ref, computed } from '@vue/composition-api';

export default{
    setup(props, context){
        const capacity = ref(4);
        const attending = ref(['小王', '小李', '小张'])

        // 定义计算函数方法
        const spaceLeft = computed(()=>{
            return capacity.value - attending.value.length;
        })

        function increaseCapacity(){
            capacity.value ++;
        };

        // 导出spacesLeft计算属性方法
        return {
            capacity,
            attending,
            spacesLeft,
            increaseCapacity
        };
    }
}
```

## Reactive
返回对象的响应式副本，是深层影响所有嵌套属性。   
有一个事件触发或一个视图上或数据上的改变，相对于被绑定方的数据也一起被改变。    
reactive()该函数返回的是真正的响应式对象。
```html
// reactive() 写法
<p>座位容量：{{ event.capacity }}</p>
<p>剩余座位容量：{{event.spacesLeft}}/{{event.capcity}}</p>
<button @click="increaseCapacity()">增加容量</button>
<h2>参加人员</h2>
<ul>
  <li v-for="(name, index) in event.attending" :key="index">
    {{name}}
  </li>
</ul>

//写法二：toRefs()简写
<p>座位容量：{{ capacity }}</p>
<p>剩余座位容量：{{spacesLeft}}/{{capcity}}</p>
<button @click="increaseCapacity()">增加容量</button>
<h2>参加人员</h2>
<ul>
  <li v-for="(name, index) in attending" :key="index">
    {{name}}
  </li>
</ul>
```
```javascript
//引入reactive计算函数
import { reactive, computed, toRefs } from '@vue/composition-api';

export default{
    setup(props, context){
        const event = reactive({
            capacity: 4,
            attending: ['小王', '小李', '小张'],
            spaceLeft: computed(()=>{
                return capacity.value - attending.value.length;
            })
        })

        function increaseCapacity(){
            event.capacity++;
        };
    }

    return { event, increaseCapacity }

    //写法二：
    //toRefs()将响应式对象转换为普通对象
    //...平铺开对象
    //既可以保持属性响应式，又能进行简写响应式对象平铺
    //return { ...toRefs(event), increaseCapacity };

    //写法三：
    //因为toRefs()方法返回的是一个响应式对象
    //所以可以直接返回该对象
    //return toRefs(event);
}
```


## Composition Function
提取代码，做代码复用的解决方案。    
优点：
1. 代码量减少，能够更容易地把功能从组件内部提取到一个函数里
2. 因为使用的是函数，使用的是现有的知识
3. 更灵活，技能感知，自动补全等编辑器里有提示的功能利于编写代码

缺点：
1. 学习low-level API知识定义Composition Functions
2. 3.0定义组件的方式变成了两种

解决问题：代码复用有明显的缺陷
```javascript
// 写法
// 其他组件使用
import useEventSpace from '@/use/event-space'
export default {
    setup(props, context){
        // 执行函数并返回对象
        return useEventSpace();
    }
}

// 定义在组件 src/use/event-space.js
// Composition Function
import {ref, computed}from '@vue/composition-api'
export default function useEventSpace(){
    const capacity = ref(3);
    const attending = ref(['小王', '小李', '小张'])
    spacesLeft: computed(()=>{
        return capacity.value - attending.value.length;
    })

    function increaseCapacity(){
        capacity.value++
    }

    return {
        capacity,
        attending,
        spacesLeft,
        increaseCapacity
    }
}

```


## 生命周期
选项式API的生命周期选项和组合式API之间的映射    
- beforeCreate -> 使用setup
  - 在实例初始化之后，进行数据侦听和事件/侦听器的配置之前同步调用
- created -> 使用setup
  - 在实例创建完成后立即同步调用。在这一步中，实例已完成对选项的处理，意味着以下内容已被配置完毕：数据侦听、计算属性、方法、事件/侦听器的回调函数。然后，挂载阶段还没开始，且$el属性目前尚未可用。
- beforeMount -> onBeforeMount
  - 在挂载开始之前被调用：相关的render函数首次被调用
- mounted -> onMounted
  - 在实例关在完成后被调用，这时候传递给app.mount的元素已经被新创建的vm.$el替换了。如果根实例被挂载到了一个文档内的元素上，当mounted被调用时，vm.$el也会在文档内。注意，mounted不会保证所有的子组件也都被挂载完成，如果你希望等待整个视图都渲染完毕，可以在mounted内部使用vm.$nextTick。
- beforeUpdate -> onBeforeUpdate
  - 在数据发生改变后，DOM被更新之前调用。这里适合在现有DOM将要被更新之前访问它，比如移除手动添加的事件监听器。
- updated -> onUpdated
  - 在数据更改导致的虚拟DOM重新渲染和更新完毕之后被调用。当这个钩子被调用时，组件DOM已经更新，所以你现在可以执行依赖于DOM的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性和侦听器取而代之。注意，updated不会保证所有的子组件也都被重新渲染完毕。如果你希望等待整个视图都渲染完毕，可以在updated内部使用vm.$nextTick
- beforeUnmounte -> onBeforeUnmount
  - 在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的
  
- unmounted -> onUnmounted
  - 卸载组件实例后调用。调用此钩子时，组件实例的所有指令被移除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。
  
- errorCaptured -> onErrorCaptured
  - 在捕获一个来自后代组件的错误时被调用。此钩子会受到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回false以阻止该错误继续向上传播

- renderTriggered -> onRenderTriggered
  - 当虚拟DOM重新渲染被触发时调用。和renderTracked类似，接收debugger event 作为参数。此事件告诉你是什么操作触发了重新渲染，以及改操作的目标对象和键。

- activated -> onActivated
  - 被keep-alive缓存的组件激活时调用

- deactivated -> onDeactivated
  - 被keep-alive缓存的组件失活时调用

```javascript
// 钩子使用
import {onBeforeMount}from '@vue/composition-api'

export default {
  setup() {
    onBeforeMount(() => {
      console.log('onBeforeMount')
    })
  }
}
```
### 1. 生命周期钩子函数的调用
```javascript
// onBeforeMount onMounted
import {ref, onBeforeMount, onMounted}from '@vue/composition-api'
export default {
  // 组合API
  setup() {
    const capacity = ref(3);
    const root = ref(null)
    console.log(capacity.value)
    console.log('setup')

    onBeforeMount(() => {
      console.log('onBeforeMount: '+ capacity.value +', root: '+root.value)
    })

    console.log('after onBeforeMount');

    onMounted(() => {
      console.log('onMounted: '+ capacity.value +', root: '+root.value)
    })

    return {capacity}
  },

  // 选项API
  beforeMount() {
    console.log('beforeMount: '+this.$el)
  },
  mounted() {
    console.log('mounted: '+this.$el)
  }
}
/**
3
setup
after onBeforeMount
beforeMount: undefined
onBeforeMount: 3, root: null
mounted: [object HTMLDivElement]
onMounted: 3, root: null
*/
```

### 2. onRenderTracked() 状态跟踪
跟踪页面上所有的方法跟变量，也就是我们return返回的属性与方法，它都会进行跟踪。当页面有update时，会生成一个event对象。我们可以通过这个event对象查看程序的问题所在。

### 3. onRenderTriggered() 状态触发
它不会跟踪每一个值，而是给你变化值的信息，并且新值和旧值都会给你明确的展示出来。

## computed


## watch
```javascript
// 侦听器写法
<div id="app">
  复合关键字的活动的数目：{{results}}
</div>

import { ref, watch } from '@vue/composition-api';
import eventApi from '@/api/event.js'

export default {
  setup(){
    const searchInput = ref('');
    const results = ref(0);

    // setup 函数底下的getEventCount()方法只触发一次
    // 不能实时监听，所以用watch侦听
    results.value = eventApi.getEventCount(searchInput.value)

    // 侦听searchInput属性，若发生改变执行右侧箭头函数
    watch(searchInput,(newValue, oldValue)=>{
      results.value = eventApi.getEventCount(searchInput.value)
    })

    // 多属性数据写法
    watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast])=>{
      //...
    })

    return{ searchInput, results }
  }
}
```
