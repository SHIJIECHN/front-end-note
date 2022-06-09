---
autoGroup-1: 数组
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
  if(t.length === 0 || s.length === 0){ // t放在前面，无论如何都会判断其长度是否为0
    return ''
  }

  let map = new Map(); // 用来存储t中字符，以及缺失度
  let len = s.length;
  let minLength = len + 1; // 长度最小是，初始值为s长度加1，尽量打，然后有符合的就会变更
  let start = len + 1; // 最符合的子串的七点，开始大于s的长度，如果没有符合的，就截取到空字符串
  let missType = 0; // 缺失的种类

  for(let i = 0; i < t.length; i++){
    if(map.has(t[i])){
      map.set(t[i], map.get(t[i]) + 1);
    }else {
      map.set(t[i], 1);
    }
  }
  missType = map.size;

  let left = 0, right = 0;
  for(; right < len; right++){
    if(map.has(s[right])){ // //right对应的字符在t中出现过
      map.set(s[right], map.get(s[right]) - 1);
    }
    if(map.get(s[right]) === 0){ //只有等于0时，缺失种类减1
      missType--;
    }
    // 找到所有类型 ,取得符合的left和right，然后滑动窗口
    while(missType === 0){ 
      let subLength = right - left + 1; //获得符合子串的长度
      if(subLength < minLength){ //有较优子串，更新子串起点start
        minLength = subLength;
        start = left;
      }
      // 左指针右移 处理左指针，比较左指针当前的字符，
      // 如果在map中出现，则说明移动left会使map发生改变
      if(map.has(s[left])){
        map.set(s[left], map.get(s[left]) + 1);
      }

      if(map.get(s[left]) > 0){ // 大于0说明如果移动left，会造成字符缺失
        missType ++; 
      }
      left++; //左指针右移一位
    }
  }
  console.log(start, minLength);
  return s.substr(start, minLength);
}

console.log(minWindow("cabwefgewcwaefgcf", 'cae'))
console.log(minWindow('ADOBECODEBANC', 'ABC'))
```