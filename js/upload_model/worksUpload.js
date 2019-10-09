requirejs(['../commonConfig'],function(com){ 
    requirejs(['jquery','uploadCommonJs','multiImageJS'],function($,common,multiImage){
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
            
            //图片
            if($(".img-bg").length != 0){
                //var ele = $(".img-bg")
                // var ele = $(".progress");
                // for(var i=0;i<ele.length;i++){
                //     if(ele[i].style.display != 'none'){
                //         alert('素材内容图片尚未上传完成');
                //         checkFormFlag = false
                //         return false;
                //     }else{
                //         checkFormFlag = true
                //     }
                // }
                // var failEle = $('.upload-fail')
                // for(var j=0;j<failEle.length;j++){
                //     if(failEle[j].style.display != '' && failEle[j].style.display != 'none'){
                //         alert('素材内容图片有上传失败的');
                //         checkFormFlag = false
                //         return false;
                //     }else{
                //         checkFormFlag = true
                //     }
                }
            
            if($(".queueList li").length == 0){
                alert('素材介绍图片不能少于1张');
                checkFormFlag = false
                return false;
            }else{
                fillContent();
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
            // 类型
            var type = $('#upload_type');
            if(type.val() == '0'){
                alert('请选择作品类型');
                type.focus();
                checkFormFlag = false
                return false;
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
            // 图片上传
            multiImage.uploadInit();

            // 素材封面上传
            common.coverImg();

            //  字符检验
            common.TextBox('#upload_title','30');
            common.TextBox('#describe_inp','280');
            
            //  标签选择
            common.tagboxInit('5');

            // 提交验证
            $("#sub_Btn").click(function(){
                //先校验表单信息是否填写完整
                checkForm()
                if(checkFormFlag == false ){
                    return
                }else{
                    $('#sub_Btn').hide();
                    $('#nc').show();
                }
            })



        })
        
    })
})