layuimini后台模板
===============
## 项目介绍
最简洁、清爽、易用的layui后台框架模板。

> 项目会不定时进行更新，建议star和fork一份，另外有问题请加QQ群：[763822524](https://jq.qq.com/?_wv=1027&k=5JRGVfe)。

> 预览地址：[http://layuimini.99php.cn](http://layuimini.99php.cn)

## 主要特性
* 界面足够简洁清爽。
* 一个接口`几行代码而已`直接初始化整个框架，无需复杂操作。
* 支持多tab，可以打开多窗口。
* 支持无限级菜单和对font-awesome图标库的完美支持。
* url地址hash定位，可以清楚看到当前tab的地址信息。
* 刷新页面会保留当前的窗口，并且会定位当前窗口对应左侧菜单栏。
* 移动端的友好支持。


## 效果预览
> 总体预览
![Image text](https://files.gitee.com/group1/M00/08/1B/PaAvDF0HLAGAdCe_AAHJ-SJxbfY063.png)

> 1、多tab窗口

![Image text](https://files.gitee.com/group1/M00/08/1B/PaAvDF0HLA-AJlbyAAE1O4Phvsk064.png)
> 2、无限级菜单

![Image text](https://files.gitee.com/group1/M00/08/1B/PaAvDF0HLX6AYWMPAAHzSi_1tD0963.png)
> 3、菜单缩放并提示菜单标题

![Image text](https://files.gitee.com/group1/M00/08/1B/PaAvDF0HLCqAGGizAAHu_4gyQug790.png)
> 4、url地址hash定位

![Image text](https://files.gitee.com/group1/M00/08/13/PaAvDF0C-jqAPJ1dAAE32WAJ290421.png)
> 5、刷新保留窗口，并对应菜单栏

![Image text](https://files.gitee.com/group1/M00/08/1B/PaAvDF0HLCOAZCrkAAHWtRZZWSI386.png)
> 6、移动端的友好支持

![Image text](https://files.gitee.com/group1/M00/08/1B/PaAvDF0HLByAW8hJAACwEN4EWk8201.png)



## 使用说明

> 一、在index.html文件内进行初始化

1、base: "js/"  填写layuimini.js对应的目录。

2、layuimini.init();  方法内的参数请填写动态api地址。（实际应用中建议后端api做缓存）

3、api地址返回的参数可以参考api目录下的init.json文件或者查看使用说明的第二点的参数说明

 ``` js
    layui.config({
        base: "js/"
    }).extend({
        "layuimini": "layuimini"
    });
    layui.use(['element', 'layer', 'layuimini'], function () {
        var $ = layui.jquery,
            element = layui.element,
            layer = layui.layer;

        layuimini.init('api/init.json');
    });
 ```
 
 > 二、api地址返回的参数说明
 
 1、clearInfo是服务端清理缓存信息(clearInfo.clearUrl：服务端清理缓存接口地址，为空则不请求;)
 
 > 返回参数对应的事例(code：0，清除缓存失败；code：1，表示清除缓存成功；)
  ``` json
  {
    "code": 1,
    "msg": "清除服务端缓存成功"
  }
   ```
 
 2、homeInfo是首页信息
 
 3、menuInfo是头部模块和左侧菜单对应的信息
 
 4、module id必须唯一，例如 menuInfo.ceshi、menuInfo.setting对应的ceshi和setting就是模块id，他们的值必须唯一，否则模块切换会有冲突。
 
  ``` json
{
  "clearInfo": {
    "clearUrl": "api/clear.json"
  },
  "homeInfo": {
    "title": "首页",
    "icon": "fa fa-snowflake-o",
    "href": "page/welcome.html"
  },
  "menuInfo": {
    "ceshi": {
      "title": "测试管理",
      "icon": "fa fa-address-book",
      "child": [{
        "title": "icon列表",
        "href": "page/icon.html",
        "icon": "fa fa-dot-circle-o",
        "target": "_self"
      }, {
        "title": "UI管理",
        "href": "",
        "icon": "fa fa-snowflake-o",
        "target": "",
        "child": [ {
          "title": "表单",
          "href": "page/form.html",
          "icon": "fa fa-calendar",
          "target": "_self"
        },{
          "title": "按钮",
          "href": "page/button.html",
          "icon": "fa fa-snowflake-o",
          "target": "_self"
        }, {
          "title": "弹出层",
          "href": "page/layer.html",
          "icon": "fa fa-snowflake-o",
          "target": "_self"
        }, {
          "title": "静态表格",
          "href": "page/table.html",
          "icon": "fa fa-snowflake-o",
          "target": "_self"
        }]
      }, {
        "title": "测试无限层",
        "href": "",
        "icon": "fa fa-meetup",
        "target": "",
        "child": [{
          "title": "按钮1",
          "href": "page/button.html",
          "icon": "fa fa-calendar",
          "target": "_self",
          "child": [{
            "title": "按钮2",
            "href": "page/button.html",
            "icon": "fa fa-snowflake-o",
            "target": "_self",
            "child": [{
              "title": "按钮3",
              "href": "page/button.html",
              "icon": "fa fa-snowflake-o",
              "target": "_self"
            }, {
              "title": "表单4",
              "href": "page/form.html",
              "icon": "fa fa-calendar",
              "target": "_self"
            }]
          }]
        }]
      }]
    },
    "setting": {
      "title": "设置管理",
      "icon": "fa fa-gears",
      "child": [{
        "title": "icon列表 [setting]",
        "href": "page/icon.html",
        "icon": "fa fa-dot-circle-o",
        "target": "_self"
      }, {
        "title": "按钮列表 [setting]",
        "href": "page/button.html",
        "icon": "fa fa-caret-square-o-left",
        "target": "_self"
      }]
    }
  }
}
  ```
