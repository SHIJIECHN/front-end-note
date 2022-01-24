---
autoGroup-1: Leetcode
sidebarDepth: 3
title: 长度最小的子数组
---
## 长度最小的子数组
[力扣题目链接](https://leetcode-cn.com/problems/minimum-size-subarray-sum/)
## 滑动窗口

```js
var minSubArrayLen = function(target, nums) {
    let len = nums.length;
    let i = 0;
    let sum = 0;
    let res = len + 1;
    let subLen = 0;
    for (let j = i; j < len; j++) {
        sum += nums[j];
        while (sum >= target) {
            subLen = j - i + 1;
            res = res > subLen ? subLen : res;
            sum -= nums[i];
            i++;
        }
    }
    return res < len + 1 ? res : 0;
};
console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]))
    // console.log(minSubArrayLen(15, [1, 2, 3, 4, 5]))
```

## 练习
1. 水果成篮
[力扣题目链接](https://leetcode-cn.com/problems/fruit-into-baskets/)
```js
var totalFruit = function(fruits) {
    const map = new Map();
    let max = 1; // 水果个数
    let j = 0;
    for (let i = 0; i < fruits.length; i++) {
        map.set(fruits[i], i); // fruits[i]是i位置上的水果类型
        if (map.size > 2) {
            let minIndex = fruits.length - 1;
            // 找到较小的index
            for (const [fruit, index] of map) {
                if (index < minIndex) {
                    minIndex = index;
                }
            }
            map.delete(fruits[minIndex]);
            j = minIndex + 1;
        }

        max = Math.max(max, i - j + 1);
    }

    return max;
};
```

2. 最小覆盖子串
[力扣题目链接](https://leetcode-cn.com/problems/minimum-window-substring/)
```js
var minWindow = function(s, t){
  if(s.length < t.length){
    return '';
  }

  let map = new Map();
  let len = s.length;
  let res = '';
  let k = 0;
  for(let i = 0; i < t.length; i++){
    if(map.has(t[i])){
      let value = map.get(t[i]);
      map.set(t[i], ++value);
    }else {
      map.set(t[i], 1); // 初始化
    }
    
  }
  let needType = map.size;

  for(let j = 0; j < s.length; j++){
    if(map.has(s[j])){
      map.set(s[j], map.get(s[j]) - 1);
      if(map.get(s[j]) === 0){
        needType -= 1;
      }
    }
    while(needType === 0){
      let subStr = s.slice(k, j + 1); // 截取子串 
      // 
      if(!res || subStr.length < len){
        res = subStr
      }
      let c2 = s[k];
      if(map.has(c2)){
        map.set(c2, map.get(c2) + 1);
        if(map.get(c2) === 1){
          needType += 1;
        }
      }
      k += 1;
    }
  }
  return res;
}

console.log(minWindow('ADOBECODEBANC', 'ABC'))
```