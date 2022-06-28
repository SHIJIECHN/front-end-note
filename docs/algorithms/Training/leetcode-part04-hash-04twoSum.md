---
autoGroup-4: 哈希表
sidebarDepth: 3
title: 两数之和
---

## 两数之和
[力扣题目链接](https://leetcode.cn/problems/two-sum/)


```ts
function twoSum(nums: number[], target: number): number[] {
  let map = new Map();

  let res: number[] = []
  for (let j = 0; j < nums.length; j++){
    // 需要寻找
    const findVal = target - nums[j];
    if (map.has(findVal)) {
      res.push(map.get(findVal), j);
      return res;
    }

    // 可以直接把生成map，写在一个循环里
    // 如果在外面写生成map，如[3,2,4] taget=6,就会寻找到3本身加自己返回
    map.set(nums[j], j);
  }

  return res;

};
```

## 四数相加 II
[力扣题目链接](https://leetcode.cn/problems/4sum-ii/)

给定四个包含整数的数组列表 A , B , C , D ,计算有多少个元组 (i, j, k, l) ，使得 A[i] + B[j] + C[k] + D[l] = 0。

本题解题步骤：

1. 首先定义 一个map，key放a和b两数之和，value 放a和b两数之和出现的次数。
2. 遍历大A和大B数组，统计两个数组元素之和，和出现的次数，放到map中。
3. 定义变量count，用来统计 a+b+c+d = 0 出现的次数。
4. 再遍历大C和大D数组，找到如果 0-(c+d) 在map中出现过的话，就用count把map中key对应的value也就是出现次数统计出来。
5. 最后返回统计值 count 就可以了

```ts
function fourSumCount(nums1: number[], nums2: number[], nums3: number[], nums4: number[]): number {
  let count = 0;
  let map = new Map();

  for (let i = 0; i < nums1.length; i++){
    for (let j = 0; j < nums2.length; j++){
      // nums1 与 nums2 的各元素之和
      let sum = nums1[i] + nums2[j];
      if (map.get(sum)) {
        map.set(sum, map.get(sum) + 1);
      } else {
        map.set(sum, 1)
      }
    }
  }

  for (let i = 0; i < nums3.length; i++){
    for (let j = 0; j < nums4.length; j++){
      // nums3 与 nums4 的各元素之和
      let sum = nums3[i] + nums4[j];
      
      let res = (0 - sum);
      if (map.get(res)) {
        count += map.get(res);
      }
    }
  }

  return count;

};
```