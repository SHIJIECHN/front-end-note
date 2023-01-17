---
autoGroup-3: Typescript
sidebarDepth: 3
title: Typescript使用技巧
---

## 前置知识
1. TypeScript内置的映射类型：Pick、Partial、Required、ReadOnly、Record、Omit、Exclude、Extract、NonNullable、ReturnType、InstanceType。
2. keyof：获取interface定义中的属性名
3. typeof：推导出变量或实例对象对应的type类型
4. in：只允许在type类型内部使用，用来获取type类型的属性名
5. infer：在extends条件推断中待推断类型的变量

## 注释
1. 通过添加多行注释/** */，给注释对象提供友好的提示信息。
```typescript
/** 给interface添加注释 */
interface IPerson {
    /** A cool name. */
    name: string
}
```
2. 可以添加符合JSDoc规范的关键词。在多行注释中，输入@即可出现支持的关键词，例如@description表示描述、@param表示参数、@return表示返回值、@example表示使用示例等。
```typescript
/**
* @description 定义Person的接口
*/
interface IPerson{
    name: string
}
```

## typeof由实例推导出类型
通常情况下，我们会先定义类型，然后再定义实例，如：
```typescript
interface IPerson{
    name: string,
    age: number
}

const person: IPerson = {
    name: 'Lily',
    age: 30
}
```
上面是标准正确的写法，如果想少写一些代码，也可以这样做：先定义实例，然后通过typeof让TypeScript推导出类型。
```typescript
const person = {
    name: 'Lily',
    age: 30
}

type PersonType = typeof person;
```

> 在TypeScript中，typeof可以获取变量或对象的类型，得到的类型是由TypeScript推导出来的，可以是任何结构形式的类型。在JavaScript中，typeof可以获取变量和对象的类型，只不过得到的类型结果只能是：undefined、string、number、boolean、symbol、object、function。

**特别提醒**

由于是从实例（变量或对象）反向推理出对应的类型，而实例中的某属性一定是固定类型的。
```typescript
interface IPerson {
    age: string | number
}

const person = {
    age: '30岁'
}

type PersonType = typeof person;
```
上面代码中，由于person.age为字符串，所以PersonType实际结果为：
```typescript
type PersonType = {
    age: string
}
```
IPerson 和 PersonType是不相同的，所以注意：typeof是无法满足、推理出属性中有联合类型的情况。

## 联合类型
符号 | 的用法、泛型约束。

假设person有一个属性age，该属性可能为字符串'30岁'(string)或者为数字30（number），那么在定义IPerson时，我们很容易想到：
```typescript
interface IPerson{
    age: string | number
}
```
另外一种情况，假设person的属性可能有boyName或girlName，且只能同时存在其中1个，那么：
```typescript
interface IPerson{
    boyName?: string,
    girlName?: string
}

const person: IPerson = {
    boyName: 'Tom',
    girlName: 'Lily'
}

--------------或---------------

type PersonType = {
    boyName: string
} | {
    girlName: string
}

const person: PersonType = {
    boyName: 'Tom',
    girlName: 'Lily'
}
```
以上代码中，无论是interface的 ?: 或type的 |, 都不能解决需要，如何写呢？

使用泛型约束：
```typescript
interface IPerson {
    age: number
}

interface IBoyPerson extends IPerson {
    boyName: string
}

interface IGirlName extends IPerson {
    girlName: string
}

type PersonType<T> = T;

const person: PersonType<IBoyPerson> = {
    age: 34,
    boyName: 'puxiao',
    grilName: 'meinv'
    // TypeScript错误提示：不能将类型“{ age: number; boyName: string; grilName: string; }”分配给类型“IBoyPerson”。
    // 对象文字可以只指定已知属性，并且“grilName”不在类型“IBoyPerson”中。
}
```

## 查找属性
将复杂属性进行拆分。

