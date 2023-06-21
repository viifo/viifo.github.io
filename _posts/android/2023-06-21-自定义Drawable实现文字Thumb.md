---
layout:     post
title:      "自定义 Drawable 实现文字 Thumb"
subtitle:   ""
date:       2023-06-21 20:00:00 +0800
author:     "Viifo"
category:   Android
tags:
    - drawable
    - seek bar
---



## 1. 效果预览

![preview](/resource/images/android/drawable/thumb/preview.gif)



## 2. 实现 progress 进度样式

`activity_main.xml` 布局文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp"
    android:background="#eeeeee">

    <androidx.appcompat.widget.AppCompatSeekBar
        android:id="@+id/seek_bar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="20dp"
        android:layout_gravity="center_vertical"
        android:background="@null"
        android:splitTrack="false"
        android:progress="60"
        android:max="100"
        android:progressDrawable="@drawable/shape_progress"
        android:paddingHorizontal="50dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

`shape_progress.xml`  进度条样式：

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- 背景 -->
    <item
        android:id="@android:id/background"
        android:top="3.5dp"
        android:bottom="3.5dp"
        android:height="12dp">
        <shape>
            <corners android:radius="18dp" />
            <solid android:color="@color/white" />
        </shape>
    </item>
    <!-- 进度条 -->
    <item
        android:id="@android:id/progress"
        android:top="3.5dp"
        android:bottom="3.5dp"
        android:height="12dp">
        <scale android:scaleWidth="100%">
            <layer-list>
                <!-- 进度条背景 -->
                <item>
                    <shape>
                        <corners android:radius="18dp" />
                        <solid android:color="#FF7130" />
                    </shape>
                </item>
                <!-- 进度条条纹 -->
                <item>
                    <bitmap
                        android:src="@drawable/ic_progress_stripe"
                        android:tileMode="repeat"/>
                </item>
            </layer-list>
        </scale>
    </item>
</layer-list>
```

实现带条纹的进度条样式的关键在于在进度条背景上重叠一个透明背景的条纹图片，图片采用 `平铺` 方式重复显示即可，如图 2.1 所示：

![图2.1](/resource/images/android/drawable/thumb/2_1.png)

运行效果如图 2.2 所示，其中的圆点为 `thumb` ，若要隐藏，布局文件中设置 `android:thumb="@null"` 即可。

![图2.2](/resource/images/android/drawable/thumb/2_2.png)





## 3. 显示文字的 Thumb

默认的 `thumb` 无法在上面显示文字，而自定义 `View` 的成本有比较高，所以选择自定义 `Drawable` 来实现显示文字的 `thumb`。

新建类 `TextThumbDrawable` 并继承 `Drawable` 实现框架如下所示：

```kotlin
import android.annotation.SuppressLint
import android.content.res.Resources
import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.PixelFormat
import android.graphics.Rect
import android.graphics.drawable.Drawable
import android.util.AttributeSet
import org.xmlpull.v1.XmlPullParser

class TextThumbDrawable(mState: TextThumbState? = null) : Drawable() {

    private val mState: TextThumbState = mState ?: TextThumbState()

    override fun draw(canvas: Canvas) {
        TODO("Not yet implemented")
    }

    /**
     * thumb 位置改变后会回调此方法，重新计算 thumb 的位置和大小
     */
    override fun onBoundsChange(bounds: Rect) {
        super.onBoundsChange(bounds)
    }

    /**
     * 指定 Drawable 的透明度
     * @param alpha - 0 表示完全透明，255 表示完全不透明。
     */
    override fun setAlpha(alpha: Int) {
        TODO("Not yet implemented")
    }

    /**
     * 为 Drawable 指定可选的滤色器
     */
    override fun setColorFilter(colorFilter: ColorFilter?) {
        TODO("Not yet implemented")
    }

