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
和数组很类似的数据结构，每一个元素代表一个记录的不同属性。  
tuple元组格式为：\[string, boolean, number]
```typescript
const drink = {
    color: 'brown',
    carbonated: true,
    sugar: 35
}

const pepsi: [string, boolean, number] = ['brown', true, 35];

// 类型别名 Type Alias
type Drink = [string, boolean, number];

const  pepsi: Drink = ['brown', true, 35];
const tea: Drink = ['brown', false, 0]
```
**为什么要用元组？**    
在程序里面，使用元组的数据类型比较少，但特殊场景会用到，跟CSV文件打交道时会用。    
**使用元组会有什么缺点？**       
会丢失重要信息。  
```typescript
// 除了数值不能显示其他类型
// 难以阅读值的信息代表什么
const farm: [number, number] = [6, 8];

// 侧向说明对象是一个更好的数据结构
const fram = {
    chick: 6,
    duck: 8
}
```

## 接口
创建一个新的类型，来描述一个对象的属性名和属性值，对象的形式进行描述。     
在Typescript中，会大量的使用接口和类来实现代码的高度复用，对类的一部分行为的抽象。
### 1. 接口分类
1. 函数类型接口
2. 类类型接口：
   1. 对类的一部分行为的抽象
   2. 实现接口中的属性和方法
3. 可索引类型接口
4. 继承接口

```typescript
const uncleMike = {
    name: 'Mike',
    age: 20,
    married: false
}
// 普通写法
const printPerson = (person: { name: string, age: number, married: boolean }): void => {
    console.log(`名字: ${person.name}`);
    console.log(`年龄: ${person.age}`);
    console.log(`结婚没: ${person.married}`);
}

// 定义接口写法
interface Person {
    name: string,
    age: number,
    married: boolean,
    // 方法简写
    summary(): string
}

const printPerson = (person: Person): void => {
    console.log(`名字: ${person.name}`);
    console.log(`年龄: ${person.age}`);
    console.log(`结婚没: ${person.married}`);
}

printPerson(uncleMike);
```
```typescript
// 接口定义只有summary方法
interface Reportbale {
    summary(): string;
}

const uncleMike = {
    name: 'Mike',
    age: 20,
    married: false,
    summary(): string{
        return `名字: ${this.name}`
    }
}

const drink = {
    color: '棕色',
    carbonated: true,
    sugar: 35,
    summary(): string{
        return `这个饮料的颜色是: ${this.color}`
    }
}
// Reportbale接口是作为printSummary函数的门卫存在
const printSummary = (item: Reportbale): void => {
    console.log(item.summary());
}

// 必须满足Reportbale接口的必要条件才能够被printSummary函数使用
printSummary(uncleMike);
printSummary(drink);
```
在Typescript中代码复用的一般策略:
1. 定义接收接口指定类型参数的函数
2. 存在对象/类去满足接口的必要条件

**interface和type有什么区别？**    
1. 都可以用来定义接口，即定义对象或者函数的形状
2. 都可以实现继承，也可以相互继承
3. type可以实现类型别名

## 类
定义一个对象的蓝图，描述了这个对象的属性和方法。    
在Typescript中，类具有双重特性：
1. 创建实例（值）
2. 代表类型（类型）

**什么时候使用类？**     
跟接口一样，在Typescript中，大量使用接口，为了不同文件里面的类进行一个配合工作。   
```typescript
// 定义一个蓝图。父类 super class
class Person {
    // 方法
    scream(): void {
        console.log('ahhh');
    }

    sing(): void {
        console.log('lalala');
    }
}

const person = new Person();
person.scream(); // ahhh
person.sing(); // lalala

// 继承 inheritance
// Men作为一种Person，Men可以做的，Person也可以做
// 子类
class Men extends Person{

}
const men = new Men();
men.scream();
```

### 修饰符
在TS中类有修饰符，ES6中的类没有修饰符。

**什么是修饰符？**    
一些用于封装的关键字public, private, protected，为了限制类里面不同属性和方法的访问。   

