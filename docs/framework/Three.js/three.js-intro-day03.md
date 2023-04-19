---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 图元
---

## 图元（Primitives）

图元是Three.js内置的一些基础3D形状，如立方体、球体、圆锥体。

- 顶点：就是在3D世界中某一个具体的点，即点的位置(x,y,z)，除了位置信息，还可能包括点的颜色或其他信息。
  - 这些顶点位置都是相对的
  - 在管道渲染流程中，顶点处理模块的作用就是负责将顶点进行坐标转换。
- 图元：由若干个顶点构成的一组数据，用于构建或描述某种二维或三维物体
  - 图元依然是一对顶点数据，而不是图像数据
  - 图元分成2种：
    - 几何图元：使用顶点、线段、三角形、曲线等等用于描述土体的“几何轮廓。几何图元可以进行空间转换，如平移、旋转、缩放等
    - 图像图元：又称为光栅图元使用像素阵列用于直观存储“图片信息”。实际上图像图元就是材质中的纹理贴图。图像图元不可以进行空间转换。
- 片元：包含图像颜色、位置、深度的信息数据。可以把片元简单理解为“未完全加工完成的图像数据”。
  - 片元已经不再是顶点数据，而是图像数据了，只不过数据未完全加工完全。
- 图像：有片元经过片元处理模块，得到的最终图像数据。就是3D渲染输出到屏幕上的显示结果

绘制过程中顶点、图元、片元和图像的关系：
1. 获取顶点坐标
2. 图元装配（即画出一个个三角形）
3. 光栅化（生成片元，即一个个像素）

<img :src="$withBase('/framework/ThreeJS/primitives.png')" alt="图元" />

## 图元种类

一共22中内置的图元。

| 图元种类（按英文首字母排序） | 图元构造函数                                       |
| ---------------------------- | :------------------------------------------------- |
| 盒子(Box)                    | BoxBufferGeometry、BoxGeometry                     |
| 平面圆(Circle)               | CircleBufferGeometry、CircleGeometry               |
| 锥形(Cone)                   | ConeBufferGeometry、ConeGeometry                   |
| 圆柱(Cylinder)               | CylinderBufferGeometry、CylinderGeometry           |
| 十二面体(Dodecahedron)       | DodecahedronBufferGeometry、DodecahedronGeometry   |
| 受挤压的2D形状(Extrude)      | ExtrudeBufferGeometry、ExtrudeGeometry             |
| 二十面体(Icosahedron)        | IconsahedronBufferGeometry、IcosahedronGeometry    |
| 由旋转形成的形状(Lathe)      | LatheBufferGeometry、LatheGeometry                 |
| 八面体(Octahedron)           | OctahedronBufferGeometry、OctahedronBufferGeometry |
| 由函数生成的形状(Parametric) | ParametricBufferGeometry、ParametriGeometry        |
| 2D平面矩形(Plane)            | PlaneBufferGeometry、PlaneGeometry                 |
| 多面体(Polyhedron)           | PolyhedronBufferGeometry、PolyhedronGeometry       |
| 环形/孔形(Ring)              | RingBufferGeometry、RingGeometry                   |
| 2D形状(Shape)                | ShapeBufferGeometry、ShapeGeometry                 |
| 球形(Sphere)                 | SphereBufferGeometry、SphereGemetry                |
| 四面体(Tetrahedron)          | TetrahedronBufferGeometry、TetrahedronGeometry     |
| 3D文字(Text)                 | TextBufferGeometry、TextGeometry                   |
| 环形体(Torus)                | TorusBufferGeometry、TorusGeometry                 |
| 环形结(TorusKnot)            | TorusKnotBufferGeometry、TorusKnotGeometry         |
| 管道/管状(Tube)              | TubeBufferGeometry、TubeGeometry                   |
| 几何体的所有边缘(Edges)      | EdgesGemetry                                       |
| 线框图(Wireframe)            | WireframeGeometry                                  |


## BufferGeometry

重要知识点：position、normal、uv。

一个完整的Buffergeometry是由若干个点(Vector3)构成的。

- position：坐标（每个坐标就是vector3），所有的坐标就是组成该BufferGeometry的所有点的信息。
- normal：法线（每个法线就是一个vector3），用于存储每个3D坐标点的朝向，用于计算反光
- uv：纹理映射坐标（每个uv就是一个vector2），用于存储每个3D坐标点对应渲染纹理时对应的位置点信息，用于计算贴图。
  - 对于纹理而言，它都是二维的平面，因此uv的值对应的是vector2，由x，y2个坐标值组成，且每个值的取值范围都是0-1.可以简单把0-1理解为0%-100%，对应的是一个百分比的值

