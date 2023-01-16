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

// T[keyof K] 获取到 T 中的 key且同时存在于 K 时的类型组成的联合类型
type I1 = Person['age'|'name'];
// type I1 = string | number

// T[keyof T] 可以获得T所有key的类型组成的联合类型
type I2 = Person[keyof Person];
// type I2 = string | number | boolean

type AliveOrName = 'alive' | 'name';
type I3 = Person[AliveOrName];
// type I3 = string | boolean

// 如果[]中的key有不存在T中的，则是any
type I4 = Person['name' | 'gender'];
// type I4 = any
```
总结：
1. `T[keyof K]` 获取到 T 中的 key且同时存在于 K 时的类型组成的联合类型
2. `T[keyof T]` 可以获得T所有key的类型组成的联合类型
3. 如果`[]`中的key有不存在T中的，则是any

使用number来获取数组元素的类型
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
作为索引的只能是类型，意味着不能使用const创建一个变量引用
```typescript
const key = "age";
type Age = Person[key];

// Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?

// 正确应该修改为
type key = 'age';
type Age = Person[key]; // type Age = number
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

> 怎么根据一个数组获取它的所有的字符串联合类型呢？

```typescript
// 1. as const 将数组变为readonly的元组类型
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const; // const App: readonly ["TaoBao", "Tmall", "Alipay"]

// 2. 但此时APP还是一个值，我们通过typeof获取APP的类型
type typeOfAPP = typeof App; // type typeOfAPP = readonly ["TaoBao", "Tmall", "Alipay"]

// 3. 最后再通过索引访问类型，获取字符串联合类型
type app = typeof App[number]; // type app = "TaoBao" | "Tmall" | "Alipay"
```

## 总结
1. 查找另外一个**类型**上的特定属性
2. 结合typeof，使用number来获取数组元素的类型