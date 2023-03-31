---
autoGroup-3: Typescript
sidebarDepth: 3
title: 实战练习-easy
---


## 1. Pick
实现 TS 内置的 `Pick<T, K>`，但不可以使用它。

从类型 T 中选择出属性 K，构造成一个新的类型。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```
```typescript
/* _____________ Your Code Here _____________ */

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```
总结：
1. 如何限制 `K` 的取值：`A extends keyof B` 
2. 如何生成一个仅包含 `K` 定义 `Key` 的类型 `[A in keyof B]: B[A]`


## Readonly

不要使用内置的Readonly`<T>`，自己实现一个。

该 Readonly 会接收一个 泛型参数，并返回一个完全一样的类型，只是所有属性都会被 readonly 所修饰。

也就是不可以再对该对象的属性赋值。

```ts
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```
```typescript
/* _____________ Your Code Here _____________ */

type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
```
总结：
1. `[A in keyof B]:B[A]` 给我们描述每一个Key属性细节的机会
2. 扩展Key设定为可选：`[A in keyof B]?: B[A]`

## Tuple to Object
Give an array, transform into an object type and the key/value must in the given array.

For example:

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```
```typescript
/* _____________ Your Code Here _____________ */

type TupleToObject<T extends readonly any[]> = {
  [P in T[number]]:P
}
```
总结：考察数组项类型获取T\[number]

## First of Array
Implement a generic `First<T>` that takes an Array `T` and returns its first element's type.

For example:

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
type T0 = First<[]> // nerve
```
```typescript
/* _____________ Your Code Here _____________ */

type First<T extends any[]> = T extends [] ? never : T[0]
type First<T extends any[]> = T['length'] extends 0 ? never : T[0]
type First<T> = T extends [infer P, ...infer Rest] ? P : never
```
总结：
1. 边界条件：空数组，空数组返回never
2. 第一种写法：extends [] 判斷T是否为空数组，是的话返回never
3. 第二种写法通过长度为0判断空数组。理解两点：1. 可以通过`T['length']`让TS访问到长度值，2. extends 0 表示是否匹配0。
4. 第三种写法理解为如果T形如`<P,...>`那就返回P，否则返回never。

## Length of Tuple
For given a tuple, you need create a generic `Length`, pick the length of the tuple
  
For example:

```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5
```
```typescript
/* _____________ Your Code Here _____________ */

type Length<T extends readonly any[]> = T["length"] 
```
总结：元组和数组都是数组，但元组对TS来说可以观测其长度，`T['length']`对元组来说返回的是具体值，而对数组来说返回的是number

## Exclude
Implement the built-in Exclude`<T, U>`

> Exclude from T those types that are assignable to U

For example:

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```
```typescript
/* _____________ Your Code Here _____________ */

type MyExclude<T, U> = T extends U ? never : T
```
总结：TS对联合类型的执行是分配律的，即
```typescript
Exclude<'a'|'b', 'a'|'c'>
// 相当于
Exclude<'a', 'a'| 'c'> | Exclude<'b', 'a'|'c'>
```

## Awaited
If we have a type which is wrapped type like Promise. How we can get a type which is inside the wrapped type?

For example: if we have `Promise<ExampleType>` how to get ExampleType?

```ts
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```
```typescript
/* _____________ Your Code Here _____________ */

type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer Type> 
  ? Type extends Promise<unknown> 
    ? MyAwaited<Type>
    : Type
  : never;


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>
type Z1 = Promise<Promise<Promise<string | boolean>>>

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>,
  Expect<Equal<MyAwaited<Z1>, string | boolean>>,
]

// @ts-expect-error
type error = MyAwaited<number>
```
总结：
1. 关键就是从`Promise<T>`中抽取类型T，适合使用infer做
```typescript
type MyAwaited<T> = T extends Promise<infer U> ? U : never
```
2. TS类型处理可以是递归的


## If
Implement the util type `If<C, T, F>` which accepts condition `C`, a truthy value `T`, and a falsy value `F`. `C` is expected to be either `true` or `false` while `T` and `F` can be any type.

For example:

```ts
type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```
```typescript
/* _____________ Your Code Here _____________ */

type If<C extends boolean, T, F> = C extends true ? T : F


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<If<true, 'a', 'b'>, 'a'>>,
  Expect<Equal<If<false, 'a', 2>, 2>>,
]

// @ts-expect-error
type error = If<null, 'a', 'b'>
```
总结：
1. extends 可以用来判断值 


## Concat
Implement the JavaScript `Array.concat` function in the type system. A type takes the two arguments. The output should be a new array that includes inputs in ltr order

For example:

