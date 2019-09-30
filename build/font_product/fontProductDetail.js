requirejs(['../commonConfig'],function(com){
    requirejs(['jquery','fontProductCommonJs','shareJs','statistJs'],function($,common,share,statist){
        (function(){
            var setShareOptions = function ($element,name,content){
                var shareContent = {//课程分享文案
                    title: content,
                    content: content,
                    url:location.href,
                    img:''
                }
                var options = {
                    element: $element,
                    name: name,
                    searchPic:true,
                    config: {},
                    buttonSelector:'.'+ name,
                    resource_id:'',
                    resource_type:'',
                    share_count: 0
                }

                options.config[name] = shareContent;

                return options;
            }
            var content = '#优动漫安利#我在这里看到了一个很棒的字体，超级适合漫画的对白框，分享给各位爱画画的小伙伴！>'+ location.href +'&share=share <优动漫动漫创作支援平台，提供正版绘画工具、在线课程、素材下载、在线练习等多种服务。（@优动漫）'
            share(setShareOptions($(".share-box"),'qzone',content));
            share(setShareOptions($(".share-box"),'tsina',content));


            var clipboard = new ClipboardJS('.share-box .copy');

            clipboard.on('success', function(e) {
                common.alertTost('复制成功，前往分享！',"success")
            });
            
            clipboard.on('error', function(e) {
                common.alertTost('复制失败',"error")
            });
        })();

        var cutFontType = {
            init: function(){
                var authorType = $('#author_type button.active').attr('auth_object');
                cutFontType.getUseType(authorType);
                cutFontType.cutAuthorType();
                cutFontType.cutUseType();
                cutFontType.setStatist();
            },
            setStatist: function(){
                var statistics = {
                    eventid: '040401',
                    eventparam: {}
                };
                var urlData = common.GetRequest();
                statistics.eventparam['from'] =  urlData.from || '';
                statistics.eventparam['fromUrl'] = window.location.href;
                statist.setStatisticsData(statistics);
            },
            addUseTypeBtn: function(useType,defaultType){
                var type = '';
                var str = '';
                var active = '';
                for (var i in useType){
                    switch(useType[i].authlimit){
                        case "1":
                            type = '包年';
                            break;
                        case "2":
                            type = '永久';
                            break;
                        case "3":
                            type = '一件';
                    }
                    active = i != defaultType ? '': 'active';
                    if (useType[i].is_lock != 0){
                        str += ' <button data-use-type='+ useType[i].authlimit +' class="'+ active +' locked">'+ type +'</button>';
                    }else{
                        str += ' <button data-use-type='+ useType[i].authlimit +' class="'+ active +'">'+ type +'</button>';
                    }
                }
                $('#use_type').html(str);
            },
            getCurPrice: function(authorType, useType){
                var fontType = common.GetRequest().type;
                $.ajax({
                    type: 'POST',
                    url: '/index.php?m=font_product&c=gallery&a=getfontprice',
                    dataType: 'json',
                    data: {type:fontType,auth_object:authorType,auth_limit: useType},
                    success: function(res){
                        if (res.code == 0){
                            $('#price').html(res.price);
                            if (res.is_lock != 0){
                                $("#get_font_product").html('暂不支持购买');
                                $("#get_font_product").attr('disabled',true);
                            }else{
                                $("#get_font_product").html('购买授权');
                                $("#get_font_product").attr('disabled',false);
                            }
                        }
                    }
                })
            },
            getDefaultType: function(useType){
                var defalutType = null;
                var i = 0;
                var len =  useType.length
                while (i < len && defalutType === null){
                    if (useType[i].is_lock != 1){
                        defalutType = i;
                    }
                    i++;
                }

                if (defalutType === null){
                    defalutType = 0;
                }

                return defalutType;
            },
            getUseType: function(authorType){
                var fontType = common.GetRequest().type;
                $.ajax({
                    type: 'POST',
                    url: '/index.php?m=font_product&c=gallery&a=getauthlimit',
                    dataType: 'json',
                    data: {type:fontType,auth_object:authorType},
                    success: function(res){
                        if (res.code == 0){
                            var useType = res.info;
                            var defaultType = cutFontType.getDefaultType(useType);
                            cutFontType.addUseTypeBtn(useType,defaultType);
                            cutFontType.getCurPrice(authorType, useType[defaultType].authlimit);
                        }
                    }
                })
            },
            cutAuthorType: function(){
                $('#author_type button').click(function(){
                    var authorType = $(this).attr('auth_object');
                    cutFontType.getUseType(authorType);
                    $('#author_type button').removeClass('active');
                    $(this).addClass('active');
                });
            },
            cutUseType: function(){
                $('.font-product-info').on('click','#use_type > button',function(){
                    var authorType = $('#author_type button.active').attr('auth_object');
                    var useType = $(this).attr('data-use-type');
                    cutFontType.getCurPrice(authorType, useType);
                    $('#use_type button').removeClass('active');
                    $(this).addClass('active');
                });
            }
        }

        $(function(){
            var fontType = $('.font-preview').attr('type');
            common.resetFontSize(fontType);
            cutFontType.init();
            
            var content = '#优动漫安利#我在这里看到了一个很棒的字体，超级适合漫画的对白框，分享给各位爱画画的小伙伴！>'+ location.href +'<优动漫动漫创作支援平台，提供正版绘画工具、在线课程、素材下载、在线练习等多种服务。（@优动漫）'
            $('.share-box .copy').attr('data-clipboard-text',content);

            $('#get_font_product').click(function(){
                common.getLoginStatus(function(){
                    var type = common.GetRequest().type;
                    var object = $('#author_type button.active').attr('auth_object');
                    var limit =  $('#use_type button.active').attr('data-use-type');
                    var info = new Array();
                    info['type'] = type;
                    info['object'] = object;
                    info['limit'] = limit;
        
                    post('/index.php?m=shop&c=udm_payment&a=font_auth_info_center', info) 
                });
            });
        });
    });
});