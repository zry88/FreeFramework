/**
 *author : Gill Gong
 *Date : 2014/5/9
 */
define(['jquery'], function($) {

    var tab_template = '<div class="{class}_tabPanel_container">' +
        '<div class="{class}_tabPanel_head" onselectstart="return false">' +
        '<ul class="{class}_tabPanel_titlelsit"></ul>' +
        '<span class="{class}_tabPanel_pullDown">' +
        '<div class="{class}_spaceRow"></div>' +
        '<div class="{class}_pullDownIcon"></div>' +
        '</span>' +
        '</div>' +
        '<div class="{class}_tabPanel_separateLine"></div>' +
        '</div>';

    //===========================================TabPanel Component==========================================================================//
    var TabPanel = function() {

        this.tabPanelData = null;
        this.firstTagId = null;
        this.lastTagId = null;
        this.tabSelectedCss = null;
        this.selectedId = null;
        this.defaultSelectedId = null;
        this.pullDownCom = null;
        this.activeTabWidth = -1;
        this.staticTabWidth = -1;
        this.textSpanWidth = -1;
        this.isClosingTabId = -1;
    };

    $.extend(TabPanel.prototype, {
        /**
         * TabPanel's conf is like below : {
         * 		container : xxx,
         *		className : 'tbs', 
         *		tabselectedCss : {
         *      	'background-color' : '#223311'		
         *		},
         *		'clickPullDownCss' : {
         *			'background-color':'#667744'	
         *		},
         *		defaultSelectId : '001',
         * 		itemData : [{
         * 			'title' : 'xxxx',
         * 			'id' : '',
         *			'static' : false,
         *			//beforeSelected / afterSelected / beforeClose / afterClose / afterAdd/afterUpdate/beforeUpdate
         *			/beforeunSelected/afterunSelected
         * 		}]
         * }
         */

        'Tab_template': '<li id="{id}"><span class="tabPanel_title">{title}</span><span class="tabPanel_deleteIcon"></span></li>',

        'Tab_item_first': 'firstItem',

        'Tab_item_end': 'endItem',

        'Tab_body': '_tabPanel_body',

        'Tab_pre': 'tab',

        'Body_pre': 'body',

        'AfterCloseActiveTabs': 'AfterCloseActiveTabs',

        'Render_body': 'renderTabPanelBody',

        'initate': function() {
            var templateHtml = tab_template;
            this.$container = $(this.tabPanelData.container).length ? $(this.tabPanelData.container) : $('.tabpanel-container');
            this.className = this.tabPanelData.className;
            this.tabSelectedCss = this.tabPanelData.tabselectedCss || 'tab_selected';
            this.defaultSelectedId = this.tabPanelData.defaultSelectId;
            templateHtml = templateHtml.replace(/{class}/g, this.className);
            this.$container.append(templateHtml);
            return this;
        },

        '_processTabPanelId': function() {

            var k = 0,
                tabPanelConfs = this.tabPanelData.itemData,
                len = tabPanelConfs.length;

            while (k != len) {
                k = 0;
                randId = (Math.random() * 100000000000) + "";
                randId = randId.replace('.', '-');

                for (var i = 0; i < len; i++) {
                    if (tabPanelConfs[i].id != randId) {
                        k++;
                    }
                }
            }
            return randId;
        },

        //====================================================================APIS======================================================================//
        'setData': function(tabPanelData) {

            this.tabPanelData = tabPanelData;
            this.initate();
            return this;
        },

        'show': function() {

            var $topContainer = null,
                $ulList = null;

            this.initTabPanelItems();
            this._selectedDefaultTabItem();
            this.bindEventsOnTabs();
            this.bindEventsOnPullDownIcon();
            this.tabPanelResize();
            $topContainer = this.$container.find("." + this.className + "_tabPanel_container");
            $ulList = this.$container.find("." + this.className + "_tabPanel_titlelsit");
            this.tabsResize($ulList, $topContainer);
            return this;
        },

        'getCurrentId': function() {

            return this.selectedId;
        },

        'getCurrentBody': function() {
            this.$container = this.tabPanelData ? $(this.tabPanelData.container) : $('.tabpanel-container');
            return this.$container.find("#" + this.Body_pre + this.selectedId);
        },

        'getCurrentTab': function() {
            this.$container = this.tabPanelData ? $(this.tabPanelData.container) : $('.tabpanel-container');
            return this.$container.find("#" + this.Tab_pre + this.selectedId);
        },

        'getIsClosingTabId': function() {
            return this.isClosingTabId;
        },

        'getIsClosingTabBody': function() {
            return this.$container.find("#" + this.Tab_pre + this.isClosingTabId);
        },

        'selectTabPage': function(id, notTriggerEvent) {
            if (id == null) return false;
            var $tab_selected = this.$container.find("#" + this.Tab_pre + id),
                $body_selected = this.$container.find("#" + this.Body_pre + id);

            if (!notTriggerEvent) this.triggerProcesserForChange(id, 'beforeSelected');
            $tab_selected.addClass(this.tabSelectedCss);
            //			$body_selected.css( 'visibility' , 'visible' );
            $body_selected.css('display', 'block');
            this.selectedId = id;
            if (!notTriggerEvent) this.triggerProcesserForChange(id, 'afterSelected');
            return this;
        },

        'unselecedTabPage': function(id, notTriggerEvent) {

            id = id || this.selectedId;
            var $tab_selected = this.$container.find("#" + this.Tab_pre + id),
                $body_selected = this.$container.find("#" + this.Body_pre + id);

            if (!notTriggerEvent) this.triggerProcesserForChange(id, 'beforeunSelected');
            $tab_selected.removeClass(this.tabSelectedCss);
            //			$body_selected.css( 'visibility' , 'hidden' );  //visibility="visible|hidden"
            $body_selected.css('display', 'none'); //visibility="visible|hidden"
            this.selectedId = null;
            if (!notTriggerEvent) this.triggerProcesserForChange(id, 'afterunSelected');
            return this;
        },

        'updateSelectedTab': function(itemConf) {

            var selectedTab = this.$container.find("#" + this.Tab_pre + itemConf.id),
                selectedBody = this.$container.find("#" + this.Body_pre + itemConf.id),
                selectedTextSpan = selectedTab[0].firstChild,
                dataArrIndex = this.isContainedTab(itemConf.id),
                itemDatas = this.tabPanelData.itemData;

            if (dataArrIndex === -1) return;
            this.triggerProcesserForChange(itemConf.id, 'beforeUpdate');
            itemDatas[dataArrIndex] = itemConf;
            selectedTextSpan.innerHTML = itemConf.title;
            this.unselecedTabPage(null, true);
            selectedBody.empty().off();
            this.selectTabPage(itemConf.id, true);
            this.triggerProcesserForChange(itemConf.id, 'afterUpdate');
            return this;
        },

        'getTabConf': function(id) {

            var itemDatas = this.tabPanelData.itemData;

            for (var i = 0, len = itemDatas.length; i < len; i++) {
                if (itemDatas[i].id === id) {
                    return itemDatas[i];
                }
            }
            return null;
        },

        'isContainedTab': function(id) {

            var itemDatas = this.tabPanelData.itemData;

            for (var i = 0, len = itemDatas.length; i < len; i++) {
                if (itemDatas[i].id === id) {
                    return i;
                }
            }
            return -1;
        },
        //====================================================================================================================================================================//

        '_selectedDefaultTabItem': function(notTriggerProcesser) {

            var defaultSelectedIds = this.defaultSelectedId,
                i = 0,
                len = defaultSelectedIds.length;

            for (; i < len; i++) {
                if (this.isContainedTab(defaultSelectedIds[i]) != -1) {
                    this.selectTabPage(defaultSelectedIds[i], notTriggerProcesser);
                    break;
                }
            }
            if (i == len) {
                this.selectTabPage(this.firstTagId, notTriggerProcesser);
            }
        },

        /**
         * processerName is like : beforeSelected / afterSelected / beforeClose / afterClose / afterAdd/afterUpdate
         */
        'triggerProcesserForChange': function(id, processerName) {

            var tabConf = this.getTabConf(id),
                doFun;
            //处理tabConf为null时报错 zw SCRM-3230
            if (tabConf) {
                doFun = tabConf[processerName];
            }

            if (typeof(doFun) === "function") {
                return doFun.apply(this, [id, arguments]);
            }
        },

        'initTabPanelItems': function() {
            var itemDatas = this.tabPanelData.itemData,
                $ulList = this.$container.find("." + this.className + "_tabPanel_titlelsit"),
                len = itemDatas.length,
                currentTab = null;


            this.firstTagId = itemDatas[0].id;
            for (var i = 0; i < len; i++) {
                currentTab = this._addTabItem($ulList, itemDatas[i]);
                this._createTabPanelBody(itemDatas[i].id);
                if (i === 0) {
                    currentTab.addClass(this.Tab_item_first);
                    this.staticTabWidth = currentTab.outerWidth();
                };
                if (i === len - 1) {
                    currentTab.addClass(this.Tab_item_end);
                };
            }
            this.lastTagId = itemDatas[len - 1].id;
            if (len < 2) { //zee 新版只有一个便签时候隐藏
                var warpDom = $('body');
                if (warpDom.hasClass('version_new')) {
                    $('.hb_tabPanel_head').hide();
                    $('.hb_tabPanel_body').css('top', '0');
                }
            }
            return this;
        },

        '_addTabItem': function($ulList, tabData) {

            var tabStr = this.Tab_template,
                $tabDom = null,
                deleteIcon = null;

            tabStr = tabStr.replace(/{id}/g, this.Tab_pre + tabData.id);
            tabStr = tabStr.replace(/{title}/g, tabData.title);
            $tabDom = $(tabStr);
            if (tabData['static'] === true) {
                deleteIcon = $tabDom[0].lastChild;
                deleteIcon.removeAttribute("class");
            }
            $ulList.append($tabDom);
            return $tabDom;
        },

        'updateTabTitle': function(content) {

            var tabDom = this.getCurrentTab();

            tabDom.find('.tabPanel_title').text(content);
        },

        '_createTabPanelBody': function(id) {

            var tab_container = this.$container.find("." + this.className + "_tabPanel_container"),
                tab_body = $("<div></div>");

            tab_body.attr({
                'class': this.className + "_tabPanel_body",
                'id': this.Body_pre + id
            });
            tab_body.css('display', 'none'); //解决ie下图片浮在不同面板上的情况
            //			tab_body.css( 'visibility' , 'hidden' );   //visibility="visible|hidden
            tab_container.append(tab_body);
            return tab_body;
        },

        'addTabPage': function(tabConf) {
            //zee 新版只有一个tab隐藏，多个显示
            var warpDom = $('body');
            if (warpDom.hasClass('version_new')) {
                $('.hb_tabPanel_head').show();
                $('.hb_tabPanel_body').css('top', '37px');
            }
            var $ulList = this.$container.find("." + this.className + "_tabPanel_titlelsit"),
                $topContainer = this.$container.find("." + this.className + "_tabPanel_container"),
                newEndTab = null,
                oldEndTab = null;

            tabConf.id = tabConf.id == null ? this._processTabPanelId() : tabConf.id;
            this.tabPanelData.itemData.push(tabConf);
            newEndTab = this._addTabItem($ulList, tabConf);
            this._createTabPanelBody(tabConf.id);
            oldEndTab = $ulList.find("." + this.Tab_item_end);
            oldEndTab.removeClass(this.Tab_item_end);
            newEndTab.addClass(this.Tab_item_end);
            $ulList.append(newEndTab);
            this.lastTagId = tabConf.id;
            this.unselecedTabPage(this.selectedId, true);
            this.selectTabPage(tabConf.id, true);
            this.tabsResize($ulList, $topContainer);
            this.triggerProcesserForChange(tabConf.id, 'afterAdd');
            return this;
        },

        'getTabTypeCount': function() {

            var itemDatas = this.tabPanelData.itemData,
                staticTabCount = 0;

            for (var i = 0, len = itemDatas.length; i < len; i++) {
                if (itemDatas[i]['static'] === true) {
                    staticTabCount++;
                }
            }

            return {
                'staticTabNum': staticTabCount,
                'activeTabNum': itemDatas.length - staticTabCount
            };
        },

        'deleteTabPage': function(id, notTriggerEvent, noTriggerConfirmEvent) {

            var $tabDom = this.$container.find("#" + this.Tab_pre + id),
                $topContainer = this.$container.find("." + this.className + "_tabPanel_container"),
                $bodyDom = this.$container.find("#" + this.Body_pre + id),
                $ulList = this.$container.find("." + this.className + "_tabPanel_titlelsit"),
                index = this.isContainedTab(id),
                lastTabItem = null,
                confirm = false;

            if (index == -1) return false;

            if (!noTriggerConfirmEvent) confirm = this.triggerProcesserForChange(id, 'closeTabPanelConfirm');
            if (confirm === true) return;
            if (!notTriggerEvent) this.triggerProcesserForChange(id, 'beforeClose');
            $tabDom.remove();
            $bodyDom.remove();
            if (!notTriggerEvent) this.triggerProcesserForChange(id, 'afterClose');
            this.tabPanelData.itemData.splice(index, 1);
            if (id == this.selectedId) {
                this.unselecedTabPage(this.selectedId, true);
                this._selectedDefaultTabItem(false);
            }
            this.tabsResize($ulList, $topContainer);
            //zee修改， 新版本只剩下一个tab时候隐藏tab  start
            var tabItems = this.tabPanelData.itemData
            if (tabItems.length == 1) {
                var warpDom = $('body');
                if (warpDom.hasClass('version_new')) {
                    $('.hb_tabPanel_head').hide();
                    $('.hb_tabPanel_body').css('top', '0');
                }
            }
            //zee修改， 新版本只剩下一个tab时候隐藏tab end
            if (id !== this.lastTagId) return true;
            lastTabItem = $ulList[0].lastChild;
            this.lastTagId = lastTabItem.getAttribute("id").replace(this.Tab_pre, "");
            lastTabItem.className = lastTabItem.className + ' ' + this.Tab_item_end;
            return true;
        },

        'bindEventsOnTabs': function() {

            var self = this,
                $ulList = this.$container.find("." + this.className + "_tabPanel_titlelsit");

            $ulList.bind("click", function(event) {
                var targetDom = event.target,
                    deleteIconClass = "tabPanel_deleteIcon",
                    textSpan = "tabPanel_title",
                    className = targetDom.className,
                    liDom = targetDom.parentNode,
                    liId = -1;

                if (className.indexOf(deleteIconClass) != -1) {
                    liId = liDom.getAttribute("id");
                    liId = liId.replace(self.Tab_pre, "");
                    self.isClosingTabId = liId;
                    self.deleteTabPage(liId);
                }
                if (className.indexOf(textSpan) != -1) {
                    liId = liDom.getAttribute("id");
                    liId = liId.replace(self.Tab_pre, "");
                    self.unselecedTabPage();
                    self.selectTabPage(liId);
                }
            });
        },

        'bindEventsOnPullDownIcon': function() {

            var pullDownIcon = this.$container.find("." + this.className + "_pullDownIcon"),
                self = this;

            pullDownIcon.bind("mousedown mouseup", function(event) {
                var $jqDom = $(this),
                    offset = null;

                if (event.type === "mousedown") {
                    $jqDom.css(self.tabPanelData.clickPullDownCss);
                } else {
                    $jqDom.css({
                        'background-color': "#ffffff"
                    });
                    offset = $jqDom.position();
                    self.createPullDownList({
                        left: offset.left + $jqDom.width(),
                        top: offset.top
                    });
                }
                return false;
            });
        },

        'bindEventsForCommunication': function() {
            var self = this;

            $(this.pullDownCom).bind("selectedNewTab", function(event, id) {
                self.unselecedTabPage();
                self.selectTabPage(id);
                self.pullDownCom.destroy();
                self.pullDownCom = null;
            }).bind("deleteAllTabs", function(event, id) {
                self.deleteAllActiveTabs();
                self.pullDownCom.destroy();
                self.pullDownCom = null;
            }).bind("deleteTab", function(event, id) {
                self.deleteTabPage(id);
                self.pullDownCom.destroy();
                self.pullDownCom = null;
            });

            $(document).bind("click", function(event) {
                var target = event.target;
                if (self.pullDownCom && target.className != self.className + "_pullDownIcon") {
                    self.pullDownCom.destroy();
                    self.pullDownCom = null;
                }
            });
        },

        'deleteAllActiveTabs': function() {
            var tabItems = this.tabPanelData.itemData,
                activeTabs = [],
                $ulList = this.$container.find("." + this.className + "_tabPanel_titlelsit"),
                currentTab = null,
                currentBody = null,
                lastTabItem = null;

            for (var i = 0; i < tabItems.length; i++) {
                if (tabItems[i]['static'] == null || tabItems[i]['static'] === false) {
                    activeTabs.push(tabItems[i].id);
                    currentTab = $ulList.find("#" + this.Tab_pre + tabItems[i].id);
                    currentBody = this.$container.find("#" + this.Body_pre + tabItems[i].id);
                    currentTab.remove();
                    currentBody.remove();
                    tabItems.splice(i, 1);
                    i--;
                }
            }
            $(this).trigger(this.AfterCloseActiveTabs, [activeTabs]);
            this.unselecedTabPage(null, true);
            this._selectedDefaultTabItem();
            lastTabItem = $ulList[0].lastChild;
            this.lastTagId = lastTabItem.getAttribute("id").replace(this.Tab_pre, "");
            lastTabItem.className = lastTabItem.className + ' ' + this.Tab_item_end;
        },

        'createPullDownList': function(pos) {

            if (this.pullDownCom != null) return;
            var pullDownListConf = this._getPullDownListConf(),
                pullDownCom = new PullDownList(pullDownListConf),
                pullDownCom_top = 29,
                pullDownCom_left = 153;

            this.pullDownCom = pullDownCom;
            pos.left = pos.left - pullDownCom_left;
            pos.top = pos.top + pullDownCom_top;
            pullDownCom.show(pos);
            this.bindEventsForCommunication();
        },

        '_getPullDownListConf': function() {
            /*zee start 20141224*/
            var textSpanArr = this.$container.find("." + this.className + "_tabPanel_titlelsit .tabPanel_title");
            for (var i = 0; i < textSpanArr.length; i++) {
                this.tabPanelData.itemData[i].title = $(textSpanArr[i]).text();
            }
            /*zee end 20141224*/
            var pullDownListConf = {
                    'className': this.className,
                    'container': this.$container.find('.' + this.className + "_tabPanel_head"),
                    'seperateLineClass': 'hb_pullDown_seperateLine',
                    'leftIconClass': 'hb_pullDownIcon_leftIcon',
                    'rightIconClass': 'hb_pullDownIcon_rightIcon',
                    'hoverCss': 'crm-common-row-hover',
                    'items': []
                },
                k = 0,
                itemDatas = this.tabPanelData.itemData,
                item = {
                    'id': '-1',
                    'name': '全部关闭',
                    'leftIcon': true,
                    'sperateLine': true
                };

            pullDownListConf.items.push(item);
            for (var i = 0, len = itemDatas.length; i < len; i++) {
                item = {
                    'id': itemDatas[i].id + '',
                    'name': itemDatas[i].title
                };
                if (itemDatas[i]['static'] == null || itemDatas[i]['static'] == false) {
                    item.rightIcon = true;
                } else {
                    k++;
                }
                pullDownListConf.items.push(item);
            }
            pullDownListConf.items[k].sperateLine = true;
            return pullDownListConf;
        },

        'tabPanelResize': function() {

            var $topContainer = this.$container.find("." + this.className + "_tabPanel_container"),
                $ulList = this.$container.find("." + this.className + "_tabPanel_titlelsit"),
                self = this;

            $topContainer[0].style.position = 'relative';
            $(window).resize(function(eve) {
                self.tabsResize($ulList, $topContainer);
            });
        },

        'tabsResize': function($ulList, $topContainer) {

            var textSpanArr = $ulList.find(".tabPanel_title"),
                tabTypeNum = this.getTabTypeCount(),
                disWidth = 0,
                allTabsWidth = 0;

            this.activeTabWidth = this.activeTabWidth == -1 ? $ulList.find(".endItem").outerWidth() : this.activeTabWidth;
            this.staticTabWidth = this.staticTabWidth == -1 ? $ulList.find(".firstItem").outerWidth() : this.staticTabWidth;
            this.textSpanWidth = this.textSpanWidth == -1 ? textSpanArr[0].offsetWidth : this.textSpanWidth;
            allTabsWidth = this.activeTabWidth * tabTypeNum.activeTabNum + this.staticTabWidth * tabTypeNum.staticTabNum + 20,
                $topContainer[0].style.width = null;
            disWidth = $topContainer.width() - allTabsWidth;
            if (disWidth < 0) {
                var newTextSpanWidth = this.textSpanWidth + (disWidth / (tabTypeNum.staticTabNum + tabTypeNum.activeTabNum));
                if (newTextSpanWidth > 0) {
                    newTextSpanWidth = newTextSpanWidth < 1 ? 0 : newTextSpanWidth;
                    for (var i = 0, len = textSpanArr.length; i < len; i++) {
                        textSpanArr[i].style.width = newTextSpanWidth + 'px';
                    }
                } else {
                    for (var i = 0, len = textSpanArr.length; i < len; i++) {
                        textSpanArr[i].style.width = 0 + 'px';
                    }
                    var totalTabsWidth = (this.activeTabWidth - this.textSpanWidth) * tabTypeNum.activeTabNum + (this.staticTabWidth - this.textSpanWidth) * tabTypeNum.staticTabNum + 20;
                    $topContainer[0].style.width = totalTabsWidth + 'px';

                }
            } else if (disWidth > 0) {
                for (var i = 0, len = textSpanArr.length; i < len; i++) {
                    textSpanArr[i].style.width = null;
                }
            }
        }
    });

    //////////=======================================================================pullDownList Component================================================================================================//
    /**
     *dataConf like below:{
     *	'className' : 'hb',
     *	'container' : pullDownContainer,
     *	'seperateLineClass' : 'hb_pullDown_seperateLine',
     *	'leftIconClass' : 'hb_pullDownIcon_leftIcon',
     *	'rightIconClass' : 'hb_pullDownIcon_rightIcon',
     *	'hoverCss' : {
     *		'background-color' : '#999999'
     *	},
     *	items : [{
     *		'id' : xxx,
     *		'name' : xxx,
     *		'sperateLine' : false,
     *		'leftIcon' : XXX,
     *		'rightIcon' : XXX
     *	}
     *	]
     *}
     */
    var PullDownList = function(dataConf) {

        this.$container = $(dataConf.container);
        this.width = dataConf.width;
        this.lineHeight = dataConf.lineHeight;
        this.items = dataConf.items;
        this.className = dataConf.className;
        this.seperateLineClass = dataConf.seperateLineClass;
        this.leftIconCss = dataConf.leftIconClass;
        this.rightIconCss = dataConf.rightIconClass;
        this.hoverCss = dataConf.hoverCss;
        this.deleteOverRow = [];
    };

    $.extend(PullDownList.prototype, {

        //==============================================================APIS===========================================================================================//
        'show': function(pos) {

            var outerContainer = null;

            this._createPullDownTemplate();
            this.addRows();
            outerContainer = this.$container.find("." + this.className + "_pullDown_Com");
            outerContainer.css({
                'left': pos.left,
                'top': pos.top
            });
            this.bindEventsOnPullDownCom();
            return this;
        },

        'destroy': function() {

            var currentContainer = this.$container.find("." + this.className + "_pullDown_Com");

            currentContainer.empty();
            currentContainer.remove();
            this.$container = null;
            this.items = null;
        },
        //=======================================================================================================================================================//

        'ContainerTemplate': '<div class="{class}_pullDown_Com"><ul class="{class}_pullDown_lis"></ul></div>',

        'liTemplate': '<li><span class="leftIcon"></span><span class="textContent">{text}</span><span class="rightIcon"></span></li>',

        '_createPullDownTemplate': function() {

            var containerTem = this.ContainerTemplate;

            containerTem = containerTem.replace(/{class}/g, this.className);
            this.$container.append(containerTem);
            return true;
        },

        'addRows': function() {

            var $ulList = this.$container.find("." + this.className + "_pullDown_lis");

            for (var i = 0, len = this.items.length; i < len; i++) {
                this._addRow($ulList, this.items[i]);
            }
        },

        '_addRow': function(ulList, itemData) {

            var liHtml = this.liTemplate.replace(/{text}/g, itemData.name),
                liDom = $(liHtml);

            liDom.attr('id', itemData.id);
            if (itemData.sperateLine) {
                liDom.addClass(this.seperateLineClass);
            }
            ulList.append(liDom);
            this._addIconsInRow(liDom, itemData);
            return this;
        },

        '_addIconsInRow': function(liDom, itemData) {

            var $leftIcon = liDom.find(".leftIcon"),
                $rightIcon = liDom.find(".rightIcon");

            if (itemData.leftIcon) {
                $leftIcon.addClass(this.leftIconCss);
                this.deleteOverRow.push(itemData.id);
            }
            if (itemData.rightIcon) {
                $rightIcon.addClass(this.rightIconCss);
            }
        },

        'bindEventsOnPullDownCom': function() {

            var $ulList = this.$container.find("." + this.className + "_pullDown_lis"),
                self = this;

            $ulList.bind('click', function(event) {
                var targetDom = event.target,
                    parentDom = targetDom.parentNode,
                    id = parentDom.getAttribute('id'),
                    targetClass = targetDom.className,
                    deleteOverRowStr = self.deleteOverRow.join(".");

                if (targetClass.indexOf("textContent") != -1 && id != "-1") {
                    $(self).trigger("selectedNewTab", [id]);
                } else if (targetClass.indexOf(self.leftIconCss) != -1 || deleteOverRowStr.indexOf(id) != -1) {
                    $(self).trigger("deleteAllTabs", [id]);
                } else if (targetClass.indexOf(self.rightIconCss) != -1) {
                    $(self).trigger("deleteTab", [id]);
                }

            });

            $ulList.bind("mouseover mouseout", function(event) {

                var targetDom = event.target,
                    currentDom = targetDom.parentNode;

                if (currentDom.tagName != "LI") {
                    currentDom = targetDom;
                }
                if (currentDom.tagName === "LI") {
                    if (event.type === "mouseover") {
                        $(currentDom).addClass(self.hoverCss);
                    } else {
                        $(currentDom).removeClass(self.hoverCss);
                    }
                }
            });
        }
    });
    return new TabPanel();
});
