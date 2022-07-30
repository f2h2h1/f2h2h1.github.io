# 使用 PowerShell 实现的 http 服务器

这是一个使用 PowerShell 实现的 http 服务器。
可以显示目录页，下载静态文件和响应 cgi 请求。

核心是调用 .NET 的类库
- System.Net.HttpListener
- System.Web
- System.Diagnostics.Process

PSVersion 5.1

可以像这样运行
```
.\http-server.ps1
# 然后可以在浏览器里这样访问 http://localhost:8080/
```

参考了这几个仓库的实现
- https://github.com/PowerShell/Polaris
- https://gist.github.com/19WAS85/5424431
- https://gist.github.com/rminderhoud/c603a0a30587ae5c957b211ba386bf37
- https://github.com/f2h2h1/simpleHttpServer

参考文档
- https://docs.microsoft.com/zh-cn/dotnet/api/system.net.httplistener?view=net-6.0
- https://docs.microsoft.com/zh-cn/dotnet/api/system.net.httplistenerresponse?view=net-6.0
- https://docs.microsoft.com/zh-cn/dotnet/api/system.net.httplistenerrequest?view=net-6.0
- https://docs.microsoft.com/zh-cn/dotnet/api/system.diagnostics.process?view=net-6.0
- https://docs.microsoft.com/zh-cn/dotnet/api/system.diagnostics.processstartinfo?view=net-6.0
- https://docs.microsoft.com/zh-cn/dotnet/api/system.diagnostics.processstartinfo.environment?view=net-6.0
- https://docs.microsoft.com/zh-cn/dotnet/api/system.diagnostics.processstartinfo.redirectstandardoutput?view=net-6.0
- https://docs.microsoft.com/zh-cn/dotnet/api/system.diagnostics.processstartinfo.redirectstandardinput?view=net-6.0

