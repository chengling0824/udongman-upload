requirejs(['../commonConfig'], function (com) {
    requirejs(['uploadCommonJs',"base64Js"], function (common,Base64) {

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
        // var theRequest = common.GetRequest();   //判断是否为编辑页
        // editor.create();

        // if (theRequest.c == "edit_jc"){
        //     var courseContent = $('#content_base64').val();
        //     var Base64 = new Base64();
        //     courseContent = Base64.decode(courseContent);
        //     editor.txt.html(courseContent);
        // }

        
        var nc = common.ncInit();

        nc.on('success', function () {
            checkForm();
            if(checkFormFlag == false){
                common.ncReset(nc);
            }else{
                subToApply();
            }
        })
       
        var checkForm = function(){
            checkFormFlag = common.checkEditor(checkFormFlag,editor); //教程内容
            if(checkFormFlag == false){
                return false
            }
            checkFormFlag = common.checkCover(checkFormFlag); //封面
            if (checkFormFlag == false) {
                return false
            }
            checkFormFlag = common.checkTitle(checkFormFlag); //标题
            if (checkFormFlag == false) {
                return false
            }
            checkFormFlag = common.checkType(checkFormFlag); //属性
            if (checkFormFlag == false) {
                return false
            }
            checkFormFlag = common.checkTag(checkFormFlag); //标签
            if (checkFormFlag == false) {
                return false
            }
            var $point = $("#course_Price"); //价格  point
            var pointVal = $point.val();
            var point_max = "1000";
            var coin_max = "100";
            point_max = parseInt(point_max);
            coin_max = parseInt(coin_max);
            if (pointVal != "") {
                var repstr = "^\\d+$";
                var repexp = new RegExp(repstr);
                if (pointVal.match(repexp) == null) {
                    $point.addClass('warnBorder');
                    $point.focus();
                    checkFormFlag = false
                    return false;
                } else {
                    if (pointVal > point_max) {
                        $point.addClass('warnBorder');
                        $point.focus();
                        checkFormFlag = false;
                        return false;
                    }
                    $point.removeClass('warnBorder');
                    checkFormFlag = true
                }
            } else {
                checkFormFlag = true
                $("#upload_Price").val(0)
                $('#upload_Price').removeClass('warnBorder');
            }
            checkFormFlag = common.checkDescribe(checkFormFlag); //简介
            if (checkFormFlag == false) {
                return false
            }
            if (agreeFlag == false) {
                checkFormFlag = false;
                common.alertTost('请阅读并接受优动漫内容发布守则', 'warning');
                return false;
            }
            return checkFormFlag;
        } //--check over

        var subToApply = function () {
            var statist = {
                eventid: '070803',
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
            $("#bg").hide();
            common.publicIng() //发布按钮不可点击

            ///ajax提交argument
            if ($("#course_Type_Sec").css('display') == 'none') {
                var metType = $("#course_Type").find("option:selected").val(); //类型
            } else {
                var metType = $("#course_Type_Sec").find("option:selected").val(); //类型
            }
            var metTit = $('#upload_title').val() //标题
            var metTag = common.getSign(); //标签
            var metPrice = $('#course_Price').val() //价格
            var metDescribe = $('#describe_inp').val() //简介
            var verifyCodeInp = $("#verifyCodeInp").val() || '';
            var catid = $('#catid').val();

            var metThumb = $("#cover_Img_Src").val();
            if (metThumb.indexOf('http') == -1 ){
                common.uploadImg()
            }
            // var editorArr = editor.txt.html();
            var arr = [];
            arr.push(UE.getEditor('editor').getContent());
            
            if (theRequest.c == "edit_jc"){
                var postURL = 'index.php?m=course&c=edit_jc&a=edit_add';
            }else{
                var postURL = 'index.php?m=course&c=add_jc&a=add_add';
            }

            $.ajax({
                type: 'post',
                url: postURL,
                data: {
                    'dosubmit': 1,
                    'info[title]': metTit,
                    'info[sort_catid]': metType,
                    'info[keyword]': metTag,
                    'info[point]': metPrice,
                    'info[desc]': metDescribe,
                    'info[thumb_val]': $("#cover_Img_Src").val(),
                    'info[verifyCodeInp]': verifyCodeInp,
                    // 'info[content]': editorArr,
                    'info[content]':arr.join("\n"),
                    'info[catid]': catid,
                    'ob_id':$("#ob_id").val(),
                    'info[sig]': sig,
                    'info[sessionid]': csessionid,
                    'info[token]': nc_token,
                    'info[scene]': scene,
                },
                async: false,
                dataType: 'json',
                success:function(data){
                        if (data.error == 0) {
                            $(document).unbind("scroll.unable");
                            common.shareWorks('tutorial');
                        } else if (data.error == 1) {
                        common.alertTost('请先登录', 'error')
                        common.ncReset(nc);
                    } else if (data.error == 2){
                        common.alertTost('验证失败，请重试','error')
                        common.ncReset(nc);
                    } else if (data.error == 3 || data.error == 5){
                        common.checkCover(checkFormFlag);
                        common.ncReset(nc);
                    }else if(data.error == 4){
                        common.checkType(checkFormFlag);
                        common.ncReset(nc);
                    }else if(data.error == 6 || data.error == 9){
                        common.checkDescribe(checkFormFlag);
                        common.ncReset(nc);
                    }else if(data.error == 7 || data.error == 10 || data.error == 11){
                        common.checkTag(checkFormFlag);
                        common.ncReset(nc);
                    }else if(data.error == 8 || data.error == 13){
                        common.checkEditor(checkFormFlag, editor);
                        common.ncReset(nc);
                    }else if(data.error == 12){
                        $("#course_Price").addClass('warnBorder');
                        common.ncReset(nc);
                    }else if(data.error == 14){
                        common.checkImg(checkFormFlag);
                        common.ncReset(nc);
                    }
                },
                error: function() {
                    $('#sub_Btn').show();
                    $('#nc').hide();
                    common.ncReset(nc);
                    common.publicContiner();
                    common.alertTost('提交失败', 'error')
                },
            });
        }


        $(function () {
          
            common.editorInit();       // ueditor编辑器
            if (theRequest.c == "edit_jc"){
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
            
         
            common.coverImg(); // 素材封面上传
            common.TextBox('#upload_title', '30'); //  字符检验
            common.TextBox('#describe_inp', '280');
            common.PropertyLinkage(); // 内容属性二级联动
            common.tagboxInit('20'); //  标签选择
            common.priceKeyup(); //价格只允许输入数字

            $('.seld-agree').click(function () {
                agreeFlag = common.agreeContent(agreeFlag);
            })
            $("#sub_Btn").click(function () { // 提交验证
                checkForm() //先校验表单信息是否填写完整
                if (checkFormFlag == false) {
                    return
                } else {
                    $('#sub_Btn').hide();
                    $('#nc').show();
                }
            })
            var statistics = {
                eventid: '070801',
                eventparam: {
                    fromUrl: window.location.href
                }
            }

            tongji.setStatisticsData(statistics);

            common.closeModel();

        })

    })
})