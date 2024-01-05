
import { Application } from './index.js';
import { AppData } from './appData.js';
import path from 'path';
import fs from 'fs';
import process from 'process';
import child_process from 'child_process';
import http from 'http';
import url from 'url';

/**
 * @typedef ServerConfig
 * @type {object}
 * @property {string} rootDirectory
 * @property {string[]} defaultFile
 * @property {boolean} enableLog - description
 * @property {{[key: string]: string}} mimeList
 * @property {{host: string, port: int}} httpOptions
 */

class cli {
    /** @type {AppData} */
    appData = {};

    /** @type {Application} */
    application = {};

    /** @type {ServerConfig} */
    serverConfig = {
        type: '',
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
            '.pac': 'application/x-ns-proxy-autoconfig',
        },
        httpOptions: {
            host: '127.0.0.1',
            port: 8016,
        },
    }

    /**
     * @param {string} jsonPath
     */
    getJsonObj(jsonPath) {
        let json = fs.readFileSync(jsonPath, {encoding:'utf8', flag:'r'});
        return JSON.parse(json);
    }

    async updateMatedata() {
        // 获取文章列表
        var files = fs.readdirSync('./article');
        var articleList = [];
        for (let i in files) {
            if (path.extname(files[i]) == ".md") {
                // console.log(files[i], path.basename(files[i]));
                let fileName = files[i];
                if ((new RegExp('^_(?:.*).md$', 'i')).test(fileName)) {
                    continue;
                }
                let filePath = 'article/' + fileName;
                let x = await (function(){
                    return new Promise((resolve, reject) => {
                        let command = 'git log --format=%aD ' + filePath
                        child_process.exec(command, (err, stdout, stderr) => {
                            if (err) reject(err);
                            resolve({
                                stdout,
                                stderr,
                            });
                        });
                    });
                })();
                // console.log(x);
                if (!x.stdout || x.stderr) {
                    // throw 'get article error1 ' + fileName;
                }
                let logStr = x.stdout;
                logStr = logStr.trim();
                let logArr = logStr.split("\n");
                if (logArr.length <= 0) {
                    throw 'get article error2 ' + fileName;
                }
                let createTime = logArr[logArr.length - 1];
                let updateTime = logArr[0];
                if (createTime) {
                    articleList.push({
                        title: path.basename(fileName, '.md'),
                        createTime: new Date(createTime).getTime()/1000,
                        updateTime: new Date(updateTime).getTime()/1000,
                    });
                }
            }
        }

        // 文章列表按创建时间排序
        articleList.sort((a, b) => {
            if (a.createTime > b.createTime) {
                return -1;
            } else if (a.createTime < b.createTime) {
                return 1;
            } else if (a.title.length > b.title.length) {
                return -1;
            } else if (a.title.length < b.title.length) {
                return 1;
            }
            return a.title > b.title ? -1 : 1;
        });

        // 用于页面的 articleList.json
        let articleListJson = JSON.stringify(articleList, null, '    ');
        fs.writeFileSync('articleList.json', articleListJson);

        // README 里的文章列表
        let readme = fs.readFileSync('README.md', {encoding:'utf8', flag:'r'});
        let listStr = articleList.reduce((carry, item) => {
            return carry += '- [' + item.title + '](' + this.application.createUrl(item.title, 'md') + ')' + "\n";
            }, '');
        readme = (/(?<=<!-- articleList -->).*(?=<!-- articleList -->)/ims)[Symbol.replace](readme, '\n' + listStr);
        // console.log(listStr, readme);
        fs.writeFileSync('README.md', readme);

        // README 里的友链列表
        let exchangeList = this.getJsonObj('exchangeList.json');
        // console.log(exchangeList);
        let exchangeTh = '|站点|头像|网址|描述|\n|-|-|-|-|';
        let exchange = exchangeTh.trim() + '\n' + exchangeList.reduce((carry, item) => {
            let name = item.name;
            let avatar = item.avatar;
            let href= item.href;
            let desc = item.desc;
            let tr = '';
            if (avatar) {
                avatar = '<img alt="' + (name + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0') + '" src="' + avatar + '" width="119" />';
            }
            name = `[${name}](${href})`;
            tr = `|${name}|${avatar}|${href}|${desc}|`;
            return carry += tr + '\n';
            }, '');
        readme = (/(?<=<!-- exchangeList -->).*(?=<!-- exchangeList -->)/ims)[Symbol.replace](readme, '\n' + exchange);
        fs.writeFileSync('README.md', readme);

        // SUMMARY
        fs.writeFileSync('SUMMARY.md', '# Summary\n\n* [Introduction](README.md)\n' + articleList.reduce((carry, item) => {
            return carry += '* [' + item['title'] + '](' + this.application.createUrl(item['title'], 'md') + ')\n';
        }, ''));

        var clearLeadSpace = function (template) {
            let leadSpaceCount = template.length - template.trimStart().length - 1;
            let regex = new RegExp('^ {' + leadSpaceCount + '}', 'gm');
            return template.replaceAll(regex, '').trim();
        }
        var xmlProcess = function (mainTemplate, articleList, spaceLen, itemProcess) {
            let xmlHead = '<?xml version="1.0" encoding="UTF-8"?>\n';
            let items = articleList.reduce(itemProcess, '');
            let space = '';
            while (spaceLen > 0) {
                space += ' ';
                spaceLen--;
            }
            return xmlHead + mainTemplate.trim().replace('%s', items.trim().replaceAll('\n', '\n' + space));
        }
        let mainTemplate = '';
        let xmlstr = '';
        let spaceLen = 4;
        var that = this;

        mainTemplate = `
            <urlset
                xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
                %s
            </urlset>
            `;
        xmlstr = xmlProcess(clearLeadSpace(mainTemplate), articleList, spaceLen, function(carry, item) {
            let updateTime = item['updateTime'];
            let date = that.application.timeFormat(updateTime, 'sitemap');
            let url = that.application.createUrl(item['title']);
            let itemTemplate = `
            <url>
                <loc>${url}</loc>
                <lastmod>${date}</lastmod>
                <priority>0.5</priority>
            </url>
            `;
            itemTemplate = clearLeadSpace(itemTemplate);
            return carry += itemTemplate + '\n';
        });
        fs.writeFileSync('sitemap.xml', xmlstr);

        mainTemplate = `
            <feed xmlns="http://www.w3.org/2005/Atom">
                <title>${this.application.appData.sitename}</title>
                <link href="${this.application.appData.host}/atom.xml" rel="self" />
                <link href="${this.application.appData.host}/" />
                <id>urn:uuid:9EC21C9D-023B-2486-16D4-703D36C458B2</id>
                <updated>${that.application.timeFormat(Date.parse(new Date())/1000, 'atom')}</updated>
                <author>
                    <name>${this.application.appData.sitename}</name>
                </author>
                %s
            </feed>
            `;
        xmlstr = xmlProcess(clearLeadSpace(mainTemplate), articleList, spaceLen, function(carry, item) {
            let updateTime = that.application.timeFormat(item['updateTime'], 'atom');
            let title = item['title'];
            let url = that.application.createUrl(item['title']);
            let itemTemplate = `
            <entry>
                <title>${title}</title>
                <link href="${url}" />
                <id>${url}</id>
                <updated>${updateTime}</updated>
                <summary>${title}</summary>
            </entry>
            `;
            itemTemplate = clearLeadSpace(itemTemplate);
            return carry += itemTemplate + '\n';
        });
        fs.writeFileSync('atom.xml', xmlstr);

        mainTemplate = `
            <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
                <channel>
                    <title>${this.application.appData.sitename}</title>
                    <link>${this.application.appData.host}/</link>
                    <description>${this.application.appData.sitename}</description>
                    <atom:link href="${this.application.appData.host}/rss.xml" rel="self" type="application/rss+xml" />
                    %s
                </channel>
            </rss>
            `;
        spaceLen = 8;
        xmlstr = xmlProcess(clearLeadSpace(mainTemplate), articleList, spaceLen, function(carry, item) {
            let updateTime = item['updateTime'];
            updateTime = that.application.timeFormat(updateTime, 'rss');
            let title = item['title'];
            let url = that.application.createUrl(item['title']);
            let itemTemplate = `
            <item>
                <title>${title}</title>
                <link>${url}</link>
                <description>${title}</description>
                <pubDate>${updateTime}</pubDate>
                <guid>${url}</guid>
            </item>
            `;
            itemTemplate = clearLeadSpace(itemTemplate);
            return carry += itemTemplate + '\n';
        });
        fs.writeFileSync('rss.xml', xmlstr);
    }

    createPage() {
        let articleList = this.getJsonObj('articleList.json');
        let exchangeList = this.getJsonObj('exchangeList.json');

        this.application.setTemplate(fs.readFileSync('template.html', {encoding:'utf8', flag:'r'}));
        this.application.setArticleList(articleList);
        this.application.setLinkExchangeList(exchangeList);

        let pageHtml = '';
        for (let i = 0, len = articleList.length; i < len; i++) {
            articleList[i]['md'] = fs.readFileSync('article/' + articleList[i]['title'] + '.md', {encoding:'utf8', flag:'r'});
            pageHtml = this.application.buildConetnt(this.application.appData.sitename, this.application.buildArticle(articleList[i]));
            fs.writeFileSync('article/' + articleList[i]['title'] +'.html', pageHtml);
        }
        pageHtml = this.application.buildConetnt(this.application.appData.sitename, this.application.buildIndex(articleList));
        fs.writeFileSync('index.html', pageHtml);
    }

    /**
     * @param {string} val
     */
    runBuildMethod(val) {
        console.log(val);
        switch (val) {
            case 'updateMatedata':
                this.updateMatedata();
                break;
            case 'createPage':
                this.createPage();
                break;
            default:
                console.log('wrong type of build argument');
        }
    }

    helpPrompt() {
        console.log('help');
    }

    /**
     * @param {string[]} argv
     * @returns {{[key: string]: string}}
     */
    parseArgv(argv) {
        console.log(argv);
        let argvArr = {};
        for (let i in argv) {
            let prefix = '--';
            let argvItem = argv[i];
            if (argvItem.match(new RegExp(String.raw`^${prefix}`, 'g')) == null) {
                continue;
            }
            argvItem = argvItem.substring(prefix.length, argvItem.length);
            let attr = '';
            let val = '';
            let index = argv[i].indexOf('=');
            if (index == -1) {
                attr = argvItem;
            } else {
                attr = argvItem.substring(0, index - 2);
                val = argvItem.substring(index - 1, argvItem.length);
            }
            // argvArr.push({
            //     attr: attr,
            //     val: val
            // });
            argvArr[attr] = val;
        }
        console.log(argvArr);
        return argvArr;
    }

    /**
     * @param {ServerConfig} config
     * @param {string} type
     */
    server(config, type) {
        var that = this;
        http.createServer(function (request, response) {

            let pathname = url.parse(request.url).pathname;
            let originPathname = pathname;
            let clientAddress = request.socket.remoteAddress + ':' + request.socket.remotePort;
            let statusCode = 500;
            if (request.method != 'GET') {
                statusCode = 403;
                response.writeHead(statusCode);
                response.end();
                that.serverLogger(clientAddress, statusCode, originPathname);
                return;
            }
            let rootDirectory = config.rootDirectory;
            if (pathname == '/') {
                for (let item of config.defaultFile) {
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
                that.serverLogger(clientAddress, statusCode, originPathname);
            });
        }).listen(config.httpOptions);

        console.log('Server running at http://' + config.httpOptions.host + ':' + config.httpOptions.port + '/');
    }

    /**
     * @param {string} clientAddress
     * @param {string} statusCode
     * @param {string} originPathname
     */
    serverLogger(clientAddress, statusCode, originPathname) {
        if (this.serverConfig.enableLog) {
            let msg = `${clientAddress} ${statusCode} ${originPathname}`;
            this.debugLogger(msg);
        }
    }

    /**
     * @param {string} msg
     */
    debugLogger(msg) {
        let timestamp = this.application.timeFormat(new Date().getTime() / 1000);
        msg = `[${timestamp}] ${msg}`;
        console.log(msg);
    }

    main() {
        process.env.TZ = 'Asia/Shanghai';
        this.appData = new AppData();
        var appData = this.appData;
        let argvArr = this.parseArgv(process.argv.slice(2));
        if (argvArr.length == 0 || argvArr.hasOwnProperty('help')) {
            // --help
            this.helpPrompt();
            return;
        }
        for (let prop in argvArr) {
            let prefix = 'config-';
            if (prop.match(new RegExp(String.raw`^${prefix}`, 'g')) == null) {
                continue;
            }
            let attr = prop.substring(prefix.length, prop.length);
            let val = argvArr[prop];
            // console.log(attr, val);
            if (appData.hasOwnProperty(attr)) {
                if (attr == 'thirdPartyCode') {
                    if (val == 'false') {
                        val = false;
                    } else if (val == 'true') {
                        val = true;
                    } else {
                        continue;
                    }
                }
                appData[attr] = val;
            }
        }
        console.log(appData);

        this.application = new Application(appData);

        if (argvArr.hasOwnProperty('build')) {
            // let build = argvArr['build'];
            // let index = build.split('|');
            // if (index == -1) {
            //     runBuildMethod(build);
            // } else {
                // first = build.substring(0, index - 2);
                //  = build.substring(index - 1, build.length);

            // }
            for (let BuildMethod of argvArr['build'].split('|')) {
                this.runBuildMethod(BuildMethod);
            }
        }
        // if (argvArr.hasOwnProperty('server')) {
            for (let prop in argvArr) {
                let prefix = 'server-';
                if (prop.match(new RegExp(String.raw`^${prefix}`, 'g')) == null) {
                    continue;
                }
                let attr = prop.substring(prefix.length, prop.length);
                let val = argvArr[prop];

                // serverType
                // host
                // port
                // rootDirectory
                // defaultFile
                // enableLog
                // mimeList
                // file
                if (attr == 'file') {
                    try {
                        this.serverConfig = this.getJsonObj(val);
                    } catch (e) {
                        console.log(e);
                        exit(1);
                    }
                    break;
                }
                switch (attr) {
                    case 'type':
                        this.serverConfig.type = val;
                        break;
                    case 'host':
                        this.serverConfig.httpOptions.host = val;
                        break;
                    case 'port':
                        this.serverConfig.httpOptions.port = val;
                        break;
                    case 'rootDirectory':
                        this.serverConfig.rootDirectory = val;
                        break;
                    case 'defaultFile':
                        this.serverConfig.defaultFile.push(val);
                        break;
                    case 'enableLog':
                        if (val == 'false') {
                            val = false;
                            this.serverConfig.enableLog = val;
                        } else if (val == 'true') {
                            val = true;
                            this.serverConfig.enableLog = val;
                        }
                        break;
                    default:
                        break;
                }
            }

            let config = this.serverConfig;
            switch (config.type) {
                case 'static':
                    console.log(this.serverConfig);
                    console.log('static server');
                    this.server(config, config.type);
                    break;
                case 'backendRender':
                    console.log(this.serverConfig);
                    console.log('backendRender server');
                    this.server(config, config.type);
                    break;
                // case 'backendStaticRender': // html文件存在就输出文件，不存在就创建一个html文件再输出
                //         console.log(this.serverConfig);
                //         console.log('backendStaticRender server');
                //         this.server(config, config.type);
                //         break;
                default:
                    console.log('do not start server');
            }
        // }

        return;
    }
}

