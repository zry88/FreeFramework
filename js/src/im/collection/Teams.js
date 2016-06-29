/**
 * 群组
 */
define([
    "core/data/Collection",
    "src/im/model/Team"
], function(BaseCollection, Model) {
    var Collection = BaseCollection.extend({
        urlType: 1,
        model: Model,
        pageSize: 20,
        initialize: function(models, option) {
            this.parent(models, option);
            FUI.Events.off(null, null, this);
            // 添加数据
            FUI.Events.on('im:collection:teams:onAdd', this.onAdd, this);
            // 重置数据
            FUI.Events.on('im:collection:teams:onReset', this.onReset, this);
            // 更新群组
            // FUI.Events.on('im:collection:teams:onUpdateTeam', this.onUpdateTeam, this);
            // 解散群组
            FUI.Events.on('im:collection:teams:onDismissTeam', this.onDismissTeam, this);
            // 更新组名
            FUI.Events.on('im:collection:teams:updateTeamName', this.onUpdateTeamName, this);
        },
        onAdd: function(data) {
            debug.warn('添加组', data);
            this.add(data);
        },
        onReset: function(data) {
            this.reset(data);
        },
        // onUpdateTeam: function(data) {
        //     FUI.Events.trigger('im:getTeams');
        //     debug.warn('更新群组');
        // },
        onUpdateTeamName: function(data) {
            debug.warn('更新群组名');
            var theTeam = this.get(data.teamId);
            if(theTeam){
                theTeam.set('name', data.name);
            }
        },
        onDismissTeam: function(data) {
            var theTeam = this.get(data.teamId);
            if(theTeam){
                this.remove(theTeam);
            }
        },
    });
    return Collection;
});
