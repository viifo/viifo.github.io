---
layout:     post
title:      "Git 同时提交 Github & Gitee"
subtitle:   ""
date:       2021-10-01 18:00:00 +0800
author:     "Viifo"
category:   Tips
tags:
    - github
---


## 1. 创建远程仓库

创建Github仓库和 Gitee 仓库如图 1.1 和图 1.2 所示。

![图 1.1](/resource/images/tips/git/push2repo_1_1.jpg)

![图 1.2](/resource/images/tips/git/push2repo_1_2.jpg)



## 2. 修改 Git 配置

创建一个项目并且修改项目 Git 配置，在项目根目录下找到文件 `.git/config`。打开并修改为如下内容：

```shell
[core]
    repositoryformatversion = 0
    filemode = false
    bare = false
    logallrefupdates = true
    symlinks = false
    ignorecase = true
[remote "origin"]
    # github 仓库地址
    url = git@github.com:viifo/pushdemo.git
    # gitee 仓库地址
    url = git@gitee.com:viifo/pushdemo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
    remote = origin
    merge = refs/heads/master
```



## 3. 提交记录

现在就可以修改项目尝试推送到 Github 和 Gitee 仓库了。如图 3.1 所示，现在可以直接通过 `git push` 推送到两个远程仓库了。

![图 3.1](/resource/images/tips/git/push2repo_3_1.jpg)

