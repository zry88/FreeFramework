define([
    'lib/base/Router',
    'src/chat/view/Chat'
], function(BaseController, ChatView) {
    var Controller = BaseController.extend({
        routes: {
            "chat/index": "home"
        },
        initialize: function() {
            this.home();
        },
        home: function() {
            HBY.view.create({
                key: "chat",
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
