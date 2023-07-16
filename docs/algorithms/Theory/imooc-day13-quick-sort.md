---
autoGroup-1: 算法
sidebarDepth: 3
title: 13. 快速排序
---

## 题目

用 Javascript 实现快速排序，并说明时间复杂度。

## 思路

快速排序是基础算法之一，算法思路是固定的
- 找到中间位置 midValue
- 遍历数组，小于 midValue 放在 left ，大于 midValue 放在 right
- 继续递归，concat 拼接

## splice 和 slice

代码实现时，获取 midValue 可以通过 `splice` 和 `slice` 两种方式

理论分析，`slice` 要优于 `splice` ，因为 `splice` 会修改原数组。<br>
但实际性能测试发现两者接近。

但是，即便如此还是倾向于选择 `slice` —— **因为它不会改动原数组**，类似于函数式编程

## 性能分析

快速排序 时间复杂度 `O(n*logn)` —— 有遍历，有二分

普通的排序算法（如冒泡排序）时间复杂度时 `O(n^2)`

## 答案

使用 slice 方案，参考 quick-sort.ts

## 划重点

- 排序算法（基本功）
- 二分法的时间复杂度
- 注意数组的操作（ `splice` vs `slice` ）


## 源码

### quick-sort.ts
```javascript
/**
 * @description 快速排序
 */


/**
 * 快速排序（使用splice）
 * @param arr number arr
 */
export function quickSort1(arr: number[]): number[] {
    const length = arr.length;
    if(length === 0 )return arr;

    const midIndex = Math.floor(length / 2);
    const midValue = arr.splice(midIndex, 1)[0]; 
    // arr.splice(midIndex, 1)返回的是一个数组，里面只有一个值，如[2], 1是只有一个元素，[0]是取出里面的值

    const left: number[] = [];
    const right: number[] = [];
    // 注意：这里不能用length，而是用arr.length。因为arr已经被splice给修改了
    // O(n) * O(logn) -> O(nlogn)
    for(let i = 0; i < arr.length; i++){
        const n = arr[i];
        // O(logn)
        if(n < midValue){
            // 小于midValue，则放在left
            left.push(n);
        }else{
            // 大于等于midValue，则放在right
            right.push(n);
        }
    }

    return quickSort1(left).concat(
        [midValue], 
        quickSort1(right)
    )
}

/**
 * 快速排序（使用slice）
 * @param arr number arr
 */
export function quickSort2(arr: number[]): number[] {
    const length = arr.length;
    if(length === 0 )return arr;

    const midIndex = Math.floor(length / 2);
    const midValue = arr.slice(midIndex, midIndex+1)[0]; 

    const left: number[] = [];
    const right: number[] = [];

    for(let i = 0; i < length; i++){
        // 因为midIndex没有删除掉还在数组中，所以要屏蔽掉
        if(i !== midIndex){
            const n = arr[i];
            if(n < midValue){
                // 小于midValue，则放在left
                left.push(n);
            }else{
                // 大于等于midValue，则放在right
                right.push(n);
            }
        }
    }

    return quickSort2(left).concat(
        [midValue], 
        quickSort2(right)
    )
}

// // 功能测试
// const arr1 = [9,1,6,8,2,7,3,8,4,9,5];
// console.log(quickSort2(arr1));


// 性能测试
// const arr1 = [];
// for(let i = 0; i < 10 * 10000; i++){
//     arr1.push(Math.floor(Math.random() * 1000));
// }

// console.time('quickSort1');
// quickSort1(arr1);
// console.timeEnd('quickSort1'); // 82ms

// console.time('quickSort2');
// quickSort2(arr1);
// console.timeEnd('quickSort2'); // 108ms


// 单独比较splice和slice

const arr1 = [];
for(let i = 0; i < 10 * 10000; i++){
    arr1.push(Math.floor(Math.random() * 1000));
}
console.time('quickSort1');
arr1.splice(5 * 10000, 1)
console.timeEnd('quickSort1'); // 0.1ms

const arr2 = [];
for(let i = 0; i < 10 * 10000; i++){
    arr2.push(Math.floor(Math.random() * 1000));
}
console.time('quickSort2');
arr2.slice(5*10000, 5*10000 + 1)
console.timeEnd('quickSort2'); // 0.008ms
```

### quick-sort.test.ts
```typescript
/**
 * @description 快速排序 test
 */

import { quickSort1, quickSort2 } from "./quick-sort";

describe('快速排序', ()=>{
    it('正常情况', ()=>{
        const arr1 = [9,1,6,8,2,7,3,8,4,9,5];
        const res = quickSort2(arr1);
        expect(res).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9])
    })

    it('有负数', ()=>{
        const arr1 = [-2, 2, -3, 1];
        const res = quickSort2(arr1);
        expect(res).toEqual([-3, -2, 1, 2])
    })

    it('数组元素都一样', ()=>{
        const arr1 = [2, 2, 2, 2];
        const res = quickSort2(arr1);
        expect(res).toEqual([2, 2, 2, 2])
    })

    it('空数组', ()=>{
        const res = quickSort2([]);
        expect(res).toEqual([])
    })
})

```