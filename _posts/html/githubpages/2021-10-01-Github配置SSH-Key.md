---
layout:     post
title:      "Github配置SSH-Key"
subtitle:   ""
date:       2021-10-01 10:00:00 +0800
author:     "Viifo"
category:   HTML
tags:
    - github
---

# 1. 生成 SSH 密钥

**Windows**

查看 `C://Users/本机用户名/.ssh` 文件夹下是否存在文件 `id_rsa`  和 `id_rsa.pub`。如果已经有这两个文件可以跳过生成密钥这一步骤。

创建 SSH 密钥

```shell
# 创建 ssh
ssh-keygen -t rsa -C "youremail@example.com"
# or
ssh-keygen
```

根据提示创建完成后打开文件  `C://Users/本机用户名/.ssh/id_rsa.pub`，复制其中的全部内容。



**Linux**

```shell
# 查看是否已经存在 SSH-Key
# 如果已经有这两个文件可以跳过生成密钥这一步骤。
ls -al ~/.ssh

# 创建 ssh 
ssh-keygen -t rsa -C "youremail@example.com"
# or
ssh-keygen

# 查看公钥内容
cat ~/.ssh/id_rsa.pub
```


# 2. Github 配置 SSH-Key

登录 Github ，点击导航栏上的头像，选择设置；

![选择设置](/resource/images/html/githubpages/github_ssh_01.jpg)

点击 `SSH and GPG keys`，点击`New SSH Key`；

![点击New SSH Key](/resource/images/html/githubpages/github_ssh_02.jpg)

填写一个用于区分 SSH-Key 的标题，此标题没有限制，随便填写，然后将前面生成的公钥 `id_rsa.pub` 中的内容全部复制到 `key` 中，点击 `Add SSH Key`，这样 Github 的 SSH-Key 就配置好了。

![点击Add SSH Key保存配置](/resource/images/html/githubpages/github_ssh_03.jpg)

