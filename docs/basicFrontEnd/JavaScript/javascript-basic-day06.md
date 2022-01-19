---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day06
---

## 目标

## 原型
```js
function Handphone(color, brand){
    this.color = color;
    this.brand = brand;
    // this.screen = '18:9';
    // this.system = 'Android';
}

Handphone.prototype.rom = '64G';
handphone.prototype.ram = '6G';
Handphone.prototype.screen = '16:9'
Handphone.prototype.system = 'Android';
Handphone.prototype.call = function(){
    console.log('I am calling somebady.');
}

var hp1 = new Handphone(color: 'red', brand: '小米');
var hp2 = new Handphone(color: 'black', brand: '华为');
console.log(hp1, hp2);
console.log(hp1.rom);
console.log(hp2.ram);

console.log(hp1.screen); // 18:9 实例中有就不去原型上找
console.log(hp2.screen); // 18:9

hp2.call();
```
- 原型prototype其实是function对象的一个属性，打印出来看一下，结果它也是一个对象
- 这个prototype是定义构造函数构造出的每个对象的公共祖先
- 所有被该构造函数构造出的对象，都可以继承原型上的属性和方法
- 自己有的属性就不会去原型上面找了

原型的作用：我们在实例化对象的时候总有一些写死的值。这些写死的值，在每次new的时候我们都需要去走一遍这个流程，这种代码对于实例化来说是一种代码的冗余，也算是一种耦合（重复了）在这种情况下，我们得想一个办法，能不能让它继承谁，在这种时候，我们把要写死的内容挂到原型上去。当我们需要用参数去传值的这些， 我们就写到this里面去，当我们需要写死的这些，我们就写到原型上去直接继承就可以了。

经验：一个插件，方法往往被写到原型上去。部分属性写到构造函数内部。因为属性往往都是配置项，需要传参去配置的，而方法都是一样的

