/**
 * 群成员
 */
define([
    "lib2/core/data/Collection",
    "src2/im/model/TeamMember"
], function(BaseCollection, Model) {
    var Collection = BaseCollection.extend({
        model: Model,
        initialize: function(models, option) {
            this.parent(models, option);
            this.theTeam = null;
            Hby.Events.off(null, null, this);
            Hby.Events.on('im:collection:' + this.key + ':onReset', this.onReset, this);
            // 添加成员
            Hby.Events.on('im:collection:' + this.key + ':onAdd', this.onAdd, this);
            // 离开群
            Hby.Events.on('im:collection:' + this.key + ':onLeaveTeam', this.onRemove, this);
            // 删除成员
            Hby.Events.on('im:collection:' + this.key + ':onRemove', this.onRemove, this);

            if (this.options.scene == 'team' && !this.length) {
                this.theTeam = this.options.team || null;
                Hby.Events.trigger('im:getTeamMembers', this.options.chatId);
            }
        },
        onReset: function(data) {
            var that = this,
                newData = [];
            for (var i = 0; i < data.length; i++) {
                var val = data[i],
                    dataObj = {},
                    account = val.account || (typeof val == 'string' ? val : null);
                if (account) {
                    // 系统返回数据
                    if (!parseInt(account)) continue;
                    var theUser = Hby.datas['allUsers'].get(account);
                    if (theUser) {
                        dataObj = {
                            id: account,
                            userId: theUser.get('userId'),
                            name: theUser.get('firstname'),
                            photoUrl: theUser.get('photoUrl'),
                        };
                        if(this.theTeam){
                            dataObj.canDel = (this.theTeam.owner == window.imUser.imAccountId) ? true : false;
                        }
                        if(account !== window.imUser.imAccountId){
                            newData.push(dataObj);
                        }
                    }
                }else{
                    // 人员树返回数据
                    if (!parseInt(val.get('imAccountId'))) continue;
                    // console.warn(val);
                    dataObj = {
                        id: val.get('imAccountId'),
                        userId: val.get('userId'),
                        name: val.get('name'),
                        photoUrl: val.get('photoUrl'),
                    };
                    if(this.theTeam){
                        dataObj.canDel = (this.theTeam.owner == window.imUser.imAccountId) ? true : false;
                    }
                    if(val.get('imAccountId') !== window.imUser.imAccountId){
                        newData.push(dataObj);
                    }
                }
            }
            this.reset(newData);
        },
        onAdd: function(data) {
            var that = this;
            data = _.isArray(data) ? data : [data];
            _.each(data, function(theId, i) {
                var theUser = Hby.ux.util.IM.getOneContacter({
                    imAccountId: theId
                });
                if (theUser) {
                    that.add({
                        id: theUser.imAccountId,
                        userId: theUser.userId,
                        name: theUser.displayName,
                        photoUrl: theUser.photoUrl,
                    });
                }
            });
        },
        onRemove: function(data) {
            data = _.isArray(data) ? data : [data];
            for(var i = 0; i < data.length; i++){
                var val = data[i];
                var theUser = this.get(val);
                if (theUser) {
                    this.remove(theUser);
                }
            }
            if(_.indexOf(data, window.imUser.imAccountId) >= 0){
                Hby.Events.trigger('im:collection:session:onRemove', this.options.team.teamId);
                Hby.Events.trigger('im:view:currentItem:removeOne', this.options.team.teamId);
            }
        },
    });
    return Collection;
});
