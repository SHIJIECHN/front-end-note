---
autoGroup-1: 算法
sidebarDepth: 3
title: 6. 二分查找
---

## 题目

用 Javascript 实现二分查找（针对有序数组），说明它的时间复杂度

## 一个故事

N 年前，百度，一个复杂的后台系统出现了问题，因为太大找不到问题所在。
一个工程师，使用二分法，很快找到了问题原因。

无论多么大的数据量，一旦有了二分，便可快速搞定。<br>
二分法，是算法的一个重要思维。

但二分法有一个条件：需要有序数据。

## 分析

二分查找是一种固定的算法，没什么可分析的。

两种实现思路
- 递归 - 代码逻辑更加简洁
- 循环 - 性能更好（就调用一次函数，而递归需要调用很多次函数，创建函数作用域会消耗时间）

时间复杂度 `O(logn)`

## 答案

参考 binary-search.ts 和 binary-search.test.ts

## 划重点

- 有序，就一定要想到二分
- 二分的时间复杂度必定包含 `O(logn)`


## 源码

### binary-search.ts
```typescript
/**
 * @description 二分查找
 */


/**
 * 二分查找（循环）
 * @param arr arr
 * @param target target
 */
export function  binarySearch1(arr:number[], target:number):number{
    const length = arr.length;
    if(length === 0) return -1;

    let startIndex = 0; // 开始位置
    let endIndex = length - 1; // 结束位置

    while(startIndex <= endIndex){
        const midIndex = Math.floor((startIndex + endIndex) / 2);
        const midValue = arr[midIndex];

        if(target < midValue){
            // 目标值较小，则继续在左侧查找
            endIndex = midIndex - 1;
        }else if(target > midValue){
            // 目标值较大，则继续在右侧查找
            startIndex = midIndex + 1;
        }else{
            // 相等，返回
            return midIndex;
        }
    }

    return -1;
}

/**
 * 二分查找（递归）
 * @param arr arr
 * @param target target
 * @param startIndex start index
 * @param endIndex end index
 */
export function binarySearch2(arr:number[], target: number, startIndex?: number, endIndex?: number): number{
    const length = arr.length;
    if(length === 0) return -1;

    // 开始和结束范围
    if(startIndex == null) startIndex = 0;
    if(endIndex == null) endIndex = length -1;

    // 如果start 和 end 相遇，则结束
    if(startIndex > endIndex) return -1;

    // 中间位置
    const  midIndex = Math.floor((startIndex + endIndex ) / 2);
    const midValue = arr[midIndex];

    if(target < midValue){
        //目标值较小，则继续在左侧查找
        return binarySearch2(arr,target, startIndex, midIndex-1);
    }else if(target > midValue){
        // 目标值较大，则继续在右侧查找
        return binarySearch2(arr, target, midIndex+1, endIndex);
    }else{
        return midIndex;
    }

}

// 功能测试
const arr = [10,20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
const target = 30;

// console.log(binarySearch2(arr, target));

// 性能测试
console.time('binarySearch1');
for(let i =0; i < 100*10000; i++){
    binarySearch1(arr, target);
}
console.timeEnd('binarySearch1'); // 10ms

console.time('binarySearch2');
for(let i =0; i < 100*10000; i++){
    binarySearch2(arr, target);
}
console.timeEnd('binarySearch2'); // 17ms
```

### binary-search.test.ts
```typescript
/**
 * @description 二分查找 test
 */

import { binarySearch1, binarySearch2 } from "./binary-search";

describe('二分查找', ()=>{
    it('正常情况', ()=>{
        const arr = [10,20, 30, 40, 50];
        const target = 40;

        const index = binarySearch1(arr, target);
        expect(index).toBe(3)  
    })

    it('空数组', ()=>{
        const target = 30;

        const index = binarySearch1([], target);
        expect(index).toBe(-1)  

        
    })

    it('找不到target', ()=>{
        const arr = [10,20, 30, 40, 50];
        const target = 400;

        const index = binarySearch1(arr, target);
        expect(index).toBe(-1) 
    })
})
```