define(['core', 'tpl', 'biz/goods/picker'], function (core, tpl, picker) {
    var defaults = {keywords: '', isrecommand: '', ishot: '', isnew: '', isdiscount: '', issendfree: '', istime: '', cate: '', order: '', by: 'desc'};
    var modal = {page: 1, params: {}, stop: 0, indexPage: 1, indexStop: false};
    modal.initSet = function () {
        $('.fui-uploader').uploader({uploadUrl: core.getUrl('util/uploader'), remove: true, removeIcon: 'icon icon-close', removeUrl: core.getUrl('util/uploader/remove')});
        $('.btn-submit').click(function () {
            var btn = $(this);
            if (btn.attr('stop')) {
                return
            }
            var html = btn.html();
            var logo = $('#imageLogo').find('li:first-child');
            var img = $('#imageImg').find('li:first-child');
            var data = {name: $('#shopname').val(), desc: $('#desc').val(), logo: logo.length > 0 ? logo.data('filename') : '', img: img.length > 0 ? img.data('filename') : ''};
            btn.attr('stop', 1).html('正在处理...');
            core.json('commission/myshop/set', {shopdata: data}, function (pjson) {
                if (pjson.status == 0) {
                    btn.removeAttr('stop').html(html);
                    FoxUI.toast.show(pjson.result.message);
                    return
                }
                location.href = core.getUrl('commission')
            }, true, true)
        })
    };
    modal.initSelect = function () {
        $('#openselect').change(function () {
            var $this = $(this);
            if ($this.prop('checked')) {
                $('#divselect').show()
            } else {
                $('#divselect').hide()
            }
        });
        $('.container').lazyload();
        $('.menu nav').click(function () {
            $('.container').infinite('init');
            var item = $(this);
            item.siblings().removeClass("on");
            item.addClass("on");
            $('.goods-list-group').html('');
            modal.params = {isnew: item.data('isnew') || '', ishot: item.data('ishot') || '', isrecommand: item.data('isrecommand') || '', isdiscount: item.data('isdiscount') || '', keywords: $('#keywords').val(), istime: item.data('istime') || '', cate: item.data('cate') || '', nocommission: 0, order: "", by: ""};
            modal.page = 1, modal.stop = 0;
            modal.getList()
        });
        $('.btn-submit').click(function () {
            var btn = $(this);
            if (btn.attr('stop')) {
                return
            }
            var html = btn.html();
            var goodsids = [];
            $(".goods-selected").each(function () {
                goodsids.push($(this).data('goodsid'))
            });
            if (goodsids.length <= 0 && $('#openselect').prop('checked')) {
                FoxUI.toast.show('请选择商品!');
                return
            }
            var data = {selectgoods: $('#openselect').prop('checked') ? 1 : 0, selectcategory: $('#opencategory').prop('checked') ? 1 : 0, goodsids: goodsids};
            btn.attr('stop', 1).html('正在处理...');
            core.json('commission/myshop/select', data, function (pjson) {
                if (pjson.status == 0) {
                    btn.removeAttr('stop').html(html);
                    FoxUI.toast.show(pjson.result.message);
                    return
                }
                location.href = core.getUrl('commission')
            }, true, true)
        });
        modal.bindSelectedEvents();
        $('.container').infinite({
            onLoading: function () {
                modal.getList()
            }
        });
        if (modal.page == 1) {
            modal.getList()
        }
    };
    modal.getList = function () {
        if (modal.stop == 0) {
            modal.params.page = modal.page;
            core.json('goods/query', modal.params, function (ret) {
                var result = ret.result;
                if (result.total <= 0) {
                    $('.goods-list-group').hide();
                    $('.empty').show();
                    $('.container').infinite('stop')
                } else {
                    $('.goods-list-group').show();
                    $('.empty').hide();
                    $('.container').infinite('init');
                    if (result.list.length <= 0 || result.list.length < result.pagesize) {
                        $('.container').infinite('stop');
                        modal.stop = 1
                    } else {
                        modal.page++
                    }
                }
                core.tpl('.goods-list-group', 'tpl_commission_goods_select', result, modal.page > 1);
                modal.bindEvents()
            })
        }
    };
    modal.bindEvents = function () {
        $('.container').lazyload();
        $(".fui-page").removeAttr('style');
        $('.goods-list-group .goods-item').each(function () {
            var goodsid = $(this).data('goodsid');
            if ($(".goods-selected[data-goodsid='" + goodsid + "']").length > 0) {
                $(this).find(':checkbox').prop('checked', true)
            }
        });
        $('.goods-list-group .fui-switch').click(function () {
            var $this = $(this), checked = $this.prop('checked');
            var goodsid = $this.closest('.goods-item').data('goodsid');
            if (checked) {
                if ($(".goods-selected[data-goodsid='" + goodsid + "']").length <= 0) {
                    var item = $(this).closest('.goods-item');
                    var itemHTML = tpl('tpl_commission_goods_item', {g: {id: goodsid, title: item.data('title'), marketprice: item.data('marketprice'), thumb: item.data('thumb')}});
                    $(".goods-selected-group").prepend(itemHTML)
                }
            } else {
                if ($(".goods-selected[data-goodsid='" + goodsid + "']").length > 0) {
                    $(".goods-selected[data-goodsid='" + goodsid + "']").remove()
                }
            }
            if ($(".goods-selected").length > 0) {
                $('.goods-selected-group').show();
                modal.bindSelectedEvents()
            } else {
                $('.goods-selected-group').hide()
            }
        });
        $('.buy').unbind('click').click(function () {
            var goodsid = $(this).closest('.fui-goods-item').data('goodsid');
            picker.open({goodsid: goodsid, total: 1})
        })
    };
    modal.bindSelectedEvents = function () {
        $('.goods-selected-group .btn-delete').click(function () {
            $(this).closest('.goods-selected').remove()
        })
    };
    modal.init = function (mid) {
        modal.indexMid = mid;
        if (typeof(window.cartcount) !== 'undefined') {
            picker.changeCartcount(window.cartcount)
        }
        modal.bindEvents();
        $('.fui-content').infinite({
            onLoading: function () {
                modal.getIndexList()
            }
        });
        $('.btn-favorite').click(function () {
            $('#cover').fadeIn(200).click(function () {
                $('#cover').hide()
            })
        });
        if (modal.indexPage == 1) {
            modal.getIndexList()
        }
    };
    modal.getIndexList = function () {
        if (modal.indexStop) {
            return
        }
        core.json('commission/myshop/get_goods', {page: modal.indexPage, mid: modal.indexMid}, function (ret) {
            var result = ret.result;
            if (result.total <= 0) {
                $('.infinite-loading').hide();
                $('.xiaodian').hide();
                $('#container').hide().$('.fui-content').infinite('stop')
            } else {
                $('#container').show();
                $('.xiaodian').show();
                $('.fui-content').infinite('init');
                if (result.list.length <= 0 || result.list.length < result.pagesize) {
                    $('.fui-content').infinite('stop');
                    modal.indexStop = true
                } else {
                    modal.indexPage++
                }
            }
            core.tpl('#container', 'tpl_commission_myshop_goods_list', result, modal.indexPage > 1);
            modal.bindEvents()
        })
    };
    return modal
});