## 使用

- [图元参考](https://threejs.org/manual/#zh/primitives)

```javascript
import './index.scss'
import {
	BufferGeometry,
	Color,
	DirectionalLight, DoubleSide, LineBasicMaterial,
	LineSegments,
	Mesh,
	MeshPhongMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from "three";
import React, {useCallback, useEffect, useRef} from "react";
import myBox from './my-box';
import myCircle from './my-circle';
import myCone from './my-cone';
import myCylinder from './my-circle';
import myDodecahedron from './my-dodecahedron'
import myExtrude from './my-extrude'
import myIcosahedron from './my-icosahedron'
import myLathe from './my-lathe'
import myOct from './my-octahedron'
import myParam from "./my-parametric";
import myPlan from "./my-plane";
import myPoly from "./my-polyhedron";
import myRing from "./my-ring";
import mySphere from "./my-sphere";
import myShape from "./my-shape";
import myTetra from "./my-tetrahedron";
import myTorus from "./my-torus";
import myTorusKnot from "./my-torus-knot";
import myTube from "./my-tube";
import myWire from "./my-wireframe";
import myEdge from "./my-edges";


const meshArr:(Mesh|LineSegments)[] = []

const HelloPrimitives = ()=>{
	const canvasRef = useRef<HTMLCanvasElement>(null); // canvas元素
	const cameraRef = useRef<PerspectiveCamera|null>(null); // 照相机
	const rendererRef = useRef<WebGLRenderer |null>(null);// 渲染器

	/**
	 * 随机生成材质
	 */
	const createMaterial = ()=>{
		const material = new MeshPhongMaterial({side: DoubleSide}); // 两面
		const hue = Math.floor(Math.random() * 100) / 100; // 随机获得一个颜色
		const saturation  = 1; // 饱和度
		const luminance = 0.5; // 亮度
		material.color.setHSL(hue, saturation, luminance); // 材质颜色、饱和度、亮度
		return material;
	}

	const createInit = useCallback(()=>{
		if(canvasRef.current === null){
			return;
		}
		meshArr.length = 0; // 清空数组

		// 初始化场景
		const scene = new Scene();
		scene.background = new Color(0x440088);

		// 初始化镜头
		const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
		camera.position.z = 120;
		cameraRef.current = camera;

		// 初始化渲染器
		const renderer = new WebGLRenderer({canvas: canvasRef.current});
		rendererRef.current = renderer;

		// 添加 2 盏灯光
		const light1 = new DirectionalLight(0xFFFFFF, 1); // 白色
		light1.position.set(-1,2,4);// 左前上
		scene.add(light1);

		const light2 = new DirectionalLight(0xffffff, 1);
		light2.position.set(1,-2,-4); // 右后下
		scene.add(light2);

		// 获得各个solid类型的图元实例，并添加到solidPrimitivesArr中
		const solidPrimitivesArr: BufferGeometry[] = [];
		solidPrimitivesArr.push(myBox, myCircle, myCone, myCylinder, myDodecahedron);
		solidPrimitivesArr.push(myExtrude, myIcosahedron, myLathe, myOct, myParam)
		solidPrimitivesArr.push(myPlan, myPoly, myRing, mySphere, myShape)
		solidPrimitivesArr.push(myTetra, myTorus, myTorusKnot, myTube)

		solidPrimitivesArr.forEach((item)=>{
			const material = createMaterial(); // 随机获得一种颜色材质
			const mesh = new Mesh(item, material); // 网格
			meshArr.push(mesh);
		})

		// 获得各个line类型的图元实例，并添加到meshArr中
		const linePrimitivesArr: BufferGeometry[] = [];
		linePrimitivesArr.push(myEdge, myWire)

		// 将各个line类型的图元实例转化为网络，并添加到meshArr中
		linePrimitivesArr.forEach((item)=>{
			const material = new LineBasicMaterial({color: 0x000000}); // 黑色
			const mesh = new LineSegments(item, material);
			meshArr.push(mesh);
		})

		// 定义物体在画面中显示的网格布局
		const eachRow = 5; // 每行显示5个
		const spread = 15; // 行高和列宽

		// 配置每一个图元实例，转换为网络，并位置和材质后，将其添加到场景中
		meshArr.forEach((mesh, index)=>{
			// 设定的排列是每行显示5个，即5个物体、行高和列高均为spread15。因此每个物体根据顺序，计算出自己所在的位置
			const row = Math.floor(index/ eachRow); // 计算出行
			const column = index % eachRow; // 计算出列
			mesh.position.x = (column - 2) * spread; // column - 2是因为希望将每一行物体摆放的单元格依次是：-2、-1、0、1、2，这样可以使整体物体处于居中显示
			mesh.position.y = (2 - row) * spread;
			scene.add(mesh); // 将网格添加到场景中
		})

		// 添加自动旋转渲染动画
		const render = (time: number)=>{
			time = time * 0.001;
			meshArr.forEach(item=>{
				item.rotation.x = time;
				item.rotation.y = time;
			})
			renderer.render(scene, camera); // 渲染器渲染场景和照相机
			window.requestAnimationFrame(render);
		}
		window.requestAnimationFrame(render);
	}, [canvasRef]);

	const resizeHandle = ()=>{
		// 根据窗口大小变化，重新修改渲染器的视锥
		if(rendererRef.current === null || cameraRef.current === null){
			return;
		}
		const canvas = rendererRef.current.domElement;
		cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight;
		cameraRef.current.updateMatrix();
		rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false);
	}

	// 组件首次装载到网页后触发，开始创建并初始化3D场景
	useEffect(()=>{
		createInit(); // 初始化场景、渲染器、照相机。并将网格添加到场景中
		resizeHandle();
		window.addEventListener('resize', resizeHandle);
		return ()=>{
			window.removeEventListener('resize', resizeHandle)
		}
	}, [canvasRef, createInit])

	return <canvas ref={canvasRef}/>
}

export default HelloPrimitives;
```


<img :src="$withBase('/framework/ThreeJS/primitives-result.png')" alt="图元" />


## 图元之3D文字

- 字体文件是一个包含字体轮廓数据的json文件
- FontLoader负责加载字字体数据的类
  
FontLoader类

```javascript
export class FontLoader extends Loader {
    constructor(manager?: LoadingManager);

    load(
        url: string,
        onLoad?: (responseFont: Font) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void,
    ): void;
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<Font>;
    parse(json: any): Font;
}

export class Font {
    constructor(jsondata: any);

    /**
     * @default 'Font'
     */
    type: string;

    data: string;

    generateShapes(text: string, size: number): Shape[];
}
```
FontLoader类：

1. 继承自Loader
2. 构造函数接收一个LoadManager实例
3. 方法load：
   1. url：资源加载地址
   2. onLoaded：加载完成后，触发的事件回调函数
   3. onProgress：加载过程中，触发的事件回调函数
   4. onError：加载失败，触发的事件回调函数
4. 方法parse：用来解析JSON数据，并返回Font实例

Font类：

1. Font类是将原始的字体数据从JSO你转化为Three.js内部可识别的字体数据
2. Font构造函数接收的参数就是JSON数据
3. 属性type默认值是Font
4. 属性data数据类型为字符串，data就是用来保存构造函数中jsondata数据的
5. 方法generatorShapes：根据参数来生成所有的形状

### 1. 原始加载方式

```javascript
	const loader = new FontLoader()
	const url = 'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json';
	const onLoadHandle = (responseFont: Font)=>{
		console.log(responseFont)
	}

	const onProgressHandle = (event: ProgressEvent<EventTarget>) =>{
		console.log(event);
	}

	const onErrorHandle = (error: ErrorEvent) => {
		console.log(error);
	}

	loader.load(url, onLoadHandle, onProgressHandle, onErrorHandle);
```

### 2. 使用async/await

```javascript
const loadFont: (url: string) => Promise<Font> = (url)=>{
  const loader = new FontLoader();
  return new Promise((resolve, reject:(error:ErrorEvent)=> void)=>{
    loader.load(url, resolve, undefined, reject)
  })
}

const createText = async ()=>{
  const url = 'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json';

  const font = await loadFont(url);

  const geometry = new TextGeometry('hello', {
    font: font,
    size: 3.0,
    height: .2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: .3,
    bevelSegments: 5
  });

  const mesh = new Mesh(geometry, createMaterial());

  // Three.js默认是以文字左侧为中心旋转点，下面代码将文字旋转点位置该为文字的中心
  geometry.computeBoundingBox();
  geometry.boundingBox?.getCenter(mesh.position).multiplyScalar(-1);

  const text = new Object3D();
  text.add(mesh);
  return text
}
```