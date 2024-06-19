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
左神版：
```js
let arr = [6, 3, 2, 1, 4, 7, 5];
merge_sort(0, arr.length - 1);
console.log(arr);

/**
 * 假设l...r一共n个数
 * T(n) = 2T(n/2) + O(n)
 * a = 2, b = 2, c = 1
 * 时间复杂度O(n * logn)
 */
function merge_sort(l, r){
    if(l == r) return;
    let mid = l + r >> 1;
    merge_sort(l, mid);
    merge_sort(mid + 1, r);
    merge(l, mid, r);
}

// l...r 一共有n个数，时间复杂度O(n)
function merge(l, mid, r){
    let i = l, a = l, b = mid +1;
    while(a<= mid && b <= r){ // 左右范围都没有靠近边界
        help[i++] = arr[a] <= arr[b] ? arr[a++] : arr[b++]; // 小的先放进help
    }

    // 左侧指针、右侧指针，必有一个越界、另一个不越界
    while(a <= mid) help[i++] = arr[a++];
    while(b <= r) help[i++] = arr[b++];

    for(let k = l; k <= r; k++) arr[k] = help[k]; // help数组的值，复制到arr数组
}

```
非递归版：
```js
let MAX = 501;
let help = new Array(MAX).fill(0);

let arr = [6, 3, 2, 1, 4, 7, 5];
merge_sort();
console.log(arr);

// 时间复杂度O(nlogn)
function merge_sort(){
    let l, m, r, n = arr.length;
    for(let step = 1; step < n; step *= 2){ // 或者step <<= 1
        // 内部分组merge。时间复杂度O(n)
        l = 0; 
        while( l < n){
            m = l + step -1;
            if(m + 1 >= n){
                // 已经没有右侧了
                break;
            }
            // 有右侧，求右侧的右边界
            r = Math.min(l + 2 * step - 1, n - 1); // 右侧右边界
            merge(l, m, r);// l...m, m+1...r
            l = r + 1; // 下一组
        }
    }
}

// l...r 一共有n个数，时间复杂度O(n)
function merge(l, mid, r){
    let i = l, a = l, b = mid +1;
    while(a<= mid && b <= r){ // 左右范围都没有靠近边界
        help[i++] = arr[a] <= arr[b] ? arr[a++] : arr[b++]; // 小的先放进help
    }

    // 左侧指针、右侧指针，必有一个越界、另一个不越界
    while(a <= mid) help[i++] = arr[a++];
    while(b <= r) help[i++] = arr[b++];

    for(let k = l; k <= r; k++) arr[k] = help[k]; // help数组的值，复制到arr数组
}
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

### 3.2 高精度减法

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

### 3.3 高精度乘法

```js
// Description: 高精度乘法
// C = A * b
function hightPrecisionMulti(A, b){
    let C = [];
    let t = 0;
    for(let i = 0; i < A.length; i++){
        t += parseInt(A[i]) * b; // 2 * 12 = 24
        C.push(t % 10); // 4
        t = Math.floor(t / 10); // 2
    }
    while(t){ // 如果t有值
        C.push(t % 10);
        t = Math.floor(t / 10);
    }
    return C;
}

let a = '123';
let b = 12;
let A = a.split('').reverse();
let C = hightPrecisionMulti(A, b);
let result = C.reverse().join('');
console.log(result);
```

### 3.4 高精度除法

```js
// Description: 高精度除法
// C = A / b，商为C，余数为r
function div(A, b){
    let C = []; // C0是最低位
    let r = 0;
    for(let i = A.length -1; i >=0; i--){
        r = r * 10 + parseInt(A[i]);
        C.push(Math.floor(r / b)); // 商
        r %= b; // 余数
    }
    C.reverse(); // 反转
    while(C.length > 1 && C[C.length - 1] == 0) C.pop(); // 去掉高位的0
    return C;
}

