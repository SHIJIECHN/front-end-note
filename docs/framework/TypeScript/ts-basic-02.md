---
autoGroup-1: Typescript
sidebarDepth: 3
title: 常见类型、类型收窄
---

## tsconfig.js配置
- 报错时仍产出文件： noEmitOnError: false。
- 严格模式：strict: true 或者分开设置noImplicitAny: true, strictNullChecks: true.
- target选项将typescript转换为指定的版本target: es2015.
- 
  
## 原始类型（The primitives）
string，number 和 boolean

## 类型收窄
收窄（narrowing）：将类型推导为更精准类型的过程。

### 1. typeof类型保护
类型保护（type guard)

typeof返回值：number、string、boolean、undefined、object、function、symbol、bigInt。

### 2. 真值收窄（Truthiness narrowing）
隐式类型转换：0、NaN、""、0n、null、undefined转为false，其他的值为true。

&&、||、!、!!：防范null和undefined。

基础类型不要使用真值检查。

### 3. 等值收窄（Equality narrowing）
==、!=、===、!==。用于判断一个值既不是null，也不是undefined。

### 4. in操作符收窄
in操作符可以判断一个对象是否有对应的属性名。value in x

### 5. instanceof收窄
x instanceof Date

### 6. 赋值语句（Assignments）
根据赋值语句的右值收窄。

### 7. 控制流分析
if-else、switch收窄

### 8. 类型判断式（type predicates）
自定义一个类型保护。定义方式是定义一个函数，这个函数返回的类型就是类型判断式。
```typescript
function isFish(pet: Fish | Bird): pet is Fish{
  return (pet as Fish).swim !== undefined;
}

let = getSmallPet();

if(isFish(pet)){
  pet.swim();
}
```
pet is Fish是类型判断式。采用parameterName is Type的形式，parameterName必须是当前函数的参数名。

### 9. 可辨别联合（Discriminated unions）
当联合类型中每个类型都包含一个共同的字面量类型的属性，TS就会认为是一个可辨别联合。可以将具体成员的类型进行收窄。
```typescript
interface Shape{
    kind: 'circle' | 'square';
    radius?: number;
    sideLength?: number;
}

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
		// Object is possibly 'undefined'. 因为radius是可选属性
  }
}
```
1. 使用非空断言（non-null assertion），即shape.radius加一个！表示radius是一定存在的（不合适）
2. 修改类型检车器
```typescript
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;
```

## never类型
如果把所有可能的类型都穷尽了，TS会使用一个never类型表示一个不可能存在的状态。

### 1. 穷尽检查（Echaustiveness checking）
never类型可以赋值给任何类型。但是没有类型可以赋值给never（除了never自身）。


