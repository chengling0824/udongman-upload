define(["cropperJS"], function (Cropper) {


    var cropper;
    var warning_info =
        '<p class="warning-info"><span class="tishi"></span>未填写完成<p>';
    var $warnInfo = $(".warning-info");
    var common = {

        alertTost: function (text, type) {
            $.UdmToast("", text, type, {
                stack: true,
                has_icon: false,
                has_close_btn: false,
                fullscreen: false,
                timeout: 2000,
                sticky: false,
                has_progress: false,
                rtl: false,
                position_class: "toast-top-center"
            });
        },

        editorInit :function(){
            var ue = UE.getEditor( 'editor', {  //实例化编辑器
                autoHeightEnabled: true,
                autoFloatEnabled: true,
                initialFrameWidth: 980,
                initialFrameHeight:438,
            });
            return ue;
        },

        sort_li :function(property){
            return function(a,b){
                var value1 = a.getAttribute(property);
                var value2 = b.getAttribute(property);
                return value1 - value2;
            }
        },
        sortMultiImage :function(){
            $('.queueList .wrapItem').sort(common.sort_li('data-sort')).appendTo('.queueList');  
        },

        coverImg: function () {
            // 图片剪裁
            var lastCoverData;
            window.lastCoverData = lastCoverData;
            var URL = window.URL || window.webkitURL;
            var $upcoverBtn = $(".upCoverBtn-prior");
            var image = document.querySelector("#cropperImg");
            var $info = $('#upCover_box').find(".title-box .info");
            var options = {
                aspectRatio: 1 / 1,
                viewMode: 1,
                dragMode: 'move',
                preview: '.img-preview',
                toggleDragModeOnDblclick: false,
                autoCropArea:0.9,
                
                ready: function (e) {
                    const imageData = cropper.getImageData();
                    if(imageData.naturalWidth < 300||imageData.naturalHeight < 300){
                        common.alertTost('最低分辨率300*300','error')
                        cropper.destroy();
                        if($('.img-preview img').length>0){
                            $('.img-preview img').remove();
                        }
                        if(lastCoverData){
                            var $coverImg = $('.img-preview img');
                            if($coverImg.length>0){
                                $coverImg.attr('src',lastCoverData);
                            }else{
                                var $coverImg = $("<img src='"+lastCoverData+"'>");
                                $coverImg.appendTo('.img-preview');
                            }
                        }
                        $(".cover-prior .img-container").css({'border':'2px dashed #e8e8e8'});
                        $(".upCoverBtn-prior").show();
                        $(".re-upload").hide();
                        $info.html(
                            "建议尺寸：800*800或以上 最低尺寸300*300"
                        );
                    }
                    else if(imageData.naturalWidth * imageData.naturalHeight > 3000 * 3000){
                        common.alertTost('最高分辨率3000*3000','error')   
                        cropper.destroy();
                        if($('.img-preview img').length>0){
                            $('.img-preview img').remove();
                        }
                        if(lastCoverData){
                            var $coverImg = $('.img-preview img');
                            if($coverImg.length>0){
                                $coverImg.attr('src',lastCoverData);
                            }else{
                                var $coverImg = $("<img src='"+lastCoverData+"'>");
                                $coverImg.appendTo('.img-preview');
                            }
                        }
                        $(".cover-prior .img-container").css({'border':'2px dashed #e8e8e8'});
                        $(".upCoverBtn-prior").show();
                        $(".re-upload").hide();
                        $info.html(
                            "建议尺寸：800*800或以上 最低尺寸300*300"
                        );
                    }else{
                        $("#cover_Img_Src").val('');
                        $("#cropperImg").attr("src", '');
                        $(".cover-prior .img-container").css({'border':'none'});
                        $(".upCoverBtn-prior").hide();
                        $(".re-upload").show();

                        if(e.detail != null){
                            var height = Math.round(e.detail.height);
                            var width = Math.round(e.detail.width);
                            $info.html(
                                "当前裁剪尺寸：" +height +"*" +width +"，建议尺寸：800*800或以上"
                            );
                        }
                    }
                },
                crop: function (e) {
                    if(e.detail != null){
                        var height = Math.round(e.detail.height);
                        var width = Math.round(e.detail.width);
                        $info.html(
                            "当前裁剪尺寸：" +height +"*" +width +"，建议尺寸：800*800或以上"
                        );
                        if (e.detail.height < 300) {
                            cropper.setData({
                                width: 300,
                                height: 300
                            });
                        }
                    }
                },
                zoom: function(e){
                    e.detail.originalEvent;
                    if(e.detail.oldRatio>0.8){
                        if (e.detail.ratio > e.detail.oldRatio) {
                            e.preventDefault(); // Prevent zoom in
                        }
                    }
                    
                }
            };
            $info.show();
            $info.html("建议尺寸：800*800或以上 最低尺寸300*300");
            $upcoverBtn.find('input').attr('accept','image/x-png,image/jpeg,image/jpg');
            $('#resetUploadImg').attr('accept','image/x-png,image/jpeg,image/jpg');
            $upcoverBtn.on("change", "input", function (e) {
                var file = this.files[0];
                if(file != undefined){
                    if(file.size > 10*1024*1024){
                        common.alertTost("图片大小不超过10M","error");
                        return false;
                    }
                    if (cropper && cropper.getCroppedCanvas()) {
                        lastCoverData = cropper
                            .getCroppedCanvas()
                            .toDataURL("image/png");
                        window.lastCoverData = lastCoverData;
                        cropper.destroy();
                    }else{
                        var theRequest = common.GetRequest();   
                        if(theRequest.c==('edit_add'||'edit_jc')){
                            lastCoverData = $('.img-preview img').attr('src');
                            window.lastCoverData = lastCoverData;
                        }
                    }
                    
                    if (file.type != 'image/png' && file.type != 'image/jpeg'){
                        common.alertTost("请上传jpg/png格式文件","error");
                        return false;
                    }
                    var uploadedImageURL = URL.createObjectURL(file);
                    $("#cropperImg").attr("src", uploadedImageURL);
                    cropper = new Cropper(image, options);
                } 
            });
            $('#resetUploadImg').on('click',function(e){
                $upcoverBtn.find('input').trigger('click');
            })
        },
        readUploadImg :function(e,callback){
            var file = e.target.files[0];
            var readfile= new FileReader();
            readfile.readAsDataURL(file);
            readfile.onload = function(){
                var img = new Image();
                img.src = this.result;
                img.onload = function(){
                    var scale = true;
                    if(this.naturalWidth * this.naturalHeight < 40000){
                        scale = false;
                    } 
                    callback($(this).attr('src'),scale);
                } 
            }
        },
        uploadImg: function () {
            if (cropper && cropper.getCroppedCanvas()) {
                var baseData = cropper
                    .getCroppedCanvas()
                    .toDataURL("image/png");
                common.setUploadData(baseData);
            } else {
                var baseData = $(".img-preview img").attr("src");
                common.setUploadData(baseData);
            }
        },

        setUploadData: function (baseData) {
            var form = new FormData();
            form.append("pic", baseData);
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "/index.php?m=attachment&c=attachments&a=upload_thumb",
                data: form,
                processData: false,
                contentType: false,
		        async: false,
                beforeSend:function(XMLHttpRequest){
                    //XMLHttpRequest.setRequestHeader("Accept", "application/vnd.xinmanhua.v1+json");
                },
                success: function (data) {
                    if(data.error == 0){
                        $("#cover_Img_Src").val(data.msg);
                    }else{
                        common.alertTost('上传失败','error')
                    }
                }
            });
        },

        priceKeyup: function () { //价格输入仅支持数字
            $(".input-price").keyup(function () {
                var val = $(this).val();
                val = val.replace(/[^\d]/g, "");
                $(this).val(val);
            });
        },

        TextBox: function (id, maxlength) {
            var inputBox = $(id);
            var len, num;
            inputBox.bind("input propertychange", function () {
                len = inputBox.val().length;
                num = maxlength - len;
                inputBox.next(".txtInput-info").html(len + "/" + maxlength);
            });
            if(inputBox.val().length>0){    //编辑页默认渲染
                len = inputBox.val().length;
                num = maxlength - len;
                inputBox.next(".txtInput-info").html(len + "/" + maxlength);
            }
        },

        PropertyLinkage: function () {
            $("#course_Type").change(function () {
                // 内容属性二级联动
                var catid = $(this).val();
                $.ajax({
                    type: "get",
                    url: "index.php?m=common&c=index&a=getchildAjaxAdd&catid=" + catid,
                    success: function (selectHtml) {
                        if ($("#course_Type_Sec").children().length > 0) {
                            $("#course_Type_Sec").html("");
                        }
                        $("#course_Type_Sec").append(selectHtml);
                        if (selectHtml == "") {
                            $("#course_Type_Sec").hide();
                        } else {
                            $("#course_Type_Sec").show();
                        }
                    }
                });
            });
        },
        tagboxInit: function (maxtag) {
            var tagBox = $("#tags");
            var num = 0;
            tagBox.next(".txtInput-info").hide();
            common.addTagbox(maxtag);
            common.deltag(maxtag);
            common.selectTag(maxtag);
        },
        addTagbox: function (maxtag) {
            var addTag = $(".input_content");
            var addTagInit = $('.input_tags');
            if(addTagInit.val()){
                var initTags = addTagInit.val();
                var initTag = initTags.split('，');
                $.each(initTag,function(i,val){
                    addTag.before(
                        "<span>" + val + "<em>×</em></span>"
                    );
                })
            }
            addTag.on("keypress", function (event) {
                var slections = $("#tags")
                    .find("span")
                    .text();
                var selection = slections.split("×");
                var num = maxtag - selection.length;
                if (addTag.val()) {
                    var addval = addTag.val().trim();
                    var reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
                    if(addval.match(reg)) {
                        addval = addval.replace(reg, '');
                        addTag.val(addval);
                    }
                    if (event.keyCode == 13 || event.keyCode == 32) {
                        if (addval.length > 30 || addval.length < 2) {
                            common.alertTost("标签字数在2~30之间!", "error");
                        } else if (selection.indexOf(addval) > -1) {
                            common.alertTost("不可重复创建标签", "error");
                        } else if (num < 0) {
                            return false;
                        } else {
                            addTag.before(
                                "<span>" + addval + "<em>×</em></span>"
                            );
                            $("#input_tags").val(tags + "," + addval);
                            addTag.val("");
                        }
                    }
                }
                if (event.keyCode == 8) {
                    var last_span = $("#tags span")
                        .last()
                        .text()
                        .split("×");
                    var last_tag = last_span[0];
                    console.log(1);
                    for (var i = 0; i < lis.length; i++) {
                        if (lis[i].innerHTML == last_tag) {
                            lis.eq(i).removeClass("tag-chosen");
                        }
                    }
                    $("#tags span")
                        .last()
                        .remove();
                }
            });
        },
        deltag: function (maxtag) {
            var tagBox = $("#tags");
            var lis = $("#tag_provide").find("li");
            tagBox.on("click", "em", function () {
                var del_spans = $(this)
                    .parents("span")
                    .text()
                    .split("×");
                var del_span = del_spans[0];
                for (var i = 0; i < lis.length; i++) {
                    if (lis[i].innerHTML == del_span) {
                        lis.eq(i).removeClass("tag-chosen");
                    }
                }
                $(this)
                    .parents("span")
                    .remove();
            });
        },
        selectTag: function (maxtag) {
            var tagBox = $("#tags");
            var addTag = $("#tags input:first");
            var slections = $("#tags")
                .find("span")
                .text();
            var selection = slections.split("×");
            $("#tag_provide li").on("click", function () {
                var slections = $("#tags")
                    .find("span")
                    .text();
                var selection = slections.split("×");
                var num = maxtag - selection.length;
                var tag_selected = $(this).text();
                if ($(this).hasClass("tag-chosen")) {
                    $(this).removeClass("tag-chosen");
                    var del_index = selection.indexOf(tag_selected);
                    tagBox
                        .find("span")
                        .eq(del_index)
                        .remove();
                } else if (num < 0) {
                    return false;
                } else {
                    $(this).addClass("tag-chosen");
                    var addval = $(this).text();
                    addTag.before("<span>" + addval + "<em>×</em></span>");
                }
            });
        },
        // tagAges: function (maxtag) {
        //     var tagBox = $("#tags");
        //     var slections = $("#tags")
        //         .find("span")
        //         .text();
        //     var selection = slections.split("×");
        //     var num = selection.length - 1;
        //     tagBox.next(".txtInput-info").html(num + "/" + maxtag);
        // },
        getSign: function () {
            var str = "";
            $("#tags span").each(function (index, item) {
                var tagText = $(item).text().split('×');
                str +=  tagText;
            });
            str = str.slice(0, str.length - 1);
            return str;
        },

        //在点击确定后，根据界面上的图片属性构造content的value
        fillContent: function () {
            $("#content").val(""); //content清空
            var content = ""; //根据imgWrap来组织content
            var imgList = [];

            $(".wrapItem .imgWrap img").each(function (i) {
                if ( $(this).attr('data-src')){
                    var imgsrc = $(this).attr('data-src');
                    imgList.push(imgsrc + '<hr />')
                }else{
                    var imgEle = $(this)[0];
                    var tmpNode = document.createElement( "div" );
                    tmpNode.appendChild(imgEle)
                    imgList.push(tmpNode.innerHTML+'<hr />')
                }
            });
            imgList = imgList.join('');

            $("#content").val(imgList);
        },
        // 上传前检验
        checkEditor: function (checkFormFlag) {
            //富文本
            var arr = [];
            arr.push(UE.getEditor('editor').getContent());
            // var arr = editor.txt.html();
            // arr = arr.trim();
            if (arr == "") {
            // if(arr.join("\n") == ''){
                if ($("#richText_box .warning-info").length < 1) {
                    $("#richText_box .title-box").append(warning_info);
                }
                $("body,html").animate({
                        scrollTop: $("#richText_box").offset().top - 150
                    },
                    500
                );
                checkFormFlag = false;
            } else {
                checkFormFlag = true;
            }
            return checkFormFlag;
        },
        checkImg: function (checkFormFlag) {
            if ($(".queueList li").length == 1) {
                if ($("#mulImage_box").find($warnInfo).length < 1) {
                    $("#mulImage_box .title-box").append(warning_info);
                }
                $("body,html").animate({
                        scrollTop: $("#mulImage_box").offset().top - 150
                    },
                    500
                );
                checkFormFlag = false;
            } else {
                //图片
                var ele = $(".progress");
                for (var i = 0; i < ele.length; i++) {
                    if (ele[i].style.display != "none") {
                        common.alertTost("图片未上传完成", "error");
                        if ($("#mulImage_box").find($warnInfo).length < 1) {
                            $("#mulImage_box .title-box").append(warning_info);
                        }
                        $("body,html").animate({
                                scrollTop: $("#mulImage_box").offset().top - 150
                            },
                            500
                        );
                        checkFormFlag = false;
                    } else {
                        checkFormFlag = true;
                    }
                }
                if ($(".upload-error").length > 0){
                    common.alertTost("有上传失败的图片，无法上传", "error");
                    if ($("#mulImage_box").find($warnInfo).length < 1) {
                        $("#mulImage_box .title-box").append(warning_info);
                    }
                    $("body,html").animate({
                            scrollTop: $("#mulImage_box").offset().top - 150
                        },
                        500
                    );
                    checkFormFlag = false;
                } else {
                    checkFormFlag = true;
                }
            }
            if (checkFormFlag == true) {
                $("#mulImage_box .title-box")
                    .find(".warning-info")
                    .remove();
            }
            return checkFormFlag;
        },
        checkCover: function (checkFormFlag) {
            var str = $(".img-preview img").attr("src"); //封面
            if (str != undefined) {
                checkFormFlag = true;
            } else {
                if ($("#upCover_box").find($warnInfo).length < 1) {
                    $("#upCover_box .title-box").append(warning_info);
                }
                $("body,html").animate({
                        scrollTop: $("#upCover_box").offset().top - 150
                    },
                    500
                );
                checkFormFlag = false;
            }
            if (checkFormFlag == true) {
                $("#upCover_box .title-box")
                    .find(".warning-info")
                    .remove();
            }
            return checkFormFlag;
        },
        checkTitle: function (checkFormFlag) {
            var title = $("#upload_title"); //标题
            var title_len = title.val().trim().length;
            if (title_len < 2 || title_len > 30) {
                common.alertTost('请填写标题字数在2~30字之间','error');
                $("#upload_title").addClass("warnBorder");
                $("#upload_title")
                    .siblings("span")
                    .css({
                        color: "#ef4849"
                    });
                $("body,html").animate({
                        scrollTop: $("#upload_title").offset().top - 150
                    },
                    500
                );
                title.focus();
                checkFormFlag = false;
            } else {
                $("#upload_title").removeClass("warnBorder");
                $("#upload_title")
                    .siblings("span")
                    .css({
                        color: "#7d7d7d"
                    });
                checkFormFlag = true;
            }
            return checkFormFlag;
        },
        checkType: function (checkFormFlag) {
            var catid = $("#catid").val(); //属性
            var type = $("#course_Type");
            type.removeClass("warnBorder");
            if (type.val() == "0") {
                type.css({
                    border: "1px solid #ef4849"
                });
                $("body,html").animate({
                        scrollTop: $(".upload-type").offset().top - 150
                    },
                    500
                );
                type.focus();
                checkFormFlag = false;
            } else {
                type.css({
                    border: "1px solid #cccccc"
                });
                if (
                    $("#course_Type_Sec").css("display") != "none" &&
                    $("#course_Type_Sec").val() == "0"
                ) {
                    $("#course_Type_Sec").css({
                        border: "1px solid #ef4849"
                    });
                    $("body,html").animate({
                            scrollTop: $(".upload-type").offset().top - 150
                        },
                        500
                    );
                    $("#course_Type_Sec").focus();
                    checkFormFlag = false;
                } else {
                    $("#course_Type_Sec").css({
                        border: "1px solid #cccccc"
                    });
                    checkFormFlag = true;
                }
            }
            return checkFormFlag;
        },
        checkTag: function (checkFormFlag) {
            var title_len = $(".tagInput-box").find("span").length; //标签
            var tag = $(".input_content");
            var tagText = tag.val().replace(/\s+/g,'');
            if (title_len < 1 || tagText != '') {
                $("#tags").addClass("warnBorder");
                if (tagText != ''){
                    $('#tags .tag-txtInput-info').show();
                }
                tag.focus();
                $("body,html").animate({
                        scrollTop: $("#tags").offset().top - 150
                    },
                    500
                );
                checkFormFlag = false;
            } else {
                $('#tags .tag-txtInput-info').hide();
                $("#tags").removeClass("warnBorder");
                checkFormFlag = true;
            }
            return checkFormFlag;
        },
        checkDescribe: function (checkFormFlag) {
            var desc = $("#describe_inp"); //简介
            var desc_len = desc.val().trim().length;
            if (desc_len < 1 || desc_len > 280) {
                $("#describe_inp").addClass("warnBorder");
                $("#describe_inp")
                    .siblings("span")
                    .css({
                        color: "#ef4849"
                    });
                desc.focus();
                $("body,html").animate({
                        scrollTop: $("#describe_inp").offset().top - 150
                    },
                    500
                );
                checkFormFlag = false;
            } else {
                $("#describe_inp").removeClass("warnBorder");
                $("#describe_inp")
                    .siblings("span")
                    .css({
                        color: "#7d7d7d"
                    });
                checkFormFlag = true;
            }
            return checkFormFlag;
        },
        shareWorks: function (type) {
            //分享链接到微博或qq qzone
            var getUploadid_url;
            if(type=="tutorial"){
                getUploadid_url = "index.php?m=course&c=add&a=getUploadidByUserid";
            }else{
                getUploadid_url = "index.php?m=" + type + "&c=add&a=getUploadidByUserid";
            }
            $.ajax({
                type: "post",
                url: getUploadid_url,
                dataType: "json",
                success: function (dataJson) {
                    var shareContent;
                    if (dataJson.error == 0) {
                        var upload_work_url = dataJson.url;

                        if (type == 'course') { //课程
                            shareContent =
                                "#优动漫安利# 安利一个很棒的平台啊，里面有超多绘画技巧和黑科技分享的！快来优动漫平台学习吧！>>>" +
                                upload_work_url +
                                "优动漫动漫创作支援平台，提供正版绘画工具、在线课程、素材下载、在线练习等多种服务。（@优动漫 ）";
                        } else if (type == 'material') {    //素材
                            shareContent =
                                "#优动漫安利# 我在优动漫平台上传了一个自制的素材！非常好用，需要的小伙伴快来这里下载吧！>>>" +
                                upload_work_url +
                                "优动漫动漫创作支援平台，提供正版绘画工具、在线课程、素材下载、在线练习等多种服务。（@优动漫 ）";
                        } else if (type == 'tutorial') {    //教程
                            shareContent =
                                "#优动漫安利# 我在优动漫平台分享了自制的绘画教程！欢迎大家一起来优动漫平台交流学习画技吧！>>>" +
                                upload_work_url +
                                "优动漫动漫创作支援平台，提供正版绘画工具、在线课程、素材下载、在线练习等多种服务。（@优动漫 ）";
                        } else if (type == 'works') {   //作品
                            shareContent =
                                "#优动漫安利# 我在优动漫平台分享了自己的绘画作品！快一起来分享自己的作品吧！>>>" +
                                upload_work_url +
                                "优动漫动漫创作支援平台，提供正版绘画工具、在线课程、素材下载、在线练习等多种服务。（@优动漫 ）";
                        }else if(type == 'practice'){   //练习
                            shareContent =
                                "#优动漫安利# 安利一个很棒的平台啊，里面有超多绘画技巧和黑科技分享的！快来优动漫平台学习吧！>>>" +
                                upload_work_url +
                                "优动漫动漫创作支援平台，提供正版绘画工具、在线课程、素材下载、在线练习等多种服务。（@优动漫 ）";
                        }

                        var options = {
                            element: $("#jiathis_button_tsina"),
                            name: "tsina",
                            config: {
                                tsina: {
                                    title: shareContent,
                                    content: shareContent,
                                    img: ""
                                }
                            },
                            buttonSelector: "#share_weibo_text_id"
                        };
                        var qqOptions = {
                            element: $("#jiathis_button_qzone"),
                            name: "qzone",
                            config: {
                                qzone: {
                                    url: upload_work_url,
                                    title: shareContent,
                                    content: shareContent,
                                    img: ""
                                }
                            },
                            buttonSelector: ".share-qqzone"
                        };
                        share(options);
                        share(qqOptions);
                        common.publicContiner();
                        $("#submit_url").val(dataJson.url);
                        $("#upload_Success_Model").show();
                    } else {
                        common.alertTost("请先登录", "error");
                        common.ncReset(nc);
                    }
                },
                error: function () {
                    common.alertTost("提交失败", "error");
                    common.ncReset(nc);
                }
            });
        },

        //发布按钮置灰
        publicIng: function () {
            $("#sub_Btn").attr("disabled", true);
            $("#sub_Btn").html("发布中...");
            $("#sub_Btn").css("background-color", "#c8c8c8");
        },
        //发布按钮可点击
        publicContiner: function () {
            $("#sub_Btn").attr("disabled", false);
            $("#sub_Btn").html("确认发布");
            $("#sub_Btn").css("background-color", "#02b0e9");
        },

        //同意上传守则
        agreeContent: function (agreeFlag) {
            var element = $(".upload-model-text .selectd-box");
            if (agreeFlag == false) {
                agreeFlag = true;
                $(element).addClass("seld_img");
                $(element).css("border", "1px solid #02b0e9");
            } else {
                agreeFlag = false;
                $(element).removeClass("seld_img");
                $(element).css("border", "1px solid #c8c8c8");
            }
            return agreeFlag;
        },

        closeModel: function () {
            //继续发布
            $("#add_pub_Continue_Btn").click(function(){
                location.reload()
            })
            // 编辑页继续发布
            $("#pub_Continue_Btn").click(function(){
                var theRequest = common.GetRequest(); 
                var locationURL; 
                if(theRequest.m == 'course' && theRequest.c=='edit_jc'){ //教程
                    locationURL ="index.php?m=course&c=add_jc";
                }else{
                    locationURL ="index.php?m="+theRequest.m+"&c=add";
                }
                window.location.href = locationURL;
            })
            //关闭
            $("#upload_Close_Suc_Btn").click(function(){
                var theRequest = common.GetRequest();  
                var locationURL; 
                if(theRequest.m == 'works'){
                    locationURL ="index.php?m=member&c=personal&a=myupload";
                }else if(theRequest.m == 'material'){
                    locationURL ="index.php?m=member&c=personal&a=myupload&ctype=4";
                }else if(( theRequest.m == 'course'&&theRequest.c=='add_jc' )||(theRequest.m == 'course' && theRequest.c=='edit_jc')){ //教程
                    locationURL ="index.php?m=member&c=personal&a=myupload&ctype=1";
                }else if((theRequest.m == 'course' && theRequest.c=='add')||(theRequest.m == 'course'&&theRequest.c=='edit_add')){ //课程
                    locationURL ="index.php?m=member&c=personal&a=myupload&ctype=2";
                }else if(theRequest.m == 'practice'){
                    locationURL ="index.php?m=member&c=personal&a=myupload&ctype=5";
                }
                window.location.href = locationURL;
            })
            //立即查看
            $("#pub_Preview_Btn").click(function(){
                $(document).unbind("scroll.unable");
                $("#upload_Success_Model").hide()
                window.location.href=$("#submit_url").val();
            })
        },

        ncInit: function () {
            var appkey = "FFFF0N00000000007E6D";
            var scene = "nc_register";
            var nc_token = [appkey, new Date().getTime(), Math.random()].join(
                ":"
            );
            var dd, csessionid, sig;
            var NC_Opt = {
                renderTo: "#nc",
                appkey: appkey,
                scene: scene,
                token: nc_token,
                customWidth: 280,
                is_Opt: 0,
                language: "cn",
                isEnabled: true,
                timeout: 3000,
                times: 5,
                bannerHidden: false,
                initHidden: false,
                callback: function (data) {
                    window.ncData = data;
                }
            };
            var nc = new noCaptcha(NC_Opt);
            nc.upLang("cn", {
                _startTEXT: "拖动滑块，完成发布",
                _yesTEXT: "验证通过",
                _error300: '哎呀，出错了，单击<a href="javascript:__nc.reset()">刷新</a>再来一次',
                _errorNetwork: '网络不给力，请<a href="javascript:__nc.reset()">单击刷新</a>'
            });
            nc.on("fail", function (e) {
                console.log("验证失败");
                nc.show();
            });
            return nc;
        },
        ncReset: function (nc) {
            common.publicContiner();
            $("#sub_Btn").show();
            $("#nc").hide();
            nc.reset();
        },

        GetRequest:function(){
            var url = location.search; //获取url中"?"符后的字串  
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
            }
            return theRequest;
        },
    };

    return common;
});