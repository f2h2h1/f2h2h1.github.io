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

然后再经过 basd64 编码，最后把结果放在请求头的 Authentication 字段里，例如这样
```
GET / HTTP/1.1
Host 127.0.0.1
Authentication: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

认证失败时，服务器可以返回 403 或 401 。

基础认证可以把账号密码加在 url 里，这样就不会弹出询问框了，但这不是一种安全的形式，据说新版的 Chrome 已经禁用了这种形式。
```
https://username:password@www.example.com/
```

退出登录时，只需要服务器响应一个 401 或用 ajax 故意发送一个错误的账号密码就可以的了。

基础认证最好配合 HTTPS ，如果没有 HTTPS 只要随便抓个包就能知道账号密码。

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

这是一段用 php 实现的摘要认证例子
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
