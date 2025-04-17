PHP 各种运行方式的不完整总结
================================

## TS 和 NTS

TS(Thread-Safety) 即线程安全，多线程访问时，采用了加锁机制，当一个线程访问该类的某个数据时进行数据加锁保护，其他线程不能同时进行访问该数据，直到该线程读取完毕，其他线程才可访问使用该数据，好处是不会出现数据不一致或者数据污染的情况，但耗费的时间要比 NTS 长。

NTS(None-Thread Safe) 即非线程安全，不提供数据访问保护，有可能出现多个线程先后或同时操作同一数据的情况，容易造成数据错乱（即脏数据），一般操作的执行时间要比 TS 短。

## PHP 常用的 SAPI

SAPI （Server Application Programming Interface，服务端应用编程端口）

- cli
    - 就是一般的命令行模式
- cli-server
    - 就是 php 内置的 web 服务器，一般只用于开发
- cgi
    - 就是传统的 cgi 模式，由 php-cgi 这个文件执行
- apahce_mod
    - apache 模块，编译时需要有这个参数 --with-apxs2
    - apxs 是通过 `yum install httpd-devel` 或 `apt install apache2-dev` 安装的
    - 寻找 apxs 的路径 `find / -name apxs`
- fast-cgi
    - php-cgi
        - 可以支持 cgi 和 fastcgi 的执行文件，编译时没有这个参数 --disable-cgi 就会编译出这个执行文件
        - 以 cgi 模式运行时，只需要指定 php-cgi 的路径就可以了
        - 可以以这样的命令 `php-cgi -b ip:port` 运行 fastcgi模式
    - fpm
        - FastCGI Process Manager ，一开始是作为 php-cgi 管理器存在的，但好像 5.4 之后的版本可以单独运行了，编译时需要有这个参数 --enable-fpm
- ISAPI
    - ISAPI（Internet Server Application Program Interface）是微软提供的一套面向WEB服务的API接口。
    一般使用在 php + iis 的组合里，好像 7 之后的版本就不支持了，现在已经很少用到了。
    - 现在使用 iis + php 的组合时通常会用 FastCgiModule 这个模块， php 以 fast-cgi 形式运行
- SAPI 还有好几种例如 phpdbg embed php-win 这些 

可以这样查看 php 当前的运行模式
```
echo php_sapi_name();
```

## 和 http 服务器的组合

### php 自身提供 http 服务

1. 在 cli 模式下实现一个 http 服务，例如 swoole 或 workerman
2. php 的内置服务器

这时 php 可以直接提供 http 服务或者通过反向代理和其它 http 服务器组合使用。

php 的内置服务器是单进程单线程的，运行的效率并不高

### cgi 模式

通过 php-cgi 和 http 服务器的组合，通常是 php-cgi + apache ， nginx 不能直接支持 cgi 。
但现在已经很少这用部署了，因为 cgi 的性能并不好。
其实 cli 也能实现 cgi 的，但是要自行解释 标准输入 和 环境变量 里的参数，然后自行构造 http 的响应头。

### fastcgi 模式

1. 直接使用 php-cgi 对接 http 服务器，例如 windows 环境下的 nginx + php-cgi ，好像是因为 fpm 依赖 fork ，但 windows 里没有 fork ，所以 fpm 没有 windows 版
    - 如果一定要在 windows 运行 fpm ，可以尝试这些 windows 下的 linux 环境
        - wsl
        - 虚拟机
        - docker
        - cygwin
2. 使用 fpm 对接 http 服务器，例如 linux 环境下的 nginx + fpm
3. 使用一个 fastcgi 管理器，然后配置 php-cgi 对接 http 服务器，例如 nginx + spawn-fcgi + php-cgi

使用 php-cgi 时最好配置这个环境变量 PHP_FCGI_CHILDREN 。

PHP_FCGI_CHILDREN 默认值是 1 ，大致就是一个管理器，一个子进程，速度估计也就比 php 的内置服务器好一点。

如果 PHP_FCGI_CHILDREN 的值为 0 ，就只有一个子进程，那么只要累计的请求数达到 PHP_FCGI_MAX_REQUESTS ， php-cgi 就会自动退出，继续有请求时 nginx 就会返回 502 。

php-cgi 没有平滑重启，修改 php.ini 后要重启 php-cgi 。

### apache 模块

<!--
apache 的 模块
mod_fcgid
mod_fastcgi
mod_proxy_fcgi
mod_cgid
mod_cgi
-->

apache 模块的运行方式也是十分流行的运行方式。

这里需要注意的是，要根据 apache 的 mpm (Multi-Processing Module) 来选择 PHP 的版本。

mpm 的比较常用模式有四种。
- prefork
    - 多进程单线程，就是传统的 apache 运行模式，NTS 和 TS 版的 PHP 都可以
- worker
    - 多进程多线程 相比于 prefork 降低了内存的使用，这里必须用 TS 版的 PHP
- event
    - worker + epoll 相比于 worker 解决了 keep-alive 场景下，长期被占用的线程的资源浪费问题，这里必须用 TS 版的 PHP
- winnt
    - windows 环境下的多进程多线程，这里必须用 TS 版的 PHP

PHP 官方不建议用线程化 MPM (比如 event ) 的 Apache 来跑 PHP
https://www.php.net/manual/zh/faq.installation.php#faq.installation.apache2

## 总结

- nginx + fpm
- nginx + php-cgi
- apache + php-cgi (cgi 模式)
- apache + php-cgi (fastcgi 模式)
- apache + fpm
- apache + apahce 模块
- nginx 反向代理 cli (例如 反向代理 + swoole)
- nginx 反向代理 apache (这里的 apache 可以以任意方式运行 php)
- apache 反向代理 cli (例如 反向代理 + swoole)
- ......

php 的运行模式有很多种。
现在 php 比较流行的部署方式，就只有两种
- nginx + fpm
- apache + apahce 模块

因为 swoole 的发展，在 cli 下实现 http 服务的运行方式也越来越流行了。

无论哪种运行方式，本质上都是 接收数据 处理数据 输出数据 三板斧。
