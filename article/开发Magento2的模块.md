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

## 新建模型

0. 新建或在 db_schema.xml 文件里添加
    ```xml
    <?xml version="1.0"?>
    <schema xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Setup/Declaration/Schema/etc/schema.xsd">
        <table name="test_model" resource="default" engine="innodb" comment="Test Model">
            <column xsi:type="int" name="entity_id" nullable="false" identity="true"/>
            <column xsi:type="int" name="customer_id" nullable="false" comment="customer_id"/>
            <column xsi:type="varchar" name="type" nullable="false" length="64" comment="type"/>
            <constraint xsi:type="primary" referenceId="PRIMARY">
                <column name="entity_id"/>
            </constraint>
        </table>
    </schema>
    ```
    - setup 脚本将会被淘汰， https://devdocs.magento.com/guides/v2.4/extension-dev-guide/declarative-schema/db-schema.html
0. 新建 resource model
    - 在模块目录 model/ResourceModel 文件夹下新建 TestModel.php

    ```php
    <?php
    namespace Vendor\Extension\Model\ResourceModel;

    use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

    class TestModel extends AbstractDb
    {
        const TABLE_NAME = 'test_model';

        protected function _construct()
        {
            $this->_init(self::TABLE_NAME, 'entity_id');
        }
    }
    ```

0. 新建 model
    - 在模块目录 model 文件夹下新建 TestModel.php

    ```php
    <?php
    namespace Vendor\Extension\Model;

    use Magento\Framework\Model\AbstractModel;

    class TestModel extends AbstractModel
    {
        protected function _construct()
        {
            $this->_init(Vendor\Extension\Model\ResourceModel\TestModel::class);
        }
    }
    ```

0. 新建 collection
    - 在模块目录 model/ResourceModel/TestModel 文件夹（这里的 TestModel 对应的是模型名）下新建 Collection.php

    ```php
    <?php
    namespace Vendor\Extension\Model\ResourceModel\TestModel;

    use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

    class Collection extends AbstractCollection
    {
        protected function _construct()
        {
            $this->_init(Vendor\Extension\Model\TestModel::class, Vendor\Extension\Model\ResourceModel\TestModel::class);
        }
    }
    ```

0. 然后运行这句新建 db_schema_whitelist.json
    ```
    php bin/magento setup:db-declaration:generate-whitelist --module-name=Extension
    ```

0. 最后运行这句就能新建一个对应的表了
    ```
    php bin/magento setup:upgrade
    ```

- Magento的 模型系统 分为三部分 - 模型 资源模型 集合
- 模型是一个抽象的对象
- 资源模型会对应数据库里的表，模型的增删查改通过资源模型进行，例如 资源模型->save(模型)
- 集合就是模型的集合，一些查询操作也是在集合里进行

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

参考 https://devdocs.magento.com/guides/v2.4/extension-dev-guide/cli-cmds/cli-howto.html

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

参考 https://devdocs.magento.com/guides/v2.4/graphql/index.html

## 新建索引器

### magento 索引的运行原理

### 新建索引的步骤

0. 在模块目录 etc 新建 inderx.xml
    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Indexer/etc/indexer.xsd">
        <indexer id="test_indexer" 
            view_id="test_indexer"
            class="Vendor\Extension\Model\Indexer\Test"
            >
            <title translate="true">test_indexer</title>
            <description translate="true">Test Indexer</description>
        </indexer>
    </config>
    ```

0. 在模块目录 etc 新建 mview.xml
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:noNamespaceSchemaLocation="urn:magento:framework:Mview/etc/mview.xsd">
        <view id="test_indexer"
            class="Vendor\Extension\Model\Indexer\Test"
            group="indexer" >
            <subscriptions>
                <table name="sales_order" entity_column="entity_id"/>
            </subscriptions>
        </view>
    </config>
    ```
    - view 节点的 id 对应 indexer.xml 里 indexer 节点的 view_id
    - view 节点的 class 和 indexer.xml 里 indexer 节点的 class 是一致的
    - subscriptions 是传递给 indexer class 的参数，是某一个表的某一列，可以是多个表
    - mview 可能是 materialize view 的缩写

0. 在模块目录 model/indexer 新建 TestIndexer.php
    ```php
    <?php
    namespace Vendor\Extension\Model\Indexer;

    class Test implements \Magento\Framework\Indexer\ActionInterface, \Magento\Framework\Mview\ActionInterface
    {
        /**
        * @inheritdoc
        */
        public function executeFull()
        {
            $this->reindex();
        }

        /**
        * @inheritdoc
        */
        public function executeList(array $ids)
        {
            $this->execute($ids);
        }

        /**
        * @inheritdoc
        */
        public function executeRow($id)
        {
            $this->execute([$id]);
        }

        /**
        * @inheritdoc
        */
        public function execute($ids)
        {
            $this->reindex($ids);
        }

        /**
        * @param int[] $ids
        * @return void
        */
        protected function reindex($ids = null)
        {
            if ($ids === null) { // 更新全部索引

            } else { // 根据传入的 id 更新索引

            }
        }
    }
    ```

