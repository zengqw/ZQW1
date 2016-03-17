<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=9;IE=8;IE=7;" />
</head>


<body class="workload-home login-container">
	<form class="login-form" action="login" method="post">
		<input id="username" name="username" type="text" value="zeng"
			autocomplete="off" class="input-login" placeholder="请输入用户名"  /> </br> <input
			id="password" type="password" name="password"
			placeholder="请输入密码" autocomplete="off" value="123" class="input-login" />
		</br>
		<button class="btn-login ac_loginWorkload" type="submit" value="提交">立即登录</button>
		</br>
	</form>
</body>
</html>