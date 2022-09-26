---
autoGroup-1: Typescript
sidebarDepth: 3
title: 类 
---

## 类（Classes）
strictPropertyInitialization选项控制了类字段是否需要在构造函数里初始化。

构造函数（Constructors）：
```typescript
class Point {
  x:number;
  y:number;

  constructor(x = 0, y = 0){
    this.x = x;
    this.y = y;
  }

  // 方法
  scale(n: number):void{
    console.log(x);
    this.x *= n;
    this.y *= n;
  }
}
```
类构造函数签名与函数签名之间的区别： 
1. 构造函数不能有类型参数
2. 构造函数不能有返回类型注解，因为总是返回类实例类型

super调用
```typescript
class Base {
  k = 4;
}

class Derived extends Base {
  constructor(){
    super();
    console.log(this.k);
  }
}
```

索引签名（Index Signatures）
```typescript
class MyClass{
  [s: string] : boolean | ((s: string) => boolean);

  check(s: string){
    return this[s] as boolean;
  }
}
```

## 类继承（Class Heritage）
### implements语句（implements Clauses）
检查一个类是否满足一个特定的interface。
```typescript
interface Pingable {
  ping(): void
}

class Sonar implements Pingable {
  ping(){
    console.log("ping!")
  }
}

class Ball implements Pingable {
  // Class 'Ball' incorrectly implements interface 'Pingable'.
  // Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
  pong(){
    console.log("pong!")
  }
}
```
注意事项：
1. implements语句并不会影响类的内部是如何检查或者类型推断的
```typescript
interface Checkable {
  check(name: string): boolean
}

class NameChecker implements Checkable{
  check(s){
    // Parameter 's' implicitly has an 'any' type.
    return s.toLowerCase() === 'ok'
  }
}
```

2. 实现一个可选属性的接口，并不会创建这个属性
```typescript
interface A {
  x: number;
  y?: number;
}

class C implements A {
  x = 0;
}

const c = new C();
c.y = 10;
// Property 'y' does not exist on type 'C'
```

### extends语句（extends  Clauses)
类可以extends一个基类。一个派生类有基类所有的属性和方法，还可以定义额外的成员。
```typescript
class Animal {
  move(){
    console.log('Moving along');
  }
}

class Dog extends Animal {
  woof(times: number){
    for(let i = 0; i < times; i++){
      console.log('woof');
    }
  }
}

const d = new Dog();
// Base class method
d.move();
// Detived class method
d.woof(3);
```

### 覆盖属性（Overriding Methods）
```typescript
class Base {
  greet(){
    console.log("Hello, world");
  }
}

class Derived extends Base {
  // name 为可选属性，因为Base没有传参，否则会报错。
  greet(name?: string){
    if(name === undefined){
      super.greet();
    }else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet(); // "Hello, world" 
d.greet('render'); // "Hello, RENDER"
```

### 初始化顺序（Initialization Order）
- 基类字段初始化
- 基类构造函数运行
- 派生类字段初始化
- 派生类构造函数运行

```typescript
class Base{
  name = 'Base';
  constructor(){
    console.log('My name is '+this.name);
  }
}

class Derived extends Base {
  name = 'derived';
}

const d = new Derived(); // "My name is Base" 
```

## 成员可见性（Member Visibility）
- public（默认）：可以在任何地方被获取
- protected：成员仅仅对子类可见
- private：不允许访问成员，即便是子类
  
```typescript
class Greeter{
  public greet(){
    console.log('hi!');
  }
  protected getName(){
    return 'hello';
  }
}

class SpecialGreeter extends Greeter{
  public howdy(){
    // OK to access protected member here 
    console.log('Howdy, ' + this.getName());
  }
}

const g = new Greeter();
g.greet(); // OK
g.getName();
// 报错：Property 'getName' is protected and only accessible within class 
// 'Greeter' and its subclasses.
```
```typescript
class Base {
  private x = 0;
}

class Derived extends Base{
  showX(){
    console.log(this.x);
    // 报错： Property 'x' is private and only accessible within class 'Base'.

    x = 1;
    // Cannot find name 'x'. Did you mean the instance member 'this.x'?
  }
}
const b = new Base();
console.log(b.x);
// Property 'x' is private and only accessible within class 'Base'.
```

## 静态成员（State Members）
静态成员跟类实例没有关系，可以通过类本身访问到。
```typescript
class MyClass {
  static x = 0;
  static printX(){
    console.log(MyClass.x);
  }
}

console.log(MyClass.x);
MyClass.printX();
```
静态成员使用public、protected和private修饰符
```typescript
class MyClass {
  private static x = 0;
}

console.log(MyClass.x);
// Property 'x' is private and only accessible within class 'MyClass'.
```
静态成员可以被继承
```typescript
class Base {
  static getGreeting(){
    return 'Hello world';
  }
}
class Derived extends Base {
  myGreeting  = Derived.getGreeting();
}

const d = new Derived();
console.log(d.myGreeting); // "Hello world" 
```

