# socket编程

> 这篇文章的目的是从零开始逐步写出一个功能完善的http服务。
使用 python 3.12 。
选择 python 是因为
c/c++ 处理字符串很麻烦；
java 搭建环境很麻烦；
c# 是微软系统，笔者不喜欢；
php 对多线程多进程的支持并不好；
go 对新手并不友好，而且也不够流行；
javascript 似乎没有问题，以后有空也写一个用 javascript 实现的版本。

版本1
只能处理一个请求
```python
import socket

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # 创建一个 TCP 套接字
    server.bind(("0.0.0.0", 8012)) # 绑定 IP 地址和端口号
    server.listen(1)
    client_socket, client_address = server.accept()
    client_socket.send(bytes("hello world", encoding="utf-8"))
    client_socket.close()

if __name__ == "__main__":
    main()
```

版本2
可以处理多个请求，但每次只能处理一个请求
可以使用多次，但无法用 ctrl+c 退出
```python
import socket

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        client_socket.send(bytes("hello world", encoding="utf-8"))
        client_socket.close()

if __name__ == "__main__":
    main()
```

版本3
可以使用多次，可以用 ctrl+c 退出
```python
import socket
import signal
import sys
import threading
import time

# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    sys.exit(0)

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        client_socket.send(bytes("hello world", encoding="utf-8"))
        client_socket.close()

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
```

版本4
在上一个版本的基础上加了一个 sleep 函数，用于观察一次只能处理一个连接的问题
```python
import socket
import signal
import sys
import threading
import time

# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    sys.exit(0)

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        client_socket.send(bytes("hello world", encoding="utf-8"))
        time.sleep(5)
        client_socket.close()

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
```

版本5
使用多线程实现的，可以同时处理多个请求的版本
```python
import socket
import signal
import sys
import threading
import time

# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    sys.exit(0)

def work(client_socket):
    client_socket.send(bytes("hello world", encoding="utf-8"))
    time.sleep(5)
    client_socket.close()

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        work_thread = threading.Thread(target=work, args=[client_socket]) # 创建一个子线程对象
        work_thread.daemon = True # 将子线程设置为守护线程
        work_thread.start() # 启动子线程

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
```

版本5 基础上的 discard
```python
import socket
import signal
import sys
import threading
import time
import datetime
import struct

# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    sys.exit(0)

def work(client_socket):
    while True:
        data = client_socket.recv(1024)
        if not data:
            break  # 如果没有数据，退出循环
    client_socket.close()

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("127.0.0.1", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        work_thread = threading.Thread(target=work, args=[client_socket]) # 创建一个子线程对象
        work_thread.daemon = True # 将子线程设置为守护线程
        work_thread.start() # 启动子线程

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
```

版本5 基础上的 time
```python
import socket
import signal
import sys
import threading
import time
import datetime
import struct

# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    sys.exit(0)

def work(client_socket):
    client_socket.send(struct.pack("!I", int(time.time()) + 2209017600))
    client_socket.close()

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("127.0.0.1", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        work_thread = threading.Thread(target=work, args=[client_socket]) # 创建一个子线程对象
        work_thread.daemon = True # 将子线程设置为守护线程
        work_thread.start() # 启动子线程

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
```

版本5 基础上的 daytime
```python
import socket
import signal
import sys
import threading
import time
import datetime

# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    sys.exit(0)

def work(client_socket):
    client_socket.send(bytes(time.strftime("%a, %d %b %Y %H:%M:%S %z"), encoding="utf-8"))
    client_socket.close()

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("127.0.0.1", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        work_thread = threading.Thread(target=work, args=[client_socket]) # 创建一个子线程对象
        work_thread.daemon = True # 将子线程设置为守护线程
        work_thread.start() # 启动子线程

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
```

