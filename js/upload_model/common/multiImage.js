// define(["webuploaderJS","uploadCommonJs"], function(Webuploader,common) {
    define(["uploadCommonJs"], function(common) {
        "use strict";
        var multiImage = {
            uploadInit: function(fileNum,type,multiType) {
                $("#uploader .info0").html('支持jpg/png/bmp/gif格式，单张图片不超过10M，最多'+fileNum+'张图片');
                $("#uploader .info2").html('支持jpg/png等格式<br>不超过10M');
                
                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    browse_button : ['filePicker','upload_Mate_Img'],
                    url : "https://udm3-test.udongman.cn/index.php?m=attachment&c=attachments&a=plupload_add&module=content&catid=&dosubmit=1&imgform=1&imgclass=uploadedimg",
                    flash_swf_url : 'js/Moxie.swf',
                    silverlight_xap_url : 'js/Moxie.xap',
                    multi_selection: multiType,                    
                    filters: {
                        mime_types : [ 
                            { title : "Images", extensions : "gif,jpg,bmp,png" }
                        ],
                        max_file_size: '10240kb',
                        prevent_duplicates : false //允许队列中存在重复文件
                    }
                });
                
                uploader.init();

                //绑定文件添加进队列事件
                uploader.bind('FilesAdded',function(uploader,files){
                    $(".file-picker-init").hide();
                    $('.imgBox').show();
                    $("#add_Img_Cover").show();
                    $('#add_Img_Cover input').attr('disabled',false);
                    
                    var liNum = $("#queueList li").length - 1;
                    if(liNum + files.length > fileNum) { // 最多上传20张图
                        common.alertTost("最多上传"+ fileNum +"张图片", "error");
                        files.forEach(function(file){
                            uploader.removeFile(file)
                        })
                        return false;
                    }
                    
                    if($("#add_Img_Cover").css('display') != 'none'){
                        var notfirstFlag = true
                    }else{
                        var notfirstFlag = false
                    }

                    files.forEach(function(file,index){
                        var imgIndex = 0;
                        if (notfirstFlag){
                            imgIndex = liNum + index;
                        }else{
                            imgIndex = index + 1;
                        }
                        var str = '';
                        if(file.type =='image/gif'||file.type =='image/bmp'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                            var fr = new mOxie.FileReader();
                            fr.onload = function(){
                                multiImage.addFileThumb(file,index,imgIndex,fr.result);
                                fr.destroy();
                                fr = null;
                            }
                            fr.readAsDataURL(file.getSource());
                        }else{
                            var preloader = new mOxie.Image();
                            preloader.onload = function() {
                                if (type == 'works' || preloader.width < 6500 && preloader.height < 6500){
                                    preloader.downsize(180)//先压缩一下要预览的图片,宽300，高300
                                    var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg') : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                                    multiImage.addFileThumb(file,index,imgIndex,imgsrc);
                                }else{
                                    common.alertTost('分辨率应小于6500*6500','error') 
                                    uploader.removeFile(file)
                                }
                                preloader.destroy();
                                preloader = null;
                            };
                            preloader.onerror = function (error) {
                                //console.log("发生了错误 === ",error,'fileEleId === ',fileEleId);
                            }
                            preloader.load( file.getSource() );
                        }
                    })

                        
                    if ($("#queueList li").length + files.length - 1 < fileNum && $('#queueList li').length > 0){
                        $('#add_Img_Cover').removeClass('disabled');
                        $('#add_Img_Cover input').attr('disabled',false);
                    }else{
                        $('#add_Img_Cover').addClass('disabled');
                        $('#add_Img_Cover input').attr('disabled',true);
                    }

                    multiImage.bindDeleteEvent(fileNum);
                    multiImage.setDragEvent();

                    uploader.start();
                })
                    uploader.bind('UploadProgress',function(uploader,file){
                        if (file.percent < 100){
                            $('#file_'+ file.id + ' .progress').css('width',file.percent + '%');
                        }else{
                            $('#file_'+ file.id + ' .uploading').remove(); 
                            $('#file_'+ file.id + ' .progress-box').remove(); 
                        }
                    });
                
                    uploader.bind('FileUploaded',function(uploader,file,info){
                        if (info.status == 200){
                            var imgPath = info.response
                            $('#file_'+ file.id + ' img ').attr('data-src', imgPath);
                        }
                    });
                    uploader.bind('UploadComplete',function(uploader,file){
                        var str = '<p class="upload-error">上传失败</p>'+
                                    '<div class="file-panel cancel"></div>';
                        var $trainHasProgress =$('#queueList li').find('.progress-box');
                        if ($trainHasProgress.length > 0){
                            $trainHasProgress.each(function(index,item){
                                $(item).parent().html(str);
                            })
                        }
                    });
                    uploader.bind('Error',function (uploader,file, err) {
                        if (file.code == '-601'){
                            common.alertTost( "请上传JPG、PNG、GIF、BMP格式文件","error");
                        }else if (file.code == '-600'){
                            common.alertTost("图片大小不超过10M", "error");
                        }else{
                            var str = '<p class="upload-error">上传失败</p>'+
                                        '<div class="file-panel cancel"></div>';
                            $('#file_'+ file.id).html(str);
                        }
                    });
            
            },
            bindDeleteEvent :function(fileNum){
                $('#queueList').on('click','.cancel',function(){
                    $(this).parent().remove();
                    if ($('#queueList li').length < 2){
                        $(".file-picker-init").show();
                        $('.imgBox').hide();
                        $('#add_Img_Cover input').attr('disabled',true);
                    }else{
                        if ($('#queueList li').length - 1 < fileNum 
                                && $('#add_Img_Cover').hasClass('disabled')){
                            $('.imgBox').show();
                            $('#add_Img_Cover').removeClass('disabled');
                            $('#add_Img_Cover input').attr('disabled',false);
                        }
                    }
                })
            },
            addFileThumb :function(file,index,imgIndex,imgsrc){
                var str = '';
                str = '<li id="file_'+file.id+'" data-sort="'+
                index +'" class="wrapItem">'+
                '<div class="imgWrap item" id="wrap'+ imgIndex +'" draggable="true">'+
                    '<img draggable="false" id="img'+ imgIndex +'" src="' + imgsrc + '"></div>'+
                '<p class="uploading">正在上传...</p>' +
                '<div class="progress-box">' +
                    '<div class="progress"></div>' +
                '</div>'+
                '<div class="file-panel cancel"></div>'+
                '</li>';
                $('#add_Img_Cover').before(str);
            },
            // 素材修改时添加后台图片
            addFileImg: function(files,fileNum) { 
                var str = ''; 
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    //将后台多图渲染入编辑页面
                    str += '<li id="file_'+file.id+'" data-sort="'+
                    i +'" class="wrapItem">'+
                    '<div class="imgWrap item" id="wrap'+(i+1)+'" draggable="true">'+
                    '<img draggable="false" id="img'+(i+1)+
                    '" src="' + files[i].src + '"></div>' +
                    '<div class="file-panel cancel"></div>'+
                    '</li>'
                }
                if (files.length == fileNum){
                    $('#add_Img_Cover').addClass('disabled');
                    setTimeout(function(){
                        $('#add_Img_Cover input').attr('disabled',true);
                    },300)
                }
                $('#add_Img_Cover').before(str);
                $("#add_Img_Cover").show();
                multiImage.bindDeleteEvent(fileNum);
                multiImage.setDragEvent();
            },
            // 图片拖拽排序
            setDragEvent: function() {
                var dragMoving = false;
                var origin  = null;
                var dragCon = document.getElementById('queueList');
                dragCon.addEventListener('dragstart', startDrag, false);
                /**
                 * 这里一定要阻止dragover的默认行为，不然触发不了drop
                 */
                dragCon.addEventListener('dragover', function (e) {
                    e.preventDefault();
                }, false);
                dragCon.addEventListener('drop', exchangeElement, false);
                function startDrag(e) {
                    if (dragMoving){
                        return;
                    }
                    dragMoving = true;
                    origin = e.target;
                }
                function exchangeElement(e){
                    e.preventDefault();

                    if ( dragMoving && origin){
                        if(origin == e.target.parentElement){
                            origin  = null;
                            return false;
                        }
                        if(origin == e.target){
                            origin  = null;
                            return false;
                        }
                        var el = e.target;
                        var parentEle = ''; //要插入位置的父元素
                        var curEle = ''; //需要交换的元素
                        if (el.id.indexOf('img') > -1) {
                            parentEle = el.parentElement.parentElement;
                            curEle = el.parentElement;
                            changeAdrr(parentEle,curEle,origin)
                            origin = null;
                        }else if (el.id.indexOf('wrap') > -1){
                            parentEle = el.parentElement;
                            curEle = el;
                            changeAdrr(parentEle,curEle,origin)
                            origin = null;
                        }
                    }
                    dragMoving = false;
                }
                function changeAdrr(parentEle,curEle,origin){
                    var $cloneTo = $(curEle).clone();
                    var $cloneFrom = $(origin).clone();
                    var $originParent = $(origin).parent();
                    $(parentEle).find('.imgWrap').remove();
                    $originParent.find('.imgWrap').remove();
                    $originParent.prepend($cloneTo);
                    $(parentEle).prepend($cloneFrom);
                }
            } 
        }
        return multiImage;
    });
    