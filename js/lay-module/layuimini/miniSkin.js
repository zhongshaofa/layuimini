/**
 * date:2020/02/30
 * author:Mr.路
 * version:2.0
 * description:layuimini 主题设计器
 使用方式
  lay-config 增加引入配置 miniSkin: 'layuimini/miniSkin', / 
  index.html  增加代码  layui.miniSkin.render({}); 执行初始化 //同时需要引入  miniSkin
 */
layui.define(["element", "jquery",'colorpicker','form'], function (exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;
    var colorpicker = layui.colorpicker;
    var form = layui.form;
    var miniSkin = {
      /*
       设置支持的主题样式
     class: 应用的css类
     css:应用的css属性 
     type ： color 颜色， drop 下拉  pixel  像素  number 数字
     default:'默认值'
     placeholder:提示文本
      */
        skin:[
        {label:"Logo背景颜色",class:".layui-logo.layuimini-logo",css:'background-color',type:'color',default:'',placeholder:"颜色"},
        {label:"Logo文字颜色",class:".layui-logo.layuimini-logo a h1",css:'color',type:'color',default:'',placeholder:"颜色"},
        //{label:"Logo阴影",class:"",css:'',type:'color',default:'',placeholder:"颜色"},
        {label:"header背景颜色",class:".layui-layout-admin .layui-header",css:'background-color',type:'color',default:'',placeholder:"颜色"},
        {label:"header文字颜色",class:".layui-layout-admin .layui-header .layui-nav-item a",css:'color',type:'color',default:'',placeholder:"颜色"},
       // {label:"header选中线条",class:"",css:'',type:'color',default:'',placeholder:"颜色"},
       // {label:"header阴影",class:"",css:'',type:'number',default:'',placeholder:"颜色"},
        {label:"header高度",class:".layui-layout-admin .layui-header ",css:'height',type:'pixel',default:'',placeholder:"输入像素"},
        
        {label:"侧边栏颜色",class:"",css:'',type:'drop',default:'',placeholder:"颜色",items:[{"value":'',"text":"浅色"}]}
        ],
        /**
         * 皮肤设置初始化 
         */
        render: function (options) {
            $("body").append("<a href='javascript:;' class='btnskin' style='position: fixed;right: 0px; top: 50%; width: 50px; height: 50px; background-color: #cccccc; opacity: 0.8; border: 5px;z-index:9999;line-height:50px; text-align:center'>设置</a>");
            miniSkin.listen();
        },
        buildSkinHtml: function (options) {
          var str="";
          //return "<li>皮肤<input class='layui-input'/></li>";
          $.each(miniSkin.skin,function(n,v){
            if(v['type']=='color')
               str=str+"<div class='layui-form-item'><label class='layui-form-label'>"+v.label+
             "</label><div class='layui-input-block'>"+
             "<div class='layui-input-inline'><input type='text' data-class='"+v.class+"' data-css='"+v.css+"' value='"+v.default+"' class='layui-input color' placeholder='"+v.placeholder+"'/></div>"+
             "<div class='layui-inline' style='   margin-left:-10px;margin-right:0px'><div id='color"+n+"' class='divcolor'></div></div></div></div>";

             if(v['type']=='drop')
              { 
                str=str+"<div class='layui-form-item'><label class='layui-form-label'>"+v.label+"</label><div class='layui-input-block'><select  data-class='"+v.class+"'  data-css='"+v.css+"' value='"+v.default+"' class='layui-input' placeholder='"+v.placeholder+"'>";
                $.each(v.items,function(n1,v1){
                  str=str+"<option value='"+v1['value']+"'>"+v1['text']+"</option>";
                });
                str=str+'</select></div></div>';
              }

             if(v['type']=='pixel')
               str=str+"<div class='layui-form-item'><label class='layui-form-label'>"+v.label+"</label><div class='layui-input-block'><input type='text'  data-class='"+v.class+"'  data-css='"+v.css+"' value='"+v.default+
             "' class='layui-input pixel' placeholder='"+v.placeholder+"'/></div></div>";

             if(v['type']=='number')
               str=str+"<div class='layui-form-item'><label class='layui-form-label'>"+v.label
             +"</label><div class='layui-input-block'><input type='number'  data-class='"+v.class+"' data-css='"+v.css+"' value='"+v.default+"' class='layui-input' placeholder='"+v.placeholder+"'/></div></div>";

          });
          return str;
        },
         /**
         * 监听
         * @param options
         */
        listen: function (options) {
          $("head").append("<style type='text/css' id='theme'></style>");
            $('body').on('click', '.btnskin', function () {
              //$(this).css('right','340px');
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var clientHeight = (document.documentElement.clientHeight) - 60;
                var bgColorHtml = miniSkin.buildSkinHtml(options);
                var html = '<div class="layuimini-skin">\n' +
                    '<div class="color-title">\n' +
                    '<span>主题设置</span>\n' +
                    '</div>\n' +
                    '<div class="skin-content">\n' +
                    '<form class="layui-form" id="skin_form"  style="position:fixed;top:105px; bottom:40px;overflow:scroll" action="">' + bgColorHtml + '</form>\n' +
                    '</div>\n' +
                    '<div class="more-menu-list">\n' +
                    '<a href="javascript:;" class="layui-btn btnimport">导入</a>\
                    <a href="javascript:;"  class="layui-btn btnexport">导出</a>\
                    <a href="javascript:;"  class="layui-btn btnsave">保存</a>\
                    <a href="javascript:;"  class="layui-btn btnclose">关闭</a>'+
                    '</div>' +
                    '</div>';

                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shade: 0.2,
                    anim: 2,
                    shadeClose: true,
                    id: 'layuiminiSkin',
                    area: ['340px', clientHeight + 'px'],
                    offset: 'rb',
                    content: html,
                    success: function (index, layero) {
                       $("#layuiminiSkin .more-menu-list").css('position','fixed');

                      $("#layuiminiSkin .more-menu-list").css("bottom","0px");
                      $("#layuiminiSkin .color-title").css({"height":"40px","line-height":"40px","padding-left":"10px","border-bottom":"1px solid #cccccc"});
                      $("#layuiminiSkin .divcolor").css({"margin-right":"0px"});
                      //$("#layuiminiSkin .skin-content li").css({"height":"40px"});
                      //$("#layuiminiSkin .skin-content label").css({'width':'30%',"float":"left","height":"40px","line-height":"40px","text-align":"right"});
                      //$("#layuiminiSkin .skin-content input,#layuiminiSkin .skin-content select").css({'width':'70%',"float":"left"});
                      form.render();
                      $("#layuiminiSkin .divcolor").each(function(n,v){
                         //var c=$(v).val()|| '#2ec770';
                         var i=$("#"+ $(v).attr("id")).parents(".layui-form-item").find("input");
                         var c=i.val()|| '#2ec770';
                         i.css("background-color",c);
                       //  alert("#"+ $(v).attr("id"));
                          colorpicker.render({
                            elem:"#"+ $(v).attr("id"),  //绑定元素
                            color:c, //设置默认色
                            change: function(color){ //颜色改变的回调
                            $("#"+ $(v).attr("id")).parents(".layui-form-item").find("input").val(color);
                            $("#"+ $(v).attr("id")).parents(".layui-form-item").find("input").css({"background-color":color});
                            }
                          });
                       });
                      
                    },
                    end: function () {
                         
                    }
                });
                layer.close(loading);
            });

            $('body').on('keypress', '#layuiminiSkin .pixel', function (event) {
                 var eventObj = event || e;
                var keyCode = eventObj.keyCode || eventObj.which;
               if ((keyCode >= 48 && keyCode <= 57))
                   return true;
               else
                   return false;
            });
          ///点
          $('body').on('change', '#layuiminiSkin .pixel', function () {
                  $(this).val($(this).val().replace("px","")+"px");
            });
           ///保存
           $('body').on('click', '#layuiminiSkin .btnsave', function () {
               //
               var json=[];
               $("#skin_form input,#skin_form select").each(function(n,v){
                json.push({"class":$(v).data("class"),"css":$(v).data("css"),"value":$(v).val()});
               });
                miniSkin._cache("layuiminiskin",json);
                $("#theme").empty();
                $("#theme").append( miniSkin.jsonconverttostyle());///设置样式
           });
           ///导入按钮
           $('body').on('change', '#layuiminiSkin .btnimport', function () {

           });
           //导出按钮
           $('body').on('change', '#layuiminiSkin .btnexport', function () {
              var json=[];
              $("#skin_form input,#skin_form select").each(function(n,v){
                  json.push({"class":$(v).data("class"),"css":$(v).data("css"),"value":$(v).val()});
                 });
              miniSkin.download("skin",JSON.stringify(json));
           });
           //关闭
           $('body').on('change', '#layuiminiSkin .btnclose', function () {

           });
        },
        ///json 转样式表
        jsonconverttostyle:function(json){
          var str="";
          $.each(miniSkin._cache("layuiminiskin"),function(n,v){
            if(v['class']&&v['css'])
            str=str+v['class']+"{"+v['css']+":"+v['value']+" !important;}";
          });
          return str;

        },
        ///读取本地文件
        openfile:function(event)           
        {                      
                var input = event.target;        
                var reader = new FileReader();         
                reader.onload = function(){      
                        var text = reader.result;    
                        config_str = text; 
                        alert(config_str);     
                };                 
                reader.readAsText(input.files[0]);        
        },
      ///保存到本地
        download:function(filename, text) {      
            var pom = document.createElement("a");      
            pom.setAttribute( "href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));      
            pom.setAttribute("download", filename);      
             if (document.createEvent) {        
               var event = document.createEvent("MouseEvents");        
               event.initEvent("click", true, true);        
               pom.dispatchEvent(event);      
             } 
            else 
          {        
                pom.click();      
          }    
        },
 
 ///本地缓存处理
   _cache : function() {
    var k, v;
    k = arguments[0];
    if (arguments.length == 2) {
      v = arguments[1] || '';
      try {
        localStorage[k] = JSON.stringify(v);
         
        // return true;
      } catch (e) {

        if (typeof v == 'string')
          localStorage[k] = v.toString();
         
        // return false;
      }
    } else {
      try {
        return JSON.parse(localStorage[k]);
      } catch (e) {
        return localStorage[k];
      }
    }
  }
 
 
 

    };


    exports("miniSkin", miniSkin);
});