define([
	'lib2/core/base/Proxy',
	'src2/test/collection/Chat'
], function(BaseProxy, Chat){
	var Dataproxy = BaseProxy.extend({
		initialize: function(){
			// console.warn('aaaaaaaaa');
		}
	});
	return Dataproxy;
});