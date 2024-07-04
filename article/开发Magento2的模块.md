开发 Magento2 的模块
================================

- 这是在 magento2.4 上开发的
- magento2 的组件有三种
    - modules 模块
    - themes 主题
    - language packages 语言包
- 其中 主题 只包含前端代码，模块可以包含 主题 和 语言包

## 新建模块的代码

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

### 启用模块 和 刷新缓存

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
php bin/magento cache:clean 清除缓存
php bin/magento indexer:reindex 刷新全部索引
php bin/magento setup:upgrade 更新数据 Upgrades the Magento application, DB data, and schema
php bin/magento setup:di:compile 编译
php bin/magento setup:static-content:deploy -f 部署静态视图文件
php bin/magento cache:flush 刷新缓存
```

模块的代码修改后也要刷新缓存

## 目录结构

```
app
    code 模块
        metapackage 开发商
            module 模块
                Api
                Block
                Console
                Controller
                Cron
                etc
                    areaCode
                        ... 直接写在 etc 目录下的配置是全局的，写在 areaCode 文件下的配置只在对应的 areaCode 下生效
                    di.xml
                    events.xml
                    view.xml
                    cron_groups.xml
                    crontab.xml
                    logging.xml
                    module.xml
                    acl.xml
                    config.xml
                    routes.xml
                    system.xml
                    db_schema_whitelist.json
                    db_schema.xml
                    menu.xml
                    resources.xml
                    widget.xml
                    schema.graphqls
                Helper
                Model
                    Indexer
                Observer
                Plugin
                Setup
                Test
                Ui
                view
                    areaCode 区域代码 就是 frontend adminhtml 这种
                        layout
                            *.xml
                            这个目录下的 xml 文件是布局配置文件
                            这些 xml 的文件名是对应路由的，也就是和路由名称一样
                        page_layout
                            这个目录下的 xml 文件就是页面布局文件，文件名就是布局id
                        ui_component 也是放 xml 文件，但还不知道有什么用
                            这里的 xml 文件可以在 layout 里引用
                        templates
                            *.phtml
                        web
                            css
                            fonts
                            images
                            js
                                action
                                model
                                view
                                    这个文件夹下的 js 就是前端的 component ，继承自 magento2 的 uiComponent
                                    这个文件夹下的 js 应该实和 template 里的 html 文件一一对应的，
                                    但也可以在 js 里修改模板的路径
                                *.js 直接放在 js 目录下的通常是 jq 的 widget
                            template
                                这里放的是 html 文件
                                这些 html 文件通常是 ko 的模板
                                component 通过 ajax 获取这些模板
                        layouts.xml 用于声明有哪些布局
                        requirejs-config.js 用来声明 requirejs 的配置，例如 js 的加载顺序
                i18n
                其它的文件夹
                    ViewModel
                    CustomerData
                composer.json
                registration.php
    design 主题
        areaCode 区域代码， frontend 是前台， adminhtml 是后台
            开发商
                主题 -> 优先级是高于 模块 里的文件
                    开发商_模块名 -> 和 模块里的 view 文件夹是一样的
                    etc
                    view
                    web
                        css
                        fonts
                        images
                        js
                        template
                    media
                    composer.json
                    registration.php
                    theme.xml
    etc 全局配置
    i18n 语言包
bin
    magento
dev
generated
lib
    internal
    web
phpserver
pub
    static
    cron.php
    get.php
    health_check.php
    index.php
    static.php
setup
var
vendor
composer.json
```

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
    - setup 脚本将会被淘汰， https://developer.adobe.com/commerce/php/development/components/declarative-schema/configuration/
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

- Magento的 模型系统 分为四部分 - 模型(Model) 资源模型(ResourceModel) 集合(Collection) 工厂(Factory)
- 模型是一个抽象的对象
- 资源模型会对应数据库里的表，模型的增删查改通过资源模型进行，例如 资源模型->save(模型)
- 集合就是模型的集合，一些查询操作也是在集合里进行
- 工厂用于创建模型或集合，工厂类一般是由 magento2 自动生成的，用编译的命令 php bin/magento setup:di:compile

## EAV

EAV（实体 - 属性 - 值）
entity attribute value

保存 eav 属性的表
```
eav_attribute 保存 eav 的属性
eav_entity_type 保存 eav 的类

输出某个 eav 类的全部 eav 属性
SELECT * FROM eav_attribute
WHERE entity_type_id  = (
    SELECT entity_type_id FROM eav_entity_type
    WHERE entity_table = 'catalog_product_entity' LIMIT 1
)
```

eav 的五种属性
```
varchar
int
text
datetime
decimal
```

常见的 eav 类，可以在这个表里看到 eav_entity_type
```
catalog_category_entity
catalog_product_entity
customer_entity
customer_address_entity
```

eav 的值保存在这类表中
```
类名_entity
类名_varchar
类名_int
类名_text
类名_datetime
类名_decimal
```

一次输出 eav 对象全部属性的 sql ，用于一般的 eav 对象
```php
$entityId = '3893';
$entityTabel = 'customer_entity';
$eavTable = [
    'varchar',
    'int',
    'text',
    'datetime',
    'decimal',
];

$eavTpl = <<<'EOF'
(SELECT `t`.`value_id`,
         `t`.`value`,
         `t`.`attribute_id`,
         `a`.`attribute_code`,
         '%s' as `type`
FROM `%s` AS `t`
INNER JOIN `eav_attribute` AS `a`
    ON a.attribute_id = t.attribute_id
WHERE (entity_id = @entity_id))
EOF;
$eavSql = join('UNION ALL', array_map(function($item) use ($eavTpl, $entityTabel) {
    return sprintf($eavTpl, $item, $entityTabel . '_' . $item);
}, $eavTable));

$entityTpl = <<<'EOF'
select
    *,
    @entity_id := entity_id
from %s
where entity_id = %s
limit 1;
EOF;
$entitySql = sprintf($entityTpl, $entityTabel, $entityId);

$retSql = $entitySql . PHP_EOL . $eavSql . ';';

echo $retSql;
```

一次输出 eav 对象全部属性的 sql ，用于 product 和 category 的
```php
$entityId = '3893';
$entityTabel = 'catalog_product_entity'; // catalog_category_entity
$eavTable = [
    'varchar',
    'int',
    'text',
    'datetime',
    'decimal',
];

$eavTpl = <<<'EOF'
(SELECT `t`.`value_id`,
         `t`.`value`,
         `t`.`store_id`,
         `t`.`attribute_id`,
         `a`.`attribute_code`,
         '%s' as `type`
FROM `%s` AS `t`
INNER JOIN `eav_attribute` AS `a`
    ON a.attribute_id = t.attribute_id
WHERE (row_id = @row_id))
EOF;
$eavSql = join('UNION ALL', array_map(function($item) use ($eavTpl, $entityTabel) {
    return sprintf($eavTpl, $item, $entityTabel . '_' . $item);
}, $eavTable));

$entityTpl = <<<'EOF'
select
    *,
    @row_id := row_id
from %s
where entity_id = %s and UNIX_TIMESTAMP(NOW()) >= created_in AND UNIX_TIMESTAMP(NOW()) < updated_in
order by row_id desc;
EOF;
$entitySql = sprintf($entityTpl, $entityTabel, $entityId);

$retSql = $entitySql . PHP_EOL . $eavSql . ';';

echo $retSql;
```

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

参考 https://developer.adobe.com/commerce/php/development/cli-commands/custom/

## 新建 rest 的接口

新建 etc\webapi.xml
```xml
<route url="/V1/gtm-layer/mine/quote-item-data" method="POST">
    <service class="Vendor\Extension\Api\GtmCartRepositoryInterface" method="getQuoteItemData"/>
    <resources>
        <resource ref="self" />
    </resources>
    <data>
        <parameter name="itemId">%item_id%</parameter>
        <parameter name="qty">%qty%</parameter>
    </data>
</route>
```
- data 标签里的参数是可以不要的
- `<resource ref="self" />` 需要登录才能调用
- `<resource ref="anonymous" />` 不用登录也能调用

新建 app\code\Vendor\Extension\Api\GtmCartRepositoryInterface.php
```php
<?php
namespace Vendor\Extension\Api;

interface GtmCartRepositoryInterface
{
    /**
     * @param string $itemId
     * @param int $qty
     * @return array
     * @throws \Magento\Framework\Webapi\Exception
     */
    public function getQuoteItemData($itemId, $qty = 0);
}
```

新建 app\code\Vendor\Extension\Model\GtmCartRepository.php
```php
<?php
namespace Vendor\Extension\Model;

class GtmCartRepository implements GtmCartRepositoryInterface
{
    public function getQuoteItemData($itemId, $qty = 0)
    {
        return [];
    }
}
```

如果是新模块则需要运行一次 setup:upgrade 才能生效。
如果是旧模块则需要运行一次 cache:clear 就能生效。

调用的例子
```shell
curl -X POST https://dev.magento.com/rest/en_US/V1/gtm-layer/mine/quote-item-data -k -H "Content-Type: application/json" -d '{"productIds":["3893"]}'

curl -X POST https://dev.magento.com/rest/en_US/V1/gtm-layer/mine/quote-item-data -k -H "Content-Type: application/json" -d '{"itemId":3893,qty:1}'
```

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
            $output['customer_id'] = 123;
            $output['type'] = 'type';
            $output['type_id'] = 321;
        
            return $output ;
        }
    }
    ```
    - $output 的内容需要和 schema.graphqls 里定义的返回参数一致

0. 运行这句命令 `php bin/magento setup:upgrade` 更新数据
    - 在开发模式下 `php bin/magento c:c` 就能使 schema.graphqls 的修改生效

0. 用这句 curl 命令尝试请求
    ```
    graphqlquery=$(cat <<- EOF
    query {
        CustomGraphql(username: 123, password: "asd", websiteId: 321) {
            customer_id
            type
            type_id
        }
    }
    EOF
    );
    graphqlquery=$(echo -n $graphqlquery | php -r '$data=file_get_contents("php://stdin");print(json_encode($data));');
    graphqlquery='{"query":'$graphqlquery',"variables":{},"operationName":null}';
    curl 'http://localhost-magento/graphql' \
    -H 'accept: application/json' \
    -H 'content-type: application/json' \
    --data-raw "$graphqlquery" \
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
                "type_id": 321
            }
        }
    }
    ```

0. 可以用这决 curl 命令来查看当前 magento 项目的 graphql 文档
    ```
    graphqlquery=$(cat <<- EOF
    query IntrospectionQuery {
        __schema {
            queryType {
                name
            }
            mutationType {
                name
            }
            subscriptionType {
                name
            }
            types {
                ...FullType
            }
            directives {
                name
                description
                locations
                args {
                    ...InputValue
                }
            }
        }
    }
    fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
            name
            description
            args {
                ...InputValue
            }
            type {
                ...TypeRef
            }
            isDeprecated
            deprecationReason
        }
        inputFields {
            ...InputValue
        }
        interfaces {
            ...TypeRef
        }
        enumValues(includeDeprecated: true) {
            name
            description
            isDeprecated
            deprecationReason
        }
        possibleTypes {
            ...TypeRef
        }
    }
    fragment InputValue on __InputValue {
        name
        description
        type {
            ...TypeRef
        }
        defaultValue
    }
    fragment TypeRef on __Type {
        kind
        name
        ofType {
            kind
            name
            ofType {
                kind
                name
                ofType {
                    kind
                    name
                    ofType {
                        kind
                        name
                        ofType {
                            kind
                            name
                            ofType {
                                kind
                                name
                                ofType {
                                    kind
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    EOF
    );
    graphqlquery=$(echo -n $graphqlquery | php -r '$data=file_get_contents("php://stdin");print(json_encode($data));');
    graphqlquery='{"query":'$graphqlquery',"variables":{},"operationName":null}';
    curl 'http://localhost-magento/graphql' \
    -H 'accept: application/json' \
    -H 'content-type: application/json' \
    --data-raw "$graphqlquery" \
    --compressed \
    --insecure -s -k
    ```

