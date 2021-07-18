<?php

declare(strict_types=1);

$articleList = [];
foreach (glob('article/*.md') as $item) {
    if (filter_var($item, FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => '/(?:.*)draft.md$/']])) {
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

usort($articleList, function ($a, $b) {
    return ($a['createTime'] > $b['createTime']) ? -1 : 1;
});

// echo json_encode($articleList, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);exit;

file_put_contents('articleList.json', json_encode($articleList, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$readme = file_get_contents('README.md');
$listStr = array_reduce($articleList, function($carry, $item) {
    return $carry .= '- [' . $item['title'] . '](article/' . $item['title'] . '.md)' . "\n";
}, '');
$readme = preg_replace('/(?<=<!-- list -->).*(?=<!-- list -->)/ims', "\n" . $listStr, $readme);
// echo $readme;
file_put_contents('README.md', $readme);
