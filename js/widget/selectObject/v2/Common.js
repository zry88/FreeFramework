/**
 * 公共类
 * Author: yrh
 * create: 2015/2/9
 * update: 2015/2/10
 */
define([
    "tool",
], function(Tool) {
    var AppView = {
        //添加/初始化数据
        addObject: function(options) {
            var that = this;
            var defaults = {
                id: '',
                type: '',
                element: null,
                obj: null
            };
            if (options) _.extend(defaults, options);
            if (!defaults.id || !defaults.type) return false;
            var target = $(defaults.id).find(".object-list"),
                type = defaults.type,
                dataTarget = $(defaults.id).find("button[data-" + type + "]"),
                id = '',
                text = '';

            if (!defaults.obj && defaults.element) {
                if (_.has(defaults.element, "jquery")) {
                    id = element.data("id");
                    text = element.text();
                } else {
                    id = $(defaults.element).data("id");
                    text = $(defaults.element).text();
                }
            } else if (defaults.obj) {
                id = defaults.obj.id;
                text = defaults.obj.name;
            }
            var result = target.find("li[data-type='" + type + "'][data-id='" + id + "']");
            if (result.length == 0) {
                var labelClass = "label-primary";
                if (type == "department") {
                    labelClass = "label-warning";
                }
                if (type == "position") {
                    labelClass = "label-danger";
                }

                var html = '<li class="label ' + labelClass + '" data-type="' + type + '" data-id="' + id + '">' + text + ' <a href="javascript:;"> <i class="fa fa-times"></i></a></li>';
                target.append(html);

                var oldValue = dataTarget.data(type);
                var value = [];
                if (oldValue != "") value = oldValue.split(",");
                value.push(id);
                dataTarget.data(type, value.join(","));
            }

            target.find(".label").unbind("click").bind("click", function(event) {
                that.removeObject(event, this);
            });
        },
        removeObject: function(event, element) {
            var type = $(element).data("type"),
                id = $(element).data("id"),
                code = $(element).data("code"),
                dataTarget = $("button[data-" + type + "]"),
                oldValue = dataTarget.data(type).split(",");
            var newVal = _.filter(oldValue, function(t) {
                return t != id;
            });
            dataTarget.data(type, newVal.join(","));
            element.remove();
        },

    };
    return AppView;
});