/**
 * date:2020/03/01
 * author:Mr.Chung
 * version:2.0
 * description:layuimini 统计框架扩展
 */
layui.define(["jquery"], function (exports) {
    var $ = layui.$;

    var miniTongji = {

        /**
         * 初始化
         * @param options
         */
        render: function (options) {
            options.specific = options.specific || false;
            options.domains = options.domains || [];
            var domain = window.location.hostname;
            if (options.specific === false || (options.specific === true && options.domains.indexOf(domain) >=0)) {
                miniTongji.listen();
            }
        },

        /**
         * 监听统计代码
         */
        listen: function () {
            var _hmt = _hmt || [];
            (function () {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?d97abf6d61c21d773f97835defbdef4e";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            })();
        }
    };

    exports("miniTongji", miniTongji);
});