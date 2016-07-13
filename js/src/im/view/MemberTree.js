/**
 * 人员树视图
 */
define([
    "lib/view/View",
    'ztree'
], function(BaseView) {
    var View = BaseView.extend({
        tagName: "ul",
        className: "ztree",
        initialize: function(option) {
            this.parent(option);
            var that = this;
            this.selectedMembersAdd = 'im:collection:selectedMembers_' + this.options.chatId + ':onAdd';
            this.selectedMembersDel = 'im:collection:selectedMembers_' + this.options.chatId + ':onRemove';

            FUI.Events.off(null, null, this);
            FUI.Events.on('view:memberTree:clearChecked', clearChecked, this);

            this.setting = {
                check: {
                    enable: true,
                    chkboxType: {
                        "Y": "s",
                        "N": "ps"
                    }
                },
                data: {
                    simpleData: {
                        enable: true,
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onCheck: onCheck,
                }
            };

            function clearChecked(data) {
                var data = data || {};
                var ztree =  $.fn.zTree.getZTreeObj(that.id);
                // var nodes = zTree.getCheckedNodes(true);
                if (data.treeId) {
                    var node = ztree.getNodeByParam("imAccountId", data.treeId, null);
                    if (node) {
                        ztree.checkNode(node, false, false);
                    }
                }
            }

            function beforeClick(treeId, treeNode) {
                var ztree =  $.fn.zTree.getZTreeObj(that.id);
                ztree.checkNode(treeNode, !treeNode.checked, null, true);
                return false;
            }

            function filterMember(accountId) {
                if(accountId == window.imUser.imAccountId){
                    return true;
                }
            }

            function onCheck(e, treeId, treeNode) {
                e.stopPropagation();
                var ztree = $.fn.zTree.getZTreeObj(that.id);
                if (treeNode.id == window.imUser.userId) {
                    debug.warn('不能选择自己');
                    return false;
                }
                var thePerson = {
                    id: treeNode.imAccountId,
                    name: treeNode.name,
                    photoUrl: treeNode.photoUrl,
                };
                if (treeNode.isParent) {
                    var theParent = FUI.datas.imDeparts.clone().get(treeNode.id);
                    if (theParent) {
                        var theSub = theParent.attributes.children;
                        if (theSub.length) {
                            var newSub = [];
                            for (var i = 0; i < theSub.length; i++) {
                                var theItemVal = theSub[i];
                                if (filterMember(theItemVal.imAccountId)) continue;
                                newSub.push({
                                    id: theItemVal.imAccountId,
                                    userId: theItemVal.userId,
                                    name: theItemVal.name,
                                    photoUrl: theItemVal.photoUrl,
                                });
                            }
                            // debug.warn(newSub);
                            if (treeNode.checked) {
                                FUI.Events.trigger(that.selectedMembersAdd, newSub);
                            } else {
                                FUI.Events.trigger(that.selectedMembersDel, newSub);
                            }
                        }
                    }
                } else {
                    if (filterMember(thePerson.imAccountId)) return false;
                    // debug.warn(thePerson);
                    if (treeNode.checked) {
                        FUI.Events.trigger(that.selectedMembersAdd, thePerson);
                    } else {
                        FUI.Events.trigger(that.selectedMembersDel, thePerson);
                    }
                }
            }
            this.rendAll();
        },
        rendAll: function() {
            var datas = [],
                that = this;
            FUI.datas.imDeparts.each(function(model) {
                _.each(model.attributes.children, function(subModel, index){
                    if(_.indexOf(_.pluck(that.options.teamMembers, 'id'), subModel.imAccountId) >= 0){
                        subModel.checked = true;
                    }else{
                        subModel.checked = false;
                    }
                });
                model.attributes.children = _.filter(model.attributes.children, function(val) {
                    return val.imAccountId !== 0;
                });
                datas.push(model.attributes);
            });
            $.fn.zTree.init(this.$el, this.setting, datas);
            return this;
        },
    });
    return View;
});
