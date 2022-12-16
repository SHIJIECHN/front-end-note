---
autoGroup-1: Typescript
sidebarDepth: 3
title: 映射类型
---

## 映射类型（Mapping Types）
一个类型需要基于另一个类型，但是又不想拷贝一份，这时可以考虑使用映射类型。

映射类型建立在索引签名的语法上。
```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean
}

type FeatureFlags = {
  darkMode: ()=> void;
  newUserProfile: () => void;
}

type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = {
//   darkMode: boolean;
//   newUserProfile: boolean
// }
```
OptionsFlags遍历Type所有的属性，然后设置为布尔类型。   

## 映射修饰符（Mapping Modifiers）
使用映射类型时，有两个额外的修饰符：readonly（只读）、？（可选）。

也可以通过前缀（-）或（+）删除或添加这些修饰符。
```typescript
// 删除属性中的只读属性
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

type LockedAccount = {
  readonly id: string;
  readonly name: string;
  age: number;
}

type UnlockedAccount = CreateMutable<LockedAccount>;

// type UnlockedAccount = {
//     id: string;
//     name: string;
//     age: number;
// }
```
```typescript
// 删除属性中的可选属性
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
}

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
}

type User = Concrete<MaybeUser>;

// type User = {
//     id: string;
//     name: string;
//     age: number;
// }
```
## 通过as实现键名重新映射（Key Remapping via as）
利用模板字面量类型，基于之前的属性名创建一个新的属性名
```typescript
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;

// type LazyPerson = {
//    getName: () => string;
//    getAge: () => number;
//    getLocation: () => string;
// }
```
也可以利用条件类型返回一个never从而过滤某些属性
```typescript
// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};
 
interface Circle {
    kind: "circle";
    radius: number;
}
 
type KindlessCircle = RemoveKindField<Circle>;

// type KindlessCircle = {
//    radius: number;
// }
```
也可以遍历任何联合类型，不仅仅是string | number | symbol这种联合类型
```typescript
type EventConfig<Events extends {kind: string}> = {
  [E in Events as E["kind"]]: (event: E) => void;
}

type SquareEvent = { kind: 'square', x: number, y: number};
type CircleEvent = { kind: 'circle', radius: number};

type Config = EventConfig<SquareEvent | CircleEvent>;

// type Config = {
//     square: (event: SquareEvent) => void;
//     circle: (event: CircleEvent) => void;
// }
```

## 总结
1. 通过前缀删除或添加属性修饰符
2. 通过as过滤某些属性