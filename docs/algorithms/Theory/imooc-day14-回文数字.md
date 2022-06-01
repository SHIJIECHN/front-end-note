---
autoGroup-1: 算法
sidebarDepth: 3
title: 1-10000 之间的对称数（回文）
---

## 题目

打印 1-10000 之间的对称数

## 使用数组反转

- 数字转换为字符串
- 字符串转换为数组 reverse ，再 join 生成字符串
- 比较前后的字符串

## 使用字符串头尾比较

- 数字转换为字符串
- 字符串头尾比较

还可以使用**栈**（但栈会用到数组，性能不如直接操作字符串）
- 数字转换为字符串，求长度
- 如果长度是偶数，则用栈比较
- 如果长度是奇数，则忽略中间的数字，其他的用栈比较

## 生成反转数

- 通过 `%` 和 `Math.floor` 将数字生成一个反转数
- 比较前后的数字

## 性能分析

时间复杂度看似相当，都是 `O(n)`

但 方案1 涉及到了数组的转换和操作，就需要耗费大量的时间
- 数组 reverse 需要时间
- 数组和字符串的转换需要时间

方案 2 3 比较，数字操作最快。电脑的原型就是计算器，所以处理数字是最快的。

## 答案

第三种方案，参考 palindrome-number.ts

## 划重点

- 尽量不要使用内置 API ，不好判断时间复杂度
- 尽量不要转换数据格式，尤其注意数组（有序结构，不能乱来～）
- 数字操作最快

## 源码

### palindrome-number.ts
```typescript
/**
 * @description 回文数字 
 */

/**
 * 查询1-max的所有对称数（数组反转）
 * @param max 最大值
 * @returns 
 */
export function findPalindromeNumber1(max: number): number[]{
    const res: number[] =[]
    if(max <= 0) return res;

    // 1 - 10000
    for(let i = 1; i <= max; i++){
        // 转换为字符串，转换为数组，再反转，比较
        const  s = i.toString();
        if(s === s.split('').reverse().join('')){
            res.push(i);
        }
    }

    return res;
}

/**
 * 查询1-max的所有对称数（字符串前后比较）
 * @param max 最大值
 * @returns 
 */
 export function findPalindromeNumber2(max: number): number[]{
    const res: number[] =[]
    if(max <= 0) return res;

    // 1 - 10000
    for(let i = 1; i <= max; i++){
        
        const  s = i.toString();
        const length = s.length;

        // 字符串比较
        let flag = true,
            startIndex = 0,
            endIndex = length - 1;
        
        while(startIndex < endIndex){
            if(s[startIndex] !== s[endIndex]){
                flag = false;
                break;
            }else {
                // 继续比较
                startIndex++;
                endIndex--;
            }
        }
        if(flag) res.push(i);
    }

    return res;
}

/**
 * 查询1-max的所有对称数（生成翻转数）
 * @param max 最大值
 * @returns 
 */
 export function findPalindromeNumber3(max: number): number[]{
    const res: number[] =[]
    if(max <= 0) return res;

    for(let i = 1; i <= max; i++){
        let n = i;
        let rev = 0; // 存储翻转数

        while(n > 0){
            rev = rev * 10 + n % 10;
            n = Math.floor(n / 10);
        }

        if(i === rev) res.push(i);
    }

    return res;
}

// 功能测试
// console.log(findPalindromeNumber3(200));

// 性能测试
console.time('findPalindromeNumber1');
findPalindromeNumber1(100*10000);
console.timeEnd('findPalindromeNumber1'); // 402ms

console.time('findPalindromeNumber2');
findPalindromeNumber2(100*10000);
console.timeEnd('findPalindromeNumber2'); // 55ms

console.time('findPalindromeNumber3');
findPalindromeNumber3(100*10000);
console.timeEnd('findPalindromeNumber3'); // 41ms

```

### palindrome-number.test.ts
```typescript
/**
 * @description 回文数字 test
 */

import { findPalindromeNumber1, findPalindromeNumber2, findPalindromeNumber3 } from "./palindrome-number"

describe('回文数字', ()=>{
    it('正常情况',()=>{
        const res = findPalindromeNumber3(200);
        expect(res.length).toBe(28);
    })

    it('max 小于等于0',()=>{
        const res = findPalindromeNumber3(-1);
        expect(res).toEqual([]);
    })
})
```