/**
 * date:2019/06/10
 * author:Mr.Chung
 * description:layuimini 框架扩展
 */

layui.define(["element", "jquery", "layer"], function (exports) {
        var element = layui.element,
            $ = layui.$,
            layer = layui.layer;

        // 判断是否在web容器中打开
        if (!/http(s*):\/\//.test(location.href)) {
            return layer.alert("请先将项目部署至web容器（Apache/Tomcat/Nginx/IIS/等），否则部分数据将无法显示");
        }

        layuimini = new function () {

            /**
             *  系统配置
             * @param name
             * @returns {{BgColorDefault: number, urlSuffixDefault: boolean}|*}
             */
            this.config = function (name) {

                var config = {
                    urlHashLocation: true,   // URL地址hash定位
                    urlSuffixDefault: false, // URL后缀
                    BgColorDefault: 0       // 默认皮肤（0开始）
                };

                if (name == undefined) {
                    return config;
                } else {
                    return config[name];
                }
            };

            /**
             * 初始化
             * @param url
             */
            this.init = function (url) {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                layuimini.initBgColor();
                layuimini.initDevice();
                $.getJSON(url, function (data, status) {
                    if (data == null) {
                        layuimini.msg_error('暂无菜单信息');
                    } else {
                        layuimini.initHome(data.homeInfo);
                        layuimini.initLogo(data.logoInfo);
                        layuimini.initClear(data.clearInfo);
                        layuimini.initMenu(data.menuInfo);
                        layuimini.initPage();
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
                    $('.layuimini-tool i').attr('data-side-fold', 0);
                    $('.layuimini-tool i').attr('class', 'fa fa-indent');
                    $('.layui-layout-body').attr('class', 'layui-layout-body layuimini-mini');
                }
            };

            /**
             * 初始化首页信息
             * @param data
             */
            this.initHome = function (data) {
                var localhostHref = window.location.href;
                if (!localhostHref.match(RegExp(/#/))) {
                    layuimini.initConten(data.href, false);
                }
            };

            /**
             * 初始化logo信息
             * @param data
             */
            this.initLogo = function (data) {
                var html = '<a href="' + data.href + '">\n' +
                    '<img src="' + data.image + '" alt="logo">\n' +
                    '<h1>' + data.title + '</h1>\n' +
                    '</a>';
                $('.layui-layout-admin .layui-logo').html(html);
            };

            /**
             * 初始化页面标题，并自动展开菜单栏
             * @param href 链接地址
             * @param title 页面标题
             */
            this.initPageTitle = function (href, title) {
                window.pageHeader = (title == undefined || title == '' || title == null) ? [] : [title];
                $("[data-one-page]").each(function () {
                    if ($(this).attr("data-one-page") == href) {
                        var addMenuClass = function ($element, type) {
                            if (type == 1) {
                                $element.addClass('layui-this');
                                if (title == undefined || title == '' || title == null) {
                                    var thisPageTitle = $element.text();
                                    thisPageTitle = thisPageTitle.replace(/\s+/g, "");
                                    pageHeader.push(thisPageTitle);
                                }
                                if ($element.attr('class') != 'layui-nav-item layui-this') {
                                    addMenuClass($element.parent().parent(), 2);
                                } else {
                                    var moduleId = $element.parent().attr('id');
                                    var moduleTile = $("#" + moduleId + "HeaderId").text();
                                    moduleTile = moduleTile.replace(/\s+/g, "");
                                    pageHeader.push(moduleTile);
                                    $(".layui-header-menu li").attr('class', 'layui-nav-item');
                                    $("#" + moduleId + "HeaderId").addClass("layui-this");
                                    $(".layui-left-nav-tree").attr('class', 'layui-nav layui-nav-tree layui-hide');
                                    $("#" + moduleId).attr('class', 'layui-nav layui-nav-tree layui-this');
                                }
                            } else {
                                $element.addClass('layui-nav-itemed');
                                var parentTitle = $element.text();
                                parentTitle = parentTitle.replace(/^\s+|\s+$/g, "").split('\n');
                                pageHeader.push(parentTitle[0]);
                                if ($element.attr('class') != 'layui-nav-item layui-nav-itemed') {
                                    addMenuClass($element.parent().parent(), 2);
                                } else {
                                    var moduleId = $element.parent().attr('id');
                                    var moduleTile = $("#" + moduleId + "HeaderId").text();
                                    moduleTile = moduleTile.replace(/\s+/g, "");
                                    pageHeader.push(moduleTile);
                                    $(".layui-header-menu li").attr('class', 'layui-nav-item');
                                    $("#" + moduleId + "HeaderId").addClass("layui-this");
                                    $(".layui-left-nav-tree").attr('class', 'layui-nav layui-nav-tree layui-hide');
                                    $("#" + moduleId).attr('class', 'layui-nav layui-nav-tree layui-this');
                                }
                            }
                        };
                        addMenuClass($(this).parent(), 1);
                        var pageHeaderHtml = '<a lay-href href="/">主页</a><span lay-separator="">/</span>\n';
                        for (var i = pageHeader.length - 1; i >= 0; i--) {
                            pageHeader[i] = pageHeader[i].replace(/\s+/g, "");
                            if (i != 0) {
                                pageHeaderHtml += '<a><cite>' + pageHeader[i] + '</cite></a><span lay-separator="">/</span>\n';
                            } else {
                                pageHeaderHtml += '<a><cite>' + pageHeader[i] + '</cite></a>\n';
                            }
                        }
                        $('.layuimini-page-header').removeClass('layui-hide');
                        $('#layuimini-page-header').empty().html(pageHeaderHtml);
                        return false;
                    }
                });
            };

            /**
             * 初始化选项卡
             */
            this.initPage = function () {
                var locationHref = window.location.href;
                var urlArr = locationHref.split("#/");
                if (urlArr.length >= 2) {
                    var href = urlArr.pop();
                    layuimini.initConten(href);
                    layuimini.initPageTitle(href);
                }
            };

            /**
             * 初始化内容信息
             * @param container
             * @param href
             * @param isHash
             */
            this.initConten = function (href, isHash) {
                var container = '.layuimini-content-page';
                var v = new Date().getTime();
                $(container).html('');
                $.ajax({
                    url: href.indexOf("?") > -1 ? href + '&v=' + v : href + '?v=' + v,
                    type: 'get',
                    dataType: 'html',
                    success: function (data) {
                        if (isHash == undefined || isHash == true) {
                            window.location.hash = "/" + href;
                        }
                        $(container).html(data);
                    },
                    error: function (xhr, textstatus, thrown) {
                        return layuimini.msg_error('Status:' + xhr.status + '，' + xhr.statusText + '，请稍后再试！');
                    }
                });
            };

            /**
             * 初始化清理缓存
             * @param data
             */
            this.initClear = function (data) {
                $('.layuimini-clear').attr('data-href', data.clearUrl);
            };

            /**
             * 初始化背景色
             */
            this.initBgColor = function () {
                var bgcolorId = sessionStorage.getItem('layuiminiBgcolorId');
                if (bgcolorId == null || bgcolorId == undefined || bgcolorId == '') {
                    bgcolorId = layuimini.config('BgColorDefault');
                }
                var bgcolorData = layuimini.bgColorConfig(bgcolorId);
                var styleHtml = '.layui-layout-admin .layui-header{background-color:' + bgcolorData.headerRight + '!important;}\n' +
                    '.layui-header>ul>.layui-nav-item.layui-this,.layuimini-tool i:hover{background-color:' + bgcolorData.headerRightThis + '!important;}\n' +
                    '.layui-layout-admin .layui-logo {background-color:' + bgcolorData.headerLogo + '!important;}\n' +
                    '.layui-side.layui-bg-black,.layui-side.layui-bg-black>.layui-left-menu>ul {background-color:' + bgcolorData.menuLeft + '!important;}\n' +
                    '.layui-left-menu .layui-nav .layui-nav-child a:hover:not(.layui-this) {background-color:' + bgcolorData.menuLeftHover + ';}\n' +
                    '.layui-layout-admin .layui-nav-tree .layui-this, .layui-layout-admin .layui-nav-tree .layui-this>a, .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this, .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a {\n' +
                    'background-color: ' + bgcolorData.menuLeftThis + ' !important;\n' +
                    '}';
                $('#layuimini-bg-color').html(styleHtml);
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
                                        html += '<a href="javascript:;" class="layui-menu-tips" data-type="tabAdd"  data-one-page-mpi="m-p-i-' + menuParameId + '" data-one-page="' + childMenu.href + '" target="' + childMenu.target + '"><i class="' + childMenu.icon + '"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>\n';
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
                            leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips"  data-type="tabAdd" data-one-page-mpi="m-p-i-' + menuParameId + '" data-one-page="' + menu.href + '" target="' + menu.target + '"><i class="' + menu.icon + '"></i><span class="layui-left-nav"> ' + menu.title + '</span></a>\n';
                            menuParameId++;
                        }
                        leftMenuHtml += '</li>\n';
                    });
                    leftMenuHtml += '</ul>\n';
                    headerMenuCheckDefault = '';
                    leftMenuCheckDefault = 'layui-hide';
                });
                $('.layui-header-pc-menu').html(headerMenuHtml); //电脑
                $('.layui-header-mini-menu').html(headerMobileMenuHtml); //手机
                $('.layui-left-menu').html(leftMenuHtml);
                element.init();
            };

            /**
             * 配色方案配置项(默认选中第一个方案)
             * @param bgcolorId
             */
            this.bgColorConfig = function (bgcolorId) {
                var bgColorConfig = [
                    {
                        headerRight: '#1aa094',
                        headerRightThis: '#197971',
                        headerLogo: '#243346',
                        menuLeft: '#2f4056',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#23262e',
                        headerRightThis: '#0c0c0c',
                        headerLogo: '#0c0c0c',
                        menuLeft: '#23262e',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#ffa4d1',
                        headerRightThis: '#bf7b9d',
                        headerLogo: '#e694bd',
                        menuLeft: '#1f1f1f',
                        menuLeftThis: '#ffa4d1',
                        menuLeftHover: '#1f1f1f',
                    },
                    {
                        headerRight: '#1aa094',
                        headerRightThis: '#197971',
                        headerLogo: '#0c0c0c',
                        menuLeft: '#23262e',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#1e9fff',
                        headerRightThis: '#0069b7',
                        headerLogo: '#0c0c0c',
                        menuLeft: '#1f1f1f',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },

                    {
                        headerRight: '#ffb800',
                        headerRightThis: '#d09600',
                        headerLogo: '#243346',
                        menuLeft: '#2f4056',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#e82121',
                        headerRightThis: '#ae1919',
                        headerLogo: '#0c0c0c',
                        menuLeft: '#1f1f1f',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#963885',
                        headerRightThis: '#772c6a',
                        headerLogo: '#243346',
                        menuLeft: '#2f4056',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#1e9fff',
                        headerRightThis: '#0069b7',
                        headerLogo: '#0069b7',
                        menuLeft: '#1f1f1f',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#ffb800',
                        headerRightThis: '#d09600',
                        headerLogo: '#d09600',
                        menuLeft: '#2f4056',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#e82121',
                        headerRightThis: '#ae1919',
                        headerLogo: '#d91f1f',
                        menuLeft: '#1f1f1f',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    },
                    {
                        headerRight: '#963885',
                        headerRightThis: '#772c6a',
                        headerLogo: '#772c6a',
                        menuLeft: '#2f4056',
                        menuLeftThis: '#1aa094',
                        menuLeftHover: '#3b3f4b',
                    }
                ];

                if (bgcolorId == undefined) {
                    return bgColorConfig;
                } else {
                    return bgColorConfig[bgcolorId];
                }
            };

            /**
             * 构建背景颜色选择
             * @returns {string}
             */
            this.buildBgColorHtml = function () {
                var html = '';
                var bgcolorId = sessionStorage.getItem('layuiminiBgcolorId');
                if (bgcolorId == null || bgcolorId == undefined || bgcolorId == '') {
                    bgcolorId = 0;
                }
                var bgColorConfig = layuimini.bgColorConfig();
                $.each(bgColorConfig, function (key, val) {
                    if (key == bgcolorId) {
                        html += '<li class="layui-this" data-select-bgcolor="' + key + '">\n';
                    } else {
                        html += '<li  data-select-bgcolor="' + key + '">\n';
                    }
                    html += '<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">\n' +
                        '<div><span style="display:block; width: 20%; float: left; height: 12px; background: ' + val.headerLogo + ';"></span><span style="display:block; width: 80%; float: left; height: 12px; background: ' + val.headerRight + ';"></span></div>\n' +
                        '<div><span style="display:block; width: 20%; float: left; height: 40px; background: ' + val.menuLeft + ';"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>\n' +
                        '</a>\n' +
                        '</li>';
                });
                return html;
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
                var clientWidth = document.documentElement.clientWidth;
                if (!isAndroid && !isIOS && !isWinPhone && clientWidth > 768) {
                    return false;
                } else {
                    return true;
                }
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

        };

        /**
         * 打开新窗口
         */
        $('body').on('click', '[data-one-page]', function () {
            var loading = layer.load(0, {shade: false, time: 2 * 1000});
            var href = $(this).attr('data-one-page'),
                title = $(this).text(),
                target = $(this).attr('target');
            if (target == '_blank') {
                layer.close(loading);
                window.open(href, "_blank");
                return false;
            }
            layuimini.initPageTitle(href, title);
            layuimini.initConten(href);
            layuimini.initDevice();
            layer.close(loading);
        });

        /**
         * 在页面中打开
         */
        $('body').on('click', '[data-content-href]', function () {
            var loading = layer.load(0, {shade: false, time: 2 * 1000});
            var href = $(this).attr('data-content-href'),
                title = $(this).attr('data-title'),
                target = $(this).attr('target');
            if (target == '_blank') {
                layer.close(loading);
                window.open(href, "_blank");
                return false;
            }
            layuimini.initPageTitle(href, title);
            layuimini.initConten(href);
            layuimini.initDevice();
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
            $(".layui-header-menu .layui-nav-item.layui-this").removeClass('layui-this');
            $(this).addClass('layui-this');
            // left
            $(".layui-left-menu .layui-nav.layui-nav-tree.layui-this").addClass('layui-hide');
            $(".layui-left-menu .layui-nav.layui-nav-tree.layui-this.layui-hide").removeClass('layui-this');
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
            var clearUrl = $(this).attr('data-href');
            if (clearUrl != undefined && clearUrl != '' && clearUrl != null) {
                $.getJSON(clearUrl, function (data, status) {
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
            } else {
                layer.close(loading);
                return layuimini.msg_success('清除缓存成功');
            }
        });

        /**
         * 刷新
         */
        $('body').on('click', '[data-refresh]', function () {
            var loading = layer.load(0, {shade: false, time: 2 * 1000});
            var locationHref = window.location.href;
            var urlArr = locationHref.split("#/");
            if (urlArr.length >= 2) {
                var href = urlArr.pop();
                layuimini.initConten(href);
            }
            layer.close(loading);
            layuimini.msg_success('刷新成功');
        });

        /**
         * 菜单栏缩放
         */
        $('body').on('click', '[data-side-fold]', function () {
            var loading = layer.load(0, {shade: false, time: 2 * 1000});
            var isShow = $(this).attr('data-side-fold');
            if (isShow == 1) { // 缩放
                $(this).attr('data-side-fold', 0);
                $('.layuimini-tool i').attr('class', 'fa fa-indent');
                $('.layui-layout-body').attr('class', 'layui-layout-body layuimini-mini');
            } else { // 正常
                $(this).attr('data-side-fold', 1);
                $('.layuimini-tool i').attr('class', 'fa fa-outdent');
                $('.layui-layout-body').attr('class', 'layui-layout-body layuimini-all');
            }

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
                openTips = layer.tips(tips, $(this), {tips: [2, '#2f4056'], time: 30000});
            }
        });
        $("body").on("mouseleave", ".layui-menu-tips", function () {
            var isShow = $('.layuimini-tool i').attr('data-side-fold');
            if (isShow == 0) {
                try {
                    layer.close(openTips);
                } catch (e) {
                    console.log(e.message);
                }
            }
        });

        /**
         * 弹出配色方案
         */
        $('body').on('click', '[data-bgcolor]', function () {
            var loading = layer.load(0, {shade: false, time: 2 * 1000});
            var clientHeight = (document.documentElement.clientHeight) - 95;
            var bgColorHtml = layuimini.buildBgColorHtml();
            var html = '<div class="layuimini-color">\n' +
                '<div class="color-title">\n' +
                '<span>配色方案</span>\n' +
                '</div>\n' +
                '<div class="color-content">\n' +
                '<ul>\n' + bgColorHtml + '</ul>\n' +
                '</div>\n' +
                '</div>';
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shade: 0.2,
                anim: 2,
                shadeClose: true,
                id: 'layuiminiBgColor',
                area: ['340px', clientHeight + 'px'],
                offset: 'rb',
                content: html,
            });
            layer.close(loading);
        });

        /**
         * 选择配色方案
         */
        $('body').on('click', '[data-select-bgcolor]', function () {
            var bgcolorId = $(this).attr('data-select-bgcolor');
            $('.layuimini-color .color-content ul .layui-this').attr('class', '');
            $(this).attr('class', 'layui-this');
            sessionStorage.setItem('layuiminiBgcolorId', bgcolorId);
            layuimini.initBgColor();
        });

        exports("layuimini", layuimini);
    }
);
