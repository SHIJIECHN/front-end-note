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

<img :src="$withBase('/algorithms/Theory/acwing-快速排序.png')" alt="acwing-快速排序" />

785. 快速排序
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
    // 先把两边的排好序，然后合并两边的有序数列
    merge_sort(q, l, mid);
    merge_sort(q, mid + 1, r);

    // 使用双指针合并有序数列
    let k = 0, i = l, j = mid + 1;
    while( i <= mid && j <= r){ // 当两边都没有到头的时候
        if(q[i] <= q[j]){ // 如果q[i]小，拷贝q[i]，并自增 i++，k++
            temp[k++] = q[i++];
        }else { // 如果q[j]小，拷贝q[j]，并自增 j++，k++
            temp[k++] = q[j++];
        }
    }
    // 如果还有剩余，接着copy
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

习题：
- 787. 归并排序
- 788. 逆序对的数量


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

/**
 * q: 数组
 * n: 数组长度
 * x: 目标值
 */
function bsearch(q, n, x){
    let l = 0, r = n -1;
    let left = 0, right = n -1;
    while(l < r){
        let mid = l + r >>1;
        if(q[mid] >= x) r = mid;
        else l = mid+1;
    }
    
    left = l;
    if(q[l] !== x){
        left = right = -1;
    }else {
        let l = 0, r = n-1;
        while(l < r){
            let mid = l + r + 1 >> 1;
            if(q[mid] <= x) l = mid;
            else r = mid -1;
        }
        right = l;
    }
    return [left, right]
}

let  arr = [1,2,2,3,3,4];
let target = 3;
let res = bsearch(arr, target);
console.log(res); // [3, 4]
```

习题：789. 数的范围


### 2.2 浮点数二分

790. 数的三次方根
```js
function n3(x){
    let l = 0, r = x; // 0~x
    while( r -l > 1e-8){ // 精度
        let mid = l + r >> 1;
        if(mid * mid * mid >= x) r = mid; // 如果mid的立方大于x，说明mid太大了，r=mid
        else l = mid;
    }
    
    return l.toFixd(6); // 保留6位小数
}
```

## 高精度

### 3.1 高精度加法

791. 高精度加法
```js
function highPrecisionSum(aArr, bArr){
    let result = [];
    let len = Math.max(aArr.length, bArr.length); // 取最大长度
    let t = 0;
    for(let i = 0;  i < len; i++){
        if(i < aArr.length) t += parseInt(aArr[i]); // 如果i小于aArr的长度，t加上aArr[i]的值
        if(i < bArr.length) t += parseInt(bArr[i]); // 如果i小于bArr的长度，t加上bArr[i]的值
        result.push(t % 10); // t = 12, result = [2],t如果大于10，取余数
        t = Math.floor(t / 10); // t = 1
    }
    if(t) result.push(t); //如果t不为0，将t加入result
    return result;
}

let a = '12';
let b = '34';
let aArr = a.split('').reverse(); // aArr = ['2', '1'] ，将字符串转换成数组，再反转。个位存在数组的第一个元素
let bArr = b.split('').reverse();

let cArr = highPrecisionSum(aArr, bArr);
console.log(cArr); // [6, 4]
let c = cArr.reverse().join('');
console.log(c); // 46
```

### 3.1 高精度减法

```js
function highPrecisionSub(aArr, bArr){
    let result = [];
    let t = 0;
    for(let i = 0;  i < aArr.length; i++){ // 输入时保证了aArr的长度大于等于bArr的长度
        t = aArr[i] - t; 
        if(i < bArr.length) t -= parseInt(bArr[i]); // 如果i小于bArr的长度,bArr没有越界。t减去bArr[i]的值
        result.push((t + 10) % 10); //合并了两种情况：1. t如果小于0，t加10；2. t如果大于10，就是t
        if(t < 0) t = 1; //如果t小于0，t=1
        else t = 0; //否则t为0
    }
    // 123-120=003，去掉高位的0
    while(result.length > 1 && result[result.length - 1] == 0) result.pop(); // 去掉高位的0
    return result;
}

// 判断是否有 A >= B 
function cmp(aArr, bArr){
    if(aArr.length != bArr.length) return aArr.length > bArr.length; //如果位数不相等，则返回位数比较的结果
    for(let i = aArr.length - 1; i >= 0; i--){
        if(aArr[i] != bArr[i]) return aArr[i] > bArr[i]; // 从高位开始比较，找到第一个aArr[i]不等于bArr[i]的位置，返回高位比较结果
    }
    return true; // 如果所有位数都相等，则返回true
}

let a = '12';
let b = '34';
let aArr = a.split('').reverse(); // aArr = ['2', '1'] ，将字符串转换成数组，再反转。个位存在数组的第一个元素
let bArr = b.split('').reverse();

let cArr = [];
let c = '';
if(cmp(aArr, bArr)){ // 比较aArr和bArr的大小
    cArr = highPrecisionSub(aArr, bArr);
    c = cArr.reverse().join('');
}else {
    cArr = highPrecisionSub(bArr, aArr);
    c = '-'+ cArr.reverse().join('');
}
console.log(cArr);
console.log(c); 
```