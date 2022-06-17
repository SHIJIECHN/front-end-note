---
autoGroup-1: 算法
sidebarDepth: 3
title: 12. 连续最多的字符
---

## 题目

给一个字符串，找出连续最多的字符，以及次数。<br>
例如字符串 `'aabbcccddeeee11223'` 连续最多的是 `e` ，4 次。

## 传统方式

嵌套循环，找出每个字符的连续次数，并记录比较。

时间复杂度看似是 `O(n^2)`，因为是嵌套循环。 **但实际上它的时间复杂度是 `O(n)`，因为循环中有跳步**。

## 双指针

画图解释，参考视频讲解。

只有一次循环，时间复杂度是 `O(n)`

性能测试，发现两者时间消耗一样，**循环次数也一样**。

## 其他方式

这个题目网上还有其他的答案
- 正则表达式 —— 正则表达式的效率非常低，可进行性能测试（代码 `x-reg.ts` ）
- 使用数组累计各个字符串的长度，然后求出最大值 —— 增加空间复杂度，面试官不会喜欢

【注意】算法尽量用基础代码实现，尽量不要用现成的 API 或语法糖 —— 方便，但你不好直观判断时间复杂度

## 答案

上述两种方式（嵌套循环和双指针）都可以，参考 continuous-char.ts

## 划重点

- 注意实际的时间复杂度，不要被代码所迷惑
- 双指针的思路（常用于解决嵌套循环）


## 源码
### continuous-char.ts
```typescript
/**
 * @description 连续字符
 */

interface IRes{
    char: string,
    length: number
}

/**
 * 求连续最多的字符和次数（嵌套循环）
 * @param str str
 */
export function findContinuousChar1(str: string): IRes{
    // 初始化
    const res: IRes = {
        char: '',
        length: 0
    }

    const length = str.length;
    if(length === 0) return res;

    let templength = 0; // 临时记录当前的连续字符的长度

    // O(n)
    for(let i = 0; i < length; i++){
        templength = 0; // 重置

        for(let j = i; j < length; j++){
            // 1. 相等
            if(str[i] === str[j]){
                templength++;
            }

            // 2. 不相等了或者已经到了最后一个。要去判断最大值
            if(str[i] != str[j] || j === length - 1){
                if(templength > res.length){
                    res.char = str[i];
                    res.length = templength;
                }

                // j 没有到末尾
                if(j < length - 1){
                    i = j - 1; // 跳步
                    // 为什么是i = j - 1, 而不是i = j呢？
                    // 因为在外层for循环中还会执行i++
                }
    
                break;

            }
           
        }
    }
    return res;
}

/**
 * 求连续最多的字符和次数（双指针）
 * @param str str
 */
export function findContinuousChar2(str: string): IRes{
    // 初始化
    const res: IRes = {
        char: '',
        length: 0
    }

    const length = str.length;
    if(length === 0) return res;

    let templength = 0; // 临时记录当前的连续字符的长度

    let i = 0,
        j = 0;

    // O(n)
    for(; i < length; i++){
        // 相等
        if(str[i] === str[j]){
            templength++
        }

        // 不相等或者i到末尾
        if(str[i] !== str[j] || i === length - 1){
            if(templength > res.length){
                res.char = str[j];
                res.length = templength;
            }

            templength = 0; // 重置

            // i 没有到末尾
            if(i < length - 1){
                j = i; // 让j追上i
                i--; // 细节，因为for有i++
            }
            
        }
    }

    return res;
}

// // 功能测试
// const  str = 'aabbcccddeeee11223';
// console.log(findContinuousChar2(str));

let str = '';
for(let i = 0; i < 100 * 10000; i++){
    str += i.toString();
}

console.time('finfContinousChar1');
findContinuousChar1(str); 
console.timeEnd('finfContinousChar1'); // 277ms


console.time('finfContinousChar2');
findContinuousChar2(str); 
console.timeEnd('finfContinousChar2'); // 259ms
```

### continuous-char.test.ts
```typescript
/**
 * @description 连续字符 test
 */

import { findContinuousChar1, findContinuousChar2 } from "./continuous-char";

describe('连续字符', ()=>{
    it('正常情况', ()=>{
        const  str = 'aabbcccddeeee11223';
        const res = findContinuousChar2(str);
        expect(res).toEqual({char: 'e', length: 4})
    })

    it('空字符串', ()=>{
        const res = findContinuousChar2('');
        expect(res).toEqual({char: '', length: 0})
    })

    it('无连续字符', ()=>{
        const  str = 'abc';
        const res = findContinuousChar2(str);
        expect(res).toEqual({char: 'a', length: 1})
    })

    it('全部都是连续字符', ()=>{
        const  str = 'aaa';
        const res = findContinuousChar2(str);
        expect(res).toEqual({char: 'a', length: 3})
    })
})
```