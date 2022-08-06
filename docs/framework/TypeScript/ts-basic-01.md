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
### 1. 为什么要用类型   
- 能够帮助Typescript编译器分析代码
- 能够帮助其他开发者理解整个代码库里存在的值是什么东西   

类型指的是方便去描述一个具有相应属性和方法的值，每一个值都有相应的类型。    
在Typescript中，常见的基础类型有：   
- String： 字符串类型
- Number：数值类型
- Boolean：布尔值类型
- 特殊类型：Data/z自定义乐行


### 2. 类型分类
1. 元类型（primitive types）
   1. number
   2. Boolean
   3. undefined
   4. void
   5. string
   6. symbol
   7. null
2. 对象类型（object types）
   1. function
   2. array
   3. class
   4. object

**如何让Typescript编译器认为不同的值对应者不同的类型？**    
通过对象类型去完成，而不能通过元类型去完成。     

**使用Typescript有什么副作用？**     
无论是不是我们想要，它都会自动帮助值设定一个类型，它借助类型检测代码是否存在输入问题。   

## 类型系统
在Typescript中，有两个重要的系统：
- 类型注解系统
- 类型推断系统

### 1. 类型注解
开发者主动告诉Typescript某一个值的类型是什么
```typescript
// 元类型
let score: number = 50;
let sports: string = 'baseball';
let isHappy: boolean = true;
let nothingMuch: null = null;
let nothing: undefined = undefined;
let tody: Date = new Date();

// 对象类型
// 数组
let balls: string[] = ['basketball', 'football', 'volleyball'];
let someNums: number[] = [1,2,3];
let truths: boolean[] = [true, false];

// 类
class Car{}
let car: Car = new Car();

// 对象
let person:{name: string, age: number} = {
    name: '张三',
    age: 20
}

// 函数  参数和返回值
const logNumber: (num: number)=> void = (num: number)=>{ }
```

### 2. 类型推断
Typescript尝试去推断值的类型。   
关于变量声明和变量初始化：
```typescript
// 变量声明
let score;

// 变量初始化
score = 50;
```
在创建变量的时候经历了两个过程，变量声明和变量初始化，当两个过程同时存在时（在同一行的时候），类型推断系统才会其作用。    

**什么时候使用类型注解?**    
1. 当一个函数返回any类型，但是我们想要明确具体类型
2. 当某一行声明变量了之后，在另一行进行初始化
3. 当我们想要一个变量拥有一个不能推断出来的类型

手动添加类型注解的三种情况：
```typescript
//1.变量声明和变量初始化不在同一行
let score;
score = 50;

//2.当一个函数返回any类型，但是我们想要明确具体类型
const json = '{"name"：“zhangsan", "age": 20}';
//TS不会深层的推断JSON.parse返回的数据，推断为any
let person = JSON.parse(json);
//所以需要手动添加类型
let person: {name: string, age: number} = JSON.parse(json);

//3.当我们想要一个变量拥有一个不能推断出来的类型
let numbers = [-1, 0, 8];
//numAboveZero -> any
//let numAboveZero;

//联合类型
let numAboveZero: boolean | number = false;

for(let i = 0; i < numbers.length; i++){
  if(numbers[i] > 0){
    numAboveZero = numbers[i];
  }
}
```
### 3. 函数类型注解
```typescript
// TS只会检测类型，而不会检测逻辑
const addNum = (a: number, b: number): number => {
    return a + b;
}

function multiply(a: number, b: number): number{
    return a * b;
}

const divide = function(a: number, b: number): number{
    return a / b
}

// 匿名函数类型注解
const logger = (message: string): void =>{
    console.log(message);
}

// 抛出错误函数类型注解
const throwError = (message: string): never =>{
    throw new Error(message)
}

const throwError2 = (message: string): string =>{
    if(!message){
        throw new Error('出错了')
    }
     return message;
}
```
函数的解构注解写法
```typescript
// 解构
const todayWeather = {
    date: new Date(),
    weather: '晴天'
}
// 没有加解构，但是做了类型注解
const logWeather = (todayWeather: {date: Date, weather: string}): void =>{
    console.log(todayWeather.date);
    console.log(todayWeather.weather);    
}

logWeather(todayWeather); 

// 加了解构，但是没做类型注解
const ES6logWeather = ({date, weather}) =>{
    console.log(date);
    console.log(weather);    
}

ES6logWeather(todayWeather)

// 完整写法
const logWeather1 = ({
    date, 
    weather
}: {
    date: Date, 
    weather: string
}): void =>{
    console.log(date);
    console.log(weather); 
}
```

### 4. 对象类型注解
```typescript
const profile = {
    name: 'Mike',
    age: 20,
    coords: {
        lat: 30,
        lng: 50
    },
    setAge(age: number): void{
        this.age = age;
    }
}

// 对象写法
const {age}:{age: number} = profile;
// 对象嵌套写法
const {coords :{lat, lng}}: {coords:{lat: number, lng: number}} = profile

// 多个属性类型注解
const {age, name}: {age: number, name: string} = profile
```

## 类型化数组
在TypeScript里，数组也可以像在JavaScript中使用push等方法来操作数组，但有个比较大的区别是，TS的数组是类型化的数组，在数组里放的元素都是同一种类型的，如果加入不同种类类型的元素，也需要写特殊的类型注解。
```typescript
// 默认类型推断为string[]
const basketballPlayers: string[] = ['Kobe', 'James']

// 如果数组是空数组时，需要加注解
const basketballPlayers: string[] = []

// 二维数组注解写法
const studentsByClass: string[][] = [
    ['Mike', 'Tom'],
    ['Lee'],
    ['Jack', 'Smith']
]
```
为什么要类型化数组
```typescript
// 1. 提取值的时候帮助推断
// player: string
const player = basketballPlayers[0];

// 2. 使用数组方法的时候帮助推断
// favPlayer: string
const favPlayer = basketballPlayers.pop();

// 3. 防止加入不一样类型的值
basketballPlayers.push(123);

// 4. 使用map，forEach。reduce函数时提供帮助
basketballPlayers.map((car: string): string=>{
    return car; // car. 就可以看到很多字符串的方法
})

// 5. 容纳不同类型  添加类型注解
const importantDates: (string | Date)[] = [new Date(), '2020-10-01']
```
什么时候使用类型化数组？    
一旦需要记录一些相似类型记录的数据结构时。

## 元组