假设某个类型的某属性也是复杂对象（复杂类型），如：
```typescript
interface IPerson{
    info: {
        name: string,
        age: number
    }
}
```
上述代码中，将info单独拿出来定义一个类型，然后在IPerson中使用，代码如下：
```typescript
interface IInfo {
    name: string,
    age: number
}

interface IPerson {
    info: IInfo
}
```
> 注意，后面的写法虽然也完全可以使用，但是info的语法提示稍微差一些。上面的写法会直接显示完整的类型结构，但是下面的写法只会显示`IPerson.info: IInfo`。
> 建议：如果不是属性数量过多、类型过于复杂，还是采用上面那种方式来定义类型。

## 类型查找+泛型+keyof
```typescript
interface IURL {
    url: string,
    str: string
}

interface IAPI {
    '/user': { name: string},
    '/menu': {list: IURL[]}
}

const getDate = async <URL extends keyof IAPI>(url: URL): Promise<IAPI[URL]> => {
    reurn fetch(url).then(res => res.json());
}

getDate('/user').then(res => res.name);
getDate('/menu').then(res => res.list);
```

## 显式泛型
```typescript
interface IPerson {
    name: string,
    age: number
}

const person: IPerson = {
    name: 'Lily',
    age: 30
}

const changePerson: <K extends keyof IPerson>(name: K, value: IPerson[K]) => void = (key, value) => {
    person[key] = value;
}

changePerson('age', 18);
changePerson('name', 'Tome');
```
> “显式类型”对应的是“隐式类型”。所谓“隐式”即从推理得到的泛型而言（用typeof获取的类型）:
> `<K extends keyof IPerson>` 对应着 `<T = typeof X, K in T>`

## DeepReadonly
设置类型的深层属性为只读。

目前 TypeScript 官方自带的 Readonly ，经过测试，确实只能做到第1层的只读控制，无法做到深层的只读控制。

将写一个DeepReadonly将深层属性为只读
```typescript
interface IPerson {
    name: string,
    age: number,
    info: {
        work: string
    }
}

const me: IPerson = {
    name: 'puxiao',
    age: 34,
    info: {
        work: 'development'
    }
}

type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>
}

const you = me as DeepReadonly<IPerson>
you.info = { work: 'coder' } //报错：无法分配到 "name" ，因为它是只读属性。
you.info.work = 'coder' //报错：无法分配到 "work" ，因为它是只读属性。
```
在最新版 TypeScript 中，第一层属性变为只读，还有另外一种写法，使用 const 关键词：
```typescript
const me = {
    name: 'puxiao',
    age: 34,
    info: {
        work: 'development'
    }
}

const you = <const>{ ...me }
you.info = { work: 'coder' } //报错：无法分配到 "name" ，因为它是只读属性。
you.info.work = 'coder' //尝试修改第2层级的属性值，竟然没问题，不报错
```

## Omit
删除类型某属性、高阶组件（工厂类）中应用技巧

```typescript
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

// 官方定义为
type Omit<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P]; }
```

高阶组件或工厂类中比较合适使用Omit。

假设有一个需求：创建一个Person工厂函数，Person有两个属性name和age，但是传递给工厂函数的参数中不需要age对应的值（age的值由工厂函数内部产生获得）。
```typescript
interface IPerson {
    name: string,
    age: number
}

type PropsType = Omit<IPerson, 'age'>; // 使用 TypeScript 自带的 Omit 泛型来获得 工厂函数需要的参数类型

const createPerson: (props: PropsType) => IPerson = (props) => {
    return {...props, 'age': Math.floor(Math.random() * 30)}
    // Person 需要的 age 属性值由工厂函数内部随机一个数字
}
createPerson({name: 'coder'})
```

## Record
约束对象属性名和值的类型。

