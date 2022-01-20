---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day07 
---

## 目标

## 原型对象`prototype`
- 原型`prototype`是`function`对象的一个属性，打印出来看一下，结果它也是一个对象
- `prototype`对象定义构造函数构造出的每个对象的**公共祖先**
- 所有被构造函数构造出的对象都可以继承原型上的属性和方法
```js
function Handphone(color, brand){
  this.color = color;
  this.brand = brand;
  // this.screen  = '18:9';
  // this.system = 'Android'
}

// Handphone.prototype.rom = '64G';
// Handphone.prototype.ram = '6G';
// Handphone.prototype.screen = '16:9'
// Handphone.prototype.system = 'Android';
// Handphone.prototype.call = fuinction(){
//   console.log('I am calling somebody.');
// }

// 优化
Handphone.prototype = {
  rom: '64G',
  ram: '6G',
  screen: '18:9',
  system: 'Android',
  call: function(){
    console.log('I am calling somebody.');
  }
}

var hp1 = new Handphone('red', '小米');
var hp2 = new Handphone('black', '华为');
console.log(hp1.rom);
console.log(hp1.ram);

console.log(hp1.screen); // 18:9 自己有的属性就不会到原型上去找属性了

hp1.call()
```
原型的作用：我们在实例化对象的时候总有一些写死的值，这些写死的值，在每次`new`的时候我们都需要去走一遍这个流程，这种代码对于实例化来说是一种代码冗余，也是一种耦合（重复了）。在这种情况下，我们得想一个办法能不能让它继承谁，在这种时候，我们把要写死的内容挂到原型上去，当我们需要参数去传值的这些，我们就写到`this`里面去，当我们需要写死的这些，我们就写到原型上去直接继承就可以了。

经验：一个插件，方法往往被写到原型上去，部分属性写到构造函数内部。因为属性往往都是配置项，需要传参去配置的，而方法是一样的。

构造出来的对象对原型的增删改查问题。
```js
function Test(){ }
Test.prototype.name = 'prototype';

var test = new Test();

console.log(test.name); // 查

test.num = 1;
console.log(Test.prototype); // 不能增

delete test.name
console.log(Test.prototype); // 不能删

test.name = 'proto'
cosnole.log(Test.prototype); // 不能改
```
通过实例化对象来更改`prototype`，更改祖先上面的东西更改不了。

## constructor构造器
```js
function Telephone(){}
function Handphone(color, brand, system){
  this.color = color;
  this.brand = brand;
  this.system = system;
}

Handphone.prototype = {
  constructor: Telephone
}

var hp1 = new Handphone('red', 'iPhone', 'iOS');
console.log(hp1.constructor); // 是一个函数 
console.log(Handphone.prototype); // 是一个对象
```
- 原型上的`constructor`指向构造函数本身
- 可以通过`Handphone.prototype.constructor`修改构造器指向别的

## \_\_proto__
```js
function Car(){
  // new实例化以后，隐式的var了一个this的一个空对象
  var this = {
    __proto__: Car.prorotype
  }
}
Car.prototype.name = 'Banz';

var car = new Car();
console.log(car); // Banz
```

实例化对象中有`__proto__`，指向构造函数的`prototype`原型对象，实例对象可以使用构造函数`prototype`原型对象的属性和方法，是因为对象有`__proto__`的存在。

::: tip
`__proto__`属于每个实例化对象。每个实例对象原型的容器，它就是装`prototype`的。
:::

总结：当构造函数被`new`的时候，就产生了`this`，`this`并不是空对象，但你就把它当成空对象，`this`中有一个`__proto__`，这个`__proto__`默认就装的是实例化对象以后的原型。当`this`中没有自己的`name`属性，就会到`__proto__`里面去找`name`属性。

- `__proto__`可以修改。
```js
function Person(){ }
Person.prototype.name = '张三'
var p1 = {
  name: '李四'
};

var person = new Person();
console.log(person.__proto__); // {name: '张三', constructor: ƒ}
console.log(person.name); // 张三
/***********************************/
person.__proto__ = p1
console.log(person.name); // 李四
```


原型一定是属于实例化对象的而不是构造函数的。
```js
function Car(){}
Car.prototype.name = 'Mazda';
var car = new Car();

Car.prototype.name = 'Banz';
console.log(car.name); // Benz

/****************************/
Car.prototype.name = 'Mazda';
function Car(){}
var car = new Car();

Car.prototype.name = 'Banz';
console.log(car.name); // Benz

/***************************/
Car.prototype.name = 'Mazda';
function Car(){}
Car.prototype.name = 'Banz';
var car = new Car();

console.log(car.name); // Benz

```
以上都是对属性的重写。

