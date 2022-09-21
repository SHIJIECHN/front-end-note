---
autoGroup-1: Typescript
sidebarDepth: 3
title: typeof操作符 
---

## typeof 
typeof方法可以在类型上下文中使用，用于获取一个变量或者属性的类型。
```typescript
let s = "hello";
let n: typeof s; // let n: string
```
与ReturnType<T>搭配使用，返回该函数的返回值的类型
```typescript
type Predicate = (s: unknown) => boolean
type K = ReturnType<Predicate>; // type K = boolean

function f(){
  return {x: 10, y: 3}
}
type P = ReturnType<f>;
// 'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?

type P = ReturnType<typeof f>;
// type P = {
//   x: number;
//   y: number;
// }
```

## 限制（Linitations）
在Typescript中，只有对标识符（比如变量名）或者他们的属性使用typeof才是合法的
```typescript
declare const msgbox: () => boolean

let shouldContinue: typeof msgbox('Are you sure...');
// 报错：',' expected

let shouldContinue: ReturnType<typeof msgbox>; 
// let shouldContinue: boolean
```

## 对对象使用typeof
```typescript
const person = {
  name: 'kevin',
  age: '18'
}

type kevin = typeof person;
// type kevin = {
//     name: string;
//     age: string;
// }
```

## 对函数使用typeof
```typescript
function identify<Type>(arg: Type): Type {
  return arg;
}

type result = typeof identify;
// type result = <Type>(arg: Type) => Type
```

## 对enum使用typeof
```typescript
enum UserRespone {
  No = 0,
  Yes = 1
}
```
enum是一种新的数据类型，但是在具体执行的时候，会被编译成对象。

对应编译的JavaScript代码为
```typescript
var UserResponse;
(function (UserResponse) {
    UserResponse[UserResponse["No"] = 0] = "No";
    UserResponse[UserResponse["Yes"] = 1] = "Yes";
})(UserResponse || (UserResponse = {}));

console.log(UserResponse);
// {
//   "0": 'No',
//   '1': 'Yes',
//   'No': '0',
//   'Yes': '1'
// }
```
UserResponse使用typeof 
```typescript
enum UserRespone {
  No = 0,
  Yes = 1
}

type result = typeof UserRespone;

const a:result = {
  "No": 2,
  "Yes": 3
}
// result类型类似于
// {
//   "No": number,
//   "Yes": number
// }
```
通常会搭配keyof操作符用于获取属性名的联合字符串
```typescript
type result = keyof typeof UserResponse;
// type result = "No" | "Yes"
```