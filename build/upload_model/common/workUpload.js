define(['webuploaderJS'], function(Webuploader) {
    var $workPicker = $('#workPicker');
    var $info0 = $('.upWorkBox').find('.info0');
    var $fileUpBox = $('.fileUpBox');
    var $file-title = $('.file-title');
    var $progress = $fileUpBox.find('.percentage-bar');
    var $info = $fileUpBox.find('.percentage');
    var $status = $fileUpBox.find('.status');
    var $delBtn = $fileUpBox.find('.del-button');
    var state = 'pedding';

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
    var workupload = {
        init:function(){
            uploader.on("uploadProgress",function(file, percentage){
                $progress.css('width',percentage * 100 + '%');
                $info.text(percentage * 100 + '%');
            });
            uploader.on('fileQueued', function(file){
                $workPicker.hide();
                $info0.hide();
                $fileUpBox.show();
            });
            uploader.on("uploadSuccess",function(){
                $status.text("已上传.");
            });
            uploader.on('uploadError', function(file){
                $status.text("上传出错，请重传.");
            });
            uploader.on('all', function( type ){
                if( type == 'uploadFinished') {
                    multiImage.setState('confirm');
                } else if( type == 'startUpload' ){
                    multiImage.setState('uploading');
                } else if( type == 'stopUpload' ){
                    multiImage.setState('paused');
                }
            });
            uploader.on("error", function (type) {
                if (type == "Q_TYPE_DENIED") {
                    alert("请上传mtd格式文件");
                } 
                else {
                    alert("上传出错！请检查后重新上传！错误代码"+type);
                }
            });
            $delBtn.on('click', function(){
                uploader.stop();
                if (confirm("确定要删除吗？")) {  
                    uploader.cancelFile( file );
                    $fileUpBox.hide();
                    $workPicker.show();
                    $info0.show();
                }  
                else {  
                    uploader.upload(file); 
                }  
            });
        }
        
    }


})