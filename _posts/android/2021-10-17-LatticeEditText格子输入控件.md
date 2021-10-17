---
layout:     post
title:      "LatticeEditText 格子输入框"
subtitle:   ""
date:       2021-10-17 10:00:00 +0800
author:     "Viifo"
category:   Android
tags:
    - view
---

[LatticeEditText](https://github.com/viifo/LatticeEditText) 是一个格子输入框，可用于验证码或密码输入。



## 1. 预览

|            box模式            |           line模式            |
| :---------------------------: | :---------------------------: |
| ![](/resource/images/android/latticeedit/latticeedit_p1.gif) | ![](/resource/images/android/latticeedit/latticeedit_p2.gif) |
|         **box无边框**         |         **字符回显**          |
| ![](/resource/images/android/latticeedit/latticeedit_p3.gif) | ![](/resource/images/android/latticeedit/latticeedit_p4.gif) |





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
class LatticeEditText @JvmOverloads constructor(context: Context, attrs: AttributeSet? = null)
    : AppCompatTextView(context, attrs) {

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

运行项目，当前页面效果如图2.1所示。

![图2.1](/resource/images/android/latticeedit/latticeedit_2_1.jpg)





## 3. 控件属性

为了使 `LatticeEditText` 控件支持多种样式的设置，需要为其添加控件属性，添加控件属性后即可再布局文件中使用定义好的属性来控制显示效果。



新建 `res/values/attrs.xml` 文件，内容如下。其中各种属性表示的具体含义请查看 [项目主页](https://github.com/viifo/LatticeEditText) 。

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <declare-styleable name="LatticeEditText">
        <attr name="android:background" format="color"/>
        <attr name="android:textSize" format="dimension"/>
        <attr name="android:textColor" format="color"/>
        <attr name="android:text" format="string"/>
        <attr name="android:layout_margin" format="dimension"/>
        <attr name="android:layout_marginTop" format="dimension"/>
        <attr name="android:layout_marginLeft" format="dimension"/>
        <attr name="android:layout_marginRight" format="dimension"/>
        <attr name="android:layout_marginBottom" format="dimension"/>
        <attr name="android:padding" format="dimension"/>
        <attr name="android:paddingTop" format="dimension"/>
        <attr name="android:paddingLeft" format="dimension"/>
        <attr name="android:paddingRight" format="dimension"/>
        <attr name="android:paddingBottom" format="dimension"/>

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
        <attr name="cursor_width" format="dimension"/>
        <attr name="cursor_height" format="dimension"/>
        <attr name="cursor_color" format="color"/>
        <attr name="replace_text" format="string"/>
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
private var size = 0
/** 每个输入框的宽度 */
private var wide = 0f
/** 每个输入框的高度 */
private var high = 0f
/** 输入框内外边距 */
private var marginRect = Rect()
private var paddingRect = Rect()

override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    // 控件宽度 = 格子数 * (单个格子的宽度 + 左右外边距)
    val width = (size * (wide + marginRect.left + marginRect.right))
    // 控件高度 = 单个格子的高度 + 上下外边距
    val height = (high + marginRect.top + marginRect.bottom)
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
        val backgroundColor = getColor(R.styleable.LatticeEditText_android_background, context.resources.getColor(R.color.latticeEditText_background))
        // 每个字符框占的宽度 & 高度
        size = getInteger(R.styleable.LatticeEditText_size, 4)
        wide = getDimension(R.styleable.LatticeEditText_input_width, context.resources.getDimension(R.dimen.latticeEditText_dp36))
        high = getDimension(R.styleable.LatticeEditText_input_height, context.resources.getDimension(R.dimen.latticeEditText_dp36))
        // 外边距
        val margin = getDimension(R.styleable.LatticeEditText_android_layout_margin, context.resources.getDimension(R.dimen.latticeEditText_dp4))
        marginRect = Rect(
            getDimension(R.styleable.LatticeEditText_android_layout_marginLeft, margin).toInt(),
            getDimension(R.styleable.LatticeEditText_android_layout_marginTop, margin).toInt(),
            getDimension(R.styleable.LatticeEditText_android_layout_marginRight, margin).toInt(),
            getDimension(R.styleable.LatticeEditText_android_layout_marginBottom, margin).toInt()
        )
        // 内边距
        val padding = getDimension(R.styleable.LatticeEditText_android_padding, 0f)
        paddingRect = Rect(getDimension(R.styleable.LatticeEditText_android_paddingLeft, padding).toInt(),
            getDimension(R.styleable.LatticeEditText_android_paddingTop, padding).toInt(),
            getDimension(R.styleable.LatticeEditText_android_paddingRight, padding).toInt(),
            getDimension(R.styleable.LatticeEditText_android_paddingBottom, padding).toInt()
        )
        // text
        val textSize = getDimension(R.styleable.LatticeEditText_android_textSize, context.resources.getDimension(R.dimen.latticeEditText_sp14))
        val textColor = getColor(R.styleable.LatticeEditText_android_textColor, context.resources.getColor(R.color.latticeEditText_textColor))
        val text = getString(R.styleable.LatticeEditText_android_text)
        val repText = getString(R.styleable.LatticeEditText_replace_text)
        // border
        val borderColor = getColor(R.styleable.LatticeEditText_border_color, context.resources.getColor(R.color.latticeEditText_borderColor))
        val borderWidth = getDimension(R.styleable.LatticeEditText_border_width, context.resources.getDimension(R.dimen.latticeEditText_dp1))
        borderRadius = getDimension(R.styleable.LatticeEditText_border_radius, 0f)
        val inputMode = getInteger(R.styleable.LatticeEditText_input_mode, 0)
        // cursor
        val cursorColor = getColor(R.styleable.LatticeEditText_cursor_color, context.resources.getColor(R.color.latticeEditText_cursorColor))
        val cursorWidth = getDimension(R.styleable.LatticeEditText_cursor_width, context.resources.getDimension(R.dimen.latticeEditText_dp2))
        cursorHeight = getDimension(R.styleable.LatticeEditText_cursor_height, high / 2)

        //......

    }.recycle()
}
```





### 4.3 控件绘制

控件绘制分为背景绘制、边框绘制、字符绘制和光标绘制。按照其层级，绘制顺序分别为：背景 -> 边框 -> 文字 -> 光标，其代码如下：

```kotlin
override fun onDraw(canvas: Canvas) {
    // 绘制背景&边框
    for (i in 0 until size) {
        canvas.drawRoundRect(inputRects[i], borderRadius, borderRadius, backgroundPaint!!)
        canvas.drawRoundRect(borderRects[i], borderRadius, borderRadius, borderPaint!!)
    }
    // 绘制文字, 由于每个字符大小可能不一致，所以需要每个字符都进行测量
    val chars = content!!.toCharArray()
    for (i in chars.indices) {
        if (replaceText != null && chars[i].code != 32) {
            textPaint!!.getTextBounds(replaceText, 0, 1, textRect)
        } else {
            textPaint!!.getTextBounds(chars[i].toString(), 0, 1, textRect)
        }
        textPoint.x = (wide / 2 - textRect.width() / 2f + paddingRect.left).toInt()
        textPoint.y = (high / 2 + textRect.height() / 2f + paddingRect.top).toInt()
        canvas.drawText(
            (if (replaceText == null || chars[i].code == 32) chars[i].toString() else replaceText)!!,
            inputRects[i].left + textPoint.x,
            inputRects[i].top + textPoint.y,
            textPaint!!
        )
    }
    // 绘制光标
    if (isTwink && isFocused && selection < size) {
        val x = inputRects[selection].left + wide / 2 + cursorOffset
        canvas.drawLine(
            x,
            inputRects[selection].top + (high - cursorHeight) / 2,
            x,
            inputRects[selection].top + high - (high - cursorHeight) / 2, cursorPaint!!
        )
    }
    // 间隔刷新光标
    if (isFocused && System.currentTimeMillis() - prevRefreshTime >= LatticeEditText.defaultRefreshTime) {
        prevRefreshTime = System.currentTimeMillis()
        isTwink = !isTwink
    }
    // 间隔 500ms 重绘
    if (isFocused) {
        postInvalidateDelayed(500)
    }
}
```



### 4.4 绘制效果

当前完整代码如下所示：

```kotlin
package com.viifo.latticeedittext

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.inputmethod.EditorInfo
import androidx.appcompat.widget.AppCompatTextView
import com.viifo.latticeedittext.demo.R
import java.util.ArrayList


/**
 * 分格输入框
 */
class LatticeEditText @JvmOverloads constructor(context: Context, attrs: AttributeSet? = null)
    : AppCompatTextView(context, attrs) {

    /** 输入的文本内容 */
    private var content: String? = null
    /** 回显字符 */
    private var replaceText: String? = null
    /** 可输入字符数 */
    private var size = 0
    /** 每个输入框的宽度 */
    private var wide = 0f
    /** 每个输入框的高度 */
    private var high = 0f
    /** 输入框内外边距 */
    private var marginRect = Rect()
    private var paddingRect = Rect()
    /** 边框 */
    private var borderPaint: Paint? = null
    private var borderRadius = 0f
    private val borderRects: MutableList<RectF> = ArrayList()
    /** 背景 */
    private var backgroundPaint: Paint? = null
    private val inputRects: MutableList<RectF> = ArrayList()
    /** 文字 */
    private var textPaint: Paint? = null
    private val textRect = Rect()
    private val textPoint = Point()
    /** 光标 */
    private var cursorPaint: Paint? = null
    private var isTwink = false
    private var cursorHeight = 0f
    private var cursorOffset = 0
    private var cursorOffsetValue = 0
    private var selection = 0
    private var prevRefreshTime: Long = 0

    /**
     * 初始化属性参数
     * @param context
     * @param attrs
     */
    @SuppressLint("CustomViewStyleable")
    private fun initAttrs(context: Context, attrs: AttributeSet?) {
        context.obtainStyledAttributes(attrs, R.styleable.LatticeEditText).apply {
            // background
            val backgroundColor = getColor(R.styleable.LatticeEditText_android_background, context.resources.getColor(R.color.latticeEditText_background))
            // 每个字符框占的宽度 & 高度
            size = getInteger(R.styleable.LatticeEditText_size, 4)
            wide = getDimension(R.styleable.LatticeEditText_input_width, context.resources.getDimension(R.dimen.latticeEditText_dp36))
            high = getDimension(R.styleable.LatticeEditText_input_height, context.resources.getDimension(R.dimen.latticeEditText_dp36))
            // 外边距
            val margin = getDimension(R.styleable.LatticeEditText_android_layout_margin, context.resources.getDimension(R.dimen.latticeEditText_dp4))
            marginRect = Rect(
                getDimension(R.styleable.LatticeEditText_android_layout_marginLeft, margin).toInt(),
                getDimension(R.styleable.LatticeEditText_android_layout_marginTop, margin).toInt(),
                getDimension(R.styleable.LatticeEditText_android_layout_marginRight, margin).toInt(),
                getDimension(R.styleable.LatticeEditText_android_layout_marginBottom, margin).toInt()
            )
            // 内边距
            val padding = getDimension(R.styleable.LatticeEditText_android_padding, 0f)
            paddingRect = Rect(getDimension(R.styleable.LatticeEditText_android_paddingLeft, padding).toInt(),
                getDimension(R.styleable.LatticeEditText_android_paddingTop, padding).toInt(),
                getDimension(R.styleable.LatticeEditText_android_paddingRight, padding).toInt(),
                getDimension(R.styleable.LatticeEditText_android_paddingBottom, padding).toInt()
            )
            // text
            val textSize = getDimension(R.styleable.LatticeEditText_android_textSize, context.resources.getDimension(R.dimen.latticeEditText_sp14))
            val textColor = getColor(R.styleable.LatticeEditText_android_textColor, context.resources.getColor(R.color.latticeEditText_textColor))
            val text = getString(R.styleable.LatticeEditText_android_text)
            val repText = getString(R.styleable.LatticeEditText_replace_text)
            // border
            val borderColor = getColor(R.styleable.LatticeEditText_border_color, context.resources.getColor(R.color.latticeEditText_borderColor))
            val borderWidth = getDimension(R.styleable.LatticeEditText_border_width, context.resources.getDimension(R.dimen.latticeEditText_dp1))
            borderRadius = getDimension(R.styleable.LatticeEditText_border_radius, 0f)
            val inputMode = getInteger(R.styleable.LatticeEditText_input_mode, 0)
            // cursor
            val cursorColor = getColor(R.styleable.LatticeEditText_cursor_color, context.resources.getColor(R.color.latticeEditText_cursorColor))
            val cursorWidth = getDimension(R.styleable.LatticeEditText_cursor_width, context.resources.getDimension(R.dimen.latticeEditText_dp2))
            cursorHeight = getDimension(R.styleable.LatticeEditText_cursor_height, high / 2)

            // 边框画笔
            initBorderPaint(borderWidth, borderColor)
            // 背景画笔
            initBackgroundPaint(backgroundColor)
            // 文字画笔
            initTextPaint(textSize, textColor)
            // 光标画笔
            initCursorPaint(context, cursorWidth, cursorColor)
            // 始化输入框样式
            initInputMode(inputMode)
            // 初始化文本显示
            setContent(text)
            // 设置回显字符
            setReplaceText(repText)

        }.recycle()
    }

    /**
     * 初始化设置
     */
    private fun initSetting() {
        isFocusable = true
        isFocusableInTouchMode = true
        isSingleLine = true
        imeOptions = EditorInfo.IME_ACTION_DONE
        // 不显示原光标
        isCursorVisible = false
        background = null
    }

    /**
     * 初始化边框画笔
     */
    private fun initBorderPaint(borderWidth: Float, borderColor: Int) {
        borderPaint = Paint().apply {
            isAntiAlias = true
            strokeWidth = borderWidth
            style = Paint.Style.STROKE //设置绘制轮廓
            color = borderColor
        }
    }

    /**
     * 初始化背景画笔
     */
    private fun initBackgroundPaint(backgroundColor: Int) {
        backgroundPaint = Paint().apply {
            style = Paint.Style.FILL
            color = backgroundColor
        }
    }

    /**
     * 初始化文字画笔
     */
    private fun initTextPaint(size: Float, textColor: Int) {
        textPaint = Paint().apply {
            isAntiAlias = true
            textSize = size
            style = Paint.Style.FILL
            color = textColor
            // 初始化光标偏移，避免光标遮挡文字
            getTextBounds("A", 0, 1, textRect)
            cursorOffsetValue = (textRect.width() / 2 + context.resources.getDimension(R.dimen.latticeEditText_dp2)).toInt()
        }
    }

    /**
     * 初始化光标画笔
     */
    private fun initCursorPaint(context: Context, cursorWidth: Float, cursorColor: Int) {
        cursorPaint = Paint().apply {
            isAntiAlias = true
            strokeWidth = cursorWidth
            color = cursorColor
        }
    }

    /**
     * 初始化输入框样式
     */
    private fun initInputMode(inputMode: Int) {
        // 初始化输入框
        inputRects.clear()
        for (i in 0 until size) {
            val left = i * (wide + marginRect.right) + (i + 1) * marginRect.left
            inputRects.add(RectF(left, marginRect.top.toFloat(), left + wide, high + marginRect.top))
        }
        // 初始化输入框边框
        borderRects.clear()
        val borderTop = when(inputMode) {
            // line
            1 -> high + marginRect.top - borderPaint!!.strokeWidth
            // box
            else -> marginRect.top.toFloat()
        }
        for (i in 0 until size) {
            val left = i * (wide + marginRect.right) + (i + 1) * marginRect.left
            borderRects.add(RectF(left, borderTop, left + wide, high + marginRect.top))
        }
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        // 控件宽度 = 格子数 * (单个格子的宽度 + 左右外边距)
        val width = (size * (wide + marginRect.left + marginRect.right))
        // 控件高度 = 单个格子的高度 + 上下外边距
        val height = (high + marginRect.top + marginRect.bottom)
        setMeasuredDimension(width.toInt(), height.toInt())
    }

    override fun onDraw(canvas: Canvas) {
        // 绘制背景&边框
        for (i in 0 until size) {
            canvas.drawRoundRect(inputRects[i], borderRadius, borderRadius, backgroundPaint!!)
            canvas.drawRoundRect(borderRects[i], borderRadius, borderRadius, borderPaint!!)
        }
        // 绘制文字, 由于每个字符大小可能不一致，所以需要每个字符都进行测量
        val chars = content!!.toCharArray()
        for (i in chars.indices) {
            if (replaceText != null && chars[i].code != 32) {
                textPaint!!.getTextBounds(replaceText, 0, 1, textRect)
            } else {
                textPaint!!.getTextBounds(chars[i].toString(), 0, 1, textRect)
            }
            textPoint.x = (wide / 2 - textRect.width() / 2f + paddingRect.left).toInt()
            textPoint.y = (high / 2 + textRect.height() / 2f + paddingRect.top).toInt()
            canvas.drawText(
                (if (replaceText == null || chars[i].code == 32) chars[i].toString() else replaceText)!!,
                inputRects[i].left + textPoint.x,
                inputRects[i].top + textPoint.y,
                textPaint!!
            )
        }
        // 绘制光标
        if (isTwink && isFocused && selection < size) {
            val x = inputRects[selection].left + wide / 2 + cursorOffset
            canvas.drawLine(
                x,
                inputRects[selection].top + (high - cursorHeight) / 2,
                x,
                inputRects[selection].top + high - (high - cursorHeight) / 2, cursorPaint!!
            )
        }
        // 间隔刷新光标
        if (isFocused && System.currentTimeMillis() - prevRefreshTime >= defaultRefreshTime) {
            prevRefreshTime = System.currentTimeMillis()
            isTwink = !isTwink
        }
        // 间隔 500ms 重绘
        if (isFocused) {
            postInvalidateDelayed(500)
        }
    }

    /**
     * 设置文本内容
     * @param text - 内容字符串
     */
    fun setContent(text: String?) {
        content = text?.let {
            (if (text.length > size) text.substring(0, size) else text).also { selection = it.length }
        } ?: ""
        setText(content)
    }

    /**
     * 设置回显字符
     * @param text - 字符
     */
    fun setReplaceText(text: String?) {
        replaceText = if (text != null && text.isNotEmpty()) text.substring(0, 1) else null
    }

    override fun getDefaultEditable(): Boolean {
        return true
    }

    companion object {
        /** 光标刷新时间  */
        private const val defaultRefreshTime = 500
    }

    init {
        initAttrs(context, attrs)
        initSetting()
    }
}
```

运行项目，页面效果如图4.1所示。

![图4.1](/resource/images/android/latticeedit/latticeedit_4_1.jpg)





## 5. 操作字符



### 5.1 新增字符

当前我们已经成功把 `LatticeEditText` 控件绘制出来了，但是目前还不能输入，下面我们实现字符输入功能。其中的 `lengthBefore < lengthAfter` 表示新增字符。

```kotlin
override fun onTextChanged(text: CharSequence, start: Int, lengthBefore: Int, lengthAfter: Int) {
    if (lengthBefore < lengthAfter && content != null && content!!.length < size) {
        if (text.length <= 1) {
            content = text.toString()
        } else {
            content += text.toString().substring(start, start + 1)
        }
        setText(content)
        // 将光标移动要继续新增的位置
        selection = content!!.length
        // 设置光标偏移，光标显示在输入框中间
        cursorOffset = 0
    }
    if (text.isEmpty()) {
        // 空内容
        selection = 0
    } else if (text.length > size) {
        // 内容超出范围
        setText(content)
    }
}
```





### 5.2 删除字符

对于字符的删除，我们需要使用 `InputConnectionWrapper` 和 `onKeyDown` 相互配合，因为由于Android平台的特殊性，部分机型的删除操作只会触发 `onKeyDown`。为了能够随意选择删除哪个字符，删除字符操作将使用空格作为占位。

新增类 `LatticeEditTextInputConnection`，内容如下：

```kotlin
package com.viifo.latticeedittext

import android.view.KeyEvent
import android.view.inputmethod.InputConnection
import android.view.inputmethod.InputConnectionWrapper

/**
 * 删除事件监听
 * @author Viifo
 */
class LatticeEditTextInputConnection (target: InputConnection?, mutable: Boolean)

    /**
     * Initializes a wrapper.
     *
     *
     * **Caveat:** Although the system can accept `(InputConnection) null` in some
     * places, you cannot emulate such a behavior by non-null [InputConnectionWrapper] that
     * has `null` in `target`.
     *
     * @param target  the [InputConnection] to be proxied.
     * @param mutable set `true` to protect this object from being reconfigured to target
     * another [InputConnection].  Note that this is ignored while the target is `null`.
     */
    : InputConnectionWrapper(target, mutable) {

    var onBeforeTextDeletedListener: (()->Unit)? = null

    /**
     * 删除文本之前调用
     * @param beforeLength
     * @param afterLength
     * @return
     */
    override fun deleteSurroundingText(beforeLength: Int, afterLength: Int): Boolean {
        return onBeforeTextDeletedListener?.let {
                it.invoke()
                true
            } ?: super.deleteSurroundingText(beforeLength, afterLength)
    }

    /**
     * 点击软键盘按钮调用
     * @param event
     * @return
     */
    override fun sendKeyEvent(event: KeyEvent): Boolean {
        return if (event.keyCode == KeyEvent.KEYCODE_DEL && event.action == KeyEvent.ACTION_DOWN) {
            onBeforeTextDeletedListener?.invoke()
            true
        } else super.sendKeyEvent(event)
    }

}
```

修改 `LatticeEditText`，添加如下内容，支持删除事件监听。

```kotlin
override fun onCreateInputConnection(outAttrs: EditorInfo): InputConnection {
    // 文本删除监听
    return LatticeEditTextInputConnection(super.onCreateInputConnection(outAttrs), true).also {
        it.setTarget(super.onCreateInputConnection(outAttrs))
        it.onBeforeTextDeletedListener = {
            deleteText()
        }
    }
}

/**
 * 兼容部分键盘事件
 */
override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
    return if (event != null && event.keyCode == KeyEvent.KEYCODE_DEL && event.action == KeyEvent.ACTION_DOWN) {
        deleteText()
        true
    } else {
        super.onKeyDown(keyCode, event)
    }
}

