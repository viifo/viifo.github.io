# Viifo's Blog

[中文](https://github.com/viifo/viifo.github.io/blob/master/README.md) | [English](https://github.com/viifo/viifo.github.io/blob/master/README_en.md)

[online preview](https://viifo.github.io/)

![](./screenshots/preview.png)





## Usage

1. Before you start to use it, you need to make sure that you have Jekyll environment configuration in your system, refer to the [guide tutorial](https://viifo.github.io/html/2021-10-03-Github-Pages-+-Jekyll%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%AB%99%E7%B3%BB%E5%88%97(1).html) installation environment.
2. Download
```shell
git clone git@github.com:viifo/viifo.github.io.git
```
3. Run
```shell
# Install related dependencies
bundle install 
# Start jekyll service
bundle exec jekyll serve
# Visit localhost:4000 to browse the website
```





## `_config.yml` Options

**Navigation bar menu**

```yaml
nav-items:
  - title: "Home"
    url: /
  - title: "Archives"
    url: /archive
```
**Page background**

```yaml
# Homepage background
page-img: resource/images/background-page.jpg
# Categories & Tags & Archive Page Background
work-img: resource/images/background-work.jpg
```





## `post` Options

**Categories & Tags**

The classification information of the `post` will be automatically sorted and counted and displayed on the sidebar of the homepage. there can be multiple tags for the post. Search articles of the same type through classification and tags.

```yaml
category:   HTML
tags:
    - github
    - jekyll
```

**Images**

If the picture has description information, the description information of the picture will be displayed below the picture, and the picture will be displayed in the following way.
```markdown
![image description](image url)
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