    /**
     * 返回 Drawable 的透明度
     * 返回值必须是 PixelFormat.UNKNOWN, TRANSLUCENT, TRANSPARENT, OPAQUE 其中之一
     * PixelFormat.UNKNOWN -
     * PixelFormat.TRANSLUCENT - 支持半透明的格式（许多 alpha 位）
     * PixelFormat.TRANSPARENT - 支持透明度的格式（至少 1 个 alpha 位）
     * PixelFormat.OPAQUE - 不支持透明格式（无 alpha 位）
     */
    override fun getOpacity(): Int {
        return PixelFormat.OPAQUE
    }

    /**
     * 要在 XML 文件中定义此 Drawable，必须重写此方法，以确保 Drawable 被正确的实例化 (inflate)
     * 若自定义的 Drawable 存在无参构造函数，也可以不重写此方法或者返回 null
     */
    override fun getConstantState(): ConstantState? {
        return mState
    }

    /**
     *  从 XML 资源中实例化 (inflate) Drawable 时调用
     */
    @SuppressLint("RestrictedApi")
    override fun inflate(
        r: Resources,
        parser: XmlPullParser,
        attrs: AttributeSet,
        theme: Resources.Theme?
    ) {
        super.inflate(r, parser, attrs, theme)
    }
    
    /**
     * 使用 ConstantState 来存储 Drawable 之间的共享常量状态和数据
     * 为了节约内存, 从同一个资源文件 (res) 中创建的 Drawable 类对象共享同一个 ConstantState
     */
    class TextThumbState : ConstantState() {

        /**
         * 使用指定的资源和主题从其 ConstantState 创建新的 Drawable 对象实例
         */
        override fun newDrawable(): Drawable {
            return TextThumbDrawable(this)
        }

        override fun getChangingConfigurations(): Int {
            return 0
        }
    }

}
```

其中：

* `SeekBar ` 的 `thumb` 位置改变会调用 `Drawable` 的 `onBoundsChange(Rect)` 方法，我们需要在此方法中计算 `thumb` 的显示位置和大小；
* `draw(Canvas)` 方法用于绘制 `Drawable` 的具体内容，为了实现预览效果，需要在此方法中依次绘制 `背景`、`边框`  和 `文字` ；
* 如果要在 `XML` 文件中定义此 `Drawable`，必须重写 `getConstantState()` 方法，以确保 `Drawable` 能被正确的 `实例化 (inflate)` ，`getConstantState()` 方法需要返回一个用于存储 `Drawable` 之间的共享常量状态和数据的对象 `ConstantState` ；
* 如果要从 `XML` 文件中读取 `Drawable` 对应的属性，需要重写 `inflate(Resources, XmlPullParser, AttributeSet, Resources.Theme)` 并在此方法中读取 `Drawable` 属性。



了解了基本的方法框架后，就可根据需要重写 `Drawable` 了。下面是本文中实现的在 `thumb` 上显示文字的 `Drawable` 的完整代码。

`attrs.xml` 属性：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <declare-styleable name="TextThumbDrawable">
        <!-- thumb -->
        <attr name="width" format="dimension"/>
        <attr name="height" format="dimension"/>
        <attr name="radius" format="dimension"/>
        <attr name="backgroundColor" format="color"/>
        <attr name="textColor" format="color"/>
        <attr name="textSize" format="dimension"/>
        <!-- thumb 边框 -->
        <attr name="strokeWidth" format="dimension"/>
        <attr name="strokeColor" format="color"/>
        <!-- thumb 超出 seekbar 宽度限制 -->
        <attr name="outBoundary" format="dimension"/>
        <!-- seekbar 右边界 -->
        <attr name="endBoundary" format="dimension"/>
    </declare-styleable>
</resources>
```

`TextThumbDrawable.kt`

