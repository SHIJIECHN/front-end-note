---
autoGroup-3: DOM
sidebarDepth: 3
title: 9. 鼠标事件深入、点击和拖拽分离、双击事件
---

## 鼠标点击抬起的顺序问题
顺序: mousedown > mouseup > click   
即： mousedown + mouseup = click。当执行鼠标落下和鼠标抬起事件之后就相当于执行一次点击事件。
```javascript
var oBtn = document.getElementsByTagName("button")[0];
oBtn.onclick = function () {
  console.log("click");
};

oBtn.onmousedown = function () {
  console.log("mousedown");
};

oBtn.onmouseup = function () {
  console.log("mouseup");
};
// mousedown mouseup click
```

## 拖拽边界
判断思路：
1. 当前元素的坐标(左上角) >= 可视区域的宽度/高度 - 当前元素的宽度/高度
2. 如果当前元素的坐标x/y <= 0，那么x/y = 0
3. 如果当前元素的坐标x/y >= 可视区域的宽度/高度 -  当前元素的宽度/高度。那么x/y = 可视区域的宽度/高度 - 当前元素的宽度/高度。

```js
if(x <= 0) {
    x = 0;
} else if(x >= clientX - eWidth) {
    x = clientX - eWidth;
}

if(y <= 0) {
    y = 0;
} else if(y >= clientY - eHeight) {
    y = clientY - eHeight;
}
```

## 鼠标拖拽功能带单击事件
- 功能1：拖拽    
- 功能2：点击可以跳转   

1. 拖拽和点击如何分离：记录时间前后，新增一个点击事件。
2. 拖拽和点击同时存在：记录原来的位置。
3. this指向问题：call和缓存_self
4. 边缘问题：记录边界坐标根据边缘计算
```js
Element.prototype.dragNclick = (function(elemClick) {
    // 鼠标按下和抬起的时间
    var bTime = 0,
        eTime = 0,
        oPos = [], // 记录点击前的位置
        wWidth = getViewportSize().width, // 可视区域的宽度
        wHeight = getViewportSize().height, // 可视区域的高度
        elemWidth = getStyles(this, 'width'), // 盒子的宽度
        elemHeight = getStyles(this, 'height'); // 盒子的高度

    // 执行drag
    drag.call(this);

    function drag() {
        var x,
            y,
            _self = this;


        addEvent(_self, 'mousedown', function() {
            var e = e || window.event;
            bTime = new Date().getTime(); // 获取按下的时间戳
            // 记录原来的位置
            oPos = [getStyles(_self, 'left'), getStyles(_self, 'top')]
            // 盒子边缘到盒子内部鼠标的位置
            x = pagePos(e).X - getStyles(_self, 'left');
            y = pagePos(e).Y - getStyles(_self, 'top');

            addEvent(document, 'mousemove', mouseMove);
            addEvent(document, 'mouseup', mouseUp);
            // 去掉冒泡和默认事件
            cancelBubble(e);
            preventDefaultEvent(e);
        });

        function mouseMove(e) {
            var e = e || window.event,
                // 移动过程中，盒子到页面边缘的距离
                elemLeft = pagePos(e).X - x,
                elemTop = pagePos(e).Y - y;
            // 到达边缘的情况
            // 靠左边缘
            if (elemLeft <= 0) {
                elemLeft = 0;
            } else if (elemLeft >= wWidth - elemWidth) {
                // 靠右边缘
                elemLeft = wWidth - elemWidth - 1;
            }
            // 靠顶边缘
            if (elemTop <= 0) {
                elemTop = 0;
            } else if (elemTop >= wHeight - elemHeight) {
                // 考下边缘
                elemTop = wHeight - elemHeight - 1;
            }
            // 盒子到页面边缘的距离 = 页面坐标 - 盒子边缘到盒子内部坐标的位置
            _self.style.left = elemLeft + 'px';
            _self.style.top = elemTop + 'px';
        }

        function mouseUp(e) {
            var e = e || window.event;
            // 记录鼠标抬起时间戳
            eTime = new Date().getTime();

            // 结束时间 - 开始时间 < 100ms为点击事件
            if (eTime - bTime < 100) {
                _self.style.left = oPos[0] + 'px';
                _self.style.top = oPos[1] + 'px';
                //除了拖拽操作，还能点击链接跳转
                //执行dragNclick函数传过来的参数
                elemClick();
            }
            removeEvent(document, 'mousemove', mouseMove);
            removeEvent(document, 'mouseup', mouseUp);
        }
    }
});

//执行函数另外传一函数作为参数
function dragNclick(oLink, function () {
  window.open('http://www.baidu.com');
});
```