Record 是 TypeScript 内置的映射类型之一，将选定属性名(或者由枚举而产生的属性名)对应的值类型全部转化为指定类型，官方定义为：
```typescript
type Record<K extends string | number | symbol, T> = { [P in K]: T}
```
Record 需要 2 个参数，第1个参数为约定属性名集合(由 enum 或 type 定义的枚举类型)，第2个参数为约定属性值的类型。
```typescript
enum MoodType {
    HAPPY = 'happy',
    SAD = 'sad'
}

interface IDate {
    icon: string
}

const moodeData: Record<MoodType, IDate> = {
    happy: { icon: 'a'},
    sad: { icon: 'b'}
}
```

## Partial
将一部分属性变为可选。

```typescript
const mergeOptions = (options: Opt, patch: Partial<Opt>){
    return { ...options, ...patch};
}

class MyComponent extends React.PureComponent<Props>{
    defaultProps: Partial<Props>
}
```
Partial 就是将某些属性设置为可选.

## tsx + extends
在tsx文件中区别泛型和组件标签

在 .tsx 文件中，泛型和tsx标签都采用 <> 形式，为了让泛型不被误解成标签，可以在泛型中加入 extends 来解决。
```typescript
const toArray = <T>(element: T) => [element]; // 会被报错
const toArray = <T extends {}>(element: T) => [element]; // 不报错
```

## ClassOf
参数传入类而非实例，并且可以new该类。

JavaScript 中并不存在真正面对对象中的类，JavaScript 是动态语言，走的是原型链。

在使用高阶组件或工厂类中，我们有时需要传入类本身，而非类的实例。

```typescript
import React from 'react'
abstract class Animal extends React.PureComponent {
    /* Common methods here. */
}

class Cat extends Animal { }
class Dog extends Animal { }

const renderAnimal = (AnimalComponent: Animal) => {
    /* 报错：“AnimalComponent”表示值，但在此处用作类型。是否指“类型 AnimalComponent”? */
    return <AnimalComponent/>; 
}

renderAnimal(Cat); // 报错：类型“typeof Cat”的参数不能赋给类型“Animal”的参数。
renderAnimal(Dog); // 报错：类型“typeof Dog”的参数不能赋给类型“Animal”的参数。
```
通过自定义 ClassOf 泛型约束，可解决上述问题：
```typescript
interface ClassOf<T>{
    new (...args: any[]): T;
}

const renderAnimal = (AnimalComponent: ClassOf<Animal>) => {
    return <AnimalComponent />; // 不再报错
}

// 也可以写成
const renderAnimal = (AnimalComponent = tyepof Animal) => {
    // ....
}
```

## 类型查找+类方法
简化子组件中定义函数的方式。

将类组件的函数传递给子组件，为了通过以下方式，在子组件中定义：
```typescript
class Parent extends React.PureComponent {
    private updateHeader = (title: string, subTitle: string) => {
        // Do it.
    };
    render() {
        return <Child updateHeader={ this.updateHeader } />;
    }
}

//默认子组件中应该这样定义
interface ChildProps {
    updateHeader: (title: string, subTitle: string) => void;
}

//使用类型查找，修改成这种方式后，可以省掉很多重复的代码(参数、返回值等)
interface ChildProps {
    updateHeader: Parent['updateHeader'];
}

class Child extends React.PureComponent<ChildProps> {
    private onClick = () => {
        this.props.updateHeader('Hello', 'Typescript');
    };
    render() {
        return <button onClick={ this.onClick }> Go < /button>;
    }
}
```
  
## Tuple
约束元组数组初始化时的长度

默认元组顺序只能约束元素类型，但是无法约束数组长度，可通过以下定义来实现初次赋值时进行长度限定。
```typescript
type Tuple<T, N extends number> = [T, ...T[]] & {length: N}

type myArr = Tuple<number, 7>

const arr:MyArr = [0,1,2,3,4,5,6]
```
特别提醒：上述中的 Tuple 仅仅只是约束第一次初始化赋值时数组的长度，但是 实例 arr 依然可以执行后续的 push、pop 等操作，来改变数组的长度.

## EnumType
根据枚举属性名，获得指定类型的属性值

