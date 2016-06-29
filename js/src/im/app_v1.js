require([
    'jquery',
    'jqueryui',
    'lib/core/FUI',
    "src/im/dataproxy/IM",
    "src/im/controller/IM",
    'src/im/view/YunXin'
], function($, jqueryui, FUI, ImDataproxy, Controller) {
    "use strict";
    // 加载文件预览插件
    require(["js/knowledge/filePreview_app"]);
    // 定义未读数变量
    FUI.unreadNum = {
        email: 0, // 邮件
        calendar: 0, // 日程
        feedback: 0, // 反馈
        examine: 0, // 审批
        workreport: 0, // 工作报告
        scheduled: 0, // 任务
        alter: 0, //别人@我的
        alter_like: 0, //别人点赞的
        alter_comment: 0, //别人评论我的
        alter_reply: 0, //别人回复我的
        alter_dynamic: 0, //我关注的新动态
        customer_pool: 0, // 公海客户,
        leads: 0, //线索
        contacter: 0, //联系人
        opportunity: 0, //商机
        contract: 0 //合同
    };
    $(function() {
        $('.crm-wrapper').on('click', function(e) {
            FUI.Events.trigger('global:im:hideIM');
        });
    });
    ImDataproxy.getAlldepart(null, function(collection, response, option) {
        var myAccount = collection.findWhere({ userId: window.imUser.userId });
        window.imUser.photoUrl = '';
        if (myAccount) {
            _.extend(window.imUser, myAccount.attributes);
        }
        new Controller();
        FUI.history.start();
    });
});
