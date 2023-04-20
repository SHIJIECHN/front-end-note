---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 纹理
---

## 纹理（Texture）

纹理：设置物体表面贴合的彩色图片。指物体光滑表面上的彩色图案。
- 使用纹理加载器TextureLoader加载外部图片
- 通过设置物体的.map属性，降价在得到的外部图片贴合在物体表面

```javascript
const loader = new TextureLoader();
const material = new MeshBasicMaterial({
    map: loader.load('xxx/xxx.jpg')
})
```

多个纹理贴图

```javascript
const loader = new TextureLoader();
const imgSrcArr = [imgSrc1, imgSrc2,imgSrc3,imgSrc4,imgSrc5,imgSrc6];
// 创建一组材质,每个次啊之对应立方体每个面所用到的材质
const materialArr : MeshBasicMaterial[] = [];
imgSrcArr.forEach((src)=>{
  materialArr.push(new MeshBasicMaterial({
    map: loader.load(src)
  }))
})
```

## 纹理加载器的不同事件回调函数

```javascript
const loader = new TextureLoader();
const material = new MeshBasicMaterial({
  // loader.load('xxx.jpg')返回值为Text类型实例
  map: loader.load(imgSrc,
    (texture)=>{
      console.log('纹理图片加载完成');
      console.log(texture);
      console.log(texture.image.currentSrc) // 图片实际加载的地址
    },
    (event)=>{
      console.log('纹理图片加载中');
      console.log(event)
    },
    (error)=>{
      console.log('纹理图片加载失败');
      console.log(error);
    }
    ),
});
```

## 纹理加载管理器

使用纹理加载管理器可以监控多个图片资源的加载。

1. 新建一个LoadingManager实例
2. 把该实例传递给TextureLoader的构造函数

```javascript
// 创建所有纹理加载的管理器
const loadingManager = new LoadingManager();
// 创建一个纹理加载器
const loader = new TextureLoader(loadingManager);
// 创建6个面对应的材质
const materialArr: MeshBasicMaterial[] = [];
for(let i=0; i < 6; i++){
  materialArr.push(new MeshBasicMaterial({
    map: loader.load(`imgSrc${i}`)
  }))
}
// 添加加载管理器的各种事件处理函数
loadingManager.onLoad = ()=>{
  console.log('纹理图片资源加载完成')
}
loadingManager.onProgress = (url, loaded, total)=>{
  console.log(`图片加载中,共${total}张,当前已加载${loaded}张${url}`);
}
loadingManager.onError = (url)=>{
  console.log(`加载失败 ${url}`);
}
```

## 纹理占用的内存

只与图片尺寸（宽高）有关，与图片文件体积无关。

## 纹理图片尺寸与物体尺寸

- 纹理图片尺寸：指图片本身的宽高尺寸
- 物体渲染面尺寸：指最终在镜头中物体某一面所渲染出的尺寸
  - 物体渲染尺寸是由物体本身大小和物体距离镜头的远近来共同决定的
- 纹理图片尺寸和物体渲染尺寸几乎是不可能刚好完全相同的

尺寸不相同那么Three.js如何处理呢？

### 1. mipmap算法模式

- mipmap是目前应用最广泛的纹理映射技术之一
- mipmap的原则是将图片的每个便（宽和高）对应的分辨率指取上一级的1/2.这样可以通过计算，不断得到面积为上一级1/4的图片数据，直至最终图片为1像素x1像素
- Three.js会选择最接近与物体渲染尺寸的那一级图片，并渲染出效果
- 纹理图片尺寸大于渲染面尺寸，此时需要对纹理进行压缩。假设纹理尺寸小于渲染面尺寸，那么此时使用相反计算过程，最终得到一个比较模糊但尺寸符合的贴图数据。

好处：牺牲纹理贴图的精准性，换来计算所需性能上的提升。

### 2. 纹理的缩放模式

三种模式：
- NearestFilter：最接近模式，选择最接近的像素
- LinearFilter：线性模式，选择4个像素并将进行混合
- Mipmap相关的模式
  - NearestMipMapNearestFilter：选择最贴近目标解析度的Mip，然后线性过滤器将器渲染
  - NearestMipMapLinearFilter：选择层次最近的2个Mip，将2个Mip使用线性模式将其混合
  - LinearMipmapNearestFilter：选择最贴近目标解析度的1个Mip，然后使用线性模式将器混合
  - LinearMipmapLinearFilter：选择层次最近的2个Mip，然后使用线性模式将其混合

- Nearest：最接近算法，精确度高，像素感比较强烈，锐化程度比较强烈，所用计算量大
- Linear：线性算法，精确度不高，像素感不强，锐化程度不强，相对比较模糊和平滑，所用计算量小


纹理加载修改为：

```javascript
const loader = new TextureLoader();
const texture: Texture = loader.load(imgSrc);
const material = new MeshBasicMaterial({
  map: texture
})
```

- magFilter：纹理缩小模式。
  - 纹理图片尺寸大于渲染面尺寸时，通过texture.magFilter的值来设置纹理的清晰度模式
  - texture.magFilter = Three.NearestFilter 最接近模式
  - texture.magFilter = Three.LinearFilter 线性模式，默认值Three.LinearFilter
  - 纹理图片缩小模式，不可以选择Mipmap中的任何一种模式，只能从Nearest Filter、LinearFilter中选择其一

- minFilter：纹理方法模式
  - 纹理图片尺寸小于物体渲染面的尺寸时，通过texture.minFilter的值来设置纹理的清晰度模式
  - 默认值LinearMipmapLinearFilter

如何选择：
- 纹理需要缩小时，如果对清晰度要求比较高，选择NearestFilter
- 纹理需要放大时，推荐使用默认LinearMipmapLinearFilter
- 事实上，出了性能方面的考虑外，无特殊情况，比推荐使用Nearest相关模式
- 有一种情况除外：采用纹理重复的方式，用极致的小图去渲染比较大的面


## 纹理的重复、偏移、旋转

### 1. 重复

- 水平重复：wrapS
- 垂直重复：wrapT

重复由三种形式：
- Three.ClapToEdgeWrapping：每个边缘最后一个像素永远重复
- Three.RepeatWrapping：重复整个纹理
- Three.MirroreRepeatWrapping：纹理被镜像（对称反转）并重复

设置重复方式：

```javascript
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
```

设置重复次数：

```javascript
texture.repeat.set(2,3); // 设置水平方向重复2次\垂直方向重复3次
```

### 2. 偏移

设置偏移的1单位=1个纹理图片大小

```javascript
texture.offset.set(0.5, 0.25); // 设置纹理水平方向偏移0.5个纹理宽度、垂直方向偏移0.25个纹理宽度 
```

- 0.5个纹理宽度也就是相当于一半的宽度偏移量
- 0.25个纹理高度相当于1/4的高度偏移量

### 3. 旋转

- 通过修改rotation属性来设置旋转的弧度
- 通过修改center属性来确认旋转中心点
- 纹理坐标的中心点坐标，相当于传统的四象限坐标
- 中心点的2个原则：
  - 默认的旋转中心点为纹理图片的左下角，坐标为(0, 0)
  - 坐标的单位为1单位 = 1个纹理图片对应大小。如（0.5， 0.5）坐标对应的是纹理图片的中心位置

```javascript
texture.center.set(0.5,0.5); // 将旋转中心点改为图片的正中心位置
texture.rotation = MathUtils.degToRad(45);// 设置纹理旋转弧度
```






   
