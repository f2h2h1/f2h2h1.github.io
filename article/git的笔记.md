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

这是一段 调用 llm 分析 文件的脚本
```bash
#!/bin/bash

set -euo pipefail

script_name=$(basename "$0")

# 用法提示
usage() {
    cat << EOF
Usage: $script_name [OPTIONS] <file1> [file2 ...]

Options:
  -u, --url <url>           API endpoint URL (required)
  -k, --key <key>           API Key / Bearer token (required)
  -m, --model <name>        Model name (required)
  -s, --system <prompt>     System prompt text (optional)
  -h, --help                Show this help message

Examples:
  ./$script_name -u https://api.openai.com/v1/chat/completions \
              -k sk-xxxxx \
              -m gpt-4 \
              -s "You are a code reviewer" \
              file1.php file2.js

  ./$script_name -u http://localhost:11434/v1/chat/completions \
              -k sk-xxxxx \
              -m "deepseek/deepseek-v3" \
              -s "You are a code reviewer" \
              \$(git log -1 --name-only --pretty='')

  ./$script_name -u http://localhost:11434/v1/chat/completions \
              -k "sk-xxxxx" \
              -m "deepseek/deepseek-v3" \
              -s "You are a code reviewer" \
              \$(git diff --cached --name-only)

EOF
    exit 1
}

# 参数解析
URL=""
KEY=""
MODEL=""
SYSTEM_PROMPT=""
FILES=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        -u|--url)
            URL="${2:-}"
            shift 2
            ;;
        -k|--key)
            KEY="${2:-}"
            shift 2
            ;;
        -m|--model)
            MODEL="${2:-}"
            shift 2
            ;;
        -s|--system)
            SYSTEM_PROMPT="${2:-}"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        -*)
            echo "Error: Unknown option $1" >&2
            usage
            ;;
        *)
            FILES+=("$1")
            shift
            ;;
    esac
done

# 参数校验
[[ -z "$URL" ]] && { echo "Error: URL is required (-u)" >&2; usage; }
[[ -z "$KEY" ]] && { echo "Error: API Key is required (-k)" >&2; usage; }
[[ -z "$MODEL" ]] && { echo "Error: Model name is required (-m)" >&2; usage; }
[[ ${#FILES[@]} -eq 0 ]] && { echo "Error: At least one input file is required" >&2; usage; }

target_files=()

# 检查文件是否存在
for f in "${FILES[@]}"; do
    if [ -f "$f" ]; then
        target_files+=("$f")
    fi
done

if [ ${#target_files[@]} -eq 0 ]; then
    echo "没有找到有效的文件需要检测"
    exit 0
fi

for f in "${target_files[@]}"; do
    echo "$f"
done

# exit 1;

# ── 读取所有文件并合并为 user message ──
USER_CONTENT=""
for f in "${target_files[@]}"; do
    [[ -n "$USER_CONTENT" ]] && USER_CONTENT+=$'\n\n'
    USER_CONTENT+="==== FILE: $(basename "$f") ===="$'\n'
    USER_CONTENT+=$(cat "$f")
done

# echo "$USER_CONTENT"

USER_CONTENT=$SYSTEM_PROMPT$'\n\n'$USER_CONTENT
# echo "$USER_CONTENT"

PAYLOAD=$(jq -n \
    --arg model "$MODEL" \
    --arg prompt "$USER_CONTENT" \
'{
    model: $model,
    prompt: $prompt,
    temperature: 0.7,
    stream: false
}')

# echo "$PAYLOAD"
# exit 1;

RESPONSE=$(curl -s \
    -H "Content-Type: application/json;charset=utf-8" \
    -H "Authorization: Bearer $KEY" \
    -d "$PAYLOAD" \
    "$URL")

# HTTP_CODE=$(tail -n1 <<< "$RESPONSE")
# BODY=$(sed '$ d' <<< "$RESPONSE")
BODY=$RESPONSE

# echo $BODY;

AI_RESULT=$(echo "$BODY" | jq -r '.choices[0].text')

if [ "$AI_RESULT" = "success" ]; then
    echo "agent 没有发现问题"
    exit 0
fi

echo "$AI_RESULT"

exit 1;
```

