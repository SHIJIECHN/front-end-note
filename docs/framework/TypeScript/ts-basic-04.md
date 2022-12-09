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
也可以使用接口进行定义：
```typescript
interface Person{
  name: string;
  age: number;
}

function greet(person: Person){
  return "Hello " + person.name;
}
```
也可以使用类型别名：
```typescript
type Person = {
  name: string;
  age: number;
}

function greet(person: Person){
  return "Hello " + person.name;
}
```
以上三个例子，我们采用对象类型定义函数，对象类型包含属性name（必须是string类型）和age（必须是number）。

## 属性修饰符（Property Modifiers）
对象类型的每个属性都能够指定它的类型、属性是否可选、属性是否可读写等信息。

### 1. 可选属性（Optional Properties）
很多时候我们需要自己处理可能包含某个属性的对象。我们可以标记这些属性为可选，通过在属性名后添加（？）。
```typescript
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}
function paintShape(opt: PaintOptions){
  //...
}

const shape = getShape();
paintShape({shape});
paintShape({ shape, xPos: 100});
paintShape({ shape, yPos: 100});
paintShape({ shape, xPos: 100, yPos: 100});
```
上面例子中，xPos和yPos是可选属性，调用函数paintShape时可以选择是否传入这两个参数，函数都是有效的。

我们可以尝试读取这些属性，但是在strictNullChecks模式下，TypeScript将会告诉我们这些属性可能为undefined。
```typescript
function paintShape(opts: PaintOptions){
  let xPos = opts.xPos;
  // (property) PaintOptions.xPos?: number | undefined
  let yPos = opts.yPos;
  // (property) PaintOptions.yPos?: number | undefined
}
```
在JavaScript中，即使属性没有设置，我们也可以获得到属性的值为undefined，我们需要针对undefined进行单独处理：
```typescript
function paintShape(opts: PaintOptions){
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
  // let xPos: number
  let yPos = opts.yPos === undefined ? 0 : opts.yPos;
  // let yPos: number
}
```
这种判断在JavaScript中非常常见，通过对未指定的属性设置默认值，避免语法错误。
```typescript
function paintShape({ shape, xPos = 0, yPos = 0} : PaintOptions){
  console.log("x coordinate at", xPos);
  // (parameter) xPos: number
  console.log("y coordinate at", yPos);
  // (parameter) yPos: number
}
```
使用解构赋值对paintShape函数的参数进行解构，并对xPos和yPos设置默认值。现在xPos和yPos在paintShape函数内部是一定存在的，但是对paintShape调用者是可选的。

注意目前并没有在解构赋值语法中放置类型注解的方式。这是因为在JavaScript中，下面的语法代表的意思完全不同。
```typescript
function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
  render(shape);
  // Cannot find name 'shape'. Did you mean 'Shape'?
  render(xPos);
  // Cannot find name 'xPos'.
}
```
在对象解构语法中，shape：Shape表示是把shape的值赋值给局部变量Shape。xPos：number也是一样，会基于xPos创建一个名为number的变量。

### 2. readonly属性（readonly Properties）
在TypeScript中，属性可以被标记为readonly，这不会改变运行时的任何行为，但是类型检测时，被标记为readonly的属性是不能被写入的。
```typescript
interface SomeType{
  readonly prop: string
}

function doSomething(obj: SomeType){
  console.log(`prop has the value '${obj.prop}'.`);

  // But we can't re-assign it.
  obj.prop = 'Hello';
  // Cannot assign to 'prop' because it is a read-only property.
}
```
使用readonly修饰符并不意味着一个值就完全不变的，亦或者说，内部的内容是不能改变的。readonly仅仅表明属性本身是不能重新写入的。
```typescript
interface Home{
  readonly resident: { name: string; age: number};
}

function visitForBirthday(home: Home){
  // We can read and update properties from 'home.resident'
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evivt(home: Home){
  // But we can't write to the 'resident' property itself on a 'Home'
  home.resident = {
    name: 'Victor the Evictor',
    age: 42
  }
  // Cannot assign to 'resident' because it is a read-only property.
}
```
TypeScript在检查两个类型是否兼容的时候，并不会考虑两个类型里的属性是否是readonly，这就意味着，readonly的值是可以通过别名修改的。
```typescript
interface Person{
  name: string;
  age: number;
}
interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: 'Person McPersonface',
  age: 42,
}

// work
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // 42
writablePerson.age++;
console.log(readonlyPerson.age); // 43
```

### 3. 索引签名（Index Signatures）
有时候并不能提前知道所有属性的名称，但是知道属性值类型。这种情况下就需要使用索引签名描述可能的值的类型。
```typescript
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
// const secondItem: string
```
我们有一个具有索引签名的接口StringArray。这个索引签名表示当StringArray的索引为number类型时，会返回一个string类型的值。

一个索引签名的属性类型必须是string或者是number。

