---
autoGroup-2: 专题
sidebarDepth: 3
title: 排序算法
---

## 工具函数
```javascript
const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1
}
const defaultCompare = (a, b) => {
  // 如果元素相同
  if (a === b) {
    return 0;
  }
  // 如果第一个元素小于第二个元素，它就返回-1，反之则返回 1
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}
```

## 冒泡排序
- 思路：比较所有相邻的两个项，如果第一个比第二个打，则交换它们。
- 时间复杂度O(n^2)
```javascript
function bubbleSort(array, compareFn = defaultCompare) {
  // 数组的长度
  const { length } = array;
  // 外循环从数组的第一位迭代到最后一位，控制数组中经过多少轮循环
  for (let i = 0; i < length; i++) {
    // 内循环从第一位迭代到倒数第二位。
    // j < length - 1 - i。内循环减去外循环中已跑过的轮数。避免内循环不必要的比较
    for (let j = 0; j < length - 1 - i; j++) {
      // 比较两项的值，第一个大于第二个，则交换两项的位置
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        // 交换两项的位置
        swap(array, j, j + 1)
      }
    }
  }
  return array;
}
```

## 选择排序
- 思路：找到数据结构中最小并将其放置在第一位，接着找到第二小的值并将其放在第二位。
- 时间复杂度O(n^2)
```javascript
function selectionSort(array, compareFn = defaultCompare) {
  const { length } = array;
  let indexMin;
  // 外循环迭代数组，并控制迭代次数
  for (let i = 0; i < length - 1; i++) {
    // 假设本迭代轮次的第一个值为数组最小值
    indexMin = i;
    // 从当前i的值开始至数组结束
    for (let j = i; j < length; j++) {
      // 比较是否位置j的值比当前最小值小，如果是，则改变最小值至新的最小值
      // 注意是 indexMin 的数值和 j 的数值比较
      if (compareFn(array[indexMin], array[j]) === Compare.BIGGER_THAN) {
        indexMin = j;
      }
    }
    // 如果该最小值和原最小值不同，则交换其值
    if (i !== indexMin) {
      swap(array, i, indexMin);
    }
  }
}
```

## 插入排序
- 思路：每次排一项，假定第一项已经排序了，接着，它和第二项进行比较，第二项是应该待在原位呢还是插到第一项之前呢？这样，头两项以正确排序，接着和第三项比较

```javascript
function insertionSort(array, compareFn = defaultCompare) {
  const { length } = array;
  let temp;
  // 迭代数组来给第i项找到正确的位置
  // 注意，算法从第二个位置（索引1）而不是0位置开始（我们认为第一项已经排序了）
  for (let i = 0; i < length; i++) {
    // 用i值初始化一个辅助变量j，并将值存储在一个临时变量中
    // 就是找到这个变量正确的插入位置
    let j = i;
    temp = array[i];

    // 只要j比0大，并且数组中前面的值比待比较的值大
    // 注意是 j - 1 和 temp 的数值进行比较
    while (j > 0 && compareFn(array[j - 1], temp) === Compare.BIGGER_THAN) {
      // 把这个值已到当前位置上，并减小j，最终找到正确的插入位置
      array[j] = array[j - 1];
      j--;
    }
    // 将temp插入到正确的位置
    array[j] = temp;
  }
  return array;
}

```

## 归并排序
- 思路：将原始数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到所有只有一个排序完毕的大数组。
- 时间复杂度O(n*logn)
