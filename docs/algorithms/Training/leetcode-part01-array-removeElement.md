---
autoGroup-1: Leetcode
sidebarDepth: 3
title: 移除元素
---

## 移除元素
[力扣题目链接](https://leetcode-cn.com/problems/remove-element/)

### 暴力解决
```js
function removeElement(nums, val){
    var len = nums.length;
    for(var i = 0; i < len; i++){
        var item = nums[i];
        if(item === val){
            for(var j = i+1; j< len; j++){
                nums[j-1] = nums[j];
            }
            i--;
            len--;
        }
    }
    return len;
}

console.log(removeElement([0,1,2,2,3,0,4,2], 2))
```
- 时间复杂度：$O(n^2)$
- 空间复杂度：$O(1)$

### 双指针法
双指针法（快慢指针法）： 通过一个快指针和慢指针在一个for循环下完成两个for循环的工作
```js
function removeElement(nums, val){
    var len = nums.length;
    var slowIndex = 0;
    for(var fastIndex = 0; fastIndex < len; fastIndex++){
        if(nums[fastIndex] !== val){
            nums[slowIndex++] = nums[fastIndex]
        }
    }
    return slowIndex;

}
console.log(removeElement([0,1,2,2,3,0,4,2], 2));
```
- 时间复杂度：$O(n)$
- 空间复杂度：$O(1)$

## 练习
### 删除有序数组中的重复项
[力扣题目链接](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)
```js

```