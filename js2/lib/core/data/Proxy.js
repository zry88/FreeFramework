/*
 * 数据代理基类
 * @author: YuRonghui
 * @create: 2016/1/13
 * @update: 2016/1/30
 */
define([
    'lib2/core/Hby'
], function(Hby) {
    var App = Hby.Base.extend({
        datas: {},
        initialize: function(option) {
            option = option || {};
            _.extend(Hby.datas, this.datas, option.datas || {});
        },
        // 创建数据
        createData: function(option) {
            return Hby.DataManager.createData(option);
        },
        //获取数据
        getData: function(key) {
            return Hby.DataManager.getData(key);
        },
        //删除数据
        removeData: function(key) {
            return Hby.DataManager.removeData(key);
        }
    });
    return App;
});
