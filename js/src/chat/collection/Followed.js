/**
 * Followed Collection
 */
define([
	"baseApp/collection/RemoteCollection",
	"src/chat/model/Followed",
], function(RemoteCollection, Model) {
	var AppCollection = RemoteCollection.extend({      
		model: Model, 
		pageSize: 40,
		urlRoot: CONFIG.SERVER_URI + '/app/usersfw/followers_list',
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
                    return item.fuser.name.indexOf(keyword) >= 0;
                });
            }else{
                newData = data;
            }
            return newData;
        }
	});
	return new AppCollection();
});