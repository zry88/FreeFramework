require([
    "src2/test/dataproxy/Chat",
    "src2/test/controller/Chat"
], function(Dataproxy, Controller) {
    "use strict";
    new Dataproxy();
    new Controller();
});