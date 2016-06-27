/**
 * 会话
 */
define([
    "lib2/core/data/Collection",
    "src2/im/model/CurrentUser"
], function(BaseCollection, Model) {
    var Collection = BaseCollection.extend({
        model: Model,
        pageSize: 20,
        currentItem: 0,
        initialize: function(models, option) {
            this.parent(models, option);
            Hby.Events.off(null, null, this);
            Hby.Events.on('im:collection:session:onReset', this.onReset, this);
            Hby.Events.on('im:collection:session:onRemove', this.onRemove, this);
        },
        // 重置数据
        onReset: function(data) {
            var that = this,
                allData = [],
                lastMsg = {};
            _.each(data, function(val, index){
                if (val.scene == 'team' && val.lastMsg.type == 'notification') {
                    Hby.nim.getLocalMsgs({
                        scene: 'team',
                        to: val.to,
                        limit: 10,
                        done: function(error, obj) {
                            if (!error) {
                                for(var i = 0; i < obj.msgs.length; i++){
                                    var theMsg = obj.msgs[i];
                                    if(theMsg.type !== "notification"){
                                        that.at(index).set('lastMsg', theMsg);
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }
                val = that.filterData(val);
                allData.push(val);
            });
            this.reset(allData);
            // 总未读数
            Hby.Events.trigger('im:collection:session:allUnRead');
        },
        // 过滤组装数据
        filterData: function(data, context) {
            var theModel,
                that = context || this,
                theType = data.lastMsg.scene;
            if (theType == 'p2p') {
                // 私聊
                data.user = Hby.ux.util.IM.getOneContacter({
                    imAccountId: data.lastMsg.target
                });
            } else {
                // 群组
                if (data.lastMsg.attach) {
                    data.team = data.lastMsg.attach.team;
                } else {
                    data.team = Hby.ux.util.IM.getOneTeam({
                        teamId: data.lastMsg.target
                    });
                }
            }
            data.scene = theType;
            data.unread = data.unread || 0;
            data.isCurrent = data.lastMsg.target == that.currentItem ? 1 : 0;
            return data;
        },
        onRemove: function(teamId) {
            var theUser = this.get('team-' + teamId );
            if (theUser) {
                this.remove(theUser);
            }
        }
    });
    return new Collection();
});
