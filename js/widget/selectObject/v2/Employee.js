/**
 * 选择人员
 * Author: yrh
 * date: 2014-11-7
 * update: 2015-1-16
 */
define([
    "backbone",
    "widget/selectObject/v2/Common",
    "widget/pagination/view/AppView",
    "artDialog"
], function(Backbone, Common, PaginationView, artDialog) {
    var Template = '\
        <form class="form-horizontal employee-search" onsubmit="return false;"> \
            <div class="form-group"> \
                <div class="col-md-6"> \
                    <div class="input-group"> \
                        <input type="text" id="keywords" name="keywords" class="form-control" placeholder="请输入姓名或工号"> \
                        <span class="input-group-btn"> \
                            <button type="button" class="btn btn-primary btn-search"><i class="hi hi-search"></i></button> \
                        </span> \
                    </div> \
                </div> \
                <div class="col-md-6"> \
                    <div class="input-group"> \
                        <div class="col-md-12"> \
                        <label class="radio-inline" for="status1" style="cursor:pointer;">\
                            <input type="radio" id="status1" name="employee_current_status" value="1" checked> 在职\
                        </label>\
                        <label class="radio-inline" for="status2" style="cursor:pointer;">\
                            <input type="radio" id="status2" name="employee_current_status" value="0"> 离职\
                        </label>\
                        </div>\
                    </div> \
                </div> \
            </div> \
        </form> \
        <div class="table-responsive"> \
            <table id="employee-table" class="table table-striped table-vcenter table-bordered"> \
                <thead> \
                    <tr> \
                        <th class="text-center">工号</th> \
                        <th class="text-center">姓名</th> \
                        <th class="text-center">岗位</th> \
                        <th class="text-center">部门</th> \
                        <th class="text-center">状态</th> \
                    </tr> \
                </thead> \
                <tbody></tbody> \
            </table> \
            <div id="pagination_employee"></div> \
        </div>';
    var AppView = Backbone.View.extend({
        template: _.template(Template),
        events: {
            "click .employee-item a": "selectEmployee",
            "click .btn-search": "showList",
            "click [name=employee_current_status]": "changeStatus",
            "keydown #keywords": "enterSearch"
        },
        initialize: function(options) {
            var that = this;
            var defaults = {
                id: '#selectObject_0',
                field: "employee_id",
                type: "many",
                status: 1,
                collection: null,
            };
            this.opts = $.extend({}, defaults, options);
            this.collection = this.opts.collection;
            var html = this.$el.html(this.template(this.opts));
            this.dialog = artDialog({
                content: html,
                title: "请选择员工",
                quickClose: true,
                height: 250,
                width: 700
            });
            this.dialog.show($(this.opts.id).find('#object-result')[0]);
            this.stopListening(this.collection);
            this.listenTo(this.collection, "reset", this.render);
            this.collection.loadData({
                success: this.successFun,
                filter: {
                    employee_current_status: this.opts.status
                }
            });
        },
        render: function(){
            var that = this;
            var html = "";
            this.collection.each(function(model) {
                html += '<tr class="employee-item"> \
                        <td class="text-center">' + model.get("employee_code") + '</td> \
                        <td class="text-center"><a href="javascript:void(0);" data-id="' + model.attributes[that.opts.field] + '">' + model.get("employee_name") + '</a></td> \
                        <td class="text-center">' + model.get("pos_name") + '</td> \
                        <td class="text-center">' + model.get("dep_name") + '</td> \
                        <td class="text-center">' + (model.get("employee_current_status")=="1" ? "在职" : "离职") + '</td> \
                    </tr>';
            });
            this.$("#employee-table tbody").html(html);
            return this;
        },
        enterSearch: function(event){
            if(event.keyCode == 13) {
                this.showList();
            }
        },
        changeStatus: function(event){
            this.showList();
        },
        showList: function(){
            var value = this.$el.find("#keywords").val(),
                status = this.$el.find("[name=employee_current_status]:checked").val(),
                that = this,
                data = {
                    success: this.successFun,
                    param: {
                        limit: 20,
                        page: 1,
                    },
                    filter: {
                        param: $.trim(value),
                        employee_current_status: status
                    }
                };
            this.collection.loadData(data);
        },
        successFun: function(collection, response, options) {
            if(collection.totalPage > 1){
                var view = new PaginationView(collection);
                this.$('#pagination_employee').html(view.render().el);
            }
        },
        selectEmployee: function(event){
            event.preventDefault();
            if(this.opts.type == "one"){
                $(this.opts.id).find("button[data-employee]").data("employee", '');
                $(this.opts.id).find("li[data-type='employee']").remove();
                this.dialog.close().remove();
            }
            Common.addObject({
                id: this.opts.id,
                type: "employee", 
                element: $(event.currentTarget)
            });
            return false;
        }

    });
    return AppView;
});