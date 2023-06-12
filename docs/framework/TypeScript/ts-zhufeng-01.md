---
autoGroup-1: Typescript
sidebarDepth: 3
title: 基本数据类型
---

## extends继承
```javascript
class Father {

}

class Child extends Father {

}
```

```javascript
var extendStatics = function (Child, Father) {
    for (var p in b) {
        Child[p] = Father[p]
    }
};

var __extends = function (Child, Father) {
    extendStatics(Child, Father);// 把Father身上的静态属性都拷贝到Child上
    function Temp() {
        this.constructor = Child;
    }
    // 原型继承
    let temp = new Temp();
    temp.prototype = Father.prototype;
    Child.prototype = temp;
}
function Father() {
    __extends(Child, Father);
}
function Child(...args) {
    return Father(...args);
}
return Child;
```

## 装饰器

```typescript
// 类装饰器
// 当使用装饰器装饰类时，装饰器的参数就是构造函数
namespace a { // 命名空间
  function addNameEat(x: Function) {
    x.prototype.name = 'zf';
    x.prototype.eat = function () { }
  }

  @addNameEat
  class Person {
    name!: string; // 声明name
    eat!: Function; // 声明eat
    constructor() { }
  }

  let p: Person = new Person();
  // console.log(p.name);
  p.eat();
}


// 类装饰器工厂：可以传参
namespace b {
  function addNameEatFactory(name: string) {
    return function addNameEat(x: Function) {
      x.prototype.name = name;
      x.prototype.eat = function () { }
    }
  }

  @addNameEatFactory('jiagou')
  class Person {
    name!: string; // 声明name
    eat!: Function; // 声明eat
    constructor() { }
  }

  let p: Person = new Person();
  // console.log(p.name);
  p.eat();
}

namespace c {
  function replaceClass(consttuctor: Function) {
    return class { // 返回一个新的类 用新的类替换掉老的类，但是属性可以多于原来的属性，不能少
      name: string;
      eat: Function;
      age: number;
      constructor() { }
    }
  }

  @replaceClass
  class Person {
    name!: string; // 声明name
    eat!: Function; // 声明eat
    constructor() { }
  }

  let p: Person = new Person();
  // console.log(p.name);
  // p.eat();
}

// 属性装饰器：在运行时当作函数调用，装饰属性或装饰方法
namespace d {
  /**
   * 实例属性装饰器
   * @param target 如果装饰实例属性，target是构造函数的原型
   * @param propertyKey 属性名
   */
  function upperCase(target: any, propertyKey: string) {
    let value = target[propertyKey]; // 老的值
    const getter = () => value;
    const setter = (newVal: string) => value = newVal.toUpperCase();
    if (delete target[propertyKey]) { // 删除老的属性，并新增属性propertyKey
      Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      })
    }
  }

  /**
   * 静态属性装饰器
   * @param target 如果装饰静态属性，target是构造函数本身
   * @param propertyKey 属性名
   */
  function staticPropertyDecorator(target: any, propertyKey: string) {
    console.log(target, propertyKey)
  }

  /**
  * 实例方法装饰器。修改属性的enumerable属性值
  * @param target target是构造函数的原型
  * @param propertyKey 属性名
  */
  function noEnumerable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(target, propertyKey)
    descriptor.enumerable = false
  }

  /**
  * 实例方法装饰器。将参数都变成数字类型
  * @param target target是构造函数的原型
  * @param propertyKey 属性名
  */
  function toNumber(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let oldMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      args = args.map(item => parseFloat(item))
      return oldMethod.apply(this, args);
    }
  }

  class Person {
    @upperCase
    name: string = 'zf'; // 实例属性

    @staticPropertyDecorator
    public static age: number = 10; // 静态属性

    @noEnumerable
    getName() { // 实例方法
      console.log(this.name);
    }

    @toNumber
    sum(...args: any[]) { // 实例方法
      return args.reduce((accu: number, item: number) => accu + item, 0)
    }
  }

  let p = new Person();
  console.log(p.name)
  const s = p.sum('1', '2', '3'); // 参数如果是字符串
  console.log(s)
}

// 参数装饰器
namespace e {
  /**
   * 修饰参数
   * @param target 如果是静态成员，target就是构造函数，非静态成员，就是构造函数原型
   * @param methodsName 方法名称，如login
   * @param paramIndex 参数的索引。如1
   */
  function addAge(target: any, methodsName, paramIndex: number) {
    console.log(target, methodsName, paramIndex);
  }

  class Person {
    login(username: string, @addAge password: string) {
      console.log(username, password)
    }
  }
}
```