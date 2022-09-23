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