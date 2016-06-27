/**
 * Department Model
 */
define([
    "baseApp/model/BaseNestifyModel",
    "systemApp/permit/model/RoleMap"
], function(BaseNestifyModel, RoleMap) {
    var Department = BaseNestifyModel.extend({
        // specify the id attribute
        idAttribute: "dep_id",
        urlRoot: CONFIG.DATA_URI + "/department",
        defaults: {
            roles: new RoleMap()
        },
        initialize: function() {
            BaseNestifyModel.prototype.initialize.apply(this, arguments);
        }
    },
    BaseNestifyModel.Nestify({
        roles: RoleMap
    }));

    return Department;
});