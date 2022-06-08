---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 10.原型、原型链、闭包立即执行函数、插件开发
---

## 原型
### 1. 原型`prototype`
```javascript
function Handphone(){

}
console.log(Handphone.prototype); // {constructor: f
```
原型`prototype`是`function`对象的一个属性，也是一个对象。

### 2. 原型的作用
在实例化对象的时候总有一些写死的值，这些写死的值，在每次`new`的时候都需要去走一遍这个流程，这种代码对于实例化来说是一种代码冗余。原型的作用就是解除这种冗余，把要写死的内容挂到原型上去，需要参数去传值的属性就写到`this`里面去，把需要配置的方法或属性就写在属性中，固定的方法或属性就写在原型上。
```javascript
function Handphone(color, brand){
  this.color = color;
  this.brand = brand;
  this.screen  = '18:9';
  this.system = 'Android'
}

Handphone.prototype.rom = '64G';
Handphone.prototype.ram = '6G';
Handphone.prototype.call = fuinction(){
  console.log('I am calling somebody.');
}

var hp1 = new Handphone('red', '小米');
var hp2 = new Handphone('black', '华为');

console.log(hp1.rom);// 64G
console.log(hp2.ram);// 6G

console.log(hp1.screen); // 18:9  自己有的属性就不会到原型上去找属性了
```
总结：
1. `prototype`对象是定义构造函数构造出的每个对象的**公共祖先**。
2. 所有被构造函数构造出的对象都可以继承原型上的属性和方法。
3. 当我们需要参数传值时就写到this里去，需要写死这个值时就写到原型上面，直接继承就行了。
4. 为什么所有的方法都写在原型上面？为什么只有部分属性会写到构造函数内部？
   往往属性都是配置项，都是需要传参去配置的，而函数就是方法，都是一样的，所有的方法都会写在原型上面，而只有这种需要传参配置的我们会写在构造函数内部。


经验：一个插件，方法往往被写到原型上去，部分属性写到构造函数内部。因为属性往往都是配置项，需要传参去配置的，而方法是一样的。

### 3. 构造出来的对象对原型的增删改查问题
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
通过实例化对象来更改`prototype`，不能更改祖先上面的东西。

### 4. constructor构造器
```js
function Handphone(color, brand, system){
  this.color = color;
  this.brand = brand;
  this.system = system;
}

var hp1 = new Handphone('red', 'iPhone', 'iOS');
console.log(hp1.constructor); // 是一个函数 
console.log(Handphone.prototype.constructor); // 是一个对象 f Handphone(...)
```
结论：原型上的`constructor`指向构造函数本身

修改constructor指向
```javascript
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

console.log(Handphone.prototype.constructor); // 是一个对象 f Telephone(...)
```
 可以通过`Handphone.prototype.constructor`修改构造器指其他构造函数。

### 5. `__proto__`
```js
function Car(){
  // new实例化以后，隐式的var了一个this的一个空对象
  // var this = {
  //   __proto__: Car.prorotype
  // }
}
Car.prototype.name = 'Banz';

var car = new Car();
console.log(car); // Banz
```

实例化对象中有`__proto__`，指向构造函数的`prototype`原型对象，实例对象可以使用构造函数`prototype`原型对象的属性和方法，是因为对象有`__proto__`的存在。

当构造函数被`new`的时候，就产生了`this`，`this`并不是空对象，但你就把它当成空对象，`this`中有一个`__proto__`，这个`__proto__`默认就装的是实例化对象以后的原型。当`this`中没有自己的`name`属性，就会到`__proto__`里面去找`name`属性。

总结：
1. `__proto__`属于每个实例化对象的不是属于构造函数的。
2. `__proto__`是每一个容纳原型的容器，存的是原型的引用。
3. `__proto__`是this对象的一个键名，为了方便找到prototype设置的属性。

### 6. 修改`__proto__`的值
```js
function Person(){ }
Person.prototype.name = '张三';

var person = new Person();
console.log(person.__proto__); // {name: '张三', constructor: ƒ}
console.log(person.name); // 张三

var p1 = {
  name: '李四'
};

person.__proto__ = p1
console.log(person.name); // 李四
```

### 7. 原型的重新赋值
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
var car1 = new Car();
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

## window和return问题
### 1. return 
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

```
分析：把plus1 return出去了，plus1死死的拽住testAO把它（testAO）带出去了，testAO里原本就有a，所以每次执行的时候a可以被改变，就是闭包。闭包拿出来以后把它赋值给了plus，形成了闭包以后把这个plus1 return出来，return到全局被plus保存，这个plus1相当于变成了全局函数了。

### 2. window
```javascript
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
```
结论：window和return能实现同样的功能。

### 3. 立即执行函数
```javascript
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
写立即执行函数的目的：防止变量、函数作用域的污染，为了隔离全局的作用域。    
结论：用立即执行函数把它包起来，这样我们作用域就被限制到这个执行函数内部。

