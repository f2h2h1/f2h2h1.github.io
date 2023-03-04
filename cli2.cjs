
const child_process = require('child_process');
const fs = require("fs"); 
const path = require('path');
process.env.TZ = 'Asia/Shanghai';
// var dirPath = path.resolve('/article');
let main = async function () {
    var createUrl = function(title, type) {
        let url = '';
        switch (type) {
            case 'md':
                url = 'article/' + title + '.md';
                break;
            case 'html':
            default:
                url = 'https://f2h2h1.github.io/article/' + title + '.html';
                // $url = 'https://f2h2h1.github.io/#title=' . urlencode($title);
        }
        return url;
    }

    var clearLeadSpace = function (template) {
        let leadSpaceCount = template.length - template.trimStart().length - 1;
        let regex = new RegExp(' {' + leadSpaceCount + '}', 'g');
        return template.replaceAll(regex, '').trim();
    }

    // 获取文章列表
    var files = fs.readdirSync('./article');
    var articleList = [];
    for (i in files) {
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
    // fs.writeFileSync('articleList.json', articleListJson);
    
    // README 里的文章列表
    let readme = fs.readFileSync('README.md', {encoding:'utf8', flag:'r'});
    let listStr = articleList.reduce((carry, item) => {
        return carry += '- [' + item.title + '](' + createUrl(item.title, 'md') + ')' + "\n";
        }, '');
    readme = (/(?<=<!-- articleList -->).*(?=<!-- articleList -->)/ims)[Symbol.replace](readme, '\n' + listStr);
    // console.log(listStr, readme);
    // fs.writeFileSync('README.md', readme);

    // README 里的友链列表
    let exchangeListJson = fs.readFileSync('exchangeList.json', {encoding:'utf8', flag:'r'});
    let exchangeList = JSON.parse(exchangeListJson);
    // console.log(exchangeList);
    let exchangeTh = '|站点|头像|网址|描述|\n|-|-|-|-|';
    let exchange = exchangeTh.trim() + '\n' + exchangeList.reduce((carry, item) => {
        let name = item.name;
        let avatar = item.avatar;
        let href= item.href;
        let desc = item.desc;
        if (avatar) {
            avatar = '<img alt="' + (name + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0') + '" src="' + avatar + '" width="119" />';
        }
        name = `[${name}](${href})`;
        tr = `|${name}|${avatar}|${href}|${desc}|`;
        return carry += tr + '\n';
        }, '');
    readme = (/(?<=<!-- exchangeList -->).*(?=<!-- exchangeList -->)/ims)[Symbol.replace](readme, '\n' + exchange);
    // fs.writeFileSync('README.md', readme);

    // SUMMARY
    fs.writeFileSync('SUMMARY.md', '# Summary\n\n* [Introduction](README.md)\n' + articleList.reduce((carry, item) => {
        return carry += '* [' + item['title'] + '](' + createUrl(item['title'], 'md') + ')\n';
    }, ''));

    var xmlProcess = function (mainTemplate, articleList, itemProcess) {
        let xmlHead = '<?xml version="1.0" encoding="UTF-8"?>\n';
        let items = articleList.reduce(itemProcess, '');
        return xmlHead + mainTemplate.trim().replace('%s', items.trim().replaceAll('\n', '\n    '));
    }
    fs.writeFileSync('sitemap.xml', xmlProcess(
        clearLeadSpace(`
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            %s
        </urlset>`),
        articleList,
        function(carry, item) {
            let itemTemplate = `
            <url>
                <loc>%s</loc>
                <lastmod>%s</lastmod>
                <priority>0.5</priority>
            </url>
            `;
            itemTemplate = clearLeadSpace(itemTemplate);
            let updateTime = item['updateTime'];
            updateTime = new Date(updateTime * 1000);
            let date = updateTime.getFullYear() + '-' + (updateTime.getMonth() + 1) + '-' + updateTime.getDate();
            let i = '';
            i = itemTemplate.trim().replace('%s', createUrl(item['title']));
            i = i.replace('%s', date);
            return carry += i + '\n';
        }
    ));
    // fs.writeFileSync('atom.xml', xmlProcess(
    //     `<feed xmlns="http://www.w3.org/2005/Atom">
    //     <title>f2h2h1's blog</title>
    //     <link href="https://f2h2h1.github.io/atom.xml" rel="self" />
    //     <link href="https://f2h2h1.github.io/" />
    //     <id>urn:uuid:9EC21C9D-023B-2486-16D4-703D36C458B2</id>
    //     <updated>${date('c')}</updated>
    //     <author>
    //         <name>f2h2h1's blog</name>
    //     </author>
    //     %s
    //     </feed>`,
    //     articleList,
    //     function(carry, item) {
    //         let itemTemplate = `
    //         <entry>
    //             <title>%s</title>
    //             <link href="https://f2h2h1.github.io/article/关于.html" />
    //             <id>https://f2h2h1.github.io/article/关于.html</id>
    //             <updated>2022-09-30T23:57:19+08:00</updated>
    //             <summary>关于</summary>
    //         </entry>
    //         `;
    //         let i = '';
    //         i = itemTemplate.trim().replace('%s', createUrl(item['title']));
    //         i = i.replace('%s', item['updateTime']);
    //         return carry += i + '\n';
    //     }
    // ));
    // fs.writeFileSync('atom.xml', xmlp());
    // fs.writeFileSync('rss.xml', xmlp());


    // rss
    // atom
    // sitemap
    let xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';
    let mainTemplate = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    %s
    </urlset>`;
    let items = articleList.reduce((carry, item) => {
        let itemTemplate = `
        <url>
            <loc>%s</loc>
            <lastmod>%s</lastmod>
            <priority>0.5</priority>
        </url>
        `;
        let i = '';
        i = itemTemplate.trim().replace('%s', createUrl(item['title']));
        i = i.replace('%s', item['updateTime']);
        return carry += i + '\n';
    }, '')
    // console.log(mainTemplate.trim().replace('%s', items));
    let itemTemplate = '';

/*
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://f2h2h1.github.io/article/终端，控制台和外壳.html</loc>
        <lastmod>2023-01-10</lastmod>
        <priority>0.5</priority>
    </url>
    </urlset>
*/
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

*/