版本5 基础上的 chargen
```python
import socket
import signal
import sys
import threading
import time
import datetime
import string
import random

# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    sys.exit(0)

def work(client_socket):
    while True:
        for i in range(72):
            # 生成随机字符
            char = random.choice(string.ascii_letters + string.digits + string.punctuation)
            client_socket.send(bytes(str(char.encode('utf-8'), encoding="utf-8"), encoding="utf-8"))
        client_socket.send(bytes("\n", encoding="utf-8"))
        time.sleep(1)

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("127.0.0.1", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        work_thread = threading.Thread(target=work, args=[client_socket]) # 创建一个子线程对象
        work_thread.daemon = True # 将子线程设置为守护线程
        work_thread.start() # 启动子线程

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
```

版本5 基础上的 echo
```python
import socket
import signal
import sys
import threading
import time
import datetime

# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    sys.exit(0)

def work(client_socket):
    client_socket.send(bytes("hello world\n", encoding="utf-8"))
    client_socket.send(bytes(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), encoding="utf-8"))
    while True:
        # 接收数据
        data = client_socket.recv(1024)
        # print(data)
        if not data:
            break  # 如果没有数据，退出循环
        # 发送回客户端
        # time.sleep(10)
        client_socket.sendall(data)
    # client_socket.send(bytes(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), encoding="utf-8"))
    # # time.sleep(1)
    # client_socket.close()

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("127.0.0.1", 8012))
    server.listen(5)
    while True:
        client_socket, client_address = server.accept()
        work_thread = threading.Thread(target=work, args=[client_socket]) # 创建一个子线程对象
        work_thread.daemon = True # 将子线程设置为守护线程
        work_thread.start() # 启动子线程

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
```

五个协议基本上都是只修改 work 函数
echo daytime time discard chargen

