# 在magento2中使用persisted-query

## 什么是 persisted query

[Github - scandipwa/persisted-query](https://github.com/scandipwa/persisted-query)

[Packagist - scandipwa/persisted-query](https://packagist.org/packages/scandipwa/persisted-query)

`scandipwa/persisted-query` 是一个用于提升 magento2 graphql 响应速度的库。
大致原理是，把请求的解释缓存在 redis ，把响应的结果缓存在 `full page cache` (通常是 varnish) 。
只用于 `query` ，不用于 `mutation`

`persisted-query` 依赖
- Redis
- Varnish
- PHP ext-phpredis

## 安装

1. 通过 composer 安装
```
composer require scandipwa/persisted-query:^2.2
```

2. 修改配置文件 `app/etc/env.php` ，在 `cache`中加上这一段
```
    'persisted-query' => [
        'redis' => [
            'host' => 'localhost',
            'scheme' => 'tcp',
            'port' => '6379',
            'database' => '5'
        ]
    ],
```

3. 修改配置文件 `app/etc/config.php`
```
'ScandiPWA_PersistedQuery' => 1,
```

4. 安装完后记得运行构建命令。大致例子，仅供参考
```bash
php bin/magento setup:upgrade && \
php bin/magento setup:di:compile && \
php bin/magento setup:static-content:deploy -f && \
php bin/magento indexer:reindex && \
php bin/magento cache:flush;
```

## 使用

大致的使用流程
1. 先发送一次 PUT 请求
    - url 里需要带上一个 hash 参数， hash 的值是一个随机数，这个值不能重复
    ```
    https://localhost/graphql?hash=2443957263
    ```
    - PUT 请求成功后会返回 201
    ```
    HTTP/1.1 201 Created
    Content-Type: application/json
    Content-Length: 55

    {"error":false,"code":"1","message":"Query registered"}
    ```
2. 后续发送 GET 请求， GET 请求中也需要带上 hash 参数
    - 后续的 GET 请求才会有具体的数据

关键代码的位置
vendor/scandipwa/persisted-query/src/Plugin/PersistedQuery.php


可以通过这个 http 头设置过期时间 `SW-cache-age` ，这是设置 查询的过期时间

如果没有特别的设置，缓存在刷新时才会失效
- 刷新查询
    ```
    bin/magento scandipwa:pq:flush
    ```
- 刷新响应
    ```
    bin/magento cache:flush persisted_query_response
    ```

缓存无效时会返回 401
```
HTTP/1.1 410 Gone
Content-Type: application/json
Content-Length: 61

{"error":true,"code":"410","message":"Query hash is unknown"}
```

### 不带参数的请求

1. 先发送一次 PUT 请求
    ```bash
    curl 'https://localhost/graphql?hash=2443957263' \
      -X 'PUT' \
      -H 'accept: */*' \
      -H 'content-type: application/json' \
      --data-raw ''
    ```
2. 后续发送 GET 请求
    ```bash
    curl -X 'GET' 'https://localhost/graphql?hash=2443957263'
    ```

### 带参数的请求

1. 先发送一次 PUT 请求
    ```bash
    curl 'https://localhost/graphql?hash=2443957282' \
    -X 'PUT' \
    -H 'accept: */*' \
    -H 'content-type: application/json' \
    -H 'Cookie: XDEBUG_SESSION=vscode;' \
    -d '{
        "query": "query GetProductsBySkus($_filter:ProductAttributeFilterInput!, $_pageSize:Int) { products(search: \"*\", filter: $_filter, pageSize: $_pageSize ) { items { id uid sku name image { url } url_key url_suffix stock_status categories { uid name } } } }"
    }'
    ```
2. 后续发送 GET 请求
    ```bash
    curl -X 'GET' 'https://localhost/graphql?hash=2443957282&_filter=%257B%2522sku%2522%253A%257B%2522in%2522%253A%255B%2522sku1%2522%252C%2522sku2%2522%252C%2522sku3%2522%255D%257D%257D&_pageSize=1'
    ```

### 如何构造一个带参数的请求

假设这是原本的请求
```
curl 'https://localhost/graphql' \
  -X 'POST' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'Cookie: XDEBUG_SESSION=vscode;' \
  -d '{
    "query": "query GetProductsBySkus($_filter:ProductAttributeFilterInput!, $_pageSize:Int) { products(search: \"*\", filter: $_filter, pageSize: $_pageSize ) { items { id uid sku name image { url } url_key url_suffix stock_status categories { uid name } } } }",
    "variables":{"_filter":{"sku":{"in":["sku1","sku2","sku3"],"_pageSize":1}}}
}'
```

1. 删除请求体中的 `variables`
1. 把请求的方法改成 `PUT`
1. url 中加上 hash 参数
1. 这是最后的结果
```
curl 'https://localhost/graphql?hash=2443957282' \
  -X 'PUT' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'Cookie: XDEBUG_SESSION=vscode;' \
  -d '{
    "query": "query GetProductsBySkus($_filter:ProductAttributeFilterInput!, $_pageSize:Int) { products(search: \"*\", filter: $_filter, pageSize: $_pageSize ) { items { id uid sku name image { url } url_key url_suffix stock_status categories { uid name } } } }",
}'
```

后续的请求中，把 `variables` 转换为 url编码，再直接加在 url 里
```
curl -X 'GET' 'https://localhost/graphql?hash=2443957282&_filter=%257B%2522sku%2522%253A%257B%2522in%2522%253A%255B%2522sku1%2522%252C%2522sku2%2522%252C%2522sku3%2522%255D%257D%257D&_pageSize=1'
```

这是把 `variables` 转换为 url编码 的伪代码
```php
$variables = '{"_filter":{"sku":{"in":["sku1","sku2","sku3"]}},"_pageSize":1}';

$variables = json_decode($variables, true);

foreach ($variables as $key => $value) {
    $variables[$key] = urlencode(json_encode($value));
}

echo http_build_query($variables);
```

<!--

php -a <<- 'EOF'
$variables='{"_filter":{"sku":{"in":["sku1","sku2","sku3"]}},"_pageSize":1}';
echo http_build_query(array_map(fn($value) => urlencode(json_encode($value)), json_decode($variables, true)));
EOF

node <<- 'EOF'
const variables = '{"_filter":{"sku":{"in":["sku1","sku2","sku3"]}},"_pageSize":1}';
console.log(Object.entries(JSON.parse(variables)).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`).join('&'));
EOF

echo '{"_filter":{"sku":{"in":["sku1","sku2","sku3"]}},"_pageSize":1}' | \
python -c "import sys;import json;import urllib.parse;variables=sys.stdin.read();
print('&'.join(f'{urllib.parse.quote(key)}={urllib.parse.quote(json.dumps(value, separators=(',', ':')))}' for key, value in json.loads(variables).items()))"

-->

