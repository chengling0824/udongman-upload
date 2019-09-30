
define(['webuploaderJS','cropperJS','ueditorAllJS'], function(Webuploader,cropper,UE) {
    var common = {
        editorInit :function(){
            var ue = UE.getEditor( 'editor', {
                autoHeightEnabled: true,
                autoFloatEnabled: true,
                initialFrameWidth: 980,
                initialFrameHeight:438,
            });
        },
        coverImg :function(){
            $('.upCoverBtn-2').on('click',function(){
                common.cropImg();
            });
            $('.re-upload').on('click',function(){
                $('.upCoverBtn-2').trigger('click');
                common.cropImg();
            });
        },
        cropImg :function(){
            var $upcoverBtn = $('.upCoverBtn-prior');

            $upcoverBtn.on('change','input',function(e){
                var file  = e.target.files[0];
                var reader = new FileReader(); 
                if (file && file.type.match('image.*')) {
                    reader.readAsDataURL(file);
                } 
                reader.onloadend = function () {  
                    $('#cropperImg').attr('src',reader.result);
                    $('.upCoverBtn-prior').hide();
                    var $image = $('#cropperImg'),
                        $dataX = $('#dataX'),
                        $dataY = $('#dataY'),
                        $dataHeight = $('#dataHeight'),
                        $dataWidth = $('#dataWidth'),
                        $dataRotate = $('#dataRotate'),
                        options = {
                            aspectRatio: 1 / 1,
                            preview: '.img-preview',
                            crop: function (data) {
                                $dataX.val(Math.round(data.x));
                                $dataY.val(Math.round(data.y));
                                $dataHeight.val(Math.round(data.height));
                                $dataWidth.val(Math.round(data.width));
                                $dataRotate.val(Math.round(data.rotate));
                            }
                        };
                    $image.cropper(options);
                    
                }
                // $image.cropper(options);
            });
        },

        TextBox :function(id,maxlength){
            var inputBox = $(id);
            var len,num;
            inputBox.bind('input propertychange',function(){
                len = inputBox.val().length;
                num = maxlength - len;
                inputBox.next('.txtInput-info').html(num+"/"+maxlength);
            })
        },
        tagboxInit :function(maxtag){
            var tagBox = $('#tags');
            var num = maxtag ;
            tagBox.next('.txtInput-info').html(num+"/"+maxtag);
            common.addTagbox(maxtag);
            common.deltag(maxtag);
            common.selectTag(maxtag);
        },
        addTagbox :function(maxtag){
            var addTag = $('.input_content');
            addTag.on('keypress', function(event) {
                var slections = $('#tags').find('span').text();
                var selection = slections.split('×');
                var num = maxtag - selection.length;
                if (addTag.val()) {
                    if (event.keyCode == 13 || event.keyCode == 32) {
                        var addval = addTag.val().trim();
                        if (addval.length>30 || addval.length<2) {
                            alert('标签字数在2~30之间!')
                        }
                        else if (selection.indexOf(addval)>-1) {
                            alert('不可重复创建标签')
                        }
                        else if(num<0){
                            return false;
                        }
                        else{
                            addTag.before('<span>' + addval + '<em>×</em></span>');
                            $('#input_tags').val(tags + ',' + addval);
                            addTag.val('');
                        }
                    } 
                } ;
                if(event.keyCode == 8){
                    var last_span = $('#tags span').last().text().split('×');
                    var last_tag = last_span[0];
                    console.log(1)
                    for(var i=0;i<lis.length;i++){
                        if(lis[i].innerHTML==last_tag){
                        lis.eq(i).removeClass('tag-chosen');
                        }
                    }
                    $('#tags span').last().remove();
                    };
                common.tagAges(maxtag);
            });
        },
        deltag :function(maxtag){
            var tagBox = $('#tags');
            var lis = $('#tag_provide').find('li');
            tagBox.on('click', 'em', function() {
                var del_spans = $(this).parents('span').text().split('×');
                var del_span = del_spans[0];
                for(var i=0;i<lis.length;i++){
                    if(lis[i].innerHTML==del_span){
                        lis.eq(i).removeClass('tag-chosen');
                    }
                }
                $(this).parents('span').remove();
                common.tagAges(maxtag);
            })
        },
        selectTag :function(maxtag){
            var tagBox = $('#tags');
            var addTag = $('#tags input:first');
            $('#tag_provide li').on('click',function() {
                var slections = $('#tags').find('span').text();
                var selection = slections.split('×');
                var num = maxtag - selection.length;
                var tag_selected = $(this).text();
                if ($(this).hasClass('tag-chosen')) {
                    $(this).removeClass('tag-chosen');
                    var del_index = selection.indexOf(tag_selected);
                    tagBox.find('span').eq(del_index).remove();
                }
                else if(num<0){
                    return false;
                }
                else{
                    $(this).addClass('tag-chosen');
                    var addval = $(this).text();
                    addTag.before('<span>' + addval + '<em>×</em></span>');
                }
                common.tagAges(maxtag);
            });
        },
        tagAges :function(maxtag){
            var tagBox = $('#tags');
            var slections = $('#tags').find('span').text();
            var selection = slections.split('×');
            var num = maxtag - selection.length + 1;
            tagBox.next('.txtInput-info').html(num+"/"+maxtag);
        },

        editorInit :function(){
            //实例化编辑器
            var ue = UE.getEditor( 'editor', {
                autoHeightEnabled: true,
                autoFloatEnabled: true,
                initialFrameWidth: 980,
                initialFrameHeight:438,
            });
        }
    }

    return common;
        
})