## 右击打开菜单
菜单打开的位置。    
右击问题：e.button 左中右（0/1/2） IE10及以下不兼容
```js
Element.prototype.dragNclick = (function(menu, elemClick) {
    // 鼠标按下和抬起的时间
    var bTime = 0,
        eTime = 0,
        oPos = [], // 记录点击前的位置
        wWidth = getViewportSize().width,
        wHeight = getViewportSize().height,
        elemWidth = getStyles(this, 'width'),
        elemHeight = getStyles(this, 'height'),
        mWidth = getStyles(menu, 'width'),
        mHeight = getStyles(menu, 'height');

    drag.call(this);

    function drag() {
        var x,
            y,
            _self = this;


        addEvent(_self, 'mousedown', function(e) {
            var e = e || window.event,
                // 记录按键编码
                btnCode = e.button; // 鼠标左中右： 0， 1， 2

            // 右键
            if (btnCode === 2) {
                // 右键盒子的
                var mLeft = pagePos(e).X,
                    mTop = pagePos(e).Y;

                // 打开一个菜单
                if (mLeft <= 0) {
                    mLeft = 0;
                } else if (mLeft >= wWidth - mWidth) {
                    mLeft = pagePos(e).X - mWidth;
                }

                if (mTop <= 0) {
                    mTop = 0;
                } else if (mTop >= wHeight - mHeight) {
                    mTop = pagePos(e).Y - mHeight;
                }

                menu.style.left = mLeft + 'px';
                menu.style.top = mTop + 'px';
                menu.style.display = 'block'
            } else if (btnCode === 0) {
                bTime = new Date().getTime(); // 获取时间戳
                oPos = [getStyles(_self, 'left'), getStyles(_self, 'top')];
                menu.style.display = 'none';

                x = pagePos(e).X - getStyles(_self, 'left');
                y = pagePos(e).Y - getStyles(_self, 'top');

                addEvent(document, 'mousemove', mouseMove);
                addEvent(document, 'mouseup', mouseUp);
                cancelBubble(e);
                preventDefaultEvent(e);
            }


        });

        addEvent(document, 'contextmenu', function(e) {
            var e = e || window.event;
            preventDefaultEvent(e);
        })

        addEvent(document, 'click', function(e) {
            menu.style.display = 'none';
        })

        addEvent(menu, 'click', function(e) {
            var e = e || window.event;
            cancelBubble(e);
        })

        function mouseMove(e) {
            var e = e || window.event,
                elemLeft = pagePos(e).X - x,
                elemTop = pagePos(e).Y - y;

            if (elemLeft <= 0) {
                elemLeft = 0;
            } else if (elemLeft >= wWidth - elemWidth) {
                elemLeft = wWidth - elemWidth - 1;
            }

            if (elemTop <= 0) {
                elemTop = 0;
            } else if (elemTop >= wHeight - elemHeight) {
                elemTop = wHeight - elemHeight - 1;
            }

            _self.style.left = elemLeft + 'px';
            _self.style.top = elemTop + 'px';
        }

        function mouseUp(e) {
            var e = e || window.event;
            eTime = new Date().getTime();

            if (eTime - bTime < 100) {
                _self.style.left = oPos[0] + 'px';
                _self.style.top = oPos[1] + 'px';
                elemClick();
            }
            removeEvent(document, 'mousemove', mouseMove);
            removeEvent(document, 'mouseup', mouseUp);
        }
    }
});
```

