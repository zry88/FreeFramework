/*
 * 数据表格列元素类
 * @author: yrh
 * @create: 2016/6/28
 * @update: 2016/7/7
 */
define([
    'core/view/View',
    'core/view/component/Panel',
    'core/view/component/Table',
    'core/view/component/Dropdown',
], function(BaseView, PanelView, TableView, DropdownView) {
    var View = BaseView.extend({
        events: {
            'change th > input[type="checkbox"]': 'selectAll',
            'change td > input[type="checkbox"]': 'selectOne',
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'table table-hover',
                        style: {
                            height: '100%',
                            borderRadius: 0,
                        },
                        selectable: false, //是否可选
                        hideColSetting: false,
                        hideScroll: false,
                        thead: {
                            hide: false,
                            textAlign: 'left'
                        },
                        tbody: {
                            hide: false,
                        },
                        tfoot: {
                            hide: false,
                        },
                        columns: [],
                        pageSize: 40,
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option || {});
            this.tableWidth = 0;
            this.listView = null;
            this.parent(defaults);
            if (!_.isArray(this.options.data)) {
                // 获取数据
                this.stopListening(this.options.data);
                this.listenTo(this.options.data, "remove", this.changeData);
                this.listenTo(this.options.data, "reset", this.changeData);
                FUI.Events.off(this.options.data.key);
                FUI.Events.on(this.options.data.key, this.changeData, this);
            }
            // 其他事件
            FUI.Events.off(null, null, this);
            FUI.Events.on(this.id + ':showHideCol', this._showHideCol, this);

            var hasSub = _.pluck(this.options.columns, 'children'),
                result = _.filter(hasSub, function(col) {
                    return col;
                });
            this.headerHeight = !this.options.thead.hide ? (result.length ? '72px' : '39px') : 0;
            this.settingHeight = !this.options.thead.hide ? (result.length ? '71px' : '38px') : 0;
            // 列宽
            this._getColWidth();
            var dataTableStyle = {
                    marginBottom: 0,
                    height: '100%',
                    position: 'relative',
                    borderRadius: 0,
                    overflow: 'hidden'
                },
                headerStyle = {
                    padding: 0,
                    minHeight: 'inherit',
                    paddingRight: this.options.hideColSetting ? 0 : '17px',
                    borderTop: '1px #ddd solid',
                    borderBottom: '1px #ddd solid',
                    overflowX: 'auto',
                    borderRadius: 0,
                    position: 'relative'
                },
                bodyStyle = {
                    padding: 0,
                    overflowY: this.options.hideScroll ? 'hidden' : 'scroll',
                    position: 'absolute',
                    marginBottom: (this.options.tfoot.hide ? 0 : 48) + 'px',
                    marginTop: this.headerHeight,
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                },
                footerStyle = {
                    position: 'absolute',
                    borderRadius: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '48px'
                };
            FUI.view.create({
                key: this.id + '_panel',
                el: this.$el,
                view: PanelView,
                context: this,
                inset: 'html',
                options: {
                    style: this.options.style ? _.extend(dataTableStyle, this.options.style) : dataTableStyle,
                    header: {
                        html: '',
                        hide: this.options.thead.hide,
                        className: 'panel-heading border-light',
                        style: this.options.thead.style ? _.extend(this.options.thead.style, headerStyle) : headerStyle,
                    },
                    body: {
                        html: this.options.tbody.html || '',
                        style: this.options.tbody.style ? _.extend(this.options.tbody.style, bodyStyle) : bodyStyle,
                    },
                    footer: {
                        html: this.options.tfoot.html || '&nbsp',
                        hide: this.options.tfoot.hide,
                        style: this.options.tfoot.style ? _.extend(this.options.tfoot.style, footerStyle) : footerStyle
                    }
                }
            });
            this.colsData = [];
            _.each(this.options.columns, function(val, index) {
                if (val.children) {
                    _.each(val.children, function(col, i) {
                        col.hide = col.hide || false;
                        col.index = index + '_' + i;
                        that.colsData.push(col);
                    });
                } else {
                    val.hide = val.hide || false;
                    val.index = index;
                    that.colsData.push(val);
                }
            });
            // 显示和隐藏列
            if (!this.options.hideColSetting && !result.length) {
                this._colSetting();
            }
            this.renderAll();
            // 同步横向滚动
            var heading = this.$('.panel-heading');
            this.$('.panel-body').scroll(function() {
                heading.scrollLeft($(this).scrollLeft());
            });
        },
        changeData: function(collection) {
            var newData = [];
            collection.each(function(model, index) {
                newData.push(model.attributes);
            });
            this.options.data = newData;
            this.renderAll();
        },
        renderAll: function() {
            var tableWidth = 0;
            if (this.options.data.length) {
                this.$('#' + this.id + '_header').remove();
                FUI.view.create({
                    key: this.id + '_header',
                    el: this.$('.panel-heading'),
                    view: TableView,
                    context: this,
                    inset: 'html',
                    options: {
                        selectable: this.options.selectable, //是否可选
                        thead: {
                            textAlign: this.options.thead.textAlign
                        },
                        tbody: {
                            hide: true,
                        },
                        tfoot: {
                            hide: true,
                        },
                        columns: this.options.columns,
                        colsData: this.colsData,
                        style: {
                            backgroundColor: 'transparent',
                            width: this.tableWidth || '100%',
                            marginBottom: 0
                        }
                    }
                });
                this.$('#' + this.id + '_bodyer').remove();
                this.listView = FUI.view.create({
                    key: this.id + '_bodyer',
                    el: this.$('.panel-body'),
                    view: TableView,
                    context: this,
                    inset: 'html',
                    options: {
                        selectable: this.options.selectable, //是否可选
                        thead: {
                            hide: true,
                        },
                        tfoot: {
                            hide: true,
                        },
                        columns: this.options.columns,
                        colsData: this.colsData,
                        data: this.options.data,
                        style: {
                            width: this.tableWidth || '100%',
                            marginBottom: 0,
                        }
                    }
                });
            }
            return this;
        },
        // 获取列宽
        _getColWidth: function() {
            // console.warn(this.$el.width());
            var colWidth = 20,
                that = this,
                colArr = _.filter(this.options.columns, function(val) {
                    return !val.hide && !val.children;
                }),
                hasSub = _.pluck(this.options.columns, 'children'),
                result = _.filter(hasSub, function(col) {
                    return col;
                }),
                theChildren = result.length ? _.flatten(result) : [];
            colArr = _.union(colArr, theChildren);
            if (colArr.length) {
                colWidth = ((100 / colArr.length) - 1);
                if (colWidth < 20) colWidth = 20;
            }
            var getWidth = function(val) {
                if (!val.style) {
                    that.tableWidth = '100%';
                    val.style = {
                        width: colWidth + '%'
                    }
                } else {
                    if (val.style.width && that.tableWidth != '100%') {
                        that.tableWidth += parseInt(val.style.width.replace(/px/, ''));
                    } else {
                        that.tableWidth = '100%';
                        val.style.width = colWidth + '%';
                    }
                }
            };
            _.each(colArr, function(val, index) {
                if (val.children) {
                    _.each(val.children, function(col, i) {
                        getWidth(col);
                    });
                } else {
                    getWidth(val);
                }
            });
        },
        // 显示隐藏列下拉菜单
        _colSetting: function() {
            var that = this;
            var Dropdown = DropdownView.extend({
                events: {
                    'click': '_clickItem',
                    'click .checkbox': '_clickCheckbox'
                },
                initialize: function(option) {
                    this.parent(option);
                },
                _clickCheckbox: function(event) {
                    event.stopPropagation();
                    var target = $(event.currentTarget),
                        theCheckbox = target.find('input[type="checkbox"]'),
                        index = target.data('index'),
                        isShow = theCheckbox.is(':checked') ? 1 : 0;
                    var col = _.findWhere(this.colsData, { index: index });
                    if (col) {
                        col.hide = !isShow;
                    }
                    FUI.Events.trigger(that.id + ':showHideCol', { show: isShow, index: index });
                }
            });
            var itemsTpl = [
                '<a href="javascript:;"><div class="checkbox" style="margin:0" data-index="<%= index %>"><label>',
                '<input type="checkbox" value="" <%= !hide ? "checked=\'checked\'" : "" %>>',
                ' <%= text ? text : "" %></label></div></a>',
            ].join('');
            var colsSetting = FUI.view.create({
                key: this.id + '_cols_setting',
                el: this.$el,
                view: Dropdown,
                context: this,
                options: {
                    style: {
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '18px',
                        height: this.settingHeight,
                        borderLeft: '1px #ddd solid',
                        // borderBottom: '1px #ddd solid'
                    },
                    className: 'dropdown cols_setting',
                    direction: 'down',
                    button: [{
                        className: 'btn btn-default dropdown-toggle',
                        style: {
                            border: 'none',
                            borderRadius: 0,
                            padding: '6px 5px',
                            height: '100%',
                            backgroundColor: 'transparent',
                        }
                    }],
                    itemsTpl: itemsTpl,
                    data: this.colsData
                }
            });
        },
        // 显示和隐藏列
        _showHideCol: function(data) {
            this.$('.table tr').each(function(index, el) {
                var subCount = $(el).children().length,
                    theTd = $(el).children().eq(data.index + 1);
                if (theTd.length) {
                    if (data.show) {
                        theTd.show();
                        theTd.css('width', theTd.data('width'));
                        if (data.index != 0) {
                            theTd.prev().css('width', theTd.prev().data('width'));
                        }
                    } else {
                        theTd.hide();
                    }
                    if ($(el).children(':visible').length > 1) {
                        $(el).children(':visible').last().width('auto');
                    }
                }
            });
        },
        // 选中一条
        selectOne: function(event) {
            this.listView.selectOne(event);
        },
        // 选择全部
        selectAll: function(event) {
            this.listView.selectAll(event);
        },
        // 获取
        getSelectedRow: function() {
            var rows = _.where(this.listView.options.data, { selected: true });
            return rows ? rows : [];
        },
    });
    return View;
});
