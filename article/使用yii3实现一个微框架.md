# 使用yii3实现一个微框架

> yii3 是一个现代的php框架，全面符合PSR标准，由一百多个独立包组成，实现按需加载

> 这篇文章是描述如何使用很少的 yii3 组件实现一个微框架

## 新建项目目录

### 前置的依赖
- php 8.2
- composer 2
- git

### 安装命令

```bash
mkdir yii3-mrico;
cd yii3-mrico;
composer init;
composer require \
    httpsoft/http-server-request \
    yiisoft/yii-http \
    yiisoft/router-fastroute \
    yiisoft/di \
    yiisoft/injector \
    yiisoft/event-dispatcher \
    yiisoft/yii-event \
    yiisoft/psr-emitter ;
```

## 编写入口文件

index.php
```php
<?php

/**
 * Yii3 Micro Framework - Single File Application
 */

// =============================================================================
// 0. Autoloading
// =============================================================================

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use HttpSoft\Message\Response;
use HttpSoft\Message\ResponseFactory;
use HttpSoft\Message\ServerRequest;
use HttpSoft\Message\ServerRequestFactory;
use HttpSoft\Message\StreamFactory;
use HttpSoft\Message\UriFactory;
use HttpSoft\Message\UploadedFileFactory;
use Psr\Container\ContainerInterface;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\EventDispatcher\ListenerProviderInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestFactoryInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Http\Message\UriFactoryInterface;
use Psr\Http\Message\UploadedFileFactoryInterface;
use Yiisoft\Di\Container;
use Yiisoft\Di\ContainerConfig;
use Yiisoft\EventDispatcher\Dispatcher\Dispatcher;
use Yiisoft\EventDispatcher\Provider\Provider;
use Yiisoft\Http\Status;
use Yiisoft\Injector\Injector;
use Yiisoft\Middleware\Dispatcher\MiddlewareDispatcher;
use Yiisoft\Middleware\Dispatcher\MiddlewareFactory;
use Yiisoft\Router\CurrentRoute;
use Yiisoft\Router\Group;
use Yiisoft\Router\Middleware\Router;
use Yiisoft\Router\Route;
use Yiisoft\Router\RouteCollection;
use Yiisoft\Router\RouteCollectionInterface;
use Yiisoft\Router\RouteCollector;
use Yiisoft\Router\RouteCollectorInterface;
use Yiisoft\Router\UrlGeneratorInterface;
use Yiisoft\Router\UrlMatcherInterface;
use Yiisoft\Router\FastRoute\UrlGenerator;
use Yiisoft\Router\FastRoute\UrlMatcher;
use Yiisoft\Yii\Event\CallableFactory;
use Yiisoft\Yii\Event\ListenerCollectionFactory;
use Yiisoft\Yii\Http\Application;
use Yiisoft\Yii\Http\Event\AfterEmit;
use Yiisoft\Yii\Http\Event\AfterRequest;
use Yiisoft\Yii\Http\Event\ApplicationShutdown;
use Yiisoft\Yii\Http\Event\ApplicationStartup;
use Yiisoft\Yii\Http\Event\BeforeRequest;
use Yiisoft\Yii\Http\Handler\NotFoundHandler;


// =============================================================================
// 1. Event Listener Configuration
// =============================================================================

function createListenerProvider(ContainerInterface $container): ListenerProviderInterface
{
    $listenerConfig = [
        ApplicationStartup::class => [
            static function (ApplicationStartup $event) {
                error_log('[EVENT] Application starting up');
            },
        ],
        ApplicationShutdown::class => [
            static function (ApplicationShutdown $event) {
                error_log('[EVENT] Application shutting down');
            },
        ],
        BeforeRequest::class => [
            static function (BeforeRequest $event) {
                $request = $event->getRequest();
                error_log('[EVENT] Before request: ' . $request->getMethod() . ' ' . $request->getUri()->getPath());
            },
        ],
        AfterRequest::class => [
            static function (AfterRequest $event) {
                $response = $event->getResponse();
                $status = $response ? $response->getStatusCode() : 'no response';
                error_log('[EVENT] After request, status: ' . $status);
            },
        ],
        AfterEmit::class => [
            static function (AfterEmit $event) {
                error_log('[EVENT] Response emitted');
            },
        ],
    ];

    $injector = new Injector($container);
    $callableFactory = new CallableFactory($container, $injector);
    $factory = new ListenerCollectionFactory($injector, $callableFactory);
    $collection = $factory->create($listenerConfig);

    return new Provider($collection);
}

// =============================================================================
// 2. Route Configuration
// =============================================================================

function configureRoutes(RouteCollectorInterface $collector): void
{
    $routes = [
        // Home page
        'home' => Route::get('/')
            ->action(function (ResponseFactoryInterface $responseFactory) {
                $response = $responseFactory->createResponse(Status::OK);
                $response->getBody()->write(json_encode([
                    'framework' => 'Yii3 Micro',
                    'status'    => 'running',
                    'time'      => date('Y-m-d H:i:s'),
                    'php'       => PHP_VERSION,
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                return $response
                    ->withHeader('Content-Type', 'application/json');
            }),
        // Health check
        'health' => Route::get('/health')
            ->action(function (ResponseFactoryInterface $responseFactory) {
                $response = $responseFactory->createResponse(Status::OK);
                $response->getBody()->write(json_encode([
                    'status' => 'healthy',
                    'php'    => PHP_VERSION,
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json');
            }),
        // Hello with name parameter
        'hello' => Route::get('/hello/{name}')
            ->action(function (
                ResponseFactoryInterface $responseFactory,
                CurrentRoute $currentRoute,
            ) {
                $name = $currentRoute->getArgument('name', 'World');
                $response = $responseFactory->createResponse(Status::OK);
                $response->getBody()->write(json_encode([
                    'message' => "Hello, {$name}!",
                    'route'   => $currentRoute->getUri()->getPath(),
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                return $response
                    ->withHeader('Content-Type', 'application/json');
            }),
        // Echo POST request body
        'echo' => Route::post('/echo')
            ->action(function (
                ServerRequestInterface $request,
                ResponseFactoryInterface $responseFactory,
            ) {
                $body = $request->getParsedBody() ?? [];
                $response = $responseFactory->createResponse(Status::OK);
                $response->getBody()->write(json_encode([
                    'method'  => $request->getMethod(),
                    'uri'     => (string) $request->getUri(),
                    'body'    => $body,
                    'query'   => $request->getQueryParams(),
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                return $response
                    ->withHeader('Content-Type', 'application/json');
            }),
        // Get URL by name (demonstrates URL generation)
        'urls' => Route::get('/urls')
            ->action(function (
                ResponseFactoryInterface $responseFactory,
                UrlGeneratorInterface $urlGenerator,
                \Yiisoft\Router\RouteCollectorInterface $collector,
            ) {
                $getRouteName = function($route) {
                    return $route->getData('name');
                };
                $getRouteGroupName = function($routeGroup) use (&$getRouteGroupName, $getRouteName) {
                    $list = [];
                    foreach ($routeGroup->getData('routes') as $item) {
                        if ($item instanceof Group) {
                            $list = array_merge($list, $getRouteGroupName($item));
                        } else {
                            $list[] = $getRouteName($item);
                        }
                    }
                    return $list;
                };
                $routeList = [];
                foreach ($collector->getItems() as $item) {
                    if ($item instanceof Group) {
                        $routeList = array_merge($routeList, $getRouteGroupName($item));
                    } else {
                        $routeList[] = $getRouteName($item);
                    }
                }
                $response = $responseFactory->createResponse(Status::OK);
                $response->getBody()->write(json_encode([
                    'routes' => [
                        'home'    => $urlGenerator->generate('home'),
                        'health'  => $urlGenerator->generate('health'),
                        'hello'   => $urlGenerator->generate('hello', ['name' => 'Yii3']),
                        'echo'    => $urlGenerator->generate('echo'),
                        'urls'    => $urlGenerator->generate('urls'),
                        'routeList' => $routeList,
                    ],
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                return $response
                    ->withHeader('Content-Type', 'application/json');
            }),
        // Demo of dependency injection
        'di-test' => Route::get('/di-test')
            ->action(function (
                ResponseFactoryInterface $responseFactory,
                ContainerInterface $container,
                EventDispatcherInterface $eventDispatcher,
                UrlMatcherInterface $urlMatcher,
                UrlGeneratorInterface $urlGenerator,
                \Yiisoft\Router\RouteCollectorInterface $collector,
            ) {
                $response = $responseFactory->createResponse(Status::OK);
                $response->getBody()->write(json_encode([
                    'di_working'             => true,
                    'container_class'        => get_class($container),
                    'event_dispatcher_class' => get_class($eventDispatcher),
                    'url_matcher_class'      => get_class($urlMatcher),
                    'url_generator_class'    => get_class($urlGenerator),
                    'url_collector_class'    => get_class($collector),
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                return $response
                    ->withHeader('Content-Type', 'application/json');
            }),
    ];

    $collector->addRoute(
        Group::create('/' . basename(__FILE__))->routes(
            ...array_map(function($key, $item){return $item->name(basename(__FILE__) .  '/' . $key);},  array_keys($routes), array_values($routes))
        ),
        ...array_map(function($key, $item){return $item->name($key);},  array_keys($routes), array_values($routes)),
    );

    $collector->addRoute(
        Route::methods(
            [\Yiisoft\Http\Method::GET, \Yiisoft\Http\Method::POST, \Yiisoft\Http\Method::PUT, \Yiisoft\Http\Method::DELETE, \Yiisoft\Http\Method::PATCH, \Yiisoft\Http\Method::OPTIONS],
            '/{path:.*}'
        )
        ->action(static function (ResponseFactoryInterface $responseFactory): ResponseInterface {
                $response = $responseFactory->createResponse(Status::NOT_FOUND);
                $response->getBody()->write('404 NOT FOUND');
                return $response;
        })
        ->name('fallback.404')
    );
}

// =============================================================================
// 3. DI Container Configuration
// =============================================================================

// Build routes first (needed for RouteCollection)
$routeCollector = new RouteCollector();
configureRoutes($routeCollector);
$routeCollection = new RouteCollection($routeCollector);

$containerConfig = ContainerConfig::create()
    ->withDefinitions([
        // --- PSR-17 HTTP Factories ---
        ResponseFactoryInterface::class         => ResponseFactory::class,
        ServerRequestFactoryInterface::class    => ServerRequestFactory::class,
        StreamFactoryInterface::class           => StreamFactory::class,
        UriFactoryInterface::class              => UriFactory::class,
        UploadedFileFactoryInterface::class     => UploadedFileFactory::class,

        // --- Router (use pre-built instances) ---
        RouteCollectionInterface::class         => static fn () => $routeCollection,
        RouteCollectorInterface::class          => static fn () => $routeCollector,
        CurrentRoute::class                     => CurrentRoute::class,
        UrlMatcherInterface::class              => UrlMatcher::class,
        UrlGeneratorInterface::class            => UrlGenerator::class,

        // --- Event Dispatcher ---
        ListenerProviderInterface::class        => static fn (ContainerInterface $c) => createListenerProvider($c),
        EventDispatcherInterface::class         => Dispatcher::class,

        // --- Middleware ---
        MiddlewareFactory::class                => static fn (ContainerInterface $c) => new MiddlewareFactory($c),
        Router::class                           => static function (ContainerInterface $c) {
            return new Router(
                $c->get(UrlMatcherInterface::class),
                $c->get(ResponseFactoryInterface::class),
                $c->get(MiddlewareFactory::class),
                $c->get(CurrentRoute::class),
                $c->get(EventDispatcherInterface::class),
            );
        },
    ]);

$container = new Container($containerConfig);

// =============================================================================
// 4. Application Bootstrap & Request Handling
// =============================================================================

try {
    // Create the server request from PHP globals
    $request = \HttpSoft\ServerRequest\ServerRequestCreator::createFromGlobals($_SERVER, $_FILES, $_COOKIE, $_GET, $_POST);

    // Build middleware pipeline
    /** @var MiddlewareFactory $middlewareFactory */
    $middlewareFactory = $container->get(MiddlewareFactory::class);
    /** @var EventDispatcherInterface $eventDispatcher */
    $eventDispatcher = $container->get(EventDispatcherInterface::class);

    $middlewareDispatcher = new MiddlewareDispatcher($middlewareFactory, $eventDispatcher);
    $middlewareDispatcher = $middlewareDispatcher->withMiddlewares([
        Router::class,  // Route requests to controllers
    ]);

    $fallbackHandler = new NotFoundHandler(
        $container->get(ResponseFactoryInterface::class)
    );

    // Create application
    $app = new Application(
        $middlewareDispatcher,
        $eventDispatcher,
        $fallbackHandler
    );

    // Start application
    $app->start();

    // Handle the request
    $response = $app->handle($request);

    // Emit the response
    $sapiEmitter = new \Yiisoft\PsrEmitter\SapiEmitter(65536);
    $sapiEmitter->emit($response);

    // Notify that response was emitted
    $app->afterEmit($response);

    // Shutdown
    $app->shutdown();

} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'error'   => 'Internal Server Error',
        'message' => $e->getMessage(),
        'file'    => $e->getFile() . ':' . $e->getLine(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
```

