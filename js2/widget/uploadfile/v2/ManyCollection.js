/**
 * many Collection
 */
define([
	"backbone",
    'widget/uploadfile/v2/ManyModel',
], function(Backbone, ManyModel) {
	var Collection = Backbone.Collection.extend({
        model: ManyModel
	});
	return new Collection();
});