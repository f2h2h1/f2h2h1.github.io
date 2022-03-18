<?php
// php -S 127.0.0.1:9012 server.php
$filepath = $_SERVER['DOCUMENT_ROOT'] . urldecode($_SERVER['REQUEST_URI']);
// var_dump($_SERVER);
// echo $filepath;exit(1);
if (!is_file($filepath) && filter_var($_SERVER['REQUEST_URI'], FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => '/(.*)\.html$/']])) {
    $content = file_get_contents(__DIR__ . '/404.html');
    header('content-length: ' . strlen($content));
    header('content-type: text/html; charset=utf-8');
    echo $content;
    exit(0);
} else if (is_file($filepath) && filter_var($filepath, FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => '/(.*)\.md$/']])) {
    $content = file_get_contents($filepath);
    header('content-length: ' . strlen($content));
    header('content-type: text/plain; charset=utf-8');
    echo $content;
    exit(0);
} else {
    return false;
}
