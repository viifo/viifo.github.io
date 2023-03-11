---
layout:     post
title:      "PlatformIO for CLion"
subtitle:   ""
date:       2023-02-23 16:12:00 +0800
author:     "Viifo"
category:   IOT
tags:
    - IOT
    - PlatformIO
    - CLion
---

[PlatformIO](https://docs.platformio.org/en/latest/) 是一个跨平台、跨架构、多框架的专业工具，适用于嵌入式系统工程师和为嵌入式产品编写应用程序的软件开发人员。`PlatformIO for CLion` 是用于 `CLion ` 集成的插件，用于在 `CLion` 上为嵌入式产品编写应用程序。



## 1. 安装 CLion

CLion 是适用于 C 和 C++ 的跨平台 IDE，[CLion官方下载](https://www.jetbrains.com/clion/)。

`CLion 2022.3.2 `已经自带编译工具链 `MinGW` ，若没有编译工具链，请下载相关工具链，如 [MinGW](https://jb.gg/clion-mingw)、[Cygwin](https://cygwin.com/install.html) 后在 `File` -> `Settings ` -> `Build, Execution, Deployment` -> `Toolchains` 中配置工具链。



## 2. 安装 Python3

注意：Python3 不兼容 Python2，请下载 Python3，[Python官方下载](https://www.python.org/downloads/)。



## 3. 安装 PlatformIO for CLion 插件

**在线安装插件**

打开 `CLion` ，在 `File` -> `Settings ` -> `Plugins` -> `Marketplace` 中搜索 `PlatformIO for CLion` 安装，如图 3.1 所示。

![图3.1](/resource/images/iot/platformio_clion/3_1.png)



**本地安装插件**

若在线安装搜索不到插件，可选择对应版本的 [PlatformIO for CLion](https://plugins.jetbrains.com/plugin/13922-platformio-for-clion/versions) 下载到本地安装。在 `File` -> `Settings ` -> `Plugins` -> `设置图标`  -> `Install Plugin from Disk` 中选择下载的插件进行安装，如图 3.2 所示。

![图3.2](/resource/images/iot/platformio_clion/3_2.png)



插件安装完成后重启 `CLion`，选择新建 `PlatformIO` 项目，发现报错 `PlatformIO utility is not found`，这是因为没有安装 `PlatformIO-core`，如图 3.3 所示。

![图3.3](/resource/images/iot/platformio_clion/3_3.png)



## 4. 安装 PlatformIO-core

[官方文档参考](https://docs.platformio.org/en/latest/core/installation/methods/installer-script.html#local-download-macos-linux-windows)

下载 [get-platformio.py](https://raw.githubusercontent.com/platformio/platformio-core-installer/master/get-platformio.py) 到任意目录后进入目录执行如下命令将 `PlatformIO Core` 安装到虚拟 Python 环境中：

```shell
python get-platformio.py
```

安装完成后根据提示将目录 `C:\Users\${UserName}\.platformio\penv\Scripts` 添加到 `PATH` 环境变量，如图 4.1 所示。

![图4.1](/resource/images/iot/platformio_clion/4_1.png)



## 5. 新建项目

打开 `CLion`，新建一个 `PlatformIO` 项目，本人使用的板子是 `esp8266` ，这里的 `Available Boards and Frameworks` 就选择 `NodeMCU 1.0 (ESP-12E Module)`，如图 5.1 所示。

![图5.1](/resource/images/iot/platformio_clion/5_1.png)

选择 `Create` 创建项目，项目创建以后会进行初始化，这可能需要几分钟 (视网络情况而定)，出现如图 5.2 所示的情况表明项目初始化完成，可以开始进行项目开发了。

![图5.2](/resource/images/iot/platformio_clion/5_2.png)



## 6. 烧录程序

代码写好后就可以将程序烧录到开发板中。连接开发板，在 `platformio.ini` 文件中使用 `upload_port` 指定上传的串口，如图 6.1 所示。

![图6.1](/resource/images/iot/platformio_clion/6_1.png)

然后选择 `PlatformIO Upload` 如图 6.2 所示。

![图6.2](/resource/images/iot/platformio_clion/6_2.png)

点击运行按钮即可上传程序，并可在 `Run` 窗口查看上传日志，如图 6.3 所示。

![图6.3](/resource/images/iot/platformio_clion/6_3.png)



## 7. platformio.ini

`platformio.ini` 是 `PlatformIO` 的配置文件，如上传串口配置 [upload_port](https://docs.platformio.org/en/latest/projectconf/sections/env/options/upload/upload_port.html) 、三方库管理 [lib_deps](https://docs.platformio.org/en/latest/projectconf/sections/env/options/library/lib_deps.html) 等，具体配置可查看 [官方文档](https://docs.platformio.org/en/latest/projectconf/index.html)。



## 8. PlatformIO 常用命令

`PlatformIO` 相关命令可在 [官方文档](https://docs.platformio.org/en/latest/core/userguide/index.html#commands) 中查看，以下列出的是一些常用命令。



**设备列表**

```shell
# 官方文档地址
# https://docs.platformio.org/en/latest/core/userguide/device/cmd_list.html
platformio device list [OPTIONS]

# 列出可用设备，默认设置为 --serial 即列出可用的串行端口
platformio device list
```



**串口监视器**

控制台串口监视器命令，如果需要UI，可以使用免费的多平台 [CoolTerm](https://freeware.the-meiers.org/?utm_source=platformio&utm_medium=docs) 串口终端应用程序。

```shell
# 官方文档地址
# https://docs.platformio.org/en/latest/core/userguide/device/cmd_monitor.html#cmd-device-monitor
platformio device monitor [OPTIONS]

# 打开串口监视器，自动检测串口号，默认波特率 9600
platformio device monitor

# 打开串口监视器，串口号 COM5，波特率 115200
platformio device monitor -p COM5 -b 115200
```



**搜索库**

```shell
# 官方文档地址
# https://docs.platformio.org/en/latest/core/userguide/pkg/cmd_search.html#cmd-pkg-search
platformio pkg search [OPTIONS] [QUERY]

# 搜索与以“DHT”开头的单词匹配的包
platformio pkg search "DHT*"

# 搜索与以“DHT”开头的单词匹配的包, 第2页
platformio pkg search "DHT*" -p 2
```



**导入库**

```shell
# 官方文档地址
# https://docs.platformio.org/en/latest/core/userguide/pkg/cmd_install.html#cmd-pkg-install
platformio pkg install [OPTIONS]

# 安装库 adafruit/DHT sensor library
# 安装版本为 1.4.4
# ^表示安装最新的兼容版本，避免将来发生重大更改
# 导入的库会自动在 platformio.ini 文件中配置 lib_deps 项
platformio pkg install --library "adafruit/DHT sensor library@^1.4.4"
```

注：导入库后需要选中 `platformio.ini` 右键，然后选择 `PlatformIO` -> `Re-Init` 重新进行初始化，否则会找不到导入库相关的头文件。如图 8.1 所示。

![图8.1](/resource/images/iot/platformio_clion/8_1.png)

导入库的头文件后编译报错如下表明缺少相关依赖库：

```shell
*************************************************************************
* Looking for Adafruit_Sensor.h dependency? Check our library registry!
*
* CLI  > platformio lib search "header:Adafruit_Sensor.h"
* Web  > https://registry.platformio.org/search?q=header:Adafruit_Sensor.h
*
*************************************************************************
```

搜索到相关库后安装即可，如下所示：

```shell
# 先搜索相关库
platformio pkg search "header:Adafruit_Sensor.h"

# 然后找到相关库安装
platformio pkg install --library "adafruit/Adafruit Unified Sensor"

# 最后 re-init 后重新构建
```



**删除库**

```shell
# 官方文档地址
# https://docs.platformio.org/en/latest/core/userguide/pkg/cmd_uninstall.html#cmd-pkg-uninstall
platformio pkg uninstall [OPTIONS]

# 删除库 adafruit/Adafruit Unified Sensor
platformio pkg uninstall --library "adafruit/Adafruit Unified Sensor"
```
