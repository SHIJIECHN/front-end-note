---
autoGroup-3: Typescript
sidebarDepth: 3
title: 实战练习-medium
---

## Get Return Type
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

## Readonly2
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
type MyReadonly2<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>

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

```javascript

```