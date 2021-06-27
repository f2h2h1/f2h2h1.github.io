在 Windows 下搭建 git 服务
================================

[TOC]

- 本文所提及的所有命令都在 git bash 里运行
- 本问提及的命令大部分也能在 liunx 里运行

## git for windows 和 git for windows sdk

- git for windows sdk 有一套完成的 cygwin 工具链，有 gcc make 等工具，还能方便地安装各种包
- git for windows 虽然也有一个 cygwin 的环境，但只包含 git bash 和 git bash 相关的依赖
- git for windows sdk 也是在 git for windows 的网页里下载，用心找一下就能找到下载链接了。
因为网络的问题，下载速度可能有点慢，
因为网络的问题，安装的速度可能有点慢，或者总是安装失败，
安装目录必须是一个空目录，如果安装失败，又重新在原本的目录安装，需要清空原本的目录。
- 笔者本人比较推荐安装 git for windows sdk ，因为这样就不用装一套 git bash 又装一套 cygwin 了。

## git 的仓库
git 有两种仓库，普通仓库和裸仓。普通仓库有工作目录，裸仓没有工作目录。

一般情况下，裸仓是用于远程仓库的。
初始化仓库时加上 `--bare` 参数就能新建裸仓了。裸仓的仓库名一般是以 .git 来结尾的。

一般情况下，需要先在仓库根目录里运行这句命令，才能把仓库作为远程仓库。
```
git update-server-info
```

一般情况下，普通仓库不能接受推送。普通仓库如果要接受推送需要在仓库的根目录执行这句命令。
```
git config receive.denyCurrentBranch ignore
```

不是裸仓的远程仓库被推送后，和最新版本有冲突的文件的状态会变为已暂存的修改。
在远程仓库的根目录运行这句就能把工作目录的文件同步到最新的版本。
```
git reset --hard
```

## git 的协议
git 连接远程仓库有四种协议。文件协议，http 协议，ssh 协议和 git 协议。

文件协议，用得比较少，网上的教程基本都是围绕 http 协议和 ssh 协议的。

http 协议又分为哑 http 协议和 smart http 协议，主要区别是哑 http 协议不能推送。

## 哑 http 协议
要部署哑 http 协议非常简单，只要让 .git 目录能被访问到就可以的了。

假设仓库不是裸仓，仓库的绝对路径是 `C:\git\test`

apache 的配置可以写成这样。修改完配置后记得要重启 apache
```
Listen 81
<VirtualHost *:81>
DocumentRoot "C:\git"
  <Directory "C:\git">
    Options -Indexes -FollowSymLinks +ExecCGI
    AllowOverride All
    Order allow,deny
    Allow from all
    Require all granted
  </Directory>
</VirtualHost>
```

在 `C:\git` 目录里运行 python 的一句话服务器也可以 `python -m http.server -b 0.0.0.0 81`

在 `C:\git` 目录里运行 php 的一句话服务器也可以 `php -S 0.0.0.0:81`

然后使用类似这样的命令 `git clone http://127.0.0.1:81/test/.git` 来 clone 仓库

## smart http 协议
smart http 协议本质上就是把 http 请求转发给 git-http-backend 来处理。

git-http-backend 在 windows 系统里的路径一般是这个 `C:\Program Files\Git\mingw64\libexec\git-core\git-http-backend.exe`

git-http-backend 在 linux 系统里的路径一般是这个 `/usr/lib/git-core/git-http-backend`

假设仓库不是裸仓，仓库的绝对路径是 `C:\git\test`

apache 需要启用这几个模块 cgi alias env 。
apache 的配置可以写成这样。修改完配置后记得要重启 apache
```
Listen 82
<VirtualHost *:82>
    DocumentRoot "C:\git"
    <Directory "C:\git">
        Options -Indexes -FollowSymLinks +ExecCGI
    </Directory>
        SetEnv GIT_PROJECT_ROOT "C:/git"
        SetEnv GIT_HTTP_EXPORT_ALL
        ScriptAlias / "C:/Program Files/Git/mingw64/libexec/git-core/git-http-backend.exe/"
    <Files "git-http-backend.exe">
        AuthName "test"
        AuthType basic
        AuthUserFile "C:\Apache\conf\mypasswd"
        Require expr !(%{QUERY_STRING} -strmatch '*service=git-receive-pack*' || %{REQUEST_URI} =~ m#/git-receive-pack$#)
        require valid-user
    </Files>
</VirtualHost>
```

