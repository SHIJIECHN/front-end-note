---
autoGroup-2: Hook
sidebarDepth: 3
title: 项目案例
---

## React + Koa2打造『JS++官网管理后台』

### 1. Redis
> 什么是Redis？

它是内存数据库。优势：访问快，内存压力增大 

安装：https://www.runoob.com/redis/redis-install.html

启动redis服务器：
```javascript
// cmd打开终端，进入文件夹C:\Users\shijie03\Downloads\Redis-x64-5.0.14.1，
// 执行命令启动redis服务
redis-server.exe redis.windows.conf

// 新打开cmd窗口，启动客户端
redis-cli.exe -h 127.0.0.1 -p 6379
```

操作
```js
// 设置或修改
set name 'js++'
// 获取redis
get name
// 获取redis所有key
keys *
// 删除redis key
del name
// 退出客户端
exit
```

### 2. koa2安装redis依赖
koa2项目中安装redis依赖，因为需要koa2去操作redis。
