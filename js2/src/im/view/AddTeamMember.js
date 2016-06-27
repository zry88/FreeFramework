/**
 * 选择讨论组人员视图
 */
define([
    'lib2/core/view/UiDialog',
    'text!src2/im/template/addmember-dialog.html',
    "src2/im/dataproxy/IM",
    "src2/im/view/MemberTree",
    "src2/im/view/SelectedMembers"
], function(BaseUiDialog, Template, ImDataproxy, MemberTree, SelectedMembers) {
    var View = BaseUiDialog.extend({
        template: _.template(Template),
        events: {
            'keyup .dialog_title_input': 'onKeyClick',
            'click .li_item_css': 'onResultItem',
        },
        initialize: function(option) {
            this.parent(option);
            // BaseUiDialog.prototype.initialize.call(this, option);
            var that = this,
                isTeam = this.options.scene == 'team' ? true : false;
                console.warn(this.options);
            this.oldVal = '';
            this.result = [];
            this.allMembers = [];
            this.selectedMembers = ImDataproxy.getSelectedMembers(this.options);
            var theTeamMembers = [],
                teamMembers = [];
            if(this.options.scene == 'p2p'){
                var theMember = this.options.user;
                theMember.id = theMember.imAccountId;
                theMember.name = theMember.displayName;
                theTeamMembers = [this.options.user];
            }else{
                theTeamMembers = _.pluck(Hby.datas['teamMembers_' + this.options.chatId].models, 'attributes');
            }
            if(theTeamMembers){
                _.each(theTeamMembers, function(user, i){
                    teamMembers.push({
                        id: user.id || 0,
                        userId: user.userId || 0,
                        name: user.name || '',
                        photoUrl: user.photoUrl || '',
                        canDel: isTeam ? (window.imUser.imAccountId == that.options.team.owner ? true : false) : false
                    });
                });
            }
            this.imdeparts = ImDataproxy.getImdeparts();
            // 初始化已选人员数据
            this.options.teamMembers = teamMembers;
            this.selectedMembers.reset(teamMembers);
            // 初始化搜索人员数据
            var theArr = Hby.datas.imDeparts.pluck('children');
            if (theArr.length) {
                for (var i = 0; i < theArr.length; i++) {
                    this.allMembers = _.union(this.allMembers, theArr[i]);
                }
            }
            // 实例化人员树视图
            Hby.view.create({
                key: "dialog_tree",
                el: '#left_list_display',
                context: this,
                view: MemberTree,
                options: this.options
            });
            // 实例化已选人员视图
            Hby.view.create({
                key: "selectedMembers",
                el: '.right_list_con',
                context: this,
                view: SelectedMembers,
                options: this.options,
                collection: this.selectedMembers
            }).rendAll();
        },
        onKeyClick: function(event) {
            var target = $(event.currentTarget);
            var that = this;
            setTimeout(function() {
                var theVal = target.val();
                if (that.oldVal != theVal && that.allMembers.length) {
                    that.oldVal = theVal;
                    that.searchName(target.val());
                }
            }, 0);
        },
        // 按人名搜索人员
        searchName: function(str) {
            var that = this;
            var result = _.filter(this.allMembers, function(model) {
                if(model.imAccountId == window.imUser.imAccountId) return false;
                return model.name.indexOf(str) >= 0;
            }) || [];
            if(result.length){
                result = _.filter(result, function(model){
                    var hasOne = that.selectedMembers.get(model.imAccountId);
                    return hasOne ? false : true;
                });
            }
            var memberListEl = this.$('#left_list_display'),
                resultListEl = this.$('#left_list_hidden');
            if (result.length && str.length) {
                memberListEl.hide();
                var html = '';
                for (var i = 0; i < result.length; i++) {
                    html += '<li data-userid="' + result[i].id + '" class="li_item_css"><span class="left-span"></span><span class="li_text">' + result[i].name + '</span><span class="right-span"></span></li>';
                }
                resultListEl.html(html).show();
                this.result = result;
            } else {
                memberListEl.show();
                resultListEl.empty().hide();
                this.result = [];
            }
        },
        // 添加人员
        onResultItem: function(event) {
            var target = $(event.currentTarget),
                userId = target.data('userid');
            var thePerson = _.findWhere(this.result, {userId: userId});
            if (thePerson) {
                this.selectedMembers.add({
                    id: thePerson.imAccountId,
                    imAccountId: thePerson.imAccountId,
                    name: thePerson.name,
                    userId: thePerson.userId,
                    photoUrl: thePerson.photoUrl,
                    canDel: true
                });
            }
        }
    });
    return View;
});
