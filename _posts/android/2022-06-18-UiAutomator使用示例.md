---
layout:     post
title:      "UiAutomator 使用示例"
subtitle:   ""
date:       2022-06-18 10:50:00 +0800
author:     "Viifo"
category:   Android
tags:
    - test
    - uiautomator
---


`UI Automator` 是一个界面测试框架，几乎可以模拟所有的人工操作。它的测试代码的编写不依赖于目标应用的内部实现细节，非常适用编写黑盒自动化测试。




## 1. 效果预览

![align:left](/resource/images/android/uiautomator/p1.gif)





## 2. 准备测试环境

在根目录下的 `build.gradle` 文件中的 repositories 下添加：

```groovy
allprojects {
    repositories {
        maven { url 'https://jitpack.io' }
    }
}
```

注：高版本 Gradle (7.+) 在根目录下的 `settings.gradle` 文件中 repositories 下添加：

```groovy
dependencyResolutionManagement {
    repositories {
        maven { url 'https://jitpack.io' }
    }
}
```



添加依赖

```groovy
dependencies {
    androidTestImplementation 'androidx.test.uiautomator:uiautomator:2.2.0'
}
```



在 `androidTest` 目录下的编写测试代码，示例类如下所示：

```kotlin
/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class ExampleInstrumentedTest {

    @Test
    fun testUiAutomator() {
        
    }
    
}
```





## 3. 编写测试代码

### 3.1 启动应用

通过 `Context.startActivity()` 函数启动包名对应的应用程序。

```kotlin
val appContext = InstrumentationRegistry.getInstrumentation().targetContext

// 启动App
val packageName = "com.viifo.demo.uiautomator"
appContext.startActivity(
    appContext.packageManager
        .getLaunchIntentForPackage(packageName)?.also { 
            it.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK)
        }
)
```



### 3.2 等待元素出现

通过 `UiDevice ` 对象可以访问设备的各种属性并执行设备的一些操作，如获取设备的屏幕尺寸，旋转设备，点击设备的返回键，菜单键，HOME键等。

通过 `UiDevice.wait(condition, timeout)` 函数等待对应的元素出现，`wait` 函数有两个参数，第一个参数 `condition` 是等待结束的条件，第二个参数 `timeout` 是等待的超时时间(ms)，超过时间未满足等待结束条件则结束等待。

`Until.hasObject()` 函数用于构造一个等待条件，与 `wait` 结合使用即产生了 `至少找到一个与选择器匹配的元素时结束等待` 的效果。

