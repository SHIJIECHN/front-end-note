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

### 1.1 快速排序 O(logn)

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

习题：786. 第k个数


### 1.2 归并排序 O(nlogn)

主要思想：分治法
1. 确定分界点：mid = (l+r)/2。以中心掉为界，将数组分为两部分（left, right）。
2. 递归排序：left，right
2. 归并：合二为一（难点）

归并方法：
1. 声明一个临时数组temp[]，用于存放合并后的数组
2. 两个指针i, j，分别指向left, right的起始位置
3. 比较left[i]和right[j]的大小，将较小的数放入temp[]中
4. 重复3，直到i或j到达边界
5. 将剩余的元素放入temp[]中

```js
let temp = [];
function merge_sort(q, l,r){
    if(l >= r) return;
    let mid = l + r >> 1; // 中点
    merge_sort(q, l, mid);
    merge_sort(q, mid + 1, r);

    let k = 0, i = l, j = mid + 1;
    while( i <= mid && j <= r){
        if(q[i] <= q[j]){
            temp[k++] = q[i++];
        }else {
            temp[k++] = q[j++];
        }
    }

    while(i <= mid) temp[k++] = q[i++];
    while(j <= r) temp[k++] = q[j++];

    for(i = l, j = 0; i <= r; i++, j++){
        q[i] = temp[j];
    }
}

let arr = [6, 3, 2, 1, 4, 7, 5]
merge_sort(arr, 0, arr.length - 1);
console.log(temp);
```


## 2. 二分

### 2.1 整数二分

1. 找中间值：mid = (l+r+1)/2，if(check(mid))
    - 为true时，答案在[mid, r]，更新方式就是 l = mid
    - 为false时，答案在[l, mid - 1]，更新方式就是 r = mid -1

 <img :src="$withBase('/algorithms/Theory/acwing-整数二分.png')" alt="acwing-整数二分" />

```js
/**
 * 1. 先写mid
 * 2. 再写check函数，确定如何更新l和r，就是看l=mid还是r=mid，l=mid的话mid计算就是要+1，r=mid的话mid计算不+1
 */
// 区间[l, r]被划分为[l, mid]和[mid+1, r]时使用
function bsearch_1(l, r){
    while( l < r){
        let mid = l + r >>1;
        if(check(mid)) r = mid; // check()判断mid是否满足性质
        else l = mid + 1;
    }
    return l;
}

// 区间[l, r]被划分为[l, mid-1]和[mid, r]时使用
function bsearch_2(l, r){
    while(l < r){
        let mid = l + r + 1 >> 1;
        if(check(mid)) l = mid;
        else r = mid - 1;
    }
    return l;
}


function bsearch(q, x){
    let left = right = 0;
    let l = 0, r = q.length -1;
    while( l < r){
        let mid = l + r >> 1
        if(q[mid] >= x) r = mid;
        else l = mid + 1;
    }
    left = l = r;
    if(q[l] !==x){
        left = right = -1; 
    }else{
        let l = 0, r = q.length -1;
        while(l < r){
            let mid = l + r + 1 >>1;
            if(q[mid] <= x) l = mid;
            else r = mid - 1
        }
       right = l = r;
    }
    return [left, right];
}

let  arr = [1,2,2,3,3,4];
let target = 3;
let res = bsearch(arr, target);
console.log(res); // [3, 4]
```


### 2.2 浮点数二分