0. graphql 里只有这个文件夹下的异常能显示出来，其它的异常都是显示 server error
    - vendor\magento\framework\GraphQl\Exception
0. 如果要自定义异常，最好继承 grapqhl 里原本的异常，或实现这个接口 \GraphQL\Error\ClientAware
    - 关键还是这个接口 \GraphQL\Error\ClientAware
0. graphql 接口大概的执行位置
    - vendor\magento\module-graph-ql\Controller\GraphQl.php
    - vendor\webonyx\graphql-php\src\Executor\ReferenceExecutor.php doExecute
    - vendor\webonyx\graphql-php\src\Executor\ReferenceExecutor.php executeOperation
    - vendor\webonyx\graphql-php\src\Executor\ReferenceExecutor.php resolveField
    - vendor\webonyx\graphql-php\src\Executor\ReferenceExecutor.php resolveOrError

<!--

用 get 的方式，发送的 graphql 请求，get的话可以让 http 缓存，
graphqlquery=$(cat <<- EOF
query {
  customer {
    email
    firstname
    lastname
  }
}
EOF
);
graphqlquery=$(echo -n $graphqlquery | php -r 'print(http_build_query(["query"=>file_get_contents("php://stdin")]));');
curl 'http://localhost-magento/graphql?'$graphqlquery \
    -H 'accept: application/json' \
    -H 'content-type: application/json' \
    --data-raw "$graphqlquery" \
    --compressed \
    --insecure -s -k

graphql 要留意输入的类型，输出的类型
在哪个位置检测输入类型
在哪个位置执行 resolve
在哪个位置检测输出类型

如何在原有的接口中 增加 修改 或 删除 字段？
直接修改 schema.graphqls 文件就可以了， magento 会把全部 schema.graphqls 合并，类似于合并 xml 文件一样
https://devdocs.magento.com/guides/v2.3/graphql/develop/extend-existing-schema.html

可以使用这样的方式登录获取 graphql 的 token ，要注意修改帐号密码
curl 'https://magento2.localhost.com/graphql' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
  --cookie "XDEBUG_SESSION=vscode" \
  --data-raw $'{"operationName":"Login","variables":{"email":"test.test.test@test.com","password":"passw!1234"},"query":"mutation Login($email: String\u0021, $password: String\u0021) {\\n  generateCustomerToken(email: $email, password: $password) {\\n    token\\n    __typename\\n  }\\n}\\n"}' \
  --compressed -k --no-progress-meter

在数据库里运行这三句，就能直接生成 token 了
SELECT
    @customer_id := entity_id
FROM `customer_entity`
WHERE (email = 'test.test.test@test.com');

INSERT INTO oauth_token
(consumer_id,admin_id,customer_id,`type`,token,secret,verifier,callback_url,revoked,authorized,user_type,created_at,partner_id)
VALUES
(NULL,NULL,@customer_id,'access',REPLACE(UUID(), '-', ''),REPLACE(UUID(), '-', ''),NULL,'',0,0,3,now(),NULL);

select *
from oauth_token
where customer_id = @customer_id
order by created_at desc
limit 1;

可以用这句curl验证生成的token
curl 'https://magento2.localhost.com/graphql?query=%20%20%20%20%20%20%20%20query%20\{%20%20%20%20%20%20%20%20%20%20customer%20\{%20%20%20%20%20%20%20%20%20%20%20%20email%20%20%20%20%20%20%20%20%20%20%20%20firstname%20%20%20%20%20%20%20%20%20%20%20%20lastname%20%20%20%20%20%20%20%20%20%20\}%20%20%20%20%20%20%20%20\}%20%20%20%20%20%20%20%20' \
  -H 'authorization: Bearer 10ed30a93cdc11ee9d3b0e4ba1986f92' \
  -H 'accept: */*' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  --cookie "XDEBUG_SESSION=vscode" \
  --compressed -k --no-progress-meter

可以用 json_pp 来格式化 curl 的输出，前提是 curl 里的输出是 json 字符串
像这样
curl 'https://magento2.localhost.com/graphql?query=%20%20%20%20%20%20%20%20query%20\{%20%20%20%20%20%20%20%20%20%20customer%20\{%20%20%20%20%20%20%20%20%20%20%20%20email%20%20%20%20%20%20%20%20%20%20%20%20firstname%20%20%20%20%20%20%20%20%20%20%20%20lastname%20%20%20%20%20%20%20%20%20%20\}%20%20%20%20%20%20%20%20\}%20%20%20%20%20%20%20%20' \
  -H 'authorization: Bearer 10ed30a93cdc11ee9d3b0e4ba1986f92' \
  -H 'accept: */*' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  --cookie "XDEBUG_SESSION=vscode" \
  --compressed -k --no-progress-meter | json_pp

如果在网页端已经登录的前提下，可以在网页的 console 里用这样的代码发送 graphql 请求
这一种是查询
(function(){
    require(['jquery'], function($) {
        const query = `
        query {
          customer {
            email
            firstname
            lastname
          }
        }
        `;
        // 改用 post 效果是一样的
        $.ajax({
            url: `${window.location.origin}/graphql`,
            type: "POST",
            contentType: "application/json",
            data: `{"query":${JSON.stringify(query)}}`,
            success: function(data){
                console.log(data);
            }
        });
        // $.ajax({
        //     url: `${window.location.origin}/graphql`,
        //     type: "GET",
        //     contentType: "application/json",
        //     data: `query=`+query,
        //     success: function(data){
        //         console.log(data);
        //     }
        // });
    });
})();

这一种是修改
(function(){
const graphqlEndpoint = `${window.location.origin}/graphql`;
const query = `
mutation CheckoutScreenReorder {
  reorder(increment_id: "123456789") {
    cartID: cart_id
  }
}
`;
return fetch(`${graphqlEndpoint}`, {
    headers: {
        'Content-Type': 'application/json',
        store: 'en_US'
    },
    method: 'POST',
    body: `{"query":${JSON.stringify(query)}}`,
}).then(response => {
    console.log(response);
    if (response.status == 200) {
        console.log(response.text());
    } else {
        console.log(response.status);
    }
});
})();


graphqlquery=$(cat <<- EOF
query {
  customer {
    email
    firstname
    lastname
  }
}
EOF
);
graphqlquery=$(echo -n $graphqlquery | php -r 'print(http_build_query(["query"=>file_get_contents("php://stdin")]));');
curl -v -L -k 'https://magento2.localhost.com/graphql?'$graphqlquery \
    -H 'authorization: Bearer 214dee33a45a11eeae4800e04c947949' \
    -H 'accept: */*' \
    -H 'cache-control: no-cache' \
    -H 'accept: application/json' \
    --cookie "XDEBUG_SESSION=vscode" \
    --resolve magento2.localhost.com:80:127.0.0.1 \
    --resolve magento2.localhost.com:443:127.0.0.1 \
    --no-progress-meter


-->

浏览器可以安装这个拓展 https://github.com/altair-graphql/altair

这是 graphql 的中文文档 https://graphql.cn/

参考 https://devdocs.magento.com/guides/v2.4/graphql/index.html

## 新建索引器

### magento 索引的运行原理

magento 的索引器有两种类型
- update on save
    - 原始数据更新时会直接调用 indexer 的对象，更新缓存
- update by schedule
    - 原始数据更新会通过触发器更新 view_id_cl 表，然后再通过定时任务来更新缓存
    - view_id_cl 表和触发器都是 magento 自动生成的
        - 触发器会根据表名成三个，只要表有更新，触发器就会运行
            - trg_表名_after_insert
            - trg_表名_after_update
            - trg_表名_after_delete
        - 触发器运行时会更新 view_id_cl 表
        - 这些触发器里可能会关联多个索引器，也就是说 indexer 的触发器是共用的
    - view_id_cl 的表的 view_id 就是 mview.xml 中的 id
    - view_id_cl 这类表只有两个字段 version_id 和 entity_id
    - version_id 是自动递增的
        - 只要和 mview_state 的 version_id 不一致，就会被认为时有索引需要更新

两个和索引器相关的表
- indexer_state
    - state_id
    - indexer_id
    - status
        - valid 有效的
        - invalid 无效的，原数据有修改，索引应该更新
        - working 工作中
    - updated
    - hash_config
- mview_state
    - state_id
    - view_id
    - mode
        - enabled 启用，表示这个索引器的类型是 update on schedule
        - disabled 禁用，表示这个索引器的类型是 update on save
    - status
        - idle 空闲的
        - suspended 暂停
        - working 工作中
    - updated
    - version_id


<!--

    还要留意这两个方法 
    vendor\magento\framework\Model\AbstractModel.php
        afterSave
        afterCommitCallback

    indexer 的 callblack 是在模型的 save 方法执行时加上去的
    然后在 save 方法中会执行 commit 方法
    然后就是在 afterCommit 中执行 callback
    vendor\magento\framework\Model\ResourceModel\AbstractResource.php commit 这个方法里本身也会调用回调函数，但似乎没有什么作用
        vendor\magento\framework\Model\ExecuteCommitCallbacks.php afterCommit
            然后就是 indexer 的 reindex 方法
            callback 的方法不单有 indexer

        callblack 用类似这样的代码来执行 indexer
        /** @var \Magento\Framework\Indexer\IndexerRegistry */
        $this->indexerRegistry->get($indexer_id)->reindexRow($model->getId());
            vendor\magento\module-indexer\Model\Indexer.php reindexRow
                具体的 indexer 的 executeRow 方法


    几个关键的对象都是显式调用的。。。
    vendor\magento\module-catalog\Model\Product.php afterSave
    $this->_getResource()->addCommitCallback([$this, 'reindex']);

    但我还没找到通用的方法。。。
    又或者有没有一种可能，只有那关键的几个对象能用索引器。。。

vendor\magento\framework\Model\ExecuteCommitCallbacks.php afterCommit 这个是拦截器
    vendor\magento\framework\Model\AbstractModel.php afterCommitCallback 这个是回调函数

好像和这两个包有关，但这两个包不是来自magento官方
amasty/mostviewed
amasty/ogrid


vendor\magento\framework\EntityManager\Observer\AfterEntitySave.php
afterCommitCallback

我自己写的 indexer 好像也没有在 on save 时更新
实际上整个项目只有三个自定义的索引器，其中两个还是我写的，而且也写得不好。

第一个不是我写的自定义索引器也没有生效

会不会是因为 indexer.xml 里没有设置 saveHandler ，虽然文档里没有明确说明要设置这个
但 catalog_product_attribute 也没有设置 saveHandler ，同样也有效果

会不会是因为我从命令行运行所以没执行到索引？
好像也不是，我从web运行一次也同样没有效果

magento2 的 on save 索引似乎确实无法开箱即用，始终要写几行代码，类似这样，加在模型类里的 afterSave 方法里
        /** @var \Magento\Framework\Indexer\IndexerRegistry */
        $indexer = $this->indexerRegistry->get(static::INDEXER_ID);
        if (!$indexer->isScheduled()) {
            $indexer->reindexRow($model->getId());
        }
https://github.com/magento/devdocs/issues/1596
https://github.com/magento/magento2/issues/8866


手动更新
    admin
    命令行
自动更新
    on save
    update by schedule

magento2 的 indexer 看上去更像是数据库中的物化视图，只是mysql不支持物化视图（Materialized view）

-->

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
    - mview 是 materialized view 的缩写

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

### 在定时任务中运行的 indexer

多数情况下 indexer 是以定时任务的形式运行的
（虽然也可以使用其它方式运行，但文档里的里的例子就是用定时任务的）
```
* * * * * php bin/magento cron:run --group=index
```

