---
autoGroup-1: Typescript
sidebarDepth: 3
title: Utility Types
---


## Utility Types
TS内置额实用类型，用于类型转换。

## 1.Partial
将传入的T类型所有属性设置为可选

### 1.1 实现
```typescript
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```
Partial仅接收一个泛型参数T。Partial\<T>是如何类型转化呢？
1. 遍历入参T，获得每一对key，value
2. 将每一对中的key变为可选，即添加?
3. 希望得到的是由key，value组成的新类型

#### keyof
keyof 是索引类型查询操作符，keyof作用域泛型T上来获取泛型T上所有public属性名构成的联合类型。
```typescript
interface Dogs{
    dogName: string
    dogAge: number
    dogKind: string
}
type DogsKey = keyof Dogs 
// 等同于 type DogsKey = "dogName" | "dogAge" | "dogKind"
```
#### in
映射类型。遍历Dogs，其语法为\[P in keys]
- P：类型变量，一次绑定到每个属性上，对应每个属性名的类型
- keys：字符串字面量构成的联合类型，表示一组属性名

#### T\[P]
如何获取属性名对应的属性值类型呢？使用索引访问操作符T\[P]。其中“中括号”中的P与\[P in keyof T]中的P相对应。
```typescript

```

### 1.2 用法

### 1.3 场景