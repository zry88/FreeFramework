/**
 * chat Collection
 */
define([
    "lib2/core/data/collection/Remote",
    "src2/im/model/Chat"
], function(RemoteCollection, Model) {
    var AppCollection = RemoteCollection.extend({
        model: Model,
        pageSize: 20,
        initialize: function(models, option) {
            this.parent(models, option);
            this.groupId = 0;
            this.hasScrollEnd = true;
            this.isEnd = false;
            this.earlyTime = 0;
            this.lastTime = 0;
            Hby.Events.off(null, null, this);
            Hby.Events.on('im:collection:' + this.key + ':onMsg', this.onMsg, this);
            Hby.Events.on('im:collection:' + this.key + ':onReset', this.onReset, this);
        },
        loadData: function(option) {
            this.isHistory = false;
            this.paramsObj = {
                dataFrom: 1,
                lastMsgIdClient: 0,
                lastMsgId: 0,
                endTime: 0,
                oldEndTime: 0
            };
            option = option || {};
            _.extend(this.paramsObj, option);
            this.distoryMsgsAPI();
        },
        distoryMsgsAPI: function(isHistory) {
            var options = {
                scene: this.options.scene,
                to: this.options.to,
                limit: this.pageSize
            };
            this.isHistory = isHistory ? true : false;
            switch (this.paramsObj.dataFrom) {
                case 1: //取本地历史记录
                    if (this.paramsObj.lastMsgIdClient) options.lastMsgIdClient = this.paramsObj.lastMsgIdClient;
                    options.reverse = false;
                    Hby.Events.trigger('im:getLocalMsgs', options);
                    break;
                case 2: //取云端历史记录
                    if (this.paramsObj.lastMsgId) options.lastMsgId = this.paramsObj.lastMsgId;
                    if (this.paramsObj.endTime) options.endTime = this.paramsObj.endTime;
                    options.reverse = false;
                    Hby.Events.trigger('im:getHistoryMsgs', options);
                    break;
                case 3: //取旧会员历史记录
                    var option = {
                        name: '',
                        scene: this.options.scene,
                        timePoint: this.paramsObj.oldEndTime,
                        collection: this,
                        key: this.key
                    };
                    if(this.options.scene == 'p2p'){
                        option.userIds = [window.imUser.userId, this.options.userId];
                    }else{
                        option.teamId = this.options.chatId;
                    }
                    if(!this.isEnd) Hby.Events.trigger('im:getGroupId', option);
                    break;
            }
        },
        onReset: function(data) {
            var that = this;
            var allData = [];
            if(data) Hby.Events.trigger('im:view:chatPanel:showMoreBtn', true);
            // 旧会员聊天记录转换
            if(data.historyMessage){
                if (data.historyMessage.length < this.pageSize) {
                    this.isEnd = true;
                    Hby.Events.trigger('im:view:chatPanel:showMoreBtn', false);
                }
                if(!data.historyMessage.length){
                    // this.paramsObj.dataFrom = 1;
                    this.isEnd = true;
                    return;
                }
                var tempArr = [];
                _.each(data.historyMessage, function(val, index) {
                    tempArr.push({
                        idClient: val.msgId,
                        scene: data.scene || 'p2p',
                        flow: window.imUser.userId == val.senderId ? 'out' : 'in',
                        from: val.senderId,
                        text: val.content,
                        content: val.content,
                        time: val.createdTime,
                        type: val.msgType
                    })
                });
                data = tempArr;
                this.paramsObj.oldEndTime = data[data.length - 1].time || (new Date()).getTime();
            }
            data = data || [];
            data = this.checkData(data);
            if (!data.length) {
                this.paramsObj.dataFrom++;
                this.distoryMsgsAPI(this.isHistory);
                return;
            }
            this.totalPage = data.length;
            if (this.paramsObj.dataFrom == 1) {
                this.paramsObj.lastMsgIdClient = data[data.length - 1].idClient || 0;
            } else if (this.paramsObj.dataFrom == 2) {
                this.paramsObj.lastMsgId = data[data.length - 1].idServer || 0;
            }
            this.paramsObj.endTime = data[data.length - 1].time || 0;
            data.reverse();
            for (var i = 0; i < data.length; i++) {
                var val = data[i];
                val.oldCreatedTime = val.custom ? JSON.parse(val.custom).oldCreatedTime : 0;
                val.index = i;
                val = this.filterData(val);
                if (i == 0){
                    this.earlyTime = this.earlyTime || 0;
                    // this.lastTime = (new Date()).getTime();
                    // this.earlyTime = val.time;
                }
                val.is_showtime = this.isShowTime(val.time, this.earlyTime);
                // console.warn(val.time, i);
                if(i == 0) val.is_showtime = 1;
                this.earlyTime = val.time;
                if(val.type == "notification") val.text = Hby.ux.util.IM.getNotifyText(val);
                allData.unshift(val);
                if (this.isHistory) {
                    val.is_history = true;
                    this.add(val);
                }
            };
            if (!this.isHistory) this.reset(allData);
        },
        onMsg: function(msgObj) {
            this.isHistory = false;
            this.paramsObj.dataFrom = 1;
            this.earlyTime = this.earlyTime || 0;
            // this.earlyTime = this.earlyTime || (new Date()).getTime();
            msgObj = this.filterData(msgObj);
            msgObj.is_showtime = this.isShowTime(msgObj.time, this.earlyTime);
            this.earlyTime = msgObj.time;
            var hasModel = this.get(msgObj.id);
            if (hasModel) {
                msgObj.is_uploading = false;
                hasModel.set(msgObj);
            } else {
                this.add(msgObj);
            }
        },
        checkData: function(data) {
            var that = this;
            return _.filter(data, function(val) {
                // return val.type !== 'notification';
                return val.type !== 'mixed';
            });
        },
        // 过滤组装数据
        filterData: function(msgObj) {
            var fromUser = {};
            if(msgObj.flow == 'in'){
                if(this.paramsObj.dataFrom == 3){
                    fromUser = Hby.ux.util.IM.getOneContacter({ userId: msgObj.from });
                }else{
                    fromUser = Hby.ux.util.IM.getOneContacter({ imAccountId: msgObj.from });
                }
            }else{
                fromUser = window.imUser;
            }
            if (msgObj.type == 'custom') {
                msgObj.id = typeof msgObj.content == 'string' ? JSON.parse(msgObj.content).fileId : msgObj.content.fileId;
            } else {
                msgObj.id = msgObj.idClient;
            }
            _.extend(msgObj, {
                is_showtime: true,
                fromUser: fromUser
            });
            return msgObj;
        },
        // 是否显示发送日期
        isShowTime: function(lastTime, earlyTime) {
            var theMinutes = (lastTime - earlyTime) / (1000 * 60);
            return theMinutes >= 1 ? true : false;
        },
    });
    return AppCollection;
});
