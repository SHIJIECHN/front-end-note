---
autoGroup-1: 算法
sidebarDepth: 3
title: 数组旋转
---

## 题目

定义一个函数，实现数组的旋转。如输入 `[1, 2, 3, 4, 5, 6, 7]` 和 `key = 3`， 输出 `[5, 6, 7, 1, 2, 3, 4]`<br>
考虑时间复杂度和性能

## 实现思路

思路1
- 将 `k` 后面的元素，挨个 `pop` 然后 `unshift` 到数组前面

思路2
- 将 `k` 后面的所有元素拿出来作为 `part1`
- 将 `k` 前面的所有元素拿出来作为 `part2`
- 返回 `part1.concat(part2)`

## 实现
array-rotate.ts
```typescript
/**
 * @description Array rotate
 */

/**
 * 旋转数组 k 步-使用pop和unshift方法
 * @param arr arr
 * @param k k
 */
export function rotate1(arr: number[], k: number): number[]{
    // 获取数组的长度
    const length = arr.length;
    if(!k || length == 0) return arr; // 如果k为0或者数组长度为0，则直接返回数组
    // 移动的步数。取绝对值，如果k为负数，则取绝对值。
    // k % length：如果k大于数组长度，也能正确输出结果。当k不是数字时，k % length返回NaN
    const step = Math.abs(k % length); 

    // O(n)
    for(let i = 0; i < step; i++){
        const n = arr.pop(); // 移动几步就pop几次

        if(n != null){
            arr.unshift(n);
        }
    }

    return arr;
}

/**
 * 旋转数组k步- 使用concat方法
 * @param arr arr
 * @param k k
 * @returns arr
 */
export function  rotate2(arr: number[], k: number): number[]{
    const length  = arr.length;
    if(!k || length === 0) return arr;

    const step = Math.abs(k % length);
    const part1 = arr.slice(-step); // const a = [1,2,3,4]; a.slice(-2); // [3,4] 获取后面的一部分
    const part2 = arr.slice(0, length - step); // 获取前面部分

    return part1.concat(part2); // 拼接
}

// 功能测试
const arr = [1,2,3,4,5,6,7];
const arr1 = rotate2(arr, -3);
console.log(arr1);

```
## 单元测试
array-rotate.test.ts
```typescript
/**
 * @description Array rotate test
 */

import {rotate1, rotate2} from './array-rotate'

// 单元测试格式：describe 一组测试用例
describe('数组旋转', ()=>{
    // 一个测试用例
    it('正常情况', ()=>{
        const arr = [1,2,3,4,5,6,7];
        const k = 3;

        const res = rotate2(arr, k);
        expect(res).toEqual([5,6,7,1,2,3,4]); // 断言
    })

    it('数组为空', ()=>{
        const res = rotate2([], 3);
        expect(res).toEqual([]); // 断言
    })

    it('k是负值', ()=>{
        const arr = [1,2,3,4,5,6,7];
        const k = -3;

        const res = rotate2(arr, k);
        expect(res).toEqual([5,6,7,1,2,3,4]); // 断言
    })

    it('k是0', ()=>{
        const arr = [1,2,3,4,5,6,7];
        const k = 0;

        const res = rotate2(arr, k);
        expect(res).toEqual(arr); // 断言
    })

    it('k不是数字', ()=>{
        const arr = [1,2,3,4,5,6,7];
        const k = 'abc';

        // @ts-ignore  使用@ts-ignore可以忽略ts检查类型报错
        const res = rotate2(arr, k);
        expect(res).toEqual(arr); // 断言
    })
})
```
在命令行中执行：   
npx jest src/01-algorithm/array-rotate.test.ts    
结果：
 <img :src="$withBase('/algorithms/Theory/array-rotate.test.png')" alt="array-rotate.test" />

## 性能对比
```typescript
// 性能测试
const arr1 = [];
for(let i = 0; i < 10 * 10000; i++){
    arr1.push(i);
}

console.time('rotate1');
rotate1(arr1, 9* 10000)
console.timeEnd('rotate1');
// rotate1: 1233 ms O(n^2)


const arr2 = [];
for(let i = 0; i < 10 * 10000; i++){
    arr2.push(i);
}

console.time('rotate2');
rotate2(arr2, 9* 10000);
console.timeEnd('rotate2');
// rotate2: 1 ms O(1)
```

时间复杂度
- 思路1 - 看代码时间复杂度是 `O(n)`，**但数组是有序结构 `unshift` 本身就是 `O(n)` 复杂度**，所以实际复杂度是 `O(n^2)`
- 思路2 - `O(1)`。`slice` 和 `concat` 不会修改原数组，而数组是有序结构，复杂度是 `O(1)` 。

空间复杂度
- 思路1 - `O(1)`
- 思路2 - `O(n)`
```typescript
export function rotate1(arr: number[], k: number): number[]{
    const length = arr.length;
    if(!k || length == 0) return arr; 
    const step = Math.abs(k % length); 

    // 时间复杂度O(n^2)。为什么时间复杂度是O(n^2)呢？因为unshift操作。
    // 空间复杂度O(1)
    for(let i = 0; i < step; i++){
        const n = arr.pop(); 

        if(n != null){
            arr.unshift(n); 
            // 数组是一个有序结构，unshift会非常慢！！！O(n)
            // 数组是一个连续的内存结构，数组的push是很快。
            // 数组的unshift、shift、splice都是很慢的，要慎重使用
            // 外层已经有一个循环，里面unshift又是n，所以时间复杂度是O(n)
        }
    }

    return arr;
}
```
【注意】如果你用到了 API （如数组 `unshift`）要结合数据结构去分析复杂度。**要看到代码的本质**。

## 答案

整体分析，选择“思路2”

## 划重点

- 考虑参数非法情况，代码鲁棒性
- 算法复杂度
    - 要看到全部的时间复杂度（包括 API）
    - 重时间，轻空间
- 数组是有序结构，`shift` `unshift` 等要慎用
- 单元测试

## 扩展 - 不要过度优化

其实还有一种思路，时间复杂度 `O(n)` ，空间复杂度 `O(1)` ，思路：
- k 前面的元素移动到 `i + (length - k)` 的位置
- k 后面的元素移动到 `i - k` 的位置

但不推荐这样的做法
- 前端重时间、轻空间，优先考虑时间复杂度，而非空间复杂度
- 代码是否易读，是否易沟通 —— 这个比性能更重要！人力成本永远是最贵的！！
