define([
    "src2/main/controller/Main"
], function(Controller) {
    "use strict";
    $.CRM = {
        'G_User': G_User || {
            'userId': '',
            'userName': '',
            'userPho': '',
            'realName': ''
        },
        'G_Client': {
            'commonAttrs': {}
        },
        'G_Contact': {
            'commonAttrs': {}
        },
        'G_Campaign': {
            tabCampaignContainer: {}
        },
        'G_Email':{
            isMailSetUpdate:false
        },
        'G_SalesOppo' : {
            'commonAttrs' : {}
        },
        'modelName': 'crm_contacts'
    };
    return {
        init: function() {
            new Controller();
            Hby.history.start();
        }
    };
});
