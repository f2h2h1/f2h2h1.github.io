使用 Tesseract 识别字符验证码
================================

## 依赖
- tesseract v5.0.0-alpha.20210811
- python 3.9
- pillow 8.3

依赖的安装
- tesseract 和 python 直接在官网下载即可
- pillow 的安装 `pip install pillow`

## 字符验证码识别的一般套路

- 载入图片
- 灰度
- 二值化
- 降噪
- 分割字符
- 归一化
- 识别

## 使用 python 进行预处理

引入 pillow
```python
from PIL import Image
```

载入图片
```python
image = Image.open('CAPTCHA.png')
```

灰度
```python
imgry = image.convert('L')
```

二值化
```python
def get_bin_table(threshold=128):
    '''获取灰度转二值的映射table,0表示黑色,1表示白色'''
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(1)
    return table
binary = imgry.point(get_bin_table(), '1')
```

降噪
```python
def sum_9_region_new(img, x, y):
    '''确定噪点 '''
    cur_pixel = img.getpixel((x, y)) # 当前像素点的值
    width = img.width
    height = img.height
  
    if cur_pixel == 1: # 如果当前点为白色区域,则不统计邻域值
        return 0
  
    # 因当前图片的四周都有黑点，所以周围的黑点可以去除
    if y < 3: # 本例中，前两行的黑点都可以去除
        return 1
    elif y > height - 3: # 最下面两行
        return 1
    else: # y不在边界
        if x < 3: # 前两列
            return 1
        elif x == width - 1: # 右边非顶点
            return 1
        else: # 具备9领域条件的
            sum = img.getpixel((x - 1, y - 1)) \
                 + img.getpixel((x - 1, y)) \
                 + img.getpixel((x - 1, y + 1)) \
                 + img.getpixel((x, y - 1)) \
                 + cur_pixel \
                 + img.getpixel((x, y + 1)) \
                 + img.getpixel((x + 1, y - 1)) \
                 + img.getpixel((x + 1, y)) \
                 + img.getpixel((x + 1, y + 1))
            return 9 - sum
  
def collect_noise_point(img):
    '''收集所有的噪点'''
    noise_point_list = []
    for x in range(img.width):
        for y in range(img.height):
            res_9 = sum_9_region_new(img, x, y)
            if (0 < res_9 < 3) and img.getpixel((x, y)) == 0: # 找到孤立点
                pos = (x, y)
                noise_point_list.append(pos)
    return noise_point_list
  
def remove_noise_pixel(img, noise_point_list):
    '''根据噪点的位置信息，消除二值图片的黑点噪声'''
    for item in noise_point_list:
        img.putpixel((item[0], item[1]), 1)

noise_point_list = collect_noise_point(binary)
remove_noise_pixel(binary, noise_point_list)
```

分割字符 和 归一化 都是为了方便识别，大多数情况下 分割字符 和 归一化 都是难点，
这里就直接交给 tesseract 识别了。

## 使用 tesseract 识别

保存预处理的图片
```python
image_path = 'pre.png'
binary.save(image_path)
```

调用 tesseract 命令识别
```python
cmd = 'tesseract ' + image_path  + ' stdout -l osd --psm 7 digits'
res = os.popen(cmd)
print(res.buffer.read().decode('utf-8'))
```

### 命令参数解释

这是上文出现的 tesseract 命令
```
tesseract image_path stdout -l osd --psm 7 digits
```

- image_path 图片路径
- stdout 把结果输出到标准输出
- -l osd 识别语言为 osd
- --psm 7 识别模式为 psm 7
- digits 识别数字和英文字母

- osd = Orientation and script detection (方向 和 脚本 检测)
    其实笔者并不理解，为什么 osd 会作为一种语言的选项

- psm = Page segmentation modes (页面 分割 模式)
    - psm 有很多种，对于识别字符验证码，比较常用的是 6 7 10 13
    - 6 Assume a single uniform block of text. 6 假设一个统一的文本块。
    - 7 Treat the image as a single text line. 7 将图像视为单个文本行。
    - 10 Treat the image as a single character. 10 将图像视为单个字符。
    - 13 Raw line. Treat the image as a single text line. 13 原始行，将图像视为单个文本行。

可以通过这两个命令来查看命令行的帮助
```
tesseract --help
tesseract --help-extra
```

### 限定要识别的文字

0. 找到 tesseract 的安装目录
0. 找到 安装目录\tessdata\configs
0. 在这里新建一个名为 digits_new 的文件，并写入以下内容
    ```
    tessedit_char_whitelist 0123456789abcdefghijklnmopqrstuvwsyz
    ```
0. 表示只识别 0-9 a-z 这 36 个字符，可以参考这个目录 安装目录\tessdata\configs 下的其它文件的写法
    - 例如上文提及的命令里的 digits
0. 在命令行里这样使用
    ```
    tesseract image_path stdout -l osd --psm 7 digits_new
    ```

限定要识别的文字 能有效提高识别的准确率。

### 字库训练

## 完整的 python 代码

```python
from PIL import Image

image = Image.open('CAPTCHA.png')

imgry = image.convert('L')

def get_bin_table(threshold=128):
    '''获取灰度转二值的映射table,0表示黑色,1表示白色'''
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(1)
    return table
binary = imgry.point(get_bin_table(), '1')

def sum_9_region_new(img, x, y):
    '''确定噪点 '''
    cur_pixel = img.getpixel((x, y)) # 当前像素点的值
    width = img.width
    height = img.height
  
    if cur_pixel == 1: # 如果当前点为白色区域,则不统计邻域值
        return 0
  
    # 因当前图片的四周都有黑点，所以周围的黑点可以去除
    if y < 3: # 本例中，前两行的黑点都可以去除
        return 1
    elif y > height - 3: # 最下面两行
        return 1
    else: # y不在边界
        if x < 3: # 前两列
            return 1
        elif x == width - 1: # 右边非顶点
            return 1
        else: # 具备9领域条件的
            sum = img.getpixel((x - 1, y - 1)) \
                 + img.getpixel((x - 1, y)) \
                 + img.getpixel((x - 1, y + 1)) \
                 + img.getpixel((x, y - 1)) \
                 + cur_pixel \
                 + img.getpixel((x, y + 1)) \
                 + img.getpixel((x + 1, y - 1)) \
                 + img.getpixel((x + 1, y)) \
                 + img.getpixel((x + 1, y + 1))
            return 9 - sum
  
def collect_noise_point(img):
    '''收集所有的噪点'''
    noise_point_list = []
    for x in range(img.width):
        for y in range(img.height):
            res_9 = sum_9_region_new(img, x, y)
            if (0 < res_9 < 3) and img.getpixel((x, y)) == 0: # 找到孤立点
                pos = (x, y)
                noise_point_list.append(pos)
    return noise_point_list
  
def remove_noise_pixel(img, noise_point_list):
    '''根据噪点的位置信息，消除二值图片的黑点噪声'''
    for item in noise_point_list:
        img.putpixel((item[0], item[1]), 1)

noise_point_list = collect_noise_point(binary)
remove_noise_pixel(binary, noise_point_list)

cmd = 'tesseract ' + image_path  + ' stdout -l osd --psm 7 digits'
res = os.popen(cmd)
print(res.buffer.read().decode('utf-8'))
```
