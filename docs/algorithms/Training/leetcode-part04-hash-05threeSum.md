---
autoGroup-4: 哈希表
sidebarDepth: 3
title: 三数之和
---

## 三数之和
[力扣题目链接](https://leetcode.cn/problems/3sum/)

首先将数组排序，然后有一层for循环，i从下标0的地方开始，同时定一个下标left 定义在i+1的位置上，定义下标right 在数组结尾的位置上。

依然还是在数组中找到 abc 使得a + b +c =0，我们这里相当于 a = nums[i] b = nums[left] c = nums[right]。

接下来如何移动left 和right呢， 如果nums[i] + nums[left] + nums[right] > 0 就说明 此时三数之和大了，因为数组是排序后了，所以right下标就应该向左移动，这样才能让三数之和小一些。

如果 nums[i] + nums[left] + nums[right] < 0 说明 此时 三数之和小了，left 就向右移动，才能让三数之和大一些，直到left与right相遇为止。

```ts
function threeSum(nums: number[]): number[][] {
  let res: number[][] = []

  nums.sort((a, b) => a - b);

  const length = nums.length;
  
  for (let i = 0; i < length; i++){
    // 排序之后如果第一个元素已经大于零，那么无论如何组合都
    // 不可能凑成三元组，直接返回结果就可以了
    if (nums[i] > 0) {
      return res;
    }

    // 去重
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = length - 1;
    debugger
    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right]; 
      
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else if(sum == 0) {
        res.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        // 去重
        while (nums[left] == nums[left - 1]) left++;
        while (nums[right] == nums[right + 1]) right--;
      }
    }
  }

  return res;
};
```