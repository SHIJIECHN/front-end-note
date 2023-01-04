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
```javascript
// 方式1： 使用HTML标签插入样式
<canvas id="c" width="400" height="300"></canvas>
// 方式2：JavaScript代码设置
const canvas = document.querySelector('#c')
canvas.width = 400
canvas.height = 300
```
画布显示的尺寸设置方式：通过css设置
```css
canvas {
  width: 100vw;
  height: 100vh;
}
/* 或者 */
#c {
  width: 100vw;
  height: 100vh;
}
```

如果没有使用CSS影响到画布尺寸，画布显示尺寸则和drawingbuffer尺寸相同。

设置画布尺寸时400x300，drawingbuffer是10x15。因为浏览器得到10\*15像素的画布，将它拉伸到400\*300像素，然后在拉伸的过程中进行了插值。
```javascript
<canvas
    id="c"
    width="10"
    height="15"
    style="width: 400px; height: 300px;"
></canvas>
```

### 使用CSS使画布充满整个窗口
要使画布铺满整个窗口，只需要将绘图缓冲区(drawingBuffer)的尺寸设置为浏览器拉伸后的画布尺寸。

clientWidth, ClientHeight 返回元素的大小（CSS像素）。

如果不给canvas设置width、height属性，则默认width为300px、height为150px。

将画布充满窗口。通过css设置
```css
html, body {
  height: 100%;
  margin: 0;
}
/* 设置画布大小为视域大小 */
#c {
  width: 100%;
  height: 100%;
  display: block;
}
```

使用resizeCanvasToDisplaySize函数将绘图缓冲区(drawingBuffer)调整与画布大小相同。
```js
// 检查该元素正在显示的大小，然后调整绘图缓冲区大小一匹配
  function resizeCanvasToDisplaySize(canvas) {
    // 获取浏览器显示的画布的CSS像素值
    const displayWidth = canvas.clientWidth,
      displayHeight = canvas.clientHeight;

    // console.log(displayWidth, displayHeight); // 浏览器可视窗口的宽高 1258 934
    // console.log(canvas.width, canvas.height); // 300 150

    // 检查画布大小是否相同
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
    if (needResize) {
      // 使画布大小相同
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    return needResize;
  }
```
线没有覆盖整个区域。为什么？
```javascript
// 重置画布大小需要告诉WebGL新的视域设置
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
```

## 如何工作的
CPU做两部分事情：
1. 第一部分是如何处理顶点（数据流），变成裁剪空间节点
2. 第二部分是基于第一部分的结果绘制像素

> 缓冲区做什么？

缓冲区是将每个顶点数据传给GPU的方法。
- gl.createBuffer创建一个缓冲区
- gl.bindBuffer将缓冲区设置为正在处理的缓冲区
- gl.bufferData将数据赋值到当前缓冲区中

> 属性命令做什么？

数据进入缓冲区后，需要告诉WebGL如何获取数据并将其提供给顶点着色器的属性。
1. 首先要问WebGL给它分配的属性的位置
```js
var positionLocation = gl.getAttribLocation(program, "a_position");
var colorLocation = gl.getAttribLocation(program, "a_color");
```
1. 告诉WebGL我们想要从缓冲区取数据
```javascript
gl.enableVertexAttribArray(location);
```
1. 告诉WebGL如何读取数据：从最后调用gl.bindBuffer绑定的缓冲区中获取数据
```javascript
gl.vertexAttribPointer(
  location,
  numComponents,
  typeOfData,
  normalizeFlag,
  strideToNextPieceOfData,
  offsetIntoBuffer);
```

每种数据类型使用1个缓冲区，则步长和偏移量都可以始终为0。
- 步长0表示“使用与类型和大小匹配的步长。
- 偏移量0表示从缓冲区的开头开始。

## 着色器与GLSL

### 1. 点着色器
着色器需要的数据来源有三种方式：
1. 属性（从缓冲区取数据）
2. Uniform（在单词绘制过程中，它的值对所有顶点都是一样的）
3. 纹理（来自pixels/texels的数据）

#### 1.1 属性
点着色器获取数据的最常见方法是通过缓冲区和属性。

属性类型可以是 float, vec2, vec3, vec4, mat2, mat3, mat4, int, ivec2, ivec3, ivec4, uint, uvec2, uvec3, uvec4.
```javascript
// 1. 创建缓冲区
const buffer = gl.createBuffer();
// 2. 把数据放入缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bind(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
// 3. 在着色器中查找属性的位置
const positionLoc = gl.getAttribLocation(someShaderProgram, 'a_position');
// 4. 如何将数据从缓冲区中取出并放入属性中
gl.enableVertexAttribArray(positionLoc);
const numComponents = 3; //(x,y,x)
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;
gl.vertexAttribPointer(positionLoc, numComponents, type, normalize, stride, offset);
```

#### 1.2 uniform
对于任何顶点来说，在调用着色器的时候，uniform的值都是一样的。
```javascript
// 1. 查找uniform的位置
const offsetLoc = gl.getUniformLocation(someProgram, 'u_offset');
// 2. 绘制之前给uniform赋值
gl.uniform4fv(offsetLoc, [1,0,0,0]);
```

### 2. 片段着色器
片段着色器任务是给栅格化的像素提供颜色。片段着色器获取数据的三种方式：
1. Uniform
2. 纹理
3. Varyings（来自点着色器的数据或插值的数据）

#### 2.1 纹理
从着色器的纹理获取值，创建一个sampler2D的Uniform并使用GLSL函数texture从中提取一个值。
```javascript
uniform sampler2D u_texture;
out vec4 outColor;

void main(){
  vec2 texcoord = vec2(0.5, 0.5);
  outColor = texture(u_texture, textcoord);
}
```
```javascript
// 1. 创建数据并放入到纹理中去
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
const level = 0;
const internalFormat = gl.RGBA;
const width = 2;
const height = 1;
const border = 0; // 必须为0
const format = gl.RGBA;
const type = gl.UNSIGNED_BYTE;
const data = new Unit8Array([255, 0, 0, 255, 0, 255, 0, 255]);
gl.texImage2D(
  gl.TEXTURE_2D,
  level,
  internalFormat,
  width,
  height,
  border,
  format,
  type,
  data);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
// 2. 在着色器程序中查找uniform的位置
const someSampleLoc = gl.getUniformLocation(someProgram, 'u_texture');
// 3. 将纹理绑定到纹理单元（unit）中去
const unit = 5;
gl.activeTexture(gl.TEXTURE0 + unit);
gl.bindTexture(gl.TEXTURE_2D, tex);
// 4. 告诉着色器要绑定哪个单元（unit）到纹理中去
gl.uniform1i(someSamplerLoc, unit);
```

#### 2.2 Varyings
Varying是一种从点着色器到片段着色器传值的方式。


## 图像处理

enableVertexAttribArray: index out of range 错误。首先获取位置属性中，属性变量名是否正确。

bindTexture: invalid target .texParameter: no texture bound to target错误。查看bindTexture(gl.TEXTURE_2D, texture)。两个参数是否正确。

卷积

帧缓冲：给帧缓冲绑定一个纹理后，可以将渲染结果写入那个纹理。


## 关照
1. 发出光线的光源的类型
2. 物体表面如何反射光线
