
define(['jquerySliderJs','baseStyleJs'],function(slider,base){
    var commom = {
        resetFontContent: function($obj,$changeObj,lenVal,fontType){
            $obj.focus();
            $obj.keyup(function(e){
                var len = 0;
                var val = $(this).val();
                if (val.length > lenVal){
                    len = lenVal;
                }else{
                    len = val.length;
                }
        
                if (e.keyCode == 32 || e.keyCode == 13 ){
                    var reg = /[\u4e00-\u9fa5]/g;
                    if(reg.test(val)){
                        commom.getFontFile(val, fontType, 'ttf');
                    }
                }
        
                $changeObj.html(val);
                $('#fontLen').text(len);
            })
        },
        getFontFile: function(inputVal, fontType, format){
            $.ajax({
                type: 'post',
                url: '/index.php?m=font_product&c=gallery&a=fontsubset',
                dataType: 'json',
                data: { str: inputVal, type: fontType, format: format},
                success: function(res){
                    if (res.code == 0){
                        var fontUrl = res.url;
                        $('.font-active-css').html('');
                        for(key in fontUrl){   
                            commom.setFontFamily(key,fontUrl[key])
                        }
                    }
                }
            })
        },
        setFontFamily: function(type,url){
            var fontFamily = '';
            switch (type){
                case '111111146':
                    fontFamily = 'pingkaiti';
                    break;
                case '111111145':
                    fontFamily = 'pingsimhei';
                    break;
                case '111111147':
                    fontFamily = 'pingsimsun';
                    break;
            }
            commom.setFontStyle(fontFamily,url);
        },
        setFontStyle: function(fontFamily,url){
            var randomClass = fontFamily + new Date().getTime() + parseInt(Math.random()*1000);
            var str = "@font-face {font-family: '"+ randomClass +"';src: url('"+ url['ttf'] +"') format('truetype');"+
                        "font-weight: normal;font-style: normal;}"+
                        "."+ randomClass+"{ font-family: '"+ randomClass +"' !important;}";
        
            $('.font-active-css').append(str);
            var oldClassName = $('.'+ fontFamily).attr('data-font');
            var className = fontFamily.split
            $('.'+ fontFamily).addClass(randomClass);
            $('.'+ fontFamily).attr('data-font',randomClass);
            if (oldClassName){
                $('.'+ fontFamily).removeClass(oldClassName);
            }
        },
        resetFontSize: function(fontType){
            commom.resetFontContent($('#fontInput'),$('.font-change'),50,fontType);
            $("#sliderFontSize").slider({
                min: 14,
                max: 54,
                value: 34,
                step: 2,
                slide: function( event, ui ) {
                $('.font-change').css('font-size',ui.value + 'px');
                }
            });
        },
        alertTost: function(text,type){
            $.UdmToast("", text, type, {
                stack: true,
                has_icon:false,
                has_close_btn:false,
                fullscreen:false,
                timeout:2000,
                sticky:false,
                has_progress:false,
                rtl:false,
                position_class: 'toast-top-center',
            });
        },
        GetRequest: function(){
            var url = location.search; //获取url中"?"符后的字串  
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
            }
            return theRequest;
        },
        getLoginStatus: function(callback){
            $.ajax({
                type: 'post',
                url: '/index.php?m=common&c=index&a=check_islogin_ajax',
                dataType: 'json',
                success: function(res){
                    if (res.error != 0){
                        OpenPop("#login_pop_win");
                    }else{
                        callback();
                    }
                }
            })
        }
    }

    return commom;
})