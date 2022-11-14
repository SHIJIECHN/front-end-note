---
autoGroup-1: WebGL
sidebarDepth: 3
title: 基本概念
---

## 基本概念
- 顶点数据对象：Vertex Array Object（VAO）。
- 顶点缓冲对象：Vertex Buffer Object（VBO）。好处是可以一次性的发送大批量数据到显卡上。
- 元素缓冲对象：Element Buffer Object（EBO）或索引缓冲对象Index Buffer Object（IBO）

图行渲染管线（Graphics Pipeline）：
- 第一部分把你的3D坐标转换为2D坐标
- 第二部分是把2D坐标转换为时机的有颜色的像素

着色器（Shader）

OpenGL着色器语言（OpenGL Shadings Language，GLSL）

顶点数据（Vertex Data）是一系列顶点的集合。一个顶点（vertex）是一个3D坐标的数据的集合。   

顶点数据是用顶点属性（Vertex Attribute）表示的，包含任何想要的数据。每一个输入变量也叫顶点属性。

图元（Primitive）：告诉OpenGL这些数据渲染类型。比如三角形、点、长线。


顶点着色器（Vertex Shader）：把一个单独的顶点作为输入，目的是把3D坐标转为另一种3D坐标。

图元装配（Primitive Assembly）：将顶点着色器输出的所有顶点作为输入，并所有的点装配成指定图元的形状。

几何着色器（Geometry Shader）：将图元形式的一系列顶点的集合作为输入，通过顶点产生新的顶点顶的图元来生成其他形状。

光栅化阶段（Rasterization Stage）：将图元映射为最终屏幕上相应的像素，生成供片段着色器使用的片段。在片段着色器之前会执行裁切（Clipping）。裁切会丢弃超出视图意外的所有像素。

片段着色器（Fragment Shader）：计算一个像素的最终颜色。

Alpha测试和混合(Blending)阶段：检测片段的对应的深度值，用来判断这个像素是其他物体的前面还是后面，决定是否丢弃。

## 着色器
### 1. 数据类型
默认基础类型int、float、double、unit和bool。

向量是一个可以包含2、3、或4个分量的容器。

输入（in）与输出（out）。

顶点着色器接收的是一种特殊形式的输入。指定输入变量，使用gl.getAttribLocation查询属性位置值。

片段着色器需要一个vec4颜色输出变量。

### 2. Uniform
Uniform是一种从CPU中的应用向GPU中的着色器发送数据的方式。与顶点属性不同。

不同点：
1. uniform是全局的。
2. uniform会一直保存设置的值，直到被重置或更新。

如果声明了一个uniform，但是再GLSL代码中没有用过，编译器会默认移除这个变量，导致最后编译出的版本中并不会包含它，此时gl.getUniformLocation返回值为null。
```js
gl.getUniformLocation(program, 'xOffset'); // null
```

设置uniform值流程：
1. 获取uniform属性的位置
2. 更新它的值
```javascript
const timeValue = new Date().getTime(); // 获取运行的毫秒数 glfwGetTime()
const greenValue = (Math.sin(timeValue) / 2) + 0.5; // 让颜色在0-1之前改变
// 查询uniform outColor的位置值
const vertexColorLocation = gl.getUniformLocation(program, 'outColor');
/**
 * uniform4f 给outColor 这个值uniform变量赋值值。新的值被用于uniform
 * 参数1：包含了将要修改的uniform属性位置
 * 参数2：浮点值Number（方法名跟'f'）
 * 参数3：浮点数组（如Float32Array)
 * 参数4：整型值Number（方法名跟'i'）
 * 参数5：整型数组Int32Array用于整型向量方法（方法名跟'iv'）
 */
gl.uniform4f(vertexColorLocation, 0, greenValue, 0, 1)
```

### 3. 插值
分别使用两个VBO缓存顶点位置属性和顶点颜色属性，注意此时需要先对一个属性绑定和设置属性读取方式，再对下一个属性创建VBO进行属性绑定和设定读取当方式。
```javascript
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
// 位置属性
const positionAttributeLocation = gl.getAttribLocation(program, 'aPos');
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
gl.enableVertexAttribArray(positionAttributeLocation);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
// 颜色属性
const colorPostionAttributeLocation = gl.getAttribLocation(program, 'aColor');
gl.vertexAttribPointer(colorPostionAttributeLocation, size, type, normalize, stride, offset)
gl.enableVertexAttribArray(colorPostionAttributeLocation);
```

### 4. 封装着色器类
- init方法返回存储了着色器的程序
- use方法用来激活着色器程序
- set...方法能够查询uniform的位置值并设置它的值


