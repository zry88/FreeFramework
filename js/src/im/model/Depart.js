/**
 * 部门
 */
define([
    "lib/core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'id',
        defaults: {
            id: 0, //ID
            count: 0,
            name: "", //""
            children: []
        }
    });
    return Model;
});
