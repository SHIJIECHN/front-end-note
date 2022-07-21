---
autoGroup-1: ES6
sidebarDepth: 3
title: 15. Map与Set
---

## Set

### 1. 基本用法
```js
const set = new Set(); // 成员是唯一的“数组”
const map = new Map(); // "对象"

set.add(1);
set.add(7);
console.log(set); // {1, 7}

// 参数是具备iterator接口的数据结构
const s = new Set([2, 4, 4, undefined, undefined, '5', 5, NaN, NaN, {}, {}]);
console.log(s);
// {2, 4, undefined, '5', 5, NaN, Object, Object} 不会有重复

// 稀松数组
var s1 = new Set([1, , ,3]);
var arr = [1, , , 3];
console.log(s1); // [1, undefined, 3]
console.log(arr); // [1, empty × 2, 3]
```
总结：
1. Set数据中的元素都是唯一的，没有重复值。
2. Set构造函数参数：初始化参数的时候，参数必须是实现iterator接口的数据类型，否则会抛出异常。
3. 初始化Set实例对象时，必须通过new 构造函数的方式进行初始化，因为Set是构造函数。
4. 遇到稀松数组，会忽略空元素，保存一个undefined值

### 2. Set.prototype.add()
增加元素。    
- 参数：需要添加到set元素中的值，不能添加重复值
- 返回值：返回实例化对象Set本身
```js
var s1 = new Set([1, 2, 3]);
var s2 = s1.add(4);
console.log(s1); // Set {1, 2, 3, 4}
console.log(s1 === s2); // true
```
### 3. Set.prototype.has()
判断对应的值value是否存在Set对象中。
- 参数：需要判断的值
- 布尔值，false表示不存在，true表示存在

```js
var s1 = new Set([1, 2, 3, 4]);
s1.has(4); // true
```

### 4. Set.prototype.size
返回对象的元素个数。
```js
var mySet = new Set();
mySet.add(1).add(2).add(3);
mySet.size; // 3
```

### 5. Set.prorotype.delete()
删除指定元素。
- 参数：需要删除的元素；
- 返回值：成功删除返回true，否则返回false。

```js
var mySet = new Set([1, 2, 3]);

console.log(mySet); // Set(3) {1, 2, 3}
mySet.forEach(function(elem,idx){
  console.log(elem);// 1 2 3
})

mySet.delete(3);
console.log(mySet); // Set(3) {1, 2}
```

#### 6. Set.prototype.clear()
清空Set中的所有元素。返回undefined。
```js
var mySet = new Set();
mySet.add(1);
mySet.add("foo");
mySet.clear();
console.log(mySet); // Set {}
```

## Set的遍历
###  1. keys()、values()、entries()
keys()，values()，entires()方法执行后，返回迭代器对象
```js
let set = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

console.log(set.keys()); // SetIterator
console.log(set.values()); // SetIterator
console.log(set.entries()); // SetIterator

// set 没有键名
for (let i of set.keys()) {
    console.log(i); // a,b,c,d,e,f,g 返回一个键名的迭代器
}

for (let i of set.values()) {
    console.log(i); // a,b,c,d,e,f,g 返回一个键值的迭代器
}

for (let i of set.entries()) {
    console.log(i); // 返回一个键值对的迭代器
    //  ['a', 'a']
    //  ['b', 'b']
    // ...
}

//  直接使用for...of循环，相当于访问的是values
console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); // true

```
总结：
1. Set中并不存在键名，所以keys()和values()是同一个方法，遍历的都是Set的成员值。
2. entries()方法返回\[value, value]的形式

### 2. forEach
```js
set.forEach(function(value, index, arr) {
    console.log(value); // a
    console.log(index); // a
    console.log(arr); // Set(7) {'a', 'b', 'c', 'd', 'e', 'f', 'g'}
})
```
总结：由于Set中没有键名，所以响应的也没有索引值，forEach内部回调函数中的index就变成了value


## Set应用场景
### 1. 数组去重
```js
let arr = [1, 2, 2, 4, 4, 2, 3, 7, 9, 9];
console.log([...new Set(arr)]); // [1, 2, 4, 3, 7, 9]
```

### 2. 交集、并集、差集
```js
let a = new Set([1, 2, 3]);
let b = new Set([2, 3, 4]);

// 并集
let union = new Set([...a, ...b]);
console.log(union); // {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
console.log(intersect); // {2, 3}

// 差集
let different = new Set([...a].filter(x => !b.has(x)));
console.log(different); // {1}
```

