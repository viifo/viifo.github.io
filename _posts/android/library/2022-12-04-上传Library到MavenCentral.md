---
layout:     series
title:      "上传 Library 到 MavenCentral"
subtitle:   ""
date:       2022-12-04 16:21:00 +0800
author:     "Viifo"
category:   Android
series:     上传 Library 到中心仓库
number:     4
hidden:     true
tags:
    - maven
---



## 1. 新建 Sonatype 项目

`Sonatype` 为开源项目提供免费的中央存储仓库服务，要发布到 `MavenCentral` 仓库，必须先注册 [Sonatype JIRA](https://issues.sonatype.org/secure/Dashboard.jspa) 账号。

登录后在 `Sonatype仪表盘` 导航栏点击新建按钮向 `Sonotype` 提交新建项目的 `issue`，如图 1.1 所示。

![图1.1](/resource/images/android/maven/mavenCentral/1_1_1.jpg)

如图 1.2 所示，项目选择 `Community Support - Open Source Project Repository Hosting (OSSRH)`，问题类型选择 `New Project`，摘要会被用于搜索筛选，建议填写项目名，方便查找。

![图1.2](/resource/images/android/maven/mavenCentral/1_1_2.jpg)

由于后续会验证 `Group Id` 的所有权，建议 `Group Id` 按照 `io.github.[Github 用户名]` 的格式或个人域名逆序的顺序填写。

> 使用 gradle 导入依赖的格式为 `implementation 'groupId:artifactId:version'`

`Project URL` 填写 Github 项目地址，`SCM url` 填写项目仓库克隆地址，如图 1.3 所示。

![图1.3](/resource/images/android/maven/mavenCentral/1_1_3.jpg)

提交并等待一段时间后在 `issue` 底部 `活动日志` 一栏会有评论提示验证 `Group Id` 所有权。评论示例如下所示：

```shell
When choosing a groupId that reflects your project hosting, in this case, something like io.github.viifo would be correct.

com.github groupIds are invalid now. Please read https://central.sonatype.org/changelog/#2021-04-01-comgithub-is-not-supported-anymore-as-a-valid-coordinate for more info.

Please edit this ticket and update the Group Id field with the corrected coordinates.
Also, please create a public repo called https://github.com/viifo/OSSRH-71759 so we can verify Github account ownership.
```

就是让我们在 Github 上创建一个名为 `OSSRH-71759` 的公共仓库以验证`Group Id` 所有权，创建完成后回复并等待处理即可。回复示例如下所示：

```shell
GroupId has been changed and public repository added, please verify https://github.com/viifo/OSSRH-71759
```

当 `issue` 状态变为已解决或已关闭时说明 Sonatype 项目创建完毕，如图 1.4 所示。

![图1.4](/resource/images/android/maven/mavenCentral/1_1_4.jpg)







## 2. 生成签名密钥对

Maven 中央仓库会使用公开的公钥来校验文件签名，所以发布到 Maven 中央仓库的文件都需要进行 GPG 签名。GPG密钥对分为私钥和公钥，私钥自己持有，用于文件签名；公钥需要上传到公开的公钥服务器，公钥用于签名的校验。

**安装 gnupg**

可以通过 [gnupg](https://www.gnupg.org/download/index.html) 来生成 GPG密钥对，安装 `gnupg` 后会自动配置 `path环境变量`，下载页面如图 2.1 所示。

![图2.1](/resource/images/android/maven/mavenCentral/1_2_1.jpg)

**新建密钥对**

点击新建密钥对，如图 2.2 所示。

![图2.2](/resource/images/android/maven/mavenCentral/1_2_2.jpg)

根据提示填写相关信息，注意勾选使用密码保护生成的密钥，如图 2.3 所示。

![图2.3](/resource/images/android/maven/mavenCentral/1_2_3.jpg)

点击高级设置，选择加密方式为 `RSA`，如图 2.4 所示。

![图2.4](/resource/images/android/maven/mavenCentral/1_2_4.jpg)

可以选择创建一个吊销证书，以便以后作废密钥，如图 2.5 所示。

![图2.5](/resource/images/android/maven/mavenCentral/1_2_5.jpg)

接着向服务器发布公钥，如图2.6 所示。

![图2.6](/resource/images/android/maven/mavenCentral/1_2_6.jpg)

> 常用的公钥服务器地址：
>
> keyserver.ubuntu.com
> keys.openpgp.org
> pgp.mit.edu
>
> 也可通过以下命令上传指定的服务器
>
> // 上传公钥
> gpg --keyserver [服务器地址] --send-keys [密钥指纹]
> // 验证公钥
> gpg --keyserver [服务器地址] --recv-keys [密钥指纹]





## 3. 发布 Android Library

由于我们要发布的库为 `sidesliplayout`，所以需修改 `sidesliplayout` Module 下的 `build.gradle` 文件，配置用于发布到 `Maven` 中央仓库的插件 `maven-publish` 和配置用于签名的插件 `signing`，如下所示。

```groovy
plugins {
    ......
    id 'maven-publish'
    id 'signing'
}

android {
    ......
}

afterEvaluate {
    publishing {
        repositories { handler ->
            maven {
                // 允许使用 http
                allowInsecureProtocol = true
                name 'release'
                // 默认先发布到 staging 暂存库，需要手动发布到中央仓库
                url = 'https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/'
                credentials {
                    username = project.property("sonatype.username")
                    password = project.property("sonatype.password")
                }
            }
            maven {
                // 允许使用 http
                allowInsecureProtocol = true
                name 'snapshot'
                url = 'https://s01.oss.sonatype.org/content/repositories/snapshots'
                credentials {
                   username = project.property("sonatype.username")
                   password = project.property("sonatype.password")
                }
            }
        }
        publications {
            release(MavenPublication) {
                from components.release
                groupId = 'io.github.viifo'
                artifactId = 'sidesliplayout'
                version = '1.0.0'
                artifact javadocJar
                artifact sourceJar
                pom {
                    name = 'SideSlipLayout'
                    description = 'An overall sliding side-slip layout.'
                    url = 'https://github.com/viifo/SideSlipLayout'
                    scm {
                        // 项目仓库地址
                        connection = 'https://github.com/viifo/SideSlipLayout.git'
                        developerConnection = 'https://github.com/viifo/SideSlipLayout.git'
                        url = 'https://github.com/viifo/SideSlipLayout'
                    }
                    licenses {
                        license {
                            name = 'The Apache License, Version 2.0'
                            url = 'http://www.apache.org/licenses/LICENSE-2.0.txt'
                        }
                    }
                    developers {
                        developer {
                            id = 'viifo'
                            name = 'viifo'
                            email = 'jayeli.domain@gmail.com'
                        }
                    }
                }
            }
            snapshot(MavenPublication) {
                from components.release
                groupId = 'io.github.viifo'
                artifactId = 'sidesliplayout'
                version = '1.0.0-SNAPSHOT'
                artifact javadocJar
                artifact sourceJar}
            }
        }
    }
}

signing {
    // 签名配置
    // 密钥信息放在全局的 gradle.properties 中
    sign publishing.publications
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
    archiveClassifier.set('sources')
}

task javadocJar(type: Jar) {
    from generateJavadocs.destinationDir
    archiveClassifier.set('javadoc')
}

dependencies {
    ......
}
```

修改全局的 `gradle.properties` 文件，此文件一般存放在 `C:/username/.gradle/` 目录下，在 `Android Studio` 中使用 `Android` 视图也可以查看到用 `Global Properties` 注明的`gradle.properties` 文件。添加如下内容：

```groovy
# 由于全局的 gradle.properties 文件不会加入到版本控制中，因此适合存放私密信息
sonatype.username=登录sonatype的用户名
sonatype.password=登录sonatype的密码

signing.keyId=密钥指纹后8位
signing.password=保护密钥文件的密码
# 此文件是使用命令 gpg --export-secret-keys > C:/Users/Alessa/.gnupg/secring.gpg 导出的私钥文件
signing.secretKeyRingFile=C:/Users/Alessa/.gnupg/secring.gpg
```

> 当设置了 `GRADLE_USER_HOME` 环境变量后，应该修改此环境变量对应目录下的 `gradle.properties` 文件。
>
> 更多环境变量相关内容请查看[官方文档](https://developer.android.google.cn/studio/command-line/variables)。



现在我们可以选择发布 `release` 或 `snapshot` 版本的 Library 到对应的 `Maven` 仓库了，如图 3.1 所示。

> publishReleasePublicationToReleaseRepository - 发布到 release 仓库publishSnapshotPublicationToSnapshotRepository - 发布到 snapshot 仓库

![图3.1](/resource/images/android/maven/mavenCentral/1_3_1.png)





## 4. 通过 Maven 中央仓库导入依赖库

发布成功后即可登录 [Nexus Repository](https://s01.oss.sonatype.org/) 查看发布的文件。通过 `Artifact Search` 搜索 `Group Id` 可查看发布的 `snapshot` 包，如图 4.1 所示。

![图3.1](/resource/images/android/maven/mavenCentral/1_4_1.jpg)

点击左侧菜单中的 `Staging Repositories` 后在搜索 `Group Id` 即可查看发布的 `release` 包，如图 4.2 所示。

![图3.2](/resource/images/android/maven/mavenCentral/1_4_2.jpg)

修改 `settings.gradle` 文件，添加 maven 仓库，如下所示。

```groovy
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        // 中央仓库（不包含 snapshot 中央仓库）
        mavenCentral()
        // snapshot 中央仓库
        maven { url 'https://s01.oss.sonatype.org/content/repositories/snapshots/'}
    }
}
```

> 注：老版本 Gradle 需要修改项目根目录下的 `build.gradle`，并在 `allprojects` 中添加 maven 仓库。

导入依赖后即可使用发布的库，如下所示。

```groovy
dependencies {
    // implementation 'io.github.viifo:sidesliplayout:1.0.0'
    implementation 'io.github.viifo:sidesliplayout:1.0.0-SNAPSHOT'
}
```





## 5. 发布Release包到中央仓库

发布到 snapshot 仓库的包发布成功后可以立即使用，而发布到 release 仓库的包会默认先发布到 staging 暂存库，需要手动发布到中央仓库后才能使用。

打开暂存库 `Staging Repositories` ，点击 Close 按钮，填写描述后点击确认。此操作会对要发布的包进行验证，如图 5.1 所示。

![图4.1](/resource/images/android/maven/mavenCentral/1_5_1.jpg)

如果验证出错可在 `Activity` 中查看错误提示，如图 5.2 所示。

![图4.2](/resource/images/android/maven/mavenCentral/1_5_2.jpg)

要重新上传时可点击 `drop` 按钮删除后再上传，如图 5.3 所示。

![图4.3](/resource/images/android/maven/mavenCentral/1_5_3.jpg)

文件验证通过后就可以点击 `release` 按钮将文件从暂存仓库发布到中央仓库了，如图 5.4 所示。

![图5.4](/resource/images/android/maven/mavenCentral/1_5_4.jpg)

发布成功可可按图 5.5 所示查看。

![图5.5](/resource/images/android/maven/mavenCentral/1_5_5.jpg)





## Close 错误列表

**1. Event: Failed: POM Validation**

失败信息：Project name missing, Project description missing, Project URL missing, License information missing, SCM URL missing, Developer information missing

![错误1](/resource/images/android/maven/mavenCentral/error_1.jpg)

解决方法：在 `release` 节点下添加 `pom` 相关信息，如下所示：

```groovy
afterEvaluate {
    publishing {
        publications {
            release(MavenPublication) {
                // .....
                pom {
                    name = 'SideSlipLayout'
                    description = 'An overall sliding side-slip layout.'
                    url = 'https://github.com/viifo/SideSlipLayout'
                    scm {
                        connection = 'https://github.com/viifo/SideSlipLayout.git'
                        developerConnection = 'https://github.com/viifo/SideSlipLayout.git'
                        url = 'https://github.com/viifo/SideSlipLayout'
                    }
                    licenses {
                        license {
                            name = 'The Apache License, Version 2.0'
                            url = 'http://www.apache.org/licenses/LICENSE-2.0.txt'
                        }
                    }
                    developers {
                        developer {
                            id = 'viifo'
                            name = 'viifo'
                            email = 'jayeli.domain@gmail.com'
                        }
                    }
                }
            }
        }
    }
}
```

**2. Event: Failed: Signature Validation**

失败信息：Missing Signature: '....javadoc.jar.asc' does not exist for 'sidesliplayout-1.0.0-javadoc.jar'.

![错误2](/resource/images/android/maven/mavenCentral/error_2.jpg)

解决方法：此错误出现的原因是相关文件没有签名。

需要引入 `signing` 插件对文件进行签名，如下所示：

```groovy
plugins {
    // ...
    id 'signing'
}

android {
    // ...
}

signing {
    sign publishing.publications
}
```

然后修改 `C:/username/.gradle/gradle.properties` 文件，添加如下内容：

```groovy
signing.keyId=密钥指纹后8位
signing.password=保护密钥文件的密码
# 此文件是使用命令 gpg --export-secret-keys > C:/Users/Alessa/.gnupg/secring.gpg 导出的私钥文件
signing.secretKeyRingFile=C:/Users/Alessa/.gnupg/secring.gpg
```



更多内容可查看[官方发布指南](https://central.sonatype.org/publish/release/)。
