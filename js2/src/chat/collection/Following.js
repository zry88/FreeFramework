/**
 * Following Collection
 */
define([
	"baseApp/collection/RemoteCollection",
	"src/chat/model/Following",
], function(RemoteCollection, Model) {
	var AppCollection = RemoteCollection.extend({      
		model: Model, 
		pageSize: 40,
		urlRoot: CONFIG.SERVER_URI + '/app/usersfw/following_list',
        initialize: function(options) {
            this.initConfig({
                type: 'POST',
                params: {
                    offset: this.pageOffset,
                    num: this.pageSize,
                }
            });
            RemoteCollection.prototype.initialize.call(this, options);
        },
        changeData: function(data) {
            var keyword = this.pageConfig.keyword;
            var newData;
            if(keyword){
                newData = _.filter(data, function(item) {
                    return item.user.name.indexOf(keyword) >= 0;
                });
            }else{
                newData = data;
            }
            return newData;
        }
	});
	return new AppCollection();
});