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

// 值（values）和类型（types）不是一种东西，为了获取值f，也就是函数f的类型，需要使用typeof
type P = ReturnType<typeof f>;
// type P = {
//   x: number;
//   y: number;
// }
```

## 限制（Linitations）
在Typescript中，只有对**标识符**（比如变量名）或者他们的**属性**使用typeof才是合法的
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

## const 断言
使用const断言构造新的字面量表达式时，我们可以向编程语言发出一下信号：
1. 表达式中的任何字面量类型都不应该被扩展
2. 对象字面量的属性属性，将使用readonly修饰
3. 数组字面量将变成readonly元组

```typescript
let x = "hello" as const;
type X = typeof x; // type X = "hello"

let y = [10, 20] as const;
type Y = typeof y; // type Y = readonly [10, 20]

let z = { text: "hello" } as const;
type Z = typeof z; // let z: { readonly text: "hello"; }
```
数组字面量应用const断言后，它将变成readonly元组，之后还可以通过typeof操作符获取元组中元素值的联合类型
```typescript
type Data = typeof y[number]; // type Data = 10 | 20
```

注意事项：
1. const断言只适用于简单的字面量表达式
2. const上下文立即将表达式转为为完全不可变
```typescript
// 1
// A 'const' assertions can only be applied to references to enum members, 
// or string, number, boolean, array, or object literals.
let a = (Math.random() < 0.5 ? 0 : 1) as const; // error
let b = Math.random() < 0.5 ? 0 as const :
    1 as const; // let b: 0 | 1

// 2
let arr = [1, 2, 3, 4];
let foo = {
    name: "foo",
    contents: arr,
} as const;

foo.name = "bar";   // error! Cannot assign to 'name' because it is a read-only property
foo.contents = [];  // error! Cannot assign to 'name' because it is a read-only property

foo.contents.push(5); // ...works!
```

## 总结
1. 搭配`ReturnType<T>`使用，获取函数f的类型
2. 只有标识符或者属性才能使用typeof
3. 对对象、函数使用typeof，获取对象和函数的类型
4. 对enum使用typeof，会被编译成对象。一般搭配keyof使用获取属性名的联合字符串
5. const断言获取元组中元素值的联合类型