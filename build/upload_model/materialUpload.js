requirejs(['../commonConfig'],function(com){ 
    requirejs(['jquery','uploadCommonJs','multiImageJS','workUploadJS'],function($,common,multiImage,workupload){
    // requirejs(['jquery','uploadCommonJs','uploadJS'],function($,common,uploader){

        // var materialType =function() {
        //     $('#upload_type').change(function(){
        //         var material_type = $('#upload_type').val();
        //         $.ajax({
        //             type: 'POST',
        //             url: '/index.php?m=material&c=add&a=getMaterialApply',
        //             data:{ 'type':material_type },
        //             success:function(res){
        //                 // 显示对应“应用于”标签内容
        //                 $('.material-application').hide();
        //                 $('.material-application ul').html('');
        //                 if (res && res.length > 0) {
        //                     var str = addApplicationSign(res);
        //                 }else{
        //                     var str = '<span applyid="0">其他</span>'
        //                 }
        //                 $('.material-application ul').html(str);
        //                 $('.material-application').show();
        //             }
        //         })
        //     })
        // }
        // var addApplicationSign = function(res){
        //     var str = '';
        //     res.forEach(function(item,index){
        //         str += '<span applyid="'+ item.applyid+'">'+ item.applyname +'</span>';
        //     })
        //     return str;
        // }
        var applicationChecked = function(){
            $('.material-application').on('click','li',function(){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                }else{
                    $(this).addClass('active');
                }
            })
        }

        $(function(){
            // 素材上传
            workUpload.init();
            // 素材介绍上传
            multiImage.uploadInit();
            // uploader.uploadInit();
            // 素材封面上传
            common.coverImg();
            //  字符检验
            common.TextBox('#upload_title','30');
            common.TextBox('#describe_inp','280');

            // 素材应用的选择
            applicationChecked();
            
            //  标签选择
            common.tagboxInit('5');



        })
        
    })
})