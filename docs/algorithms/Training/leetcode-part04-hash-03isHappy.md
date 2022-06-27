---
autoGroup-4: 哈希表
sidebarDepth: 3
title: 快乐数
---

## 快乐数
[力扣题目链接](https://leetcode.cn/problems/happy-number/)

```typescript
function isHappy(n: number): boolean {
  let sum = 0;
  let map = new Map();
  // 求和
  const getSum = (x: number): number =>{
    sum = 0;
    
    while (x > 0) {
      const res = x % 10;
      sum += res * res;
      x = Math.floor(x / 10);
    }
    return sum;
  }
  
  // 不使用递归时，重复执行的方法。
  while (1) {
    if (map.has(n)) return false;
    if (n === 1) return true;
    map.set(n, 1)
    n = getSum(n);
  }
};
```