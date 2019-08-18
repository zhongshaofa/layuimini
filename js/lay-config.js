/**
 * date:2019/08/16
 * author:Mr.Chung
 * description:此处放layui自定义扩展
 */

window.rootPath = (function () {
    var curWwwPath = window.document.location.href,
        pathName = window.document.location.pathname;
    var localhostPaht = curWwwPath.substring(0, curWwwPath.indexOf(pathName)),
        projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPaht + projectName;
})();

layui.config({
    base: rootPath + "/lib/lay-module/",
    version: true
}).extend({
    layuimini: "layuimini/layuimini", // layuimini扩展
    step: 'step-lay/step', // 分步表单扩展
    treetable: 'treetable-lay/treetable', //table树形扩展
    tableSelect: 'tableSelect/tableSelect', // table选择扩展
    iconPickerFa: 'iconPicker/iconPickerFa', // fa图标选择扩展
});