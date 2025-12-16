HTTP 认证方式的不完整总结
================

## 基本认证 (Basic Authentication)

当浏览器请求需要认证的资源时，服务端返回 401 状态码，并在响应头里加上一个字段 WWW-Authenticate ， WWW-Authenticate 里有两个值 Basic 表示认证的方式， realm 是安全域字符串（一显示在浏览器的登录框里的提示，但现在的浏览器好像都不显示这个了）。

例如这样
```
HTTP/1.1 401 Unauthorized
Date: Wed, 21 Oct 2015 07:28:00 GMT
WWW-Authenticate: Basic realm="Access to staging site"
```

浏览器在遇到 401 时，一般会弹出一个输入框输入账号密码，然后再发送一次包含账号密码的请求。

账号密码会以中间一个冒号 (:) 的形式拼接，例如这样
```
username:password
```

然后再经过 basd64 编码
```
echo -n "username:password" | base64
# echo 里的 -n 参数是为了行尾不输出换行符
```

最后把结果放在请求头的 Authorization 字段里，例如这样
```
GET / HTTP/1.1
Host 127.0.0.1
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

认证失败时，服务器可以返回 403 或 401 。

基础认证可以把账号密码加在 url 里，这样就不会弹出询问框了，但这不是一种安全的形式，据说新版的 Chrome 已经禁用了这种形式。
```
https://username:password@www.example.com/
```

退出登录时，只需要服务器响应一个 401 或用 ajax 故意发送一个错误的账号密码 或者 在浏览器的地址栏故意输入错误的账号密码（但下次登录时要记得检查url里有没有错误的账号） 就可以的了。

基础认证最好配合 HTTPS ，如果没有 HTTPS 只要随便抓个包就能知道账号密码。

用于退出登录的 js
```js
// 用这样的方式退出登录，需要刷新一次才可以重新登录，不然会保留错误的用户名导致一致登录失败
(function() {
    var xmlhttp;
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            location.reload();
        }
    }
    xmlhttp.open("GET", location.origin, true);
    xmlhttp.setRequestHeader("Authorization", "Basic YXNkc2E6");
    xmlhttp.send();
    return false;
})()
```

### 基本认证的 apache 配置

需要启用这几个模块
 - mod_auth_basic
 - mod_authn_file
 - mod_authn_core
 - mod_authz_core
 - mod_authz_user

```
# Apache/2.4.62
<VirtualHost localhost-auth-basic.com:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "${SRVROOT}/htdocs"
    ServerName localhost-auth-basic.com
    ServerAlias localhost-auth-basic.com

    <Location "/">
        # 禁止使用 .htaccess 文件来覆盖当前目录下的 Apache 设置
        AllowOverride None
        # Indexes：当没有 index.html 等默认文件时显示目录列表。FollowSymLinks：允许跟随符号链接。
        Options Indexes FollowSymLinks

        # 基本认证对话框中显示的提示信息
        AuthName "用户名"
        # 认证类型为 HTTP Basic 认证
        AuthType Basic
        # 指定用户密码文件的位置
        # 这几项都是有效的，如果填相对目录，那么是相对服务器根目录
        # AuthUserFile .passwd
        # AuthUserFile "${SRVROOT}/.passwd"
        # AuthUserFile "/etc/apache2/.passwd"
        AuthUserFile "./.passwd"
        # AuthBasicFake demo demopass
        # 要求访问者必须提供有效的用户名和密码
        Require valid-user
    </Location>

    <IfModule dir_module>
        DirectoryIndex index.html index.php
    </IfModule>

    ErrorLog "logs/localhost-auth-basic.com-error.log"
    CustomLog "logs/localhost-auth-basic.com-access.log" common
</VirtualHost>
```

htpasswd 的使用例子
```
创建用户文件并添加第一个用户，如果文件已存在会覆盖已存在的文件
htpasswd -c -B .passwd user1

添加新用户
htpasswd /path/to/.htpasswd username

修改用户密码
htpasswd /path/to/.htpasswd username

使用 bcrypt 加密
htpasswd -B /path/to/.htpasswd username

