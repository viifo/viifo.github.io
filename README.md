# Viifo's Blog

[中文](https://github.com/viifo/viifo.github.io/blob/master/README.md) | [English](https://github.com/viifo/viifo.github.io/blob/master/README_en.md)

[在线预览](https://viifo.github.io/)

![](./screenshots/preview.png)





## 使用

1. 开始使用前你需要确保你的系统里已经有 Jekyll 环境配置，没有 [参考教程](https://viifo.github.io/html/2021-10-03-Github-Pages-+-Jekyll%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%AB%99%E7%B3%BB%E5%88%97(1).html) 安装环境；
2. 下载
```shell
git clone git@github.com:viifo/viifo.github.io.git
```
3. 使用
```shell
# 安装相关依赖项
bundle install 
# 启动 jekyll 服务
bundle exec jekyll serve
# 访问 localhost:4000 浏览网页
```





## `_config.yml` 配置项

**导航栏菜单**

```yaml
nav-items:
  - title: "Home"
    url: /
  - title: "Archives"
    url: /archive
```
**页面背景**

```yaml
# 主页背景
page-img: resource/images/background-page.jpg
# 分类&标签&归档页背景
work-img: resource/images/background-work.jpg
```





## `post` 配置项

**分类&标签**

`post`的分类信息将会被自动整理计数显示在主页侧边栏；文章的标签可以有多个；
通过分类和标签可以检索同类型的文章。
```yaml
category:   HTML
tags:
    - github
    - jekyll
```

**图片**

若图片存在描述信息，将会在图片下方显示图片的描述信息，markdown 使用如下方式显示图片：
```markdown
![图片描述信息](图片地址)
```





## License

```
Copyright 2021 viifo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

