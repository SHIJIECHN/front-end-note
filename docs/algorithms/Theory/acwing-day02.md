---
autoGroup-2: ACWing算法
sidebarDepth: 3
title: 2. 数据结构
---

## 1. 链表与邻接表

用数组来模拟链表：
1. 单链表：邻接表。应用：图和数的存储
2. 双链表：双向链表。应用：优化某些题


### 1.1 单链表

```js

const N = 100010;
let head; // 头结点的下标
let e = new Array(N).fill(0); // e[i]节点i的值
let ne = new Array(N).fill(0);// ne[i]节点i的next指针是多少
let idx; // 当前用到了哪个点

// 初始化
function init(){
    head = -1;
    idx = 0;
}

// 在头结点后插入一个节点
function add_to_head(x){
    e[idx] = x; // 当前节点的值是x
    ne[idx] = head;// 当前节点的next指针指向head
    head = idx; // head指向当前节点
    idx++; // 当前节点的下标+1
}

// 在下标k后插入一个节点
function add(k, x){
    e[idx] = x; // 当前节点的值是x
    ne[idx] = ne[k]; // 当前节点的next指针指向k的next指针
    ne[k] = idx; // k的next指针指向当前节点
    idx++; // 当前节点的下标+1
}

// 删除下标k后的节点
function remove(k){
    ne[k] = ne[ne[k]]// k的next指针指向k的next的next.ne[k]等于k的下一个节点的下标，所以ne[ne[k]]等于k的下一个节点的下一个节点的下标
}
```

### 1.2 双链表

```js
const N = 100010;
let e = new Array(N).fill(0); // e[i]节点i的值
let l = new Array(N).fill(0); // l[i]节点i的左指针
let r = new Array(N).fill(0); // r[i]节点i的右指针
let idx; // 当前用到了哪个点

// 初始化
function init(){
    // 0表示左端点，1表示右端点
    r[0] = 1;
    l[1] = 0;
    idx = 2; // 从2开始分配,0和1已经用了
}

// 在下标k的右边插入一个数x
function add(k, x){
    e[idx] = x; // 当前节点的值是x
    r[idx] = r[k]; // 当前节点的右指针指向k的右指针
    l[idx] = k; // 当前节点的左指针指向k
    l[r[k]] = idx; // k的右指针的左指针指向当前节点。注意：这一步要在r[idx] = r[k]之前，否则会出错
    r[k] = idx; // k的右指针指向当前节点
}

// 在下标k的左边插入一个数x，可以看作是在l[k]的右边插入一个数x，直接调用上面的add函数即可，即add(l[k], x)

// 删除下标k的节点
function remove(k){
    r[l[k]] = r[k]; // k的左指针的右指针指向k的右指针
    l[r[k]]  = l[k]; // k的右指针的左指针指向k的左指针
}
```

## 2. 栈与队列

### 2.1 栈

```js
const N= 100010;
let stk = new Array(N).fill(0);
let tt = 0; // 栈顶指针

// 插入
function push(x){
    stk[tt++] = x;
}

// 弹出
function pop(){
    return stk[--tt];
}

// 获取栈顶元素
function top(){
    return stk[tt - 1];
}

// 判断栈是否为空
function empty(){
    return tt == 0;
}
```

当加入的数的长度是固定N时，队列的范围是[L, R)，当L == R时，队列为空。当L < R时，队列有值。R == N时，队列满了。
1）加入x，放在R位置, arr[R] = x，R++
2）弹出队头元素，arr[L]，L++

```js
let N = 100010;
let q = new Array(N).fill(0), hh, tt = -1;

// 插入一个数
function add(x){
    q[++tt] = x;
}

// 弹出一个数
function pop(){
    return q[hh++];
}

// 队头的值
function head(){
    return q[hh];
}

// 队尾的值
function tail(){
    return q[tt];
}

// 队列的大小
function size(){
    return tt - hh + 1;
}

// 判断是否为空
function isEmpty(){
    return hh <= tt;
}
```

- 最小栈
```js
 const N= 100010;
let stk = new Array(N).fill(0);
let tt = 0; // 栈顶指针
let minStk = new Array(N).fill(0); // 最小值栈

// 插入
function push(x){
    stk[tt] = x;
    if(empty() || x <= minStk[tt-1]){
        minStk[tt] = x;
    }else {
        minStk[tt] = minStk[tt-1];
    }
    tt++;
}

// 弹出
function pop(){
    tt--;
}

// 获取栈顶元素
function top(){
    return stk[tt - 1];
}

// 判断栈是否为空
function empty(){
    return tt === 0;
}

function getMin(){
    return minStk[tt - 1];
}


```

### 2.2 单调栈

单调栈最经典的用法是解决如下问题：
每个位置都求：
1）当前位置的 左侧比当前位置的数字小，且距离最近的位置 在哪
2）当前位置的 右侧比当前位置的数字小，且距离最近的位置 在哪

或者 每个位置都求：
1）当前位置的 左侧比当前位置的数字大，且距离最近的位置 在哪
2）当前位置的 右侧比当前位置的数字大，且距离最近的位置 在哪

保证stk中元素单调递增或单调递减

```js
function fn14(arr){
    let n = 1000010;
    let stk = new Array(n).fill(0);
    let tt = 0
    // 遍历
    for(let i = 0; i < arr.length; i++){
        let x = arr[i];
        while( tt && stk[tt] >= x){ // 栈不为空且栈顶元素大于等于当前元素
            tt--; // 栈顶元素出栈
        }
        if(tt){ // 栈不为空
            console.log(stk[tt], ' ');  
        }else{ // 栈为空
            console.log(-1, ' ');
        }
        stk[++tt] = x; // 当前元素入栈
    }
}

let arr = [2, 1, 2, 3, 4, 5, 6, 7, 8, 9];
fn14(arr); // -1 2 1 2 3 4 5 6 7 8
```

### 2.3 单调队列
滑动窗口的最大值和最小值。

队列保存的是元素的下标，而不是元素本身。
```js
function fn15(a){
    let N = 100010;
    let q = new Array(N).fill(0); // 保存的是下标
    let hh =0, tt = -1; // hh 队头 tt 队尾
    let k = 3; // 窗口大小
    for(let i =0; i < a.length;i++){
        // 判断队头是否滑出窗口
        if(hh <= tt && i - k + 1 > q[hh] ){ // hh<=tt 队列不为空 i-k+1>q[hh] 队头滑出窗口
            hh++;
        }
        while(hh <= tt && a[q[tt]] >= a[i]){ // 队尾元素大于等于当前元素
            tt--;
        }
        q[++tt] = i; // 当前元素入队
        if(i >= k - 1){
            console.log(a[q[hh]]); // 输出队头元素
        }
        
    }
}
let a = [1,3,-1,-3,5, 3, 6, 7];
console.log(fn15(a)); // [-1，-3，-3，-3，3，3]
```

Q: 解释hh <= tt && i - k + 1 > q[hh]的含义
- hh <= tt: 用来判断队列是否为空。hh为头指针，tt是尾指针。当hh > tt时，队列为空。
- i - k + 1 > q[hh]: 判断对头元素是否滑出了当前的滑动窗口。
    - i: 当前遍历到的元素的下标
    - k: 滑动窗口的大小
    - i - k + 1: 当前滑动窗口的左边界。如果窗口的大小为k，那么在下标为i的元素被处理时，窗口的左边界应该是 i - k + 1.
- q[hh]是队列头部元素的下标，即当前窗口中最左边的元素的下标。

## 3. KMP


