---
autoGroup-3: Typescript
sidebarDepth: 3
title: 实战练习-easy
---

## 1. Pick
Implement the built-in `Pick<T, K>` generic without using it.
  
Constructs a type by picking the set of properties `K` from `T`

For example:

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
Implement the built-in `Readonly<T>` generic without using it.

Constructs a type with all properties of T set to readonly, meaning the properties of the constructed type cannot be reassigned.

For example:

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
type First<T extends any[]> = T extends never[] ? never : T[0]
```
总结：
1. 边界条件：空数组，空数组返回never

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

## Exclude
Implement the built-in Exclude<T, U>

> Exclude from T those types that are assignable to U

For example:

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```
```typescript
/* _____________ Your Code Here _____________ */

type MyExclude<T, U> = T extends U? never : T
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
总结：考察infer的使用，以及条件判断

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
总结：条件类型使用

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
总结：T 就是传入进去的元素

## includes
Implement the JavaScript `Array.includes` function in the type system. A type takes the two arguments. The output should be a boolean `true` or `false`.

For example:

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```