/**
 * 本地indexedDB数据模型基类
 * 插件来源: https://github.com/superfeedr/indexeddb-backbonejs-adapter
 * @author: yrh
 * @create: 2015/3/5
 * @update: 2015/3/6
 * options:{
 *		database: null,  //数据库操作
 *	 	storeName: '',  //存储名称
 * }
 * ===============database
 *  var databasev1 = {
	    id: "movies-database",
	    description: "The database for the Movies",
	    migrations: [{
	        version: 1,
	        migrate: function(transaction, next) {
	            var store = transaction.db.createObjectStore("movies");
	            next();
	        }
	        ...
	    }]
	};
 */
define([
	'lib/data/Model',
    'lib/vendor/system/data/backbone.indexeddb'
], function(BaseModel) {
	var Model = BaseModel.extend({
	    database: null,
	    storeName: '',
		initialize: function(option) {
			BaseModel.prototype.initialize.call(this, option);
			this.database = this.database || option.database;
			this.storeName = this.storeName || option.storeName;
			if(!this.database || !this.storeName){
				debug.warn('操作失败');
			}
		}
	});
	return Model;
});