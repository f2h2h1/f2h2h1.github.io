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
            <job name="order_complete_fulfillment_end_date_expire" instance="Vendor\Extension\Cron\Order\FulfillmentEndDateExpireCron" method="execute">
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

## 新建一个插件 Plugins (Interceptors)

1. 新建 Plugins 类
1. 修改模块的 etc 文件夹下的 di.xml
1. 运行 php bin/magento setup:di:compile
1. 参考 https://devdocs.magento.com/guides/v2.4/extension-dev-guide/plugins.html

## 替换其它模块里的类

## 事件和观察者 (Events and Observers)

1. 在配置文件里声明一个事件
    - 在模块的 etc 文件夹下的 events.xml ，加上类似于这样的一段
        ```xml
        <?xml version="1.0"?>
        <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Event/etc/events.xsd">
            <event name="customer_save_after_data_object">
                <observer name="upgrade_order_customer_email" instance="Magento\Customer\Observer\UpgradeOrderCustomerEmailObserver"/>
                <observer name="upgrade_quote_customer_email" instance="Magento\Customer\Observer\UpgradeQuoteCustomerEmailObserver"/>
            </event>
        </config>
        ```
1. 新建一个观察者类
    - 新建的观察者类的完整类名需要和配置文件里的对应
    - 需要实现这个接口 `Magento\Framework\Event\ObserverInterface`
1. 在需要的位置触发事件，类似于这样
    ```php
    // 第一个参数是事件名；第二个参数是一个数组，用于传递参数给观察者
    // $this->_eventManager 的类型 \Magento\Framework\Event\ManagerInterface
    $this->_eventManager->dispatch(
        'admin_user_authenticate_after',
        ['username' => $username, 'password' => $password, 'user' => $this, 'result' => $result]
    );
    ```
1. 参考 https://devdocs.magento.com/guides/v2.4/extension-dev-guide/events-and-observers.html

## 新建一个后台视图

1. 视图是一个 xml 文件
    - 视图的命名是根据路由来的
    - 例如 这样的视图名 partnercode_couponquota_index.xml 对应的路由就是 partnercode/couponquota/index
    - 视图文件一般放在这几个位置
        - 后台的视图 模块/view/adminhtml/layout/视图名.xml
        - 前台的视图 模块/view/frontend/layout/视图名.xml
        - 通用的视图 模块/view/base/layout/视图名.xml
    - 这是一个视图的例子
        ```xml
        <?xml version="1.0"?>
        <page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
            <body>
                <referenceContainer name="content">
                    <block class="Magento\Backend\Block\Template" name="extension.coupon_quota.grid.container" template="Vendor_Extension::coupon_quota/index.phtml"/>
                </referenceContainer>
            </body>
        </page>
        ```
    - block 节点参数的解释
        - block 要填完整的类名，如果不是自定义的 block ，就填 \Magento\Backend\Block\Template 或 \Magento\Framework\View\Element\Template
        - name 可以随便填，但最好全局唯一
        - template 填模板的路径，是 模块名::模板的相对路径，可以参考下面的例子
            - 如果视图的绝对路径是 app\code\Vendor\Extension\view\adminhtml\layout\partnercode_couponquota_index.phtml
            - 如果模板的绝对路径是 app\code\Vendor\Extension\view\adminhtml\templates\coupon_quota\index.phtml
            - 那么在 template 里的值就填 Vendor_Extension::coupon_quota/index.phtml
1. 视图由 block 组成
    - blcok 是 php 对象
    - 自定义的 block 一般放在 模块/block 这个文件夹里
        - 后台的 block 就要继承这个类 \Magento\Backend\Block\Template
        - 前台的 block 就要继承这个类 \Magento\Framework\View\Element\Template
1. 每个 block 会有一个模板对应，也就是 phtml 后缀的文件。
    - 这是一个模板的例子
        ```php
        <?php
        /** @var \Magento\Framework\View\Element\Template $block */
        <p><?=$block->getBaseUrl()?></p>
        ```

