# 使用 shell 实现的 kv 数据库

写这份脚本的灵感来自这本书《设计数据密集型应用》 https://github.com/Vonng/ddia

在这本书的第三章里提及了一个使用 shell 实现的数据库
```sh
#!/bin/bash
db_set () {
  echo "$1,$2" >> database
}
db_get () {
  grep "^$1," database | sed -e "s/^$1,//" | tail -n 1
}
```

笔者在这段小脚本的基础上进行了一些拓展。新增了一些功能，例如 del show 之类的。

这份脚本依赖这几个程序，可以使用类似这样的命令 `./shdb.sh test` 来判断当前环境是否有这些程序
- sh
- grep
- sed
- awk
- cat
- tac
- tail
- cut
- tr

可以使用类似这样的命令 `./shdb.sh help` 来输出使用帮助

这份脚本可以在 git for windows 的 git bash 里运行

## 源码

```sh
#!/bin/sh

SHELL_FOLDER=""

if [ -z "$SHELL_FOLDER" ]; then
    SHELL_FOLDER=$(dirname $(readlink -f "$0"))
fi

DB_PATH="$SHELL_FOLDER/$2.csv"

version() {
    echo "0.0.1"
}
help() {
    echo "version: "$(version)
    echo "folder: "$SHELL_FOLDER
    echo ""
    cat << EOF
Usage:
    command [arguments]

Command:
    version     
    help        
    test        test dependence
    create      create table
                example: ./dbsh.sh create default
    remove      remove table
                example: ./dbsh.sh remove default
    list        show all table
                example: ./dbsh.sh list
    rename      rename table
                example: ./dbsh.sh rename old_name new_name
    reindex     rebuild index
                example: ./dbsh.sh reindex default
    set         set a value by key
                example: ./dbsh.sh set default key1 value
    get         get a value by key
                example: ./dbsh.sh get default key1
    del         delete a value by key
                example: ./dbsh.sh del default key1
    truncate    truncate table
                example: ./dbsh.sh truncate default
    show        show all data for a table
                example: ./dbsh.sh show default
    rawshow     show all data for a table with out format
                example: ./dbsh.sh rawshow default

Note:
    file is saved in CSV format.
    set can overwrite old data.
    modify this variable SHELL_FOLDER to change the directory.
    key is a keyword, you can not use it.
EOF
}
db_create() {
    if [ ! -f "$1" ]; then
        echo "key,value" >> $1
    else
        echo "$1 already exists"
        return 1
    fi
}
db_remove() {
    if [ -f "$1" ]; then
        rm $1
    fi
}
db_list() {
    ls $(echo $SHELL_FOLDER'/*.csv')
}
db_rename() {
    old=$SHELL_FOLDER'/'$1'.csv'
    new=$SHELL_FOLDER'/'$2'.csv'
    if [ ! -f "$old" ]; then
        echo "$old  does not exist"
        return 1
    fi
    if [ -f "$new" ]; then
        echo "$new already exists"
        return 1
    fi
    mv $old $new
}
db_reindex() {
    if [ ! -f "$1" ]; then
        echo "$1 does not exist"
        return 1
    fi
    sed -i '/^[  \t]*$/d' $1
    tac $1 | awk -F, '!a[$1]++{print}' | tac > $1
}
db_set() {
    if [ $2 == "key" ]; then
        echo "set fail, key is keyword"
        return 1
    fi
    if [ -f "$1" ]; then
        echo "$2,$3" >> $1
    fi
}
db_get() {
    if [ -f "$1" ]; then
        grep "^$2," $1 | sed -e "s/^$2,//" | tail -n 1
    fi
}
db_del() {
    if [ -f "$1" ]; then
        sed -i $(grep -n "^$2," $1 | cut -d  ":" -f 1 | sed -e "s/$/d/g" | tr "\n" ";")'' $1
    fi
}
db_truncate() {
    sed -i '2,$d' $1
}
db_show() {
    if [ ! -f "$1" ]; then
        echo "$1 does not exist"
        return 1
    fi
    tac $1 | awk -F, '!a[$1]++{print}' | tac | cat -n
}
db_rawshow() {
    if [ ! -f "$1" ]; then
        echo "$1 does not exist"
        return 1
    fi
    cat $1
}
db_test() {
    test_dependence() {
        type $1 > /dev/null 2>&1
        if [ ! $? -eq 0 ]; then
            echo "no $1"
            echo "test fail"
            exit 1
        fi
        echo "    $1 ok"
    }
    echo "SHELL_FOLDER is $SHELL_FOLDER"
    if [ ! -d $SHELL_FOLDER ]; then
        echo "SHELL_FOLDER is not existent"
        exit 1
    else
        echo "SHELL_FOLDER is existent"
    fi
    if [ ! -r $SHELL_FOLDER ]; then
        echo "SHELL_FOLDER can not read"
        exit 1
    else
        echo "SHELL_FOLDER can read"
    fi
    if [ ! -w $SHELL_FOLDER ]; then
        echo "SHELL_FOLDER can not write"
        exit 1
    else
        echo "SHELL_FOLDER can write"
    fi
    echo "test dependence"
    test_dependence sh
    test_dependence grep
    test_dependence sed
    test_dependence awk
    test_dependence cat
    test_dependence tac
    test_dependence tail
    test_dependence cut
    test_dependence tr
    echo "passed the test"
}
case $1 in
    "h"|"help")
        help
    ;;
    "v"|"version")
        version
    ;;
    "create")
        db_create $DB_PATH
    ;;
    "remove")
        db_remove $DB_PATH
    ;;
    "list")
        db_list
    ;;
    "rename")
        db_rename $2 $3
    ;;
    "reindex")
        db_reindex $DB_PATH
    ;;
    "set")
        db_set $DB_PATH $3 $4
    ;;
    "get")
        db_get $DB_PATH $3
    ;;
    "del")
        db_del $DB_PATH $3
    ;;
    "truncate")
        db_truncate $DB_PATH
    ;;
    "show")
        db_show $DB_PATH
    ;;
    "rawshow")
        db_rawshow $DB_PATH
    ;;
    "test")
        db_test
    ;;
    *)
        help
    ;;
esac
EXIT_CODE=$?
if [ ! $EXIT_CODE -eq 0 ]; then
    exit $EXIT_CODE
fi
exit 0
```