先通过枚举定义若干常量，然后根据枚举对象的属性名(键名)，重新得到一个指定属性值类型的约束对象。

这里面使用了：K in keyof typeof E 这种组合
```typescript
//错误状态码
enum LoginFailCode {
    unknowCode = 10,
    authorizationCode = 11,
    loginDbCode = 12
}

type p = keyof  typeof LoginFailCode; // "unknowCode" | "authorizationCode" | "loginDbCode"

//以下要定义错误状态码对应的错误提示信息

// 第一种定义方法
type EnumType<T> = { [key in keyof typeof LoginFailCode]: T};
const LoginFailMsg1: EnumType<string> = {
    unknowCode: '用户登录时，发生未知错误',
    authorizationCode: '用户登录时，获取openid发生错误',
    loginDbCode: '用户登录时，数据库操作发生错误'
}

// 第二种定义方法
const LoginFailMsg2: Record<keyof typeof LoginFailCode, string> = {
    unknowCode: '用户登录时，发生未知错误',
    authorizationCode: '用户登录时，获取openid发生错误',
    loginDbCode: '用户登录时，数据库操作发生错误'
}
``` 

## const Xxx = {} as const
将对象所有键值组成联合类型。

可以通过 keyof typeof 获取 枚举对象的所有键名，并将**键名**组成联合类型，但是目前来说是没有办法将枚举对象**键值**组成联合类型。

目前来说，可以通过不使用 enum，改成 const 来实现。
```typescript
const Mycount = {
    A: 1,
    B: 5,
    C: 8
} as const;

// 获取Mycount所有键名组成的联合类型，即："A" | "B" | "C"
type Keys = keyof typeof Mycount;

//获取 MyCount 所有键值 组成的联合类型，即：1 | 5 | 8
type values = typeof Mycount[keyof typeof Mycount];
```

## const enum
仅编译过程中存在，编译后会消失的枚举对象

通常情况下定义枚举对象的方式为：enum Xxx {}，Xxx 编译后是一个对象。如果在定义时添加 const，即：const enum Xxx{}，那么这样定义的枚举对象只有在编写代码，编译过程中存在，编译后则会消失。

```typescript
enum EnumA { A = 1, B = 5, C = 8 }

const enum EnumB { A = 1, B = 5, C = 8}

const aa = EnumA.A
const bb = EnumB.A

// EnumA 和 EnumB 的区别是什么 ？
// EnumA 被编译后是一个对象，而 EnumbB 编译后则会消失

// aa 和 bb 被编译后的区别是什么 ？
// aa = EnumA.A, bb = 1

/**
  EnumA 被编译后是一个对象，长这个样子：
  var EnumA;
  (function (EnumA) {
      EnumA[EnumA["A"] = 1] = "A";
      EnumA[EnumA["B"] = 5] = "B";
      EnumA[EnumA["C"] = 8] = "C";
  })(EnumA || (EnumA = {}));

  而经过 TS 编译后的代码中，根本不存在 EnumB
*/
```

## `<const>`
让const声明的对象属性变为只读。 

使用const定义的变量，虽然对象本身类型不能再发生变化，但是该对象的属性却可以被修改。

通过以下两种方式，均可以让对象属性变为只读。
```typescript
const person = { name: 'Lily', age: 30};
person.age = 18; // 可以被修改

const person = <const>{ name: 'Lily', age: 30};
// 或
const person = { name: 'Lily', age: 30} as const;

person.age = 18; // 无法分配到 "age" ，因为它是只读属性。
```

## `obj[key]`
严格模式下，如何避免错误。

在最新的 TS 4 版本中，tsconfig.json 中 strict 默认值为 true，即 默认开启严格模式。

在严格模式下 无论 noImplicitAny 的值是 true 还是 false，如果代码中 TS 自动推断出有值为 any，就会报错.

> 元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "{}"。

