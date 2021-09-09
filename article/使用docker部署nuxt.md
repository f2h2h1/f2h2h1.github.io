使用 docker 部署 nuxt
================================

下文描述的是用 docker 部署 nuxt ， nuxt 使用 ssr 。
下文提及的 docker 版本是 18.09 。

## 方式1 直接使用 node 镜像部署

0. 拉取 node 的镜像， node 的版本最好和本地开发的一致
0. 确定构建的命令，一般都是 `npm install && npm build`
0. 确定运行的命令，一般都是 `npm run`
0. 配置文件里监听的 ip 只能是 127.0.0.1 或 0.0.0.0
0. 确定配置文件里监听的端口号
0. 克隆代码仓库，并 cd 进仓库的根目录
0. 使用这样的命令运行起一个 node 容器，要注意端口号的映射
    ```
    docker run -d --restart always \
        --name my-nuxt \
        -p 3000:3000 \
        -v `pwd`:/app -w /app \
        node:14.16-slim \
        /bin/bash -c " \
        npm install && \
        npm run build && \
        npm run start "
    ```
0. docker 参数的解释
    ```
    --rm 容器停止后自动删除
    -it 在前台运行容器 （这个不够准确，但可以这样简单地理解）
    -d 在后台运行容器
    --restart always 容器自动重启
    --name 容器名
    -w 容器的工作目录 这个是相对容器而言的
    -p 和宿主机映射的端口 宿主机端口:容器端口
    -v 和宿主机绑定的路径 宿主机路径:容器路径
    ```
0. 容器启动命令的解释
    |命令|解释|
    |:--|:--|
    |/bin/bash|运行 bash|
    |-c|这个参数是把一段命令传递给 bash|
    |npm install|安装依赖|
    |npm run build|构建|
    |npm run start|运行|
0. nginx 里的配置大概写成这样，要注意端口号和容器启动的命令里的端口号一致
    ```
    location / {
        # proxy_http_version 1.1; #代理使用的http协议
        proxy_set_header Host $host; #header添加请求host信息
        proxy_set_header X-Real-IP $remote_addr; # header增加请求来源IP信息
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 增加代理记录
        proxy_pass http://127.0.0.1:3000/;
    }
    ```
0. 如果要更新代码
    0. 先暂停并删除当前的容器
    0. 用 git 拉取新的代码
    0. 用上面的命令启动一个新的容器

## 方式2 打包一个新的镜像部署

0. 确定构建的命令，一般都是 `npm install && npm build`
0. 确定运行的命令，一般都是 `npm run`
0. 配置文件里监听的 ip 只能是 127.0.0.1 或 0.0.0.0
0. 确定配置文件里监听的端口号
0. 克隆代码仓库，并 cd 进仓库的根目录
0. 在仓库的根目录里新建一个名为 dockerfile 的文件，并写入以下内容，请根据注释的提示修改
    ```
    FROM node:14.16-slim # node 的版本最好和本地开发的一致
    COPY . /app
    WORKDIR /app
    # 这里是构建命令
    RUN npm install && npm run build
    ENTRYPOINT ["/bin/bash", "-c"]
    # 这里是运行命令
    CMD ["npm run start"]
    ```
0. 然后运行构建镜像 `docker build -t my/nuxt:0.0.1 .`
0. 然后运行容器 `docker `
    ```
    docker run -d --restart always \
        --name my-nuxt \
        -p 3000:3000 \
        -v `pwd`:/app -w /app \
        my/nuxt:0.0.1
    ```
0. nginx 的配置和 方式1 里的一样
0. 更新代码时，先拉取一次，然后构建新的镜像，然后再删除当前运行的容器，最后再根据最新的镜像运行容器
0. 和 方式1 相比，虽然步骤多了一点，但重启的时间会更快，因为 方式1 的容器每次都要重新构建

## 使用 nginx 的负载均衡实现平滑重启

方式1 和 方式2 的部署方式，都会在更新的时候有一段短暂的服务不可用时间。
为了确保服务能不间断地运行，这里使用 nginx 的负载均衡实现一个平滑重启

### 原理
1. nginx 负载均衡的热备份
1. 启用两个容器，一个作为正式的容器，一个作为热备份的容器
1. 更新的时候先启动热备份的容器
1. 然后再删掉旧的正式的容器
1. 然后再启动新的正式的容器
1. 最后删掉热备份的容器 （因为热备份的容器只在更新时用到，平时不会用到，所以就删掉少占一点的内存）


### nginx 的配置

