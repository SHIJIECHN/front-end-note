---
autoGroup-3: DOM
sidebarDepth: 3
title: day11
---

## 鼠标行为预测技术
鼠标是斜着滑动还是竖着滑动: 鼠标在移动的过程中记录四个点，第一个点（S）是鼠标的初始位置，第二个点(E)是鼠标移动后的点，第三个点(RT)菜单右侧的顶点，第四个点(RB)是菜单的右下角。s，RT，RB会构成一个三角形，只需要判断E是否是在三角形区域内，如果是在三角形区域内，鼠标是斜着的移动的，说明鼠标是有意图进去子菜单的。    
判断一个点在不在三角形内：向量和叉乘公式。
```js
/**
 * 判断点是否在一个三角形内
 */
function vec(a, b) {
    return {
        x: b.x - a.x,
        y: b.y - a.y
    }
}

function vecProduct(a, b) {
    return v1.x * v2.y - v2.x * v1.y;
}

function sameSymbols(a, b) {
    return (a ^ b) >= 0;
}

function pointInTriangle(p, a, b, c) {
    var PA = vec(p, a),
        PB = vec(p, b),
        PC = vec(p, c),
        R1 = vecProduct(PA, PB),
        R2 = vecProduct(PB, PC),
        R3 = vecProduct(PC, PA);

    return sameSymbols(R1, R2) && sameSymbols(R2, R3);
}
```

## 练习
京东菜单