在非严格模下，以下代码没有问题：
```typescript
const removeUndefined = (obj: object) => {
    for (let key in obj) {
        if (obj[key] === undefined) {
            delete obj[key]
        }
    }
    return obj
}
```
在严格模式下，只能修改为以下代码：
```typescript
const removeUndefined = (obj: object) => {
    for(let key in obj){
        if(obj[key as keyof typeof obj] === undefined){
            delete obj[key as keyof typeof obj]
        }
    }
}
```

## 获取数组中所有元素的值的类型
```typescript
const arr = ['a', 'b', 'c'] as const;
type value = typeof arr[number]; // 'a' | 'b' | 'c'
```

## 适应下划线 _ 来充当参数占位符
假设 TypeScript 开启的是严格模式，若有已定义但从未读取使用的变量就会收到 TS 报错。
```typescript
arr.forEach((value,index) => {
    ...
    index
    ...
})
// 错误：已定义 value，但从未读取该值
```
在上面这段代码中，我们利用了数组的 forEach() 来循环遍历，但是我们真正执行的代码中只用到了 index，并没有用到 value，那么 TS 就会报错.

这种情况下，我们可以改用 for 循环，例如：
```typescript
for(let i=0; i<arr.lenght; i++) {
   ...
   index
   ...
}
```
这样做肯定没有问题，但是假设我就是想用 forEach() 函数，就是不用 value，又希望 TS 不报错该怎么办呢？

可以使用 下划线 _ 这个特殊符号来作为变量名，可起到占位作用。修改原本的forEach代码：
```typescript
arr.forEach((_,index) => {
    ...
    index
    ...
})
```
此时 下划线 就起到了一个 “占位符” 的作用，TS 不会针对 下划线 _ 进行 “已定义从未读取” 的检测，不再报错.

> 使用下划线来作为变量名，是JS所支持的。TypeScript只是不针对下划线变量进行已定义但从未读取的检测

**补充**

下划线 _ 可以作为 JS 支持的变量名，我们常见的定义箭头函数 () => { ... } 可以简化为 _=>{ ... }

这里面 _ 充当一个无用的参数。

当然这种写法并不特别提倡，毕竟代码阅读性不是特别好。

## 可辨识类型
在日常 TS 使用中，我们会使用这种形式
```typescript
type xxx = string | number | any[]
```
这种形式叫 “联合类型”，和这个形式类似的还有另外一种高级用法——可辨识联合类型

可辨识类型的使用：
```typescript
interface Aaa {
    type: 'a',
    name: string
}

interface Bbb {
    type: 'b',
    age: number
}

interface Ccc {
    type: 'c',
    list:string[]
}

type ABC = Aaa | Bbb | Ccc
```
先定义彼此不相干的 3 个类，最后通过 Aaa | Bbb | Ccc 这种类似联合的形式组成了 ABC.

那么 TypeScript 会去检查 3 个类的共同特点，然后推理出 ABC 应该拥有的特点。

1. TS 发现这 3 个类的共同特征是都拥有 type 属性，且 type 属性的类型都不相同。
2. 当我们在其他地方使用 ABC 类型时，就可以通过 ABC.type 来判断出究竟是哪个类的实例，并且给出该类型特有的其他属性语法提示和检查。

在传统的面向对象编程语言中，我们必须先定义好父类，才能再定义子类。但是在 TS 中，我们可以先定义若干个 “子类”，然后将这些 “子类” 联合起来，让 TS 推理出 他们的 “父类” 应该是什么样子。

切记，这些单独定义的 “子类” 应该至少有 1 项有相同的属性名且属性类型不同，这样的 ABC 才可以备 TS 可辨识推理出来。

注意是相同的属性名、不同的属性类型。如果是相同的属性名、不同的属性值，TS 是无法推理的。

> 应用场景：定义多个具有相似结构的子类，然后通过Xxx.type进行TS实例推理，得到对应具体子类的属性语法提示和检查。

**关于类class在TS中的知识点补充**

