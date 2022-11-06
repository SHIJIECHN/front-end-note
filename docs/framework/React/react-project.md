---
autoGroup-2: Hook
sidebarDepth: 3
title: 项目案例
---

## koa + puppeteer
任务：
1. 爬取页面数据并上传到MySQL中
2. 图片资源全部上传七牛，程序自动上传
3. 利用koa2做服务端将页面做出来
4. 建立一个后台管理课程和管理爬虫
5. 爬虫接口管理

### 1. 实现爬虫
```javascript
// koa生成器生成项目
koa crawler
// 安装依赖
cd crawler && npm install
```

爬虫库：puppeteer
1. puppeteer是NodeJS的一个库，专门提供爬页面的库。利用Chromium来开启一个浏览器，把url地址放到浏览器中进行页面分析，这个过程就是爬取的过程。
2. 


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