## js插件开发    
立即执行函数里面写一个构造函数，将这个构造函数保存到window上的一个变量。   
标准写法：
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

## 练习
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

```javascript
;(function() {
    function Compute() {}
    Compute.prototype = {
        plus: function(a, b) {
            console.log(a + b);
        },

        minus: function(a, b) {
            console.log(a - b);
        },

        mul: function(a, b) {
            console.log(a * b);
        },

        div: function(a, b) {
            console.log(a / b);
        }
    }

    window.Compute = Compute;
}());

var compute = new Compute();
compute.plus(1, 2); // 3
compute.minus(1, 2); // -1
compute.mul(1, 2); // 2
compute.div(1, 2); // 0.5
```








## 原型与原型链深入
- 原型链的顶端是`Object.prototype`。`object`仍然是有原型的。
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
更改`student`的父级元素（就是`teacher`的属性）
```js
student.success.baidu = '100';
console.log(teacher, student);

student.success.alibaba = '29';
console.log(teacher);
```
`teacher.success`加上了`baidu`属性，不是赋值到`student`实例里，赋值到了`student`实例的原型里面。这是因为`teacher`赋值给了`Student.prototype`，`teacher`在`student`实例的原型对象里。  
**`student`可以修改`teacher`的引用属性**

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
`teacher`和`student`分别有什么变化？  
`teacher`没有变，`student`增加了一个`students`属性值为`501`。   
`student`不能去修改`teacher`的原始值属性，但是会将`teacher.students`复制下来，他认为你想给`student`增加一个`students`属性。
> student.students = student.students + 1  

`student.students`取值，因为往上找能找到为`500`，所以是`500+1`。   
**`student`不可以修改`teacher`的原始值，但是会复制一份到自己实例上再修改**   
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
分析：实例化过程就是`this`产生的环节，在调用`intro()`的时候，`this`中没有，所以去`Car.prototype`原型里面找，在`intro()`里的`this`指向对象本身，在对象中有`brand`，那`this`就指向自己的`brand`了。

::: tip
谁在使用this，this就指向谁
:::

想要打印`Mazda`呢？
```js
Car.prototype.intro(); // Mazda
```

例四
- 普通函数不写返回值，默认返回`undefined`
- 构造函数通过实例化后，返回`this`

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
在`smoke`方法中执行`this.weight--`相当于
> this.weight = this.weight - 1  

取值`this.weight`, 原型里有，而`person`没有这个属性，`person`中添加`weight`属性。原型里面的`weight`属性值不变。

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
用字面量和系统自带的构造器去声明的对象，他们的构造器都是`Object`，他们两的原型都是原型链顶端的`Object.prototype`。 
- 除了写插件，尽量都用字面量去声明对象
- 原型的原型一定是系统自带的`Object`构造出来的

## Object.create
`Object.create(对象/null)` 创建对象。**括号里面可以指定对象原型，放你想要的原型**
```js
function Obj(){}
Obj.prototype.num = 1;
var obj1 = Object.create(Obj.prototype);
console.log(obj1);

var obj2 = new Obj();
console.log(obj2);
```
`obj1`与`obj2`就像双胞胎，他们的对象原型、构造函数是一样的。  
::: tip
`new`的工作：
- 实例化`obj2`
- 调用构造函数`Obj`的初始化属性和方法
- 指定实例对象的原型`proto: Obj.prototype`
:::


创建`obj1`空对象
```js
var obj1 = Object.create(null); 
console.log(obj1);// 完全空的， 对象原型都没有__proto__

obj1·num = 1;
var obj2 = Object.create(obj1);
console.log(obj2);// obj1作为obj2的原型传进来的，所以就会挂载到__proto__中
```
`Object.create`的作用：
- 需要自定义`prototype`时候，可以使用`Object.create`来指定原型
- 把其他对象作为当前对象的原型（继承关系）

::: tip
是不是所有的对象都应该继承 `Object.prototype` 呢？   
不是，`Object.create(null)`这种对象就不会继承
:::

```js
var obj = Object.create(null);
obj.num = 1;
var obj1 = {
  count: 2;
}
obj.__proto__ = obj1;
console.log(obj.count); // undefined
```
手动指定`__proto__`属性的值无效，`__proto__`必须是系统内置的，可以更改，但是不能自造。

## `undefined`与`null`
`undefined`与`null`不能使用`toString()`方法。原始值是没有属性的。`undefined`和`null`不能经过包装类，且没有原型。
```js
var num = 1;
num.toString(); // new Number(1) -> toString(); 经过了包装类
```
为什么`Number`有一个自己的`toString()`方法，而不是继承自`Object.prototype`里面的`toString()`？

