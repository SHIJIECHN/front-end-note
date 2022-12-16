---
autoGroup-3: Typescript
sidebarDepth: 3
title: 实战练习-medium
---

## Get Return Type
不使用 ReturnType 实现 TypeScript 的 `ReturnType<T>` 泛型。
```typescript
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}

type a = MyReturnType<typeof fn> // should be "1 | 2"
```
```typescript
type MyReturnType<T> = T extends (...args: any) => infer R ? R : never
```

## Omit
不使用 Omit 实现 TypeScript 的 `Omit<T, K>` 泛型。

Omit 会创建一个省略 K 中字段的 T 对象。
```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```
```typescript
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P]
}

type Exclude<T, U> = T extends U ? never : T
// 更优雅的答案
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
```
总结：
1. 三元判断还可以写在Key位置
2. 只要P in keyof T写出来了，后面怎么写都无法将这个Key抹去

## Readonly2
实现一个通用`MyReadonly2<T, K>`，它带有两种类型的参数T和K。

K指定应设置为Readonly的T的属性集。如果未提供K，则应使所有属性都变为只读，就像普通的`Readonly<T>`一样
```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
```
```typescript
type MyReadonly2<T, K extends keyof T = keyof T> = Readonly<Pick<T, K>> & Omit<T, K>;

// cases
interface Todo {
  title: string
  description: string
  completed: boolean
}

type todo = MyReadonly2<Todo, 'title' | 'description'>
// interface todo {
//   readonly title: string
//   readonly description: string
//   completed: boolean
// }
```
总结：
1. readonly必须定义在Key位置，但是在这个位置没法做三元判断。

## Deep Readonly
实现一个通用的`DeepReadonly<T>`，它将对象的每个参数及其子对象递归地设为只读。

您可以假设在此挑战中我们仅处理对象。数组，函数，类等都无需考虑。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。

例如
```ts
type X = { 
  x: { 
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = { 
  readonly x: { 
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey' 
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```
```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function
  ? T[K]
  : T[K] extends Object
  ? DeepReadonly<T[K]>
  : T[K]
}
```
总结：
1. 判断是否是对象：`T extends Object` 或者 `T extends Record<string, any>`
2. 递归的使用

## Tuple to Union
实现泛型`TupleToUnion<T>`，它返回元组所有值的合集。
  
例如

```ts
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```
```typescript
type TupleToUnion<T extends any[]> = T[number]
```
总结：
1. 元组类型使用number获取到元素

## Chainable Options
在 JavaScript 中我们经常会使用可串联（Chainable/Pipeline）的函数构造一个对象，但在 TypeScript 中，你能合理的给它赋上类型吗？

你可以使用任意你喜欢的方式实现这个类型 - Interface, Type 或 Class 都行。你需要提供两个函数 `option(key, value)` 和 `get()`。在 `option` 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 `get` 获取最终结果。

例如

```ts
declare const config: Chainable

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get()

// 期望 result 的类型是：
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

你只需要在类型层面实现这个功能 - 不需要实现任何 TS/JS 的实际逻辑。

你可以假设 `key` 只接受字符串而 `value` 接受任何类型，你只需要暴露它传递的类型而不需要进行任何处理。同样的 `key` 只会被使用一次。

```typescript
type Chainable<R = {}> = {
  option: <K extends string, V>(key: K extends keyof R ? never : K, value: V) => Chainable<Omit<R, K> & {
    [P in K]: V
  }>
  get: () => R
}
```
总结：
1. 实现连续调用，必须要返回类型本身
2. 需要使用Omit，是为了去掉已存在的K类型。
3. 如何描述一个对象仅包含一个Key值，这个值为泛型K呢？
```typescript
[P in K] : V
```

## Last of Array
实现一个通用`Last<T>`，它接受一个数组`T`并返回其最后一个元素的类型。
  
例如

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```
```typescript
type Last<T> = T extends [...infer R, infer Q] ? Q : never;
```
总结：
1. 遇到数组想到infer与扩展运算符

## Pop
实现一个通用`Pop<T>`，它接受一个数组`T`，并返回一个由数组`T`的前length-1项以相同的顺序组成的数组。

例如

```ts
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```
```typescript
type Pop<T> = T extends [...infer Q, infer P] ? Q : never
```
总结：
1. 数组的方法：push、concat、shift、unshift、pop等方法都用这种方法。

## Promise.all
键入函数`PromiseAll`，它接受PromiseLike对象数组，返回值应为`Promise<T>`，其中`T`是解析的结果数组。

```ts
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const)
```
```typescript
// 判断是不是Promise，如果是Promise则返回Promise的值类型
type UnpromisifyType<PromiseType> = PromiseType extends Promise<infer ReturnType> ? ReturnType : PromiseType

declare function PromiseAll<Values extends any[]>(values: readonly [...Values]): Promise<{
  [Key in keyof Values]: Values[Key] extends Promise<infer PromiseType> ? PromiseType : UnpromisifyType<Values[Key]>
}>
```
总结：
1. 获取Promise的返回值类型。
2. `{ [K in keyof T]: T[K] }` 能同时兼容元组、数组与对象类型.

