---
autoGroup-4: Vue3
sidebarDepth: 3
title: 2. Vue 组合式 API
---

## setup

`setup` 函数是一个新的组件选项。作为在组件内使用 Composition API 的入口点。

+ 调用时机

  创建组件实例，然后初始化 `props`，紧接着就调用 `setup` 函数。从生命周期钩子的视角来看，它会在 `beforeCreate` 钩子之前被调用。

+ 模板中使用

  如果 `setup` 返回一个对象，则对象的属性将会被合并到组件模板的渲染上下文：

  ```vue
  <template>
  	<div>
      {{ count }} {{ object.foo }}
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue'
    
  export default {
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'bar' })
      
      // 暴露给模板
      return {
        count,
        object
      }
    }
  }
  </script>
  ```

  注意 `setup` 返回的 ref 在模板中会自动解开，不需要写 `.value`。

+ 渲染函数/JSX 中使用

  `setup` 也可以返回一个函数，函数中也能使用当前 `setup` 函数作用域中的响应式数据：

  ```js
  import { h, ref, reactive } from 'vue'
  
  export default {
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'bar' })
      
      return () => h('div', [count.value, object.foo])
    }
  }
  ```

+ 参数

  该函数接收 `props` 作为其第一个参数：

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      console.log(props.name)
    }
  }
  ```

  注意 `props` 对象是响应式的，`watchEffect` 或 `watch` 会观察和响应 `props` 的更新：

  ```js
  export default {
    props: {
  		name: String
    },
    setup(props) {
      // 在组件初始化和更新的时候都会执行
      watchEffect(() => {
        console.log(`name is: ` + props.name)
      })

      // 仅变化的时候打印
      watch(()=>{
        // 监听的值
        return props.name
      }, (newValue)=>{
        // 打印出改变后的值
        console.log(newValue)
      })
    }
  }
  ```

  然而不要解构 `props` 对象，那样会使其失去响应性：

  ```js
  export default {
    props: {
  		name: String
    },
    // 1. 不要这样解构，失去响应式
    setup({ name }) {
      // 2. 也不要这样解构，会失去响应式
        const {name} = props;

      watchEffect(() => {
        console.log(`name is: ` + name) // Will not be reactive!
      })
    }
  }
  ```

  在开发过程中，`props` 对象对用户空间代码是不可变的（用户代码尝试修改 `props` 时触发警告）。
  ```javascript
  export default {
    name: 'Test',
    props: {
        name: String
    },
    setup(props){
        // 不能修改
        props.name = 'vue'; 
        // Set operation on key "name" failed: target is readonly
    }
  }
  ```

  第二个参数提供了一个上下文对象，从原来 2.x 中 `this` 选择性地暴露了一些 property。

  ```js
  const MyComponent = {
    setup(props, context) {
      context.attrs
      context.slots
      context.emit
      console.log(context);
    /**
      attrs: (...)
      emit: (...)
      expose: exposed => {…}
      slots: (...)
     */

    }
  }
  ```

  `attrs` 和 `slots` 都是内部组件实例上对应项的代理，可以确保在更新后仍然是最新值。所以可以被解构，无需担心后面访问到过期的值：

  ```js
  const MyComponent = {
    setup(props, { attrs, emit }) {
      // 一个可能之后回调用的签名
      function onClick() {
        console.log(attrs.foo) // 一定是最新的引用，没有丢失响应性
      }
    }
  }
  ```

  emit使用：    
  子组件Test.vue
  ```vue 
    <template>
        <h1>{{count}}</h1>
        <button @click="plus">增加</button>
    </template>

    <script>
    export default {
        name: 'Test',
        emits: ['plus'],
        props: {
            count: Number
        },
        setup(props, ctx){
            const plus = ()=>{
                // 发送自定义事件plus给父组件
                ctx.emit('plus', 100); // 就是vue2.0中的this.emit方法
            }
            return{
                plus
            }
        }
    }
    
    </script>

  ```
  父组件App.vue
  ```vue
  
    <template>
        <!--@plus 自定义事件-->
        <Test :count="count" @plus="plus"/>
    </template>

    <script>
    import {h, ref} from 'vue'
    import Test from '@/components/Test.vue'

    export default {
        name: 'App',
        components: {
            Test
        },
        setup(props, context){
            const count = ref(0);
            
            const plus = (num)=>{
            count.value += num;
            }
            
            return{
            // 视图上面用到的方法和数据都需要返回
            count, plus
            }
        }
    }
    </script>
  ```
  
  出于一些原因将 `props` 作为第一个参数，而不是包含在上下文中：

  - 组件使用 `props` 的场景更多，有时候甚至只使用 `props`
  - 将 `props` 独立出来作为第一个参数，可以让 TypeScript 对 `props` 单独做类型推导，不会和上下文中的其他属性想混淆。这也使得 `setup`、`render` 和其他使用了 TSX 的函数式组件的签名保持一致。

+ `this` 的用法

  `this` 在 `setup()` 中不可用。由于 `setup()` 在解析 2.x 选项前被调用，`setup()` 中的 `this` 将与 2.x 选项中的 `this` 完全不同。同时在 `setup()` 和 2.x 选项中使用 `this` 时将造成混乱。在 `setup()` 中避免这种情况的另一个原因是：这对于初学者来说，混淆这两种情况的 `this` 是非常常见的错误：

  ```js
  setup() {
    function onClick() {
      this // 这里 `this` 与你期望的不一样！
    }
  }
  ```

+ 类型定义

  ```js
  interface Data {
    [key: string]: unknown
  }
  
  interface SetupContext {
    attrs: Data
    slots: Slots
    emit: (event: string, ...args: unknown[]) => void
  }
  
  function setup(props: Data, context: SetupContext): Data
  ```

  ::: tip 提示

  为了获得传递给 `setup()` 参数的类型推断，需要使用 `defineComponent`。

  :::



## 响应式系统 API

### 1. reactive

接收一个普通对象然后返回该普通对象的响应式代理。等同于 2.x 的 `Vue.observable()`：

```js
const obj = reactive({ count: 0 })
```

响应式转换是 “深层的”：会影响对象内部所有嵌套的属性。基于 ES2015 的 Proxy 实现，返回的代理对象不等于原始对象。建议仅使用代理对象而避免依赖原始对象。

+ 类型定义

  ```js
  function reactive<T extends object>(raw: T): T
  ```

### 2. ref

接受一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性 `.value`。

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

如果传入 ref 的是一个对象，将调用 `reactive` 方法进行深层响应转换。

+ 模板中访问

  当 ref 作为渲染上下文的属性返回（即在 `setup()` 返回的的对象中）并在模板中使用时，它会自动解套，无需在模板内额外书写 `.value`：

  ```vue
  <template>
    <div>{{ count }}</div>
  </template>
  
  <script>
  export default {
    setup() {
      return {
        count: ref(0)
      }
    }
  }
  </script>
  ```

+ 作为响应式对象的属性访问

  当 ref 作为 reactive 对象的 property 被访问或修改时，也将自动解套 value 值，其行为类似普通属性：

  ```js
  const count = ref(0)
  const state = reactive({ count })
  
  console.log(state.count) // 0
  
  state.count = 1
  console.log(state.value) // 1
  ```

  注意如果将一个新的 ref 分配给出现有 ref，将替换旧的 ref：

  ```js
  const otherCount = ref(2)
  
  state.count = otherCount
  console.log(state.count) // 2
  console.log(count.value) // 1
  ```

  注意当嵌套在 reactive `Object` 中时，ref 才会解套。从 `Array` 或者 `Map` 等原生集合类中访问 ref 时，不会自动解套：

  ```js
  const arr = reactive([ref(0)])
  // 这里需要 .value
  console.log(arr[0].value)
  
  const map = reactive(new Map([['foo', ref(0)]]))
  // 这里需要 .value
  console.log(map.get('foo').value)
  ```

+ 类型定义

  ```tsx
  interface Ref<T> {
  	value: T
  }
  
  function ref<T>(value: T): Ref<T>
  ```

  有时我们可能需要为 ref 做一个较为复杂的类型标注。我们可以通过在调用 `ref` 时传递泛型参数来覆盖默认推导：

  ```js
  const foo = ref<string | number>('foo') // foo 的类型: Ref<string | number>
  
  foo.value = 123 // 能够通过！
  ```

### 3. computed

传入一个 getter 函数，返回一个默认不可手动修改的 ref 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误！
```

