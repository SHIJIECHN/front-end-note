---
autoGroup-2: ES6
sidebarDepth: 3
title: 10. 4种遍历方式、原型、symbol遍历
---

## ES6操作property的方法

### 1. Object.getPrototypeOf()获取原型
参数：需要获取原型的对象。   
返回值：指定对象的原型，如果没有原型，则返回null。   

1. 对象存在原型的情况
```js
var Person = function(){
  this.name = 'xiaoming';
  this.age = 20;
}
Person.prototype.hobby = '篮球';
var p1 = new Person();
var obj = Object.getPrototypeOf(p1);
console.log(obj === p1.__proto__); // true
```

2. 对象不存在原型的情况
```js
var obj = Object.create(null, {
  name:{
    value:'xiaoming'
  }
});
var newObj = Object.getPrototypeOf(obj);
console.log(newObj); // null
```

### 2. Object.setPrototypeOf()设置原型
设置一个指定对象的原型到另一个对象或null。

#### 不使用原因：
1. 内部属性；
2. 访问效率慢； 
3. 所有继承自该原型的对象都会影响到。

#### 语法格式
Object.setPrototypeOf(obj, proto);
obj：要设置其原型的对象；   
proto：obj的新原型（一个对象或null）   
返回值：设置原型之后的原型对象（即obj）
```js
// proto 不是null
let proto = {
    y: 20,
    z: 40
};
let obj = {
    x: 10
};

let obj1 = Object.setPrototypeOf(obj, proto); //obj为目标对象，proto为指定的原型
console.log(obj1 === obj); // true
console.log(obj);
```

#### 当obj为原始类型时
setPrototypeOf尝试利用相应的包装类进行包装成对象的形式，如果设置新的原型失败，返回原始值原本的原型。
```js
let obj = Object.setPrototypeOf(1, {a:1, b:2});
console.log(obj); // 1
console.log(Object.getPrototypeOf(obj) === Number.prototype); // true
console.log(Object.getPrototypeOf(1) === Number.prototype); // true
console.log(Object.getPrototypeOf(1)); 

console.log(Object.setPrototypeOf(1, {}) === 1); // true
console.log(Object.setPrototypeOf('foo', {}) === 'foo'); // true
console.log(Object.setPrototypeOf(true, {}) === true); // true
```
 undefined、null设置原型失败 
 ```js
let obj = Object.setPrototypeOf(undefined, {a:1, b:2});
let obj = Object.setPrototypeOf(null, {a:1, b:2});
console.log(obj);
// Uncaught TypeError: Object.setPrototypeOf called on null or undefined
 ```
 ### 3. Object.create()
 Object.create()方法创建一个对象，并且指定该对象的prototype.
 1. 参数1：创建对象的原型。（null/原始包装对象）
 2. 参数2：属性描述符集合，配置项默认false
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
指定原型是原始类型值，抛出异常
```js
 var obj = Object.create(undefined);
 var obj = Object.create(1);
 var obj = Object.create('foo');
 console.log(obj); 
 // Uncaught TypeError: Object prototype may only be an Object or null: undefined
```

## ES6遍历对象的方法
### 1. Object.keys()
1. 获取对象属性的键名（自身可枚举属性）。
2. 返回值：一个表示给定对象的所有可枚举属性的字符串数组

```js
var obj = {
    foo: 'bar',
    baz: 42
}
console.log(Object.keys(obj)); // ['foo', 'baz']

 // 返回可枚举属性（不含继承属性）
const foo = {
    a: 1,
    b: 2,
    c: 3
}
Object.defineProperties(foo, {
    d: {
        value: 4,
        enumerable: true
    },
    f: {
        value: 5,
    }
})

console.log(Object.keys(foo)); // ['a', 'b', 'c', 'd']
```
### 2. Object.value()
1. 获取对象的属性的值（自身可枚举）
2. 返回值：一个包含对象自身的所有可枚举属性的数组

