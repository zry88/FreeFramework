/**
 * 选择讨论组人员视图
 */
define([
    'core/view/UiDialog',
    'text!widget/selectPersonnel/select-personnel.html',
    "widget/selectPersonnel/MemberTree"
], function(BaseUiDialog, Template, MemberTree) {
    FUI.widgets.selectPersonnel = BaseUiDialog.extend({
        template: _.template(Template),
        events: {
            'keyup .dialog_title_input': 'onKeyClick',
            'click .li_item_css': 'onResultItem'
        },
        initialize: function(option) {
            this.parent(option || {});
            var that = this;
            this.oldVal = '';
            this.result = [];
            this.allMembers = [];

            // 初始化搜索人员数据
            var theArr = FUI.datas.imDeparts.pluck('children');
            if (theArr.length) {
                for (var i = 0; i < theArr.length; i++) {
                    this.allMembers = _.union(this.allMembers, theArr[i]);
                }
            }
            // 实例化人员树视图
            FUI.view.create({
                key: "dialog_tree",
                el: '#left_list_display',
                inset: 'html',
                context: this,
                view: MemberTree,
                options: this.options
            });
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
                return model.name.indexOf(str) >= 0;
            }) || [];
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
                okbutton = $('.ui-dialog-buttonset button').first(),
                userId = target.data('userid');
            target.addClass('li_item_css_on').siblings('li').removeClass('li_item_css_on');
            var thePerson = _.findWhere(this.result, {userId: userId});
            // console.log('thePerson',thePerson);
            if (thePerson) {
                if(target.hasClass('li_item_css_on')){
                    //okbutton.data('user', thePerson.imAccountId);
                    okbutton.data('forward', {to:thePerson.imAccountId,scene:'p2p'});
                }else{
                   // okbutton.data('user', '');
                    okbutton.data('forward', {});
                }
            }
        }
    });
    return new FUI.widgets.selectPersonnel();
});