或者传入一个拥有 `get` 和 `set` 函数的对象，创建一个可手动修改的计算状态。

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

+ 类型定义

  ```js
  // 只读的
  function computed<T>(getter: () => T): Readonly<Ref<Readonly<T>>>
  
  // 可更改的
  function computed<T>(options: {
    get: () => T
    set: (value: T) => void
  }): Ref<T>
  ```

### 4. readonly

传入一个对象（响应式或普通）或 ref，返回一个原始对象的只读代理。一个只读的代理是 “深层” 的，对象内部任何嵌套的属性也都是只读的。

```js
const original = reactive({ count: 0 })
const copy = readonly(original)

watchEffect(() => {
  // 依赖追踪
  console.log(copy.count)
})

// original 上的修改会触发 copy 上的侦听
original.count++

// 无法修改 copy 并会被警告
copy.count++ // warning!
```

### 5. watchEffect

立即执行传入的一个函数，并响应式跟踪其依赖，并在其依赖变更时重新运行该函数。

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> 0

setTimeout(() => {
  count.value++
  // -> 1
}, 100)
```

#### 5.1 停止侦听

当 `watchEffect` 在组件的 `setup()` 函数或生命周期钩子被调用时，侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。

在一些情况下，也可以显式调用返回值以停止侦听：

```js
const stop = watchEffect(() => {
  /* ... */
})

