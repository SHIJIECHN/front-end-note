---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: 12. 继承深入、call_apply、圣杯模式、模块化
---

## 继承深入

### 1. 原型
```javascript
function Person(){

}

Person.prototype.name = 'Lucy';

var p = new Person(); 
// 里边保存了一个name:"Luncy" 实际并没有在person p的这个对象上，
// 它是在我对象下面的原型链下面的原型上面，它保存原型上面
console.log(p);
```
解释：
1. 构造函数起作用的最根本操作时必须要经过new，如果不new的话原型就不存在。
2. 原型要在构造函数上生成，如果不生成的话，不可能在new了以后生成对象再去prototype。因为原型是属于祖先性质的，所有都继承与它，所有说实例化出来的对象继承这个构造函数的原型属性。
3. 原型对象实际上就是构造函数的一个属性，只不过这个属性是对象而已。
4. 我们经过new实例化这个人构造函数出来这个对象以后，这个对象是完全继承于这个prototype。
5. p对象上面没有name属性，但是p继承了Person这个构造函数的原型，能够通过原型去访问到这个name。
  
总结：
1. 实例化出来的对象继承函数的原型。
2. 所有的这个构造函数出来的对象，都继承于它的原型。


### 2. 原型链继承
```javascript
Professor.prototype = {
    name: 'Mr.zhang',
    topSkill: 'JAVA'
}
function Professor(){}
        
var professor = new Professor();

// 把实例化的professor赋给了teacher的原型
Teacher.prototype = professor;
       
function Teacher(){
            
    this.middleSkill = 'JavaScript/jQuery';
    this.name = 'Mr.Wang';
}
        
var teacher = new Teacher();
       
Student.prototype = teacher;
        
function Student(){
    this.name = 'Mr.Li';
    this.primarySkill = 'HTML/CSS';
}
       
var student = new Student();
console.log(student);
/**
student实例对象的原型链
student = {
	name:'Mr.Li',
  pSkill:'HTML/CSS',
  __proto__:teacher = {
  	name:'Mr.Wang',
    tSkill:'JS/JQ',
    	__proto__:professor = {
      	__proto__:Professor.prototype = {
        	name:'Mr.zhang',
          tSkill:'JAVA',
          __proto__:Object.prototype
      }
    }
  }
}
*/
```
解释：student继承了原型链上的所有属性。
缺点：并不需要所有属性都继承，比如name。

### 3. call_apply实现继承，借取属性
```javascript
Teacher.prototype.wife = 'Ms.Liu';
function Teacher(name, mSkill, age, major) {
    this.age = age;
    this.mSkill = mSkill;
}
function Student(name, mSkill, age, major) {
    Teacher.apply(this, [name, mSkill]);
    this.age = age;
    this.major = major;
}

var student = new Student('Mr.Zhang', 'JS/JQ', 18, 'Computer');
console.log(student);
```
解释：
1. 使用apply解决，通过apply来改变this的指向。然后借用别人的属性和方法。
2. 实现借用别人的属性和方法的时候用这种方法（但是这种方法并不是继承）。
3. 这种方式构造的student无法获取到teacher原型上的属性。

### 4. 公共原型
```js
function Teacher(){
    this.name = 'Mr. Li';
    this.tSkill = 'JAVA';
}

Teacher.prototype = {
    pSkill: 'JS/JQ'
}

var t = new Teacher();
console.log(t);

function Student(){
    this.name = 'Mr. Wang';
}

var s = new Student()
console.log(s);

Student.prototype = Teacher.prototype
Student.prototype.age = 18; // Teacher.prototype中也增加了age属性
```
总结：
Student.prototype = Teacher.prototype;这种方式让student继承了teacher的原型，并不会继承teacher的属性。修改了student的prototype，这个时候teacher的prototype也发生了改变，说明他们两个的prototype指向的是同一个对象（公共原型）。

### 5. 圣杯模式

