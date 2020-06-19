mongodb分片
==============================

## MongoDB集群规划表
节点|主机|端口|副本集
-|-|-|-|
路由服务器0|Router|27017|
配置集节点0|ConfigServer1|27018|cfg
配置集节点1|ConfigServer2|27019|cfg
分片0节点0|rs0_0|27020|rs0
分片0节点1|rs0_1|27021|rs0
分片0节点2|rs0_2|27022|rs0
分片1节点0|rs1_0|27023|rs1
分片1节点1|rs1_1|27024|rs1
分片1节点2|rs1_2|27025|rs1

一个路由服务器
两个配置节点，一主一副本
两个分片，两个分片都是三个节点，一主二副本

## 集群部署的步骤

### 0.新建一些必要的文件和文件夹
日志文件，pid文件，以及存放数据的文件夹
```
rm -r -f /data/log && \
rm -r -f /data/pid && \
rm -r -f /data/mydb && \
mkdir /data/log && \
mkdir /data/pid && \
mkdir /data/mydb && \
mkdir /data/mydb/config0 && \
mkdir /data/mydb/config1 && \
mkdir /data/mydb/rs0_0 && \
mkdir /data/mydb/rs0_1 && \
mkdir /data/mydb/rs0_2 && \
mkdir /data/mydb/rs1_0 && \
mkdir /data/mydb/rs1_1 && \
mkdir /data/mydb/rs1_2 && \
touch /data/log/config0.log && \
touch /data/log/config1.log && \
touch /data/log/rs0_0.log && \
touch /data/log/rs0_1.log && \
touch /data/log/rs0_2.log && \
touch /data/log/rs1_0.log && \
touch /data/log/rs1_1.log && \
touch /data/log/rs1_2.log && \
touch /data/log/mongos.log && \
touch /data/pid/config0.pid && \
touch /data/pid/config1.pid && \
touch /data/pid/rs0_0.pid && \
touch /data/pid/rs0_1.pid && \
touch /data/pid/rs0_2.pid && \
touch /data/pid/rs1_0.pid && \
touch /data/pid/rs1_1.pid && \
touch /data/pid/rs1_2.pid && \
touch /data/pid/mongos.pid
```

### 1.部署配置节点
启动两个配置节点
```bash
mongod --configsvr --replSet "cfg" --bind_ip_all --port 27018 --fork --logpath /data/log/config0.log --logappend --pidfilepath /data/pid/config0.pid --dbpath /data/mydb/config0

mongod --configsvr --replSet "cfg" --bind_ip_all --port 27019 --fork --logpath /data/log/config1.log --logappend --pidfilepath /data/pid/config1.pid --dbpath /data/mydb/config1
```
进入第一个配置节点
```bash
mongo --port 27018
```

把配置节点加入副本集
```js
rs.initiate( {
   _id: "cfg",
   configsvr: true,
   members: [
      { _id: 0, host: "127.0.0.1:27018" },
      { _id: 1, host: "127.0.0.1:27019" }
   ]
} )
```
- 配置副本集最好有三个以上，一般配置副本集不需要仲裁服务器

### 2.部署分片节点
启动第一个分片的副本集
```bash
mongod --shardsvr --replSet "rs0" --bind_ip_all --port 27020 --fork --logpath /data/log/rs0_0.log --logappend --pidfilepath /data/pid/rs0_0.pid --dbpath /data/mydb/rs0_0

mongod --shardsvr --replSet "rs0" --bind_ip_all --port 27021 --fork --logpath /data/log/rs0_1.log --logappend --pidfilepath /data/pid/rs0_1.pid --dbpath /data/mydb/rs0_1

mongod --shardsvr --replSet "rs0" --bind_ip_all --port 27022 --fork --logpath /data/log/rs0_2.log --logappend --pidfilepath /data/pid/rs0_2.pid --dbpath /data/mydb/rs0_2
```
进入第一个分片的副本集的第一个节点
```bash
mongo --port 27020
```

把分片节点加入副本集
```js
rs.initiate( {
   _id : "rs0",
   members: [
      { _id: 0, host: "127.0.0.1:27020" },
      { _id: 1, host: "127.0.0.1:27021" },
      { _id: 2, host: "127.0.0.1:27022" }
   ]
})
```

启动第二个分片的副本集
```bash
mongod --shardsvr --replSet "rs1" --bind_ip_all --port 27023 --fork --logpath /data/log/rs1_0.log --logappend --pidfilepath /data/pid/rs1_0.pid --dbpath /data/mydb/rs1_0

mongod --shardsvr --replSet "rs1" --bind_ip_all --port 27024 --fork --logpath /data/log/rs1_1.log --logappend --pidfilepath /data/pid/rs1_1.pid --dbpath /data/mydb/rs1_1

mongod --shardsvr --replSet "rs1" --bind_ip_all --port 27025 --fork --logpath /data/log/rs1_2.log --logappend --pidfilepath /data/pid/rs1_2.pid --dbpath /data/mydb/rs1_2
```
进入第二个分片的副本集的第一个节点
```bash
mongo --port 27023
```

把分片节点加入副本集
```js
rs.initiate( {
   _id : "rs0",
   members: [
      { _id: 0, host: "127.0.0.1:27023" },
      { _id: 1, host: "127.0.0.1:27024" },
      { _id: 2, host: "127.0.0.1:27025" }
   ]
})
```

- 副本集里应该至少有一个仲裁服务器

### 3.部署路由节点

启动路由节点
```bash
mongos --configdb cfg/127.0.0.1:27018,127.0.0.1:27019 --bind_ip_all --port 27017 --fork --logpath /data/log/mongos.log --logappend --pidfilepath /data/pid/mongos.pid
```

进入路由节点
```bash
mongo --port 27017
```

把两个分片加入到路由里
```js
sh.addShard("rs0/127.0.0.1:27020,127.0.0.1:27021,127.0.0.1:27022")
sh.addShard("rs1/127.0.0.1:27023,127.0.0.1:27024,127.0.0.1:27025")
```

创建分片集合
```
sh.enableSharding('需要分片的库名')
sh.shardCollection('需要分片的库名.需要分片集合名', {'片键':'hashed'})
```

- 如果有多个路由，只需要配置一个即可

## 一些常用的命令

查看集群状态
```js
sh.status()
```
查看分片状态
```js
db.stats()
```
查看是否为主节点
```js
db.isMaster()
```
