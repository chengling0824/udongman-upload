requirejs(['../commonConfig'],function(com){
    requirejs(['jquery','fontProductCommonJs'],function($,common){
        var checkIslogin = function(callback){
            $.ajax({
                type:'get',
                dataType: 'json',
                url:'index.php?m=common&c=index&a=check_islogin_ajax',
                success:function(res){
                    if (res.error != 0){
                        OpenPop("#login_pop_win");
                    }else{
                        callback();
                    }
                }
            })
        }

        window.onresize = function () {
            $('.wrap .font-order-result').css('height',$(window).height() - 250 + 'px');
        };

        $(function(){
            $('.wrap .font-order-result').css('height',$(window).height() - 250 + 'px');
            $('#downloadFont').click(function(){
                var order_sn = $(this).attr('order_sn');
                $.ajax({
                    type: 'post',
                    url: '/index.php?m=font_product&c=common&a=download',
                    data: {order_sn:order_sn},
                    dataType: 'json',
                    success: function(res){
                        if (res.code == 0){
                            window.open(res.url);
                        }else if (res.code == 1){
                            OpenPop("#login_pop_win");
                        }else{
                            common.alertTost('字体文件下载失败');
                        }
                    }
                })
            });
            $('#downloadAuthorBook').click(function(){
                checkIslogin(function(){
                    document.getElementById('iframe').contentWindow.postMessage('download','*');
                });
            });
        })
    });
});