`By.res()` 函数以简洁的方式创建一个用于 `匹配元素包名和ID` 的 [BySelector](https://developer.android.google.cn/reference/androidx/test/uiautomator/BySelector)。

以下代码为等待一个在 `com.viifo.demo.uiautomator` 包下且 ID 为 `btn_dialog` 的元素出现，等待超时时间为 10s，即无论元素是否出现，10s后执行后续操作。

```kotlin
UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())?.apply {
    wait(
        Until.hasObject(
            By.res("com.viifo.demo.uiautomator:id/btn_dialog")
        ), 
        10000
    )
}
```

为便于后续使用，将其封装如下：

```kotlin
fun UiDevice.waitByRes(resourceId: String, block: () -> Unit) {
    wait(Until.hasObject(By.res(resourceId)), 10000)
    block()
}

fun UiDevice.waitByText(txt: String, block: () -> Unit) {
    wait(Until.hasObject(By.text(txt)), 10000)
    block()
}
```

> `By.text()` 函数用于创建一个 `匹配文本值` 的 [BySelector](https://developer.android.google.cn/reference/androidx/test/uiautomator/BySelector)。



### 3.3 匹配弹窗列表项

`UiDevice.findObject()` 函数用于查找一个与指定选择器条件匹配的元素。在以下代码中，先找到一个当前应用中 ID 为 `btn_dialog` 的按钮弹出一个列表弹窗，再点击文本为 `next` 的列表项。

```kotlin
UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())?.apply {
    
    // 等待主页特定 view 出现
    waitByRes("$packageName:id/btn_dialog") {
        // 点击 "show dialog" 按钮
        findObject(By.res("$packageName:id/btn_dialog")).click()
    }
    // 等待 dialog 列表显示
    waitByText("next") {
        // 找到文本 “next” 并点击
        findObject(By.text("next")).click()
    }
}
```



其中涉及的布局内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.appcompat.widget.LinearLayoutCompat
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    tools:context=".MainActivity">

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/iv_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="MainActivity" />

    <androidx.appcompat.widget.AppCompatButton
        android:id="@+id/btn_dialog"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="show dialog" />

</androidx.appcompat.widget.LinearLayoutCompat>
```

按钮点击监听事件处理如下：

```kotlin
btnDialog.setOnClickListener {
    val items = arrayOf("item1", "item2", "next")
    val builder: AlertDialog.Builder = AlertDialog.Builder(this@MainActivity)
    builder.setTitle("choose item")
    builder.setItems(items) { _, which ->
        if (which == 2) {
            startActivity(Intent(this@MainActivity, LabelActivity::class.java))
        }
    }
    builder.create().show()
}
```



### 3.4 匹配列表项

`UiDevice.findObjects()` 函数用于查找使用符合匹配条件的元素。以下代码中的 `findObject().findObjects()` 表示查找列表元素中的所有 Item 元素。

```kotlin
UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())?.apply {

    waitByRes("$packageName:id/sub_label") {
        // 一级分类标签选择第2个选项
        findObject(
            By.res("$packageName:id/main_label")
        ).findObjects(
            // item 没有设置 id, 只能使用类名查找
            By.clazz("android.widget.TextView")
        )[1].click()
        // 二级分类标签选择第1个选项
        findObject(
            By.res("$packageName:id/sub_label")
        ).findObjects(
            By.clazz("android.widget.TextView")
        )[0].click()
        // 点击下一步
        findObject(By.res("$packageName:id/btn_next")).click()
    }
}
```



其中涉及的布局内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingHorizontal="10dp">

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/tv_main_label"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:paddingVertical="10dp"
        android:layout_marginTop="20dp"
        android:text="选择一级分类"
        android:textColor="@color/black"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <com.viifo.labelview.LabelLayout
        android:id="@+id/main_label"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:mode="line"
        app:scrollable="true"
        app:orientation="horizontal"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tv_main_label" />

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/tv_sub_label"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:paddingVertical="10dp"
        android:layout_marginTop="50dp"
        android:text="选择二级分类"
        android:textColor="@color/black"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/main_label" />

    <com.viifo.labelview.LabelLayout
        android:id="@+id/sub_label"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:mode="line"
        app:scrollable="true"
        app:orientation="horizontal"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tv_sub_label" />

    <androidx.appcompat.widget.AppCompatButton
        android:id="@+id/btn_next"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="50dp"
        android:text="next step"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/sub_label"/>

</androidx.constraintlayout.widget.ConstraintLayout>
```

[LabelLayout](https://viifo.host/android/2022-06-04-LabelView%E6%A0%87%E7%AD%BE%E6%8E%A7%E4%BB%B6.html) 标签控件中的标签布局如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<TextView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginHorizontal="@dimen/labelLayout_labelHorizontalSpace"
    android:layout_marginVertical="@dimen/labelLayout_labelVerticalSpace"
    android:background="@drawable/label_view_shape_normal"
    android:gravity="center"
    android:paddingHorizontal="12dp"
    android:paddingVertical="5dp"
    android:textColor="@color/labelLayout_textColorNormal"
    android:textSize="12sp"
    tools:text="标签" />
```



### 3.5 匹配列表项并输入

**1. 使用 findObject 匹配列表项并输入**

使用 `findObject` 默认返回第一个匹配的元素，若存在多个匹配的元素，可使用 `findObjects` 选择指定的元素。下面以多层级的 `RecycleView` 嵌套为例展示各层级的元素的匹配顺序。

```kotlin
多个 RecyclerView 嵌套内层在前，外层在后，如下所示
         view              index
+-- recycler_view            4
╎   +-- recycler_view        3
╎   ╎   +-- recycler_view    1
╎   ╎   └── recycler_view    0
╎   └── recycler_view        2
```



`findObjects ` 查找不到屏幕外的列表元素，若列表太长屏幕显示不全，需要滚动列表后重新查找对应元素。使用 `UiObject2.scroll(direction, percent)` 可以列表滚动，其中参数 `direction` 用于指定滚动的方向，参数 `percent` 用于指定滚动的距离。

使用 `UiObject2.click()` 函数模拟点击事件，使用 `UiObject.text`  修改元素内容，可以实现点击输入框并输入文本的效果。

> `click()` 函数按需使用，若该输入框需要获取焦点才能保存输入的文本内容则需要调用 `click()` 函数。**使用 `click()` 函数需要禁止软键盘弹出**，否则软键盘的遮挡会影响后续操作。

```kotlin
UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())?.apply {
    // 等待列表数据加载成功
    waitByRes("$packageName:id/text_view") {
        
        val rv = findObject(By.res("$packageName:id/rv_list"))
        // 输入框
        val inputs = rv.findObjects(By.res("$packageName:id/edit_text"))
        // 选择器
        val choices = rv.findObjects(By.res("$packageName:id/tv_choice"))

        // 多行输入1
        inputs[0].click()
        inputs[0].text = "多行输入1"
        // 单行输入1
        inputs[1].click()
        inputs[1].text = "单行输入1"
        
        // 选项单选
        for (i in 0..2) {
            choices[i].click()
            waitByRes("android:id/text1") {
                // 找到第 i 项 item 并点击
                findObjects(
                    // 针对 @android:id/text1 这类ID
                    By.res("android:id/text1")
                )[i].click()
                // 点击确认
                findObject(By.text("确定")).click()
            }
            // 等待 dialog 弹窗动画结束
            Thread.sleep(300)
        }
        
        // findObjects 不能查找到不显示的列表元素
        // 先向下滚动显示全部 item 再重新查找元素
        rv.scroll(Direction.DOWN, 300f)
        Thread.sleep(300)
        
        // 输入框第二次查找
        val inputsSec = rv.findObjects(
            By.res("$packageName:id/edit_text")
        )
        // 由于第一次查找已经填写了前面的 3 个输入框，所以本次只填写最后两个
        // 单行输入3
        inputsSec[inputsSec.size - 2].click()
        inputsSec[inputsSec.size - 2].text = "单行输入3"
        // 单行输入4
        inputsSec[inputsSec.size - 1].click()
        inputsSec[inputsSec.size - 1].text = "单行输入4"
    }
}
```



其中涉及的布局内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".FillActivity">

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rv_list"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@+id/btn_submit"/>

    <androidx.appcompat.widget.AppCompatButton
        android:id="@+id/btn_submit"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginHorizontal="16dp"
        android:layout_marginVertical="10dp"
        android:text="submit"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"/>

</androidx.constraintlayout.widget.ConstraintLayout>
```

列表对应的 item 布局为多行输入、单行输入、选项选择三种。

多行输入布局：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.appcompat.widget.LinearLayoutCompat
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/ll_parent"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:layout_marginVertical="5dp"
    android:paddingVertical="10dp"
    android:focusable="true"
    android:focusableInTouchMode="true"
    android:background="@color/white">

    <androidx.appcompat.widget.LinearLayoutCompat
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:paddingHorizontal="10dp"
        android:gravity="center_vertical"
        android:orientation="horizontal">

        <androidx.appcompat.widget.AppCompatTextView
            android:id="@+id/tv_must"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textSize="16sp"
            android:textStyle="bold"
            android:text="*"
            android:textColor="@color/red"
            android:layout_marginEnd="3dp"
            android:visibility="gone"
            tools:visibility="visible"/>

        <androidx.appcompat.widget.AppCompatTextView
            android:id="@+id/text_view"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:textSize="14sp"
            android:text="多行输入"
            android:textColor="@color/black"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="@+id/et_price"
            app:layout_constraintBottom_toBottomOf="@+id/et_price" />

    </androidx.appcompat.widget.LinearLayoutCompat>

    <androidx.appcompat.widget.AppCompatEditText
        android:id="@+id/edit_text"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:minHeight="80dp"
        android:gravity="start"
        android:layout_weight="1"
        android:textSize="14sp"
        android:textColor="@color/black"
        android:background="@color/gray_light"
        android:hint="请输入"
        android:layout_margin="5dp"
        android:padding="10dp"/>

</androidx.appcompat.widget.LinearLayoutCompat>
```

单行输入布局：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.appcompat.widget.LinearLayoutCompat
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/ll_parent"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:layout_marginVertical="5dp"
    android:paddingVertical="10dp"
    android:paddingStart="10dp"
    android:focusable="true"
    android:focusableInTouchMode="true"
    android:background="@color/white">

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/tv_must"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textColor="@color/red"
        android:textSize="16sp"
        android:textStyle="bold"
        android:text="*"
        android:layout_marginEnd="3dp"
        android:visibility="gone"
        tools:visibility="visible"/>

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/text_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="14sp"
        android:textColor="@color/black"
        android:text="单行输入"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/et_price"
        app:layout_constraintBottom_toBottomOf="@+id/et_price" />

    <androidx.appcompat.widget.AppCompatEditText
        android:id="@+id/edit_text"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:textSize="14sp"
        android:textColor="@color/black"
        android:background="@android:color/transparent"
        android:hint="请输入"
        android:gravity="end"
        android:imeOptions="actionNext"
        android:singleLine="true"
        android:maxLines="1"
        android:paddingHorizontal="10dp"
        android:paddingVertical="5dp"
        android:layout_marginStart="30dp" />

</androidx.appcompat.widget.LinearLayoutCompat>
```

选项选择布局：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.appcompat.widget.LinearLayoutCompat
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/ll_parent"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:layout_marginVertical="5dp"
    android:paddingVertical="10dp"
    android:paddingStart="10dp"
    android:background="@color/white">

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/tv_must"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textColor="@color/red"
        android:textSize="16sp"
        android:textStyle="bold"
        android:text="*"
        android:layout_marginEnd="3dp"
        android:visibility="gone"
        tools:visibility="visible"/>

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/text_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="14sp"
        android:textColor="@color/black"
        android:text="单项选择"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/et_price"
        app:layout_constraintBottom_toBottomOf="@+id/et_price" />

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/tv_choice"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textSize="14sp"
        android:layout_marginEnd="5dp"
        android:layout_marginStart="30dp"
        android:background="@android:color/transparent"
        android:text="请选择"
        android:textColor="@color/black"
        android:gravity="center|end"
        android:singleLine="true"
        android:ellipsize="end"
        android:drawableEnd="@drawable/ic_arrow" />

</androidx.appcompat.widget.LinearLayoutCompat>
```



**2 使用 UiScrollable 匹配列表项并输入**

前面提到 `findObjects ` 查找不到屏幕外的列表元素，可以使用 `UiScrollable` 查找屏幕外的列表元素。使用 `UiScrollable`  匹配列表项并输入代码如下：

> `UiScrollable` 虽然可以查找屏幕外的列表元素，但是要对元素进行操作还是需要元素可见

```kotlin
UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())?.apply {
    // 等待列表数据加载成功
    waitByRes("$packageName:id/text_view") {
        val uiScrollable = UiScrollable(
            UiSelector()
                .resourceId("$packageName:id/rv_list")
                .className(RecyclerView::class.java.name)
        )

        // 输入框
        val inputs = UiSelector().resourceId("$packageName:id/edit_text")
        // 选择器
        val choices = UiSelector().resourceId("$packageName:id/tv_choice")

        // 多行输入1
        uiScrollable.getChild(inputs.instance(0)).also {
            it.click()
            it.text = "多行输入1"
        }
        // 单行输入1
        uiScrollable.getChild(inputs.instance(1)).also {
            it.click()
            it.text = "单行输入1"
        }
        
        // 选项单选
        for (i in 0..2) {
            uiScrollable.getChild(choices.instance(i)).also { it.click() }
            waitByRes("android:id/text1") {
                // 找到第 i 项 item 并点击
                findObjects(
                    // 针对 @android:id/text1 这类ID
                    By.res("android:id/text1")
                )[i].click()
                // 点击确认
                findObject(By.text("确定")).click()
            }
            // 等待 dialog 弹窗动画结束
            Thread.sleep(300)
        }

        // UiScrollable 虽然可以获取未显示的列表元素，但要操作元素还是需要元素可见
        // 向下(前)滚动列表
        uiScrollable.scrollToEnd(1, 2)
        Thread.sleep(300)
        
        // 单行输入3
        uiScrollable.getChild(inputs.instance(3)).also {
            it.click()
            it.text = "单行输入3"
        }
        // 单行输入4
        uiScrollable.getChild(inputs.instance(4)).also {
            it.click()
            it.text = "单行输入4"
        }
    }
}
```





## 4. 完整测试代码

```kotlin
package com.viifo.demo.uiautomator

