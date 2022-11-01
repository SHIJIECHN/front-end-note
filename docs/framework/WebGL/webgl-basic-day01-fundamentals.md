---
autoGroup-1: WebGL
sidebarDepth: 3
title: WebGL2的基本原理
---


## 什么是WebGL
WebGL是栅格化（rasterization）引擎。基于代码来画点、线条和三角形。

着色器程序：
- 点着色器（Vetex Shader）：计算点的位置。
- 片段着色器（Fragment Shader）：计算当前正在绘制图形的每个像素的颜色。

WebGL关注：
1. 剪辑空间坐标（Clip space coordinates）-- 点着色器提供剪辑空间坐标
2. 颜色 -- 片段着色器提供颜色

