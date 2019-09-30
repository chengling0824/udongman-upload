requirejs(['../commonConfig'],function(com){ 
    requirejs(['jquery','uploadCommonJs','multiImageJS','webuploaderJS','workUploadJS'],function($,common,multiImage,Webuploader,workupload){
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
            var uploader = Webuploader.create({
                // server: window.webuploader.uploadUrl, 
                pick: {
                    id:'#workPicker',
                },
                dnd: '.upWorkBox',
                paste: document.body,
                accept:{
                    title: 'mtd',
                    extensions: 'mtd',
                    mimeTypes: 'mtd'
                },
                swf: "../../plugins/webuploader-0.1.5/Uploader.swf",
                resize: false, 
                chunked: true,
                fileNumLimit: 1,
                // fileSingleSizeLimit: 10*1024*1024,//限制大小10M，单文件
                // fileSizeLimit: 10*1024*1024,//限制大小10M，所有被选文件，超出选择不上
            });
            workupload.init(uploader);
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