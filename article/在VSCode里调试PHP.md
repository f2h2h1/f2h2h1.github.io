# 在 VSCode 里调试 PHP

## 1 下载对应版本的 Xdebug
1. 在命令行里运行
    ```
    php -i
    ```
2. 打开这个网址 https://xdebug.org/wizard.php 把第一步输出的结果复制进去，然后获得对应版本 Xdebug 的下载地址，当然如果你知道熟悉 PHP 的版本也可以直接选择相应的版本下载
3. 解压下载后的压缩包，把 Xdebug 的拓展复制进 PHP 的拓展目录里，PHP 的拓展目录一般是安装目录里的 ext 文件夹

## 2 修改 php.ini
在 php.ini 的最后加上以下内容

- xdebug 2.9
    ```plaintext
    [Xdebug]
    ; xdebug 拓展的 so 或 dll 的路径，这里最好填绝对路径
    zend_extension = path/to/xdebug
    ; 日志路径
    ; xdebug.remote_log = ""
    ; 跟踪输出路径
    ; xdebug.trace_output_dir = ""
    ; 是否开启远程调试
    xdebug.remote_enable = on
    ; 是否开启分析器
    ; xdebug.profiler_enable = on
    ; 分析器文件路径
    ; profiler_output_dir = ""
    ; 允许调试的客户端IP
    xdebug.remote_host = 127.0.0.1
    ; 远程调试的端口
    xdebug.remote_port = 9003
    ; 开启远程调试自动启动
    ; xdebug.remote_autostart = on
    ; 显示局部变量
    xdebug.show_local_vars = on
    ; 显示默认的错误信息
    xdebug.default_enable = on
    ; ide key
    xdebug.idekey = "vscode"
    ```
- xdebug 3.0
    ```plaintext
    [Xdebug]
    zend_extension = path/to/xdebug
    xdebug.mode = "debug"
    xdebug.idekey = "vscode"
    xdebug.client_host = 127.0.0.1
    xdebug.client_port = 9003
    xdebug.connect_timeout_ms = 2000
    ```

## 3 安装 VSCode 的 PHP 拓展包

- IntelliSense
    - [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)
    - [PHP IntelliSense](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-intellisense)
- Xdebug
    - [PHP Debug](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug)

在 VSCode 的拓展里搜索对应的插件名然后选择安装即可。

IntelliSense 的插件有两个， IntelliSense 只需要装一个就可以的了，笔者更喜欢用 PHP Intelephense 。

## 4 在 VSCode 里设置 Xdebug
1. 使用 VSCode 以打开文件的方式，打开需要调试的 PHP 项目所在的文件夹
2. 在 VSCode 里选择调试，然后选添加配置，然后选 PHP
3. 这时 VSCode 会在 launch.json 自动添加 Xdebug 的相关配置，如果 lanuch.json 不存在则会自动新建，如果是调试 PHP 一般不用修改 lanuch.json 的默认内容，大多数情况下监听的端口都是 9003

## 5 调试

如果配置启用了自动调试，那么脚本的运行命令就不需要额外的参数， 浏览器也不需要 Xdebug Helper 插件。
但是这样会所有请求都启用调试。

### 命令行
1. 在 VSCode 打开的文件夹里新建一个 PHP 脚本
2. 在这个脚本里设置一个断点，然后点击开始调试
3. 然后用这样的命令执行脚本
    - xdebug 2.9
        ```
        php -d xdebug.remote_autostart=on test.php
        ```
    - xdebug 3.0
        ```
        php -d xdebug.start_with_request=on test.php
        ```
4. 如无意外，当代码运行到断点时会自动停止

### web
1. 在浏览器里安装 Xdebug Helper ，在浏览器的拓展搜索 Xdebug Helper 即可
2. 在 Xdebug 的配置里添加这一项 xdebug.idekey
    ```plaintext
    xdebug.idekey = "vscode"
    ```
3. 设置 Xdebug Helper 的 IDE Key 为 other ，vaule 为 vscode
4. 这是点击，浏览器地址栏右边的 debug 图标就可以进行调试了
5. 然后在浏览器里访问对应的地址
6. Xdebug Helper 实现的原理是， xdebug.idekey 的值会添加到 cookies 里（大概像这样 `XDEBUG_SESSION=vscode` ）， php 检测到 xdebug.idekey 后就会通知 IDE 启动调试
7. 用 postman 或 curl 这类工具测试时，只要 http 头的 cookie 带有 `XDEBUG_SESSION=vscode` ，就是触发调试的了，类似于这样
    ```
    curl -k --cookie "XDEBUG_SESSION=vscode" http://testurl
    ```

## 6. 使用分析工具

### QCacheGrind
0. QCacheGrind 不支持 xdebug 3.0
1. 下载 QCacheGrind
    ```plaintext
    https://sourceforge.net/projects/qcachegrindwin/
    ```
2. Xdebug 的配置里需要有这两项， xdebug.profiler_output_dir 是分析文件的输出目录
    ```plaintext
    xdebug.profiler_enable = on
    xdebug.profiler_output_dir = ""
    ```
3. 启动调试后，在这个目录里 xdebug.profiler_output_dir 找到分析文件，并使用 QCacheGrind 打开
4. 分析文件的文件名通常是 cachegrind.out.7468 后面的数字是进程ID。

### Webgrind

https://github.com/jokkedk/webgrind

## 其它
- 需要把 PHP 的可执行文件加入到环境变量中，如果没有，怎需要在 VSCode 里设置 php.validate.executablePath 的值
- xdebug 2.9 升级 xdebug 3.0 的文档 https://xdebug.org/docs/upgrade_guide