假设定义一个Person类
```typescript
class Person{
    name: string;
    constructor(){
        this.name = 'xxx';
    }
}
```
上面代码中的Person包含两层意思：
1. 一个名为Person的类
2. 一个名为Person的类型，相当于
```typescript
interface Person{
    name: string
}

// 或者是
type Person  ={
    name: string
}
```
因此我们即可以把Person当类使用，也可以把Person当接口（interface）或类型别名（type）来使用。

**接口合并**
```typescript
interface IPerson {
    name: string
}

interface IPerson {
    age: number
}

const person: IPerson ={
    name: 's',
    age: 1
}
```

**接口实现**
```typescript
interface IPerson {
    name: string
}
interface IPerson {
    age: number
}

//类型“Person”缺少类型“IPerson”中的以下属性: name, age
export class Person implements IPerson {
    constructor() {
    }
}
```
上面代码中，Person 需要实现 IPerson 所规定的 2 个属性，由于没有还未实现所以 TS 会报错。

接口实现的错误演示：
```typescript
interface Person {
    name: string
}

interface Person {
    age: number
}

//下面为错误的 接口实现 方式

class Person {
    constructor() {
    }
}

//或
class Person implements Person {
    constructor() {
    }
}
```
请注意，上面代码在 TS 中并不会报错，恰恰是因为没有报错才证明我们接口没有实现。

这是因为我们定义的 class 名字 Person 和 接口名字 Person 相同，那么 TS 其实把 class Person { ... } 重新定义出一个 Person 的类型。

也就是说错误示例中其实发生的并不是接口实现，而是 3 个 Person 接口合并


## 给js文件添加TS声明
假设我们自己编写了一个 xxx.js 文件，或者我们引用了别人写好的 xxx.js 文件，为了获得 TS 语法提示和自动检测，我们需要给 xxx.js 添加对应的 TS 声明。

添加声明分为两种：
1. 向全局添加声明
2. 向具体模块添加声明

### 1. 向全局添加声明
  
所谓“全局”是指我们在任意一个.ts或tsx文件中都可以直接使用，而无需“引入”。
1. 在项目根目录，打开或新建global.d.ts文件
2. 在该文件中，使用declare作为关键字，开始声明对应的TS内容

**全局声明的几种类型**：
1. declare var: 声明全局变量
2. declare function ：声明全局方法
3. declare class ：声明全局类
4. declare enum ：声明全局可枚举类型
5. declare namespace ：声明含有子属性的全局对象。所谓 “含有子属性” 是指可以内嵌多种类型(类、类型、变量、方法)的对象类型
6. declare interface、declare type ：声明全局类型
7. declare global ：声明全局变量
8. declare module ：声明全局扩展模块。declare module 实际上是全局声明 “类” 的另外一种形式(也可以说是一种简写形式)。

### 2. 向具体模块添加声明
所谓 “具体模块” 是指我们在任意一个 .ts 或 .tsx 文件中若想使用则必须先 “引入”。

1. 在 xxx.js 同目录下，创建相同名字的 xxx.d.ts 文件
2. 在该 xxx.d.ts 文件中，就像普通定义 TS 类型那样，将 xxx.js 中的内容重新定义一次即可

xxx.d.ts 中定义的类型应该与 xxx.js 中保持一致，不要尝试将 xxx.d.ts 中的某类型修改成其他含义，那样 TS 并不会被 “欺骗” 到。

**导出的两种类型**
1. export + 导出对象
2. export default + 导出对象

> 注意：
> 1. 假设xxx.js中使用的是export default，那么xxx.d.ts中也必须是export default
> 2. 如果使用export default，一定要确保tsconfig.json中exModuleInterop: true.

1. export 这种导出形式用法和普通 TS 文件中导出的形式是一模一样
2. 但是 export 主要针对的是 “向模块添加声明”
3. 对于 “向全局添加声明” 是不需要使用 export 的，当使用 declare 之后就相当于已导出了。