(new cli()).main();

/*
date('r'); // RFC 2822/RFC 5322 toUTCString
Tue, 07 Feb 2023 13:17:02 +0000

date('c'); // ISO 8601 toISOString
2023-02-07T13:17:07+00:00
rfc822

/(?<=<title>).*?(?=<\/title>)/s
/(?<=<div id=\"link_exchange\">).*?(?=<\/div>)/s
/(?<=<article id=\"content\">).*?(?=<\/article>)/s
/(?<=<dl id=\"article_list\">).*?(?=<\/dl>)/s
/^<h1>.*<\/h1>/m


getFullYear
getMonth
getDate

updateMatedata
createPage

sitemap
2023-01-10

atom
2022-09-30T23:57:19+08:00

rss
Tue, 10 Jan 2023 13:54:48 +0800

'en-US'

["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


num = num.toString();
while (num.length < 2) num = "0" + num;
return num;

console.log((new Date()).getTimezoneOffset()/60);
console.log((new Date()).getTimezoneOffset()%60);

Asia/Shanghai
America/New_York
Asia/Kolkata

php -r "date_default_timezone_set('Asia/Kolkata');var_dump(date('c'));"
php -r "date_default_timezone_set('GMT');var_dump(date('c'));"

在浏览器中 Date 对象无法设置时区
在 node 中可以通过环境变量来设置时区 process.env.TZ = 'America/New_York';

现在还差一个 xml 格式化的问题

Pre-zero

npm run test
npm run build
npm run asd

ls article/*.html | xargs rm -f

node cli.js --build="updateMatedata|createPage" --config-host="http://127.0.0.1:8022" --config-sitename="f2h2h1\'s blog" --config-thirdPartyCode=false --server-type="static" --server-host="127.0.0.1" --server-port=8022 --server-type="static"

*/
