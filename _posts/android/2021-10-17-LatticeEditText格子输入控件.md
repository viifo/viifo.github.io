---
layout:     post
title:      "LatticeEditText 格子输入框"
subtitle:   ""
date:       2023-06-11 12:00:00 +0800
update:     true
author:     "Viifo"
category:   Android
tags:
- view
---

[LatticeEditText](https://github.com/viifo/LatticeEditText) 是一个格子输入框，可用于验证码或密码输入。



## 1. 预览

|                           box模式                            |                           box模式                            |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![](/resource/images/android/latticeedit/latticeedit_p1.gif) | ![](/resource/images/android/latticeedit/latticeedit_p2.gif) |
|                        **box无边框**                         |                         **字符回显**                         |
| ![](/resource/images/android/latticeedit/latticeedit_p3.gif) | ![](/resource/images/android/latticeedit/latticeedit_p4.gif) |
|                         **line模式**                         |                         **line模式**                         |
| ![](/resource/images/android/latticeedit/latticeedit_p5.gif) | ![](/resource/images/android/latticeedit/latticeedit_p6.gif) |
|                       **自动切换焦点**                       |                                                              |
| ![](/resource/images/android/latticeedit/latticeedit_p7.gif) |                                                              |





## 2. 新建控件

我们先新建 `LatticeEditText` 控件，如下所示：

```kotlin
package com.viifo.latticeedittext

import android.content.Context
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatTextView

/**
 * 格子输入框
 */
class LatticeEditText @JvmOverloads constructor(
    context: Context, 
    attrs: AttributeSet? = null
) : AppCompatTextView(context, attrs) {

}
```

在测试使用的 `DemoActivity` 中添加如下布局，在布局文件中使用 `LatticeEditText` 控件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:focusable="true"
    android:focusableInTouchMode="true"
    tools:context=".DemoActivity">

    <!-- 格子输入框 -->
    <com.viifo.latticeedittext.LatticeEditText
        android:id="@+id/et_input"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="0dp"
        android:layout_margin="5dp"
        android:textSize="18sp"
        android:textColor="#ff0000"
        app:layout_constraintVertical_bias="0.2"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent" />

    <Button
        android:id="@+id/btn_get"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/et_input"
        app:layout_constraintBottom_toTopOf="@+id/tv_text"
        app:layout_constraintVertical_bias="0.45"
        android:text="getText" />

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/tv_text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/btn_get"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintVertical_bias="0.45"
        android:text="text" />

</androidx.constraintlayout.widget.ConstraintLayout>
```





## 3. 控件属性

为了使 `LatticeEditText` 控件支持多种样式的设置，需要为其添加控件属性，添加控件属性后即可再布局文件中使用定义好的属性来控制显示效果。



新建 `res/values/attrs.xml` 文件，内容如下。其中各种属性表示的具体含义请查看 [项目主页](https://github.com/viifo/LatticeEditText) 。

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <declare-styleable name="LatticeEditText">
        <attr name="android:layout_margin" format="dimension"/>
        <attr name="android:layout_marginTop" format="dimension"/>
        <attr name="android:layout_marginLeft" format="dimension"/>
        <attr name="android:layout_marginRight" format="dimension"/>
        <attr name="android:layout_marginBottom" format="dimension"/>

        <attr name="android:background" format="color"/>
        <attr name="android:content" format="string"/>
        <attr name="text_size" format="dimension"/>
        <attr name="text_color" format="color"/>
        <attr name="input_mode" format="enum">
            <enum name="box" value="0"/>
            <enum name="line" value="1"/>
        </attr>
        <attr name="size" format="integer"/>
        <attr name="input_width" format="dimension"/>
        <attr name="input_height" format="dimension"/>
        <attr name="border_radius" format="dimension"/>
        <attr name="border_width" format="dimension"/>
        <attr name="border_color" format="color"/>
        <attr name="replace_text" format="string"/>

        <!-- 光标模式 -->
        <attr name="cursor_mode" format="enum">
            <enum name="box" value="0"/>
            <enum name="line" value="1"/>
        </attr>
        <attr name="cursor_color" format="color"/>
        <attr name="cursor_background" format="color"/>
        <attr name="show_cursor" format="boolean"/>
        <attr name="cursor_width" format="dimension"/>
        <!-- 光标模式为 line 时有效 -->
        <attr name="cursor_height" format="dimension"/>
        <attr name="cursor_orientation" format="enum">
            <!-- 光标模式为 line 且 input_mode 为 line 时有效 -->
            <enum name="horizontal" value="0" />
            <!-- 默认竖线光标 -->
            <enum name="vertical" value="1" />
        </attr>
    </declare-styleable>
</resources>
```

修改 `activity_demo.xml`中的 `LatticeEditText` 控件如下：

```xml
<com.viifo.latticeedittext.LatticeEditText
    android:id="@+id/et_input"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:padding="0dp"
    android:layout_margin="5dp"
    android:textSize="18sp"
    android:textColor="#ff0000"
    app:border_radius="10dp"
    app:cursor_height="15dp"
    app:cursor_color="#ff0000"
    app:size="4"
    app:input_mode="box"
    android:background="#ececec"
    app:border_color="#ff00ff"
    app:layout_constraintVertical_bias="0.2"
    app:layout_constraintLeft_toLeftOf="parent"
    app:layout_constraintRight_toRightOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintBottom_toBottomOf="parent" />
```





## 4. 测量&绘制



### 4.1 测量控件

由于 `LatticeEditText` 控件继承的是 View 而非 ViewGroup，所以只需要实现 `onMeasure` 和 `onDraw` 方法即可。`LatticeEditText` 控件的尺寸由格子的个数，即可输入的字符数决定，控件尺寸测量代码如下所示：

```kotlin
/** 可输入字符数 */
private var mSize = 0
/** 每个输入框的宽度 */
private var mWide = 0f
/** 每个输入框的高度 */
private var mHigh = 0f
/** 输入框外边距 */
private var mMarginRect = Rect()

override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    // 控件宽度 = 格子数 * (单个格子的宽度 + 左右外边距)
    val width = (mSize * (mWide + mMarginRect.left + mMarginRect.right))
    // 控件高度 = 单个格子的高度 + 上下外边距
    val height = (mHigh + mMarginRect.top + mMarginRect.bottom)
    setMeasuredDimension(width.toInt(), height.toInt())
}
```



### 4.2 获取属性值

在开始绘制View前，我们需要拿到布局文件中设置的各种属性值，以便我们根据这些属性值绘制不同的样式。对于各属性值的默认值，分别放置在 `colors.xml` 和 `dimens.xml` 中，以便项目根据具体需要覆盖这些默认值。

`colors.xml` 中的属性默认值内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="latticeEditText_background">#00000000</color>
    <color name="latticeEditText_textColor">#FF000000</color>
    <color name="latticeEditText_borderColor">#FF6200EE</color>
    <color name="latticeEditText_cursorColor">#FFBB86FC</color>
</resources>
```

`dimens.xml` 中的属性默认值内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <dimen name="latticeEditText_dp1">1dp</dimen>
    <dimen name="latticeEditText_dp2">1dp</dimen>
    <dimen name="latticeEditText_dp4">4dp</dimen>
    <dimen name="latticeEditText_dp10">10dp</dimen>
    <dimen name="latticeEditText_dp36">36dp</dimen>
    <dimen name="latticeEditText_sp14">14sp</dimen>
</resources>
```

获取属性值的部分代码如下：

```kotlin
/**
 * 初始化属性参数
 * @param context
 * @param attrs
 */
@SuppressLint("CustomViewStyleable")
private fun initAttrs(context: Context, attrs: AttributeSet?) {
    context.obtainStyledAttributes(attrs, R.styleable.LatticeEditText).apply {
        // background
        val backgroundColor = getColor(R.styleable.LatticeEditText_android_background, ContextCompat.getColor(context, R.color.latticeEditText_background))
        // 每个字符框占的宽度 & 高度
        mSize = getInteger(R.styleable.LatticeEditText_size, 4)
        mWide = getDimension(R.styleable.LatticeEditText_input_width, context.resources.getDimension(R.dimen.latticeEditText_dp36))
        mHigh = getDimension(R.styleable.LatticeEditText_input_height, context.resources.getDimension(R.dimen.latticeEditText_dp36))
        // 外边距
        val margin = getDimension(R.styleable.LatticeEditText_android_layout_margin, context.resources.getDimension(R.dimen.latticeEditText_dp4))
        mMarginRect = Rect(
            getDimension(R.styleable.LatticeEditText_android_layout_marginLeft, margin).toInt(),
            getDimension(R.styleable.LatticeEditText_android_layout_marginTop, margin).toInt(),
            getDimension(R.styleable.LatticeEditText_android_layout_marginRight, margin).toInt(),
            getDimension(R.styleable.LatticeEditText_android_layout_marginBottom, margin).toInt()
        )
        // text
        val textSize = getDimension(R.styleable.LatticeEditText_text_size, context.resources.getDimension(R.dimen.latticeEditText_sp14))
        val textColor = getColor(R.styleable.LatticeEditText_text_color, ContextCompat.getColor(context, R.color.latticeEditText_textColor))
        val text = getString(R.styleable.LatticeEditText_android_content) ?: ""
        val repText = getString(R.styleable.LatticeEditText_replace_text)
        // border
        mBorderColor = getColor(R.styleable.LatticeEditText_border_color, ContextCompat.getColor(context, R.color.latticeEditText_borderColor))
        mBorderWidth = getDimension(R.styleable.LatticeEditText_border_width, context.resources.getDimension(R.dimen.latticeEditText_dp1))
        mBorderRadius = getDimension(R.styleable.LatticeEditText_border_radius, 0f)
        mInputMode = getInteger(R.styleable.LatticeEditText_input_mode, 0)
        // cursor
        mCursorMode = getInteger(R.styleable.LatticeEditText_cursor_mode, 1)
        mCursorColor = getColor(R.styleable.LatticeEditText_cursor_color, ContextCompat.getColor(context, R.color.latticeEditText_cursorColor))
        mCursorBackground = getColor(R.styleable.LatticeEditText_cursor_background, backgroundColor)
        mShowCursor = getBoolean(R.styleable.LatticeEditText_show_cursor, true)
        mCursorWidth = getDimension(R.styleable.LatticeEditText_cursor_width, resources.getDimension(R.dimen.latticeEditText_dp1))
        mCursorHeight = getDimension(R.styleable.LatticeEditText_cursor_height, mHigh / 2)
        mCursorOrientation = getInteger(R.styleable.LatticeEditText_cursor_orientation, ORIENTATION_VERTICAL)
        
        // ......
        
    }.recycle()
}
```





### 4.3 控件绘制

控件绘制分为背景绘制、边框绘制、字符绘制和光标绘制。按照其层级，绘制顺序分别为：背景 -> 边框 -> box 光标 -> 文字 -> line 光标，其代码如下：

```kotlin
override fun onDraw(canvas: Canvas) {
    // 绘制背景&边框
    for (i in 0 until mSize) {
        canvas.drawRoundRect(mInputRectList[i], mBorderRadius, mBorderRadius, mBackgroundPaint)
        canvas.drawRoundRect(mBorderRectList[i], mBorderRadius, mBorderRadius, mBorderPaint)
    }
    // 绘制 box 光标
    drawBoxCursor(canvas)
    // 绘制文字, 由于每个字符大小可能不一致，所以需要每个字符都进行测量
    // mSize.coerceAtMost(mContent.length) 保险措施，避免 mInputRectList 数组越界
    for (i in 0 until mSize.coerceAtMost(mContent.length)) {
        canvas.drawText(
            mReplaceText ?: mContent[i].toString(),
            mInputRectList[i].left + mTextPoint.x,
            mInputRectList[i].top + mTextPoint.y,
            mTextPaint
        )
    }
    // 绘制 line 光标
    drawLineCursor(canvas)
}

/**
 * 绘制 box 模式光标, 即盒子背景，需在绘制文字前绘制
 * @param canvas
 */
private fun drawBoxCursor(canvas: Canvas) {
    if (mShowCursor && isFocused && mCursorMode == MODE_CURSOR_BOX && mSelection < mSize) {
        canvas.drawRoundRect(mInputRectList[mSelection], mBorderRadius, mBorderRadius, mCursorBackgroundPaint)
        canvas.drawRoundRect(mBorderRectList[mSelection], mBorderRadius, mBorderRadius, mCursorPaint)
    }
}

/**
 * 绘制 line 模式光标, 即闪烁竖线，需在绘制文字后绘制光标
 * @param canvas
 */
private fun drawLineCursor(canvas: Canvas) {
    if (mShowCursor && isFocused && mCursorMode == MODE_CURSOR_LINE) {
        if (mInputMode == MODE_INPUT_LINE && mCursorOrientation == ORIENTATION_HORIZONTAL && mSelection < mSize) {
            // 横线光标
            canvas.drawRoundRect(mBorderRectList[mSelection], mBorderRadius, mBorderRadius, mCursorPaint)
        } else {
            // 竖线光标
            if (mIsTwink && mSelection < mSize) {
                val x = mInputRectList[mSelection].left + mWide / 2 + mCursorOffset
                canvas.drawLine(
                    x,
                    mInputRectList[mSelection].top + (mHigh - mCursorHeight) / 2,
                    x,
                    mInputRectList[mSelection].top + mHigh - (mHigh - mCursorHeight) / 2, mCursorPaint
                )
            }
            // 间隔刷新光标
            if (System.currentTimeMillis() - mPrevRefreshTime >= defaultRefreshTime) {
                mPrevRefreshTime = System.currentTimeMillis()
                mIsTwink = !mIsTwink
            }
            // 间隔 500ms 重绘
            postInvalidateDelayed(500)
        }
    }
}
```

控件完整代码请查看 [项目源码](https://github.com/viifo/LatticeEditText) 。

