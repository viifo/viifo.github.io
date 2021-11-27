---
layout:     post
title:      "Windows 环境下使用 Linux 工具"
subtitle:   ""
date:       2021-11-20 16:00:00 +0800
author:     "Viifo"
category:   Tools
tags:
    - cygwin
---


## 1. 下载 Cygwin

Cygwin 是一个在 Windows 平台上运行的类UNIX模拟环境，即 Cygwin 可以让我们在 Windows 上使用 Linux 中的命令。

[下载cygwin](https://cygwin.com/setup-x86.exe)，点击安装，选择只下载不安装，如图 1.1 所示。

![图1.1](/resource/images/tools/cygwin/cmd/1.1.jpg)

选择下载位置，如图 1.2 所示。

![图1.2](/resource/images/tools/cygwin/cmd/1.2.jpg)

选择从哪个网站下载，如图 1.3 所示。国内建议选择网易163或者阿里云，下载速度较快。

![图1.3](/resource/images/tools/cygwin/cmd/1.3.jpg)

搜索 `coreutils`，选择下载版本，如图 1.4 所示。

![图1.4](/resource/images/tools/cygwin/cmd/1.4.jpg)

下载完成后，查看下载好的文件夹，如图 1.5 所示。

![图1.5](/resource/images/tools/cygwin/cmd/1.5.jpg)



## 2. dd for windows

DD，即磁盘转储 (Disk Dump)。dd 是 Linux 下的工具，用于读取、转换并输出数据。windows 环境下没有 dd 工具，我们需要借助 Cygwin 来获取 。

找到文件 x86\release\coreutils\coreutils-8.26-2.tar.xz 并解压，如图 2.1 所示。

![图2.1](/resource/images/tools/cygwin/cmd/2.1.jpg)


​找到 usr/bin/dd.exe 并复制到其他位置。使用 cmd 显示 dd 版本信息将报错，如图所示 2.2 所示。

![图2.2](/resource/images/tools/cygwin/cmd/2.2.jpg)

报错原因为缺失相关的 dll 文件，在下载好的文件中找到 x86\release\cygwin\cygwin-3.2.0-1.tar.xz 并解压，如图 2.3 所示。

![图2.3](/resource/images/tools/cygwin/cmd/2.3.jpg)

找到 usr/bin/cygwin1.dll 并复制到放置 dd 工具的文件夹中。重复以上步骤，分别在 ：

* x86\release\libiconv\libiconv2\libiconv2-1.16-2.tar.xz 中找到 cygiconv-2.dll 文件；
* x86\release\gcc\libgcc1\libgcc1-11.2.0-1.tar.zst 中找到  cyggcc_s-1.dll 文件；
* x86\release\gettext\libintl8\libintl8-0.21-1.tar.xz 中找到 cygintl-8.dll 文件。

> tar.zxt 可使用 [peazip](https://peazip.github.io/peazip-64bit.html) 解压

上述操作完成后 dd 工具所在的目录中的文件如图2.4所示。

![图2.4](/resource/images/tools/cygwin/cmd/2.4.jpg)

再此使用 cmd 显示 dd 版本信息，如图所示 2.5 所示。

![图2.5](/resource/images/tools/cygwin/cmd/2.5.jpg)



## 3. rm for windows

rm 命令用于删除不需要的目录及文件。windows 环境下同样没有 rm 工具，我们需要借助 Cygwin 来获取。

找到文件 x86\release\coreutils\coreutils-8.26-2.tar.xz 并解压，如图 2.1 所示。

![图3.1](/resource/images/tools/cygwin/cmd/2.1.jpg)

找到 usr/bin/rm.exe 并复制到其他位置。使用 cmd 显示 rm 版本信息将报错，如图所示 3.2 所示。

![图3.2](/resource/images/tools/cygwin/cmd/3.2.jpg)

报错原因为缺失相关的 dll 文件，在下载好的文件中找到 x86\release\gettext\libintl8\libintl8-0.21-1.tar.xz 并解压，如图 3.3 所示。

![图3.3](/resource/images/tools/cygwin/cmd/3.3.jpg)

找到 usr/bin/cygintl-8.dll 并复制到放置 rm 工具的文件夹中。重复以上步骤，分别在：

* x86\release\libiconv\libiconv2\libiconv2-1.16-2.tar.xz 中找到 cygiconv-2.dll 文件；
* x86\release\gcc\libgcc1\libgcc1-11.2.0-1.tar.zst 中找到  cyggcc_s-1.dll 文件；
* x86\release\cygwin\cygwin-3.2.0-1.tar.xz 中找到 cygwin1.dll 文件。

> tar.zxt 可使用 [peazip](https://peazip.github.io/peazip-64bit.html) 解压

上述操作完成后 rm 工具所在的目录中的文件如图 3.4 所示。

![图3.4](/resource/images/tools/cygwin/cmd/3.4.jpg)

再此使用 cmd 显示 rm 版本信息，如图所示 3.5 所示。

![图2.5](/resource/images/tools/cygwin/cmd/3.5.jpg)



## 4. mkdir for windows

mkdir 命令用于创建目录，如果我们在编写 Makefile 文件中需要创建文件夹，为了实现分隔符统一，我们可以使用 mkdir 工具。windows 环境下没有 mkdir工具，我们需要借助 Cygwin 来获取 。找到文件 x86\release\coreutils\coreutils-8.26-2.tar.xz 并解压，如图 4.1 所示。

![图4.1](/resource/images/tools/cygwin/cmd/2.1.jpg)

 找到 usr/bin/mkdir.exe 并复制到其他位置。使用  mkdir 创建文件夹，如图所示 4.2 所示。

![图4.2](/resource/images/tools/cygwin/cmd/4.2.jpg)