```js
const obj = {
    foo: 'bar',
    baz: 42
};
console.log(Object.values(obj)); // ['bar', 42]

// 返回自身的可遍历属性
const obj = Object.create({}, {
    p: {
        value: 42
    }
});
console.log(Object.values(obj)); // []
// enumerable设置为true
const obj = Object.create({}, {
    p: {
        value: 42,
        enumerable: true
    }
});
console.log(Object.values(obj)); // [42]

// 会过滤Symbol值的属性
const obj = {
    [Symbol()]: 123,
    foo: 'abc'
}
console.log(Object.values(obj)); // ['abc']

// 参数为非对象，会先转为对象
// 字符串：转为类数组对象{0: 'f', 1: 'o', 2: 'o', 'length':3}
const arr = Object.values('foo');
console.log(arr); // ['f', 'o', 'o']

// 数值和布尔值：包装对象不能为实例添加非继承的属性
console.log(Object.values(42)); // []
console.log(Object.values(true)); // []
```

### 3. Objec.entries()
1. 获取对象属性的键值对（自身可枚举）
2. 返回一个给定对象自身可枚举属性的键值对数组

```js
const obj = {
    foo: 'bar',
    baz: 42
};
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]
```

应用：
1. 遍历对象的属性
```js
let obj = {
    one: 1,
    two: 2
};
for (let [key, value] of Object.entries(obj)) {
    console.log(`${JSON.stringify(key)}: ${JSON.stringify(value)}`); //'one': 1, 'two': 2
}
```
2. 将对象转为真正的Map结构
```js
const obj = {
    foo: 'bar',
    baz: 42
};
const map = new Map(Object.entries(obj));
console.log(map); // Map(2) {'foo' => 'bar', 'baz' => 42}
```
3. Object.fromEntries()：将一个键值对数组转为对象
```js
const entries = new Map([
    ['foo', 'bar'],
    ['baz', 42]
]);
console.log(Object.fromEntries(entries)); // {foo: 'bar', baz: 42}
```
应用：配合URLSearchParams对象，将查询字符串转为对象
```js
const params = new URLSearchParams('foo=bar&baz=qux');
console.log(Object.fromEntries(params)); // {foo: 'bar', baz: 'qux'}
```

## Symbol
Symbol是ES6新引入的基本数据类型，主要是为了解决对象属性名重复的问题。

### 1. Symbol初识
1. 是原始值类型。
2. 不是构造函数，不能使用new命令
3. typeof进行判断返回symbol

相同参数的Symbol函数的返回值是不相等的
```js
let s1 = Symbol;
console.log(s1); // 构造函数 ƒ Symbol() { [native code] }

// 没有参数
let s1 = Symbol();
let s2 = Symbol();
console.log(s1); // Symbol(s1)
console.log(s1 === s2); // false 

// 有参数，通过参数可以区分Symbol
let s1 = Symbol('foo');
let s2 = Symbol('foo');
console.log(s1 === s2); // false


// 参数会进行隐式转换
// 根据自身的prototype上的toString方法转化为字符串
let obj = {
    a: 1
}
let s1 = Symbol(obj); // obj 会调用 Object.prototype.toString()转为[object Object]
console.log(s1); // Symbol([object Object])

console.lolg(Symbol([])); // Symbol()
console.log(Symbol(undefined)); // Symbol()
console.log(Symbol(null)); // Symbol(null)
```

### 2. 运算
Symbol数据类型不能通过Number类型转换，但是可以通过Symbol，Boolean的形式进行类型转换
```js
let s1 = Symbol(null);

// 1. Symbol不能通过Number进行显隐式数据类型的转换
console.log(s1 + 1); 
// Cannot convert a Symbol value to a number。报错，不能转Number类型。

// 2. 可以通过String进行显式类型转换，但是不能进行隐式转换
console.log(String(s1)); // Symbol(null)
console.log(s1 + ''); // 隐式转换 Cannot convert a Symbol value to a string 

// 3. 可以通过Boolean的显隐式转换
console.log(Boolean(s1)); // true
console.log(!s1); // false
```

### 3. Symbol在对象中的用法
#### 明确中括号的用法
JS中的点语法person.name，其实在JS底层引擎中，JS利用person\['name']中括号的语法进行包装，如果[ ]中是变量的话，就会去找变量的引用。
```js
let name = Symbol();
let person = {};
person.name = 'zhangsan';
// 等同于
person['name'] = 'zhangsan';
console.log(person); // { name: "zhangsan" }
```

