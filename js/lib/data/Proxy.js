/*
 * 数据代理基类
 * @author: YuRonghui
 * @create: 2016/1/13
 * @update: 2016/1/30
 */
define([
    'lib/HBY'
], function(HBY) {
    var App = HBY.Base.extend({
        datas: {},
        initialize: function(option) {
            option = option || {};
            _.extend(HBY.datas, this.datas, option.datas || {});
        },
        // 创建数据
        createData: function(option) {
            return HBY.DataManager.createData(option);
        },
        //获取数据
        getData: function(key) {
            return HBY.DataManager.getData(key);
        },
        //删除数据
        removeData: function(key) {
            return HBY.DataManager.removeData(key);
        }
    });
    return App;
});
