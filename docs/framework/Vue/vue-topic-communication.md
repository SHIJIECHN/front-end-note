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

### 1. props
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
```
注意：age参数前要加冒号，否咋会报错:
```makefile
Invalid prop: type check failed for prop "age". Expected Number with value 20, got String with value "20".
```
### 2. $emit触发自定义事件
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


### 3. ref
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

### 4. EventBus
- 使用场景：兄弟组件传值
- 创建一个中央事件总线
- 兄弟组件通过$emit触发自定义事件，$emit第二个参数为传递的数值
- 另一个兄弟组件通过$on监听自定义事件

缺点：当项目较大，就容易造成难以维护。

#### 创建event-bus.js
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
// Vue 已经实现了Bus的功能
import Vue from 'vue'
export const EventBus = new Vue();

```

两个组件AdditionNum和ShowNum，可以是兄弟组件也可以是父子组件，这里使用兄弟组件。

#### 发送事件
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
            EventBus.$emit('addition', {
                num: this.num++
            })
        }
    }
}
</script>
```

#### 接收事件
ShowNum.vue
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
        EventBus.$on('addition', param => {
            this.count = this.count + param.num;
        })
    }
}
</script>

#### 移除事件监听
```js 
import { EventBus } from 'event-bus.js'
EventBus.$off('addition', {})
```