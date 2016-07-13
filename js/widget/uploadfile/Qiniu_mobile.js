/**
 * 七牛上传 移动版
 */
define([
    'lib/core/FUI',
    'localResizeIMG'
], function(FUI, localResizeIMG) {
    var qiniuUploadUrl;
    if (window.location.protocol === 'https:') {
        qiniuUploadUrl = 'https://up.qbox.me';
    } else {
        qiniuUploadUrl = 'http://upload.qiniu.com';
    }
    FUI.widgets.qiniu_mobile = function(option) {
        option = option || {};
        var defaults = {
            file_el: null,
            container_el: null,
            preview_option: { //预览图
                width: 0,
                height: 0,
                quality: 8
            },
            upload_view: null, //上传视图(必选项)
            is_many: false, //是否多图
            context: null, //上下文
            token: '',
            max_file_size: '5mb', //5MB
            max_files_count: 9, //最大上传文件数
            is_auto: true,
            keyRoot: '',
            filesAdded: function() {},
            begin: function() {},
            progress: function() {},
            complete: function() {},
            fail: function() {},
            cancel: function() {},
            showPreview: function() {}
        };
        var that = this;
        var options = $.extend(true, {}, defaults, option);
        this.options = options;
        this.upload_files = [];
        this.added_files = [];
        this.is_many = options.is_many;
        if (!options.file_el || !options.upload_view) return;
        if (typeof options.file_el == 'string') options.file_el = options.context.$(options.file_el);
        if (typeof options.container_el == 'string') options.container_el = options.context.$(options.container_el);
        if (options.file_el) {
            if (navigator.userAgent.match(/Android/i)) {
            // 使用手机相机
                options.file_el.attr('type', 'button').on('click', function(event) {
                    var context = that;
                    var buttons1 = [{
                        text: '拍照',
                        onClick: function() {
                            that.getCameraPicture(context);
                        }
                    }, {
                        text: '相册',
                        onClick: function() {
                            that.getAlbumPicture(context);
                        }
                    }];
                    var buttons2 = [{
                        text: '取消'
                    }];
                    FUI.fw7.actions([buttons1, buttons2]);
                    return false;
                });
            } else {
                // 使用html5
                options.file_el.on('change', function(event) {
                    var target = $(event.currentTarget)[0];
                    that.uploadInit(target.files, null, that);
                });
            }
        }
    };
    FUI.widgets.qiniu_mobile.prototype = {
        uploadInit: function(files, blob, context) {
            var theUploadFiles = [],
                oldUploadFiles = this.added_files.slice(0);
            if(_.isObject(files) && files[0]){
                theUploadFiles = Array.prototype.slice.call(files, 0);
            }else{
                theUploadFiles = [files];
            }
            this.added_files = _.union(this.added_files, theUploadFiles);
            var that = context || this,
                filesCount = theUploadFiles.length,
                maxFilesCount = this.options.max_files_count,
                // uploadedCount = this.options.context.$(that.options.container_el).children().length,
                addedCount = this.added_files.length;
            if (filesCount) {
                if (addedCount > maxFilesCount) {
                    FUI.fw7.modal({
                        title: '',
                        text: '只能上传' + maxFilesCount + '张图片',
                        buttons: [{
                            text: '确定'
                        }]
                    });
                    this.added_files = oldUploadFiles;
                    return;
                }
                this.upload_files = this.added_files.slice(0);
                if (typeof this.options.filesAdded == 'function') this.options.filesAdded(this.upload_files, theUploadFiles);
                _.each(theUploadFiles, function(fileObj, i) {
                    fileObj.id = FUI.util.Tool.guid();
                    if (Math.ceil(fileObj.size / (1024 * 1024)) > parseInt(that.options.max_file_size)) {
                        var msg = "发送文件最大为" + that.options.max_file_size;
                        if (theUploadFiles.length == 1) {
                            FUI.fw7.modal({
                                title: '',
                                text: msg,
                                buttons: [{
                                    text: '确定'
                                }]
                            });
                        } else {
                            debug.warn(msg);
                        }
                        return true;
                    }
                    var uploadOption = {
                        id: fileObj.id,
                        url: qiniuUploadUrl,
                        is_auto: that.options.is_auto,
                        file: fileObj,
                        blob: blob,
                        upload_files: that.upload_files,
                        params: {
                            key: that.getKey(fileObj.name),
                            token: that.options.token
                        },
                        isLoading: true,
                        begin: that.options.begin,
                        progress: that.options.progress,
                        complete: that.options.complete,
                        fail: that.options.fail,
                        cancel: that.options.cancel
                    };
                    // if(blob){
                    //     uploadOption.headers = {
                    //         "Content-Type": "application/octet-stream",
                    //         "Authorization": that.options.token
                    //     };
                    // }
                    if (that.options.preview_option.width) {
                        uploadOption.preview_option = that.options.preview_option;
                        uploadOption.is_auto = false;
                        uploadOption.isLoading = true;
                        localResizeIMG(_.extend(that.options.preview_option, {
                            file: fileObj,
                            blob: blob,
                            success: function(results) {
                                uploadOption.previewImgSrc = results.blob;
                                var theView = that.showPic(uploadOption, that.options.upload_view, that.options.container_el);
                                theView.sendUpload();
                            }
                        }));
                    } else {
                        that.showPic(uploadOption, that.options.upload_view, that.options.container_el);
                    }
                });
            } else {
                debug && debug.log("form input error");
            }
        },
        // 读取本地文件
        readFromFile: function(fileName, callback, context, errorHandler) {
            var pathToFile = fileName.indexOf('file://') >= 0 ? fileName : (cordova.file.dataDirectory + fileName);
            var errorHandler = function(fileName, e) {
                var msg = '';
                switch (e.code) {
                    case FileError.QUOTA_EXCEEDED_ERR:
                        msg = 'Storage quota exceeded';
                        break;
                    case FileError.NOT_FOUND_ERR:
                        msg = 'File not found';
                        break;
                    case FileError.SECURITY_ERR:
                        msg = 'Security error';
                        break;
                    case FileError.INVALID_MODIFICATION_ERR:
                        msg = 'Invalid modification';
                        break;
                    case FileError.INVALID_STATE_ERR:
                        msg = 'Invalid state';
                        break;
                    default:
                        msg = 'Unknown error';
                        break;
                };
                debug.log('Error (' + fileName + '): ' + msg);
            };
            window.resolveLocalFileSystemURL(pathToFile, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var blob = this.result;
                        callback(file, blob, context);
                    };
                    if (/image/.test(file.type)) {
                        reader.readAsDataURL(file);
                    } else {
                        reader.readAsText(file);
                    }
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        },
        // 获取相册图片
        getAlbumPicture: function(context) {
            var that = context || this;
            window.imagePicker.getPictures(
                function(results) {
                    for (var i = 0; i < results.length; i++) {
                        that.readFromFile(results[i], function(file, context) {
                            that.uploadInit(file, context);
                        }, that);
                    }
                },
                function(error) {
                    debug.warn('Error: ' + error);
                }, {
                    maximumImagesCount: this.options.max_files_count,
                    quality: 80,
                    width: 800,
                    height: 800
                }
            );
        },
        // 拍照
        getCameraPicture: function(context) {
            var that = context || this;
            var cameraOption = {
                quality: 80,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                cameraDirection: 1, //0/1前后置摄像头
                correctOrientation: true,
                targetWidth: 800,
                targetHeight: 800,
                // allowEdit: true
                // saveToPhotoAlbum: true
            };

            function onSuccess(imageData) {
                that.readFromFile(imageData, function(file, context) {
                    that.uploadInit(file, context);
                }, that);
            }

            function onFail(message) {
                debug.warn('Failed because: ' + message);
            }
            navigator.camera.getPicture(onSuccess, onFail, cameraOption);
        },
        getKey: function(fileName) {
            return this.options.keyRoot + FUI.util.Tool.guid() + '.' + FUI.util.File.getExtName(fileName);
        },
        showPic: function(uploadOption, preview_view, container_el) {
            var view = new(preview_view)(uploadOption);
            if (container_el && view) {
                var uploadHtml = view.render().el;
                if (this.is_many) {
                    container_el.append(uploadHtml);
                } else {
                    container_el.html(uploadHtml);
                }
            }
            if (typeof this.options.showPreview == 'function') this.options.showPreview();
            return view;
        }
    };
    return FUI.widgets.qiniu_mobile;
});