版本6 静态http
```python
import socket
import signal
import sys
import threading
import time
import datetime
import os
from pathlib import Path
import mimetypes

SERVER_VERSION = '1.0'
SERVER_NAME = 'plusplus123'

def parser_request_header(http_request):
    lines = http_request.strip().split('\r\n')
    # 解析请求行（第一行）
    request_line = lines[0]
    parts = request_line.split(' ', 2)  # 最多分割成3部分
    line = {
        'method': parts[0] if len(parts) > 0 else '',
        'path': parts[1] if len(parts) > 1 else '',
        'httpversion': parts[2] if len(parts) > 2 else ''
    }
    
    # 解析请求头（从第二行开始，直到遇到空行）
    header = {}
    for i in range(1, len(lines)):
        if lines[i].strip() == '':  # 遇到空行，忽略
            continue
        if ':' in lines[i]:
            key, value = lines[i].split(':', 1)  # 只分割第一个冒号
            header[key.strip()] = value.strip()

    return {
        'line': line,
        'header': header
    }

def read_staticfile(fullPath):
    # 获取文件大小
    file_size = os.path.getsize(fullPath)
    # 获取MIME类型
    mime_type, _ = mimetypes.guess_type(fullPath)
    if mime_type is None:
        mime_type = 'application/octet-stream'

    if mime_type.startswith("text"):
        file_encoding = detect_encoding(fullPath)
        if file_encoding is not None:
            mime_type += '; charset=' + file_encoding

    p = Path(fullPath)
    filecontent = p.read_bytes()

    return {
        'content': filecontent,
        'content_length': file_size,
        'mime_type': mime_type
    }

def detect_encoding(file_path):
    try:
        with open(file_path, 'rb') as file:
            raw_data = file.read(100)
        # 常见编码列表
        encodings = ['UTF-8','gbk','gb18030','gb2312','iso8859-1','UTF-16BE','UTF-16LE','UTF-32BE','UTF-32LE','big5','big5hkscs']
        detected_encoding = None
        for encoding in encodings:
            try:
                decoded_text = raw_data.decode(encoding)
                detected_encoding = encoding.lower()
                break
            except UnicodeDecodeError:
                continue
        if detected_encoding:
            return detected_encoding
        else:
            return None
    except Exception as e:
        return None

def list_directory(dir_path):
    items = os.listdir(dir_path)
    items.sort()

    li = ''
    if dir_path != './':
        li += '<li><a href="../">../</a></li>'
    for item in items:
        item_path = os.path.join(dir_path, item)
        if os.path.isdir(item_path):
            li += f'<li><a href="{item}/">{item}/</a></li>'
        else:
            li += f'<li><a href="{item}">{item}</a></li>'

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Directory {dir_path}</title>
    </head>
    <body>
    <h1>Directory {dir_path}</h1>
    <ul>{li}</ul>
    </body>
    </html>
    """

    html_bytes = html.encode('utf-8')
    content_length = len(html_bytes)

    return {
        'content': html_bytes,
        'content_length': content_length,
        'mime_type': 'text/html; charset=utf-8'
    }

def get_statusText(statusCode):
    statusText = ''
    if statusCode == 200:
        statusText = 'OK'
    elif statusCode == 400:
        statusText = 'Bad Request'
    elif statusCode == 403:
        statusText = 'Forbidden'
    elif statusCode == 404:
        statusText = 'Not Found'
    elif statusCode == 500:
        statusText = 'Server Error'
    return statusText    

def builtin_response(statusCode):

    statusText = get_statusText(statusCode)

    html = f'<html><head><title>{statusCode} {statusText}</title></head><body><h1>{statusCode} {statusText}</h1></body></html>'
    html_bytes = html.encode('utf-8')
    content_length = len(html_bytes)

    return {
        'content': html_bytes,
        'content_length': content_length,
        'mime_type': 'text/html; charset=utf-8'
    }

def build_response(responseBoday, statusCode = 200, responseHeader = {}):

    statusText = get_statusText(statusCode)
    responseHeader['Server'] = SERVER_NAME + '/' + SERVER_VERSION
    responseHeader['Connection'] = 'close'

    response = bytes(f'HTTP/1.1 {statusCode} {statusText}' + '\r\n' + '\r\n'.join([f'{key}: {value}' for key, value in responseHeader.items()]) + '\r\n\r\n', encoding="utf-8") + responseBoday
    return response

def work(client_socket, server):

    # 接收数据
    data = client_socket.recv(8192)
    # print(data)
    if not data:
        client_socket.close()
        return

    result = data.split(b'\r\n\r\n', 1)
    print(result)
    result_len = len(result)
    if result_len == 1:
        request_header = parser_request(result[0].decode('utf-8'))
    elif result_len > 1:
        request_header = parser_request_header(result[0].decode('utf-8'))
        request_body = result[1]
    else:
        request = parser_request(result[0])
        # 400
        return

    if request_header['line']['method'].upper() == 'GET':
        urlpath = request_header['line']['path']
        rootdir = '.'
        defaultFile = 'index.html'
        if urlpath == '':
            fullPath = '/' + defaultFile
        fullPath = rootdir + urlpath
        myfile = Path(fullPath)
        if fullPath.endswith('/'): # 目录
            if myfile.is_dir(): # 指定的目录存在
                defaultFile = fullPath + defaultFile
                myfile = Path(defaultFile)
                if myfile.is_file(): # 尝试访问默认文件
                    statusCode = 200
                    response = read_staticfile(defaultFile)
                else:
                    # 返回目录列表
                    statusCode = 200
                    response = list_directory(fullPath)
            else: # 目录不存在
                # 404
                statusCode = 404
                response = builtin_response(statusCode)
                return
        else: # 文件
            if myfile.is_file(): # 指定的文件存在
                statusCode = 200
                response = read_staticfile(fullPath)
            else:
                # 404
                statusCode = 404
                response = builtin_response(statusCode)
    else:
        # 400
        statusCode = 400
        response = builtin_response(statusCode)

    response = build_response(response['content'], statusCode, {
        'Content-Type': response['mime_type'],
        'Content-Length': response['content_length'],
    })
    client_socket.sendall(response)
    time.sleep(1)
    client_socket.close()
    return

def main():
    global stop_thread
    try:
        # socket.AF_INET 表示使用 ipv4
        # socket.SOCK_STREAM 表示使用 tcp
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.bind(("127.0.0.1", 8012))
        server.listen(5)
    except Exception as e:
        stop_thread = True
        print(f"服务器错误: {e}")
    while True:
        if stop_thread == True:
            break
        client_socket, client_address = server.accept()
        work_thread = threading.Thread(target=work, args=[client_socket, server]) # 创建一个子线程对象
        work_thread.daemon = True # 将子线程设置为守护线程
        work_thread.start() # 启动子线程
    if stop_thread == True:
        server.shutdown(socket.SHUT_RDWR)
        server.close()

stop_thread = False
# 定义一个信号处理函数
def signal_handler_quit(signum, frame):
    global stop_thread
    stop_thread = True
    sys.exit(0)

if __name__ == "__main__":

    signal.signal(signal.SIGINT, signal_handler_quit) # 注册信号处理函数，处理 SIGINT 信号
    signal.signal(signal.SIGTERM, signal_handler_quit) # 注册信号处理函数，处理 SIGTERM 信号

    work_thread = threading.Thread(target=main) # 创建一个子线程对象
    work_thread.daemon = True # 将子线程设置为守护线程
    work_thread.start() # 启动子线程

    while True: # 主线程的循环
        time.sleep(1)
        if stop_thread == True:
            sys.exit(0)
```

