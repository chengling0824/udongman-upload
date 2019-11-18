requirejs(['../commonConfig'],function(com){ 
    requirejs(['multiImageJS','uploadCommonJs'],function(multiImage,common){
        
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
        
        var checkForm = function(){
            checkFormFlag = common.checkImg(checkFormFlag);   //多图
            if(checkFormFlag == false){
                return false;
            }
            checkFormFlag = common.checkCover(checkFormFlag);    //封面
            if(checkFormFlag == false){
                return false;
            }
            checkFormFlag = common.checkTitle(checkFormFlag);   //标题
            if(checkFormFlag == false){
                return false;
            }
            var type = $('#upload_type');       // 类型
            if(type.val() == '0'){
                type.addClass('warnBorder');
                type.focus();
                checkFormFlag = false
                return false;
            }
            type.removeClass('warnBorder');
            checkFormFlag = common.checkTag(checkFormFlag); //标签
            if(checkFormFlag == false){
                return false;
            }
            checkFormFlag = common.checkDescribe(checkFormFlag); //简介
            if(checkFormFlag == false){
                return false;
            }
            if(agreeFlag == false){
                checkFormFlag = false
                common.alertTost('请阅读并接受优动漫内容发布守则','error')
                return false;
            }
        }

         //是否添加水印
         var imgFlag = false
         var selectTag;
         $('#img_Bg_Flag').click(function(){
             if(imgFlag == false){
                 imgFlag = true  //添加水印
                 $(this).addClass('seld_img')
             }else{
                 imgFlag = false  //不添加水印
                 $(this).removeClass('seld_img')
             }
         })
         if (imgFlag == true) {
             var waterFlag = 0
         } else {
             var waterFlag = 1
         }

        var subToApply = function(){
            var statist = {
                eventid: '110803',
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
            $("#upload_Model").hide()
            $("#bg").hide()
            common.fillContent();
            common.publicIng()  //发布按钮不可点击
            
            ///ajax提交argument
            var metTit = $('#upload_title').val()   //标题
            var metType = $("#upload_type").find("option:selected").val(); //类型
            var metTag =  common.getSign(); //标签
            var metDescribe = $('#describe_inp').val()  //简介
            var verifyCodeInp = $("#verifyCodeInp").val() || '';
            var metThumb = $("#cover_Img_Src").val();
            if (metThumb.indexOf('http') == -1 ){
                common.uploadImg()
            }
            if (theRequest.c == "edit_add"){
                var postURL = 'index.php?m=works&c=edit_add&a=edit_add';
            }else{
                var postURL = 'index.php?m=works&c=add&a=add_add';
            }
            $.ajax({
                type: 'post',
                url: postURL,
                data: {
                    'dosubmit': 1,
                    'info[title]': metTit,
                    'info[catid]': metType,
                    'info[keyword]': metTag,
                    'info[desc]': metDescribe,
                    'info[watermark_disable]': waterFlag,
                    'info[content]': $("#content").val(),
                    'info[thumb_val]': $("#cover_Img_Src").val(),
                    'info[verifyCodeInp]':verifyCodeInp,
                    'ob_id':$("#ob_id").val(),
                    'info[sig]':sig,
                    'info[sessionid]':csessionid,
                    'info[token]': nc_token,
                    'info[scene]': scene,
                },
                dataType: 'json',               
                success: function (data) {
                    if(data.error == 0){
                        $(document).unbind("scroll.unable");
                        common.shareWorks('works');
                    }
                    else if (data.error == 1){
                        common.alertTost('请先登录','error')
                        common.ncReset(nc);
                    }else if (data.error == 2){
                        common.alertTost('验证失败，请重试','error')
                        common.ncReset(nc);
                    }else if (data.error == 3|| data.error == 4|| data.error == 12){
                        common.checkTitle(checkFormFlag);
                        common.ncReset(nc);
                    }else if (data.error == 5){
                        var type = $('#upload_type');       // 类型
                        if(type.val() == '0'){
                            type.addClass('warnBorder');
                            type.focus();
                            checkFormFlag = false
                            return false;
                        }
                        common.ncReset(nc);
                    }else if (data.error == 6|| data.error == 9){
                        common.checkDescribe(checkFormFlag);
                        common.ncReset(nc);
                    }else if (data.error == 7|| data.error == 10 ||data.error == 11){
                        common.checkTag(checkFormFlag);
                        common.ncReset(nc);
                    }else if(data.error == 8){
                        common.checkImg(checkFormFlag);
                        common.ncReset(nc);
                    }
                    else{
						alert(data.msg);
                        common.ncReset(nc);
					}
                },
                error: function () {
                    common.ncReset(nc);
                    common.alertTost('提交失败','error')
                },
            });
        }

        $(function(){
            //作品不限制分辨率
            multiImage.uploadInit('20','works',true);    // 图片上传
            
            if (theRequest.c == "edit_add"){
                var files = $("#imgs").val();
                files = window.atob(files); //解码
                files = eval(files);
                multiImage.addFileImg(files,20);
            }else{
                $("html,body").animate({ scrollTop: "0" }, 500);
            }
            common.coverImg();  // 素材封面上传
            common.TextBox('#upload_title','30');   //  字符检验
            common.TextBox('#describe_inp','280');
            common.tagboxInit('20'); //  标签选择

            $('.seld-agree').click(function () {
                agreeFlag = common.agreeContent(agreeFlag);
            })
            $("#sub_Btn").click(function(){ // 提交
                checkForm() //先校验表单信息是否填写完整
                if(checkFormFlag == false ){
                    return
                }else{
                    $('#sub_Btn').hide();
                    $('#nc').show();
                    // subToApply();
                }
            })

            var statistics = {
                eventid: '110801',
                eventparam: {
                    fromUrl: window.location.href
                }
            }

            tongji.setStatisticsData(statistics);

            common.closeModel();

        })

       
        
    })
})