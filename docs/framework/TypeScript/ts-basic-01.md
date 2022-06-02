---
autoGroup-1: Typescript
sidebarDepth: 3
title: 初识TypeScript、什么是类型系统
---

## 初识TypeScript
Typescript = JavaScript + 类型系统

## 类型系统
1. 在开发过程中找错
2. 使用“类型注解”来分析代码
3. 仅存在于开发阶段。
4. 不会提供性能优化。这是和其他类型语言的对比

Typescript -> TypeScript编译器 -> JavaScript代码

## TypeScript环境搭建
1. 安装typescript和ts-node：npm install typescript ts-node

ts-node：让整个ts文件编译成js文件，然后自动执行。

2. JSONPlaceholder提供可使用的数据：https://jsonplaceholder.typicode.com/todos/1

3. 初始化package.json：npm init --y
4. 安装axios：npm install axios。使用axios模块发送请求到JSONPlaceholder中的地址。
5. 运行ts文件：创建index.ts，在终端输入tsc index.ts生成index.js。一种方式是可以直接到浏览器中引入js文件，还有一种是使用node index.js。-> 使用ts-node index.ts 将两个命令合并。
```typescript
// index.ts
import axios from 'axios'

const url = 'https://jsonplaceholder.typicode.com/todos/1';

axios.get(url).then(res=>{
    console.log(res.data);
})
```
执行ts-node index.ts
```js
{ 
    userId: 1, 
    id: 1, 
    title: 'delectus aut autem', completed: false 
}
```