### 3. global.d.ts
通常情况下，我们在项目中会引入很多非 js 或 ts 的静态资源文件，例如 图片 或 CSS 文件。

为了避免 TS 提示找不到对应的 TS 定义，我们会在 global.d.ts 文件中添加以下内容：
```typescript
declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';
declare module '*.asc';
```
由于使用的是 declare 关键词，那么意味着这是向全局中添加的声明，这样我们就可以在任意的 .ts 或 .tsx 文件中引入这些静态资源文件。

我们以 declare module '*.jpg' 这样代码为例，来讲解一下这行究竟定义了什么内容。
1. declare 意思是此处为 “全局定义 ”
2. module 意思是模块，我们可以把它看做是 “类(class)” 的简写形式
3. '*.jpg' 意思是代表所有以 xxxx.jpg 形式命名的文件
   
declare module '*.jpg' 这样代码实际上是以下代码的简写形式：
```typescript
declare '*.jpg' {
    const content = string;
    export default content;
}
```
假设我们在项目中引入一张图片，我们希望知道该图片将来经过 webpack 编译之后的路径，我们可以使用以下形式：
```typescript
const url = require('./imgs/xxx.jpg').default
// url 就是该图片经过编译之后的路径
```
上面示例中使用的是相对路径，但实际项目中由于该 ts 或 tsx 文件也会被编译，究竟最终路径是什么很容易混乱，所以推荐在项目中配置 alias (路径映射) 来方便指向最终资源路径。假设配置好 alias 后，可能上述代码资源路径可修改为：
```typescript
const url = require('@/assets/imgs/xxx.jpg').default
```


## import type/export type仅导入/导出类型声明
```typescript
// test-a.ts: 仅导出 Person 的类型
export interface Person {
    name: string,
    age: number
}

// test-b.ts: 仅导出 Person 的实际值(是一个类)
export class Person {

    name: string
    age: number

    constructor() {
        this.name = 'ypx'
        this.age = 34
    }
}

// test-c.ts: 即导出 Person 的类型，又导出 Person 实际定义的值(是一个类)
interface Person {
    name: string,
    age: number
}
class Person {
    constructor() {
        this.name = 'ypx'
        this.age = 34
    }
}

export { Person }

// 导入test-x.ts文件
import {Person} from './text-x'

export const myFun = (person: Person) => {
    console.log(person.name)
}
```

明确导出的是类型
```typescript
// test.ts
interface Person {
    name: string,
    age: number
}
class Person {
    constructor() {
        this.name = 'ypx'
        this.age = 34
    }
}

export type { Person }

// 使用
import type { Person } from './test'

export const myFun = (person: Person) => {
    console.log(person.name)
}
```

注意：使用import type导入的类不可以当做值使用。也就是：
1. 无法实例化
2. 无法继承


## public/private/protected 类的属性或方法的修饰词
在传统面向对象编程语言中，类的属性或方法前面都可以添加 修饰词语，例如：
1. public：公开的，任何人都可以访问
2. private：私密的，仅类本身内部可访问
3. protected：受保护的，仅类、子类可访问

目前TypeScript也完全支持这三种修饰词。

### 1. public
在 TypeScript 中如果属性或方法不添加修饰词，那么默认即为 public。
```typescript
class MyClass{
    name:string
    doSomting(){ ... }
}

//完全等价于

class MyClass{
    public name:string
    public doSomting(){ ... }
}
```

### 2. private
使用该修饰词后，该属性或方法仅可类本身内部使用，外部或子类都不可以调用(访问)。
```typescript
class MyClass{
    private name:string
    private doSomting(){ ... }
}
```
对于原生JS而言，在新的ES标准中，类内部私有属性或方法采用的是添加 # 作为前缀
```typescript
class MyClass{
    #name = 'aaa'
    #doSomting(){ ... }
}
```

