---
autoGroup-1: 算法
sidebarDepth: 3
title: 16. 数字千分位
---

## 题目

将数字按照千分位生成字符串，即每三位加一个逗号。不考虑小数。<br>
如输入数字 `78100200300` 返回字符串 `'78,100,200,300'`

## 分析

- 使用数组
- 使用正则表达式
- 使用字符串拆分

## 性能分析

- 数组转换，影响性能
- 正则表达式，性能较差
- 操作字符串，性能较好

## 答案

方案二，参考 thousands-format.ts

## 划重点

- 从尾向头计算，和日常遍历的顺序相反
- 慎用数组操作
- 慎用正则表达式

## 源码
### thousands-format.ts
```typescript
/**
 * @description 千分位格式化
 */


/**
 * 千分位格式化（使用数组）
 * @param n number
 */
 export function format1(n: number): string{
    n = Math.floor(n); // 只考虑整数

    const s = n.toString();
    const arr = s.split('').reverse();
    return arr.reduce((prev, val, index)=>{
        if(index % 3 === 0){
            if(prev){
                return val + ',' + prev;
            }else{
                return val;
            }
        }else{
            return val + prev;
        }
    }, '');
}

/**
 * 数字千分位格式化（字符串）
 * @param n number
 */
export function format2(n: number): string{
    n = Math.floor(n); // 只考虑整数

    let res = '';
    const s = n.toString();
    const length = s.length;

    for(let i = length -1; i >=0; i--){
        const j = length - i;
        if(j % 3 === 0){
            if(i === 0){ // 最前面的一个，不用加逗号
                res = s[i] + res;
            }else{
                res = ',' + s[i] + res;
            }

        }else{
            res = s[i] + res;
        }
    }

    return res;
}


// 功能测试
const n = 10200037608;
console.log(format1(n));
console.log(format2(n));
```

### thousands-format.test.ts
```typescript
/**
 * @description 数字千分位格式化 test
 */

import { format1, format2 } from "./thousands-format";

describe('数字千分位格式化', ()=>{
    it('正常情况', ()=>{
        const n = 10200037608;
        const res = format2(n);
        expect(res).toBe('10,200,037,608');
    })

    it('小于 1000', ()=>{
        expect(format2(0)).toBe('0')
        expect(format2(10)).toBe('10')
    })
})
```