## 在后台视图里新建一个表格

## 添加后台日志

在模块的 etc 文件夹下的 logging.xml 里加上类似这样的一段

```xml
<group name="order_retrievepayment">
    <label translate="true">Order Retrieve Payment</label>
    <expected_models>
        <expected_model class="Magento\Sales\Model\Order"></expected_model>
    </expected_models>
    <events>
        <event controller_action="adminportal_order_retrievepayment" action_alias="save" />
    </events>
</group>
```

如果是 post 请求，那么需要在 event 节点里再加一个属性 post_dispatch="postDispatchSimpleSave"
```xml
<event controller_action="adminportal_order_retrievepayment" action_alias="save" post_dispatch="postDispatchSimpleSave"/>
```

controller_action 是 模块名_控制器名_方法名
可以在这两个位置加断点，然后再运行一次请求，就知道具体的 controller_action 是什么了
```
vendor\magento\module-logging\Observer\ControllerPostdispatchObserver.php:52
vendor\magento\module-logging\Model\Processor.php:363
```

然后在后台里勾选对应的选项，按着这样的路径寻找
```
Stores
    Settings
        Configuration
            Advanced
                Admin
                    Admin Actions Logging
                        在配置文件里的 label
```

可以在后台里的这个位置查看日志
```
system -> action logs -> report
```

## 后台 acl

1. 修改在模块的 etc 文件夹下的 acl.xml
    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Acl/etc/acl.xsd">
        <acl>
            <resources>
                <resource id="Magento_Backend::admin">
                    <resource id="Magento_Sales::sales">
                        <resource id="Magento_Sales::sales_operation">
                            <resource id="Magento_Sales::sales_order">
                                <resource id="Vendor_Extension_AdminPortal::cs_portal" title="CS Portal" sortOrder="10" />
                                <resource id="Magento_Sales::create_new_order" title="Create New Order" sortOrder="20" />
                                <resource id="Magento_Sales::view_order" title="View Order" sortOrder="30" />
                                <resource id="Magento_Sales::order_actions" title="Order Actions" sortOrder="40" />
                                <resource id="Magento_Sales::go_to_archive" title="Go To Order Archive" sortOrder="50" />
                            </resource>
                        </resource>
                    </resource>
            </resources>
        </acl>
    </config>
    ```
    - resource 可以嵌套
    - resource id（模块::操作），这个 resource id 要和控制器定义的 ADMIN_RESOURCE 一致
    - 控制器里有一个常量
        ```php
        class Save extends Action
        {
            public const ADMIN_RESOURCE = 'Magento_Customer::save';
        }
        ```
1. 修改完后要清除缓存才能生效 php bin/magento cache:clean
1. 权限的调整在这个位置 System > Permissions > User Roles
1. 参考 https://devdocs.magento.com/guides/v2.4/ext-best-practices/tutorials/create-access-control-list-rule.html

## 新建一个后台菜单

1. 在模块目录下的 etc 文件里新建一个文件
    ```
    module/etc/adminhtml/menu.xml
    ```
1. 在 menu.xml 里加入一段
    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Backend:etc/menu.xsd">
        <menu>
            <add id="Silk_Test::job_head" title="Test" module="Silk_Test" sortOrder="100" parent="Magento_Backend::stores" resource="Silk_Test::job_head" />
            <add id="Silk_Test::job" title="Test" module="Silk_Test" sortOrder="20" parent="Silk_Test::job_head" action="test/job" resource="Silk_Test::job" />
        </menu>
    </config>
    ```
1. 一些参数的解释
    - parent 上级的id
    - title 菜单名称
    - id 唯一识别的id
    - action 转跳的 action ，不填这个就是菜单里的一个分类
    - resource 用于 acl 的
    - module 模块名
