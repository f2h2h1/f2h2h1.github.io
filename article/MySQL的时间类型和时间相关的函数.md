# MySQL 的时间类型和时间相关的函数

## 类型

| |日期时间类型|占用空间|日期格式|最小值|最大值|零值表示|描述|
|-|-|-|-|-|-|-|-|
|DATETIME|8|bytes|YYYY-MM-DD HH:MM:SS|1000-01-01 00:00:00|9999-12-31 23:59:59|0000-00-00 00:00:00|有时区的年月日时分秒毫秒|
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

## 函数
### 获取当前时间

```sql
select NOW();
select CURDATE();
select CurTime();
select CURRENT_DATE();
select CURRENT_TIME();
select CURRENT_TIMESTAMP();
select DATE(NOW());
select TIME(NOW());
select YEAR(NOW());
select month(NOW());
select DAY(NOW());
select Hour(NOW());
select Minute(NOW());
select second(NOW());
select unix_timestamp();
```

### 转换

在这个章节的语境下，时间戳是指 10 位长度的类型为整型的时间戳

- 字符串 -> 时间戳 unix_timestamp
    ```sql
    select unix_timestamp('2022-04-07T00:00:00+08:00');
    ```

- 字符串 -> 时间类型 str_to_date
    ```sql
    date_format('2022-04-07T00:00:00+08:00', "%Y-%m-%d %H:%i");
    ```

- 时间类型 -> 字符串 date_format
    ```sql
    date_format(now(), "%Y-%m-%d %H:%i:%s");
    ```

- 时间类型 -> 时间戳 unix_timestamp
    ```sql
    select unix_timestamp(now());
    ```

<!-- - 时间戳 -> 字符串 from_unixtime -->
- 时间戳 -> 时间类型 from_unixtime
    ```sql
    from_unixtime(1649260800);
    from_unixtime(1649260800, "%Y-%m-%d %H:%i:%s");
    ```

- date_format 和 from_unixtime 会根据 format 转换成不同的类型，例如 %Y-%m-%d 会转换成 date 类型， %Y-%m-%d %H:%i 会转换成 datetime 类型

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
        - 后一天
        ```
        select date_add(now(), interval 1 day);
        select date_sub(now(), interval -1 day);
        ```
        - 前一天
        ```
        select date_sub(now(), interval 1 day);
        select date_add(now(), interval -1 day);
        ```

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

```
week(now()), weekofyear(now()); -- 一年中的第几周
dayofweek(now()); -- 一周中的第几天，礼拜日是第一天
weekday(now()); -- 一周中的第几天，礼拜一是第一天，索引从 0 开始
yearweek(now()); -- 返回年份和周数，例如 2022-04-21 会返回 202216 ，表示 2022 年和当年的第16周
```

```
sysdate() 日期时间函数跟 now() 类似，不同之处在于：now() 在执行开始时值就得到了， sysdate() 在函数执行时动态得到值
select now(), sleep(3), now(), sysdate();
sleep 会返回 0
两个 now 是一样的
sysdate 会比 now 慢 3 秒
```

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

可以在系统的命令行里用这样的命令来查看时区
```
date +"%z"
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
- 在启动的命令行里添加参数
    ```
    mysqld --default-time-zone='+08:00'
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
