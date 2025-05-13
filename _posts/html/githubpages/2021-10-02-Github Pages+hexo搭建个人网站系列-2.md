---
layout:     series
title:      "主题&模板"
subtitle:   ""
date:       2021-10-02 09:00:00 +0800
author:     "Viifo"
category:   HTML
series:     GitHub Pages + Hexo 搭建个人网站
number:     2
hidden:     true
tags:
    - github
    - hexo
---

前面我们讲解了 `Hexo` 本地环境的搭建并了解了如何新建一个 `Hexo` 项目，本章将对 `Hexo` 的目录结构进行讲解，并定义一个属于自己的主题。若您只想修改和使用现有模板，可以在了解 `Hexo` 目录结构后直接阅读第三章。


# 1. 目录结构

前面我们已经运行并一键部署了项目 `hello-hexo` ，本项目当前的目录结构如下所示：

```shell
.
+-- .deploy_git
+-- .github
+-- node_modules
+-- public
+-- scaffolds
+-- source
╎   +-- _drafts # 当前项目暂shell无此目录
╎   └── _posts
+-- themes
+-- _config.yml
+-- db.json
└── package.json
```

下面对以上的目录结构进行说明，更多内容可查看 [官方文档](https://hexo.io/zh-cn/docs/setup) 。

| 目录         | 说明                                                         |
| :----------- | :----------------------------------------------------------- |
| .deploy_git  | 使用 ` hexo-deployer-git`一键部署时，Hexo 会生成此文件夹，并将 `public` 中的内容复制到该文件夹下 |
| .github      | [Dependabot](https://docs.github.com/cn/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/about-dependabot-version-updates) 版本更新，确保提交到 Github 仓库的项目使用的依赖是最新版本 |
| node_modules | 用于存放包管理工具下载安装的依赖包，最好将这个目录放进你的 `.gitignore` 文件中 |
| public       | `hexo generate` 命令生成的静态网页，最好将这个目录放进你的 `.gitignore` 文件中 |
| scaffolds    | [模版](https://hexo.io/zh-cn/docs/writing) 文件夹，当您新建文章时，Hexo 会根据 scaffold 来建立文件。Hexo 有三种默认模板：`post`、`page` 和 `draft` |
| source       | 资源文件夹。除 `_posts` 文件夹之外，开头命名为 `_` (下划线)的文件 / 文件夹和隐藏的文件将会被忽略。Markdown 和 HTML 文件会被解析并放到 `public` 文件夹，而其他文件会被拷贝过去 |
| themes       | [主题](https://hexo.io/zh-cn/docs/themes) 文件夹。Hexo 会根据 `_config.yml` 中配置的主题来生成静态页面 |
| _config.yml  | 网站的 [配置](https://hexo.io/zh-cn/docs/configuration) 信息，您可以在此配置大部分的参数 |
| db.json      | 缓存文件，资源、文章、分类、标签等缓存信息                   |
| package.json | 声明项目使用的各种依赖包及依赖包的版本                       |



# 2. 主题

## 2.1 主题结构

要创建主题，需要先了解主题的目录结构。`themes` 文件夹存放着 `Hexo`  项目的各个主题，各主题文件夹其下的目录结构如下所示：

```shell
.
+-- _config.yml
+-- languages
+-- layout
+-- scripts
└── source
```

下面对以上的目录结构进行说明，更多内容可查看 [官方文档](https://hexo.io/zh-cn/docs/themes) 。

| 目录         | 说明                                                         |
| :----------- | :----------------------------------------------------------- |
| ._config.yml | 主题的配置文件，主题配置文件修改时会自动更新                 |
| languages    | 语言文件夹，请参见 [国际化 (i18n)](https://hexo.io/zh-cn/docs/internationalization) |
| layout       | 布局文件夹，用于存放主题的模板文件，决定了网站内容的呈现方式 |
| scripts      | 脚本文件夹，在启动时，Hexo 会载入此文件夹内的 JavaScript 文件 |
| source       | 资源文件夹，除了模板以外的 Asset，例如 CSS、JavaScript 文件等，都应该放在这个文件夹中。文件或文件夹开头名称为 `_`（下划线线）或隐藏的文件会被忽略 |



## 2.2 新建主题

新建主题之前，可以先删除原主题。删除 `themes` 文件夹下的所有文件并在 `themes` 下新建文件夹 `mytheme`。这就是我们自定义的主题名称，接下来根据主题结构建立相关文件夹，如下所示：

```shell
.
└── themes
╎   └── mytheme
╎		+-- _config.yml
╎		+-- languages
╎		+-- layout
╎		+-- scripts
╎		└── source
```

修改项目根目录下的项目配置文件 `._config.yml`，找到 `theme` 并修改为如下内容：

```yaml
# Extensions
# Plugins: https://hexo.io/plugins/
# Themes: https://hexo.io/themes/
theme: mytheme
```

构建项目并启动 `Hexo` 服务，访问 [http://localhost:4000](http://localhost:4000) ，发现页面一片空白，主题新建成功，由于我们还没有编写任何页面，当然是一片空白。





# 3. 模板

## 3.1 模板引擎

在编写主题模板之前，我们需要决定选用什么模板引擎。`Hexo`  支持 [Swig](https://github.com/node-swig/swig-templates) 、[EJS](https://github.com/hexojs/hexo-renderer-ejs)、[Haml](https://github.com/hexojs/hexo-renderer-haml)、[Jade](https://github.com/hexojs/hexo-renderer-jade) 或 [Pug](https://github.com/maxknee/hexo-render-pug) ，`Hexo` 根据模板文件的扩展名来决定所使用的模板引擎，例如：

```
layout.ejs   - 使用 EJS
layout.swig  - 使用 Swig
```

我们通过 `hexo init <xxx>` 命令新建的 `Hexo` 项目已经安装了 `EJS` 插件，查看根目录下的 `package.json` 文件内容，会发现存在如下内容：

```json
"dependencies": {
    "hexo": "^5.0.0",
    ....
    "hexo-renderer-ejs": "^1.0.0",
     ....
  }
```

各个模板引擎的区别主要是在语法上，下面以 `Swig` 和 `EJS` 遍历文章为例说明模板引擎的区别：

```html
{% raw %}<!-- EJS 遍历用户列表 -->
<ul>
  <% site.posts.forEach(function(post){ %>
    <li><%= post.title %></li>
  <% }); %>
</ul>


<!-- Swig 遍历用户列表 -->
<ul>
  {% for post in site.posts %}
    <li>{{ post.title }}</li>
  {% endfor %}
</ul>{% endraw %}
```

本例将使用 `swig` 为例来编写主题模板，`swig` 语法请参考 [SWIG中文文档](https://github.com/myvin/swig.zh-CN) 。

> `ejs` 语法请参考 [EJS 中文文档](https://ejs.bootcss.com/)



`Hexo` 官方文档中说的是 `Hexo provides the Swig template engine by default`，即默认提供 `Swig模板引擎`，但实测还是需要自己安装。

安装插件 `hexo-renderer-swig` ，并在 `package.json` 文件中的 `dependencies` 节点写入依赖；

```shell
npm install --save hexo-renderer-swig
```



## 3.2 新建模板

现在我们正式开始编写自己的主题模板，先从主页文章列表开始。从`主题目录`上可以发现。`layout` 文件夹下放置的是主题模板，那我们现在新建文件 `mytheme/layout/my.swig`，内容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    Hello Hexo My!!!
</body>
</html>
```

构建项目，启动 `Hexo` 服务并访问 [http://localhost:4000](http://localhost:4000)，查看页面效果。



上面我们新建的 `my.swig` 模板并没有显示在页面上，目前页面仍是一片空白，这是怎么回事呢？想必你也发现问题所在了，`Hexo` 模板引擎所用的默认的模板名称是确定的，见下表所示。更多有关主题模板的内容，请查看 [官方模版文档](https://hexo.io/zh-cn/docs/templates) 。

|    模板    |   用途   |   回退    |
| :--------: | :------: | :-------: |
|   layout   |   布局   |           |
|  `index`   |   首页   |           |
|   `post`   |   文章   |  `index`  |
|   `page`   |   分页   |  `index`  |
| `archive`  |   归档   |  `index`  |
| `category` | 分类归档 | `archive` |
|   `tag`    | 标签归档 | `archive` |

现在我们新建文件 `mytheme/layout/index.swig`，内容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    Hello Hexo Index!!!
</body>
</html>
```

再次构建项目，启动 `Hexo` 服务并访问 [http://localhost:4000](http://localhost:4000)，可以看到页面上成功显示 `Hello Hexo Index!!!`。



这样就产生了一个问题，现在就是需要显示页面 `my` 怎么办？各页面模板名称都固定了岂不是不能新增其他页面？当前是可以新增并显示其他页面的，我们复习下根目录下的 `source` 文件夹，其说明如下：

> 资源文件夹。除 `_posts` 文件夹之外，开头命名为 `_` (下划线)的文件 / 文件夹和隐藏的文件将会被忽略。Markdown 和 HTML 文件会被解析并放到 `public` 文件夹，而其他文件会被拷贝过去。

也就是说，我们只要让最后生成的 `public` 文件夹中存在目录 `my/index.html`，就可以访问页面 `my` 。在根目录中的 `source` 文件夹下新建 `my/index.html` 文件，其内容如下：

```yaml
---
layout: "my"
---
```

构建项目，启动 `Hexo` 服务并访问 [http://localhost:4000/my/](http://localhost:4000/my/)，页面上成功显示 `Hello Hexo My!!!`。



## 3.3 模板首页

新建文件 `mytheme/layout/layout.swig`，用于整个页面的布局划分，其内容如下：

```html
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/styles.css">
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <title>{{ page.title }}</title>
</head>
<body>
    <!-- nav -->
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/my/">my</a></li>
        </ul>
    </nav>
    <!-- /end nav -->
    <!-- 页面的内容将填充到 body 中 -->
    {{ body }}

    <!-- footer -->
    <footer>
        <p>&copy; 2021 Viifo</p>
    </footer>
    <!-- /end footer -->
</body>
</html>{% endraw %}
```

修改 `mytheme/layout/index.swig` ，内容如下：

```html
<div class="container">
    <p>Hello Hexo Index!!!</p>
</div>
```

修改 `mytheme/layout/my.swig` ，内容如下：

```html
<div class="container">
    <p>Hello Hexo My!!!</p>
</div>
```

新增样式文件 `source/css/styles.css`，内容如下：

```css
nav, footer {
    position: fixed;
    left: 0;
    width: 100%;
    height: 50px;
    background: #999988;
}
nav {
    top:0;
}
footer {
    bottom: 0;
    text-align: center;
}
nav li {
    list-style: none;
    float: left;
    display: block;
    margin: 0 20px;
    cursor: pointer;
}
nav li a {
    color: #333;
    text-decoration: none;
}
nav a:hover {
    color: white;
}
.container {
    margin-top: 100px;
}
```



构建并运行项目，页面效果如下所示。

![](/resource/images/html/githubpages/hexo/hexo_08.jpg)





## 3.4 文章显示

修改 `mytheme/layout/index.swig` 文件，使其能显示文章列表：

```html
{% raw %}<div class="container">
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
</div>{% endraw %}
```

新增文件 `mytheme/layout/post.swig` ，文件内容如下，使得网站能显示文章内容；

```html
{% raw %}{{ page.content }}{% endraw %}
```

修改 `mytheme/source/css/styles.css` 文件，添加文章列表样式：

```css
.post {
    width: 100%;
    padding: 20px;
    text-align: left;
    color: #333333;
    text-decoration: none;
}
```

构建并运行项目，查看文章列表，点击文章列表查看文章内容。



## 3.5 模板指定

当前文章页面的导航栏遮挡了部分文章内容，由于每个模板都默认使用 `layout` 布局，现在我们为文章模板 `post.swig` 指定新的布局 `layout2.swig`，移除顶部导航栏，避免遮挡文章内容。

新增文件 `mytheme/layout/layout2.swig`，其内容如下：

```html
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/styles.css">
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <title>{{ page.title }}</title>
</head>
<body>
    <!-- 页面的内容将填充到 body 中 -->
    {{ body }}

    <!-- footer -->
    <footer>
        <p>&copy; 2021 Viifo</p>
    </footer>
    <!-- /end footer -->
</body>
</html>{% endraw %}
```

修改文件 `mytheme/layout/post.swig`，在 [Front-matter](https://hexo.io/zh-cn/docs/front-matter) 中指定文章页面使用的布局：

```yaml
---
layout: "layout2"
---
{% raw %}{{ page.content }}{% endraw %}
```

构建并运行项目，点击文章列表查看文章内容，现在的文章页面已经没有顶部导航栏的遮挡了。



## 3.6 局部模版（Partial）

前面我们创建了两个 `layout` 布局，我们发现他们都有共同的部分，我们可以将公共布局单独写成局部模板，通过导入局部模板复用公共布局。

新建文件 `mytheme/layout/partial/head.swig`，内容如下：

```html
{% raw %}<head>
    <meta charset="UTF-8">
    <!-- css()、js() 是辅助函数，更多请查看官方文档 -->
    <!-- https://hexo.io/zh-cn/docs/helpers#css -->
    {{ css("css/styles.css") }}
    {{ js("https://code.jquery.com/jquery-3.1.1.min.js") }}
    <title>{{ page.title }}</title>
</head>{% endraw %}
```

新建文件 `mytheme/layout/partial/nav.swig`，内容如下：

```html
<!-- nav -->
<nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/my/">my</a></li>
    </ul>
</nav>
<!-- /end nav -->
```

新建文件 `mytheme/layout/partial/footer.swig`，内容如下：

```html
<!-- footer -->
<footer>
    <p>&copy; 2021 Viifo</p>
</footer>
<!-- /end footer -->
```



修改文件 `mytheme/layout/layout.swig`，导入局部模板；

```html
{% raw %}<!DOCTYPE html>
<html lang="en">
{{ partial('partial/head') }}
<body>
    {{ partial('partial/nav') }}
    {{ body }}
    {{ partial('partial/footer') }}
</body>
</html>{% endraw %}
```

修改文件 `mytheme/layout/layout2.swig`，导入局部模板；

```html
{% raw %}<!DOCTYPE html>
<html lang="en">
{{ partial('partial/head') }}
<body>
    {{ body }}
    {{ partial('partial/footer') }}
</body>
</html>{% endraw %}
```

构建并运行项目，查看页面效果。





# 4. 小结

* 了解主题前必须了解 `Hexo` 项目的目录结构；
*  `Hexo` 主题放置在 `themes` 目录下， `Hexo` 主题可以说是一个独立的项目；
*  [Front-matter](https://hexo.io/zh-cn/docs/front-matter) 可指定文章或页面使用的布局；
* 除 `Hexo` 内定的模板名称外，新增的自定义页面需要在根目录中的 `source` 文件夹下新增与页面同名的目录，并在目录中新增文件 `index.html`，文件的内容中需要指明使用的模板名为新增页面名；
* 局部模板可以在不同的模板之间共享相同的组件。

