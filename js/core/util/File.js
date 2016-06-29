/**
 * 文件操作函数库
 */
define(function() {
    var Files = {
        // 文件类型
        getFileType: function(fileName) {
            if (!fileName) return null;
            var file_ext = this.getExtName(fileName),
                file_type = {
                    doc: "doc", docx: "doc", xls: "doc", xlsx: "doc", ppt: "doc", pptx: "doc", key: "doc", numbers: "doc", pages: "doc",
                    jpg: "img", jpeg: "img", png: "img", gif: "img", bmp: "img",
                    mp3: "media", wma: "media", wav: "media", mod: "media", ra: "media", mp4: "media", avi: "media", mov: "media", wmv: "media", asf: "media", "3gp": "media", mkv: "media", flv: "media", ogg: "media", swf: "media", rm: "media", rmvb: "media", mtv: "media", dat: "media", amv: "media", dmv: "media",
                    so: "exe", dll: "exe", "class": "exe", scala: "exe", rb: "exe", vb: "exe", c: "exe", cpp: "exe", py: "exe", pl: "exe", erl: "exe", asp: "exe", aspx: "exe", xshtml: "exe", lua: "exe", cs: "exe", jsx: "exe", sass: "exe", jar: "exe", war: "exe", conf: "exe",
                    rar: "rar", zip: "rar", "7z": "rar", cab: "rar", arj: "rar", lzh: "rar", ace: "rar", "7-zip": "rar", tar: "rar", gzip: "rar", uue: "rar", bz2: "rar", jar: "rar", iso: "rar", z: "rar",
                    xml: "file", xsl: "file", es6: "file", sql: "file", svg: "file", txt: "file", pdf: "file", xmind: "file", html: "file", htm: "file", conf: "file", jsp: "file", css: "file", scss: "file", less: "file", js: "file", java: "file", vi: "file", beam: "file", json: "file", coffee: "file", md: "file"
                };
            return file_type[file_ext] || '';
        },
        // 文件名
        getFileName: function(filePath) {
            if (filePath.indexOf('/') >= 0) {
                var strArr = filePath.split('/');
                return strArr[strArr.length - 1];
            } else {
                return filePath;
            }
        },
        // 取不带后缀的文件名
        getNoExtFileName: function(name) {
            name += '';
            return name.substring(0, name.lastIndexOf('.'));
        },
        //获取文件格式名字
        getExtName: function(fileName) {
            var reg = /\./,
                arr, leng;
            if (reg.test(fileName)) {
                arr = fileName.split(reg);
                leng = arr.length;
                return arr[leng - 1].toLowerCase();
            }
            return null;
        },
    };
    return Files;
});
