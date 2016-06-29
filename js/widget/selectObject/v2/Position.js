/**
 * 选择职位
 * Author: yrh
 * date: 2014-11-7
 */
define([
    "widget/selectObject/v2/Common",
    "artDialog",
    "ztree"
], function(Common, artDialog, tree) {
    var AppView = function(options){
        var defaults = {
            id: '#selectObject_0',
            el: "",     //触发对象
            type: "many",
            collection: null, //数据集
        };
        var opts = $.extend({}, defaults, options),
            that = this,
            datas = [],
            newData = [],
            dataStr = "";
        if(opts.el=="" || !opts.collection) return false;
        opts.collection.each(function(model) {
            model.unset("roles");
            model.set("name", model.attributes.pos_name);
            if(model.attributes.pos_parent=="0") model.set("open", true);
            datas.push(model.attributes);
        });
        var setting = {
            view: {
                dblClickExpand: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "pos_id",
                    pIdKey: "pos_parent",
                    rootPId: 0
                }
            },
            callback: {
                beforeClick: beforeClick,
                onClick: onClick
            }
        };
        var className = "dark";
        var html = $('<ul class="ztree" id="position_'+opts.el+'"></ul>');
        var dialog = artDialog({
            content: html,
            title: "请选择职位",
            height: 230,
            quickClose: true
        });

        dialog.show($(opts.id).find('#object-result')[0]);
        $.fn.zTree.init($('#position_' + opts.el), setting, datas);

        function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
        }
        function beforeClick(treeId, treeNode, clickFlag) {
            className = (className === "dark" ? "":"dark");
            return (treeNode.click != false);
        }
        function onClick(event, treeId, treeNode, clickFlag) {
            if(treeNode.pos_id){
                if(opts.type == "one"){
                    $("input[name=position]").val("");
                    $("li[data-type='position']").remove();
                    dialog.close().remove();
                }
                Common.addObject({
                    id: opts.id,
                    type: "position", 
                    obj: {id:treeNode.pos_id,name:treeNode.name}
                });
            }
            return false;
        }
        $('#position'+opts.el).slimScroll({
            width: "100%",
            height: "350",
            alwaysVisible:true
        });

    };
    return AppView;
});