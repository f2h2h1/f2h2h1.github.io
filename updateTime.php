<?php

declare(strict_types=1);

$articleList = [];
foreach (glob('article/*.md') as $item) {
    $output = [];
    exec('git log --format=%aD ' . $item, $output, $return_val);
    $len = count($output);
    if ($len > 1) {
        $createTime = end($output);
        if ($len == 1) {
            $updateTime = $createTime;
        } else {
            $updateTime = $output[0];
        }
        $articleList[] = [
            'title' => basename($item),
            'createTime' => strtotime($createTime),
            'updateTime' => strtotime($updateTime),
        ];
    }
}

usort($articleList, function ($a, $b) {
    return ($a['createTime'] > $b['createTime']) ? -1 : 1;
});

// echo json_encode($articleList, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

file_put_contents('articleList.json', json_encode($articleList, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
