define(['webuploaderJS'], function(Webuploader) {
    'use strict';  
    var origin;
    var is_moveing = false;
    var $wrap = $('#uploader');
    var $queue = $('.queueList');
    var $upBox = $('.upBox');
    var $upload = $wrap.find('.uploadBtn');
    var $statusBar = $wrap.find('.statusBar');
    var $info = $statusBar.find('.info');
    var $placeHolder = $wrap.find('.placeholder');
    var $progress = $statusBar.find('.progress').hide();
    var fileCount = 0;
    var fileSize = 0;
    var state = 'pedding';
    var percentages = {}; 
    var uploader = Webuploader.create({
        // server: window.webuploader.uploadUrl, 
        //文件接受服务端
        pick: {
            id:'#filePicker',
            multiple:'ture',
        },
        dnd: '.upIntroBox',
        disableGlobalDnd: true,
        paste: document.body,
        accept:{
            title: 'Images',
            extensions: 'gif,jpg,jpeg,png',
            mimeTypes: 'images/*'
        },
        swf: "../../plugins/webuploader-0.1.5/Uploader.swf",
        resize: false, //是否压缩
        duplicate :true,
        chunked: true,
        fileNumLimit: 20,
        fileSingleSizeLimit: 10*1024*1024,//限制大小10M，单文件
        // fileSizeLimit: 10*1024*1024,//限制大小10M，所有被选文件，超出选择不上
    });
    var multiImage = {
        uploadInit :function(){
            window.Webuploader = {
                config:{
                    thumbWidth: 180, 
                    thumbHeight: 180, 
                    // wrapId: 'uploader', 
                },
            }
            uploader.on('uploadProgress', function( file, percentage){
                var $li = $('#' + file.id),
                $percent = $li.find('.progess span');
                $percent.css( "width", percentage * 100 + '%');
                multiImage.updateTotalProgress();
            });
            uploader.on('fileQueued', function(file){
                multiImage.fileQueue(file);
                multiImage.addUpBox();
                fileSize += file.size;
                $('.webuploader-pick').siblings('div').css({
                    'top':'0',
                    'left':'0',
                    'width':'100%',
                    'height':'100%',
                });
                $('.webuploader-pick').siblings().appendTo($upBox);
                var $upBtn0 = $upBox.find('div:last');
                $upBtn0.css({
                    'top':'0',
                    'left':'0',
                });
            });
            uploader.on('fileDequeued', function(file){
                fileCount --;
                fileSize -= file.size;
                if(!fileCount){
                    multiImage.setState('pedding');
                    var $upBtn0 = $upBox.find('div:last');
                    $upBtn0.css({
                        'top':'0',
                        'left':'0',
                    });
                    $upBtn0.appendTo('#filePicker');
                    $upBox.find('.upBtn').hide();
                    $wrap.find('.imgBox').hide();
                    $wrap.find('#filePicker').show();
                    $wrap.find('.info0').show();
                    multiImage.removeFile( file );
                }else{
                    multiImage.removeFile( file );
                    multiImage.updateTotalProgress();
                    multiImage.addUpBox();
                }
            });
            uploader.on('uploadSuccess', function(file){
                $('#' + file.id ).find('p.state').text('已上传');
            });
            uploader.on('uploadError', function(file){
                console.log(file.id + '上传出错');
            });
            uploader.on('uploadComplete', function(file){
                $('#' + file.id ).find('p.state').fadeOut();
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
            uploader.on('uploadBeforeSend', function(block, data){
                data.sort = $('#'+data.id).attr('data-sort');
            });
            uploader.on("error", function (type) {
                if (type == "Q_TYPE_DENIED") {
                    alert("请上传JPG、PNG、GIF、BMP格式文件");
                } 
                else if (type == "F_EXCEED_SIZE") {
                    alert("文件大小不能超过10M");
                }
                else if(type == "Q_EXCEED_NUM_LIMIT"){
                    alert("最多上传20张图片");
                }
                else {
                    alert("上传出错！请检查后重新上传！错误代码"+type);
                }
            });
            $upload.on('click', function(){
                uploader.sort(function(obj1, obj2){
                    return $('#'+obj1.id).attr('data-sort') > $('#'+obj2.id) ? -1: 1;
                });
                if( $(this).hasClass('disabled')){
                    return false;
                }
                if( state == 'ready'){
                    if(uploader.getFiles().length < 1)
                        multiImage.updateServerFiles();
                    else
                        uploader.upload();
                } else if(state == 'paused'){
                    uploader.upload();
                } else if( state == 'uploading'){
                    uploader.stop();
                }
            });
            $info.on('click', '.retry', function(){
                uploader.retry();
            });
            $info.on('click', '.ignore', function(){
                alert('todo');
            });
            $upload.addClass('state-'+state);
        },
        //设置webuploader的状态
        setState:function(val){
            var file,stats;
            if( val == state){
                return ;
            }
            $upload.removeClass('state-'+state);
            $upload.addClass('state-'+val);
            state = val;
            switch( state ){
                case 'pedding':
                    $placeHolder.removeClass('element-invisible');
                    $queue.parent().removeClass('filled');
                    $queue.hide();
                    $statusBar.addClass('element-invisible');
                    uploader.refresh();
                    break;
                case 'ready':
                    $placeHolder.addClass('element-invisible');
                    $('#filePicker2').removeClass('element-invisible');
                    $queue.parent().addClass('filled');
                    $queue.show();
                    $statusBar.removeClass('element-invisible');
                    uploader.refresh();
                    break;
                case 'uploading':
                    $('filePicker2').addClass('element-invisible');
                    $progress.show();
                    $upload.text('暂停上传');
                    break;
                case 'paused':
                    $progress.show();
                    $upload.text('继续上传');
                    break;
                case 'confirm':
                    $progress.hide();
                    $upload.text('开始上传').addClass('disabled');
                    stats = uploader.getStats();
                    if( stats.successNum && !stats.uploadFailNum ){
                        setState( 'finish' );
                        return ;
                    }
                    break;
                case 'finish':
                    stats = uploader.getStats();
                    if( stats.successNum ){
                        alert('上传成功');
                    } else {
                        state = 'done';
                        location.reload();
                    }
                    break;
            }
            multiImage.updateStatus();
        },
        //更新webuploader中图片上传的进度
        updateTotalProgress:function(){
            var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;
            $.each( percentages, function(k,v){
                total += v[0];
                loaded += v[0] * v[1];
            });

            percent = total? loaded /total : 0;

            spans.eq(0).text(Math.round(percent*100)+'%');
            spans.eq(1).css('width', Math.round(percent*100)+'%');
            multiImage.updateStatus();
        },
        updateStatus:function(){
            var text = '', stats;
            if( state == 'ready'){
                text = '选中'+fileCount + '张图片，共'+ Webuploader.formatSize( fileSize ) +'.';
            } else if( state == 'confirm'){
                stats = uploader.getStats();
                if( stats.uploadFailNum ){
                    text = '已成功上传'+stats.successNum+'张照片'+stats.uploadFailNum +'张照片上传失败,<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>';
                }
            } else {
                stats = uploader.getStats();
                text = '共' + fileCount +'张('+Webuploader.formatSize(fileSize)+')，已上传'+stats.successNum+'张';
                if( stats.uploadFailNum){
                    text += ',失败'+ stats.uploadFailNum +'张';
                }
            }
            $info.html(text);
        },
        //文件加入到webuploader中的队列
        fileQueue: function(file){
            $wrap.find('#filePicker').hide();
            $wrap.find('.info0').hide();
            $wrap.find('.imgBox').show();
            $('#upBtn').prependTo($upBox);
            $('#upBtn').show();
            file.src = file.src || "client";
            fileCount++;
            fileSize += file.size;
            if( fileCount == 1){
                $placeHolder.addClass('element-invisible');
                $statusBar.show();
            }
            multiImage.addFile(file);
            multiImage.setState( 'ready' );
            multiImage.updateTotalProgress();
        },
        // 添加上传按钮
        addUpBox :function(){
            var position = $('.queueList li:last').position();
            if( position.left > 780){
                $upBox.css({'left':0 , 'top':position.top+200});
                $queue.height(position.top+400);
            }else{
                $upBox.css({'left':position.left+200 , 'top':position.top});
            }
            $upBox.appendTo($queue);
        },
        //添加附件到webuploader中
        addFile :function(file){
            var index = $queue.find('li').length;
            var imgLeft = index * (180+20);
            var imgTop = 0;
            var wrapHeight = 180+20;
            var wrapWidth = $queue.width()-8;
            if( imgLeft >= wrapWidth){
                imgTop = parseInt(imgLeft/wrapWidth) * (180+10);
                wrapHeight = imgTop + wrapHeight;
                imgLeft =(index % (parseInt(wrapWidth/(180+10) ) )) * (180+20);
            }
            $queue.height(wrapHeight);
            var $li = $('<li data-key="'+file.key+'"  data-src="'+file.src+'" data-sort="'+index+'" draggable="true" id="' + file.id + '" class="wrapItem" style="left:'+imgLeft+'px; top:'+imgTop+'px">' +
            '<p class="imgWrap"></p>' + 
            '<p class="progress"><span></span></p>' + '</li>'
            ),
            $btns = $('<div class="file-panel cancel"></div>').appendTo( $li ),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>');

            var showError = function( code ){
                switch( code ){
                    case 'exceed_size':
                        text = '文本大小超出';
                        break;
                    case 'interrupt':
                        text = '上传暂停';
                        break;
                    default:
                        text = '上传失败';
                        break;
                }
                $info.text( text ).appendTo( $li );
            };
            if( file.src == "client"){
                    $wrap.text('预览中');
                    uploader.makeThumb( file, function(error, src){
                        if( error ){
                            $wrap.text('不能预览');
                            return ;
                        }
                        var img = $('<img draggable="true" src="'+src+'">');
                        img.bind('load',function(){
                            multiImage.setDragEvent(img);
                        });
                        $wrap.empty().append( img );
                    }, 180,180);
                    percentages[ file.id ] = [ fileSize, 0];
                    file.rotation = 0;
               
                file.on('statuschange', function(cur, prev){
                    if( prev == 'progress'){
                        $progress.hide().width(0);
                    } else if( prev == 'queued'){
                        $li.off('mouseenter mouseleave');
                        $btns.remove();
                    }
                    if( cur == 'error' || cur == 'invalid'){
                        showError( file.statusText );
                        percentages[ file.id][ 1 ] = 1;
                    } else if( cur == 'interrupt'){
                        showError('interrupt');
                    } else if( cur == 'queued'){
                        percentages[ file.id ][1] = 0;
                    } else if( cur == 'progress'){
                        $info.remove();
                        $progress.css('display', 'block');
                    } else if( cur == 'complete' ){
                        $li.append('<span class="success"></span>');
                    }
                    $li.removeClass('state-'+prev).addClass('state-'+cur);
                });
            }
            else{
                var img = $('<img draggable="true" src="'+file.path+'">');
                img.bind('load',function(){
                    multiImage.setDragEvent(img);
                });
                $wrap.empty().append( img );
            }
            $li.on('mouseenter', function(){
                $btns.stop().animate({height:30});
            });
            $li.on('mouseleave', function(){
                $btns.stop().animate({height:0})
            });
            $btns.on('click', function(){
                var index = $(this).index(), deg;
                //修改删除后面所有图片的位置
                var allImgs = {};
                var del_sort = parseInt($('#'+file.id).attr('data-sort'));
                $queue.find('li').each(function(index, obj){
                    if( $(obj).attr('data-sort') > del_sort){
                        var sort = parseInt($(obj).attr('data-sort'));
                        var $prevObj = $("li[data-sort="+(sort-1)+"]");
                        if( $prevObj ){
                            allImgs[$(obj).attr('id')] = $prevObj.position();
                        }
                    }
                });
                for(var k in allImgs){
                    var sort = parseInt($('#'+k).attr('data-sort'));
                    $('#'+k).attr('data-sort',sort-1).css({left:allImgs[k].left+'px', top:allImgs[k].top+'px'});
                }
                allImgs = null;
                if( file.src == "client")
                    uploader.removeFile( file );
                else{
                    removeServerFile( file );
                    $('#'+file.id).remove();
                }
                return;
            });
            $li.appendTo( $queue );
        },

        removeFile :function(file){
            var $li = $('#'+file.id);
            var position = $('.queueList li:last').position();
            delete percentages[ file.id ];
            $li.off().find('.file-panel').off().end().remove();
            $queue.height(position.top+200);
        },
        
        setDragEvent: function(img){
            $(img).on('drop', function(e){
                var $from = $(origin).parents('li');
                var $to = $(e.target).parents('li');
                var origin_pos = $from.position();   
                var target_pos = $to.position();   
                var from_sort = $from.attr('data-sort');
                var to_sort = $to.attr('data-sort');
                console.log(1)
                console.log(origin_pos)
                console.log(target_pos)
                $from.addClass('move').animate(target_pos,"fast", function(){
                    $(this).removeClass('move');
                }).attr('data-sort', to_sort);
                
                $to.addClass('move').animate(origin_pos,'fast', function(){
                    $(this).removeClass('move');
                }).attr('data-sort', from_sort);
            }).on('dragstart', function(e){
                if(is_moveing){
                    return false;
                }
                is_moveing = true;
                e.originalEvent.dataTransfer.effectAllowd = 'move';
                origin = this;
            }).on('dragover', function(e){
                if( e.preventDefault)
                    e.preventDefault();
                is_moveing = false;
                e.originalEvent.dataTransfer.dropEffect = 'move';
            });
        },
    }
    return multiImage;


})