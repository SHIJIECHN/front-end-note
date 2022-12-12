---
autoGroup-3: Typescript
sidebarDepth: 3
title: infer关键字
---

## infer 
infer关键字用于条件中的类型推导。
```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any
```
如果T继承了(...args: any[]) => any类型，则返回类型， 否则返回any。其中R被定义在extends (...args: any[]) => infer R 中，即R是通过传入参数类型中推导出来的。

## 需求角度理解infer
场景：实现一个函数，接收一个数组，返回第一项
```typescript
type GetFirstParamType<T> = T extends (...args: infer R) => any ? R[0] : any;
```

## 设计角度理解infer
infer R是推断出来的的类型。
```typescript
type GetLabelTypeFormObject<T> = T extends { label: infer R} ? R : never
type Result = GetLabelTypeFormObject<{label: string}>
// type Result = string
```
让是R 是对象中某个属性，如{ label: R}这个位置的类型，确保类型接收有属性label，即{ label: xxx}。

## 概述
```typescript
type ArrayElementType<T> = T extends (infer E)[] ? E : T
type T1 = ArrayElementType<number[]>
// type T1 = number

type T2 = ArrayElementType<{name: string}>
// type T2 = {name: string}

type T3 = ArrayElementType<[number, string]>
// type T3 = number | string
```
如果T类型是一个数组，且我们将数组的每一项定义为E类型，那么返回类型就为E，否则为T类型本身。

T3相当于多个infer E，(infer E)[] 相当于 [infer E, infer E]...多个变量指向同一个类型代词E，所以可以理解为E时而为string时而为number，是或关系，这就是协变。

如果是函数参数呢？
```typescript
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void} 
  ? U : never;
type T21 = Bar<{a: (x: string) => void; b: (x: number) => void}>; // string & number
```
这是逆变，T21时而为string时而为number，是且的关系。

协变或逆变与infer参数位置有关，对象、类、数组和函数的返回值类型都是协变关系，而函数的参数类型是逆变关系，所以infer位置如果在函数参数上，就会遵循逆变原则。

