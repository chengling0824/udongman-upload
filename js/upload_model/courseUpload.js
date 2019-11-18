requirejs(["../commonConfig"], function(com) {
    requirejs(
        ["workUploadJS","uploadCommonJs","base64Js"],
        function(workupload, common,Base64) {

            // Global variables
            var agreeFlag = true;
            var checkFormFlag = true;
            var base64 = new Base64();
            var theRequest = common.GetRequest();
            // var E = window.wangEditor
            // editor = new E('#editor');
            // editor.customConfig.menus = [
            //     'head',
            //     'bold',
            //     'fontSize',
            //     'italic',
            //     'underline',
            //     'strikeThrough',
            //     'foreColor',
            //     'backColor',
            //     'link',
            //     'list', 
            //     'justify', 
            //     'quote', 
            //     'emoticon',
            //     'image', 
            //     'table', 
            //     'undo',  // 撤销
            //     'redo'  // 重复
            // ]
            // editor.customConfig.withCredentials = true;
            // editor.customConfig.uploadImgServer = 'https://udm3-test.udongman.cn/index.php?m=attachment&c=attachments&a=plupload_wang_editor&action=uploadimage&encode=utf-8';
            // editor.customConfig.uploadFileName = 'upfile';
            //var theRequest = common.GetRequest();   //判断是否为编辑页
            // editor.create();
    
            // if (theRequest.c == "edit_add"){
            //     var courseContent = $('#content_base64').val();
            //     var Base64 = new Base64();
            //     courseContent = Base64.decode(courseContent);
            //     editor.txt.html(courseContent);
            // }

            var nc = common.ncInit();

            
            nc.on("success", function(e) {
                checkForm();
                if (checkFormFlag == false) {
                    common.ncReset(nc);
                } else {
                    subToApply();
                }
            });
            
            var checkForm = function() {
                var warning_info =
                    '<p class="warning-info"><span class="tishi"></span>未填写完成<p>';
                    
                var videoUploadFlag = false;
                if ($("#video_id").val() == "") {
                    videoUploadFlag = false;     
                } else {
                    $("#upfile_box .title-box").find(".warning-info").remove();
                    videoUploadFlag = true;
                }
                editorUploadFlag = common.checkEditor(checkFormFlag, editor); //课程内容
                if(!videoUploadFlag&&!editorUploadFlag){
                    if ($("#upfile_box .warning-info").length < 1) {
                        $("#upfile_box .title-box").append(warning_info);
                    }
                    if ($("#richText_box .warning-info").length < 1) {
                        $("#richText_box .title-box").append(warning_info);
                    }

                    $("body,html").animate({ scrollTop: $("#upfile_box").offset().top - 200 },500);
                    checkFormFlag = false;
                    return false;
                }
                if(!videoUploadFlag&&editorUploadFlag){
                    var progress = $("#upfile_box .progress-bar .percentage-bar").width();
                    if((progress < 100)&& (progress>0)){
                        common.alertTost("视频文件未上传完成", "error");
                        $("body,html").animate({ scrollTop: $("#upfile_box").offset().top - 200 },500);
                        checkFormFlag = false;
                        return false;
                    }
                }

                checkFormFlag = common.checkCover(checkFormFlag); //封面
                if (checkFormFlag == false) {
                    return false;
                }
                checkFormFlag = common.checkTitle(checkFormFlag); //标题
                if (checkFormFlag == false) {
                    return false;
                }
                checkFormFlag = common.checkType(checkFormFlag); //内容属性
                if (checkFormFlag == false) {
                    return false;
                }
                checkFormFlag = common.checkTag(checkFormFlag); //标签
                if (checkFormFlag == false) {
                    return false;
                }
                var software = $("#course_Software").find("option:selected"); //应用软件
                if(software.val() == '0' || software.val() == 0 || software.val() == '请选择'){
                    software.focus();
                    $("body,html").animate({
                            scrollTop: $("#tags").offset().top - 150
                        },
                        500
                    );
                    checkFormFlag = false;
                    return false;
                }else{
                    checkFormFlag = true
                }
                var $point = $(".course-price"); //价格point
                var pointVal = $point.val();
                if (pointVal != '') {
                    var repstr = "^\\d+$";
                    var repexp = new RegExp(repstr);
                    if (pointVal.match(repexp) == null) {
                        common.alertTost("课程价格必须是正整数", "error");
                        $point.addClass("warnBorder");
                        $point.focus();
                        checkFormFlag = false;
                        return false;
                    } else {
                        if (pointVal > 100) {
                            common.alertTost("课程价格不能大于100金币", "error");
                            $point.addClass("warnBorder");
                            $point.focus();
                            checkFormFlag = false;
                            return false;
                        }
                        checkFormFlag = true;
                        $point.removeClass("warnBorder");
                    }
                } else {
                    checkFormFlag = true
                    $("#upload_Price").val(0)
                    $('#upload_Price').removeClass('warnBorder');
                }
                checkFormFlag = common.checkDescribe(checkFormFlag); //简介
                if (checkFormFlag == false) {
                    return false;
                }
                if (agreeFlag == false) {
                    checkFormFlag = false;
                    common.alertTost("请阅读并接受优动漫内容发布守则", "error");
                    return false;
                }
                return checkFormFlag;
            };

            var subToApply = function() {
                var statist = {
                    eventid: '080803',
                    eventparam: {
                        click: 'publish'
                    }
                }
    
                tongji.setStatisticsData(statist);

                var nc_token = ncData.token,
                    csessionid = ncData.csessionid,
                    sig = ncData.sig,
                    scene = "nc_register";

                var metVideoId = $("#video_id").val(); // videoID
                var metvideoname = $("#file_Name").text(); //videoname
                var metupload = $("#video_id").attr("upload");
                metupload = metupload != undefined ? metupload : "";
                // var editorArr = editor.txt.html();
                var metTit = $("#upload_title").val(); //标题
                var metType = $("#course_Type")
                    .find("option:selected")
                    .val(); //类型
                var metSoft = $("#course_Software").find("option:selected").val(); //软件
                var metTag = common.getSign(); //标签
                var metPrice = $("#course_Price").val(); //价格
                var metDescribe = $("#describe_inp").val(); //简介
                var verifyCodeInp = $("#verifyCodeInp").val() || "";

                var metThumb = $("#cover_Img_Src").val();
                if (metThumb.indexOf('http') == -1 ){
                    common.uploadImg()
                }
                var arr = [];
                arr.push(UE.getEditor('editor').getContent());

                if (theRequest.c == "edit_add"){
                    var postURL = 'index.php?m=course&c=edit_add&a=edit_add';
                }else{
                    var postURL = 'index.php?m=course&c=add&a=add_add';
                }
                
                $.ajax({
                    type: "post",
                    url: postURL,
                    data: {
                        dosubmit: 1,
                        "info[videoId]": metVideoId,
                        "info[videoname]": metvideoname,
                        "info[upload]": metupload,
                        "info[title]": metTit,
                        "info[catid]": metType,
                        'info[soft]':metSoft,
                        "info[keyword]": metTag,
                        "info[price_coin]": metPrice,
                        "info[desc]": metDescribe,
                        "info[thumb_val]": $("#cover_Img_Src").val(),
                        // 'info[content]': editorArr,
                        'info[content]':arr.join("\n"),
                        "info[verifyCodeInp]": verifyCodeInp,
                        'ob_id':$("#ob_id").val(),
                        "info[sig]": sig,
                        "info[sessionid]": csessionid,
                        "info[token]": nc_token,
                        "info[scene]": scene
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (data.error == 0) {
                            $(document).unbind("scroll.unable");
                            common.shareWorks('course');
                        } else if (data.error == 1) {
                            common.alertTost("请先登录", "error");
                            common.ncReset(nc);
                        }else if (data.error == 2){
                            common.alertTost('验证失败，请重试','error')
                            common.ncReset(nc);
                        }else if(data.error == 3 || data.error == 5){
                            common.checkTitle(checkFormFlag);
                            common.ncReset(nc);
                        }else if(data.error == 4 || data.error == 6){
                            common.checkType(checkFormFlag);
                            common.ncReset(nc);
                        }else if(data.error == 7 || data.error == 10){
                            common.checkDescribe(checkFormFlag);
                            common.ncReset(nc);
                        }else if(data.error == 8 || data.error == 11 || data.error == 12){
                            common.checkTag(checkFormFlag);
                            common.ncReset(nc);
                        }else if(data.error == 9 || data.error == 13 || data.error == 14){
                            $("#course_Software").css({
                                border: "1px solid #ef4849"
                            })
                            $("body,html").animate({
                                    scrollTop:  $("#course_Software").offset().top - 150
                                },
                                500
                            );
                            common.ncReset(nc);
                        }else if(data.error == 15){
                            common.checkImg(checkFormFlag);
                            common.ncReset(nc);
                        }
                    },
                    error: function() {
                        common.alertTost("提交失败", "error");
                        common.ncReset(nc);
                    }
                });
            };

            $(function() {
                
                if (theRequest.c == "edit_add"){
                    var ue = common.editorInit();
                    var courseContent = $('#content_base64').val();
                    courseContent =  base64.decode(courseContent);
                    ue.ready(function () {
                            ue.setContent(courseContent);
                        }
                    );
                }else{		
                    common.editorInit();	
                    $("html,body").animate({ scrollTop: "0" }, 500);
                }             

                workupload.video_upload();

                common.coverImg(); // 封面上传

                common.TextBox("#upload_title", "30"); //  字符检验
                common.TextBox("#describe_inp", "280");
                common.PropertyLinkage(); // 内容属性二级联动
                common.tagboxInit("20"); //  标签选择
                common.priceKeyup(); //价格只允许输入数字

                $('.seld-agree').click(function () {
                    agreeFlag = common.agreeContent(agreeFlag);
                })
                $("#sub_Btn").click(function() {
                    //点击提交按钮
                    checkForm(); //先校验表单信息是否填写完整
                    if (checkFormFlag == false) {
                        return;
                    } else {
                        $("#sub_Btn").hide();
                        $("#nc").show();
                    }
                });
                var statistics = {
                    eventid: '080801',
                    eventparam: {
                        fromUrl: window.location.href
                    }
                }
    
                tongji.setStatisticsData(statistics);

                common.closeModel();
            });
        }
    );
});
