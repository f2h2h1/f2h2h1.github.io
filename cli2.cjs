
const child_process = require('child_process');
const fs = require("fs"); 
const path = require('path');

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
    fs.writeFileSync('articleList.json', articleListJson);
    
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
    fs.writeFileSync('README.md', readme);

    // SUMMARY
    fs.writeFileSync('SUMMARY.md', '# Summary\n\n* [Introduction](README.md)\n' + articleList.reduce((carry, item) => {
        return carry += '* [' + item['title'] + '](' + createUrl(item['title'], 'md') + ')\n';
    }, ''));

    // rss
    // atom
    // sitemap
};
main();
/*
date('r'); // RFC 2822/RFC 5322 toUTCString
Tue, 07 Feb 2023 13:17:02 +0000

date('c'); // ISO 8601 toISOString
2023-02-07T13:17:07+00:00

/(?<=<title>).*?(?=<\/title>)/s
/(?<=<div id=\"link_exchange\">).*?(?=<\/div>)/s
/(?<=<article id=\"content\">).*?(?=<\/article>)/s
/(?<=<dl id=\"article_list\">).*?(?=<\/dl>)/s
getFullYear
getMonth
getDate

*/
