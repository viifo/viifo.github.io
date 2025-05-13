---
layout:     series
title:      "上传 Library 到私有 Maven 仓库"
subtitle:   ""
date:       2022-05-06 14:00:00 +0800
author:     "Viifo"
category:   Android
series:     上传 Library 到中心仓库
number:     1
tags:
    - nexus
    - maven
---

将公共库上传到 Maven 仓库，这样多个项目就可以之家通过依赖管理工具下载使用，免去了复制公共库到多个项目，修改公共库后又要同步多个项目修改的烦恼。下面以 `Centos 7` 为例搭建一个私有的 `Maven` 仓库。



## 1. 安装 JDK

由于 `Maven` 依赖 `JDK` 环境，所以在安装 `Maven` 前需要确保安装有 `JDK` 。若没有安装 `JDK`，则需要先安装 `JDK`。

```shell
# 注：nexus3 要求使用 jdk8，否者可能报错如下：
No suitable Java Virtual Machine could be found on your system.
The version of the JVM must be 1.8.
Please define INSTALL4J_JAVA_HOME to point to a suitable JVM.


# 一键安装 open jdk
# 查看可安装的 open jdk1.8 版本
yum --showduplicate list java-1.8.0-openjdk*.x86_64
# 安装 open jdk
yum install -y java-1.8.0-openjdk-1.8.0.322.b06-1.el7_9.x86_64


# 或手动安装
# 下载 open jdk 8 (也可以下载 oracle jdk)
# 其他版本访问 http://jdk.java.net/java-se-ri/8-MR3
wget https://download.java.net/openjdk/jdk8u41/ri/openjdk-8u41-b04-linux-x64-14_jan_2020.tar.gz

# 解压 open jdk 到 /usr/local/ 目录下（jdk 放置目录随意）
tar -zxvf openjdk-8u41-b04-linux-x64-14_jan_2020.tar.gz -C /usr/local/

# 将 jdk 添加到环境变量
vim /etc/profile

# 在文件底部添加如下内容
JAVA_HOME=/usr/local/java-se-8u41-ri
PATH=$JAVA_HOME/bin:$PATH
CLASSPATH=$JAVA_HOME/jre/lib/ext:$JAVA_HOME/lib/tools.jar
export PATH JAVA_HOME CLASSPATH

# 更新环境变量
source /etc/profile

# 验证jdk环境变量配置
java -version
```



## 2. 通过 Nexus 搭建 Maven 仓库

### 2.1 下载安装 Nexus

```shell
# 下载 nexus
# 下载其他版本可访问 https://help.sonatype.com/repomanager3/product-information/download/download-archives---repository-manager-3
wget https://sonatype-download.global.ssl.fastly.net/repository/downloads-prod-group/3/nexus-3.38.1-01-unix.tar.gz

# 解压 nexus 到 /usr/local/ 目录下
tar -zxvf nexus-3.38.1-01-unix.tar.gz -C /usr/local/

# 将 nexus 添加到环境变量
vim /etc/profile

# 在文件底部添加如下内容
NEXUS_HOME=/usr/local/nexus-3.38.1-01
PATH=$NEXUS_HOME/bin:$PATH
export PATH NEXUS_HOME

# 更新环境变量
source /etc/profile

# 验证 nexus 环境变量配置
nexus -version


# 若当前是以 root 身份运行 nexus，会有下面的警告
WARNING: ************************************************************
WARNING: Detected execution as "root" user.  This is NOT recommended!
WARNING: ************************************************************
# 修改启动脚本
vim /usr/local/nexus-3.38.1-01/bin/nexus
# 把
run_as_root=true
# 修改为
run_as_root=false

```



### 2.2 配置 Nexus

```shell
# 启动 nexus
nexus start
# 查看访问端口
cat /usr/local/nexus-3.38.1-01/etc/nexus-default.properties
# application-port=8081

# 浏览器访问 nexus
# 若访问不了可使用在 /usr/local/sonatype-work/nexus3/log 目录下查看日志是否报错
# 注意开放访问端口
http://ip:8081
```