定时任务的配置文件在这个位置
```
vendor\magento\module-indexer\etc\crontab.xml
```

这个 crontab.xml 文件里有三个任务
- indexer_reindex_all_invalid
    - 重建索引，类似于 php bin/magento indexer:reindex 的效果
- indexer_update_all_views
    - 更新索引，根据 view_id_cl 表中的记录，更新索引
- indexer_clean_all_changelogs
    - 删除 view_id_cl 表中过时的记录

因为是定时任务，所以可以用这样的 sql 观察到 indexer 的运行记录
```sql
SELECT * from cron_schedule
WHERE job_code in ('indexer_reindex_all_invalid', 'indexer_update_all_views', 'indexer_clean_all_changelogs')
order by schedule_id desc;
```

也可以往 cron_schedule 插入记录，让定时任务中的 indexer 尽快运行。定时任务有可能会 miss ，所以可以多插入几条记录。
```sql
INSERT INTO cron_schedule (job_code,status,created_at,scheduled_at)
VALUES
('indexer_update_all_views','pending',CURRENT_TIMESTAMP(), date_add(CURRENT_TIMESTAMP(), interval 1 minute)),
('indexer_update_all_views','pending',CURRENT_TIMESTAMP(), date_add(CURRENT_TIMESTAMP(), interval 2 minute)),
('indexer_update_all_views','pending',CURRENT_TIMESTAMP(), date_add(CURRENT_TIMESTAMP(), interval 3 minute)),
('indexer_reindex_all_invalid','pending',CURRENT_TIMESTAMP(), date_add(CURRENT_TIMESTAMP(), interval 5 minute)),
('indexer_clean_all_changelogs','pending',CURRENT_TIMESTAMP(), date_add(CURRENT_TIMESTAMP(), interval 10 minute));
```

可以用这样的 sql 来观察 indexer 的状态。直接运行 sql 语句比运行 命令行会快不少
```sql
select * from indexer_state where indexer_id = 'example_indexer';
select * from mview_state where view_id = 'example_indexer';
select * from view_id_cl; -- view_id 就是 mview.xml 中的 id
```

笔者在本地开发时，会用这样的命令确保定时任务一直在运行，
然后再往 cron_schedule 插入记录，让对应的 indexer 尽快执行。
```bash
php -r "while(true){exec('php bin/magento cron:run --group=index');sleep(3);}"
```

### 参考

https://developer.adobe.com/commerce/php/development/components/indexing/custom-indexer/

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

在后台的这个位置可以查看任务组
```
Stores > Settings > Configuration > ADVANCED > System -> Cron (Scheduled Tasks)
```

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

不同的 group 可以使用不同的 cron 表达式
```
* * * * * /usr/bin/php /var/www/html/magento2/bin/magento cron:run --group=default 2>&1 | grep -v "Ran jobs by schedule" >> /var/www/html/magento2/var/log/magento.cron.log
*/10 * * * * /usr/bin/php /var/www/html/magento2/bin/magento cron:run --group=index 2>&1 | grep -v "Ran jobs by schedule" >> /var/www/html/magento2/var/log/magento.cron.log
```

这是 crontab 配置的解释
- 2>&1 是把标准错误重定向到标准输出
- grep -v "Ran jobs by schedule" 是忽略执行成功的日志
- /var/www/html/var/log/magento.cron.log 是 cron 的日志文件

自己写 crontab 配置或用其它方式（例如 supervisor ）让 cron:run 一直运行也是可以的了

<!-- 
模块名 magento/module-cron
模型文件 vendor\magento\module-cron\Model\Schedule.php
定时任务可能的状态
pending 计划中
running 运行中
success 运行成功
missed 错过
error 运行失败

插入的语句如果执行的时间太迟，可能会被删掉？


输入 magento cron:run 命令两三次。
第一次输入命令时，它会将作业排入队列；随后，将运行cron作业。 必须输入命令 至少 两次。

cron 命令的这个参数应该是用来标识 父进程 和 子进程 的
bootstrap=

vendor\magento\module-cron\Console\Command\CronCommand.php
vendor\magento\framework\App\Cron.php
vendor\magento\module-cron\Observer\ProcessCronQueueObserver.php
父进程为一个组开启一个进程
子进程中
    先设置一个锁
    获得锁后
        清除过期的任务
            删除 cron_schedule 表的记录
        新建任务
            在 cron_schedule 表中插入新记录
    执行任务
        根据 cron_schedule 表中的记录执行任务



在数据库里修改 cron 的 cron expr
path
crontab/group_id/jobs/job_id/schedule/cron_expr
这一段其实是自定义的
这一段需要现在 crontab.xml 里配置
通常这一段会覆盖 xml 文件中 schedule 的值
这个修改好像生效了。。。
crontab/reports/jobs/promotion_group_attribute/schedule/cron_expr
这个可能是要重新部署才能生效，即使是改数据库，可能是一次缓存了


/** @var \Magento\Cron\Model\Config\Data */
$configData = $objectMamager->get(\Magento\Cron\Model\Config\Data::class);
var_dump($configData->getJobs());


SELECT * from cron_schedule order by schedule_id desc limit 10;
SELECT * from cron_schedule WHERE job_code in ('promotion_group_attribute') order by schedule_id desc;
INSERT INTO cron_schedule (job_code,status,created_at,scheduled_at) VALUES ('promotion_group_attribute','pending',CURRENT_TIMESTAMP(), date_add(CURRENT_TIMESTAMP(), interval 1 minute));
INSERT INTO cron_schedule (job_code,status,created_at,scheduled_at) VALUES ('promotion_group_attribute','pending',CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());


UPDATE cron_schedule
	SET
        scheduled_at=DATE_FORMAT('2023-05-18T16:51:00+08:00', "%Y-%m-%d %H:%i")
	WHERE schedule_id=54999675;


DELETE FROM cron_schedule
	WHERE schedule_id=55149474;



INSERT INTO core_config_data (`scope`, scope_id, `path`, value, updated_at) VALUES ('default', 0, 'crontab/reports/jobs/promotion_group_attribute/schedule/cron_expr', '0 13,17 * * *', CURRENT_TIMESTAMP());

SELECT x.* FROM core_config_data x
WHERE `path` LIKE 'crontab%'
ORDER BY x.config_id DESC

DELETE FROM core_config_data
	WHERE config_id=2578;


直接在命令行里运行 cronjob ，要在项目的根目录里运行，数据库里就没有运行记录了
php -a <<- 'EOF'
try {
require __DIR__ . '/app/bootstrap.php';
$bootstrap = \Magento\Framework\App\Bootstrap::create(BP, $_SERVER);
$objectManager = $bootstrap->getObjectManager();
$state = $objectManager->get(\Magento\Framework\App\State::class);
$state->setAreaCode(\Magento\Framework\App\Area::AREA_CRONTAB);
$instance = \Magento\Sales\Cron\CleanExpiredQuotes::class;
$method = 'execute';
$cronJob = $objectManager->get($instance);
call_user_func([$cronJob, $method]);
} catch (\Throwable $e) {
    echo $e->getFile() . ':' . $e->getLine() . PHP_EOL;
    echo $e->getMessage() . PHP_EOL . $e->getTraceAsString();
}
EOF


-->

## 队列

<!--

php bin/magento queue:consumers:start sales_rule.codegenerator
php bin/magento queue:consumers:list

php bin/magento queue:consumers:start [--max-messages=<value>] [--batch-size=<value>] [--single-thread] [--area-code=<value>] <consumer_name>

https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/message-queues/manage-message-queues.html

无法查看定时任务的组？


consumers
消费者


vendor\magento\module-message-queue\etc\crontab.xml
vendor\magento\module-message-queue\etc\cron_groups.xml

这是通过 cron 来运行 队列
php bin/magento cron:run --group=consumers

-->

## 新建一个插件 Plugins (Interceptors)

1. 新建 Plugins 类
    - 通常在模块里的 Plugins 文件下新建
    - 拦截器就是一个普通的类
    - 拦截器的方法就是被拦截的方法前面加上 before around after 这三个关键词
        - 拦截器的方法名始终以小驼峰命名
    - 在原本的类里，只有 public 方法才可以被拦截
1. 修改模块的 etc 文件夹下的 di.xml
    - 例子
        ```xml
        <config>
            <type name="需要拦截的类名（要填完整的类名）">
                <plugin name="拦截器名称" type="拦截器的类名（要填完整的类名）" sortOrder="排序" disabled="false" />
            </type>
        </config>
        ```
    - 如果要禁用拦截器 disabled 填 true 就可以了
    - sortOrder 和 disabled 都不是必填的
    - sortOrder 是升序排序
    - sortOrder 未指定时会按加载顺序排序，先加载的在前面执行
1. 运行 php bin/magento setup:di:compile 或 php bin/magento setup:upgrade
    1. 拦截器必须通过编译才能生效
    1. 编译后的拦截器会在 generate 文件夹里生成一个对应的 Interceptor 类
    1. 在开发者模式时可以不通过编译，拦截器在运行时生成
    1. 生成的 Interceptor 类，通过 use 的方式继承 \Magento\Framework\Interception\Interceptor
    1. \Magento\Framework\Interception\Interceptor 的 ___callPlugins 方法是拦截器实现的核心
1. 拦截器的运行顺序
    1. before -> around -> after
    1. 会先统一执行完一类拦截器再执行下一类拦截器
    1. 拦截器的顺序，就是配置文件里的那个 sortOrder 参数是用在同类拦截器的排序的
1. 三种方法的入参和出参
    - before
        - 入参
            - 原本的对象 $subject
            - 原本的入参（这是一个可变长参数 ...array_values($arguments)）
        - 出参
            - null 或 一个数组
            - 如果是 null 那么 原本的入参不会变
            - 如果是一个数组，那么数组会替代原本的入参
    - around
        - 入参
            - 原本的对象 $subject
            - 匿名函数proceed(拦截器运行的匿名方法)
                - proceed 在拦截器的around方法里运行
            - 原本的入参（这是一个可变长参数 ...array_values($arguments)）
        - 出参
            - 和执行结果类型一样的$result
    - after
        - 入参
            - 原本的对象 $subject
            - 执行的结果 $result
            - 原本的入参（这是一个可变长参数 ...array_values($arguments)）
        - 出参
            - 和执行结果类型一样的 $result

1. 参考 https://developer.adobe.com/commerce/php/development/components/plugins/

## 替换其它模块里的类

<!--

di.xml

<preference for="Magento\Banner\Model\Banner\Validator" type="LocalDev\HomeBanner\Model\Banner\Validator" />

<preference for=“原始类或接口” type=“新的类” />

preference 的优点是可以方便地修改或扩展已有的类或接口
preference 的缺点是可能会导致类之间的冲突，因为一次只能有一个 preference 生效，除非你手动地让它们链式地继承

-->

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
1. 参考 https://developer.adobe.com/commerce/php/development/components/events-and-observers/

<!--

从这个方法来看，每个前台页面都能触发一个对应的事件
vendor\magento\framework\App\FrontController.php dispatchPreDispatchEvents
两个参数 action对象 和 request对象
据说如果有 varnish 的缓存则不会触发这类事件

-->

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

日志会插入到这个表里 magento_logging_event

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
1. 参考 https://developer.adobe.com/commerce/php/best-practices/tutorials/create-access-control-list-rule/

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
1. 参考 https://developer.adobe.com/commerce/php/best-practices/tutorials/create-access-control-list-rule/

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

还可以用命令行来修改配置，这种修改会保存在数据库里
https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/cli/configuration-management/set-configuration-values.html
```
# 设置某个配置
php bin/magento config:set path value
# 查看某个配置
php bin/magento config:show path
```

数据库的优先级会更高。

修改过配置项的值后，需要清空或刷新缓存才会生效（不论是 config.xml 的配置还是数据库里的配置）。

