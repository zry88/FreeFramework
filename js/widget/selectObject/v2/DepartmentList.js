/**
 * Department Collection
 */
define([
	'baseApp_2015/collection/RemoteCollection',
	'widget/selectObject/v2/DepartmentModel'
], function(RemoteCollection, Model) {
	var DepartmentList = RemoteCollection.extend({
		model: Model,
		url: CONFIG.DATA_URI + '/department/read'
	});

	return new DepartmentList();
});