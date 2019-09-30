
requirejs(['../commonConfig'],function(com){
    requirejs(['jquery','fontProductCommonJs','validJs','statistJs'],function($,common,valid,statist){

        var fontUserInfo = function(){
            var info = {
                inputIsError: function (changeElement){
                    changeElement.removeClass("onCorrect");
                    changeElement.removeClass("valid");
                    changeElement.addClass("error");
                },
                inputIsTrue: function (changeElement){
                    changeElement.removeClass("error");
                    changeElement.removeClass("valid");
                    changeElement.addClass("onCorrect");
                },
                checkInputName: function ($input_name){
                    var str = $input_name.val();
                    $input_name.val(valid.noEmoji(str));
                    if ($input_name.val() == ''){
                        fontUserInfo.inputIsError($input_name.next());
                        return false;
                    }else{
                        fontUserInfo.inputIsTrue($input_name.next());
                        return true;
                    }
                },
                checkIdentifyCode: function($input_name){
                    var str = $input_name.val();
                    $input_name.val(valid.justNumChar(str));
                    if ($input_name.val() == ''){
                        fontUserInfo.inputIsError($input_name.next());
                        return false;
                    }else{
                        fontUserInfo.inputIsTrue($input_name.next());
                        return true;
                    }
                },
                checkCompanyCode: function($input_name){
                    var str = $input_name.val();
                    $input_name.val(valid.noSpecialChar(valid.noEmoji(str)));
                    var flag = valid.justNumCharChinese(str);
                    if ($input_name.val() == ''){
                        fontUserInfo.inputIsError($input_name.next());
                        return false;
                    }else{
                        fontUserInfo.inputIsTrue($input_name.next());
                        return true;
                    }
                },
                checkPhoneNum: function($input_name){
                    var str = $input_name.val();
                    str = valid.justNum(str);
                    $input_name.val(str);
                    if ($input_name.val() != '' && valid.isPhoneNum(str)){
                        fontUserInfo.inputIsTrue($input_name.next().next());
                        return true;
                    }else{
                        fontUserInfo.inputIsError($input_name.next().next());
                        return false;
                    }
                },
                checkCode: function($input_name){
                    var phone_num = $("#phone_num").val();
                    var phone_code = $('#phone_num_code').val();
                    $.ajax({
                        type: 'post',
                        url: '/index.php?m=common&c=index&a=public_ajax_verify_code',
                        data: {phone:phone_num,code:phone_code},
                        dataType: 'json',
                        async: false,
                        success: function(res){
                            if (res.code == 0){
                                fontUserInfo.inputIsTrue($input_name.next());
                                return true;
                            }else{
                                fontUserInfo.inputIsError($input_name.next());
                                return false;
                            }
                        }
                    })
                },
                checkPhoneNumCode: function($input_name){
                    var str = $input_name.val();
                    $input_name.val(valid.justNum(str));
                    if ($input_name.val() == ''){
                        fontUserInfo.inputIsError($input_name.next());
                        return false;
                    }else{
                        return fontUserInfo.checkCode($input_name);
                    }
                },
                timeCountDown: function($thisBtn){
                    var nums = 60;
                    $thisBtn.attr("disabled",true);
                    $thisBtn.html(nums + 's后重新获取');
                    var clock = setInterval(doLoop, 1000); //一秒执行一次
                    function doLoop() {
                        nums--;
                        if (nums > 0) {
                            $thisBtn.html(nums + 's后重新获取');
                        } else {
                            clearInterval(clock); //清除js定时器
                            $thisBtn.attr("disabled",false);
                            $thisBtn.html('获取短信验证码');
                            nums = 60; //重置时间
                        }
                    }
                },
                createScript: function (){
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.charset = 'utf-8';
                    script.src = '//g.alicdn.com/sd/nvc/1.1.112/guide.js?t='+new Date().getTime();
                    document.body.appendChild(script);
                },
                phoneCaptcha: function(){
                    window.NVC_Opt = {
                        //appkey:'CF_APP_1',
                        appkey:'FFFF0N00000000007E6D',
                        //scene:'nvc_register',
                        scene:'nvc_message',
                        isH5:false,
                        popUp:false,
                        renderTo:'#captcha',
                        nvcCallback:function(data){
                            var params = 'param=' + data;
                            fontUserInfo.registerRequest('/index.php?m=font_product&c=authorization&a=send_phone_code', params);
                        },
        /*                trans: {"key1": "code0","nvcCode":400},*/
                        language: "cn",
                        customWidth: 490,
                        width: 490,
                        height: 100,
                        elements: [
                            '//img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png',
                            '//img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png'
                        ], 
                        bg_back_prepared: '//img.alicdn.com/tps/TB1skE5SFXXXXb3XXXXXXXXXXXX-100-80.png',
                        bg_front: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAMAAADY1yDdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURefk5w+ruswAAAAfSURBVFjD7cExAQAAAMKg9U9tCU+gAAAAAAAAAIC3AR+QAAFPlUGoAAAAAElFTkSuQmCC',
                        obj_ok: '//img.alicdn.com/tfs/TB1rmyTltfJ8KJjy0FeXXXKEXXa-50-74.png',
                        bg_back_pass: '//img.alicdn.com/tfs/TB1KDxCSVXXXXasXFXXXXXXXXXX-100-80.png',
                        obj_error: '//img.alicdn.com/tfs/TB1q9yTltfJ8KJjy0FeXXXKEXXa-50-74.png',
                        bg_back_fail: '//img.alicdn.com/tfs/TB1w2oOSFXXXXb4XpXXXXXXXXXX-100-80.png',
                        upLang:{"cn":{
                            _ggk_guide: "请摁住鼠标左键，刮出两面盾牌",
                            _ggk_success: "恭喜您成功刮出盾牌<br/>继续下一步操作吧",
                            _ggk_loading: "加载中",
                            _ggk_fail: ['呀，盾牌不见了<br/>请', "javascript:noCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
                            _ggk_action_timeout: ['我等得太久啦<br/>请', "javascript:noCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
                            _ggk_net_err: ['网络实在不给力<br/>请', "javascript:noCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
                            _ggk_too_fast: ['您刮得太快啦<br/>请', "javascript:noCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题']
                            }
                        }
                    }
                
                    fontUserInfo.createScript();
                },
                registerRequest: function (url, params){
                    var callbackName = ('jsonp_' + Math.random()).replace('.', '');
                    params += '&callback=' + callbackName;
                    var o_scripts = document.getElementsByTagName("script")[0];
                    var o_s = document.createElement('script');
                    o_scripts.parentNode.insertBefore(o_s, o_scripts);
                    window[callbackName] = function(json) {
                        if(json.result.code == 400) {
                            getNC().then(function(){
                                _nvc_nc.upLang('cn', {
                                    _startTEXT: "请按住滑块，拖动到最右边",
                                    _yesTEXT: "验证通过",
                                    _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
                                    _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
                                })
                                _nvc_nc.reset()
                            })
                        } else if (json.result.code == 600) {
                            getSC().then(function(){})
                        } else if (json.result.code == 700) {
                            getLC();
                        } else if (json.result.code == 100 || json.result.code == 200) {
                            nvcReset();
                            fontUserInfo.sendPhoneCode();
                        } else if (json.result.code == 800 || json.result.code == 900) {
                            nvcReset();
                        }
                    };
                    //o_s.src = url + '?' + params;
                    o_s.src = url + '&' + params;
                },
                sendPhoneCode: function(){
                    var phone_num = $('#phone_num').val();
                    $.ajax({
                        type: 'POST',
                        url: '/index.php?m=font_product&c=authorization&a=send_phone_code',
                        dataType: 'json',
                        data: { phone_number: phone_num },
                        success: function(res){
                            if (res.code == 1){
                                OpenPop("#login_pop_win");
                            }
                            if (res.code == 0){
                                common.alertTost('验证码已发送',"success");
                                fontUserInfo.timeCountDown($('#check_btn'));
                            }
                            if (res.code == 2 || res.code == 5 || res.code == 6){
                                common.alertTost('验证码获取失败',"error");
                            }
                            if (res.code == 3){
                                fontUserInfo.inputIsTrue($('#phone_num').next().next());
                            }
                            if (res.code == 4){
                                common.alertTost('操作太频繁，请稍候重试',"warning");
                            }
                        }
                    })
                },
                sendPhoneCodeVerify: function(){
                    $('#check_btn').click(function(){
                        var flag = fontUserInfo.checkPhoneNum($("#phone_num"));
                        if (flag){
                            //var params = 'param=' + getNVCVal();
                            var params = 'param=' + getNVCVal();
                            fontUserInfo.registerRequest('/index.php?m=font_product&c=authorization&a=notraceverify', params);
                            //fontUserInfo.registerRequest('http://cf.aliyun.com/nvc/nvcAnalyze.jsonp', params);
                        }
                    })
                },
                eventBind: function($obj,callback){
                    $obj.keyup(function(e){
                        callback($(e.target));
                    })
                    $obj.blur(function(e){
                        callback($(e.target));
                    })
                    $obj.focus(function(e){
                        $(e.target).next().removeClass("onCorrect");
                        $(e.target).next().removeClass("error");
                        $(e.target).next().addClass("valid");
                    })
                },
                toPay: function(){
                    var flag = false;
                    var object = $('.font_product_object').val();

                    if (object == "1"){
                        flag = fontUserInfo.checkInputName($("#input_name")) && fontUserInfo.checkIdentifyCode($("#input_identify_code"));
                    }else{
                        flag = fontUserInfo.checkInputName($("#company_name")) && fontUserInfo.checkCompanyCode($("#company_code"));
                    }

                    fontUserInfo.checkPhoneNumCode($("#phone_num_code"));
                    if ($("#phone_num_code").next().hasClass('onCorrect')){
                        var phone_code_flag = true;
                    }else{
                        var phone_code_flag = false;
                    }

                    flag = flag && fontUserInfo.checkPhoneNum($("#phone_num"))
                                && phone_code_flag;
                    return flag;
                }
            }
            return info;
        }();
        var setStatist = function(){
            var statistics = {
                eventid: '040501',
                eventparam: {}
            };
            var urlData = common.GetRequest();
            statistics.eventparam['fromUrl'] = window.location.href;
            statist.setStatisticsData(statistics);
        }

        $(function(){
            fontUserInfo.eventBind($("#input_name,#company_name"),function($ele){
                fontUserInfo.checkInputName($ele)
            })
            fontUserInfo.eventBind($("#input_identify_code"),function($ele){
                fontUserInfo.checkIdentifyCode($ele)
            })
            fontUserInfo.eventBind($("#company_code"),function($ele){
                fontUserInfo.checkCompanyCode($ele)
            })
            fontUserInfo.eventBind($("#phone_num_code"),function($ele){
                fontUserInfo.checkPhoneNumCode($ele)
            })
            $("#phone_num").keyup(function(e){
                fontUserInfo.checkPhoneNum($(e.target));
            })
            $("#phone_num").blur(function(e){
                fontUserInfo.checkPhoneNum($(e.target));
            })
            $("#phone_num").focus(function(e){
                $(e.target).next().next().removeClass("onCorrect");
                $(e.target).next().next().removeClass("error");
                $(e.target).next().next().addClass("valid");
            })
            fontUserInfo.phoneCaptcha();
            fontUserInfo.sendPhoneCodeVerify();
            $("#go_to_pay").click(function(){
                if (fontUserInfo.toPay()){
                    $("#pay_submit").submit();
                }
            })
            setStatist();
        })
    });
});