**为什么要使用修饰符？**     
限制访问防止开发者错误的调用方法导致程序的破坏

修饰符：
- public：这个方法能够在任何地方被调用（自身、子类、实例）
- private：这个方法只能在当前这个类的其他方法中被调用（自身）
- protected：这个方法能够在当前这个类的其他方法或者子类的其他方法中被调用（自身、子类）
- implements：关键字，满足接口，告诉TS帮助检测类有没有正确的满足接口的实现，没有时会显示错误
- abstract：关键字，将当前类定义为抽象类，无法创建实例，配合定义将来会用到的方法和接收的参数还有属性使用

```typescript
class Person {
    // 方法
    scream(): void {
        console.log('ahhh');
    }
}

// 子类 child class
class Men extends Person{
    private sing(): void{
        console.log('wohoooo');
    }

    startSinging(): void{
        this.sing();
    }
}
const men = new Men();
men.scream();
```
属性描述：
```typescript
class Person {
    // 属性
    name: string = 'Mike'
    constructor(name: string) {
        this.name = name;
    }
}

```

## 配置
利用parcel-bundler包简易的让Typescript代码运行在浏览器中     
parcel-bundler包工作原理：将打包后的ts文件转为js文件注入到\<script>标签中
```typescript
//安装
npm i -g parcel-bundler

//index.html引入ts文件
<script src="./src/index.ts"></script>

//开启打包服务器
parcel serve index.html

//Server running at http://localhost:1234
```

## 案例
### 1. 百度地图
实现：
1. 百度地图展示在页面
2. 在地图上标识地点（用户/公司）
3. 给标注地点添加信息窗口

技术：Typescript类+faker包。

**faker**    
faker包随机生成数据提供浏览器或node使用
```typescript
//安装faker
npm i -D faker@4.1.0

//引入
import faker from 'faker';

//在类型定义文件中定义帮助TS项目认识faker包
//JS库(包) -> 类型定义文件 -> TS代码
//如流行的JS库如axios自带类型定义文件不用额外去下载

//如果不下载类型定义文件，TS推断会提示需要下载
//去npm下载faker的类型定义文件 搜索@types/faker
npm i -D @types/faker
```

**声明时类型定义文件？**   
通过类型定义文件检测JS库中是否含有符合TS程序所需要的包文件

**类型定义文件存储库**   
Definitely Typed      
保存方式为：@types/{JS库的名字}，如@types/faker    

#### 1.1 项目创建
```typescript
//1.引入标签
<script type="text/javascript" src="https://api.map.baidu.com/api?v=1.0&type=webgl&ak=bdmzm8j1GXfW44ABN4D5LRGwXvV1hOOa"></script>

//2.插入容器
<div id="container"></div>

//3.测试是否接入百度API,控制台输入BMapGL
//打印：{version: 'gl', _register: Array(9), guid: 1, register: ƒ, getGUID: ƒ, …}

//4.接入成功

//5.在Map.ts文件中下载引入类型定义文件
npm i -S @types/baidumap-web-sdk
npm install --save @types/bmapgl

//6.创建地图实例
//实例化访问BMap底下的Map类
//Map类接收两个参数：
//参数1：HTMLElement挂载容器
//参数2：配置对象
const map = new BMapGL.Map('container', {
  //最大放大
  maxZoom: 1
});

//7.设置中心点坐标
var point = new BMapGL.Point(116.404, 39.915);

//地图初始化，同时设置地图展示级别
map.centerAndZoom(point, 15);
```
#### 1.2 项目结构
```md
├─index.html
├─package.json
├─src
|  ├─Company.ts - 定义公司类/使用公共接口
|  ├─CustomMap.ts - 定义公共接口/地图类
|  ├─index.ts - 出口文件
|  └Users.ts - 定义用户类/使用公共接口
```

#### 1.3 项目总结
1. 实现private关键字在index.ts中使用API的限制
2. 实现将两个方法或多个方法合并一个方法，将新增属性或者方法归纳在*配合类工作）定义的接口里
3. 实现主动检测提示类中是否含有接口定义的属性和方法（implement）
