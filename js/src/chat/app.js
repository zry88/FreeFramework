require([
    "src/chat/dataproxy/Chat",
    "src/chat/controller/Chat"
], function(Dataproxy, Controller) {
    "use strict";
    new Dataproxy();
    new Controller();
});