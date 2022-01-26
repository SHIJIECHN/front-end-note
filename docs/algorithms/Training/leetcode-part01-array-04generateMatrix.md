---
autoGroup-1: Leetcode
sidebarDepth: 3
title: 螺旋矩阵
---

## 螺旋矩阵
[力扣题目链接](https://leetcode-cn.com/problems/spiral-matrix-ii/)

```js
var generateMatrix = function(n) {
  let loop = Math.floor(n / 2); // 每个圈循环几次，例如n为奇数3，那么loop = 1 只是循环一圈，矩阵中间的值需要单独处理
  let res = new Array(n).fill(0).map(()=>new Array(n).fill(0));
  let startX = 0, startY = 0;  // 定义每循环一个圈的起始位置
  let count = 1; // 用来给矩阵中每一个空格赋值
  let offset = 1; // 每一圈循环，需要控制每一条边遍历的长度

  while(loop--){
    let row = startX, col = startY;
    // 上行 从左往右(左闭右开)
    for(; col < startX + n -offset; col++){
      res[row][col] = count;
      count++;
    }

    // 右行 从上往下(左闭右开)
    for(; row < startY + n - offset; row++){
      res[row][col] = count;
      count++;
    }

    // 下行 从右往左(左闭右开)
    for(; col > startX; col--){
      res[row][col] = count;
      count++;
    }

    // 左行 从下往上(左闭右开)
    for(;row > startY; row--){
      res[row][col] = count;
      count++
    }

    // 第二圈开始的时候，起始位置要各自加1
    startX++;
    startY++;
    // offset 控制每一圈里每一条边遍历的长度
    offset += 2;
  }
  
  // 如果n为奇数的话，需要单独给矩阵最中间的位置赋值
  if(n % 2 === 1){
    res[Math.floor(n/2)][Math.floor(n/2)] = n * n;
  }
  console.log(res);
  return res;

};
console.log(generateMatrix(4))
```

## 练习
1. 螺旋矩阵
[力扣题目链接](https://leetcode-cn.com/problems/spiral-matrix/)
```js
var spiralOrder = function(matrix) {
    let left = 0,
        bottom = matrix.length - 1,
        top = 0,
        right = matrix[0].length - 1;
    let res = []
    while (left <= right && top <= bottom) {
        for (let i = left; i <= right; i++) {
            res.push(matrix[top][i]);
        }

        for (let i = top + 1; i <= bottom; i++) {
            res.push(matrix[i][right])
        }

        if (left < right && top < bottom) {
            for (let i = right - 1; i > left; i--) {
                res.push(matrix[bottom][i])
            }

            for (let i = bottom; i > top; i--) {
                res.push(matrix[i][left]);
            }
        }
        left++;
        right--;
        top++;
        bottom--;
    }
    return res;

};
```
注意边界条件：
> [top, left] -> [top, right];
[top + 1, right] -> [bottom, right];
[bottom, right) -> [bottom, left)
[bottom, left] -> (top, left]

