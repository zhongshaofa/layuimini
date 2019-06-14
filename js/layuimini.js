layui.define(["element", "jquery"], function (exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;

    // 判断是否在web容器中打开
    if (!/http(s*):\/\//.test(location.href)) {
        return layer.alert("请先将项目部署至web容器（Apache/Tomcat/Nginx/IIS/等），否则部分数据将无法显示");
    }

    layuimini = new function () {

        /**
         * 初始化
         * @param url
         */
        this.init = function (url) {
            var loading = layer.load(0, {shade: false, time: 2 * 1000});
            $.getJSON(url, function (data, status) {
                if (data == null) {
                    return layer.msg('暂无菜单信息');
                }
                layuimini.initHome(data.homeInfo);
                layuimini.initMenu(data.moduleInfo);
                layuimini.initTab();
                layer.close(loading);
            }).fail(function () {
                layer.close(loading);
                return layer.msg('菜单接口有误！');
            });
        };

        /**
         * 初始化首页信息
         * @param data
         */
        this.initHome = function (data) {
            sessionStorage.setItem('layuiminiHomeHref', data.href);
            $('#layuiminiHomeTabId').text(data.title);
            $('#layuiminiHomeTabId').attr('lay-id', data.href);
            $('#layuiminiHomeTabIframe').html('<iframe width="100%" height="100%" frameborder="0"  src="' + data.href + '"></iframe>');
        };

        /**
         * 初始化菜单栏
         * @param data
         */
        this.initMenu = function (data) {
            var headerMenuHtml = '',
                leftMenuHtml = '',
                headerMenuCheckDefault = 'layui-this',
                leftMenuCheckDefault = 'layui-this';
            window.menuParameId = 1;
            window.hoverParameId = 1;

            // 缩放菜单
            leftMenuHtml += '<ul class="layui-nav layui-nav-tree layui-nav-top" data-side-fold="1">\n' +
                '<li class="layui-nav-item">\n' +
                '<a class="text-center">\n' +
                '<i class="fa fa-navicon">\n' +
                '</i>\n' +
                '</a>\n' +
                '</li>\n' +
                '</ul>';

            $.each(data, function (key, val) {
                headerMenuHtml += '<li class="layui-nav-item ' + headerMenuCheckDefault + '" id="' + key + 'HeaderId" data-menu="' + key + '"> <a href="javascript:;"><i class="' + val.icon + '"></i> ' + val.title + '</a> </li>\n';
                leftMenuHtml += '<ul class="layui-nav layui-nav-tree layui-left-nav-tree ' + leftMenuCheckDefault + '" id="' + key + '">\n';
                var menuList = val.child;
                $.each(menuList, function (index, menu) {
                    leftMenuHtml += '<li class="layui-nav-item">\n';
                    if (menu.child != undefined && menu.child != []) {
                        leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips tips-id-' + hoverParameId + '" ><i class="' + menu.icon + '"></i><span> ' + menu.title + '</span> </a>';
                        hoverParameId++;
                        var buildChildHtml = function (html, child, menuParameId, hoverParameId) {
                            html += '<dl class="layui-nav-child">\n';
                            $.each(child, function (childIndex, childMenu) {
                                html += '<dd>\n';
                                if (childMenu.child != undefined && childMenu.child != []) {
                                    html += '<a href="javascript:;" class="layui-menu-tips tips-id-' + hoverParameId + '" ><i class="' + childMenu.icon + '"></i><span> ' + childMenu.title + '</span></a>';
                                    hoverParameId++;
                                    window.hoverParameId = hoverParameId;
                                    html = buildChildHtml(html, childMenu.child, menuParameId, hoverParameId);
                                } else {
                                    html += '<a href="javascript:;" class="layui-menu-tips tips-id-' + hoverParameId + '" data-type="tabAdd"  data-tab-mpi="m-p-i-' + menuParameId + '" data-tab="' + childMenu.href + '" target="' + childMenu.target + '"><i class="' + childMenu.icon + '"></i><span> ' + childMenu.title + '</span></a>\n';
                                    menuParameId++;
                                    window.menuParameId = menuParameId;
                                    hoverParameId++;
                                    window.hoverParameId = hoverParameId;
                                }
                                html += '</dd>\n';
                            });
                            html += '</dl>\n';
                            return html;
                        };
                        leftMenuHtml = buildChildHtml(leftMenuHtml, menu.child, menuParameId, hoverParameId);
                    } else {
                        leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips tips-id-' + hoverParameId + '"  data-type="tabAdd" data-tab-mpi="m-p-i-' + menuParameId + '" data-tab="' + menu.href + '" target="' + menu.target + '"><i class="' + menu.icon + '"></i><span> ' + menu.title + '</span></a>\n';
                        menuParameId++;
                        hoverParameId++;
                    }
                    leftMenuHtml += '</li>\n';
                });
                leftMenuHtml += '</ul>\n';
                headerMenuCheckDefault = '';
                leftMenuCheckDefault = 'layui-hide';
            });
            $('.layui-header-menu').html(headerMenuHtml);
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
                var check = layuimini.checkTab(href);
                if (!check) {
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
                            title = $(this).text();
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
        layer.close(loading);
    });

    /**
     * 打开新窗口
     */
    $('body').on('click', '[data-tab]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        var tabId = $(this).attr('data-tab'),
            href = $(this).attr('data-tab'),
            title = $(this).text();

        // 拼接参数
        var menuParameId = $(this).attr('data-tab-mpi');
        if (href.indexOf("?") > -1) {
            href = href + '&mpi=' + menuParameId;
            tabId = href;
        } else {
            href = href + '?mpi=' + menuParameId;
            tabId = href;
        }

        if (tabId == null || tabId == undefined) {
            tabId = new Date().getTime();
        }
        // 判断该窗口是否已经打开过
        check = layuimini.checkTab(tabId);
        if (!check) {
            layuimini.addTab(tabId, href, title, true);
        }
        element.tabChange('layuiminiTab', tabId);
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
        sessionStorage.clear();
        layer.msg('清除缓存成功');
    });

    /**
     * 刷新
     */
    $('body').on('click', '[data-refresh]', function () {
        $(".layui-tab-item.layui-show").find("iframe")[0].contentWindow.location.reload();
        layer.msg('刷新成功');
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
            if (isShow == 1) {
                $(this).attr('style', 'display: none;');
            } else {
                $(this).attr('style', '');
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
            $('dd span').each(function () {
                $(this).hide();
            });
            //修改标志位
            $(this).attr('data-side-fold', 0);
        } else {
            $('.layui-side.layui-bg-black').attr('style', ''); //设置宽度
            $('.layui-side-scroll.layui-left-menu').attr('style', '');
            $('.layui-nav-top li i').attr('style', '');   //修改图标的位置
            //将footer和body的宽度修改
            $('.layui-body').attr('style', '');
            $('.layui-footer').attr('style', '');
            $('dd span').each(function () {
                $(this).show();
            });
            $(this).attr('data-side-fold', 1);
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
            isShow = $('.layui-nav-top').attr('data-side-fold');
        if (isShow == 0) {
            classInfo = classInfo.replace("layui-menu-tips ", "");
            openTips = layer.tips(tips, '.' + classInfo, {tips: [1, '#009688'], time: 30000});
        }
    });
    $("body").on("mouseleave", ".layui-menu-tips", function () {
        var isShow = $('.layui-nav-top').attr('data-side-fold');
        if (isShow == 0) {
            layer.close(openTips);
        }
    });

    exports("layuimini", layuimini);
});