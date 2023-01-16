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
-----------或者------------
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [P in K]: T[P] 
} & {
  [E in Exclude<keyof T, K>]: T[E]
}

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

假设我们仅处理对象。数组，函数，类等都无需考虑。

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
  readonly [P in keyof T]: T[P] extends object 
    ? (T[P] extends Function? T[P] : DeepReadonly<T[P]>) 
    : T[P];
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
1. 元组类型使用number获取到元素。`T[number]`可以访问数组的每一项。

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
type Pop<T> = T extends [...infer Q, infer P] ? Q : []
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
2. `{ [K in keyof T]: T[K] }` 能同时兼容元组、数组与对象类型。对于数组使用`[P in keyof T]` P是索引
```typescript
const arr = ['a', 'b', 'c', 1];
type isArr<T> = {
  [P in keyof T]: T[P]
}
type a1 = isArr<typeof arr>; // a1 = (string | number)[]
// 获得的是数组元素的类型
```

## Type Lookup
根据某个属性在联合类型中查找类型。

通过在联合类型Cat | Dog中搜索公共type字段来获取相应的类型。换句话说，在以下示例中，我们期望`LookUp<Dog | Cat, 'dog'>`获得Dog，`LookUp<Dog | Cat, 'cat'>`获得Cat。

```typescript
type LookUp<U extends { type: any }, T extends U['type']> = U extends { type: T } ? U : never

interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDog = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```
总结：
1. 泛型处使用`U extends { type: any }`和`T extends U['type']`，直接限定传入参数类型
2. 之前定义的泛型 U 可以直接被后面的新泛型使用

## Trim Left
实现 `TrimLeft<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。

```typescript
type TrimLeft<T extends string> = T extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : T

type trimed = TrimLeft<'  Hello World  '> // expected to be 'Hello World  '
```

总结：
1. 关键是使用infer在字符串内进行推导。

## Trim
实现Trim<T>，它是一个字符串类型，并返回一个新字符串，其中两端的空白符都已被删除。

```typescript
// 方法一
type Trim<S extends string> = TrimLeft<TrimRight<S>>
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S;
type TrimRight<S extends string> = S extends `${infer R}${' ' | '\n' | '\t'}` ? TrimRight<R> : S;

// 方法二
type Trim<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}`|`${infer R}${' ' | '\n' | '\t'}` ? Trim<R> : S;
```
总结：
1. extends后面还可以跟联合类型，这样任意一个匹配都会走到`Trim<R>`递归里

## Captalize
实现 `Capitalize<T>` 它将字符串的第一个字母转换为大写，其余字母保持原样。

```typescript
type MyCapitalize<S extends string> = S extends `${infer F}${infer E}` ? `${Uppercase<F>}${E}` : S;

type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```
总结：
1. 需要分割字符串、数组时，使用infer

## Replace
实现 `Replace<S, From, To>` 将字符串 S 中的第一个子字符串 From 替换为 To 。

```typescript
type Replace<S extends string, From extends string, To extends string> = 
  From extends '' 
  ? S 
  : (S extends `${infer A}${From}${infer B}` ? `${A}${To}${B}` : S);

type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'
```

总结：
1. 字符串分段：`${infer A}${From}${infer B}`
```typescript
// 1. S extends `${infer A}${infer B}` A是第一个元素，B是剩余的元素
type Replace<S extends string, From extends string, To extends string> = S extends `${infer A}${infer B}` ? `${A}`: S;
type a1 = Replace<'foobar', 'bar', 'foo'>; //  type a1 = 'f'

// 2. S extends `${infer A}${From}${infer B}` A是From字符串前面的部分，B是剩余的后面的部分
type Replace<S extends string, From extends string, To extends string> = S extends `${infer A}${From}${infer B}` ? `${A}`: S;
type a2 = ReplaceAll<'foobar', 'bar', 'foo'>; // type a2 = 'foo'
```

## ReplaceAll
实现 ReplaceAll<S, From, To> 将一个字符串 S 中的所有子字符串 From 替换为 To。

```typescript

type ReplaceAll<S extends string, From extends string, To extends string> = 
  From extends '' 
  ? S 
  :(S extends `${infer A}${From}${infer B}` 
    ? (From extends '' ? `${A}${To}${B}` : `${A}${To}${ReplaceAll<B, From, To>}`)
    : S
  );

type replaced = ReplaceAll<'t y p e s', ' ', ''> // 期望是 'types'
```

## Append Argument
实现一个泛型 `AppendArgument<Fn, A>`，对于给定的函数类型 Fn，以及一个任意类型 A，返回一个新的函数 G。G 拥有 Fn 的所有参数并在末尾追加类型为 A 的参数。

