/*
 * 数据表格通用组件类
 * @author: yrh
 * @create: 2016/6/28
 * @update: 2016/7/9
 */
define([
    'core/view/View',
    'core/view/component/Panel',
    'core/view/component/Table',
    'core/view/component/Dropdown',
], function(BaseView, PanelView, TableView, DropdownView) {
    var View = BaseView.extend({
        events: {
            'change th input[type="checkbox"]': 'selectAll',
            'mousemove th': '_mousemoveTh',
            'mousedown .colHandler': '_mousedownTh',
            'click th > div': 'sortData'
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
                        selectAble: false, //是否可选
                        changeWidthAble: false, //是否可以拖动改变列宽
                        sortAble: false, //是否可排序
                        hideColSetting: false, //隐藏列设置
                        hideScroll: false, //隐藏竖滚动条
                        thead: {
                            hide: false,
                            colStyle: {
                                textAlign: 'left',
                                padding: 0
                            }
                        },
                        tbody: {
                            hide: false,
                        },
                        tfoot: {
                            hide: false,
                            style: {
                                padding: 0
                            }
                        },
                        columns: [],
                        pageSize: 40,
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option || {});
            this.tableWidth = 0;
            this.listView = null;
            this.collection = null;
            this.parent(defaults);
            // 其他事件
            FUI.Events.off(null, null, this);
            FUI.Events.on(this.id + ':showHideCol', this._showHideCol, this);

            var hasSub = _.pluck(this.options.columns, 'children');
            this.result = _.filter(hasSub, function(col) {
                return col;
            });
            this.headerHeight = !this.options.thead.hide ? (this.result.length ? '72px' : '39px') : 0;
            this.settingHeight = !this.options.thead.hide ? (this.result.length ? '71px' : '38px') : 0;
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
            this.colsData = [],
                this.dropdownData = [];
            _.each(this.options.columns, function(val, index) {
                if (val.children) {
                    _.each(val.children, function(col, i) {
                        col.hide = col.hide || false;
                        col.index = index + '_' + i;
                        that.colsData.push(col);
                        var _col = $.extend({}, col);
                        delete _col.style;
                        that.dropdownData.push(_col);
                    });
                } else {
                    val.hide = val.hide || false;
                    val.index = index;
                    var _val = $.extend({}, val);
                    delete _val.style;
                    that.colsData.push(val);
                    that.dropdownData.push(_val);
                }
            });
            // 显示和隐藏列
            if (!this.options.hideColSetting && !this.result.length) {
                this._colSetting();
            }
            if (!_.isArray(this.options.data)) {
                // 获取数据
                this.stopListening(this.options.data);
                // this.listenTo(this.options.data, "remove", this._makeData);
                this.listenTo(this.options.data, "reset", this._makeData);
                FUI.Events.off(this.options.data.key);
                FUI.Events.on(this.options.data.key, this._makeData, this);
            }else{
                this.renderAll();
            }
            // 同步横向滚动
            var heading = this.$('.panel-heading');
            this.$('.panel-body').scroll(function() {
                heading.scrollLeft($(this).scrollLeft());
            });
            // 禁止选中
            if (this.options.changeWidthAble) {
                heading.on("selectstart", function() {
                    return false;
                });
            }
        },
        // 组装数据集数据
        _makeData: function(collection) {
            var newData = [];
            this.collection = collection;
            collection.each(function(model, index) {
                newData.push(model.attributes);
            });
            this.options.data = newData;
            this.renderAll();
        },
        // 渲染视图
        renderAll: function() {
            var tableWidth = 0;
            if (this.options.data.length) {
                // 表头
                this.$('#' + this.id + '_header').remove();
                FUI.view.create({
                    key: this.id + '_header',
                    el: this.$('.panel-heading'),
                    view: TableView,
                    context: this,
                    inset: 'html',
                    options: {
                        selectAble: this.options.selectAble, //是否可选
                        sortAble: this.options.sortAble,
                        changeWidthAble: this.options.changeWidthAble,
                        thead: {
                            style: this.options.thead.style,
                            colStyle: this.options.thead.colStyle,
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
                // 光标小竖线
                var theLine = $('<div id="line"/>');
                theLine.css({
                    width: '1px',
                    height: '100%',
                    borderLeft: '1px solid #000000',
                    position: 'absolute',
                    top: 0,
                    display: 'none'
                });
                this.$('.panel-heading').append(theLine);
                // 表体
                this.$('#' + this.id + '_bodyer').remove();
                this.listView = FUI.view.create({
                    key: this.id + '_bodyer',
                    el: this.$('.panel-body'),
                    view: TableView,
                    context: this,
                    inset: 'html',
                    options: {
                        selectAble: this.options.selectAble, //是否可选
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
        // 拖动列宽
        _mousemoveTh: function(event) {
            if (this.options.changeWidthAble && !this.result.length) {
                var th = $(event.currentTarget);
                //不给第一列和最后一列添加效果
                if (th.prevAll().length <= 0 || th.nextAll().length < 1) {
                    return;
                }
                var left = th.offset().left;
                //距离表头边框线左右4像素才触发效果
                if (event.clientX - left < 0 || (th.width() - (event.clientX - left)) < 5) {
                    th.find('.colHandler').css({ 'cursor': 'col-resize' });
                } else {
                    th.find('.colHandler').css({ 'cursor': 'default' });
                }
            }
        },
        // 按下拖动列宽
        _mousedownTh: function(event) {
            var that = this,
                lineEl = this.$("#line"),
                currTh = $(event.currentTarget).parent().parent(),
                isMove = 0;
            if (this.options.changeWidthAble && !this.result.length) {
                this.$('.panel-heading').on("mousemove.datatable", function(e) {
                    isMove = 1;
                    var pos = $(this).offset();
                    lineEl.css({ "left": e.clientX - pos.left }).show();
                }).on('mouseup.datatable', function(e) {
                    $(this).off('mousemove.datatable');
                    if (isMove) {
                        isMove = 0;
                        lineEl.hide();
                        var pos = currTh.offset(),
                            index = currTh.prevAll().length,
                            colWidth = e.clientX - pos.left,
                            theCol = that.colsData[that.options.selectAble ? (index - 1) : index];
                        if (theCol) {
                            if (theCol.style) {
                                theCol.style.width = colWidth + 'px';
                            } else {
                                theCol.style = {
                                    width: colWidth + 'px'
                                }
                            }
                        }
                        currTh.width(colWidth);
                        that.$(".panel-body tr").each(function(i, el) {
                            $(el).children().eq(index).width(colWidth - 17);
                        });
                        $(this).off('mouseup.datatable');
                    }
                });
            }
        },
        // 获取列宽
        _getColWidth: function() {
            var colWidth = 20,
                that = this,
                colArr = _.filter(this.options.columns, function(val) {
                    return !val.hide && !val.children;
                }),
                theChildren = this.result.length ? _.flatten(this.result) : [];
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
                    data: this.dropdownData
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
        // 选择全部行
        selectAll: function(event) {
            this.listView.selectAll(event);
        },
        // 获取选中行
        getSelectedRow: function() {
            var rows = _.where(this.listView.options.data, { selected: true });
            return rows ? rows : [];
        },
        // 排序
        sortData: function(event) {
            if (this.options.sortAble && !this.result.length) {
                var target = $(event.currentTarget),
                    th = target.parent(),
                    columns = this.options.columns,
                    theCol = columns[th[0].cellIndex - (this.options.selectAble ? 1 : 0)];
                        // console.warn('ddddddddddd', this.collection);
                if(theCol){
                    theCol.sortOrder = theCol.sortOrder == 'up' ? 'down' : 'up';
                    if(this.collection){
                        this.collection.loadData();
                    }else{
                        // this.renderAll();
                    }
                }
            }
        }
    });
    return View;
});
