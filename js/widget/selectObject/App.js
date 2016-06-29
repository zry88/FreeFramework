/**
 * 选择对象插件
 * Author: yrh
 * date: 2014-11-10
 * update: 2015-2-10
 * 获取返回数据：
 */
define([
    'backbone',
    "widget/selectObject/v2/PositionList",
    "widget/selectObject/v2/DepartmentList",
    "widget/selectObject/v2/EmployeeList",
    "widget/selectObject/v2/Position",
    "widget/selectObject/v2/Department",
    "widget/selectObject/v2/Employee",
    "text!widget/selectObject/v2/template.html",
], function(Backbone, PositionList, DepartmentList, EmployeeList, Position, Department, Employee, Template) {
    var AppView = Backbone.View.extend({
        template: _.template(Template),
        events: {
            "click [data-position]": "showPosition",
            "click [data-department]": "showDepartment",
            "click [data-employee]": "showEmployee",
            "click input[name='receive_type']": "selectType",
        },
        initialize: function(options) {
            var options = options || {};
            this.defaults = {
                type: "many", //单选"one", 多选"many"
                objects: [
                    {
                        type: "many",
                        name: "position"
                    },{
                        type: "many",
                        name: "department"
                    },{
                        field: "employee_id",   //指定反回字段
                        type: "many",
                        name: "employee"
                    }
                ], //对象列表"Position", "Department", "Employee"
            };
            this.opts = $.extend({}, this.defaults, options);
            var that = this;
            this.el.id = this.id = 'selectObject_' + this.opts.num || 0;
            this.$el.html(this.template(this.opts));
            // Tool.loadCss([
            //     "js/lib/plugin/zTree/css/zTreeStyle.css",
            // ]);
            this.listenTo(PositionList, "reset", this.render);
            this.listenTo(DepartmentList, "reset", this.render);
            PositionList.fetch({
                reset: true,
                success: function(){
                    that.$("#btn3").show();
                    if(that.opts.type=="one") that.$("#inlineRadio3").parent().show();
                }
            });
            DepartmentList.fetch({
                reset: true,
                success: function(){
                    DepartmentList.models = that.sortOrder(DepartmentList.models);
                    that.$("#btn2").show();
                    if(that.opts.type=="one") that.$("#inlineRadio2").parent().show();
                }
            });
            this.$("#btn1").show();
            if(this.opts.type=="one") this.$("#inlineRadio4").parent().show();
        },
        render: function() {
            return this;
        },
        selectType: function(){
            var typeVal = this.$("input[name='receive_type']:checked").val(),
                selectObject = this.$("#select_object");
            this.$(".object-list").empty();
            this.$("input[name='position'],input[name='department'],input[name='employee']").val("");
            if(typeVal>0){
                this.$("#is_all").val("0");
                selectObject.show();
            }else{
                this.$("#is_all").val("1");
                selectObject.hide();
            }
            this.$(".box button").hide().siblings("#btn"+typeVal).show();
        },
        showPosition: function() {
            var theOption = _.findWhere(this.opts.objects, {name: "position"});
            new Position({
                id: '#' + this.id,
                el: "position",
                type: theOption.type,
                collection: PositionList
            });
        },
        showDepartment: function() {
            var theOption = _.findWhere(this.opts.objects, {name: "department"});
            new Department({
                id: '#' + this.id,
                el: "department",
                type: theOption.type,
                collection: DepartmentList
            });
        },
        showEmployee: function() {
            var theOption = _.findWhere(this.opts.objects, {name: "employee"});
            new Employee({
                id: '#' + this.id,
                field: theOption.field,
                type: theOption.type,
                status: 1,
                collection: EmployeeList
            });
        },
        sortOrder: function(resp){
            resp = _.sortBy(resp, function(model){
                return parseInt(model.attributes.dep_order); 
            });
            return resp;
        }

    });
    return AppView;
});