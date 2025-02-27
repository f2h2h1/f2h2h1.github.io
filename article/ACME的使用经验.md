# ACME的使用经验

## ACME 简介

ACME 是一个自动管理证书的程序。
rfc8555 是 ACME 的 rfc 。
```
ACME
Automatic Certificate Management Environment
自动 证书 管理 环境
```

ACME 有很多种实现，这篇文章描述的是 acme.sh 的使用。

acme.sh 的 GitHub 仓库地址
```
https://github.com/acmesh-official/acme.sh
```

acme.sh 的文档
```
https://github.com/acmesh-official/acme.sh/wiki

中文说明
https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E
https://github.com/acmesh-official/acme.sh/wiki/Blogs-and-tutorials#%E4%B8%AD%E6%96%87
```

## ACME 下载和安装

直接下载安装
```
curl https://get.acme.sh | sh -s email=my@example.com
curl https://raw.githubusercontent.com/acmesh-official/acme.sh/master/acme.sh | sh -s -- --install-online -m  my@example.com
```

从源码安装
```
git clone --depth 1 https://github.com/acmesh-official/acme.sh.git
cd acme.sh
./acme.sh --install -m my@example.com
```

安装完后把 .acme.sh 文件夹复制到用户的根目录下，类似这样的路径
```
~/.acme.sh/
/root/.acme.sh/
```

为 acme.sh 创建一个别名
- 在 ~/.bashrc 加入这一行
    ```
    alias acme.sh=~/.acme.sh/acme.sh
    ```
- 然后再运行这句 source ~/.bashrc
- 如果没有 ~/.bashrc ，就新建一个 touch ~/.bashrc

> 其实把安装后的目录复制到用户的根目录和创建别名都不是必须的，但为了贴合文档的教程和方便使用，最好还是这样做

## 申请证书

运行这句命令申请证书，
运行这句命令时，http服务需要已经启用，并且是监听 80 端口的，
注意修改域名和站点根目录的路径
```
acme.sh --issue -d www.example.com --webroot /home/wwwroot/example.com/
```

如果加上 --standalone 参数， acme.sh 能临时运行一个 webserver, 临时听在80 端口，但这是使用 socat 实现的，所以要先安装好 socat
```
acme.sh --issue -d www.example.com --webroot /home/wwwroot/example.com/ --standalone
```

申请证书命令运行后会输出证书生成的位置，这个位置通常是
```
~/.acme.sh/www.example.com_ecc/cert.pem
~/.acme.sh/www.example.com_ecc/www.example.com.key
~/.acme.sh/www.example.com_ecc/fullchain.cer
```

上面的命令是使用 HTTP 验证， DNS 验证因为笔者没有用到就不记录了

## 安装证书

```
acme.sh --install-cert -d www.example.com \
    --cert-file      /c/nginx/crt/www.example.com/cert.pem  \
    --key-file       /c/nginx/crt/www.example.com/www.example.com.key \
    --fullchain-file /c/nginx/crt/www.example.com/fullchain.cer \
    --reloadcmd     "service nginx force-reload"
```

- 这行命令主要的作用是把证书复制到对应的文件夹和加下服务器重启的命令，然后用于自动续签
    - --cert-file 证书
    - --key-file 私钥
    - --fullchain-file 证书链
    - --reloadcmd 服务器重启命令
- 安装证书后 --reloadcmd 不能修改，要修改 --reloadcmd 命令，就重新安装一次证书，直接改配置文件也是可以的，但文档里不推荐这样做
- 其实安装证书这步不是必须的，可以自己手动把证书复制到对应的目录里，但没有安装证书这一步就不能自动续签

## 续签证书

要先运行过安装证书的命令才能使用续签证书的命令。
如果没有，那么要重新申请一次证书，然后把证书复制到对应的目录里。
多数情况下，续签证书的命令会加到定时任务里。

