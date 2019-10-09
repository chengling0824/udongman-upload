define(['webuploaderJS'], function(Webuploader) {
    var $workPicker = $('#workPicker');
    var $info0 = $('.upWorkBox').find('.info0');
    var $fileUpBox = $('.fileUpBox');
    var $file_title = $('.file-title');
    var $progress = $fileUpBox.find('.percentage-bar');
    var $info = $fileUpBox.find('.percentage');
    var $status = $fileUpBox.find('.status');
    var $delBtn = $fileUpBox.find('.del-button');
    var state = 'pedding';
    var percentage;

    
    var workupload = {
        init:function(uploader){
            uploader.on("uploadProgress",function(file, percentage){
                $progress.css('width',percentage * 100 + '%');
                $info.text(parseInt(percentage * 100) + '%');
                console.log('Percentage:', percentage);               
            });
            uploader.on('fileQueued', function(file){
                $workPicker.hide();
                $info0.hide();
                $fileUpBox.show();
                $file_title.text(file.name);
                $delBtn.on('click', function(){
                    uploader.stop();
                    if (confirm("确定要删除吗？")) {  
                        console.log(uploader.getFile("WU_FILE_0"))
                        uploader.cancelFile(uploader.getFile("WU_FILE_0"));
                        uploader.removeFile(uploader.getFile("WU_FILE_0"));
                        percentage = 0;
                        uploader.reset();
                        $fileUpBox.hide();
                        $workPicker.show();
                        $info0.show();
                    }  
                    else {  
                        uploader.upload(uploader.getFile("WU_FILE_0")); 
                    }  
                });

                uploader.md5File(file)
                    .progress(function(percentage){
                        // 上传服务器需要修改
                        // console.log('Percentage:', percentage);
                        $progress.css('width',percentage * 100 + '%');
                        $info.text(parseInt(percentage * 100) + '%');
                        console.log('Percentage:', percentage);  
                    })
                    .then(function(val) {
                        // console.log('md5 result:', val);
                        $status.text("已上传.");

                    });
            });
            uploader.on("uploadSuccess",function(){
                
            });
            uploader.on('uploadError', function(file){
                $status.text("上传出错，请重传.");
            });

            uploader.on("error", function (type) {
                if (type == "Q_TYPE_DENIED") {
                    alert("上传文件格式有误~");
                } 
                else {
                    alert("上传出错！请检查后重新上传！错误代码"+type);
                }
            });
            
            // uploader.on('reset')
        },
        setState :function(){

        },
        
    }
    return workupload;


})