### 在后台加上配置项

通常是写在模块的 etc/adminhtml/system.xml 文件里

后台的配置也是用上面额方法获取配置的值，后台配置的默认值也是写在 etc/config.xml 文件里

一个例子
```xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Config:etc/system_file.xsd">
    <system>
        <section id="test_section" showInDefault="1" showInWebsite="1" showInStore="1">
            <group id="test_group" translate="label" showInDefault="1" showInWebsite="1" showInStore="1" sortOrder="11">
                <label>test group</label>
                <field id="test_field" translate="label" type="textarea" sortOrder="1" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>test field</label>
                    <comment>test comment</comment>
                </field>
            </group>
        </section>
    </system>
</config>

```

参考
https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/files/config-reference-systemxml.html

<!-- select * from core_config_data where path like '%promo/promotion_group/email_address%' limit 10 -->

<!--

block -> ui_component -> system.xml

ui_component的文档
https://developer.adobe.com/commerce/frontend-core/ui-components/

后台配置的文档
https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/files/config-reference-systemxml.html
后台配置页的Controller
vendor\magento\module-config\Controller\Adminhtml\System\Config\Edit.php
后台配置页的 layout 文件
vendor\magento\module-config\view\adminhtml\layout\adminhtml_system_config_edit.xml
后台配置页的block文件
vendor\magento\module-config\Block\System\Config\Edit.php
vendor\magento\module-config\Block\System\Config\Form.php
后台配置页的phtml文件
vendor\magento\module-config\view\adminhtml\templates\system\config\edit.phtml
vendor\magento\module-backend\view\adminhtml\templates\widget\form.phtml

-->

## 前端

<!--


vendor\magento\framework\View\Result\Page.php render
这个页面会大致分成这几个部分
requireJs
headContent
headAdditional
htmlAttributes
headAttributes
bodyAttributes
loaderIcon
layoutContent
其中 layoutContent 是最重要的部分


用到的前端框架或库
    AMD 和 require
    jquery
        jQuery.Deferred
    jquery-ui
        jquery-ui 的 widget
            通常直接写在 view/frontend/web/js 目录下
    underscore
    knockoutjs
        knockoutjs 的模板又是怎样的？
    LESS (Leaner Style Sheets)
    来自 magento2 的 uiComponent



vendor\magento\module-ui\view\base\web\js\lib\core\class.js
vendor\magento\module-ui\view\base\web\js\lib\core\element\element.js
vendor\magento\module-ui\view\base\web\js\lib\core\collection.js

uiComponent 和 uiCollection 是一样的
uiComponent 继承自 uiElement
uiElement 继承自 uiClass

uiClass 是普通的类
uiElement 可以算是 knockoutjs 里的视图模型了

uiCollection:   'Magento_Ui/js/lib/core/collection', vendor\magento\module-ui\view\base\web\js\lib\core\collection.js
uiComponent:    'Magento_Ui/js/lib/core/collection', vendor\magento\module-ui\view\base\web\js\lib\core\collection.js
uiElement:      'Magento_Ui/js/lib/core/element/element', vendor\magento\module-ui\view\base\web\js\lib\core\element\element.js
uiClass:        'Magento_Ui/js/lib/core/class', vendor\magento\module-ui\view\base\web\js\lib\core\class.js

uiElement 和 uiClass 都有用到 underscore 的 extend 方法

uiElement 中的 template 就是纯粹的 html 文件了

uiRegistry
vendor\magento\module-ui\view\base\web\js\lib\registry\registry.js


define 和 require 这两个函数是不一样的。。。

requirejs 模块加载(require)及定义(define)

underscore lib\web\underscore.js
mageUtils   lib\web\mage\utils\main.js
mage/utils/wrapper   lib\web\mage\utils\wrapper.js
mage/translate lib\web\mage\utils\template.js

uiEvents vendor\magento\module-ui\view\base\web\js\lib\core\events.js
links vendor\magento\module-ui\view\base\web\js\lib\core\element\links.js
uiRegistry vendor\magento\module-ui\view\base\web\js\lib\registry\registry.js

uiClass 好像也是继承自 underscore 
uiClass 好像和 mageUtils 和 mage/utils/wrapper 密切相关
而 mageUtils 和 mage/utils/wrapper 则是来自 underscore
mageUtils 里包含了
    objects lib\web\mage\utils\objects.js
    template lib\web\mage\utils\template.js
objects 里又包含了 ko

knockout lib\web\knockoutjs\knockout.js
lib\web\requirejs\require.js

要留意模块里的这个文件 requirejs-config.js

这是另一个重要的 requirejs-config.js
vendor\magento\module-theme\view\base\requirejs-config.js

会把各个主题和模块里的 requirejs-config.js 文件合并成一个单独的 requirejs-config.js

在加载 lib\web\requirejs\require.js 之前，会有这一段 js 是用来指示 js 的加载路径的
<script>
var BASE_URL = 'https\u003A\u002F\u002Fshop\u002Dlocalhost-magento\u002F';
var require = {
    'baseUrl': 'https\u003A\u002F\u002Fshop\u002Dlocalhost-magento\u002Fstatic\u002Fversion1669169968\u002Ffrontend\u002Flocal_dev\u002Fstandard\u002Fen_US'
};
</script>

这是第一个引入的 js 文件
lib\web\requirejs\require.js
pub\static\frontend\local_dev\standard\en_US\requirejs\require.js

这是第二个引入的 js文件
static/frontend/local_dev/standard/en_US/mage/requirejs/mixins.js

这是第三个引入的 js文件
static/frontend/local_dev/standard/en_US/requirejs-config.js

输出 requirejs 全部的配置项
requirejs.s.contexts._.config


mage 开头的前端文件 是来自这个文件夹的
lib\web\mage

mageUtils   lib\web\mage\utils\main.js
mage/utils/wrapper   lib\web\mage\utils\wrapper.js
mage/translate lib\web\mage\utils\template.js


knockoutjs 这个的视图是怎么实现的？

如果开了生产模式，且完成构建后，这个才是页面第一个加载的js，这是一个经过合并的js文件
这个js会加载 requirejs 和 一些 config ，然后又会加载一些 公共的模块，像 jq 这些
https://magento.local/static/version1702444490/_cache/merged/bb6ac75328fcb226b1c39f8031afeb03.min.js
总而言之 requirejs 是第一个加载的 js 库


每个component都有自己独立的template，knockoutjs会把template动态渲染到页面上。
但也由于是动态异步渲染，template的元素渲染完成的时间很难掌握，想用jquery操作渲染完成后的DOM就成了难题。
knockoutjs并不鼓励用jquery操作它渲染出来的DOM，但丰富的jquery插件并不对knockoutjs友好，使用jquery几乎不可避免。
要让jquery操作knockoutjs的DOM关键在于template渲染完成后主动向外发出通知，jquery再截获通知。
渲染的核心代码在以下位置:
vendor/magento/module-ui/view/base/web/js/lib/ko/template/renderer.js


ko 的文档里提到了三种模板引擎
    ko 自身的
        大致分成四部分
            html代码 -> 通常写在 views/templates ， 就是 phtml 文件
                例子
                    <div name="coupon-wrapper" data-bind="scope: 'coupon-wrapper'" class="coupon-wrapper">
                    &lt;!-- ko template: getTemplate() --&gt;&lt;!-- /ko --&gt;
                    </div>
            js模板(view) -> 通常写在 views/web/template ， 就是 html 文件，通常由 view model 通过 ajax 加载
            js代码(model) -> 通常写在 views/web/js/model
            js代码(view model) -> 通常写在 views/web/js/view
                通常 view 和 view model 是一一对应的
        模板可以嵌套
        模板可以都写在一个文件里
    jQuery-tmpl
        这是一个 jq 的插件，已经停止更新， magento2 里也没有用到
        可以用 JsRender 替代
            JsRender 也是 jq 的插件
    underscore 的 模板引擎

Knockout 三大核心功能：
    监控属性（Observables）和依赖跟踪（Dependency tracking）
    声明式绑定（Declarative bindings）
    模板（Templating）

Knockout 使用 Model-View-View Model (MVVM) 模式
    Model
    View Model
    View


全局 global
网站 website
商店 store
商店视图 store view

global website store 这三个是一个树形的结构
global -> website -> store

store view 是相对独立的，
store view 应用在 store 里
store view 类似于皮肤或主题的概念
切换语言的时候就是在切换 store view

https://docs.magento.com/user-guide/stores/stores-all-stores.html

还有这两个
scope
store_groups

scope n. 范围

scope 在 magento2 里通常是指配置的作用范围
就是获取哪一级的配置
设置哪一级的配置这类
https://experienceleague.adobe.com/docs/commerce-admin/config/scope-change.html
就是这几个层级
global
website
store
store view
就是指 core_config_data 中的 scope


store_groups 是一个表名
Web Site is mapped to the store_website table in the database.
Store is mapped to the store_group table in the database.
Store View is mapped to the store table in the database.
https://magento.stackexchange.com/questions/318044/magento-2-whats-the-difference-between-store-and-group

三个相关的表
store_website -> website
store_group -> store
store -> store view

store view 是根据 store 表中的 code 区分的




pub\static\frontend\LocalDev\standard\en_US\requirejs-config.js
pub\static\area\开发商\主题\语言包\前端的文件

areaCode
    global
    frontend
    adminhtml
    doc
    crontab
    webapi_rest
    webapi_soap
    graphql

areaCode 的值在这个位置
vendor\magento\framework\App\Area.php

https://developer.adobe.com/commerce/php/architecture/modules/areas/


后台的渲染逻辑会不会和前台不一样？


ui_component的文档
https://developer.adobe.com/commerce/frontend-core/ui-components/

后台配置的文档
https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/files/config-reference-systemxml.html


block -> ui_component -> system.xml

ui_component 需要现在 view/adminhtml/ui_component 文件夹下 定义
view/adminhtml/ui_component/admin_usage_notification.xml
再在 view/adminhtml/layout 的 xml 文件里声明，类似于 声明 block
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="content">
            <uiComponent name="admin_usage_notification">
                <visibilityCondition name="can_view_admin_usage_notification" className="Magento\AdminAnalytics\Model\Condition\CanViewNotification"/>
            </uiComponent>
        </referenceContainer>
    </body>
</page>


在 phtml 文件中，可以像这样获得前端资源的路径
$iconHeart = $block->getViewFileUrl('Magento_Catalog::images/icons/icon-heart.svg');

盲点还有很多盲点
    magento2 的 xml 是如何合并的？
    indexer 的 on save 是怎么运行的？
    队列是怎么运行的？
    css 是怎么加载的？
        除了写在 layout.xml 这种。。。
        在 block 里加载也可以。。。
    如何把 参数 传递进 block
        setData 这类方法
        在 block 中查数据库
    block 之间的嵌套式如何实现的
        xml 文件要有对应的声明
        在 phtml 文件里这样调用
            <?= $block->getChildHtml('checkout_cart_empty_widget') ?>
其实还有很多
在后台的 Content 似乎也能直接修改视图

一个block可以对应多个模板，在 block 的这个方法里修改模板
vendor\magento\framework\View\Element\Template.php
    public function setTemplate($template)
    {
        $this->_template = $template;
        return $this;
    }


像这类标签里的内容，是有什么作用的？
<script type="text/x-magento-init">
这个标签里的代码似乎都是 json
这里的 json 数据似乎会加载到 对应 模块 里的 config 变量里
html标签中的data-mage-init属性似乎也有类似的作用
https://developer.adobe.com/commerce/frontend-core/javascript/init/

通常会和 jqui 的 widget 或 magento 的 ui 配合来用

用在 define 类型的 js 文件里
模块名定义在 主题或模块的这个文件里 requirejs-config.js

