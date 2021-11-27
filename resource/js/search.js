let data = null
let pageTotal = 0
let options = {
    path: null,
    keyWord: null,
    page: 1,
    limit: Number.MAX_VALUE,
    exclude: ""
}

/**
 * 返回搜索结果 Json 字符串, 搜索结果被分页
 */
function searchForJson(_options, callback) {
    setSearchOptions(_options)
    initJsonObject(function () {
        let results = []
        if (options.keyWord && options.keyWord.trim() !== '') {
            $.each(data, function(i, json) {
                if (match(json, options.keyWord)) {
                    results.push(json)
                }
            })
        }
        // 分页
        let limit = _options.limit || options.limit
        let start = (options.page - 1) * limit
        let end = options.page * limit
        callback(results.slice(start, end))
    })
}


/**
 * 返回某一 Json key 的所有值
 */
function searchOneKeyValueForJson(jsonkey, callback) {
    setPageOptions({page: 1, limit: Number.MAX_VALUE})
    initJsonObject(function () {
        let results = []
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let value = hasKey(data[key], jsonkey)
                if (value != null) {
                    results.push(value)
                }
            }
        }
        callback(results)
    })
}


/**
 * 返回搜索结果 Json 字符串, 搜索结果被分页
 */
function searchOneKeyForJson(_options, jsonkey, flag, callback) {
    setPageOptions(_options)
    initJsonObject(function () {
        let results = []
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let value = hasKey(data[key], jsonkey)
                if (value != null && ((flag === "" && value === "") || (flag !== "" && value.indexOf(flag) >= 0))) {
                    results.push(data[key])
                }
            }
        }
        // 分页
        pageTotal = Math.ceil(results.length / options.limit)
        let start = (options.page - 1) * options.limit
        let end = options.page * options.limit
        callback(results.slice(start, end))
    })
}

/**
 * 返回分类结果 Json 字符串
 */
function searchCategoriesForJson(category, callback) {
    initJsonObject(function () {
        let results = {}
        for (let key in data) {
            if (data.hasOwnProperty(key) && data[key].hasOwnProperty(category)) {
                let json = data[key]
                if (json[category].trim() === '') {
                    results = countCategory(results,"other")
                } else {
                    results = countCategory(results, json[category])
                }
            }
        }
        callback(sortJson(results, compareCategory))
    })
}

/**
 * 按年分组
 */
 function groupByDate (callback) {
    initJsonObject(function () {
        let results = {}
        $.each(data, function (index, json){
            if (json.hasOwnProperty("date")) {
                // 加上一个字符，避免json对象自动按年份升序排序
                let year = 'y' + json.date.substr(0, 4)
                if (!results.hasOwnProperty(year)) {
                    results[year] = []
                }
                results[year].push(json)
            }
        })
        callback(results)
    })
}

/**
 * json 排序
 * @param json
 * @param compareFun
 */
function sortJson(json, compareFun) {
    let results = {}
    let temp = []
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            temp.push({
                key: key,
                value: json[key]
            })
        }
    }
    temp.sort(compareFun)
    for (let index in temp) {
        if (temp.hasOwnProperty(index)) {
            results[temp[index].key] = temp[index].value
        }
    }
    return results
}

/**
 * 时间分组排序 - 倒序
 * @param item1
 * @param item2
 */
function compareDate(item1,item2) {
    return parseInt(item2.key) - parseInt(item1.key)
}

/**
 * 分类排序，倒序
 * @param item1
 * @param item2
 */
function compareCategory(item1,item2) {
    return item2.value - item1.value
}

/**
 * 分类计数
 * @param json
 * @param key
 * @returns {*}
 */
function countCategory(json, key) {
    if (json.hasOwnProperty(key)) {
        json[key] = json[key] + 1
    } else {
        json[key] = 1
    }
    return json
}


/**
 * 关键字匹配
 * @param json
 * @param keyWord
 */
function match(json, keyWord) {
    let result = false
    $.each(json, function (key) {
        if (options.exclude.indexOf(key) < 0 && json[key].toUpperCase().indexOf(keyWord.toUpperCase()) >= 0) {
            result = true
            return false
        }
    })
    return result
}

/**
 * 初始化 json 对象
 */
function initJsonObject(callback) {
    if (data != null) {
        callback()
    } else {
        $.getJSON(options.path, function (json) {
            data = json
            callback()
        });
    }
}

/**
 * 搜索选项
 * @param _options
 */
function setOptions(_options) {
    setSearchOptions(_options)
    if (_options) {
        options.path = _options.path || options.path
        options.limit = _options.limit || options.limit
    }
}

/**
 * 搜索选项
 * @param _options
 */
function setSearchOptions(_options) {
    setPageOptions(_options)
    if (_options) {
        options.keyWord = _options.keyWord
        options.exclude = _options.exclude || options.exclude
    }
}

/**
 * 分页选项
 * @param _options
 */
function setPageOptions(_options) {
    if (_options) {
        options.page = _options.page || options.page
    }
}

/**
 * json 字符串是否存在此 key
 * @param json
 * @param key
 * @returns {null|string}
 */
function hasKey(json, key) {
    for (let k in json) {
        if (json.hasOwnProperty(k) && k === key) {
            return json[k]
        }
    }
    return null
}

/**
 * 分页总数
 * @returns {number}
 */
function getPageTotal() {
    return pageTotal
}

/**
 * 搜索
 * @param _options
 */
window.search = function (_options) {
    setOptions(_options)
    return {
        searchForJson: searchForJson,
        searchCategoriesForJson: searchCategoriesForJson,
        searchOneKeyForJson: searchOneKeyForJson,
        searchOneKeyValueForJson: searchOneKeyValueForJson,
        groupByDate: groupByDate,
        getPageTotal: getPageTotal
    }
}