然后使用类似这样的命令 `git clone http://127.0.0.1:82/test/.git` 来 clone 仓库

默认情况下 http 协议的推送是需要认证的。

git-http-backend 需要这几个环境变量
|变量名|备注|
|:--|:--|
|PATH_INFO|仓库路径|
|REMOTE_USER|认证的用户名|
|REMOTE_ADDR| |
|CONTENT_TYPE| |
|QUERY_STRING| |
|REQUEST_METHOD| |
|GIT_PROJECT_ROOT|仓库的根目录，一般是仓库的上一级路径|
|GIT_HTTP_EXPORT_ALL|如果存在这个变量，那么全部仓库都可以访问，否则会使用 git-daemon-export-ok 来判断仓库是否可以访问|

- GIT_PROJECT_ROOT + PATH_INFO = 仓库的绝对路径
- 只要按照 cgi 协议把请求转发给 git-http-backend 处理就可以的了

## ssh 协议
ssh 协议部署起来也很简单。只要开启了 sshd 服务，且登录的用户有权限读写仓库目录就可以了。

假设仓库不是裸仓，仓库的绝对路径是 `C:/git/test`

那么 clone 的命令就是 `git clone ssh://127.0.0.1/c/git/test/.git`

ssh 协议的缺点是即使是 pull 也需要授权，这样不利于搞开源

### 用 git bash 来启用 sshd 服务
1. 打开 git bash
2. 然后运行这句 /usr/bin/sshd
    - 如果运行 /usr/bin/sshd 遇到这种错误 sshd: no hostkeys available -- exiting
    - 那么就先用管理员打开 git bash 然后运行这句 `ssh-keygen -A`
3. 如果要关闭 sshd
    - 先通过 ps -elf 找到对应的 pid ，然后 kill pid
    - 或者像这样一句话删除 `kill ps -elf | grep /usr/bin/sshd | awk '{print $2}'`

## git 协议
git 协议就是启用 git 的守护进行。

假设仓库不是裸仓，仓库的绝对路径是 `C:/git/test`

1. 在仓库的 .git 目录里新建一个名为 git-daemon-export-ok 的文件 `touch git-daemon-export-ok`
2. 运行这句命令 `git daemon --reuseaddr --base-path=/c/git /c/git`
3. 那么 clone 的命令就是 `git clone git://127.0.0.1/test/.git`

|参数|备注|
|:--|:--|
|daemon|启用 git 的守护进程|
|--reuseaddr|选项允许服务器在无需等待旧连接超时的情况下重启|
|--base-path|选项允许用户在未完全指定路径的条件下克隆项目|
|结尾的路径|告诉 Git 守护进程从何处寻找仓库来导出|
|--port|默认会监听9418端口，可以用这个参数来修改监听端口|

- 在 windows 下，路径要写成 unix 的形式
- 防火墙要放行监听的端口
- --base-path 和结尾的路径最好一致
- 仓库的 .git 目录下需要有这个文件 `git-daemon-export-ok` ，这个文件里是没有内容的

git 协议没有授权，要么谁都可以推送，要么谁都不可以推送。
git 协议的速度是最快的。

## gitweb
gitweb 是一段 perl 的 cgi 脚本，是一个基于网页的简易查看器。

在 windows 下是没有这段脚本的，在 linux 里可以直接使用这样的命令来启用这段脚本 `git instaweb` 或 `git instaweb --httpd=python`

要在 windows 里启用 gitweb 步骤有一点的繁琐
1. 克隆 git 的仓库 `git clone git://git.kernel.org/pub/scm/git/git.git`
2. 生成 cgi 脚本，在 git 仓库的根目录运行 `make GITWEB_PROJECTROOT="/c/git" prefix="/c/Program Files/Git" gitweb`
    - GITWEB_PROJECTROOT 一般是仓库根目录的上一级路径
    - prefix 是 git 的安装目录
    - 路径要写成 unix 的形式