#### Symbol()的基本使用
Symbol值作为对象属性名时，不能用点运算符。
```js
let name = Symbol();
let person = {};
// 方式一：对象外部设置属性
person[name] = 'zhangsan';

// 方式二：对象内部设置属性
let person = {
    [name]: 'zhangsan'
};

// 方式三： Object.defineProperty定义属性
Object.defineProperty(person, name, {
    value: 'zhangsan'
});

console.log(person); // {Symbol(): 'zhangsan'}

// 访问
console.log(person[name]); // zhangsan
console.log(person.name); // undefined  person.name->person['name']


// 方法名
let name = Symbol();
let eat = Symbol();
let person = {
    [name]: 'zhangsan',
    [eat]() {
        console.log(this[name]);
    }
}
person[eat](); // zhanhsan
```
### 4. Symbol.for
Symbol.for方法创建的Symbol会被放入一个全局的Symbol注册表中，Symbol.for并不是每次都会创建一个新的Symbol，它会首先检查给定的key是否存在全局的注册表中。如果是，则返回上次已有的Symbol，如果没有它会创建一个独一无二的Symbol值，如果key相同的话，Symbol的值就是相同，如果key不存在，那么Symbol也是互不相同；
```js
let s1 = Symbol.for('foo'); // key = 'foo'
let s2 = Symbol.for('foo');
console.log(s1 === s2); // true
```
Symbol.for()相互比较时，参数通过String()方法隐式转换过后，在注册表中寻找.
```js
let s1 = Symbol.for({a:1, b:2});
let s2 = Symbol.for({a:2, b:3});
console.log(s1, s2); // Symbol([object Object]) Symbol([object Object])
console.log(s1 === s2); // true


let s1 = Symbol.for([1]);
let s2 = Symbol.for([2]);
console.log(s1, s2); // Symbol(1)  Symbol(2)
console.log(s1 === s2); // false
```

### 5. Symbol.keyFor
获取全局Symbol注册表中与某个symbol相关联的键key
```js
let s = Symbol();
let s1 = Symbol.for('foo'); // key = 'foo'
let s2 = Symbol.for('foo');
console.log(Symbol.keyFor(s1)); // foo
console.log(Symbol.keyFor(s1) === Symbol.keyFor(s2)); // true
console.log(Symbol.keyFor(s)); // undefined
```

### 6. 遍历
Symbol作为属性名时，不会出现在for...in和for...of循环中，也不会被Obect.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。    
对象Symbol属性遍历：Object.getOwnPropertySymbols(obj) 返回数组。
```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'hello';
obj[b] = 'world';
obj.c = 'c'

// for...in 循环不能遍历Symbol属性
for (let i in obj) {
    console.log(i); // c
}

// Object.assign可以复制
let obj1 = {}
Object.assign(obj1, obj);
console.log(obj1); // {c: 'c', Symbol(a): 'hello', Symbol(b): 'world'}

// Object.getOwnPropertySymbols遍历Symbol属性
let key = Object.getOwnPropertySymbols(obj);
console.log(key); // [Symbol(a), Symbol(b)]
```
练习
```js
const obj = {
    c: 1,
    d: 2
}
let a = Symbol('a');
let b = Symbol('b');
let _a = Symbol('_a');
let _b = Symbol('_b');

obj[a] = 'hello';
obj[b] = 'world';

Object.defineProperties(obj, {
    e: {
        value: 5,
        enumerable: true
    },
    f: {
        value: 6,
        enumerable: false
    },
    [_a]: {
        value: -1,
        enumerable: true
    },
    [_b]: {
        value: -2,
        enumerable: false
    }
})

let h = Symbol('h');
let i = Symbol('i');
let j = Symbol('j');

const obj1 = {
    g: 7,
    [h]: 8
}

Object.defineProperties(obj1, {
    [i]: {
        value: 9,
        enumerable: true
    },
    [j]: {
        value: 10
    },
    k: {
        value: 11
    }
})
Object.setPrototypeOf(obj, obj1);
console.log(obj);

// for...in 可以循环遍历自身和继承的可枚举属性（不包含Symbol类型的值）
for (let i in obj) {
    console.log(i); // c, d, e, g
}

// （遍历自身可枚举的）不包含Symbol类型的属性
let keys = Object.keys(obj)
console.log(keys); // ['c', 'd', 'e']

// (遍历自身)Symbol类型的属性
let s = Object.getOwnPropertySymbols(obj);
console.log(s); // [Symbol(a), Symbol(b), Symbol(_a), Symbol(_b)]

// 拷贝自身可枚举属性，包含Symbol类型的值
let obj3 = {}
Object.assign(obj3, obj);
console.log(obj3);

// JSON.stringify() 遍历自身可枚举属性
```