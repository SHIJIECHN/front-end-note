---
autoGroup-2: ES6
sidebarDepth: 3
title: day05
---

## 对象密封的4中方式
对象常量：不可修改，不可删除 即 configurable: false, writable: false。
1. Object.preventExtensions(obj): 禁止对象拓展
```js
const obj = {
    a: 2
}

const test = Object.preventExtensions(obj); // 禁止对象拓展
console.log(test === obj); // true
console.log(Object.isExtensible(obj)); // false 不可拓展
console.log(Object.getOwnPropertyDescriptor(obj, 'a'));
// {value: 2, writable: true, enumerable: true, configurable: true}


// 为对象添加属性
// 第一种方式
obj.b = 3
console.log(obj); // {a:2} 没有添加成功

// 第二种方式
Object.defineProperty(obj, 'c', {
    value: 4
}) // Cannot define property c, object is not extensible 
// 使用第二种方式会直接抛出错误
```
2. 使用Object.defineProperty的方式为对象添加属性，默认属性描述符writable、enumerable、configurable均为false。
```js
const obj = {
    a: 2
}
Object.defineProperty(obj, 'b', {
    value: 6
})

console.log(Object.getOwnPropertyDescriptor(obj, 'b')); 
// {value: 6, writable: false, enumerable: false, configurable: false}
```

3. Object.seal(obj)：对象密封。将属性描述符configurable设置为false。
```js
const obj = {
    a: 2
}

Object.seal(obj);
console.log(Object.isSealed(obj)); // true 密封的
console.log(Object.getOwnPropertyDescriptor(obj, 'a')); 
// {value: 2, writable: true, enumerable: true, configurable: false}
```

4. Object.freeze(obj)：将属性描述符configurable、writable设置为false。
```js
const obj = {
    a: 2
}

Object.freeze(obj);
console.log(Object.isFrozen(obj)); // true 被冻住
console.log(Object.getOwnPropertyDescriptor(obj, 'a')); 
// {value: 2, writable: false, enumerable: true, configurable: false}
```
深度冻结
```js
function myFreeze(obj) {
    Object.freeze(obj);
    for (var key in obj) {
        if (typeof(obj[key]) === 'object' && obj[key] !== null) {
            myFreeze(obj[key]);
        }
    }
}
```

## 对象的新增方法
### is
比较运算符拓展
```js
console.log(NaN === NaN); // false
console.log(+0 === -0); // true
// === 调用sameValue

console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(+0, -0)); // false
```
部署Object.is
```js
Object.defineProperty(Object, 'is', {
    value: function(x, y){
        if(x === y){
            // 针对+0 不等于 -0的情况
            return x !== 0 || 1 /x === 1/ y;
        }
        // 针对NaN的情况
        return x !== x && y !== y
    },
    enumerable: false,
    configurable: true,
    writable: true
})
```

### Object.assign
Object.assign(target, ...source)：合并对象。将源对象（source）的所有可枚举属性，复制到目标对象（target）
```js
let obj = {
    a: 1
}
let tar = {
    b: 2
};
let copy = Object.assign(tar, obj);
console.log(tar); // {b: 1, a: 2}
console.log(copy); // {b: 1, a: 2}
console.log(copy === tar); // true
```
后面的属性会覆盖前面的
```js
// 属性覆盖
const tar = {
    a: 1,
    b: 1
};
const tar2 = {
    b: 2,
    c: 2
};
const tar3 = {
    c: 3
}
Object.assign(tar, tar2, tar3);
console.log(tar); // {a: 1, b: 2, c: 3} 
```
如果只有一个参数，直接返回该参数
```js
const obj = {a: 1};
Object.assign(obj) === obj; // true
```
参数
```js
// 第一个参数：该参数不是对象，则先转成对象。由于undefined和null无法转成对象，它们作为参数第一个参数就会报错。
var test1 = Object.assign(1, {
    a: 1
});
console.log(test1); //Number{1, a: 1}

var test2 = Object.assign(undefined, {
    a: 1
});
console.log(test2); // Cannot convert undefined or null to object

// 第二个参数：参数能够转成对象，并且对象的属性是可枚举。
var test1 = Object.assign({
    a: 1
}, undefined);
console.log(test1); // {a: 1}


var test2 = Object.assign({
    a: 1
}, 1);
console.log(test2); // {a: 1}

var test3 = Object.assign({
    a: 1
}, '123');
console.log(test3); // {0: '1', 1: '2', 2: '3', a: 1}

const test1 = '123';
const test2 = true;
const test3 = 10;
const obj = Object.assign({}, test1, test2, test3)
console.log(obj); // {0: '1', 1: '2', 2: '3'}
```
因为字符串的包装对象，会产生可枚举属性。