例子
这是 define 的定义
define(['jquery'], function($)
{
     return function(config, element)
     {
        console.log(element);
        console.log(config);
     };
});
这是 requirejs-config.js
var config = {
    map: {
        '*': {
                'carousel': 'js/carousel'
            }
        }
};
这是 config
<script type="text/x-magento-init">
    {
        "#<carousel_name>": {
            "carousel": {"option": value}
        },
        "*": { // 如果是星号，则不绑定节点
            "carousel": {"option": value}
        }
    }
</script>
这是写在 html标签中的data-mage-init属性
<div data-mage-init='{"carousel":{"option": value}}'>




data-mage-init 属性是一种在 Magento 2 中初始化 JavaScript 的方法。
它允许你在 HTML 元素上指定一个 JSON 对象，该对象包含要调用的 RequireJS 模块的名称和配置参数。
例如，如果你有一个 HTML 元素如下：
<div id="example" data-mage-init='{"js/example": {"a": "Hello from attribute"}}'></div>
那么当页面加载时，Magento 会自动调用 js/example 这个 RequireJS 模块，
并传递 {“a”: “Hello from attribute”} 这个 JSON 对象作为配置参数。
你可以在 js/example 模块中使用这个参数来实现你的逻辑。
例如，你可以在 js/example 模块中这样定义：
define ( [ 'jquery' ], function ($) {
    'use strict' ;
    return function (config) {
        console. log ( config ); // will output {a: "Hello from attribute"}
        alert ( config .a); // would be equal to alert ( "Hello from attribute" );
    }
});
这样，你就可以在 HTML 元素上使用 data-mage-init 属性来初始化 JavaScript，而不需要在模板中插入 <script> 标签。
这样可以使你的代码更简洁和可维护。

在这两个文件里把 <script type="text/x-magento-init"> 和 data-mage-init属性的json数据加载到对应的模块里
lib\web\mage\apply\main.js
lib\web\mage\apply\scripts.js

如何获取 data-mage-init 里的值？


这几个文件的加载顺序猜测是这样的
vendor\magento\module-theme\view\frontend\requirejs-config.js
    lib\web\mage\bootstrap.js
        lib\web\mage\apply\main.js
            lib\web\mage\apply\scripts.js
            apply 方法，在这个方法里会加载全部的 uiComponent

这个目录下的文件应该就是magento2的js文件了
lib\web\mage

这似乎也是一份重要的js文件
lib\web\mage\mage.js


/** @var \Magento\Framework\View\TemplateEngine\Php $this */

在 phtml 文件里获取其它 block
/** @var \Magento\Cms\Block\Page */
$cmsBlockPage = $block->getLayout()->createBlock(\Magento\Cms\Block\Page::class);

在 phtml 文件里获取配置
$scopeConfig = $block->getConfig();
$value = $scopeConfig->getValue('configPath', 'scope_store');
需要在 block 里暴露 scopeConfig 对象
/**
 * @return \Magento\Framework\App\Config\ScopeConfigInterface
 */
public function getConfig()
{
    return $this->scopeConfig;
}

在 phtml 文件里获取 cms 页面的html代码
/** @var \Magento\Cms\Block\Page */
$cmsBlockPage = $block->getLayout()->createBlock(\Magento\Cms\Block\Page::class);
$cmsBlockPage->unsetData('page');
$cmsBlockPage->setData('page_id', 'page_id');
// $cmsBlockPage->setData('page_id', $block->getConfig()->getValue(\Magento\Cms\Helper\Page::XML_PATH_NO_ROUTE_PAGE)); // 获取默认的404页面
$cmsPage = $cmsBlockPage->getPage();
printf('<h1>%s</h1>%s', $cmsPage->getContentHeading(), $cmsPage->getContent());


magento2 的分层
表示层 -> 就是前端 + 控制器
服务层 -> 就是 Api 里的文件，还有就是 rest soap graphql
域层 -> 就是业务逻辑？散落在模块的各个位置？
持久层 -> Model 里的文件？
https://developer.adobe.com/commerce/php/architecture/layers/



在加载 lib\web\requirejs\require.js 之前，会有这一段 js 是用来指示 js 的加载路径的
<script>
var BASE_URL = 'https\u003A\u002F\u002Fshop\u002Ddev.magento.com\u002F';
var require = {
    'baseUrl': 'https\u003A\u002F\u002Fshop\u002Ddev.magento.com\u002Fstatic\u002Fversion1669169968\u002Ffrontend\u002FMagento\u002Fstandard\u002Fen_US'
};
</script>

这是第一个引入的 js 文件
lib\web\requirejs\require.js
pub\static\frontend\Magento\standard\en_US\requirejs\require.js

这是输出 html 的流程
page_layout -> layout -> templates
大致就是先读取 page_layout 和 layout
然后根据配置加载 block 和 templates
然后调用 block 的 _toHtml 方法

前端 大致的 加载 流程
    假设已经输出了 完整的html
        先加载两个全局变量 BASE_URL require
        再依次加载这三份文件
            requirejs/require.js requirejs库
            requirejs/mixins.js requirejs的插件
            requirejs-config.js requirejs的配置，这个文件是由各个主题和模块里的 requirejs-config.js 文件合并而成的
                requirejs-config.js 会指示各个模块的加载路径
                目测会按以下顺序加载模块
                    knockoutjs
                    mage/utils/main 这个应该是来自 magento2 的模块，在这个模块里会加载 underscore
                    mage/requirejs/resolver 这个应该是来自 magento2 的模块
                    jquery-ui 在这个模块里会加载 jquery


require('knockout');
require('knockout').components

require('knockout').utils.domData


require('mageUtils')

这样可以找到对应的 ui component ，问题在于 name 比较长，问题也在于如何找到对应的 name
require('uiRegistry').get('sales_order_shipment_grid.sales_order_shipment_grid.listing_top.listing_filters')
require('uiRegistry').get('sales_order_shipment_grid.sales_order_shipment_grid.listing_top.fulltext')

输出全部 ui component
require('uiRegistry').filter(function(a){console.log(a)})

require('uiRegistry').filter(function(a){
    if (a.name) console.log(a.name); else console.log(a);
    // 这里输出的 name ，可以用在这里 require('uiRegistry').get(name) 的 name
    // 这里输出的 component ，可以用在这里 require(component)();
})

如何通过 ui component 找到对应的 dom 节点 ？
    没有好的方法，只能遍历dom
如何通过 dom 节点找到对应的 ui component ？
    没有好的方法，只能遍历dom
如何判断一个 dom节点有没有绑定 ui component ？
    用 ko.contextFor 这个方法



这种输出的一般是 UiClass 对象
require('Payment/js/view/payment/method-renderer')();


KnockoutJS 其实是有多少种运行方式的？
    Bindings 如果没有组件的状态下，视图模型（viewModel）会应用在全局的组件中，猜测一个页面只会有一个 ko.applyBindings 生效
    Components 组件， Components 和 Bindings 可以同时使用，但全局的视图模型依然只能有一个。。。

在 KnockoutJS 中，data-bind="scope: 'cart_content'" 这段代码用于创建一个新的绑定上下文（binding context）。
这里的 'cart_content' 是一个已注册的组件的名称，
它告诉 KnockoutJS 在当前 DOM 元素及其子元素中应用这个组件的视图模型（ViewModel）。

KnockoutJS 的组件（component）分成两部分
    viewModel 视图模型
    template 模板

KnockoutJS 的 API 没有直接提供获取所有组件列表的方法


这个好像只要节点是正常的都会输出一个全局的 ko 对象
require('knockout').contextFor(jQuery("[id='cart']")[0]);

如果节点有绑定 ko ，那么输出的 $data 会有数据
ko.contextFor(document.getElementById('test'))
ko.contextFor(document.getElementById('test1'))

如果存在对应的组件名就会输出对应的对象，如果没有怎输出null
ko.components.get('message-editor', function(a){console.log(a)});

ko.contextFor(document.getElementsByClassName('liveExample'))

用于判断组件名是否存在，但在 magento2 里似乎没有效果
require('knockout').components.isRegistered('minicart_content');

遍历dom节点，
(function(ko, root) {
class Particle {
    constructor(ele) {
        this.ele = ele;
        this.koBindingContext = null;
        this.component = null;
        this.name = null;
        let bindingContext = ko.contextFor(this.ele);
        if (bindingContext && bindingContext.$data) {
            this.koBindingContext = bindingContext;
            let $data = this.koBindingContext.$data;
            if ($data.component) {
                this.component = $data.component;
            }
            if ($data.name) {
                this.name = $data.name;
            }
        }
        this.children = [];
    }
    addChild(particle) {
        this.children.push(particle);
    }
}

let traverseDOM = function(parentsElement, result) {
    if (!parentsElement) {
        return result
    }
    let currentElement = parentsElement.firstElementChild;
    while (currentElement) {
        // console.log(currentElement);
        let subresult = traverseDOM(currentElement, new Particle(currentElement));
        result.addChild(subresult);
        currentElement = currentElement.nextElementSibling
    }
    return result;
};

let result = traverseDOM(root, new Particle(root));
console.log(result);

})(require('knockout'), jQuery('#maincontent .payment-methods')[0])
// document.body
// jQuery('#maincontent .payment-methods')[0]
// 如果不是 require 环境，就直接的 ko 就可以了
// document.getElementById('test')
// document.getElementsByClassName('test')
// 直接用 document.body 输出的对象会非常大，最好先限定一下范围


用审查元素里的 事件侦听器 也能通过节点找到对应的js代码

// 确保 customerData 加载完后执行的方法
require([
    'jquery',
    'Magento_Customer/js/customer-data'
], function($, customerData) {
    $(document).ready(function() {
        var cacheKey = 'wishlist';
        var cData = customerData.get(cacheKey);
        customerData.getInitCustomerData().done(function() { // 加载完后执行
            let wishlist = cData();
            if (wishlist && Object.keys(wishlist).length > 0) { // 加载了有数据
                if (wishlist.wishlist_itemIds) {
                    if ($('.wishlist .item').length != wishlist.wishlist_itemIds.length) {
                        customerData.reload(cacheKey);
                    }
                } else {
                    customerData.reload(cacheKey);
                }
            } else {
                customerData.reload(cacheKey);
            }
        });
    });
});

获取 customer-data
require('Magento_Customer/js/customer-data').get('customer')()
刷新全部 customer-data
require('Magento_Customer/js/customer-data').reload()
刷新一部分 customer-data
require('Magento_Customer/js/customer-data').reload('wishlist')
刷新 customer-data 可以避免重新登录

刷新时会请求这个地址
https://localhost/customer/section/load/?_=1715824421237

请求达到的方法
vendor\magento\module-customer\Controller\Section\Load.php
execute

\Magento\Customer\Controller\Section\Load::class 里有一个
sectionPool 属性
这个属性有一个 getSectionData 方法

sectionPool 的位置
\Magento\Customer\CustomerData\SectionPool::class;
vendor\magento\module-customer\CustomerData\SectionPool.php
sectionPool 里有一个 sectionSourceMap 属性

sectionSourceMap 是一个数组
数组里的对象都有一个 getSectionData 方法
sectionSourceMap 数组里的对象通过 di.xml 里声明的
vendor\magento\module-customer\etc\frontend\di.xml

customer的数据来自这个类
\Magento\Customer\CustomerData\Customer::class
原始的类里只有这三个属性
    fullname
    firstname
    websiteId

在 localstorage 里有一份 customer 数据
    JSON.parse(window.localStorage['mage-cache-storage']);
在 cookie 里也有一份 customer 数据
    JSON.parse(jQuery.cookie('section_data_ids'));
    JSON.parse(decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('section_data_ids')).split('=')[1]));

window 对象里也有一份 customer 数据，但不是每个页面都有
    window.customerData
    window.checkoutConfig.customerData

