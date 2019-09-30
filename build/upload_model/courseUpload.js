requirejs(['../commonConfig'],function(com){
    requirejs(['jquery','uploadCommonJs'],function($,common){

        $(function(){
            // 富文本编辑器
            common.editorInit();

            //  字符检验
            common.TextBox('#upload_title','30');
            common.TextBox('#describe_inp','280');
            
            //  标签选择
            common.tagboxInit('5');
        })
    })
})