3. 上一步会生成一个名为 gitweb.cgi 的 perl 脚本。打开这个脚本，然后大概在 87 行左右的位置，找到 `our $projectroot`。把这个变量的值改成
    ```
    our $projectroot = "/c/git"
    ```
4. 这里还需要把 gitweb.cgi 文件里的第一句修改成，就是 git bash 里的 perl 的绝对路径
    ```
    #!C:\Program Files\Git\usr\bin\perl.exe
    ```
5. 在这里 http://search.cpan.org/~markstos/CGI/ 下载 cgi.pm
6. 下载后解压，把 lib 文件夹下全部文件复制到这个目录里 `/usr/lib/perl5/site_perl` ，这是实际的目录路径 `git的安装目录\usr\lib\perl5\site_perl` ，如果没有 site_perl 这个文件夹就新建一个。

假设 gitweb 的绝对路径是 `C:\git\git\gitweb`

apache 的配置可以写成这样。修改完配置后记得要重启 apache
```
Listen 83
<VirtualHost *:83>
    ServerName gitserver
    DocumentRoot C:\git\git\gitweb
    <Directory C:\git\git\gitweb>
        Options +ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
        AllowOverride All
        order allow,deny
        Allow from all
        AddHandler cgi-script cgi
        DirectoryIndex gitweb.cgi
    </Directory>
</VirtualHost>
```

然后使用类似这样的网址 `http://127.0.0.1:83/gitweb.cgi` 在浏览器访问 gitweb

gitweb.cgi 需要这几个环境变量
|变量名|备注|
|:--|:--|
|PATH_INFO| 文件路径，如果 gitweb.cgi 就在网站根目录，这里可以是空 |
|REMOTE_ADDR| |
|CONTENT_TYPE| |
|QUERY_STRING| |
|REQUEST_METHOD| |
|SCRIPT_NAME| 脚本名，一般是 gitweb.cgi |
|SERVER_NAME| 服务器名，会显示在页面的 title 里 |

- 只要按照 cgi 协议把请求转发给 gitweb.cgi 处理就可以的了，同时要注意一下 static 文件的路径。

### 让 git bash 支持 make
默认情况下 git bash 是没有 make 的。但如果系统里有安装 make 那么在 git bash 里也能直接使用，下面是系统里也没有安装 make 的情况。

1. 到 https://sourceforge.net/projects/ezwinports/files/ 去下载 make-4.3-without-guile-w32-bin.zip 这个文件。4.3 是版本号，后续可能会有更新。
2. 把该文件进行解压
3. 把解压出来的文件全部复制到 `git的安装目录\mingw64\` ，如果跳出来需要替换的文件要选择不替换

## gitblit 和 gitea
实际上现在很少人会这像上文一样这么折腾 git 服务。一般都是直接用开源的 git 服务。

笔者比较推荐 gitblit 和 gitea

笔者了解到的 Git 服务器主要有这几个
- cgit
- gitlab
- gitblit
- gitea
- gogs

cgit 的界面和 gitweb 差不多，但 cgit 已经很久没更新了。

gitlab 功能非常强大，但对性能的要求比较高，如果只是搞远程仓库不搞其它奇技淫巧 gitlab 就有点大才小用了。

gitblit 这个是笔者当前在用的，后端用 java 写成，虽然功能没有 gitea 多，但速度更快。

gitea 这个最近很流行，后端用 go 写成，网上比少教程都在推荐这个。

gogs 是 gitea 的原版，好像应为社区的原因，gitea 从 gogs 分裂出来，据说分裂后的 gitea 发展得更好。

## 一段能兼容 smart http 和 gitweb 的 php 脚本
1. 在 gitweb 的文件夹里新建一个名为 HTTPServerRequestHandler.php 的文件，并写入下面的内容
2. 打开 gitweb.cgi ，然后大概在 87 行左右的位置，找到 `our $projectroot` 和 `our $GIT` 修改成
    ```
    our $GIT = $ENV{'GIT_BIN'};
    our $projectroot = $ENV{'GIT_PROJECT_ROOT'};
    ```
3. 要注意修改 GIT_PROJECT_ROOT 和 GIT_BIN ，GIT_BIN 就是 git 可执行文件的路径
4. 然后运行这句命令
    ```
    php -S 0.0.0.0:84 HTTPServerRequestHandler.php
    ```
5. 然后使用类似这样的网址 `http://127.0.0.1:84/gitweb.cgi` 在浏览器访问 gitweb
6. 然后使用类似这样的命令 `git clone http://127.0.0.1:84/test/.git` 来 clone 仓库

