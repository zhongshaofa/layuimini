/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini tab框架扩展
 */
layui.define(["element", "jquery"], function (exports) {
    var element = layui.element,
        $ = layui.$;


    var miniTab = {

        /**
         * 初始化tab
         * @param options
         */
        render: function (options) {
            options.filter = options.filter || null;
            options.multiModule = options.multiModule || false;
            options.urlHashLocation = options.urlHashLocation || false;
            options.maxTabNum = options.maxTabNum || 20;
            options.listenSwichCallback = options.listenSwichCallback || function () {
            };
            miniTab.listen(options);
            miniTab.listenRoll();
            miniTab.listenSwitch(options);
            miniTab.listenHash(options);
        },

        /**
         * 新建tab窗口
         * @param options.tabId
         * @param options.href
         * @param options.title
         * @param options.addSession
         * @param options.isIframe
         * @param options.maxTabNum
         */
        create: function (options) {
            options.tabId = options.tabId || null;
            options.href = options.href || null;
            options.title = options.title || null;
            options.addSession = options.addSession || undefined;
            options.isIframe = options.isIframe || false;
            options.maxTabNum = options.maxTabNum || 20;
            if ($(".layuimini-tab .layui-tab-title li").length >= options.maxTabNum) {
                layer.msg('Tab窗口已达到限定数量，请先关闭部分Tab');
                return false;
            }
            if (options.addSession === undefined || options.addSession === true) {
                var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("layuiminiTabInfo"));
                if (layuiminiTabInfo == null) layuiminiTabInfo = {};
                layuiminiTabInfo[options.tabId] = {href: options.href, title: options.title};
                sessionStorage.setItem("layuiminiTabInfo", JSON.stringify(layuiminiTabInfo));
            }
            var ele = element;
            if (options.isIframe) ele = parent.layui.element;
            ele.tabAdd('layuiminiTab', {
                title: '<span class="layuimini-tab-active"></span><span>' + options.title + '</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>' //用于演示
                , content: '<iframe width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0"   src="' + options.href + '"></iframe>'
                , id: options.tabId
            });
            $('.layuimini-menu-left').attr('layuimini-tab-tag', 'add');
        },

        /**
         * 刷新tab窗口
         */
        refresh: function () {

        },

        /**
         * 切换选项卡
         * @param tabId
         */
        change: function (tabId) {
            element.tabChange('layuiminiTab', tabId);
        },

        /**
         * 删除tab窗口
         * @param tabId
         * @param isParent
         */
        delete: function (tabId, isParent) {
            var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("layuiminiTabInfo"));
            if (layuiminiTabInfo != null) {
                delete layuiminiTabInfo[tabId];
                sessionStorage.setItem("layuiminiTabInfo", JSON.stringify(layuiminiTabInfo))
            }

            // todo 未知BUG，不知道是不是layui问题，必须先删除元素
            $(".layuimini-tab .layui-tab-title .layui-unselect.layui-tab-bar").remove();

            if (isParent === true) {
                parent.layui.element.tabDelete('layuiminiTab', tabId);
            } else {
                element.tabDelete('layuiminiTab', tabId);
            }
        },

        /**
         * 在iframe层关闭当前tab方法
         */
        deleteCurrentByIframe: function () {
            var ele = $(".layuimini-tab .layui-tab-title li.layui-this", parent.document);
            if (ele.length > 0) {
                var layId = $(ele[0]).attr('lay-id');
                miniTab.delete(layId, true);
            }
        },

        /**
         * 判断tab窗口
         */
        check: function (tabId, isIframe) {
            // 判断选项卡上是否有
            var checkTab = false;
            if (isIframe === undefined || isIframe === false) {
                $(".layui-tab-title li").each(function () {
                    var checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId === tabId) {
                        checkTab = true;
                    }
                });
            } else {
                parent.layui.$(".layui-tab-title li").each(function () {
                    var checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId === tabId) {
                        checkTab = true;
                    }
                });
            }
            if (checkTab === false) {
                return false;
            }

            // 判断sessionStorage是否有
            var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("layuiminiTabInfo"));
            if (layuiminiTabInfo == null) {
                layuiminiTabInfo = {};
            }
            var check = layuiminiTabInfo[tabId];
            if (check === undefined || check === null) {
                return false;
            }
            return true;
        },

        /**
         * 开启tab右键菜单
         * @param tabId
         * @param left
         */
        openTabRignMenu: function (tabId, left) {
            miniTab.closeTabRignMenu();
            var menuHtml = '<div class="layui-unselect layui-form-select layui-form-selected layuimini-tab-mousedown layui-show" data-tab-id="' + tabId + '" style="left: ' + left + 'px!important">\n' +
                '<dl>\n' +
                '<dd><a href="javascript:;" layuimini-tab-menu-close="current">关 闭 当 前</a></dd>\n' +
                '<dd><a href="javascript:;" layuimini-tab-menu-close="other">关 闭 其 他</a></dd>\n' +
                '<dd><a href="javascript:;" layuimini-tab-menu-close="all">关 闭 全 部</a></dd>\n' +
                '</dl>\n' +
                '</div>';
            var makeHtml = '<div class="layuimini-tab-make"></div>';
            $('.layuimini-tab .layui-tab-title').after(menuHtml);
            $('.layuimini-tab .layui-tab-content').after(makeHtml);
        },

        /**
         * 关闭tab右键菜单
         */
        closeTabRignMenu: function () {
            $('.layuimini-tab-mousedown').remove();
            $('.layuimini-tab-make').remove();
        },

        /**
         * 监听
         * @param options
         */
        listen: function (options) {
            options = options || {};
            options.maxTabNum = options.maxTabNum || 20;

            /**
             * 打开新窗口
             */
            $('body').on('click', '[layuimini-href]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var tabId = $(this).attr('layuimini-href'),
                    href = $(this).attr('layuimini-href'),
                    title = $(this).text(),
                    target = $(this).attr('target');
                if (target === '_blank') {
                    layer.close(loading);
                    window.open(href, "_blank");
                    return false;
                }
                if (tabId === null || tabId === undefined) tabId = new Date().getTime();
                var checkTab = miniTab.check(tabId);
                if (!checkTab) {
                    miniTab.create({
                        tabId: tabId,
                        href: href,
                        title: title,
                        addSession: true,
                        isIframe: false,
                        maxTabNum: options.maxTabNum,
                    });
                }
                element.tabChange('layuiminiTab', tabId);
                layer.close(loading);
            });

            /**
             * 在iframe子菜单上打开新窗口
             */
            $('body').on('click', '[layuimini-content-href]', function () {
                var loading = parent.layer.load(0, {shade: false, time: 2 * 1000});
                var tabId = $(this).attr('layuimini-content-href'),
                    href = $(this).attr('layuimini-content-href'),
                    title = $(this).attr('data-title'),
                    target = $(this).attr('target');
                if (target === '_blank') {
                    parent.layer.close(loading);
                    window.open(href, "_blank");
                    return false;
                }
                if (tabId === null || tabId === undefined) tabId = new Date().getTime();
                var checkTab = miniTab.check(tabId, true);
                if (!checkTab) {
                    miniTab.create({
                        tabId: tabId,
                        href: href,
                        title: title,
                        addSession: true,
                        isIframe: true,
                        maxTabNum: options.maxTabNum,
                    });
                }
                parent.layui.element.tabChange('layuiminiTab', tabId);
                parent.layer.close(loading);
            });

            /**
             * 关闭选项卡
             **/
            $('body').on('click', '.layuimini-tab .layui-tab-title .layui-tab-close', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var $parent = $(this).parent();
                var tabId = $parent.attr('lay-id');
                if (tabId !== undefined || tabId !== null) {
                    miniTab.delete(tabId);
                }
                layer.close(loading);
            });

            /**
             * 选项卡操作
             */
            $('body').on('click', '[layuimini-tab-close]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var closeType = $(this).attr('layuimini-tab-close');
                $(".layuimini-tab .layui-tab-title li").each(function () {
                    var tabId = $(this).attr('lay-id');
                    var id = $(this).attr('id');
                    var isCurrent = $(this).hasClass('layui-this');
                    if (id !== 'layuiminiHomeTabId') {
                        if (closeType === 'all') {
                            miniTab.delete(tabId);
                        } else {
                            if (closeType === 'current' && isCurrent) {
                                miniTab.delete(tabId);
                            } else if (closeType === 'other' && !isCurrent) {
                                miniTab.delete(tabId);
                            }
                        }
                    }
                });
                layer.close(loading);
            });

            /**
             * 禁用网页右键
             */
            $(".layuimini-tab .layui-tab-title").unbind("mousedown").bind("contextmenu", function (e) {
                e.preventDefault();
                return false;
            });

            /**
             * 注册鼠标右键
             */
            $('body').on('mousedown', '.layuimini-tab .layui-tab-title li', function (e) {
                var left = $(this).offset().left - $('.layuimini-tab ').offset().left + ($(this).width() / 2),
                    tabId = $(this).attr('lay-id');
                if (e.which === 3) {
                    miniTab.openTabRignMenu(tabId, left);
                }
            });

            /**
             * 关闭tab右键菜单
             */
            $('body').on('click', '.layui-body,.layui-header,.layuimini-menu-left,.layuimini-tab-make', function () {
                miniTab.closeTabRignMenu();
            });

            /**
             * tab右键选项卡操作
             */
            $('body').on('click', '[layuimini-tab-menu-close]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var closeType = $(this).attr('layuimini-tab-menu-close'),
                    currentTabId = $('.layuimini-tab-mousedown').attr('data-tab-id');
                $(".layuimini-tab .layui-tab-title li").each(function () {
                    var tabId = $(this).attr('lay-id');
                    var id = $(this).attr('id');
                    if (id !== 'layuiminiHomeTabId') {
                        if (closeType === 'all') {
                            miniTab.delete(tabId);
                        } else {
                            if (closeType === 'current' && currentTabId === tabId) {
                                miniTab.delete(tabId);
                            } else if (closeType === 'other' && currentTabId !== tabId) {
                                miniTab.delete(tabId);
                            }
                        }
                    }
                });
                miniTab.closeTabRignMenu();
                layer.close(loading);
            });


        },

        /**
         * 监听tab切换
         * @param options
         */
        listenSwitch: function (options) {
            options.filter = options.filter || null;
            options.multiModule = options.multiModule || false;
            options.urlHashLocation = options.urlHashLocation || false;
            options.listenSwichCallback = options.listenSwichCallback || function () {

            };
            element.on('tab(' + options.filter + ')', function (data) {
                var tabId = $(this).attr('lay-id');
                if (options.urlHashLocation) {
                    location.hash = '/' + tabId;
                }
                if (typeof options.listenSwichCallback === 'function') {
                    options.listenSwichCallback();
                }
                // 判断是否为新增窗口
                if ($('.layuimini-menu-left').attr('layuimini-tab-tag') === 'add') {
                    $('.layuimini-menu-left').attr('layuimini-tab-tag', 'no')
                } else {
                    $("[layuimini-href]").parent().removeClass('layui-this');
                    if (options.multiModule) {
                        miniTab.listenSwitchMultiModule(tabId);
                    } else {
                        miniTab.listenSwitchSingleModule(tabId);
                    }
                }
                miniTab.rollPosition();
            });
        },

        /**
         * 监听hash变化
         * @param options
         * @returns {boolean}
         */
        listenHash: function (options) {
            options.urlHashLocation = options.urlHashLocation || false;
            options.maxTabNum = options.maxTabNum || 20;
            if (!options.urlHashLocation) return false;
            var tabId = location.hash.replace(/^#\//, '');
            if (tabId === null || tabId === undefined) return false;
            $("[layuimini-href]").each(function () {
                if ($(this).attr("layuimini-href") === tabId) {
                    var title = $(this).text();
                    miniTab.create({
                        tabId: tabId,
                        href: tabId,
                        title: title,
                        addSession: true,
                        isIframe: false,
                        maxTabNum: options.maxTabNum,
                    });
                    $('.layuimini-menu-left').attr('layuimini-tab-tag', 'no');
                    element.tabChange('layuiminiTab', tabId);
                    return false;
                }
            });
        },

        /**
         * 监听滚动
         */
        listenRoll: function () {
            $(".layuimini-tab-roll-left").click(function () {
                miniTab.rollClick("left");
            });
            $(".layuimini-tab-roll-right").click(function () {
                miniTab.rollClick("right");
            });
        },

        /**
         * 单模块切换
         * @param tabId
         */
        listenSwitchSingleModule: function (tabId) {
            $("[layuimini-href]").each(function () {
                if ($(this).attr("layuimini-href") === tabId) {
                    // 自动展开菜单栏
                    var addMenuClass = function ($element, type) {
                        if (type === 1) {
                            $element.addClass('layui-this');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-this')) {
                                $(".layuimini-header-menu li").attr('class', 'layui-nav-item');
                            } else {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        } else {
                            $element.addClass('layui-nav-itemed');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-nav-itemed')) {
                                $(".layuimini-header-menu li").attr('class', 'layui-nav-item');
                            } else {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        }
                    };
                    addMenuClass($(this).parent(), 1);
                    return false;
                }
            });
        },

        /**
         * 多模块切换
         * @param tabId
         */
        listenSwitchMultiModule: function (tabId) {
            $("[layuimini-href]").each(function () {
                if ($(this).attr("layuimini-href") === tabId) {

                    // 自动展开菜单栏
                    var addMenuClass = function ($element, type) {
                        if (type === 1) {
                            $element.addClass('layui-this');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-this')) {
                                var moduleId = $element.parent().attr('id');
                                $(".layuimini-header-menu li").attr('class', 'layui-nav-item');
                                $("#" + moduleId + "HeaderId").addClass("layui-this");
                                $(".layuimini-menu-left .layui-nav.layui-nav-tree").attr('class', 'layui-nav layui-nav-tree layui-hide');
                                $("#" + moduleId).attr('class', 'layui-nav layui-nav-tree layui-this');
                            } else {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        } else {
                            $element.addClass('layui-nav-itemed');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-nav-itemed')) {
                                var moduleId = $element.parent().attr('id');
                                $(".layuimini-header-menu li").attr('class', 'layui-nav-item');
                                $("#" + moduleId + "HeaderId").addClass("layui-this");
                                $(".layuimini-menu-left .layui-nav.layui-nav-tree").attr('class', 'layui-nav layui-nav-tree layui-hide');
                                $("#" + moduleId).attr('class', 'layui-nav layui-nav-tree layui-this');
                            } else {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        }
                    };
                    addMenuClass($(this).parent(), 1);
                    return false;
                }
            });
        },

        /**
         * 自动定位
         */
        rollPosition: function () {
            var $tabTitle = $('.layuimini-tab  .layui-tab-title');
            var autoLeft = 0;
            $tabTitle.children("li").each(function () {
                if ($(this).hasClass('layui-this')) {
                    return false;
                } else {
                    autoLeft += $(this).outerWidth();
                }
            });
            $tabTitle.animate({
                scrollLeft: autoLeft - $tabTitle.width() / 3
            }, 200);
        },

        /**
         * 点击滚动
         * @param direction
         */
        rollClick: function (direction) {
            var $tabTitle = $('.layuimini-tab  .layui-tab-title');
            var left = $tabTitle.scrollLeft();
            if ('left' === direction) {
                $tabTitle.animate({
                    scrollLeft: left - 450
                }, 200);
            } else {
                $tabTitle.animate({
                    scrollLeft: left + 450
                }, 200);
            }
        }

    };

    exports("miniTab", miniTab);
});