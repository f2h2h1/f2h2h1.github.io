# MySQL 的时间类型和时间相关的函数

## 类型

| |日期时间类型|占用空间|日期格式|最小值|最大值|零值表示|描述|
|-|-|-|-|-|-|-|-|
|DATETIME|8|bytes|YYYY-MM-DD HH:MM:SS|1000-01-01 00:00:00|9999-12-31 23:59:59|0000-00-00 00:00:00|年月日时分秒毫秒|
|TIMESTAMP|4|bytes|YYYY-MM-DD HH:MM:SS|1970-01-01 08:00:01|2038-01-19 03:14:07|00000000000000|年月日时分秒毫秒|
|DATE|4|bytes|YYYY-MM-DD|1000-01-01|9999-12-31|0000-00-00|年月日|
|TIME|3|bytes|HH:MM:SS|-838:59:59|838:59:59|00:00:00|时分秒|
|YEAR|1|bytes|YYYY|1901|2155|0000|年|

- 在本文的语境里，这些类型会被称为时间类型
- 这些类型的增删查改需要用符合 iso 8601 格式的字符串
- int 也可以算一种，保存 10 位时间戳
- bigint 也可以算一种，保存 13 位时间戳
- 其实直接存字符串也可以可以的
- 但用整型或字符串保存时间就用不了 mysql 里时间处理的函数
    - 又或者需要转换一次才能使用 mysql 里时间处理的函数
- 内置的变量 CURRENT_TIMESTAMP
- 对于 TIMESTAMP ，在插入数据时会根据当前的时区设置，转换对应的 utc 时间，查询时也会根据当前的时间进行转换
    - 例如
        - 插入时的值是 2021-06-01 08:00 ，时区是 utc+8
        - 如果查询时的时区也是 utc+8 ，那么查询的值也是 2021-06-01 08:00 ；如果查询时的时区是 utc+0 ，那么查询的值是 2021-06-01 00:00
- 对于 DATETIME ，则不会受时区的影响

## 函数
### 获取当前时间

```sql
select NOW(); # 当前的年月日时分秒，当前时区的
select CURDATE(); # 当前的年月日，当前时区的
select CURTIME(); # 当前的时分秒，当前时区的
select UTC_TIMESTAMP(); # 当前的年月日时分秒，utc时区的
select UTC_DATE(); # 当前的年月日，utc时区的
select UTC_TIME(); # 当前的时分秒，utc时区的
select UNIX_TIMESTAMP(); # 当前的10位时间戳

select DATE(NOW()); # 当前的年月日
select TIME(NOW()); # 当前的时分秒
select YEAR(NOW()); # 当前的年
select MONTH(NOW()); # 当前的月
select DAY(NOW()); # 当前的日
select HOUR(NOW()); # 当前的时
select MINUTE(NOW()); # 当前的分
select SECOND(NOW()); # 当前的秒

```

CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP,
LOCALTIME(), LOCALTIME,
LOCALTIMESTAMP(), LOCALTIMESTAMP,
这些都是 NOW() 的别名

CURRENT_DATE(), CURRENT_DATE 这两个是 CURDATE() 的别名
CURRENT_TIME(), CURRENT_TIME 这两个是 CURTIME() 的别名

### 转换

在这个章节的语境下，时间戳是指 10 位长度的类型为整型的时间戳

- 字符串 -> 时间戳 UNIX_TIMESTAMP
    ```sql
    select UNIX_TIMESTAMP('2022-04-07T00:00:00+08:00');
    ```

- 字符串 -> 时间类型 DATE_FORMAT
    ```sql
    DATE_FORMAT('2022-04-07T00:00:00+08:00', "%Y-%m-%d %H:%i");
    ```

- 时间类型 -> 字符串 DATE_FORMAT
    ```sql
    DATE_FORMAT(NOW(), "%Y-%m-%d %H:%i:%s");
    ```