只拷贝源对象的自身属性，不拷贝不可枚举属性拷贝(enumerable: false)
```js
const obj = Object.create({
    foo: 1
}, {
    bar: {
        value: 2
    },
    baz: {
        value: 3,
        enumerable: true
    }
})

console.log(obj); // {baz: 3, bar: 2}
var copy = Object.assign({}, obj);
console.log(copy); // {baz: 3}，拷贝的是可枚举属性。继承属性和不可枚举属性不能拷贝
```

注意点：
1. 浅拷贝
```js
const obj1 = {
    a: {
        b: 1
    }
}

const obj2 = Object.assign({}, obj1);
obj1.a.b = 2;
console.log(obj2); // {a: {b:2}}

```
2. 同名属性替换
```js
const target = {
    a: {
        b: 'c',
        d: 'e'
    }
};
const source = {
    a: {
        b: 'hello'
    }
};
Object.assign(target, source);
console.log(target); // {a: {b: 'hello'}}
```
3. 数组的处理
把数组视为属性名为0、1、2的对象，因此源数组的0号属性4覆盖了目标数组的0号属性1
```js
const a = Object.assign([1, 2, 3], [4, 5]);
console.log(a); // [4,5,3] 根据属性名替换
```
4. 取值函数的处理
不会复制这个取值函数，只会拿到值以后，将这个值复制过去。
```js
const source = {
    get foo() {
        return 1;
    }
}
const target = {};
Object.assign(target, source);
console.log(target); // {foo: 1}
```

应用：
1. 在原型对象上扩充属性和方法
```js
const age = 1;

function Person() {

}
Object.assign(Person.prototype, {
    eat() {

    },
    age,
})
console.log(Person.prototype);
```
2. 配置项默认值
```js
const defaultOpt = {
    url: {
        host: 'www.baidu.com',
        prot: 7070
    }
}

function test(option) {
    option = Object.assign({}, defaultOpt, option)
    console.log(option);
}

test({
    url: {
        port: 8080
    }
})
```


## getOwnPropertyDescriptors
定义多个属性与获取多个属性描述
```js
let obj = {};
Object.defineProperties(obj, {
    a: {
        value: true,
        writable: true
    },
    b: {
        value: 'hello',
        writable: false
    }
})

console.log(obj); // {a: true, b: 'hello'}
console.log(Object.getOwnPropertyDescriptors(obj)); 
```
defineProperties定义属性就是通过自定义属性的描述符，getOwnPropertyDescriptors可以获得对象的描述符。

可计算属性的拷贝
```js
const source = {
    set foo(value) {
        console.log(value);
    }
}

const tar = {};

Object.assign(tar, source);
console.log(tar); // {foo: undefined} 不能拷贝set foo(value){...}

// 就是解决Object.assign不能拷贝set 可计算属性而存在的
Object.defineProperties(tar, Object.getOwnPropertyDescriptors(source));
console.log(tar); // 可以拷贝到set foo(value){...}
console.log(Object.getOwnPropertyDescriptor(tar, 'foo'));
```
配合Object.create实现将对象属性克隆到一个新对象。浅拷贝。
```js
const obj = {
    a: 1,
    b: 2,
    c: 3
};
// Object.getPrototypeOf(obj) 获取obj的原型对象
const clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));

console.log(clone); // {a: 1, b: 2, c: 3}
```