0. 运行这句命令重建索引
    ```
    php bin/magento indexer:reindex test_indexer
    ```

0. 可以在后台里查看索引的状态
    ```
    后台 -> SYSTEM -> Index Management
    ```

### 相关命令

- 在命令行里重建索引
    ```
    php bin/magento indexer:reindex
    php bin/magento indexer:reindex [indexer]
    ```

- 索引器的信息，就是显示 title 和 desc
    ```
    php bin/magento indexer:info
    ```

- 索引器的状态，就是显示 Ready Reindex Processing
    ```
    php bin/magento indexer:status
    php bin/magento indexer:status [indexer]
    ```

- 索引器的模式，就是显示 Update on save 或 Update by schedule
    ```
    php bin/magento indexer:show-mode
    php bin/magento indexer:show-mode [indexer]
    php bin/magento indexer:set-mode {realtime|schedule} [indexer]
    ```

- 使特定或全部索引起失效
    ```
    php bin/magento indexer:reset
    php bin/magento indexer:reset [indexer]
    ```

- 上面的命令提及到的 [indexer] 是 inderx.xml 文件里的 indexer 节点的 id 属性

### 参考

https://devdocs.magento.com/guides/v2.4/extension-dev-guide/indexing-custom.html

http://aqrun.oicnp.com/2019/11/10/12.magento2-indexing-reindex.html

## 新建定时任务

### 新建定时任务的步骤

0. 在模块目录 etc 新建 crontab.xml
    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Cron:etc/crontab.xsd">
        <group id="default">
            <job name="order_complete_fulfillment_end_date_expire" instance="HKT\PartnerCode\Cron\Order\FulfillmentEndDateExpireCron" method="execute">
                <schedule>0 2 * * *</schedule>
            </job>
        </group>
    </config>
    ```
0. 在模块目录里新建文件夹 cron
0. 在 cron 文件夹里新建一个普通的类，并在这个类里实现一个没有参数的 execute 方法

### 任务组

在模块目录 etc 新建 cron_groups.xml
```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Cron:etc/cron_groups.xsd">
    <group id="token_expired">
        <schedule_generate_every>1</schedule_generate_every>
        <schedule_ahead_for>4</schedule_ahead_for>
        <schedule_lifetime>15</schedule_lifetime>
        <history_cleanup_every>1440</history_cleanup_every>
        <history_success_lifetime>60</history_success_lifetime>
        <history_failure_lifetime>600</history_failure_lifetime>
        <use_separate_process>1</use_separate_process>
    </group>
</config>
```

group 节点的 id 对应 crontab.xml 里 config group 的 id

### 运行定时任务

修改过 cron 和 cron_groups 需要重新编译并清空缓存才会生效
```
php bin/magento setup:di:compile
php bin/magento cache:clean
```

运行全部任务组
```
php bin/magento cron:run
```

运行 default 任务组，一般的定时任务都在 default
```
php bin/magento cron:run --group=default
```

运行 index 任务组，这是索引器的任务组，就是 by schedule 类型的索引器
```
php bin/magento cron:run --group=index
```

运行其他任务组修改 --group 参数就可以了

然后让 cron:run 一直运行就可以的了，官方文档提供了使用 crontab 的例子，默认情况下队列好像也是用 crontab 运行。
```
* * * * * php bin/magento cron:run
```

magneto 还提供了自动生成 crontab 配置的命令
```
php bin/magento cron:install # 加上 magento 的 cron ，不影响其他配置
php bin/magento cron:install --force # 加上 magento 的 cron ，清除其他配置
php bin/magento cron:remove # 移除 magento 的 cron
```

运行了 cron:install 后，可以用 crontab -l 来查看
```
crontab -l
#~ MAGENTO START c5f9e5ed71cceaabc4d4fd9b3e827a2b
* * * * * /usr/bin/php /var/www/html/magento2/bin/magento cron:run 2>&1 | grep -v "Ran jobs by schedule" >> /var/www/html/magento2/var/log/magento.cron.log
#~ MAGENTO END c5f9e5ed71cceaabc4d4fd9b3e827a2b
```

这是 crontab 配置的解释
- 2>&1 是把标准错误重定向到标准输出
- grep -v "Ran jobs by schedule" 是忽略执行成功的日志
- /var/www/html/var/log/magento.cron.log 是 cron 的日志文件

自己写 crontab 配置或用其它方式（例如 supervisor ）让 cron:run 一直运行也是可以的

### 参考

https://devdocs.magento.com/guides/v2.4/config-guide/cli/config-cli-subcommands-cron.html

https://devdocs.magento.com/guides/v2.4/config-guide/cron/custom-cron.html

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

https://devdocs.magento.com/guides/v2.4/extension-dev-guide/module-development.html

http://www.wps.team/book/magento2/

<!--
这是一个收费的文档
https://www.kancloud.cn/zouhongzhao/magento2-in-action
-->
