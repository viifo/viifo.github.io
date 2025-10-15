---
layout:     post
title:      "Git Sparse Checkout 稀疏检出"
subtitle:   ""
date:       2025-10-15 09:37:00 +0800
update:     2025-10-15 09:37:00 +0800
author:     "Viifo"
category:   Git
tags:
    - git
---

`git sparse-checkout`是 Git 的一个功能，它允许你只检出（`checkout`）仓库中的**特定子目录或文件**，而不是克隆或检出整个仓库的所有内容。

本文以接入融云 `imkit` 模块为例，[融云UI仓库](https://github.com/rongcloud/android-ui-sdk-set) 中除了 `imkit` 外还包含了其他不需要的模块，这种情况正适合使用 `git` 稀疏检出。

> 1.在一个包含多个独立模块的仓库中，只检出你正在开发的模块，避免被无关文件干扰
> 
> 2.可同时关联官方仓库，便于对 imkit 源码自定义修改的同时保留同步官方更新的能力



## 1. 创建自己的远程仓库

为了便于后续管理，首先需要为精简后的融云 `imkit` 模块创建一个空的远程 `git` 仓库，如命名为 `imkit-sparse`。

> 在创建仓库时，不要勾选添加 “README”、“.gitignore” 或 “LICENSE” 等选项。我们需要一个完全空的仓库来接收精简后的代码。





## 2. 在本地进行稀疏检出

在本地使用 `稀疏检出` 从融云的官方仓库中克隆出需要的特定的 `imkit` 模块：

```shell
# 创建一个新的本地目录
mkdir imkit-sparse
cd imkit-sparse

# 克隆官方仓库，但不检出文件
# 这个命令只会下载 .git 目录，不会检出任何文件
# 可能 .git 目录会在 android-ui-sdk-set 目录中
# 可将其手动移动到 imkit-sparse 根目录下并删除空的 android-ui-sdk-set 目录
git clone --no-checkout https://github.com/rongcloud/android-ui-sdk-set.git

# 启用稀疏检出
git sparse-checkout init

# 设置稀疏检出
# 我们当前只关注 imkit 目录
git sparse-checkout set imkit/

# 从 main 主分支检出文件
# 执行 checkout 命令，Git 现在只会拉取指定的文件
git checkout main
```



将 `稀疏检出` 的代码推送到前面创建的远程仓库中，并将官方仓库添加为新的远程仓库源 `upstream` ：

```shell
# 移除官方仓库地址
git remote remove origin

# 添加自己的新仓库作为 origin
git remote add origin your_repository/imkit-sparse.git

# 将官方仓库添加为 upstream
git remote add upstream git@github.com:rongcloud/android-ui-sdk-set.git

# 推送代码并关联本地和远程分支
git push -u origin main
```





## 3. 在主项目中将 imkit-sparse 添加为子模块

将精简的 `imkit-sparse` 新仓库作为子模块添加到安卓主项目中：

```shell
# 进入主项目根目录（主项目中.git所在的目录）
cd /path/to/YourMainAndroidProject

# 添加子模块
# 主项目中会多出一个 rongcloud 目录，它是指向精简版融云 IMKit 仓库的子模块
git submodule add your_repository/imkit-sparse.git rongcloud
```





## 4. 其他操作

```shell
# ############################################
# 1. 后续同步融云官方仓库的更新
# ############################################
cd rongcloud/
git pull upstream main



# ############################################
# 2. 修改精简的文件
# ############################################
# 前面只添加了 imkit，现在需要添加 rcsticker 和 sight
git sparse-checkout set imkit/ rcsticker/ sight/
# 同步
git pull upstream main



# ############################################
# 3. 暂存文件
# ############################################
# git stash 会把子模块的未提交状态作为主项目的一个修改来暂存
# 所以正常在主模块中使用 stash 命令暂存即可
# 进行一些代码修改...
cd rongcloud
# 返回主项目并暂存
cd ../
git stash push -m "Stash changes in the rongcloud submodule"



# ############################################
# 4. 提交子模块修改
# ############################################
# 需要进入子模块使用commit命令提交修改
cd rongcloud
# 追踪子模块所有文件
git add .
# 提交修改
git commit -m "your change"
# 返回主项目提交
cd ../
...



# ############################################
# 4. 主项目没有正确追踪子模块
# ############################################
# 若主项目没有正确追踪子模块，拉取远程代码时报错如下：
error: cannot rebase: You have unstaged changes.
error: additionally, your index contains uncommitted changes.
error: Please commit or stash them.

# 使用 git status 查看未暂存的文件是否都是子模块中的
# 如果都是子模块中的，表明子模块被主项目当作一个普通文件来对待了
# 可以尝试强制让 Git 重新识别并更新子模块
git submodule update --init --force --recursive

# 如果问题依然存在，需要删除子模块后重新添加
# ！！！注意代码保存！！！
git rm --cached -r rongcloud
git add rongcloud

# 使用 git status 查看文件是否都已经正常追踪
# 正常追踪后使用命令行提交修改
# ！！！使用 GUI 提交可能会出现一直卡在 committing 进度上！！！
git commit -m "Fixing submodule tracking"
```