一般的命令
```
~/.acme.sh/acme.sh --cron --home "/root/.acme.sh" > /dev/null
# windows 环境下要写成这样
~/.acme.sh/acme.sh --cron --home "/c/Users/Administrator/.acme.sh" > /dev/nul
# --home 是 acme.sh 的安装路径，要写成绝对路径
```

写成 cron 表达式
```
0 2 * * * /bin/bash /root/.acme.sh/acme.sh --cron --home "/root/.acme.sh" > /dev/null
```

这个命令除了用于续签证书外，还用于自动更新

## 其它常用的命令

查看全部证书
```
acme.sh --list
```

<!--
产看全部证书，包括已过时的
```
acme.sh --list-archive
```
-->

查看已安装证书的信息，这个命令可以查看配置文件的位置，可以通过修改配置文件修改安装证书时的参数，例如证书的位置，服务器的重启命令
```
acme.sh --info -d www.example.com
```

删除证书
```
acme.sh --remove -d www.example.com
```

更新
```
acme.sh --upgrade
```

开启自动更新
```
acme.sh --upgrade --auto-upgrade
```

关闭自动更新
```
acme.sh --upgrade --auto-upgrade 0
```

卸载 acme.sh
```
acme.sh --uninstall
```

## 在 Windows 环境下使用 ACME

acme.sh 文档里关于 Windows 环境的描述
```
https://github.com/acmesh-official/acme.sh/wiki#4-how-to-run-on-windows-with-cygwin-or-git-bash
```

- 先安装好 cygwin 环境，其实装好 git for windows 就可以了
- 然后和 linux 的步骤基本一致，命令运行在 cygwin 环境就好了
- 需要注意
    - 路径都要写成 linux 的格式，例如 网站根目录 ， 证书安装路径 这些
        - 类似这样的 /c/nginx/crt/www.example.com/cert.pem
    - 安装证书时的 reloadcmd 命令
    - 定时任务

