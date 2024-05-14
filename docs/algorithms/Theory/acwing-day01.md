---
autoGroup-2: ACWing算法
sidebarDepth: 3
title: 1. 基础算法
---

## 课程链接
https://www.acwing.com/file_system/file/content/whole/index/content/4789/

1. 理解主要思想（课上）
2. 模板背过。如一个快速排序的题目，能够快速默写出来，调试通过即可。（课后）
3. 课后习题。快速默写模板，每个题目3-5遍。


## 1. 排序

### 1.1 快速排序

主要思想：分治法
1. 确定分界点：左边界q[l], 中间q[(l+r)/2], 右边界q[r]
2. 调整区间：以x为基准，将小于等于x的数放在左边，大于大等于x的数放在右边。（重点）
3. 递归处理左右两边

调整区间方法：
1. 声明两个数组：a[], b[]
2. 遍历区间q[l~r]，将小于等于x的数放在a[]，大于x的数放在b[]
时间复杂度O(n)

优美方法：
1. 两个指针i, j，左侧i指向l，右侧j指向r
2. 移动指针i，判断当前q[i]是否小于等于x，如果是，i++ 直到找到一个大于x的数, q[i] > x, i停止移动；开始移动j，判断当前q[j]是否大于x，如果是，j-- 直到找到一个小于等于x的数, q[j] <= x, j停止移动；交换q[i], q[j]，继续移动i, j；直到i >= j


787. 归并排序
```js
function quick_sort(q, l, r){
    if(l >= r) return; // 如果没有元素或者只有一个元素，就不用排序了
    let x = q[l], i = l - 1, j = r + 1;
    while(i < j){ // 每次移动交换，算一次迭代
        do i++; while(q[i]< x); // 从左往右找到第一个大于x的元素
        do j--; while(q[j]> x); // 从右往左找到第一个小于x的元素
        if(i < j) { // 交换q[i]和q[j]
            let temp = q[i];
            q[i] = q[j];
            q[j] = temp;
        }
    }
    quick_sort(q, l, j);
    quick_sort(q, j+1, r);
}

let buf = '';
process.stdin.on('readable', c => {
    let chunk = process.stdin.read();
    if (chunk) buf += chunk.toString();
});
let getInputArgs = line => {
    return line.split(' ').filter(s => s !== '').map(x => parseInt(x));
}
process.stdin.on('end', () => {
    buf.split('\n').forEach((line, index) => {
        if(index === 1){
            let arr = getInputArgs(line);
            quick_sort(arr, 0, arr.length - 1);
            console.log(arr.join(' '));
        }
    })
})
```
- do...while循环：先执行一次循环体（do部分），然后检查循环条件（while部分）。如果条件为真，循环继续执行，直到条件为假。
- do...while(q[i] < x): 循环会一直执行，直到找一个大于或等于x的元素，在每次循环中，它都会增加i的值。


### 1.2 归并排序


## 2. 二分

### 2.1 整数二分


### 2.2 浮点数二分