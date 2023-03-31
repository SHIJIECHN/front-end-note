---
autoGroup-3: 源码专题
sidebarDepth: 3
title:  4. 组件间通信方式
---

## 组件间通信方式分类
1. 父子组件之间的通信
2. 兄弟组件之间的通信
3. 祖孙与后代组件之间的通信
4. 非关系组件间之间的通信

关系图：
<img :src="$withBase('/framework/Vue/communication.png')" alt="communication" />

## 组件间通信的方案
8中常规的通信方案：
1. 通过props传递
2. 通过$emit触发自定义事件
3. 使用ref
4. EventBus
5. $parent 或 $root
6. attrs 与 listens
7. Provide 与 Inject
8. Vuex

## 1. props
- 使用场景：父组件传递数据给子组件
- 子组件设置props属性，定义接收父组件传递过来的参数
- 父组件在使用子组件标签通过字面量来传递值

Child.vue
```vue
<template>
  <div>{{name}} - {{age}}</div>
</template>

<script>
export default {
    props: {
        // 字符串形式
        name: String, // 接收的类型参数
        // 对象形式
        age: {
            type: Number, // 接收的类型为数值
            default: 18, // 默认值为18
            require: true  // age属性必须传递
        }
    }
}
</script>
```

Parent.vue
```vue
<template>
  <div id="app">
    <child name="Tom" :age="20"/>
  </div>
</template>

<script>
import Child from './views/Child.vue'

export default {
  name: 'App',
  components: {
    Child
  }
}
</script>
```

注意：age参数前要加冒号，否咋会报错:
```makefile
Invalid prop: type check failed for prop "age". Expected Number with value 20, got String with value "20".
```
## 2. $emit触发自定义事件
- 适用场景：子组件传递数据给父组件
- 子组件通过$emit触发自定义事件，$emit第二个参数为传递的数值
- 父组件绑定监听器获取到子组件传递过来的参数
Child.vue
```vue
<template>
  <div>
      <button @click="addNum">+1</button>
  </div>
  
</template>

<script>
export default {
    data(){
        return {
            a: 0
        }
    },
    methods: {
        addNum(){
            this.a = this.a + 1
            this.$emit('add', this.a)
        }
    }
}
</script>
```
Parent.vue
```vue
<template>
  <div id="app">
    parent
    <child @add="carAdd($event)"/>
  </div>
</template>

<script>
import Child from './views/Child.vue'

export default {
  name: 'App',
  components: {
    Child
  },
  methods: {
    carAdd(e){ 
      console.log(e); // 1
    }
  }
}
</script>
```


## 3. ref
- 父组件在使用子组件的时候设置ref
- 父组件通过设置子组件的ref来获取数据

Child.vue
```vue
<script>
export default {
    data(){
        return {
            name: 'Child.vue'
        }
    },
    methods: {
        sayHello(){
            console.log('hello')
        }
    } 
}
</script>
```

Parent.vue
```vue
<template>
  <div id="app">
    <child ref="foo" />
  </div>
</template>

<script>
import Child from './views/Child.vue'

export default {
  name: 'App',
  components: {
    Child
  },
  mounted(){
    const child = this.$refs.foo;
    console.log(child); // child.vue 组件实例
    console.log(child.name); // Child.vue
    child.sayHello(); // hello
  }
}
</script>
```
this.$refs.foo  获取子组件实例，通过子组件实例我们就能拿到对应的数据。

## 4. EventBus
- 使用场景：兄弟组件传值
- 创建一个中央事件总线
- 兄弟组件通过$emit触发自定义事件，$emit第二个参数为传递的数值
- 另一个兄弟组件通过$on监听自定义事件

缺点：当项目较大，就容易造成难以维护。

### 创建event-bus.js
```js
class Bus {
    constructor() {
        this.callbacks = {};
    }

    $on(name, fn) {
        this.callbacks[name] = this.callbacks[name] || [];
        this.callbacks[name].push(fn);
    }

    $emit(name, args) {
        if (this.callbacks[name]) {
            this.callbacks[name].forEach(cb => cb(args))
        }
    }
}


export const EventBus = new Bus();
// 也可以用下面的方式： Vue 已经实现了Bus的功能
import Vue from 'vue'
export const EventBus = new Vue();

```

两个组件AdditionNum和ShowNum，可以是兄弟组件也可以是父子组件，这里使用兄弟组件。

### 触发事件
Parent.vue
```vue
<template>
  <div id="app">
    <addition-num></addition-num>
    <show-num></show-num>
  </div>
</template>

<script>
import AdditionNum from './views/AdditionNum.vue'
import ShowNum from './views/ShowNum.vue'

export default {
  name: 'App',
  components: {
    AdditionNum,
    ShowNum
  }
}
</script>
```
AdditionNum.vue
```vue
<template>
  <button @click="additionHandle">+1</button>
</template>

<script>
import {EventBus} from '../event-bus.js'
console.log(EventBus);
export default {
    name: 'AdditionNum',
    data(){
        return {
            num: 1
        }
    },
    methods: {
        additionHandle(){
            // 触发事件
            EventBus.$emit('addition', {
                num: this.num++
            })
        }
    }
}
</script>
```

### 监听事件
ShowNum.vue
```vue
<template>
  <div>计算和: {{count}}</div>
</template>

<script>
import {EventBus} from '../event-bus.js'
export default {
    name: 'ShowNUm',
    data(){
        return {
            count: 0
        }
    },
    mounted(){
        // 监听事件
        EventBus.$on('addition', param => {
            this.count = this.count + param.num;
        })
    }
}
</script>
```

