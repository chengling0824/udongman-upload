define(['detectJs'],function(detect){
    function tongji(data){
        var json = {} || data;
        var secound = 0;
    
        var countTime = function (){
            var countTime = setInterval(function(){
                secound++;
            },1000);
        }
        
        countTime();
    
        var statist = {
            setStatisticsData: function(jsonData){
                json = jsonData; 
                var device = detect();
                json.eventparam['staytime'] = secound;   
                var dataArr = {
                    'platform' : 'pc',
                    'system': device.platform,
                    'browser': JSON.stringify(device.browser),
                    'eventid' : json.eventid,
                    'eventparam' : json.eventparam,
                };
                $.ajax({
                    url: '/index.php?m=event&c=index&a=report',
                    type: 'post',
                    async: false,
                    data: dataArr
                });
            },
            beforeunload: function(){
                window.onbeforeunload = function(e) {   
                    json.eventparam['staytime'] = secound;
                    tongji.setStatisticsData(json);
                };
            }()
        }
    
        return statist;
    };
    
    return tongji();
});