- 这一段的配置需要加在 server 的外面，要注意修改 端口号
```
upstream nuxtservice { # upstream 的名称是全局唯一的，就是在整个 nginx 里名称不能重复
    # server 127.0.0.1:8080 weight=1 max_fails=2 fail_timeout=2;
    # 这里的两个端口号也必须是全局唯一的
    server 127.0.0.1:3003 backup; # 热备
    server 127.0.0.1:3002;
    # 这里会存在一些问题，只能祈求前端会把状态都保存在浏览器里，如果状态保存在服务端，如果刚好遇到更新，那么状态就会混乱
}
```

- 这一段要主要是修改了 proxy_pass 的地址， proxy_pass 要填上面那段 upstream 的名称
```
location / {
    # proxy_http_version 1.1; #代理使用的http协议
    proxy_set_header Host $host; #header添加请求host信息
    proxy_set_header X-Real-IP $remote_addr; # header增加请求来源IP信息
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 增加代理记录
    proxy_pass http://nuxtservice/;
}
```

### 部署脚本

0. 下面这段脚本实现了自动的平滑重启
0. 请根据注释提示和实际情况修改变量
0. 主要是修改这几个变量
    |变量|解释|
    |:--|:--|
    |nodeVersion|node 的版本号|
    |buildCommand|项目构建命令 从安装依赖开始 多个命令用 && 隔开|
    |runCommand|项目运行命令 多个命令用 && 隔开|
    |prodPort|作为正式容器的端口 这里的端口号需要和 nginx 的配置对应上|
    |backupPort|作为热备份容器的端口 这里的端口号需要和 nginx 的配置对应上|
    |nuxtPort|nuxt 配置文件里的端口|
    |project|项目名 这个其实可以随便填的，只是为了区分不同的项目|
    |projectDir|项目根目录的绝对地址|
    |userName|镜像用户名|
    |apiUrl|接口域名|
    |dockerHostIP|宿主机的ip 一般都是 172.17.0.1|
0. 每次更新会生成类似这样的镜像 `my/nuxt:d15b2f4-2106171413` ，其中 my 是用户名； nuxt 是项目名； d15b2f4 是镜像对应的 commitid ； 2106171413 是镜像构建的时间
0. 这种更新方式，每更新一次就会产生一个新的镜像，所以要定期清理不使用的镜像，不然服务器的硬盘很快就会满的
0. 如果没有提示成功，那么就是失败
0. 出现错误了找问题会比较困难。大概有这几种错误的类型 sh 脚本错误， docker 镜像构建错误， docker 容器启动错误， nuxt 构建错误， nuxt 运行错误
0. 要注意给脚本执行权限
0. 执行脚本时加上 f 参数能强制更新镜像