// 之后
stop()
```

#### 5.2 清除副作用

有时副作用函数会执行一些异步的副作用，这些响应需要在其失效时清除（即完成之前状态已改变了）。所以侦听副作用传入的函数可以接收一个 `onInvalidate` 函数作入参，用来注册清理失效时的回调。当以下情况发生时，这个失效回调会被触发：

+ 副作用即将重新执行时
+ 侦听器被停止（如果在 `setup()` 或生命周期钩子中使用了 `watchEffect`，则在卸载组件时）

```js
watchEffect((onInvalidate) => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id 改变时 或 停止侦听时
    // 取消之前的异步操作
    token.cancel()
  })
})
```

我们之所以是通过传入一个函数去注册失效回调，而不是从回调返回它（如 React `useEffect` 中的方式），是因为返回值对于异步错误处理很重要。

在执行数据请求时，副作用函数往往是一个异步函数：

```js
const data = ref(null)
watchEffect(async () => {
  data.value = await fetchData(props.id)
})
```

我们知道异步函数都会隐式地返回一个 Promise，但是清理函数必须要在 Promise 被 resolve 之前被注册。另外，Vue 依赖这个返回的 Promise 来自动处理 Promise 链上的潜在错误。

#### 5.3 副作用刷新时机

Vue 的响应式系统会缓存副作用函数，并异步地刷新它们，这样可以避免同一个 tick 中多个状态改变导致不必要的重复调用，在核心的具体实现中，组件的更新函数也是一个被侦听的副作用。当一个用户定义的副作用函数进入队列时，会在所有的组件更新后执行：

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  setup() {
    const count = ref(0)

    watchEffect(() => {
      console.log(count.value)
    })

    return {
      count
    }
  }
}
</script>
```

在这个例子中：

+ `count` 会在初始运行时同步打印出来
+ 更改 `count` 时，将在组件更新后执行副作用

请注意，初始化运行是在组件 `mounted` 之前执行的。因此，如果你希望在编写副作用函数时访问 DOM（或模板 ref），请在 `onMounted` 钩子中进行：

```js
onMounted(() => {
  watchEffect(() => {
    // 在这里可以访问到 DOM 或者 template refs
  })
})
```

如果副作用需要同步或在组件更新之前重新运行，我们可以传递一个拥有 `flush` 属性的对象作为选项（默认为 `'post'`）：

```js
// 同步执行
watchEffect(
	() => {
    //
  },
  {
    flush: 'sync'
  }
)

// 组件更新前执行
watchEffect(
	() => {
    //
  },
  {
    flush: 'pre'
  }
)
```

#### 5.4 侦听器调试

`onTrack` 和 `onTrigger` 选项可用于调试一个侦听器的行为。

+ 当一个 reactive 对象熟悉或一个 ref 作为依赖被追踪时，将调用 `onTrack`
+ 依赖项变更导致副作用被触发时，将调用 `onTrigger`

这两个回调都将接收到一个包含有关依赖项信息的调试器事件。建议在以下回调中编写 `debugger` 语句来检查依赖关系：

```js
watchEffect(
  () => {
    /* 副作用的内容 */
  },
  {
    onTrigger(e) {
      debugger
    },
  }
)
```

`onTrack` 和 `onTrigger` 仅在开发模式下生效。

#### 5.5 类型定义

