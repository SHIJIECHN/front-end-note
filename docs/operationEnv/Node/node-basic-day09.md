---
autoGroup-3: Node基础
sidebarDepth: 3
title:  9. process
---

## process进程
```javascript
console.log(process.argv);
/**
[  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\小石头\\Documents\\Learning\\A01-前端基\\CSS\\flex-demo\\index.js'
]
*/
console.log(process.execArgv);

console.log(process.execPath); // C:\Program Files\nodejs\node.exe

console.log(process.env);

console.log(process.cwd()); // 执行文件的路径
// C:\Users\小石头\Documents\Learning\A01-前端基础\CSS\flex-demo
```

## process.nextTick
- 宏任务：回调函数，XHR，setTimeout，setInterval，UI rendering， I/O，setImmidate（node）
- 微任务：promise，process.nextTick（node）