- 时间类型 -> 时间戳 UNIX_TIMESTAMP
    ```sql
    select UNIX_TIMESTAMP(NOW());
    ```

<!-- - 时间戳 -> 字符串 FROM_UNIXTIME -->
- 时间戳 -> 时间类型 FROM_UNIXTIME
    ```sql
    FROM_UNIXTIME(1649260800);
    FROM_UNIXTIME(1649260800, "%Y-%m-%d %H:%i:%s");
    ```

- DATE_FORMAT 和 FROM_UNIXTIME 会根据 format 转换成不同的类型，例如 %Y-%m-%d 会转换成 date 类型， %Y-%m-%d %H:%i 会转换成 datetime 类型

### 计算

- 计算两个时间差的函数
    - timestampdiff
    - timediff
    - datediff

- 计算时间偏移的函数
    - 向后偏移 date_add
    - 向前偏移 date_sub
    - 偏移的单位
        - microsecond 微秒
        - frac_second 毫秒
        - second
        - minute
        - hour
        - day
        - week
        - month
        - quarter 季度
        - year
    - 例子
        ```
        # 后一天
        select date_add(CURDATE(), interval 1 day);
        select date_sub(CURDATE(), interval -1 day);
        # 前一天
        select date_sub(CURDATE(), interval 1 day);
        select date_add(CURDATE(), interval -1 day);
        # 前24小时
        select date_sub(NOW(), interval 1 day);
        select date_add(NOW(), interval -1 day);
        ```

### 和星期相关的

|函数|描述|
|-|-|
|week(date [,mode]); | 一年中的第几周，礼拜日是第一天，索引从 0 开始 |
|weekofyear(date); | 一年中的第几周，索引从 1 开始，相当于 week(date, 3) |
|dayofweek(date); | 一周中的第几天，礼拜日是第一天，索引从 1 开始 |
|weekday(date); | 一周中的第几天，礼拜一是第一天，索引从 0 开始 |
|yearweek(date [,mode]); | 返回年份和周数，例如 2022-04-21 会返回 202216 ，表示 2022 年和当年的第16周 |

week 和 yearweek 的 mode 是一样的。
mode 的默认值来自系统变量 default_week_format 。
可以这样查看 SHOW VARIABLES LIKE 'default_week_format';
一般情况下 default_week_format 的值是 0 。

mode|一周的第一天|范围|第一周是怎么计算的
-|-|-|-
0|星期日|0-53|从本年的第一个星期日开始，是第一周。前面的计算为第0周
1|星期一|0-53|假如1月1日到第一个周一的天数超过3天，则计算为本年的第一周。否则为第0周
2|星期日|1-53|从本年的第一个星期日开始，是第一周。前面的计算为上年度的第5x周
3|星期一|1-53|假如1月1日到第一个周日天数超过3天，则计算为本年的第一周。否则为上年度的第5x周
4|星期日|0-53|假如1月1日到第一个周日的天数超过3天，则计算为本年的第一周。否则为第0周
5|星期一|0-53|从本年的第一个星期一开始，是第一周。前面的计算为第0周。
6|星期日|1-53|假如1月1日到第一个周日的天数超过3天，则计算为本年的第一周。否则为上年度的第5x周
7|星期一|1-53|从本年的第一个星期一开始，是第一周。前面的计算为上年度的第5x周

### sysdate 和 now 的区别
sysdate() 日期时间函数跟 now() 类似，不同之处在于：
now() 在执行开始时值就得到了，
sysdate() 在函数执行时动态得到值。

例子
```
select now(), sleep(3), now(), sysdate();
# sleep 会返回 0
# 两个 now 是一样的
# sysdate 会比 now 慢 3 秒
```

### mysql 时间的格式

https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_date-format

这几个函数都通用
DATE_FORMAT(), FROM_UNIXTIME(), STR_TO_DATE(), TIME_FORMAT(), UNIX_TIMESTAMP().

### 还有更多

