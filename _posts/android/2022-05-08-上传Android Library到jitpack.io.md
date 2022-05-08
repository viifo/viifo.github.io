---
layout:     post
title:      "上传 Android Library 到 jitpack.io"
subtitle:   ""
date:       2022-05-08 18:35:00 +0800
author:     "Viifo"
category:   Android
tags:
    - jitpack.io
---

上传 Android Library 到 jitpack.io 可通过 `maven-publish` 插件和 `android-maven` 插件进行发布，若项目只需要提交到 `jitpack.io`，可使用 `android-maven` 插件。

>   注： [android-maven](https://github.com/dcendents/android-maven-gradle-plugin) 插件目前已被弃用，建议使用  `maven-publish` 插件。



##  1. 使用 maven-publish 插件发布

创建 AS 项目并新建 一个名为 `common` 的 Module，修改 `common` 下的 `build.gradle` 文件，如下所示：

```groovy
plugins {
    // ......
    id 'maven-publish' // 导入 maven-publish 插件 
}

android {
    // ......
}

// maven-publish 插件配置 
afterEvaluate {
    publishing {
        publications {
            release(MavenPublication) {
                from components.release
                groupId = 'com.github.viifo'
                artifactId = 'PublishDemo'
                version = '1.0.0'
            }
        }
    }
}

dependencies {
    // ......
}

```

>   注： 其中的 `groupId`，`artifactId`，`version` 在发布到 jitpack.io 时并不能生效。在 Github 仓库中的项目发布到 jitpack.io 上的依赖库会统一命名为 `com.github.用户名:仓库名:release-tag`



然后使用如下命令检查此库是否可以安装到 mavenLocal (`$HOME/.m2/repository`) 中：

```shell
./gradlew publishToMavenLocal
// or
./gradlew publishReleasePublicationToMavenLocal
```

若不使用 `gradlew` 命令可点击图 1.1 中所示的命令。

![图1.1](/resource/images/android/jitpackio/jitpack_io_1_1.png)

若此库可以成功安装到 mavenLocal ，即可将项目提交到 Github 仓库中并创建一个发行版本，如图 1.2 ~ 图 1.4 所示。
> 注：目前 jitpack.io 已支持 码云(Gitee) 仓库 

![图1.2](/resource/images/android/jitpackio/jitpack_io_1_2.png)

![图1.3](/resource/images/android/jitpackio/jitpack_io_1_3.png)

![图1.4](/resource/images/android/jitpackio/jitpack_io_1_4.png)

发行版创建成功后即可访问 [jitpack.io](https://jitpack.io/) ，输入项目地址后点击 `Look up`，如图 1.5 所示。

![图1.5](/resource/images/android/jitpackio/jitpack_io_1_5.png)

接下来 `jitpack.io`会查找对应项目的发行版用于发布，若存在发行版，可点击 `Get it`进行发布，如图 1.6 所示。

![图1.6](/resource/images/android/jitpackio/jitpack_io_1_6.png)

图 1.7 展示了点击 `Get it` 后出现的构建动画。

![图1.7](/resource/images/android/jitpackio/jitpack_io_1_7.png)

若成功构建，即可点击绿色按钮的 `Get it` 查看如何使用此依赖库，如图 1.8 和 图 1.9 所示。

![图1.8](/resource/images/android/jitpackio/jitpack_io_1_8.png)

![图1.9](/resource/images/android/jitpackio/jitpack_io_1_9.png)



若项目构建失败，可点击红色的 `Log` 图标查看错误日志，修改后可重新提交构建，如图 1.10 所示。

>   注： 重新提交 jitpack.io 构建需在 Github 上新建一个新的发行版本

![图1.10](/resource/images/android/jitpackio/jitpack_io_1_10.png)





## 2. 使用 android-maven 插件发布

创建 AS 项目并新建 一个名为 `common` 的 Module，修改 `common` 下的 `build.gradle` 文件，如下所示：

```groovy
plugins {
    // ......
    id 'com.github.dcendents.android-maven' // 导入 android-maven 插件 
}

android {
    // ......
}

dependencies {
    // ......
}

```

修改项目根目录下的 `build.gradle` 文件，添加如下内容：

```groovy
buildscript {
    dependencies {
        classpath 'com.github.dcendents:android-maven-gradle-plugin:2.1'
    }
}
```

编译构建项目，若成功编译构建项目，剩余步骤详见 ` 使用 maven-publish 插件发布`。

