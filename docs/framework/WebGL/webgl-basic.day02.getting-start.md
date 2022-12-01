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


## 纹理
纹理是一个2D图片，可以用来添加物体的细节。

纹理坐标（Texture Coordinate）：每个顶点关联一个纹理坐标。用来标明从纹理图像哪个部分采样，之后在图形的其他片段上进行片段插值（Fragment Interpolation）。范围通常是（0，0）到（1，1）。

采样（Sample）：使用纹理坐标获取纹理颜色叫做采样。

> 如何对纹理进行采样？

### 1. 纹理环绕方式
```javascript
// 设置纹理贴图填充方式(纹理贴图像素尺寸大于顶点绘制区域像素尺寸)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
/**
 * 参数1：纹理目标。使用2D纹理，因此纹理目标为gl.TEXTURE_2D
 * 参数2：指定设置的选项和应用的纹理轴。
 * 参数3：环绕方式
 */
```
如果选择环绕方式为gl.CLAMP_TO_BORDER，还需要指定边缘的颜色
```javascript
const borderColor = [1, 1, 0, 1];
gl.textParameterf(gl.TEXTURE_2D, gl.TEXTURE_BORDER_COLOR, borderColor);
```

### 2. 纹理过滤
> 如何将纹理像素映射到纹理坐标？

纹理像素（Texture Pixel，也叫Texel）。gl.NEAREST（邻近过滤）和gl.LINEAR（线性过滤）。

注意不要和纹理坐标搞混，纹理坐标是你给模型顶点设置的那个数组，WebGL以这个顶点的纹理坐标数据去查找图像上的像素，然后进行采样提取纹理像素的颜色。

```javascript
// 为图像放大和缩小指定过滤方式
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
```

### 3. 多级渐远纹理(Mipmap)
距离观察者的距离超过一定的阈值，会使用不同的多级渐远纹理。

```javascript
// 多级渐远效果处理函数
gl.generateMipmap(target)

// 多级渐远纹理层之间过滤方式 gl.LINEAR_MIPMAP_LINEAR
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
```
注意：多级渐远纹理主要是使用在纹理被缩小的情况下，纹理放大不会使用多级渐远纹理。


### 4. 加载与纹理创建

```javascript
// 1. 创建一个纹理对象
const texture = gl.createTexture();
// 2. 绑定纹理
gl.bindTexture(gl.TEXTURE_2D, texture);
// 为当前绑定的纹理对象设置环绕、过滤方式
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);   
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
/**
 * 将载入图片数据生成一个纹理，通过gl.textImage2D来生成
 * 参数1：纹理目标。gl.TEXTURE_2D意味着生成与当前绑定的纹理对象在同一个目标上的纹理
 * 参数2：多级渐远的级别。0就是基本级别。
 * 参数3：纹理储存为何种方式
 * 参数4：最终的纹理的宽度
 * 参数5：最终的纹理的高度
 * 参数6：总为0.历史遗留问题。
 * 参数7和参数8：定义源图的格式和数据类型
 * 参数9：原图数据。
 */
gl.textImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
// 执行了gl.textImage2D函数，图像只有基本急别的纹理被加载了
// 需要使用gl.generateMipmap为当前绑定的纹理自动生成所需要的多渐远纹理
gl.generateMipmap(gl.TEXTURE_2D);
```

注意，如果在缩小中使用过滤方式为gl.LINEAR_MIPMAP_LINEAR多级渐远纹理，则载入图片后一定要使用gl.generateMipmap，否则图片无法展示。如
```javascript
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
gl.textImage2D(...)
gl.generateMipmap(gl.TEXTURE_2D);
```

### 5. 纹理传给片段着色器
```javascript
in vec2 TexCoord;
// 采样器（Sampler）
uniform sampler2D ourTexture

void main(){
  // texture函数使用之前设置的纹理参数对应的颜色值进行采样
  FlagColor = texture(ourTexture, TexCoord);
}
```

### 6. 纹理单元
使用gl.uniform1i，可以给纹理采样器分配一个位置，这样能够在一个片段着色器中设置多个纹理。

一个纹理的位置值通常称为一个纹理单元（Texture unit）。默认纹理单元是0，它是默认的激活纹理单元。

