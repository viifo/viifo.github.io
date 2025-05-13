---
layout:     series
title:      "搜索&分页&文章目录"
subtitle:   ""
date:       2021-10-02 10:00:00 +0800
author:     "Viifo"
category:   HTML
series:     GitHub Pages + Hexo 搭建个人网站
number:     3
hidden:     true
tags:
    - github
    - hexo
---

前一章我们讲解了主题和模板的创建，并且在首页列出了文章列表，点击文章列表显示文字内容，本章将要讲解搜索功能和文章目录功能的实现。



# 1. 搜索

搜索功能我们可以通过插件 [hexo-generator-search](https://github.com/wzpan/hexo-generator-search) 实现，其作用是生成一个包含所有文章信息的 `xml` 或 `json` 文件，通过检索这个文件进行关键字匹配，得出搜索结果。但是此插件并不提供检索关键字功能，只是生成了用于检索的文件，所以我们需要自己实现检索功能。



安装插件 `hexo-generator-search` ，并在 `package.json` 文件中的 `dependencies` 节点写入依赖；

```shell
npm install --save hexo-generator-search
```

修改项目根目录下的 `_config.yml` 文件，添加如下内容：

```yaml
# search
search:
  # 生成的检索文件的存放路径，使用根目录
  path: search.json
  # 检索范围，只检索文章
  field: post
  # 生成的检索文件中是否包含内容
  # 由于内容过多会造成检索文件过大，影响静态网页的加载速度，这里选择不使用 content
  content: false
  # 检索文件生成模板
  template: ./search.json
```

构建项目，在 `public` 文件夹下查看生成的检索文件；



修改 `themes/layout/index.swig`，新增搜索输入框，内容如下：

```html
{% raw %}<div class="container">
    <table>
        <tr>
            <td>
                <!-- site.posts 表示文网站所有文章列表 -->
                <!-- for endfor 标识循环的开始和介绍 -->
                {% for item in site.posts %}
                <!-- item.path 文章网址（不含根路径） -->
                <a class="post" href="{{ item.path }}">
                    <!-- item.title 文章标题 -->
                    <h1>{{ item.title }}</h1>
                    <!-- item.content 文章内容 -->
                    <!-- strip_html() 清除字符串中的 HTML 标签  -->
                    <!-- truncate() 移除超过 length 长度的字符串 -->
                    <p class="brief">{{ strip_html(truncate(item.content,100)) }}</p>
                    <!-- item.date 文章日期 -->
                    <!-- date() 插入格式化的日期 -->
                    <p>{{ date(item.date,"YYYY年MM月DD日") }}</p>
                 </a>
                {% endfor %}
            </td>
            <td class="search-box">
                <!-- HTML elements for search -->
                <input type="text" id="search-input" placeholder="Search blog posts..">
                <ul id="results-container"></ul>
            </td>
        </tr>
    </ table>
</div>{% endraw %}
```

修改 `themes/source/css/styles.css`，添加搜索输入框样式，内容如下：

```css
table {
    width: 100%;
}
.search-box {
    width: 300px;
}
```

新增文件 `themes/source/js/search.js` 用于搜索，其内容如下：

```js
$(function (){
    $("#search-input").on("input", function () {
        searchByKeyWord($(this).val(), "#results-container")
    })
})

/**
 * 关键字搜索
 * @param keyWord - 输入框元素
 * @param resultElement - 结果显示元素
 */
function searchByKeyWord(keyWord, resultElement) {
    let result = $(resultElement)
    result.empty()
    $.getJSON('/search.json',function(dataJson) {
        $.each(dataJson, function(i,json) {
            if (json.title.toUpperCase().indexOf(keyWord.toUpperCase()) >= 0) {
                // 将文章显示在页面上
                result.append(`<a href="${json.url}">${json.title}</p>`)
            }
        })
    })
}
```

修改文件 `themes/layout/partial/head.swig`，映入 `search.js`；

```html
{% raw %}<head>
    <meta charset="UTF-8">
    {{ css("css/styles.css") }}
    {{ js("https://code.jquery.com/jquery-3.1.1.min.js") }}
    {{ js("js/search.js") }}
    <title>{{ page.title }}</title>
</head>{% endraw %}
```

构建并运行项目，体验搜索功能。





# 2. 分页

 `hexo` 除基础分页插件 [hexo-pagination](https://github.com/hexojs/hexo-pagination) 外，还有适用于不同页面的分页插件，如下所示：

* [hexo-generator-index](https://github.com/hexojs/hexo-generator-index)
* [hexo-generator-category](https://github.com/hexojs/hexo-generator-category)
* [hexo-generator-archive](https://github.com/hexojs/hexo-generator-archive)
* [hexo-generator-tag](https://github.com/hexojs/hexo-generator-tag)

若其他自定义的页面需要分页，则需要自己编写 `Hexo` 插件或者使用 `JavaScript` 实现。`Hexo` 插件的编写请查看 [官方文档-插件](https://hexo.io/zh-cn/docs/plugins) 。



下面以 `hexo-generator-index` 为例实现首页分页。默认情况下 `Hexo` 初始化项目已经存在插件 `hexo-generator-index` 和 `_config.yml` 配置信息，若不存在，按如下步骤安装配置：

安装插件 `hexo-generator-search` ，并在 `package.json` 文件中的 `dependencies` 节点写入依赖；

```shell
npm install --save hexo-generator-index
```



修改项目根目录下的 `_config.yml` 文件，添加如下内容：

```yaml
index_generator:
  path: ''
  # 每页显示的文章数
  per_page: 2
  # 排序方式 日期倒叙
  order_by: -date
```

为了便于分页功能测试，将每页文章数设置为 `2` ，同时在根目录下的 `source/_posts` 中新增几篇文章。



修改 `themes/layout/index.swig`，修改文章获取方式为 `page.post`，并新增分页按钮如下：

```html
{% raw %}<div class="container">
    <table>
        <tr>
            <td>
                <!-- 修改 site.posts 为 page.posts，支持分页 -->
                {% for item in page.posts %}
                <!-- 使用辅助函数 url_for 确保分页后的文章URL正确  -->
                <!-- https://hexo.io/zh-cn/docs/helpers.html#url-for  -->
                <a class="post" href="{{ url_for(item.path) }}">
                    <h1>{{ item.title }}</h1>
                    <p class="brief">{{ strip_html(truncate(item.content,100)) }}</p>
                    <p>{{ date(item.date,"YYYY年MM月DD日") }}</p>
                 </a>
                {% endfor %}
            </td>
            <td class="search-box">
                <!-- HTML elements for search -->
                <input type="text" id="search-input" placeholder="Search blog posts..">
                <ul id="results-container"></ul>
            </td>
        </tr>
    </table>
    <!-- 分页链接辅助函数 paginator -->
    <!-- https://hexo.io/zh-cn/docs/helpers#paginator -->
    {% if page.total > 1%}
        {{
            paginator({
                prev_text: ' 上一页',
                next_text: ' 下一页'
            })
        }}
    {% endif %}
</div>{% endraw %}
```

构建并运行项目，体验分页功能。





# 3. 文章目录

`Hexo` 为我们提供了生成目录的 [辅助函数 toc](https://hexo.io/zh-cn/docs/helpers.html#toc)，我们可以使用辅助函数添加文章目录。

修改 `themes/layout/post.swig`，添加文章目录，内容如下：

```html
---
layout: "layout2"
---
{% raw %}<table>
    <tr>
        <td> {{ page.content }} </td>
        <td style="width:150px">
            {{ toc(page.content) }}
        </td>
    </tr>
</table>{% endraw %}
```

修改 `themes/source/css/styles.css`，添加文章目录样式，内容如下：

```css
.toc li {
    list-style: none;
}
.toc a {
    color: #828282;
    text-decoration: none;
}
.toc a:hover {
    color: #1e7293;
}
```

构建并运行项目，体验文章目录功能。





# 4. 小结

* 通过插件 `hexo-generator-search` 生成检索文件后，需要自己检索关键字实现搜索功能；
*  `hexo` 除基础分页插件 `hexo-pagination` 外，还有适用于不同页面的分页插件；
*  `hexo` 提供了功能强大的辅助函数，例如用于生成文章目录的辅助函数 `toc`。

