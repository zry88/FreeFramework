/**
 * 七牛上传
 */
define([
    'core/view/View',
    'qiniu'
], function(BaseView, Qiniu) {
    // FUI.uploadFiles = FUI.uploadFiles || [];   //上传队列
    var qiniuUpload = BaseView.extend({
        initialize: function(option) {
            BaseView.prototype.initialize.call(this, option);
            var that = this;
            this.qiniu = new Qiniu();
            var uploadConfig = {
                context: null,
                progressEl: '', //进度条选择符
                runtimes: 'html5,flash,html4', //上传模式,依次退化
                browse_button: 'pickfiles', //上传选择的点选按钮，**必需**
                // uptoken_url: "", //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                uptoken: '',
                // downtoken_url: '/downtoken',
                // Ajax请求downToken的Url，私有空间时使用,JS-SDK将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
                // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                // unique_names: false, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
                // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
                domain:  FUI.util.Tool.getHttp() + (CONFIG.DOWNLOAD_PATH || 'dn-openwinbons.qbox.me/'), //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: true, //设置上传文件的时候是否每次都重新获取新的token
                container: 'container', //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '100mb', //最大文件体积限制
                flash_swf_url: sources_root + '/lib/vendor/components/plupload/Moxie.swf', //引入flash,相对路径
                max_retries: 0, //上传失败最大重试次数
                dragdrop: true, //开启可拖曳上传
                drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', //分块上传时，每片的体积
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                // resize: { width: 320, height: 240, quality: 90 },
                //x_vars : {
                //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
                //    'time' : function(up,file) {
                //        var time = (new Date()).getTime();
                // do something with 'time'
                //        return time;
                //    },
                //    'size' : function(up,file) {
                //        var size = file.size;
                // do something with 'size'
                //        return size;
                //    }
                //},
                init: {
                    'FilesAdded': function(up, files) {
                        debug.warn('加文件', up, files);
                        if (files.length > 4) {
                            debug.warn('warning', '上传文件数不能大于4个');
                            return false;
                        }
                        plupload.each(files, function(file) {
                            if (!file.size) {
                                debug.warn('warning', '文件大小不能为0');
                                var upFile = _.findWhere(up.files, { id: file.id });
                                if (upFile) {
                                    up.files = _.filter(function(item) {
                                        return item.id == file.id ? false : true;
                                    });
                                }
                                console.warn(up.files);
                            }
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        debug.warn('上传前', up, file);
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function(up, file) {
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        // progress.setProgress(file.percent + "%", file.speed, chunk_size);
                        that.options.context.$('#' + file.id).find(that.options.progressEl).css(
                            'width', file.percent + '%'
                        );
                        // debug.warn('上传中', file, file.percent, chunk_size);
                    },
                    'FileUploaded': function(up, file, info) {
                        // debug.warn('上传后', up, file, info);
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        // var domain = up.getOption('domain');
                        // var res = parseJSON(info);
                        // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                    },
                    'Error': function(up, err, errTip) {
                        debug.warn('上传错误', up, err, errTip);
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function() {
                        debug.warn('上传完毕');
                        //队列文件处理完毕后,处理相关的事情
                    },
                    'Key': function(up, file) {
                        // debug.warn('key', up, file);
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效

                        var key =  window.imUser.dbid + '/' + that.options.module + '/' + FUI.util.Tool.guid() + '.' + FUI.ux.util.Qiniu.getExtName(file.name);
                        // do something with key here
                        return key
                    }
                }
            };
            $.extend(true, uploadConfig, this.options || {});
            this.qiniu.uploader(uploadConfig);
        }
    });
    return qiniuUpload;
});
