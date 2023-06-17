---
layout:     post
title:      "Android 绘制 StateListDrawable"
subtitle:   ""
date:       2023-06-17 09:09:00 +0800
author:     "Viifo"
category:   Android
tags:
    - drawable
    - view
---


`Drawable` 是 `可以绘制的东西` 的一般抽象。大多数情况下，`Drawable ` 被视为一种可将内容绘制到屏幕的资源类型。`StateListDrawable` 是 `Drawable` 的子类型，单个 `StateListDrawable` 可存储多个图形并通过字符串 `ID` 值替换可见项。

`StateListDrawable` 可以在带有 `<selector>` 标签的 `XML` 文件中定义，示例代码如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/color_state_0" android:state_pressed="true" />
    <item android:drawable="@color/color_state_1" android:state_pressed="false" />
</selector>
```

`StateListDrawable` 也可以通过代码动态创建，示例代码如下：

```kotlin
// 不同的 drawable
val pressed = ContextCompat.getDrawable(this, R.color.color_state_0)
val normal = ContextCompat.getDrawable(this, R.color.color_state_1)
// 创建 StateListDrawable
val drawable = StateListDrawable()
// 状态存在先后顺序, 先匹配到对应的状态后即使后面还存在对应的状态，后面的状态对应的 drawable 也不会被使用
drawable.addState(intArrayOf(android.R.attr.state_pressed), pressed)
drawable.addState(intArrayOf(), normal)
```

`StateListDrawable` 支持的各个状态如下所示：

```kotlin
 /* 
 * @attr ref android.R.styleable#DrawableStates_state_focused
 * @attr ref android.R.styleable#DrawableStates_state_window_focused
 * @attr ref android.R.styleable#DrawableStates_state_enabled
 * @attr ref android.R.styleable#DrawableStates_state_checkable
 * @attr ref android.R.styleable#DrawableStates_state_checked
 * @attr ref android.R.styleable#DrawableStates_state_selected
 * @attr ref android.R.styleable#DrawableStates_state_activated
 * @attr ref android.R.styleable#DrawableStates_state_active
 * @attr ref android.R.styleable#DrawableStates_state_single
 * @attr ref android.R.styleable#DrawableStates_state_first
 * @attr ref android.R.styleable#DrawableStates_state_middle
 * @attr ref android.R.styleable#DrawableStates_state_last
 * @attr ref android.R.styleable#DrawableStates_state_pressed
 */
```





## 1. StateListDrawable 的绘制流程



### 1.1 设置背景时的绘制流程

通过各种方式设置的背景最终都会调用 `setBackgroundDrawable()` 方法，关键代码如下：

```java
@Deprecated
public void setBackgroundDrawable(Drawable background) {
    ......
    // Set mBackground before we set this as the callback and start making other
    // background drawable state change calls. In particular, the setVisible call below
    // can result in drawables attempting to start animations or otherwise invalidate,
    // which requires the view set as the callback (us) to recognize the drawable as
    // belonging to it as per verifyDrawable.
    mBackground = background;
    // background.isStateful() - drawable 是否会根据状态更改其外观，StateListDrawable 值为 true
    if (background.isStateful()) {
        // setState() - 为 Drawable 指定一组状态。如果状态发送改变则重绘自身，并返回 true
        // getDrawableState() - 返回 View 当前状态的资源 ID 数组
        background.setState(getDrawableState());
    }
    if (isAttachedToWindow()) {
        background.setVisible(getWindowVisibility() == VISIBLE && isShown(), false);
    }
  
    applyBackgroundTint();

    // 回调：用于 drawable 通知 view 更新
    background.setCallback(this);
    ......
}
```

上述代码中涉及到的 `StateListDrawable` 中的部分方法如下：

```java
public boolean setState(@NonNull final int[] stateSet) {
    if (!Arrays.equals(mStateSet, stateSet)) {
        // 状态发送改变执行
        mStateSet = stateSet;
        return onStateChange(stateSet);
    }
    return false;
}