## 泛型类（Generic Classes）
```typescript
class Box<Type> {
  contents: Type;
  constructor(value: Type){
    this.contents = value;
  }
}

const b = new Box('hello');
// const b: Box<string>
```
## 类运行时的this（this at Runtime in Classes）
```typescript
class MyClass {
  name = 'MyClass';
  getName(){
    return this.name;
  }
}

const c = new MyClass();
const obj = {
  name: 'obj',
  getName: c.getName
}

console.log(obj.getName()); // 'obj'
// 默认情况下，函数中this的值取决于函数是如何被调用的。

// 使用箭头函数
class MyClass {
  name = 'MyClass';
  getName = ()=>{
    return this.name;
  }
}

const c = new MyClass();
const obj = {
  name: 'obj',
  getName: c.getName
}

console.log(obj.getName()); // 'MyClass'
// 使用箭头函数可以避免丢失this上下文
```

### this参数（this parameters）
在TypeScript方法或者函数的定义中，第一个参数且名字为this有特殊的含义。该参数会在编译的时候被抹除。
```typescript
// TypeScript input with 'this' parameter
function fn(this: SomeType, x: number) {
  /* ... */
}

// JavaScript output
function fn(x) {
  /* ... */
}
```

### this类型（this Types）
```typescript
class Box{
  contents: string = '';
  set(value: string){
    this.contents = value;
    console.log(this); // ClearableBox: { "contents": "hello" } 
    return this;
  }
}

class ClearableBox extends Box{
  clear(){
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello"); // const b: ClearableBox
console.log('b: '+JSON.stringify(b)); // b: {"contents":"hello"}
```

### 基于this的类型保护（this-based type guards）
在类和接口的方法返回的位置，使用this is Type。目标对象的类型会被收窄为更具体的 Type.
```typescript
// @strictPropertyInitialization: false
class FileSystemObject {
  isFile():this is FileRep{
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }

  constructor(public path:string, private networked: boolean){}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string){
    super(path,false)
  }
}

class Directory extends FileSystemObject{
  children: FileSystemObject[];
}


const fso: FileSystemObject = new FileRep("foo/bar.txt", 'foo');

if(fso.isFile()){
  fso.content;
  // const fso: FileRep
}else if(fso.isDirectory()){
  fso.children;
  // const fso: Directory
}
```
一个常见的基于this的类型保护的使用例子，会对一个特定的字段进行懒校验（lazy validation）。
```typescript
class Box<T>{
  value?: T;
  hasValue(): this is {value: T}{
    return this.value !== undefined;
  }
}

const box = new Box();
box.value = "Gameboy";

box.value;
// (property) Box<unknown>.value?: unknown

// 当hasValue被验证为true时，会从类型中移除undefined
if(box.hasValue()){
  box.value;
  // (property) value: unknown
}
```

## 参数属性（Parameter Properties）
参数属性：TypeScript把一个构造函数参数转成一个同名同值的类属性。可以通过在构造函数参数前添加一个可见性修饰符public、protected、private或者readonly来创建参数属性。
```typescript
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ){
    // ...
  }
}

const a = new Params(1,2,3);
console.log(a.x); 
// (property) Params.x: number

console.log(a.z);
// Property 'z' is private and only accessible within class 'Params'.
```

## 类表达式（Class Expressions）
类表达式不需要名字
```typescript
const someClass = class<Type>{
  content: Type;
  constructor(value: Type){
    this.content = value;
  }
}

const m = new someClass("hello");
// const m: someClass<string>
```

## 抽象类和成员（abstract Classes and Members）
抽象类的作用是作为子类的基类，让子类实现所有的抽象成员。当一个类没有任何抽象成员，它就会被认为是具体的（concrete）。
```typescript
abstract class Base {
  abstract getName(): string;

  printName(){
    console.log("hello, "+ this.getName());
  }
}

// 抽象类不能直接实例化
// const b = new Base();
// Cannot create an instance of an abstract class.

class Derived extends Base {
  getName(){
    return 'world';
  }
}

const d = new Derived();
d.printName(); // "hello, world" 、、

// 如果没有实现基类的抽象成员，就会报错
class DerivedA extends Base{
  // Non-abstract class 'DerivedA' does not implement 
  // inherited abstract member 'getName' from class 'Base'.
  // 没有实现基类抽象成员
}
```


