git的笔记
================================

- 在当前目录创建 git 仓库
```
git init
```

- 把文件添加到暂存区
```
git add 文件名
```

- 把暂存区的内容提交到当前分支
```
git commit -m "这是注释"
```

- 克隆远程仓库
```
git clone 远程仓库地址
```

- 克隆到指定的目录
```
git clone 远程仓库地址 目录
```

- 把远程仓库的修改更新到本地
```
git pull
```

- 把本地修改推送到远程仓库，master 是远程分支名，这里可以替换成其它分支名
```
git push origin master
```

- 新建 git 分支
```
git branch 分支名
```

- 切换到分支
```
git checkout 分支名
```

- 查看本地分支
```
git branch
```

- 查看所有分支
```
git branch -a
```

- 运行git命令时，遇到end符号且不能退出时，可以尝试按下键盘的q键
- git 在 merge（合并）或 pull（拉取） 之前要提交所有修改

- git 删除本地分支
```
git branch -D 分支名
```

- 合并本地分支，把 某个分支 合并到当前分支
```
git merge 分支名
```

- 合并远程分支，把 某个分支 合并到当前分支
```
git merge 远程仓库名/分支名
```

- 查看git日志
```
git log
```

- 新增远程仓库
```
git remote add 远程仓库名 远程仓库地址
例子
git remote add test3 ssh://username@127.0.0.1//alidata/www/.git
```

- 推送到不是 origin 的远程仓库
```
git push 远程仓库名
```

- 拉取不是 origin 的远程仓库
```
git pull 远程仓库名
```

- 查看远程仓库信息
```
git remote -v
```

- 远程仓重命名
```
git remote rename 旧名字 新名字
```

- 删除远程藏
```
git remote rm 仓库名
```

- 显示工作目录和暂存区的状态。使用此命令能看到那些修改被暂存到了, 哪些没有, 哪些文件没有被Git tracked到。
```
git status
```

- vscode git 的使用
```
更改->暂存的更改（add）->提交（commit）（提交暂存文件）->推送（push）
```

- git fetch 和 git pull 的区别
```
    1. git fetch：相当于是从远程获取最新版本到本地，不会自动合并。
    git fetch origin master
    git log -p master..origin/master
    git merge origin/master
以上命令的含义：
首先从远程的origin的master主分支下载最新的版本到origin/master分支上然后比较本地的master分支和origin/master分支的差别最后进行合并
上述过程其实可以用以下更清晰的方式来进行：
    $ git fetch origin master:tmp
    $ git diff tmp 
    $ git merge tmp
    2. git pull：相当于是从远程获取最新版本并merge到本地 
    git pull origin master
    上述命令其实相当于git fetch 和 git merge在实际使用中，git fetch更安全一些，
    因为在merge前，我们可以查看更新情况，然后再决定是否合并。
```

- 设置 gpg 用户id
```
git config user.signingkey [用户ID]
```

- 签名标签
```
git tag -s tagname -m 'msg'
```

- 验证标签的签名
```
git tag -v tagname
```

- 如果标签是经过签名的 git show ，能看到 GPG 签名附属在后面：
```
git show tagname
```

- 签名提交
```
git commit -S -m 'msg'
```

- 验证提交的签名
```
git verify-commit commitid
```

- 显示提交日志的签名
```
git log --show-signature -10
```
