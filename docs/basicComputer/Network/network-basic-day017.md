---
autoGroup-1: 网络基础
sidebarDepth: 3
title: Cookie
---

## Cookie
无状态的 -> 有状态： 会话（session）和cookies。


跟踪用户：
1. http headers：referer、
2. IP地址
3. 用户登录
4. Cookies：服务器发送给用户浏览器并保存在本地的一小块数据


增加和删除cookie：
```js
var d = new Date(),
    day = d.getDate();

// 设置cookie
d.setDate(day + 10); // 10天以后
document.cookie = 'name=xiaohong;expores='+d; // 设置cookie
document.cookie = 'age=18'; // 多个cookie需要逐条设置
document.cookie = 'name=xiaolan'; //重复设置，会覆盖前面的

// 删除cookie
d.setDate(day -10);
document.cookie = 'name=xiaoxiao'; // 不会设置成功
```

封装增删查：
```js
var manageCookie = {
    // 增
    set: function(key, value, expTime) {
        document.cookie = key + '=' + value + ';max-age=' + expTime;
        return this; // 链式调用
    },
    // 删
    delete: function(key) {
        return this.set(key, '', -1);
    },
    // 查
    get: function(key, cb) {
        var CookiesArray = document.cookie.split(';');

        for (var i = 0; i < CookiesArray.lenght; i++) {
            var CookieItem = CookiesArray[i],
                CookieItemArray = CookieItem.split('=');
            if (CookieItemArray[0] === key) {
                cb(CookieItemArray[1]);
                return this;
            }

        }
        cb(undefined);
        return this;
    }
}

manageCookie.set('name', 'xiaohong', 2000)
    .set('age', 19, 2000)
    .delete('name')
    .get('age', function(data) {
        console.log(data);
    })
```

## 表单基础
```html
<body>
    <form action="server/b1.php" method="post">
        <!--输入类型-->
        <input type="text" name="username" placeholder="用户名" />
        <br />
        <input type="password" name="password" placeholder="密码" />
        <br />
        <!--开放标签和闭合标签之间不能有回车-->
        <textarea name="intro"></textarea>
        <br />

        <!--选项类型-->
        <input type="radio" name="sex" value="male" checked="checked" /> 男
        <input type="radio" name="sex" value="female" /> 女
        <br />

        <input type="checkbox" name="hobby[]" value="fb" />足球
        <input type="checkbox" name="hobby[]" value="bb" />蓝球
        <input type="checkbox" name="hobby[]" value="golf" />高尔夫球
        <br />

        <select name="occupation" id="">
            <option value="fe">前端</option>
            <option value="be">后端</option>
        </select>

        <!--按钮类型-->
        <input type="submit" value="提交" />
        <input type="reset" value="重置" />

        <!--语义化标签-->
        <button type="submit">提交</button>
        <button type="reset">重置</button>

    </form>
</body>
```
注意：文件需要放到www文件夹中运行才能正常使用server/b1.php文件。
b1.php
```php
<?php
    header("content-type:text/html;charset=utf-8");

    echo '用户名：' . $_POST['username'] . '<br />';
    echo '密码：' . $_POST['password'] . '<br />';
    echo '介绍' . $_POST['intro'] . '<br />';
    echo '性别：' . $_POST['sex'] . '<br />';

    for($i = 0; $i < count($_POST['hobby']); $i++){
        echo '爱好：'. $_POST['hobby'][$i].'<br />';
    }

    echo '职业：'. $_POST['occupation'].'<br />';
?>
```

## 阻止默认表单提交   
同步提交的坏处：跳转页面，只有跳转到服务器的页面，页面才会执行 -> 这样导致前端没法验证表单数据的合法性。    
前端验证给用户看，安全在后端做。   

异步提交表单：先在前端验证是否合法。

取消默认表单提交：onsubmit: return false； 只认boolean值，任何的0，undefined, null等都会提交。  
阻止默认表单的提交，先执行onsubmit中的程序，然后再进行表单的提交。如果onsubmit返回false，那么默认表单将不会提交。
```html
<body>
    <form action="server/b3.php" method="post" onsubmit="return false">
        <!--输入类型-->
        <input type="text" name="username" placeholder="用户名" />
        <br />
        <input type="password" name="password" placeholder="密码" />
        <br />

        <button type="submit">提交</button>

    </form>
</body>
```