1. 参考 https://devdocs.magento.com/guides/v2.4/ext-best-practices/tutorials/create-access-control-list-rule.html

## 一些自定义配置

写在模块的 etc/config.xml 文件里

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Store:etc/config.xsd">
    <default>
        <general>
            <file>
                <bunch_size>1000</bunch_size>
            </file>
        </general>
    </default>
</config>
```

写在 core_config_data 表里

```sql
INSERT INTO core_config_data (`scope`,scope_id,`path`,value,updated_at) VALUES ('default',0,'general/file/bunch_size','1000', NOW());
```

上面两种写法效果是一样的，
可以这样获取配置的值
```php
/** @var \Magento\Framework\App\Config\ScopeConfigInterface */
$scopeConfig = \Magento\Framework\App\ObjectManager::getInstance()->get(Magento\Framework\App\Config\ScopeConfigInterface::class);
 $scopeConfig->getValue('general/file/bunch_size');
```

数据库的优先级会更高。

修改过配置项的值后，需要清空或刷新缓存才会生效（不论是 config.xml 的配置还是数据库里的配置）。

## 一些调试技巧

### 获取某一个对象

```php
// 从已存在的对象中获取
$logger = \Magento\Framework\App\ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
// 新建一个
$logger = \Magento\Framework\App\ObjectManager::getInstance()->create(\Psr\Log\LoggerInterface::class);
```

### 在某一个位置写日志

```php
/** @var \Psr\Log\LoggerInterface */
$logger = \Magento\Framework\App\ObjectManager::getInstance()->get('Psr\Log\LoggerInterface');
$logger->warning('=======flg debug=======', ['trace' => $a]);
$logger->warning('=======flg debug=======', ['trace' => $exception->getTrace(), 'msg' => $exception->getMessage()]);
$logger->warning('=======flg debug=======', ['trace' => debug_backtrace()];
```

### 在某一个位置通过拼接的 sql 查询数据库

```php
$conn = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Framework\App\ResourceConnection::class);
$select = $conn->select()
    ->from(['so' => $conn->getTableName('sales_order')], [
        'so.entity_id',
        'so.customer_id',
        'soi.fulfilment_end_at',
    ])
    ->joinLeft(
        ['soi' => $conn->getTableName('sales_order_item')],
        'so.entity_id=soi.order_id',
    );
$select->where("so.status = ?", \Magento\Sales\Model\Order::STATE_PROCESSING)
    ->where("soi.qty_fulfilled + soi.qty_disabled + soi.qty_markoff < soi.qty_invoiced")
    ->where("soi.fulfilment_start_at <= ? <= soi.fulfilment_end_at", time());
$result = $conn->fetchAll($select);

// 直接运行 sql 语句
$conn = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Framework\App\ResourceConnection::class);
$result = $conn->getConnection()->query('SELECT TIMEDIFF(NOW(), UTC_TIMESTAMP);')->fetchAll();
```

通过某一个模型的 collection 对象
```php
/** @var \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection */
$collection = $collectionFactory->create();
$collection->addFieldToSelect(
    '*'
)->addFieldToFilter('customer_id', $customer->getId());
```

### 输出原始的 sql 语句

```php
/** @var \Magento\Framework\DB\Select $select */
echo $select->__toString();

