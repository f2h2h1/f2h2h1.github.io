const http = require('http');
const fs = require("fs"); 
const url = require('url');
const path = require('path');

var config = {
    rootDirectory: '.',
    defaultFile: [
        'index.html',
    ],
    enableLog: true,
    mimeList: {
        '.html': 'text/html',
        '.htm': 'text/html',
        '.shtml': 'text/html',
        '.shtm': 'text/html',
        '.css': 'text/css',
        '.xml': 'text/xml',
        '.csv': 'text/csv',
        '.md': 'text/plain',
        '.js': 'text/javascript',
        '.txt': 'text/plain',
        '.gif': 'image/gif',
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.webp': 'image/webp',
        '.ico': 'image/x-icon',
        '.bmp': 'image/x-ms-bmp',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
        '.pdf': 'application/pdf',
        '.der': 'application/x-x509-ca-cert',
        '.pem': 'application/x-x509-ca-cert',
        '.crt': 'application/x-x509-ca-cert',
        '.xhtml': 'application/xhtml+xml',
        '.zip': 'application/zip',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.mid': 'audio/midi',
        '.midi': 'audio/midi',
        '.kar': 'audio/midi',
        '.mp3': 'audio/mpeg',
        '.ogg': 'audio/ogg',
        '.3gpp': 'video/3gpp',
        '.3gp': 'video/3gpp',
        '.mp4': 'video/mp4',
        '.mpeg': 'video/mpeg',
        '.mpg': 'video/mpeg',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.flv': 'video/x-flv',
        '.wmv': 'video/x-ms-wmv',
        '.avi': 'video/x-msvideo',
        '.bin': 'application/octet-stream',
    },
    httpOptions: {
        host: 'localhost',
        port: 8016,
    },
}
var numberPlastic = function(num) {
    return num < 10 ? '0' + num : num;
};
var serverLogger = function(clientAddress, statusCode, originPathname) {
    if (config.enableLog) {
        let now = new Date();
        let timezone = -(now.getTimezoneOffset()/60);
        let timestamp = now.getFullYear() + '-' +
                        numberPlastic(now.getMonth() + 1) + '-' +
                        numberPlastic(now.getDate()) + 'T' +
                        numberPlastic(now.getHours()) + ':' +
                        numberPlastic(now.getMinutes()) + ':' +
                        numberPlastic(now.getSeconds()) + ':' +
                        numberPlastic(now.getHours()) + '+' +
                        timezone;
        msg = `[${timestamp}] ${clientAddress} ${statusCode} ${originPathname}`;
        console.log(msg);
    }
};

http.createServer(function (request, response) {

    let pathname = url.parse(request.url).pathname;
    let originPathname = pathname;
    let clientAddress = request.socket.remoteAddress + ':' + request.socket.remotePort;
    let statusCode = 500;
    if (request.method != 'GET') {
        statusCode = 403;
        response.writeHead(statusCode);
        response.end();
        serverLogger(clientAddress, statusCode, originPathname);
        return;
    }
    let rootDirectory = config.rootDirectory;
    if (pathname == '/') {
        for (item of config.defaultFile) {
            item = '/' + item;
            if (fs.existsSync(rootDirectory + item)) {
                pathname = item;
                break;
            }
        }
    }
    let filePath = rootDirectory + decodeURI(pathname);
    fs.readFile(filePath, function(err, data) {
        if (err) {
            // console.log(err);
            statusCode = 404;
            response.writeHead(statusCode);
        } else {
            let extname = path.extname(filePath);
            let ContentType = 'application/octet-stream';
            if (extname in config.mimeList) {
                ContentType = config.mimeList[extname];
            }
            let head = {
                'Content-Type': ContentType,
                'Content-Length': data.length,
            }
            statusCode = 200;
            response.writeHead(statusCode, head);
            response.write(data);
        }
        response.end();
        serverLogger(clientAddress, statusCode, originPathname);
    });
}).listen(config.httpOptions);

console.log('Server running at http://' + config.httpOptions.host + ':' + config.httpOptions.port + '/');

/*

curl -i http://127.0.0.1:8016
curl -i -X POST -d a=1 http://127.0.0.1:8016
curl -i http://shop-dev.theclub.com.hk:8016

时间 来源 响应码 请求路径
[] ip:port 200 /

2004-05-03T17:30:08+08:00

*/
