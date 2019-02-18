# 在 VSCode 里调试 PHP

## 1 下载对应版本的 Xdebug
1. 在命令行里运行
```
php -i
```
2. 打开这个网址 https://xdebug.org/wizard.php 把第一步输出的结果复制进去，然后获得对应版本 Xdebug 的下载地址，当然如果你知道熟悉 PHP 的版本也可以直接选择相应的版本下载
3. 解压下载后的压缩包，把 Xdebug 的拓展复制进 PHP 的拓展目录里，PHP 的拓展目录一般是安装目录里的 ext 文件夹

## 2 修改 php.ini
在 php.ini 的最后加上如下内容
```plaintext
zend_extension=path/to/xdebug
[Xdebug]
xdebug.remote_enable = 1
xdebug.remote_autostart = 1
```
其中 path/to/xdebug 即 xdebug 所在的目录加上 xdebug 的文件名。

## 3 安装 VSCode 的 PHP 拓展包
在 VSCode 的拓展里搜索 PHP Extension Pack 然后选择安装即可

## 4 在 VSCode 里设置 Xdebug
1. 使用 VSCode 以打开文件的方式，打开需要调试的 PHP 项目所在的文件夹
2. 在 VSCode 里选择调试，然后选添加配置，然后选 PHP
3. 这时 VSCode 会在 launch.json 自动添加 Xdebug 的相关配置，如果 lanuch.json 不存在则会自动新建，如果是调试 PHP 一般不用修改 lanuch.json 的默认内容

## 5 测试
1. 在 VSCode 打开的文件夹里新建一个 PHP 脚本
2. 在这个脚本里设置一个断点，然后点击开始调试
3. 然后执行脚本
4. 如无意外，当代码运行到断点时会自动停止

## 6. 使用分析工具 QCacheGrind
1. 下载 QCacheGrind
````plaintext
https://sourceforge.net/projects/qcachegrindwin/
````
2. Xdebug 的配置里需要有这两项， xdebug.profiler_output_dir 是分析文件的输出目录
````plaintext
xdebug.profiler_enable = on
xdebug.profiler_output_dir = ""
````
3. 启动调试后，在这个目录里 xdebug.profiler_output_dir 找到分析文件，并使用 QCacheGrind 打开
4. 分析文件的文件名通常是 cachegrind.out.7468 后面的数字是进程ID。


## 7. 使用 Xdebug Helper 插件
1. 在浏览器里安装 Xdebug Helper ，在浏览器的拓展搜索 Xdebug Helper 即可
2. 在 Xdebug 的配置里添加这一项 xdebug.idekey
````plaintext
xdebug.idekey = "vscode"
````
3. 设置 Xdebug Helper 的 IDE Key 为 other ，vaule 为 vscode
4. 这是点击，浏览器地址栏右边的 debug 图标就可以进行调试了
5. Xdebug Helper 实现的原理是， xdebug.idekey 的值会添加到 cookies 里，浏览器检测到 xdebug.idekey 后就会通知 IDE 启动调试

## 注意
- 需要把 PHP 的可执行文件加入到环境变量中，如果没有，怎需要在 VSCode 里设置 php.validate.executablePath 的值
- 如果是 web 环境，那就再浏览器里访问对应的地址
