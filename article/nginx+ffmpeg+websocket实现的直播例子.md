# nginx+ffmpeg+websocket实现的直播例子

## 环境
- Windows 10
- nginx 1.7.11.3 Gryphon
- nginx-rtmp-module 1.1.4
- ffmpeg n5.0.1-4

虽然不知道为什么，但笔者尝试了很多次，都只有从 http://nginx-win.ecsds.eu/download/ 下载的 nginx 1.7.11.3 能运行 nginx-rtmp-module 插件

## 安装

1. 从 http://nginx-win.ecsds.eu/download/ 下载的 nginx 1.7.11.3
    - 这个版本的 nginx 需要 vc 2010 ，32位和64位版本都要装上
1. 从 github 下载 nginx-rtmp-module 的源码
1. 把 nginx-rtmp-module 的源码解压后复制进 nginx 的根目录，并重命名为 nginx-rtmp-module
    - 要确保证 stat.xls 的路径是 nginx根目录\nginx-rtmp-module\stat.xsl
1. 下载 ffmpeg 并把 ffmpeg 加入到环境变量
    - 在 Windows server 上运行 ffmpeg 需要安装桌面体验，直接运行可能会提示这种错误 缺失 mfplat.dll
1. 在 nginx 的 etc 目录下新建一个文件 nginx-win-rtmp.conf ，配置文件里的 hls 和 vod 的路径要提前新建好
    ```
    #user  nobody;
    # multiple workers works !
    worker_processes  2;

    #error_log  logs/error.log;
    #error_log  logs/error.log  notice;
    #error_log  logs/error.log  info;

    #pid        logs/nginx.pid;

    events {
        worker_connections  8192;
        # max value 32768, nginx recycling connections+registry optimization =
        #   this.value * 20 = max concurrent connections currently tested with one worker
        #   C1000K should be possible depending there is enough ram/cpu power
        # multi_accept on;
    }

    rtmp {
        server {
            listen 1935;
            application live {   #//rtmp直播
                live on;
            }
            application hls {     #//hls直播
                live on;
                hls on;
                hls_path C:/rtmp/temp/hls/;
                hls_fragment 5s;
            }

            chunk_size 4096;   #//数据传输块的大小
            #Video on demand

            application vod {    #//点播
                play C:/rtmp/video; #//视频文件存放位置。
            }

            #Video on demand over HTTP
            application vod_http {
                #myserver.com及服务器地址，如果只是本地播放，填写127.0.0.1:端口号 就行，端口好看配置文件中http监听的端口下同
                play http://127.0.0.1:8080/vod/;
            }
        }
    }
    http {
        server {
            listen       8080;
            server_name  localhost;
            #charset koi8-r;
            #access_log  logs/host.access.log  main;

            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Credentials true;
            add_header Access-Control-Allow-Methods GET,POST;

            location / {
                root html;
                index index.html;
            }

            location /hls {
                #server hls fragments
                types{
                    application/vnd.apple.mpegurl m3u8;
                    video/mp2t ts;
                }
                alias C:/Baidu_download/temp/hls;
                expires -1;
                #root G:/Baidu_download/temp/hls;
                #add_header Cache-Control no-cache;
            }

            # 用于查看 rtmp 的状态
            location /stat {
                rtmp_stat all;
                rtmp_stat_stylesheet stat.xsl;
            }
            location /stat.xsl {
                root nginx-rtmp-module/;
            }
        }
    }
    ```
1. 在 nginx 的根目录下启动 nginx
    ```
    nginx.exe -c conf\nginx-win-rtmp.conf
    ```

<!--
nginx.exe -c conf\nginx-win-rtmp.conf -T
nginx.exe -c conf\nginx-win-rtmp.conf -s reload
nginx.exe -c conf\nginx-win-rtmp.conf -s quit
tasklist /V /FI "IMAGENAME eq nginx.exe"
taskkill /T /F /FI "IMAGENAME eq nginx.exe"
-->

## 推流和拉流的测试


ffmpeg 查看电脑设备，这个命令可以查看到各个设备的名称
```
ffmpeg -list_devices true -f dshow -i dummy
```

测试摄像头是否可用
```
ffplay -f dshow -i video="e2eSoft iVCam"
ffplay -f vfwcap -i 0
```

