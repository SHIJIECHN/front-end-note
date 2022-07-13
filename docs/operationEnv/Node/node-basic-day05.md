---
autoGroup-3: Node基础
sidebarDepth: 3
title:  5. Buffer、编码方式
---

## 二进制数据流
1. 在ES6引入typeArray之前，JavaScript没有用于读取或者操作二进制流（数据的抽象）的机制，在数据较大的情况下，buffer可以作为缓冲机制，用于处理TCP六，文件系统操作等基本二进制数据流的操作。
2. 8bit = 1Byte
3. 网络中的数据传输都是通过二进制数据流进行传输。

## 字符集与字符编码
1. 字符集：字符与十进制树=数（计算机转化为二进制数）所建立的关系
2. 字符编码：（utf-8 utf-16 utf-32)
   1. utf-8编码方式（通过1-4个字节来表示一个字符）。第一位1的个数决定了当前字符所需要的字节数，后面紧跟着是10开头
    - 当字符只需要一个字节来表示时，最高位为补位，用0填充：0XXXXXXX
    - 当字符需要用两个字节表示时，110XXXXX 10XXXXXX
    - 当字符需要三个字节来表示时，1110XXXX 10XXXXXX 10XXXXXX
    - 当字符需要四个字节来表示时，11110XXX  10XXXXXX  10XXXXXX
   2. utf-16（通过2-4个字节来表示一个字符）：js中对字符串默认的编码方式
   3. utf-32：32比特，统一以四个字节方式来表示一个字符。如（2A * * *）


### 1. Buffer默认的编码方式是UTF-8
buffer对象用于表示固定长度的字节序列
1. buffer用于操作二进制数据流
2. buffer结构: \<Buffer 74 65 73 74>，大小是固定的。类似于整数数组（0-255用16进制编码方式）的存在。
3. buffer对象内存分配方式不是在V8堆内存中，是C++层面的代码，需要一个内存就像操作系统申请一个内存，实现的方式是通过一个**动态内存管理机制slab**，slab是现在所有类Unix操作系统（Freebsd Linux）方式，在C/C++中，因此数据时定长的。
4. V8堆外部的固定大小的原始内存分配：node代码不是在V8来申请的，是node中C++层面实现的；node中的buffer申请不是通过JavaScript来实现的，而是通过C++来实现的。
```javascript
const buf = new Buffer.from('test');
console.log(buf);//<Buffer 74 65 73 74>
console.log(buf.length);//4


const buf = Buffer.from('你好');
console.log(buf); // <Buffer e4 bd a0 e5 a5 bd>
console.log(buf.length); // 6

for (let val of buf.values()) {
    console.log(val); // 228 189 160 229 165 189
}
console.log(buf.indexOf(229)); // 3
```

## Buffer
当在Buffer和字符串之间进行转换时，可以指定字符编码。如果未指定字符编码，则默认使用UTF-8.

### 1. Buffer.alloc
```javascript
// 分配长度为10的内存空间
const buf = Buffer.alloc(10);
console.log(buf); // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 申请一个长度为10的内存空间，每个空间都用1填充
const buf = Buffer.alloc(10, 1);
console.log(buf); // <Buffer 01 01 01 01 01 01 01 01 01 01>

// 分配不安全的长度为10的空间，虽然不安全，但是分配的效率更快
const buf = Buffer.allocUnsafe(10);
console.log(buf); // <Buffer ff ff ff ff 36 00 00 00 60 3b>
```

### 2. Buffer.from
```js
// 用数组的方式分配内存
const buf = Buffer.from([1,2,3,4,5,6,7,8]);//默认utf-8编码方式
console.log(buf)//<Buffer 01 02 03 04 05 06 07 08>

// 用字符串的方式分配内存
const buf = new Buffer.from('test');
console.log(buf); //<Buffer 74 65 73 74>

// 第二个参数标识编码方式，默认是UTF-8的编码方式
const buf1 = Buffer.from('test', 'ucs2');
const buf2 = Buffer.from('test');
console.log(buf1); // <Buffer 74 00 65 00 73 00 74 00>
console.log(buf2); // <Buffer 74 65 73 74>

// 类数组也可以通过from转换为成buf
var obj = {
  '3': 1,
  '4': 2,
  length: 2
}
var buf = new Buffer.from(obj);
console.log(buf);//<Buffer 00 00 00 01 02>
```
每一个buffer都单独申请了一个内存空间
```javascript
// 1
const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
console.log(buf1) //<Buffer 01 02 03 04 05 06 07 08>
const buf2 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8])
console.log(buf2 === buf1) // false 

// 2
const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
const buf2 = Buffer.from(buf1)
console.log(buf2 === buf1) // false
```

