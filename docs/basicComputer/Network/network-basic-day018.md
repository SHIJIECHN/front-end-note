---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 大文件上传
---

## form表单文件上传
直接上传，为什么上传不上去呢？
```html
<form action="server/upload.php" method="post">
    <input type="text" name="filename" /><br />
    <input type="file" name="file" /> <br />
    <input type="submit" value="上传" />
</form>
```
直接提交时，是提交的文件名字符串，文件并没有上传。   
文件和数据的区别：数据->字符串，文件->文件  
```html
<form action="server/upload.php" method="post" enctype="application/x-www-form-urlencoded"></form>
```
application/x-www-form-urlencoded POST 数据键值对化。username=123&password=123456     

form表单属性：encType，采用什么编码格式来进行数据编码。form表单POST形式默认的enctype="application/x-www-form-urlencoded"


## 二进制方式文件上传
```html
    <form action="server/upload.php" method="post" enctype="multipart/form-data">
        <input type="text" name="filename" /><br />
        <input type="file" name="file" /> <br />
        <input type="submit" value="上传" />
    </form>
```
enctype="multipart/form-data" 将上传的文件类型转成二进制的形式，进行上传。     
同步上传：点击上传后，跳转到后端的页面，执行后端代码。    
多文件上传
```html
<form action="server/upload.php" method="post" enctype="multipart/form-data">
    <input type="text" name="filename" /><br />
    <input type="file" name="file" multiple/> <br />
    <input type="submit" value="上传" />
</form>
```
或者
```html
<form action="server/upload.php" method="post" enctype="multipart/form-data">
    <input type="text" name="filename" /><br />
    <input type="file" name="file[]"/> <br />
    <input type="file" name="file[]"/> <br />
    <input type="file" name="file[]"/> <br />
    <input type="file" name="file[]"/> <br />
    <input type="submit" value="上传" />
</form>
```

## FormData()
表单数据构造函数。
```html
<body>
    <input type="text" id="username" value="张三" />
    <input type="text" id="password" value="123456" />
    <input type="submit" id="submitBtn" value="提交">

    <script>
        var oUsername = document.getElementById('username'),
            oPassword = document.getElementById('password'),
            oSubmitBtn = document.getElementById('submitBtn'),
            fd = new FormData();

        oSubmitBtn.onclick = function() {
            // append 增加一行表单数据
            fd.append('Username', oUsername.value);
            fd.append('Password', oPassword.value);

            console.log(fd); // 对象，FormData实例化对象

            // get 获取数据
            console.log('username: ' + fd.get('Username')); // 张三
            console.log('password: ' + fd.get('Password')); // 123456

            // set 设置
            fd.set('Username', '李四');
            console.log('username: ' + fd.get('Username')); // 李四

            // has 判断是否存在某个字段
            console.log(fd.has('Password')); // true

            // delete 删除字段
            fd.delete('Password');
            console.log('password: ' + fd.get('Password')); // null
        }
    </script>
</body>
```

## 案例：大文件上传
```html
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>upload file</title>
    <style>
        ul {
            padding: 0;
            margin: 0;
            list-style: none;
            margin-top: 100px;
        }
        
        .progress-bar {
            width: 300px;
            height: 40px;
            border: 1px solid #666;
            text-align: center;
        }
        
        .progress {
            width: 0;
            height: 100%;
            background-color: green;
        }
        
        .error-info {
            line-height: 40px;
            font-size: 14px;
            color: #333;
        }
        
        .error-tip {
            color: red;
            display: block;
        }
    </style>
</head>

<body>
    <input type="file" id="file" multiple />

    <ul class="progress-wrap">
        <!-- <li class="progress-bar">
            <div class="progress"></div>
            <span class="error-info">文件类型错误</span>
        </li> -->
    </ul>

    <script>
        // 选中文件后，点击打开直接上传，不需要再点击上传按钮
        var oFile = document.getElementById('file'),
            oErrorTip = document.getElementsByClassName('error-tip')[0],
            oProgressWrap = document.getElementsByClassName('progress-wrap')[0],
            fd = new FormData();

        oFile.onchange = function() {
            console.log(oFile.files); // 选中的文件信息

            var files = oFile.files,
                fileLen = files.length;

            if (fileLen <= 0) {
                console.log('您还没有选择图片');
                return;
            }

            if (fileLen > 5) {
                console.log('最多可同时上传6张图片');
                return;
            }

            // oProgressWrap.innerHTML = '';
            var fileName = '',
                fileSize = 0,
                maxSize = 1048576, // 按字节来算：1M
                fd = null,
                errorInfo = '';

            for (var i = 0; i < fileLen; i++) {
                fileName = files[i].name;
                fileSize = files[i].size;

                // 判断是否是图片
                if (!/\.(gif|gpeg|png)$/.test(fileName)) {
                    errorInfo = '【' + fileName + '】,文件不是图片类型'
                }

                if (fileSize > maxSize) {
                    errorInfo = '【' + fileName + '】,超过可上传大小'
                }

                var oProgressBar = document.createElement('li');
                oProgressBar.className = 'progress-bar';

                oProgressWrap.appendChild(oProgressBar);

                if (errorInfo !== '') {
                    oProgressBar.innerHTML = '<span class="error-info">' + errorInfo + '</span>'
                } else {
                    oProgressBar.innerHTML = '<div class="progress"><div>';
                    fd = new FormData();
                    fd.append('file', files[i]);

                    var o = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    o.open('post', 'server/upload.php');

                    (function(i) {
                        o.upload.onprogress = function(e) {
                            // e.loaded 已经上传完的字节数  
                            // e.total 整个文件的字节数
                            var e = e || window.event,
                                percent = e.loaded / e.total * 100 + '%',
                                thisProgressBar = oProgressWrap.getElementsByClassName('progress-bar')[i];;

                            thisProgressBar.getElementsByClassName('progress')[0].style.width = percent;
                        }
                    })(i);

                    o.send(fd);
                }
            }
        }
    </script>
</body>
```

## 腾讯课堂案例
大文件上传功能
