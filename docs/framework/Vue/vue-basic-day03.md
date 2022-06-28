---
autoGroup-1: Vue
sidebarDepth: 3
title: 生命周期函数
---

## 生命周期函数

生命周期钩子函数：Vue实例再某一个时间点会自动执行的函数。
```html
<body>
    <div id="root"></div>

    <script type="text/javascript">
        const vm = new Vue({
                el: '#root',
                data() {
                    return {
                        content: 123
                    }
                },
                template: `<h1>{{content}}</h1>`,
                beforeCreate: function() {
                    console.log('beforeCreate');
                },
                created: function() {
                    console.log('create');
                },
                beforeMount: function() {
                    console.log('beforeMount');
                },
                mounted: function() {
                    console.log('mounted');
                },
                // 执行vm.$destroy()，后面两个钩子函数beforeDestroy和destroyed会执行
                beforeDestroy: function() {
                    console.log('beforeDestroy');
                },
                destroyed: function() {
                    console.log('destroyed');
                },
                // 执行vm.$data.content = 456，会执行钩子函数beforeUpdate和updated
                beforeUpdate: function() {
                    console.log('beforeUpdate');
                },
                updated: function() {
                    console.log('updated');
                }
            })
            /**
             * beforeCreate
             * create
             * beforeMount
             * mounted
             */
    </script>
</body>
```

## 生命周期流程图
<img :src="$withBase('/framework/Vue/生命周期函数.png')" alt="生命周期函数" />

### 具体分析
#### beforeCreate -> created
- 1. 初始化vue实例，进行数据观测

#### created
- 1. 完成数据观测、属性和方法的运算，watch、event事件回调的配置
- 2. 可调用method中的方法，访问和修改data数据触发响应式渲染dom，可通过computed和watch完成数据计算
- 3. 此时vm.$el并没有被创建
- 4. 一般在created中进行ajax请求

#### created -> beforeMount
- 1. 判断是否存在el选项，若不存在则停止编译，直到调用vm.$mount(el)才会继续编译
- 2. 优先级：render > template > outerHTML
- 3. vm.el获取到的是挂载DOM的HTML

#### beforeMount
- 1. 此阶段可获取到vm.el
- 2. 此阶段vm.el虽已完成DOM初始化，但未挂载到el选项上

#### beforeMount -> mounted
- 1. 此阶段vm.el完成挂载，vm.$el生成的DOM替换了el选项所对应的DOM

#### mounted
- 1. vm.el完成DOM挂载与渲染，此刻打印vm.$el，发现之前的挂载点及内容已被替换成新的DOM

#### beforeUpdate
- 1. 更新的数据必须是被渲染在模板上的(el、template、render之一)
- 2. 此时view层还未更新
- 3. 若在beforeUpdate中再次修改数据，不会再次触发更新方法

#### update
- 1. 完成view层的更新
- 2. 若在update中再次修改数据，会再次触发更新方法（beforeUpdate、update）

#### beforeDestroy
- 1. 实例被销毁前调用，此时实例属性和方法仍可访问

#### destroyed
- 1. 完全销毁一个实例。可清理它与其他实例的连接，解绑它的全部指令及事件监听器
- 2. 并不能清除DOM，仅仅销毁实例