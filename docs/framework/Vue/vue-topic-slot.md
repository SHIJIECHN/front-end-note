---
autoGroup-3: 源码专题
sidebarDepth: 3
title:  插槽
---

## 插槽使用
父组件向子组件传参。   
App.vue
```vue
<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->
    <slot-demo
      :url="parentWebsit.url"
    >
    {{parentWebsit.name}}
    </slot-demo>
  </div>
</template>

<script>
import SlotDemo from './views/SlotDemo.vue'
export default {
  name: 'App',
  components: {
    SlotDemo
  },
  data () {
    return {
      parentWebsit: {
        url: 'http://baidu.com',
        name: 'baidu'
      }
    };
  }
}
</script>
```
SlotDemo.vue
```vue
<template>
  <a :href="url">
      <slot>默认内容</slot>
  </a>
</template>

<script>
export default {
    props:['url']
}
</script>
```

## 作用域插槽
父组件使用子组件的数据。
App.vue
```vue
<template>
  <div id="app">
    <slot-demo
      :url="parentWebsit.url"
      v-slot="slotProps"
    >
      {{slotProps}}
      <hr />
      {{slotProps.childWebsite.name}} 
    </slot-demo>
  </div>
</template>

<script>
import SlotDemo from './views/SlotDemo.vue'
export default {
  name: 'App',
  components: {
    SlotDemo
  },
  data () {
    return {
      parentWebsit: {
        url: 'http://baidu.com',
        name: 'baidu'
      }
    };
  }
}
</script>
```
SlotDemo.vue
```vue
<template>
  <a :href="url">
      <slot :childWebsite="childWebsite">默认内容</slot>
  </a>
</template>

<script>
export default {
    props:['url'],
    data(){
      return{
        childWebsite:{
          url:'http://jsplusplus.com',
          name: 'JS++'
        }
      }
    }
}
</script>
```