自动续签证书的定时任务可以使用 windows 计划任务，但这样的写法，任务运行时会有一个黑框弹出来
（笔者试了很多方法依然无法隐藏这个黑框，在服务器里每晚运行一次的话应该没关系的吧，即使有黑框也是一闪而过）
```
Register-ScheduledTask -TaskName "acme_cron" -AsJob -Trigger (New-ScheduledTaskTrigger -Daily -At "2:00 AM") -Action (New-ScheduledTaskAction -Execute "PowerShell" -Argument "-Nolog -NonInteractive -WindowStyle Hidden -Command `"C:\Users\a\Git\usr\bin\bash.exe -l /c/Users/a/.acme.sh/acme.sh --cron --home /c/Users/a/.acme.sh`"")
```


似乎可以这样安装 计划任务 ，即使在 windows 环境里，只要在 cygwin 中运行，一样是有效的
```
acme.sh --install-cronjob
```

删除定时任务
```
acme.sh --uninstall-cronjob 
```

<!-- 从源码里看，似乎只要运行了 acme.sh --install 就会自动新建定时任务了，除非指定了 --no-cron 参数 -->

### 以 nginx 为例子

假设已经安装好 acme.sh 和 nginx

1. 在 nginx 安装目录下新建一个名为 crt 的目录， 在 crt 目录下再新建一个以域名为名的目录
1. 直接启动 nginx
    - nginx 的配置文件里一般会有一个默认的站点，这个站点的目录一般在 nginx 的安装目录下的 html 目录
1. 运行申请证书的命令，在 nginx 默认的站点更目录里运行这句
    ```
    acme.sh --issue -d www.example.com --webroot $(pwd)
    ```
1. 在 nginx 的安装目录里新建一个名为 restart.ps1 的文件并写入以下内容，这个脚本主要是用于重启 nginx 的，要注意 powershell 的执行策略
    ```powershell
    # 切换到批处理文件所在的目录
    Set-Location $PSScriptRoot

    # 显示批处理文件所在的目录
    Write-Output $PSScriptRoot

    # 停止 nginx 服务
    ./nginx.exe -s quit

    # 等待 6 秒
    Start-Sleep -Seconds 6

    # 强制结束 nginx 进程及其子进程
    Get-Process -Name nginx | Stop-Process -Force

    # 测试 nginx 配置文件
    ./nginx.exe -T

    # 启动 nginx 服务
    Start-Process -FilePath powershell -ArgumentList "-NonInteractive", "-command", "./nginx.exe"
    ```
1. 运行安装证书的命令
    ```
    acme.sh --install-cert -d www.example.com \
        --cert-file      /c/Users/a/nginx/crt/www.example.com/cert.pem  \
        --key-file       /c/Users/a/nginx/crt/www.example.com/www.example.com.key \
        --fullchain-file /c/Users/a/nginx/crt/www.example.com/fullchain.cer \
        --reloadcmd     "powershell \"C:\Users\a\nginx\restart.ps1\""
    ```
1. 在 nginx 的配置文件里加上这一段
    ```
    server {
        listen       80;
        server_name  www.example.com;

        listen       443 ssl http2;
        ssl_certificate  ./crt/www.example.com/fullchain.cer;
        ssl_certificate_key ./crt/www.example.com/www.example.com.key;

        access_log  logs/www.example.com.access.log;
        error_log  logs/www.example.com.error.log;

        if ($scheme = 'http') {
            return 302 https://$host$request_uri;
        }

        location / {
            root   C:/User/a/www.example.com; # 这是站点根目录的路径
            index  index.html index.htm;
        }
    }
    ```

<!--
New-ScheduledTaskTrigger -Weekly -DaysOfWeek Tuesday -At "4:00 AM"

Register-ScheduledTask -TaskName "acme_cron" -AsJob -Trigger (New-ScheduledTaskTrigger -Weekly -DaysOfWeek Tuesday -At "4:00 AM") -Action (New-ScheduledTaskAction -Execute "PowerShell" -Argument "-Nolog -NonInteractive -WindowStyle Hidden -Command `"C:\Users\a\Git\usr\bin\bash.exe -l /c/Users/a/.acme.sh/acme.sh --upgrade`"")


版本是 3.0.8




        server {
            listen       80;
            server_name  blog.complexcloud.site;

            listen       443 ssl http2;
            ssl_certificate  ./crt/blog.complexcloud.site/domain.crt;
            ssl_certificate_key ./crt/blog.complexcloud.site/rsa_private_key.pem;

            access_log  logs/blog.complexcloud.site.access.log;
            error_log  logs/blog.complexcloud.site.error.log;

            if ($scheme = 'http') {
                return 302 https://$host$request_uri;
            }

            location / {
                root   C:/blog; # 这是站点根目录的路径
                index  index.html index.htm;
            }
        }


# 切换到批处理文件所在的目录
Set-Location $PSScriptRoot

# 显示批处理文件所在的目录
Write-Output $PSScriptRoot

# 停止 nginx 服务
./nginx.exe -s quit

# 等待 6 秒
Start-Sleep -Seconds 6

# 强制结束 nginx 进程及其子进程
Get-Process -Name nginx | Stop-Process -Force

# 测试 nginx 配置文件
./nginx.exe -T

# 启动 nginx 服务

# nginx 成功启动，但当前的 powershell 窗口会一直保持
# ./nginx.exe

# nginx 成功启动，但 powershell 的窗口一闪而过
# Start-Process -FilePath "./nginx.exe"

# nginx 成功启动，但 nginx 退出时 powershell 的窗口不会跟着退出
# Start-Process -FilePath powershell -ArgumentList "-noexit", "-command", "./nginx.exe"

# nginx 成功启动，nginx 退出时 powershell 的窗口也会跟着退出
Start-Process -FilePath powershell -ArgumentList "-NonInteractive", "-command", "./nginx.exe"

# powershell "C:\Users\a\dev\nginx-1.25.3\restart.ps1"

-->
