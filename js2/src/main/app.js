define([
    "src2/main/controller/Main"
], function(Controller) {
    "use strict";
    return {
        init: function() {
            new Controller();
            Hby.history.start();
        }
    };
});
