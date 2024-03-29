requirejs(['../commonConfig'],function(com){
    requirejs(['jquery','uploadCommonJs','webuploaderJS','workUploadJS','wangEditor'],function($,common,Webuploader,workupload,E){
    // requirejs(['jquery','uploadCommonJs','webuploaderJS','workUploadJS'],function($,common,Webuploader,workupload){
        //在点击确定后，根据界面上的图片属性构造content的value
        function fillContent(){
            //content清空
            $('#content').val('');
            //根据imgWrap来组织content
            var content='';
            $('.imgWrap').each(function(i)
            {
                var imgsrc = $(this).html();
                //判断图片是否已上传，如果imgsrc中含有 http 表明已经上传
                var is_uploaded = isUploaded(imgsrc);
                if(is_uploaded)
                {
                    content  += imgsrc + '<hr />';
                }
            });
            $('#content').val(content);
        }

        //判断图片是否已上传，如果imgsrc中含有 http 表明已经上传
        function isUploaded(imgsrc)
        {
            var pos = imgsrc.indexOf("http");
            if ( pos > 0)
            {
                return true;
            }
            return false;
        }

        function checkForm(){
            //视频文件
            if($("#file_Name").val() == ''){
                alert('请上传视频文件');
                checkFormFlag = false
                return false;
            }else{
                if($('#mat_Upload_Err').text() != '已上传.'){
                    alert('视频文件未上传成功');
                    checkFormFlag = false
                    return false;
                }else{
                    checkFormFlag = true
                }
            }
           //图文内容
           var arr = [];
           arr.push(UE.getEditor('editor').getContent());
           if(arr.join("\n") == ''){
               alert('请填写图文内容');
               checkFormFlag = false
               return false;
           }else{
               checkFormFlag = true
           }
            //封面
            var str = $(".img-preview img").attr('src');
            if(str!=undefined){
                checkFormFlag = true
            }else{
                alert('请上传封面');
                checkFormFlag = false
                return false;
            }

            //标题
            var title = $('#upload_title');
            var title_len = title.val().trim().length;
            if(title_len < 2 || title_len > 30){
                alert('请填写标题，字数在2~30字之间');
                title.focus();
                checkFormFlag = false
                return false;
            }else{
                checkFormFlag = true
            }
            // 属性
            var type = $('#course_Type');
            //如果是官方用户内容属性或工具属性必选其一
            // if (catid){
            //     if(type.val() == '0' && catid == "0"){
            //         alert('请选择内容属性或者工具属性');
            //         type.focus();
            //         checkFormFlag = false
            //         return false;
            //     }else{
            //         if($("#course_Type_Sec").css('display') != 'none' &&
            //             $("#course_Type_Sec").val() == '0' &&
            //             catid == "0"){
            //             alert('请选择内容属性或者工具属性');
            //             type.focus();
            //             checkFormFlag = false
            //             return false;
            //         }else{
            //             checkFormFlag = true
            //         }
            //     }
            // }
            // else{
                if(type.val() == '0'){
                    alert('请选择内容属性');
                    type.focus();
                    checkFormFlag = false
                    return false;
                }else{
                    if($("#course_Type_Sec").css('display') != 'none' &&
                        $("#course_Type_Sec").val() == '0'){
                        alert('请选择内容属性');
                        type.focus();
                        checkFormFlag = false
                        return false;
                    }else{
                        checkFormFlag = true
                    }
                }
    
            //标签
            var title_len = $('.tagInput-box').find('span').length;
            var tag = $('.input_content');
            if (title_len < 1) {
                alert('请选择或键入标签');
                tag.focus();
                checkFormFlag = false
                return false;
            } else {
                checkFormFlag = true
            }
    
            //价格  point
            var $point=$(".course-price");
            var pointVal = $point.val();
            if(pointVal != undefined){
                var repstr="^\\d+$";
                var repexp = new RegExp(repstr);
                if(pointVal.match(repexp)==null){
                    alert('课程价格必须是正整数');
                    $point.focus();
                    checkFormFlag = false;
                    return false;
                }
                else{
                    if(pointVal > 100){
                        alert('课程价格不能大于100金币');
                        point.focus();
                        checkFormFlag = false;
                        return false;
                    }
                    checkFormFlag = true
                }
            }else{
                alert('请输入课程价格');
                return false;
                // $("#course_Price").val(0)
            }
    
            //简介
            var desc = $('#describe_inp');
            var desc_len = desc.val().trim().length;
            if(desc_len < 1 || desc_len > 280){
                alert('请填写教程简介，字数在1~280字之间');
                desc.focus();
                checkFormFlag = false
                return false;
            }else{
                checkFormFlag = true
            }
            
    
            //验证码
            if($("#verifyCodeInp").length > 0) {
                var verifyCodeInp = $("#verifyCodeInp").val();
                $.ajax({
                    type: "GET",
                    async: false,//同步执行
                    url: "index.php?m=member&c=index&a=public_verifyCode_ajax",
                    data: {verifyCodeInp: $("#verifyCodeInp").val()},
                    //dataType: "json",
                    success: function (data) {
                        if (data === '1') {
                            checkFormFlag = true;
                        } else {
                            alert('请输入正确的验证码');
                            checkFormFlag = false;
                            return false;
                        }
                    }
                });
            }
        }

        $(function(){
            // 视频上传
            var uploader = Webuploader.create({
                // server: window.webuploader.uploadUrl, 
                pick: {
                    id:'#workPicker',
                },
                dnd: '.upWorkBox',
                paste: document.body,
                accept:{
                    title: 'video',
                    extensions: 'MP4,avi,mkv,rmvb,wmv,flv',
                    mimeTypes: '*.MP4,*.avi,*.mkv,*.rmvb,*.wmv,*.flv',
                },
                // swf: "../../plugins/webuploader-0.1.5/Uploader.swf",
                resize: false, 
                chunked: true,
                fileNumLimit: 1,
                // fileSingleSizeLimit: 10*1024*1024,//限制大小10M，单文件
                // fileSizeLimit: 10*1024*1024,//限制大小10M，所有被选文件，超出选择不上
            });
            workupload.init(uploader);

            // 富文本编辑器
            // common.editorInit();
            // var E = window.wangEditor;
            var editor = new E('#editor');
            editor.create();

            // 素材封面上传
            common.coverImg();

            //  字符检验
            common.TextBox('#upload_title','30');
            common.TextBox('#describe_inp','280');

            // 内容属性二级联动
            $("#course_Type").change(function(){
                var catid=$(this).val();
                var selectHtml;
                $.ajaxSettings.async = false;
                $.get('index.php?m=common&c=index&a=getchildAjaxAdd&catid='+catid,function(data){
                    selectHtml = data;
                });
                if($('#course_Type_Sec').children().length > 0){
                    $('#course_Type_Sec').html('');
                }
                $('#course_Type_Sec').append(selectHtml)
                if(selectHtml == ''){
                    $('#course_Type_Sec').hide()
                }else{
                    $('#course_Type_Sec').show()
                }
            })
            
            //  标签选择
            common.tagboxInit('5');

            //点击提交按钮
            $("#sub_Btn").click(function(){
                //先校验表单信息是否填写完整
                checkForm();
                if(checkFormFlag == false ){
                    return
                }else{
        //            forbidScroll();
        //            $("#upload_Model").show()
        //            $("#bg").show()
                    $('#sub_Btn').hide();
                    $('#nc').show();
                }
            })
        })
    })
})