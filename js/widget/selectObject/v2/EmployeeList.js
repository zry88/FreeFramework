/**
 * Employee Collection
 */
define([
	"baseApp_2015/collection/RemoteCollection",
	'widget/selectObject/v2/EmployeeModel'
], function(RemoteCollection, EmployeeModel) {
	var AppCollection = RemoteCollection.extend({
		model: EmployeeModel,
        initialize: function(options) {
            var config = _.extend(options || {}, {
				pageSize: 20,
				urlRoot: '/employee/read',
            });
            RemoteCollection.prototype.initialize.call(this, config);
        },
	});
	return new AppCollection();
});