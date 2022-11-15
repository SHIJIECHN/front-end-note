---
autoGroup-1: WebGL
sidebarDepth: 3
title: WebGL2的基本原理
---

## 基本原理
### 1. 基本概念
WebGL是栅格化（rasterization）引擎。基于代码来画点、线条和三角形。

着色器程序：
- 顶点着色器（Vetex Shader）：计算点的位置，保存在gl_Position中。
- 片段着色器（Fragment Shader）：计算当前正在绘制图形的每个像素的颜色。保存在gl_FragColor中。

WebGL关注：
1. 剪辑空间坐标（Clip space coordinates）-- 顶点着色器提供剪辑空间坐标。
2. 颜色 -- 片段着色器提供颜色

> 什么是剪辑空间坐标？

WebGL使用的缩放空间坐标系。顶点着色器将输入的顶点从原始坐标系转换到剪辑空间坐标系，并将变换后的顶点值保存在特殊变量gl_Position中。每个轴的范围是-1.0~1.0。


### 2. 创建着色器(WebGLShader)对象
着色器对象可以是点着色器（vertex shader）或片段着色器（fragment shader）。

创建一个WebGLShader步骤：
1. 使用createShader()创建着色器
2. 通过shaderSource()连接GLSL源代码
3. 通过compileShader()完成着色器编译
4. 为了检查编译是否成功，将检查着色器参数gl_COMPILE_STATUS状态，通过gl.getShaderParameter()获得它的值，并制定着色器和想要检查的参数的名字。

```javascript
/**
 * 创建着色器并编译着色器
 * @param {!WebGLRenderingContext} gl WebGL上下文
 * @param {number} type 着色器类型 VERTEX_SHADER 或者 FRAGMENT_SHADER
 * @param {string} source GLSL格式的着色器代码
 * @returns {！WebGLShader} 着色器
 */
function createShader(gl, type, source) {
  // 1. 创建着色器
  const shader = gl.createShader(type);
  // 2. 设置着色器源码
  gl.shaderSource(shader, source);
  // 3. 编译一个GLSL着色器，使其成为二进制数据，然后可以被WebGLProgram对象所使用
  gl.compileShader(shader);
  // 4. 检测是否编译成功。
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderParameter(shader)); // eslint-disable-line
  gl.deleteShader(shader);
  return undefined;
}
```

### 3. 创建着色程序（WebGLProgam）对象
一个着色程序对象由两个编译后的着色器对象组成-点着色器和片段着色器。

创建创建WebGLProgam对象步骤：
1. 创建和初始化一个WebGLProgram对象
2. 添加预先定义好的点着色器和片段着色器
3. 连接给定的WebGLProgram，从而完成程序的片段和点着色器准备GPU代码的过程

```javascript
/**
 * 从 2 个着色器中创建一个程序。在GPU上创建一个GLSL程序
 * @param {*} gl WebGL上下文
 * @param {*} vertexShader 顶点着色器
 * @param {*} fragmentShader 片段着色器
 * @returns 程序
 */
function createProgram(gl, vertexShader, fragmentShader) {
  // 1. 创建一个程序
  const program = gl.createProgram();
  // 2. 附上着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 3. 链接到程序
  gl.linkProgram(program);

  // 4. 检查链接是否成功
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramParameter(program));
  gl.deleteProgram(program);
}
```

### 4. 顶点缓存对象（VBO）
数据存放到缓存区
```javascript
// 查找属性位置。查找属性是在程序初始化的时候，而不是render循环的时候
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
// 数据是从缓冲区中取出来的，所以需要创建缓冲区
const positionBuffer = gl.createBuffer();
// 绑定缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// 把数据存放到缓冲区。new Float32Array创建32位的浮点数数组
const positions = [
  0,0,
  0,0.5,
  0.7,0
]
// 将数组拷贝到GPU上的positionBuffer里面，因为positionBuffer绑定到了gl.ARRAY_BUFFER
// 所以可以通过gl.ARRAY_BUFFER来操作
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
```

### 5. 顶点数组对象（VAO）
告诉属性如何从缓冲区取出数据
```javascript
// 创建属性状态集合（VAO）
const vao = createVertexArray();
// 绑定顶点数组
gl.bindVertexArray(vao);
// 启用属性
gl.enableVertexAttribArray(positionAttributeLocation);

// 如何从缓存区取出数据
const size = 2; // 顶点属性的大小
const type = gl.FLOAT; // 数据类型
const normalize = false; // 数据是否被标准化
const stride = 0; // 步长
let offset = 0; // 位置数据在缓冲中起始位置的偏移量
// 如何解析顶点数据（应用到逐个顶点属性上）
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
```

### 6. 图形显示
```javascript
// 画布尽量扩展到可用的空间 (详见下面画图设置)
webglUtils.resizeCanvasToDisplaySize(gl.canvas);
// 将裁剪空间的-1~+1映射到x轴0~gl.canvas.width，y轴0~gl.canvas.height
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// 运行着色器程序
gl.useProgram(program);
// 用哪个缓冲区和如何从缓冲区取出数据给到属性
gl.bindVertexArray(vao);
// 
const primitiveType = gl.TRIANGLES; // 画三角形
offset = 0;
const count = 3; // 顶点着色器运行3次
gl.drawArrays(primitiveType, offset, count);
```

### 7. 画布处理
全屏展示，CSS设置canvas画布大小
```css
canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}
```
将像素转换为分辨率
```javascript
const vertexShaderResource = `#version 300 es
  in vec2 a_position;

  uniform vec2 u_resolution; // 画布的显示精度

  void main(){
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1(clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
  }
`;
// 使用像素点
const positions = [
  10, 20,
  80, 20,
  10, 30,
  10, 30,
  80, 20,
  80, 30,
];

// u_resolution设置为画布的显示精度，着色器会把positionBuffer上的位置数据以像素坐标对待
const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
// 设置 u_resolution的值（画布实际的值）
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
```

理解如何使用uniform来提供数据给GPU。


## 重置画布尺寸
每个画布有两个尺寸：
1. drawingbuffer的尺寸：表示画布中有多少个像素
2. 画布显示的尺寸：CSS决定。

drawingbuffer的尺寸设置方式：
1. 使用HTML标签插入样式
2. JavaScript代码设置

如果没有使用CSS影响到画布尺寸，画布显示尺寸则和drawingbuffer尺寸相同。

设置画布尺寸时400x300，drawingbuffer是10x15
```javascript
<canvas
    id="c"
    width="10"
    height="15"
    style="width: 400px; height: 300px;"
></canvas>
```

## 如何工作的
CPU做两部分事情：
1. 第一部分是如何处理顶点（数据流），变成裁剪空间节点
2. 第二部分是基于第一部分的结果绘制像素




