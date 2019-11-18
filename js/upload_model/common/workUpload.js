// define(["webuploaderJS", "uploadCommonJs"], function(Webuploader, common) {
define([ "uploadCommonJs"], function(common) {

    // 本文件为对素材、视频文件上传
    var $workPicker = $('#workPicker');
    var $info0 = $('.upWorkBox').find('.info0');
    var $fileUpBox = $('.fileUpBox');
    var $file_title = $('.file-title');
    var $progress = $fileUpBox.find('.percentage-bar');
    var $info = $fileUpBox.find('.percentage');
    var $status = $fileUpBox.find('.status');
    var $delBtn = $fileUpBox.find('.del-button');
    var $fileURL = $('#fileURL');
    var $up_fileName =$("#file_Name");

    var workupload = {
        material_upload :function(){
            var noCache = Date();
            var uploader2 = new plupload.Uploader({
                browse_button:['workPicker'],
                url:"https://udm3-test.udongman.cn/index.php?m=attachment&c=attachments&a=material_rar_temp_add&dosubmit=1&noCache="+noCache,
                filters: {
                    mime_types : [ //只允许上传图片和zip文件
                    { title : "mtd", extensions : "mtd" }, 
                    ],
                    max_file_size : '50MB', //限制大小
                    prevent_duplicates : true //不允许选取重复文件
                },
                drop_element:['fileUp_box'],
                multi_selection:false,
                flash_swf_url : 'js/Moxie.swf',
                silverlight_xap_url : 'js/Moxie.xap',

            })
            uploader2.init();
            uploader2.bind('FilesAdded',function(uploader2,files){
                percentage = 0;
                $progress.css('width','0');
                $info.text('0%');
                $status.text("上传准备中...");

                var file = files[0];
                $workPicker.hide();
                $('.upWorkBox').find('div:last').hide();
                $info0.hide();
                $fileUpBox.show();
                $file_title.text(file.name);
                $file_title.attr('title',file.name)
                $up_fileName.val(file.name);
                uploader2.start();
            })
            uploader2.bind('UploadProgress',function(uploader2,file){
                var percentage = file.percent;
                $status.text("上传中...");                
                $progress.css('width',percentage+ '%');
                $info.text(parseInt(percentage) + '%');
                console.log('Percentage:', percentage);  
            })
            uploader2.bind('FileUploaded',function(uploader2,file,info){
                $status.text("上传成功.");  
                var fileUrl = JSON.parse(info.response);//上传文件的路径
                $fileURL.val(fileUrl.savepath);
            })
            uploader2.bind('Refresh',function(uploader2,files){
                
                
            })
            uploader2.bind('Error',function (uploader2, err) {
                if (err.code == "-601") {
                    common.alertTost('仅支持mtd格式文件','error')
                } else if (err.code == "-600") {
                    common.alertTost("文件大小不超过50M", "error");
                } else {
                    $status.html("上传出错，请<a id='retry'>重传</a>.");
                    $('#retry').on('click',function(){ //确定重传
                        if(uploader2){
                            var files = uploader2.files;
                            var file = files[0]
                            uploader2.removeFile(file);
                            uploader2.refresh();
                            $fileURL.val('');
                            $up_fileName.val('');
                            
                        }else{
                            workupload.material_upload();
                        }
                        $('.upWorkBox').find('div:last input').trigger('click');
                    })

                    console.log(err)
                    common.alertTost('上传出错！请检查后重新上传！','error')
                }
                
            })
            $delBtn.on('click', function(){
                $('#cancelMal_Model').show();
            });

            $('#cancel_Del_Video').on('click',function(){
                $('#cancelMal_Model').hide();
            })
            $('#confirm_Del_Video').click(function(){ //确定删除
                $('#cancelMal_Model').hide();
                $fileUpBox.hide();
                $workPicker.show();
                $('.upWorkBox').find('div:last').show();
                $info0.show();
                $fileURL.val('');
                $up_fileName.val('');
                percentage = 0;
                $progress.css('width','0');
                $info.text('0%');

                if(uploader2){
                    var files = uploader2.files;
                    var file = files[0]
                    if(file){
                        uploader2.removeFile(file);
                        uploader2.refresh();    
                    }
                }else{
                    workupload.material_upload();
                } 
            })
        },
        

        video_upload : function(){
            var upload_auth = null;
            var uploader = new AliyunUpload.Vod({
                //分片大小默认1M，不能小于100K
                partSize: 1024*1024,
                //并行上传分片个数，默认5
                parallel: 5,
                //网络原因失败时，重新上传次数，默认为3
                retryCount: 100,
                //网络原因失败时，重新上传间隔时间，默认为2秒
                retryDuration: 2,

                // 开始上传
                'onUploadstarted': function (uploadInfo) {
                    $workPicker.hide();
                    $info0.hide();
                    $fileUpBox.show();
                    $info.text('0%');
                    $status.text("上传准备中...");                                        
                    $file_title.text(uploadInfo.file.name);
                    $file_title.attr('title',file.name)
                    $('#file_Name').val(uploadInfo.file.name);
                    filename = uploadInfo.file.name;
                    console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                    //上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
                    upload_auth = workupload.get_video_upload_auth(uploadInfo.file.name)
                    if (upload_auth && upload_auth.UploadAuth && upload_auth.UploadAuth.length > 0){
                        if(!uploadInfo.videoId){
                            // 设置上传地址和上传凭证方法在onUploadstarted回调里调用，此回调的参数包含uploadInfo的值
                            uploader.setUploadAuthAndAddress(uploadInfo, upload_auth.UploadAuth, upload_auth.UploadAddress,upload_auth.VideoId);
                        }else{//如果videoId有值，根据videoId刷新上传凭证
                            uploader.setUploadAuthAndAddress(uploadInfo, upload_auth.UploadAuth, upload_auth.UploadAddress);
                        }
                    }
                    $('#video_id').attr('videoname',uploadInfo.file.name);
        
                },
                // 文件上传成功
                'onUploadSucceed': function (uploadInfo) {
                    console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                    console.log(upload_auth.VideoId)
                    $status.text("上传成功.");  
                    $("#video_id").val(upload_auth.VideoId)
                    $("#videoUPload").attr("disabled",false);
                    $('#video_id').attr('upload','upload');
                },
                // 文件上传失败
                'onUploadFailed': function (uploadInfo, code, message) {
                    console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
                    // $(".upload-warning").html('视频上传失败,请重新上传');
                    $status.text('视频上传失败,请重新上传');
                    $("#videoUPload").attr("disabled",false);
                },
                // 文件上传进度，单位：字节
                'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
                    $status.text("上传中...");                
                    $progress.css('width',loadedPercent * 100 + '%');
                    $info.text(parseInt(loadedPercent * 100) + '%');
                    console.log('Percentage:', loadedPercent);  
                },
                // 上传凭证超时
                'onUploadTokenExpired': function (uploadInfo) {
                    console.log("onUploadTokenExpired");
                    //上传方式1  实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
                    if(upload_auth.UploadAuth){
                        uploader.resumeUploadWithAuth(upload_auth.UploadAuth);
                    }
                },
                //全部文件上传结束
                'onUploadEnd':function(uploadInfo){
                    console.log("onUploadEnd: uploaded all the files");
                }
            });
        
            document.getElementById("videoUPload").addEventListener('change', function (event) {
                // uploader.cleanList();
                uploader.cancelFile(0);
                upload_file = event.target.files[0]
                var allowArr = ['mp4','avi','mkv','rmvb','wmv','flv'];
                var fileType = upload_file.name.slice( upload_file.name.lastIndexOf('.')+1);
                if (allowArr.indexOf(fileType) == -1){
                    common.alertTost('请上传限定格式的视频(mp4、avi、mkv、rmvb、wmv、flv)!','error')
                    return;
                }
                uploader.addFile(upload_file, null, null, null, null);
                uploader.startUpload();
                document.getElementById('videoUPload').value = null;
            });
            $delBtn.on('click', function(){
                $('#cancelMal_Model').show();
            });

            $('.add-video-file').click(function(){
                $("#videoUPload").click();
            })
            $('.cancel-upload').click(function(){   //点击删除按钮，弹出弹窗
                $("#videoUPload").attr("disabled",false);
            });
            $('#upload_Close_Del').click(function(){ //关闭弹窗
                $('#cancelMal_Model').hide();
            })
            $('#cancel_Del_Video').click(function(){ //取消
                $('#cancelMal_Model').hide();
                uploader.startUpload();
            })
            $('#confirm_Del_Video').click(function(){ //确定删除
                $('#cancelMal_Model').hide();
                uploader.cancelFile(0);
                $fileUpBox.hide();
                $workPicker.show();
                $info0.show();
                percentage = 0;
                $progress.css('width','0');
                uploader.cleanList();
            })
        },
        get_new_upload_auth :function(videoId){
            $.ajax({
                url:'/index.php?m=course&c=add&a=refreshUploadAuth',
                type:'POST',
                async:false,
                data:{videoid:videoId},
                success:function(res){
                    res = JSON.parse(res)
                    if (res.msg == 'success'){
                        return res;
                    }
                }
            })
        },
        get_video_upload_auth :function(filename){
            var upload_auth = {}
            $.ajax({
                url: 'index.php?m=course&c=add&a=getUploadAuth',
                async:false,
                type:'GET',
                data:{filename:filename},
                dataType:'json',
                success:function (response) {
                    if(response.code == 1){
                        upload_auth = response;
                        $("#videoUPload").attr("disabled",true);
                    }else{
                        $("#videoUPload").attr("disabled",false);
                        common.alertTost('上传视频凭证失败，请重新上传！','error')
                    }
                }
            })
            return upload_auth;
        },
        get_video_info :function(videoId){
            var videoinfo = {}
            $.ajax({
                url: 'index.php?m=course&c=add&a=getUploadInfo',
                async:false,
                type:'GET',
                data:{video_id:videoId},
                dataType:'json',
                success:function (response) {
                    if(response.code == 0){
                        videoinfo = response.VideoId;
                    }
                }
            })
            return videoinfo
        },
        
    }
    return workupload;
    


})