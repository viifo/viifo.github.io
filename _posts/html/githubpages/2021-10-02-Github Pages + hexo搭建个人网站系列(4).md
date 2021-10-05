---
layout:     post
title:      "Github Pages + hexo搭建个人网站系列（四）"
subtitle:   "主题推荐"
date:       2021-10-02 11:00:00 +0800
author:     "Viifo"
category:   HTML
tags:
    - github
    - hexo
---

前一章我们讲解了搜索、分页和文章目录功能，目前 `Hexo` 项目的开发已经基本讲解完成，更多内容请查看 官方文档。本章将简单推荐几个 `Hexo` 主题模板，和主题的下载网站。





# 1. 主题下载

`Hexo` 主题可以从 [Hexo官方主题网站](https://hexo.io/themes/) 或者 [Search · hexo themes · GitHub](https://github.com/search?q=hexo+themes) 进行下载，下面以 [Hexo官方主题网站](https://hexo.io/themes/) 为例介绍主题下载。

检索主题，点击标题跳转 `Github` 仓库，即可通过页面下载或者 `git clone` 命令下载主题。

![](/resource/images/html/githubpages/hexo/hexo_04_01.jpg)



# 2. 主题使用

将下载的主题文件夹名称重名为 `pln`，并复制到项目的主题文件夹 `themes` 中。打开根目录下的 `_config.yml` 文件，找到如下内容并修改：

```yaml
theme: pln
```

构建并运行项目，体验新主题。





# 3. 主题修改

在修改模板之前，需要注意的是模板使用的`开源协议`。本例下载的模板使用的是 [MIT协议](https://mit-license.org/) ，协议译文如下：

> 版权所有 © 2021 <版权持有者>
>
> 特此授予任何人免费获得本软件和相关文档文件（“软件”）副本的许可，不受限制地处理本软件，包括但不限于使用、复制、修改、合并的权利、发布、分发、再许可和/或出售软件的副本，并允许向其提供软件的人员这样做，但须符合以下条件：
>
> 上述版权声明和本许可声明应包含在软件的所有副本或重要部分中。
>
> 本软件按“原样”提供，不提供任何形式的明示或暗示保证，包括但不限于适销性、特定用途适用性和不侵权的保证。在任何情况下，作者或版权持有人均不对任何索赔、损害或其他责任承担责任，无论是在合同诉讼、侵权行为或其他方面，由软件或软件的使用或使用或其他原因引起的或与之相关的软件。

即，作者只想保留版权，而无任何其他了限制，但是需要在修改后的代码中包含原作者的许可信息。了解完开源协议的要求，现在我们可以开始对模板进行修改，满足自己的需求了。





# 4. 主题推荐

* [NexT](http://theme-next.iissnan.com/getting-started.html)
* [hexo-theme-pln](https://github.com/gaoryrt/hexo-theme-pln)
* [hexo-theme-bamboo](https://github.com/yuang01/hexo-theme-bamboo)
* [hexo-theme-fluid](https://github.com/fluid-dev/hexo-theme-fluid)





# 5. 小结

* 可以在 [Hexo官方主题网站](https://hexo.io/themes/) 或 [Search · hexo themes · GitHub](https://github.com/search?q=hexo+themes) 上下载主题模板；
* 修改并发布网站时需要注意原模板使用的`开源协议`。