纹理单元的目的让我们在着色器中可以使用多余一个纹理。可以一次绑定多个纹理。只要我们首先激活对应的纹理单元。
```javascript
gl.activeTexture(gl.TEXTURE0); // 在绑定之前激活纹理单元
gl.bindTexture(gl.TEXTURE_2D, texture);
```

## 坐标系统
每次顶点着色器运行后，我们可见所有顶点都为标准化设备坐标（Normalized Device Coordinate，NDC）。也就是说每个顶点的x, y, z坐标都应该是在-1.0到1.0之间。

1. 自己设定一个坐标
2. 在顶点着色器中将这些坐标变换为标准化设备坐标
3. 标准化设备坐标传入光栅器(Resterizer)，将它们变换为屏幕上的二维坐标或像素。

将坐标变换为标准化设备坐标，再标为屏幕坐标。经历5个不同坐标系统：
1. 局部空间（Local Space）或者称为物体空间（Object Space）
2. 世界空间（World Space）
3. 观察空间（View Space）或者称为视觉空间（Eye Space）
4. 裁剪空间（Clip Space）
5. 屏幕空间（Screen Space）

### 1. 局部空间
物体所在的坐标空间，即对象最开始所在的地方。

### 2. 世界坐标
顶点相对于（游戏）世界的坐标。物体的坐标系从局部变换到世界空间，该表换是由模型矩阵（Model Matrix）实现的。

模型矩阵：位移、缩放、旋转。

### 3. 观察空间
经常被称为摄像机。观察空间是将世界坐标转化为用户视野前方的坐标而产生的结果。因此观察空间就是从摄像机的视角所观察到的空间。该变换由观察矩阵（View Matrix）来完成。

观察矩阵：一系列的唯一和旋转的组合来完成。

### 4. 裁剪空间
所有的坐标都能落到一个特定的范围内。指定自己的坐标集（如-1000到1000，大于1000或小于-1000直接裁剪掉），然后投影矩阵（Projection Matrix）将指定范围内的坐标变换为设备坐标的范围（-1.0, 1.0）。

由投影矩阵创建的观察箱（Viewing Box）被称为平截头体（Frustum）。

将特定范围内的坐标转化到标准设备坐标系的过程被称为投影（Projection）。

一旦所有顶点被变换到裁剪空间，就会执行透视除法（Perspective Division），这个过程中我们将位置向量的x，y，z分量分别除以齐次w分量。透视除法是将4D裁剪空间坐标变换为3D标准化设备坐标的过程。

将观察坐标变换为裁剪坐标的投影矩阵有两种不同的形式：正射投影矩阵（Orthographic Projection Matrix）和透视投影矩阵（Perspective Projection Matrix）。

正射投影矩阵：直接将坐标映射到2D平面中。

顶点着色器的输出要求所有的顶点都在裁剪空间内，OpenGL然后将裁剪坐标执行透视除法，从而将它们变换为标准化设备坐标。OpenGL会使用gl.viewPort内部的参数来将标准化设备坐标映射到屏幕坐标，每个坐标都关联了一个屏幕上的点（在我们的例子中是一个800x600的屏幕）。这个过程称为视口变换。


## 摄像机
摄像机在世界空间中的位置、观察的方向、一个指向它右侧的向量以及一个指向它上方的向量。

摄像机位置：世界空间中一个指向摄像机位置的向量。
摄像机方向：摄像机的位置指向原点，与指向Z轴的正向相反。场景远点减去摄像机位置。方向向量与摄像机方向相反。
右轴：摄像机空间的X轴的正方向。向上向量(0,1,0)与方向向量叉乘。
上轴：摄像机的正Y轴。右向量和方向向量叉乘。
```javascript
let cameraPos: vec3 = [0, 0, 3]; // 摄像机位置
let cameraTarget: vec3 = [0, 0, 0]; // 场景原点，也就是目标
let cameraDirection = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), cameraPos, cameraTarget)); // 方向向量。沿着Z轴正向。摄像机空间的Z轴正向
let up: vec3 = [0, 1, 0]; // 上向量
let cameraRight = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), up, cameraDirection)); // 右向量。摄像机空间的 X轴正向
let cameraUp = vec3.cross(vec3.create(), cameraDirection, cameraRight); // 上轴。摄像机空间的Y轴正向
```

