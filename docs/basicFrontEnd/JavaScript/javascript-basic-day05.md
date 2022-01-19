---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day05
---

## 目标
- 创建对象的两种方式
- 构造函数与实例化过程和原理

## 对象的创建
对象创建有两种方式：
1. 对象字面量
2. new Object 构造函数

对象属性和方法的增删
```js
var teacher = {
    name: 'Tom',
    weight: 130,
    height: 180,
    teach: function(){
        console.log('I am teaching JavaScript.')
    },
    smoke: function(){
        // teacher.weight--;
        // console.log(teacher.weight);
        this.weight--;
        console.log(this.weight);
    },
    eat: function(){
        // teacher.weight++;
        // console.log(teacher.weight);
        this.weight++;
        console.log(this.weight);
    }
}
// 增
teacher.address = '上海';
teacher.drink = function(){
    console.log('I am drinking beer.')
};
// 删
delete teacher.address;
delete teacher.teach(); //能成功删除吗？ 不能，后边有个执行 (笔试题)

delete teacher.teach; 

// this的引入 
teacher.smoke();
teacher.smoke();
teacher.eat();
```

## 构造函数
用系统内自带的构造函数，对象是通过实例化构造函数而创建的对象实例。
```js
var obj = new Object();
```

## 自定义构造函数
```js
function Teacher(){
    this.name = 'Tom';
    this.sex = 'male';
    this.weight = 130;
    this.smoke = function(){
        this.weight--;
        console.log(this.weight);
    },
    this.eat = function(){
        this.weight++;
        console.log(this.weight)
    }
}

var teacher1 = new Teacher()
var teacher2 = new Teacher()

teacher1.name = 'Alle';
console.log(teacher1, teacher2); // name属性
/*************************************/

teacher1.smoke();
teacher1.smoke();

console.log(teacher1, teacher2); // weight值
```
1. 在构造函数中`this`指向谁？    
在构造函数还没有执行之前`this`根本就不存在。在`GO`中，不执行不看函数中内容。要让this存在必须要实例化它，谁用就是谁。`this`指向的是实例化对象本身。
```js
 var t = new Teacher(); t = this
```
2. 当实例出来的多个对象，它们之间是不同的对象，当改变其中一个对象的属性时，其他对象不受到影响。

传参
```js
function Teacher(name, sex, weight, course){
    this.name = name;
    this.sex = sex;
    this.weight = weight;
    this.course = course;
}

var t1 = new Teahcer('Tom', 'male', 130, 'JavaScript');
var t2  =new Teacher('Alle', 'female', '100', 'HTML')
```
优化传参：传一个对象进去
```js
function Teacher(opt){
    this.name = opt.name;
    this.sex = opt.sex;
    this.weight = opt.weight;
    this.course = opt.course;
}

var t1 = new Teacher({
    name: 'Tom',
    sex: 'male',
    weight: '130',
    course: 'JavaScript'
})
```
### 练习
1. 写一个构造函数，接受数字类型的参数，参数数量不定，完成参数相加和相乘的功能。
```js
function Compute(opt){
    this.nums = opt.nums;
    this.add = function(){
        var sum = 0;
        for(var i = 0; i < this.nums.length; i++){
            sum += this.nums[i]
        }
        console.log(sum)
    }
    this.aMutiply = function(){
        var accumulate = 1;
        for(var i = 0; i < this.nums.length; i++){
            accumulate *= this.nums[i]
        }
        console.log(accumulate)
    }
}

var compute = new Compute({
    nums: [2,5,8,10]
});
compute.add()
compute.aMutiply()

// 老师写
function Compute(){
    var args = arguments,
        res;
    this.plus = function(){
        res = 0
         loop('add', res);
        // for(var i = 0; i < args.length; i++){
        //     var item = args[i];
        //     res += item;
        // }
        // console.log(res);
    }
    this.times = function(){
        res = 1;
        loop('mul', res);
        // for(var i = 0; i < args.length; i++){
        //     var item = args[i];
        //     res *= item;
        // }
        // console.log(res)
    }

    function loop(method, res){
        for(var i = 0; i < args.length; i++){
            var item = args[i];

            if(method === 'add'){
                res += item;
            }else if(method == 'mul'){
                res *= item;
            }
        }
        console.log(res);
    }
}
```

2. 写一个构造车的函数，可设置车的品牌，颜色，排量。再写一个构造消费者的函数，设置用户的名字，年龄，收入，通过选车的方法实例化该用户喜欢的车，在设置车的属性。
```js
function Car(opt){
    this.brand = opt.brand;
    this.color = opt.color;
    this.displacement = opt.displacement;
}

function User(opt){
    this.name = opt.name;
    this.age = opt.age;
    this.income = opt.income;
    this.choose = function(){
        var car = new Car(opt.car)
        console.log(this.name + '挑选了一辆排量为' + car.displacement + '的' + car.color + car.brand);
    }
}

var Tom = new User({
    name: 'Tom',
    age: 19,
    avenu: 10000,
    car:{
        brand: 'BYD',
        color: 'white',
        displacement: 5
    }
})

Tom.choose()
```

## 构造函数
```js
function Car(opt){
    this.color = opt.color;
    this.brand = opt.brand;
    this.drive = function(){
        console.log("I am running");
    }
}
```
当执行
```js
Car(); 
```
函数执行，可以在作用域链中找到函数`AO`，`AO`里面保存了`this`对象，`this`指向`window`。  
`this`什么时候存在？  
如果不实例化构造函数，`this`指向`window`。当实例化构造函数后，`this`的指向发生改变，指向实例化的对象。
```js
var car = new Car() // this = car
```

### `new`一个对象发生了什么？  

当构造函数被实例化时，相当于`Car()`执行了，一旦要执行就会有AO，AO产生后自动默认保存this
```js
Ao = {
    this：{}
}
```
`this`保存为空对象，当`new`对象时，相当于把`Car()`中的内容都跑完了
```js
Ao = {
    this：{
        color: color,
        brand: brand
    }
}
```

总结：`new` 相当于系统帮你把`this`指向实例化对象
```js
/**
GO = {
    Car: (function),
    car: {
        color: 'red',
        brand: 'Benz'
    }
}

AO = {
    this: {
        color: color,
        brand: brand
    }
}
*/
function Car(){
    /**
    this: {
        color: color,
        brand: brand
    }
    */
    this.color = color;
    this.brand = brand;
    // return this;
}

var car1 = new Car('red', 'Benz');
```
模拟`new`操作：
```js
function Car(color, brand){
    var me = {};
    me.color = color;
    me.brand = brand;
    return me;
}
var car = Car('red', 'Mazda');
```

### return问题
```js
function Car(color, brand){
    this.color = color;
    this.brand = brand;

    return {}
}
var car = new Car('red', 'Benz');
```
构造函数里面，原本是隐式`return this`。如果故意`return`引用值，`car`就就是引用值，如果`return`原始值，`car`不会改变。