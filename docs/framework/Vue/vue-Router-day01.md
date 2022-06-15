---
autoGroup-4: Vue-Router
sidebarDepth: 3
title: 1. VueRouter对象的初始化、嵌套路由
---

## VueRouter对象的属性和方法
### 1. VueRouter构造函数
VueRouter构造函数
```javascript
class VueRouter {
    // 静态方法和静态属性
    static install: () => void

    constructor (options: RouterOptions = {}) {
        this.options = options; // 配置
        // 导航守卫相关
        this.beforeHooks = []
        this.resolveHooks = []
        this.afterHooks = []
        // createMatcher后面介绍
        this.matcher = createMatcher(options.routes || [], this)

        // 路由模式设置
        let mode = options.mode || 'hash' ; // 'history'或'hash'，默认hash模式
        // 使用history模式时，调用h5的特性，有的浏览器不支持h5的特性。通过supportPushState去检查是否支持，不支持为false。options.fallback没有前置设置为false。此时this.fallback为true。
        this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
        // 不支持h5的特性，mode设置为hash。
        if (this.fallback) {
            mode = 'hash'
        }
         // 在非浏览器环境下为abstract
        if (!inBrowser) {
            mode = 'abstract'
        }
        this.mode = mode
        // history是对路由的管理
        switch (mode) {
        case 'history':
            this.history = new HTML5History(this, options.base)
            break
        case 'hash':
            this.history = new HashHistory(this, options.base, this.fallback)
            break
        case 'abstract':
            this.history = new AbstractHistory(this, options.base)
            break
        default:
            if (process.env.NODE_ENV !== 'production') {
                assert(false, `invalid mode: ${mode}`)
            }
        }
    }
}
```
结论：
1. 初始化主要是对配置项mode模式的处理
2. 路由有三种模式：hash、history、abstract


## VueRouter对象的初始化逻辑

### 1. Vue.mixin
什么时候会初始化VueRouter呢？通过Vue.mixin的方法帮助我们往每个组件中注入beforeCreate和destroyed两个钩子。beforeCreate就会在每个组件执行相对生命周期时触发，一旦触发beforeCreate就会执行里面相对应的逻辑。
```javascript
Vue.mixin({
    beforeCreate () {
        // 判断this.$options.router是否有定义
        // new Vue({
        //     el: '#app'
        //     router // 此处的router
        // })
        if (isDef(this.$options.router)) {
            this._routerRoot = this // 根实例，也就是new Vue({})
            this._router = this.$options.router // router实例
            this._router.init(this) // 执行router实例中init方法，this就是根实例。
            Vue.util.defineReactive(this, '_route', this._router.history.current)
        } else {
            this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
        }
        registerInstance(this, this)
    },
    destroyed () {
        registerInstance(this)
    }
})
```
### 2. init方法实现
```javascript
// app 是根实例，new Vue()
init (app: any /* Vue component instance */) {
    // 如果已经初始化过了，也就是this.app存在，就不再执行后面初始化的逻辑了
    if (this.app) {
      return
    }
    this.app = app

    // 第一次执行init方法就继续执行

    // history保存
    const history = this.history

    // 执行两个方法 setupListeners 和 transitionTo
    if (history instanceof HTML5History || history instanceof HashHistory) {
      const handleInitialScroll = routeOrError => {
        const from = history.current
        const expectScroll = this.options.scrollBehavior
        const supportsScroll = supportsPushState && expectScroll

        if (supportsScroll && 'fullPath' in routeOrError) {
          handleScroll(this, routeOrError, from, false)
        }
      }
      // setupListeners方法
      const setupListeners = routeOrError => {
        history.setupListeners()
        handleInitialScroll(routeOrError)
      }
      // transitionTo方法（核心逻辑）
      history.transitionTo(
        history.getCurrentLocation(),
        setupListeners,
        setupListeners
      )
    }

    // listen 监听
    history.listen(route => {
      this.apps.forEach(app => {
        app._route = route
      })
    })
}
```

### 3. init中的transitionTo
作用：路径的切换，从一个路径到另一个路径
```javascript
  transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {
    let route
    // 路径。match方法
    route = this.router.match(location, this.current)
    // ...
  }
```

### 4. transitionTo中的macth
```javascript
match (raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
}
```

总结：
1. 在初始化整个路由的时候，调init方法
2. 在组件进行Vue.use(VueRouter)注册插件时，每个插件都有一个install方法，install方法就是在每次使用插件的时候执行。
3. install中通过Vue.mixin方法往每个组件注册beforeCreate和destroyed两个生命周期钩子函数。执行beforeCreate时就会初始化路由执行init方法。
4. init中又会执行transitionTo做路由的过渡，transitionTo中会最终拿到路径route。

## 嵌套路由
```javascript
const route = [
    {
        path: '/foo',
        component: Foo,
        children: [
            {
                // 当/foo/bar/1 匹配成功
                // Bar会被渲染早Foo的<router-view中>
                path: '/bar/:id', // 子路由中最前面斜杠‘/’可以不用加
                component: Bar
            }
        ]
    }, 
    {
        path: '/baz',
        component: Baz
    }
]
```
App.vue
```javascript
<div id="app">
   // 显示第一级路由, 如Foo、Baz
  <router-view></router-view>  
</div>
```
Foo.vue
```javascript
const Foo = {
  template: `
    <div class="foo">
      <h2>Foo {{ $route.params.id }}</h2>
      <router-view></router-view> 
    </div>
  `,
}
```
Foo.vue中的\<router-view></router-view> 显示foo路由下面的Bar