查看摄像头和麦克风信息
```
ffmpeg -list_options true -f dshow -i video="e2eSoft iVCam"
ffmpeg -list_options true -f dshow -i audio="麦克风 (e2eSoft iVCam)"
```

ffmpeg 的推流
```
ffmpeg.exe -re -i C:\Users\a\Downloads\movie.mp4 -vcodec libx264 -acodec aac -f flv rtmp://127.0.0.1:1935/hls/movie
ffmpeg.exe -re -i C:\Users\a\Downloads\movie.mp4 -vcodec libx264 -acodec aac -f flv rtmp://127.0.0.1:1935/live/movie
循环无限次
ffmpeg.exe -re -stream_loop -1 -i C:\Users\a\Downloads\movie.mp4 -vcodec libx264 -acodec aac -f flv rtmp://127.0.0.1:1935/hls/loop
```

obs 的推流
1. 推流地址设为 rtmp://127.0.0.1:1935/hls 或 rtmp://127.0.0.1:1935/live
1. 密钥设为 movie
1. 然后播放的地址就是 http://127.0.0.1:8080/hls/movie.m3u8 或 rtmp://127.0.0.1:1935/live/test0
1. 密钥是播放地址的这部分 http://localhost:8080/hls/{密钥}.m3u8

ffplay 直接播放视频文件
```
ffplay.exe C:\Users\a\Downloads\movie.mp4
```

ffplay 播放 rtmp
```
ffplay -fs rtmp://127.0.0.1:1935/live/test0
```

ffplay 播放 hsl
```
ffplay -i "http://127.0.0.1:8080/hls/movie.m3u8"
```

前端播放 hls 的例子，需要注意的是 m3u8 的文件需要跨域
```html
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
<title>videojs-contrib-hls embed</title>
  <link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet">
  <script src="https://unpkg.com/video.js/dist/video.js"></script>
  <script src="https://unpkg.com/videojs-contrib-hls/dist/videojs-contrib-hls.js"></script>
</head>
<body>
  <h1>Video.js Example Embed</h1>
  <video class="video-js vjs-default-skin" controls preload="auto" width="640" height="268" data-setup='{}'>
    <source src="http://127.0.0.1:8080/hls/movie.m3u8" type="application/x-mpegURL">
  </video>
</body>
</html>
```

可以通过这个地址 http://127.0.0.1/stat 来查看 rtmp 的状态

## 使用 getUserMedia 和 websocket 实现的推流端

目标是为了让推流端也可以在浏览器上实现。

使用这个库 https://github.com/chenxiaoqino/getusermedia-to-rtmp

大致的原理
1. 使用 getUserMedia 获取摄像头数据
1. 使用 websocket 把视频流推送到后端
1. 在后端把视频流推送到 nginx

大致的使用流程
- 下载源码后运行 npm insatll
    - 要把 ffmpeg 加入到环境变量
- node server.js
- 启动后打开页面
- 填好对应的参数
    - Socket.io Destination: 填本机地址，就是当前的网址，但不需要路径部分
    - flv_soruce Destination 设为空
    - RTMP Destination 填推流地址，可以支持 hls
- 填好配置后
    - 先点击 Connect_server ，再点击 Start streaming
    - 不要点击这个按钮 Set flvsource
- 这个库应该还有 bug
    - 起码验证了从推流端到客户端都可以在浏览器上实现

### 使用手机作为电脑的摄像头测试

手机作为电脑摄像头，虽然有水印，但测试用的话就没关系啦
https://www.e2esoft.cn/ivcam/

其它同类应用
- IVcam（支持双端），下载地址：https://www.e2esoft.cn/ivcam/
- Iriun（支持双端），下载地址：https://www.Iriun.com/
- 无他相机（支持双端），下载地址：https://www.wuta-cam.com/
- DroidCam（支持双端），下载地址：https://www.dev47apps.com/
- Epoccam（仅限ios），下载地址：https://www.elgato.com/zh-CN/epoccam/
- Camo（支持双端），下载地址：https://reincubate.com/zh/support/camo/

## 参考

- https://www.nginx.org.cn/article/detail/259
- https://blog.csdn.net/little__SuperMan/article/details/89071764
- https://blog.csdn.net/wa1tzy/article/details/117249275
