# 在 Windows 下安装 pear

1. 用管理员方式打开 cmd

2. cd 进 php 的目录

3. 在 php 的目录里新建一个名为 PEAR 的文件夹
```
md PEAR
```

4. 下载 go-pear.phar 并复制进刚刚新建的 PEAR 的文件夹
```
php -r "copy('https://pear.php.net/go-pear.phar', 'pear/go-pear.phar');"
```

5. 安装 pear
```
php -d phar.require_hash=0 PEAR/go-pear.phar
```

6. 当出现这样的提示时，选 local
```
Are you installing a system-wide PEAR or a local copy?
```

7. 接着是关于路径的询问，这里有很多个选项，如需修改路径，输入对应数字即可，一般情况下就按回车键。如果有路径为空，则必须手动设置路径，不然会一直卡在这一步

8. 一路按回车和输入 yes 就可以了

9. php.ini 的 include_path 这项是必须的，在安装 pear 的过程中会询问你是否修改这项，因为是一路按回车和输入 yes 所以这项在安装完后就会设置好， include_path 默认是注释掉的， include_path 的值为 PEAR 文件夹的绝对路径，例如
```
include_path=".;C:\php\PEAR\"
```

10. 安装完后需要重启服务器

11. 安装完毕后如无意外就可以在命令行里使用 pear 和 pecl 命令，linux 的 pecl 是要单独安装的

## 部分常用命令

从网络安装某一个 pear package：
```
pear install packagename
```
下载 package 但不安装：
```
pear download packagename
pear download-all
```
安装已下载的 package：
```
pear install filename.tgz
```
package 列表：
```
pear remote-list
```
列出已安装 package：
```
pear list
```
列出可以升级的 package：
```
pear list-upgrades
```
更新 package：
```
pear upgrade packagename
pear upgrade-all
```
删除已安装的 package：
```
pear uninstall packagename
```
运行 pear 或 pecl 命令时，最好在管理员环境下运行

## pear pecl composer 的关系

- PEAR 全称为 PHP 扩展与应用库(PHP Extension and Application Repository)。为了创建一个类似于 Perl CPAN 档案的工具，Stig S. Bakken 在 1999 年创立了 PEAR 项目。

- PECL 的全称是 The PHP Extension Community Library ，是一个开放的并通过 PEAR 打包格式来打包安装的 PHP 扩展库仓库。通过 PEAR 的 Package Manager 的安装管理方式，可以对 PECL 模块进行下载和安装。

- Composer 是 PHP5.3 以上 的一个依赖管理工具。它允许你声明项目所依赖的代码库，它会在你的项目中为你安装他们。 Composer 不是一个包管理器。是的，它涉及 "packages" 和 "libraries"，但它在每个项目的基础上进行管理，在你项目的某个目录中（例如 vendor ）进行安装。默认情况下它不会在全局安装任何东西。因此，这仅仅是一个依赖管理。

- 貌似还有一个 PEAR2 和 Pyrus 但网上的资料比较少，这里就忽略不提了。

- PEAR 和 Composer 安装的都是用 PHP 代码写成的 packages 或 libraries ， PHP 社区的趋势是使用 Composer 替代 PEAR 。 PECL 安装的是用 C/C++ 代码写成的 PHP 拓展。

- pecl 的命令和 pear 类似，把上面的命令的 pear 替换为 pecl 即可，但 pecl 下载的是拓展的源码，需要编译才能使用，一般是把编译好的 dll 或 so 文件放到 php 的拓展目录，然后再修改 php.ini 才可以使用

## 时间轴

| 时间 | 项目 |
| ---- | --- |
| 1999 | PEAR |
| 2004 | PECL |
| 2009 | PEAR2 |
| 2012 | Composer |