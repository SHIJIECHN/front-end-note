---
autoGroup-3: JavaScript基础
title: 对象
---

## 对象字面量
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
delete teacher.teach; // 注意！！方法的删除 

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
在构造函数还没有执行之前`this`根本就不存在，在`GO`中，不执行不看函数中内容。只有实例化后`this`才生成。`this`指向的是对象本身。

2. 当实例出来的多个对象，它们之间是不同的对象，当改变其中一个对象的属性时，其他对象不收到影响。

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
优化传参
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

## 练习
- 写一个构造函数，接受数字类型的参数，参数数量不定，完成参数相加和相乘的功能。
```js

```
  

- 写一个构造车的函数，可设置车的品牌，颜色，排量。再写一个构造消费者的函数，设置用户的名字，年龄，收入，通过选车的方法实例化该用户喜欢的车，在设置车的属性。

## 构造函数实例化原理
```js
function Car(color){
    this.color  = color
}
```