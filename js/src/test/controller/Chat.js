define([
    'lib/core/base/Router',
    'src/test/view/Chat'
], function(BaseController, ChatView) {
    var Controller = BaseController.extend({
        routes: {
            "test/index": "home"
        },
        initialize: function() {
            this.home();
        },
        home: function(id) {
            debug.warn('bbbbbb');
            FUI.view.create({
                key: "test",
                view: ChatView,
                isClean: true
            });
        },
        // following: function() {
        //     this.create({
        //         key: "following",
        //         el: "#tab-content",
        //         view: FollowingView,
        //         insert: 'append',
        //         isClean: false,
        //     });
        //     this.showScroll();
        // },
        // followed: function() {
        //     this.create({
        //         key: "followed",
        //         el: "#tab-content",
        //         view: FollowedView,
        //         insert: 'append',
        //         isClean: false,
        //     });
        //     this.showScroll();
        // },
        // message: function() {
        //     this.create({
        //         key: "message",
        //         el: "#tab-content",
        //         view: MessageView,
        //         // isClean: false,
        //     });
        //     this.showScroll();
        // },
        // showScroll: function(){
        //     setTimeout(function(){
        //         Frame.showScroll();
        //     }, 0);
        // }
    });
    return Controller;
});
