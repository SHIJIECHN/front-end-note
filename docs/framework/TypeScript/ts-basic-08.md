---
autoGroup-1: Typescript
sidebarDepth: 3
title: 索引访问类型
---

## 索引访问类型（Indexed Access Types）
使用索引访问类型查找另外一个类型上的特定属性。
```typescript
type Person = {
  age: number;
  name: string;
  alive: boolean
}

type Age = Person['age'];
// type Age = number

type I1 = Person['age'|'name'];
// type I1 = string | number

type I2 = Person[keyof Person];
// type I2 = string | number | boolean

type AliveOrName = 'alive' | 'name';
type I3 = Person[AliveOrName];
// type I3 = string | boolean
```
使用number老获取数组元素的类型
```typescript
const MyArray = [
  {name: 'Alice', age: 15},
  {name: 'Bob', age: 23},
  {name: 'Eve', age: 38}
]

type Person = typeof MyArray[number];
// type Person = {
//     name: string;
//     age: number;
// }

type Age = typeof MyArray[number]['age'];
// type Age = number

type Age2 = Person['age'];
// type Age2 = number
```
实战案例：假如有一个业务场景，一个页面需要用在不同的APP里，比如淘宝、天猫、支付宝，根据所在APP的不同，调用的底层API会不同。
```typescript
const App = ['TaoBao', 'Tmall', 'Alipay'] as const;
type app = typeof App[number];
// type app = "TaoBao" | "Tmall" | "Alipay"

function getPhoto(app: app){
  // ...
}

getPhoto('TaoBao'); // ok
getPhoto('whatever'); // not ok
```
as const 将数组变为readonly的元组类型
```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
// const App: readonly ["TaoBao", "Tmall", "Alipay"]
```
但此时APP还是一个值，我们通过typeof获取APP的类型
```typescript
type typeOfAPP = typeof App;
// type typeOfAPP = readonly ["TaoBao", "Tmall", "Alipay"]
```
最后再通过索引访问类型，获取字符串联合类型
```typescript
type app = typeof App[number];
// type app = "TaoBao" | "Tmall" | "Alipay"
```