/**
 * 获取新输入的字符
 * @return
 */
private fun getInputNewChar(text: String?, start: Int): String {
    return text!!.substring(start, start + 1)
}

/**
 * 替换字符
 * @return
 */
private fun replaceChat(text: String?, charStr: String, selectionIndex: Int): String {
    var result = text!!.substring(0, selectionIndex)
    result += charStr
    result += text.substring(selectionIndex + 1)
    return result
}

/**
 * 删除已输入的文本内容
 */
private fun deleteText() {
    if (content!!.isEmpty()) return
    if (content!!.length == selection) {
        // 删除最后一个字符
        content = content!!.substring(0, selection - 1)
        // 移动光标
        selection = content!!.length
    } else if (selection > 0 && " " == getInputNewChar(content, selection)) {
        // 当前位置已删除, 继续向前删除
        content = replaceChat(content, " ", selection - 1)
        // 移动光标
        selection--
    } else {
        // 删除其他部分的字符, 把要删除的部分替换为空格
        content = replaceChat(content, " ", selection)
    }
    // 设置光标偏移，光标显示在输入框中间
    cursorOffset = 0
    // 更新文本内容
    setText(content)
    postInvalidate()
}
```

现在已经可以删除已输入的内容了。





### 5.3 选中任意字符

要修改已输入的任意字符，我们必须实现点击选中字符。我们可以判断当前点击的位置，看点击位置落在哪个格子内，在移动光标到对应位置即可，代码如下：

```kotlin
/**
 * 点击 Item
 * @param index
 */
private fun clickItem(index: Int) {
    // 只能点击已输入|待输入的部分
    if (index <= content!!.length && index < size) {
        // 设置光标位置
        selection = index
        // 设置光标偏移，避免光标遮挡文字
        cursorOffset = if ((index == content!!.length)
            || (content!!.length > index + 1 && " " == getInputNewChar(content, index))) 0
        else cursorOffsetValue
        invalidate()
    }
}

@SuppressLint("ClickableViewAccessibility")
override fun onTouchEvent(event: MotionEvent): Boolean {
    when (event.action) {
        MotionEvent.ACTION_DOWN -> {
            run {
                val index = (event.x / (wide + marginRect.left + marginRect.right)).toInt()
                clickItem(index)
            }
        }
        MotionEvent.ACTION_UP -> {
            performClick()
        }
    }
    return super.onTouchEvent(event)
}
```



到此位置已经实现了格子输入框控件的绘制，字符的输入与删除，任意字符的选择修改。有关更多内容请查看 [项目源码](https://github.com/viifo/LatticeEditText) 。

