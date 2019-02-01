# 安装 PHP7 的 GUI 扩展
## 1 下载拓展
- https://pecl.php.net/package/ui
- 按照本地的 PHP 版本下载对应的拓展文件

## 2 安装拓展
1. 把下载下来的压缩包解压
2. 把 php_ui.dll 复制到 PHP 的 ext 目录下
3. 把 libui.dll 和 pthreadVC2.dll 放到 PHP 的根目录下

## 3 运行 demo
- 解压的压缩包里有四个 demo
- gallery.php histogram.php snake.php starfield.php
- 可以使用命令行运行
- 例如 php snake.php
- 如果是 windows 系统，可以使用 php-win 运行，这样就没有黑框了

## 注意
如果出现这种错误

> 无法启动此程序，因为计算机中丢失 libui.dll，尝试重新安装该程序以解决此问题。

这个提示出现说明你没有放入 libui 和 pthreadVC2 文件到 php 的根目录下