源码
```PowerShell

$websiteRoot = $(Get-Location).Path

$mimeHash = [ordered]@{
    ".html" = "text/html";
    ".htm" = "text/html";
    ".shtml" = "text/html";
    ".shtm" = "text/html";
    ".css" = "text/css";
    ".xml" = "text/xml";
    # ".csv" = "text/csv";
    ".gif" = "image/gif";
    ".jpeg" = "image/jpeg";
    ".jpg" = "image/jpeg";
    ".js" = "text/javascript";
    ".txt" = "text/plain";
    ".json" = "application/json";
    ".pdf" = "application/pdf";
    ".png" = "image/png";
    ".svg" = "image/svg+xml";
    ".webp" = "image/webp";
    ".ico" = "image/x-icon";
    ".bmp" = "image/x-ms-bmp";
    ".woff" = "font/woff";
    ".woff2" = "font/woff2";
    ".der" = "application/x-x509-ca-cert";
    ".pem" = "application/x-x509-ca-cert";
    ".crt" = "application/x-x509-ca-cert";
    ".xhtml" = "application/xhtml+xml";
    ".zip" = "application/zip";
    ".mid" = "audio/midi";
    ".midi" = "audio/midi";
    ".kar" = "audio/midi";
    ".mp3" = "audio/mpeg";
    ".ogg" = "audio/ogg";
    ".3gpp" = "video/3gpp";
    ".3gp" = "video/3gpp";
    ".mp4" = "video/mp4";
    ".mpeg" = "video/mpeg";
    ".mpg" = "video/mpeg";
    ".mov" = "video/quicktime";
    ".webm" = "video/webm";
    ".flv" = "video/x-flv";
    ".wmv" = "video/x-ms-wmv";
    ".avi" = "video/x-msvideo";
    ".md" = "text/plain";
}

$cgiHash = [ordered]@{
    ".php" = "php"
    ".pl" = "perl"
    ".py" = "python"
    ".rb" = "ruby"
    ".cgi" = "executablefile"
    ".exe" = "executablefile"
}

Add-Type -AssemblyName System.Web

# Http Server
$http = [System.Net.HttpListener]::new() 

# Hostname and port to listen on
$http.Prefixes.Add("http://localhost:8080/")

# Start the Http Server 
$http.Start()

# Log ready message to terminal 
if ($http.IsListening) {
    write-host " HTTP Server Ready!  " -f 'black' -b 'gre'
    write-host "now try going to $($http.Prefixes)" -f 'y'
    write-host "then try going to $($http.Prefixes)other/path" -f 'y'
}

try {
# INFINTE LOOP
# Used to listen for requests
while ($http.IsListening) {

    # Get Request Url
    # When a request is made in a web browser the GetContext() method will return a request object
    # Our route examples below will use the request object properties to decide how to respond
    $contextTask = $http.GetContextAsync()

    # Waits in 200ms increments for a request. We do this to allow pipeline stops to be processed (i.e. CTRL+C)
    # Credit: https://www.reddit.com/r/PowerShell/comments/9n2q03/comment/e7ju5w4/?utm_source=share&utm_medium=web2x&context=3
    while (-not $contextTask.AsyncWaitHandle.WaitOne(200)) { }
    $context = $contextTask.GetAwaiter().GetResult()

    $dir = [System.Web.HttpUtility]::UrlDecode($context.Request.RawUrl)

    write-host "$($context.Request.UserHostAddress)  =>  $($context.Request.Url)" -f 'mag'

    $staticFilePath = $websiteRoot + $dir
    if ($context.Request.HttpMethod -eq 'GET' -and (Test-Path $staticFilePath) -and (Get-Item $staticFilePath) -is [IO.DirectoryInfo]) {

        $isRoot = $False
        if ($context.Request.RawUrl -gt '/') {
            $isRoot = $True
        }

        $li = "<li><a href=""../"">..</a></li>"
        ForEach ($item in Get-ChildItem -Path $staticFilePath) {
            if ($isRoot -eq $True) {
                $itemPath = $staticFilePath + $item.Name
            } else {
                $itemPath = $staticFilePath + "/" + $item.Name
            }
            if ((Get-Item $itemPath) -is [IO.DirectoryInfo]) {
                $li += "<li><a href=""$($item)/"">"+$item.Name+"</a></li>"
            } else {
                $li += "<li><a href=""$($item)"">"+$item.Name+"</a></li>"
            }
        }

        $title = "Directory listing for " + $dir
        $html = "<!DOCTYPE html><html><head><meta charset=""utf-8""> <title>$title</title></head><body><h1>$title</h1><hr><ul>$li</ul><hr></body></html>"

        #resposed to the request
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($html) # convert htmtl to bytes
        $context.Response.ContentType = "text/html; charset=utf-8"
        $context.Response.ContentLength64 = $buffer.Length
        $context.Response.OutputStream.Write($buffer, 0, $buffer.Length) #stream to broswer
        $context.Response.OutputStream.Close() # close the response
        continue
    }

    if ($context.Request.RawUrl -match '^/cgi-bin(.*)|^/htcgi(.*)' -and (Test-Path $staticFilePath) -and (Get-Item $staticFilePath) -is [IO.fileinfo]) {

        $isExecutablefile = $false
        $ext = [System.IO.Path]::GetExtension($staticFilePath)
        $cgi = $cgiHash[$ext]
        if ($cgi -gt $null) {
            if ($cgi -eq ".cgi" -or $cgi -eq ".exe") {
                $isExecutablefile = $true
            }
        } else {
            $isExecutablefile = $true
        }

        $standardInput = [System.IO.StreamReader]::new($context.Request.InputStream).ReadToEnd()
        $p = [System.Diagnostics.Process]::new()

        if ($isExecutablefile -eq $false) {
            $p.StartInfo.FileName = $cgi
            $p.StartInfo.Arguments = $staticFilePath
        } else {
            $p.StartInfo.FileName = $staticFilePath
        }

        $p.StartInfo.UseShellExecute = $false
        $p.StartInfo.RedirectStandardOutput = $true
        $p.StartInfo.RedirectStandardInput = $true

         # 这里是设置环境变量
        $headers = $context.Request.Headers
        $headers.Add("REQUEST_METHOD", $($context.Request.HttpMethod))
        $headers.Add("SERVER_PROTOCOL", "HTTP/$($context.Request.ProtocolVersion)")
        ForEach ($key in $headers.AllKeys) {
            $p.StartInfo.Environment.Add($key, $headers[$key])
        }

        $p.Start()
        $pw = $p.StandardInput;
        $pw.WriteLine($standardInput) # 这里是设置标准输入
        $pw.Close()
        $responseRaw = $p.StandardOutput.ReadToEnd() # 这里是获得标准输出

        if ($p.ExitCode -eq 0) {

            # 分割响应头和响应报文
            $t = $responseRaw.Split("`r`n`r`n", 2)
            # $t = $responseRaw -split "`r`n`r`n", 2
            # 这里应该还需要一些容错的处理
            $responseHeaders = $t[0]
            $responseBody = $t[1]

            ForEach($headerLine in $responseHeaders.Split("`r`n")) {
                $keyValue = $headerLine.Split(": ")
                if ($keyValue.Length -gt 2) {
                    continue
                }
                $key = $keyValue[0]
                $value = $keyValue[1]
                $context.Response.AddHeader($key, $value)
            }

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($responseBody) # convert htmtl to bytes
            # $context.Response.ContentType = "text/html; charset=utf-8"
            $context.Response.ContentLength64 = $buffer.Length
            $context.Response.OutputStream.Write($buffer, 0, $buffer.Length) #stream to broswer
            $context.Response.OutputStream.Close() # close the response
        } else {
            [string]$html = "<h1>500 Server Error</h1>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($html) # convert htmtl to bytes
            $context.Response.StatusCode = 500
            $context.Response.StatusDescription = "Server Error"
            $context.Response.ContentType = "text/html; charset=utf-8"
            $context.Response.ContentLength64 = $buffer.Length
            $context.Response.OutputStream.Write($buffer, 0, $buffer.Length) #stream to broswer
            $context.Response.OutputStream.Close() # close the response
        }

        continue
    }

    if ($context.Request.HttpMethod -eq 'GET' -and (Test-Path $staticFilePath) -and (Get-Item $staticFilePath) -is [IO.fileinfo]) {

        $buffer = [System.Text.Encoding]::UTF8.GetBytes((Get-Content -Raw -Encoding utf8 $staticFilePath))
        $mime = $mimeHash[[System.IO.Path]::GetExtension($staticFilePath)]

        if ($mime -gt $null) {
            # $context.Response.ContentType = $mime + "; charset=utf-8"
            if ($mime -match '^text') {
                $mime += "; charset=utf-8"
            }
            $context.Response.ContentType = $mime
        }
        $context.Response.ContentLength64 = $buffer.Length
        $context.Response.OutputStream.Write($buffer, 0, $buffer.Length) #stream to broswer
        $context.Response.OutputStream.Close() # close the response
        continue
    }

    [string]$html = "<h1>404 Not Found</h1>"
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($html) # convert htmtl to bytes
    $context.Response.StatusCode = 404
    $context.Response.StatusDescription = "Not Found"
    $context.Response.ContentType = "text/html; charset=utf-8"
    $context.Response.ContentLength64 = $buffer.Length
    $context.Response.OutputStream.Write($buffer, 0, $buffer.Length) #stream to broswer
    $context.Response.OutputStream.Close() # close the response
    continue
} 
}
catch {
  Write-Host "An error occurred:"
  Write-Host $_
}
finally {
    $http.Stop()
}
```

在笔者原本的设想里，是写一个纯 PowerShell 的脚本，即使要调用 .NET 的类库起码也要保证跨平台能用。
但后来笔者发觉，这个设想是实现起来有点困难，最后还是通过调用 .NET 的类库实现。
PowerShell 的强大主要是体现在可以很方便地调用 .NET 的类库，基本没有障碍。
但离开 .NET 的类库， PowerShell 的表现力其实也没有比 bash 好多少。
