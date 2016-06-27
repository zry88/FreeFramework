require([
    "src2/chat/dataproxy/Chat",
    "src2/chat/controller/Chat"
], function(Dataproxy, Controller) {
    "use strict";
    new Dataproxy();
    new Controller();
});