/**
 * 七牛存储
 */
define(function() {
    var Qiniu = {
        //验证七牛上传路径
        checkQiniuURL: function(url) {
            var re = /dn\-openwinbons\.qbox\.me/g;
            var re1 = /qiniucdn/g;
            return re.test(url) || re1.test(url);
        },

        /**
         ***添加上传七牛日志记录
         ***参数：
         **fileAccessType://访问类型，同上
         **itemType：//模块类型，表示是哪个模块的文件，取值于 Customer(客户),Contact(联系人),Scheduled(任务)，Document(文档)，Im(im),Edm(edm),Dynamic(动态)
         **fileKey：//上传成功后，七牛返回的文件的唯一标识key
         **fileName://上传的文件的原始名称
         **fileSize://文件大小
         **/
        qiniuAddUploadLog: function(params, successfn, errorfn) {
            $.ajax({
                type: "post",
                url: "qiniufile/addUploadLog",
                data: params,
                success: function(data) {
                    successfn && (typeof(successfn) == "function") && successfn(data);
                },
                error: function() {
                    errorfn && (typeof(errorfn) == "function") && errorfn(data);
                }
            });
        },

        /***
         ***批量添加上传日志记录[字符串形式的传参]
         ***参数：
         **fileAccessTypeList://访问类型，同上
         **itemTypeList：//模块类型，表示是哪个模块的文件，取值于 Customer(客户),Contact(联系人),Scheduled(任务)，Document(文档)，Im(im),Edm(edm),Dynamic(动态)
         **fileKeyList：//上传成功后，七牛返回的文件的唯一标识key
         **fileNameList://上传的文件的原始名称
         **fileSizeList://文件大小
         ***/
        qiniuBatchAddUploadLog: function(params, successfn, errorfn, issync) {
            var isasync = issync == 1 ? false : true;
            $.ajax({
                type: "post",
                url: "qiniufile/batchAddUploadLog1",
                data: params,
                async: isasync,
                success: function(data) {
                    successfn && (typeof(successfn) == "function") && successfn(data);
                },
                error: function() {
                    errorfn && (typeof(errorfn) == "function") && errorfn(data);
                }
            });
        },

        /***
         ** 七牛是否可以上传文件检查
         **参数：
         *fileTypes[]: //所有上传文件的类型 eg: fileTypes[jpg,gif,exe,bat]
         *fileSizes[]: //所有上传文件的大小(单件:Byte)eg: fileSizes[123,888,999,123036]
         ***/
        qiniuCheckFileUpload: function(params, successfn, errorfn, issync) {
            var isasync = issync == 1 ? true : false;
            $.ajax({
                type: "post",
                url: "qiniufile/checkFileUpload",
                data: params,
                async: isasync,
                success: function(data) {
                    successfn && (typeof(successfn) == "function") && successfn(data);
                },
                error: function() {
                    errorfn && (typeof(errorfn) == "function") && errorfn(data);
                }
            });
        },

        /***
         ** 七牛是否可以上传文件检查公共函数
         ***/
        qiniuCheckCommon: function(up, files) {
            var getFileNamePostfix = function(name) {
                var last = name.lastIndexOf('.');
                return {
                    name: name.substring(0, last),
                    postfix: name.substring(last + 1)
                }
            };
            var isAdded = true;
            for (var i = 0; i < files.length; i++) {
                var prefix = getFileNamePostfix(files[i].name).postfix,
                    size = files[i].size,
                    params = {
                        "fileTypes": [prefix],
                        "fileSizes": [size]
                    };
                this.qiniuCheckFileUpload(params, function(data) {
                    if (data.resultCode != 200) {
                        isAdded = false;
                    }
                });
            }
            if (!isAdded) {
                for (var j = 0; j < up.files.length; j++) {
                    up.files.splice(j, 1);
                    files.splice(j, 1);
                }
                debug.warn("您购买的空间容量不足，请购买更多空间！");
            }
            return isAdded;
        },
        convertByteUnit: function(size, unit, decimals, direction, targetunit) {
            /**
             * 容量单位计算，支持定义小数保留长度；定义起始和目标单位，或按1024自动进位
             *
             * @param int size,容量计数
             * @param type unit,容量计数单位，默认为字节
             * @param type decimals,小数点后保留的位数，默认保留一位
             * @param type targetUnit,转换的目标单位，默认自动进位
             * @return type 返回符合要求的带单位结果
             */
            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'],
                index, targetIndex, i, l = units.length,
                num,
                regFloat = /(^[+-]?\d*(?:\.\d+)?(?:[Ee][-+]?\d+)?)([kKMmGgTtpPeE]?[bB])?$/;
            if (typeof size === 'string') {
                num = size.match(regFloat);
                size = num[1];
                unit = num[2] || unit;
            }
            unit = unit || 'B';
            if (unit) {
                unit = unit.toUpperCase();
                for (i = 0; i < l; i++) {
                    if (unit === units[i]) {
                        index = i;
                    }
                    if (targetunit && (targetunit + '').toUpperCase() === units[i]) {
                        targetIndex = i
                    }
                }
            }
            if (direction === undefined) { //确定转化方向
                if (targetIndex === undefined) {
                    direction = true;
                } else {
                    direction = targetIndex > index;
                }
            }
            size = parseFloat(size);
            while ((direction ? (size >= 1024 && index < l - 1) : (size <= 1024 && index > 0))) {
                size = (direction ? size / 1024 : size * 1024);
                direction ? index++ : index--;
                if (index === targetIndex) break;
            }

            if (decimals) {
                size = size.toFixed(decimals) + units[index];
            } else {
                decimals = decimals || 2;
                size = (size.toFixed(decimals) + '').replace(/\.00/, '') + units[index];
            }
            return size
        },

        checkURL: function(url) {
            var re = /dn\-openwinbons\.qbox\.me/g,
                re1 = /qiniucdn/g;
            return re.test(url) || re1.test(url);
        },

        getNoExtFileName: function(name) {
            name += '';
            return name.substring(0, name.lastIndexOf('.'));
        },
        //获取文件格式名字
        getExtName: function(name) {
            var re = /\./,
                a, l;
            if (re.test(name)) {
                a = name.split(re);
                l = a.length;
                return a[l - 1].toLowerCase();
            }
            return null;
        },
        getMapExtClass: function(name, isExt) {
            var mapExtClass = {
                    bmp: 'kr-bmp',
                    gif: 'kr-bmp',
                    png: 'kr-bmp',
                    jpg: 'kr-bmp',
                    jpeg: 'kr-bmp',
                    tif: 'kr-bmp',
                    psd: 'kr-bmp',
                    pdg: 'kr-bmp',
                    ai: 'kr-bmp',
                    ico: 'kr-bmp',
                    css: 'kr-css',
                    doc: 'kr-doc',
                    docx: 'kr-doc',
                    html: 'kr-html',
                    htm: 'kr-html',
                    ppt: 'kr-ppt',
                    pptx: 'kr-ppt',
                    rar: 'kr-rar',
                    '7z': 'kr-rar',
                    gz: 'kr-rar',
                    bz: 'kr-rar',
                    ace: 'kr-rar',
                    uha: 'kr-rar',
                    zpaq: 'kr-rar',
                    rar: 'kr-rar',
                    txt: 'kr-text',
                    yml: 'kr-text',
                    ini: 'kr-text',
                    js: 'kr-text',
                    url: 'kr-url',
                    xsl: 'kr-xsl',
                    xlsx: 'kr-xsl',
                    et: 'kr-xsl',
                    zip: 'kr-zip',
                    pdf: 'kr-pdf',
                    none: 'kr-default'
                },
                ext;
            ext = isExt ? name : this.getExtName(name);
            return (ext !== false && mapExtClass[ext]) ? mapExtClass[ext] : 'kr-default';

        },
        /*
         * 获取文件对应的class
         * */
        getFileIconClass: function(name, isExt) {
            var mapExtClass = {
                    bmp: 'document-img',
                    gif: 'document-img',
                    png: 'document-img',
                    jpg: 'document-img',
                    jpeg: 'document-img',
                    tif: 'document-img',
                    psd: 'document-img',
                    pdg: 'document-img',
                    ai: 'document-img',
                    ico: 'document-img',
                    css: 'document-css',
                    doc: 'document-doc',
                    docx: 'document-doc',
                    ppt: 'document-ppt',
                    pptx: 'document-ppt',
                    rar: 'document-rar',
                    '7z': 'document-rar',
                    gz: 'document-rar',
                    bz: 'document-rar',
                    ace: 'document-rar',
                    uha: 'document-rar',
                    zpaq: 'document-rar',
                    rar: 'document-rar',
                    txt: 'document-txt',
                    yml: 'document-txt',
                    ini: 'document-txt',
                    js: 'document-txt',
                    url: 'document-url',
                    xsl: 'document-xsl',
                    xlsx: 'document-xsl',
                    et: 'document-xsl',
                    zip: 'document-zip',
                    pdf: 'document-pdf',
                    none: 'document-default'
                },
                ext;
            ext = isExt ? name : this.getExtName(name);
            return (ext !== false && mapExtClass[ext]) ? mapExtClass[ext] : 'document-default';

        },

        /*
         * 判断文件是否可以预览
         * 可以传名字，也可以直接传后缀
         * zee
         * 20151217
         * */
        isCanPreview: function(nameOrExt) {
            var fileExt = this.getExtName(nameOrExt) || nameOrExt,
                mapExtClass = {
                    bmp: true,
                    gif: true,
                    png: true,
                    jpg: true,
                    jpeg: true,
                    txt: true,
                    pdf: true,
                    doc: true,
                    docx: true,
                    ppt: true,
                    pptx: true,
                    xls: true,
                    xlsx: true
                };
            return mapExtClass[fileExt] || false;
        },
        /**
         * 判断文件是否是图片 zee  20150824
         * */
        isImg: function(name, isExt) {
            var mapExtClass = {
                    bmp: true,
                    gif: true,
                    png: true,
                    jpg: true,
                    jpeg: true
                },
                ext = isExt ? name : this.getExtName(name);
            return (ext !== false && mapExtClass[ext]) ? mapExtClass[ext] : false;
        }

    };
    return Qiniu;
});
