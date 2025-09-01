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

- 更快的克隆
```
git clone -b 分支名/标签 --single-branch --no-tags --depth=1  远程仓库地址 目录
--single-branch 仅克隆单一分支
--no-tags 不下载标签
--depth=1 浅层克隆（shallow clone），仅获取最近 1 个提交，而非完整历史
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
git switch 分支名
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

- 更复杂的 log
```
只显示最近的两条记录
git log -2

git fetch; git log --author="username@163.com"  --full-history --pretty="%h %S %ce %ci %s" --date-order --decorate=full --skip=0 --after="2023-12-31" --branches --tags --remotes
git fetch; git log --author="username@163.com"  --full-history --pretty="%h %S %ce %ci %s" --date-order --decorate=full --skip=0 --after="$(date -d "$(date +%Y%m01) last day" +%Y-%m-%d)" --branches --tags --remotes
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

- 把上一次提交的内容退回到 暂存区
```
git reset --soft HEAD~1
```

- 追加修改
```
git commit --amend
```

- 追加修改后再推送，这是强制推送
```
git push -f
```

- 把所有文件从暂存区中移除，文件的修改不会有变化
```
git reset -q HEAD -- .
```

- 撤销工作区的所有的修改，不会影响暂存区
```
git checkout -- .
```

- 清理未追踪的文件
```
git clean -fd
```

- 回退到最新提交状态，会清空暂存区，重置工作区中已追踪的文件
```
git reset --hard
```

- 贮藏
```
git stash
git stash push
git stash pop
git stash apply
git stash list
git stash show
git stash drop
git stash clear

```

- 配置
    - 配置文件是 ini 格式
    - 范围
        - local 当前仓库 默认值
            ```
            .git/config
            ```
        - global 当前用户
            ```
            ~/.gitconfig
            ```
        - system 系统
            ```
            /etc/.gitconfig
            ```
    - 常用的配置项
        ```
        [core]
            repositoryformatversion = 0 仓库版本，用于未来能够兼容git版本，决定怎么处理git命令和文件的
            filemode = false 忽略文件权限的比较
            bare = false 不是裸仓
            logallrefupdates = true 启用引用日志，如果是裸仓则测试false
            symlinks = false 不使用软链接
            ignorecase = false 提交文件时区分大小写
            autocrlf = false 提交 和 检出 时都不修改换行符， true 是修改， input 是提交时修改，检出时不修改
            safecrlf = false 拒绝 提交有混合换行符的文件， true 是提交有混合换行符的文件， wram 允许 提交有混合换行符的文件 但会又警告
            在 windows 环境下，这两项 autocrlf safecrlf 最好搞个 system配置
        [user] 设置用户信息，这里的用户信息主要用在 commit ，多数情况下都建议设为 global配置
                name = username
                email = useremail
        [http] 设置代理
            proxy = http://127.0.0.1:6080
        [remote "origin"] 通常每个远程仓库都会有一个 section
        [branch "master"] 通常每个分支都会有一个 section
        ```
    - 常用的命令
        ```
        查看某项配置，默认是 --local ，加上 --global --system 可以修改范围
        git config 配置项（section.key）
        git config user.name

        设置某项配置
        git config 配置项（section.key） 值
        git config user.name "username"

        查看git全部的配置项
        git config --list

        查看git local的配置项, --global --system 也是一样的
        git config --list --local

        克隆时指定一些设置
        git clone -c core.symlinks=true <URL>
        ```

- 钩子 hook
    - 客户端 hook
        ```
        在 .git/hooks 文件夹下新建脚本文件
        用 bash 写的，即使是 windows 环境下也是用 bash
        脚本文件名就是 hooks 名称，例如
        脚本文件名是 pre-commit ，就是 commit 之前运行的hook
        脚本文件名是 post-commit ，就是 commit 之后运行的hook
        脚本文件名是 pre-push ，就是 push 之后运行的hook

        参考文档
        https://git-scm.com/docs/githooks
        ```
    - 服务端 hook


pre-commit
```bash
#!/bin/bash

# 获取暂存区中修改的文件列表
echo "获取暂存区文件..."
changed_files=$(git diff --cached --name-only)

# 检查是否有文件被修改
if [ -z "$changed_files" ]; then
    echo "没有暂存的文件"
    exit 0
fi

# 将文件列表按换行符分割成数组
IFS=$'\n' read -d '' -ra files <<< "$changed_files"

# 创建一个数组来存储符合条件的文件
php_files=()

# 筛选出以 .php 和 .phtml 结尾的文件
echo "筛选 PHP 相关文件..."
for file in "${files[@]}"; do
    # 检查文件是否以 .php 或 .phtml 结尾
    if [[ "$file" == *.php ]] || [[ "$file" == *.phtml ]]; then
        # 检查文件是否存在（避免已删除的文件）
        if [ -f "$file" ]; then
            php_files+=("$file")
        fi
    fi
done

# 检查是否有符合条件的文件
if [ ${#php_files[@]} -eq 0 ]; then
    echo "没有找到 .php 或 .phtml 文件需要检测"
    exit 0
fi

# 显示要检测的文件
echo "检测以下文件："
for file in "${php_files[@]}"; do
    echo "  - $file"
done

# 使用 phpcs 对筛选出的文件进行格式检测
echo "开始代码格式检测..."

# phpcs_result=0
# for file in "${php_files[@]}"; do
#     echo "检测文件: $file"
#     # vendor/bin/phpcs --standard=Magento2 --warning-severity=3 "$file"
#     vendor/bin/phpstan analyse --no-progress --no-ansi -l 4 "$file"
#     if [ $? -ne 0 ]; then
#         phpcs_result=1
#     fi
#     echo "------------------------"
# done
# if [ $phpcs_result -eq 0 ]; then
#     echo "所有文件格式检测通过"
# else
#     echo "发现代码格式问题，请修复后重新提交"
#     exit 1
# fi

vendor/bin/phpstan analyse --no-progress --no-ansi -l 4 "${php_files[@]}"
if [ $? -eq 0 ]; then
    echo "所有文件格式检测通过"
    exit 0
else
    echo "发现代码格式问题，请修复后重新提交"
    exit 1
fi
```
