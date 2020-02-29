/**
 * date:2020/02/28
 * author:Mr.Chung
 * version:2.0
 * description:layuimini tab框架扩展
 */
layui.define(["jquery", "layer"], function (exports) {
    var $ = layui.$,
        layer = layui.layer;

    var miniTheme = {

        /**
         * 主题配置项
         * @param bgcolorId
         * @returns {{headerLogo, menuLeftHover, headerRight, menuLeft, headerRightThis, menuLeftThis}|*|*[]}
         */
        config: function (bgcolorId) {
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
            if (bgcolorId === undefined) {
                return bgColorConfig;
            } else {
                return bgColorConfig[bgcolorId];
            }
        },

        /**
         * 初始化
         * @param options
         */
        render: function (options) {
            options.bgColorDefault = options.bgColorDefault || 0;
            var bgcolorId = sessionStorage.getItem('layuiminiBgcolorId');
            if (bgcolorId === null || bgcolorId === undefined || bgcolorId === '') {
                bgcolorId = options.bgColorDefault;
            }
            var bgcolorData = miniTheme.config(bgcolorId);
            var styleHtml = '.layui-layout-admin .layui-header{background-color:' + bgcolorData.headerRight + '!important;}\n' +
                '.layui-header .layuimini-header-content>ul>.layui-nav-item.layui-this,.layuimini-tool i:hover{background-color:' + bgcolorData.headerRightThis + '!important;}\n' +
                '.layui-layout-admin .layui-logo {background-color:' + bgcolorData.headerLogo + '!important;}\n' +
                '.layui-side.layui-bg-black,.layui-side.layui-bg-black>.layui-left-menu>ul {background-color:' + bgcolorData.menuLeft + '!important;}\n' +
                '.layui-left-menu .layui-nav .layui-nav-child a:hover:not(.layui-this) {background-color:' + bgcolorData.menuLeftHover + ';}\n' +
                '.layui-layout-admin .layui-nav-tree .layui-this, .layui-layout-admin .layui-nav-tree .layui-this>a, .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this, .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a {\n' +
                '    background-color: ' + bgcolorData.menuLeftThis + ' !important;\n' +
                '}';
            $('#layuimini-bg-color').html(styleHtml);
            miniTheme.listen();
        },
        buildBgColorHtml: function () {
            var html = '';
            var bgcolorId = sessionStorage.getItem('layuiminiBgcolorId');
            if (bgcolorId === null || bgcolorId === undefined || bgcolorId === '') {
                bgcolorId = 0;
            }
            var bgColorConfig = miniTheme.config();
            $.each(bgColorConfig, function (key, val) {
                if (key === bgcolorId) {
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
        },
        listen: function () {

            $('body').on('click', '[data-bgcolor]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var clientHeight = (document.documentElement.clientHeight) - 95;
                var bgColorHtml = miniTheme.buildBgColorHtml();
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
                    end: function () {
                        $('.layuimini-select-bgcolor').removeClass('layui-this');
                    }
                });
                layer.close(loading);
            });

            $('body').on('click', '[data-select-bgcolor]', function () {
                var bgcolorId = $(this).attr('data-select-bgcolor');
                $('.layuimini-color .color-content ul .layui-this').attr('class', '');
                $(this).attr('class', 'layui-this');
                sessionStorage.setItem('layuiminiBgcolorId', bgcolorId);
                miniTheme.render({
                    bgColorDefault: bgcolorId
                });
            });
        }
    };

    exports("miniTheme", miniTheme);

})
;