版本7 使用面向对象写法的 静态http

版本7 有配置的静态http
    ip port rootdir
    mime 这个可以用 mimetypes ，不需要配置
    才三个参数，直接用命令行就可以了吧
    默认页 目录页 日志（写入文件 命令行输出）

版本7 有配置的静态http+cgi

版本7 有配置的静态http+cgi+http代理

版本7 有配置的静态http+cgi+http代理+socks5代理

既然要实现 http代理 那么 https 和 ws 和 wss 的代理应该也差不多吧
暂时先忽略 fastcgi 和 wsgi

python的命令行参数
https://docs.python.org/zh-cn/3/library/argparse.html
https://docs.python.org/zh-cn/3/library/getopt.html

python的配置文件
https://docs.python.org/zh-cn/3/library/configparser.html
https://docs.python.org/zh-cn/3/library/json.html

好像只有 windows 下才需要特别处理信号，linux是可以直接用 ctrl+c 退出的
https://www.fournoas.com/posts/handling-signal-in-python-on-different-platforms/
https://www.fournoas.com/posts/why-does-ctrl-c-not-kill-python-process-in-windows-console/


<!--

还要处理连接突然中断的异常
太久没有数据交互就应该主动关闭连接，不论是客户端还是服务端
要先有一个完善的客户端才可以测试服务端
要先有一个完善的服务端才可以测试客户端
要怎样读取数据
    怎样从缓冲区读取数据
    一次读取多少字节
    怎样判断已经读取完缓冲区的数据
    遇到换行符时要怎么办


要判断是否已经读取完缓冲区的数据，可以考虑以下几种方法：
    1. **检查返回值**：在读取数据时，通常会有一个返回值指示读取的字节数。如果返回值为0，通常表示已经到达缓冲区的末尾。
    2. **使用特定标志**：某些协议或数据格式会在数据的末尾添加特定的结束标志（如换行符、EOF等）。可以通过检查这些标志来判断是否读取完毕。
    3. **缓冲区大小**：如果你知道缓冲区的大小，可以在读取时与已读取的字节数进行比较。一旦已读取的字节数达到缓冲区的大小，就可以认为数据已读取完毕。
    4. **异常处理**：在某些情况下，读取操作可能会抛出异常（如超时或连接关闭），这也可以作为判断读取是否完成的依据。




import sys
import os
import string
import random

for i in range(72):
    # 生成随机字符
    char = random.choice(string.ascii_letters + string.digits + string.punctuation)
    print(str(char.encode('utf-8'), encoding="utf-8"), end='')
print()


import email.utils

# 默认使用当前 UTC 时间
rfc2822_time = email.utils.formatdate()
print(rfc2822_time)

# 若需要使用本地时间，设置 localtime=True
rfc2822_local_time = email.utils.formatdate(localtime=True)
print(rfc2822_local_time)



进程模型 线程模型 io模型 并发模型

manager master worker task
参考一下
    swoole 的进程模型
    nginx
    apache的多进程模式
    ruby webserver
        https://draveness.me/ruby-webserver/

处理连接 处理协议 处理业务

https://sanyuesha.com/python-server-tutorial/

-->