运行
```bash
php -S 127.0.0.1:8002
```

<!--
作为 router 文件运行
```bash
php -S 127.0.0.1:8002 index.php
```
-->

请求
```bash
curl -v http://127.0.0.1:8002/index.php
```

## 单独的action类

action类 本质上是一个普通的类，具体的处理方法只需要返回 ResponseInterface 即可

声明一个 action 类
```php

class ActionController
{
    public function execute(ServerRequestInterface $request, ResponseFactoryInterface $responseFactory): ResponseInterface
    {
        $body = $request->getParsedBody() ?? [];
        $response = $responseFactory->createResponse(Status::OK);
        $response->getBody()->write(json_encode([
            'method'  => $request->getMethod(),
            'uri'     => (string) $request->getUri(),
            'body'    => $body,
            'query'   => $request->getQueryParams(),
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
}

```

把 action 类加入到 容器 中
```php
$containerConfig = ContainerConfig::create()
    ->withDefinitions([
        ...
        ActionController::class => static fn() => new ActionController(),
    ]);
```

把 action类加入到 路由 中
```php
// 在 $routes 数组中加上
$routes = [
    ...
    'action' => Route::get('/action')
            ->action([ActionController::class, 'execute']),
];

// 或者直接加到 $collector 对象中
$collector->addRoute(
    Route::get('/action')
            ->action([ActionController::class, 'execute']),
);
```

