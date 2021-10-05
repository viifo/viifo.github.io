---
layout:     post
title:      "Github Pages + Jekyll 搭建个人网站系列（三）"
subtitle:   "网站配置&文章显示"
date:       2021-10-03 10:00:00 +0800
author:     "Viifo"
category:   HTML
tags:
    - github
    - jekyll
---

前一章我们了解了 Jekyll 项目的目录结构，初步认识了模板及其作用。本章将介绍网站配置及文章内容显示相关的内容。



# 1. 网站配置

文件 `_config.yml` 中保存着我们的网站配置，修改 `项目demo` 的配置文件，内容如下：

```yaml
# 网站标题
title: "Viifo's Blog"
# 电子邮件
email: your-email@example.com
# 网站描述
description: "Welcome to Viifo's Blog."
# 网站 URL 如 http://example.com
url: ""
# 网站子目录 如 /blog
baseurl: ""
```

这是一个简单的配置，更多的配置请参考 [官方文档](http://jekyllcn.com/docs/configuration/) 。现在我们运行项目，会发现有一个警告信息：

```shell
Build Warning: Layout 'post' requested in _posts/2021-09-22-welcome-to-jekyll.markdown does not exist.
```

这是因为我们修改了 `_config.yml` 文件，该文件原内容中有指定 Jekyll 主题的配置。`posts` 目录下的文章在使用名为 `post` 的模板，而 demo 项目中 `_layouts` 文件夹下并没有这个模板，Jekyll 会尝试使用自带的主题模板，但我们将原来的主题配置删除了，所以启动 Jekyll 服务使提示 `Layout 'post' does not exist.`



我们先修改 `_post` 文件夹下的文章的 [YAML 头信息](http://jekyllcn.com/docs/frontmatter/) 中的 `layout`，修改后的内容如下：

```yaml
---
# 修改前的 YAML 头
layout: post
title:  "Welcome to Jekyll!"
date:   2021-09-22 13:19:58 +0800
categories: jekyll update
---

---
# 修改后的 YAML 头
layout: default
title:  "Welcome to Jekyll!"
date:   2021-09-22 13:19:58 +0800
categories: jekyll update
---
```



再次运行项目发现已经没有警告信息了，现在一切正常。现在的网站页面还及其单调，我们想在网站的页脚 footer 中显示电子邮箱或其它联系方式，应该怎么办呢？也许你要说，这还不简单，直接修改 `footer.html` 文件，在里面写上电子邮箱不就行了？就像下面这样：

```html
<!-- footer -->
<footer>
    <p>&copy; 2021 Viifo &emsp;email: your-email@example.com</p>
</footer>
<!-- /end footer -->
```



这样确实可以，但是现在你又觉得将联系方式显示在 footer 中不显眼，又想在导航栏上添加呢？导航栏上添加完成后你发现你需要变更邮箱地址呢？也许你要开始抱怨，哪有那么多需求，好了好了，我只是想引出我们可以使用配置文件中的内容，如 `email`。这样我们在变更邮箱的时候只需要修改配置文件就可以了，并不需要去每个页面修改。使用方式也特别简单，如下所示：

```html
<!-- footer -->
{% raw %}<footer>
    <p>&copy; 2021 Viifo &emsp;email: {{ site.email }}</p>
</footer>{% endraw %}
<!-- /end footer -->
```



可见，通过形如 `{{ site.xxx }}` 我们可以访问配置文件中的信息，配置文件中的配置我们也可以自己定义。现在修改  `_config.yml` ，增加 `phone` 配置：

```yaml
# 网站标题
title: "Viifo's Blog"
# 电子邮件
email: your-email@example.com
# 联系电话
phone: +86123456
# 网站描述
description: "Welcome to Viifo's Blog."
# 网站 URL 如 http://example.com
url: ""
# 网站子目录 如 /blog
baseurl: ""
```

修改  `footer.html` ，显示 `phone` ：

```html
<!-- footer -->
{% raw %}<footer>
    <p>&copy; 2021 Viifo &emsp;email: {{ site.email }} &emsp; phone: {{ site.phone }}</p>
</footer>{% endraw %}
<!-- /end footer -->
```

同时修改 `_layouts/default.html`，修改浏览器标签上显示的 title ：

```html
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/styles.css">
    <title>{{ site.title }}</title>
</head>
<body>
    {% include nav.html %}
    {{ content }}
    {% include footer.html %}
</body>
</html>{% endraw %}
```

运行查看效果吧！



# 2. 文章列表

在显示文章列表之前，我们需要在 `_posts` 下新增几篇文章，新增时注意文件命名格式要求：`YEAR-MONTH-DAY-title.MARKUP` 。其中的 `MARKUP` 是文章内容格式的标记，比如使用 `Markdown` 写文章，  那么 `MARKUP` 就为 `markdown` 或 `md` 。注意时间不能是未来的时间，现在让我们复制一篇文章，修改标题和时间，同时不要忘记修改文件内容中的 YAML 头信息中的时间和标题。



修改 `index.html` 显示文章列表：

```html
---
layout: default
---
{% raw %}<!-- container -->
<div class="container">
    <!-- for 和 endfor 标记一个循环的开始和结束 -->
    <!-- site.posts 表示获取所有的文章 -->
    <!-- 循环添加对应的HTML标签 -->
    {% for item in site.posts %}
        <!-- item.url 文章URL -->
        <a class="post" href="{{ item.url }}">
            <!-- 文章标题 文章 YAML 中定义的信息 -->
            <h1>{{ item.title }}</h1>
            <!-- 文章内容 -->
            <!-- strip_html 移除 html 标签，避免对文字样式产生影响  -->
            <!-- truncate:100 截取前100字显示 -->
            <p class="brief">{{ item.content | strip_html  | truncate:100 }}</p>
            <!-- 文章日期 文章 YAML 中定义的信息 -->
            <!-- 日期显示格式为 xxxx年xx月xx日 -->
            <p>{{ item.date | date: "%Y年%m月%d日"}}</p>
        </a>
    {% endfor %}
</div>{% endraw %}
<!-- /end container -->
```

添加文章列表样式如下：

```css
.post {
    width: 100%;
    padding: 20px;
    text-align: left;
    color: #333333;
    text-decoration: none;
}
```

运行项目，现在已经可以查看文章列表了，点击文章列表，发现顶部内容被导航栏遮挡，如下所示：

![](/resource/images/html/githubpages/jekyll/jekyll_07.jpg)



现在需要一个新的模板用于显示文章内容，在 `_layouts` 文件夹下新建文件 `post.html`：

```html
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/styles.css">
    <!-- page.title 页面标题，文章页面即文章标题 -->
    <title>{{ page.title }}</title>
</head>
<body>
    {{ content }}
    {% include footer.html %}
</body>
</html>{% endraw %}
```

修改所有文章的 YAML头信息的 `layout` 为 `post` ：

```yaml
---
# 修改前的 YAML 头
layout: default
title:  "Welcome to Jekyll!"
date:   2021-09-22 13:19:58 +0800
categories: jekyll update
---

---
# 修改后的 YAML 头
layout: post
title:  "Welcome to Jekyll!"
date:   2021-09-22 13:19:58 +0800
categories: jekyll update
---
```

运行项目查看页面，发现导航栏已经不显示了，其关键就在于删除了 `post.html` 中的 `{% include nav.html %}` 语句。



# 3. 列表分页

文章过多想分页怎么办？下面进行简单的分页演示，更多内容请查看 [官方文档](http://jekyllcn.com/docs/pagination/) 。

安装分页插件：

```shell
# 打开控制台，输入命令安装分页插件
gem install jekyll-paginate
```

修改 `Gemfile`，添加分页插件：

```yaml
# 找到如下内容
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

# 修改为
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-paginate"
end
```

修改 `_config.yml`，在底部新增如下内容：

```yaml
# 分页，每页显示一条文章列表记录
paginate: 1
```

修改 `index.html`

```html
---
layout: default
---
{% raw %}<!-- container -->
<div class="container">
    <!-- 将 site.posts 替换为 paginator.posts -->
    <!-- 这样才能正确显示分页记录 -->
    {% for item in paginator.posts %}
        <a class="post" href="{{ item.url }}">
            <h1>{{ item.title }}</h1>
            <p class="brief">{{ item.content | strip_html  | truncate:100 }}</p>
            <p>{{ item.date | date: "%Y年%m月%d日"}}</p>
        </a>
    {% endfor %}

    <!-- 总页数大于 1 页，才显示分页 -->
    <!-- 原因请查看官方文档
    http://jekyllcn.com/docs/pagination/#%E7%94%9F%E6%88%90%E5%B8%A6%E5%88%86%E9%A1%B5%E5%8A%9F%E8%83%BD%E7%9A%84%E6%96%87%E7%AB%A0 -->
    {% if paginator.total_pages > 1 %}
        <!-- 有上一页才显示上一页连接 -->
        {% if paginator.previous_page %}
            <a class="previous" href="{{ paginator.previous_page_path }}">上一页</a>
        {% endif %}
        <!-- 有下一页才显示上一页连接 -->
        {% if paginator.next_page %}
            <a class="next" href="{{ paginator.next_page_path }}">下一页</a>
        {% endif %}
    {% endif %}
</div>{% endraw %}
<!-- /end container -->
```

运行项目，现在网站文章列表已经支持分页了。



# 4. 文章目录

为了使文章结构更为清晰，我们需要在文章页面添加文章目录结构，Jekyll 官方并未提供文章目录功能，我们只能自己使用 JavaScript 实现。新增一个测试目录结构的文章，如下所示：

```yaml
---
layout: post
title:  "Catalog Test"
date:   2021-09-22 14:19:58 +0800
---
# 1. 标题一
标题一内容
## 2. 标题二
标题二内容
### 3. 标题三
标题三内容
#### 4. 标题四
标题四内容
##### 5. 标题五
标题五内容
###### 6. 标题六
标题六内容
```

查看页面元素如下所示：

![](/resource/images/html/githubpages/jekyll/jekyll_08.jpg)

由此可见，标题使用 `h1 ~ h6` 标签标识，标题的 `id` 由标题内容生成。所以我们需要生成目录结构只需要查找到文章内容中的所有  `h1 ~ h6`  标签内容即可。

修改

 修改`post.html`，留出目录结构显示空间和分析文章目录结构并显示：

```html
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/styles.css">
    <!-- page.title 页面标题，文章页面即文章标题 -->
    <title>{{ page.title }}</title>
</head>
<body>
    <table>
        <tr>
            <td class="content">{{ content }}</td>
            <td class="catalog">
                <!-- 文章目录结构 -->
                <ul id="catalog_ul"></ul>
            </td>
        </tr>
    </table>
    {% include footer.html %}
</body>
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script>
    window.onload = function () {
        let catalog = $("#catalog_ul")
        // 查找所有的 h1 ~ h6 标签
        let titles = $(".content").find("h1,h2,h3,h4,h5,h6")
        // 使用 each 遍历 dom 节点
        titles.each(function (){
            // 动态添加目录结构列表
            catalog.append(
                `<li><a href="#${$(this).attr('id')}">${ $(this).text()}</a></li>`)
        });
    }
</script>
</html>{% endraw %}
```

添加目录列表样式如下：

```css
table {
    width: 100%;
}
.catalog {
    vertical-align: text-top;
}
.catalog_ul {
    margin-top: 20px;
}
```

运行项目，页面效果如下所示：

![](/resource/images/html/githubpages/jekyll/jekyll_09.jpg)





# 5. 小结
{% raw %}
* 通过 `{{ site.xxx }}` 的方式访问配置文件 `_config.yml`中定义的配置；
* 通过 `{{ site.posts }}` 访问文章列表，通过 `{% for %} {% endfor %}`遍历文章列表 ；
* 通过插件 `jekyll-paginate` 实现文章列表分页，分页时要使用 `paginator.posts` 获取文章列表；
* 文章目录结构需要自己遍历文章内容中的 `h1 ~ h6` 标签进行显示。
{% endraw %}