let a = '10000';
let b = 9;
let A = a.split('').reverse();
let cDiv = div(A, b, r);
let res = cDiv.reverse().join('');
console.log(res);
```

## 4. 前缀和、差分

### 4.1 前缀和
一维前缀和：定义一个数组[a1, a2, a3,..., an]（下标从1开始, 下标0补充0），前缀和数组是一个新的数组，数组的第i个元素是原数组的前i个元素的和。
si = a1 + a2 + ... + ai。si是前i个元素的和。s0 = 0

问题1：如何求si
问题2：如何求区间[l, r]的和

795. 前缀和
```js
function runningSum(a, l, r){
    let n = a.length; // 数组长度
    a.unshift(0); // 为了方便计算，数组的下标从1开始[a1, a2, ..., an]，下标0补充0
    let s = new Array(n).fill(0); // s[i]表示前i个元素的和 
    for(let i = 1; i <= len; i++){ // 计算前i个元素的和
        s[i] = s[i-1] + a[i]; // s[i] 的和等于前i-1的和加上a[i]
    }
    return s[r] - s[l-1]; // 返回区间和，注意：左左侧下标需要减去1
}

let a = [2,1,3,6,4];
let l = 1;
let r = 5;
let result = runningSum(a, l, r);
console.log(result);// 16
```

二维前缀和：Sij表示左上角为(1,1)，右下角为(i,j)的矩形内所有元素的和。求解Sij的方法是：
Sij = S[i-1][j] + S[i][j-1] - S[i-1][j-1] + a[i][j]。 求解区间[(x1, y1), (x2, y2)]的和：S[x2][y2] - S[x1-1][y2] - S[x2][y1-1] + S[x1-1][y1-1]。

实际过程中往往补充第0行、第0列来减少条件判断。

 <img :src="$withBase('/algorithms/Theory/acwing-前缀和.png')" alt="acwing-前缀和" />

 <img :src="$withBase('/algorithms/Theory/acwing-前缀部分和.png')" alt="acwing-前缀部分和" />

796. 二维前缀和
```js
function runningSum_2(arr, xy){
    let n = arr.length;
    let m = arr[0].length;
    let s = new Array(n+1).fill(0).map(()=> new Array(m+1).fill(0));
    for(let i = 1; i <= n; i++){
        for(let j = 1; j <= m; j++){
            s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1]+arr[i-1][j-1]; // 求前缀和
        }
    }
    let result = [];
    let q = 3;
    for(let i = 0; i < q; i++){
        let [x1, y1, x2, y2] = xy[i];
        result.push(s[x2][y2] - s[x2][y1-1] - s[x1-1][y2] + s[x1-1][y1-1]); // 求区间和
    }
    return result;
}

let arr = [
    [1,7,2,4],
    [3,6,2,6],
    [2,1,2,3],
]

// x y 坐标集合
let xy = [
    [1,1,2,3],
    [2,1,3,3],
    [1,2,2,4],
]

let result = runningSum_2(arr, xy);
console.log(result);// [ 21, 16, 27 ]
```

还可以有另一种形式：将矩阵 arr 转换为前缀和矩阵 s 的过程如下：
```js
let n = arr.length; // row
let m = arr[0].length; // col
let s = new Array(n + 1).fill(0).map(()=> new Array(m+1).fill(0));
// 将a拷贝到s中，将s第一行和第一列为0
for(let a = 1, c = 0; c < n; a++, c++){
    for(let b = 1, d = 0; d < m; b++, d++){
        s[a][b] = arr[c][d]
    }
}
```
s的前缀和计算可以下成如下形式：
```js
s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1] + s[i][j];
```
整体写法如下：
```js
function runningSum_2(matrix, xy){
    let n = matrix.length; // row
    let m = matrix[0].length; // col
    let s = new Array(n + 1).fill(0).map(()=> new Array(m+1).fill(0));
    // 将a拷贝到s中，将s第一行和第一列为0
    for(let a = 1, c = 0; c < n; a++, c++){
        for(let b = 1, d = 0; d < m; b++, d++){
            s[a][b] = matrix[c][d];// 将matrix拷贝到s中
        }
    }
    
    for(let i = 1; i <= n; i++){
        for(let j = 1; j <= m; j++){
            s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1] + s[i][j];
        }
    }

    for(let i = 0; i < xy.length; i++){
        let [x1, y1, x2, y2] = xy[i];
        console.log(s[x2][y2] - s[x2][y1-1]- s[x1-1][y2] + s[x1-1][y1-1]);
    }
}
```

### 4.2 差分

差分数组：差分数组d[i]第i个数即为原数组的第i个数和第i-1个数的差值。即：d[i] = a[i] -a[i -1]，此时也可以表示为a1 = b1, a2 = b1+b2, a3 = b1+b2+b3, ..., an = b1+b2+...+bn。

差分数组的性质：对于区间[l, r]的所有数加上c，只需对差分数组d[l]加上c，对差分数组d[r+1]减去c。对于区间[l, r]的所有数加上c，只需对差分数组d[l]加上c，对差分数组d[r+1]减去c。

 <img :src="$withBase('/algorithms/Theory/acwing-差分.png')" alt="acwing-差分" />

370. 区间加法
```js
function intert(arr, operation){
    // 差分
    let n = arr.length;
    let b = new Array(n).fill(0);
    // 差分数组
    for(let i = 0; i < n; i++){
        if(i ==0) b[i] = arr[i];
        else b[i] = arr[i] - arr[i-1];
    }

    for(let i = 0; i < operation.length; i++){
        let [l,r,c] = operation[i];
        b[l - 1] += c; // 差分数组的第l个元素加上c，注意这里的下标时从0开始的
        if(r < n) b[r] -= c;
    }
    
    // 前缀和
    let result = new Array(n).fill(0);
    result[0] = b[0];
    for(let i = 1; i < n; i++){
        result[i] = result[i-1] + b[i];
    }
    return result;
}

