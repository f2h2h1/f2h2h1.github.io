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

启用了 DNSSEC 的 DNS
```
查询 A 记录 -> 返回 A 记录的值和 A 记录的 RRSIG
```

DNSSEC 大致的验证流程
1. 查询 A 记录
    - 在请求报文里的 Additional 加上 DNSSEC
1. 从响应报文里获取 RRSIG 记录
1. 从 RRSIG 记录获取 singer （singer 是一个域名，可能同一级域名也可能是上一级域名）
1. 查询 singer 的 DNSKEY 记录，获得 ZSK 和 KSK
1. 使用 ZSK 验证 A 记录的 RRSIG
1. 如果结果一致，继续查询 singer 的 DS 记录
1. 对比 KSK 的数字摘要和 DS 记录里的是否一致
1. 如果结果一致，继续查询 singer 上一级域名的 DNSKEY
1. 用上一级域名的 ZSK 验证 DS 记录的 RRSIG
1. 如果结果一致，继续套娃，查询上一级域名的 DS ，直到根域名为止
    - 整个验证的流程和 TLS 的证书链有点相似

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
    1. DS (Delegation Signer) 授权签名
        - KSK 的数字摘要
        - DS 记录也有 RRSIG ，由上一级域名的 ZSK 签名
    1. NSEC (Next Secure) 下一个安全的 用于验证不存在的资源记录
        - 其实笔者没搞明白，这个是用来干什么的
        <!-- - 用于说明该域名下有哪些记录，从而可以用排除法证明该域名下没有哪些记录。 -->

检查网站对 DNSSEC 的支持
- 用来测试网站对 DNSSEC 的支持 https://ipv6.ustc.edu.cn/onlinechecklog.php
- 查看 DNSSEC 的签名流程 https://dnsviz.net/
- 校验 DNSSEC https://dnssec-analyzer.verisignlabs.com/
- 查看 DNS 的各类记录 https://www.nslookup.io/

## DNSSEC 记录

现在的 DNSSEC 至少有 8 种记录类型
- RRSIG (digital resource record signature)
- DNSKEY (public key)
- DS (parent-child)
- NSEC (proof of nonexistence)
- NSEC3 (proof of nonexistence)
- NSEC3PARAM (proof of nonexistence)
- CDS (child-parent signaling)
- CDNSKEY (child-parent signaling)

下面几个小节主要是描述响应报文里的 Answer 的 RDATA

### DNSKEY

- Flags
    - 256 ZSK
    - 257 KSK
- Protocol
     - 固定值 3 ，表示 DNSSEC
- Algorithm 不对称加密算法
    - 1 = RSA/MD5
    - 2 = Diffie-Hellman (This is not supported by BIND and Infoblox appliances.)
    - 3 = DSA
    - 4 = Reserved
    - 5 = RSA/SHA1
    - 6 = DSA/SHA1/NSEC3
    - 7 = RSA/SHA1/NSEC3
    - 8 = RSA/SHA-256
    - 9 = Reserved
    - 10 = RSA/SHA-512
    - 11 = Reserved
    - 12 = GOST R 34.10-2001
    - 13 = ECDSA-P256-SHA-256
- Key
    - 公钥的 base64 字符串

Algorithm 的列表
https://www.iana.org/assignments/dns-sec-alg-numbers/dns-sec-alg-numbers.xhtml

rfc 4034 里明确的表示不建议使用 RSA/MD5 作为加密算法

### DS

- KeyTag
    - 根据公钥计算出来的
- Algorithm
    - 和对应的 DNSKEY 的 Algorithm 一致
- DType 散列算法
    - 1 = SHA-1
    - 2 = SHA-256
- Digest
    - ksk 的散列值

KeyTag 的生成方式

伪代码
```
unsigned int
keytag (
        unsigned char key[],  /* the RDATA part of the DNSKEY RR */
        unsigned int keysize  /* the RDLENGTH */
        )
{
        unsigned long ac;     /* assumed to be 32 bits or larger */
        int i;                /* loop index */

        for ( ac = 0, i = 0; i < keysize; ++i )
                ac += (i & 1) ? key[i] : key[i] << 8;
        ac += (ac >> 16) & 0xFFFF;
        return ac & 0xFFFF;
}
```

