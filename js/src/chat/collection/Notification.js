/**
 * 通知 Collection
 */
define([
	"baseApp/collection/RemoteCollection",
	"src/chat/model/Notification"
], function(RemoteCollection, Model) {
	var AppCollection = RemoteCollection.extend({ 
		urlType: 2,       
		model: Model, 
		pageSize: 20,
		urlRoot: '/app/activities/list',
        // urlRoot: '/jsapi/1/notification/get?user=blab',
        initialize: function(options) {
            this.initConfig({
                type: 'POST',
                headers: {
                    'X-CSRF-Token': localStorage.getItem('token')
                },
                params: {
                    // offset: this.pageOffset,
                    // num: this.pageSize,
                    uid: window.account.get('uid')
                }
            });
            RemoteCollection.prototype.initialize.call(this, options);
        },
        changeData: function(data){
            if(data){
                if(!_.isEmpty(data)){
                    return data.result ? data.result.reverse() : [];
                }
            }
        	return [];
        }
	});
	return new AppCollection();
});