```ts
type Result = Concat<[1], [2]> // expected to be [1, 2]
```
```typescript
/* _____________ Your Code Here _____________ */

type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Concat<[], []>, []>>,
  Expect<Equal<Concat<[], [1]>, [1]>>,
  Expect<Equal<Concat<[1, 2], [3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Concat<['1', 2, '3'], [false, boolean, '4']>, ['1', 2, '3', false, boolean, '4']>>,
]
```
总结：
1. TS支持数组解构语法

## includes
Implement the JavaScript `Array.includes` function in the type system. A type takes the two arguments. The output should be a boolean `true` or `false`.

For example:

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```
```typescript
type Includes<T extends readonly any[], U> = T extends [infer F, ...infer Rest] 
  ? 
  (Equal<U, F> extends true ? true : Includes<Rest, U>)
  : 
  false 
```
总结：
1. `[number]`下标表示任意一项，而`extends T[number]`就可以实现数组包含的判定
```typescript
type Includes<T extends any[], K> = K extends T[number] ? true : false
// 但是没有解决 true extends Boolean 为 true 的问题
```
2. 如何写Equal函数
```typescript
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) 
      extends  (<T>() => T extends Y ? 1 : 2) 
      ? true : false
```
3. 解构+infer + 递归的方式
4. 每次取数组第一个值判断Equal，如果不匹配则拿剩余项递归判断

## Push
Implement the generic version of ```Array.push```

For example:

```typescript
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```
```typescript
type Push<T extends any[], U> = [...T, U]
/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Push<[], 1>, [1]>>,
  Expect<Equal<Push<[1, 2], '3'>, [1, 2, '3']>>,
  Expect<Equal<Push<['1', 2, '3'], boolean>, ['1', 2, '3', boolean]>>,
]
```

## Unshift
Implement the type version of ```Array.unshift```

For example:

```typescript
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
```
```typescript
/* _____________ Your Code Here _____________ */

type Unshift<T extends any[], U> = [U, ...T]


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Unshift<[], 1>, [1]>>,
  Expect<Equal<Unshift<[1, 2], 0>, [0, 1, 2]>>,
  Expect<Equal<Unshift<['1', 2, '3'], boolean>, [boolean, '1', 2, '3']>>,
]
```

## Parameters
Implement the built-in Parameters`<T>` generic without using it.

For example:

```ts
const foo = (arg1: string, arg2: number): void => {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```
```typescript
/* _____________ Your Code Here _____________ */

type MyParameters<T> = T extends (...args: infer R) => any ? R : never


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const foo = (arg1: string, arg2: number): void => {}
const bar = (arg1: boolean, arg2: { a: 'A' }): void => {}
const baz = (): void => {}

type cases = [
  Expect<Equal<MyParameters<typeof foo>, [string, number]>>,
  Expect<Equal<MyParameters<typeof bar>, [boolean, { a: 'A' }]>>,
  Expect<Equal<MyParameters<typeof baz>, []>>,
]
```
总结：
1. T 是一个函数类型。通过infer R占位参数类型，此时R是一个元组

## 总结
1. 限制A的取值: `A extends keyof B`。显示A的取值是B中的所有key。
2. 生成一个仅包含A定义Key的类型：`[A in keyof B]: B[A]`。
3. 范围限定可以放在泛型中，使用extends。
4. 泛型中给默认值`type MyPick<T, K extends keyof T = keyof T>`,设置默认值`K extends keyof T = keyof T`，在不传入第二个参数时也可以使用。
5. extends限定符也可以用于判断结果判断：T extends []。
6. infer R临时变量可以用于函数参数的类型、函数的返回值、数组的元素类型等
7. `T['length']`对元组来说返回的是具体值，而对数组来说返回的是number
8. 相信TS和JS一样写逻辑，比如扩展运算符使用`[...P]`、支持结构复制的语法、三目运算符递归。对于数组的方法concat、push、unshift等均只用扩展运算符。
9. TS Equal函数的编写
```typescript
declare let x: <T>()=> (T extends number ? 1 : 2);
declare let y: <T>()=> (T extends string ? 1 : 2);

const a = x<string>(); // 'a' is of type '2' because string doesn't extend number
const b = x<number>(); // 'b' is of type '1'

const c = y<string>(); // 'c' is of type '1' because string extend string
const d = y<number>(); // 'd' is of type '2'

y = x;  // 只有number和string完全相同才能赋值成功
// According to type declaration of 'y' we know, that 'e' should be of type '1'
// But we just assigned x to y, and we know that 'x' returns '2' in this scenario
// That's not correct
const e = y<string>(); // 'e' is of type '2'
``` 

