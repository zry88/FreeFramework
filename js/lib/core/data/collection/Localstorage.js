/*
 * 本地数据集基类
 * @author: yrh
 * @create: 2015/3/4
 * @update: 2015/3/5
 * ===============================
 * collection.loadData({
 *      reset: true, //重置数据集
 *      param: {    //分页参数  可选
 *          limit: 20,
 *          page: 1
 *      },
 * });
 * ===============================
 */
define([
    'lib/core/data/Collection',
    'lib/vendor/system/data/backbone.localstorage'
], function(BaseCollection) {
    var AppCollection = BaseCollection.extend({
        localStorage: null,
        storeName: '',
        initialize: function(models, option, callback) {
            BaseCollection.prototype.initialize.call(this, models, option, callback);
            if(option.localStorage || this.localStorage){
                this.store = option.localStorage || this.localStorage;
            }else{
                this.storeName = this.storeName || option.storeName;
                if (this.storeName) {
                    this.store = this.store || new Backbone.localStorage(this.storeName);
                } else {
                    debug.warn('存储名称未定义');
                    return false;
                }
            }
        },
        sync: function(method, models, option) {
            var resp;
            if (this.store.findAll().length > 0) {
                switch (method) {
                    case "read":
                        resp = this.store.findAll();
                        break;
                    case "create":
                        this.createAll(models);
                        break;
                    case "update":
                        this.updateAll(models);
                        break;
                    case "delete":
                        this.deleteAll(models);
                        break;
                }
                if (resp) {
                    option.success(resp);
                } else {
                    option.error("Record not found");
                }
            } else {
                option.error("Record not found");
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
            option = option || {};
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
        },
        // 获取数据集id列表
        getIds: function() {
            return _(this.models).map(function(model) {
                return model.id;
            }).join(',');
        },
        // 添加
        createAll: function(models) {
            var that = this;
            _.each(models, function(model) {
                var themodel = that.store.find({
                    id: model.id
                });
                if (themodel) {
                    that.store.update(model);
                } else {
                    that.store.create(model);
                }
            });
        },
        // 修改 
        updateAll: function(models) {
            var that = this;
            _.each(models, function(model) {
                that.store.update(model);
            });
        },
        // 删除 
        deleteAll: function(models) {
            this.store._clear(this.storeName);
            this.remove(this);
        }
    });
    return AppCollection;
});