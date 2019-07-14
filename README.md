layuimini后台模板
===============
## 项目介绍
最简洁、清爽、易用的layui后台框架模板。

项目会不定时进行更新，建议star和fork一份。

技术交流QQ群：[763822524](https://jq.qq.com/?_wv=1027&k=5JRGVfe) `加群请备注来源：如gitee、github、官网等`。

## 代码仓库
 * 在线预览地址：[http://layuimini.99php.cn](http://layuimini.99php.cn)
 * GitHub仓库地址：[https://github.com/zhongshaofa/layuimini](https://github.com/zhongshaofa/layuimini)
 * Gitee仓库地址：[https://gitee.com/zhongshaofa/layuimini](https://gitee.com/zhongshaofa/layuimini)

## 主要特性
* 界面足够简洁清爽，响应式且适配手机端。
* 一个接口`几行代码而已`直接初始化整个框架，无需复杂操作。
* 页面支持多配色方案，可自行选择喜欢的配色。
* 支持多tab，可以打开多窗口。
* 支持无限级菜单和对font-awesome图标库的完美支持。
* 失效以及报错菜单无法直接打开，并给出弹出层提示`完美的线上用户体验`。
* url地址hash定位，可以清楚看到当前tab的地址信息。
* 刷新页面会保留当前的窗口，并且会定位当前窗口对应左侧菜单栏。


## 效果预览
> 总体预览
![Image text](https://files.gitee.com/group1/M00/08/8C/PaAvDF0n_1SARToJAAHs7bxh0y8359.jpg)

> 登录界面

![Image text](https://files.gitee.com/group1/M00/08/58/PaAvDF0ZpoqAc8FPAACr7Qev1R4238.jpg)

> 1、多tab窗口

![Image text](https://files.gitee.com/group1/M00/08/8C/PaAvDF0n_zWAG1VIAAF0cP2C480497.jpg)
> 2、无限级菜单

![Image text](https://files.gitee.com/group1/M00/08/8C/PaAvDF0n_0uAcfnbAAIS_OqWabs466.jpg)
> 3、菜单缩放并提示菜单标题

![Image text](https://files.gitee.com/group1/M00/08/8C/PaAvDF0n_0SAVzSBAAIKBIZM5Yg263.jpg)
> 4、url地址hash定位

![Image text](https://files.gitee.com/group1/M00/08/8C/PaAvDF0n_y-AXNf1AAFmvHkGzCw201.jpg)
> 5、刷新保留窗口，并对应菜单栏

![Image text](https://files.gitee.com/group1/M00/08/8C/PaAvDF0n_z2AYnyiAAHKqQzvTXA710.jpg)
> 6、移动端的友好支持

![Image text](https://files.gitee.com/group1/M00/08/8F/PaAvDF0pYtyAJOjTAAIG4r6B8vA226.png)




## 使用说明

> 一、在index.html文件内进行初始化

 * base: "js/"  填写layuimini.js对应的目录。

 * layuimini.init();  方法内的参数请填写动态api地址。（实际应用中建议后端api做缓存）

 * 初始化api地址返回的参数可以参考api目录下的init.json文件或者查看使用说明的第二点的参数说明

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
 
 > 二、初始化api地址返回的参数说明
 
 * clearInfo是服务端清理缓存信息(clearInfo.clearUrl：服务端清理缓存接口地址，为空则不请求;)
 
  ``` json
  返回参数对应的事例(code：0，清除缓存失败；code：1，表示清除缓存成功；)
  
  {
    "code": 1,
    "msg": "清除服务端缓存成功"
  }
   ```
 
 * homeInfo 是首页信息
 
 * logoInfo 是logo信息
 
 * menuInfo 是头部模块和左侧菜单对应的信息
 
 * menuModule id必须唯一，例如 menuInfo.currency、menuInfo.other对应的currency和other就是模块id，他们的值必须唯一，否则模块切换会有冲突。
 
  ``` json
{
  "homeInfo": {
    "title": "首页",
    "icon": "fa fa-home",
    "href": "page/welcome-2.html?mpi=m-p-i-0"
  },
  "logoInfo": {
    "title": "LayuiMini",
    "image": "images/logo.png",
    "href": ""
  },
  "clearInfo": {
    "clearUrl": "api/clear.json"
  },
  "menuInfo": {
      "currency": {
        "title": "常规管理",
        "icon": "fa fa-address-book",
        "child": [
            .......
        ],
      "other": {
        "title": "其它管理",
        "icon": "fa fa-slideshare",
        "child": [
            .......
        ]
    }
  }
}
  ```
  ## 备注信息
  * 菜单栏建议最多四级菜单，四级以后菜单显示并没有那么友好。
  * 项目实际运用请删除 layuimini\index.html 文件内的百度统计代码。（下面的代码）
  
  ``` js
<!--开始----百度统计代码，实际使用请删除-->
<script>
    var _hmt = _hmt || [];
    (function () {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?d97abf6d61c21d773f97835defbdef4e";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
</script>
<!--结束----百度统计代码，实际使用请删除-->
   ```