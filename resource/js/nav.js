$(function () {
    let navbar = $('#navbar-item');
    let toggle = $('.navbar-toggle');
    let searchInput = $('#search-input');
    let navbarSearchResults = $('#navbar-search-results');
    toggle.click(function () {
        if (navbar.hasClass("display")) {
            hiddenNav()
            toggle.blur()
        } else {
            displayNav()
        }
    })
    // 搜索款失去焦点时清空内容
    searchInput.blur(function () {
        searchInput.val("")
        navbarSearchResults.empty()
    })
    // 搜索款内容改变
    searchInput.on("input", function () {
        searchKeyWord($(this).val(), navbarSearchResults)
    })

    $(window).resize(function () {
        // 当浏览器大小变化时
        if ($(window).width() > 767) {
            displayNav()
        } else {
            hiddenNav()
        }
    });

    // 切换主题
    $("#day-night-switch").change(function() {
        let body = $("#body-container")
        if (body.hasClass("day")) {
            body.removeClass("day")
            body.addClass("night")
            loadWordCloud("night")
            saveTheme("night")
        } else {
            body.removeClass("night")
            body.addClass("day")
            loadWordCloud("day")
            saveTheme("day")
        }
    });

    /**
     * 隐藏导航栏 item
     */
    function hiddenNav() {
        navbar.removeClass("display")
        navbar.addClass("hidden")
    }
    /**
     * 显示导航栏 item
     */
    function displayNav() {
        navbar.removeClass("hidden")
        navbar.addClass("display")
    }
})

let prevScrollTop = 0
let nav = $('#nav');
function navScrollWithFixed(isFixed) {
    $(window).scroll(function() {
        if (isFixed) {
            let top = $(window).scrollTop()
            if (top > 50 && top > prevScrollTop) {
                nav.addClass("hidden")
            } else {
                nav.removeClass("hidden")
            }
            prevScrollTop = top;
        } else {
            let top = $(window).scrollTop()

            if (top >= 400 && top > prevScrollTop) {
                nav.addClass("hidden")
            } else if(top >= 100){
                nav.removeClass("navbar-transparent")
                nav.addClass("navbar-white")
                nav.removeClass("hidden")
            } else {
                nav.removeClass("navbar-white")
                nav.addClass("navbar-transparent")
                nav.removeClass("hidden")
            }
            prevScrollTop = top;
        }
    })
}