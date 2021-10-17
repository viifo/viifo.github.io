---
layout:     post
title:      "Github Pages + Jekyll 搭建个人网站系列（一）"
subtitle:   "简单尝试&环境搭建"
date:       2021-10-03 08:00:00 +0800
author:     "Viifo"
category:   HTML
tags:
    - github
    - jekyll
---



本系列将讲解如何使用 Github Pages 和 Jekyll 搭建个人网站，先介绍下 `Github Pages` 和 `Jekyll`：

* `Github Pages` ：一个 Github 仓库，放置我们的个人网站；同时 Github 免费给我们提供了一个用于访问该网站的域名 `github_username.github.io`，其中 `github_username` 是您在 Github 上注册的用户名。

* `Jekyll`：一个简单的博客形态的静态网站生成器，它通过模板生成可发布的静态网站。同时 `Github Pages` 支持 `Jekyll`，也就是说，我们可以将 Jekyll 项目源码托管到 Github 上，`Github Pages`会自动给我们生成完整的网站,，免去了我们手动生成网站再发布到 `Github Pages` 的麻烦。





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





# 2. Jekyll 环境准备

以下介绍在 Windows 下的 Jekyll 环境安装。Liunx 及 Mac 下的 Jekyll 环境安装及更多内容请查看 [官方文档](http://jekyllcn.com/docs/installation/)。

> 此项不是必须的，直接将 Jekyll 项目源码提交到 Github 上也能查看到更改效果。但建议还是把本地环境准备好，可以确保网站运行效果符合预期再提交到 Github。



**安装 Ruby**

若本地还没有Ruby，请先[下载Ruby (rubyinstaller.org)](https://rubyinstaller.org/downloads/)，下载速度较慢可到 [github镜像站下载](https://hub.fastgit.org/oneclick/rubyinstaller2/releases)。本地环境没有`MSYS2` 和 `MINGW` 需下载 with Devkit 的版本。此版本安装后运行工具 ruby installer2 for windows 工具时请选择 `3` ，即安装 `MSYS2` 和 `MINGW` 。

> 若安装 Ruby v3.+  后执行 jekyll server 时报错：`cannot load such file -- webrick (LoadError)`，可能是由于 Ruby v3.+ 版本不兼容 jekyll ，尝试安装 Ruby v2.+解决。



**安装 RubyGems**

Gem 用于管理 Ruby 项目的依赖包，安装 Rubygems 之前，请先确保 Ruby 已安装完成。若本地还没有RubyGems，请先[下载RubyGems](http://rubygems.org/pages/download)。

```shell
# 将 rubygems 解压到任一路径下
# 切换到 rubygems 存放路径
cd youRubyGemsPath

# 安装 rubyGems
ruby setup.rb
```



**安装 Jekyll**

```shell
# 安装 Jekyll
gem install jekyll
```

若下载了 without Devikit 且本地没有 MSYS2 环境的话，安装  Jekyll 时报错如下，按照提示执行 `ridk install` 选择 `3` 安装 MSYS2 和 MINGW 后重新安装 Jekyll 即可。

```shell
MSYS2 could not be found. Please run 'ridk install'
or download and install MSYS2 manually from https://msys2.github.io/
```



**安装 Bundler**

Bundler 用于管理 ruby 项目中的 gem 依赖，可以针对不同的依赖指定不同的版本。

```shell
# 安装 bundler
gem install bundler
```





# 3. 新的 Jekyll 项目

创建一个新的 Jekyll 项目并在本地运行。

```shell
# 创建一个新的 jekyll 项目 demo
jekyll new demo

# 进入 demo 目录
cd demo

# 启动 jekyll 服务，访问 http:// localhost:4000 预览项目
# bundle exec jekyll serve
jekyll server
```





# 4. 使用 Webstorm 开发 Jekyll 项目

此项工作不是必须的，我们可以用任何我们想用的编辑器开发 Jekyll 项目。

搭建完 Jekyll 本地环境后使用 Webstrom 进行开发，需要安装相关插件 支持 `Liquid` 语法。具体方法如下：

`File` => `Settings` => `Plugins` =>  `Marketplace` 中搜索 `Liquid` 并安装，安装完成后重启 Webstorm。

或 [下载插件](https://plugins.jetbrains.com/plugin/14388-liquid/versions) 到本地进行安装。安装方法如下：

`File` => `Settings` => `Plugins` =>  `设置图标` => `Install Plugin from Disk` ，选择本地插件安装，安装完成后重启 Webstorm。
> `Liquid` 插件要求 Webstrom 的最低版本为 202.4357


插件安装完成后，怎么在 Webstorm 中运行项目呢？



**通过 Shell Script 快捷运行Jekyll项目**

点击右上角 `Add Configuration`

![新增配置](/resource/images/html/githubpages/jekyll/jekyll_01.jpg)

选择 `Shell Script`

!新增配置 - Shell Script](/resource/images/html/githubpages/jekyll/jekyll_02.jpg)

将 `run.bat` 和 `stop.bat` 脚本导入后保存

```shell
# run.bat
jekyll server

# stop.bat
@echo off
set port=4000
for /f "tokens=1-5" %%i in ('netstat -ano^|findstr ":%port%"') do (
    taskkill /f /pid %%m
)
```

![导入脚本](/resource/images/html/githubpages/jekyll/jekyll_03.jpg)

现在已经可以在右上角快捷运行和停止服务了

![快捷运行服务](/resource/images/html/githubpages/jekyll/jekyll_04.jpg)



**通过 npm 快捷运行Jekyll项目**

这需要 `nodejs` 的支持，请先下载 并安装 [Node.js](http://nodejs.org/) 。

首先进入项目根目录，初始化项目为 node.js 项目；

```shell
# 初始化项目为 node.js 项目
npm init -y
```

完成后项目根目录下新增了一个文件`package.json` ，打开并修改 `scripts` 部分；

```shell
"scripts": {
    "run": "jekyll serve"
 }
```

点击右上角 `Add Configuration`

 ![新增配置](/resource/images/html/githubpages/jekyll/jekyll_01.jpg)

选择 `npm`, 并进行如下配置；

 ![新增配置 - npm](/resource/images/html/githubpages/jekyll/jekyll_04_1.jpg)

现在已经可以在右上角快捷运行或停止项目了。

![启动服务](/resource/images/html/githubpages/jekyll/jekyll_04_2.jpg)

![停止服务](/resource/images/html/githubpages/jekyll/jekyll_04_3.jpg)





# 5. 小结

* Github Pages 免费提供了一个存储空间和域名来存储和访问我们的个人网站；
* Jekyll 通过模板生成静态网站，简化了静态网页的开发，同时 Github Pages 的支持简化了网站的发布流程；
* 搭建 Jekyll 本地开发环境可以让网站页面符合预期再提交，避免多次提交修改；
* 使用 WebStorm 开发 Jekyll 项目时需要编写项目的启动和关闭脚本或直接在控制台输入命令进行操作。

