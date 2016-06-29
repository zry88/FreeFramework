require([
    "src/test/dataproxy/Chat",
    "src/test/controller/Chat"
], function(Dataproxy, Controller) {
    "use strict";
    new Dataproxy();
    new Controller();
});