```js
function watchEffect(
  effect: (onInvalidate: InvalidateCbRegistrator) => void,
  options?: WatchEffectOptions
): StopHandle

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}

type InvalidateCbRegistrator = (invalidate: () => void) => void

type StopHandle = () => void
```

### 6. watch

`watch` API 完全等效于 2.x `this.$watch`（以及 `watch` 中相应的选项）。`watch` 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行，也就是说仅在侦听的源变更时才执行回调。

对比 `watchEffect`，`watch` 允许我们：

+ 懒执行副作用
+ 更明确哪些状态的改变会触发侦听器重新运行副作用
+ 访问侦听状态变化前后的值

#### 6.1 侦听单个数据源

侦听器的数据源可以是一个拥有返回值的 getter 函数，也可以是 ref：

```js
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
	() => state.count,
  (count, prevCount) => {
    //
  }
)

// 侦听一个 ref
const count = ref(0)
watch(count, (count, prevCount) => {
  //
})
```

#### 6.2 侦听多个数据源

`watcher` 也可以使用数组来同时侦听多个源：

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

#### 6.3 与 watchEffect 共享的行为

watch 和 watchEffect 在停止侦听，清除副作用、副作用刷新时机和侦听器调试等方面行为一致。

#### 6.4 类型定义

```tsx
// 侦听单数据源
function watch<T>(
	source: WatcherSource<T>,
  callback: (
  	value: T,
   	oldValue: T,
   	onInvalidate: InvalidateCbRegistrator
  ) => void,
  options?: WatchOptions 
): StopHandle

// 侦听多数据源
function watch<T extends WatcherSource<unknown>[]>(
	sources: T,
  callback: (
  	values: MapSources<T>,
    oldValues: MapSources<T>,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options?: WatchOptions
): StopHanle

type WatcherSource<T> = Ref<T> | (() => T)

type MapSources<T> = {
  [k in keyof T]: T[K] extends WatcherSource<infer V> ? V : never
}

// 共有的属性 请查看 `watchEffect` 的类型定义
interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // default: false
  deep?: boolean
}
```



## 生命周期钩子函数

可以直接导入 `onXXX` 一族的函数来注册生命周期钩子：

```js
import { onMounted, onUpdated, onUnmounted, getCurrentInstance } from 'vue'

const MyComponent = {
  setup() {
    // 获取当前组件实例的方法
    const instance = getCurrentInstance();
    console.log(instance)

    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  }
}
```

这些生命周期钩子注册函数只能在 `setup()` 期间同步使用，因为它们依赖于内部的全局状态来定位当前组件实例（正在调用 `setup()` 的组件实例），不再当前组件下调用这些函数会抛出一个错误。

组件实例上下文也是在生命周期钩子同步执行期间设置的，因此，在卸载组件时，在生命周期钩子内部同步创建的侦听器和计算状态也将自动删除。

### 1. 与 2.x 版本生命周期对应的组合式 API

+ ~~`beforeCreate`~~ -> 使用 `setup()`
+ ~~`created`~~ -> 使用 `setup()`
+ `beforeMount` -> `onBeforeMount`
+ `mounted` -> `onMounted`
+ `beforeUpdate` -> `onBeforeUpdate`
+ `updated` -> `onUpdated`
+ `beforeDestroy` -> `onBeforeUnmount`
+ `destroyed` -> `onUnmounted`
+ `errorCaptured` -> `onErrorCaptured`

```javascript
import {
  ref,
  watchEffect,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
} from "vue";


export default {
  name: "App",
  setup() {
    const count = ref(0);
    setTimeout(() => {
      count.value = 1;
    }, 2000);

    // 这里会同步执行。所以首次渲染时，setup在watchEffect的前面打印
    console.log("setup");

    watchEffect(() => {
      const a = count.value;
      console.log(a);
      console.log("watchEffect");
    });

    // watchEffect会在onBeforeMounted前打印
    onBeforeMount(() => {
      console.log("onBeforeMount");
    });

    onMounted(() => {
      console.log("onMounted");
    });

    // 数据发生改变，watchEffect在onBeforeUpdate前打印
    onBeforeUpdate(() => {
      console.log("onBeforeUpdate");
    });

    onUpdated(() => {
      console.log("onUpdated");
    });

    return {
      count,
    };
  },
};
/**
 * setup
 * 0
 * watchEffect
 * onBeforeMount
 * onMounted
 * 1
 * watchEffect
 * onBeforeUpdate
 * onUpdated
*/
```
修改watchEffect相关参数
```javascript
watchEffect(
  () => {
    const a = count.value;
    console.log(a);
    console.log("watchEffect");
  },
  {
    flush: "post", // 会是watchEffect在onBeforeMounte之后执行
  }
);
/**
 * setup
 * 0
 * onBeforeMount
 * watchEffect
 * onMounted
 * 1
 * onBeforeUpdate
 * watchEffect
 * onUpdated
*/
```