import android.content.Intent
import androidx.recyclerview.widget.RecyclerView
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.*
import org.junit.Test
import org.junit.runner.RunWith


/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class ExampleInstrumentedTest {

    @Test
    fun testUiAutomator() {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())?.apply {
            // 启动App
            val packageName = "com.viifo.demo.uiautomator"
            appContext.startActivity(
                appContext.packageManager.getLaunchIntentForPackage(packageName)?.also {
                    it.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK)
                }
            )

            // 等待主页特定 view 出现
            waitByRes("$packageName:id/btn_dialog") {
                // 点击 "show dialog" 按钮
                findObject(By.res("$packageName:id/btn_dialog")).click()
            }
            // 等待 dialog 列表显示
            waitByText("next") {
                // 找到文本 “next” 并点击
                findObject(By.text("next")).click()
            }

            // 循环提交信息
            loopSubmit(this, packageName, 2)

            // test 代码结束后会退出 App， 这里等待 10s 再退出
            Thread.sleep(10000)
        }
    }

    private fun loopSubmit(uiDevice: UiDevice, packageName: String, loopCount: Int) {
        uiDevice.apply {
            (1..loopCount).forEach { _ ->
                // 等待标签列表中的标签展示
                waitByRes("$packageName:id/sub_label") {
                    // 一级分类标签选择第2个选项
                    findObject(
                        By.res("$packageName:id/main_label")
                    ).findObjects(
                        // item 没有设置 id, 只能使用类名查找
                        By.clazz("android.widget.TextView")
                    )[1].click()
                    // 二级分类标签选择第1个选项
                    findObject(
                        By.res("$packageName:id/sub_label")
                    ).findObjects(
                        By.clazz("android.widget.TextView")
                    )[0].click()
                    // 点击下一步
                    findObject(By.res("$packageName:id/btn_next")).click()
                }

                // fillByFindObject(this, packageName)
                fillByUiScrollable(this, packageName)

                // 提交
                waitByRes("$packageName:id/btn_submit") {
                    findObject(By.res("$packageName:id/btn_submit")).click()
                }

                // 点击重新提交
                waitByRes("$packageName:id/btn_submit_again") {
                    findObject(By.res("$packageName:id/btn_submit_again")).click()
                }

            }
        }
    }

    private fun fillByFindObject(uiDevice: UiDevice, packageName: String) {
        uiDevice.apply {
            // 等待列表数据加载成功
            waitByRes("$packageName:id/text_view") {
                // 若存在多个 RecyclerView 嵌套的情况需指明使用哪个 RecyclerView，
                // 否则可能会出现拿不到对应元素的可能
                // 多个 RecyclerView 嵌套切 id 相同时内层 id 在前，外层在后，如下所示：
                // @id/recycler_view          4
                //     @id/recycler_view      3
                //         @id/recycler_view  1
                //         @id/recycler_view  0
                //     @id/recycler_view      2
                // val rvs = findObjects(
                //     By.res("$packageName:id/rv_list")
                // )
                // 使用最外层 recyclerview
                // val rv = rvs[rvs.size - 1]

                val rv = findObject(By.res("$packageName:id/rv_list"))
                // 输入框
                val inputs = rv.findObjects(By.res("$packageName:id/edit_text"))
                // 选择器
                val choices = rv.findObjects(By.res("$packageName:id/tv_choice"))

                // 多行输入1
                inputs[0].click()
                inputs[0].text = "多行输入1"
                // 单行输入1
                inputs[1].click()
                inputs[1].text = "单行输入1"
                // 单行输入2
                inputs[2].click()
                inputs[2].text = "单行输入2"

                // 选项单选
                for (i in 0..2) {
                    choices[i].click()
                    waitByRes("android:id/text1") {
                        // 找到第 i 项 item 并点击
                        findObjects(
                            // 针对 @android:id/text1 这类ID
                            By.res("android:id/text1")
                        )[i].click()
                        // 点击确认
                        findObject(By.text("确定")).click()
                    }
                    // 等待 dialog 弹窗动画结束
                    Thread.sleep(300)
                }

                // 选项多选
                for (i in 3..4) {
                    choices[i].click()
                    waitByRes("android:id/text1") {
                        // 找到第i-2和第i项 item 并点击
                        findObjects(By.res("android:id/text1"))[i - 2].click()
                        findObjects(By.res("android:id/text1"))[i].click()
                        // 点击确认
                        findObject(By.text("确定")).click()
                    }
                    // 等待 dialog 弹窗动画结束
                    Thread.sleep(300)
                }

                // findObjects 不能查找到不显示的列表元素
                // 先向下滚动显示全部 item 再重新查找元素
                rv.scroll(Direction.DOWN, 300f)
                // 输入框第二次查找
                val inputsSec = rv.findObjects(
                    By.res("$packageName:id/edit_text")
                )
                // 由于第一次查找已经填写了前面的 3 个输入框，所以本次只填写最后两个
                // 单行输入4
                inputsSec[inputsSec.size - 1].click()
                inputsSec[inputsSec.size - 1].text = "单行输入4"
                // 单行输入3
                inputsSec[inputsSec.size - 2].click()
                inputsSec[inputsSec.size - 2].text = "单行输入3"
            }
        }
    }


    private fun fillByUiScrollable(uiDevice: UiDevice, packageName: String) {
        uiDevice.apply {
            // 等待列表数据加载成功
            waitByRes("$packageName:id/text_view") {
                // 若存在多个 RecyclerView 嵌套的情况需指明使用哪个 RecyclerView，
                // 否则可能会出现拿不到对应元素的可能
                // 多个 RecyclerView 嵌套切 id 相同时内层 id 在前，外层在后，如下所示：
                // @id/recycler_view          4
                //     @id/recycler_view      3
                //         @id/recycler_view  1
                //         @id/recycler_view  0
                //     @id/recycler_view      2
                // 使用最外层 recyclerview
                // val uiScrollable = UiScrollable(
                //     UiSelector()
                //         .resourceId("$packageName:id/rv_list")
                //         .className(RecyclerView::class.java.name)
                //         .index(4)
                // )

                val uiScrollable = UiScrollable(
                    UiSelector()
                        .resourceId("$packageName:id/rv_list")
                        .className(RecyclerView::class.java.name)
                )

                // 输入框
                val inputs = UiSelector().resourceId("$packageName:id/edit_text")
                // 选择器
                val choices = UiSelector().resourceId("$packageName:id/tv_choice")

                // 多行输入1
                uiScrollable.getChild(inputs.instance(0)).also {
                    it.click()
                    it.text = "多行输入1"
                }
                // 单行输入1
                uiScrollable.getChild(inputs.instance(1)).also {
                    it.click()
                    it.text = "单行输入1"
                }
                // 单行输入2
                uiScrollable.getChild(inputs.instance(2)).also {
                    it.click()
                    it.text = "单行输入2"
                }

                // 选项单选
                for (i in 0..2) {
                    uiScrollable.getChild(choices.instance(i)).also { it.click() }
                    waitByRes("android:id/text1") {
                        // 找到第 i 项 item 并点击
                        findObjects(
                            // 针对 @android:id/text1 这类ID
                            By.res("android:id/text1")
                        )[i].click()
                        // 点击确认
                        findObject(By.text("确定")).click()
                    }
                    // 等待 dialog 弹窗动画结束
                    Thread.sleep(300)
                }

                // 选项多选
                for (i in 3..4) {
                    uiScrollable.getChild(choices.instance(i)).also { it.click() }
                    waitByRes("android:id/text1") {
                        // 找到第i-2和第i项 item 并点击
                        findObjects(By.res("android:id/text1"))[i - 2].click()
                        findObjects(By.res("android:id/text1"))[i].click()
                        // 点击确认
                        findObject(By.text("确定")).click()
                    }
                    // 等待 dialog 弹窗动画结束
                    Thread.sleep(300)
                }

                // UiScrollable 虽然可以获取未显示的列表元素，但要操作元素还是需要元素可见
                // 向下(前)滚动列表
                uiScrollable.scrollToEnd(1, 2)
                // 单行输入3
                uiScrollable.getChild(inputs.instance(3)).also {
                    it.click()
                    it.text = "单行输入3"
                }
                // 单行输入4
                uiScrollable.getChild(inputs.instance(4)).also {
                    it.click()
                    it.text = "单行输入4"
                }
            }
        }
    }

}
```
