---
autoGroup-1: Typescript
sidebarDepth: 3
title: 初识TypeScript、什么是类型系统
---

## 什么是TypeScript
Typescript = JavaScript + 类型系统

## 什么是类型系统
1. 在开发过程中找错
2. 使用“类型注解”来分析代码
3. 仅存在于开发阶段。
4. 不会提供性能优化。这是和其他类型语言的对比

Typescript -> TypeScript编译器 -> JavaScript代码

## TypeScript环境搭建
1. 安装typescript和ts-node：npm install typescript ts-node
```js
// 编译文件 ts->js
tsc index.ts
// 执行文件
node index.js

// 使用ts-node将上面两个步骤写成一个
ts-node index.ts
```
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

## 定义
### 1. 类型注解
interface定义数据类型，确保内容是否复合定义的类型，否则文本编译器下波浪报错。
```typescript
// 变量定义类型
interface Todo {
    id: number,
    title: string,
    completed: boolean
}

// 声明时使用
const todo = res.data as Todo;
```
#### 两种常见错误场景
1. 在读取某个字段时，写错字段名称
```typescript
//报错提醒
const ID = todo.ID;
// 属性“ID”在类型“Todo”上不存在。你是否指的是“id”?

const fininshed = todo.finished;
// 类型“Todo”上不存在属性“finished”。ts
```

2. 给函数定义参数类型，避免传参时顺序搞错可以自动检测出。
```typescript
//给函数定义参数类型
const logTodo = (id: number, title: string, completed: boolean) => {
  console.log(`
    todo的id为: ${id},
    标题为: ${title},
    是否完成: ${completed}
  `);
};

//报错提醒
logTodo(id, completed, title);
// 类型“boolean”的参数不能赋给类型“string”的参数。
```

**什么是类型？**    
一个方便描述一个具有相应的属性和方法的值的东西    

**什么是值？**
是用户能够赋值给变量的东西，在TypeScript中，不同的值有不同的类型。     

**如何描述一个值？**    
通过字符串/数值/布尔值/对象等类型去描述一个值，也可以通过接口interface去定义一个新的类型去描述一个值。


## 类型
**为什么要用类型**    
- 能够八公主Typescript编译器分析代码
- 能够帮助其他开发者理解整个代码库里存在的值是什么东西   

类型指的是方便去描述一个具有相应属性和方法的值，每一个值都有相应的类型。    
在Typescript中，常见的基础类型有：   
- String： 字符串类型
- Number：数值类型
- Boolean：布尔值类型
- 特殊类型：Data/z自定义乐行
