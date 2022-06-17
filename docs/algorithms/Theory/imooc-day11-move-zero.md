---
autoGroup-1: 算法
sidebarDepth: 3
title: 11. 移动 0
---

## 题目

定义一个函数，将数组种所有的 `0` 都移动到末尾，例如输入 `[1, 0, 3, 0, 11, 0]` 输出 `[1, 3, 11, 0, 0, 0]`。要求：
- 只移动 `0` ，其他数字顺序不变
- 考虑时间复杂度
- 必须在原数组就行操作

## 如果不限制“必须在原数组修改”

- 定义 `part1` `part2` 两个空数组
- 遍历数组，非 `0` push 到 `part1` ，`0` push 到 `part2`
- 返回 `part1.concat(part2)`

时间复杂度 `O(n)` 空间复杂度 `O(n)` ，

所以，遇到类似问题，要提前问面试官：**是否能在原数组基础上修改？**

## 传统方式

思路
- 遍历数组
- 遇到 `0` 则 push 到数组末尾
- 然后用 splice 截取掉当前元素

分析性能
- 空间复杂度没有问题 `O(1)`
- 时间复杂度
    - 看似是 `O(n)`
    - 但实际上 `splice` 和 `unshift` 一样，修改数组结构，时间复杂度是 `O(n)`
    - 总体看来时间复杂度是 `O(n^2)`，不可用

【注意】网上有很多人对这种方式点赞，切不可随意从众，要对思考！

## 双指针

思路（可画图解释，参考视频讲解）
- 指针1 指向第一个 0 ，指针2 指向第一个非 0
- 把指针1 和 指针2 进行交换
- 指针向后移

性能分析
- 时间复杂度 `O(n)`
- 空间复杂度 `O(1)`

性能测试，实际对比差距非常大。

## 答案

使用双指针，保证时间复杂度。参考 move-zero.ts

## 划重点

- 咨询面试官，确认是否必须要修改原数据？
- 数组是有序结构，不能随意 `splice` `unshift`
- 双指针的思路


## 源码
### move-zero.ts
```typescript
/**
 * @description 移动0到数组末尾
 */

/**
 * 移动0到数组的末尾（嵌套循环）
 * @param arr number arr
 */
function moveZero(arr: number[]): void{
    const length = arr.length;
    if(length == 0) return;

    for(let i = 0; i < length; i++){
        if(arr[i] == 0){
            arr.splice(i,1);
            arr.push(0);
        }
    }
    console.log(arr);
    
}

/**
 * 移动0到数组的末尾（嵌套循环优化）
 * @param arr number arr
 */
export function moveZero1(arr: number[]): void{
    const length = arr.length;
    if(length == 0) return;

    let zeroLength = 0;
    // i 范围 length-zeroLength
    for(let i = 0; i < length-zeroLength; i++){
        if(arr[i] === 0){
            arr.splice(i,1); // 本身就有O(n)
            arr.push(0);
            i--; // 数组截取了一个元素， i要递减，否则连续0就会有错误
            zeroLength++; // 累加0的长度
        }
    }
}


/**
 * 移动0到数组的末尾（双指针）
 * @param arr number arr
 */
export function moveZero2(arr: number[]):void {
    const length = arr.length;
    if(length == 0) return;

    let i;
    let j = -1;  // 指向第一个0

    for(i = 0; i < length; i++){
        if(arr[i] === 0){
            // 第一个0
            if(j < 0){
                j = i;
            }
        }

        // j已经指向第一个0
        if(arr[i] !== 0 && j >=0){
            const n = arr[i];
            arr[i] = arr[j];
            arr[j] = n;
            j++;
        }
    }
    
}

// 功能测试
// const arr = [1, 0, 3, 0, 11, 0];
// moveZero2(arr);
// console.log(arr);

// 性能测试

const arr1 = []
for(let i = 0; i < 20* 10000; i++){
    if(i % 10 === 0){
        arr1.push(0);
    }else{
        // @ts-ignore
        arr1.push[i];
    }
}

console.time('moveZero1');
moveZero1(arr1);

console.timeEnd('moveZero1'); // 42ms


const arr2 = []
for(let i = 0; i < 20* 10000; i++){
    if(i % 10 === 0){
        arr2.push(0);
    }else{
        // @ts-ignore
        arr2.push[i];
    }
}
console.time('moveZero2');
moveZero2(arr2);
console.timeEnd('moveZero2'); // 1ms
```

### move-zero.test.ts
```typescript
/**
 * @description 移动0到数组末尾 test
 */

import { moveZero1, moveZero2 } from "./move-zero";

describe('移动0到数组末尾', ()=>{
    it('正常情况', ()=>{
        const arr = [1, 0, 3, 0, 11, 0];
        moveZero2(arr);
        expect(arr).toEqual([1,3,11,0,0,0])
    })

    it('没有0', ()=>{
        const arr = [1,3,4,11];
        moveZero2(arr);
        expect(arr).toEqual([1,3,4,11])
    })

    it('全是0', ()=>{
        const arr = [0,0,0,0,0];
        moveZero2(arr);
        expect(arr).toEqual([0,0,0,0,0])
    })
})
```