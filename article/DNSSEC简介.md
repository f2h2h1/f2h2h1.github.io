DNSSEC 简介
================================

> 看懂这篇文章可能需要的前置知识
> DNS ，不对称加密，数字摘要，数字签名

DNSSEC（DNS Security Extensions） 域名系统安全扩展。
开启DNSSEC，可有效防止DNS欺骗和缓存污染等攻击。
它是通过数字签名来保证DNS应答报文的真实性和完整性。

## DNSSEC 的工作原理

一般的 DNS
```
查询 A 记录 -> 返回 A 记录的值
```

DNSSEC
1. 查询 A 记录
1. 查询 A 记录的 RRSIG
1. 查询域名的 DNSKEY ，获得 ZSK 和 KSK
1. 使用 ZSK 解密 RRSIG 和 计算 A 记录的数字摘要，对比解密的 RRSIG 和 A 记录的数字摘要
1. 如果结果一致，则继续查询 DS 记录和查询上一级域名的 DNSKEY
1. 上一级域名的 ZSK 解密 DS 和 计算 KSK 的数字摘要，对比解密的 DS 和 KSK 的数字摘要
1. 继续套娃，查询上一级域名的 DS ，直到根域名为止

整个验证的流程和 TLS 很相似

## 让域名支持 DNSSEC
1. 确认顶级域名支持 DNSSEC
1. 确认域名注册商支持 DNSSEC
    - 如果当前的域名注册商不支持，就想办法把域名转到能支持的域名注册商
1. 添加对应的记录
    1. RRSIG (Resource Record Signature) 资源记录签名 该记录用于存放当前域名每一条记录的签名
    1. DNSKEY (DNS Public Key) DNS 公钥
        - DNSKEY 会有两条记录
        - Zone-Signing Key（ZSK） 一般查询的记录由 ZSK 签名
        - Key-Signing Key（KSK） DNSKEY 记录也有 RRSIG ，由 KSK 签名
    1. DS (Delegation Signer) 授权签名 该记录记录中包含了上一级域名的 ZSK 对当前域名的 KSK 加密后的数字摘要
        - DS 记录也有 RRSIG ，由上一级域名的 ZSK 签名
    1. NSEC (Next Secure) 下一个安全的 用于验证不存在的资源记录
        - 其实笔者没搞明白，这个是用来干什么的

检查网站对 DNSSEC 的支持
- 用来测试网站对 DNSSEC 的支持 https://ipv6.ustc.edu.cn/onlinechecklog.php
- 查看 DNSSEC 的签名流程 https://dnsviz.net/
- 校验 DNSSEC https://dnssec-analyzer.verisignlabs.com/

## DNSSEC 的问题
1. 只有部分顶级域名支持
1. 即使顶级域名支持，还需要域名注册商的支持
1. 无法保证私密性
    - DNSSEC 并没有改变 DNS 基于 UDP 的通讯方式，数据流也都是明文传输， DNSSEC 所做的只是加上了一个数字签名，而中间人依然可以看到你请求了什么、结果是什么
1. 挟持发生时不能告诉用户真正的记录

## 其它

Windows 的 nslookup 不支持 DNSSEC 的记录查询。

最好还是用 dig 命令来检测 DNSSEC 。

## 参考
- https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-20-zh
- https://zh.wikipedia.org/zh-hans/%E5%9F%9F%E5%90%8D%E7%B3%BB%E7%BB%9F%E5%AE%89%E5%85%A8%E6%89%A9%E5%B1%95
- https://web.archive.org/web/20121220054102/http://www.cc.ntu.edu.tw/chinese/epaper/0022/20120920_2206.html
- https://cloud.google.com/dns/docs/dnssec?hl=zh-cn
- https://www.cloudflare.com/zh-cn/dns/dnssec/how-dnssec-works/
- https://blog.thecjw.me/?p=1221
- https://imlonghao.com/41.html
- https://guozeyu.com/2018/03/dnssec/
