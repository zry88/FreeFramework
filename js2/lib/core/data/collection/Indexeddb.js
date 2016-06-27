/**
 * 本地indexedDB数据集基类
 * 插件来源: https://github.com/superfeedr/indexeddb-backbonejs-adapter
 * @author: yrh
 * @create: 2015/3/5
 * @update: 2015/3/6
 * options:{
 *      database: null,  //数据库操作
 *      storeName: '',  //存储名称
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
    'lib2/core/data/Collection',
    'lib2/vendor/system/data/backbone.indexeddb'
], function(BaseCollection) {
    var AppCollection = BaseCollection.extend({
        database: null,
        storeName: '',
        initialize: function(models, option, callback) {
            BaseCollection.prototype.initialize.call(this, models, option, callback);
            this.database = this.database || option.database;
            this.storeName = this.storeName || option.storeName;
            if(!this.database || !this.storeName){
                debug.warn('操作失败');
            }
        },
        parse: function(resp, option) {
            // 条件查询
            if (option.where) {
                resp = _.where(resp, option.where);
            }
            // 分页
            var totalresults = resp.length;
            if (option.currentPage) this.currentPage = option.currentPage;
            if (option.pageSize) this.pageSize = option.pageSize;
            this.totalPage = Math.ceil(totalresults / this.pageSize);
            if (this.currentPage >= this.totalPage) this.currentPage = this.totalPage;
            if (this.currentPage <= 0) this.currentPage = 0;
            resp = resp.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);

            return this.sortData(resp);
        },
        loadData: function(option) {
            var option = option || {};
            var pageConfig = {
                reset: true, //重置数据集
                param: {
                    limit: this.pageSize,
                    page: this.currentPage
                }
            }
            if (!_.isEmpty(option)) {
                _.extend(pageConfig, option);
                if (!!pageConfig.param.limit) this.pageSize = pageConfig.param.limit;
                if (!!pageConfig.param.page) this.currentPage = pageConfig.param.page;
            }
            this.fetch(pageConfig);
        }
    });
    return AppCollection;
});