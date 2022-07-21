---
autoGroup-1: Node基础
sidebarDepth: 3
title:  6. Buffer补充、path
---

## Buffer
### 1. buf.write
```js
const buf = Buffer.alloc(5);
console.log(buf); // <Buffer 00 00 00 00 00>
const len = buf.write('test', 1, 3);
console.log(len); // 3
console.log(buf); // <Buffer 00 74 65 73 00>
```

### 2. buf.toString
```javascript
const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
    //97是‘a’的十进制ascii值
    buf[i] = i + 97;
}

console.log(buf.toString('ascii')); //  abcdefghijklmnopqrstuvwxyz
console.log(buf.toString('ascii', 10, 15)); //klmno
```

### 3. Buffer.isEncoding