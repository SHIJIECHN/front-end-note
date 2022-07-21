---
autoGroup-1: ES6
sidebarDepth: 3
title: 9. 对象密封4种方式、assign、取值函数的拷贝
---

## 获取setter与getter函数名
1. 普通的方式获取
```js
const obj = {
	get foo(){},
	set foo(val){}
}
console.log(obj.foo.name); 
// TypeError: Cannot read property 'name' of undefined
```

2. 利用Object.getOwnPropertyDescriptor()获取属性描述符的方法获取.
```js
const obj = {
	get foo(){},
	set foo(val){}
}
var descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
console.log(descriptor.get.name); // get foo
console.log(descriptor.set.name); // set foo
```

## 对象密封的方式
### 1. 第一种方式：对象常量
对象常量，常量意味着不可修改，不可删除；也就对应着属性描述符中writable：false，configurable：false。
```js
// 此时obj对象中的属性a属于对象常量,无法删除,无法修改。
var obj = {};
Object.defineProperty(obj, 'a', {
	value:3,
	writable:false,
	configurable:false
});
obj.a = 4; // 静默失败
delete a; // 静默失败
```

### 2. 第二种方式：阻止对象扩展
1. Object.preventExtensions()
缺点：对象原本存在的属性不是对象常量的方式，可能虽然通过阻止对象扩展的方式禁止对象扩展，但是原本存在的属性依旧能够有被删除或者修改的风险。

2. Object.isExtensible



### 3. 第三种方式：密封对象
1. Object.seal()

2. Object.isSealed()


### 4. 第四种方式：冻结对象
1. Object.freeze()
```js
var obj = {a:2};
var newObj = Object.freeze(obj);
console.log(obj === newObj); // true
```

2. Object.isForzen()

3. 深拷贝冻结对象
```js
var obj = {
	a: {b:3}
}

// 深度拷贝冻结对象
function myFreeze(obj) {
	Object.freeze(obj);
	for(var key in obj) {
		if(Object.hasOwnProperty(key)){
			if(typeof(obj[key]) === 'object' && obj[key]!==null) {
				myFreeze(obj[key]);
			}
		}
	}
}
```

## Object上的静态方法与prototype上的方法
### 1. Object.is()
判断两个值是否为同一个值。本质是(===)，只是在堆有符号的零和NaN不同。
```js
null == null; // true
NaN == NaN; // false
+0 == -0; // true
undefined == undefined; // true

Object.is(+0, -0); // false
Object.is(NaN, NaN); // true
Object.is(0, -0); // false

Object.is(NaN, 0/0); // true
Object.is(NaN, Number.NaN); // true
```
兼容性的写法：
```js
if(!Object.is){
	Object.defineProperty(Object, 'is', {
		value:function(x,y){
			if(x === y) {
				return x !== 0 || 1 / x === 1 / y;
			}else {
				return x !== x && y !== y;
			}
		}
	})
}

```

### 2. Object.assign()
对象的克隆，合并方法。Object.assign()方法将所有可枚举（Object.prototype.propertyIsEnumerable()返回true）和自有（Object.hasOwnProperty()返回true）属性从一个或者多个源对象复制到目标对象，返回修改后的对象.

#### 1. 合并一个对象
```js
Object.assign(target, source); 
// target目标对象，也就是修改后的返回值
// source源对象，可能不止一个对象

let obj = {a:1};
let tar = {};
let copy = Object.assign(tar, obj);
console.log(copy); // {a:1}
console.log(copy === obj); // false
console.log(copy === tar); // true
```
#### 2. 合并多个对象
下面的例子const声明的常量tar，多对象合并之后返回的就是tar，此时tar对象内部属性都变化了，不是说常量是不可以改变的吗？此时tar变量在栈内存中存的是对象{a:1}的引用，最后改变的只是内部的属性，并不是引用，所以并不是常量的值变化了。
```js
const tar = {a:1};
const tar2 = {b:2};
const tar3 = {c:3};
Object.assign(tar, tar2, tar3);
console.log(tar); // {a:1, b:2, c:3}
```

#### 3. 对象合并时，重复的对象存在覆盖的现象，后面覆盖前面
```js
const tar = {a:1, b:1};
const tar2 = {b:2, c:2};
const tar3 = {c:3};
console.log(tar); // {a:1, b:2, c:3}
```

#### 4. Object.assign第一个参数target必须是对象，不能是undefined和null。因为它们没有包装类。
```js
// undefined or null

Object.assign(undefined, {a:1}); 
// TypeError: Cannot convert undefined or null to object

Object.assign(null, {a:1}); 
// TypeError: Cannot convert undefined or null to object
```
三大包装类:NUmber, String, Boolean
```js
Object.assign(true, {a:1});  // Boolean {true, a:1}
Object.assign('abc', {a:1}); // String {'abc', a:1}
Object.assign(1, {a:1}); // Number{1, a:1}
```

#### 5. Object.assign第二个参数source。
1. 如果不能转为对象就忽略

```js
Object.assign({a:1}, undefined);  // {a:1}
Object.assign({a:2}, null); // {a:2}
```
2. 如果说能够转成对象，还需要注意对象的属性是否是可枚举性；也就是说属性描述符enumberable：true。
> 以下示例，存在三大包装类转为对象之后，属性是否可枚举的问题，由于被包装转为对象之后，包装类对象中的\[\[PrimitiveValue]]的值是私有的，是不可枚举的，所以合并的时候直接忽略。