@Override
protected boolean onStateChange(int[] stateSet) {
    // super.onStateChange(stateSet) 默认返回 false
    final boolean changed = super.onStateChange(stateSet);
    // 从 drawable 的状态列表中找出第一个匹配 stateSet 状态的索引
    int idx = mStateListState.indexOfStateSet(stateSet);
    if (DEBUG) android.util.Log.i(TAG, "onStateChange " + this + " states " + Arrays.toString(stateSet) + " found " + idx);
    if (idx < 0) {
        idx = mStateListState.indexOfStateSet(StateSet.WILD_CARD);
    }
    // 最终会调用 selectDrawable 方法， 选择索引对应的图像并重绘自身
    return selectDrawable(idx) || changed;
}
```

`StateListDrawable.selectDrawable()` 方法，选择索引对应的图像并重绘自身最终会调用 `StateListDrawable.invalidateSelf()` 方法，此方法内容如下所示 ：

```java
public void invalidateSelf() {
    // getCallback() 方法即获取的前面 setBackgroundDrawable 方法中的 
    // background.setCallback(this); 设置的 View 自身
    final Callback callback = getCallback();
    if (callback != null) {
        // 回调 view 中的 invalidateDrawable
        callback.invalidateDrawable(this);
    }
}
```

`View.invalidateDrawable()` 方法如下所示：

```java
public void invalidateDrawable(@NonNull Drawable drawable) {
    if (verifyDrawable(drawable)) {
        final Rect dirty = drawable.getDirtyBounds();
        final int scrollX = mScrollX;
        final int scrollY = mScrollY;

        // 刷新 view 中的指定坐标区域
        invalidate(dirty.left + scrollX, dirty.top + scrollY, dirty.right + scrollX, dirty.bottom + scrollY);
        rebuildOutline();
    }
}
```

即设置背景时 `StateListDrawable` 的绘制流程为：`View.setBackgroundDrawable()` -> `StateListDrawable.setState()`  -> `StateListDrawable.onStateChange()` -> `StateListDrawable.invalidateSelf()` -> `View.invalidateDrawable()` -> `View.invalidate()`  -> `View.onDraw()` 。



### 1.2 内部状态改变时的绘制流程

以 `Pressed` 是否按压 `View` 状态为例，按压状态一般在 `onTouchEvent()` 中设置，关键代码如下：

```java
public boolean onTouchEvent(MotionEvent event) {
    ......
    if ((viewFlags & ENABLED_MASK) == DISABLED && (mPrivateFlags4 & PFLAG4_ALLOW_CLICK_WHEN_DISABLED) == 0) {
        // enable = false & clickable = false
        if (action == MotionEvent.ACTION_UP && (mPrivateFlags & PFLAG_PRESSED) != 0) {
            // 抬起手指 & Pressed = true 时，设置 Pressed = false
            setPressed(false);
        }
        mPrivateFlags3 &= ~PFLAG3_FINGER_DOWN;
        // 一个可点击的禁用视图仍然消耗触摸事件，它只是不响应它们。
        return clickable;
    }
    ......
    switch (action) {
        case MotionEvent.ACTION_UP:
            ......
            boolean prepressed = (mPrivateFlags & PFLAG_PREPRESSED) != 0;
            if ((mPrivateFlags & PFLAG_PRESSED) != 0 || prepressed) {
                ......
                if (prepressed) {
                    // 按钮在我们实际显示为已按下之前被释放。 
                    // 让它现在显示按下状态（在安排点击之前）以确保用户看到它。
                    setPressed(true, x, y);
                }
                ......
            }
            ......
            break;
        case MotionEvent.ACTION_DOWN:
            // 是否在滚动容器内
            boolean isInScrollingContainer = isInScrollingContainer();
            if (isInScrollingContainer) {
                ......
            } else {
                // 不在滚动容器内，立即显示反馈
                setPressed(true, x, y);
            }
            break;
        case MotionEvent.ACTION_CANCEL:
            if (clickable) {
                setPressed(false);
            }
            ......
            break;
        case MotionEvent.ACTION_MOVE:
            // 移动到视图外面
            if (!pointInView(x, y, touchSlop)) {
                ......
                if ((mPrivateFlags & PFLAG_PRESSED) != 0) {
                    // 如果 Pressed = true 则设置为 Pressed = false
                    setPressed(false);
                }
                ......
            }
            break;
        
        
    }
}
```

实现 `View` 的按压状态的 `setPressed()` 方法代码如下：

```java
/**
* 设置此 View 的按下状态
参数：@param pressed –  true 将视图的内部状态设置为“按下”，false 将视图的内部状态从先前设置的“按下”状态恢复。
*/
public void setPressed(boolean pressed) {
    final boolean needsRefresh = pressed != ((mPrivateFlags & PFLAG_PRESSED) == PFLAG_PRESSED);

    if (pressed) {
        mPrivateFlags |= PFLAG_PRESSED;
    } else {
        mPrivateFlags &= ~PFLAG_PRESSED;
    }

    if (needsRefresh) {
        // 刷新 drawable 状态
        refreshDrawableState();
    }
    dispatchSetPressed(pressed);
}
```

`View` 的内部状态更新后，会调用 `refreshDrawableState()` 方法刷新，代码如下：

```java
public void refreshDrawableState() {
    mPrivateFlags |= PFLAG_DRAWABLE_STATE_DIRTY;
    // drawable 状态改变
    drawableStateChanged();

    ViewParent parent = mParent;
    if (parent != null) {
        // 通知父视图：子视图的 drawable 状态改变
        parent.childDrawableStateChanged(this);
    }
}
```

`drawableStateChanged()` 方法用于通知 `drawable` 改变状态，其关键代码如下：

```java
protected void drawableStateChanged() {
    // getDrawableState() - 返回 View 当前状态的资源 ID 数组
    final int[] state = getDrawableState();
    boolean changed = false;

    // 更新背景 drawable 状态
    final Drawable bg = mBackground;
    if (bg != null && bg.isStateful()) {
        changed |= bg.setState(state);
    }
    ......
    // 更新前景 drawable 状态
    final Drawable fg = mForegroundInfo != null ? mForegroundInfo.mDrawable : null;
    if (fg != null && fg.isStateful()) {
        changed |= fg.setState(state);
    }
    ......
    // 发生改变则调用 invalidate() 重绘 View
    if (changed) {
        invalidate();
    }
}
```

可见在 `drawableStateChanged()` 方法中会调用 `StateListDrawable.setState()` 方法。之后的流程同 `1.1 设置背景时的绘制流程` 中的一致。





## 2. 简单绘制一个 StateListDrawable

了解了 `StateListDrawable` 的绘制流程，就可以灵活在自定义 `View` 中实现 `StateListDrawable` 的绘制，下面是一个简单的示例：

```kotlin
import android.content.Context
import android.graphics.Canvas
import android.graphics.RectF
import android.graphics.drawable.StateListDrawable
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import androidx.core.content.ContextCompat