```
convert_tz
extract
timestamp
timestampadd
sec_to_time
time_to_sec
makedate
maketime
to_days
LAST_DAY
ADDTIME
sysdate
sleep
```

各个函数的输入和输出好像都有一点混乱
- 例如 可以输入 时间戳 时间字符串 时间类型，然后又可以输出 时间戳 时间字符串 时间类型
- 大致的规律
    - 如果是格式化的函数会返回字符串 varchar
    - 如果是没有小数的时间戳会返回 integer
    - 如果是有小数的时间戳会返回  decimal
    - 如果是有 年月日时分秒 的时间会返回 datetime
    - 其它情况会返回对应的时间类型
    - 好像 timeatmp 这种类型没有函数会返回

因为 mysql 的文档里函数名都是大写的，所以自己写的代码最好还是都是大写吧，虽然都是大小写不敏感。

## MySQL 的时区

MySQL 的时区分为三部分，系统时区，服务器时区，会话时区。

优先级
```
系统时区 < 服务器时区 < 会话时区
```

如果会话时区会空，则会使用服务器时区，如果服务器时区为空，则会使用系统时区

查看系统时区 服务器时区 会话时区
```
select @@global.system_time_zone, @@global.time_zone, @@session.time_zone;
```

可以在 linux 的命令行里用这样的命令来查看时区
```bash
date +"%z"
# git for windows 的 bash 也支持这个命令
```

可以在 windows 的命令行里用这样的命令来查看时区
```powershell
tzutil /g
# 或
w32tm /tz
# 或
systeminfo
# 似乎只有 win10 及之后的系统能用 tzutil /g 或 w32tm /tz
```

修改会话时区
```
set session time_zone='+08:00';
```

修改服务器时区
- 修改配置文件，然后重启 MySQL
    ```ini
    [mysqld]
    default-time-zone='+08:00'
    ```
- 在启动的命令行里添加参数，这个参数在8.0似乎没有效果
    ```
    mysqld --default-time-zone='+08:00'
    # 如果没有效果就用 --init-command 参数
    mysqld --init-command="set session time_zone='+08:00';"
    ```
- 用 sql 语句修改
    ```sql
    set global time_zone='+08:00';
    flush privileges;
    ```

## 其它
### 时间表示格式

iso 8601
- https://www.iso.org/iso-8601-date-and-time-format.html
- https://zh.wikipedia.org/wiki/ISO_8601
- https://baike.baidu.com/item/ISO%208601/3910715

### 一些例子
### 其它位置的时区
- 系统的时区
- 应用的时区
- 前端的时区

## 参考

- https://dev.mysql.com/doc/refman/8.0/en/date-and-time-types.html
- https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html
- https://dev.mysql.com/doc/refman/8.0/en/date-and-time-type-conversion.html
- https://www.begtut.com/sql/sql-ref-mysql.html
- https://www.cnblogs.com/Yunya-Cnblogs/p/13585119.html

<!--
要注意日期时间的问题
00:00:00 23:59:59

select
    DATE_SUB(DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), interval 1 month)), interval 1 day), interval 1 second) as `一个月前的最后一天`,
    DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), interval 4 month)), interval 1 day), '%Y-%m-%d %H:%i:%s') as `三个月前的第一天`,
    DATE_SUB(DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), interval 4 month)), interval 1 day), interval 1 second) as `四个月前的最后一天`,
    DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), interval 5 month)), interval 1 day), '%Y-%m-%d %H:%i:%s') as `四个月前的第一天`,
    @@global.system_time_zone, @@global.time_zone, @@session.time_zone
;

在 mysql 中 CST ，至少有两种含义
Central Standard Time (USA) UT-6:00 美国标准时间
China Standard Time UT+8:00 中国标准时间

比较保险的方式是通过 select now(); 对比一下当前的时间

修改 global.time_zone 的值，改成 +08:00 这种形式
set global time_zone='+08:00';
flush privileges;

./mysql -uroot -p --init-command="set session time_zone='+08:00';"

-->
