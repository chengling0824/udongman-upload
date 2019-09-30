
requirejs(['../commonConfig'],function(com){
    requirejs(['jquery','fontProductCommonJs','statistJs'],function($,common,statist){
        var cutQrcodeDispaly = function(){
            if ($("#qrcode-ali").css('display') == 'block'){
                $("#qrcode-ali").css('display','none');
                $("#qrcode-wx").css('display','block');
            }else{
                $("#qrcode-ali").css('display','block');
                $("#qrcode-wx").css('display','none');
            }
        }

        var resetQrcode = function(purchaseId){
            $.ajax({
                url: '/index.php?m=shop&c=udm_payment&a=refresh_qrcode_ajax',
                type: 'post',
                dataType: 'json',
                data: {'order_sn': purchaseId},
                success: function(res){
                    if(res.code == 0){
                        $('#qrcode-wx').html('');
                        $('#qrcode-ali').html('');
                        createQRCode(res.url.wxpay,$('#qrcode-wx'));
                        createQRCode(res.url.alipay,$('#qrcode-ali'));
                    }
                }
            })
        }

        var setStatist = function(){
            var statistics = {
                eventid: '040601',
                eventparam: {}
            };
            var urlData = common.GetRequest();
            statistics.eventparam['fromUrl'] = window.location.href;
            statist.setStatisticsData(statistics);
        }

        $(function(){
            setStatist();
            $('.payment_lst li').click(function(){
                if ($(this).hasClass('selected')){
                    $(this).removeClass('selected');
                    $(this).siblings().addClass('selected');
                }else{
                    $(this).addClass('selected');
                    $(this).siblings().removeClass('selected');
                }
                cutQrcodeDispaly();
            })
        })
    });
});