删除用户
htpasswd -D /path/to/.htpasswd username
```

### 用 php 实现的基本认证例子

```php
$userLists = [
    'qwe' => '123',
];

if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="git auth"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Authorization Required.';
    exit;
}

$PHP_AUTH_USER = $_SERVER['PHP_AUTH_USER'] ?? '';
$PHP_AUTH_PW = $_SERVER['PHP_AUTH_PW'] ?? '';
if (!isset($userList[$PHP_AUTH_USER]) || $userList[$PHP_AUTH_USER] != $PHP_AUTH_PW) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 Forbidden';
    exit;
}

if (isset($_GET['logout'])) {
    header('HTTP/1.0 401 Unauthorized');
    echo 'logout';
    exit;
}

echo 'auth success';
echo '<pre>';
var_dump($_SERVER);
echo '</pre>';

```

参考 https://www.php.net/manual/zh/features.http-auth.php

## 摘要认证 (Digest Access Authentication)

在浏览器里的表现形式和基础认证基本一致，但发送账号密码的部分不一样，密码包含在数字摘要里，这样可以避免被抓包时就直接知道密码。

摘要认证无法防止中间人攻击。一个中间人可以告知客户端使用基本认证模式，而摘要访问认证没有提供任何机制帮助客户端验证服务器的身份。

服务端响应头里的 WWW-Authenticate

| | |
|-|-|
|realm|安全域字符串|
|qop|保护质量，可以取值 auth 和 auth-int ，一般用 auth|
|nonce| 随机字符串|
|opaque| 穿透字符串，客户端会不改变地返回给服务端|
|algorithm|摘要算法，默认值是 MD5 |

客户端请求头里的 Authenticate

| | |
|-|-|
|realm|和请求头里的一致|
|qop|和请求头里的一致|
|nonce|和请求头里的一致|
|opaque|和请求头里的一致|
|algorithm|和请求头里的一致|
|username|用户名|
|nc|认证的次数|
|cnonce|客户端产生的一个 GUID|
|uri|uri|
|response|摘要|

摘要的计算，其中 H 表示的是摘要算法
```
H(H(A1):nonce:nc:cnonce:qop:H(A2))
```

A1
```
username:realm:passwd
```

A2
```
当 qop 是 auth 时， A2 只包含请求方法和 uri ， 请求方法是大写的
method:uri
当 qop 是 auth 时， A2 只包含请求方法和 uri ， 还添加了报文主体部分
method:uri:H(entity-body)
```

### 摘要认证的 apache 配置

在 basic 认证的基础上还需要启用这几个模块
- mod_auth_digest

```
<VirtualHost localhost-auth-digest.com:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "${SRVROOT}/htdocs"
    ServerName localhost-auth-digest.com
    ServerAlias localhost-auth-digest.com

    # 这一段放在 <Directory /var/www/> 也可以
    <Location "/">
        # 禁止使用 .htaccess 文件来覆盖当前目录下的 Apache 设置
        AllowOverride None
        # Indexes：当没有 index.html 等默认文件时显示目录列表。FollowSymLinks：允许跟随符号链接。
        Options Indexes FollowSymLinks

        # 基本认证对话框中显示的提示信息 这里的 AuthName 必须和密码文件里的 realm 一致，这里只能填英文
        AuthName "username"
        # 认证类型为 HTTP Digest 认证
        # "http://localhost-auth-digest.com/"
        AuthType Digest
        AuthDigestDomain "/"
        AuthDigestProvider file
        AuthUserFile "./.digest_pw"
        # 要求访问者必须提供有效的用户名和密码
        Require valid-user
    </Location>

    <IfModule dir_module>
        DirectoryIndex index.html index.php
    </IfModule>

    ErrorLog "logs/localhost-auth-digest.com-error.log"
    CustomLog "logs/localhost-auth-digest.com-access.log" common
</VirtualHost>
```

htdigest 的使用例子
```

创建用户文件并添加第一个用户，如果文件已存在会覆盖已存在的文件
htdigest -c 文件路径 realm 用户名
htdigest -c .digest_pw "private area" user2

添加新用户
htdigest .digest_pw "private area" user2

修改用户密码
htdigest .digest_pw "private area" user2