类似这样调用
```bash
./mrico.sh -u http://localhost/api/v1/completions \
            -k auth-key \
            -m "deepseek/deepseek-v3" \
            -s "你是一个 code reviewer ，请从 语法，性能 和 安全 角度分析以下文件；如果所有文件都没有问题请直接输出 success ，如果有问题请按以下格式逐行输出 file:line problem" \
            template.phtml index.php

./mrico.sh -u http://localhost/api/v1/completions \
            -k auth-key \
            -m "deepseek/deepseek-v3" \
            -s "你是一个 code reviewer ，请从 语法，性能 和 安全 角度分析以下文件；如果所有文件都没有问题请直接输出 success ，如果有问题请输出具体的问题；请使用中文" \
            $(git log --name-only --pretty='' -1)

# 最近一次提交的文件        $(git log -1 --name-only --pretty='')
# 特定某个提交的文件        $(git log -1 --name-only --pretty='' eaaa302ffe0421a524c5c0e8543421d2f200067c)
# 在 staged 的文件          $(git diff --cached --name-only)
# 从某个提交开始修改过的文件 $(git log --name-only --pretty='' eaaa302ffe0421a524c5c0e8543421d2f200067c^..HEAD | awk '!seen[$0]++')

```

<!--
PAYLOAD=$(jq -n \
    --arg model "$MODEL" \
    --arg prompt "$USER_CONTENT" \
'{
        "approach": "rtr",
        "history": [
            {
                "role": "user",
                "content": $prompt
            }
        ],
        "overrides": {
            "top": 0,
            "model": $model,
            "max_tokens": 65536,
            "temperature": 0,
            "top_p": 1,
            "presence_penalty": 0,
            "frequency_penalty": 0,
            "show_reference": false,
            "stream": false
        }
    }')

# echo "$PAYLOAD"
# exit 1;

RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json;charset=utf-8" \
    -H "x-api-key: $KEY" \
    -d "$PAYLOAD" \
    "$URL")
-->

这是一段 列出之某个提交之后，有修改的文件，然后运行静态分析 的脚本
```bash
#!/bin/bash

set -euo pipefail

# # 使用例子
# ./check.sh $(git log --name-only --pretty='' eaaa302ffe0421a524c5c0e8543421d2f200067c^..HEAD | awk '!seen[$0]++')

# 读取全部参数，按空格分割成数组
read -ra files <<< "$@"

# 检查是否有文件被修改
if [ -z "$files" ]; then
    echo "没有暂存的文件"
    exit 0
fi

# 创建一个数组来存储符合条件的文件
php_files=()
other_files=()


# 筛选出以 .php 和 .phtml 结尾的文件
echo "筛选 PHP 相关文件..."
for file in "${files[@]}"; do
    # 检查文件是否以 .php 或 .phtml 结尾
    if [[ "$file" == *.php ]] || [[ "$file" == *.phtml ]]; then
        # 检查文件是否存在（避免已删除的文件）
        if [ -f "$file" ]; then
            php_files+=("$file")
        fi
    else
        # 检查文件是否存在（避免已删除的文件）
        if [ -f "$file" ]; then
            other_files+=("$file")
        fi
    fi
done

echo "其它文件："
if [ ${#other_files[@]} -ne 0 ]; then
    for file in "${other_files[@]}"; do
        echo "  - $file"
    done
fi

if [ ${#php_files[@]} -eq 0 ]; then
    echo "没有找到 .php 或 .phtml 文件需要检测"
    exit 0
fi

echo "php文件："
for file in "${php_files[@]}"; do
    echo "  - $file"
done

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
    echo "发现代码格式问题"
    exit 0
fi
```


<!--