```js
var num = 1;
var obj = {};
var obj2 = Object.create(null);
document.write(num);
document.write(obj); // [object Object]
document.write(obj2); // Cannot convert object to primitive value

// 手动添加toString()方法
obj2.toString = function(){
  return 'hello'
}
document.write(obj2.toString); // hello 
```
`document.write()`打印的时候有一个隐式转换，通过原型链找到`toSring()`方法，转换成`string`。但是`obj2`没有原型。

## toString方法重写
Number、String、Boolean、Array都有toString方法
```js
Object.prototype.toString.call(1); // [object Number] 对象类型的Number构造函数
Number.prototype.toString.call(1); // '1'
```

## call、apply
更改this的指向。
```js
function test(){
  console.log('a');
}

test(); // test.call() 隐式添加了call

/******************************/

function Car(brand, color){
  this.brand = brand;
  this.color = color;
}

var newCar = {};

Car.call(newCar, 'Benz', 'red');
Car.apply(newCar, ['Benz', 'red']);
console.log(newCar);
```
使用call和apply以后，newCar可以使用Car中的属性和方法。
案例分析
```js
function Compute(){
  this.plus = function(a, b){
    console.log(a + b);
  },
  this.minus = function(a, b){
    console.log(a - b);
  }
}

function FullCompute(){
  Compute.apply(this);

  this.mul = function(a, b){
    console.log(a * b);
  },

  this.div = function(a, b){
    console.log(a / b);
  }
}

var compute = new FullCompute();
compute.plus(1, 2);
compute.minus(1, 2);
compute.mul(1, 2);
compute.div(1, 2);
```

## bind
bind改变this指向后，返回一个新的函数，不执行。call改变this指向并立即执行。
```js
var p1 = {
    name: '张三',
    hobby: this.hobby,
    play: function(sex, age) {
        console.log('年龄为' + age + '岁，性别为' + sex + '的' + this.name + '喜欢' + this.hobby);
    }
}

var p2 = {
    name: '李四',
    hobby: '踢足球'
}

p1.play.call(p2, '男', 20);
p1.play.bind(p2, '男', 20)();
// 一般采用下面的方式
var fn = p1.play.bind(p2, '男', 20);
fn();
```

使用场景:    
事件处理函数改变this指向
```js
bindEvent: function() {
  var _self = this;
  // 使用call修改this指向，this.tabClick.call(this)是会直接执行的，改变了this指向以后立马执行tabClick，但是我并没有点击，就执行了，肯定是不对的。而事件处理函数，在没有click是不会执行的，所以使用一个匿名函数。
  this.tab.addEventListener('click', function() {
      _self.tabClick.call(_self); 
  }, false);

  // 使用bind，bind返回一个新的函数，不会立马执行。
  this.tab.addEventListener('click', this.tabClick.bind(this), false);
},
```

只要函数里面嵌套函数、事件处理函数，在面向对象的写法中都会涉及this指向.

bind挂载在Function.prototype，是无法直接访问到的。 
使用call和apply模拟bind方法：
```js
var p = {
    age: 18
}

function Person() {
    console.log(this);
    console.log(this.age);
}

Person.call(p);
Person.apply(p);
Person.bind(p)();
```

```js
var p = {
    age: 18
}

function Person() {
    console.log(this);
    console.log(this.age);
}

var person2 = Person.bind(p); // this指向失败
new person2();
/**
 * bind仅仅是返回一个新的函数，把这个函数交给person2，在new person2()的时候this指向也发生了改变，此时的this指向了实例化后的对象本身：var p2 = new person2()。这个bind失效了。因为new的时候，this指向Person了。所以var person2 = Person.bind(p);等于没有用。
 * 
 * var person2 = Person.bind(p);  // Person`()
 * var p2 = new person2();
 * 等效于
 * var p2 = new Person().
 * 
 * 
 * function Person(){
 *      this -> window
 *      'use strict' - this -> null
 *  }
 * 
 * new Person() Person(){
 *      this -> 实例对象
 *  }
 * 
 * function Person(){...}作为普通函数情况下，this指向window，使用Person.bind(p)之后，相当于，修改了普通函数Person的this指向，把this从window修改为p。
 * 同时Person.bind(p)返回了一个新的函数Person()`，person2和Person`指向同一个引用，使用new的时候是将person2中的this指向实例对象。只要使用new，person2就是一个构造函数，它里面的this就指向实例对象。
*/
```

bind的两个特点：1. 不执行。2. 实例化失效。   
1. 不执行：
```js
var p = {
    age: 20
}

function Person() {
    console.log(this);
    console.log(this.age);
}