### 移除事件监听
```js 
import { EventBus } from 'event-bus.js'
EventBus.$off('addition', {})
```

## 5. $children / $parent
适用场景：父子组件    

Parent.vue
```vue 
<template>
  <div id="app">
    <div>{{msg}}</div>
    <child></child>
    <button @click="changeA">点击改变了组件的值</button>
  </div>
</template>

<script>
import Child from './views/Child.vue'

export default {
  name: 'App',
  components: {
    Child
  },
  data(){
    return {
      msg: 'welcome'
    }
  },
  methods: {
    changeA(){
      this.$children[0].messageA = 'this is new value'
    }
  }
}
</script>
```

Child.vue
```vue
<template>
  <div>
      <span>{{messageA}}</span>
      <p>获取父组件的值为: {{parentVal}}</p>
  </div> 
</template>

<script>
export default {
    data(){
        return {
            messageA: 'Child.vue'
        }
    },
    computed: {
        parentVal(){
            return this.$parent.msg;
        }
    } 
}
</script>
```

## 6. $attrs / $listens
- 适用场景：祖先传递数据给子孙
- 设置批量向下传属性$attrs和$listeners
- $attrs: 包含了父级作用域中不作为prop被识别（且获取）的特定绑定（class和style除外）。可以通过v-bind="$attrs"传入内部组件。
- $listeners: 包含父作用域中的（不含.native修饰符）v-on事件监听器。它可以通过v-on="$listeners"传入内部组件

Parent.vue
```vue
<template>
  <div id="app">
    <child1
      :name="name"
      :age="age"
      :gender="gender"
      :height="height"
      title="标题"
    ></child1>
  </div>
</template>

<script>
import Child1 from './views/Child1.vue'

export default {
  name: 'App',
  components: {
    Child1
  },
  data(){
    return {
      name: 'shi',
      age: "18",
      gender: '女',
      height: "160"
    }
  }
}
</script>
```

Child1.vue
```vue
<template>
  <div>
      <p>{{name}}</p>
      <p>child的$attrs: {{$attrs}}</p>
      <child2 v-bind="$attrs"></child2>
  </div>
  
</template>

<script>
import Child2 from './Child2.vue'
export default {
    components: {
        Child2
    },
    // 可以关闭自动挂载到组件根元素上的没有在props声明的属性
    inheritAttrs: false, 
    props: {
        name: String // name 作为props属性绑定
    },
    created(){
        console.log(this.$attrs);
        // { "age": "18", "gender": "女", "height": "160", "title": "标题" }
    } 
}
</script>
```

Child2.vue
```vue
<template>
  <div>
      <p>age: {{age}}</p>
      <p>child2: {{$attrs}}</p>
  </div>
</template>

<script>
export default {
    inheritAttrs: false,
    props: {
        age: String
    },
    created(){
        console.log(this.$attrs);
        // {gender: '女', height: '160', title: '标题'}
    }
}
</script>
```

## 7. Provide 与 Inject
父组件中通过provide来提供变量，然后在子组件中通过inject来注入变量。

> 不论组件嵌套多深，只要调用看inject那么就可以注入provide中的数据，而不局限于只能从当前父组件的props属性中拿数据。

Parent.vue
```vue
<template>
  <div id="app">
    <p>Parent</p>
    <child></child>
  </div>
</template>

<script>
import Child from './views/Child.vue'

export default {
  name: 'Parent',
  components: {
    Child
  },
  provide: {
    foo: 'demo Parent'
  }
}
</script>
```

Child.vue
```vue
<template>
  <div>
      <hr />
      <p>Child</p>
      <p>{{demo}}</p>
      <grandson></grandson>
  </div>
  
</template>

<script>
import Grandson from './Grandson.vue'
export default {
    name: 'Child',
    components: {
        Grandson
    },
    inject: ['foo'],
    data(){
        return{
            demo: this.foo
        }
    }
}
</script>
```

Grandson.vue
```vue
<template>
  <div>
      <hr/>
      <p>Grandson</p>
      <p>{{demo}}</p>
  </div>
</template>

<script>
export default {
    inject:['foo'],
    data(){
        return {
            demo: this.foo
        }
    }
}
</script>
```
需要注意的是：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的


## 8. Vuex
- 使用场景：复杂关系的组件数据传递
- Vuex作用相当于一个用来存储共享变量的容器

1. state：用于数据的存储，是store中的唯一数据源
2. getters：如vue中的计算属性一样，基于state数据的二次包装，常用于数据的筛选和多个数据的相关性计算
3. mutations：类似函数，改变state数据的唯一途径，且不能用于处理异步事件
4. actions：类似于mutation，用于提交mutation来改变状态，而不直接变更状态，可以包含任意异步操作
5. modules：类似于命名空间，用于项目中将各个模块的状态分开定义和操作，便于维护

> vuex可以结合localStorage / sessionStorage，实现数据的持久保存,同时使用vuex解决数据和状态混乱问题.

## 总结
- 父子组件通信: props; $parent / $children; provide / inject ; ref ; $attrs / $listeners
- 兄弟组件通信: eventBus ; vuex
- 跨级通信: eventBus；Vuex；provide / inject 、$attrs / $listeners

