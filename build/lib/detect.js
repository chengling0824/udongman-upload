
define([], function(){
    'use strict';
    var detect = function (ua, platform){

        ua = ua || navigator.userAgent;
        platform = platform || navigator.platform;
    
        var backData = {}, os = {}, browser = {},
            mobile = ua.match(/Mobile/),
            webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
            android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            osx = !!ua.match(/\(Macintosh\; Intel /),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            win = /Win\d{2}|Windows/.test(platform),
            wp = ua.match(/Windows Phone ([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/),
            firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
            ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
            webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
            safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
            baidu =  ua.match(/BIDUBrowser\/([\d.]+)/),
            uc = baidu ? null : ua.match(/UBrowser\/([\d.]+)/),
            edge = ua.match(/Edge\/([\d.]+)/),
            sougou = ua.indexOf('SE 2.X') > -1 ? true : false,
            is2345 = ua.match(/2345Explorer\/([\d.]+)/),
            aoyou = ua.match(/Maxthon\/([\d.]+)/),
            liebao = ua.indexOf('LBBROWSER') > -1 ? true : false,
            qqBrowser = ua.match(/QQBrowser\/([\d.]+)/),
            wechat = ua.match(/MicroMessenger\/([\d.]+)/),
            qq = ua.match(/QQ\/([\d.]+)/),
            weibo = ua.match(/Weibo/)
    
        // Todo: clean this up with a better OS/browser seperation:
        // - discern (more) between multiple browsers on android
        // - decide if kindle fire in silk mode is android or not
        // - Firefox on Android doesn't specify the Android version
        // - possibly devide in os, device and browser hashes
        if (mobile) os.isMobile = true
    
        if (browser.webkit = !!webkit) browser.version = webkit[1]
    
        if (android) os.android = true, os.version = android[2]
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
        if (wp) os.wp = true, os.version = wp[1]
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (bb10) os.bb10 = true, os.version = bb10[2]
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
        if (playbook) browser.playbook = true
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    
        if (chrome) browser.browsername = 'chrome',browser.chrome = true, browser.version = chrome[1]
        if (firefox) browser.browsername = 'firefox', browser.version = firefox[1]
        if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
        if (ie) browser.browsername = 'ie', browser.version = ie[1]
        if (safari && (osx || os.ios || win)) {
            browser.browsername = 'safari'
            if (!os.ios) browser.version = safari[1]
        }
        if (edge) browser.browsername = 'edge', browser.version = edge[1]
        if (uc) browser.browsername = 'uc', browser.version = uc[1]
        if (sougou) browser.browsername = 'sougou', browser.version = sougou[1]
        if (is2345) browser.browsername = 'is2345'
        if (aoyou) browser.browsername = 'aoyou'
        if (liebao) browser.browsername = 'liebao'
        if (baidu) browser.browsername = 'baidu', browser.version = baidu[1]
        if (qqBrowser) browser.browsername = 'qqBrowser', browser.version = qqBrowser[1]
        if (wechat) browser.wechat = true, browser.version = wechat[1]
        if (qq) browser.qq = true, browser.version = qq[1]
        if (weibo) browser.weibo = true;
    
        var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
        if (is360) browser.browsername = 'is360'
        function _mime(option, value) {
            var mimeTypes = navigator.mimeTypes;
            for (var mt in mimeTypes) {
                if (mimeTypes[mt][option] == value) {
                    return true;
                }
            }
            return false;
        }
        
        backData.platform = platform;
        backData.browser = browser;

        return backData;
    };

    return detect;
})
