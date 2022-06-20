---
autoGroup-1: Vue-Router
sidebarDepth: 3
title: 3. match方法的实现
---

## match
切换路径是产生路由匹配。就会调用match方法
```javascript
 match (raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }
```

### 1. createMatcher.match方法
this.matcher就是createMatcher的返回对象，执行this.matcher.match，就相当于执行createMatcher.match中的match方法。
```javascript
function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    // 标准化路径
    const location = normalizeLocation(raw, currentRoute, false, router);
    const { name } = location;

    if(name){
        //...
    }else if(location.path){
      location.params = {}
      // createRouteMap返回的pathList和pathMap
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path] // 获得路由信息
        // 路径匹配
        if (matchRoute(record.regex, location.path, location.params)) {
        // 匹配上了，返回新生成的路径
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // 没有匹配上就传入null，空的路径进去
    return _createRoute(null, location)
  }
```
总结： match就是创建返回Route路径的

### 2. normalizeLocation
```javascript
export function normalizeLocation (
  raw: RawLocation,
  current: ?Route,
  append: ?boolean,
  router: ?VueRouter
): Location {
  // 定义next变量
  let next: Location = typeof raw === 'string' ? { path: raw } : raw

  // 对path、query、hash进行处理
  // ...

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}
```
总结：
1. normalizeLocation最后返回的是一个对象，包含了位置信息。
2. normalizeLocation相当于一个辅助函数，可以通过单元测试查看

### 3. matchRoute
```javascript
function matchRoute (
  regex: RouteRegExp,
  path: string,
  params: Object
): boolean {
  const m = path.match(regex) // 正则匹配

// 没有匹配上就返回false
  if (!m) {
    return false
  } else if (!params) { // 匹配上了就返回true
    return true
  }
}
```

### 4. _createRoute
_createRoute中实际上是执行createRoute
```javascript
export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
    // ...

  // 创建路径
  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }
  // 防止路径被修改，使用Object.freeze冻结
  return Object.freeze(route);
}
```