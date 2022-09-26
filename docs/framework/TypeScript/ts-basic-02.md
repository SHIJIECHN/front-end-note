---
autoGroup-1: Typescript
sidebarDepth: 3
title: 工具类型
---


## Utility Types
TS内置的实用类型，用于类型转换。

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
```typescript
type NewType  = {[K in OldType]: NewResultType}

/**
 * type OldType = "key1" | "key2"
 * 
 * NewType 等同于
 * 
 * type NewType = {
 *  key1: NewResultType
 *  key2: NewResultType
 * }
 */
```
- NewType: 用于承载它的类型别名
- K：类型别名，依次绑定到联合类型OldType的每个属性
- OldType：联合类型，包含了要迭代的属性名的集合，与{[key: string]: ResultType}写法相同
- NewResultType：属性的结果集合

#### T\[P]
如何获取属性名对应的属性值类型呢？使用索引访问操作符T\[P]。其中“中括号”中的P与\[P in keyof T]中的P相对应。
```typescript
type DogsKey = Dogs['dogName']; // 得到string类型
```

### 1.2 场景
1. 对象的扩展运算符
```typescript
type State = {
    loading: boolean
    list: Array<any>
    page: number
}

const [state, setState] = useReducer(
    (state: State, nextState: Partial<State>) => {
        return {...state, ...nextState}
    },
    {
        loading: false,
        list: [],
        page: 0
    }
)
```
nextState被传入后，会与原state做合并操作，nextState并不需要含有State类型的所有键，故使用Partial进行类型的定义。

2. 都是非必传参但使用参数时如果没有传则会初始化参数
```typescript
interface Params {
    param1: string
    param2: number,
    param3: Array<string>
}

function testFunction(params: Partial<Params>){
    const requiredParams: Params = {
        param1: params.param1 ?? ""
        param2: params.param2 ?? ""
        param3: params.param3 ?? ""
    }
    return requiredParams
}
```

## 2. Required 
让所有属性都变成必选的
```typescript
type Required<T> = {
    [P in keyof T]-?: T[P]
}
// -? 去除可选属性这一属性修饰符，达到让每个属性都变为必选的目的
```
通过在映射类型的属性修饰符（readonly或 ? ）前面增加 - 或者 + 前缀，表示应删除或添加该修饰符。

--strictNullChecks模式下，如果属性是包含了undefined的联合类型，那么Require也会将undefined移除。

```typescript
interface TestNullCheck {
    testParam?: number | undefined
}

type Test = Required<TestNullCheck> // 得到{ testParam: number }
```

## 3. Readonly
将所有属性变为只读
```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}
```

## 4. Pick
从T类型选择一组属性构造新的类型
```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```
传递两个泛型参数，第一个参数为一个对象类型（或映射类型），第二个参数为第一个参数的键（属性）组成的联合类型（或单个字面量类型），Pick构造的新类型中，属性为第二个参数中的联合类型的所有联合类型成员。
```typescript
interface Dogs {
    dogName: string
    dogAge: number
    dogKind: string
}

// 联合类型
type NameAndAge = Pick<Dogs, "dogName" | "dogAge"> // { dogName: string, dogAge: number}

// 单个字符串类型
type DogKind = Pick<Dogs, "dogKind"> // { dogKind: string}
```
- extends 约束泛型

## 5. Record
基于一个联合类型构造出一个新类型，其属性键为K，属性值为T
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
```
理解keyof any
```typescript
type KeyofAny = keyof any
// 等同于
type KeyofAny = string | number | symbol
```
由string、number或symbol排列组合形成的联合类型、或字面量类型。

可以发 unknown、keyof never，得到的结果都是never

### 5.1 使用场景
策略模式中使用
```typescript
type DogsRecord  = Record<
  "dogKind1" | "dogKind2",
  (currentAge: number) => number
>

function getRestAgeByCurrentAgeAndKinds(
  kind: "dogKind1" | "dogKind2",
  currentAge: number
){
  // 计算不同类型的狗可能的剩余年龄
  const dogsRestAge: DogsRecord = {
    dogKind1: function(currentAge: number){
      return 20 - currentAge;
    },
    dogKind2: function (currentAge: number){
      return 15 - currentAge
    }
  }
  return dogsRestAge[kind](currentAge);
}

getRestAgeByCurrentAgeAndKinds('dogKind1', 1);
```

## 6. Exclude
从T的联合类型成员中排除可分配给类型U的所有联合成员来构造类型
```typescript
type Exclude<T, U> = T extends U ? never : T
```
使用Exclude
```typescript
interface Dogs {
  dogName: string
  dogAge: number
  dogKind: string
}

type KeyofDogs = keyof Dogs // "dogName" | "dogAge" | "dogKind"

type KeysWithoutKind = Exclude<KeyofDogs, "dogKind"> // "dogName" | "dogAge"
```
T extends U ? never : T， T 是一个泛型类型，同时这也是一个条件类型，满足分布条件类型的定义，会由联合类型 T 中的每个联合类型成员依次与 extends 右侧类型进行比对，上面代码中的 KeyofDogs 是一个联合类型，传入 Exclude 后，变为了一个泛型类型 T，"dogName" | "dogAge" | "dogKind" 会依次与 "dogKind" 进行比对，只有 "dogKind" 可以分配给 "dogKind"，但得到的类型为 never，其他两个无法分配给 "dogKind"，得到它们本身的字面量类型 "dogName" 和 "dogAge"，它们组成的联合类型 "dogName" | "dogAge" 就是最终的结果。


