---
layout:     post
title:      "Git 同时提交 Github & Gitee"
subtitle:   ""
date:       2021-10-01 18:00:00 +0800
update:     2022-11-18 10:00:00 +0800
author:     "Viifo"
category:   Tips
tags:
    - git
---


## 1. 创建远程仓库

创建Github仓库和 Gitee 仓库如图 1.1 和图 1.2 所示。

![图 1.1](/resource/images/tips/git/push2repo_1_1.jpg)

![图 1.2](/resource/images/tips/git/push2repo_1_2.jpg)



## 2. Git 配置

初始化 `git` 仓库并依次添加 `git` 远程仓库，如下所示。

```shell
# 初始化 git 仓库
git init

# 设置第一个远程仓库
# 并将远程仓库命名为 github
git remote add github git@github.com:viifo/pushdemo.git
# 或
# git remote add github https://github.com/viifo/pushdemo.git

# 添加第二个远程仓库
# 并将远程仓库命名为 gitee
# 注意多次添加 add 后面的远程仓库名不能重复
# 不然会报错：fatal: remote origin already exists.
git remote add gitee git@gitee.com:viifo/pushdemo.git
# 或
# git remote add github https://gitee.com/viifo/pushdemoo.git

# 更新所有分支
git fetch --all

# 查看远程仓库信息
git remote -v
# 显示如下内容
# gitee   git@gitee.com:viifo/pushdemo.git (fetch)
# gitee   git@gitee.com:viifo/pushdemo.git (push)
# github  git@github.com:viifo/pushdemo.git (fetch)
# github  git@github.com:viifo/pushdemo.git (push)
```



## 3. 同步记录

远程仓库添加完成即可拉取或推送代码，如下所示。

```shell
# git pull 是 git pull (from) 仓库 (to) 分支
# git push 是 git push (to) 仓库 (from) 分支

# 拉取 github 中 master 分支的代码
git pull github master
# 拉取 gitee 中 master 分支的代码
git pull gitee master

# 将 mater 分支推送到 github 仓库
git push github master
# 将 mater 分支推送到 gitee 仓库
git push gitee master

# 将 mater 分支同时推送到 github 和 gitee 仓库
git push origin master
```

