---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 第一个3D场景
---


## Three.js基础元素

基础三大元素：
1. 渲染器：如WebGLRender
2. 透视镜头：如PerspectiveCamera
3. 场景：Scene

场景可见元素：
1. 几何体：如BoxGeometry（立方体)
2. 几何体的材质（颜色、光亮程度）：如MeshBasicMaterial或MeshPhongMaterial
3. 网格：Mesh
4. 光源：DirectionalLight（平行光源）

## 绘制一个立方体

```javascript
const HelloWorld: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const width = window.innerWidth - 325;
	const height = window.innerHeight - 20;

	useEffect(() => {
		start();
	}, []);

	const start = () => {
		if (canvasRef.current) {
			// 1. 初始化场景：添加场景、照相机、renderer渲染器
			// ===================================================================
			// 创建场景
			const scene = new Scene();
			// 设置相机（视野，显示的宽高比，近裁剪面，远裁剪面）
			const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
			// 渲染器
			const renderer = new WebGLRenderer({ canvas: canvasRef.current });
			// 设置渲染器的高度和宽度，如果加上第三个值false，则按场景大学奥显示，等比例缩放
			renderer.setSize(width, height);
			// 将render渲染器的dom元素（render.domElement）添加到html文档中，这是渲染器用来显示场景的canvas元素

			// 2. 添加立方体
			// ====================================================================
			// 盒子模型（BoxGeometry）这是一个包含立方体所有顶点和填充颜色的对象
			const geometry = new BoxGeometry(1, 1, 1);
			// 使用网孔基础材料（MeshBasicMaterial）进行着色器，这里只绘制一个而绿色
			const material = new MeshBasicMaterial({ color: 0x00ff00 });
			// 使用网孔（Mesh）来承载几何模型
			const cube = new Mesh(geometry, material);
			// 将模型添加到场景中
			scene.add(cube);
			// 将相机沿z轴偏移5
			camera.position.z = 5;

			// 3. 渲染场景
			// ====================================================================
			// 设置一个动画函数
			const render = (time: number) => {
				time = time * 0.001;
				// 一秒钟调用60次，也就是以每秒60帧的频率来绘制场景
				// 每次调用模型的沿xy轴旋转0.01
				cube.rotation.x = time;
				cube.rotation.y = time;
				//使用渲染器把场景和相机都渲染出来
				renderer.render(scene, camera);
				requestAnimationFrame(render);
			};

			requestAnimationFrame(render);
		}
	};

	return <canvas ref={canvasRef} />;
};
```

::: theorem PerspectiveCamera中的4个参数
1. fov（field of view）：可选参数。默认值为50，指垂直向上的角度，注意该值是度数而不是弧度
2. aspect：可选参数，默认值为1，画布的宽高比（宽/高）
3. near：可选参数。默认值为0.1，近平面，限制摄像机可绘制最近的距离，若小于该距离则不会绘制（相当于被裁剪切掉）
4. far：可选参数，默认值为2000，远平面，显示摄像机可绘制最远的距离，若超过该距离则不会绘制

以上4个参数在一起，构成“视锥”。
:::

## 改进

仅在浏览器窗口尺寸发生resize事件时去修改渲染器。

1. 监听浏览器窗口的尺寸变化，对应的时window.addEventListener('resize', xxx)
2. 当React卸载后，一定记得移除监听window.removeEventListener('resize', xxx)
3. 使用useRef创建一个变量指向事件处理函数，这样才可以在移除监听时找到resize事件处理函数