### 3. 映射出一个新的结构
```js
let set = new Set([1, 2, 3, 4, 5]);
let s = new Set([...set].map(x => x * 2))
console.log(s); // {2, 4, 6, 8, 10}
// 等同于
let set1 = new Set(Array.from(set, value => value * 2));
console.log(set1); // {2, 4, 6, 8, 10}


// 经典面试题
let arr = [1, 2, 3, 4, 5];
let arr1 = arr.map(parseInt);
// 数组map方法每遍历一次，就会执行parseInt方法
// parseInt(elem, idx)
// 1) parseInt(1, 0)  value：1, index：0
// 2) parseInt(2, 1)  value: 2, index: 1
// ...
// parseInt('3', 2)：以2进制为基础，将二进制的数3转为十进制，
// 但是由于字符串3用二进制表示不了（二进制1，0表示），所以返回NaN
console.log(arr1); // [1, NaN, NaN, NaN, NaN]

console.log(parseInt(10101010101, 2)); //parseInt 可以传入第二个参数
console.log(parseInt(2, 1)); // NaN
```

## Map
### 1. 存在的意义
传统的对象属性键名为字符串，Map属性名可以是对象
```js
let m = {};
let x = {
        id: 1
    },
    y = {
        id: 2
    };
m[x] = 'foo';
m[y] = 'bar'; // Object.prototype.toString()
console.log(m); // {[object Object]: 'bar'}
console.log(m[x]); // bar
console.log(m[y]); // bar

let map = new Map();
map.set(x, 'foo');
map.set(y, 'bar');
console.log(map);
console.log(map.get(x)); // foo
console.log(map.get(y)); // bar
```
### 2. 基本用法 
1. Map构造函数参数：必须是具备iterator接口的数据结构，并且是多元的数组结构。
```js
// 数组作为参数，该数组的成员是一个个标识键值对的数组
let m = new Map([
    ['name', 'zhangsan'],
    ['age', 20]
]);
console.log(m); // {'name' => 'zhangsan', 'age' => 20}
```
2. map.set():如果同一个键多次赋值，后面的值将覆盖前面的值
```js
let map = new Map();
map.set(1, 'foo');
map.set(1, 'bar');
console.log(map); // {1 => 'bar'}
```
3. 只有对同一个对象的引用，Map结构才视为同一个键。
```js
let map = new Map();
map.set(['a'], 555);
console.log(map.get(['a'])); // undefined 两个不同的数组实例
```
4. 同样的值的两个实例，在Map结构中被视为两个键
```js
let map = new Map();
const k1 = ['a'];
const k2 = ['a'];
map.set(k1, 111).set(k2, 222);
console.log(map.get(k1)); // 111
console.log(map.get(k2)); // 222
```

### 3. 操作Map
```js
let m = new Map();
let x = {
        id: 1
    },
    y = {
        id: 2
    };
m.set(x, 'foo');
m.set(y, 'bar');

console.log(m.size); // 2
console.log(m.has(x)); // true
console.log(m.delete(x)); // true
m.clear();
console.log(m);
```

## Map的遍历
### 1. keys()、values()、entries()
```js
let m = new Map();
let x = {
        id: 1
    },
    y = {
        id: 2
    };
m.set(x, 'foo').set(y, 'bar');
console.log(m.keys()); // MapIterator {}
console.log(m.values()); // MapIterator {'foo', 'bar'}
console.log(m.entries()); // MapIterator {}


// for...of 遍历
// 键名
for (let key of m.keys()) {
    console.log(key); // {id: 1}, {id: 2}
}

// 键值
for (let value of m.values()) {
    console.log(value); // foo, bar
}

// 键值对数组
for (let en of m.entries()) {
    console.log(en); // { {...}, 'foo', {...}, 'bar'}
}

// 默认是entries，结构赋值的写法
for (let [key, value] of m) {
    console.log(key, value);
}

// 本质上遍历的是原型上entries的方法
console.log(m[Symbol.iterator] === m.entries); // true
```

### 2. forEach
```js
new Map([['foo', 3], ['bar', {}], ['baz', undefined]]).forEach(fn);
function fn(value, key, map){
  console.log(`map.get('${key}') = ${value}`);
}
```
