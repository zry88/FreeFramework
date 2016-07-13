/*
 * 布局视图基类
 * @author: yrh
 * @create: 2015/1/29
 * @update: 2016/6/20
*  var config = {
*   guide: {
*
*   },
    layout: {

    },
    widgets: {
        key: {
            src: '',    //插件路径
            name: '',   //插件名
            params: {   //数据源参数
                reset: false,
                url: '',
                data: {}
            },
            target: '', //渲染目标节点ID
            binds: {    //事件交互绑定
                'widgetKey:triggerEvent': 'selfKey:onEvent',
                'widgetKey:triggerEvent': 'selfKey2:onEvent',
            },
            options: {} //其他参数
        }
    }
};
 */
define([
    'lib/view/View',
    'lib/view/element/Row',
    'lib/view/element/Col',
    'lib/view/component/Guide',
], function(BaseView, Row, Col, Guide) {
    var View = BaseView.extend({
        className: 'container-fluid',
        initialize: function(option) {
            var that = this;
            this.bindEvent = {}; //事件存放对象
            this.parent(option);
            // 新手引导
            if (!window.localStorage.getItem(option.key) && this.options.guide) {
                FUI.view.create({
                    key: "guide",
                    el: 'body',
                    view: Guide,
                    options: that.options.guide
                });
            }
            var layout = this.options.layout || {},
                widgets = this.options.widgets || {};
            // 渲染布局
            if (layout.rows) {
                _.each(layout.rows, function(row, index) {
                    var theRow = layout.rows[index] || {},
                        rowKey = 'row_' + index,
                        rowOption = {
                            className: 'row',
                        };
                    if (theRow) $.extend(true, rowOption, theRow);
                    var RowView = FUI.view.create({
                        key: rowKey,
                        el: that.$el,
                        view: Row,
                        context: that,
                        options: rowOption
                    });
                    if (row.cols) {
                        var colCount = row.cols.length;
                        if (colCount > 12) colCount = 12;
                        _.each(row.cols, function(col, i) {
                            var theCol = row.cols[i] || {},
                                colKey = rowKey + '-col_' + i,
                                colOption = {
                                    className: col.className ? col.className : ('col-md-' + 12 / colCount),
                                };
                            if (theCol) $.extend(true, colOption, theCol);
                            var ColView = FUI.view.create({
                                key: colKey,
                                el: that.$el.find('#' + rowKey),
                                view: Col,
                                context: that,
                                options: colOption
                            });
                        });
                    }
                });
            }
            // 渲染插件
            if (!_.isEmpty(widgets)) {
                _.each(widgets, function(widget, index) {
                    if (widget.name) {
                        require([widget.src], function(obj) {
                            FUI.view.create({
                                key: widget.key,
                                el: widget.target ? ('#' + widget.target) : undefined,
                                context: that,
                                view: FUI.widgets[widget.name],
                                params: widget.params || undefined,
                                options: widget.options || {},
                            });
                        });
                        if (widget.binds) {
                            _.each(widget.binds, function(val, key) {
                                if (that.bindEvent[key]) {
                                    that.bindEvent[key].push(val);
                                } else {
                                    that.bindEvent[key] = [val];
                                }
                            });
                        }
                    } else {
                        debug.warn(widget.src, '插件名为空的');
                    }
                });
            }
            // 绑定事件
            _.each(this.bindEvent, function(val, key) {
                if (!that[key]) {
                    that[key] = function(data) {
                        _.each(that.bindEvent[key], function(val, index) {
                            var newVal = that.id + ':' + val;
                            FUI.Events.trigger(newVal, data);
                        });
                    };
                }
                FUI.Events.on(that.id + ':' + key, that[key], that);
            });
            // console.warn(this);
        },
        trigger: function() {
            var thisId = this.id,
                data = arguments.callee.caller.arguments,
                method = arguments.callee.caller.__name;
            _.each(this.bindEvent[method], function(val, index) {
                switch (data.length) {
                    case 1:
                        FUI.Events.trigger(thisId + ':' + val, data[0]);
                        break;
                    case 2:
                        FUI.Events.trigger(thisId + ':' + val, data[0], data[1]);
                        break;
                    case 3:
                        FUI.Events.trigger(thisId + ':' + val, data[0], data[1], data[2]);
                        break;
                    case 4:
                        FUI.Events.trigger(thisId + ':' + val, data[0], data[1], data[2], data[3]);
                        break;
                }
            });
        }
    });
    return View;
});