## 双击
双击跳转。
```js
Element.prototype.dragNclick = (function(menu, elemClick) {
    // 鼠标按下和抬起的时间
    var bTime = 0,
        eTime = 0,
        cbTime = 0,
        ceTime = 0,
        counter = 0,
        t = null,
        oPos = [], // 记录点击前的位置
        wWidth = getViewportSize().width,
        wHeight = getViewportSize().height,
        elemWidth = getStyles(this, 'width'),
        elemHeight = getStyles(this, 'height'),
        mWidth = getStyles(menu, 'width'),
        mHeight = getStyles(menu, 'height');

    drag.call(this);

    function drag() {
        var x,
            y,
            _self = this;


        addEvent(_self, 'mousedown', function(e) {
            var e = e || window.event,
                btnCode = e.button; // 鼠标左中右： 0， 1， 2

            if (btnCode === 2) {
                var mLeft = pagePos(e).X,
                    mTop = pagePos(e).Y;

                if (mLeft <= 0) {
                    mLeft = 0;
                } else if (mLeft >= wWidth - mWidth) {
                    mLeft = pagePos(e).X - mWidth;
                }

                if (mTop <= 0) {
                    mTop = 0;
                } else if (mTop >= wHeight - mHeight) {
                    mTop = pagePos(e).Y - mHeight;
                }

                menu.style.left = mLeft + 'px';
                menu.style.top = mTop + 'px';
                menu.style.display = 'block'
            } else if (btnCode === 0) {
                bTime = new Date().getTime(); // 获取时间戳
                oPos = [getStyles(_self, 'left'), getStyles(_self, 'top')];
                menu.style.display = 'none';

                x = pagePos(e).X - getStyles(_self, 'left');
                y = pagePos(e).Y - getStyles(_self, 'top');

                addEvent(document, 'mousemove', mouseMove);
                addEvent(document, 'mouseup', mouseUp);
                cancelBubble(e);
                preventDefaultEvent(e);
            }


        });

        addEvent(document, 'contextmenu', function(e) {
            var e = e || window.event;
            preventDefaultEvent(e);
        })

        addEvent(document, 'click', function(e) {
            menu.style.display = 'none';
        })

        addEvent(menu, 'click', function(e) {
            var e = e || window.event;
            cancelBubble(e);
        })

        function mouseMove(e) {
            var e = e || window.event,
                elemLeft = pagePos(e).X - x,
                elemTop = pagePos(e).Y - y;

            if (elemLeft <= 0) {
                elemLeft = 0;
            } else if (elemLeft >= wWidth - elemWidth) {
                elemLeft = wWidth - elemWidth - 1;
            }

            if (elemTop <= 0) {
                elemTop = 0;
            } else if (elemTop >= wHeight - elemHeight) {
                elemTop = wHeight - elemHeight - 1;
            }

            _self.style.left = elemLeft + 'px';
            _self.style.top = elemTop + 'px';
        }

        function mouseUp(e) {
            var e = e || window.event;
            eTime = new Date().getTime();

            console.log('eTime - bTime: ' + ((eTime - bTime) < 100));
            if ((eTime - bTime) < 100) {
                _self.style.left = oPos[0] + 'px';
                _self.style.top = oPos[1] + 'px';

                counter++;
                console.log('======================counter: ' + counter + '=======================');
                if (counter === 1) {
                    cbTime = new Date().getTime();
                }

                if (counter === 2) {
                    ceTime = new Date().getTime();
                }

                console.log('cbTime : ' + cbTime);
                console.log('ceTime : ' + ceTime);
                console.log('ceTime - cbTime: ' + ((ceTime - cbTime) < 300));
                if (cbTime && ceTime && (ceTime - cbTime < 200)) {
                    elemClick();
                }

                t = setTimeout(function() {
                    cbTime = 0;
                    ceTime = 0;
                    counter = 0;
                    clearTimeout(t);
                }, 500);

            }
            removeEvent(document, 'mousemove', mouseMove);
            removeEvent(document, 'mouseup', mouseUp);
        }
    }
});
```

