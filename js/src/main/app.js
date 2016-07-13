define([
    "src/main/controller/Main"
], function(Controller) {
    "use strict";
    return {
        init: function() {
            new Controller();
            FUI.history.start();
        }
    };
});
