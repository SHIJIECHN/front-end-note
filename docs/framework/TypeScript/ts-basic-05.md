---
autoGroup-1: Typescript
sidebarDepth: 3
title: 泛型
---

## 泛型初探
类型变量(type variable)：一种用在类型而非值上的特殊的变量。
```typescript
function identity<Type>(arg: Type): Type{
  return arg;
}

// 调用方式一
let output = identity<string>("myString"); // let output: string

// 调用方式二
let output = identity("myString"); // let output: string
```
调用方式二使用了类型参数推断（type argument inference）。希望编译器能基于传入的参数自动推断和设置Type的值。

## 使用泛型类型变量（Working with Generic Type Variable）
```typescript
function identity<Type>(arg: Type): Type{
  console.log(arg.length); 
  // Property 'length' does not exist on type 'Type'.
  return arg;
}

function loggingIdentify<Type>(arg: Type[]): Type[]{
  console.log(arg.length);
  return arg;
}
```
可以这样立即logginIdentify函数：泛型函数loggingIdentity接受一个Type类型参数和一个实参arg，实参arg是一个Type类型的数组。而该数组返回一个Type类型的数组。

## 泛型类型（Generic Types）
泛型函数
```typescript
function identity<Type>(arg: Type): Type{
  return arg;
}

// 泛型类型 
// 方式一
let myIdentify: <Type>(arg: Type) => Type = identity

// 方式二
// 泛型的类型参数可以使用不同的名字，只要数量和使用方式上一致即可
let myIdentify: <Input>(arg: Input) => Input = identity;

// 方式三
// 使用对象类型的调用签名的形式
let myIdentify: {<Type>(arg: Type): Type} = identity
```

泛型接口
```typescript
function identity<Type>(arg: Type): Type{
  return arg;
}

interface GenericIdentifyFn {
  <Type>(arg: Type): Type;
}

let myIdentify: GenericIdentify = identity;

// 使用泛型参数作为整个接口的参数
interface GenericIdentifyFn<Type> {
  (arg: Type): Type;
}

let myIdentify: GenericIdentifyFn<number> = identity;
```

## 泛型类 
```typescript
class GenericNumber<NumType>{
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x,y){
  return x + y;
}
```
一个类它的类型有两部分：静态部分和实例部分。泛型类仅仅对实例部分生效，所以当我们使用类的时候，注意静态成员并不能使用类型参数。

## 泛型约束（extends）
```typescript
interface Lengthwise{
  length: number;
}

function loggingIdentify<Type extends Lengthwise>(arg: Type): Type{
  console.log(arg.length);
  return arg;
}

// 不再适用于所有类型
loggingIdentify(3);
// Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.

// 需要传入符合约束条件的值
loggingIdentify({length: 10, value: 3});
```
在泛型约束中使用类型参数（Using Type Parameters in Generic Constraints）

获取一个对象给定属性名的值
```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key){
  return obj[key]
}
let x = {
  a: 1,
  b: 2,
  c: 3
};

getProperty(x, 'a');
getProperty(x, 'm');
// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c"'.
```