## 鼠标拖拽功能带单双击功能
思路：
1. 图标实现拖拽其实和封装的拖拽函数的思路相同
2. 实现单击事件跳转页面问题,通过记录鼠标落下的时间戳和鼠标抬起的时间戳,二者相减,如果时间差小于300ms就是单击事件,通过回调函数的方式,执行跳转页面的扩展功能.
3. 实现双击事件,创建couter变量和记录两次鼠标抬起事件的时间戳,如果二者相减,时间戳小于200ms就是双击事件,执行双击事件需要实现的效果
```javascript
/**
 * 模块：鼠标拖拽功能带单双击事件(原型)
 * 功能一：拖拽
 * 功能二：点击可以跳转链接
 * 
 * 解决现象：拖拽和点击如何分离
 * 解决方案：记录时间前后，新增一个点击事件
 * 
 * 解决现象：拖拽和点击同时存在
 * 解决方案：记录原来位置
 * 
 * 解决现象：this指向问题
 * 解决方案：call和缓存_self
 * 
 * 解决现象：边缘问题
 * 解决方案：记录边界坐标根据边缘计算
 * 
 * 解决现象：右键问题
 * 解决方案：e.button 左中右(0/1/2) IE10及以下不兼容
 * 
 * 解决现象：双击问题
 * 解决方案：记录双击时间
 */


var oLink = document.getElementsByTagName('a')[0],
  oMenu = document.getElementsByTagName('div')[0];

Element.prototype.dragNclick = (function (elemClick, menu) {
  //记录时间
  var bTime = 0,
    eTime = 0,
    //双击开始时间
    cbTime = 0,
    //双击结束时间
    ceTime = 0,
    //双击次数
    counter = 0,
    //计时器
    t = null,
    //记录坐标
    oPos = [],
    //可视窗口宽度
    wWidth = getViewportSize().width,
    //可视窗口高度
    wHeight = getViewportSize().height,
    //块元素的宽度
    eleWidth = getStyles(this, 'width'),
    //块元素的高度
    eleHeight = getStyles(this, 'width'),
    //右键盒子的宽度
    mWidth = getStyles(menu, 'width'),
    //右键盒子的高度
    mHeight = getStyles(menu, 'height');

  // console.log(this); //a
  drag.call(this);

  function drag() {
    var x,
      y,
      _self = this;
    // console.log(this); //window -> call -> a

    addEvent(this, 'mousedown', function (e) {
      var e = e || window.event,
        //记录按键编码
        btnCode = e.button;
      // console.log(this); //a from drag(AO)
      //右键
      if (btnCode === 2) {
        // 对当前右键的临界点进行处理
        var mLeft = pagePos(e).X,
          mTop = pagePos(e).Y;
        //打开一个菜单
        if (mLeft <= 0) {
          mLeft = 0;
        } else if (mLeft >= wWidth - mWidth) {
          mLeft = pagePos(e).X - mWidth;
        }
        if (mTop <= 0) {
          mTop = 0;
        } else if (mTop >= wHeight - mHeight) {
          mTop = pagePos(e).Y - mHeight;
        }
        menu.style.left = mLeft + 'px';
        menu.style.top = mTop + 'px';
        menu.style.display = 'block';
      } else if (btnCode === 0) {
        //左键
        //记录鼠标按下时间戳
        bTime = new Date().getTime();
        //记录原来的位置
        oPos = [getStyles(_self, 'left'), getStyles(_self, 'top')];
        // 鼠标左键。隐藏菜单栏
        menu.style.display = 'none';
        //盒子边缘到盒子内部鼠标位置 = 页面坐标 - 盒子坐标
        x = pagePos(e).X - getStyles(_self, 'left');
        y = pagePos(e).Y - getStyles(_self, 'top');
        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);
        //去掉冒泡和默认事件
        cancelBubble(e);
        preventDefaultEvent(e);
      }
    })

    // 取消鼠标右键的默认行为
    addEvent(document, 'contextmenu', function (e) {
      var e = e || window.e;
      // 取消鼠标右键的默认行为
      preventDefaultEvent(e);
    })

    //右键盒子以外区域点击会隐藏该盒子
    addEvent(document, 'click', function (e) {
      menu.style.display = 'none';
    })

    //取消当前盒子的冒泡行为
    addEvent(menu, 'click', function (e) {
      var e = e || window.e;
      // 阻止冒泡
      cancelBubble(e);
    })

    // 鼠标移动函数
    function mouseMove(e) {
      var e = e || window.event,
        //移动后的元素坐标
        eleLeft = pagePos(e).X - x,
        eleTop = pagePos(e).Y - y;
      //到达边缘的情况
      //靠左边缘
      if (eleLeft <= 0) {
        eleLeft = 0;
      } else if (eleLeft >= wWidth - eleWidth) {
        //靠右边缘
        eleLeft = wWidth - eleWidth - 1;
      }
      //到达边缘的情况
      //靠顶边缘
      if (eleTop <= 0) {
        eleTop = 0;
      } else if (eleTop >= wHeight - eleHeight) {
        //靠下边缘
        eleTop = wHeight - eleHeight - 1;
      }
      //盒子到页面边缘距离 = 页面坐标 - 盒子边缘到盒子内部鼠标位置
      _self.style.left = eleLeft + 'px';
      _self.style.top = eleTop + 'px';

    }

    // 鼠标抬起事件
    function mouseUp(e) {
      var e = e || window.event;
      //记录鼠标抬起时间戳
      eTime = new Date().getTime();
      //结束时间 - 开始时间 < 100ms 为点击事件
      if (eTime - bTime < 100) {
        //把记录好的坐标在点击时显示
        _self.style.left = oPos[0] + 'px';
        _self.style.top = oPos[1] + 'px';
        // 是处理双击点击事件,跳转网页,执行回调函数
        counter++;
        //第一次时 点击第一次
        if (counter === 1) {
          cbTime = new Date().getTime();
        }
        //第二次时 点击第二次
        if (counter === 2) {
          ceTime = new Date().getTime();
        }
        //证明双击了
        if (cbTime && ceTime && (ceTime - cbTime < 200)) {
          //除了拖拽操作，还能点击链接跳转
          elemClick();
        }
        // 处理点击一次后不再点击的bug,延时一定时间后恢复原始值
        t = setTimeout(function () {
          cbTime = 0;
          ceTime = 0;
          counter = 0;
          clearTimeout(t)
        }, 500)
      }
      // 取消事件
      removeEvent(document, 'mousemove', mouseMove);
      removeEvent(document, 'mouseup', mouseUp);
    }
  }
});

//执行函数另外传一函数作为参数
oLink.dragNclick(function () {
  window.open('http://www.baidu.com');
}, oMenu);
```


