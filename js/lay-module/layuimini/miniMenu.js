/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini 框架扩展
 */
layui.define(["element", "jquery"], function (exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;

    var miniMenu = {

        /**
         * 菜单初始化
         * @param options.menuList   菜单数据信息
         * @param options.multiModule 是否开启多模块
         */
        render: function (options) {
            options.menuList = options.menuList || [];
            options.multiModule = options.multiModule || false;
            if (options.multiModule) {
                miniMenu.renderMultiModule(options.menuList);
            } else {
                miniMenu.renderSingleModule(options.menuList);
            }
        },

        /**
         * 单模块
         * @param menuList
         */
        renderSingleModule: function (menuList) {
            menuList = menuList || [];
            var leftMenuHtml = '',
                leftMenuCheckDefault = 'layui-this';

            leftMenuHtml += '<ul class="layui-nav layui-nav-tree layui-left-nav-tree ' + leftMenuCheckDefault + '" >\n';
            $.each(menuList, function (index, menu) {
                leftMenuHtml += '<li class="layui-nav-item">\n';
                if (menu.child != undefined && menu.child != []) {
                    leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips" ><i class="' + menu.icon + '"></i><span class="layui-left-nav"> ' + menu.title + '</span> </a>';
                    var buildChildHtml = function (html, child) {
                        html += '<dl class="layui-nav-child">\n';
                        $.each(child, function (childIndex, childMenu) {
                            html += '<dd>\n';
                            if (childMenu.child != undefined && childMenu.child != []) {
                                html += '<a href="javascript:;" class="layui-menu-tips" ><i class="' + childMenu.icon + '"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>';
                                html = buildChildHtml(html, childMenu.child);
                            } else {
                                html += '<a href="javascript:;" class="layui-menu-tips"  layuimini-tab-open="' + childMenu.href + '" target="' + childMenu.target + '"><i class="' + childMenu.icon + '"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>\n';
                            }
                            html += '</dd>\n';
                        });
                        html += '</dl>\n';
                        return html;
                    };
                    leftMenuHtml = buildChildHtml(leftMenuHtml, menu.child);
                } else {
                    leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips"  layuimini-tab-open="' + menu.href + '" target="' + menu.target + '"><i class="' + menu.icon + '"></i><span class="layui-left-nav"> ' + menu.title + '</span></a>\n';
                }
                leftMenuHtml += '</li>\n';
            });
            leftMenuHtml += '</ul>\n';

            $('.layuimini-menu-left').html(leftMenuHtml);
            element.init();
        },

        /**
         * 多模块
         * @param menuList
         */
        renderMultiModule: function (menuList) {
            menuList = menuList || [];
            var headerMenuHtml = '',
                headerMobileMenuHtml = '',
                leftMenuHtml = '',
                headerMenuCheckDefault = 'layui-this',
                leftMenuCheckDefault = 'layui-this';

            $.each(menuList, function (key, val) {
                key = 'multi_module_'+key;
                headerMenuHtml += '<li class="layui-nav-item ' + headerMenuCheckDefault + '" id="' + key + 'HeaderId" data-menu="' + key + '"> <a href="javascript:;"><i class="' + val.icon + '"></i> ' + val.title + '</a> </li>\n';
                headerMobileMenuHtml += '<dd><a href="javascript:;" id="' + key + 'HeaderId" data-menu="' + key + '"><i class="' + val.icon + '"></i> ' + val.title + '</a></dd>\n';
                leftMenuHtml += '<ul class="layui-nav layui-nav-tree layui-left-nav-tree ' + leftMenuCheckDefault + '" id="' + key + '">\n';
                var menuList = val.child;
                $.each(menuList, function (index, menu) {
                    leftMenuHtml += '<li class="layui-nav-item">\n';
                    if (menu.child != undefined && menu.child != []) {
                        leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips" ><i class="' + menu.icon + '"></i><span class="layui-left-nav"> ' + menu.title + '</span> </a>';
                        var buildChildHtml = function (html, child) {
                            html += '<dl class="layui-nav-child">\n';
                            $.each(child, function (childIndex, childMenu) {
                                html += '<dd>\n';
                                if (childMenu.child != undefined && childMenu.child != []) {
                                    html += '<a href="javascript:;" class="layui-menu-tips" ><i class="' + childMenu.icon + '"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>';
                                    html = buildChildHtml(html, childMenu.child);
                                } else {
                                    html += '<a href="javascript:;" class="layui-menu-tips"  layuimini-tab-open="' + childMenu.href + '" target="' + childMenu.target + '"><i class="' + childMenu.icon + '"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>\n';
                                }
                                html += '</dd>\n';
                            });
                            html += '</dl>\n';
                            return html;
                        };
                        leftMenuHtml = buildChildHtml(leftMenuHtml, menu.child);
                    } else {
                        leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips"  layuimini-tab-open="' + menu.href + '" target="' + menu.target + '"><i class="' + menu.icon + '"></i><span class="layui-left-nav"> ' + menu.title + '</span></a>\n';
                    }
                    leftMenuHtml += '</li>\n';
                });
                leftMenuHtml += '</ul>\n';
                headerMenuCheckDefault = '';
                leftMenuCheckDefault = 'layui-hide';
            });
            $('.layuimini-menu-header-pc').html(headerMenuHtml); //电脑
            $('.layuimini-menu-header-mobile').html(headerMobileMenuHtml); //手机
            $('.layuimini-menu-left').html(leftMenuHtml);
            element.init();
        },

    };

    exports("miniMenu", miniMenu);
});