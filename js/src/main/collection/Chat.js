/**
 * chat Collection
 */
define([
    "lib/data/collection/Remote",
    // "src/main/model/Main"
], function(RemoteCollection) {
    var AppCollection = RemoteCollection.extend({
        urlType: 2,
        // model: Model,
        pageSize: 20,
        urlRoot: CONFIG.CHAT_SERVER_URL + '/message/',
        initialize: function(options) {
            this.urlRoot += options.room_id;
            this.initConfig({
                params: {
                    sort: 1,
                    offset: this.pageOffset,
                    num: this.pageSize,
                    isold: 0,
                }
            });
            RemoteCollection.prototype.initialize.call(this, options);
        },
        changeData: function(data) {
            if (!this.pageConfig.params.isold) data.reverse();
            var that = this;
            var theDayStamp = (new Date()).getTime();
            _.each(data, function(val, index) {
                if (data.length < that.pageSize && data.length == index + 1) val.is_end = true;
                var addTimeStamp = Tool.getTimestamp(val.add_time) * 1000;
                if ((theDayStamp - addTimeStamp) > (1000 * 24 * 60 * 60) || that.pageConfig.params.isold) {
                    val.add_time = Tool.getDateTime(val.add_time);
                } else {
                    var theDay = parseInt(Tool.getDateTime(null, 'D'));
                    var addDay = parseInt(Tool.getDateTime(val.add_time, 'D'));
                    val.add_time = Tool.getDateTime(val.add_time, theDay > addDay ? null : 'hh:mm:ss');
                }
            });
            return data;
        }
    });
    return AppCollection;
});