/** @var \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection $collection */
echo $collection->getSelect()->__toString();
echo $collection->getSelectSql(true);
```

### sql 的执行记录

加在这个文件里 app/etc/env.php 加上这段
```
'db_logger' => [
    'output' => 'file',
    'log_everything' => 1,
    'query_time_threshold' => '0.001',
    'include_stacktrace' => 0
],
```

日志会输出到这个文件里 var/debug/db.log

### sql 语句最终的执行位置

```
vendor\magento\zendframework1\library\Zend\Db\Adapter\Abstract.php query
```

### 写日志，并记录调用栈堆

```php
# region logsql
$logOpen = false;
// $logOpen = true;
$trace = debug_backtrace();
$basePath = BP . DIRECTORY_SEPARATOR;
if (!defined('DEBUG_TRACE_LOG')) {
    $logpath = $basePath . 'var' . DIRECTORY_SEPARATOR . 'log' . DIRECTORY_SEPARATOR . 'debug_trace_sql';
    if (!is_dir($logpath)) {
        mkdir($logpath, 0755, true);
    }
    define('DEBUG_TRACE_LOG', $logpath . DIRECTORY_SEPARATOR . date('ymdHis') . '.log');
    $data = [
        '_POST' => $_POST ?? null,
        '_GET' => $_GET ?? null,
        '_FILES' => $_FILES ?? null,
        '_SERVER' => $_SERVER ?? null,
        '_SESSION' => $_SESSION ?? null,
        '_input' => file_get_contents("php://input"),
        // '_stdin' => file_get_contents("php://stdin") // 这一句在命令行里会等待输入
    ];
    $msg = print_r($data, true) . '========' . PHP_EOL;
    if ($logOpen) {
        file_put_contents(
            DEBUG_TRACE_LOG,
            $msg,
            FILE_APPEND
        );
    }
}
$ignore = [ // 忽略 ObjectManager 的文件， Interceptor 的文件， Factory 的文件
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'Interception' . DIRECTORY_SEPARATOR . 'Interceptor.php',
    'generated',
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'ObjectManager' . DIRECTORY_SEPARATOR . 'Factory',
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'ObjectManager' . DIRECTORY_SEPARATOR . 'ObjectManager.php',
];
$pattern = array_map(function($item) use ($basePath) {
    return '(' . preg_quote($basePath . $item, '/') . ')';
}, $ignore);
$pattern = '/' . implode('|', $pattern) . '/im';
$max = 200;
$traceRecord = [];
// $traceRecord[] = __FILE__ . ':' . __LINE__;
for ($i = 0, $len = count($trace); $i < $max && $i < $len; $i++) {
    if (isset($trace[$i]['file'])) {
        if (!preg_match($pattern, $trace[$i]['file'])) {
            $file = $trace[$i]['file'];
            $line = $trace[$i]['line'] ?? '1';
            $class = $trace[$i]['class'] ?? '';
            $func = $trace[$i]['function'] ?? '';
            $record = $file . ':' . $line . ' ' . $class . ' ' . $func;
            $traceRecord[] = $record;
        }
    }
}
$msg = print_r([
    $sql,
    count($bind) < 1 ? null : $bind,
    $traceRecord,
], true) . '========' . PHP_EOL;
if ($logOpen) {
    $filer = [ // 通过正则表达式只记录某些语句
        // '`customer_entity`',
        // '`customer_address_entity`',
        // '`quote_address`',
        // '`salesrule`',
        // '`salesrule_coupon`',
        // '`salesrule_customer`',
        // '^SELECT'
        // 'customer_is_guest',
    ];
    $regexp = '';
    if (is_array($filer) && count($filer) > 0) {
        $filer = implode('|', $filer);
        $regexp = '/' . $filer . '/';
    }
    if (empty($regexp) || filter_var($sql, FILTER_VALIDATE_REGEXP, array("options" => array("regexp" => $regexp)))) {
        file_put_contents(
            DEBUG_TRACE_LOG,
            $msg,
            FILE_APPEND
        );
    }
}
# endregion logsql
```

这一段是硬写在这个方法里的，也可以硬写到其它方法里
```
vendor\magento\zendframework1\library\Zend\Db\Adapter\Abstract.php query
```

### 文件搜索

通过正则表达式搜索某个接口的实现类或某个对象的继承类
```
implements(?:.*)ObjectManagerInterface\n
extends(?:.*)AbstractResource\n
```

搜索时的排除选项
```
.js,.css,.md,.txt,.json,.csv,.html,.less,.phtml,**/tests,**/test,**/Test,**/setup,**/view,**/magento2-functional-testing-framework,.wsdl,**/module-signifyd,**/Block
```

```
app/code/Vendor/**/*.php
app/**/*Test.php
magento/**/*.php
```

### 通过命令行运行一些测试的代码

修改这个文件的 execute 方法，用 exit(0); 来结束
```
vendor/magento/module-indexer/Console/Command/IndexerInfoCommand.php
```

例子
```php
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $objectMamager = \Magento\Framework\App\ObjectManager::getInstance();

        /** @var \Magento\Framework\App\ResourceConnection */
        $connection = $objectMamager->get(\Magento\Framework\App\ResourceConnection::class);
        $conn = $connection->getConnection();

        /** @var \Mageplaza\SocialLogin\Model\Social */
        $social = $objectMamager->get(\Mageplaza\SocialLogin\Model\Social::class);
        $customer = $social->getCustomerByEmail('qwe@asd.com');

        /** @var \Magento\Quote\Model\QuoteFactory */
        $quoteFactory = $objectMamager->get(\Magento\Quote\Model\QuoteFactory::class);
        $quote = $quoteFactory->create();
        $quote->setCustomer($customer->getDataModel());
        $address = $quote->getShippingAddress();
        var_dump($address->getCity());

        exit(0);

        $indexers = $this->getAllIndexers();
        foreach ($indexers as $indexer) {
            $output->writeln(sprintf('%-40s %s', $indexer->getId(), $indexer->getTitle()));
        }
    }
