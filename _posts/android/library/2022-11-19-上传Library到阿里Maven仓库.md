---
layout:     series
title:      "上传 Library 到阿里 Maven 仓库"
subtitle:   ""
date:       2022-11-19 19:00:00 +0800
author:     "Viifo"
category:   Android
series:     上传 Library 到中心仓库
number:     3
hidden:     true
tags:
    - maven
---



## 1. 创建阿里私有 Maven 仓库

访问阿里云[仓库服务](https://developer.aliyun.com/mvn/guide)，选择制品仓库，如图 1.1 所示。

![图1.1](/resource/images/android/maven/ali/1_1_1.jpg)

登录后的页面如图 1.2 所示。

![图1.2](/resource/images/android/maven/ali/1_1_2.jpg)

点击图 1.2 左下角的设置即可查看用于上传 Maven 仓库的用户名和密码，如图 1.3 所示。

![图1.3](/resource/images/android/maven/ali/1_1_3.jpg)





## 2. 查看仓库地址

在仓库中没有任何内容时可以选择 `首次上传 - Gralde方式`  查看仓库地址，如图 2.1 所示。

![图2.1](/resource/images/android/maven/ali/1_2_1.jpg)

若仓库中已有内容，则可以通过 `仓库设置 - 基本信息` 查看仓库地址，如图 2.2 所示。

![图2.2](/resource/images/android/maven/ali/1_2_2.jpg)





## 3. 发布 Android Library

新建一个 AS 项目用于测试发布 Library。此项目有一个名为 `common` 的 Module，`common` 中有一个名为 `CustomTextView` 的自定义View，如图 3.1 所示。

![图3.1](/resource/images/android/maven/ali/1_3_1.png)

由于我们要发布的库为 `common`，所以在 `common` 下的 `build.gradle` 文件中配置用于发布库到 `Maven` 仓库的插件 `maven-publish` 并配置此插件，如下所示。

```groovy
plugins {
    ......
    id 'maven-publish'
}

// 获取 local.properties
// 由于 local.properties 文件一般不会提交，因此可以存放账号信息
def props = new Properties()
rootProject.file("local.properties").withInputStream { props.load(it) }

android {
    ......
}

// 生成文档注释
task generateJavadocs(type: Javadoc) {
    failOnError = false
    source = android.sourceSets.main.java.srcDirs // 设置源码所在的位置
    ext.androidJar = "${android.sdkDirectory}/platforms/${android.compileSdkVersion}/android.jar"
    classpath += files(ext.androidJar)
}

task sourceJar(type: Jar) {
    from android.sourceSets.main.java.getSrcDirs() // 源码路径
    archiveClassifier = "sources"
}

task javadocJar(type: Jar) {
    from generateJavadocs.destinationDir
    archiveClassifier.set('javadoc')
}

afterEvaluate {
    publishing {
        repositories { handler ->
            maven {
                // 允许使用 http
                allowInsecureProtocol = true
                name 'release'
                url = 'https://packages.aliyun.com/maven/repository/xxxxxxx-release-xxxxxxx/'
                credentials {
                    username = props.getProperty("ali_username")
                    password = props.getProperty("ali_password")
                }
            }
            maven {
                // 允许使用 http
                allowInsecureProtocol = true
                name 'snapshot'
                url = 'https://packages.aliyun.com/maven/repository/xxxxxxx-snapshot-xxxxxxx/'
                credentials {
                   username = props.getProperty("ali_username")
                    password = props.getProperty("ali_password")'
                }
            }
        }
        publications {
            release(MavenPublication) {
                from components.release
                groupId = 'com.viifo.libs'
                artifactId = 'commom'
                version = '1.0.0'
                artifact sourceJar
                artifact javadocJar
            }
            snapshot(MavenPublication) {
                from components.release
                groupId = 'com.viifo.libs'
                artifactId = 'commom'
                version = '1.0.0-SNAPSHOT'
                artifact sourceJar
                artifact javadocJar
            }
        }
    }
}

dependencies {
    ......
}
```

现在我们可以选择发布 `release` 或 `snapshot` 版本的 Library 到对应的 `Maven` 仓库了，如图 3.2 所示。

> publishReleasePublicationToReleaseRepository - 发布到 release 仓库publishSnapshotPublicationToSnapshotRepository - 发布到 snapshot 仓库

![图3.2](/resource/images/android/maven/ali/1_3_2.png)

发布成功以后就可以在阿里仓库中查看到，如图 3.3 所示。

![图3.3](/resource/images/android/maven/ali/1_3_3.jpg)




## 4. 通过阿里 Maven 仓库导入依赖库

修改 `settings.gradle` 文件，添加阿里 maven 仓库，如下所示。

```groovy
// 获取 local.properties
// 由于 local.properties 文件一般不会提交，因此可以存放账号信息
def props = new Properties()
file("local.properties").withInputStream { props.load(it) }

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        // 添加阿里 maven 仓库
        maven {
            credentials {
                username props.getProperty("ali_username")
                password props.getProperty("ali_password")
            }
            url 'https://packages.aliyun.com/maven/repository/xxxxxxx-release-xxxxxxx/'
            allowInsecureProtocol true
        }
        maven {
            credentials {
                username props.getProperty("ali_username")
                password props.getProperty("ali_password")
            }
            url 'https://packages.aliyun.com/maven/repository/xxxxxxx-snapshot-xxxxxxx/'
            allowInsecureProtocol true
        }
    }
}
```

> 注：老版本 Gradle 需要修改项目根目录下的 `build.gradle`，并在 `allprojects` 中添加 maven 仓库。



导入依赖后即可使用发布的库，如下所示。

```groovy
dependencies {
    // implementation 'com.viifo.libs:common:1.0.1'
    implementation 'com.viifo.libs:common:1.0.0-SNAPSHOT'
}
```
