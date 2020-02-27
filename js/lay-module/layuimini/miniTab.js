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


    var miniTab = {

        /**
         * 新建tab窗口
         * @param tabId
         * @param href
         * @param title
         * @param addSession
         */
        create: function (tabId, href, title, addSession) {
            if (addSession === undefined || addSession === true) {
                var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("layuiminiTabInfo"));
                if (layuiminiTabInfo == null) {
                    layuiminiTabInfo = {};
                }
                layuiminiTabInfo[tabId] = {href: href, title: title}
                sessionStorage.setItem("layuiminiTabInfo", JSON.stringify(layuiminiTabInfo));
            }
            element.tabAdd('layuiminiTab', {
                title: '<span class="layuimini-tab-active"></span><span>' + title + '</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>' //用于演示
                , content: '<iframe width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0"   src="' + href + '"></iframe>'
                , id: tabId
            });
        },

        /**
         * 刷新tab窗口
         */
        refresh: function () {

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
            if (isParent === true) {
                parent.layui.element.tabDelete('layuiminiTab', tabId);
            } else {
                element.tabDelete('layuiminiTab', tabId);
            }
        },

        /**
         * 判断tab窗口
         */
        check: function (tabId, isIframe) {
            // 判断选项卡上是否有
            var checkTab = false;
            if (isIframe == undefined || isIframe == false) {
                $(".layui-tab-title li").each(function () {
                    checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId == tabId) {
                        checkTab = true;
                    }
                });
            } else {
                parent.layui.$(".layui-tab-title li").each(function () {
                    checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId == tabId) {
                        checkTab = true;
                    }
                });
            }
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
        }
    };

    exports("miniTab", miniTab);
});