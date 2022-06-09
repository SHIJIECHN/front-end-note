---
autoGroup-1: 数组
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
双指针法（快慢指针法）： 通过一个快指针和慢指针在一个`for`循环下完成两个`for`循环的工作。  
扫描数组中所有元素，如果`nums[fastIndex]!=val`(就是要保存的值)就把这个元素放入`nums[slowIndex]`中，然后`slowIndex++`
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
快指针每次增长一个，慢指针只有当快慢指针上的值不同时，才增长一个（由于时有序数组，快慢指针值不等说明找到了新值）
```js
var removeDuplicates = function(nums) {
    var len = nums.length - 1;
    var i = 0;
    for(var j = 1; j <= len; j++){
        if(nums[j]!==nums[i]){
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1;
};
// console.log(removeDuplicates([1,1,2,2,3,4]))
console.log(removeDuplicates([0,0,1,1,1,2,2,3,3,4]))
```
### 移动零
[力扣题目链接](https://leetcode-cn.com/problems/move-zeroes/)
```js
var moveZeroes = function(nums) {
    var len = nums.length - 1;
    var i = 0;
    for(var j = 0; j<= len; j++){
        if(nums[j] !== 0){
            nums[i] = nums[j];
            i++;
        }
    }
    while(i<= len){
        nums[i] = 0
        i++;
    }
    return nums;
};
console.log(moveZeroes([0,1,0,3,12]));
```

### 比较含退格的字符串
[力扣题目链接](https://leetcode-cn.com/problems/backspace-string-compare/)
```js
var backspaceCompare = function(s, t) {
    var formatStr = function(str){
        var i = 0;
        var strToArr = str.split("");
        for(var j = 0; j <= strToArr.length - 1; j++){
            if(strToArr[j]!=='#'){
                strToArr.splice(i, 1, strToArr[j]);
                i++;
            }else{
                if(i !== 0){
                    i--;
                }
            }
        }
        strToArr.length = i;
        return strToArr.join("");
    }
    s = formatStr(s);
    t = formatStr(t);
    if(s.length !== t.length){
        return false;
    }

    if(s.length === t.length && s.length === 0){
        return true;
    }

    for(var k = 0; k < s.length; k++){
        if(s[k] !== t[k]){
            return false;
        }
        return true;
    }
}

console.log(backspaceCompare('a##c','#a#c'))
```

优化：
- 字符串尾部截断使用`slice`方法
- 字符串直接 `==` 比较
```js
var backspaceCompare = function(s, t) {
    return backspace(s) == backspace(t)
}
function backspace(str){
    var backspaceStr = '';
    for(var i = 0; i < str.length; i++){
        backspaceStr = str[i] !== '#'? backspaceStr + str[i] : backspaceStr.slice(0, -1);
    }
    return backspaceStr;
}
console.log(backspaceCompare('a##c','#a#c'))
```
- 时间复杂度：$O(n)$
- 空间复杂度：$O(1)$

### 有序数组的平方
[力扣题目链接](https://leetcode-cn.com/problems/squares-of-a-sorted-array/)
暴力解法
```js
var sortedSquares = function(nums) {
    for(var i = 0; i < nums.length; i++){
        nums[i] = nums[i] * nums[i]
    }
    // nums.sort(function(a, b){
    //     return a > b ? 1 : -1;
    // })
    nums.sort(function(a, b){
        return a - b;
    })
    return nums;

};
```
- 时间复杂度：$O(n+nlogn)$

`sort()`比较总结：`sort()`方法可以接受一个方法参数，这个方法有两个参数。分别代表每次排序比较时的两个数组项。`sort()`排序时每次比较两个数组项都会执行这个参数，并把两个比较的数组项作为参数传递给这个函数。当函数返回值为`1`的时候就交换两个数组项的顺序，否则就不交换。

双指针法
```js
var sortedSquares = function(nums) {
    var result = []
    for(var i = 0, j = nums.length - 1; i <= j;){
        var left = Math.abs(nums[i]);
        var right = Math.abs(nums[j]);
        if(right >= left){
            result.unshift(right * right);
            j--;
        }else {
            result.unshift(left * left);
            i++;
        }
    }
    return result;

};

console.log(sortedSquares([-4,-1,0,3,10]));
```
- 时间复杂度：$O(n)$

数组是有序的，只不过负数平方之后可能成为最大数了。那么数组平方的最大值就在数组的两端，不是最左边就是最右边，不可能是中间。双指针法，i指向起始位置，j指向终止位置。定义一个新数组`result`存放结果。
如果`A[i] * A[i] < A[j] * A[j]` 那么`result`插入`A[j] * A[j]`; 。
如果`A[i] * A[i] >= A[j] * A[j]` 那么`result`插入`A[i] * A[i]`; 