虽然TypeScript可以同时支持string和number类型，但数字索引的返回类型一定要是字符索引返回类型的子类型。因为当使用一个数字进行索引的时候，JavaScript实际上把它转成一个字符串。这就意味着使用数字100进行索引跟使用字符串100索引是一样的。
```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal{
  bread: string;
}

// Error: indexing with a numeric string might get 
// you a completely separate type of Animal!
interface NotOkay{
  [x: number]: Animal;
  // 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
  [x: string]: Dog;
}
```
尽管字符串索引签名用来描述字典模式非常有效，但也会强制要求所有的属性要匹配索引签名的返回类型。这是因为一个声明类似于obj.property的字符串索引，跟obj\['property']是一样的。在下面的例子中，name的类型并不会匹配字符串索引字符串索引的类型，所以类型检查器会给出报错：
```typescript
interface NumberDictionary {
  [index: string]: number;
  length: number; // ok
  name: string;
  /**
   * Property 'name' of type 'string' is not 
   * assignable to 'string' index type 'number'.
   */
}
```

```typescript
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
} 
```

```typescript
interface ReadonlyStringArray {
  readonly [index:number]: string
}

let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = 'Mallory';
// Index signature in type 'ReadonlyStringArray' only permits reading.
```

## 属性继承（Extending Types）
```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```
接口可以继承多个类型：
```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle{}

const cc: ColorfulCircle = {
  color: 'red',
  radius: 42
}
```

## 交叉类型（intersection Types）
交叉类型定义需要用到 & 操作符。
```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

## 接口继承于交叉类型（Interface vs Intersection）
两种方式在合并类型上看起来很相似，但实际上有很大的不同。最原则性的不同就是在于冲突怎么处理。
```typescript
interface Colorful {
  color: string
}

interface ColorfulSub extends Colorful {
  color: number
}
/**
 * Interface 'ColorfulSub' incorrectly extends interface 'Colorful'.
 * Types of property 'color' are incompatible.
 * Type 'number' is not assignable to type 'string'.
 */
```
上面继承的方式导致编译错误。但是交叉类型不会。
```typescript
interface Colorful {
  color: string
}

type ColorfulSub = Colorful &{
  color: number
}
// ColorfulSub: never
// 意思是取得string和number的交集
```

## 泛型对象类型（Generic Object Types）
使用类型断言。
```typescript
interface Box {
  contents: unknown
}

let x: Box = {
  contents: 'hello world'
}

if(typeof x.contents === 'string'){
  console.log(x.contents.toLowerCase());
}

console.log((x.contents as string).toLowerCase());
```
创建一个泛型，它声明了一个类型参数（type parameter）：
```typescript
interface Box<Type>{
  content: Type
}
// 可以理解为：Box的Type就是contents拥有的类型Type。
```
把 Box 想象成一个实际类型的模板，Type 就是一个占位符，可以被替代为具体的类型。当 TypeScript 看到 `Box<string>`，它就会替换为 `Box<Type>` 的 Type 为 string ，最后的结果就会变成 { contents: string }。换句话说，`Box<string>`和 StringBox 是一样的。
```typescript
interface Box<Type>{
  contents: Type
}

interface StringBox {
  contents: string
}

let boxA: Box<string> = {
  contents: 'Hello'
}
boxA.contents; // (property) Box<string>.contents: string

let boxB: StringBox = {
  contents: 'world'
}
boxB.contents; // (property) StringBox.contents: string
```
类型别名也是可以使用泛型的。
```typescript
interface Box<Type>{
  contents: Type
}

type Box<Type> = {
  contents: Type
}
```

## Array类型（The Array Type）
```typescript
function doSomething(value: Array<string>){
  // ...
}

let myArrary: string[] = ['hello', 'world'];

// either of these work
doSomething(myArrary);
doSomething(new Array('hello', 'world'));
```
Array本身就是一个泛型
```typescript
interface Array<Type>{
  /**
   * Gets or sets the length of the array.
   */
  length: number;
 
  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;
 
  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;
 
  // ...
}
```

## ReadonlyArray类型（The ReadonlyArray Type）
可以描述数组不能被改变。
```typescript
function doStuff(values: ReadonlyArray<string>){
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // but we can't mutate 'values'
  values.push('hello!')
  // Property 'push' does not exist on type 'readonly string[]'
}
```
ReadonlyArray并不是一个我们可以用的构造器函数，然而我们可以直接把一个常规数组赋值给ReadonlyArray。
```typescript
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```
`ReadonlyArray<Type>` 提供了更简短的写法 `readonly Type[]`.

注意：Arrays 和 ReadonlyArray 并不能双向的赋值。

## 元组类型（Tuple Type）
```typescript
type StringNumberPair = [string, number];

function doSomething(pair: [string, number]){
  const a = pair[0];
  a; // const a: string
  const b = pair[1];
  b; // const b: number

  const c = pair[2]; 
  // Tuple type '[string, number]' of length '2' has no element at index '2'.
}

doSomething(['hello', 42]);
```