### 2. 新增的钩子函数

除了和 2.x 生命周期等效项之外，组合式 API 还提供了以下调试钩子函数：

+ `onRenderTracked`
+ `onRenderTriggered`

两个钩子函数都接收一个 `DebuggerEvent`，与 `watchEffect` 参数选项中的 `onTrack` 和 `onTrigger` 类似：

```js
export default {
  onRenderTriggered(e) {
    debugger
    // 检查哪个依赖性导致组件重新渲染
  }
}
```



## 依赖注入

`provide` 和 `inject` 提供依赖注入，功能类似 2.x 的 `provide/inject`。两者都只能在当前活动组件实例的 `setup()` 函数中调用。

```js
import { provide, inject } from 'vue'

const ThemeSymbol = Symbol()

const Ancestor = {
	setup() {
    provide(ThemeSymbol, 'dark')
  }
}

const Descendent = {
  setup() {
    const theme = inject(ThemeSymbol, 'light')
    
    return {
      theme
    }
  }
}
```

`inject` 接受一个可选的默认值作为第二个参数。如果未提供默认值，并且在 `provide` 上下文中未找到该属性，则 `inject` 返回 `undefined`。

### 1. 注入的响应性

可以使用 `ref` 来保证 `provid` 和 `inject` 之间值的响应：

```js
// 提供者：
const themeRef = ref('dark')
provide(ThemeSymbol, themeRef)

// 使用者：
const theme = inject(ThemeSymbol, ref('light'))
watchEffect(() => {
  console.log(`theme set to: ${theme.value}`)
})
```

如果注入一个响应式对象，则它的状态变化也可以被侦听。

### 2. 类型定义

```tsx
interface InjectionKey<T> extends Symbol {}

function provide<T>(key: InjectionKey<T> | string, value: T): void

// 未传，使用缺省值
function inject<T>(key: InjectionKey<T> | string): T | undefined
// 传入了默认值
function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
```

Vue 提供了一个继承 `Symbol` 的 `InjectionKey` 接口。它可用于在提供者和消费者之间同步注入值的类型：

```tsx
import { InjectionKey, provide, inject } from 'vue'

const key: InjecttionKey<string> = Symbol()

provide(key, 'foo') // 类型不是 string 会报错

const foo = inject(key) // foo 的类型：string | undefined
```

如果使用字符串作为键或没有定义类型的符号，则需要显式地声明注入值的类型：

```tsx
const foo = inject<string>('foo') // string | undefined
```



## 模板 Refs

当使用组合式 API 时，reactive refs 和 template refs 的概念已经是统一的。为了获得对模板内元素或组件实例的引用，我们可以像往常一样在 `setup()` 中声明一个 ref 并返回它：

```vue
<template>
	<div ref="root"></div>
</template>

<script>
import { ref, onMounted } from 'vue'
  
export default {
  setup() {
    const root = ref(null)
    
    onMounted(() => {
      // 在渲染完成后，这个 div DOM 会被赋值给 root ref 对象
      console.log(root.value) // <div>
    })
    
    return { root }
  }
}
</script>
```

这里我们将 `root` 暴露在渲染上下文中，并通过 `ref="root"` 绑定到 `div` 作为其 `ref`。在 Virtual DOM patch 算法中，如果一个 VNode 的 `ref` 对应一个渲染上下文中的 `ref`，则该 VNode 对应的元素或组件实例将被分配给该 ref。这是在 Virtual DOM 的 mount/patch 过程中执行的，因此模板 ref 仅在渲染初始化后才能访问。

ref 被用在模板中时和其他 ref 一样：都是响应式的，并可以传递进组合函数（或从其中返回）。

### 1. 配合 render/JSX

```jsx
export default {
  setup() {
    const root = ref(null)
    
    return () => h(
    	'div',
      {
        ref: root
      }
    )
    
    // JSX
    return () => <div ref={root} />
  }
}
```

