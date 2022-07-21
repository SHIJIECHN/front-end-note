---
autoGroup-1: ES6
sidebarDepth: 3
title: Map/Set
---

## Set
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
```
在Set内部，两个NaN是相等的。两个对象总是不相等的。

### 遍历方法
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



set.forEach(function(value, index, arr) {
    console.log(value); // a
    console.log(index); // a
    console.log(arr); // Set(7) {'a', 'b', 'c', 'd', 'e', 'f', 'g'}
})
```

### 操作Set
```js
const s = new Set();
const x = {
        id: 1
    },
    y = {
        id: 2
    };

// 链式调用：添加值，返回的是set结构本身
s.add(x).add(y);
console.log(s);

console.log(s.has(x)); //true

console.log(s.delete(y)); // true
console.log(s);

console.log(s.clear()); // undefined 清空
console.log(s);
```

### 应用
1. 数组去重
```js
let arr = [1, 2, 2, 4, 4, 2, 3, 7, 9, 9];
console.log([...new Set(arr)]); // [1, 2, 4, 3, 7, 9]
```

2. 交集、并集、差集
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

3. 映射出一个新的结构
```js
let set = new Set([1, 2, 3, 4, 5]);
let s = new Set([...set].map(x => x * 2))
console.log(s); // {2, 4, 6, 8, 10}
// 等同于
let set1 = new Set(Array.from(set, value => value * 2));
console.log(set1); // {2, 4, 6, 8, 10}


let arr = [1, 2, 3, 4, 5];
let arr1 = arr.map(parseInt);
// 1) parseInt(1, 0)  value：1, index：0
// 2) parseInt(2, 1)  value: 2, index: 1
// ...
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
2. 如果同一个键多次赋值，后面的值将覆盖前面的值
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

## Map的方法

### 遍历
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

for (let key of m.keys()) {
    console.log(key); // {id: 1}, {id: 2}
}

for (let value of m.values()) {
    console.log(value); // foo, bar
}

for (let en of m.entries()) {
    console.log(en); // { {...}, 'foo', {...}, 'bar'}
}

// 默认是entries
for (let [key, value] of m) {
    console.log(key, value);
}
console.log(m[Symbol.iterator] === m.entries); // true
```
### 实例操作方法
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

### Map与数组
```js
// Map转数组：扩展运算符(...)
const map = new Map();
map.set(true, 7)
    .set({
        'foo': 3
    }, ['abc']);
console.log([...map]);

// 数组转Map
const map = new Map(
    [
        [true, 7],
        [{foo: 3},['abc']]
    ]
);
console.log(map); // {true => 7, {…} => Array(1)}
```

### Map与对象
```js
// map转对象
const map = new Map();
map.set(true, 7)
    .set('a', 123);

function mapToObj(strMap) {
    let obj = Object.create(null);
    for (let [key, value] of strMap.entries()) {
        console.log(key, value);
        obj[key] = value;
    }
    return obj;
}

let obj = mapToObj(map);
console.log(obj); // {true: 7, a: 123}

// 对象转map
function objToMap(obj) {
    let map = new Map();
    for (let key of Object.keys(obj)) {
        map.set(key, obj[key])
    }

    return map;
}

let m = objToMap({
    true: 7,
    a: 123
})
console.log(m); //{'true' => 7, 'a' => 123}
```

## Map与Array
```js
let map = new Map();
let array = new Array();
// 增
map.set('t', 1);
array.push({
    't': 1
})
console.log('map: ', map); // {'t' => 1}
console.log('array: ', array); // [{ 't': 1}]

// 查
let map_exist = map.has('t'); // true
let arr_exist = array.find((val) => val.t);
console.log('map: ', map_exist); // true
console.log('array: ', arr_exist); // {'t': 1}

// 改
map.set('t', 2);
array.forEach(item => item.t ? item.t = 2 : '');
console.log('map: ', map); // {'t' => 2}
console.log('array: ', array); // [{ 't': 2}]

// 删
map.delete('t');
let idx = array.findIndex(item => item.t);
array.splice(idx, 1);
console.log('map: ', map); // {}
console.log('array: ', array); // []
```

## Set与Array
```js
let set = new Set();
let array = new Array();
let o = {
    't': 1
};
// 增
set.add(o);
array.push(o)
console.log('set: ', set); // { {'t': 1} }
console.log('array: ', array); // [{ 't': 1}]

// 查
let set_exist = set.has(o);
let arr_exist = array.find((val) => val.t);
console.log('set: ', set_exist); // true
console.log('array: ', arr_exist); // {'t': 1}

// 改
set.forEach(item => item.t ? item.t = 2 : '');
array.forEach(item => item.t ? item.t = 2 : '');
console.log('set: ', set); // { {t: 2} }
console.log('array: ', array); // [{ 't': 2}]

// 删
set.forEach(item => item.t ? set.delete(item) : '');
let idx = array.findIndex(item => item.t);
array.splice(idx, 1);
console.log('set: ', set); // {}
console.log('array: ', array); // []
```

## WeakMap与WeakSet
特征：没有任何遍历方法；成员只能是对象.
```js
const ws = new WeakSet();
ws.add(1); // Invalid value used in weak set

const wm = new WeakMap();
// 只接受对象作为键名
wm.set('a', 1); // Invalid value used as weak map key
```
键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。  
垃圾回收机制：如果其他对象都没有引用WeakMap和WeakSet的话，垃圾回收机制会直接回收当前对象所占的内存，而不会考虑WeakMap和WeakSet。

## Proxy
代理。在目标之间设置了一个“拦截”层，外界访问必须先通过这一层。
```js
let star = {
    name: 'zhangsan',
    age: 25,
    phone: 'start 18822228888'
}

let agent = new Proxy(star, {
    // 读取操作：
    get: function(target, key) {
        if (key === 'phone') {
            return 'agent: 13355556666'
        }

        if (key === 'price') {
            return 120000;
        }

        return target[key];
    },

    // 赋值操作
    set: function(target, key, value) {
        if (value < 100000) {
            throw Error('价格太低！');
        } else {
            target[key] = value;
            return true;
        }

    },

    // has 拦截in操作符。不能拦截for...in循环
    has: function(target, key) {
        console.log('请联系agent：13355556666');
        if (key === 'customPrice') {
            return target[key];
        } else {
            return false;
        }
    },

});

// get
console.log(agent.phone); // agent: 13355556666
console.log(agent.price); // 120000
console.log(agent.name); // zhangsan
console.log(agent.age); // 25
// set
agent.customPrice = 150000;
console.log(agent.customPrice); // 150000
// has
console.log('customPrice' in agent); // true
```