/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini 单页框架扩展
 */
layui.define(["element", "jquery"], function (exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;


    var miniPage = {

        /**
         * 初始化tab
         * @param options
         */
        render: function (options) {
            options.homeInfo = options.homeInfo || {};
            options.multiModule = options.multiModule || false;
            options.listenSwichCallback = options.listenSwichCallback || function () {
            };
            var href = location.hash.replace(/^#\//, '');
            if (href === null || href === undefined || href === '') {
                miniPage.renderHome(options.homeInfo);
            } else {
                miniPage.renderPage(href, options.homeInfo.title);
                if (options.multiModule) {
                    miniPage.listenSwitchMultiModule(href);
                } else {
                    miniPage.listenSwitchSingleModule(href);
                }
            }
            miniPage.listen(options);
            miniPage.listenHash(options);
        },

        /**
         * 初始化主页
         * @param options
         */
        renderHome: function (options) {
            $('.layuimini-page-header').addClass('layui-hide');
            miniPage.renderPageContent(options.href);
        },

        /**
         * 初始化页面
         * @param href
         */
        renderPage: function (href, homeTitle) {
            miniPage.renderPageTitle(href, homeTitle);
            miniPage.renderPageContent(href);
        },

        /**
         * 初始化页面标题
         * @param href
         * @param homeTitle
         */
        renderPageTitle: function (href, homeTitle) {
            var pageTitleHtml = '<a lay-href="" href="javascript:;" class="layuimini-back-home">' + homeTitle + '</a><span lay-separator="">/</span>\n' +
                '<a><cite>常规管理</cite></a><span lay-separator="">/</span>\n' +
                '<a><cite>系统设置</cite></a>';
            $('.layuimini-page-header').removeClass('layui-hide');
            $('.layuimini-page-header .layuimini-page-title').empty().html(pageTitleHtml);
        },

        /**
         * 初始化页面内容
         * @param href
         */
        renderPageContent: function (href) {
            var container = '.layuimini-content-page';
            var v = new Date().getTime();
            $(container).html('');
            $.ajax({
                url: href.indexOf("?") > -1 ? href + '&v=' + v : href + '?v=' + v,
                type: 'get',
                dataType: 'html',
                success: function (data) {
                    $(container).html(data);
                    element.init();
                },
                error: function (xhr, textstatus, thrown) {
                    return layer.msg('Status:' + xhr.status + '，' + xhr.statusText + '，请稍后再试！');
                }
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
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-this') === false) {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        } else {
                            $element.addClass('layui-nav-itemed');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-nav-itemed') === false) {
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
         * 修改hash地址定位
         * @param href
         */
        hashChange: function (href) {
            window.location.hash = "/" + href;
        },

        /**
         * 监听
         * @param options
         */
        listen: function (options) {

            /**
             * 打开新窗口
             */
            $('body').on('click', '[layuimini-href]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var href = $(this).attr('layuimini-href'),
                    target = $(this).attr('target');
                if (target === '_blank') {
                    layer.close(loading);
                    window.open(href, "_blank");
                    return false;
                }
                miniPage.hashChange(href);
                $('.layuimini-menu-left').attr('layuimini-page-add', 'yes');
                layer.close(loading);
            });

            /**
             * 在iframe子菜单上打开新窗口
             */
            $('body').on('click', '[layuimini-content-href]', function () {
                var loading = parent.layer.load(0, {shade: false, time: 2 * 1000});
                var href = $(this).attr('layuimini-content-href'),
                    target = $(this).attr('target');
                if (target === '_blank') {
                    parent.layer.close(loading);
                    window.open(href, "_blank");
                    return false;
                }
                miniPage.hashChange(href);
                parent.layer.close(loading);
            });

            /**
             * 返回主页
             */
            $('body').on('click', '.layuimini-back-home', function () {
                window.location.hash = '/';
            });


        },


        /**
         * 监听hash变化
         * @returns {boolean}
         */
        listenHash: function (options) {
            options.multiModule = options.multiModule || false;
            options.listenSwichCallback = options.listenSwichCallback || function () {
            };
            window.onhashchange = function () {
                var href = location.hash.replace(/^#\//, '');
                if (typeof options.listenSwichCallback === 'function') {
                    options.listenSwichCallback();
                }
                if (href === null || href === undefined || href === '') {
                    $("[layuimini-href]").parent().removeClass('layui-this');
                    miniPage.renderHome(options.homeInfo);
                } else {
                    miniPage.renderPage(href, options.homeInfo.title);
                }
                if ($('.layuimini-menu-left').attr('layuimini-page-add') === 'yes') {
                    $('.layuimini-menu-left').attr('layuimini-page-add', 'no');
                } else {
                    // 从页面中打开的话，需要重新定位菜单焦点
                    if (options.multiModule) {
                        miniPage.listenSwitchMultiModule(href);
                    } else {
                        miniPage.listenSwitchSingleModule(href);
                    }
                }
            };
        },


    };

    exports("miniPage", miniPage);
});