```js
Car.prototype.name = 'Benz';
function Car(){}
var car = new Car();

Car.prototype = {
  name: 'Mazda'
}

var car1 = new Car()

console.log(car.name); // Benz
console.log(car1.name); // Mazda
```
分析：  
重新写了prototype
```js
Car.prototype = {
  name: 'Mazda'
}
```
它是在实例化之后写的，实例化之后写的，跟我创建这个实例的`__proto__`对应的`prototype`已经没有关系了
```js
function Car(){
  var this = {
    __proto__: Car.prototype = {
      name: 'Benz'
    }
  }
}
```
分析下面的例子：
```js
Car.prototype.name = 'Banz';
function Car(){}

var car = new Car()

Car.prototype = {
  name: 'Mazda'
}
var ca1 = new Car();
console.log(car.name); // Banz
console.log(car1.name); // Mazda
```

在没有实例化之前`Car()`底下有一个属性`prototype`，在`prototype`中有一个构造器`constructor`，构造器指向的就是构造函数`Car`本身，在构造函数`Car()`本身又有一个`prototype`属性，存放的是`name: 'Banz'`
> Car.prototype.constructor -> Car() -> prototype -> name:'Banz'

当你实例化了以后，`this`存在了，`this`存放有`__proto__`，`__proto__`对应它实例相对应的`prototype`，`prototype`会从`constructor`里面去拿值，所以实例化的时候直接从构造器里面拿出来的属性
```js
function Car(){
  var this = {
    __proto__: Car.prototype {
      name: 'Banz'
    }
  }
}
```
但是在实例化以后重新写了`prototype`，重写的是构造器`constructor`里面的。

## window return 问题

```js
function test(){
  var a = 1;
  function plus1(){
    a++;
    console.log(a);
  }

  return plus1;
}

var plus = test();
plus();
plus();
plus();

// 使用window改造
function test(){
  var a = 1;
  function add(){
    a++;
    console.log(a);
  }

  window.add = add; // 定义了一个全局变量add，等于函数add
}

test();
add(); // 2
add(); // 3
add(); // 4

// 立即执行函数 再次改造
var add = (function(){
  var a = 1;
  function add(){
    a++;
    console.log(a);
  }
  return add;
})();

add(); // 2
add(); // 3
add(); // 4
```

## js插件的写法    
立即执行函数里面写一个构造函数，将这个构造函数保存到window上的一个变量。
```js
(function(){

  function Test(){

  }

  window.Test = Test
})();

var test = new Test();
```
:::tip
一个自启动函数，插件的标配
:::

### 练习
1. 写一个插件，任意传两个数字调用插件内部方法可进行加减乘除功能
```js
;(function(){
  function Compute(opt){
      this.firstNum = opt.firstNum;
      this.secondNum  = opt.secondNum;
  }
  Compute.prototype = {
    plus: function(){
      var sum = 0;
      sum = this.firstNum + this.secondNum;
      console.log(sum)
    },

    minus: function(){
      var res = 0;
      res = this.firstNum - this.secondNum
      console.log(res)
    },

    multiply: function(){
      var acc = 1
      acc = this.firstNum * this.secondNum
      console.log(acc);
    },

    divide: function(){
      var res = 1;
      res = this.firstNum / this.secondNum;
      console.log(res);
    }
  }

  window.Compute = Compute
})()

var compute = new Compute({
  firstNum: 10,
  secondNum: 2
})
compute.plus();
compute.minus();
compute.multiply();
compute.divide();
```
::: tip
参数可以在调用方法的时候传递，所以可不写在构造函数上，写在方法上
:::

## 原型与原型链深入
- 原型链的顶端`Object.prototype`。`object`仍然是有原型的。
- `Object.prototype`底下保存了一个`toString`的方法。
- 原型链上的增删改只能是它自己本身

例一
```js
Professor.prototype.tSkill = 'JAVA'
function Professor(){}
var professor = new Professor();

Teacher.prototype = professor;
function Teacher(){
  this.mSkill = 'JS/JQ';
  this.success = {
    alibaba: '28',
    tencent: '30'
  }
}
var teacher = new Teacher();

Student.prototype = teacher;
function Student(){
  this.pSkill = 'HTML/CSS';
}
var student = new Student()

// console.log(student)
console.log(student.success);
```
更改student的父级元素（就是teacher的属性）
```js
student.success.baidu = '100';
console.log(teacher, student);

student.success.alibaba = '29';
console.log(teacher);
```
teacher.success加上了baidu属性，不是赋值到student实例里，赋值到了student实例的原型里面。这是因为teacher赋值到Student.prototype，teacher在student实例的原型对象里。  
**student可以修改teacher的引用属性**