```

运行命令
```
php bin/magento indexer:info
php -d xdebug.remote_autostart=on bin/magento indexer:info
```

通过命令行运行测试代码，可以不加载前端资源，反馈的速度更快。
修改原本的命令行是为了不运行构建的命令就能生效。
一些对象可以通过 \Magento\Framework\App\ObjectManager::getInstance()->get() 的方法获得。

### 前端的调试

- 可以这样在浏览器查看前端模块的数据
    ```js
    require('Magento_Checkout/js/model/quote');
    ```

- 通过浏览器的断点来实现前端的调试
- 一些情况下可以使用使用鼠标点击的事件作为断点，如果是火狐浏览器可以直接查看节点绑定的事件
- 忽略一些 js 文件，把这些 js 文件标记为库文件
- 使用浏览器的覆盖功能，直接在前端修改 js 代码，这样做的好处是不用运行 setup:static-content:deploy 这种命令


### 其它

sales_order 表的两个状态
- state 是 magento 内部的状态
- status 可以是二次开发时自定义的状态

遇到问题，可以先搜索一下 github 的 iusses ，同样的问题可能已经出了补丁，不用自己修改。
- 可以在这个站点里找到对应的补丁
    - https://devdocs.magento.com/quality-patches/tool.html
- 关于 Quality Patches Tool (QPT) 工具的使用
    - https://devdocs.magento.com/quality-patches/usage.html
    - https://support.magento.com/hc/en-us/articles/360047125252
    - https://support.magento.com/hc/en-us/articles/360047139492
- 也可以把下载的 patch 文件单独复制出来，然后用 cweagans/composer-patches 打补丁

从 marketplace.magento.com 下载和安装拓展
1. 登录
1. 购买
1. 获取包名和版本
1. 修改 composer.json 加上 仓库地址和帐号密码
1. 运行 composer require
1. 修改 app/etc/config.php
1. 运行 bin/magento setup:upgrade
1. 参考 https://devdocs.magento.com/extensions/install

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

github 里 magento2 的模块例子
- https://github.com/magento/magento2-samples
- sample-module-minimal 是最简单的模块例子

生成 magento 模块 https://cedcommerce.com/magento-2-module-creator/

https://devdocs.magento.com/guides/v2.4/extension-dev-guide/module-development.html

http://www.wps.team/book/magento2/

<!--
这是一个收费的文档
https://www.kancloud.cn/zouhongzhao/magento2-in-action
-->