通过产生一个新提交，覆盖一个旧的提交
git revert commitid

覆盖多个旧的提交，每个次覆盖都产生一个新提交
git revert commit1 commit2 commit3

覆盖多个连续的旧的提交，每个次覆盖都产生一个新提交，不包含 old_commitid
git revert old_commitid..new_commitid

覆盖多个连续的旧的提交，每个次覆盖都产生一个新提交，包含 old_commitid
git revert old_commitid^..new_commitid

如果加上 -n 参数，就只会产生一个新提交
-n
--no-commit

git revert -n old_commitid^..new_commitid
即使是覆盖多个提交，最后也只产生一个新提交

revert 的过程中可能存在冲突，需要手动处理
可以通过 git status 查看当前状态

可以通过这几个命令 继续 或 中止 revert
git revert (--continue | --skip | --abort | --quit)

重要提示
    顺序问题：当多个提交存在代码依赖关系时，git revert 会按 从新到旧 的顺序自动应用（范围语法或列表方式均如此）。如果你手动指定顺序（如旧到新），可能产生冲突。
    冲突处理：revert 过程中可能产生冲突，需要手动解决后 git add 并 git revert --continue（或直接 git commit，如果使用了 -n）。




git log --name-only --pretty='' f5abef8e35adda479477f90637e5c5812e900da6 a73458db7531ecf61c06f0f49af0e4f0cbf3d9a9 | awk '!seen[$0]++'


git log --name-only --pretty='' f5abef8e35adda479477f90637e5c5812e900da6^..HEAD | awk '!seen[$0]++'

git log --name-only --pretty='' f5abef8e35adda479477f90637e5c5812e900da6^..HEAD | awk '!seen[$0]++' | grep '\(php\|phtml\)$'
git log --name-only --pretty='' f5abef8e35adda479477f90637e5c5812e900da6^..HEAD | awk '!seen[$0]++' | grep -vE '\.(php|phtml)$'


git log --name-only --pretty='' f5abef8e35adda479477f90637e5c5812e900da6^..HEAD | awk '!seen[$0]++' | grep '\(php\|phtml\)$' | readarray -t array

这一句是可行的，但遇到被删除的文件会报错
vendor/bin/phpstan analyse --no-progress --no-ansi -l 4 $(git log --name-only --pretty='' f5abef8e35adda479477f90637e5c5812e900da6^..HEAD | awk '!seen[$0]++' | grep '\(php\|phtml\)$')

加入 staged 后运行
vendor/bin/phpstan analyse --no-progress --no-ansi -l 4 $(git diff --cached --name-only)

提交后运行
vendor/bin/phpstan analyse --no-progress --no-ansi -l 4 $(git log -1 --name-only --pretty='')


# 最近一次提交的文件        $(git log -1 --name-only --pretty='')
# 特定某个提交的文件        $(git log -1 --name-only --pretty='' eaaa302ffe0421a524c5c0e8543421d2f200067c)
# 在staged的文件            $(git diff --cached --name-only)
# 从某个提交开始修改过的文件 $(git log --name-only --pretty='' eaaa302ffe0421a524c5c0e8543421d2f200067c^..HEAD | awk '!seen[$0]++')
-->



