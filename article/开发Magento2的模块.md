开发 Magento2 的模块
================================

- 这是在 magento2.3 上开发的

0. 假设已经安装好 magento2
1. 新建模块的代码
2. 启用模块 和 刷新缓存

模块的路径是这样的，开发商名称和模块名称都使用 大驼峰 的形式命名
```
app/code/开发商名称/模块名称
```

默认路由是这样的
```
routeid/controller/action
```

## 新建模块的代码

### 最简单的例子

0. 新建模块目录 `app/code/LocalDev/HelloModule`
0. 在模块目录下新建 registration.php 并写入以下内容
    ```php
    <?php
    \Magento\Framework\Component\ComponentRegistrar::register(
        \Magento\Framework\Component\ComponentRegistrar::MODULE,
        'LocalDev_HelloModule',
        __DIR__
    );
    ```
0. 在模块目录下新建 etc 文件夹，在 etc 文件夹下新建 module.xml 并写入以下内容
    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
        <module name="LocalDev_HelloModule" setup_version="1.0.9"></module>
    </config>
    ```
0. 新建路由，在 etc 文件夹下新建 frontend 文件夹，在 frontend 下新建 routes.xml 并写入以下内容
    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/routes.xsd">
        <router id="standard">
            <route id="local_dev" frontName="local_dev">
                <module name="LocalDev_HelloModule" />
            </route>
        </router>
    </config>
    ```
    - 这是一个前台的路由，如果是后台的路由，那么需要在 etc/adminhtml 下新建 routes.xml
    - frontName 就是 route id
0. 新建 Controller 和 action
    1. 在模块目录下新建 Controller 文件夹
    1. 在 Controller 文件夹下，新建一个以控制器名称命名的文件名，例如 `Hello`
    1. 在 控制器 文件夹下，新建一个以方法名命名的文件，例如 `World.php`
    1. 在方法的文件里写入以下内容
        ```php
        <?php
        namespace LocalDev\HelloModule\Controller\Hello;
        class World extends \Magento\Framework\App\Action\Action
        {
            public function __construct(
                \Magento\Framework\App\Action\Context $context)
                {
                    return parent::__construct($context);
            }
            public function execute()
            {
                echo 'Hello World';
                exit;
            }
        }
        ```

完整的模块目录结构是这样的
```
app
    code
        LocalDev
            HelloModule
                Controller
                    Hello
                        World.php
                etc
                    frontend
                        routes.xml
                    module.xml
                registration.php
```

启用模块和刷新缓存后，访问这样的链接 `http://localhost-magento/local_dev/hello/world` ，应该就能看到 `hello world` 的输出

## 新建命令

0. 在模块目录下 etc/di.xml 加上以下内容
    ```xml
    <type name="Magento\Framework\Console\CommandList">
        <arguments>
            <argument name="commands" xsi:type="array">
                <item name="exampleSayHello" xsi:type="object">Vendor\Extension\Console\SayHello</item>
            </argument>
        </arguments>
    </type>
    ```
    - 如果是多条命令， item 可以多写几条
    - item 的值是运行命令的类的命名空间

0. 在模块目录里新建一个文件夹 Console ，在这个新建的文件夹里新建一个文件 SayHello.php 并写入以下内容
    ```php
    <?php
    namespace Vendor\Extension\Console;

    use Symfony\Component\Console\Command\Command;
    use Symfony\Component\Console\Input\InputInterface;
    use Symfony\Component\Console\Output\OutputInterface;
    use Symfony\Component\Console\Input\InputOption;

    class SayHello extends Command
    {
        const NAME = "name";

        protected function configure()
        {
            $options = [
                new InputOption(self::NAME, null, InputOption::VALUE_REQUIRED, 'a description text')
            ];

            $this->setName("example:sayhello") // 命令的名字
                ->setDescription('example description') // 命令的描述
                ->setDefinition($options);
            parent::configure();
        }

        protected function execute(InputInterface $input, OutputInterface $output)
        {
            if ($name = $input->getOption(self::NAME)) {
                $output->writeln('hello ' . $name);
            } else {
                $output->writeln('hello world');
            }
        }
    }
    ```
    - configure 方法里的 setName 就是设置命令的运行名称，例如上面的例子，的运行命令就是 `php bin/magento example:sayhello`

0. 运行这句命令 `php bin/magento setup:upgrade` 更新数据
0. 可以尝试运行这条命令 `php bin/magento list` ，看看能不能找到新加的命令
0. 最后运行上面新加的命令 `php bin/magento example:sayhello`

## 新建 GraphQl 的接口

0. 在模块目录 etc 下新建一个文件 schema.graphqls 并写入以下内容
    ```
        type Query
        {
            CustomGraphql (
                username: String @doc(description: "Email Address/Mobile Number")
                password: String @doc(description: "Password")
                websiteId: Int = 1 @doc (description: "Website Id")
            ): CustomGraphqlOutput @resolver(class: "Vendor\\Extension\\Model\\Resolver\\CustomGraphql") @doc(description:"Custom Module Datapassing")
        }
        type CustomGraphqlOutput
        {
            customer_id: Int
            type: String
            type_id: Int
        }
    ```
    - CustomGraphql 是请求的参数
    - CustomGraphqlOutput 是返回的参数
    - @resolver 是处理请求的类

