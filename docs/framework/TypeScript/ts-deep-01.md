---
autoGroup-2: Typescript
sidebarDepth: 3
title: 工具类型
---


## 1. Partial\<Type>
将Type下的所有属性设置为可选属性
```typescript
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```
```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>){
  return { ...todo, ...fieldsToUpdate};
}

const todo1  = {
  title: 'organize desk',
  description: 'clear clutter',
}

const todo2 = updateTodo(todo1, {
  description: 'throw out trash',
})

console.log(todo2);
// {
//   "title": "organize desk",
//   "description": "throw out trash"
// } 
```

## 2. Required\<Type>
将Type下面的所有属性全部设置为必填的类型。
```typescript
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```
```typescript
interface Props {
  a?: number;
  b?: number;
}

const obj: Props = {
  a: 5
}
const obj2: Required<Props> = {
  a: 5
}
// Property 'b' is missing in type '{ a: number; }' but required 
// in type 'Required<Props>'.
```

## 3. Readonly\<Type>
将属性全部设置为只读属性
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```
```typescript
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
}

todo.title = "Hello";
// Cannot assign to 'title' because it is a read-only property.
```

## 4. Record\<Keys, Type>
基于一个联合类型构造出一个新类型，其属性键为Keys，属性值为Type
```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```
将K中的每个属性，都转为T类型
```typescript
interface Dogs{
  dogName: string
  dogAge: number
  dogKind: string
}

type KeyofDogs = keyof Dogs // "dogName" | "dogAge" | "dogKind"

type StringDogs = Record<KeyofDogs, string>

// 等同于
type StringDogs = {
  dogName: string
  dogAge: string
  dogKind: string
}


// 使用
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: {age: 10, breed: 'Persian'},
  boris: {age: 5, breed: "Manie Coon"},
  mordred: {age: 16, breed: "Birtish Shorthair"}
}
```
## 5. Pick\<Type, Keys>
从Type中挑选一些属性Keys（Keys是字符串字面量或者字符串字面量的联合类型）
```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```
```typescript
interface Dogs {
  dogName: string;
  dogAge: number;
  dogKind: string;
}

// 联合类型
type NameAndAge = Pick<Dogs, "dogName" | "dogAge"> 
// type NameAndAge = {
//     dogName: string;
//     dogAge: number;
// }

// 单个字符串类型
type DogKind = Pick<Dogs, "dogKind">;
// type DogKind = {
//     dogKind: string;
// }

interface Todo {
  title: string;
  description: string,
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">
// type TodoPreview = {
//     title: string;
//     completed: boolean;
// }
```

## 6. Omit\<Type, Keys>
从Type中过滤一些属性Keys。
```typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
```
- Exclude\<keyof T, K>: keyof T 即T的所有键构成的联合类型， 由Exclude得到一个keyof T剔除掉和K交集的部分形成的联合类型。

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;
// type TodoPreview = {
//     title: string;
//     completed: boolean;
//     createdAt: number;
// }

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 13777777777,
}

todo; // const todo: TodoPreview

type TodoInfo = Omit<Todo, "completed"|"createdAt">;
// type TodoInfo = {
//     description: string;
//     title: string;
// }

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kingergarten closes at 5pm",
}

todoInfo; // const todoInfo: TodoInfo
```

## 7. Exclude\<UnionType, ExcludedMembers>
从UnionType联合类型中排除所有可以赋给ExcludedMembers的类型
```typescript
type Exclude<T, U> = T extends U ? never : T;
```
```typescript
type T0 = Exclude<"a" | "b" | "c", "a">
// type T0 = "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "c">
// type T1 = "b"

type T2 = Exclude<string| number | (()=> void), Function>;
// type T2 = string | number
```

## 8. Extract\<Type, Union>
从Type中提取所有可以赋给Union的类型
```typescript
type Extract<T, U> = T extends U ? T : never;
```
```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "c">
// type T0 = "a" | "c"

type T1 = Extract<string | number| (()=> void), Function>
// type T1 = () => void
```

## 9. NonNullable\<Type>
从Type中踢除null、undefined类型
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
```
```typescript
type T0 = NonNullable<string | number | undefined>
// type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>
// type T1 = string[]
```

## 10. Parameters\<Type>
将Type中函数类型的参数构造一个元组类型
```typescript
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```
```typescript
declare function f1(arg: {a: number; b: string}): void;

type T0 = Parameters<() => string>
// type T0 = []

type T1 = Parameters<(s: string) => void>
// type T1 = [s: string]

type T2 = Parameters<<T>(arg: T) => T>
// type T2 = [arg: unknown]

type T3 = Parameters<typeof f1>
// type T3 = [arg: {
//     a: number;
//     b: string;
// }]

type T4 = Parameters<any>
// type T4 = unknown[]

type T5 = Parameters<never>
// type T5 = never

type T6 = Parameters<string>
// Type 'string' does not satisfy the constraint '(...args: any) => any'
// type T6 = never

type T7 = Parameters<Function>
// Type 'Function' does not satisfy the constraint '(...args: any) => any'
// type T7 = never
```

## 11. ConstructorParameters\<Type>
从构造函数类型Type的参数类型构造元组或数组类型（如果Type不是函数，则为never）
```typescript
type T0 = ConstructorParameters<ErrorConstructor>;
// type T0 = [message?: string | undefined]

type T1 = ConstructorParameters<FunctionConstructor>
// type T1 = string[]

class Dog {
  private dogAge: number;
  private dogName: string;
  private dogKind: string;
  constructor(dogAge: number, dogKind: string){
    this.dogAge = dogAge;
    this.dogKind = dogKind;
  }
}

type DogGaveBirth = ConstructorParameters<typeof Dog>
// type DogGaveBirth = [dogAge: number, dogKind: string]
```

## 12. ReturnType\<Type>
构造一个含有Type函数的返回值的类型
```typescript
declare function f1(): {a: number, b: string};

type T0 = ReturnType<() => string>
// type T0 = string

type T1 = ReturnType<(s:string) => void>
// type T1 = void

type T2 = ReturnType<<T>() => T>
// type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>
// type T3 = number[]

type T4 = ReturnType<typeof f1>
// type T4 = {
//     a: number;
//     b: string;
// }
```

## 13. InstanceType\<Type>
构造一个由所有Type的构造函数的实例类型组成的类型
```typescript
class C{
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>
// type T0 = C

class Dog {
  private dogAge: number;
  private dogName: string;
  private dogKind: string;
  constructor(dogAge: number, dogKind: string){
    this.dogAge = dogAge;
    this.dogKind = dogKind;
  }
}

type DogGaveBirth = InstanceType<typeof Dog>
// type DogGaveBirth = Dog
```
InstanceType 与 ReturnType的区别是它多了构造签名，与ConstructorParameters的区别是它推断的不是参数类型，而是返回值类型。

## 14. ThisParameterType\<Type>
提取函数声明的this类型
```typescript
function toHex(this:number){
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>){
  // (parameter) n: number
  return toHex.apply(n)
}

interface Dog {
  voice: {
    bark(): void;
  }
}

function dogBark(this: Dog){
  this.voice.bark();
}
// dogBark调用
declare const dog: Dog;

dogBark.call(dog)
```
## 15. OmitThisParameter\<Type>
类似于把可选属性的属性修饰符？给去掉，为了去掉这个修饰符，TS专门提供了一种方式，而OmitThisParameter是用TS已有的其他方式来对this进行剔除。
```typescript
function toHex(this: Number){
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
// const fiveToHex: () => string

console.log(fiveToHex()); // "5"
```