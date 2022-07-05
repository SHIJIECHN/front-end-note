---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 16. cookie+token实现网站持久登录
---

## 多选框提交后端时的注意事项
多选框提交数据到后端，一定要给name值加个[]，告诉后端这是个数组的形式。
```js
<input type="checkbox" name="hobby[]" value="fb" />足球
<input type="checkbox" name="hobby[]" value="bb" />篮球
```

## 结构语义化和属性语义化
为什么HTML5中button标签代替了input的submit的功能呢？   
因为HTML也意识到input标签本身存在的意义在于输入数据，单户表单提交这样的语义化利用按钮来做是比较合理的，所以在HTML中button标签中type属性设置submit和之前的input提交按钮可以到达同样的功能。
```js
<input type="submit" value="提交" />
<input type="reset" value="重置" />
  
<button type="submit">提交</button>
<button type="reset">重置</button>
```

## 为什么要阻止表单提交的默认行为
表单的action属性将表单同步提交给后端程序处理，但是同步提交到老的坏处就是“跳转页面”，由于跳转页面的原因，前端无法校验表单数据的合法性（合法性仅仅指代的是规则，符不符合规则才是合法），所以通常需要阻止表单提交的默认行为，使用异步提交的方式进行表单的提交，异步提交既然能够让前端先校验数据和合法性，又能减少服务器压力，当然前端校验数据的合法性之后，后端也还是需要校验数据的合法性的。

## 阻止表单提交的默认行为的方式
### 1. 表单默认提交的机制
form标签通过onsubmit属性，onsubmit属性默认是空字符串“”，代表表单默认提交；表单提交时会先返回onsubmit属性执行返回的内容，然后再执行内部表单提交的机制。

### 2. 利用onsubmit属性
onsubmit默认返回的是空字符串，通过设置return false阻止表单的默认提交行为，当onsubmit属性执行返回false时，表单就会阻止内部的提交机制，并且onsubmit返回值只认布尔值（false|true）
```javascript
// 返回字符串形式:
<form action="server/demo.php" method="post" onsubmit="return false"></form>


// 返回函数形式:
<form action="server/demo.php" method="post" onsubmit="return demo()"></form>

function demo() {
	return false;
}
```

### 3. 利用e.preventDefault
利用事件对象的preventDefault属性，阻止表单提交的默认行为。
```javascript
<form action="server/demo.php" method="post">
	<input type="text" name="username" />
	<button type="submit" class="J_submitBtn">提交</button>
</form>

var oSubmitBtn = document.getElementsByClassName('J_submitBtn')[0];
oSubmitBtn.addEventListener('click', function(e){
	var e = e || window.event;
	e.preventDefault();
}, false);
```

### 4. 异步提交表单的步骤以及实现
1. 阻止表单提交的默认行为
2. 前端验证数据的合法性
3. 利用AJAX提交数据

```javascript
<form action="server/demo.php" method="post" class="J_formList">
	<input type="text" name="username" id="J_Username" />
	<input type="password" name="password" id="J_Password" />
	<input type="checkbox" name="hobby" value="basketball" checked="checked" id="J_Hobby" /> 篮球
	<button type="submit" class="J_submitBtn">提交</button>
</form>

var oSubmitBtn = document.getElementsByClassName('J_submitBtn')[0],
		userName = document.getElementById("J_Username").value,
		passWord = document.getElementById("J_Password").value,
		oCheckbox = document.getElementById("J_Hooby"),
		// 获取元素节点直接能够通过.形式获取属性值
		actionUrl = document.getElementsByClassName('J_formList')[0].action;
oSubmitBtn.addEventListener('click', function(e){
	var e = e || window.event;
	// 1.阻止表单提交的默认行为
	e.preventDefault();
	// 2.验证表单数据的合法性
	if(userName.length < 5 || userName.length > 20) {
		console.log("用户名长度: 6-20位");
		return;
	}
	if(passWord.length < 5 || passWord.length > 20) {
		console.log("密码长度: 6-20位");
		return;
	}
	// 3.校验通过,利用AJAX异步提交数据
	$.Ajax({
		url:actionUrl,
		method:"POST",
		dataType:"JSON",
		data:{
			username:userName,
			password:password,
			// 获取元素节点直接能够通过.形式获取属性值,判断篮球是否选中
			checked:oCheckbox.checked
		},
		success:function(data){
			// 成功返回数据
			console.log(data);
		}
	})
}, false)
```