0. 在模块目录 Model 下新建一个文件夹 Resolver ，然后再在这个文件夹里新建一个类文件 CustomGraphql.php 并写入以下内容

    ```php
    <?php
    namespace Vendor\Extension\Model\Resolver;

    use Magento\Framework\GraphQl\Config\Element\Field;
    use Magento\Framework\GraphQl\Exception\GraphQlInputException;
    use Magento\Framework\GraphQl\Query\ResolverInterface;
    use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

    class CustomGraphql implements ResolverInterface
    {
        /**
        * @param Field $field
        * @param \Magento\Framework\GraphQl\Query\Resolver\ContextInterface $context
        * @param ResolveInfo $info
        * @param array|null $value
        * @param array|null $args
        * @return array|\Magento\Framework\GraphQl\Query\Resolver\Value|mixed
        * @throws GraphQlInputException
        */
        public function resolve(
            Field $field,
            $context,
            ResolveInfo $info,
            array $value = null,
            array $args = null)
        {
            if (!isset($args['username']) || !isset($args['password']) || !isset($args['websiteId'])||
                empty($args['username']) || empty($args['password']) || empty($args['websiteId']))
            {
                throw new GraphQlInputException(__('Invalid parameter list.'));
            }
            $output = [];
            $output['customer_id'] = 1;
            $output['type'] = 'type';
            $output['type_id'] = 1;
        
            return $output ;
        }
    }
    ```
    - $output 的内容需要和 schema.graphqls 里定义的返回参数一致

0. 运行这句命令 `php bin/magento setup:upgrade` 更新数据

0. 用这句 curl 命令尝试请求
    ```
    curl 'http://localhost-magento/graphql' \
    -H 'accept: application/json' \
    -H 'content-type: application/json' \
    --data-raw '{"query":"\n    query {\n  CustomGraphql (\n    customer_id: 123\n    type: \"asd\"\n    type_id: 321\n  ) {\n    customer_id\n    type\n    type_id\n  }\n}","variables":{},"operationName":null}' \
    --compressed \
    --insecure -s -k
    ```
    - 如无意外应该能返回类似这样的数据
    ```
    {
        "data": {
            "CustomGraphqlOutput": {
            "customer_id": 123,
            "type": "asd",
            "type_id": 321,
            "end_date": 456
            }
        }
    }
    ```

0. 可以用这决 curl 命令来查看当前 magento 项目的 graphql 文档
    ```
    curl 'https://localhost-magento/graphql' \
    -H 'accept: application/json' \
    -H 'content-type: application/json' \
    --data-raw '{"query":"\n    query IntrospectionQuery {\n      __schema {\n        \n        queryType { name }\n        mutationType { name }\n        subscriptionType { name }\n        types {\n          ...FullType\n        }\n        directives {\n          name\n          description\n          \n          locations\n          args {\n            ...InputValue\n          }\n        }\n      }\n    }\n\n    fragment FullType on __Type {\n      kind\n      name\n      description\n      \n      fields(includeDeprecated: true) {\n        name\n        description\n        args {\n          ...InputValue\n        }\n        type {\n          ...TypeRef\n        }\n        isDeprecated\n        deprecationReason\n      }\n      inputFields {\n        ...InputValue\n      }\n      interfaces {\n        ...TypeRef\n      }\n      enumValues(includeDeprecated: true) {\n        name\n        description\n        isDeprecated\n        deprecationReason\n      }\n      possibleTypes {\n        ...TypeRef\n      }\n    }\n\n    fragment InputValue on __InputValue {\n      name\n      description\n      type { ...TypeRef }\n      defaultValue\n      \n      \n    }\n\n    fragment TypeRef on __Type {\n      kind\n      name\n      ofType {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n              ofType {\n                kind\n                name\n                ofType {\n                  kind\n                  name\n                  ofType {\n                    kind\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  ","variables":{},"operationName":"IntrospectionQuery"}' \
    --compressed -s -k
    ```

浏览器可以安装这个拓展 https://github.com/altair-graphql/altair

这是 graphql 的中文文档 https://graphql.cn/

## 启用模块 和 刷新缓存

查看启用的模块
```
php bin/magento module:status
```

启用模块
```
php bin/magento module:enable 模块名
```

禁用模块
```
php bin/magento module:disable 模块名
```

刷新缓存
```
php bin/magento cache:clean 清楚缓存
php bin/magento indexer:reindex 刷新全部索引
php bin/magento setup:upgrade 更新数据 Upgrades the Magento application, DB data, and schema
php bin/magento setup:di:compile 编译
php bin/magento setup:static-content:deploy -f 部署静态视图文件
php bin/magento cache:flush 刷新缓存
```

模块的代码修改后也要刷新缓存

## 参考

生成 magento 模块 https://cedcommerce.com/magento-2-module-creator/