checkout页面中的customerData是由 js 生成
js 的数据用 这样的形式输出到 html 里
vendor/magento/module-checkout/view/frontend/templates/onepage.phtml
<?php
$serializedCheckoutConfig = /* @noEscape */ $block->getSerializedCheckoutConfig();
$scriptString = <<<script
    window.checkoutConfig = {$serializedCheckoutConfig};
    // Create aliases for customer.js model from customer module
    window.isCustomerLoggedIn = window.checkoutConfig.isCustomerLoggedIn;
    window.customerData = window.checkoutConfig.customerData;
script;
?>

vendor/magento/module-checkout/Controller/Index/Index.php
vendor/magento/module-checkout/view/frontend/templates/onepage.phtml
vendor/magento/module-checkout/Block/Onepage.php getCheckoutConfig
\Magento\Checkout\Model\CompositeConfigProvider getConfig
    vendor\magento\module-checkout\etc\frontend\di.xml
        configProviders
            Magento\Checkout\Model\DefaultConfigProvider getConfig
                customerData -> CustomerInterface->__toArray
            Magento\Checkout\Model\Cart\CheckoutSummaryConfigProvider
            Magento\Checkout\Model\PaymentCaptchaConfigProvider
-->

## 缓存

<!--

### 构建的缓存

generated
pub

### 运行时的缓存

cache
varnish

这些文件都分别有哪些作用？
var/di/*
var/generation/
var/cache/
var/page_cache/
var/view_preprocessed/
var/composer_home/cache/
var/tmp/
generated/code/
generated/metadata/
pub/static/*

-->

## 发送邮件

<!--

magento2 使用这个库来发送邮件的
https://github.com/laminas/laminas-mail

magento2 在默认情况下似乎不支持 SMTP 发送邮件
可以用这个拓展来实现 SMTP 发送邮件
https://www.mageplaza.com/magento-2-smtp/

magento2 在默认情况下 使用 PHP 的 Sendmail 函数来发送邮件，就是调用系统里的 sendmail ，只能设置 host 和 port
magento2 在 2.3 之后也支持 smtp 了
在这个位置设置，可以选择 sendmail 和 smtp
Stores > Settings > Configuration> Advanced > System > Mail Sending Settings > Transport


-->

## 一些调试技巧

### 获取某一个对象

```php
// 从已存在的对象中获取
$logger = \Magento\Framework\App\ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
// 新建一个
$logger = \Magento\Framework\App\ObjectManager::getInstance()->create(\Psr\Log\LoggerInterface::class);
// 获取一个普通的对象
/** @var \Magento\Sales\Model\ResourceModel\Order\CollectionFactory */
$orderCollectionFactory = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Sales\Model\ResourceModel\Order\CollectionFactory::class);
$orderId = 3068;
$orderCollection = $orderCollectionFactory->create();
$orderCollection->addFieldToFilter('entity_id', $orderId); // 可以修改条件
$order = $orderCollection->getFirstItem(); // $orderCollection->getItems(); // 获取集合
```

```php
$objectMamager = \Magento\Framework\App\ObjectManager::getInstance();

// 根据 customer id 或 email 获取 customer 对象
/** @var \Magento\Customer\Model\CustomerFactory */
$customerFactory = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Customer\Model\CustomerFactory::class);
$customer = $customerFactory->create()->load($customerID);
$customer = $customerFactory->create()->loadByEmail($email);

// 获取某个 customer 的购物车
$quote = $customer->getQuote();

// 获取某个 customer 最近成功支付的订单
/** @var \Magento\Sales\Model\ResourceModel\Order\CollectionFactory */
$orderCollectionFactory = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Sales\Model\ResourceModel\Order\CollectionFactory::class);
$orderCollection = $orderCollectionFactory->create();
$orderCollection->addFieldToFilter('customer_id', $customer->getId());
$orderCollection->addFieldToFilter('state', ['in' => [
    \Magento\Sales\Model\Order::STATE_PROCESSING,
    \Magento\Sales\Model\Order::STATE_COMPLETE
]]);
$orderCollection->setOrder('created_at');
$orderCollection->setPageSize(1);
$order = $orderCollection->getFirstItem();

// 根据 productId 获取 product 对象
/** @var \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory */
$productCollectionFactory = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Catalog\Model\ResourceModel\Product\CollectionFactory::class);
$productCollection = $productCollectionFactory->create();
$productCollection->addFieldToFilter(
    'entity_id', ['in' => $productId]
    // 'sku', ['eq' => $sku]
);
$productCollection->setPageSize(1);
$product = $productCollection->getFirstItem();
```

<!--
常用的对象
\Magento\Sales\Model\ResourceModel\Order\CollectionFactory
\Magento\Catalog\Model\ResourceModel\Product\CollectionFactory
\Magento\Customer\Model\CustomerFactory
\Magento\Quote\Model\QuoteFactory
shipment
-->

### 在某一个位置写日志

```php
/** @var \Psr\Log\LoggerInterface */
$logger = \Magento\Framework\App\ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
$logger->warning('=======flg debug=======', ['trace' => $a]);
$logger->warning('=======flg debug=======', ['trace' => $exception->getTrace(), 'msg' => $exception->getMessage()]);
$logger->warning('=======flg debug=======', ['trace' => debug_backtrace()]);

$logger = \Magento\Framework\App\ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
$logger->warning('=======flg debug=======' . PHP_EOL . __FILE__ . ':' . __LINE__ . PHP_EOL, ['trace' => $a]);
```

### 在某一个位置通过拼接的 sql 查询数据库

```php
/**
 * @var \Magento\Framework\App\ResourceConnection
 */
$conn = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Framework\App\ResourceConnection::class);
$conn = $conn->getConnection();
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
    ->where("soi.fulfilment_start_at <= ? ", time());
$result = $conn->fetchAll($select);

// 直接运行 sql 语句
$conn = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Framework\App\ResourceConnection::class);
$result = $conn->getConnection()->query('SELECT TIMEDIFF(NOW(), UTC_TIMESTAMP);')->fetchAll();
$result = $conn->getConnection()->query("update sales_order set status = 'complete', state = 'complete' where entity_id = 123456;")->execute();
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
    'include_stacktrace' => 0 // 改成1可以记录代码调用栈
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
$ignore = [ // 忽略 ObjectManager 的文件， Interceptor 的文件， Factory 的文件， Event 的文件
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'Interception' . DIRECTORY_SEPARATOR . 'Interceptor.php',
    'generated',
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'ObjectManager' . DIRECTORY_SEPARATOR . 'Factory',
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'ObjectManager' . DIRECTORY_SEPARATOR . 'ObjectManager.php',
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'Event' . DIRECTORY_SEPARATOR . 'Manager.php',
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'Event' . DIRECTORY_SEPARATOR . 'Invoker' . DIRECTORY_SEPARATOR . 'InvokerDefault.php',
    'vendor' . DIRECTORY_SEPARATOR . 'magento' . DIRECTORY_SEPARATOR . 'module-staging' . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . 'Event' . DIRECTORY_SEPARATOR . 'Manager.php',
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
.js,.css,.md,.txt,.json,.csv,.html,.less,.phtml,**/tests,**/test,**/Test,**/setup,**/view,**/magento2-functional-testing-framework,.wsdl,**/module-signifyd,**/Block,pub,generated
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

        /** @var \Magento\Framework\App\State */
        $appState = $objectMamager->get(\Magento\Framework\App\State::class);
        try { // 没有这句很容易会出现 Area code is not set 的错误
            $appState->setAreaCode(\Magento\Framework\App\Area::AREA_ADMINHTML);
        } catch (\Exception $e) {
        }

        // 可以尝试这样更改 store view
        // /** @var \Magento\Store\Model\StoreManagerInterface */
        // $storeManager =  $objectMamager->get(\Magento\Store\Model\StoreManagerInterface::class);
        // $storeManager->setCurrentStore('zh_Hans_CN');

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
php -d xdebug.start_with_request=yes bin/magento indexer:info
```

通过命令行运行测试代码，可以不加载前端资源，反馈的速度更快。
修改原本的命令行是为了不运行构建的命令就能生效。
一些对象可以通过 \Magento\Framework\App\ObjectManager::getInstance()->get() 的方法获得。
indexer:status 的输出就包含了 indexer:info 的输出。

直接运行测试代码，要在项目的根目录里运行，但这种方式无法调试
```bash
php -a <<- 'EOF'
try {
// 引入 magento2 的引导文件
require __DIR__ . '/app/bootstrap.php';
// 创建一个应用对象
$bootstrap = \Magento\Framework\App\Bootstrap::create(BP, $_SERVER);
// 获取一个对象管理器
$objectManager = $bootstrap->getObjectManager();

// 如果出现这种错误 area code is not set ，则加上这两句， area 的值可以根据实际场景修改
$state = $objectManager->get(\Magento\Framework\App\State::class);
$state->setAreaCode(\Magento\Framework\App\Area::AREA_FRONTEND);

// 获取一个文件系统对象
$fileSystem = $objectManager->get(\Magento\Framework\Filesystem::class);
// 获取临时目录的路径
$tempDir = $fileSystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::TMP)->getAbsolutePath();
// 输出路径
echo $tempDir;
} catch (\Throwable $e) {
    echo $e->getFile() . ':' . $e->getLine() . PHP_EOL;
    echo $e->getMessage() . PHP_EOL . $e->getTraceAsString();
}
EOF
```

### 前端的调试

- 可以这样在浏览器查看前端模块的数据
    ```js
    require('Magento_Checkout/js/model/quote');
    ```

- 通过浏览器的断点来实现前端的调试
- 一些情况下可以使用使用鼠标点击的事件作为断点，如果是火狐浏览器可以直接查看节点绑定的事件
- 忽略一些 js 文件，把这些 js 文件标记为库文件
- 使用浏览器的覆盖功能，直接在前端修改 js 和 css 代码，这样做的好处是不用运行 setup:static-content:deploy 这种命令

### 修改后台的帐号密码

笔者在二次开发 magento2 的过程中，登录后台时总是失败， magento2 似乎有一套很 ~~混乱~~ 很 ~~复杂~~ 的规则来限制后台的登录。

这里记录一下通过修改数据库里对应的表来完成登录。
~~这些记录可能会随着magento的更新而失效~~

和后台登录相关的表
```
admin_passwords
admin_user
admin_user_expiration
```

顺利登录时各个字段的状态
- admin_user
    - is_active 设为 1
    - failures_num 设为 0
    - lock_expires 设为 小于当前的时间，至少是 2 天前，避免受到时区的影响 `date_add(now(), interval -2 day)`
    - first_failure 设为 NULL
- admin_passwords
    - last_updated 设为当前的时间
    - expires 设为 0
- admin_user_expiration
    - 这个表里不能有对应的记录
- 这两个字段的值需要一致
   - admin_user.password
   - admin_passwords.password_hash

用于观察的 sql
```sql
select
	admin_user.user_id,
	admin_user.firstname,
	admin_user.lastname,
	admin_user.email,
	admin_user.username,
	admin_user.is_active,
	admin_user.lognum,
	admin_user.failures_num,
	admin_user.first_failure,
	admin_user.lock_expires,
	admin_user.password,
	admin_passwords.password_id,
	admin_passwords.password_hash,
	admin_passwords.expires,
	FROM_UNIXTIME(admin_passwords.expires),
	admin_passwords.last_updated,
	FROM_UNIXTIME(admin_passwords.last_updated)
from admin_user
left join admin_passwords on admin_user.user_id = admin_passwords.user_id
WHERE admin_user.email = 'admin@example.com'
order by admin_passwords.password_id desc limit 1;
```

用于更新的 sql
```sql
-- 更新 admin_user
UPDATE admin_user
SET
	is_active=1,
	failures_num=0,
	first_failure=NULL,
	-- lock_expires=NULL,
	lock_expires=date_add(now(), interval -3 day),
	modified=current_timestamp()