采用一个中间构造函数Buffer实现继承(圣杯模式)
```js
function Teacher(){
    this.name = 'Mr. Li';
    this.tSkill = 'JAVA';
}

Teacher.prototype = {
    pSkill: 'JS/JQ'
}

var t = new Teacher();
console.log(t);

function Student(){
    this.name = 'Mr. Wang';
}

var s = new Student()
console.log(s);

function Buffer(){}
Buffer.prototype = Teacher.prototype;
var buffer = new Buffer();
Student.prototype = buffer
Student.prorotype.age = 18;
var s = new Student();
console.log(s);

/**
s1的原型链:
s1 = {
	name:'Mr.Wang',
  __proto__:buffer = {
  	__proto__:Teacher.prototype = {
    	pSkill: 'JS/JQ',
      __proto__:Object.prototype
    }
  }
}
*/
```
解释：建一个新的构造函数，这个构造函数去继承teacher的原型，而student原型则去继承新的构造函数实例化对象buffer。这个时候student的原型和teacher的原型就不是同一个对象了，而且student可以继承teacher的属性和方法。

优化
```js
function Teacher(){}
function Student(){}
function Buffer(){}

inherit(Student, Teacher)
var s = new Student();
var t = new Teacher();

console.log(s);
console.log(t)

function inherit(Target, Origin){
    function Buffer(){}
    Buffer.prototype = Origin.prototype;
    Target.prorotype = new Buffer(); // 要放在下面
    Target.prototype.constructor = Target; // 还原构造器，把Student构造器重新指向Student
    Target.prototype.super_class = Origin; // 设置继承源，找到真正的构造对象
}
```
为什么需要执行子类的constructor指向呢？   
```javascript
function Teacher() {};
Teacher.prototype = {
	name : 'Mr.zhang'
}
```
重写原型的话，此时将{}赋值给Teacher.prototype，此时Teacher.prototype的值等于{}，丢失了原本constructor属性。{}是系统通过Object构造函数实例化出来的对象，Teacher.prototype.constructor就相当于{}.constructor ----> Object.prototype.constructor ---> Object构造函数。所以需要重新设置子类的constructor指向。

## 闭包的实现方式
### 1. 普通的闭包
```js
function tess(){
    var num = 0; //私有变量 成为了add的私有变量，其他地方访问不到
    function add(){
        num++;
        console.log(num);
    }
    return add;
}
var add = test();
add(); // 1
add(); // 2
add(); // 3
```
解释：add拽住test的AO（test的AO存在num）被带到全局去（add拽住test的AO，test的AO存在num，所以只有它能访问）。

### 2. 对象的闭包
```js
function test(){
    var num = 0;
    var compute = {
        add: function(){
            num++;
            console.log(num);
        },
        minus: function(){
            num--;
            console.log(num);
        }
    }
    return compute;
}
var compute = test();
compute.add(); // 1
compute.add(); // 2
compute.add(); // 3
compute.minus(); // 2
```
通过返回一个对象，对象里面形成闭包。   

### 3. 构造函数的闭包
```js
function Compute(){
    var num = 0;
    this.add = function(){
        num++;
        console.log(num);
    },
    this.minus = function(){
        num--;
        console.log(num);
    }
}

var compute = new Compute();
compute.add(); // 1
compute.add(); // 2
compute.add(); // 3
compute.minus(); // 2
```
构造函数在new的时候隐式return this。

### 4. 圣杯模式的闭包实现继承
```js
function test(){
    var Buffer = function(){}
    function inherit(Target, Origin){
        Buffer.prototype = Origin.prototype;
        Target.prototype = new Buffer();
        Target.prototype.constructor = Target;
        Target.prototype.super_class = Origin;
    }
    return inherit;
}

var inherit = test();
```
采用立即执行函数优化
```js
var inherit = (function(){
    var Buffer = function(){}
    function inherit(Target, Origin){
        Buffer.prototype = Origin.prototype;
        Target.prototype = new Buffer();
        Target.prototype.constructor = Target;
        Target.prototype.super_class = Origin;
    }
    return inherit;
})();
```
当浏览器加载后，函数会立即执行，`return`一个函数给`inherit`。   
再次优化，直接返回匿名函数
```js
var inherit = (function(){
    var Buffer = function(){}
    return function(Target, Origin){
        Buffer.prototype = Origin.prototype;
        Target.prototype = new Buffer();
        Target.prototype.constructor = Target;
        Target.prototype.super_class = Origin;
    }
})();
```
总结：
1. 企业写法（这种方法是模块化开发的形式）：使用立即函数。
2. 立即执行函数的好处：立即执行函数给自己创建了一个作用域，里面定义的变量与外面没有关系，拥有了自己的命名空间。这种方法就叫模块化开发，防止了污染全局，利于后期的维护和二次开发。