let arr = [1,2,2,1,2,1];
let operation = [[1,3,1],[3,5,1],[1,6,1]]; //[3, 5, 1]
console.log(intert(arr, operation)); // [ 3, 4, 5, 3, 4, 2 ]
```

二维差分：在二维数组中，如果经理如下的过程：
1. 批量的做如下的操作，每个操作都有独立的a, b, c, d, v，add(a, b, c, d, v)：左上角(a,b)到右下角(c,d)的矩形区域内的所有元素加上v。怎么快速处理？
2. 操作完后，如何正确得到二维数组中每个位置的值？

二维差分的工作：add的时候快速处理，最后build得到每个位置的值，修改操作必须集中在一起，不能边修改边查询。
1） add方法的实现比较巧妙
2）build方法的实现，和处理前缀和类似
3）真实数据用一圈0包裹起来，可以减少很多边界讨论

 <img :src="$withBase('/algorithms/Theory/acwing-二维差分.png')" alt="acwing-二维差分" />

```js
function insert_2(arr, operation){
    let n = arr.length;
    let m = arr[0].length;
    let b = new Array(n+2).fill(0).map(()=> new Array(m+2).fill(0)); // 差分数组

    // 计算得到差分数组 b, 也就是在原数组上包裹一圈0
    for(let i = 1; i <= n; i++){
        for(let j = 1; j <= m; j++){
            diff(i, j, i, j, arr[i-1][j-1]);
        }
    }

    // 差分数组需要执行的操作
    function diff(x1, y1, x2, y2, c){
        b[x1][y1] += c;
        b[x2+1][y1] -= c;
        b[x1][y2+1] -= c;
        b[x2+1][y2+1] += c;
    }

    // 执行操作
    for(let i = 0; i < operation.length; i++){
        let [x1, y1, x2, y2, c] = operation[i];
        diff(x1, y1, x2, y2, c); 
    }

    // 差分数组的前缀和计算
    for(let i = 1; i <= n; i++){
        for(let j = 1; j <= m; j++){
            b[i][j] = b[i-1][j] + b[i][j-1] + b[i][j] - b[i-1][j-1];
        }
    }

    let result = new Array(n).fill(0).map(()=> new Array(m).fill(0));
    for(let i = 1; i <= n; i++){
        for(let j = 1; j <= m; j++){
            result[i-1][j-1] = b[i][j];
        }
    }
    return result;
}

let arr  = [
    [1,2,2,1],
    [3,2,2,1],
    [1,1,1,1]
]

let operation = [
    [1,1,2,2,1],
    [1,3,2,3,2],
    [3,1,3,4,1]
]
console.log(insert_2(arr, operation)); // [ [ 2, 3, 4, 1 ], [ 4, 3, 4, 1 ], [ 2, 2, 2, 2 ] ]
```

解法二：

```js
class Diff{
    constructor(options){
        this.arr = options.arr;
        this.n = this.arr.length;
        this.m = this.arr[0].length; 
        this.diff = new Array(this.n+2).fill(0).map(()=>new Array(this.m+2).fill(0)); // 原数组包裹一圈0
    }

