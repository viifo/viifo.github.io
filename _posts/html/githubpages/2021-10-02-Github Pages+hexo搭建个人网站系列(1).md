---
layout:     post
title:      "Github Pages + hexo搭建个人网站系列（一）"
subtitle:   "简单尝试&环境搭建"
date:       2021-10-02 08:00:00 +0800
author:     "Viifo"
category:   HTML
tags:
    - github
    - hexo
---

前面我们讲解了 [Github Pages + Jekyll 搭建个人网站系列]()，本系列将讲解如何使用 Github Pages 和 Hexo 搭建个人网站，先介绍下 `Github Pages` 和 `Hexo`：

* `Github Pages` ：一个 Github 仓库，放置我们的个人网站；同时 Github 免费给我们提供了一个用于访问该网站的域名 `github_username.github.io`，其中 `github_username` 是您在 Github 上注册的用户名。

* `Hexo`：一个快速、简洁且高效的静态博客框架，只需要 Node.js 环境就可以运行。



# 1. 探索 Github Pages

新建 Github 仓库，仓库名使用 `user_name.github.io` 的形式，这样直接通过Github Pages 提供的域名`user_name.github.io`就可以访问网站了。不使用`user_name.github.io` 形式的仓库名则访问网站需要在域名后加上仓库名 ，即：`user_name.github.io/repository_name/`  。



新建 Guthub 仓库

![新建 Guthub 仓库](/resource/images/html/githubpages/github_pages_01.jpg)

点击设置

![设置](/resource/images/html/githubpages/github_pages_02.jpg)

点击 Pages

![Pages](/resource/images/html/githubpages/github_pages_03.jpg)

选择一个主题

![选择主题](/resource/images/html/githubpages/github_pages_04.jpg)

主题选择完成后，会自动跳转到提交仓库文件变更记录页面，选择提交即可。

![提交变更记录](/resource/images/html/githubpages/github_pages_05.jpg)

现在可以通过 `user_name.github.io` 访问你的个人网站了。

>   请注意替换 URL 中的 user_name，例如本文中的 Github Pages 的访问地址为 [https://viifo.github.io](https://viifo.github.io)。





# 2. Hexo 环境准备

**安装 Node.js**

下载 [Node.js](http://nodejs.org/) (Node.js 版本需不低于 10.13，建议使用 Node.js 12.0 及以上版本)



**安装 Git.js**

下载 [Git ](https://git-scm.com/download/win)

>Git 用于将本地代码推送至 Github 仓库
>
>对于国内 Git 下载速度慢，可以前往 [淘宝 Git for Windows 镜像](https://npm.taobao.org/mirrors/git-for-windows/) 下载 git 安装包。



**安装Hexo**

```shell
# 使用 npm 全局安装 Hexo 脚手架
npm install -g hexo-cli
# 确认 hexo 是否安装成功
hexo -v
```

如果安装成功后出现 `'hexo' 不是内部或外部命令，也不是可运行的程序或批处理文件。` 比对 [官网文档](https://hexo.io/zh-cn/docs/#Node-js-%E7%89%88%E6%9C%AC%E9%99%90%E5%88%B6)，发现是 node.js 和 hexo 版本不匹配，更新 node.js 版本后重新安装 hexo即可。

| Hexo 版本   | 最低兼容 Node.js 版本 |
| :---------- | :-------------------- |
| 5.0+        | 10.13.0               |
| 4.1 - 4.2   | 8.10                  |
| 4.0         | 8.6                   |
| 3.3 - 3.9   | 6.9                   |
| 3.2 - 3.3   | 0.12                  |
| 3.0 - 3.1   | 0.10 or iojs          |
| 0.0.1 - 2.8 | 0.10                  |




# 3. 新的 Hexo 项目

```shell
# 新建一个名为 hello-hexo 的 Hexo 项目 
hexo init hello-hexo

# 进入 hello-hexo 目录
cd hello-hexo

# 安装相关依赖包
npm install

# 生成静态网站
# 该命令是 hexo generate 的简写
hexo g

# 启动 Hexo 服务 访问 http://localhost:4000/ 查看页面
# 该命令是 hexo server 的简写
hexo s
```





# 4. 使用 Webstorm 开发 Hexo 项目

**通过WebSorm创建项目**

前面介绍了使用命令行新建一个 Hexo 项目，下面介绍使用 Webstrom 新建一个 Hexo 下项目。

选择 `Get from Version Control`

![通过git新建项目](/resource/images/html/githubpages/hexo/hexo_02.jpg)

通过 Hexo 官方 `hexo-starter` 项目新建项目，填写好 URL 和 项目名称后，确认即可。

> https://github.com/hexojs/hexo-starter.git

![通过git新建项目](/resource/images/html/githubpages/hexo/hexo_03.jpg)



**通过WebSorm运行项目**

项目创建完成后，使用 Webstorm 打开，添加快捷启动和停止：

点击右上角 `Add Configuration`

 ![新增配置](/resource/images/html/githubpages/hexo/hexo_04.jpg)

选择 `npm`

![新增配置 - npm](/resource/images/html/githubpages/hexo/hexo_05.jpg)

Hexo 已经把相关命令在 `package.json` 中定义好了，我们只需要配置使用即可：

![配置命令](/resource/images/html/githubpages/hexo/hexo_06.jpg)

![配置命令](/resource/images/html/githubpages/hexo/hexo_07.jpg)

配置完成后，先使用 `build` 生成静态网页，再使用 `server` 启动 Hexo 服务即可。此外还有其他命令可以配置，具体查看项目根目录下的 `package.json` 文件。





# 5. 一键部署

Hexo 通过  [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git) 提供了快速方便的一键部署功能，使用此功能需要配置 `Github SSH-Key`, 或者使用 `Github Token` 来获取访问仓库的权限，否则会报错如下：

```shell
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```



**SSH-Key 配置 **

请参考 [配置SSH-Key连接Github](https://viifo.github.io/html/2021-10-01-Github%E9%85%8D%E7%BD%AESSH-Key.html) 一文。



**项目配置**

安装 hexo-deployer-git ：

```shell
npm install --save hexo-deployer-git
```

修改 `_config.yml` ，找到如下内容并修改：

```yaml
deploy:
  type: git
  # git 仓库地址，每个项目的参仓库地址都不一致，注意修改
  repo: git@github.com:viifo/viifo.github.io.git
  # 提交的目标分支
  branch: master
  message: "提交记录说明"
  # 使用 SSH-Key 进行身份验证和提交，不需要配置 token
  # token:
```

接下来就可以进行提交了。

```shell
# 推送 public 目录下的静态网站至 Git 仓库
# 该命令是 hexo deploy 的简写
hexo d
```

推送成功即可访问 Github Pages 浏览网站了。





# 6. 小结

* Github Pages 免费提供了一个存储空间和域名来存储和访问我们的个人网站；
* Hexo 通过模板生成静态网站，简化了静态网页的开发；
* 必须搭建 Hexo本地开发环境，提交到 Github Pages 仓库的部分是最后生成的静态网站；
* 通过 `hexo-deployer-git` 可实现一键部署网页到 Github Pages ；
* 一键部署功能需要配置 SSH-Key  或 Token 来获取仓库访问权限。