请求
```bash
curl -v http://127.0.0.1:8002/index.php/action
```

## 使用视图

安装对应的库
```bash
composer require yiisoft/yii-view-renderer
```

在根目录下新建要给视图文件 `template.phtml` ，并写入以下内容
```html
<p>The message is: <?= $message ?></p>
```

在 index.php 里引入
```php
use Yiisoft\Yii\View\Renderer\WebViewRenderer;
```

action类新建一个 view 方法
```php
    public function view(ServerRequestInterface $request, WebViewRenderer $webViewRenderer): ResponseInterface
    {
        return $webViewRenderer->render(__DIR__ . '/template.phtml', [
            'message' => 'message',
        ]);
    }
```

加入路由
```php
$routes = [
    ...
    'view' => Route::get('/view')
            ->action([ActionController::class, 'view']),
];
```

其实完全不用 库 也可以的
```php
$routes = [
    ...
    'view-pure' => Route::get('/view-pure')
        ->action(function (
            ServerRequestInterface $request,
            ResponseFactoryInterface $responseFactory,
        ) {
            ob_start();
            try {
                $dictionary = ['message' => 'message2'];
                extract($dictionary, EXTR_SKIP);
                include __DIR__ . '/template.phtml';
            } catch (\Exception $exception) {
                ob_end_clean();
                throw $exception;
            }
            $output = ob_get_clean();
            $response = $responseFactory->createResponse(Status::OK);
            $response->getBody()->write($output);
            return $response;
        }),
];
```

## 加入授权

安装对应的库
```bash
composer require yiisoft/user
```

<!--
单独的 action 类
加入视图 yiisoft/yii-view-renderer
加入带layout的视图
加入 404响应 和 其它错误处理
加入 认证 yiisoft/user
    安装：composer require yiisoft/user
    绑定 IdentityRepositoryInterface 接口，并将 Session 注入 CurrentUser 服务。
    实现接口：
        Identity 类：implements Yiisoft\Auth\IdentityInterface，作为用户的数据载体。
        IdentityRepository 类：implements Yiisoft\Auth\IdentityRepositoryInterface，负责从数据源（如数据库）查找并返回 Identity 对象。
    执行登录：在控制器中通过依赖注入获取 CurrentUser 实例，然后调用 $currentUser->login($yourIdentity, $duration) 即可。

    use Yiisoft\Auth\AuthenticationMethod\SessionAuth;
    use Yiisoft\Auth\Middleware\Authentication;
    use Yiisoft\User\CurrentUser;
加入 授权
数据库

容器
中间件

url 路由的形式？
    使用参数 index.php?r=/route
    直接拼接 index.php/route
    隐藏文件 /route

-->


