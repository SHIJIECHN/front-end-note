---
autoGroup-4: Vue-Router
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
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>
} {
    // 如果传入了oldPathList，设置为oldPathList，没有传入设置为空数组
    const pathList: Array<string> = oldPathList || []
    const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  // $flow-disable-line
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)
}
```