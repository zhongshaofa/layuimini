layuimini后台模板(onepage 单页版)
===============
## 项目介绍
最简洁、清爽、易用的layui后台框架模板。

项目会不定时进行更新，建议star和watch一份。

技术交流QQ群：[561838086](https://jq.qq.com/?_wv=1027&k=5JRGVfe) `加群请备注来源：如gitee、github、官网等`。

## 代码仓库(onepage 单页版)
 * 在线预览地址：[http://layuimini-onepage.99php.cn](http://layuimini-onepage.99php.cn)
 * GitHub仓库地址：[https://github.com/zhongshaofa/layuimini](https://github.com/zhongshaofa/layuimini/tree/onepage)
 * Gitee仓库地址：[https://gitee.com/zhongshaofa/layuimini/tree/onepage](https://gitee.com/zhongshaofa/layuimini/tree/onepage)

## 代码仓库(iframe 多tab版)
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
* 支持font-awesome图标选择插件


## 效果预览
> 总体预览

![Image text](./images/home.png)

## 使用说明

 > 一、默认配置说明
 
* 默认配置在`layuimini.config`方法内，请自行修改
* urlHashLocation：是否开启URL地址hash定位，默认开启。`关闭后，刷新页面后将定位不到当前页，只显示主页`
* urlSuffixDefault：是否开启URL后缀，默认开启。
* BgColorDefault：系统默认皮肤，从0开始。
   ``` js
       var config = {
             urlHashLocation: true,   // URL地址hash定位
             urlSuffixDefault: true, // URL后缀
             BgColorDefault: 0       // 默认皮肤（0开始）
          };
    ```

> 二、后台模板初始化

 * 在`index.html`文件内进行初始化

 * 引入`lay-config.js`文件，请根据实际情况修改里面扩展的路径。

 * `layuimini.init();` 方法内的参数请填写动态api地址。（实际应用中建议后端api做缓存）

 * 初始化api地址返回的参数可以参考`api目录下的init.json文件`或者查看使用说明的第二点的参数说明

 ``` js
 
    layui.use(['element', 'layer', 'layuimini'], function () {
        var $ = layui.jquery,
            element = layui.element,
            layer = layui.layer;

        layuimini.init('api/init.json');
    });
    
 ```
 
 > 三、初始化api地址返回的参数说明
 
 * `clearInfo`是服务端清理缓存信息(clearInfo.clearUrl：服务端清理缓存接口地址，为空则不请求;)
 
  ``` json
  返回参数对应的事例(code：0，清除缓存失败；code：1，表示清除缓存成功；)
  
  {
    "code": 1,
    "msg": "清除服务端缓存成功"
  }
   ```
 
 * `homeInfo` 是首页信息
 
 * `logoInfo` 是logo信息
 
 * `menuInfo` 是头部模块和左侧菜单对应的信息
 
 * `menuModule id`必须唯一，例如 menuInfo.currency、menuInfo.other对应的currency和other就是模块id，他们的值必须唯一，否则模块切换会有冲突。
 
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
  
> 四、在页面中打开新页面
   
  * 如需在页面中弹出新的Tab窗口，请参考下方代码。
  * 参数说明（data-iframe-tab：页面链接，data-title：标题，data-icon：图标）
``` html
     
    <a href="javascript:;" data-content-href="page/user-setting.html" data-title="基本资料">基本资料</a>

 ```
  
  > 五、后台主题方案配色
  
 * 系统已内置12套主题配色，如果需要自定义皮肤配色，请在`layuimini.bgColorConfig`方法内按相同格式添加。
 ``` js
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
        }
    ];
  ```
 
  ## 常见问题
  * <font color=red>修改js后刷新页面未生效，请尝试清除浏览器缓存。</font>
  
  ## 备注信息
  * 菜单栏建议最多四级菜单，四级以后菜单显示并没有那么友好。
 
 ## 捐赠支持
 
开源项目不易，若此项目能得到你的青睐，可以捐赠支持作者持续开发与维护。

 ![Image text](./images/donate_qrcode.png)
 
 > 捐赠名单
 
| 捐赠者 | 捐赠金额 | 捐赠时间 |
| --- | --- | --- |
| *刚 | ￥100.00 |2019/08/28 14:26|
| *刚 | ￥18.00 |2019/08/28 14:21|
| *。| ￥4.50 |2019/08/28 14:13|
| *亚楠 | ￥1.00 | 2019/08/27 14:24|
| z*b | ￥5.00 | 2019/08/23 17:15|
