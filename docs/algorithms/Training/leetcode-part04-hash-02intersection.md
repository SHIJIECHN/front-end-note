---
autoGroup-4: 哈希表
sidebarDepth: 3
title: 两个数组的交集
---

## 两个数组的交集
[力扣题目链接](https://leetcode.cn/problems/intersection-of-two-arrays/)

set的使用
```typescript
function intersection(nums1: number[], nums2: number[]): number[] {
  let res: number[] = [];

  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  console.log(set1, set2);
  
  for (let val of set1) {
    if (set2.has(val)) {
      res.push(val)
    }
  }
  return res;
};
```

## 两个数组的交集 II
[力扣题目链接](https://leetcode.cn/problems/intersection-of-two-arrays-ii/)

由于同一个数字在两个数组中都可能出现多次，因此需要用哈希表存储每个数字出现的次数。对于一个数字，其在交集中出现的次数等于该数字在两个数组中出现次数的最小值。

首先遍历第一个数组，并在哈希表中记录第一个数组中的每个数字以及对应出现的次数，然后遍历第二个数组，对于第二个数组中的每个数字，如果在哈希表中存在这个数字，则将该数字添加到答案，并减少哈希表中该数字出现的次数。
```typescript
function intersect(nums1: number[], nums2: number[]): number[] {
  let res: number[] = [];

  const getMap = (arr: number[]) => {
    let map = new Map();
    for (let i = 0; i < arr.length; i++){
      let val = map.get(arr[i]);
      if (map.has(arr[i])) {
        map.set(arr[i], ++val);
      } else {
        map.set(arr[i], 1)
      }
    }
    return map;
  }

  let map = getMap(nums1);
  
  for (let i = 0; i < nums2.length; i++) {
    const item = nums2[i];
    if (map.has(item) && map.get(item) !== 0) {
      res.push(item);
      map.set(item, map.get(item) - 1);
    }
  }
  
  return res;
};

```
