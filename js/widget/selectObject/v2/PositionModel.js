/**
 * Position Model
 */
define([
    "baseApp/model/BaseNestifyModel",
    "systemApp/permit/model/RoleMap"
], function(BaseNestifyModel, RoleMap) {
    var Position = BaseNestifyModel.extend({
        // specify the id attribute
        idAttribute: "pos_id",
        urlRoot: CONFIG.DATA_URI + '/position',
        defaults: {
            roles: new RoleMap(),
            
            /*
             * 部门信息
             */
            dep_id: 0, // 所属部门ID
            dep_id_value: "", // 所属部门名称
            /*
             * 职位信息
             */
            pos_name: '', // 职位名称,
            pos_organize: 0, // 编制人员
            pos_exist: 0, // 现有人员
            pos_desc: "",
            pos_parent: "", // 上级岗位
            pos_parent_value: "", // 上级岗位
            /*
             * 职位模板
             */
            attendance_tpl: "",
            attendance_tpl_value: "",
            insurance_tpl: "",
            insurance_tpl_value: "",
            salary_tpl: "",
            salary_tpl_value: ""
        },
        initialize: function() {
            BaseNestifyModel.prototype.initialize.apply(this, arguments);

            var exist = this.get('pos_exist');
            var organize = this.get('pos_organize');

            // 现有人数元素类型
            var statusClass = 'btn-default';
            if (exist < organize) {
                statusClass = 'btn-warning'; // 缺编
            }
            if (exist > organize) {
                statusClass = 'btn-primary'; // 超编
            }

            this.set('statusClass', statusClass);
        }
    },
    BaseNestifyModel.Nestify({
        roles: RoleMap
    }));

    return Position;
});