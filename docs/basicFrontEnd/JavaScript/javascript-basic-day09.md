---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day09
---

## 继承
使用继承
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
```
公共原型
```js
Student.prototype = Teacher.prototype
Student.prototype.age = 18; // Teacher.prototype中也增加了age属性
```
采用一个中间构造函数Buffer实现继承(圣杯模式)
```js
function Buffer(){}
Buffer.prototype = Teacher.prototype;
var buffer = new Buffer();
Student.prototype = buffer
Student.prorotype.age = 18;
var s = new Student();
console.log(s);
```
优化
```js
function Teacher(){}
function Student(){}
function Buffer(){}
// Buffer.prototype = Teacher.prototype;
// var buffer = new Buffer();
// Student.prototype = buffer;
inherit(Student, Teacher)
var s = new Student();
var t = new Teacher();

console.log(s);
console.log(t)

function inherit(Target, Origin){
    function BUffer(){}
    Buffer.prototype = Origin.prototype;
    Target.prorotype = new BUffer(); // 要放在下面
    Target.prototype.constructor = Target; // 还原构造器，把Student构造器重新指向Student
    Target.prototype.super_class = Origin; // 设置继承源，找到真正的构造对象
}
```

## 闭包的实现方式
1. 普通的闭包
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
2. 对象
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
3. 构造函数
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
compute.add();
compute.add();
```
构造函数在new的时候隐式return this。

## 闭包实现继承
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
立即执行函数给自己创建了一个作用域，里面定义的变量与外面没有关系，拥有了自己的命名空间。防止了全局污染，利于协同开发。是一种模块化开发的形式。

### 练习
模块化开发
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
## 协同开发
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

## 练习
1. 打印一个参数能被3或5或7整除的数
2. 打印斐波那契数列的第N位
3. 打印从0到一个数的累加值
