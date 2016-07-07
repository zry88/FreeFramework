define([
    "core/data/collection/Remote",
    // "src/test/model/Chat"
], function(RemoteCollection) {
    var Collection = RemoteCollection.extend({
        urlType: 2,
        // model: Model,
        pageSize: 20,
        urlRoot: '/test/datatable/',
        initialize: function(option) {
            var defaults = {
                params: {
                    currentPage: 1,
                    limit: 20
                }
            };
            if(option) $.extend(true, defaults, option);
            this.parent(defaults)
        },
        parse: function(response, option) {
            if (!response) return null;
            if (!response.data && response.data !== null) {
                --this.currentPage;
                return this.changeData(response);
            }
            if (response.data.totalCount) this.totalCount = response.data.totalCount;
            if (response.data.totalPage) this.totalPage = response.data.totalPages;
            if (response.data.currentPage) this.currentPage = response.data.currentPage;
            if(!response.data.items) return [];
            console.warn(response.data);
            return this.changeData(response.data.items);
        },
        changeData: function(data) {
            // console.warn(data);
            // _.each(data, function(val, index) {
            //     if (data.length < that.pageSize && data.length == index + 1) val.is_end = true;
            //     var addTimeStamp = Tool.getTimestamp(val.add_time) * 1000;
            //     if ((theDayStamp - addTimeStamp) > (1000 * 24 * 60 * 60) || that.pageConfig.params.isold) {
            //         val.add_time = Tool.getDateTime(val.add_time);
            //     } else {
            //         var theDay = parseInt(Tool.getDateTime(null, 'D'));
            //         var addDay = parseInt(Tool.getDateTime(val.add_time, 'D'));
            //         val.add_time = Tool.getDateTime(val.add_time, theDay > addDay ? null : 'hh:mm:ss');
            //     }
            // });
            return data;
        }
    });
    return new Collection();
});
