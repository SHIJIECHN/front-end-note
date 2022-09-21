---
autoGroup-1: Typescript
sidebarDepth: 3
title: 条件类型
---

## 条件类型（Conditional Types）
条件类型就是用来帮助我们描述输入类型和输出类型之间的关系
```typescript
interface Animal{
  live(): void
}

interface Dog extends Animal{
  woof(): void
}

type Examples1 = Dog extends Animal ? number : string
// type Examples1 = number

type Examples2 = RegExp extends Animal ? number : string;
// type Examples2 = string
```
实例： 使用函数重载，描述createLabel是如何基于输入值的类型不同而做出不同的决策，返回不同的类型
```typescript
interface IdLabel{
  id: number;
}

interface NameLabel{
  name: string;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```
使用条件类型简化掉函数重载
```typescript
interface IdLabel{
  id: number;
}

interface NameLabel{
  name: string;
}

// 条件类型
type NameOrId<T extends number | string> = T extends number 
  ? IdLabel 
  : NameLabel;

// 简化函数重载
function createLabel<T extends number | string>(idOrName: T): NameOrId<T>{
  throw "unimplemented";
}

let a = createLabel("typescript");
// let a: NameLabel

let b = createLabel(2.8);
// let b: IdLabel

let c = createLabel(Math.random() ? "hello" : 42);
// let c: IdLabel | NameLabel
```

## 条件类型约束（Conditional type Constraints)
```typescript
type MessageOf<T> = T['message'];
// Type '"message"' cannot be used to index type 'T'

// 约束 T
type MessageOf<T extends {message: unknown}> = T["message"];

interface Email{
  message: string
}

type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string
```
再使用条件类型
```typescript
type MessageOf<T> = T extends {message: unknown}?T["message"]: never;

interface Email{
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string

type DogMessageContents = MessageOf<Dog>;
// type DogMessageContents = never
```
案例：Flatten类型，用于获取数组元素的类型，当传入的不是数组，则直接返回传入的类型
```typescript
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>;
// type Str = string

type Num = Flatten<number>;
// type Num = number;
```

## 在条件类型里推断（Inferring Within Conditional Types）
infer关键词：可以从正在比较的类型中推断类型，然后再true分支里引用该推断结果。