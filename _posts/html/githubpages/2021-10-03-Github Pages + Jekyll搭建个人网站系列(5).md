---
layout:     post
title:      "Github Pages + Jekyll 搭建个人网站系列（五）"
subtitle:   "附加功能"
date:       2021-10-03 14:00:00 +0800
author:     "Viifo"
category:   HTML
tags:
    - github
    - jekyll
---

本章是 “Github Pages + Jekyll 搭建个人网站系列” 的最后一章，主要探讨一下 Jekyll 静态博客网站的搜索、分类、标签和评论问题。

由于 Github Pages 不支持 `Jekyll`  插件，如果不想做本地转换，需要使用 JavaScript 实现 `Jekyll` 官方不支持的功能。



# 1. 搜索

Jekyll 官方并没有提供搜索功能，想要实现搜索，可以使用 [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)。为了在 Github Pages 上能正常使用，下面介绍通过导入外部 JS 文件的方法实现搜索功能。

修改 `demo` 项目，添加搜索功能，首先修改 `default.html`，导入 `simple-jekyll-search.min.js`：

```html
<script src="https://unpkg.com/simple-jekyll-search@latest/dest/simple-jekyll-search.min.js"></script>
```

然后修改 `index.html`，添加搜索输入框和搜索结果显示列表并添加搜索：
```html
<!-- HTML elements for search -->
<input type="text" id="search-input" placeholder="Search blog posts..">
<ul id="results-container"></ul>
```
```js
let sjs = SimpleJekyllSearch({
  // 搜索输入框
  searchInput: document.getElementById('search-input'),
  // 搜索结果显示的位置
  resultsContainer: document.getElementById('results-container'),
  // 搜索内容文件
  json: '/search.json',
  // 单条搜索结果模板内容
  searchResultTemplate: '<li><a href="{{ site.url }}{url}">{title}</a></li>'
})
```



完整的 `index.html` 内容如下：

```html
---
layout: default
---
{% raw %}<!-- container -->
<div class="container">
    <table>
        <tr>
            <td>
                <!-- 将 site.posts 替换为 paginator.posts -->
                <!-- 这样才能正确显示分页记录 -->
                {% for item in paginator.posts %}
                <a class="post" href="{{ item.url }}">
                    <h1>{{ item.title }}</h1>
                    <p class="brief">{{ item.content | strip_html  | truncate:100 }}</p>
                    <p>{{ item.date | date: "%Y年%m月%d日"}}</p>
                </a>
                {% endfor %}
            </td>
            <td class="search-box">
                <!-- HTML elements for search -->
                <input type="text" id="search-input" placeholder="Search blog posts..">
                <ul id="results-container"></ul>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <!-- 总页数大于 1 页，才显示分页 -->
                <!-- 原因请查看官方文档
                http://jekyllcn.com/docs/pagination/#%E7%94%9F%E6%88%90%E5%B8%A6%E5%88%86%E9%A1%B5%E5%8A%9F%E8%83%BD%E7%9A%84%E6%96%87%E7%AB%A0 -->
                {% if paginator.total_pages > 1 %}
                <!-- 有上一页才显示上一页连接 -->
                {% if paginator.previous_page %}
                <a class="previous" href="{{ paginator.previous_page_path }}">Previous</a>
                {% endif %}
                <!-- 有下一页才显示上一页连接 -->
                {% if paginator.next_page %}
                <a class="next" href="{{ paginator.next_page_path }}">Next</a>
                {% endif %}
                {% endif %}
            </td>
        </tr>
    </table>
</div>
<!-- /end container -->
<script>
    window.onload = function () {
        SimpleJekyllSearch({
            // 搜索输入框
            searchInput: document.getElementById('search-input'),
            // 搜索结果显示的位置
            resultsContainer: document.getElementById('results-container'),
            // 搜索内容文件
            json: '/search.json',
            // 单条搜索结果模板内容
            searchResultTemplate: '<li><a href="{{ site.url }}{url}">{title}</a></li>'
        })
    }
</script>{% endraw %}
```