```kotlin
import android.annotation.SuppressLint
import android.content.res.Resources
import android.content.res.TypedArray
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.drawable.Drawable
import android.util.AttributeSet
import android.util.TypedValue
import androidx.core.content.res.TypedArrayUtils.obtainAttributes
import com.example.myapplication.R
import org.xmlpull.v1.XmlPullParser

/**
 * 自定义 Drawable，实现动态显示文字的 Thumb
 * @param mState - 用于使用 ConstantState 创建 Drawable 对象
 */
class TextThumbDrawable(mState: TextThumbState? = null) : Drawable() {

    private val mBgPaint: Paint = Paint()
    private val mStrokePaint: Paint = Paint()
    private val mTxtPaint: Paint = Paint()
    private val mRectF: RectF = RectF()
    private var mContent: String = "0%"
    private val mState: TextThumbState = mState ?: TextThumbState()

    override fun draw(canvas: Canvas) {
        // 绘制背景 & 边框
        canvas.drawRoundRect(mRectF, mState.radius, mState.radius, mBgPaint)
        canvas.drawRoundRect(mRectF, mState.radius, mState.radius, mStrokePaint)
        // 绘制文字
        val fontMetrics: Paint.FontMetrics = mTxtPaint.fontMetrics
        val baseLineY: Float = mRectF.centerY() - (fontMetrics.bottom - fontMetrics.top) / 2 - fontMetrics.top
        val x: Float = (mRectF.width() - mTxtPaint.measureText(mContent)) / 2 + mRectF.left
        canvas.drawText(mContent, x, baseLineY, mTxtPaint)
    }

    /**
     * thumb 位置改变后会回调此方法，重新计算 thumb 的位置和大小
     */
    override fun onBoundsChange(bounds: Rect) {
        super.onBoundsChange(bounds)
        val widthOffset = mState.width / 2f
        val heightOffset = mState.height / 2f
        mState.endBoundary.takeIf { it > 0 }?.let {

            mRectF.left = if (bounds.left == 0) {
                bounds.left.toFloat() - mState.outBoundary
            } else if (bounds.right == mState.endBoundary) {
                bounds.left.toFloat() - (mState.width - mState.outBoundary)
            } else {
                bounds.left.toFloat() - widthOffset
            }
            mRectF.right = if (bounds.left == 0) {
                bounds.right.toFloat() + (mState.width - mState.outBoundary)
            } else if (bounds.right == mState.endBoundary) {
                bounds.right.toFloat() + mState.outBoundary
            } else {
                bounds.right.toFloat() + widthOffset
            }

        } ?: kotlin.run {
            mRectF.left = bounds.left.toFloat() - widthOffset
            mRectF.right = bounds.right.toFloat() + widthOffset
        }

        mRectF.top = bounds.top.toFloat() - heightOffset
        mRectF.bottom = bounds.bottom.toFloat() + heightOffset

        invalidateSelf()
    }

    /**
     * 指定 Drawable 的透明度
     * @param alpha - 0 表示完全透明，255 表示完全不透明。
     */
    override fun setAlpha(alpha: Int) {
        mBgPaint.alpha = alpha
        mStrokePaint.alpha = alpha
        mTxtPaint.alpha = alpha
        invalidateSelf()
    }

    /**
     * 为 Drawable 指定可选的滤色器
     */
    override fun setColorFilter(colorFilter: ColorFilter?) {
        mBgPaint.colorFilter = colorFilter
        mStrokePaint.colorFilter = colorFilter
        mTxtPaint.colorFilter = colorFilter
        invalidateSelf()
    }

    /**
     * 返回 Drawable 的透明度
     * 返回值必须是 PixelFormat.UNKNOWN, TRANSLUCENT, TRANSPARENT, OPAQUE 其中之一
     * PixelFormat.UNKNOWN -
     * PixelFormat.TRANSLUCENT - 支持半透明的格式（许多 alpha 位）
     * PixelFormat.TRANSPARENT - 支持透明度的格式（至少 1 个 alpha 位）
     * PixelFormat.OPAQUE - 不支持透明格式（无 alpha 位）
     */
    @Deprecated("Deprecated in Java")
    override fun getOpacity(): Int {
        return PixelFormat.OPAQUE
    }

    /**
     * 要在 XML 文件中定义此 Drawable，必须重写此方法，以确保 Drawable 被正确的实例化 (inflate)
     * 若自定义的 Drawable 存在无参构造函数，也可以不重写此方法或者返回 null
     */
    override fun getConstantState(): ConstantState? {
        return mState
    }

    /**
     *  从 XML 资源中实例化 (inflate) Drawable 时调用
     */
    @SuppressLint("RestrictedApi")
    override fun inflate(
        r: Resources,
        parser: XmlPullParser,
        attrs: AttributeSet,
        theme: Resources.Theme?
    ) {
        super.inflate(r, parser, attrs, theme)
        val typedArray = obtainAttributes(r, theme, attrs, R.styleable.TextThumbDrawable)
        mState.updateType(typedArray)
        // 重新初始化画笔
        initPaint()
        typedArray.recycle()
    }

    /**
     * 设置 seekbar 进度条的右边界，可使用 SeekBar.progressDrawable.bounds.right
     * @param boundary - progress 右边界
     */
    public fun setEndBoundary(boundary: Int?) {
        boundary?.let { mState.endBoundary = it }
    }

    /**
     * 限制 thumb 超出 seekbar 的宽度，需要结合 endBoundary 使用
     * 避免 thumb 超出 seekbar 边界被裁切，前提需要知道 seekbar 右边界 (左边界为 0)
     * @param width - progress 右边界
     */
    public fun setOutBoundary(width: Float?) {
        width?.let { mState.outBoundary = it }
    }

    /**
     * 设置要绘制的文本内容
     * @param content - 文本
     */
    public fun setContent(content: String?) {
        content?.let { mContent = it }
    }

    /**
     * 初始化画笔
     */
    private fun initPaint() {
        // init Bg Paint
        mBgPaint.color = mState.backgroundColor
        mBgPaint.style = Paint.Style.FILL
        mBgPaint.isAntiAlias = true

        // init Stroke Paint
        mStrokePaint.color = mState.strokeColor
        mStrokePaint.style = Paint.Style.STROKE
        mStrokePaint.isAntiAlias = true
        mStrokePaint.strokeWidth = mState.strokeWidth

        // init Text Paint
        mTxtPaint.color = mState.textColor
        mTxtPaint.style = Paint.Style.FILL
        mTxtPaint.isAntiAlias = true
        mTxtPaint.textSize = mState.textSize
    }

    /**
     * 初始化代码块
     */
    init {
        setBounds(0, 0, intrinsicWidth, intrinsicHeight)
        initPaint()
    }

    /**
     * 使用 ConstantState 来存储 Drawable 之间的共享常量状态和数据
     * 为了节约内存, 从同一个资源文件 (res) 中创建的 Drawable 类对象共享同一个 ConstantState
     */
    class TextThumbState : ConstantState() {

        /** thumb */
        internal var width: Float = dp2px(40f)
        internal var height: Float = dp2px(20f)
        internal var radius: Float = dp2px(20f)
        internal var backgroundColor: Int = Color.parseColor("#FF7130")
        internal var textColor: Int = Color.parseColor("#FFFFFF")
        internal var textSize: Float = sp2px(12f)
        /** thumb 边框 */
        internal var strokeWidth: Float = dp2px(1f)
        internal var strokeColor: Int = Color.parseColor("#FFFFFF")
        /**
         * thumb 超出 seekbar 宽度限制，需要结合 endBoundary 使用
         * 避免 thumb 超出 seekbar 边界被裁切，前提需要知道 seekbar 右边界 (左边界为 0)
         */
        internal var outBoundary: Float = 0f
        /**  seekbar 右边界 */
        internal var endBoundary: Int = -1

        /**
         * 使用指定的资源和主题从其 ConstantState 创建新的 Drawable 对象实例
         */
        override fun newDrawable(): Drawable {
            return TextThumbDrawable(this)
        }

        override fun getChangingConfigurations(): Int {
            return 0
        }

        /**
         * 读取 xml 文件中的属性值
         * @param typedArray
         */
        internal fun updateType(typedArray: TypedArray) {
            // thumb
            width = typedArray.getDimension(R.styleable.TextThumbDrawable_width, dp2px(40f))
            height = typedArray.getDimension(R.styleable.TextThumbDrawable_height, dp2px(20f))
            radius = typedArray.getDimension(R.styleable.TextThumbDrawable_radius, dp2px(20f))
            backgroundColor = typedArray.getColor(R.styleable.TextThumbDrawable_backgroundColor, Color.parseColor("#FF7130"))
            textColor = typedArray.getColor(R.styleable.TextThumbDrawable_textColor, Color.parseColor("#FFFFFF"))
            textSize = typedArray.getDimension(R.styleable.TextThumbDrawable_textSize, sp2px(12f))
            // thumb stroke
            strokeWidth = typedArray.getDimension(R.styleable.TextThumbDrawable_strokeWidth, dp2px(1f))
            strokeColor = typedArray.getColor(R.styleable.TextThumbDrawable_strokeColor, Color.parseColor("#FFFFFF"))
            // thumb boundary
            outBoundary = typedArray.getDimension(R.styleable.TextThumbDrawable_outBoundary, 0f)
            endBoundary = typedArray.getDimensionPixelSize(R.styleable.TextThumbDrawable_endBoundary, -1)
        }

        /**
         * dp to px
         */
        private fun dp2px(dp: Float): Float {
            return TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                dp,
                Resources.getSystem().displayMetrics
            )
        }

        /**
         * sp to px
         */
        private fun sp2px(sp: Float): Float {
            return TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_SP,
                sp,
                Resources.getSystem().displayMetrics
            )
        }
    }

}
```