htdigest 好像没有删除用户的命令，但直接改文件也不是不可以的。。。
```

htpasswd 和 htdigest 都可以在 bin 目录下找到，
htpasswd 和 htdigest 生成的都是文本文件

### 用 php 实现的摘要认证例子

```php
$userLists = [
    'qwe' => '123',
];
$realm = 'digest.test';
$nonce = md5(uniqid());
$opaque = md5($nonce . $realm);
$digest = [
    'realm' => $realm, // 显示在浏览器的登录框里的提示，但现在的浏览器好像都不显示这个了
    'qop' => 'auth', // auth 表示只进行身份查验 auth-int 表示进行查验外，还有一些完整性保护。需要看更详细的描述，请参阅RFC2617
    'nonce' => $nonce, // 随机数
    'opaque' => $opaque, // 穿透参数
    'algorithm' => 'MD5', // 摘要算法，默认是 MD5
];
$a = join(', ', array_map(function ($k, $v) {
        return $k . '="' . $v . '"';
    }, array_keys($digest), $digest));
if (!isset($_SERVER['PHP_AUTH_DIGEST'])) {
    header('HTTP/1.0 401 Unauthorized');
    header('WWW-Authenticate: Digest ' . $a);
    echo 'Authorization Required.';
    exit;
}
if (isset($_GET['logout'])) {
    header('HTTP/1.0 401 Unauthorized');
    echo 'logout';
    exit;
}

$digest = $_SERVER['PHP_AUTH_DIGEST'];
$digestInfo = [
    'realm' => '',
    'qop' => '',
    'nonce' => '',
    'opaque' => '',
    'algorithm' => '',
    'username' => '', // 用户名
    'nc' => '', // 认证的次数
    'cnonce' => '', // 客户端产生的一个 GUID
    'uri' => '', // uri 就是请求行里的 uri
    'response' => '', // 摘要
];
foreach (explode(', ', $digest) as $item) {
    preg_match('/(?<key>.+)=(?<value>.*)/', $item, $match);
    if (!empty($match['key'])) {
        $digestInfo[$match['key']] = trim($match['value'], '\"');
    }
}

echo '<pre>';
var_dump($_SERVER);
var_dump($digestInfo);
echo '</pre>';

if (!isset($userLists[$digestInfo['username']])) {
    header('HTTP/1.0 401 Unauthorized');
    header('WWW-Authenticate: Digest ' . $a);
    echo 'username is invalid ';
    exit;
}

if ($digestInfo['opaque'] != md5($digestInfo['nonce'] . $realm)) {
    header('HTTP/1.0 401 Unauthorized');
    header('WWW-Authenticate: Digest ' . $a);
    echo 'opaque is invalid ';
    exit;
}

$A1 = $digestInfo['username'] . ':' . $realm . ':' . $userLists[$digestInfo['username']];
$A2 = $_SERVER['REQUEST_METHOD'] . ':' . $digestInfo['uri'];

if (md5(implode(':', [
    md5($A1),
    $digestInfo['nonce'],
    $digestInfo['nc'],
    $digestInfo['cnonce'],
    $digestInfo['qop'],
    md5($A2)
])) != $digestInfo['response']) {
    header('HTTP/1.0 401 Unauthorized');
    header('WWW-Authenticate: Digest ' . $a);
    echo 'auth fail';
    exit;
}

echo 'auth success';
```

## 表单认证

表单认证大概就是最常用的认证方式了。

这是一个简单的表单认证例子
```html
<form action="demo-form.php">
  username: <input type="text" name="username"><br>
  Password: <input type="password" name="password"><br>
  <input type="submit">