**登录 Nexus**

如图2.1所示，点击右上角 `Sign in` 登录 `Nexus`，通过命令 `cat /usr/local/sonatype-work/nexus3/admin.password` 查看登录密码。

![图2.1](/resource/images/android/nexus/nexus_2_1.png)



**修改密码**

如图 2.2 所示，跟着第一次登录的引导弹窗即可修改密码。

![图2.2](/resource/images/android/nexus/nexus_2_2.png)



**禁止匿名访问**

如图 2.3 所示，选择是否允许匿名访问，若希望从该仓库中下载依赖的时候需要验证身份，则选择不允许匿名访问。

![图2.3](/resource/images/android/nexus/nexus_2_3.png)



### 2.3 新建 Maven 仓库

如图 2.4 所示，准备创建一个新仓库。

![图2.4](/resource/images/android/nexus/nexus_2_4.png)



如图 2.5 所示，仓库类型选择 ` maven2(hosted) `。

![图2.5](/resource/images/android/nexus/nexus_2_5.png)



如图 2.6 所示，填写 `Name`  和选择 `Deployment policy(部署策略)` 为 `Disable redeploy`, 即不允许重新部署(同一版本的库只能发布一次，再次发布则需更新版本后发布)。
> 注：若 `Deployment policy` 为 `Allow redeploy` 则表示同一版本的库能多次发布。

![图2.6](/resource/images/android/nexus/nexus_2_6.png)



注意：`Version policy` 中的选项含义如图 2.7 所示，请按需选择。

![图2.7](/resource/images/android/nexus/nexus_2_7.png)



如图 2.8 所示，点击 `copy` 按钮即可查看新创建的仓库地址。

![图2.8](/resource/images/android/nexus/nexus_2_8.png)

>   注： libs-snapshot 仓库是后面创建的 Snapshot 仓库，其 `Version policy` 为 `Snapshot` ，`Deployment policy` 为 `Allow redeploy`。




## 3. 发布 Android Library

新建一个 AS 项目用于测试发布 Library。此项目有一个名为 `common ` 的 Module，`common ` 中有一个名为 `CustomTextView` 的自定义View，如图 3.1 所示。

![图3.1](/resource/images/android/nexus/nexus_3_1.png)



由于我们要发布的库为 `common`，所以在 `common` 下的 `build.gradle` 文件中配置用于发布库到 `Maven` 仓库的插件 `maven-publish` 并配置此插件，如图 3.2 和 图 3.3 所示。

![图3.2](/resource/images/android/nexus/nexus_3_2.png)

![图3.3](/resource/images/android/nexus/nexus_3_3.png)

 具体配置如下：

