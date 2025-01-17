$(function () {
    // 查找全部标题 只查找 h1 - h3
    let postContent = $(".post-content")
    // 插入脚注标题
    insertFootnotesTitle()

    let titles = postContent.find('h1,h2,h3');
    let prevActive = null;

    // 初始化文章目录
    initCatalog()
    // 生成代码行
    initCodeLine()
    // 页面滚动监听
    initScrollListener()
    // 设置图片居中和图片标题
    initImagesStyle()
    // 鼠标悬浮在代码上显示复制图标
    initCopyCodeIcon()

    /**
     * 插入脚注标题
     */
    function insertFootnotesTitle() {
        let divFootnotes = postContent.find("div.footnotes")
        divFootnotes.before(`<h2 id="脚注">脚注</h2>`)
    }

    /**
     * 设置图片居中和图片标题
     */
    function initImagesStyle() {
        let images = postContent.find("img")
        images.each(function () {
            let parent = $(this).parent()
            let tagName = parent.prop("tagName")
            let imgTitle = $(this).attr("alt")
            let imgWidth = $(this).width()

            if (tagName === "TD") {
                // 表格中的图片
                $(this).attr("width", "300px")
                parent.append(this)
            } else {
                // 图片居中
                parent.empty()
                parent.css("display", "flex")
                parent.css("flex-direction", "row")
                parent.css("justify-content", "center")
                parent.css("justify-items", "center")
                parent.css("line-height", "50px")

                let imgWrap = $(`<div></div>`)
                imgWrap.css("width", imgWidth)
                imgWrap.css("display", "table-cell")
                imgWrap.append(this)
                parent.append(imgWrap)

                // 处理图片对齐、大小等特殊规则
                // 图片标题应该放在图片描述前面
                // Align:left&Height:size&Width:size&Title:图片标题&Desc:图片描述
                if (imgTitle.includes("&")) {
                    let tempArr = imgTitle.split('&')
                    let name = null
                    for (let i = 0; i < tempArr.length; i ++) {
                        name = tempArr[i].toLowerCase()
                        if (name.startsWith("align")) {
                            let alignArr = name.split(':')
                            if (alignArr.length > 1) {
                                parent.css("justify-content", alignArr[1])
                                parent.css("justify-items", alignArr[1])
                            }
                        } else if (name.startsWith("height")) {
                            // 图片高度
                            let heightArr = name.split(':')
                            if (heightArr.length > 1 && heightArr[1].trim().length > 0) {
                                $(this).attr("height", heightArr[1])
                                imgWrap.css("height", heightArr[1])
                                imgWrap.css("width", $(this).width())
                            }
                        } else if (name.startsWith("width")) {
                            // 图片宽度
                            let widthArr = name.split(':')
                            if (widthArr.length > 1 && widthArr[1].trim().length > 0) {
                                imgWrap.css("width", widthArr[1])
                                $(this).attr("width", widthArr[1])
                            }
                        } else if (name.startsWith("title")) {
                            // 图片标题
                            let titleArr = name.split(':')
                            if (titleArr.length > 1 && titleArr[1].trim().length > 0) {
                                imgWrap.append(`<div style="text-align: center"><span class="post-img-title">${ titleArr[1] }</span></div>`)
                            }
                        } else if (name.startsWith("desc")) {
                            // 图片描述
                            let descArr = name.split(':')
                            if (descArr.length > 1 && descArr[1].trim().length > 0) {
                                imgWrap.append(`<div style="text-align: center"><span class="post-img-title">${ descArr[1] }</span></div>`)
                            }
                        }
                    }
                } else if (imgTitle) {
                    // 图片标题
                    imgWrap.append(`<div style="text-align: center"><span class="post-img-title">${ imgTitle }</span></div>`)
                }
            }
        })
    }

    /**
     * 初始化文章目录
     */
    function initCatalog() {
        // 创建目录
        createCatalog(".catalog-body");
        // 选中目录
        setCategoryActive(true)
        // 点击目录标题折叠目录
        $(".title-catalog").click((function () {
            let icon = $(this).find("i")
            let catalog = $(".catalog-body")
            if (icon.hasClass("fa-angle-down")) {
                icon.removeClass("fa-angle-down")
                icon.addClass("fa-angle-up")
                catalog.css("height", "0")
            } else {
                icon.addClass("fa-angle-down")
                icon.removeClass("fa-angle-up")
                catalog.css("height", "auto")
            }
        }))
        // 点击目录匀速滚动到指定位置
        $(".catalog-body a").click((function () {
            let id = $(this).prop('id')
            let top = $(id).offset().top - 60
            $("html,body").animate({scrollTop: top}, 200)
        }))
    }

    /**
     * 生成代码行
     */
    function initCodeLine() {
        $("pre.highlight").find("code").each(function () {
            let code = $(this)
            let lines = $(this).html().split(/[\r\n]/)
            code.empty()
            for (let i = 0; i < lines.length; i ++) {
                if (i < lines.length - 1 || (i === lines.length - 1 && lines[i].trim() !== '')) {
                    code.append(`<sapn class="line">${replaceSpaces(lines[i])}</sapn>\n`)
                }
            }
        })
    }

    /**
     * 鼠标悬浮在代码上显示复制图标
     */
    function initCopyCodeIcon() {
        $("div.highlight").each(function () {
            let randomClass = randomString()
            let copyIcon = $(`<button class="copy-icon ${randomClass}" aria-label="${randomClass}"><i class="fa fa-file-code-o"></i></button>`)
            copyIcon.on("click", function () {
                let copyHint = $("#copy-hint")
                let highlight = $(this).next("div.highlight")
                let clipboard = new ClipboardJS('.' + $(this).attr("aria-label"), {
                    text: function(trigger) {
                        return highlight.text();
                    }
                });
                clipboard.on('success', function (e) {
                    copyHint.css("display", "block")
                    setTimeout(function() {
                        copyHint.css("display", "none")
                    },1000);
                    e.clearSelection();
                });
            })
            // 复制图标添加在 div.highlight元素前
            $(this).before(copyIcon)
        })
    }

    /**
     * 随机字符串
     * @param e - 位数， 默认 6 位
     * @return {string}
     */
    function randomString(e) {
        e = e || 6
        let t = "ABCDEFGHIJKLMNPQRSTWXYZabcdefhijklmnprstwxyz_"
        let a = t.length
        let n = ""
        for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }

    /**
     * 页面滚动监听
     */
    function initScrollListener() {
        let catalog = $(".page-catalog")
        let catalogWidth = catalog.css("width")
        $(window).scroll(function() {
            let top = $(window).scrollTop()
            if (top > 100) {
                catalog.css("position", "fixed")
                catalog.css("margin-top", "70px")
                catalog.css("top", "0")
                catalog.css("width", catalogWidth)
            } else {
                catalog.css("position", "relative")
                catalog.css("top", "0")
                catalog.css("margin-top", "160px")
            }
            setCategoryActive(false)
        })
    }

    /**
     * 设置新的目录选中状态
     */
    function setCategoryActive(init) {
        titles.each(function () {
            let offsetTop = $(this).offset().top
            let scrollTop = $(document).scrollTop()
            let top = offsetTop - scrollTop
            let element = $(`.cl-${ $(this).prop('id') }`)
            if (top > 0 && top < 100) {
                prevActive = element;
            } else if (init && top < 0) {
                prevActive = element;
            }
            element.removeClass("active")
        })
        if (prevActive) {
            prevActive.addClass("active")
        }
    }

    /**
     * 创建目录
     * @param contentSelector
     * @param categorySelector
     */
    function createCatalog(categorySelector) {
        // 清除原内容
        let category = $(categorySelector)
        category.html('')
        // 动态生成目录列表
        titles.each(function () {
            let tagName = $(this)[0].tagName
            let tagClass = ""
            if (tagName === "H2") {
                tagName = "&nbsp;&nbsp;"
                tagClass = "h2"
            } else if (tagName === "H3") {
                tagName = "&nbsp;&nbsp;&nbsp;&nbsp;"
                tagClass = "h3"
            } else {
                tagName = ""
            }
            category.append(
                `<li class="cl-${ $(this).prop('id') }">
                    ${tagName}<a id="#${ $(this).prop('id') }" class="${tagClass}" href="javascript:;" rel="nofollow">${ $(this).text() }</a>
                </li>`);
        });
    }

    /**
     * 代码空格替换，缩进
     */
    function replaceSpaces(html) {
        let spaces = ""
        // 制表符
        let isTableSymbol = false
        let i
        for (i = 0; i < html.length; i ++) {
            if (html.charAt(i) === ' ') {
                spaces += "&nbsp;"
            } else if (html.charAt(i) === '╎') {
                // 兼容制表符
                isTableSymbol = true
                spaces += "╎"
            } else {
                break
            }
        }
        // spaces = spaces.replaceAll("&nbsp;&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;")
        if (isTableSymbol) {
            return spaces + html.trim().substr(i)
        } else {
            return spaces + html.trim()
        }
    }

})
