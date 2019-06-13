
layui.define(["element", "jquery"], function (exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;

    layuimini = new function () {

        /**
         * 初始化
         * @param url
         */
        this.init = function (url) {
            $.getJSON(url, function (data, status) {
                if (data == null) {
                    return layer.msg('暂无菜单信息');
                }
                layuimini.initHome(data.homeInfo);
                menuListObj = layuimini.initMenu(data.moduleInfo);
                layuimini.initTab(menuListObj);
            }).fail(function () {
                return layer.msg('菜单接口有误！');
            });
        };

        /**
         * 初始化首页信息
         * @param data
         */
        this.initHome = function (data) {
            $('#layuiminiHomeTabId').text(data.title);
            $('#layuiminiHomeTabId').attr('lay-id', data.href);
            $('#layuiminiHomeTabIframe').html('<iframe width="100%" height="100%" frameborder="0"  src="' + data.href + '"></iframe>');
        };

        /**
         * 初始化菜单栏
         * @param data
         */
        this.initMenu = function (data) {
            var menuListObj ={},
                headerMenuHtml = '',
                leftMenuHtml = '',
                headerMenuCheckDefault = 'layui-this',
                leftMenuCheckDefault = 'layui-this';
            $.each(data, function (key, val) {
                headerMenuHtml += '<li class="layui-nav-item ' + headerMenuCheckDefault + '" data-menu="' + key + '"> <a href="javascript:;">' + val.title + '</a> </li>\n';
                leftMenuHtml += '<ul class="layui-nav layui-nav-tree ' + leftMenuCheckDefault + '" id="' + key + '">\n';
                var menuList = val.list;
                $.each(menuList, function (index, menu) {
                    leftMenuHtml += '<li class="layui-nav-item">\n';
                    if (menu.child != undefined && menu.child != []) {
                        leftMenuHtml += '<a href="javascript:;">' + menu.title + '</a>';
                        var buildChildHtml = function (html, child) {
                            html += '<dl class="layui-nav-child">\n';
                            $.each(child, function (childIndex, childMenu) {
                                html += '<dd>\n';
                                if (childMenu.child != undefined && childMenu.child != []) {
                                    html += '<a href="javascript:;">' + childMenu.title + '</a>';
                                    html = buildChildHtml(html, childMenu.child);
                                } else {
                                    menuListObj[childMenu.href] = {title: childMenu.title, href: childMenu.href, icon: childMenu.icon, target: childMenu.target};
                                    html += '<a href="javascript:;" data-type="tabAdd" data-tab="' + childMenu.href + '" target="' + childMenu.target + '">' + childMenu.title + '</a>\n';
                                }
                                html += '</dd>\n';
                            });
                            html += '</dl>\n';
                            return html;
                        };
                        leftMenuHtml = buildChildHtml(leftMenuHtml, menu.child);
                    } else {
                        menuListObj[menu.href] = {title: menu.title, href: menu.href, icon: menu.icon, target: menu.target};
                        leftMenuHtml += '<a href="javascript:;" data-type="tabAdd" data-tab="' + menu.href + '" target="' + menu.target + '">' + menu.title + '</a>\n';
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
            return menuListObj;
        };

        /**
         * 初始化选项卡
         * @param menuListObj
         */
        this.initTab = function (menuListObj) {
            var locationHref = window.location.href;
            var urlArr = locationHref.split("#");
            if (urlArr.length >= 2) {
                var href = urlArr.pop();
                var check = layuimini.checkTab(href);
                if (!check) {
                    var title = href,
                        tabId = href;
                    if (menuListObj[tabId] != undefined && menuListObj[tabId] != null) {
                        title = menuListObj[tabId].title;
                    }
                    layuiminiHomeTab = $('#layuiminiHomeTab').attr('lay-id');
                    if (layuiminiHomeTab != href) {
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
        $parent = $(this).parent();
        tabId = $parent.attr('lay-id');
        if (tabId != undefined || tabId != null) {
            layuimini.delTab(tabId);
        }
    });

    /**
     * 打开新窗口
     */
    $('body').on('click', '[data-tab]', function () {
        var tabId = $(this).attr('data-tab'),
            href = $(this).attr('data-tab'),
            title = $(this).text();
        if (tabId == null || tabId == undefined) {
            tabId = new Date().getTime();
        }
        // 判断该窗口是否已经打开过
        check = layuimini.checkTab(tabId);
        if (!check) {
            layuimini.addTab(tabId, href, title, true);
        }
        element.tabChange('layuiminiTab', tabId);
    });

    /**
     * 左侧菜单的切换
     */
    $('body').on('click', '[data-menu]', function () {
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
    });

    exports("layuimini", layuimini);
});