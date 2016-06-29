define([
	'core/base/Proxy',
	'src/test/collection/Chat'
], function(BaseProxy, Chat){
	var Dataproxy = BaseProxy.extend({
		initialize: function(){
			// console.warn('aaaaaaaaa');
		}
	});
	return Dataproxy;
});