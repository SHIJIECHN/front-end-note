---
autoGroup-1: Typescript
sidebarDepth: 3
title: 函数
---

## 函数类型表达式（Function Type Expressions）
```typescript
function greeting(fn:(a: string)=> void){
    fn('Hello');
}
```
(a: string)=> void 表示一个函数又一个名为a，类型是字符串的参数，这个函数没有任何返回值。
```typescript
type GreetFunction = (a: string)=> void;
function greeting(fn:GreetFunction){
    //....
}
```

## 调用签名（Call Signatures）
```typescript
type DescribableFunction = {
    description: string;
    (someAg: number): boolean;
}
function doSomething(fn: DescribableFunction){
    consol.log(fn.description + ' returned '+ fn(6));
}
```

## 构造签名
```typescript
type SomeConstructor = {
    new (s: string): SomeObject;
}
function fn(ctor: SomeConstructor){
    return new ctor("hello");
}
```
有些对象可以直接调用，也可以使用new操作符。如Date
```typescript
interface CallOrConstruct{
    new (s: string): Date;
    (n?: number): number;
}
```

## 泛型函数（Generic Functions）
函数的输出类型依赖函数的输入类型，或者两个输入的类型以某种形式相互关联。

泛型是用来描述两个值之间的对应关系。在函数签名中声明一个类型参数（type parameter）。

所谓泛型就是用一个相同类型来关联两个或者更多的值。


### 1. 推断（Interface）
```typescript
function map<Input, Output>(arr: Input[], func:(arg:Input)=> Output): output[]{
    return arr.map(func);
}
// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

### 2. 约束（Constraints）
使用extends语法约束函数参数
```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
// Argument of type 'number' is not assignable to parameter of type '{ length: number; }'
```

### 3. 声明类型参数（Specifying Type Arguments）
```typescript
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
// 调用时声明类型参数，否则会报错
const arr = combine<string | number>([1, 2, 3], ["hello"]);
// <string | number>
```
类型参数是用来关联多个值之间的类型。如果一个类型参数只在函数签名中出现一次，那么它就没有跟任何东西产生关联。

## 可选参数（Optional Parameters）
```typescript
function f(x?: number){}
```
x的类型实际为number|undefined。

```typescript
function myForEach(arr: any[], callback: (arg: any, index: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

myForEach([1, 2, 3], (a, i) => {
  console.log(a);
});
// 回调函数的参数index可以不传入，不要写成可选参数
```
当你写回调函数的类型时，不要写一个可选参数，除非你真的打算调用函数的时候不传入参数。

## 函数重载（Function Overloads）
函数在调用的时候可以传入不同数量和类型的参数。
```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3); // error
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```
两个函数重载，一个接受一个参数，另一个接受三个参数。前面两个函数签名被称为重载签名。最后一个兼容签名的函数实现，称之为实现签名（implementation signature），这个签名不能被直接调用。

### 1. 重载签名和实现签名（Overload Signatures and the Implementation Signature）
写进函数体的签名对外部来说是“不可见”的，也就意味着“看不到”它的签名。

而且实现签名必须和重载签名必须兼容（compatible）。
```typescript
// 错误写法
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
// This overload signature is not compatible with its implementation signature.
function fn(x: boolean) {}

// 正确写法
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
// This overload signature is not compatible with its implementation signature.
function fn(x: string | number) {
  return "oops";
}
```
尽可能的使用联合类型替代重载。

## 其他类型
### 1. void
表示一个函数并不会返回任何值。

### 2. object
表示任何不适原始类型（primitive）的值。

### 3. unknown
可以表示任何值。与any类型，但是对unknown类型的值做任何事情都是不合法的。
```typescript
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
  // Object is of type 'unknown'.
}
```

可以描述一个函数返回一个不知道什么类型的值
```typescript
function safeParse(s: string): unknown{
    return JSON.parse(s);
}
```

### 4. never
一些函数从来不返回值。表示一个值不会再观察到。
```typescript
function fail(msg: string): never {
  throw new Error(msg);
}
```
作为一个返回值时，它小时这个函数会丢一个异常，或者会结束程序的执行。

## 剩余参数（Rest Parameters And Arguments）
parameters 表示我们定义函数时设置的名字即形参。

arguments 表示我们实际传入函数的参数即实参。

### 1. 剩余参数（Rest Parameters）
定义一个可以传入数量不受限制的函数参数的函数
```typescript
function multiply(n: number, ...m: number[]){
return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```
剩余参数的类型被隐式设置为`any[]`而不是`any`。如果设置具体的类型必须为`Array<T>`或者`T[]`， 或者元组类型（tuple type）。

### 2. 剩余参数（Rest Arguments）
```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2); 
```
注意：Typescript并不会假定数组是不变的（immutable）。
```typescript
// 类型被推断为 number[] -- "an array with zero or more numbers",
// not specifically two numbers
const args = [8, 5];
const angle = Math.atan2(...args);
// A spread argument must either have a tuple type or be passed to a rest parameter.

// 修复
// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```
通过as const语法将其变为只读元组。

## 参数结构（Parameter Desctructuring）
```typescript
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}

// 也可以写成
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```