/**
 * 简单实现 StateListDrawable 绘制自定义 View
 */
class DrawDemoView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
): View(context, attrs, defStyleAttr) {

    /** 保存 view 边界 */
    private val rect: RectF = RectF()
    /** 简单写死背景 drawable */
    private val mBackgroundDrawable by lazy {
        ContextCompat.getDrawable(
            context,
            R.drawable.selector_car_key_board_done_key_background
        ) as StateListDrawable?
    }
    /** view 内部状态：是否按压 */
    private var mPressed = false
        set(value) {
            field = value
            mBackgroundDrawable?.state = if(value) {
                // 更新 drawable 状态为 pressed = true
                intArrayOf(android.R.attr.state_pressed)
            } else {
                // 更新 drawable 状态为 pressed = false
                intArrayOf()
            }
        }

    /**
     * 绘制视图
     */
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        mBackgroundDrawable?.setBounds(0, 0, measuredWidth, measuredHeight)
        mBackgroundDrawable?.draw(canvas)
    }

    override fun performClick(): Boolean {
        return super.performClick()
    }

    /**
     * 点击位置是否在 view 内
     */
    private fun pointInView(localX: Float, localY: Float, slop: Float): Boolean {
        return localX >= -slop
                && localY >= -slop
                && localX < rect.right - rect.left + slop
                && localY < rect.bottom - rect.top + slop
    }

    /**
     * 点击事件处理
     */
    override fun onTouchEvent(event: MotionEvent?): Boolean {
        when (event?.action) {
            MotionEvent.ACTION_DOWN -> {
                mPressed = true
            }
            MotionEvent.ACTION_MOVE -> {
                if (!pointInView(event.x, event.y, 300f)) {
                    mPressed = false
                }
            }
            MotionEvent.ACTION_UP -> {
                mPressed = false
                performClick()
            }
        }
        return super.onTouchEvent(event)
    }

    /**
     * 测量视图
     */
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        rect.left = x
        rect.top = y
        rect.right = x + measuredWidth
        rect.bottom = y + measuredHeight
    }

    /**
     * 初始化代码，直接默认设置背景
     */
    init {
        background = mBackgroundDrawable
    }

}
```

`xml` 布局如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <com.example.DrawDemoView
        android:id="@+id/v_test"
        android:clickable="true"
        android:focusable="true"
        android:layout_width="match_parent"
        android:layout_height="100dp" />

</LinearLayout>
```

运行效果如图 2.1 所示。

![图2.1](/resource/images/android/drawable/statelist/2_1.gif)
