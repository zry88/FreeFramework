define([
    'lib/core/base/Proxy',
	'src/chat/collection/Chat'
], function(BaseProxy, Chat){
	var Dataproxy = BaseProxy.extend({
		initialize: function(){
			// console.warn('aaaaaaaaa');
		}
	});
	return Dataproxy;
});