## 多人开发
模块开发：init是用给外界调用初始化的，bindEvent绑定事件处理函数的
```js
;
(function() {
    var Test = function(opt) {

    }

    Test.prototype = {
        // 不是马上启用，必须要有init()方法，在用的时候new Test({opt}).init();
        init: function() {

        },
        // 所有的事件处理函数
        bindEvent: function(){

        }
    }
}())
```

案例
```html
<body>
    <input type="text" id="num1">
    <input type="text" id="num2">

    <div class="btn-group">
        <button data-sign="plus">+</button>
        <button data-sign="minus">-</button>
        <button data-sign="mul">*</button>
        <button data-sign="div">/</button>
    </div>
    <script type="text/javascript" src="js/utils.js"></script>
    <script type="text/javascript" src="js/index.js"></script>
    <script>
        new Test({
            num1: document.getElementById('num1'),
            num2: document.getElementById('num2'),
            btnGroup: document.getElementsByClassName('btn-group')[0]
        }).init();
    </script>
</body>
```
index.js
```js
;
(function() {
    var Test = function(opt) {
        this.num1 = opt.num1;
        this.num2 = opt.num2;
        this.btnGroup = opt.btnGroup;
    }

    Test.prototype = {
        // 不是马上启用，必须要有init()方法，在用非时候new Test({opt}).init();
        init: function() {
            this.bindEvent();
        },
        // 所有的事件处理函数
        bindEvent: function() {
            var btns = this.btnGroup,
                _self = this;
            addEvent(btns, 'click', function(e) {
                _self.compute.call(_self, e);
            });
        },
        compute: function(e) {
            var e = e || window.event,
                tar = e.target || e.srcElement,
                val1 = Number(this.num1.value),
                val2 = Number(this.num2.value),
                btns = this.btnGroup,
                sign = tar.getAttribute('data-sign');

            switch (sign) {
                case 'plus':
                    console.log(val1 + val2);
                    break;
                case 'minus':
                    console.log(val1 - val2);
                    break;
                case 'mul':
                    console.log(val1 * val2);
                    break;
                case 'div':
                    console.log(val1 / val2);
                    break;
                default:
                    console.log('出错了');
            }

        }
    }

    window.Test = Test;
}())
```
