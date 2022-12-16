---
autoGroup-3: Typescript
sidebarDepth: 3
title: TypeScript安装、编译、调试
---

## 安装预编译
```typescript
// 安装：
npm i -g typescript

// 编译ts文件为js文件
tsc xxx.ts

// 调试。安装ts-node。调试ts文件，并不会真正创建xxx.js
npm i -g ts-node
ts-node xxx.ts
```

## 配置文件
```typescript
// 创建配置文件
tsc --init
```
在根目录中创建tsconfig.json

## tsconfig.json配置参数
1. 如果想编译项目下所有.ts文件，则执行tsc，此时会按照tsconfig.json配置参数进行编译
2. 可添加配置属性：`"exclude":["node_modules","/*.spec.ts"]`，则表示不编译数组内规则对应的.ts文件
3. 可添加配置属性："include":["./src/"]，则表示只编译该数组内规则对应的.ts文件
4. 可添加配置属性："files":"[./xx.ts,./xxx.ts]" 则表示只编译该数组内对应的.ts文件
5. compilerOptions"可添加配置属性："outDir":"./bin" 则表示将编译文件存放在./bin目录中

## 类型系统
### 1. 类型注解
主动告诉TS变量是什么类型

基础（简单）类型：string、number、boolean、symbol、null、undefined、void
对象（复杂）类型：array、object、function

### 2. 类型推断
TS根据变量的值推断出变量的类型
1. 变量声明和赋值必须在同一行，例如 let num = 2 此时可推断出num为number
2. 若变量声明和赋值不在同一行，例如 let num; num=2; 此时推断num为any

### 3. 类型断言
告诉TS“你姑且认为变量”是什么类型。该值已经检查过了，不需要再做检查。

实现的两种方式：
1. 尖括号`<Xxxx>`，例如`<string>myStr`，就表示告诉TS，你就把mystr看作是string类型的就好了，无需做检查。
2. 使用 as 关键词，例如 myStr as string，作用和`<string>myStr`相同，但是在react的jsx语法中，仅支持 as 这种语法
3. 如果想使用变量的属性或方法，可再用括号包裹住变量.例如 (`<string>mystr`).length 或 (mystr as string).length，获取mystr的字符长度

### 4. 特殊符号或关键字
1. | 表示 或。如string | number，即string或number
2. ?: 表示 可选属性。例如 interface Person{age ?: number}，age属性为可选(可以有或者没有)

## TS面向对象编程
### 1. 对象
#### 1.1 常见对象类型定义：
1. data:object 或 data:{}，表示data定义为object 类型
2. data:{x:number,y:number}，表示data为object类型，必须只能有2个类型为number的属性x和y
3. type Data = {x:number,y:number}; let data:Data，通过使用type关键词，定义类型别名，表示data的数据类型
4. let num:string | number，通过 | 符号，表示num既可以是string，也可以是number
5. interface Data = {x:number,y:number}; let data:Data，通过使用interface关键词，定义类型接口，表示data的数据类型，
6. interface SayHi(){(word:string):string} ，表示一个函数SayHi，参数为word，类型为string，该函数返回值为string
> 注意：
> 1. 若某个变量包含interface已有定义的属性和未定义的属性存，例如 let person = {x:2,y:3,z:5} person虽然多出了一个属性z，但是他依然符合 interface Data = {x:number,y:number} 的规范，TS不会报错误警告的。
> 2. 但是如果不是以变量形式，而是直接以值的形式是不被允许的，例如 {x:2,y:3,z:5} 是不符合上述类型定义的
> 3. TS不会在意属性定义的顺序，例如 {x:2,y:3} 和 {y:3,x:2} 在TS看来是没有区别的。

#### 1.2 解构赋值类型定义：
1. 、如果是对象解构，myFun({name,age}:{name:string,age:number})，表示函数参数类型格式为{name:string,age:number}，注意：切记不要直接给解构参数声明类型，一定要将解构赋值的对象作为整体来进行类型定义。
2. 如果是数组解构，也需要将数组整体类型定义，例如 `[first,second]:[number,number]`


#### 1.3 数组类型定义:
1. let arr:number[] ，表示arr为数字且数组内所有元素均为number
2. let arr:(number | string)[]，表示数据内所有元素只可以是number或string
3. let arr:{name:string}[]，表示数据内所有元素都只可以是 {name:xxx}，注意：像{name:xx,age:xx}中有属性age，是不符合之前定义的类型规范。
4. type User:{name:string}; let arr:User[]; 和上述3中同一个意思
5. let arr:Array.，这种写法称为“数组泛型”，和 arr:number[] 作用相同
6. ReadonlyArray.，这种写法会让该数组元素为只读，第一次整体赋值后不可再单独更改。

#### 1.4 元祖(tuple)类型定义：
元素概念解释：已知元素的数量和类型的数组，被称为元祖。
1. `let arr:[string,string,number]` ，表示arr为数组，且该数组包含3个值，这3个值的类型依次是string、string、number
2. `let arr:[string,string,number][]`，表示arr为数组，该数组内所有的值类型均为 [string,string,number]


#### 1.5 枚举(这是TS独有的，并非原生JS)
枚举概念解释：通过enum对一个对象的各个元素(属性)进行索引数绑定，之后可通过该索引数访问到该元素(属性)。
1. 默认情况下，索引数从0开始，例如 enum Color{Red,Green,Blue}
2. 可手工设定第一个元素的索引，其他元素索引依次向后累加。例如 enum Color{Red=1,Green,Blue}，此时Red索引数为1，Green索引数为2。
3. 可手工设定每一个元素的索引，例如 enum Color{Red=1,Green=3,Blue=5}，此时Color[3] 的值为Green。

### 1. compilerOptions
```json
{
    "compilerOptions": {   
        "target": "esnext", // 指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"(最新的生成目标)
        "module": , // 指定生成哪个模块系统代码： "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015"
        "strictPropertyInitialization": false,  // 控制了类字段是否需要在构造函数里初始化，false为不需要初始化
        "strict": true, // 严格模式。同时开启了noImplicitAny和strictNullChecks，也可以单独设置，此时strict应该设置为false
        "noImplicitAny": true, // 当类型被隐式推断为 any 时，会抛出一个错误
        "strictNullChecks": true, // 明确的处理 null 和 undefined，
        "isolatedModules": false, // 将每个文件作为单独的模块
    }
}
```
### 2.files
```json

```