观察矩阵把所有世界坐标变换到观察空间中。mat4.lookAt会创建出一个观察矩阵

## 基础光照
冯氏光照模型（Phong Lighting Model）主要结构由3个分量组成：环境（Ambient）、漫反射（Diffuse）、镜面（Specular）光照。

### 1. 环境光照
把环境关照添加到物体：用光的颜色乘以一个很小的常量环境因子，再乘以物体的颜色。
```javascript
float ambientStrength = 0.1;
vec3 ambient = ambientStrength * lightColor;
```

### 2. 漫反射关照
光线是以声明角度接触到这个片段的。

如果光线垂直于物体表面，这束光对物体影响会最大（最亮）。

计算漫反射光照需要什么？

- 法向量（Normal Vector）：垂直于片段表面的一个向量。
- 定向的光线：光源的位置与片段的位置之间向量差的方向向量。

由于片段着色器计算是在世界坐标中进行的，所以法向量也转换为空间坐标。

法线矩阵（Normal Matrix）：将法向量转换到世界空间坐标。模型矩阵左上角3x3部分的逆矩阵的转置矩阵。

如果物体有缩放操作，则需要法线矩阵乘以法向量。

```javascript
// vs
Normal = mat3(transpose(inverse(model))) * aNormal;

// fs
vec3 norm = normalize(Normal); // 法线单位向量
// 光的方向单位向量 = normalize(光源位置 - 片段位置)
vec3 lightDir = normalize(lightPos - FragPos); 
// 光源对当前片段实际的漫反射的影响
float diff = max(dot(norm, lightDir), 0.0); 
vec3 diffuse = diff * lightColor; // 乘以光的颜色，得到漫反射分量
```

### 3. 镜面光照
取决于光的方向向量、物体的法向量、观察方向。

镜面关照最强的地方就是我们看到表面上反射光的地方。

根据法向量翻折入射光的方向来计算反射向量，然后计算反射向量与观察方向的角度差，夹角越小，镜面光的作用越大。

```javascript
float specularStrength = 0.5; // 镜面强度变量
vec3 viewDir = normalize(viewPos - FragPos); // 视线的法线向量
// 沿着法线轴的反射向量。reflect函数要求第一个向量是从光线指向片段位置的向量，lightDir是从片段指向光源。
vec3 reflectDir = reflect(-lightDir, norm); 
// 32是高光的反光度。dot(viewDir, reflectDir)视线方向与反射方向的点乘， max确保它不是负值
float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
vec3 specalar = specularStrength * spec * lightColor; // 镜面分量
```

在顶点着色器中实现的冯氏光照模型叫做Gouraud着色(Gouraud Shading)，而不是冯氏着色(Phong Shading)。

## 材质
针对每种表面定义不同材质（Material）属性。

当描述一个表面时，可以分别为三个光照分量定义一个材质颜色（Material Color）：环境光照（Ambient Lighting）、漫反射光照（Diffuse Lighting）、镜面光照（Specular Lighting）。
```javascript
// 存储物体的材质属性
struct Material{
    vec3 ambient;// 环境关照
    vec3 diffuse;// 漫反射光照
    vec3 specular;// 镜面关照
    float shininess;// 反光度
};

// 光照属性对各个光照分量的影响
struct Light{
    vec3 position;
    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
```

## 光照贴图
漫反射和镜面光贴图（Map）。

漫反射贴图（Diffuse Map）：表现了物体所有的漫反射颜色的纹理图像。

:::tip
错误： GL_INVALID_OPERATION: Uniform size does not match uniform method。

检查uniform赋值是否正确，或者一个uniform多次赋值。某一次赋值不正确。
:::


## 投光物
### 1. 定向光（Directional Light）
光源处于无限远处。所有的光线都有着相同的方向，它与光源的位置没有有关系。

使用一个光线方向向量而不是位置向量来模拟一个定向光。


### 2. 点光源（Point Light）
朝着所有方向发光，但是光线随着距离逐渐衰减。

衰减（Attennuation）

### 3. 聚光（Spotlight）
位于环境中某个位置的光源，只朝一个特定方向而不是所有方向照射光线。

采用一个世界空间位置、一个方向和一个切光角（Cutoff Angle）来表示。