```php
<?php

class HTTPServerRequestHandler
{
    private string $logfile;
    private bool $auth;
    private array $userList;
    private array $handler;
    private string $username = 'anonymous';

    public function __construct($config)
    {
        $default = [
            'logfile' => get_class() . '.log',
            'auth' => true,
            'userList' => [],
        ];

        $config = array_merge($default, $config);

        $this->logfile = $config['logfile'];
        $this->auth = $config['auth'];
        $this->userList = $config['userList'];
        $this->handler = $config['handler'];
    }

    public function getUsername()
    {
        return $this->username;
    }

    private function auth(array $userList): string
    {
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

        return $PHP_AUTH_USER;
    }

    public function logger($log)
    {
        if (empty($this->logfile)) {
            return;
        }
        if (!(is_string($log) || is_numeric($log))) {
            $log = print_r($log, true);
        }
        if (strlen($log) > 2048) {
            $log = substr($log, 0, 2048);
            $log = "str is greater than 2048\n" . $log;
        }

        file_put_contents($this->logfile, $log, FILE_APPEND);
    }

    public function cgiHandler($cmd, $env)
    {
        $tmpfname = tempnam(sys_get_temp_dir(), "CGI");
        $input = file_get_contents("php://input");
        $contentLength = strlen($input);
        file_put_contents($tmpfname, $input);

        $desc = [
            0 => ['file', $tmpfname, 'r'],
            1 => ['pipe', 'w'],
            2 => ["file", "error-output.txt", "a"],
        ];
        $cwd = null;

        $env['PATH'] = getenv('PATH');
        $env['CONTENT-LENGTH'] = $contentLength;

        $this->logger($input . "\n\n");
        $this->logger($env);
        $this->logger($_SERVER);
        $this->logger(apache_request_headers());
        $this->logger("\n\n*******************\n\n");

        $process = proc_open($cmd, $desc, $pipes, $cwd, $env);
        if (is_resource($process)) {

            $out = stream_get_contents($pipes[1]);
            // 切记：在调用 proc_close 之前关闭所有的管道以避免死锁。
            $return_value = proc_close($process);

            $header = strstr($out, "\r\n\r\n", true);
            $header = trim($header);
            $body = strstr($out, "\r\n\r\n");
            $body = trim($body);
            $header = explode("\r\n", $header);
            $this->logger($header);

            $headerArr = [];
            foreach ($header as $item) {
                $key = strstr($item, ':', true);
                $key = trim($key);
                $value = strstr($item, ':');
                $value = trim($value);
                $headerArr[$key] = $value;
            }
            if (isset($headerArr['Status'])) {
                $headerArr['Status'];
                preg_match('/\d/', $headerArr['Status'], $matches);
                http_response_code($matches[0]);
            }
            $headerArr['Content-Length'] = ': ' . (strlen($body));
            foreach ($headerArr as $key => $value) {
                header($key . $value, true);
            }
            echo $body;

            $this->logger(apache_response_headers());
            $this->logger($body);
            $this->logger("\nlen:" . strlen($out) . "\treturn_value:" . $return_value);
        } else {
            // 出错了
            header('HTTP/1.0 500 Internal Server Error');
            $this->logger("process is not resource\n");
        }
    }

    public function proxy($url)
    {
        $raw = file_get_contents('php://input');
        $header = array_reduce(apache_request_headers(), function ($carry, $item) {
            $carry = $item . "\r\n";
            return $carry;
        }, '') . "\r\n";
        $context = stream_context_create([
            'http' => [
                'method' => $_SERVER['REQUEST_METHOD'] ?? 'GET',
                'header' => $header,
                'content' => $raw,
                'timeout' => 300
            ]
        ]);
        $response = file_get_contents($url, false, $context);
        if (is_array($http_response_header)) {
            foreach ($http_response_header as $row) {
                header($row);
            }
        }
        echo $response;
    }

    public function run()
    {
        if ($this->auth) {
            $this->username = $this->auth($this->userList);
        }
        $handler = $this->handler;
        uksort($handler, function ($a, $b) { // 按字符串长度降序排列
            $len1 = mb_strlen($a, 'UTF-8');
            $len2 = mb_strlen($b, 'UTF-8');
            if ($len1 == $len2) {
                return 0;
            } else {
                return ($len1 < $len2) ? 1 : -1;
            }
        });
        foreach ($handler as $key => $value) {
            if (($key == 'default' && $_SERVER['REQUEST_URI'] == '/') ||
                (substr($key, 0, 1) == '/' && substr($key, -1) == '/' &&
                    filter_var($_SERVER['REQUEST_URI'], FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => $key]])) ||
                ($_SERVER['REQUEST_URI'] == $key)) {
                call_user_func($value, $this);
                return true;
            }
        }
        return false;
    }
}

$config = [
    'logfile' => 'HTTPServerRequestHandler.log',
    'auth' => true,
    'userList' => [
        'Tom' => '123456',
    ],
    'handler' => [
        'default' => function (HTTPServerRequestHandler $handler) {
            header("Location: /gitweb.cgi");
        },
        '/^\/gitweb.cgi(.*)/' => function (HTTPServerRequestHandler $handler) {
            $env = [];
            $env['PATH_INFO'] = '';
            $env['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'] ?? '';
            $env['CONTENT_TYPE'] = $_SERVER['CONTENT_TYPE'] ?? '';
            $env['QUERY_STRING'] = $_SERVER['QUERY_STRING'] ?? '';
            $env['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? '';
            $env['SCRIPT_NAME'] = $_SERVER['SCRIPT_NAME'] ?? '';
            $env['SERVER_NAME'] = 'php server';
            $env['GIT_BIN'] = 'C:/Program Files/Git/bin/git';
            $env['GIT_PROJECT_ROOT'] = '/c/git'; // 这里要用 unix 的格式
            $cmd = '"C:\Program Files\Git\usr\bin\perl.exe" "gitweb.cgi"';
            $handler->cgiHandler($cmd, $env);
            $handler->logger("\n\n" . date('Y-m-d H:i:s') . "----------------------------------\n\n");
        },
        '/^\/git/' => function (HTTPServerRequestHandler $handler) {
            $GIT_PROJECT_ROOT = 'C:/git'; // 这里要用 windows 的格式
            $env = [];
            $env['GIT_PROJECT_ROOT'] = $GIT_PROJECT_ROOT;
            $env['GIT_HTTP_EXPORT_ALL'] = ' ';
            $QUERY_STRING = $_SERVER['QUERY_STRING'] ?? '';
            $REQUEST_URI = $_SERVER['REQUEST_URI'] ?? '';
            if (filter_var($QUERY_STRING, FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => '/service=git-receive-pack/']]) ||
                filter_var($REQUEST_URI, FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => '/\/git-receive-pack$/']])) {
                    $env['AUTHREQUIRED'] = 'yes';
            }
            $env['PATH_INFO'] = preg_replace('/^\/git(.*)/', '$1', $_SERVER['SCRIPT_NAME']);
            $env['REMOTE_USER'] = $handler->getUsername();
            $env['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'] ?? '';
            $env['CONTENT_TYPE'] = $_SERVER['CONTENT_TYPE'] ?? '';
            $env['QUERY_STRING'] = $QUERY_STRING;
            $env['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? '';
            $cmd = '"C:/Program Files/Git/mingw64/libexec/git-core/git-http-backend.exe"';
            $handler->cgiHandler($cmd, $env);
            $handler->logger("\n\n" . date('Y-m-d H:i:s') . "----------------------------------\n\n");
        },
        '/logout' => function (HTTPServerRequestHandler $handler) {
            header('HTTP/1.0 401 Unauthorized');
            echo 'logout';
        }
    ],
];

if (!(new HTTPServerRequestHandler($config))->run()) {
    return false;
};

```
