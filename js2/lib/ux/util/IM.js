/**
 * 聊天
 */
define(['jquery'], function($) {
    var IM = {
        // 表情图标标签
        faceTags: [
            "[微笑]", "[撇嘴]", "[色]", "[发呆]", "[得意]", "[流泪]", "[害羞]", "[闭嘴]", "[睡]", "[大哭]", "[尴尬]", "[发怒]", "[调皮]", "[呲牙]", "[惊讶]",
            "[酷]", "[冷汗]", "[抓狂]", "[吐]", "[偷笑]", "[白眼]", "[傲慢]", "[饥饿]", "[困]", "[惊恐]", "[流汗]", "[憨笑]", "[大兵]", "[奋斗]", "[疑问]",
            "[嘘]", "[晕]", "[敲打]", "[再见]", "[擦汗]", "[抠鼻]", "[鼓掌]", "[糗大了]", "[坏笑]", "[左哼哼]", "[右哼哼]", "[哈欠]", "[鄙视]", "[委屈]", "[快哭了]",
            "[阴脸]", "[亲亲]", "[吓]", "[可怜]", "[菜刀]", "[啤酒]", "[篮球]", "[乒乓球]", "[咖啡]", "[示爱]", "[爱心]", "[心碎]", "[刀]", "[足球]", "[瓢虫]",
            "[便便]", "[拥抱]", "[强]", "[弱]", "[握手]", "[胜利]", "[抱拳]", "[勾引]", "[拳头]", "[差劲]", "[爱你]", "[NO]", "[OK]", "[可爱]", "[咒骂]",
            "[折磨]", "[玫瑰]", "[凋谢]", "[衰]", "[骷髅]", "[猪头]", "[闪电]", "[炸弹]", "[饭]", "[西瓜]", "[蛋糕]", "[礼物]", "[太阳]", "[月亮]", "[鞭炮]"
        ],
        // 获取私聊房间ID
        getRoomId: function(toUid, uid) {
            var uidArr = [];
            uidArr = [toUid, uid];
            uidArr.sort(function(a, b) {
                return a - b;
            });
            return uidArr.join('_');
        },
        // 取文件绝对地址
        getRealSrc: function(path) {
            return path.indexOf('http') >= 0 ? path : CONFIG.DOWNLOAD_PATH + path;
        },
        // 取一个联系人
        getOneContacter: function(option) {
            if (!option) return null;
            var theUser = {},
                theId = option.imAccountId || option.id;
            if (theId) {
                theUser = Hby.datas.allUsers.get(theId);
            } else {
                theUser = Hby.datas.allUsers.findWhere(option);
            }
            return theUser ? theUser.attributes : {
                userId: 0,
                displayName: '',
                photoUrl: ''
            };
        },
        // 取一个组
        getOneTeam: function(option) {
            if (!option) return null;
            var theTeam = {},
                theId = option.imAccountId || option.id;
            if (theId) {
                theTeam = Hby.datas.teams.get(theId);
            } else {
                theTeam = Hby.datas.teams.findWhere(option);
            }
            return theTeam ? theTeam.attributes : {};
        },
        // 打开单聊聊天窗
        openChat: function(option) {
            option = option || {};
            window.location.hash = '#im/p2p/' + option.chatId + '/' + (option.userId || 0);
            Hby.datas.session.currentItem = option.chatId;
            var theModel = Hby.datas.currentContacts.get(option.chatId);
            if (theModel) {
                Hby.Events.trigger('onCurrent:onChangeBg', {
                    chatId: option.chatId
                });
            } else {
                var userModel = this.getOneContacter({ userId: option.userId || 0 });
                if (userModel) {
                    userModel.chatId = option.chatId;
                    Hby.datas.currentContacts.add({
                        chatId: option.chatId,
                        name: userModel.displayName,
                        photoUrl: userModel.photoUrl,
                        scene: 'p2p',
                        user: userModel
                    });
                }
            }
        },
        // 打开群组聊天窗
        openTeamChat: function(option) {
            option = option || {};
            window.location.hash = '#im/team/' + option.chatId + '/0';
            Hby.datas.session.currentItem = option.chatId;
            var theModel = Hby.datas.currentContacts.get(option.chatId);
            if (theModel) {
                Hby.Events.trigger('onCurrent:onChangeBg', {
                    chatId: option.chatId
                });
            } else {
                var teamModel = this.getOneTeam({ teamId: option.chatId.toString() || 0 });
                if (teamModel) {
                    Hby.datas.currentContacts.add({
                        chatId: option.chatId,
                        name: teamModel.name || '讨论组',
                        photoUrl: '',
                        scene: 'team',
                        team: teamModel
                    });
                }
            }
        },
        // 转为超链接
        urlToHref: function(str) {
            str = str.replace(/http[s]?:\/\/[\w.][^\,。‘’“”，《》<>{}+]*/g,'$& ');//隔开标点
            str = str.replace(/http[s]?:\/\/[\w.][^ ]*/g,'<a href="$&" target="_blank" style="color:#0092d8;">$&</a>');//zee
            return str;
            //return str.replace(/(https?:\/\/[^ ]*)/g, '<a href="$1" target="_blank" style="color:#0092d8;">$1</a>');
        },
        // 过滤标签
        filterHtml: function(str) {
            var valiHTML = ["br|img"];
            if (Hby.util.System.checkBrowser.mozilla) {
                str = str.replace(/(<!--\[if[^<]*?\])>([\S\s]*?)<(!\[endif\]-->)/gi, '');
            }
            str = str.replace(/_moz_dirty=""/gi, "")
                .replace(/\[/g, "[[-")
                .replace(/\]/g, "-]]")
                .replace(/<\/ ?tr[^>]*>/gi, "[br]")
                .replace(/<\/ ?td[^>]*>/gi, "    ")
                .replace(/<(ul|dl|ol)[^>]*>/gi, "[br]")
                .replace(/<(li|dd)[^>]*>/gi, "[br]")
                .replace(/\<p[^>]*>/gi, "[br]")
                .replace(/\<div[^>]*>/gi, "[br]")
                .replace(/style=[\"\']([^\"\']+)[\"\']/gi, "")
                .replace(new RegExp("<(/?(?:" + valiHTML.join("|") + ")[^>]*)>", "gi"), "[$1]")
                .replace(new RegExp('<span([^>]*class="?at"?[^>]*)>', "gi"), "[span$1]")
                .replace(/<[^>]*>/g, "")
                .replace(/\[\[\-/g, "[")
                .replace(/\-\]\]/g, "]")
                .replace(new RegExp("\\[(/?(?:" + valiHTML.join("|") + "|span)[^\\]]*)\\]", "gi"), "<$1>");
            // if (!window.XMLHttpRequest) {
            //     str = str.replace(/\r?\n/gi, "<br>");
            // }
            str = $.trim(str.replace(/^<br>/, '').replace(/(\<br[^>]*>){2,}/gi, '<br>'));
            return str;
        },
        filterTag: function(str) {
            if (Hby.util.System.checkBrowser.mozilla) {
                str = str.replace(/<\s*br\s*[^<]*>$/ig, '');
            }
            return str.replace(/&nbsp;/gi, ' ')
                .replace(/<\s*br\s*[^<]*>/ig, '\n')
                .replace(/&amp;/ig, '&')
                .replace(/&lt;/ig, '<')
                .replace(/&gt;/ig, '>');
        },
        unFilterTag: function(str) {
            return str.replace(/&/ig, '&amp;')
                .replace(/</ig, '&lt;')
                .replace(/>/ig, '&gt;')
                .replace(/\r?\n/ig, '<br>')
                .replace(/&nbsp;/gi, ' ');
        },
        //表情转字符串
        faceToText: function(str) {
            var patt = new RegExp('<img face=\"\" src=\".*?f0(\\d+).gif\"+/?>', 'g');
            var newStr = str;
            if (str.indexOf("<img") == -1) {
                return this.filterTag(str);
            }
            while (arr = patt.exec(str)) {
                newStr = newStr.replace(new RegExp(arr[0], 'g'), this.faceTags[arr[1]]);
            }
            newStr = this.filterTag(newStr);
            return newStr;
        },
        //字符串转表情
        textToFace: function(str) {
            str = this.unFilterTag(str);
            var arr = str.match(/\[.*?\]/g);
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    var index = _.indexOf(this.faceTags, arr[i]);
                    if (index >= 0) {
                        str = str.replace(arr[i], '<img face="" src="' + CONFIG.FACE_ICON_PATH + index + '.gif"/>');
                    }
                }
            }
            return str;
        },
        // 光标处插入文本
        insertText: function(selector, str) {
            var ob = selector[0];
            ob.focus();
            var selection = window.getSelection ? window.getSelection() : document.selection;
            var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
            if (!window.getSelection) {
                range.innerText(str);
                range.collapse(false);
                range.select();
                ob.focus();
            } else {
                range.collapse(false);
                var hasR = range.createContextualFragment(str);
                var hasR_lastChild = hasR.lastChild;
                range.insertNode(hasR);
                if (hasR_lastChild) {
                    range.setEndAfter(hasR_lastChild);
                    range.setStartAfter(hasR_lastChild)
                }
                selection.removeAllRanges();
                selection.addRange(range)
                ob.focus();
            }
        },
        // 用户头像
        getImage: function(imgSrc, nameStr, size, attrObj) {
            var size = size || 'm', //l在，m中, s小 sr
                realImgSrc = imgSrc ? (picServerHost + size + '_' + imgSrc) : imgSrc,
                imgConfig = {
                    l: 100,
                    m: 40,
                    s: 20,
                    sr: 30
                },
                $el = $('<div><span class="crm-image-show-client"></span></div>'),
                imgContainer = $el.find('.crm-image-show-client').css({
                    width: imgConfig[size] + 'px',
                    height: imgConfig[size] + 'px',
                    lineHeight: imgConfig[size] + 'px'
                }),
                img = new Image(),
                nameWord = Hby.util.String.toPinyin(nameStr),
                that = this;
            if(attrObj){
                for(var key in attrObj){
                    var val = attrObj[key];
                    if(key == 'css'){
                        imgContainer.css(val);
                    }else{
                        imgContainer.attr(key, val);
                    }
                }
            }
            if (imgSrc) {
                img.src = realImgSrc;
                img.id = Hby.util.Tool.guid();
                img.width = img.height = imgConfig[size];
                $(img).data('error_times', 0);
                imgContainer.append($(img));
                $(img).on('load', function(event) {
                    var target = $(event.currentTarget);
                    $('#' + target.attr('id')).parent().empty().append(target);
                });
                $(img).error(function() {
                    $(this).data('error_times', $(this).data('error_times') + 1);
                    if ($(this).data('error_times') < 3) {
                        switch ($(this).data('error_times')) {
                            case 1:
                                $(this).attr('src', picServerHost + 'l_' + imgSrc);
                                break;
                            case 2:
                                $(this).attr('src', picServerHost + imgSrc);
                                break;
                        }
                    } else {
                        $(this).off('error');
                        $('#' + $(this).attr('id')).parent().addClass('im-opacity-1 color5')
                            .css('background-color', that.imageIconColor(nameWord))
                            .text(nameStr.substr(0, 1));
                    }
                    return false;
                });
            } else {
                imgContainer.addClass('im-opacity-1 color5')
                    .css('background-color', this.imageIconColor(nameWord))
                    .text(nameStr.substr(0, 1));
            }
            return $el.html();
        },

        // 头像底色
        imageIconColor: function(hashRoot) {
            var staticColors = [
                '#008faf',
                '#9ac6c7',
                '#cae4e3',
                '#577140', //zhangli modify #b8dbc5 ->#577140
                '#5cb389',
                '#f1bcb8',
                '#b68c72' //zhangli modify #E9E5E5->#b68c72
            ];
            var aHex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'],
                hashIndex = 0,
                numIndex = 0,
                rgb = '#',
                i;
            if (!hashRoot) {
                for (i = 0; i < staticColors.length; i++) {
                    numIndex = Math.floor(Math.random() * 16);
                    rgb += aHex[numIndex];
                }
            } else {
                hashRoot = hashRoot + '';
                for (var i = 0; i < hashRoot.length; i++) {
                    hashIndex = hashIndex + hashRoot.charCodeAt(i);
                }
                hashIndex = hashIndex % staticColors.length;
                rgb = staticColors[hashIndex];
            }
            return rgb;
        },
        // 生成消息内容
        getNotifyText: function(msg) {
            var theUserArr = [],
                notifyText = '',
                theNames = '';
            if (msg.attach.type == 'dismissTeam' || msg.attach.type == 'updateTeam' || msg.attach.type == 'leaveTeam') {
                var theUser = Hby.ux.util.IM.getOneContacter({ imAccountId: msg.attach.users[0].account });
                if (theUser) {
                    theUserArr = [theUser];
                }
            } else {
                theUserArr = _.filter(_.pluck(Hby.datas.allUsers.models, 'attributes'), function(theUser) {
                    return _.indexOf(msg.attach.accounts, theUser.imAccountId) >= 0;
                });
            }
            if (theUserArr.length) {
                _.each(theUserArr, function(theUser, index) {
                    theNames += (index ? ',' : '') + (window.imUser.imAccountId == theUser.imAccountId ? '你' : theUser.displayName);
                });
            }
            switch (msg.attach.type) {
                case 'addTeamMembers':
                    notifyText = theNames + '被加入了组: ' + msg.attach.team.name;
                    break;
                case 'removeTeamMembers':
                    notifyText = theNames + '被移出了组: ' + msg.attach.team.name;
                    break;
                case 'leaveTeam':
                    notifyText = theNames + '退出了组: ' + msg.attach.team.name;
                    break;
                case 'updateTeam':
                    notifyText = theNames + '修改讨论组的主题为: ' + msg.attach.team.name;
                    break;
            }
            return notifyText;
        },
        getMapedExtClass: function(fileExt) {
            var mapExtClass = {
                bmp: 'im-bmp-icon',
                gif: 'im-bmp-icon',
                png: 'im-bmp-icon',
                jpg: 'im-bmp-icon',
                jpeg: 'im-bmp-icon',
                tif: 'im-bmp-icon',
                psd: 'im-bmp-icon',
                pdg: 'im-bmp-icon',
                ai: 'im-bmp-icon',
                ico: 'im-bmp-icon',
                css: 'im-css-icon',
                doc: 'im-doc-icon',
                docx: 'im-doc-icon',
                html: 'im-html-icon',
                htm: 'im-html-icon',
                ppt: 'im-ppt-icon',
                pptx: 'im-ppt-icon',
                '7z': 'im-rar-icon',
                gz: 'im-rar-icon',
                bz: 'im-rar-icon',
                ace: 'im-rar-icon',
                uha: 'im-rar-icon',
                zpaq: 'im-rar-icon',
                rar: 'im-rar-icon',
                txt: 'im-text-icon',
                yml: 'im-text-icon',
                ini: 'im-text-icon',
                js: 'im-text-icon',
                url: 'im-url-icon',
                xls: 'im-xls-icon',
                xlsx: 'im-xsl-icon',
                et: 'im-xsl-icon',
                zip: 'im-zip-icon',
                pdf: 'im-pdf-icon',
                none: 'im-default-icon'
            };
            return (mapExtClass[fileExt]) ? mapExtClass[fileExt] : 'im-default-icon';
        },
        // 弹出下载对话框
        showDownloadDialog: function() {
            var isWindow = Hby.util.System.isWindow(),
                contentHtml = isWindow ? '<p>请点击[下载]，关闭所有浏览器，双击运行WinbonsPluginInstall.exe，<br/>安装完之后重启浏览器<p>' : '<p>暂时不支持截图功能！<p>';
            Hby.util.System.showDialog('download', contentHtml, isWindow ? {
                '下载': function(event) {
                    if (Hby.util.System.isWindow()) {
                        var elemIF = document.createElement("iframe");
                        elemIF.src = CAPTURE_PLUGIN_URL;
                        elemIF.style.display = "none";
                        document.body.appendChild(elemIF);
                    }
                }
            } : {
                '关闭': function(event) {
                    $(this).dialog('close');
                }
            });
        },
        detecteQQInstallation: function() {
            var pt = {
                    ishttps: false,
                    low_login: 0,
                    keyindex: 9,
                    init: function() {
                        pt.ishttps = /^https/.test(window.location);
                        if (navigator.mimeTypes["application/nptxsso"]) {
                            var b = document.createElement("embed");
                            b.type = "application/nptxsso";
                            b.style.width = "0px";
                            b.style.height = "0px";
                            document.body.appendChild(b);
                            pt.sso = b
                        }
                    },
                    switchLowLogin: function(a) {}
                },
                _suportActive = function() {
                    var a = true;
                    try {
                        if (window.ActiveXObject || window.ActiveXObject.prototype) {
                            a = true
                        } else {
                            a = false
                        }
                    } catch (b) {
                        a = false
                    }
                    return a
                },
                AXO, a, o;

            if (_suportActive()) {
                try {
                    AXO = new ActiveXObject("SSOAxCtrlForPTLogin.SSOForPTLogin2");
                    a = AXO.CreateTXSSOData();
                    AXO.InitSSOFPTCtrl(0, a);
                    o = AXO.DoOperation(1, a);
                    return (null == o ? false : true);
                } catch (e) {
                    return false;
                }
            } else {
                try {
                    pt.init();
                    o = pt.sso.InitPVA();
                    return (false == o ? false : true);
                } catch (e) {
                    return false;
                }
            }
        }
    };
    return IM;
});