    // 将arr数组读入diff数组，后面的所有操作都在diff数组上进行
    read(){
        for(let i = 1; i <=this.n; i++){
            for(let j = 1; j <= this.m; j++){
                this.add(i,j,i,j,this.arr[i-1][j-1])
            }
        }
    }
    
    // 求diff矩阵的前缀和
    build(){
        for(let i = 1; i<= this.n; i++){
            for(let j = 1; j<= this.m; j++){
                this.diff[i][j] = this.diff[i-1][j] + this.diff[i][j-1] - this.diff[i-1][j-1] + this.diff[i][j];
            }
        }
    }

    // 执行操作
    add(a, b, c, d, v){
        this.diff[a][b] += v;
        this.diff[a][d+1] -= v;
        this.diff[c+1][b] -= v;
        this.diff[c+1][d+1] += v;
    }
}

let arr  = [
    [1,2,2,1],
    [3,2,2,1],
    [1,1,1,1]
]

let operation = [
    [1,1,2,2,1],
    [1,3,2,3,2],
    [3,1,3,4,1]
]

let diff = new Diff({arr});
diff.read(); 
// 在差分数组上执行操作
for(let i = 0; i < operation.length; i++){
    diff.add(...operation[i]);
}
diff.build();
let result = diff.diff;
for(let i = 1; i <= arr.length; i++){
    console.log(result[i].slice(1, arr[0].length+1));
}
```

## 5. 双指针算法

核心思想：将暴力做法O(n^2)优化到O(n)。
```js
for(let i = 0; i < n; i++){
    for(let j = 0; j < n; j++){
        // 时间复杂度O(n^2)
    }
}
```

双指针模板：
```js
for(let i = 0, j = 0; i < n; i++){
    while(j < n && check(i, j)) j++;
    // 具体逻辑
}
```

习题：
```js
/**
 * 给定字符串 str = 'abc def ghi';输出：
 * abc
 * def
 * ghi
 */

function word(str){
    let n = str.length;
    for(let i = 0; i< n; i++){
        let  j = i;
        while(j < n && str[j] != ' ') j++;

        // 具体逻辑
        console.log(str.slice(i,j))
        i = j;
    }
}
let str = 'abc def ghi';
word(str)

```

799. 最长连续不重复子序列
1. 遍历数组a中的每一个元素a[i], 对于每一个i，找到j使得双指针[j, i]维护的是以a[i]结尾的最长连续不重复子序列，长度为i - j + 1, 将这一长度与r的较大者更新给max
2. 对于每一个i，如何确定j的位置：由于[j, i - 1]是前一步得到的最长连续不重复子序列，所以如果[j, i]中有重复元素，一定是a[i]，因此右移j直到a[i]不重复为止（由于[j, i - 1]已经是前一步的最优解，此时j只可能右移以剔除重复元素a[i]，不可能左移增加元素，因此，j具有“单调性”
3. 用数组s记录子序列a[j ~ i]中各元素出现次数，遍历过程中对于每一个i有四步操作：
    - 将a[i]出现次数s[a[i]]加1 
    - 若a[i]重复则右移j（s[a[j]]要减1）
    - 确定j及更新当前长度i - j + 1给 max。
```js
function maxLengthSub(arr){
    let max = 0;
    let n = arr.length;
    let a = arr;;
    let s = new Array(10).fill(0); // j~i区间每个数出现的次数
    for(let i  = 0, j=0; i < n; i++){
        s[a[i]]++; // 每次i移动一格

        while(s[a[i]] > 1){
            s[a[j]]--;
            j++;
        }
        max = Math.max(max, i - j + 1);
    }
    return max;
}

let str = [1,2,2,3,5];
console.log(maxLengthSub(str))
```

## 6. 位运算
n的二进制表示中第k位是几？
1. 先把第k位移到最后一位 n >> k
2. 看个位是几L n & 1

lowbit(x): 返回x的最后一位1. 例如：x = 1010, lowbit(x) = 10; x = 101000, lowbit(x) = 1000。

实际上实现的是：x & -x，-x是x的补码，-x = ~x + 1，~x是x的取反，+1是x的补码。x & -x 等于 x & （~x + 1）。

为什么能够得到最后一个1呢？
x =    1010...1000..0
~x =   0101...0111..1
~x+1 = 0101...1000..0
x & (~x + 1) = 0000...1000..0

应用：统计一个数的二进制表示中1的个数。
801. 二进制中1的个数
```js
function fn7(a){
    let n = a.length;
    for(let i =0; i< n; i++){
        let x = a[i];
        let res = 0;
        // 统计1的个数：当x不为0时
        while(x){
            x -= lowbit(x); // 每次减去x的最后一位1
            res++;
        }
        console.log(res)
    }

}