php
```php
$flags = 257;
$protocol = 3;
$algorithm = 13;
$publicKey = 'mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rAK9iUzy1L53eKGQ==';

$bin = pack('nCC', $flags, $protocol, $algorithm);
$bin .= base64_decode($publicKey);

$keytag = array_sum(unpack('n*', $bin));
$keytag += ($keytag >> 16) & 0xFFFF;
$keytag = $keytag & 0xFFFF;
```

Digest 的生成方式

伪代码
```
digest = digest_algorithm( DNSKEY owner name | DNSKEY RDATA);
DNSKEY RDATA = Flags | Protocol | Algorithm | Public Key.
```

php
```php
$domainName = 'nslookup.io.';
$flags = 257;
$protocol = 3;
$algorithm = 13;
$publicKey = 'mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rAK9iUzy1L53eKGQ==';
$publicKey = base64_decode($publicKey);

$domainNameBin = '';
foreach (explode('.', $domainName) as $part) {
    $domainNameBin .= pack('C', strlen($part));
    $domainNameBin .= $part;
}
if (substr($domainName, -1) !== '.') {
    $domainNameBin .= pack('C', 0);
}

$rdata = pack('nCC', $flags, $protocol, $algorithm);
$rdata .= $publicKey;

$data = $domainNameBin . $rdata;

$digest_algo = 'sha256';
$digest = openssl_digest($data, $digest_algo);
```

### RRSIG

- Type Covered
- Algorithm
- Number of Labels
    - 域名的层级，例如 nslookup.io 就是 2
- RRset TTL
- Expiration Time
    - 记录的过期时间
- Inception Time
    - 记录的生效时间
- Key Tag
- Signature Name
    - 就是域名，包含根，例如 nslookup.io.
- Signature
    - 签名

## DNSSEC 的问题
1. 只有部分顶级域名支持
1. 即使顶级域名支持，还需要域名注册商的支持
1. 无法保证私密性
    - DNSSEC 并没有改变 DNS 基于 UDP 的通讯方式，数据流也都是明文传输， DNSSEC 所做的只是加上了一个数字签名，而中间人依然可以看到你请求了什么、结果是什么
1. 挟持发生时不能告诉用户真正的记录
1. 如果要让互联网变得更加安全，那么其它层面的保护（例如 TLS 证书和 DoH ）同样重要。

## 其它

Windows 的 nslookup 不支持 DNSSEC 的记录查询。

PowerShell 的 cmdlet Resolve-DnsName 支持 DNSSEC 的记录查询。
```
Resolve-DnsName www.nslookup.io -type A -DnssecOk -server 8.8.8.8
```

最好还是用 dig 命令来检测 DNSSEC 。
```
dig @8.8.8.8 www.nslookup.io +dnssec
```

## 参考
- https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-20-zh
- https://zh.wikipedia.org/zh-hans/%E5%9F%9F%E5%90%8D%E7%B3%BB%E7%BB%9F%E5%AE%89%E5%85%A8%E6%89%A9%E5%B1%95
- https://web.archive.org/web/20121220054102/http://www.cc.ntu.edu.tw/chinese/epaper/0022/20120920_2206.html
- https://cloud.google.com/dns/docs/dnssec?hl=zh-cn
- https://www.cloudflare.com/zh-cn/dns/dnssec/how-dnssec-works/
- https://blog.thecjw.me/?p=1221
- https://imlonghao.com/41.html
- https://guozeyu.com/2018/03/dnssec/

- https://bind9.readthedocs.io/en/v9_17_10/dnssec-guide.html
- https://docs.infoblox.com/display/NAG8/DNSKEY+Resource+Records
- https://docs.infoblox.com/display/NAG8/RRSIG+Resource+Records
- https://docs.infoblox.com/display/NAG8/DS+Resource+Records
- https://datatracker.ietf.org/doc/html/rfc3225
- https://datatracker.ietf.org/doc/html/rfc4033
- https://datatracker.ietf.org/doc/html/rfc4034
- https://datatracker.ietf.org/doc/html/rfc4035
