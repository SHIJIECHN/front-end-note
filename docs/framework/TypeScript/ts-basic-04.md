---
autoGroup-1: Typescript
sidebarDepth: 3
title: Object Types（对象类型）
---

## 对象类型 
在JavaScript中，对数据进行分组和分发的最基础的方式是通过对象。在TypeScript中，我们通过对象类型（object types）来描述对象。

对象类型可以是匿名的：
```typescript
function greet(person: { name: string; age: number}){
  return "Hello "+ person.name;
}
```
