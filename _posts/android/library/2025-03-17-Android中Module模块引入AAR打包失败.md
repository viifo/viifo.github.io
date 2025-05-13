---
layout:     post
title:      "Android 中 Module 模块引入 AAR 打包失败"
subtitle:   "Direct local .aar file dependencies are not supported when building an AAR"
date:       2025-03-17 15:05:00 +0800
author:     "Viifo"
category:   Android
tags:
    - aar
    - groovy
---



## 1. 错误信息

安卓项目中在 `module` 下引入 `aar` 包打包时报错如下：

```groovy
Direct local .aar file dependencies are not supported when building an AAR. The resulting AAR would be broken because the classes and Android resources from any local .aar file dependencies would not be packaged in the resulting AAR.
```



## 2. 解决方案
### 2.1 方案一

在 `module` 中的 `build.gradle` 中修改依赖 `aar` 包为仅编译不参与打包。 

```groovy
// implementation fileTree(dir: 'libs', include: ['*.jar', '*.aar'])
compileOnly fileTree(dir: 'libs', include: ['*.jar', '*.aar'])
```

将 `module` 中的 `aar` 包复制一份到 `app/libs` 中，在 `app/build.gradle` 中配置 `aar` 参与打包。

```groovy
implementation fileTree(dir: 'libs', include: ['*.jar', '*.aar'])
```



### 2.2 方案二

创建一个与 `app` 同级的目录 (如 `aar`)，为每一个 `*.aar` 文件建立一个单独的目录，同时在目录中新建 `build.gradle` 文件，目录结构示例如下：

```shell
.
+-- app
+-- module_1
└── aar
    +-- aar_1
    ╎   +-- build.gradle
    ╎   └── xxx_1.aar
    └── aar_2
        +-- build.gradle
        └── xxx_2.aar
```

`aar_1/build.gradle` 文件内容如下：

```groovy
// 获取当前项目默认配置
configurations.maybeCreate("default")
// 将 aar 文件添加到默认配置中
artifacts.add("default", file('xxx_1.aar'))
```

同理，`aar_2/build.gradle` 文件内容如下：

```groovy
// 获取当前项目默认配置
configurations.maybeCreate("default")
// 将 aar 文件添加到默认配置中
artifacts.add("default", file('xxx_2.aar'))
```



修改 `settings.gradle` ，将存放 `aar` 文件的 `aar_1` 和 `aar_2` 作为 `module` 导入项目，内容如下：

```groovy
// aar_1
include(":aar_1")
project(":aar_1").projectDir = file("./aar/aar_1")
// aar_2
include(":aar_2")
project(":aar_2").projectDir = file("./aar/aar_2")
```



最后在 `module_1/build.gradle` 中导入 `aar` 模块即可。

```groovy
implementation project(path:':aar_1')
implementation project(path:':aar_2')
```