```js
Object.assign({a:1}, 1); // {a:1}
Object.assign({a:1}, '123'); // {0:1, 1: 2, 2:3, a:1}
Object.assign({a:1}, true); // {a:1}

const test1 = 'abc';
const test2 = true;
const test3 = 10;
const obj = Object.assign({}, test1, test2, test3); 
// {0:'a', 1:'b', 2:'c'};

// 处理字符串利用包装类,通过new String('abc')转为类数组对象,
// 而类数组对象中的属性是可枚举的。
{
	0:'a',
	1:'b',
	2:'c',
	'length':3
}

// 处理布尔值利用包装类，通过new Boolean(true)转为对象，
// 此时自身私有属性[[PrimitiveValue]]的值是不可枚举的。
{
	[[PrimitiveValue]]：true
}

// 处理数字类型利用包装类，通过new Number(123)转为对象，
// 此时自身私有属性[PrimitiveValue]]的值是不可枚举的。
{
	[[PrimitiveValue]]：123
}
```

#### 6. Object.assign()不能拷贝原型上的属性和不可枚举属性。
只打印出{baz：3}，因为bar属性默认创建时属性描述集合配置默认为false，所以不可枚举，而属性foo是copy对象原型上的属性，不可拷贝；
```js
var obj = Object.create({foo:1},{
	bar: {
		value:2
	},
	baz: {
		value:3,
		enumerable: true
	}
});
var copy = Object.assign({}, obj);
console.log(copy); // {baz: 3}
```

#### 7. Object.assign合并Symbel数据类型
通过Symbol函数进行创建一个完全不重复的原始值数据类型
```js
var a = Symbol('a');
var b = Symbol('a');
console.log(a == b); // false
Object.assgin({a: 'b'}, {
	[Symbol('c')]: 'd'
}) 
// { a: 'b',  symbol('c'): 'd' }
```

#### 8. Object.assign复制的对象是一个浅拷贝的对象
```js
const obj1 = {a: { b:1 } };
const obj2 = Object.assign({}, obj1);
obj1.a.b = 2;
console.log(obj2); // {a: {b: 2}}   
```

#### 9. Object.assign同名属性的替换
```js
const target = { a: {b:'c',  d:'e'}};
const sourse = {a: {b: "hello"}};
Object.assign(target,  sourse);
console.log(target); // {a: {b: 'hello'}}; 
```

#### 10. Object.assign合并数组
Object.assign合并数组的时候，合并的是数组的下标索引，因为数组是对象的另一种形式，索引下标也就对应着对象的属性。
```js
// 数组拷贝
var a = Object.assgin([1, 2, 3],[4, 5]);
console.log(a);
// 分析
{
	0:1,
	1:2,
	2:3
} 
{
	0:4,
	1:5
}

// 输出
{
	0:4,
	1:5,
	2:3
}
```


### 3. Object.prototype.protoEnumerable()
Object.prototype.propertyIsEnumerable()方法返回一个布尔值，表示指定的属性是否可枚举
1. 参数：需要测试的属性名
2. 返回值：表示属性是否可枚举、
```js
var obj = {a:1};
obj.propertyIsEnumerable('a'); // true

var obj = {};
Object.defineProperty(obj, 'b', {
	value:3,
	enumerable:false
})
obj.propertyIsEnumerable('b'); // false
```

### 4. Object.create()
Object.create()方法创建一个对象，并且指定该对象的prototype
1. 参数1 proto：创建对象的原型，如果proto参数不是null或非原始包装对象，则抛出一个TypeError异常
2. 参数2 propertiesObject：属性描述符集合，配置项默认false；
3. 返回值：一个被指定原型和设置属性的对象
```js
var obj = Object.create({}, {
	a:{
		value:3,
		writable:true,
		enumerable:true,
		configurable:true
	},
	b: {
		value:4
	}
});
console.log(obj); // {a:3, b:4}
```

## Object.assign方法使用场景
### 1. 原型方法的扩展
```js
var age =1;
function Person(){}
Object.assign(Person.prototype, {
	eat:function(){},
	age,
})
console.log(Person.prototype)
```

### 2. 克隆拷贝对象
```js
const obj = {a:1, b:2};
const target = {};
Object.assign(target, obj);
console.log(target); // {a:1, b:2}
```

### 3. 默认值
```js
const Default = {
  url: {
  host:'www.baidu.com',
  port: 7070
  }
}
function test(option) {
	option = Object.assign({}, Default,  option);
  console.log(option); // {url: {port: 8080} }
}
test({url:{port:8080}});
```

## Object.assign拷贝取值函数和赋值函数
1. Object.assign()方法拷贝取值函数（getter）和赋值函数（setter），拷贝的不是函数本身，而是返回之后的值.
```js
const sourse = {
	get foo() {
		return 1;
	}
};
const target = {};
Object.assgin(target, sourse); // {foo:1}
```
2. Object.defineProperties定义多个属性，Object.getOwnPropertyDescriptors 获取对象上所有属性的描述集合。
```js
var obj = {};
Object.defineProperties(obj,{
	a:{
		value:true,
		writable:true
	},
	b:{
		value:'hello',
		writable:false
	}
});
Object.getOwnPropertyDescriptors(obj);
```

3. get和set用assign拷贝的不是函数，而是值；但是不符合我们的需求，我们就是要能够复制get函数和set函数

```js
const sourse =  {
	set foo(value) {
		console.log(value);
	}
}

const tar = {};
Object.assign(tar,sourse);
console.log(tar); // {foo: undefined}
```
解决方法
```js
Object.defineProperties(tar, Object.getOwnPropertyDescriptors(sourse));
Object.getOwnPropertyDescriptor(tar, 'foo');
```

## 部署对象方式
```js
const obj = {a:1}

const obj = Object.create(prototype);
obj.foo = 123;

const obj = Object.assign(Object.create(prototype),{foo:123});

const obj = Object.create(prototype,Object.getOwnPropertyDescriptors({
		foo:123
	}));
```