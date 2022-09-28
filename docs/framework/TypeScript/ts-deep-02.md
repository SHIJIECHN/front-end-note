---
autoGroup-2: Typescript
sidebarDepth: 3
title: 装饰器
---

## 装饰器
装饰器（Decorators）为我们在类的声明及成员上通过元编程语法添加标注提供了一种方式。

开启装饰器特性
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```
装饰器使用 @expression 这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰器的声明信息作为参数传入。

## 装饰器工厂
装饰器工厂是一个简单的函数，返回一个表达式，以供装饰器在运行时调用。
```typescript
// 装饰器工厂
function color(value: string){
  // 装饰器
  return function(targte){
    // ...
  }
}
```
## 装饰器组合
```typescript
// 书写在同一行上
@f @g x

// 书写在多行上
@f
@g
x
```
多个装饰器应用在同一个声明上时会进行如下步骤操作：
1. 由上至下依次对装饰器表达式求值
2. 求值的结果会被当作函数，由下至上依次调用

```typescript
function f(){
  console.log('f(): evaluated');
  return function(target, propertyKey: string, descriptor: PropertyDescriptor){
    console.log("f(): called");
  }
}

function g(){
  console.log('g(): evaluated');
  return function(target, propertyKey: string, descriptor: PropertyDescriptor){
    console.log("g(): called");
  }
}

class C{
  @f()
  @g()
  method(){}
}
// "f(): evaluated" 
// "g(): evaluated" 
// "g(): called" 
// "f(): called"
```

## 类装饰器
类装饰器在类声明之前被声明。类装饰器应用于类构造函数，可以用来监视、修改或替换类定义。

类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。
```typescript
function sealed(constructor: Function){
  console.log('sealed')
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string){
    this.greeting = message;
  }

  greet(){
    return "hello, "+ this.greeting;
  }
}

const g = new Greeter('world');

// sealed
```

## 方法装饰器
方法装饰器会在表单时运行时当作函数被调用，传入下列3个参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
2. 成员的名字
3. 成员的属性描述符

如果方法装饰器返回一个值，它会被用作为方法的属性描述符
```typescript
function enumberable(value: boolean){
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor){
    console.log(target); // Greeter: {}
    console.log(propertyKey); // greet
    console.log(descriptor);
    // {
    //   "writable": true,
    //   "enumerable": false,
    //   "configurable": true
    // } 
    descriptor.enumerable = value
  }
}


class Greeter {
  greeting: string;
  constructor(message: string){
    this.greeting = message;
  }

  @enumberable(false)
  greet(){
    return "hello, "+ this.greeting;
  }
}

const g = new Greeter('world');
```
当装饰器@enumberable(false)被调用时，它会修改属性描述符的enumerable属性。

## 访问器装饰器
不允许同时装饰一个成员的get和set访问器。只允许用来第一个访问器上。
```typescript
class Point{
  private _x: number;
  private _y: number;
  constructor(x: number, y: number){
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x(){return this._x}

  @configurable(false)
  get y(){ return this._y}
}

function configurable(value: boolean){
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){
    console.log(target); // Point: {} 
    console.log(propertyKey); // "x"
    console.log(descriptor);
    // {
    //   "set": undefined,
    //   "enumerable": false,
    //   "configurable": true
    // }
    descriptor.configurable = value
  }
}
```

## 属性装饰器
参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
2. 成员的名字
  
```typescript
import "reflect-metadata"

const formatMetadataKey = Symbol("format");

function format(formatString: string){
  return Reflect.metadata(formatMetadataKey, formatString)
}

class Greeter {
  @format("hello, %s")
  greeting: string;
  constructor(message: string){
    this.greeting = message;
  }

  greet(){
    return "hello, "+ this.greeting;
  }
}
```

## 参数装饰器
只能用来监视一个方法的参数是否被传入。

参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
2. 成员的名字
3. 参数在函数参数列表中的索引

```typescript
import "reflect-metadata"
const requiredMetadataKey = Symbol("required");

function required(target: any, propertyKey: string, parameterIndex: number){
  // 装饰器添加了元数据实体把参数标记为必需的
  const existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  console.log(existingRequiredParameters)
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

class Greeter {
  greeting: string;
  constructor(message: string){
    this.greeting = message;
  }

  greet(@required name: string){
    console.log(name)
    return "hello, "+ name + "," +this.greeting;
  }
}

const p = new Greeter('world');

```
