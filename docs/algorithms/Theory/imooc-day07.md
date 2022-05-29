---
autoGroup-1: 算法
sidebarDepth: 3
title: 两数之和
---

## 题目

输入一个递增的数字数组，和一个数字 `n` 。求和等于 `n` 的两个数字。<br>
例如输入 `[1, 2, 4, 7, 11, 15]` 和 `15` ，返回两个数 `[4, 11]`

## 分析

注意题目的要点
- 递增，从小打大排序
- 只需要两个数字，而不是多个

## 常规思路

嵌套循环，找个一个数，然后再遍历剩余的数，求和，判断。

时间复杂度 `O(n^2)` ，基本不可用。

## 利用递增的特性

数组是递增的
- 随便找两个数
- 如果和大于 n ，则需要向前寻找
- 如果和小于 n ，则需要向后寻找 —— **二分法**

双指针（指针就是索引，如数组的 index）
- i 指向头，j 指向尾， 求 i + j 的和
- 和如果大于 n ，则说明需要减少，则 j 向前移动（递增特性）
- 和如果小于 n ，则说明需要增加，则 i 向后移动（递增特性）

时间复杂度降低到 `O(n)`

## 答案

方案二，参考 two-numbers-sum.ts

## 划重点

- 有序数据，要善用二分法
- 优化嵌套循环，可以考虑“双指针”


## 源码

### two-numbers-sum.ts
```typescript
/**
 * @description 两数之和
 */


/**
 * 寻找和为n的两个数（嵌套循环）
 * @param arr arr
 * @param n n
 * @returns 
 */
export function findTwoNumbers1(arr: number[], n: number): number[]{
    const res: number[] = [];

    const length  = arr.length;
    if(length == 0) return res;


    // O(n^2)
    for(let i =0; i < length; i++){
        const n1 = arr[i];
        let flag = false; // 是否得到结果

        for(let j = i+1; j< length; j++){
            const n2 = arr[j];

            if(n1 + n2 === n){
                res.push(n1);
                res.push(n2);
                flag = true;
                break;
            }
        }

        if(flag) break;
    }

    return res;
}

/**
 * 查找和为n的两个数（双指针）
 * @param arr arr
 * @param n n
 */
export function findTwoNumbers2(arr: number[], n: number): number[]{
    const res:number[] = [];

    const length = arr.length;
    if(length === 0) return res;

    let i = 0; // 头
    let j = length -1; // 尾

    while(i < j){
        const n1 = arr[i];
        const n2 = arr[j];

        const sum = n1 + n2;

        if( sum > n){
            // sum大于n， 则j要向前移动
            j--;
        }else if(sum < n){
            // sum小于n，则i要向后移动
            i++
        }else {
            // 相等
            res.push(n1);
            res.push(n2);
            break; // 终止循环，一定要写
        }
    }


    return res;
}

// 功能测试
const arr = [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,4,7,11,15];
// console.info(findTwoNumbers2(arr, 15))

// 性能测试
console.time('findTwoNumber1');
for(let i =0; i < 100*10000; i++){
    findTwoNumbers1(arr, 15)
}
console.timeEnd('findTwoNumber1'); // 690ms

console.time('findTwoNumber2');
for(let i =0; i < 100*10000; i++){
    findTwoNumbers2(arr, 15)
}
console.timeEnd('findTwoNumber2'); // 90ms
```

### two-numbers-sum.test.ts
```typescript
/**
 * @description 两数之和 test
 */

import { findTwoNumbers1, findTwoNumbers2 } from "./two-numbers-sum";

describe('两数之和', ()=>{
    it('正常情况', ()=>{
        const arr = [1,2,4,7,11,15];
        const res = findTwoNumbers2(arr, 15);
        expect(res).toEqual([4,11]);
    })

    it('空数组', ()=>{
        const res = findTwoNumbers2([], 15);
        expect(res).toEqual([]);
    })

    it('找不到结果', ()=>{
        const arr = [1,2,4,7,11,15];
        const res = findTwoNumbers2(arr, 150);
        expect(res).toEqual([]);
    })
})
```