requirejs(['../commonConfig'],function(com){ 
    requirejs(['multiImageJS','workUploadJS','uploadCommonJs'],function(multiImage,workupload,common){
        
        // Global variables
        var agreeFlag = true;
        var checkFormFlag = true;
        var nc = common.ncInit();
        var theRequest = common.GetRequest();   //判断是否为编辑页

        nc.on('success', function (e) {
            checkForm();
            if(checkFormFlag == false){
                common.ncReset(nc);
            }else{
                subToApply();
            }
        })

        var materialApplication = function () {
            $('#upload_type').change(function () {
                var material_type = $('#upload_type').val();
                $.ajax({
                    type: 'POST',
                    url: '/index.php?m=material&c=add&a=getMaterialApply',
                    data: {
                        'type': material_type
                    },
                    success: function (res) {
                        // 显示对应“应用于”标签内容
                        $('.material-application').show();
                        $('.material-application ul').html('');
                        if (res && res.length > 0) {
                            var str = addApplicationSign(res);
                        } else {
                            var str = '<li><span applyid="0">其他</span></li>'
                        }
                        $('.material-application ul').html(str);
                        $('.material-application').show();
                    }
                })
            })
        }
        var addApplicationSign = function (res) {
            var str = '';
            res.forEach(function (item, index) {
                str += '<li><span applyid="' + item.applyid + '">' + item.applyname + '</span></li>';
            })
            return str;
        }
        var getMateralApply = function () { //获取已选素材应用
            var tag = new Array();
            $('.material-application li.active').each(function () {
                tag.push($(this).text());
            })
            return tag;
        }
        var applicationChecked = function () {
            $('.material-application').on('click', 'li', function () {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
            })
        }
        var checkForm = function () {
            checkFormFlag = checkMalFile(checkFormFlag); //素材文件
            if (checkFormFlag == false) {
                return false;
            }

            checkFormFlag = common.checkImg(checkFormFlag); //多图
            if (checkFormFlag == false) {
                return false;
            }
            checkFormFlag = common.checkCover(checkFormFlag); //封面
            if (checkFormFlag == false) {
                return false;
            }
            checkFormFlag = common.checkTitle(checkFormFlag); //标题
            if (checkFormFlag == false) {
                return false;
            }
            checkFormFlag = checkMalType(checkFormFlag); //类型
            if (checkFormFlag == false) {
                return false;
            }

            checkFormFlag = common.checkTag(checkFormFlag); //标签
            if (checkFormFlag == false) {
                return false
            }
            checkFormFlag = checkPoint(checkFormFlag); //价格
            if (checkFormFlag == false) {
                return false;
            }
            checkFormFlag = common.checkDescribe(checkFormFlag); //简介
            if (checkFormFlag == false) {
                return false;
            }
            if (agreeFlag == false) {
                checkFormFlag = false
                common.alertTost('请阅读并接受优动漫内容发布守则', 'error')
                return false;
            }
            return checkFormFlag;
        }
        var checkMalFile = function (checkFormFlag) {
            var warning_info = '<p class="warning-info"><span class="tishi"></span>未填写完成<p>';
            if ($('#fileURL').val() == '') { //素材文件
                if ($('#fileUp_box .warning-info').length < 1) {
                    $('#fileUp_box .title-box').append(warning_info);
                }
                common.alertTost('素材文件未上传成功', 'error')
                $('body,html').animate({
                    scrollTop: $('#fileUp_box').offset().top - 200
                }, 500);
                checkFormFlag = false
                return false;
            } else {
                checkFormFlag = true
                $('#fileUp_box .title-box').find('.warning-info').remove();
            }
            return checkFormFlag;
        }

        var checkPoint = function (checkFormFlag) {
            var point = $("#upload_Price"); //价格point
            var pointchecked = $('input:radio:checked').val();
            var point_max = "1000";
            var coin_max = "100";
            point_max = parseInt(point_max);
            coin_max = parseInt(coin_max);
            if (point.val() != "") {
                var repstr = "^\\d+$";
                var repexp = new RegExp(repstr);
                if (point.val().match(repexp) == null) {
                    $('#upload_Price').addClass('warnBorder');
                    $('body,html').animate({
                        scrollTop: $('#upload_Price').offset().top - 200
                    }, 500);
                    point.focus();
                    checkFormFlag = false;
                    return false;
                } else {
                    if (pointchecked == 'integration_option') {
                        if (point.val() > point_max) {
                            $('#upload_Price').addClass('warnBorder');
                            $('.upload-price .info').css({
                                'color': '#ef4849'
                            });
                            $('body,html').animate({
                                scrollTop: $('#upload_Price').offset().top - 200
                            }, 500);
                            point.focus();
                            checkFormFlag = false;
                            return false;
                        }
                    } else {
                        if (point.val() > coin_max) {
                            $('#upload_Price').addClass('warnBorder');
                            $('.upload-price .info').css({
                                'color': '#ef4849'
                            });
                            $('body,html').animate({
                                scrollTop: $('#upload_Price').offset().top - 200
                            }, 500);
                            point.focus();
                            checkFormFlag = false;
                            return false;
                        }
                    }
                }
            } else {
                checkFormFlag = true
                $("#upload_Price").val(0)
                $('#upload_Price').removeClass('warnBorder');

            }
            return checkFormFlag;
        }
        var checkMalType = function (checkFormFlag) {
            var warning_info = '<p class="warning-info"><span class="tishi"></span>未填写完成<p>';
            var type = $('#upload_type') //类型
            if (type.val() == '0') {
                $('#upload_type').addClass('warnBorder');
                type.focus();
                checkFormFlag = false
                return false;
            } else {
                $('#upload_type').removeClass('warnBorder');
                if ($('.material-application li.active').length == 0) { //应用
                    $('.material-application').append(warning_info);
                    type.focus();
                    checkFormFlag = false
                    return false;
                } else {
                    $('.material-application').find('.warning-info').remove();
                    checkFormFlag = true
                }
            }
            return checkFormFlag;
        }

        //是否添加水印
        var imgFlag = false
        var selectTag;
        $('#img_Bg_Flag').click(function () {
            if (imgFlag == false) {
                imgFlag = true //添加水印
                $(this).addClass('seld_img')
            } else {
                imgFlag = false //不添加水印
                $(this).removeClass('seld_img')
            }
        })
        if (imgFlag == true) {
            var waterFlag = 0
        } else {
            var waterFlag = 1
        }

        var subToApply = function () {
            var statist = {
                eventid: '090803',
                eventparam: {
                    click: 'publish'
                }
            }

            tongji.setStatisticsData(statist);
            
            var nc_token = ncData.token,
                csessionid = ncData.csessionid,
                sig = ncData.sig,
                scene = "nc_register";

            $(document).unbind("scroll.unable");
            $("#upload_Model").hide();
            common.fillContent();
            common.publicIng() //发布按钮不可点击

            ///ajax提交argument
            var metType = $("#upload_type").find("option:selected").val();
            var metFile = $("#fileURL").val();
            var metTit = $('#upload_title').val() //标题
            var metType = $("#upload_type").find("option:selected").val(); //类型
            var metApply = getMateralApply(); //应用
            var metTag = common.getSign(); //标签
            var metPointMaterial = 0;
            var metCoinMaterial = 0;
            var metPrice = $('#upload_Price').val() //价格
            var metPriceId = $("[name='price_type']").filter(':checked').attr('id');
            var metThumb = $("#cover_Img_Src").val();
            if (metThumb.indexOf('http') == -1) {
                common.uploadImg()
            }
            if (metPriceId != 'gold') {
                metPointMaterial = metPrice;
            } else {
                metCoinMaterial = metPrice;
            }
            var metDescribe = $('#describe_inp').val() //简介
            var verifyCodeInp = $("#verifyCodeInp").val() || '';

            if (theRequest.c == "edit_add") {
                var postURL = 'index.php?m=material&c=edit_add&a=edit_add'
            } else {
                var postURL = 'index.php?m=material&c=add&a=add_add'
            }

            $.ajax({
                type: 'post',
                url: postURL,
                data: {
                    'dosubmit': 1,
                    'info[rar]': metFile,
                    'info[title]': metTit,
                    'info[catid]': metType,
                    'info[apply]': metApply,
                    'info[keyword]': metTag,
                    'info[point]': metPointMaterial,
                    'info[price_coin]': metCoinMaterial,
                    'info[desc]': metDescribe,
                    'info[watermark_disable]': waterFlag,
                    'info[content]': $("#content").val(),
                    'info[thumb_val]': $("#cover_Img_Src").val(),
                    'info[verifyCodeInp]': verifyCodeInp,
                    'ob_id': $("#ob_id").val(),
                    'info[sig]': sig,
                    'info[sessionid]': csessionid,
                    'info[token]': nc_token,
                    'info[scene]': scene
                },
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data.error == 0) {
                        $(document).unbind("scroll.unable");
                        common.shareWorks('material');
                    } else if (data.error == 1) {
                        common.alertTost('请先登录', 'error')
                        common.ncReset(nc);
                    } else if (data.error == 2) {
                        common.alertTost('验证失败，请重试', 'error')
                        common.ncReset(nc);
                    } else if (data.error == 3 || data.error == 6) {
                        common.checkTitle(checkFormFlag);
                        common.ncReset(nc);
                    } else if (data.error == 4 || data.error == 5 || data.error == 7 || data.error == 14) {
                        checkMalType(checkFormFlag);
                        common.ncReset(nc);
                    } else if (data.error == 8 || data.error == 12) {
                        common.checkDescribe(checkFormFlag);
                        common.ncReset(nc);
                    } else if (data.error == 9 || data.error == 13 || data.error == 15 || data.error == 16) {
                        common.checkTag(checkFormFlag);
                        common.ncReset(nc);
                    } else if (data.error == 10) {
                        common.checkImg(checkFormFlag);
                        common.ncReset(nc);
                    } else if (data.error == 11) {
                        checkMalFile(checkFormFlag);
                        common.ncReset(nc);
                    } else if (data.error == 17 || data.error == 18) {
                        checkPoint(checkFormFlag);
                        common.ncReset(nc);
                    } else {
                        var msg = data.msg;
                        common.alertTost(msg, 'error')
                        common.ncReset(nc);
                    }
                },
                error: function () {
                    common.alertTost('提交失败','error')
                    common.ncReset(nc);
                },
            });
        } //--subToApply over


        $(function () {

            workupload.material_upload();
            // 多图上传
            multiImage.uploadInit('20', 'material', true);
            if (theRequest.c == "edit_add") {
                $('.material-application').show();
                var file_title = $('.file-title').text();
                $('.file-title').attr('title', file_title);

                var files = $("#imgs").val();
                files = window.atob(files); //解码
                files = eval(files);
                multiImage.addFileImg(files, 20);
            } else {
                $("html,body").animate({
                    scrollTop: "0"
                }, 500);
            }
            common.coverImg(); // 封面
            common.TextBox('#upload_title', '30'); //  字符检验
            common.TextBox('#describe_inp', '280');
            materialApplication(); //对应应用的生成
            applicationChecked(); // 素材应用的选择
            common.tagboxInit('20'); //  标签选择
            common.priceKeyup(); //价格只允许输入数字
            if ($(".price-radio-box").hasClass('disabled')) {
                $('.price-radio-box.disabled').find('input').attr('disabled', 'true');
            }

            $('.seld-agree').click(function () {
                agreeFlag = common.agreeContent(agreeFlag);
            })

            var statistics = {
                eventid: '090801',
                eventparam: {
                    fromUrl: window.location.href
                }
            }

            tongji.setStatisticsData(statistics);

            $("#sub_Btn").click(function () {
                //点击提交按钮
                checkForm(); //先校验表单信息是否填写完整
                if (checkFormFlag == false) {
                    return;
                } else {
                    $("#sub_Btn").hide();
                    $("#nc").show();
                }
            });

            common.closeModel(); //发布成功model
        });
    });
});