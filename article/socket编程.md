# socket编程

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

版本6 有配置的静态http

版本6 有配置的静态http+cgi

版本6 有配置的静态http+cgi+fastcgi

版本6 有配置的静态http+cgi+fastcgi+http代理

版本6 有配置的静态http+cgi+fastcgi+http代理+socks5代理

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

-->
