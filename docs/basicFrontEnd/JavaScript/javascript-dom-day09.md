---
autoGroup-3: DOM
sidebarDepth: 3
title: day09
---

## 拖拽
拖拽边界。
```js
Element.prototype.dragNclick = (function(elemClick) {
    // 鼠标按下和抬起的时间
    var bTime = 0,
        eTime = 0,
        oPos = [], // 记录点击前的位置
        wWidth = getViewportSize().width,
        wHeight = getViewportSize().height,
        elemWidth = getStyles(this, 'width'),
        elemHeight = getStyles(this, 'height');

    drag.call(this);

    function drag() {
        var x,
            y,
            _self = this;


        addEvent(_self, 'mousedown', function() {
            var e = e || window.event;
            bTime = new Date().getTime(); // 获取时间戳
            oPos = [getStyles(_self, 'left'), getStyles(_self, 'top')]

            x = pagePos(e).X - getStyles(_self, 'left');
            y = pagePos(e).Y - getStyles(_self, 'top');

            addEvent(document, 'mousemove', mouseMove);
            addEvent(document, 'mouseup', mouseUp);
            cancelBubble(e);
            preventDefaultEvent(e);
        });

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

            if (eTime - bTime < 300) {
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
## 右击打开菜单
菜单打开的位置。
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
