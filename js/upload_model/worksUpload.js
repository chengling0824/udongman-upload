requirejs(['../commonConfig'],function(com){ 
    requirejs(['jquery','uploadCommonJs','multiImageJS'],function($,common,multiImage){


        $(function(){
            // 图片上传
            multiImage.uploadInit();

            //  字符检验
            common.TextBox('#upload_title','30');
            common.TextBox('#describe_inp','280');
            
            //  标签选择
            common.tagboxInit('5');



        })
        
    })
})