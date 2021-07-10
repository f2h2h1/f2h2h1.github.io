paypal，firtdata，支付宝的不完整接入指南
========

## paypal 的不完整接入指南

1. 看文档

发起支付的文档 https://developer.paypal.com/docs/paypal-payments-standard/integration-guide/formbasics/

回调的文档 https://developer.paypal.com/docs/api-basics/notifications/ipn/IPNandPDTVariables/#buyer-information-variables


2. 申请 paypal 账号，并登入 paypal 开发者中心
- 在开发者中心可以自己新建商家账号，虚拟信用卡和设置测试用的回调地址
- 回调地址设置后通常一段时间才能生效，通常是一天
- paypal 表单里提交的回调地址要和后台设置的回调地址一致

## firstdata 的不完整接入指南

1. firstdata 的文档

https://support.payeezy.com/hc/en-us/articles/203992129

https://support.payeezy.com/hc/en-us/articles/203992129-Hosted-Checkout-Payment-Pages-Integration-Manual

https://support.payeezy.com/hc/en-us/articles/204685325-Hosted-Payment-Page-Quick-Reference-Guide

https://support.payeezy.com/hc/en-us/articles/204504185-How-to-test-CVD-CVV-CVV2-functionality

https://support.payeezy.com/hc/en-us/articles/203730579-Payeezy-Gateway-Demo-Accounts

https://support.payeezy.com/hc/en-us/articles/203993149-How-do-I-choose-between-Receipt-Link-Silent-Post-and-Relay-Response

https://support.payeezy.com/hc/en-us/articles/204504235-Using-test-credit-card-numbers


2. 申请测试账号

https://support.payeezy.com/hc/en-us/articles/203730579


测试信用卡
|     |   |
| :---- | :---- |
| 持卡人姓名  | asd |
| 卡号  | 4111111111111111 |
| 有效日期  | 1221 |
| 安全码  | 1234 |


测试不成功的事务
https://support.payeezy.com/hc/en-us/articles/204504175-How-to-generate-unsuccessful-transactions-during-testing-

银行响应代码
https://support.payeezy.com/hc/en-us/articles/203730509-First-Data-Global-Gateway-e4-Bank-Response-Codes

收款网关响应代码
https://support.payeezy.com/hc/en-us/articles/203730499-eCommerce-Response-Codes-ETG-e4-Transaction-Gateway-Codes-

- 测试支付失败的情况

把订单金额设为 5000.00 - 5999.00 之间的数值，就能测试支付失败的情况，同样地如果支付金额在这个区间，测试时遇到支付失败，不要感到惊讶，因为这个区间就是用来测试支付失败的

例子
```
测试 银行响应代码 200 把金额设为 5200.00
测试 收款网关响应代码 42 把金额设为 5000.42
同时测试两个 把金额设为 5200.42
```
需要三次支付失败才会有支付失败的回调

3. 写接入相关的代码并利用测试账号测试

<!--
可以参考这个类 `frontend\models\payment\Firstdata.php` 和这篇文档 《FirstData 后台的设置》
> 当前 firstdata 的接入方式可以显示标准收据页面的同时又有回调
-->

## 判断 paypal 和 firstdata 是否有回调
1. 在 paypal 或 firstdata 的后台正确地设置回调地址
1. 后端的代码有正确地部署，特别是 nginx 的 url 重写
1. 正确地构造 form 表单，能打 paypal 或 firstdata 的支付页面，支付后能转跳到支付成功的页面
1. 最后是后端自行构造 form 表单测试，不要依赖前端的页面
1. 查看对应站点的 nginx 的 acceaa 日志，如无意外应该能找到一个海外的 ip 访问回调地址的记录。支付完成到有回调记录，大概需要 3 分钟左右，超过 5 分钟还没有回调记录那就应该是确实没有回调的了
1. 只要 nginx 的 acceaa 日志有回调记录就是有回调的了，至于订单状态没有更新的，可能是代码的问题
1. 更好的方法应该是主动查询订单的支付结果，主动查询订单结果需要有 paypal 和 firstdata 的账号密码

## 支付宝 的不完整接入指南

支付宝的支付流程 和 PayPal ， FirstData 的支付流程大致一样

### 支付宝需要
1. appid
1. 应用私钥
1. 应用公钥证书
1. 支付宝公钥证书
1. 支付宝根证书

生成密钥对
https://opendocs.alipay.com/open/291/105971#%E5%85%AC%E9%92%A5%E8%AF%81%E4%B9%A6%E6%96%B9%E5%BC%8F

下载开发者工具
https://opendocs.alipay.com/open/291/introduce#%E5%B7%A5%E5%85%B7%E4%B8%8B%E8%BD%BD

这是获取各类凭据大致的流程
1. 下载开发者工具
2. 用开发者工具以公钥证书的方式生成 应用公钥 和 应用私钥
3. 然后再生成 CSR 文件
4. 然后 登录 开发者中心控制台 上传 CSR 文件
5. 上传 CSR 文件后，就可以下载 应用公钥证书 ， 支付宝公钥证书 ， 支付宝根证书

### sdk 文档
https://opendocs.alipay.com/open/00y8k9

支付宝 sdk 关注这四个接口就可以的了

Payment（支付能力）	Page（电脑网站）	pay（生成交易表单，渲染后自动跳转支付宝网站引导用户完成支付）

Payment（支付能力）	Wap（手机网站）	pay（生成交易表单，渲染后自动跳转支付宝网站引导用户完成支付）

Payment（支付能力）	Common（通用）	verifyNotify（异步通知验签）

Payment（支付能力）	Common（通用）	query（查询交易）

- 付款完成的页面会通过 302 转跳到
- 如果一直没有回调的通知应该要主动地查询交易

这是支付回调的文档
https://opendocs.alipay.com/open/270/105902

php 的 composer 包
https://github.com/alipay/alipay-easysdk/tree/master/php

### 设置沙箱环境
https://opendocs.alipay.com/open/200/105311

https://opensupport.alipay.com/support/helpcenter/207/201602504480?ant_source=zsearch
