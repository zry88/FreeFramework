/*
 * Position Collection
 */
define([
	'baseApp_2015/collection/RemoteCollection',
    'widget/selectObject/v2/PositionModel'
], function(RemoteCollection, Model) {
    var PositionList = RemoteCollection.extend({
        model: Model,
        url: CONFIG.DATA_URI + '/position/read'
    });
    return new PositionList();
});