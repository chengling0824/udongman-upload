requirejs.config({
    baseUrl: '.',
   // urlArgs : "v="+ new Date().getTime(),
    paths: {
        // 定义打包压缩的全局变量路径,js文件命名需以Js结尾
        'jquery': '../../js/jquery-1.7.2.min',
        // 'jquery': '../js/jquery-1.7.2.min',
        'fontProductCommonJs': '../../build/font_product/common/fontProductCommon',

        'uploadCommonJs':'../../js/upload_model/common/uploadCommon',
        'cropperJS':'../../js/plugins/cropper',
        'webuploaderJS':'../../js/plugins/webuploader.min',
        'multiImageJS':'../../js/upload_model/common/multiImage',
        'workUploadJS':'../../js/upload_model/common/workUpload',
        'ueditorConfigJS':'../../node_modules/ueditor/ueditor.config',
        'ueditorAllJS':'../../node_modules/ueditor/ueditor.all.min',
        'zeroclipboard':'../../node_modules/ueditor/third-party/zeroclipboard/ZeroClipboard',
        
        'shareJs': '../../build/lib/share',
        'statistJs': '../../build/lib/statist',
        'jquerySliderJs': '../../build/plugins/jquery.ui.slider',
        'baseStyleJs': '../../build/new_style/base',
        'detectJs': '../../build/lib/detect',
        'validJs': '../../build/lib/valid',
    },
    shim: {
        'ueditorAllJS': {
            //注意：此处的依赖顺序不能颠倒
            deps: ['zeroclipboard','ueditorConfigJS'],
            exports: 'UE',
            init:function(ZeroClipboard){
                //导出到全局变量，供ueditor使用
                window.ZeroClipboard = ZeroClipboard;
            }
        },
        'pluploadJS':{
            exports:'plupload',
        },

    }

});