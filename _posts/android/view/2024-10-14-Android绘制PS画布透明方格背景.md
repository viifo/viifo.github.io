---
layout:     post
title:      "Android绘制PS画布透明方格背景"
subtitle:   ""
date:       2024-10-14 09:50:00 +0800
author:     "Viifo"
category:   Android
tags:
    - view
    - canvas
---



## 1. 效果预览

![Align:center&Height:300px&Title:preview](/resource/images/android/translatebg/preview.jpg)



## 2. 实现透明方格背景
实现 PS 透明方格背景样式的关键在于需要一个方格背景图片，如图 2.1 所示。
![Width:120px&Title:图2.1](/resource/images/android/translatebg/2_1.png)

实际上就是将方格图片以重复平铺的方式画在背景上，代码如下：

```kotlin
class TranslateBgView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val mRect by lazy { Rect(0, 0, width, height) }
    private val mPaint by lazy {
        Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
            val inputStream = getContext().assets.open("translate_bg.png")
            val bitmap = BitmapFactory.decodeStream(inputStream)
            val shader = BitmapShader(bitmap, TileMode.REPEAT, TileMode.REPEAT)
            setShader(shader)
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.drawRect(mRect, mPaint)
    }

}
```