到这搜索功能基本完成了，只差文件 `search.json`，那这个文件是怎么回事呢？我们先看看文件内容，在根目录下新建文件 `search.json`, 内容如下：

```yaml
---
layout: none
---
{% raw %}[
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "category" : "{{ post.category }}",
      "tags"     : "{{ post.tags | join: ', ' }}",
      "url"      : "{{ site.baseurl }}{{ post.url }}",
      "date"     : "{{ post.date | date: \"%Y年%m月%d日\" }}"
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
]{% endraw %}
```

只要文件中包含  [YAML 头信息](http://jekyllcn.com/docs/frontmatter/)，Jekyll 就会自动将它们进行转换，上面的 `search.json` 就是保存所有的文章的部分信息，这部分信息将用于搜索时内容的比对。为什么要这么做呢？

Jekyll 并没有提供搜索功能，为了实现搜索，我们就必须知道所有文章的信息，而 Jekyll 使用的模板语言 `liquid` 不能和 `JavaScript` 进行交互，所以需要使用 `JavaScript`在包含所有文章信息的 `search.json` 文件中进行搜索。

现在搜索功能已经完成，运行项目并查看效果。

> 对于没有分页的网站，我们也可以直接通过 JavaSript 遍历 DOM 节点实现搜索。



# 2. 分类 & 标签

分类和标签功能基本一致，下面仅以分类功能为例进行实现。

对于在单个页面对所有文章进行分类，只需要在遍历文章时按类别显示即可，但是对于通过URL参数实现不同分类的文章显示，由于 `Liquid` 模板语言并不能获取URL参数，所以我们只能通过 `JavaScript` 查询文章类别，具体可参考  [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search) 的做法，对包含文章信息的 json 文件信息检索。

修改 `demo`项目，根目录下新建 `category.html`，内容如下：

```html
---
layout: default
---
<div class="container"></div>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script>
    window.onload = function () {
        let category = getQueryString("type")
        let container = $(".container")
        $.getJSON('/search.json',function(dataJson) {
            $.each(dataJson, function(i,json) {
                if (category === null || category === json.category) {
                    // 将文章显示在页面上
                    container.append(
                        `<a class="post" href="${json.url}">
                            <h1>${json.title}</h1>
                            <p>${json.date}</p>
                        </a>`
                    )
                }
            })
        })
    }
    /** 获取URL参数 */
    function getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }
</script>
```

修改文章 [YAML 头信息](http://jekyllcn.com/docs/frontmatter/)，添加分类 `c1 ~ c3`，示例如下：

```yaml
---
layout: post
title:  "Article Test"
date:   2021-09-21 13:19:58 +0800
category: c1
---
```

运行项目，访问 [http://127.0.0.1:4000/category/](http://127.0.0.1:4000/category/) 如下所示：

![](/resource/images/html/githubpages/jekyll/jekyll_11.jpg)

访问 [http://127.0.0.1:4000/category?type=c1](http://127.0.0.1:4000/category?type=c1) 如下所示：

![](/resource/images/html/githubpages/jekyll/jekyll_12.jpg)

现在分类功能已经完成，标签功能的实现与分类一致，这里就不再赘述。



# 3. 评论

由于 Github Pages 是静态网站，并不支持在线评论，要实现评论功能只能使用第三方的评论系统。Jekyll 自带支持 Disqus 评论系统，但是国内不能访问，目前可以试试：[Valine](https://valine.js.org/)，[gitment](https://github.com/imsun/gitment)，但这些都需要将 id、secret 等信息明文写在页面中，个人比较担心有安全隐患，这里就不作演示，感兴趣的可以自己了解。



# 4. 小结

* 可通过 [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search) 使用搜索功能，其原理是检索包含文章信息的 Json 文件；
* 可参考  [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search) 的做法通过检索包含文章信息的 Json 文件实现分类和标签功能；
* 评论功能需要使用第三方的评论系统，但在页面中明文显示 id、secret等信息存在安全隐患。

