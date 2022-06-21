---
autoGroup-2: Vue深度学习系列
sidebarDepth: 3
title: 5. 【MVVM专题】认识以及实现MVC
---

## MVC

### 1. MVC基本概念
- M：Model 数据模型(也叫模型层) -> 操作数据库（对数据进行增删改查的操作）
- V：View 视图层 -> 显示视图或视图模板
- C：Controller 控制器层 -> 
  1. 这个层面是服务端渲染 - 逻辑层 数据和视图关联挂载和基本的逻辑操作    
View需要数据 -> Controller对应的方法 -> 调用Model的方法 -> 获取数据 -> 返回给Controller对应的方法 -> render到View中
  2. 这个层面是前端渲染  - API层 前端请求的API对应的是控制器中的方法   
前端-> 异步请求URL -> 控制器中的方法 -> Model层的方法 -> 操作数据库 -> 获取数据 -> 返回给控制器方法 -> 响应回前端

### 2. 前端MVC
- Model -> 管理视图所需要的数据 -> 数据与视图关联 
- View -> HTML模板 + 视图渲染
- Controller -> 管理事件逻辑


### 3. 加减乘除计算器
- Model -> data -> 数字a b，加减乘除符号s和结果r   
   watch -> data change -> update view
- View -> 模板template -> 渲染render
- Controller -> 事件触发event trigger -> 更改数据，更更改model中的data（当data被改变的时候我们要去把view给更新了）
controller -> （controller去操作）model -> （mode可以操作）view   
view（去操作数据的话） -> （要通过）controller -> （到）model 【比如input（输入的时候）是不是要把model中的数据更改，它就要触发我们的controller中的某一个事件管理然后去给这个model -> 它其实是MVVM的雏形）


MVVM模型雏形：ViewModel  M data/逻辑  V view   
vue -> 关注于视图渲染  ref -> DOM节点   MV -> ViewModel whatever  
ViewModel -> 收集依赖、模板编译、数据劫持


## 加减乘除计算器

### index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app"></div>

    <script type="text/javascript" src="mvc.js"></script>
</body>

</html>
```

### mvc.js
```javascript
// 立即执行函数
(function() {
    // init函数
    function init() {
        model.init(); // 组织数据 + 数据监听操作 / 数据代理
        view.render(); // 组织HTML模板 + 渲染HTML模板 
        controller.init(); // 事件处理函数的定义与绑定 
    }

    var model = {
      // 管理数据
        data: {
            a: 0,
            b: 0,
            s: '+',
            r: 0
        },
        // 对数据劫持监听
        init: function() {
            var _this = this;

            for (var k in _this.data) {
                (function(k) {
                    Object.defineProperty(_this, k, {

                        get: function() {
                            // model -> a -> get
                            return _this.data[k];
                        },
                        set: function(newValue) {
                            // model.a = 123 -> set
                            _this.data[k] = newValue;
                            // 渲染
                            view.render({
                                [k]: newValue
                            })
                        }
                    })
                })(k);
            }
        }
    }

    var view = {
        el: '#app',
        template: `
        <p>
          <span class="cal-a">{{ a }}</span>
          <span class="cal-s">{{ s }}</span>
          <span class="cal-b">{{ b }}</span>
          <span>=</span>
          <span class="cal-r">{{ r }}</span>
        </p>
        <p>
          <input type="text" placeholder="Number a" class="cal-input a" />
          <input type="text" placeholder="Number b" class="cal-input b" />
        </p>
        <p>
          <button class="cal-btn">+</button>
          <button class="cal-btn">-</button>
          <button class="cal-btn">*</button>
          <button class="cal-btn">/</button>
        </p>
      `,
        render: function(mutedData) {
          // 初始化，没有传入操作数据时
            if (!mutedData) {
              // 直接初始化，把{{}} 替换
                this.template = this.template.replace(
                    /\{\{(.*?)\}\}/g,
                    function(node, key) {
                        return model[key.trim()];
                    }
                )
                // append到页面中去
                var container = document.createElement('div');
                container.innerHTML = this.template;
                document.querySelector(this.el).appendChild(container)
            } else { // 有传入操作数据
                for (var k in mutedData) {
                  // 直接更改mutedData属性中对应的textContent
                    document.querySelector('.cal-' + k).textContent = mutedData[k];
                }
            }

        }
    }

    // 事件处理函数的绑定
    var controller = {
        init: function() {
            var oCalInput = document.querySelectorAll('.cal-input'),
                oCalBtns = document.querySelectorAll('.cal-btn'),
                inputItem,
                btnItem;

            for (var i = 0; i < oCalInput.length; i++) {
                inputItem = oCalInput[i];
                inputItem.addEventListener('input', this.handleInput, false);
            }

            for (var i = 0; i < oCalBtns.length; i++) {
                btnItem = oCalBtns[i];

                btnItem.addEventListener('click', this.handleBtnClick, false);
            }
        },
        handleInput: function(e) {
            var tar = e.target,
                value = Number(tar.value),
                field = tar.className.split(' ')[1];

            model[field] = value;

            // model.r = eval('model.a' + model.s + 'model.b'); // 注意写法
            with(model) {
                r = eval('a' + s + 'b');
            }
        },

        handleBtnClick(e) {
            var type = e.target.textContent;

            model.s = type;

            with(model) {
                r = eval('a' + s + 'b');
            }
        }
    }

    init();

})();
```

## 总结
1. MVC做的事件分成三个部分：数据的管理model、视图的管理view、事件触发的管理controller。然后三个不同的部分去维护它们，然后当数据变更的时候，我们的model可以去调用我们的view上面的render，view在render的时候它是不管数据的变更的。因为我们的controller是在绑定时间处理函数以后它会去更改model，所以说我们完成了controller去更改model以后view更改。
2. MVC实际上就是MVVM的雏形。
3. MVVM ViewModel M data（原来的controller下面的事件处理函数归并到我们M层去了，data是有自己的逻辑的，M层只会操作data，不会去操作DOM，因为DOM的操作交给ViewModel去做了）V view， MVVM并没有明确的C层，因为C层的东西ViewModel帮你做了。
4. MVVM是解决了它的驱动不集中、不内聚的方式，它更加解决视图与模型之间完全隔离开来这样的一种关系。
5. Vue是关注于视图渲染，可以通过逻辑直接操作视图的，因为vue提供了一个ref可以直接操作DOM节点的。