```typescript
type AppendArgument<F, A> = F extends (...args: infer T) => infer R ? (...args: [...T, A]) => R : F;


type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> 
// expected be (a: number, b: string, x: boolean) => number
```

## Permutation
实现 Permutation 类型，将联合类型替换为可能的全排列

```typescript
type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']

type Permutation<T, U = T> = [T] extends [never] ? [] : T extends U ? [T, ...Permutation<Exclude<U, T>>] : []
```
总结：
为什么要用 `[T] extends [never]` 而不是 `T extends never` 呢？
```typescript
type X = never extends never ? 1 : 0 // 1

type Custom<T> = T extends never ? 1 : 0
type Y = Custom<never> // never
```
为什么用泛型后输出就变成 never 了呢？原因是TS在做T extends never时，会对联合类型进行分配，此时有一个特例，即当T = never时，会跳过分配直接返回T本身，所以三元判断代码实际上没有执行。`[T] extends [never]` 这种写法可以避免 TS 对联合类型进行分配，继而绕过上面的问题。

## Length of String
计算字符串的长度，类似于 String#length.

```typescript
type LengthOfString<S, N extends any[] = []> = S extends `${infer F}${infer E}` ? LengthOfString<E, [...N, F]> : N['length'];

type len = LengthOfString<'kumiko'> // 6
```
思路就是，每次把字符串第一个字母拿出来放到数组N的第一项，直到字符串被取完，直接拿此时的数组长度。

总结：
1. TS访问数组类型的`[length]`属性可以拿到长度：`['a', 'b', 'c']['lenght']`为3
2. infer指代字符串时，第一个指代指向第一个字母，第二个指向其余所有字母
```typescript
'abc' extends `${infer S}${infer E}` ? S : never // a
```
3. 递归时如果需要存储临时变量，用泛型默认值来存储。

## Flatten
写一个接受数组的类型，并且返回扁平化的数组类型。

```typescript
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]


type Flatten<T extends any[], Result extends any[] = []> = 
  T extends [infer Start, ...infer Rest] 
    ? (Start extends any[] ? Flatten<Rest, [...Result, ...Flatten<Start>]> : Flatten<Rest, [...Result, Start]>)
    : Result;
```
Result存储打平后的结果，每次拿到数组第一个值，如果第一个值不是数组，则直接存进去继续递归，此时T就是剩余的Rest；如果第一个值数数组，则将其打平。关键点是 ...Start 打平后依然可能是数组，所以需要`...Flatten<Start>`。

```typescript
(Start extends any[] ? Flatten<Rest, [...U, ...Flatten<Start>]> : Flatten<Rest, [...U, Start]>)
```
主要是为了区分Start是不是数组，如果是，则需要使用递归放到结果中，如果不是就直接拼接。

## Append to object
实现一个为接口添加一个新字段的类型。该类型接收三个参数，返回带有新字段的接口类型。

```typescript
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }


type AppendToObject<T, U extends string | number | symbol, V> = {
  [P in (keyof T) | U]: P extends keyof T ? T[P] : V
}
```

## Absolute
实现一个接收string,number或bigInt类型参数的Absolute类型,返回一个正数字符串。

```typescript
type Test = -100;
type Result = Absolute<Test>; // expected to be "100"

type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer R}` ? `${R}` : `${T}`
```

总结：
1. 为什么不用 T extends 来判断呢？因为 T 是数字，这样写无法匹配符号的字符串描述。
2. T为数字转为字符串：T -> `${T}`

## String to Union
实现一个将接收到的String参数转换为一个字母Union的类型。

```typescript
type Test = '123';
type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"

type StringToUnion<T extends string, P = never> = T extends `${infer F}${infer R}` ? StringToUnion<R, P | F> : P;
```

## Merge
将两个类型合并成一个类型，第二个类型的键会覆盖第一个类型的键。

```ts
type foo = {
  name: string;
  age: string;
}

type coo = {
  age: number;
  sex: string
}

type Result = Merge<foo,coo>; // expected to be {name: string, age: number, sex: string}

type Merge<F extends object, S extends object> = {
  [P in keyof F | keyof S]: P extends keyof S ? S[P]: (P extends keyof F ? F[P]: never) 
}
```

## KebabCase
FooBarBaz -> foo-bar-baz

```typescript
type FooBarBaz = KebabCase<"FooBarBaz">;
const foobarbaz: FooBarBaz = "foo-bar-baz";

type DoNothing = KebabCase<"do-nothing">;
const doNothing: DoNothing = "do-nothing";


type KebabCase<S, U extends string = ''> = S extends `${infer F}${infer R}` ? (
  Lowercase<F> extends F ? KebabCase<R, `${U}${F}`> : KebabCase<R, `${U}-${Lowercase<F>}`>
) : RemoveFirstHyphen<U>;

