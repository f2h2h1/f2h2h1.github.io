<?php

declare(strict_types=1);

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

// README 里的列表
$readme = file_get_contents('README.md');
$listStr = array_reduce($articleList, function($carry, $item) {
    return $carry .= '- [' . $item['title'] . '](article/' . $item['title'] . '.md)' . "\n";
}, '');
$readme = preg_replace('/(?<=<!-- list -->).*(?=<!-- list -->)/ims', "\n" . $listStr, $readme);
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
    </item>
    EOF;
    $item = sprintf($item, $article['title'], 'https://f2h2h1.github.io/#title=' . urlencode($article['title']), $article['title'], date('Y-m-d', $article['updateTime']));
    $itemList .= trim($item) . "\n";
}
$rss = <<<EOF
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>f2h2h1's blog</title>
  <link>https://f2h2h1.github.io/</link>
  <description>f2h2h1's blog</description>
  $itemList
</channel>
</rss>
EOF;
file_put_contents('rss.xml', $rss);

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