### 3. protected
当给类的某个属性或方法添加 protected 之后，那么该属性或类只允许本类、子类访问和调用。
```typescript
class MyClass {
  protected _type: string = 'aaa'
  protected doSomting(){ ... }
}
```

## override 显式重写父类的方法
注意：override 这个关键词是 TypeScript 4.3 版本中才新增的关键词。

但是目前并不是所有的编译工具都可以正确编译该关键词，例如目前的 react 17.0.2 还不支持编译该关键词.

以前子类重写父类的某个方法，都是采用匿名的方式。例如：
```typescript
class ParentClass {
    doSomting(){
        ...
    }
}

class ChildClass extends ParentClass {
    doSomthing(){
        ...
    }
}
```
也就是说，子类所谓重写父类的某个方法，其实就是 使用相同的名字即可。

最新版的 TS 4.3 中，在 tsconfig.json 文件内我们可以新添加一个配置关键词 noImplicitOverride：
```typescript
{
    "compilerOptions": {
        "noImplicitOverride": true
    }
}
```
当 noImplicitOverride 的值为 true 是，即不允许子类匿名重写父类的方法。

子类在重写父类方法时，必须明确使用 “override” 关键词才可以。

最新重写方式：
```typescript
class ParentClass {
    doSomting(){
        ...
    }
}

class ChildClass extends ParentClass {
    override doSomthing(){
        ...
    }
}
```


## as const
```typescript
const fetchOption = {
  mode: 'same-origin',
  credentials: 'include',
};

fetch('/api', fetchOption); // Error!
```
这因为 mode 的类型被推导为 string 而不是 'same-origin' ，credentials 同理。

声明合理的类型：
```typescript
const fetchOptions: RequestInit = {
  mode: 'same-origin',
  credentials: 'include',
};


// 如果类型很难取到，可以使用as const
const fetchOptions = {
  mode: 'same-origin' as const,
  credentials: 'include' as const,
};

// Or
const fetchOptions = {
  mode: 'same-origin',
  credentials: 'include',
} as const;
```

## `[a, b] as const`
React.useState()返回`[state, setState]`的结构，方便调用方结构和命名：
```typescript
const [title, setTitle] = React.useState();
```
模拟实现：
```typescript
const makeGetSet = (initialValue: string) => {
    let value = initialValue;
    const setValue = (v: string) => value = v;
    const getValue = () => value;
    return [getValue, setValue];
}

const [getValue, setValue] = makeGetSet('14');
const currentName = getValue(); // Error!
```
愿因是`[0, '']`会被推导为类型`(number|string)[]`。加上as const可推断为元组：
```typescript
const toGetSet = (initialValue: string) => {
  let value = initialValue;
  const setValue = (v: string) => value = v;
  const getValue = () => value;
  return [getValue, setValue] as const;
};

const [getName, setName] = toGetSet('14');
const currentName = getName(); // Great!
```

## `[number]` 下标
先定义全量列表，再获取枚举类型：
```typescript
const DRINK_LIST = ['Beer', 'Wine', 'Water'] as const;
type Drink = (typeof DRINK_LIST)[number]; // Equals to 'Beer' | 'Wine' | 'Water'.
```

## Omit + &
继承一个类型，并且重写其中一些属性。

先用Omit去掉
```typescript
type Base = {
    foo: number,
    bar: number
}

//方式一： interface
interface C extends Omit<Base, 'foo'>{
    foo: string
}

// 方式二： type
type D = Omit<Base, 'foo'> & {
    foo: string
}
```

## Simplify
```typescript
type D = Omit<Base, 'foo'> & {
    foo: string
}
/** 
鼠标放在D上显示：
type D = Omit<Base, "foo"> & {
    foo: string;
}
*/
```
提示信息不友好，想让提示明确一些，可以使用Pick自己就可以了
```typescript
type Simplity<T> = Pick<T, keyof T>;
type E = Simplity<D>
/** 
type E = {
    foo: string;
    bar: number;
}
*/
```
注意的是这不适用于联合类型。