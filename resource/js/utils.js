---
layout: null
---
let totalPage = 1
let searchObj = search({
    path: "/search.json",
    page: 1,
    limit: {{ site.paginate }},
    exclude: "url,content"
})


/**
 * 生成标签词云列表
 * @param key - json key
 * @param callback - 结果回调
 */
searchWordCloudList = function (key, callback) {
    searchObj.searchOneKeyValueForJson(key, function (results) {
        // 单词计数
        let count = {}
        let tempArray = results.join(",").split(",")
        for (let key in tempArray) {
            if (tempArray.hasOwnProperty(key)) {
                let index = tempArray[key]
                count[index] = (count[index] + 1) || 1
            }
        }
        // 处理词云数据
        let list = []
        for (let key in count) {
            if (count.hasOwnProperty(key)) {
                let ar = [key, count[key] * 50, "{{ site.url }}/tag?flag=" + encodeURI(key)]
                list.push(ar)
            }
        }
        callback(list)
    })
}


/**
 * 按搜索 jsonkey 搜索
 * @param page - 页码
 * @param key - jsonkey
 * @param flag
 * @param element - 渲染节点
 */
searchJsonKey = function(page, key, flag, element) {
    searchObj.searchOneKeyForJson({ page: page }, key, flag, function (results) {
        element.empty()
        // 添加文章
        $.each(results, function (index, json) {
            let postPreview = $(`<div class="post-preview"></div>`)
            postPreview.append(`
                <a href="${ json.url }">
                    <h1>${ json.title }</h1>
                    <h2>${ json.subtitle }</h2>
                    <p class="brief">${ json.content }</p>
                </a>
            `)
            if (json.tags.trim() !== "") {
                let tags = $(`<p class="tags"></p>`)
                $.each(json.tags.split(","), function (i, tag) {
                    tags.append(`
                        <a href="{{ site.url }}/tag?flag=${ tag }">
                            <i class="fa fa-tags"></i>${ tag }
                        </a>
                    `)
                })
                postPreview.append(tags)
            }
            postPreview.append(`<p class="attach-info">作者 ${ json.author } 发布于 ${ json.date }</p>`)
            element.append(postPreview)
            element.append(`<hr/>`)
        })
        // 添加分页
        let total = searchObj.getPageTotal()
        if (total > 1) {
            let pager = $(`<ul class="pager"></ul>`)
            if (page > 1) {
                // 显示上一页
                let url = replaceUrlParam("page", page - 1)
                pager.append(`
                    <li class="previous">
                        <a href="${url}"><i class="fa fa-angle-double-left"></i>&nbsp;上一页</a>
                    </li>
                `)
            }
            if (page < total) {
                // 显示下一页
                let url = replaceUrlParam("page", page + 1)
                pager.append(`
                    <li class="next">
                        <a href="${url}">下一页&nbsp;<i class="fa fa-angle-double-right"></i></a>
                    </li>
                `)
            }
            element.append(pager)
        }
    })
}

/**
 * 关键字搜索
 * @param element - 结果容器
 * @param keyWord - 关键字
 */
searchKeyWord = function (keyWord, element) {
    searchObj.searchForJson({ keyWord: keyWord, limit: 5 }, function (results) {
        element.empty()
        $.each(results, function (index, json) {
            element.append(
                `<li>
                     <a href="${json.url}">${json.title}</a>
                 </li>`
            )
        })
    })
}

/**
 * 加载分类
 * @param element - 分类容器
 */
generatorCategories = function (element) {
    searchObj.searchCategoriesForJson("category", function (categories) {
        element.empty()
        for (let key in categories) {
            if (categories.hasOwnProperty(key)) {
                let count = categories[key]
                if (count > 99) count = "99+"
                element.append(
                    `<li>
                         <a href="{{ site.url }}/category?flag=${encodeURI(key)}">
                             ${key}<span>${count}</span>
                         </a>
                    </li>`
                )
            }
        }
    })
}

/**
 * 按年分组
 * @param element - 分类容器
 * @param yearStr
 */
groupByDate = function (element, yearStr) {
   searchObj.groupByDate(function (results) {
       let split = ""
       for (let key in results) {
           element.append(`<li class="title ${split}">${key.substr(1)}${yearStr}<li>`)
           split = "split"
           if (results.hasOwnProperty(key)) {
               $.each(results[key], function (index, json){
                   element.append(`
                    <li class="item">
                        <a href="${ json.url }">
                            <h1>${ json.title }</h1>
                            <h2>${ json.subtitle }</h2>
                        </a>
                        <hr/>
                    <li>`)
               })
           }
       }
   })
}


/**
 * 获取当前 url
 * @returns { string }
 */
getUrl = function () {
    return window.location.href
}

/**
 * 替换 url 参数，没有则添加
 * @param key
 * @param value
 */
replaceUrlParam = function (key, value) {
    let url = window.location.href.toString();
    if (getParam(key) == null) {
        if (url.indexOf("?") < 0) {
            return url + "?" + key + "=" + value
        } else {
            return url + "&" + key + "=" + value
        }
    } else {
        let re = eval('/('+key+'=)([^&]*)/gi');
        return url.replace(re,key + '=' + value);
    }
}

/**
 * 获取 url参数
 * @param name - 参数名
 * @returns {string|null}
 */
getParam = function (name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

/**
 * 保存主题
 * @param name
 */
saveTheme = function (name) {
    localStorage.setItem("theme", name);
}

/**
 * 获取主题
 * @param name
 */
getTheme = function () {
    return localStorage.getItem("theme");
}

