/**
 * many model
 */
define([
	"backbone",
], function(Backbone) {
	var Model = Backbone.Model.extend({
        defaults: {
            url: '',
            fileObj: null,
            fileName: '',
            resultEl: '',
            isUploading: 1, //是否正在上传
            isReaded: 0, //是否已输出
            timestamp: 0
        }
	});
	return Model;
});