```bash
#!/bin/bash

# 获取脚本当前目录
SHELL_FOLDER=$(dirname $(readlink -f "$0"))
# 设置日志文件路径
logfile=$SHELL_FOLDER"/deploy-"`date +'%g%m%d%H%M%S'`".log"
if [ ! -f "$logfile" ]; then
    touch $logfile
fi

# 输出日志的函数
function logger() {
    timestamp=`date +'%g-%m-%d %H:%M:%S'`
    echo [$timestamp] $1
    echo [$timestamp] $1 >> $logfile
}
# 移除容器的函数
function rmimage() {
    docker stop $1 && docker rm $1
}

# ==================================================
# 这些变量名 请根据实际情况修改

# node 的版本号
nodeVersion=14.16

# 项目构建命令 从安装依赖开始 多个命令用 && 隔开
buildCommand="rm -r -f node_modules && npm i && npm install && npm audit fix && npm run build"

# 项目运行命令 多个命令用 && 隔开
runCommand="npm run start"

# 作为正式容器的端口
prodPort=3002
# 作为热备份容器的端口
backupPort=3003
# nuxt 配置文件里的端口
nuxtPort=3001

# 项目名
project="nuxt"

# 项目根目录的绝对地址
projectDir="/www/wwwroot/my_nuxt"

# 接口域名，如果前端和后端部署在同一台服务器里，把接口域名解释成本地ip，接口响应·速度能提升不少的
apiUrl=""
# docker 宿主机的ip 一般都是 172.17.0.1
dockerHostIP="172.17.0.1"

# 如果项目根目录不是当前目录，就切换到项目根目录
# 如果项目根目录为空，则会默认当前目录是项目根目录
if [ ! -z "$projectDir" ]; then
    cd $projectDir
else
    projectDir = $(pwd)
fi
logger "切换到项目根目录 "$projectDir

# ==================================================

# 镜像的用户名
userName="my"

# node 镜像名
baseImageName="node:$nodeVersion-slim"

# 作为正式容器的容器名
pordName="$project-nuxt"
# 作为热备份容器的容器名
backupName="$pordName-backup"

# ==================================================

logger "这段脚本的运行速度可能会有一点的慢，请耐心等待，请勿中断脚本的运行"

logger "构建新的容器入口运行脚本"
rm -f entrypoint.sh
touch entrypoint.sh
echo "#!/bin/bash" >> entrypoint.sh
if [ $dockerHostIP ]; then
    echo "echo \"$dockerHostIP    $apiUrl\" >> /etc/hosts" >> entrypoint.sh
fi
echo $runCommand >> entrypoint.sh
cat entrypoint.sh

logger "构建新的 dockerfile 文件"
rm -f dockerfile
touch dockerfile
echo "FROM "$baseImageName >> dockerfile
echo "COPY . /app" >> dockerfile
echo "WORKDIR /app" >> dockerfile
echo "RUN "$buildCommand >> dockerfile
echo "RUN chmod +x /app/entrypoint.sh" >> dockerfile
echo "ENTRYPOINT [\"/app/entrypoint.sh\"]" >> dockerfile
cat dockerfile

logger "正在拉取新的代码，请耐心地等待"
git reset --hard
git pull
if [ $? != 0 ]; then
    logger "拉取新的代码失败 "
    exit 1
fi

commitid=$(git rev-parse --short HEAD)

# 根据 commitid 拼接镜像名
imageName="$(echo $userName/$project:$commitid-`date +%g%m%d%H%M`)"
imageNameLatest="$userName/$project:latest"

logger "判断当前版本是否已有镜像"
forceUpdate=0
docker images | grep "$commitid-[0-9]" &> /dev/null
if [ $? -eq 0 ]; then
    logger "当前版本对应的镜像已存在"
    docker images
    docker images | grep "$commitid-[0-9]"
    echo $imageName
    if test "$1"; then
        if [ $1 = "f" ]; then
            logger "强制更新"
            forceUpdate=1
        else
            imageName=$imageNameLatest
        fi
    else
        imageName=$imageNameLatest
    fi
else
    logger "当前版本没有对应的镜像，构建一个新的镜像"
    forceUpdate=1
fi

if [ $forceUpdate -eq 1 ]; then
    # 先删掉 构建时生成的目录
    rm -r -f node_modules .nuxt .history

    logger "构建新的镜像"
    docker build -t $imageName .
    if [ $? != 0 ]; then
        logger "镜像构建失败 "
        # 这里需要清理
        echo "构建镜像失败时会产生临时的镜像和临时的容器"
        echo "请使用 docker images 查找那些临时的镜像，然后用 docker rmi 来删除那里临时的镜像"
        echo "请使用 docker ps -a 查找那些临时的容器，然后用 docker stop 来停止那里临时的容器，然后用 docker rm 来删除那里临时的容器"
        exit 1
    fi
    docker tag $imageName $imageNameLatest
fi

logger "删除热备份的容器（为了兼容性，在部署容器之前都会尝试删除旧的容器）"
rmimage $backupName

logger "部署热备份的容器"
docker run -d --name $backupName -p $backupPort:$nuxtPort $imageName
if [ $? != 0 ]; then
    logger "部署热备份的容器失败 "
    rmimage $backupName
    exit 1
fi

logger "等待 45 秒，确保热备份的容器已经运行起来"
sleep 45

logger "判断热备份的容器是否有启动成功"
# curl 127.0.0.1:$backupPort || echo "热备份的容器启动失败"; exit 1
curl --max-time 15 -L 127.0.0.1:$backupPort &> /dev/null
if [ $? != 0 ]; then
    logger "热备份的容器启动失败 "
    rmimage $backupName
    exit 1
fi
logger "热备份的容器启动成功"

sleep 1

logger "删除当前正式的容器（为了兼容性，在部署容器之前都会尝试删除旧的容器）"
rmimage $pordName

logger "部署新的正式的容器"
docker run -d --restart always --name $pordName -p $prodPort:$nuxtPort $imageName
if [ $? != 0 ]; then
    echo "部署正式的容器失败 "
    rmimage $pordName
    exit 1
fi

logger "等待 45 秒，确保正式的容器已经运行起来"
sleep 45

logger "判断正式的容器是否启动成功"
curl --max-time 15 -L 127.0.0.1:$prodPort &> /dev/null
if [ $? != 0 ]; then
    logger "正式的容器启动失败 "
    rmimage $pordName
    exit 1
fi
logger "正式的容器启动成功"

logger "正在删除悬空的镜像，请耐心等候"
echo "y" | docker image prune

logger "部署的所有步骤已经运行完，如无意外，部署应该是成功了的"

```
