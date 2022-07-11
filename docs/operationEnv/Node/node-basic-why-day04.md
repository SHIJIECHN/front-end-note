---
autoGroup-3: Node基础
sidebarDepth: 3
title:  4. Buffer
---
  
## 数据的二进制
1. 计算机中所有的内容：文字、数字、图片、视频、音频都会使用二进制表示
2. JavaScript可以直接处理直观的数据，如字符串。对于图片，JavaScript或HTML只负责告诉浏览器图片的地址，浏览器负责读取图片，并且最终将图片渲染表示。
3. 服务器端处理本地文件
   1. 某一保存的文件并不是utf-8进行编码的，而是用 GBK，那么我们必须读取到他们的二进制数据，再通过GKB转换成对应的文字。
   2. 需要读取的是一张图片数据（二进制），再通过某些手段对图片数据进行二次的处理。
   3. 在Node中通过TCP建立长连接，TCP传输的是字节流，我们需要将数据转成字节再进行传入，并且需要知道传输字节的大小

## Buffer和二进制
1. Node为了可以方便开发者完成更多功能，提供给了我们一个类Buffer，并且它是全局的
2. Buffer中存储的是二进制数据。将Buffer看成是个存储二进制的数组，数组中的每一项可以保存8位二进制。


## Buffer和字符串
### 1. 英文字符串存储到Buffer中
```js
const message = "Hello world";

// 1. 创建Buffer方式一：不推荐
const buffer = new Buffer(message);
console.log(buffer); // <Buffer 48 65 6c 6c 6f 20 77 6f 72 6c 64>

// 2. 创建方式二
const buffer = Buffer.from(message);
console.log(buffer);// <Buffer 48 65 6c 6c 6f 20 77 6f 72 6c 64>
```
### 2. 中文字符串存储到Buffer中
```js
const message = "你好啊";

// utf8: 一个汉字占三个编码
const buffer = Buffer.from(message);
// 相当于指定编码为 utf8
// const buffer = Buffer.from(message, 'utf8');
console.log(buffer);// <Buffer e4 bd a0 e5 a5 bd e5 95 8a>

// 选择编码方式：utf16le 一个汉字占两个编码
const buffer = Buffer.from(message, 'utf16le');
console.log(buffer); // <Buffer 60 4f 7d 59 4a 55>
```
编码与解码
```js

// 1. 编解码相同
const buffer = Buffer.from(message);
console.log(buffer);// <Buffer e4 bd a0 e5 a5 bd e5 95 8a>
// 对字节进行解码
console.log(buffer.toString()); // 你好啊

// 2. 编码使用utf16le， 解码使用utf8
const buffer = Buffer.from(message, 'utf16le');
console.log(buffer);
console.log(buffer.toString()); // 乱码
console.log(buffer.toString('utf16le')); // 指定解码方式。
```
总结：
1. 使用Buffer.from 对字符串进行编码；
2. Buffer默认是采用utf8编码方式，一个英文字母占一个编码，一个中文占三个编码。
3. 解码buffer.toString()，默认采用utf8解码。编码与解码方式必须相同，否则会出现乱码。


## Buffer的创建
### 1. Buffer.alloc
Buffer.alloc(size);   
创建一个8位长度的Buffer，里面所有的数据默认是00。
```js
// 通过Buffer.alloc方式创建Buffer
const  buffer = Buffer.alloc(8);
console.log(buffer); // <Buffer 00 00 00 00 00 00 00 00>

// 修改buffer，单独处理某一位置的数字
buffer[0] = 88;
console.log(buffer); // <Buffer 58 00 00 00 00 00 00 00> 88的十六进制是0x58

// 在buffer中存入88
buffer[1] = 0x88;
console.log(buffer); // <Buffer 58 88 00 00 00 00 00 00>
console.log(buffer[1].toString(16)); // 88
```
总结：
1. Buffer.alloc创建指定长度的Buffer
2. 可以操作buffer中的指定位置。

## Buffer的应用场景
### 1. 文件文件读取
```js
const fs = require('fs');

// 没有指定编码方式：encoding
fs.readFile("./foo.txt", (err, data) => {
  console.log(data); // <Buffer e4 bd a0 e5 a5 bd e5 95 8a>
  console.log(data.toString()); // 你好啊
})

// 指定编码方式：utf8
fs.readFile('./foo.txt', {encoding: 'utf8'}, (err, data) => {
  console.log(data); // 你好啊
})
```
总结：
1. 如果没有指定编码，默认读取到的是二进制。

### 2. 图片文件
```js
const fs = require('fs');

// 读取图片文件
fs.readFile("./bar.jpg", (err, data) => {
  console.log(data); // <Buffer ff d8 ff e0 00 10 4a... 18991 more bytes>

  // 文件写入
  fs.writeFile('./foo.jpg', data, err => {
    console.log(err);
  });
})
```
sharp 库的使用: 对图片进行裁剪处理，再把裁剪图片写入文件中
```js
const sharp = require('sharp');

// 1.读取图片 -> 图片裁剪 -> 图片写入
sharp('./bar.jpg')
  .resize(200, 200)
  .toFile('./baz.jpg'); //直接写入


// 2.读取图片 -> 裁剪 -> 转为Buffer -> fs.writeFile写入
sharp('./bar.jpg')
  .resize(300, 300)
  .toBuffer()
  .then( data => {
    fs.writeFile('./bax.jpg', data, err => {
      console.log(err)
    });
  })
```
总结：
1. 读取到的图片是Buffer的形式，先转成字节，然后将所有的字节写入bar.jpg中。
2. 对图片的操作，采用sharp库。安装：npm install sharp。图片先转成字节，再对字节进行处理。

## Buffer的创建过程
我们创建Buffer时，并不会频繁的向操作系统申请内存，它会默认先申请一个8 * 1024个字节大小的内存，也就是8kb

总结：
1. 认识Buffer
   1. 什么是buffer
   2. Buffer的应用场景
   3. 认识字符编码

2. Buffer的使用过程
   1. 创建Buffer
   2. Buffer和字符编码
   3. 字符串和Buffer相互转换
   
3. Buffer的内存分配
   1. buffer内存分配原理
