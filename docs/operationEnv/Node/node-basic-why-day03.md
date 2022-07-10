---
autoGroup-3: Node基础
sidebarDepth: 3
title:  2. Node常用内置模块
---

## 常用的内置模块
- path模块
- fs模块
- events模块


## path模块
对路径的处理。
### 1. path.resolve()
路径拼接
```javascript
const path = require('path');

const basePath = '/User/why';
const filename = 'abc.txt';

// 路径拼接：不同系统路径分隔符不同，Linux/Max OS 为 "\"， window为 ' /'
// const path = basePath + '/' + filename; 

// 解决：用path的resolve，它会根据环境自动解决不同路径分隔符
const filepath = path.resolve(basePath, filename);
console.log(filepath); // C:\User\why\abc.txt
```
总结：在Mac OS、Linux和window上的路径时不一样的，使用path.resolve()进行路径拼接，会自动根据系统选择分隔符。

### 2. 获取路径相关信息
```javascript
const path = require('path')

const filepath = '/User/why/abc.txt';

// abx.txt所在的路径
console.log(path.dirname(filepath)); // /User/why
// 文件的名字
console.log(path.basename(filepath)); // abc.txt
// 获取后缀名
console.log(path.extname(filepath)); // .txt
```

### 3. path.join()
路径的拼接
```javascript
const basepath = '/User/why';
const filename = 'abc.txt';

// join拼接路径
const filepath = path.join(basepath, filepath);
console.log(filepath);

// resolve拼接路径
const filepath2 = path.resolve(basepath, filename);
console.log(filepath2);

// 修改basepath
const basepath = 'User/why';
const filename = 'abc.txt';

// join
const filepath = path.join(basepath, filename);
console.log(filepath); // User\why\abc.txt
// resolve
const filepath2 = path.resolve(basepath, filename);
console.log(filepath2);
// C:\Users\小石头\Desktop\part\vue\deep\demo\Node-test\07_常见的内置模块\01_path\User\why\abc.txt
// 会把当前文件拼接所在的路径
```
总结：join拼接与resolve的区别：resolve会判断拼接的路径分隔符中，是否有以 / 或 ./ 或 ../ 开头的路径。如果有表示是一个绝对路径，会返回对应的拼接路径，如果没有，那么会和当前执行文件所在的文件夹进行路径的拼接。


## fs模块
文件系统。

### 1. 三种操作方式
API大多数都提供了三种操作方式：
1. 方式一：同步操作文件：代码会被阻塞，不会继续执行；
2. 方式二：异步回调函数操作文件：代码不会被阻塞，需要传入回调函数，当获取到结果时，回调函数被执行；
3. 方式三：异步Promise操作文件：代码不会被阻塞，通过 fs.promises 调用方法操作，会返回一个Promise，
可以通过then、catch进行处理。

```javascript
const fs = require('fs')

// 案例：获取文件的信息
const filepath = './abc.txt'

// 1. 方式一：同步操作
const info = fs.statSync(filepath);
console.log("后续需要执行的代码"); // 
console.log(info);
/**
 * 
  后续需要执行的代码
  Stats {
    dev: 3492802050,
    mode: 33206,
    nlink: 1,
    uid: 0,
    gid: 0,
    ...
   }
 * */

// 2. 方式二：异步操作
fs.stat(filepath, (err, info) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(info);
})
console.log('后续需要执行的代码');
/**
 * 后续需要执行的代码
 * Stats {
    dev: 3492802050,
    mode: 33206,
    nlink: 1,
    uid: 0,
    gid: 0,
    ...
   }
 */

// 3. 方式三：promise
fs.promises.stat(filepath).then(info => {
    console.log(info);
}).catch(err => {
    console.log(err);
});
console.log('后续需要执行的代码');
/**
 * 
  后续需要执行的代码
  Stats {
    dev: 3492802050,
    mode: 33206,
    nlink: 1,
    uid: 0,
    gid: 0,
    ...
   }
 * */
```

### 2. 文件描述符
对于每个进程，内核都维护着一张当前打开着的文件和资源的表格。每个打开的文件都分配了一个称为文件描述符的简单的数字标识符。
```javascript
const fs = require('fs');

fs.open('./abc.txt', (err, fd) => {
    if (err) {
        console.log(err);
        return;
    }

    // 通过描述符去获取文件的信息
    fs.fstat(fd, (err, info) => {
        console.log(info);
    })
})
/**
 * Stats {
    dev: 3492802050,
    mode: 33206,
    nlink: 1,
    uid: 0,
    gid: 0,
    ...
  }
 */
```
总结：fs.open() 方法用于分配新的文件描述符。一旦被分配，则文件描述符可用于从文件读取数据、向文件写入数据、或请求关于文件的信息

### 3. 文件的读写
- fs.readFile(path[, options], callback)：读取文件的内容；
- fs.writeFile(file, data[, options], callback)：在文件中写入内容；

```javascript
const fs = require('fs');
const content = '你好啊'

// 1. 文件写入
fs.writeFile('./abc.txt', content, { flag: 'a+' }, err => {
    console.log(err);
})

// 2. 文件读取
fs.readFile('./abc.txt', { encoding: 'utf-8' }, (err, data) => {
    console.log(data); // Hello Node File System你好啊
})
```
options是可选项。    
- flag：写入的方式。
- encoding：字符的编码。

