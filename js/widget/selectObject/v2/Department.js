/**
 * 选择部门
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
            model.set("name", model.attributes.dep_name);
            if(model.attributes.dep_pid=="0") model.set("open", true);
            datas.push(model.attributes);
        });

        var setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "dep_id",
                    pIdKey: "dep_pid",
                    rootPId: 0
                }
            },
            callback: {
                beforeClick: beforeClick,
                onClick: onClick
            }
        };
        var className = "dark";
        var html = $('<ul class="ztree" id="department_'+opts.el+'"></ul>');

        var dialog = artDialog({
            content: html,
            title: "请选择部门",
            height: 230,
            quickClose: true
        });
        dialog.show($(opts.id).find('#object-result')[0]);
        $.fn.zTree.init($('#department_'+opts.el), setting, datas);

        function beforeClick(treeId, treeNode, clickFlag) {
            className = (className === "dark" ? "":"dark");
            return (treeNode.click != false);
        }
        function onClick(event, treeId, treeNode, clickFlag) {
            if(opts.type == "one"){
                $("input[name=department]").val("");
                $("li[data-type='department']").remove();
                dialog.close().remove();
            }
            Common.addObject({
                id: opts.id,
                type: "department", 
                obj: {id:treeNode.dep_id,name:treeNode.name}
            });
            return false;
        }
    };
    return AppView;
});