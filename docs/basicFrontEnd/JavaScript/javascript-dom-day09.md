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