flag选项：
1. w 打开文件写入，默认值
2. w+打开文件进行读写，如果不存在则创建文件
3. r+ 打开文件进行读写，如果不存在那么抛出异常
4. r打开文件读取，读取时的默认值；
5. a打开要写入的文件，将流放在文件末尾。如果不存在则创建文件
6. a+打开文件以进行读写，将流放在文件末尾。如果不存在则创建文件

encoding选项：目前基本用的是UTF-8编码。如果不填写，返回的结果是Buffer。


### 4. 文件夹操作
- 创建文件夹
- 读取文件夹中的所有文件
- 文件夹的重命名

```javascript
const fs = require('fs');
const path = require('path');

// 1. 创建文件夹
const dirname = './why';
// 判断文件夹是否存在，如果不存在，则创建文件夹
if (!fs.existsSync(dirname)) {
    fs.mkdir(dirname, err => {
        console.log(err);
    })
}

// 2. 读取文件夹中的所有文件
fs.readdir(dirname, (err, files) => {
    console.log(files); // [a.txt, file, b.jpg]
})

// 递归调用文件夹中的文件
function getFiles(dirname) {
    fs.readdir(dirname, { withFileTypes: true }, (err, files) => {
        // 遍历files
        files.forEach(file => {
            console.log(file); // Dirent { name: 'a.txt', [Symbol(type)]: 1 }

            // 判断是不是文件夹
            // fs.stat(file) // 可以，但是麻烦
            if (file.isDirectory()) {
                const filepath = path.resolve(dirname, file.name);
                getFiles(filepath);
            } else {
                console.log(file.name); // a.txt
            }
        })
    })
}
getFiles(dirname);

// 3. 文件夹的重命名
// 旧的路径， 新的路径
fs.rename('./why', './koke', err => {
    console.log(err);
})
```

### 5. 文件夹复制

## events模块
Node中的核心API都是基于异步事件驱动的。在这个体系中，某些对象（发射器，Emitters）发出一个事件，可以监听这个事件（监听器Listeners）并且传入的回调函数，这个回调函数会在监听到事件时调用。

### 1. 基本方法
发出事件和监听事件都是通过EventEmitter类来完成的，它们属于events对象：
- emitter.on(eventName, listener)：监听事件，也可以使用
addListener
- emitter.off(eventName, listener)：移除事件监听，也可以使
用removeListener
- emitter.emit(eventName[, ...args])：发出事件，可以携带一
些参数

```javascript
const EventEmitter = require('events');

// 1. 创建发射器
const emitter = new EventEmitter();

// 2. 监听某一个事件
// on 或 addListener
emitter.on('click', (args) => {
    console.log('监听1到click事件', args);
})

const listener2 = (args) => {
    console.log('监听2到click事件', args);
}
emitter.on('click', listener2)

// 3. 发出一个事件
setTimeout(() => {
    emitter.emit('click', ['codewhy', 'james', 'kobe']);
    // 取消监听
    emitter.off('click', listener2);
    emitter.emit('click', ['codewhy', 'james', 'kobe']);
}, 2000)

/**
监听1到click事件 [ 'codewhy', 'james', 'kobe' ]
监听2到click事件 [ 'codewhy', 'james', 'kobe' ]
监听1到click事件 [ 'codewhy', 'james', 'kobe' ]
 */
```

### 2. 获取信息
```javascript
const EventEmitter = require('events');

// 1. 创建发射器
const emitter = new EventEmitter();

// 2. 监听某一个事件
// on 或 addListener
emitter.on('click', (args) => {
    console.log('监听1到click事件', args);
})

const listener2 = (args) => {
    console.log('监听2到click事件', args);
}
emitter.on('click', listener2)

emitter.on('tap', (args) => {
    console.log(args);
})

// 3. 获取信息
// 获取注册的事件
console.log(emitter.eventNames()); // [ 'click', 'tap' ]
// 获取注册的click事件数
console.log(emitter.listenerCount('click')); // 2 
// 获取click事件的事件处理函数
console.log(emitter.listeners('click')); //[ [Function (anonymous)], [Function: listener2] ]
```

### 3. 不常用方法
- once 只会执行一次
- prependListener 将本次监听放到最前面
```javascript
const EventEmitter = require('events');

// 1. 创建发射器
const emitter = new EventEmitter();

// 2. 监听某一个事件
// once 只会执行一次
emitter.once('click', (...args) => {
    console.log('监听1到click事件', args);
})

const listener2 = (...args) => {
    console.log('监听2到click事件', args);
}
emitter.on('click', listener2)

// prependListener 将本次监听放到最前面
emitter.prependListener('click', (...args) => {
    console.log('监听3到click事件', args);
})

// 3. 发出一个事件
setTimeout(() => {
        emitter.emit('click', 'codewhy', 'james', 'kobe');
        emitter.emit('click', 'codewhy', 'james', 'kobe');
        // 移除所有监听器
        emitter.removeAllListeners('click');
        emitter.emit('click', 'codewhy', 'james', 'kobe');
    }, 2000);
/**
监听3到click事件 [ 'codewhy', 'james', 'kobe' ]
监听1到click事件 [ 'codewhy', 'james', 'kobe' ]
监听2到click事件 [ 'codewhy', 'james', 'kobe' ]
监听3到click事件 [ 'codewhy', 'james', 'kobe' ]
监听2到click事件 [ 'codewhy', 'james', 'kobe' ]
*/
```