where admin_user.email = 'admin@example.com';

-- 更新 admin_passwords
UPDATE admin_passwords
SET
	expires=0,
	last_updated=unix_timestamp(now())
where password_id = (
	select * from (
		select password_id
		from admin_passwords
		left join admin_user on admin_user.user_id = admin_passwords.user_id
		where admin_user.email = 'admin@example.com'
		order by admin_passwords.password_id desc
		limit 1
	) as t
);

-- 删除 admin_user_expiration 里对应的记录
DELETE FROM admin_user_expiration
WHERE user_id = (
    select user_id
    from admin_user
    where email = 'admin@example.com'
    limit 1
);
```

生成新的密码
```php
// 直接生成一个密码，在命令行里是用，只运行一次，因为重置了key，可能会使其他逻辑混乱
// 输出的值，填到 admin_user.password 和 admin_passwords.password_hash
/** @var \Magento\Framework\App\ObjectManager */
$objectMamager = \Magento\Framework\App\ObjectManager::getInstance();
/** @var \Magento\Framework\Encryption\Encryptor */
$encryptor = $objectMamager->get(\Magento\Framework\Encryption\Encryptor::class);
/** @var \Magento\Framework\App\DeploymentConfig */
$deploymentConfig = $objectMamager->get(\Magento\Framework\App\DeploymentConfig::class);
$cryptkey = preg_split('/\s+/s', trim((string)$deploymentConfig->get('crypt/key')))[0]; // 本地的 key
$cryptkey = '4oyi2yvpl8kx3sh9e4u05vnql41kn8fa'; // crypt/key ，其它的 key ，可能会在本地生成用于线上环境的 password
$encryptor->setNewKey($cryptkey);
$password = 'password#12345678'; // 新的密码
echo $encryptor->getHash($password, true, $encryptor::HASH_VERSION_ARGON2ID13_AGNOSTIC);
exit(0);
```

通过命令行新建管理员
```
php bin/magento admin:user:create --admin-user="360magento" --admin-password="Admin@123" --admin-email="admin@360magento.com" --admin-firstname="MyFirstName" --admin-lastname="MyLastName"
```

分配角色给刚刚新建的用户
```sql
INSERT INTO magento_preprod.authorization_role
(parent_id,tree_level,sort_order,role_type,user_id,user_type,role_name,gws_is_all,gws_websites,gws_store_groups)
select
    1,2,0,'U',user_id,'2',username,1,NULL,NULL
