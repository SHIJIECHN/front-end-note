---
autoGroup-1: Typescript
sidebarDepth: 3
title: keyof操作符
---

## keyof操作符
对一个**对象类型**使用keyof操作符，会返回该对象属性名组成的一个字符串或者数字字面量的联合。
```typescript
type Point = { x: number; y: number};
type P = keyof Point; // P 等同于 "x" | "y"

// type P = keyof Point
```
如果这个类型有一个string或者number类型的索引签名，keyof则会直接返回这些类型
```typescript
type Arrayish = {[n: number]: unknown};
type A = keyof Arrayish;
// type A = number

type Mapish = { [k: string]: boolean};
type M = keyof Mapish;
// type M = string | number
```
M是string | number，这是因为JavaScript对象的属性名会被强制转为一个字符串，所以obj\[0]和obj\["0"]是一样的。

## 数字字面量联合类型
```typescript
const NumericObject = {
  [1]: 'one',
  [2]: 'two',
  [3]: 'three'
}

type result = keyof typeof NumericObject

// 对对象使用typeof返回结果：
// typeof NumbericObject 的结果为：
// {
//   1: string;
//   2: string;
//   3: string;
// }
// 所以最终的结果为：
// type result = 1 | 2 | 3
```

## Symbol
```typescript
const sym1 = Symbol();
const sym2 = Symbol();
const sym3 = Symbol();

const symbolToNumberMap = {
  [sym1]: 1,
  [sym2]: 2,
  [sym3]: 3
}

type KS = keyof typeof symbolToNumberMap
// type KS = typeof sym1 | typeof sym2 | typeof sym3


function useKey<T, K extends keyof T>(o: T, k: K){
  var name: string = k;
  // Type 'string | number | symbol' is not assignable to type 'string'.
}

// 去掉上面报错的方式：
// 1. 使用Extract：确定只使用字符串类型的属性名
function useKey<T, K extends Extract< keyof T, string>>(o: T, k: K){
  var name: string = k;
}

// 2. 修改name的类型：处理所有的属性名
function useKey<T, K extends keyof T>(o: T, k: K){
  var name: string | number | symbol = k;
}
```

## 类和接口
对类使用keyof 
```typescript
class Person {
  name: 'Lily'
}

type result = keyof Person;
// type result = "name"

class Person {
  [1]: string = 'Lily';
}

type result = keyof Person;
// type result = 1
```
对接口使用keyof
```typescript
interface Person {
  name: string
}

type result = keyof Person;
// type result = "name"
```

## 总结
1. 对对象**类型**（数字、Symbol、字符串为键值）使用keyof。返回该对象属性名组成的一个字符串或数字字面量的联合
2. 当对对象使用keyof时，需要先使用typeof，再使用keyof。
3. 对type、interface接口、类不需要使用typeof，返回键名