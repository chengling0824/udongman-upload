requirejs(['../commonConfig'],function(com){
    requirejs(['jquery','uploadCommonJs','webuploaderJS','workUploadJS'],function($,common,Webuploader,workupload){

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
            common.editorInit();

            //  字符检验
            common.TextBox('#upload_title','30');
            common.TextBox('#describe_inp','280');
            
            //  标签选择
            common.tagboxInit('5');
        })
    })
})