</form>
```

表单认证讨论得最多得问题是，会话状态要保存在哪里 cookie? token? jwt? session?
本文只描述 http 的认证，这个问题就不展开了。

### 表单认证的 apache 配置

在 basic 认证的基础上还需要启用这几个模块
- mod_auth_form
- mod_request
- mod_session
- mod_session_cookie
- mod_session_crypto

密码文件的生成和 basic 认证的一样

```
<VirtualHost localhost-auth-form.com:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "${SRVROOT}/htdocs"
    ServerName localhost-auth-form.com
    ServerAlias localhost-auth-form.com

    <Location "/login.html">
        Satisfy any
        Allow from all
        AuthType None
        Require all granted
    </Location>
    <Location "/loggedout.html">
        Satisfy any
        Allow from all
        AuthType None
        Require all granted
    </Location>

    <Location "/dologin.html">
        SetHandler form-login-handler
        AuthFormLoginRequiredLocation "/login.html"
        AuthFormLoginSuccessLocation "/index.html"
        AuthFormProvider file
        AuthUserFile "${SRVROOT}/.passwd"
        AuthType form
        AuthName /admin
        Session On
        SessionCookieName session path=/
        SessionCryptoPassphrase secret
    </Location>
    <Location "/logout.html">
        SetHandler form-logout-handler
        AuthFormLogoutLocation "/loggedout.html"
        Session On
        SessionMaxAge 1
        SessionCookieName session path=/
        SessionCryptoPassphrase secret
    </Location>

    <Location "/">
        AuthFormProvider file
        AuthUserFile "${SRVROOT}/.passwd"
        AuthType form
        AuthName "/admin"
        AuthFormLoginRequiredLocation "/login.html"

        Session On
        SessionCookieName session path=/
        SessionCryptoPassphrase secret

        Require valid-user
    </Location>

    <IfModule dir_module>
        DirectoryIndex index.html index.php
    </IfModule>

    ErrorLog "logs/localhost-auth-form.com-error.log"
    CustomLog "logs/localhost-auth-form.com-access.log" common
</VirtualHost>
```

在这个例子里还需要在网站的更目录新建几个 html 文件

login.html
```html
<form method="POST" action="/dologin.html">
  Username: <input type="text" name="httpd_username" value="" />
  Password: <input type="password" name="httpd_password" value="" />
  <input type="submit" name="login" value="Login" />
</form>
```

loggedout.html
```html
<h1>loggedout</h1>
```

index.html
```html
<h1>index</h1>
```

## SSL 客户端证书

SSL 客户端证书，应该是最安全的形式了，但也是最麻烦的形式，网站必须启用 https 和 要在客户端安装一个证书。

除此之外，客户端证书还要单独向 CA 申请。如果是内部自建的 CA 还好，不然申请客户端证书还会有额外的成本。

客户端证书实际上就是 CA 颁发一个 CN 是 username 的证书。

## 总结

基础认证和摘要认证都不够安全，网站要加上 https 。

几种认证方式可以组合来使用， 基础认证/摘要认证 + 表单认证 + SSL 客户端证书 。

http 的认证还有很多种

| |
|-|
|Bearer|
|HOBA|
|Mutual|
|OAuth|
|SCRAM-SHA-1|
|SCRAM-SHA-256|
|vapid|

除此之外还有一些没有标准化的认证方式

| |
|-|
|SPNEGO|
|Kerberos|
|NTLM|
|Negotiate|

## 参考

http 认证 https://www.rfc-editor.org/rfc/rfc7235.html

http 摘要认证 https://www.rfc-editor.org/rfc/rfc7616.html

http 基础认证 https://www.rfc-editor.org/rfc/rfc7617.html

MDN 关于 http 认证的描述 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication

Authentication Scheme https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml

https://docs.microsoft.com/zh-cn/dotnet/framework/wcf/feature-details/understanding-http-authentication

https://hc.apache.org/httpcomponents-client-4.5.x/current/tutorial/html/authentication.html

<!--
API Authorization 标头里为什么要加 Bearer
W3C 的 HTTP 1.0 规范，Authorization 的格式是：
Authorization: <type> <authorization-parameters>
使用 token 的一般是 Bearer ，所以 API Authorization 标头里要加 Bearer

使用 Basic 认证时的请求头例子
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=

使用 Digest 认证时的请求头例子
Authorization: Digest username="username", realm="Web Programming Secret Pages", nonce="5LtCuQxGBgA=b29baad4a44c5cf3d94d3accb4ccb5c31ce53615", uri="/", algorithm=MD5, response="4a82e31d1461bd6d9b78bc09cadc3844", qop=auth, nc=00000004, cnonce="990b2fb7edc397cc"
-->