// 把字符串第一个 - 去掉即可
type RemoveFirstHyphen<S> = S extends `-${infer Rest}` ? Rest extends '' ? S : Rest : S
// 如果Rest是空字符串，说明S是字符串‘-’，则返回S自身，否则返回Rest
```

## Diff
获取两个接口类型中的差值属性。

```typescript
type Diff<A, B> = {
  [P in Exclude<keyof A, keyof B> | Exclude<keyof B, keyof A>]:  P extends keyof A ? A[P] : (P extends keyof B ? B[P] : never)
}

type Foo = {
  a: string;
  b: number;
}
type Bar = {
  a: string;
  c: boolean
}

type Result1 = Diff<Foo,Bar> // { b: number, c: boolean }
type Result2 = Diff<Bar,Foo> // { b: number, c: boolean }
```
总结：
1. `Exclude<X, Y>`：存在于X不存在于Y

## AnyOf
类型接收一个数组，如果数组中任一个元素为真，则返回 true，否则返回 false。如果数组为空，返回 false。

```typescript
// 假值
type Falsy = '' | false | undefined | null | 0 | [] | never | Record<PropertyKey, never>
type AnyOf<T extends readonly any[]> = T extends Falsy[] ? false : true

type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
```
总结：
1. 主要类型空对象的表达方式：`{} -> Record<PropertyKey, never>`
2. { a: 1 } extends {} 结果为真，因为 {} 并不表示空对象，而是表示所有对象类型

## IsNever
判断泛型是不是never，如果是就返回true，不是就返回false
```typescript
type IsNever<T> = [T] extends [never]? true : false

type A = IsNever<never>  // expected to be true
type B = IsNever<undefined> // expected to be false
type C = IsNever<null> // expected to be false
type D = IsNever<[]> // expected to be false
type E = IsNever<number> // expected to be false
```

总结：
1. never在泛型中不会触发extends判断，而是直接终结，致使判断无效。

## IsUnion
判断泛型T是否为联合类型，是就返回true，否则返回false。

```typescript
// 先判断A是不是never，是never返回true，不是never继续执行
type IsUnion<A, B = A> = 
  isNever<A> extends true 
    ? false 
    : ( A extends A 
        ? (
          [B] extends [A] ? false : true
        )
        : false
    );

type case1 = IsUnion<string>  // false
type case2 = IsUnion<string|number>  // true
type case3 = IsUnion<[string|number]>  // false
```
总结：
1. 联合类型的两个特征
   1. 在TS处理泛型为联合类型时进行分发处理，即将联合类型拆解为独立项一一进行判定，最后再用 | 连接
   2. 用 `[]` 包裹联合类型可以规避分发的特性
2. 如果泛型进行了分发就可以判断是联合类型，判断是否分发：
```typescript
// A 是 1 | 2
A extends A
// 分发结果为（1 extends 1 | 2）| （2 extends 1 | 2）
// 第一个A都是联合类型中的某一项分别为1和2，第二个A一直是 1 | 2。使用 [] 包裹后可以判断与原始值是否相等，匹配不上，就说明产生了分发
[A] extends [A] ? false : true
```
3. `type<X> = T extends ...`中extends前面的T不一定是传入的T，如果是联合类型的话，会分发为单个类型分别处理


## ReplaceKeys
实现 `ReplaceKeys<Obj, Keys, Targets>` 将 Obj 中每个对象的 `Keys` Key 类型转化为符合 Targets 对象对应 Key 描述的类型，如果无法匹配到 Targets 则类型置为 never：

```typescript
type ReplaceKeys<Obj, Keys, Targets> = {
  [K in keyof Obj] : K extends Keys ? (
    K extends keyof Targets ? Targets[K] : never
  ) : Obj[K]
}

type NodeA = {
  type: 'A'
  name: string
  flag: number
}

type NodeB = {
  type: 'B'
  id: number
  flag: number
}

type NodeC = {
  type: 'C'
  name: string
  flag: number
}


type Nodes = NodeA | NodeB | NodeC

type ReplacedNodes = ReplaceKeys<Nodes, 'name' | 'flag', {name: number, flag: string}> 
// {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} 
// would replace name from string to number, replace flag from number to string.

type ReplacedNotExistKeys = ReplaceKeys<Nodes, 'name', {aa: number}> 
// {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} 
// would replace name to never
```

## Remove Index Signature
实现 `RemoveIndexSignature<T>` 把对象 `<T>` 中 Index 下标移除：

```typescript
type RemoveIndexSignature<T> = {
  [P in keyof T as P extends `${infer R}` ? R : never]: T[P]
}

type Foo = {
  [key: string]: any;
  foo(): void;
}

type A = RemoveIndexSignature<Foo>  // expected { foo(): void }
```

总结：
1. 如何表示索引下标？也可以转换为如何识别字符串Key。使用`${infer R}`