使用方法：

在 `drawable` 文件夹中新建文件 `shape_progress_thumb.xml` ，内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<drawable xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    class="com.example.myapplication.drawable.TextThumbDrawable"
    app:width="40dp"
    app:height="20dp"
    app:outBoundary="10dp"
    app:backgroundColor="#F14F06" />
```

修改布局文件 `activity_main.xml` ，添加 `thumb` 如下所示：

```xml
<androidx.appcompat.widget.AppCompatSeekBar
    android:id="@+id/seek_bar"
    style="?android:attr/progressBarStyleHorizontal"
    android:layout_width="match_parent"
    android:layout_height="20dp"
    android:layout_gravity="center_vertical"
    android:background="@null"
    android:splitTrack="false"
    android:progress="60"
    android:max="100"
    android:thumb="@drawable/shape_progress_thumb"
    android:progressDrawable="@drawable/shape_progress"
    android:paddingHorizontal="50dp"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintBottom_toBottomOf="parent" />
```

在 `MainActivity.kt` 中监听进度变化并更新显示文本内容即可：

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val seekBar = findViewById<SeekBar>(R.id.seek_bar)
        // 监听 seekBar
        seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                (seekBar?.thumb as TextThumbDrawable?)?.setContent("${progress}%")
            }
            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })
        // 初始化 thumb 上显示的文字
        seekBar.post {
            (seekBar?.thumb as TextThumbDrawable?)?.setContent("${seekBar.progress}%")
            (seekBar?.thumb as TextThumbDrawable?)?.setEndBoundary(
                seekBar?.progressDrawable?.bounds?.right
            )
        }
    }
}
```

由于 `thumb` 要显示文字，宽度较宽，可能超出 `SeekBar` 显示范围，造成裁切，如图 3.1 所示。所以需通过 `TextThumbDrawable.setEndBoundary(Int)` 方法设置 `进度条 progress` 右边界，并且设置 `OutBoundary (有默认值)` 来限制 `thumb` 超出 `SeekBar` 的宽度。

![图3.1](/resource/images/android/drawable/thumb/3_1.png)
