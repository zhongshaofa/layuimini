layui.define(["element", "jquery"], function (exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;

    // 判断是否在web容器中打开
    if (!/http(s*):\/\//.test(location.href)) {
        return layer.alert("请先将项目部署至web容器（Apache/Tomcat/Nginx/IIS/等），否则部分数据将无法显示");
    }

    window.clearInfo = {};

    layuimini = new function () {

        /**
         * 初始化
         * @param url
         */
        this.init = function (url) {
            var loading = layer.load(0, {shade: false, time: 2 * 1000});
            layuimini.initDevice();
            $.getJSON(url, function (data, status) {
                if (data == null) {
                    layuimini.msg_error('暂无菜单信息');
                } else {
                    layuimini.initHome(data.homeInfo);
                    layuimini.initMenu(data.menuInfo);
                    layuimini.initTab();
                    window.clearInfo = data.clearInfo;
                }
            }).fail(function () {
                layuimini.msg_error('菜单接口有误');
            });
            layer.close(loading);
        };

        /**
         * 初始化设备端
         */
        this.initDevice = function () {
            if (layuimini.checkMobile()) {
                $('.clildFrame').attr('style', 'overflow-y:scroll; overflow-x:hidden;table-layout: fixed;word-wrap:break-word;word-break:break-all;-webkit-overflow-scrolling: touch!important;');
                $('.layui-layout-left').attr('style','left:60px!important');
                $('.layuimini-tool').attr('style','left:15px!important');
            } else {
                $('.layui-logo').removeClass('layui-hide');
            }
        };

        /**
         * 初始化首页信息
         * @param data
         */
        this.initHome = function (data) {
            sessionStorage.setItem('layuiminiHomeHref', data.href);
            $('#layuiminiHomeTabId').html('<i class="' + data.icon + '"></i> <span>' + data.title + '</span>');
            $('#layuiminiHomeTabId').attr('lay-id', data.href);
            $('#layuiminiHomeTabIframe').html('<iframe width="100%" height="100%" frameborder="0"  src="' + data.href + '"></iframe>');
        };

        /**
         * 初始化菜单栏
         * @param data
         */
        this.initMenu = function (data) {
            var headerMenuHtml = '',
                headerMobileMenuHtml = '',
                leftMenuHtml = '',
                headerMenuCheckDefault = 'layui-this',
                leftMenuCheckDefault = 'layui-this';
            window.menuParameId = 1;

            $.each(data, function (key, val) {
                headerMenuHtml += '<li class="layui-nav-item ' + headerMenuCheckDefault + '" id="' + key + 'HeaderId" data-menu="' + key + '"> <a href="javascript:;"><i class="' + val.icon + '"></i> ' + val.title + '</a> </li>\n';
                headerMobileMenuHtml += '<dd><a href="javascript:;" id="' + key + 'HeaderId" data-menu="' + key + '"><i class="' + val.icon + '"></i> ' + val.title + '</a></dd>\n';
                leftMenuHtml += '<ul class="layui-nav layui-nav-tree layui-left-nav-tree ' + leftMenuCheckDefault + '" id="' + key + '">\n';
                var menuList = val.child;
                $.each(menuList, function (index, menu) {
                    leftMenuHtml += '<li class="layui-nav-item">\n';
                    if (menu.child != undefined && menu.child != []) {
                        leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips" ><i class="' + menu.icon + '"></i><span class="layui-left-nav"> ' + menu.title + '</span> </a>';
                        var buildChildHtml = function (html, child, menuParameId) {
                            html += '<dl class="layui-nav-child">\n';
                            $.each(child, function (childIndex, childMenu) {
                                html += '<dd>\n';
                                if (childMenu.child != undefined && childMenu.child != []) {
                                    html += '<a href="javascript:;" class="layui-menu-tips" ><i class="' + childMenu.icon + '"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>';
                                    html = buildChildHtml(html, childMenu.child, menuParameId);
                                } else {
                                    html += '<a href="javascript:;" class="layui-menu-tips" data-type="tabAdd"  data-tab-mpi="m-p-i-' + menuParameId + '" data-tab="' + childMenu.href + '" target="' + childMenu.target + '"><i class="' + childMenu.icon + '"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>\n';
                                    menuParameId++;
                                    window.menuParameId = menuParameId;
                                }
                                html += '</dd>\n';
                            });
                            html += '</dl>\n';
                            return html;
                        };
                        leftMenuHtml = buildChildHtml(leftMenuHtml, menu.child, menuParameId);
                    } else {
                        leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips"  data-type="tabAdd" data-tab-mpi="m-p-i-' + menuParameId + '" data-tab="' + menu.href + '" target="' + menu.target + '"><i class="' + menu.icon + '"></i><span class="layui-left-nav"> ' + menu.title + '</span></a>\n';
                        menuParameId++;
                    }
                    leftMenuHtml += '</li>\n';
                });
                leftMenuHtml += '</ul>\n';
                headerMenuCheckDefault = '';
                leftMenuCheckDefault = 'layui-hide';
            });
            $('.layui-header-menu.layui-hide-xs').html(headerMenuHtml); //电脑
            $('.mobile-layui-layout-left').html(headerMobileMenuHtml); //手机
            $('.layui-left-menu').html(leftMenuHtml);
            element.init();
        };

        /**
         * 初始化选项卡
         */
        this.initTab = function () {
            var locationHref = window.location.href;
            var urlArr = locationHref.split("#");
            if (urlArr.length >= 2) {
                var href = urlArr.pop();

                // 判断链接是否有效
                var checkUrl = layuimini.checkUrl(href);
                if (checkUrl != true) {
                    return layuimini.msg_error(checkUrl);
                }

                // 判断tab是否存在
                var checkTab = layuimini.checkTab(href);
                if (!checkTab) {
                    var title = href,
                        tabId = href;
                    $("[data-tab]").each(function () {
                        var checkHref = $(this).attr("data-tab");
                        // 判断是否带参数了
                        if (href.indexOf("mpi=") > -1) {
                            var menuParameId = $(this).attr('data-tab-mpi');
                            if (checkHref.indexOf("?") > -1) {
                                checkHref = checkHref + '&mpi=' + menuParameId;
                            } else {
                                checkHref = checkHref + '?mpi=' + menuParameId;
                            }
                        }
                        if (checkHref == tabId) {
                            title = $(this).html();
                            title = title.replace('style="display: none;"', '');

                            // 自动展开菜单栏
                            var addMenuClass = function ($element, type) {
                                if (type == 1) {
                                    $element.addClass('layui-this');
                                    if ($element.attr('class') != 'layui-nav-item layui-this') {
                                        addMenuClass($element.parent().parent(), 2);
                                    } else {
                                        var moduleId = $element.parent().attr('id');
                                        $(".layui-header-menu li").attr('class', 'layui-nav-item');
                                        $("#" + moduleId + "HeaderId").addClass("layui-this");
                                        $(".layui-left-nav-tree").attr('class', 'layui-nav layui-nav-tree layui-hide');
                                        $("#" + moduleId).attr('class', 'layui-nav layui-nav-tree layui-this');
                                    }
                                } else {
                                    $element.addClass('layui-nav-itemed');
                                    if ($element.attr('class') != 'layui-nav-item layui-nav-itemed') {
                                        addMenuClass($element.parent().parent(), 2);
                                    } else {
                                        var moduleId = $element.parent().attr('id');
                                        $(".layui-header-menu li").attr('class', 'layui-nav-item');
                                        $("#" + moduleId + "HeaderId").addClass("layui-this");
                                        $(".layui-left-nav-tree").attr('class', 'layui-nav layui-nav-tree layui-hide');
                                        $("#" + moduleId).attr('class', 'layui-nav layui-nav-tree layui-this');
                                    }
                                }
                            };
                            addMenuClass($(this).parent(), 1);
                        }
                    });
                    layuiminiHomeTab = $('#layuiminiHomeTab').attr('lay-id');
                    layuiminiHomeHref = sessionStorage.getItem('layuiminiHomeHref');
                    if (layuiminiHomeTab != href && layuiminiHomeHref != href) {
                        layuimini.addTab(tabId, href, title, true);
                        layuimini.changeTab(tabId);
                    }
                }
            }
            layuimini.hashTab();
        };

        /**
         * 判断窗口是否已打开
         * @param tabId
         **/
        this.checkTab = function (tabId) {
            // 判断选项卡上是否有
            var checkTab = false;
            $(".layui-tab-title li").each(function () {
                checkTabId = $(this).attr('lay-id');
                if (checkTabId != null && checkTabId == tabId) {
                    checkTab = true;
                }
            });
            if (checkTab == false) {
                return false;
            }

            // 判断sessionStorage是否有
            var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("layuiminiTabInfo"));
            if (layuiminiTabInfo == null) {
                layuiminiTabInfo = {};
            }
            var check = layuiminiTabInfo[tabId];
            if (check == undefined || check == null) {
                return false;
            }
            return true;
        };

        /**
         * 打开新窗口
         * @param tabId
         * @param href
         * @param title
         */
        this.addTab = function (tabId, href, title, addSession) {
            if (addSession == undefined || addSession == true) {
                var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("layuiminiTabInfo"));
                if (layuiminiTabInfo == null) {
                    layuiminiTabInfo = {};
                }
                layuiminiTabInfo[tabId] = {href: href, title: title}
                sessionStorage.setItem("layuiminiTabInfo", JSON.stringify(layuiminiTabInfo));
            }
            element.tabAdd('layuiminiTab', {
                title: title + '<i data-tab-close="" class="layui-icon layui-unselect layui-tab-close">ဆ</i>' //用于演示
                , content: '<iframe width="100%" height="100%" frameborder="0"  src="' + href + '"></iframe>'
                , id: tabId
            });
        };

        /**
         * 删除窗口
         * @param tabId
         */
        this.delTab = function (tabId) {
            var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("layuiminiTabInfo"));
            if (layuiminiTabInfo != null) {
                delete layuiminiTabInfo[tabId];
                sessionStorage.setItem("layuiminiTabInfo", JSON.stringify(layuiminiTabInfo))
            }
            element.tabDelete('layuiminiTab', tabId);
        };

        /**
         * 切换选项卡
         **/
        this.changeTab = function (tabId) {
            element.tabChange('layuiminiTab', tabId);
        };

        /**
         * Hash地址的定位
         */
        this.hashTab = function () {
            var layId = location.hash.replace(/^#/, '');
            element.tabChange('layuiminiTab', layId);
            element.on('tab(layuiminiTab)', function (elem) {
                location.hash = $(this).attr('lay-id');
            });
        };

        /**
         * 判断是否为手机
         */
        this.checkMobile = function () {
            var ua = navigator.userAgent.toLocaleLowerCase();
            var pf = navigator.platform.toLocaleLowerCase();
            var isAndroid = (/android/i).test(ua) || ((/iPhone|iPod|iPad/i).test(ua) && (/linux/i).test(pf))
                || (/ucweb.*linux/i.test(ua));
            var isIOS = (/iPhone|iPod|iPad/i).test(ua) && !isAndroid;
            var isWinPhone = (/Windows Phone|ZuneWP7/i).test(ua);
            if (!isAndroid && !isIOS && !isWinPhone) {
                return false;
            } else {
                return true;
            }
        };

        /**
         * 判断链接是否有效
         * @param url
         * @returns {boolean}
         */
        this.checkUrl = function (url) {
            var msg = true;
            $.ajax({
                url: url,
                type: 'get',
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                async: false,
                error: function (xhr, textstatus, thrown) {
                    msg = 'Status:' + xhr.status + '，' + xhr.statusText + '，请稍后再试！';
                }
            });
            return msg;
        };

        /**
         * 成功
         * @param title
         * @returns {*}
         */
        this.msg_success = function (title) {
            return layer.msg(title, {icon: 1, shade: this.shade, scrollbar: false, time: 2000, shadeClose: true});
        };

        /**
         * 失败
         * @param title
         * @returns {*}
         */
        this.msg_error = function (title) {
            return layer.msg(title, {icon: 2, shade: this.shade, scrollbar: false, time: 3000, shadeClose: true});
        };

        /**
         * 选项卡滚动
         */
        this.tabRoll = function () {
            $(window).on("resize", function (event) {
                var topTabsBox = $("#top_tabs_box"),
                    topTabsBoxWidth = $("#top_tabs_box").width(),
                    topTabs = $("#top_tabs"),
                    topTabsWidth = $("#top_tabs").width(),
                    tabLi = topTabs.find("li.layui-this"),
                    top_tabs = document.getElementById("top_tabs"),
                    event = event || window.event;

                if (topTabsWidth > topTabsBoxWidth) {
                    if (tabLi.position().left > topTabsBoxWidth || tabLi.position().left + topTabsBoxWidth > topTabsWidth) {
                        topTabs.css("left", topTabsBoxWidth - topTabsWidth);
                    } else {
                        topTabs.css("left", -tabLi.position().left);
                    }
                    //拖动效果
                    var flag = false;
                    var cur = {
                        x: 0,
                        y: 0
                    }
                    var nx, dx, x;

                    function down(event) {
                        flag = true;
                        var touch;
                        if (event.touches) {
                            touch = event.touches[0];
                        } else {
                            touch = event;
                        }
                        cur.x = touch.clientX;
                        dx = top_tabs.offsetLeft;
                    }

                    function move(event) {
                        var self = this;
                        if (flag) {
                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                            var touch;
                            if (event.touches) {
                                touch = event.touches[0];
                            } else {
                                touch = event;
                            }
                            nx = touch.clientX - cur.x;
                            x = dx + nx;
                            if (x > 0) {
                                x = 0;
                            } else {
                                if (x < topTabsBoxWidth - topTabsWidth) {
                                    x = topTabsBoxWidth - topTabsWidth;
                                } else {
                                    x = dx + nx;
                                }
                            }
                            top_tabs.style.left = x + "px";
                            //阻止页面的滑动默认事件
                            document.addEventListener("touchmove", function () {
                                event.preventDefault();
                            }, false);
                        }
                    }

                    //鼠标释放时候的函数
                    function end() {
                        flag = false;
                    }

                    //pc端拖动效果
                    topTabs.on("mousedown", down);
                    topTabs.on("mousemove", move);
                    $(document).on("mouseup", end);
                    //移动端拖动效果
                    topTabs.on("touchstart", down);
                    topTabs.on("touchmove", move);
                    topTabs.on("touchend", end);
                } else {
                    //移除pc端拖动效果
                    topTabs.off("mousedown", down);
                    topTabs.off("mousemove", move);
                    topTabs.off("mouseup", end);
                    //移除移动端拖动效果
                    topTabs.off("touchstart", down);
                    topTabs.off("touchmove", move);
                    topTabs.off("touchend", end);
                    topTabs.removeAttr("style");
                    return false;
                }
            }).resize();
        };


    };

    /**
     * 关闭选项卡
     **/
    $('body').on('click', '[data-tab-close]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        $parent = $(this).parent();
        tabId = $parent.attr('lay-id');
        if (tabId != undefined || tabId != null) {
            layuimini.delTab(tabId);
        }
        layuimini.tabRoll();
        layer.close(loading);
    });

    /**
     * 打开新窗口
     */
    $('body').on('click', '[data-tab]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        var tabId = $(this).attr('data-tab'),
            href = $(this).attr('data-tab'),
            title = $(this).html(),
            target = $(this).attr('target');
        if (target == '_blank') {
            layer.close(loading);
            window.open(href, "_blank");
            return false;
        }
        title = title.replace('style="display: none;"', '');

        // 拼接参数
        var menuParameId = $(this).attr('data-tab-mpi');
        if (href.indexOf("?") > -1) {
            href = href + '&mpi=' + menuParameId;
            tabId = href;
        } else {
            href = href + '?mpi=' + menuParameId;
            tabId = href;
        }

        // 判断链接是否有效
        var checkUrl = layuimini.checkUrl(href);
        if (checkUrl != true) {
            return layuimini.msg_error(checkUrl);
        }

        if (tabId == null || tabId == undefined) {
            tabId = new Date().getTime();
        }
        // 判断该窗口是否已经打开过
        var checkTab = layuimini.checkTab(tabId);
        if (!checkTab) {
            layuimini.addTab(tabId, href, title, true);
        }
        element.tabChange('layuiminiTab', tabId);
        layuimini.tabRoll();
        layer.close(loading);
    });

    /**
     * 左侧菜单的切换
     */
    $('body').on('click', '[data-menu]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        $parent = $(this).parent();
        menuId = $(this).attr('data-menu');
        // header
        $(".layui-nav-item.layui-this").removeClass('layui-this');
        $(this).addClass('layui-this');
        // left
        $(".layui-nav.layui-nav-tree.layui-this").addClass('layui-hide');
        $(".layui-nav.layui-nav-tree.layui-this.layui-hide").removeClass('layui-this');
        $("#" + menuId).removeClass('layui-hide');
        $("#" + menuId).addClass('layui-this');
        layer.close(loading);
    });

    /**
     * 清理
     */
    $('body').on('click', '[data-clear]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        sessionStorage.clear();

        // 判断是否清理服务端
        var clearInfo = window.clearInfo;
        if (clearInfo != undefined && clearInfo != '') {
            if (clearInfo.clearUrl != undefined && clearInfo.clearUrl != '') {
                $.getJSON(clearInfo.clearUrl, function (data, status) {
                    layer.close(loading);
                    if (data.code != 1) {
                        return layuimini.msg_error(data.msg);
                    } else {
                        return layuimini.msg_success(data.msg);
                    }
                }).fail(function () {
                    layer.close(loading);
                    return layuimini.msg_error('清理缓存接口有误');
                });
            }
        } else {
            layer.close(loading);
            return layuimini.msg_success('清除缓存成功');
        }
    });

    /**
     * 刷新
     */
    $('body').on('click', '[data-refresh]', function () {
        $(".layui-tab-item.layui-show").find("iframe")[0].contentWindow.location.reload();
        layuimini.msg_success('刷新成功');
    });

    /**
     * 选项卡操作
     */
    $('body').on('click', '[data-page-close]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        var closeType = $(this).attr('data-page-close');
        $(".layui-tab-title li").each(function () {
            tabId = $(this).attr('lay-id');
            var id = $(this).attr('id');
            if (id != 'layuiminiHomeTabId') {
                var tabClass = $(this).attr('class');
                if (closeType == 'all') {
                    layuimini.delTab(tabId);
                } else {
                    if (tabClass != 'layui-this') {
                        layuimini.delTab(tabId);
                    }
                }
            }
        });
        layuimini.tabRoll();
        layer.close(loading);
    });

    /**
     * 菜单栏缩放
     */
    $('body').on('click', '[data-side-fold]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        var isShow = $(this).attr('data-side-fold');
        $('.layui-nav-top li').attr('class', 'layui-nav-item');
        //选择出所有的span，并判断是不是hidden
        $('.layui-nav-item span').each(function () {
            if ($(this).attr('class') == 'layui-left-nav') {
                if (isShow == 1) {
                    $(this).attr('style', 'display: none;');
                } else {
                    $(this).attr('style', '');
                }
            }
        });
        //判断isshow的状态
        if (isShow == 1) {
            $('.layui-side.layui-bg-black').width(60); //设置宽度
            $('.layui-side-scroll.layui-left-menu').width(60);
            $('.layui-nav-top li i').css('margin-right', '90%');  //修改图标的位置
            //将footer和body的宽度修改
            $('.layui-body').css('left', 60 + 'px');
            $('.layui-footer').css('left', 60 + 'px');
            //将二级导航栏隐藏
            $('.layui-left-menu>.layui-nav-tree >dd >span').each(function () {
                $(this).hide();
            });
            //修改标志位
            $(this).attr('data-side-fold', 0);
            $('.layuimini-tool i').attr('class', 'fa fa-indent');
            if (!layuimini.checkMobile()) {
                $('.layui-layout-left').attr('style', 'left:155px!important;');
                $('.layuimini-tool').attr('style', 'left:95px!important;');
                $('.layui-logo').attr('style', 'width:60px!important;');
                $('.layui-logo h1').addClass('layui-hide');
            }
        } else {
            $('.layui-side.layui-bg-black').attr('style', ''); //设置宽度
            $('.layui-side-scroll.layui-left-menu').attr('style', '');
            $('.layui-nav-top li i').attr('style', '');   //修改图标的位置
            //将footer和body的宽度修改
            $('.layui-body').attr('style', '');
            $('.layui-footer').attr('style', '');
            $('.layui-left-menu>.layui-nav-tree> dd> span').each(function () {
                $(this).show();
            });
            $(this).attr('data-side-fold', 1);
            $('.layuimini-tool i').attr('class', 'fa fa-outdent');
            if (!layuimini.checkMobile()) {
                $('.layui-layout-left').attr('style', 'left:295px!important;');
                $('.layuimini-tool').attr('style', 'left:235px!important;');
                $('.layui-logo').attr('style', '');
                $('.layui-logo h1').removeClass('layui-hide');
            }
        }
        layuimini.tabRoll();
        element.init();
        layer.close(loading);
    });

    /**
     * 监听提示信息
     */
    $("body").on("mouseenter", ".layui-menu-tips", function () {
        var classInfo = $(this).attr('class'),
            tips = $(this).children('span').text(),
            isShow = $('.layuimini-tool i').attr('data-side-fold');
        if (isShow == 0) {
            openTips = layer.tips(tips, $(this), {tips: [1, '#1E9FFF'], time: 30000});
        }
    });
    $("body").on("mouseleave", ".layui-menu-tips", function () {
        var isShow = $('.layuimini-tool i').attr('data-side-fold');
        if (isShow == 0) {
            layer.close(openTips);
        }
    });

    exports("layuimini", layuimini);
});