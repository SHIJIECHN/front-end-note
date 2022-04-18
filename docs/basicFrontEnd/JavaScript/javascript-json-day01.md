---
autoGroup-4: JSON
sidebarDepth: 3
title: day01
---

## 方法
JSON.parse()：将字符串转成json数据。    
JSON.stringify()：将json对象转换成字符串。

## 模板替换渲染
学生画册
1. 外层都有一个cover 100%的盒子，可以设置背景。
2. 设置position：absolute;元素自动变成行内块级。
3. ul可以稍微放宽一些
4. 布局复杂，不使用响应式。


模板使用
1. 函数中定义字符串拼接方式
```js
function render() {
    var data = JSON.parse(jsonData),
        len = data.length,
        oList = document.getElementsByClassName('js-list')[0],
        list = '',
        item;

    for (var i = 0; i < len; i++) {
        item = data[i];

        list += tpl(item);
    }
    oList.innerHTML = list;
}

// 模板：返回的是字符串
function tpl(data) {
    return (
        '<li class="list-item">' +
        '<div class="mask">' +
        '<h3>' + data.career + '（' + data.city + '）' + '</h3>' +
        '<p>' + data.salary + '</p>' +
        '</div>' +
        '<img src="img/student/' + data.img + '" alt="" />' +
        '</li>'
    );
}
```

2. 在HTML文件中，使用script标签或者div标签保存模板。一般使用div保存数据，script保存模板。
```html
<body>
    <div id="tpl" style="display: none;">
        <!-- 但是一般保存缓存的JSON数据 -->
    </div>

    <!-- script标签中的type不能写成text/javascript，其他任意写 -->
    <script type="text/html" id="J_tpl">
        <li class="list-item">
            <div class="mask">
                <h3>{{career}}(city)</h3>
                <p>月薪{{salary}}K</p>
            </div>
            <img src="img/student/{{img}}" alt="" />
        </li>
    </script>
</body>
```

使用replace
```js
/**
 * regExp 正则
 * node 关键点
 * 
 * 根据正则匹配出括号{{}}中的key值
*/
replace(regExp, function(node, key){

})
```
模板匹配
```js

for (var i = 0; i < data.length; i++) {
    item = data[i];

    // list += tpl(item);
    list += setTplToHtml(tpl, regTpl, {
        career: item.career,
        city: item.city,
        salary: item.salary,
        img: item.img
    })
}

// tpl: 模板， regExp：匹配规则， opt：{{..}}中的key值
function setTplToHtml(tpl, regExp, opt) {
    //function(node, key) 将所有的node都循环一遍，拿出opt[key]的值
    return tpl.replace(regExp(), function(node, key) {
        console.log(node, key);
        /**
         * opt[key]：根据key取出opt中对应的值也即
         * {
         *     ... 
         * }[key]
         */
        return opt[key];
    })
}


// 匹配模板中的{{...}}
function regTpl() {
    return new RegExp(/{{(.*?)}}/, 'gim')
}


```

## 缓存池技术

在js中定义一个缓存池
```js
var cache = {};
```
请求到数据就往里面放，点击某个按钮的时候，就到缓存池中找相应的数据是否存在，存在就直接取值。
```js
if (cache[page]) {
    getCacheCourses();
} else {
    getAjaxCourse();
}
```
缓存池更新：设置定时器，清空缓存池。

两栏设计

