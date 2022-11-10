---
autoGroup-1: WebGL
sidebarDepth: 3
title: 基本概念
---

## 基本概念
- 顶点数据对象：Vertex Array Object（VAO）
- 顶点缓冲对象：Vertex Buffer Object（VBO）。好处是可以一次性的发送大批量数据到显卡上。
- 元素缓冲对象：Element Buffer Object（EBO）或索引缓冲对象Index Buffer Object（IBO）

图行渲染管线（Graphics Pipeline）：
- 第一部分把你的3D坐标转换为2D坐标
- 第二部分是把2D坐标转换为时机的有颜色的像素

着色器（Shader）

OpenGL着色器语言（OpenGL Shadings Language，GLSL）

顶点数据（Vertex Data）是一系列顶点的集合。一个顶点（vertex）是一个3D坐标的数据的集合。   

顶点数据是用顶点属性（Vertex Attribute）表示的，包含任何想要的数据。

图元（Primitive）：告诉OpenGL这些数据渲染类型。比如三角形、点、长线。


顶点着色器（Vertex Shader）：把一个单独的顶点作为输入，目的是把3D坐标转为另一种3D坐标。

图元装配（Primitive Assembly）：将顶点着色器输出的所有顶点作为输入，并所有的点装配成指定图元的形状。

几何着色器（Geometry Shader）：将图元形式的一系列顶点的集合作为输入，通过顶点产生新的顶点顶的图元来生成其他形状。

光栅化阶段（Rasterization Stage）：将图元映射为最终屏幕上相应的像素，生成供片段着色器使用的片段。在片段着色器之前会执行裁切（Clipping）。裁切会丢弃超出视图意外的所有像素。

片段着色器（Fragment Shader）：计算一个像素的最终颜色。

Alpha测试和混合(Blending)阶段：检测片段的对应的深度值，用来判断这个像素是其他物体的前面还是后面，决定是否丢弃。

