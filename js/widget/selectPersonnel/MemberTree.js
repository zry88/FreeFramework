/**
 * 人员树视图
 */
define([
    "lib/core/view/View",
    'ztree'
], function(BaseView) {
    var View = BaseView.extend({
        // el: '#memberTree',
        tagName: "ul",
        className: "ztree",
        initialize: function(option) {
            this.parent(option);
            var that = this;

            FUI.Events.off(null, null, this);
            this.setting = {
                check: {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "level"
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onCheck: onCheck
                }
            };

            function clearChecked(data) {
                var data = data || {};
                var ztree = $.fn.zTree.getZTreeObj(that.id);
                // var nodes = zTree.getCheckedNodes(true);
                if (data.treeId) {
                    var node = ztree.getNodeByParam("imAccountId", data.treeId, null);
                    if (node) {
                        ztree.checkNode(node, false, false);
                    }
                }
            }

            function beforeClick(treeId, treeNode) {
                var ztree = $.fn.zTree.getZTreeObj(that.id);
                if (treeNode.isParent) {
                    return false;
                } else {
                    var nodes = ztree.getSelectedNodes();
                    if (nodes.length > 0) {
                        ztree.checkNode(nodes[0], false, null, true);
                    }
                    ztree.checkNode(treeNode, !treeNode.checked, null, true);
                }
            }

            function onCheck(e, treeId, treeNode) {
                e.stopPropagation();
                var ztree = $.fn.zTree.getZTreeObj(that.id);
                if (!treeNode.isParent) {
                    if (treeNode.isImMsgGroup) {
                        $('.ui-dialog-buttonset button').first().data('forward', { to: treeNode.teamId, scene: 'team' });
                    } else {
                        //$('.ui-dialog-buttonset button').first().data('user', treeNode.imAccountId);
                        $('.ui-dialog-buttonset button').first().data('forward', { to: treeNode.imAccountId, scene: 'p2p' });
                    }

                }
            }
            this.rendAll();
        },

        rendAll: function() {
            var datas = [],
                teamArr = [],
                msgGroupData = { id: 'imGroupInTree', name: '群组', nocheck: true, children: [] },
                that = this;
            FUI.datas.imDeparts.each(function(model) {
                model.attributes.nocheck = true;
                datas.push(model.attributes);
            });
            /*var teams = FUI.datas['teams'].models,
                teamsArr = _.pluck(teams, 'attributes');
            teamsArr.each(function(team){
                team.id = team.teamId;
            });*/
            FUI.datas.teams.each(function(model) {
                model.attributes.id = model.attributes.teamId;
                model.attributes.isImMsgGroup = true;
                teamArr.push(model.attributes);
            });

            msgGroupData.children = teamArr;
            datas.unshift(msgGroupData);
            $.fn.zTree.init(this.$el, this.setting, datas);
            return this;
        }
    });
    return View;
});
