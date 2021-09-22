// 安装
const CACHE_NAME = "fed-cache";
this.addEventListener("install", function(event) {
    // this.skipWaiting();
    console.log("install service worker");
    // 创建和打开一个缓存库
    caches.open(CACHE_NAME);
    // 首页
    let cacheResources = [
        'https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css',
        '/index.html',
        '/static/marked.min.js',
        '/static/cc4.0.webp',
        '/articleList.json',
    ];
    event.waitUntil(
        // 请求资源并添加到缓存里面去
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(cacheResources);
        })
    );
});

// 激活
self.addEventListener('activate', function (e) {
    // 激活的状态，这里就做一做老的缓存的清理工作
});

var util = {
    fetchPut: function (request, callback) {
        return fetch(request).then(response => {
            // 跨域的资源直接return
            if (!response || response.status !== 200 || response.type !== "basic") {
                return response;
            }
            util.putCache(request, response.clone());
            typeof callback === "function" && callback();
            return response;
        });
    },
    putCache: function (request, resource) {
        // 后台不要缓存，preview链接也不要缓存
        if (request.method === "GET" && request.url.indexOf("wp-admin") < 0 
              && request.url.indexOf("preview_id") < 0) {
            caches.open(CACHE_NAME).then(cache => {
                cache.put(request, resource);
            });
        }
    }
};

this.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(response => {
            // cache hit
            if (response) {
                return response;
            }

            return util.fetchPut(event.request.clone());
        })
    );
});

// 缓存请求和返回（这是个简单的缓存优先的例子）
// self.addEventListener('fetch', function (e) {
//     e.respondWith(caches.match(e.request)
//         .then(function (response) {
//             if (response) {
//                 return response;
//             }
//             // fetchAndCache 方法并不存在，需要自己定义，这里只是示意代码
//             return fetchAndCache(e.request);
//         })
//     );
// });
