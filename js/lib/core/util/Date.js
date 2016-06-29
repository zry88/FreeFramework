/**
 * 时间日期操作函数库
 */
define(function() {
    var Dates = {
        //当前时间
        getTimestamp: function(dateStr) {
            var theDate = dateStr ? new Date(Date.parse(dateStr)) : new Date();
            return Date.parse(theDate) / 1000;
        },
        // 日期互转
        getDateTime: function(dateStr, typeStr) {
            var theDate;
            if (typeof dateStr == 'number') {
                theDate = new Date(dateStr);
                if(theDate.toString().indexOf('1970') >= 0){
                    theDate = new Date(dateStr * 1000);
                }
            } else {
                theDate = new Date(Date.parse(dateStr));
            }
            var theHours = theDate.getHours(),
                theMinutes = theDate.getMinutes(),
                theSeconds = theDate.getSeconds(),
                theYear = theDate.getFullYear(),
                theMonth = theDate.getMonth() + 1,
                theDay = theDate.getDate(),
                result = typeStr || 'Y/M/D hh:mm:ss';
            return result.replace('hh', theHours < 10 ? ('0' + theHours) : theHours)
                .replace('mm', theMinutes < 10 ? ('0' + theMinutes) : theMinutes)
                .replace('ss', theSeconds < 10 ? ('0' + theSeconds) : theSeconds)
                .replace('Y', theYear)
                .replace('M', theMonth < 10 ? ('0' + theMonth) : theMonth)
                .replace('D', theDay < 10 ? ('0' + theDay) : theDay);
        },
        // 将秒数转换成时分秒
        formatSeconds: function(value) {
            var theTime = parseInt(value); // 秒
            var theTime1 = 0; // 分
            var theTime2 = 0; // 小时
            // alert(theTime);
            if (theTime > 60) {
                theTime1 = parseInt(theTime / 60);
                theTime = parseInt(theTime % 60);
                // alert(theTime1+"-"+theTime);
                if (theTime1 > 60) {
                    theTime2 = parseInt(theTime1 / 60);
                    theTime1 = parseInt(theTime1 % 60);
                }
            }
            var result = "" + parseInt(theTime) + "秒";
            if (theTime1 > 0) {
                result = "" + parseInt(theTime1) + "分" + result;
            }
            if (theTime2 > 0) {
                result = "" + parseInt(theTime2) + "小时" + result;
            }
            return result;
        },
        /*
         * 格式化时间  zee
         * yyyy-MM-dd HH:mm:ss E
         * */
        formatDate: function() {
            Date.prototype.format = function(fmt) {
                var o = {
                    'M+': this.getMonth() + 1, //月份
                    'd+': this.getDate(), //日
                    'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
                    'H+': this.getHours(), //小时
                    'm+': this.getMinutes(), //分
                    's+': this.getSeconds(), //秒
                    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
                    'S': this.getMilliseconds() //毫秒
                };
                var week = {
                    '0': '星期天',
                    '1': '星期一',
                    '2': '星期二',
                    '3': '星期三',
                    '4': '星期四',
                    '5': '星期五',
                    '6': '星期六'
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                if (/(E+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
                }
                for (var k in o) {
                    if (new RegExp('(' + k + ')').test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                    }
                }
                return fmt;
            };
        }
    };
    return Dates;
});
