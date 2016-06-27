/**
 * 本地localstorage数据模型基类
 * 插件来源: https://github.com/jeromegn/Backbone.localStorage
 * @author: yrh
 * @create: 2015/3/5
 * @update: 2015/3/6
 * options:{
 *     storeName: '',  //存储名称
 * }
 */
define([
	'lib2/core/data/Model',
    'lib2/vendor/system/data/backbone.localstorage'
], function(BaseModel) {
	var Model = BaseModel.extend({
		localStorage: null,
		storeName: '',
		initialize: function(options) {
			BaseModel.prototype.initialize.call(this, options);
			var options = options || {};
			if(!!options.localStorage){
				this.localStorage = options.localStorage;
			}else{
				this.storeName = this.storeName || options.storeName;
				if (this.storeName) {
					this.localStorage = this.localStorage || new Backbone.localStorage(this.storeName);
				} else {
					debug.warn('存储名称未定义');
					return false;
				}
			}
		}
	});
	return Model;
});