## 模块化
### 1. 案例一
```js
var inherit = (function(){
    var Buffer = function(){};
    return function(Target, Origin){
        Buffer.prototype = Origin.prototype;
        Target.prototype = new Buffer();
        Target.prototype.constuctor = Target;
        Target.prototype.super_class = Origin;
    }
})();

var initProgrammer = (function(){
    // 伪全局
    var Programmer = function(){};
    Programmer.prototype = {
        name: '程序员',
        tool: '计算机',
        work: '编写应用程序',
        duration: '10个小时',
        say: function(){
            console.log(`我是一名${this.myName} ${this.name}，我的工作是用${this.tool}${this.work}，我每天工作${this.duration}，我的工作需要用到${this.lang.toString()}.`)
        }
    }

    function FrontEnd(){}
    function BackEnd(){}
    inherit(FrontEnd, Programmer);
    inherit(BackEnd, Programmer);

    FrontEnd.prototype.lang = ['HTML', 'CSS', 'JavaScript'];
    FrontEnd.prototype.myName = '前端';

    BackEnd.prototype.lang = ['Node', 'Java', 'SQL'];
    BackEnd.prototype.myName = '后端';

    return {
        FrontEnd: FrontEnd,
        BackEnd: BackEnd
    }
})();

var frontEnd = new initProgrammer.FrontEnd();
var backEnd = new initProgrammer.BackEnd();

frontEnd.say();
backEnd.say();
```
解释：
1. 在全局容易污染其他的变量，在函数里伪造了一个伪全局，为了防止污染外面的空间，自己造另一个自己的空间。
2. 

### 2. 案例二：计算器
```js
var initCompute = (function(){
    var a = 1,
        b = 2;
    function add(){
        console.log(a + b);
    }
    function minus(){
        console.log(a - b);
    }
    function mul(){
        console.log(a * b);
    }
    function div(){
        console.log(a / b);
    }

    return function(){
        add();
        minus();
        mul();
        div();
    }
})();
initCompute();
```

## CSS圣杯布局
```html
// 主要利用 margin负值  padding赋值  position:reative做的
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
      .cleafix::after {
          content: "";
          display: table;
          clear: both;
      }
      .wrap {
          width: 600px;
          margin: 0 auto;
          border: 1px solid #000;
              }
      .top,
      .bottom {
          height: 100px;
          background-color: black;
      }
      .main {
          padding: 0 100px;
          overflow: hidden;
      }
      .main .left,
      .main .right,
      .main .center {
          float: left;
          position: relative;
          margin-bottom: -4000px;
          padding-bottom: 4000px;
      }
          
      .main .left,
      .main .right {
          width: 100px;
          background-color: yellow;
      }
              
      .main .center {
          width: 100%;
          background-color: green;
      }

      .main .left {
          margin-left: -100px;
      }
      .main .right {
          left: 100px;
          margin-left: -100px;
      }
    </style>
</head>

<body>
  <div class="wrap">
    <div class="top"></div>
        <div class="main cleafix">
              <div class="left">123</div>
              <div class="center">456<br/>789</div>
              <div class="right">789</div>
        </div>
    <div class="bottom"></div>
  </div>
</body>
```

## 练习
1. 打印一个参数能被3或5或7整除的数
2. 打印斐波那契数列的第N位
3. 打印从0到一个数的累加值
```js
;(function(){
  var myTest = function(){
    var div = function(n){
      if(n % 3 === 0 || n % 5 === 0 || n % 7 === 0){
        return n;
      }
    }
    
    // 打印斐波那契数列的第N位
    var fib = function (n){
      if(n == 1 || n == 2){
        return 1;
      }
      if(n < 0){
        return 0;
      }
      return fib(n - 1) + fib(n - 2);
    }
    
    // 打印从0到一个数的累加值
    
    var sum = function(n){
      var res = 0
      for(var i = 0; i <= n; i++){
        res += i;
      }
      return res;
    }
  }
  return myTest;
})
```











## 目标
- for in， hasOwnProperty，in，instanceOf

