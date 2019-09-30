define([], function() {
    var valid = {
        noEmoji: function(str){
            var reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
            if(str.match(reg)) {
                str = str.replace(reg, '');
            }
            return str;
        },
        noSpecialChar: function(str){
            var reg = /[^u4e00-u9fa5w]/g;
            if(str.match(reg)) {
                str = str.replace(reg, '');
            }
            return str;
        },
        justNum: function(str){
            str = str.replace(/[^\d.]/g,'');
            return str;
        },
        justNumChar: function(str){
            str = str.replace(/[^\w\.\/]/ig,'');
            return str;
        },
        justNumCharChinese: function(str){
            var reg = /[0-9a-zA-Z\u4e00-\u9fa5]+/ig;
            if (reg.test(str)){
                return true;
            }
            return false;
        },
        isPhoneNum: function(str){
            var reg = /^1\d{10}$/;
            if(reg.test(str)){ 
                return true; 
            } 
            return false;
        }
    }
    
    return valid;
});