function lowbit(x){
    return x & (~x + 1);
}
let arr = [25]
fn7(arr)
```

## 7. 离散化
离散化：将一个区间的数映射到一个连续的区间上。例如：[3, 5, 7, 9] 映射到 [1, 2, 3, 4]。
思考：如何将一个区间的数映射到一个连续的区间上？
1. 区间是有序的，但可能有重复元素，需要去重 --> sort、filter和indexOf
```js
let b = arr.slice().sort((a, b) => a - b).filter((v, i, a) => a.indexOf(v) === i); // 去重
```
2. 如何算出x离散化后的值--->二分查找
```js
function find(x){
    let l = 0, r = b.length - 1;
    while(l < r){
        let mid = l + r >> 1;
        if(b[mid] >= x) r = mid;
        else l = mid + 1;
    }
    return l + 1; // 映射到1，2，....，n
}
```

802. 离散化

```js
function fn8(n, m, arrXC, arrMN){
    let N = 300010;

    let add = []; // 所有添加的数据对
    let query = []; // 所有查询的数据对
    let alls = []; // 所有下标（数据下标 + query下标）

    let a = new Array(N).fill(0); // 将alls中的真实数据，复制到a对应的位置
    let s = new Array(N).fill(0); // a的前缀和

    for(let i = 0; i < n; i++){
        add.push([arrXC[i][0], arrXC[i][1]]);
        alls.push(arrXC[i][0]); // 下标
    }
    
    for(let i = 0; i < m; i++){
        query.push([arrMN[i][0], arrMN[i][1]]);
        alls.push(arrMN[i][0]);
        alls.push(arrMN[i][1]);
    }

    // 排序和去重
    alls = [...new Set(alls.sort((a, b) => a - b))];

    // 加
    for(let data of add){
        const [idx, value] = data;
        const index = find(idx); // 二分查找，找到映射后的下标
        a[index] += value;
    }

    // 求前缀和 1....n
    for(let i = 1; i <= alls.length; i++) s[i] = s[i-1] + a[i];

    // 查询
    for(let queryData of query){
        const [left, right] = queryData;
        let l = find(left)
        let r = find(right)
        console.log(s[r] - s[l-1]);
    }

    // 二分查找，根据实际的x值找到映射后的值，也就是下标 + 1
    function find(x){
        let l = 0, r = alls.length - 1;
        while(l < r){
            const mid = l + r >> 1;
            if(alls[mid] >= x) r = mid;
            else l = mid + 1;
        }
        return r + 1;
    }
}

let n = 3;
let m = 3;
let arrXC = [
    [1,2],
    [3,6],
    [7,5]
];
let arrMN = [
    [1,3],
    [4,6],
    [7,8]
];
fn8(n, m, arrXC, arrMN); // 8 0 5
```

## 8. 区间合并
区间合并：给定n个区间，合并所有有交集的区间。

1. 按区间左端点排序
2. 依次合并区间，如果当前区间的左端点大于上一个区间的右端点，则合并区间，否则不合并。

803. 区间合并
```js
let arr = [
    [1,2],
    [2,4],
    [5,6],
    [7,8],
    [7,9]
];
let res = fn9(arr);
console.log(res);

function fn9(arr){
    let result = [];
    // 排序
    arr.sort((a, b) => a[0] - b[0]); // 数组首位进行排序
    let cache = arr[0]; // 排序后的第一个数组
    for(let i = 1; i < arr.length; i++){
        let cur = arr[i]; // 从第二个开始去cur
        if(cur[0] > cache[1]){ 
            // 当前数组的左边界大于上一个数组的右边界, 不重合，不能合并
            result.push(cache);
            cache = cur;
        }else{
            // 当前数组的左边界小于等于上一个数组的右边界
            cache[1] = Math.max(cache[1], cur[1]); // 左端不变，右端取大的
        }
    }
    result.push(cache); // 最后一个数组
    return result;
}
```
