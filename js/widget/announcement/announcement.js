
/*
 * 系统通知（跑马灯效果）
 * @author: Dennis Lei
 * @create: 2016/5/11
 * @update: 2016/5/11
 */
define([
    'lib/core/FUI',
    'text!widget/announcement/announcement.html',
    'lib/vendor/system/data/backbone.localStorage',
    /*'jMarquee',*/
    'lib/vendor/components/jquery-marquee/jquery-marquee',
    'lib/vendor/system/data/backbone.localStorage'
], function(FUI, AnnouncementHtm ) {
        
    var AnnouncementView = FUI.View.extend({

        initialize: function(option) {
            option = option || {};
            this.options = option.options || this.options || {};

            if(option.el){
                this.$el = option.context ? option.context.$(option.el) : $(option.el);
                this.el = this.$el[0];
            }
            var contentObj = option.contentObj;
            this.announcements = [];
            
            this.initAnnouncementStore();
            if( contentObj ){
                this.storeAnnouncementItem( contentObj );
            }
        },

        initHtm : function(){
            this.$el.append( AnnouncementHtm );
            this.$marqueeContainer = this.$el.find(".announcement-marquee-container");
            this.$marqueeDom = this.$marqueeContainer.find(".announcement-marquee");
            this.bindMarqueeEvent();
        },

        bindMarqueeEvent : function(){
            var self = this;
            this.$marqueeContainer.off().on("click", ".announcement-close" , function(){
                if( $.isArray(self.announcements) && self.announcements.length ){
                    $.each( self.announcements , function( i , item ){
                        self.markAnnouncementReadDate( item );
                    });
                }
                self.destroy();
            }).on("click", "li" , function( e ){
                var $this = $(e.target).closest("li");

                var item = self.getItemFromAnnouncements( "id" , $this.attr("_id") );
                if( item ){
                    self.showAnnouncementDialog( item );
                    /*self.markAnnouncementReadDate( item );*/    
                }
            });          
        },

        showAnnouncementDialog : function( contentObj ){

            var content,
                self = this;

            this.pause();
            this.createDialogOverLayer();
            content = contentObj.announcement.replace( /\n/g , "<br/>" );
            this.$announcementDialog = $('<div>'+ content +'</div>');
            this.$announcementDialog.dialog({
                title:"系统公告",
                width: 500,
                height: 250,
                modal : false,
                close: function( event, ui ) {
                    event.stopPropagation();
                    self.removeDialogOverLayer();
                    self.resume();
                    $( this ).dialog( "destroy" );
                }
            });
        },

        createDialogOverLayer : function(){
            var self = this,
                overLayer = '<div class="ui-widget-overlay ui-front overLayer-contacts"></div>',
                $overLayer = $( '.overLayer-contacts');

            if( !$overLayer.length ){
                $("body").append( overLayer );
            }
        },
        removeDialogOverLayer : function(){
            $( '.overLayer-contacts' ).remove();
        },

        fillAnnouncementHtm : function( announcements ){

            var self = this, 
                content;

            $.each( announcements , function( i , item ){

                content = item.announcement.replace( "\n" , "" );
                self.$marqueeDom.append('<li _id='+ item.id +'>'+ (content || "") +'</li>');
            });
        },  

        showAnnouncementMarquee : function( data ){

            this.announcements = this.findAndFilterAllAnnouncements();
            var justFirstTimeShowDropAnimation = true;
            if( this.announcements.length ){
                this.initHtm();    
                this.fillAnnouncementHtm( this.announcements );
            }else{
                return false;
            }
            if( this.announcements.length >1 ){
                justFirstTimeShowDropAnimation = false;
            }
            this.$marqueeDom.marquee({
                loop: -1, 
                init: function ($marquee, options){
                    
                },
                yScroll: "top",
                doScrollAsContentIsNotEnoughLong : true,
                justFirstTimeShowDropAnimation : justFirstTimeShowDropAnimation,
                pauseSpeed : 0,
                beforeshow: function ($marquee, $li){
                   
                },
                show: function (){
                
                },
                aftershow: function ($marquee, $li){
                
                }
            });
        },

        pause : function(){
            this.$marqueeDom.marquee('pause');
            this.isPaused = true;
        },

        resume : function(){
            this.$marqueeDom.marquee('resume');  
            this.isPaused = false;
        },
        getItemFromAnnouncements : function( key , value ){
            var self = this,
                item;

            if( $.isArray(this.announcements) && this.announcements.length ){
                $.each(this.announcements , function( i , subItem ){

                    if( subItem[key] == value ){
                        item = subItem;
                        return false;
                    }
                });
            }
            return item;
        },

        initAnnouncementStore : function(){
            this.store = new Backbone.LocalStorage( "announcement_"+ window.dbId+"_"+ window.G_User.userId );
        },
        // 获取所有有效的系统通知
        findAndFilterAllAnnouncements : function(){
            var self = this,
                allValidAnnouncements,
                curDateStr = new Date().toDateString(),
                allStores = this.store.findAll();
                
            // 过滤出系统公告
            if( $.isArray(allStores) && allStores.length ){
                
                $.each( allStores , function( i , item ){
                    // 当前用户接收到的，未过期，且没有已读(readDate为空)
                    if( self.compareExpiredDate( item.expiredDate ) && !item.readDate && item.userId == window.G_User.userId ){
                        allValidAnnouncements = item;
                    }else{
                        // 如果过期时间超过了30天, 清除该条数据
                        /*var cha = Number( new Date().getTime() ) - Number(item.expiredDate);
                        var day = cha / (60*60*24*1000);
                        console.log( day , "===day");
                        if( day >30 ){*/
                        /*self.store.destroy( item );*/
                        /*}*/
                    }
                });
                // 只取第一条公告展示
                if( allValidAnnouncements ){
                    allValidAnnouncements = [allValidAnnouncements];
                }
            }
            
            return allValidAnnouncements || [];
        },
        requestLastestAnnouncement : function( param ){

            var self = this,
                url = param.url || "/announcement/getLastest?dbId="+dbId+"&r="+Math.random();

            $.ajax({
                type: 'POST',
                url: url ,
                data: param.data ,
                success: function( d ){
                    if( $.isFunction(param.callBack) ){
                        param.callBack( d );
                    }
                }
            });
        },
        storeAnnouncementItem : function( contentObj ){
            var self = this,
                allStores, exist = false, content;

            if( contentObj.content ){
                content = JSON.parse( contentObj.content );
                $.extend( contentObj , content );
            }

            delete contentObj.content;
            
            contentObj.userId = window.G_User.userId;
            contentObj.id = contentObj.dataId + "_"+ contentObj.userId;

            // 如果该条数据已经存在于localStore中，则不添加进去
            allStores = this.store.findAll();
               
            if( $.isArray(allStores) && allStores.length ){
                $.each( allStores , function( i , item ){

                    if( item.id == contentObj.id ){
                        exist = true;
                    }else{
                        //移除当前用户之前的旧公告
                        self.store.destroy( item );
                    }
                });
            }

            if( !exist ){
                this.store.create( contentObj );    
            }
        },
        markAnnouncementReadDate : function( contentObj ){
            contentObj = this.store.find( contentObj );
            contentObj.readDate = new Date().toDateString();
            this.store.update( contentObj );
        },
        // 比较当前时间与过期时间
        compareExpiredDate : function( ExpiredTime ){
            var time = new Date().getTime();
            if( time <= ExpiredTime ){
                // 正常，未过期
                return true;
            }else{
                return false;
            }
        },

        destroy : function(){
            this.$marqueeDom && this.$marqueeDom.remove() && (this.$marqueeDom = null);
            this.$marqueeContainer && this.$marqueeContainer.remove() && (this.$marqueeContainer = null);
            this.announcements = null;
        }
    });
    return AnnouncementView;
});