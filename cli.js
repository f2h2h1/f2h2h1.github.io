
import { Application } from './index.js';
import { appData } from './appData.js';
import path from 'path';
import fs from 'fs';
import process from 'process';
import child_process from 'child_process';

process.env.TZ = 'Asia/Shanghai';
// var dirPath = path.resolve('/article');
let main = function () {

    var application;

    var getJsonObj = function(jsonPath) {
        let json = fs.readFileSync(jsonPath, {encoding:'utf8', flag:'r'});
        return JSON.parse(json);
    }
    let updateMatedata = async function() {

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
            return carry += '- [' + item.title + '](' + application.createUrl(item.title, 'md') + ')' + "\n";
            }, '');
        readme = (/(?<=<!-- articleList -->).*(?=<!-- articleList -->)/ims)[Symbol.replace](readme, '\n' + listStr);
        // console.log(listStr, readme);
        fs.writeFileSync('README.md', readme);

        // README 里的友链列表
        let exchangeList = getJsonObj('exchangeList.json');
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
            return carry += '* [' + item['title'] + '](' + application.createUrl(item['title'], 'md') + ')\n';
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

        mainTemplate = `
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                %s
            </urlset>
            `;
        xmlstr = xmlProcess(clearLeadSpace(mainTemplate), articleList, spaceLen, function(carry, item) {
            let updateTime = item['updateTime'];
            let date = application.timeFormat(updateTime, 'sitemap');
            let url = application.createUrl(item['title']);
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
                <title>f2h2h1's blog</title>
                <link href="https://f2h2h1.github.io/atom.xml" rel="self" />
                <link href="https://f2h2h1.github.io/" />
                <id>urn:uuid:9EC21C9D-023B-2486-16D4-703D36C458B2</id>
                <updated>${application.timeFormat(Date.parse(new Date())/1000, 'atom')}</updated>
                <author>
                    <name>f2h2h1's blog</name>
                </author>
                %s
            </feed>
            `;
        xmlstr = xmlProcess(clearLeadSpace(mainTemplate), articleList, spaceLen, function(carry, item) {
            let updateTime = application.timeFormat(item['updateTime'], 'atom');
            let title = item['title'];
            let url = application.createUrl(item['title']);
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
                    <title>f2h2h1's blog</title>
                    <link>https://f2h2h1.github.io/</link>
                    <description>f2h2h1's blog</description>
                    <atom:link href="https://f2h2h1.github.io/rss.xml" rel="self" type="application/rss+xml" />
                    %s
                </channel>
            </rss>
            `;
        spaceLen = 8;
        xmlstr = xmlProcess(clearLeadSpace(mainTemplate), articleList, spaceLen, function(carry, item) {
            let updateTime = item['updateTime'];
            updateTime = application.timeFormat(updateTime, 'rss');
            let title = item['title'];
            let url = application.createUrl(item['title']);
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

    };
    let createPage = function() {

        let articleList = getJsonObj('articleList.json');
        let exchangeList = getJsonObj('exchangeList.json');

        application.setTemplate(fs.readFileSync('template.html', {encoding:'utf8', flag:'r'}));
        application.setArticleList(articleList);
        application.setLinkExchangeList(exchangeList);
    
        let pageHtml = '';
        for (let i = 0, len = articleList.length; i < len; i++) {
            articleList[i]['md'] = fs.readFileSync('article/' + articleList[i]['title'] + '.md', {encoding:'utf8', flag:'r'});
            pageHtml = application.buildConetnt(application.appData.sitename, application.buildArticle(articleList[i]));
            fs.writeFileSync('article/' + articleList[i]['title'] +'.html', pageHtml);
        }
        pageHtml = application.buildConetnt(application.appData.sitename, application.buildIndex(articleList));
        fs.writeFileSync('index.html', pageHtml);

    };
    let runBuildMethod = function(val) {
        switch (val) {
            case 'updateMatedata':
                updateMatedata();
                break;
            case 'createPage':
                createPage();
                break;
            default:
                console.log('wrong type of build argument');
        }
    };
    let helpPrompt = function() {
        console.log('help');
    };
    let parseArgv = function(argv) {
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
    };

    // updateMatedata();
    // createPage();

    // console.log(process.argv.slice(2));
    let argvArr = parseArgv(process.argv.slice(2));
    if (argvArr.length == 0 || argvArr.hasOwnProperty('help')) {
        // --help
        helpPrompt();
        return;
    }
    for (let prop in argvArr) {
        let prefix = 'config-';
        if (prop.match(new RegExp(String.raw`^${prefix}`, 'g')) == null) {
            continue;
        }
        let attr = prop.substring(prefix.length, prop.length);;
        let val = argvArr[prop];
        console.log(attr, val);
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

    application = new Application(appData);

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
            console.log(BuildMethod);
            runBuildMethod(BuildMethod);
        }
    }
    if (argvArr.hasOwnProperty('server')) {
        switch (val) {
            case 'static':
                console.log('static server');
                break;
            case 'backendRender':
                console.log('backendRender server');
                break;
            default:
                console.log('server type of build argument');
        }
    }

    return;



    // 把 articleList 和 exchangeList 以 json 的形式加入到 index.html 中，这是用来判断预渲染的标记
    // 纯前端的环境下就用 ajax 获得这两份文件
    // 只有第一次打开页面时判断预渲染还是前端渲染，其它后续的页面都是前端渲染
    /*
        <script>
        var articleList = {};
        var exchangeList = {};
        </script>
    */

    // let articleHtml = application.buildArticle(articleList[5]);
    // let pageHtml = application.buildConetnt(articleList[5]['title'], articleHtml);
    // console.log(pageHtml);
    // fs.writeFileSync('test.html', pageHtml);

    // application.run();

};
main();
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

*/
