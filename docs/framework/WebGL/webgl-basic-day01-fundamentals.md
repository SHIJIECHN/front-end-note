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


## 创建着色器(WebGLShader)对象
着色器对象可以是点着色器（vertex shader）或片段着色器（fragment shader）。

创建一个WebGLShader步骤：
1. 使用createShader()创建着色器
2. 通过shaderSource()连接GLSL源代码
3. 通过compileShader()完成着色器编译

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
  // 检测是否编译成功
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderParameter(shader)); // eslint-disable-line
  gl.deleteShader(shader);
  return undefined;
}
```

## 创建着色程序（WebGLProgam）对象
一个着色程序对象由两个编译后的着色器对象组成-点着色器和片段着色器。

创建创建WebGLProgam对象步骤：
1. 创建和初始化一个WebGLProgram对象
2. 添加预先定义好的点着色器和片段着色器
3. 连接给定的WebGLProgram，从而完成程序的片段和点着色器准备GPU代码的过程

```javascript
/**
 * 从 2 个着色器中常见一个程序
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

