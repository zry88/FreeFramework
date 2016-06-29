/*
 * 数据代理基类
 * @author: YuRonghui
 * @create: 2016/1/13
 * @update: 2016/1/30
 */
define([
    'core/FUI'
], function(FUI) {
    var App = FUI.Base.extend({
        datas: {},
        initialize: function(option) {
            option = option || {};
            _.extend(FUI.datas, this.datas, option.datas || {});
        },
        // 创建数据
        createData: function(option) {
            return FUI.DataManager.createData(option);
        },
        //获取数据
        getData: function(key) {
            return FUI.DataManager.getData(key);
        },
        //删除数据
        removeData: function(key) {
            return FUI.DataManager.removeData(key);
        }
    });
    return App;
});