例二
```js
Professor.prototype.tSkill = 'JAVA'
function Professor(){}
var professor = new Professor();

Teacher.prototype = professor;
function Teacher(){
  this.mSkill = 'JS/JQ';
  this.students = 500;
}
var teacher = new Teacher();

Student.prototype = teacher;
function Student(){
  this.pSkill = 'HTML/CSS';
}
var student = new Student()
console.log(student.students); // 500

student.students++;
console.log(teacher);
console.log(student);
```
teacher和student分别有什么变化？  
teacher没有变，student的增加了一个students属性值为501。   
student不能去修改teacher的原始值属性，但是会将teacher.students复制下来，他认为你想给student增加一个students属性。
> student.students = student.students + 1  

student.students取值，因为往上找能找到为500，所以是500+1。   
**student不可以修改teacher的原始值，但是会复制一份到自己实例上再修改**   
但是不推荐这样修改继承的原型值。

例三（笔试题）
```js
function Car(){
  this.brand = 'Banz'
}

Car.prototype = {
  brand: 'Mazda',
  intro: function(){
    console.log('我是'+ this.brand + '车');
  }
}

var car = new Car()
car.intro(); // Benz

/**
 * function Car(){
 *    var this = {
 *      brand: 'Benz'
 *    }
 * }
 * Car.prototype --> intro()
*/
```
分析：实例化过程就是this产生的环节，在调用intro()的时候，this中没有，所以去Car.prototype原型里面找，在intro()里的this指向对象本身，在对象中有brand，那this就指向自己的brand了。

::: tip
谁在使用this，this就指向谁
:::

想要打印Mazda呢？
```js
Car.prototype.intro(); // Mazda
```

例四
- 普通函数不写返回值，默认返回undefined
- 构造函数通过实例化后，返回this

```js
function Person(){
  /**
   * this = {
   *    weight: 129;
   * }
  */
  this.smoke = function(){
    this.weight--;
  }
}

Person.prototype = {
  weight: 130;
}

var person = new Person();
person.smoke();
console.log(person);
```
在smoke方法中执行this.weight--相当于
> this.weight = this.weight - 1  

取值this.weight, 原型里有，而person没有这个属性，person中添加weight属性。而原型里面的weight属性值不变。

## 声明对象
声明对象的方法
```js
var obj1 = {}
console.log(obj1);

var obj2 = new Object(); // 公司不用这种，因为它和字面量声明没有区别，添加属性什么的又麻烦、乱
console.log(obj2);

function Obj(){}
var obj3 = new Obj()
console.log(obj3); // 用自定义的构造函数构造的。它的构造器指向的是Obj()自定义的构造器
```
用字面量和系统自带的构造器去声明的对象，他们的构造器都是Object，他们两的原型都是原型链顶端的 Object.prototype。 
- 除了写插件，尽量都用字面量去声明对象
- 原型的原型一定是系统自带的Object构造出来的

## Object.create
Object.create(对象/null) 创建对象。**括号里面可以指定对象原型，放你想要的原型**
```js
function Obj(){}
Obj.prototype.num = 1;
var obj1 = Object.create(Obj.prototype);
console.log(obj1);

var obj2 = new Obj();
console.log(obj2);
```
obj1与obj2就像双胞胎，他们的对象原型、构造函数是一样的。  
::: tip
new的工作：
- 实例化obj2
- 调用构造函数Obj的初始化属性和方法
- 指定实例对象的原型proto: Obj.prototype
:::


创建obj1空对象
```js
var obj1 = Object.create(null); 
console.log(onj1);// 完全空的， 对象原型都没有__proto__

obj1·num = 1;
var obj2 = Object.create(obj1);
console.log(obj2);// obj1作为obj2的原型传进来的，所以就会挂载到__proto__中
```
Object.create的作用：
- 需要自定义prototype时候，可以使用Object.create来指定原型
- 把其他对象作为当前对象的原型（继承关系）

::: tip
是不是所有的对象都应该继承 Object.prototype 呢？   
不是，Object.create(null)这种对象就不会继承
:::
