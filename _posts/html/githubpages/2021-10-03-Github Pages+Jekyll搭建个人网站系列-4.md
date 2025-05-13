---
layout:     series
title:      "主题模板"
subtitle:   ""
date:       2021-10-03 11:00:00 +0800
author:     "Viifo"
category:   HTML
series:     GitHub Pages + Jekyll 搭建个人网站
number:     4
hidden:     true
tags:
    - github
    - jekyll
---


前一章我们了解 Jekyll 项目的网站配置及文章的显示，到这对 Jekyll 项目的认识基本结束了，剩下的工作就是安排页面布局和美化页面。为了快捷便利的搭建个人网站 Jekyll 提供了许多 [主题模板](http://jekyllthemes.org/)，[Github ](http://github.com/)上也有许多开源的博客项目可以 `fork` 。这章主要讲解如何使用主题模板。



# 1. 选择主题

访问  [[Jekyll主题官网](http://jekyllthemes.org/)](http://jekyllthemes.org/)，选择一款喜欢的主题，例如：

![](/resource/images/html/githubpages/jekyll/jekyll_10.jpg)

> [Hanuman (jekyllthemes.org)](http://jekyllthemes.org/themes/hanuman/)



下载完成后，解压主题并进入根目录，运行查看效果

```shell
# 启动 jekyll 服务
jekyll server
```



在启动 Jekyll 服务的过程中可能会遇到一些错误，按照错误信息解决即可。如本例遇到的报错信息如下：

```shell
resolver.rb:278:in `block in verify_gemfile_dependencies_are_found!': Could not find gem 'jekyll (~> 3.8.5)' in locally installed gems. (Bundler::GemNotFound)
The source contains the following versions of 'jekyll': 4.2.0
```

解决方法：

```shell
bundle install
```

bundle安卓完成后，再次启动 Jekyll 服务，报错如下：

```shell
You have already activated i18n 1.8.10, but your Gemfile requires i18n 0.9.5. Prepending `bundle exec` to your command may solve this. (Gem::LoadError)
```

解决方法：

```shell
# 使用 bundle exec 启动 Jekyll 服务
# 服务启动成功后，访问 http://localhost:4000/hanuman//
bundle exec jekyll server
```



# 2. 修改主题模板

在修改模板之前，需要注意的是模板使用的`开源协议`。本例下载的模板使用的是 [MIT协议](https://mit-license.org/) ，协议译文如下：

> 版权所有 © 2021 <版权持有者>
>
> 特此授予任何人免费获得本软件和相关文档文件（“软件”）副本的许可，不受限制地处理本软件，包括但不限于使用、复制、修改、合并的权利、发布、分发、再许可和/或出售软件的副本，并允许向其提供软件的人员这样做，但须符合以下条件：
>
> 上述版权声明和本许可声明应包含在软件的所有副本或重要部分中。
>
> 本软件按“原样”提供，不提供任何形式的明示或暗示保证，包括但不限于适销性、特定用途适用性和不侵权的保证。在任何情况下，作者或版权持有人均不对任何索赔、损害或其他责任承担责任，无论是在合同诉讼、侵权行为或其他方面，由软件或软件的使用或使用或其他原因引起的或与之相关的软件。

即，作者只想保留版权，而无任何其他了限制，但是需要在修改后的代码中包含原作者的许可信息。



了解完开源协议的要求，现在我们可以开始对模板进行修改，满足自己的需求了。



# 3. 主题推荐

下面推荐几个不错的 Jekyll 模板：

* [NexT (jekyllthemes.org)](http://jekyllthemes.org/themes/jekyll-theme-next/)
* [GitHub - Huxpro/huxblog-boilerplate: Boilerplate of Hux Blog](https://github.com/huxpro/huxblog-boilerplate)
* [GitHub - mzlogin/mzlogin.github.io: Jekyll Themes / GitHub Pages 博客模板 / A template repository for Jekyll based blog](https://github.com/mzlogin/mzlogin.github.io)
* [GitHub - jeffreytse/jekyll-theme-yat: 🎨 Yet another theme for elegant writers with modern flat style and beautiful night/dark mode.](https://github.com/jeffreytse/jekyll-theme-yat)



# 4. 小结

* 可以在 [Jekyll主题官网](http://jekyllthemes.org/) 或 [Github ](http://github.com/) 上下载主题模板；
* 修改并发布网站时需要注意原模板使用的`开源协议`。

