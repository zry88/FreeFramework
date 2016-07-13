/**
 * # 描述
 * 系统主框架视图类
 * @class main
 */
define([
    'lib/HBY',
    'lib/view/View',
    'src/main/view/Test',
    'src/main/view/Menu'
], function(HBY, BaseView, TestView, MenuView) {
    var View = BaseView.extend({
        el: "body",
        events: {
            'click .menu-search': 'clickSearchBtn',
            'click .head-input-search': 'onkeydownSearch',
            // 'mouseenter .thm-item-user': ''
        },
        initialize: function() {
            new MenuView();
            // 测试demo
            HBY.view.create({
                key: "page_demo",
                view: TestView,
                inset: 'html',
            });
            // if (!window.localStorage.getItem(HBY.getCurrentModule())) {
            //     require(['widget/guide/App'], function() {
            //         var guide = new HBY.widgets.guide({
            //             options: {
            //                 key: 'guide',
            //                 el: 'body',
            //                 mask: true,
            //                 module: 'demo',
            //                 // root: '',
            //                 items: [{
            //                     images: [{
            //                         src: '1.png',
            //                         css: {
            //                             top: '100px',
            //                             left: '100px'
            //                         }
            //                     }, {
            //                         src: '4.png',
            //                         css: {
            //                             top: '250px',
            //                             right: '20px'
            //                         }
            //                     }],
            //                     buttons: {
            //                         next: {
            //                             src: 'ok.png',
            //                         }
            //                     }
            //                 }, {
            //                     images: [{
            //                         src: '1.png',
            //                         css: {
            //                             top: '100px',
            //                             left: '100px'
            //                         }
            //                     }],
            //                     buttons: {
            //                         skip: {
            //                             src: 'ok.png',
            //                         }
            //                     }
            //                 }]
            //             }
            //         });
            //     });
            // }
            // new LayoutView();
            if (CONFIG.IS_DEBUG) {
                // HBY.fn.loadCss(static_url + '/css/common.css?v=1');
                // HBY.fn.loadCss(static_url + '/css/debug.css?v=1');
                this.$('.tabpanel-container').addClass('debug-bg');
            }
            // 加载IM
            // require([CONFIG.IM_APP_SRC_V2]);

            // 显示隐藏菜单
            this.$('.crm-home-left').off().on('mouseenter', function(e) {
                $(this).animate({
                    width: '180px'
                }, 200);
            }).on('mouseleave', function(e) {
                $(this).animate({
                    width: '60px'
                }, 200);
            });
            // 显示隐藏帐户
            this.$('.thm-item-user').off().on('mouseenter', function(e) {
                $(this).find('.head-float-menu').show();
            }).on('mouseleave', function(e) {
                $(this).find('.head-float-menu').hide();
            });
            // 显示隐藏消息提示
            this.$('.thm-item-msg').off().on('mouseenter', function(e) {
                $(this).find('.tip-float-menu').show();
            }).on('mouseleave', function(e) {
                $(this).find('.tip-float-menu').hide();
            });
        },
        clickSearchBtn: function(event) {
            var target = $(event.currentTarget);
            this.startSearch();
            event.stopPropagation();
        },
        onkeydownSearch: function(event) {
            var target = $(event.currentTarget);
            var key = event.which,
                value = '';
            if (key == 13) {
                this.startSearch();
            }
            event.stopPropagation();
        },
        // 系统搜索
        startSearch: function() {
            var searchBox = this.$(".head-input-search"),
                itemObj = searchBox.parent(".thm-item"),
                value = $.trim(searchBox.val());
            if (value) {
                if (value.length > 50) {
                    HBY.util.System.showMsg('warning', "关键字不能超过50个字符！");
                } else {
                    window.location.href = "/search?key=" + encodeURIComponent(value);
                }
            } else {
                HBY.util.System.showMsg('warning', "请输入搜索条件！");
            }
        }
    });
    return View;
});
