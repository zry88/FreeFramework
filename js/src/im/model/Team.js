/**
 * 群组
 */
define([
    "lib/core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'teamId',
        defaults: {
            teamId: "",
            appId: '', //群所属的app的id
            createTime: 0, //群创建时间
            level: 0, //群人数上限
            memberNum: 0, //群成员数量
            memberUpdateTime: 0, //群成员最后更新时间
            joinMode: '', //群加入方式
            announcement: '', //群公告
            intro: '', //群简介
            name: "",   //群名字
            owner: "", //群主
            type: "",   //群类型
            updateTime: 0, //群最后更新时间
            custom: {}, //第三方扩展字段, 开发者可以自行扩展, 建议封装成JSON格式字符串
            serverCustom: {}, //第三方服务器扩展字段, 开发者可以自行扩展, 建议封装成JSON格式字符串
            valid: true,    //是否有效, 解散后该群无效
            validToCurrentUser: true, // 该群是否对当前用户有效, 如果无效, 那么说明被踢了
        }
    });
    return Model;
});