### 2. v-for 中使用

模板 ref 在 `v-for` 中使用 vue 没有做特殊处理，需要使用函数型的 ref（3.0 提供的新功能）来自定义处理方式：

```vue
<template>
	<div v-for="(item, i) in list" :ref="el => { divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
import { ref, reactive, onBeforeUpdate } from 'vue'
  
export default {
  setup() {
    const list = reactive([1, 2, 3])
    const divs = ref([])
    
    // 确保在每次变更之前重置引用
    onBeforeUpdate(() => {
      divs.value = []
    })

    return {
      list,
      divs
    }
  }
}
</script>
```



## 响应式系统工具集

### 1. unref

如果参数是一个 ref 则返回它的 `value`，否则返回参数本身。它是 `value = isRef(val) ? val.value ? val` 的语法糖。

```tsx
function useFoo(x: number | Ref<number>) {
	const unerapped = unref(x) // unwrapped 一定是 number 类型
}
```

### 2. toRef

`toRef` 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

当您要将一个 prop 中的属性作为 ref 传递给组合逻辑函数时，`toRef` 就派上了用场：

```js
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  }
}
```

### 3. toRefs

把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref，和响应式对象 property 一一对应。

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const stateAsRefs = toRefs(state)

/*
stateAsRefs 的类型如下:
{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 对象 与 原属性的引用是 "链接" 上的
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

想要从一个组合逻辑函数中返回响应式对象时，用 `toRefs` 是很有效的，该 API 让消费者组件可以 解构/扩展（使用 `...` 操作符）返回的对象，并不会丢失响应性：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })
  
  return toRefs(state)
}

export default {
  setup() {
    // 可以解构，且不会丢失响应性
    const { foo, bar } = useFeatureX()
    
    return {
      foo,
      bar
    }
  }
}
```

### 4. isRef

检查一个值是否为一个 ref 对象。

### 5. isProxy

检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理。

### 6. isReactive

检查一个对象是否由 `reactive` 创建的响应式代理。

如果这个代理是由 `readonly` 创建的，但是又被 `reactive` 创建的另一个代理包裹了一层，那么同样也会返回 `true`。

### 7. isReadonly

检查一个对象是否是由 `readonly` 创建的只读代理。



## 高级响应式系统 API

### 1. customRef

`customRef` 用于自定义一个 `ref`，可以显式地控制以来追踪和触发响应，接受一个工厂函数，两个参数分别是用于追踪 `track` 与用于触发响应的 `trigger`，并返回一个带有 `get` 和 `set` 属性的对象。

+ 使用自定义 ref 实现带防抖功能的 `v-model`

  ```vue
  <template>
  	<input v-model="text" />
  </template>
  
  <script>
  function useDebouncedRef(value, delay = 200) {
    let timeout
    return costomRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  </script>
  ```

+ 类型定义

  ```tsx
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>
  
  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

### 2. markRaw

显式标记一个对象为 “永远不会转为响应式代理”，函数返回这个对象本身。

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 如果被 markRaw 标记了，即使在响应式对象中作属性，也依然不是响应式的
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

### 3. shallowReactive

只为某个对象的私有（第一层）属性创建浅层的响应式代理，不会对 “属性的属性” 做深层次、递归地响应式代理，而只是保留原样。

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 变更 state 的自有属性是响应式的
state.foo++
// ...但不会深层代理
isReactive(state.nested) // false
state.nested.bar++ // 非响应式
```

### 4. shallowReadonly

只为某个对象的自有（第一层）属性创建浅层的**只读**响应式代理，同样也不会做深层次、递归地代理，深层次的属性并不是只读的。

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 变更 state 的自有属性会失败
state.foo++
// ...但是嵌套的对象是可以变更的
isReadonly(state.nested) // false
state.nested.bar++ // 嵌套属性依然可修改
```

### 5. shallowRef

创建一个 ref，将会跟踪它的 `.value` 更改操作，但是并不会的对变更后的 `.value` 做响应式转换代理（即变更不会调用 `reactive`）。

```js
const foo = shallowRef({})
// 更改对操作会触发响应
foo.value = {}
// 但上面新赋的这个对象并不会变为响应式对象
isReactive(foo.value) // false
```

### 6. toRaw

返回由 `reactive` 或 `readonly` 方法转换成响应式代理的普通对象。这是一个还原方法，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发更改。不建议一直持有原始对象的引用。请谨慎使用。

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```