## 对象属性遍历
实现链式调用
```js
var sched = {
  wakeup: function(){
    console.log('Running');
    return this; // *******返回this******
  },
  morning: function(){
    console.log('Going shopping');
    return this;
  },
  noon: function(){
    console.log('Having a rest');
    return this;
  },
  afternoon: function(){
    console.log('studying');
    return this;
  },
  evening: function(){
    console.log('Walking');
    return this;
  },
  night: function(){
    console.log('Sleeping');
    return this;
  }
}
sched().wakeup().morning().noon().afternoon().evening().night();
```
在方法中`return this`，实现链式调用。

```js
var myLang = {
  No1: 'HTML',
  No2: 'CSS',
  Mo3: 'JavaScript',
  myStudyingLang: function(num){
    console.log(this['No' + num])
  }
}
myLang.myStudying(1); // HTML
```
对象属性访问


### for in
对象枚举属性 -> 遍历
```js
var arr = [1, 2, 3, 4, 5];
for(var i = 0; i < arr.length; i++){
  console.log(arr[i]);
}

var car = {
  brand: 'Benz',
  color: 'res',
  displacement: '3.0',
  lang: '5',
  width: '2.5'
}
for(var key in car){
  console.log(key + ':' + car[key]);
  //car.key => car['key'] => undefined
}

for(var i in arr){
  console.log(arr[i]);
}
```
`for in` 既可以遍历对象，也可以遍历数组。

### hasOwnProperty
```js
var obj = {
  name: 'Tom',
  age: 20
}

function Car(){
  this.brand = 'Benz',
  this.color = 'red',
  this.displacement = '3.0'
}

Car.prototype = {
  lang: 5,
  width: 2.5
}

Object.prototype.name = 'Object';

var car = new Car();
console.log(car)

for(var key in car){
  if(car.hasOwnProperty(key)){
    console.log(key + ':' + car[key])
  }
}
```
`for in`只要是自己定义的属性，即使在原型链上也能打印出来。
`hasOwnProperty`找对象自身的属性，排除自定义的原型链上的属性
```js
var car = {
  brand: 'Benz',
  color: 'red'
}
console.log('displacement' in car); // false

function Car(){
  this.brand = 'Benz',
  this.color = 'red',
}
Car.prototype = {
  displacment: '3.0'
}
var car = new Car();
console.log('displacement' in car); // true
```
### instanceOf
判断这个对象是不是该构造函数实例化出来的
```js
function Car(){}
var car = new Car();
console.log(car instanceOf Car); // true
console.log(car instanceOf Object); // true

function Person(){}
var p = new Person()

console.log([] instanceOf Array);// true
console.log([] instanceOf Object);// true
console.log({} instanceOf Object);// true
```
`A instanceof B` : `A`对象的原型里有没有`B`的原型。

### 判断数组
```js
var a = [] || {};
// 方法一
console.log(a.constructor); // f Array()
// 方法二
console.log(a instanceOf Array); // true
// 方法三
var str = Object.prototype.toString.call(a);
console.log(str); // [object Array]

Object.prototype = {
  toString: function(){
    this.toString()
  }
}
```
分析[object Array]
```js
var arr = new Array(1, 2, 3);
// 用数组自身的toString方法
console.log(arr.toString()); // 1,2,3
console.log(arr);

// 调用Object.prototype上的toString方法
console.log(Object.prototype.toString.call(arr)); //[object Array]
```
::: tip 判断数组的方法
- 1. `arr.constructor` -> `f Array()`
- 2. `arr instanceOf Array` -> `true`
- 3. `Object.prototype.toString.call(arr)` -> `[object Array]`
:::

## this指向问题
函数内部的`this`，指向谁？   
在全局中的`this`和在函数内部的`this` 
```js
function test(b){
  this.d = 3; // window.d = 3
  var a = 1; 
  function c(){}
}

test(123);

console.log(d);
console.log(window.d);
console.log(this.d);
/**
AO = {
  arguments: [123]
  this: window,
  b: undefined -> 123,
  a: undefined,
  c: function c(){}
}
*/
```
构造函数的`this`
```js
function Test(){
  var this = {
    __proto__: Test.prototype
  }
  this.name = '123'
}
var test = new Test();
/**
预编译
AO ={
  this: window
}

GO = {
  Test: function Test(){},
  test: {}
}
在new Test时，会在Test内部形成this，就会覆盖原来的this。
AO ={
  this: {
    name: '123',
    __proto__: Test.prototype,
  }
}
this就指向了实例化对象，test = new Test() 就相当于把this给了全局的test
GO = {
  Test: function Test(){},
  test: {
    name: '123',
    __proto__: Test.prototype,
  }
}
*/
```

