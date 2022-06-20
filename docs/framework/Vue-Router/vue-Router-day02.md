---
autoGroup-1: Vue-Router
sidebarDepth: 3
title: 2. 创建路由映射表
---

## 创建路由映射表
```javascript
class VueRouter{
    constructor (options: RouterOptions = {}) {
        // ...
        // 路由映射表
        this.matcher = this.matcher = createMatcher(options.routes || [], this);
    }
}
```

### 1. createMatcher
```javascript
// 定义一个Matcher类型
export type Matcher = {
  match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route;
  addRoutes: (routes: Array<RouteConfig>) => void;
  addRoute: (parentNameOrRoute: string | RouteConfig, route?: RouteConfig) => void;
  getRoutes: () => Array<RouteRecord>;
};

export function createMatcher (
  routes: Array<RouteConfig>, // 路由表
  router: VueRouter // VueRouter 实例
): Matcher {
    // 创建路由映射表
    const { pathList, pathMap, nameMap } = createRouteMap(routes)

}
```

### 2. createRouteMap
```javascript
export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>,
  parentRoute?: RouteRecord
): {
  pathList: Array<string>, // 路径列表， 也就是 routes里面的 path
  pathMap: Dictionary<RouteRecord>, // 路径的相对映射表
  nameMap: Dictionary<RouteRecord> // 路径的名字映射表
} {
    // 如果传入了oldPathList，设置为oldPathList，没有传入设置为空数组
    const pathList: Array<string> = oldPathList || []
    const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
    const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

    // 遍历路由配置
    routes.forEach(route => {
      addRouteRecord(pathList, pathMap, nameMap, route, parentRoute) // 创建路由记录
    })

    // 通配符路径的处理：如果path是 * ，则放到路由表的最后
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
}
```

### 3. addRouteRecord
```javascript
function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  // 取出路由的 path 和 name
  const { path, name } = route

  // 判断path和component的有效性
  // ...

  // 路径标准化处理 如 // -> /
  const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict)

  // 核心：把路由配置对应的配置项变成响应式记录，这个记录是为了后面的匹配的参考。
  const record: RouteRecord = {
    path: normalizedPath, // 标准的路径 
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions), // 正则表达式
    components: route.components || { default: route.component },
    // ...
  }

  // 当有子路由时
  if (route.children) {
    // ...
    // 处理嵌套路由，也就是递归处理
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`)
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  // 
  if (!pathMap[record.path]) {
    pathList.push(record.path) // 将路径push进去
    pathMap[record.path] = record // 同时将record放入map中
  }

  // nameMap
  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        `Duplicate named routes definition: ` +
          `{ name: "${name}", path: "${record.path}" }`
      )
    }
  }
}
```
总结：把路由配置对应的配置项变成响应式记录，这个记录是为了后面的匹配的参考。

## 源码调试
### 1. 文件位置
在new VueRouter时，会调用构造函数VueRouter，在VueRouter中会执行createMatcher，创建路由映射表。那会调用哪个文件呢？查看vue-router包中的package.json文件里面有配置module就是导出使用的文件名。
<img :src="$withBase('/framework/Vue-router/vue-router-调试文件.png')" alt="vue-router-调试文件" />

### 2. 调用栈
在createMatcher方法中debugger，通过调用栈可以看到哪里调用。
<img :src="$withBase('/framework/Vue-router/vue-router-调用栈.png')" alt="vue-router-调用栈" />

### 3. 执行createMatcher
传入的参数routes路由表和router路由对象
<img :src="$withBase('/framework/Vue-router/vue-router-createMatcher参数.png')" alt="vue-router-createMatcher参数" />

### 4. 执行createRouteMap
初始是oldPathList, oldPathMap, oldNameMap, parentRoute都是undefined，所以都是设置的默认值。
<img :src="$withBase('/framework/Vue-router/vue-router-createRouteMap参数.png')" alt="vue-router-createRouteMap参数" />

### 5. 执行addRouteRecord
主要参数：route
<img :src="$withBase('/framework/Vue-router/vue-router-addRouteRecord参数.png')" alt="vue-router-addRouteRecord参数" />
<img :src="$withBase('/framework/Vue-router/vue-router-addRouteRecord.png')" alt="vue-router-addRouteRecord" />  

当有子路由时，normalizedPath会拼接父级路由
<img :src="$withBase('/framework/Vue-router/vue-router-addRouteRecord子路由.png')" alt="vue-router-addRouteRecord子路由" />  


### 6. pathList和pathMap
<img :src="$withBase('/framework/Vue-router/vue-router-pathListAndPathMap.png')" alt="vue-router-pathListAndPathMap" />  

### 7. createMatcher执行结束返回
#### ref
<img :src="$withBase('/framework/Vue-router/vue-router-ref.png')" alt="vue-router-ref" />    

#### ref/nameMap
<img :src="$withBase('/framework/Vue-router/vue-router-ref-nameMap.png')" alt="vue-router-nameMap" />  

#### ref/pathList
<img :src="$withBase('/framework/Vue-router/vue-router-ref-pathList.png')" alt="vue-router-pathList" />  

#### ref/pathMap
<img :src="$withBase('/framework/Vue-router/vue-router-ref-pathMap.png')" alt="vue-router-pathMap" />  