// 更改this指向，实际上更改执行器上下文->context
Function.prototype.bindy = function(context) {
    // 使用的this肯定是指向调用bindy的function，但是return函数中this指向的是window
    var _self = this; // 调用bindy的function

    // 不执行，肯定return一个函数。因为this.apply(context);会直接执行，而bind不执行
    return function() {
        _self.apply(context);
    }
}
Person.bind(p)();
Person.bindy(p)();
```

2. 传入参数：
```js
// 传入参数第一种情况
Person.bind(p, '张三', 'male')();
// 传入参数第二种情况
var p1 = Person.bind(p, '张三');
p1('male');
```
实现：
```js
var p = {
    age: 20
}

function Person(name, sex) {
    console.log(this);
    console.log(this.age);
    console.log(name, sex); // 1.新增
}

Function.prototype.bindy = function(context) {
    var _self = this;
    args = Array.prototype.slice.call(arguments, 1); // 返回一个数组。第一个参数是this，去掉第一个参数，后面才是需要的参数。
    console.log(args);
    return function() {
        var newArgs = Array.prototype.slice.call(arguments); // 匿名函数的参数列表
        console.log(args, newArgs);
        _self.apply(context, args.concat(newArgs));
    }
}
Person.bindy(p, '张三')('male');
```
3. 实例化失效
要求
```js
var p2 = Person.bind(p, '张三');
new p2('male'); // this指向构造函数的实例对象
```
实际上，此时的this指向p对象。
```js
Function.prototype.bindy = function(context) {
    var _self = this;
    args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var newArgs = Array.prototype.slice.call(arguments);
        console.log(this); // 实例化对象，因为new了
        console.log(_self); // 构造函数Person
        console.log(this instanceof _self);// false。因为_self在bindy时已经改变了this指向， 那怎么样让它是_self构造出来的呢？

        // this如果是构造函数构造出来的，也就是new出来的，那么原本的context就要指向this；
        _self.apply(this instanceof _self ? this : context, args.concat(newArgs));
    }
}

var p2 = Person.bindy(p, '张三');
new p2('male'); // this指向p
```
想让匿名函数里面的this是_self构造出来的，
```js
var p = {
    age: 20
}

function Person(name, sex) {
    console.log(this);
    console.log(this.age);
    console.log(name, sex);
}

Function.prototype.bindy = function(context) {
    var _self = this;
    args = Array.prototype.slice.call(arguments, 1);
    // 实现
    var fn = function() {
        var newArgs = Array.prototype.slice.call(arguments);
        console.log(this); // fn()
        console.log(this instanceof _self); // true
        _self.apply(this instanceof _self ? this : context, args.concat(newArgs));
    }
    console.log(this); // Person
    // fn和this指向一样，让他们构造器相等
    fn.prototype = this.prototype;
    return fn;
}
var p2 = Person.bindy(p, '张三');
new p2('male');
```
发现问题
```js
Function.prototype.bindy = function(context) {
    var _self = this,
        args = Array.prototype.slice.call(arguments, 1),
        tempFn = function(){};
    var fn = function() {
        var newArgs = Array.prototype.slice.call(arguments);
        _self.apply(this instanceof _self ? this : context, args.concat(newArgs));
    }

    fn.prototype = this.prototype;
    fn.prototype.num = 2; // 会修改Person.prototype.num的值
    return fn;
}
```

利用圣杯模式解决：
```js
var p = {
    age: 20
}

Person.prototype.num = 1;

function Person(name, sex) {
    console.log(this);
    console.log(this.age);
    console.log(name, sex);
}

Function.prototype.bindy = function(context) {
    var _self = this,
        args = Array.prototype.slice.call(arguments, 1),
        tempFn = function() {};
    var fn = function() {
        var newArgs = Array.prototype.slice.call(arguments);
        _self.apply(this instanceof _self ? this : context, args.concat(newArgs));
    }

    tempFn.prototype = this.prototype;
    fn.prototype = new tempFn();
    fn.prototype.num = 2; // 会修改Person.prototype.num的值
    return fn;
}
var p2 = Person.bindy(p, '张三');
p2('male');
```

## 练习
1. 年龄为多少岁，姓名为xx，买了一辆排量为xx的xx颜色的xx牌子的车(使用call/apply)
```js
function Car(opt){
  console.log(opt)
  this.color = opt.color;
  this.brand = opt.brand;
  this.displacement = opt.displacement;
}
function Person(opt){
  // Car.apply(this, opt);
  Cars.call(this,opt);
  this.name = opt.name;
  this.age = opt.age;

  this.buy = function(){
    console.log(`年龄为${this.age}岁，姓名为${this.name}，买了一辆排量为${this.displacement}的${this.color}的${this.brand}的车`);
  }
}

var p1 = new Person({
  name: 'Tom',
  age: '20',
  color: 'red',
  brand: 'Benz',
  displacement: '3.0'
});
console.log(p1)
p1.buy();
```