from admin_user
where admin_user.username = '360magento';
```

通过在数据库里插入记录来新建管理员
```
其实就是在这三表表插入对应的记录
admin_user
admin_passwords
authorization_role
```

在后台新建客户(customer)

和权限相关的表
```
authorization_role
authorization_rule
```

### 其它

sales_order 表的两个状态
- state 是 magento 内部的状态
    - 写死在文件
    - vendor\magento\module-sales\Model\Order.php
- status 可以是二次开发时自定义的状态
    - 写在数据库里的表
    - vendor\magento\module-sales\Model\ResourceModel\Order\Status.php
    - sales_order_status
- status 和 state 的对应关系在这个表里 sales_order_status_state

遇到问题，可以先搜索一下 github 的 iusses ，同样的问题可能已经出了补丁，不用自己修改。
- 可以在这个站点里找到对应的补丁
    - https://devdocs.magento.com/quality-patches/tool.html
- 关于 Quality Patches Tool (QPT) 工具的使用
    - https://devdocs.magento.com/quality-patches/usage.html
    - https://support.magento.com/hc/en-us/articles/360047125252
    - https://support.magento.com/hc/en-us/articles/360047139492
- 也可以把下载的 patch 文件单独复制出来，然后用 cweagans/composer-patches 打补丁
<!-- acsd mdva 补丁的前缀其实是什么的缩写？ -->

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

## 参考

中文文档 https://experienceleague.adobe.com/docs/commerce.html?lang=zh-Hans

github 里 magento2 的模块例子
- https://github.com/magento/magento2-samples
- sample-module-minimal 是最简单的模块例子

https://developer.adobe.com/commerce/php/architecture/

生成 magento 模块 https://cedcommerce.com/magento-2-module-creator/

https://devdocs.magento.com/guides/v2.4/extension-dev-guide/module-development.html

http://www.wps.team/book/magento2/

<!--
这是一个收费的文档
https://www.kancloud.cn/zouhongzhao/magento2-in-action


在这个位置加上 WHERE
vendor\magento\zendframework1\library\Zend\Db\Select.php
_where

Filter
vendor\magento\framework\Api\Filter.php
vendor\magento\framework\Api\AbstractSimpleObject.php

FilterGroup
vendor\magento\framework\Api\Search\FilterGroup.php
vendor\magento\framework\Api\AbstractSimpleObject.php

filter_groups -> FilterGroup的数组
FilterGroup -> \Magento\Framework\Api\Search\FilterGroup
filters -> Filter的数组
Filter ->  \Magento\Framework\Api\Search\Filter

搜索通常是使用这两种对象
SearchCriteria
Collection

搜索通常是把 Filter 转换为 sql 或 es 的 where 语句


getData 和 setData
一般的对象
vendor\magento\framework\DataObject.php
模型的对象
vendor\magento\framework\Model\AbstractModel.php

除了对应的方法还要留意构造函数
子类的方法有可能覆盖父类的方法

magento2 里用于执行单个定时任务的工具
https://github.com/netz98/n98-magerun2
安装这个工具可以直接跑某个指定的cron job
n98-magerun2.phar sys:cron:run sales_clean_quotes
其实这个工具还有很多其它功能的

curl -O https://files.magerun.net/n98-magerun2.phar && chmod +x ./n98-magerun2.phar;
su www-data -c "./n98-magerun2.phar sys:cron:run sales_clean_quotes"


配置文件修改后，要清除一次缓存
php bin/magento c:c



php bin/magento setup:upgrade --keep-generated

构建前端时忽略后台
php bin/magento setup:static-content:deploy -f --exclude-area=adminhtml
构建前端时忽略前台
php bin/magento setup:static-content:deploy -f --exclude-area=frontend

-j 参数 使用多进程的方式构建前台
-j 参数 windows 用不了，因为依赖了 pcntl_fork
php bin/magento setup:static-content:deploy -f -j 8 --exclude-area=frontend
php bin/magento setup:static-content:deploy -f -j 8 --exclude-area=adminhtml

只构建英语的前台
php bin/magento setup:static-content:deploy -f --area=frontend --language=en_US
只构建英语的后台
php bin/magento setup:static-content:deploy -f --area=adminhtml --language=en_US

php bin/magento setup:static-content:deploy --help 还有一些技巧

查看一个类的 Preference 和 Plugins
php bin/magento dev:di:info "Magento\CatalogImportExport\Model\Import\Product\CategoryProcessor"




magento/catalog
    后台设置位置 Catalog -> Products -> product setting -> Related Products, Up-sells, and Cross-sells
    相关的索引器
        catalogrule_rule
        catalogrule_product
magento/module-target-rule 这个不生效，应该是索引的问题
    后台设置位置 Marketing -> Related Products Rules
    相关的索引器
        targetrule_rule_product
        targetrule_product_rule
    相关的表
        magento_targetrule
        magento_targetrule_product
        magento_targetrule_customersegment
amasty/mostviewed
    后台设置位置 Catalog -> Related Product Rules
    相关的索引器
        amasty_mostviewed_rule_product
        amasty_mostviewed_product_rule

magento/catalog 是 ce 版的功能
magento/module-target-rule 是 ee 版的功能
amasty/mostviewed 是第三方的模块

magento/module-target-rule 是通过替换 block 的方式加上对应的产品
    vendor\magento\module-target-rule\view\frontend\layout\catalog_product_view.xml
amasty/mostviewed 是通过 拦截 的方式加上对应的产品
    vendor\amasty\mostviewed\etc\frontend\di.xml
        <type name="Magento\Catalog\Block\Product\ProductList\Related">
            <plugin name="Amasty_Mostviewed::collectionRelated" type="Amasty\Mostviewed\Plugin\Community\Related"/>
        </type>
        <type name="Magento\TargetRule\Block\Product\AbstractProduct">
            <plugin name="Amasty_Mostviewed::collection" type="Amasty\Mostviewed\Plugin\Enterprise\Product"/>
        </type>





AdminPortal
MARKETING
Cart Price Rules
优惠券大概就两种
    指定 code 的
    自动生成 code 的
        自动生成的优惠券是通过队列生成的
        这是运行队列的命令 php bin/magento queue:consumers:start codegeneratorProcessor

优惠券和订单相关的表
salesrule_coupon_usage
    coupon_id 对应 salesrule_coupon 的 coupon_id
    customer_id
    times_used 同一个用户消耗同一个 coupon_code 的数量
salesrule_coupon \Magento\SalesRule\Model\Coupon
    coupon_id
    rule_id 对应 sequence_salesrule 的 sequence_value
    code 这个字段就是优惠码
    usage_limit
    usage_per_customer
    times_used 同一个 coupon_code 消耗的数量
    expiration_date 到期时间
salesrule_customer \Magento\SalesRule\Model\Rule\Customer
    rule_id 对应 sequence_salesrule 的 sequence_value
    customer_id
    times_used 同一个用户消耗同一个 rule 的数量
sequence_salesrule 这是一个奇怪的表，应该和队列有关
    sequence_value
salesrule 这个表的值对应 Cart Price Rules 页面的值
    row_id 这个是主键，这个是版本
    rule_id 对应 sequence_salesrule 的 sequence_value
    name
    times_used 只要 rule 的 coupon_code 有消耗就会加1
    uses_per_customer
    uses_per_coupon
    conditions_serialized 生效的条件，这是一个 json 字符串
amasty_amrules_usage_limit
    salesrule_id 对应 salesrule 的 row_id
    limit 全局的数量限制？
sales_order
    coupon_code 对应 salesrule_coupon 的 code
    coupon_rule_name 对应 salesrule 的 name
    applied_rule_ids 这个订单应用了哪些 rule
quote
    coupon_code 对应 salesrule_coupon 的 code
    applied_rule_ids 这个购物车应用了哪些 rule

applied_rule_ids 是一个字符串
多个值用逗号开个，单个值就是 salesrule 里的 rule_id

这个是对应的索引器
salesrule_rule

salesrule salesrule_coupon 一对多
salesrule_coupon salesrule_coupon_usage 一对多
salesrule salesrule_customer 一对多


check per coupon usage limit
salesrule_coupon
    salesrule_coupon.usage_limit 存在 且 salesrule_coupon.times_used 大于等于 salesrule_coupon.usage_limit 返回 flase
    salesrule_coupon_usage.times_used 大于等于 salesrule_coupon.usage_per_customer 返回 flase

check per rule usage limit
salesrule
    salesrule_customer.times_used 大于等于 salesrule.uses_per_customer 返回 false


coupon_code 是否达到了数量上限
这个用户使用了同一个 coupon_code 多少次
这个用户使用了同一个 rule 多少次


在购物车使用了，不会更新优惠券的表
好像多个用户使用同一优惠券加入购物车都不会有影响

多个用户使用同一优惠券加入购物车
其中一个用户先结算
如果优惠券有数量限制，那么另一个会自动失效，但没有提示


coupon 新建界面里的
    Uses per Coupon
    Uses per Customer
对应的是
    salesrule
        uses_per_coupon
        uses_per_customer
    salesrule_coupon
        usage_limit
        usage_per_customer
coupon 新建界面里的
     Global Uses Limit
对应的是
    amasty_amrules_usage_limit
        limit



关键对象 和 相关的表

客户 customer_entity
    customer_id
    username
    email
产品 catalog_product_entity
    product_id
    产品的状态
        status
        visibility
        approval
        这几个值都在 catalog_product_entity_int
            select @attr_product_status:=attribute_id from eav_attribute where attribute_code = 'status' and backend_type = 'int';
            select @attr_approval:=attribute_id from eav_attribute where attribute_code = 'approval' and backend_type = 'int';
            select @attr_visibility:=attribute_id from eav_attribute where attribute_code = 'visibility' and backend_type = 'int';
    产品的库存
        cataloginventory_stock vendor\magento\module-catalog-inventory\Model\ResourceModel\Stock.php
        cataloginventory_stock_item vendor\magento\module-catalog-inventory\Model\ResourceModel\Stock\Item.php
            is_in_stock
            qty
        cataloginventory_stock_status vendor\magento\module-catalog-inventory\Model\ResourceModel\Stock\Status.php
            stock_status
            qty
        eav 里也有一个和库存相关的值 quantity_and_stock_status
            这个值在 catalog_product_entity_int
            select @attr_quantity_and_stock_status:=attribute_id from eav_attribute where attribute_code = 'quantity_and_stock_status' and backend_type = 'int';
            但似乎已经弃用了
购物车 quote
    购物车id quote.entity_id
    customer_id
    相关的表
        quote
        quote_item
        quote_item_option
        quote_address
        quote_shipping_rate
        union_shipping_quote_item
订单 sales_order
    order_id
    customer_id
    increment_id
    相关的表
        sales_order
        sales_order_item
        sales_order_status
        sales_order_status_history
        sales_order_payment
        sales_order_address
        sales_creditmemo
        sales_creditmemo_comment
        sales_order_tax
        sales_invoice
        sales_invoice_comment
        sales_shipment
        sales_shipment_item
        sales_shipment_comment
        sales_shipment_track
订单的送货 sales_shipment
订单的备忘录 sales_creditmemo
订单的发票 sales_invoice
地址
    customer_address_entity
    quote_address
    quote_address_item
    sales_order_address
    service_center_address
    union_shipping_oto_store
分类 catalog_category_entity
管理员 admin_user
支付方式 sales_order_payment
销售规则 salesrule
配置 core_config_data
还有一些 _grid 结尾的表


eav 模型里还有一些表无法理解？
    **_eav_attribute 例如 customer_eav_attribute catalog_eav_attribute
    eav_attribute_group
    eav_attribute_label
    eav_attribute_option
    eav_attribute_option_switch
    eav_attribute_option_value
    eav_attribute_set
    eav_entity_attribute


magento2的布局有两种类型
1. 页面布局(page layout) -> 在 page_layout 目录里的 xml 文件
2. 页面配置(page configuration) -> 在 layout 目录里的 xml 文件

页面布局 的 xml 只包含 容器
页面配置 的 文件名 就是 布局id

绝大多数情况下修改的是 页面配置 文件

这个就是 magento2 最基础的布局
vendor\magento\module-theme\view\base\page_layout\empty.xml
更完整的代码可以参考这个目录下的文件
vendor\magento\module-theme\view\base



// magento2 的事务
/** @var \Magento\Framework\App\ResourceConnection */
$resourceConnection = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Framework\App\ResourceConnection::class);
$connection = $resourceConnection->getConnection();
$connection->beginTransaction();
try {
    // 一些数据库修改的操作
    $connection->commit();
} catch (\Exception $e) {
    $connection->rollBack();
    throw $e;
}


$timeZone = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Framework\Stdlib\DateTime\TimezoneInterface::class);
$currentTimezone = @date_default_timezone_get();
@date_default_timezone_set($timeZone->getConfigTimezone());
$strtime = strtotime($strtime);
@date_default_timezone_set($currentTimezone);


在这个位置，也把时区设为 utc
app\bootstrap.php

在这个位置里，连接完数据库后，时区会马上设置为 utc
vendor\magento\framework\DB\Adapter\Pdo\Mysql.php
_connect


在 magento2 里，一些位置能自动完成时区的转换，一些位置还是需要手动来转换
数据库里的类型
    int string date datetime time
需要显示的格式
    时间戳 格式化的字符串
格式化的字符串
    $fmt = new \IntlDateFormatter($storeCode);
    $fmt->setTimeZone($timezone);
    $fmt->setPattern('yyyy年 M月 dd日, hh:mm a');
    return $fmt->format($timestamp);
    https://www.php.net/manual/en/class.intldateformatter.php
    https://unicode-org.github.io/icu/userguide/format_parse/datetime/


magento2 的时区保存在core_config_data表的这个位置 general/locale/timezone
select * from core_config_data where path like '%timezone%'

在php的代码里这样获取
$timezone = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Framework\Stdlib\DateTime\TimezoneInterface::class);
var_dump($timezone->getConfigTimezone());

在后台里这样设置
Stores -> Configuration -> General -> General -> Locale Options


Magento2 有三种运行模式，按性能由低到高，
依次为：developer < default < production

magento2 有三种运行模式，分别是：
developer：这是开发者模式，适合开发和调试 magento2 应用。在这个模式下，错误信息和日志会更详细，静态文件不会缓存，代码修改会立即生效。
default：这是默认模式，适合一般的使用场景。在这个模式下，错误信息和日志会比较简洁，静态文件会缓存，代码修改需要重新部署才能生效。
production：这是生产模式，适合正式的运营环境。在这个模式下，错误信息和日志会最少，静态文件会压缩和合并，代码修改需要重新编译和部署才能生效。
你可以使用以下命令来查看或设置 magento2 的运行模式：
bin/magento deploy:mode:show：查看当前的运行模式
bin/magento deploy:mode:set {mode}：设置运行模式为 developer, default 或 production
bin/magento deploy:mode:set production --skip-compilation：设置运行模式为 production 但跳过编译步骤


magento2 的维护模式
php bin/magento maintenance:enable
php bin/magento maintenance:disable
php bin/magento maintenance:status

magneto2 的维护模式是用在生产环境里的，

magento2 查看当前开发模式
php bin/magento deploy:mode:show
magento2 把开发模式切换成 开发者模式
php bin/magento deploy:mode:set developer

magento2 安装示例数据，安装示例数据需要切换到开发者模式
php bin/magento sampledata:deploy
php bin/magento setup:upgrade


magento2 是如何加载对象的？
Plugins 是如何实现的？
preference 是如何实现的？
Events 是如何实现的？

有没有什么办法可以手动更新 generated 里的文件？



一个 界面 的显示是被哪些数据所影响的？
数据
    赋值在哪里
    保存在哪里
    显示在哪里
    从获取到显示之间经过了哪些位置？


magento2 是如何加载对象的？
    这个要先了解 composer 是如何自动加载对象的
        spl_autoload_register
        这个要先了解 原生的php 是如何加载对象的
            include include_once
            require require_once
            命名空间
    几乎所有的类都是通过 \Magento\Framework\App\ObjectManager 的 create 方法创建的
    create 方法 之后才是 composer 的 loadClass 方法
        \Magento\Framework\App\ObjectManager create ->
        \Magento\Framework\ObjectManager\ObjectManager create ->
        \Magento\Framework\ObjectManager\Factory\AbstractFactory createObject

    模块下的这几个文件是什么时候加载的？
        etc/module.xml
        composer.json 这个是给 composer 用的，只有 composer 的命令会用到
        registration.php 也是通过 composer 的文件来加载的
            根目录下的 composer.json 里有声明
            引用这个文件 app/etc/NonComposerComponentRegistration.php
            NonComposerComponentRegistration.php 会加载全部模块下的 registration.php
            其实 registration.php 也只是运行一次 \Magento\Framework\Component\ComponentRegistrar::register


magento2 是如何读取配置的？
    没有缓存的
    有缓存的

    配置文件是通过这里读取的
    \Magento\Framework\Config\FileResolverInterface
    \Magento\Framework\Config\FileResolver
    获取配置文件路径
    vendor\magento\framework\Module\Dir\Reader.php
    读取配置文件内容
    vendor\magento\framework\Filesystem\File\Read.php

    这个是用于读取配置的
    \Magento\Framework\App\Config\ScopeConfigInterface \Magento\Framework\App\Config
        \Magento\Framework\App\Config\ScopeCodeResolver
        \Magento\Framework\App\Config\ConfigTypeInterface
            \Magento\Framework\App\Config\ConfigSourceInterface Magento\Config\App\Config\Type\System
                \Magento\Config\App\Config\Type\System\Reader
                    \Magento\Framework\App\Config\ConfigSourceInterface 这个接口似乎有很多实现的类
    这个是用于修改配置的，主要是针对数据库的 core_config_data 表
    \Magento\Config\Model\Config

    后台配置页的Controller
    vendor\magento\module-config\Controller\Adminhtml\System\Config\Edit.php

    最早的配置是在 \Magento\Framework\App\ObjectManagerFactory create 里读取的
    在这个方法中 \Magento\Framework\App\ObjectManagerFactory create
        会创建一个新的 ObjectManager 对象，
            会传入 \Magento\Framework\ObjectManager\FactoryInterface 对象，
            最早的 di 文件，
            最早的 $sharedInstances 这些对象是写死在代码里的



入口文件
    require __DIR__ . '/app/bootstrap.php';
        require_once __DIR__ . '/autoload.php'; // 在这个位置加载 composer
            ./vendor/autoload.php
    // 创建一个 Bootstrap 对象
    $bootstrap = \Magento\Framework\App\Bootstrap::create(BP, $_SERVER);
    // 创建一个 Application 对象
    $app = $bootstrap->createApplication(\Magento\Framework\App\Http::class);
        // Application 对象 也是通过 objectManager 对象创建的
        // $application = $this->objectManager->create($type, $arguments);
    // 通过 Bootstrap 对象 运行 Application 对象
    $bootstrap->run($app);
        // 这两句是关键
        $response = $application->launch(); // 处理请求
        $response->sendResponse(); // 输出响应

vendor\magento\framework\App\Http.php launch
    vendor\magento\framework\App\FrontController.php dispatch
        vendor/magento/framework/App/Router/DefaultRouter.php match // 匹配路由
        processRequest // 处理请求
            vendor\magento\framework\App\Request\ValidatorInterface.php validate // 判断请求是否合法
            getActionResponse // 处理请求
                执行 $actionInstance->dispatch($request); 或 $actionInstance->execute();
                $actionInstance 就是具体的控制器对象了
                从这里返回的就是 result 了
    renderResult


magento2 的命令行是通过 
\Magento\Framework\Console\Cli 继承 \Symfony\Component\Console\Application
后，直接调用 \Symfony\Component\Console\Application doRun 实现的
所以 magento2 的核心其实是
\Magento\Framework\App\Bootstrap
\Magento\Framework\App\ObjectManagerFactory
\Magento\Framework\App\ObjectManager

路由
    配置文件中的 routes.xml
    数据库中的表
        url_rewrite
        catalog_url_rewrite_product_category
view 下的 layout 下的 xml 文件的命名方式通常是，都是小写字母
    routeid_controller_action
    如果 routeid 或 controller 或 action 里有下滑线或大写字母时要怎么处理？
action类的 execute 方法通常是返回一个 \Magento\Framework\View\Result\Page 对象

action类的 execute 方法大概就返回四种 result
    \Magento\Framework\View\Result\page
    \Magento\Framework\Controller\Result\Json
    \Magento\Framework\Controller\Result\Raw
    \Magento\Framework\Controller\Result\Forward 转发到其它 action
    \Magento\Framework\Controller\Result\Redirect http的重定向
这些类都继承自 \Magento\Framework\Controller\AbstractResult

如何加载 page_layout 和 layout 还是有一点模糊

那些可以迅速定位问题的文件？各种入口？
http
    frontend
    backend
    rest
    graphql
        vendor\magento\framework\GraphQl\Query\QueryProcessor.php
console
    console
    cron

document.cookie="XDEBUG_SESSION=vscode"

-->