取消默认行为：e.preventDefault()
```html
<body>
    <form action="server/b3.php" method="post">
        <!--输入类型-->
        <input type="text" name="username" placeholder="用户名" />
        <br />
        <input type="password" name="password" placeholder="密码" />
        <br />

        <button type="submit" id="J_submitBtn">提交</button>
    </form>
    <script>
        var oSubmitBtn = document.getElementById('J_submitBtn');
        oSubmitBtn.onclick = function() {
            var e = e || window.event;
            e.preventDefault();
            console.log(22);
        }
    </script>
</body>
```
异步表单提交正确方式：
```html
<body>
    <form action="server/b3.php" method="post" id="J_Form">
        <!--输入类型-->
        <input type="text" id="J_username" placeholder="用户名" />
        <br />
        <input type="password" id="J_password" placeholder="密码" />
        <br />

        <button type="submit" class="J_submitBtn">提交</button>
    </form>
    <script src="js/utils.js"></script>
    <script>
        var oUserName = document.getElementById('J_username'),
            oPassword = document.getElementById('J_password'),
            oSubmitBtn = document.getElementsByClassName('J_submitBtn')[0],
            submitURL = document.getElementById('J_Form').action;


        oSubmitBtn.onclick = function(e) {
            var e = e || window.event;
            e.preventDefault();

            var username = oUserName.value,
                password = oPassword.value;

            if (username.length < 6 || username.length > 20) {
                alert('用户名6-20位');
                return;
            }
            if (password.length < 6 || password.length > 20) {
                alert('密码6-20位');
                return;
            }

            alert('前端校验输入合法，提交后端校验');

            xhr.ajax({
                url: submitURL,
                type: 'POST',
                dataType: 'TEXT',
                data: {
                    username: username,
                    password: password
                },
                success: function(data) {
                    alert(data);
                }
            })
        }
    </script>
</body>
```
b3.php
```php

<?php

if(strlen($_POST['username']) < 6 || strlen($_POST['username']) > 20){
    echo '用户名 6-20位';
    return;
}

if(strlen($_POST['password']) < 6 || strlen($_POST['password']) > 20){
    echo '密码 6-20位';
    return;
}

echo '后端校验：输入合法，进入数据正确性校验';
```

## 持久登录
SSO 单点登录。在不同源的一个系统下，任意一个站点登录，其他站点也会进入登录状态。也就是每个单独的站点都能访问到登录的cookie。  

用户名和密码传到后端，后端进行哪些操作：
1. 加密    
username -> md5(md5(username) + salt) -> ident_code 身份识别码  
password -> md5(md5(password) + salt)     
2. token    
token身份令牌 32位/16位 A-Za-z0-9随机字符串 每次只要有登录操作，都重新生成   
3. auth    
cookie auth=ident_code:token   


后端设置cookie：   
setcookie('auth', ident_code:token, 过期时间, 有效路径, 有效域);   
有效路径：一般填写 '/' ,就是项目文件夹下，所有文件都有效   
有效域：'.baidu.com' 意味着www.baidu.com, zhidao.baidu.com, picture.baidu.com都有效。实现单点登录。
为什么还要将过期时间存在数据库中？服务器时间为准。  

## 练习
cookie+token持久化登录

后端：     
1. 接收到三个参数username，password，isPersistedLogin，判断合法性。返回错误信息.
2. 数据交给模型端，验证数据库。用户名和密码加密，判断用户名是否存在，如果不存在返回1003；如果存在，把数据库中的密码与传入的加密密码进行判断，如果不一样，返回错误1004；如果密码正确，拿出nickname，根据用户名生成ident_code，生成新的token值，算过期时间根据isPersistedLogin，生成30天或1天的过期时间timeout。将ident_code、token、timeout存入数据库中。保存没有成功返回1005，保存成功，设置cookie auth = ident_code + token，nickname。返回200成功，让页面重新加载。
3. 加载页面，验证auth。将auth的ident_code和token分隔，传入模型层。检查ident_code和token是否在同一行数据，如果不是则删除cookie auth和nickname，并返回1006。如果是就验证timeout有没有过期，获取当前的时间戳，从数据库中获取时间timeout。如果过期则返回1007。验证成功则返回200。前端改变dom结构。
4. 退出登录。删除cookie auth和nickname，并重定向到登录页面。