`call`和`apply`
```js
function Person(){
  this.name = 'zhangsan',
  this.age = 18
}

function Programmer(){
  Person.apply(this);
  this.work = 'Programmer'
}
var p = new Programmer();
console.log(p);
```

::: tip
1. 全局`this` -> `window`
2. 预编译函数`this` -> `window`
3. `apply/call` -> 改变`this`指向
4. 构造函数的`this` -> 实例化对象
:::

## callee与caller
### callee
```js
function test(a, b, c){
  console.log(arguments.callee); // f test(){}  函数test本身
  console.log(arguments.callee.length); // 3 与test.length
  console.log(test.length); // 3 形参的长度
  console.log(arguments.length); // 2 实参长度
}
test(1, 2);
```
`arguments.callee`返回正在被执行的函数对象，也就是`arguments`所指向的函数是谁就返回谁。
实参列表`arguments`所对应的函数是谁就返回那个函数。

```js
function test1(){
  console.log(arguments.callee);
  function test2(){
    console.log(arguments.callee);
  }
}
```
应用：用递归的方式累加n位数
```js
function sum(n){
  if(n <= 1){
    return 1;
  }
  return n + sum(n - 1);
}
var res = sum(10);
console.log(res)
```
模块化实现
```js
var sum = (function(n){
  if(n <= 1){
    return 1;
  }
  return n + arguments.callee(n -1) // 找到的是函数，加括号执行
})(10);
console.log(sum)
```
### caller
```js
test1();
function test1(){
  test2();
}
function test2(){
  console.log(test2.caller);
}
```
`test2.caller`返回调用当前函数的函数，也就是谁当前调用了`test2`，就返回谁。严格模式下报错。

## 练习
1. 例一（笔试）
```js
function foo(){
  bar.apply(null, arguments);
}
function bar(){
  console.log(arguments); // 1,2,3,4,5
}
foo(1, 2, 3, 4, 5);
```
`bar.apply()`与`bar.call()`是一样的，所有的函数执行`bar()`，都有`bar.call()`执行的过程。

> bar() -> bar.call(arguments) -> bar(arguments)

`bar.call(arguments)`实际上执行的相当于`bar`(arguments)执行
```js
function foo(){
  bar(arguments);
}
```

2. 例二
`js`的`typeof`可能返回的值有哪些？
- `object` (包含了`null`)
- `boolean`
- `number`
- `string`
- `undefined`
- `function`
```js
function b(x, y, a){
  arguments[2] = 10;
  console.log(a); // 10
}
b(1,2,3);

/************************/
function b(x, y, a){
  a = 10;
  console.log(arguments[2]); // 10
}
b(1,2,3)

/************************/
var f = (
  function f(){
    return '1';
  },
  function g(){
    return 2;
  }
);
console.log(typeof f); // function 
console.log(typeof f()); // number
```

4. 例四
```js
console.log(undefined == null); // true
console.log(undefined === null); // false
console.log(isNaN(100)); // false
console.log(parseInt('1a') == 1); // true
```
实现`isNaN`
```js
function isNaN1(num){
  var res = Number(num) + '';
  if(res == 'NaN'){
    return true;
  }else {
    return false;
  }
}
console.log(isNaN1('abc')); // true
```

5. 例五
```js
console.log({} == {}); // false 
```
为什么？引用值存储在不同的空间里。   
如何相等？
```js
var obj1 = {};
var obj2 = obj1;
console.log(obj2 == obj1); // true
```
6. 例六
```js
var a = '1';
function test(){
  var a = '2';
  this.a = '3';
  console.log(a);
}
test(); // 2
new test(); // 2
console.log(a)// 3
/**
test(): 
GO = {
  a: '1',
  test: function test()
}
AO = {
  this: window,
  a: undefined -> '2'
}
*/

/************************/
var a = 5;
function test(){
  a = 0;
  console.log(a)
  console.log(this.a);
  var a;
  console.log(a);
}
test(); // 0 5 0
new test(); // 0 undifined 0  因为实例化后this指向实例，但是没有给实例a属性，所以为undefined

```