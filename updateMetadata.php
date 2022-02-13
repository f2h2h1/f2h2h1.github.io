<?php

declare(strict_types=1);

ini_set('date.timezone', 'Asia/Shanghai');

// 获取文章列表
$articleList = [];
foreach (glob('article/*.md') as $item) {
    if (filter_var($item, FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => '/^article\/_(?:.*).md$/']])) {
        continue;
    }
    $output = [];
    exec('git log --format=%aD ' . $item, $output, $return_val);
    $len = count($output);
    if ($len >= 1) {
        $createTime = end($output);
        if ($len == 1) {
            $updateTime = $createTime;
        } else {
            $updateTime = $output[0];
        }
        $articleList[] = [
            'title' => pathinfo($item, PATHINFO_FILENAME),
            'createTime' => strtotime($createTime),
            'updateTime' => strtotime($updateTime),
        ];
    }
}

// 文章列表按创建时间排序
usort($articleList, function ($a, $b) {
    return ($a['createTime'] > $b['createTime']) ? -1 : 1;
});

// 用于页面的 articleList.json
file_put_contents('articleList.json', json_encode($articleList, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

// README 里的文章列表
$readme = file_get_contents('README.md');
$listStr = array_reduce($articleList, function($carry, $item) {
    return $carry .= '- [' . $item['title'] . '](article/' . $item['title'] . '.md)' . "\n";
}, '');
$readme = preg_replace('/(?<=<!-- articleList -->).*(?=<!-- articleList -->)/ims', "\n" . $listStr, $readme);
file_put_contents('README.md', $readme);

// README 里的友链列表
$exchangeList = file_get_contents('exchangeList.json');
$exchangeList = json_decode($exchangeList, true);
$exchangeTh = <<<EOF
|站点|头像|网址|描述|
|-|-|-|-|
EOF;
$listStr = array_reduce($exchangeList, function($carry, $item) {
    $name = $item['name'];
    $href = $item['href'];
    $desc = $item['desc'];
    $avatar = $item['avatar'];
    $tr = '';
    if (!empty($avatar) && filter_var($avatar, FILTER_VALIDATE_URL) !== false) {
        $avatar = '<img alt="' . addslashes($name) . '" src="' . $avatar . '" width="119" />';
    }
    $name = "[$name]($href)";
    $tr = "|$name|$avatar|$href|$desc|";
    return $carry .= $tr . "\n";
}, '');
$listStr = $exchangeTh . "\n" . $listStr;
$readme = preg_replace('/(?<=<!-- exchangeList -->).*(?=<!-- exchangeList -->)/ims', "\n" . $listStr, $readme);
file_put_contents('README.md', $readme);

// SUMMARY
file_put_contents('SUMMARY.md', '# Summary' . "\n\n" . '* [Introduction](README.md)' . "\n" . array_reduce($articleList, function($carry, $item) {
    return $carry .= '* [' . $item['title'] . '](article/' . $item['title'] . '.md)' . "\n";
}, ''));

// rss
$itemList = '';
foreach ($articleList as $article) {
    $item = <<<EOF
    <item>
        <title>%s</title>
        <link>%s</link>
        <description>%s</description>
        <pubDate>%s</pubDate>
        <guid>%s</guid>
    </item>
    EOF;
    $link = 'https://f2h2h1.github.io/#title=' . urlencode($article['title']);
    $item = sprintf($item, $article['title'], $link, $article['title'], date('r', $article['updateTime']), $link);
    $itemList .= trim($item) . "\n";
}
$rss = <<<EOF
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>f2h2h1's blog</title>
    <link>https://f2h2h1.github.io/</link>
    <description>f2h2h1's blog</description>
    <atom:link href="https://f2h2h1.github.io/rss.xml" rel="self" type="application/rss+xml" />
$itemList
</channel>
</rss>
EOF;
file_put_contents('rss.xml', $rss);

// atom
$itemList = array_reduce($articleList, function ($carry, $article) {
    $title = $article['title'];
    $link = 'https://f2h2h1.github.io/#title=' . urlencode($article['title']);
    $updated = date('c', $article['updateTime']);
    $item = <<<EOF
    <entry>
        <title>%s</title>
        <link href="%s" />
        <id>%s</id>
        <updated>%s</updated>
        <summary>%s</summary>
    </entry>
    EOF;
    return $carry .= trim(sprintf($item, $title, $link, $link, $updated, $title)) . "\n";
}, '');
$updated = date('c', time());
$atom = <<<EOF
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>f2h2h1's blog</title>
    <link href="https://f2h2h1.github.io/atom.xml" rel="self" />
    <link href="https://f2h2h1.github.io/" />
    <id>urn:uuid:9EC21C9D-023B-2486-16D4-703D36C458B2</id>
    <updated>$updated</updated>
    <author>
        <name>f2h2h1's blog</name>
    </author>
$itemList
</feed>
EOF;
file_put_contents('atom.xml', $atom);

// sitemap
$itemList = '';
foreach ($articleList as $article) {
    $item = <<<EOF
    <url>
        <loc>%s</loc>
        <lastmod>%s</lastmod>
        <priority>0.5</priority>
    </url>
    EOF;
    $item = sprintf($item, 'https://f2h2h1.github.io/#title=' . urlencode($article['title']), date('Y-m-d', $article['updateTime']));
    $itemList .= trim($item) . "\n";
}
$sitemap = <<<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$itemList
</urlset>
EOF;
file_put_contents('sitemap.xml', $sitemap);
