---
autoGroup-1: Leetcode
sidebarDepth: 3
title: 二分查找
---

## 二分查找
[力扣题目链接](https://leetcode-cn.com/problems/binary-search/)

二分法查找使用条件：

- 数组为有序数组
- 数组中无重复元素

区间的定义需要提前弄清楚，区间的定义就是不变量。有两种情况：

- 1. 左必右闭`[left, right]`
- 2. 左必右开`[left, right)`

### 第一种写法

```js
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1; // 定义target在左闭右闭的区间里，[left, right]
  while (left <= right) {
    // 当left = right，区间[left, right]依然有效，所以用 <=
    let middle = left + Math.floor((right - left) / 2); // 防止溢出 等同于(left + right) / 2

    if (nums[middle] > target) {
      right = middle - 1; // target 在左区间，所以[left, middle -1]
    } else if (nums[middle] < target) {
      left = middle + 1; // target 在右区间， 所以[middle + 1, right]
    } else {
      // nums[middle] == target
      return middle; // 数组中找到目标值，直接返回下标
    }
  }
  return -1; // 未找到目标值
}

console.log(binarySearch([-1, 0, 3, 5, 9, 12], 5)); // 3
```

### 第二种写法

```js
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length; // 定义target在左闭右开的区间里，即：[left, right)
  while (left < right) {
    // 因为left == right的时候，在[left, right)是无效的空间，所以使用 <
    let middle = left + Math.floor((right - left) >> 1);
    if (target < nums[middle]) {
      right = middle; // target 在左区间，在[left, middle)中
    } else if (target > nums[middle]) {
      left = middle + 1; // target 在右区间，在[middle + 1, right)中
    } else {
      // nums[middle] == target
      return middle; // 数组中找到目标值，直接返回下标
    }
  }
  return -1;
}

console.log(binarySearch([-1, 0, 3, 5, 9, 12], 5)); // 3
```
- 时间复杂度：$O(logn)$
- 空间复杂度：$O(1)$

`Number`有取值范围：最大值`MAX_VALUE`和最小值`MIN_VALUE`。`left`和`right`肯定小于`MAX_VALUE`。但是`left+right`不一定小于`MAX_VALUE`，有可能导致数值溢出。所以
>let middle = Math.floor((right - left)/2 + left;  

计算`middle`时，使用`>>`右移运算符，运算结果正好对应一个整数的二分之一值，这就正好能代替数学上的除`2`运算，但是比除`2`运算快。

> let middle = Math.floor((right - left) >> 1) + left;

::: tip
middle 的取值前面需要加 Math.floor，返回大于或等于指定数字的最大整数的数字
:::

## 练习
### 搜索插值位置  
[力扣题目链接](https://leetcode-cn.com/problems/search-insert-position/)

数组插入目标值四种情况：
- 目标值在数组所有元素之前
- 目标值等于数组中的某个元素
- 目标值插入数组中的位置
- 目标值在数组所有元素之后

第一种写法
```js
function searchInsert(nums, target) {
    let left = 0;
    let right = nums.length - 1; // 定义target在左左闭右闭的区间，[left, rihgt]
    while (left <= right) { // 当left == right，区间[left, right]依然有效
        let middle = left + Math.floor((right - left) / 2); // 防止溢出 等同于(left + right) / 2
        if(target < nums[middle]){
            right = middle - 1; // target 在左区间，所以[left, middle -1]
        }else if(target > nums[middle]){
            left = middle + 1; // target 在右区间，所以[middle + 1, right]
        }else { // nums[middle] == target
            return middle;
        }
    }
    /**
     * 分别处理如下四种情况：
     * 目标值在数组所有元素之前 [0, -1]
     * 目标值等于数组中的位置 return middle
     * 目标值插入数组中的位置 [left, right]， return right + 1
     * 目标值在数组所有元素之后的情况 [left, right]，return right + 1
     * */ 
    return right + 1
}
console.log(searchInsert([1, 3, 5, 6,7, 8], 3))
```

第二种写法
```js
function searchInsert(nums, target){
    let left = 0;
    let ans = nums.length;
    let right = ans - 1;
    while(left <= right){
        let middle = left + Math.floor((right - left) / 2);
        if(target <= nums[middle]){
            ans = middle;
            right = middle -1;
        }else {
            left = middle + 1;
        }
    }
    return ans;
}
```
- 时间复杂度：$O(logn)$
- 空间复杂度：$O(1)$

### 查找元素位置 
在排序数组中查找元素的第一个和最后一个位置  

寻找target在数组里的左右边界，有如下三种情况：
- 情况一：target在数组范围的右边或者左右
- 情况二：target在数组范围中，且数组中不存在target
- 情况三：target在数组范围中，且数组中存在target

```js
function searchRange(nums, target){
    // 找到第一个小于target的元素位置
    // 二分查找，寻找target的右边界（不包括target）
    // 如果rightBorder为没有被赋值（即target在数组范围的左边，例如数组[3,3]，target为2），为了处理情况一
    const getRightBorder = (nums, target) => {
        let left = 0;
        let right = nums.length - 1;
        let rightBorder = -2; // 记录一下rightBorder没有被赋值的情况
        while(left <= right){
            let middle = left + Math.floor((right - left) / 2);
            if(target < nums[middle]){ // [left, middle - 1]
                right = middle - 1;
            }else { // 当nums[middle] == target的时候，更新left，这样才能得到target的右边界
                left = middle + 1;
                rightBorder = left;
            }
        }
        return rightBorder;
    }
    // 找到第一个大于target的元素位置
    // 二分查找，寻找target的左边界leftBorder（不包括target）
    // 如果leftBorder没有被赋值（即target在数组范围的右边，例如数组[3,3],target为4），为了处理情况一
    const getLeftBorder = (nums, target) => {
        let left = 0;
        let right = nums.length - 1;
        let leftBorder = -2; // 记录一下leftBorder没有被赋值的情况
        while(left <= right){
            let middle = left + Math.floor((right - left) / 2);
            if(target <= nums[middle]){ // 寻找左边界，就要在nums[middle] == target的时候更新right
                right = middle - 1;
                leftBorder = right
            }else {
                left = middle + 1
            }
        }
        return leftBorder;
    }

    let leftBorder = getLeftBorder(nums, target);
    let rightBorder = getRightBorder(nums, target);

    // 第一种情况
    if(leftBorder  === -2 || rightBorder === -2) return [-1, -1]
    // 第三种情况
    if(rightBorder - leftBorder > 1) return [leftBorder + 1, rightBorder - 1];
    // 第二种情况
    return [-1, -1]

}
console.log(searchRange([5,7,7,8,8,10], 8))
```