```groovy
plugins {
    ......
    id 'maven-publish'
}

android {
    ......
}

// 生成文档注释
task generateJavadocs(type: Javadoc) {
    failOnError = false
    source = android.sourceSets.main.java.srcDirs  // 设置源码所在的位置
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
                url = 'http://192.168.0.105:8081/repository/libs/'
                credentials {
                    username = 'admin'
                    password = '123456'
                }
            }
            maven {
                // 允许使用 http
                allowInsecureProtocol = true
                name 'snapshot'
                url = 'http://192.168.0.105:8081/repository/libs-snapshot/'
                credentials {
                    username = 'admin'
                    password = '123456'
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



现在我们可以选择发布 `release`或 `snapshot `版本的 Library 到对应的 `Maven` 仓库了，如图 3.4 所示。

![图3.4](/resource/images/android/nexus/nexus_3_4.png)



发布 `release` 库，出现如图 3.5 所示的内容即成功发布。

![图3.5](/resource/images/android/nexus/nexus_3_5.png)



登录 Nexus 查看发布的库如图 3.6 和 图 3.7 所示。

![图3.6](/resource/images/android/nexus/nexus_3_6.png)

![图3.7](/resource/images/android/nexus/nexus_3_7.png)



注意：由于 libs 仓库选择的发布策略为 `Disable redeploy` 即禁止重新部署，所以我们需要更改版本号后才能再次发布，如图 3.8 所示。

![图3.8](/resource/images/android/nexus/nexus_3_8.png)




## 4. 通过 Maven 仓库导入依赖库

**修改 `settings.gradle` 文件，添加 maven 仓库**

```groovy
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        // 添加 maven 仓库
        maven {
            credentials {
                username 'admin'
                password '123456'
            }
            url 'http://192.168.0.105:8081/repository/libs/'
            allowInsecureProtocol true
        }
        maven {
            credentials {
                username 'admin'
                password '123456'
            }
            url 'http://192.168.0.105:8081/repository/libs-snapshot/'
            allowInsecureProtocol true
        }
    }
}
```

>   注：
>
>   1.  由于设置了 nexus 不允许匿名访问，所以需要在 credentials 中指出账号和密码；
>
>   2.  老版本 Gradle 需要修改项目根目录下的 `build.gradle`，并在 `allprojects` 中添加 maven 仓库。



<br/>
**导入依赖**

修改具体 module 下的 `build.gradle` 文件，导入依赖即可使用库，如图 4.1 所示。

```groovy
dependencies {
    implementation 'com.viifo.libs:common:1.0.1'
    // implementation 'com.viifo.libs:common:1.0.0-SNAPSHOT'
}
```

![图4.1](/resource/images/android/nexus/nexus_4_1.png)




## 5. 隐藏 Maven 账号信息

前面的各种配置都是使用明文配置账号密码信息，十分的不安全。我们在提交代码时通常都不会提交 `local.properties` 文件，因此我们可以将 Maven 仓库的账号信息写在 `local.properties` 文件中，其他地方只需读取其配置即可。

>   注：也可以单独定义一个文件来放置 maven 账号信息，如 `info.properties`。

修改 `local.properties` 文件，添加 maven 账号信息如下所示：

```properties
......

# 底部添加 maven 账号信息
nexus_username = admin
nexus_password = 123456
```

修改 `settings.gradle`，导入 `local.properties` 配置如下所示：

```groovy
pluginManagement {
    // ......
}

// 导入 local.properties 配置
def props = new Properties()
file("local.properties").withInputStream { props.load(it) }

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven {
            credentials {
                username props.getProperty("nexus_username")
                password props.getProperty("nexus_password")
            }
            url 'http://192.168.0.105:8081/repository/libs/'
            allowInsecureProtocol true
        }
        maven {
            credentials {
                username props.getProperty("nexus_username")
                password props.getProperty("nexus_password")
            }
            url 'http://192.168.0.105:8081/repository/libs-snapshot/'
            allowInsecureProtocol true
        }
    }
}

// ......

```

修改 Module `common`  中的 `build.gradle` 文件，导入 `local.properties` 配置如下所示：

```groovy
plugins {
    // ......
    id 'maven-publish'
}

// 导入 local.properties 配置
def props = new Properties()
rootProject.file("local.properties").withInputStream { props.load(it) }

// ......

afterEvaluate {
    publishing {
        repositories { handler ->
            maven {
                // 允许使用 http
                allowInsecureProtocol = true
                name 'release'
                url = 'http://192.168.0.105:8081/repository/libs/'
                credentials {
                    username = props.getProperty("nexus_username")
                    password = props.getProperty("nexus_password")
                }
            }
            maven {
                // 允许使用 http
                allowInsecureProtocol = true
                name 'snapshot'
                url = 'http://192.168.0.105:8081/repository/libs-snapshot/'
                credentials {
                    username = props.getProperty("nexus_username")
                    password = props.getProperty("nexus_password")
                }
            }
        }
        publications {
            release(MavenPublication) {
                from components.release
                groupId = 'com.viifo.libs'
                artifactId = 'common'
                version = '1.0.1'
                artifact sourceJar
                artifact javadocJar
            }
            snapshot(MavenPublication) {
                from components.release
                groupId = 'com.viifo.libs'
                artifactId = 'common'
                version = '1.0.1-SNAPSHOT'
                artifact sourceJar
                artifact javadocJar
            }
        }
    }
}

// ......

```


这样我们就把敏感的账号信息隐藏起来了。