```


#!/bin/bash

# # 使用例子
# ./check.sh  -u http://localhost:11434/v1/chat/completions \
#               -k "api-key" \
#               -m "kimi-k2.6" \
#               -s "你是一个 code reviewer ，请从 性能 和 安全 角度分析以下文件；如果所有文件都没有问题请直接输出 success ，如果有问题请按以下格式逐行输出 file problem" \
#               $(git ls-files --modified) $(git ls-files --others --exclude-standard)
# 

set -euo pipefail


minify_php() {
f=$1
echo $f $1
if [ -z "$1" ]; then
    return ''
fi

php <<'EOF' -- $f 
<?php
include 'vendor/autoload.php';

/**
 * 使用 DOMDocument 处理 PHTML 文件：
 * - 提取并保留 PHP 代码（用占位符替代）
 * - 移除内联 CSS（style 属性和 <style> 标签）
 * - 压缩内联 JavaScript（移除注释和多余空白）
 * - 压缩 HTML（合并空白，移除标签间多余空格）
 * - 最终还原 PHP 代码
 */


// 1. 读取文件
if (isset($argv[1])) {
    $filePath = $argv[1];
    if (!file_exists($filePath)) {
        die("文件不存在: $filePath");
        # exit(1);
    }
} else {
    $filePath = 'php://stdin';
}
$content = file_get_contents($filePath);
if ($content === false) {
    die("无法读取输入\n");
    # exit(1);
}
$content = trim($content);
if (empty($content) || strlen($content) == 0) {
    echo '文件内容为空';
    die("文件内容为空\n");
    # exit(1);
}

// 2. 提取 PHP 代码块，替换为安全占位符（使用 token_get_all 精确识别）
function extractPhpBlocks(string $code): array
{
    $tokens = token_get_all($code);
    $phpBlocks = [];
    $placeholderIndex = 0;
    $output = '';
    $inPhp = false;          // 是否在 PHP 代码区域内
    $phpBuffer = '';         // 暂存当前 PHP 代码

    foreach ($tokens as $token) {
        if (is_array($token)) {
            list($id, $text) = $token;
            if ($id === T_OPEN_TAG || $id === T_OPEN_TAG_WITH_ECHO) {
                // 开始 PHP 区域
                $inPhp = true;
                $phpBuffer = $text; // 包含开始标签
                continue;
            } elseif ($id === T_CLOSE_TAG) {
                // 结束 PHP 区域
                $phpBuffer .= $text;
                $placeholder = "<!--PHP_BLOCK_$placeholderIndex-->";
                $phpBlocks[$placeholder] = $phpBuffer;
                $placeholderIndex++;
                $output .= $placeholder;
                $inPhp = false;
                $phpBuffer = '';
                continue;
            } elseif ($inPhp) {
                // 在 PHP 区域内的内容
                $phpBuffer .= $text;
                continue;
            } else {
                // 普通 HTML 或其它文本
                $output .= $text;
            }
        } else {
            // 单个字符（如 ; { } 等）可能在 PHP 内或外
            if ($inPhp) {
                $phpBuffer .= $token;
            } else {
                $output .= $token;
            }
        }
    }

    // 处理文件末尾未闭合的 PHP 代码（例如纯 PHP 文件）
    if ($inPhp && !empty($phpBuffer)) {
        $placeholder = "<!--PHP_BLOCK_$placeholderIndex-->";
        $phpBlocks[$placeholder] = $phpBuffer;
        $output .= $placeholder;
    }

    return ['html' => $output, 'map' => $phpBlocks];
}

$extracted = extractPhpBlocks($content);var_dump($extracted);
$htmlWithPlaceholders = $extracted['html'];var_dump($htmlWithPlaceholders);
$phpMap = $extracted['map'];var_dump($phpMap);

// 3. 使用 DOMDocument 解析 HTML（避免自动添加 <html><body>）
$doc = new DOMDocument();
libxml_use_internal_errors(true); // 忽略解析警告
$doc->loadHTML($htmlWithPlaceholders, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
libxml_clear_errors();

// 4. 移除内联 CSS
// 4.1 移除所有元素的 style 属性
$xpath = new DOMXPath($doc);
foreach ($xpath->query('//*[@style]') as $element) {
    $element->removeAttribute('style');
}

// 4.2 移除所有 <style> 标签（内嵌样式表）
foreach ($xpath->query('//style') as $style) {
    $style->parentNode->removeChild($style);
}

// 5. 压缩内联 JavaScript（仅针对不含 src 的 <script>）
function compressJs(string $js): string
{
    // // 移除多行注释 /* ... */
    // $js = preg_replace('/\/\*.*?\*\//s', '', $js);
    // // 移除单行注释 // ... 到行尾
    // $js = preg_replace('/\/\/.*?(\n|$)/', '', $js);
    // // 压缩多个空白为一个空格
    // $js = preg_replace('/\s+/', ' ', $js);
    // // 移除运算符、括号等周围的空格
    // $js = preg_replace('/\s*([{};:,()])\s*/', '$1', $js);
    $js = \JShrink\Minifier::minify($js);
    return trim($js);
}

foreach ($xpath->query('//script[not(@src)]') as $script) {
    $original = $script->textContent;
    if (trim($original) !== '') {
        $compressed = compressJs($original);
        $script->textContent = $compressed;
    }
}

// 6. 获取处理后的 HTML 字符串（不包含自动添加上下文）
$processedHtml = $doc->saveHTML();

// 7. 压缩 HTML（去除多余空白，但保留必要时空格）
function compressHtml(string $html): string
{
    // 将多个空白（换行、制表、连续空格）压缩为单个空格
    $html = preg_replace('/\s+/', ' ', $html);
    // 移除标签之间的空白（> < 变为 ><），注意不会影响文本内容
    $html = preg_replace('/>\s+</', '><', $html);
    return trim($html);
}

$compressedHtml = compressHtml($processedHtml);

// 8. 还原 PHP 代码
$finalContent = str_replace(array_keys($phpMap), array_values($phpMap), $compressedHtml);

// 9. 输出或保存结果
// echo $finalContent;
// file_put_contents('output.phtml', $finalContent);

/**
 * 使用 token_get_all 压缩 PHP 代码：
 * - 移除所有多余的空白（空格、制表符、换行）
 * - 保留单行注释（T_COMMENT）后的第一个换行符，防止注释影响下一行代码
 * - 在单词型 token 之间自动插入一个空格，确保语法正确
 *
 * @param string $code 原始 PHP 代码
 * @return string 压缩后的代码
 */
function minifyPhpCode(string $code): string
{
    $tokens = token_get_all($code);
    $output = '';
    $prevText = '';                 // 上一个非空白 token 的文本
    $prevTokenIsComment = false;    // 上一个非空白 token 是否为单行注释

    foreach ($tokens as $token) {
        // 处理空白 token
        if (is_array($token) && $token[0] === T_WHITESPACE) {
            // 如果前一个 token 是单行注释，且该空白中包含换行符，则保留一个换行
            if ($prevTokenIsComment && (
                    strpos($token[1], "\n") !== false ||
                    strpos($token[1], "\r") !== false
                )) {
                $output .= "\n";
                // 重置标记，避免同一注释后的多个空白都输出换行
                $prevTokenIsComment = false;
            }
            // 否则直接跳过该空白
            continue;
        }

        // 非空白 token
        $text = is_array($token) ? $token[1] : $token;

        // 智能插入空格：若前后 token 均以“单词字符”（字母、数字、下划线）结尾/开头，则补一个空格
        if ($prevText !== '') {
            $lastChar = substr($prevText, -1);
            $firstChar = substr($text, 0, 1);
            if ((ctype_alnum($lastChar) || $lastChar === '_') &&
                (ctype_alnum($firstChar) || $firstChar === '_')) {
                $output .= ' ';
            }
        }

        $output .= $text;

        // 更新状态
        $prevTokenIsComment = (is_array($token) && $token[0] === T_COMMENT);
        $prevText = $text;
    }

    return $output;
}

echo minifyPhpCode($finalContent);



EOF

}


# echo "$USER_CONTENT"
# echo $(echo $USER_CONTENT | wc -c)

# exit 0;

script_name=$(basename "$0")

# 用法提示
usage() {
    cat << EOF
Usage: $script_name [OPTIONS] <file1> [file2 ...]

Options:
  -u, --url <url>           API endpoint URL (required)
  -k, --key <key>           API Key / Bearer token (required)
  -m, --model <name>        Model name (required)
  -s, --system <prompt>     System prompt text (optional)
  -h, --help                Show this help message

Examples:
  ./$script_name -u http://localhost:11434/v1/chat/completions \
              -k sk-xxxxx \
              -m "deepseek/deepseek-v3" \
              -s "You are a code reviewer" \
              file1.php file2.js

  ./$script_name -u http://localhost:11434/v1/chat/completions \
              -k sk-xxxxx \
              -m "deepseek/deepseek-v3" \
              -s "You are a code reviewer" \
              \$(git log -1 --name-only --pretty='')

  ./$script_name -u http://localhost:11434/v1/chat/completions \
              -k "sk-xxxxx" \
              -m "deepseek/deepseek-v3" \
              -s "You are a code reviewer" \
              \$(git diff --cached --name-only)

  ./$script_name -u http://localhost:11434/v1/chat/completions \
              -k "sk-xxxxx" \
              -m "deepseek/deepseek-v3" \
              -s "You are a code reviewer" \
              \$(git ls-files --modified) \$(git ls-files --others --exclude-standard)
EOF
    exit 1
}

# 参数解析
URL=""
KEY=""
MODEL=""
SYSTEM_PROMPT=""
FILES=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        -u|--url)
            URL="${2:-}"
            shift 2
            ;;
        -k|--key)
            KEY="${2:-}"
            shift 2
            ;;
        -m|--model)
            MODEL="${2:-}"
            shift 2
            ;;
        -s|--system)
            SYSTEM_PROMPT="${2:-}"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        -*)
            echo "Error: Unknown option $1" >&2
            usage
            ;;
        *)
            FILES+=("$1")
            shift
            ;;
    esac
done

# 参数校验
[[ -z "$URL" ]] && { echo "Error: URL is required (-u)" >&2; usage; }
[[ -z "$KEY" ]] && { echo "Error: API Key is required (-k)" >&2; usage; }
[[ -z "$MODEL" ]] && { echo "Error: Model name is required (-m)" >&2; usage; }
[[ ${#FILES[@]} -eq 0 ]] && { echo "Error: At least one input file is required" >&2; usage; }


php_files=()
phtml_files=()
js_files=()
html_files=()
xml_files=()
json_files=()
other_files=()
total=0   # 有效文件总数

for file in "${FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    # echo "Warning: $file does not exist, skipping" >&2
    continue
  fi
  let total+=1
  case "$file" in
    *.php)  php_files+=("$file") ;;
    *.phtml)  phtml_files+=("$file") ;;
    *.js)   js_files+=("$file") ;;
    *.html) html_files+=("$file") ;;
    *.htm) html_files+=("$file") ;;
    *.xml) xml_files+=("$file") ;;
    *.json) json_files+=("$file") ;;
    *)      other_files+=("$file") ;;
  esac
done

if [ $total -eq 0 ]; then
    echo "没有找到有效的文件需要检测"
    # exit 0
fi


echo "php files:  ${php_files[@]}"
echo "phtml files:  ${phtml_files[@]}"
echo "js files:   ${js_files[@]}"
echo "html files: ${html_files[@]}"
echo "xml files: ${xml_files[@]}"
echo "json files: ${json_files[@]}"
echo "other files: ${other_files[@]}"

# vendor/bin/phpstan analyse --no-progress --no-ansi -l 4 "${php_files[@]}" "${phtml_files[@]}"

USER_CONTENT=""

for f in "${php_files[@]}"; do
    [[ -n "$USER_CONTENT" ]] && USER_CONTENT+=$'\n\n'
    USER_CONTENT+="==== $f ===="$'\n'
    # USER_CONTENT+=$(php -w  "$f")
    USER_CONTENT+=$(minify_php $f)
done

for f in "${phtml_files[@]}"; do
    [[ -n "$USER_CONTENT" ]] && USER_CONTENT+=$'\n\n'
    USER_CONTENT+="==== $f ===="$'\n'
    # USER_CONTENT+=$(php -w  "$f")
    USER_CONTENT+=$(minify_php $f)
done

for f in "${js_files[@]}"; do
    [[ -n "$USER_CONTENT" ]] && USER_CONTENT+=$'\n\n'
    USER_CONTENT+="==== $f ===="$'\n'
    USER_CONTENT+=$(php -r 'include "vendor/autoload.php"; echo trim(\JShrink\Minifier::minify(file_get_contents($argv[1])));' "$f")
done

for f in "${html_files[@]}"; do
    [[ -n "$USER_CONTENT" ]] && USER_CONTENT+=$'\n\n'
    USER_CONTENT+="==== $f ===="$'\n'
    USER_CONTENT+=$(cat "$f" | sed 's/\r$//g' | tr -d '\n' | tr -s ' ' | sed 's/<!--[^>]*-->//g')
done

for f in "${xml_files[@]}"; do
    [[ -n "$USER_CONTENT" ]] && USER_CONTENT+=$'\n\n'
    USER_CONTENT+="==== $f ===="$'\n'
    USER_CONTENT+=$(cat "$f" | sed 's/\r$//g' | tr -d '\n' | tr -s ' ' | sed 's/<!--[^>]*-->//g')
done

for f in "${json_files[@]}"; do
    [[ -n "$USER_CONTENT" ]] && USER_CONTENT+=$'\n\n'
    USER_CONTENT+="==== $f ===="$'\n'
    USER_CONTENT+=$(jq -c .  "$f")
done

# echo "$USER_CONTENT"

USER_CONTENT=$SYSTEM_PROMPT$'\n\n'$USER_CONTENT
# echo "$USER_CONTENT"
# exit 1;

php_code=$(cat<<'EOF'
$model  = $argv[1];
$prompt = trim(fgets(STDIN));
$data = [
    'approach' => 'rtr',
    'history' => [
        [
            'role'    => 'user',
            'content' => $prompt,
        ],
    ],
    'overrides' => [
        "top"               => 0,
        'model'             => $model,
        'max_tokens'        => 65536,
        'temperature'       => 0,
        'top_p'             => 1,
        'presence_penalty'  => 0,
        'frequency_penalty' => 0,
        'show_reference'    => false,
        'stream'            => false,
    ],
];
echo json_encode($data, JSON_UNESCAPED_SLASHES);
EOF
)
php_code=$(echo $php_code | sed 's/\r$//g' | tr -d '\n' | tr -s ' ')
# echo $php_code;
# exit 1;

PAYLOAD=$(
echo $USER_CONTENT | php -r "$php_code" $MODEL
)

# PAYLOAD_Length=$(echo -n "$PAYLOAD" | wc -c)
# let PAYLOAD_Length+=1
# echo $PAYLOAD_Length
# exit 1;

# echo $URL

RESPONSE=$(echo -n "$PAYLOAD" | curl -s --proxy http://proxy.pccw.com:8080 -X POST \
    -H "Content-Type: application/json;charset=utf-8" \
    -H "x-api-key: $KEY" \
    -d @- \
    "$URL")

# HTTP_CODE=$(tail -n1 <<< "$RESPONSE")
# BODY=$(sed '$ d' <<< "$RESPONSE")
BODY=$RESPONSE

# echo $BODY;

# echo "================"

# echo "$BODY";

# echo "================"

AI_RESULT=$(echo "$BODY" | jq -r '.answer')

if [ "$AI_RESULT" = "success" ]; then
    echo "agent 没有发现问题"
    exit 0
fi

echo "$AI_RESULT"

# echo "================"

# echo $AI_RESULT

if [ ${#php_files[@]} -gt 0 ]; then
    vendor/bin/phpstan analyse --no-progress --no-ansi -l 4 "${php_files[@]}"
fi
if [ ${#phtml_files[@]} -gt 0 ]; then
    vendor/bin/phpstan analyse --no-progress --no-ansi -l 4 "${phtml_files[@]}"
fi

exit 1;



```