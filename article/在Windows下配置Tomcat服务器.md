# 在Windows下配置Tomcat服务器

## 0. 目标
- 在 Windows 下配置 Tomcat 服务器
- Windows 10 (x64)
- Tomcat 9
- JAVA 8

## 1. 下载 JAVA
```plaintext
https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
```
选择，Windows 64 位
## 2. 安装 JAVA
打开下载的 exe 文件，一路点 next 直到安装完毕

## 3. 配置 JAVA 环境变量
1. 新建一个环境变量 JAVA_HOME ，值为 JDK 的安装目录，例子
```plaintext
C:\Program Files\Java\jdk1.8.0_161
```

2. 把以下值加入到环境变量 Path
```plaintext
%JAVA_HOME%\bin
%JAVA_HOME%\jre\bin
%JAVA_HOME%\lib
```

## 3. 下载 Tomcat
```plaintext
https://tomcat.apache.org/download-90.cgi
```
选择，core，Windows 64 位
## 4. 配置 Tomcat
1. 解压下载的文件
2. 把解压后的文件夹复制到 C 盘的根目录下（这里可以是任意目录）
3. 把 Tomcat 目录下的 bin 文件夹的路劲加入的环境变量
4. 把网站程序复制进 Tomcat 的 webapps 文件夹
5. 启动 Tomcat ，启动 Tomcat 的脚本在 bin\startup.bat
