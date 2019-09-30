requirejs(['../commonConfig'],function(com){
    requirejs(['jquery','fontProductCommonJs','statistJs'],function($,common,statist){
        var setStatist = function(){
            var statistics = {
                eventid: '040101',
                eventparam: {}
            };
            var urlData = common.GetRequest();
            statistics.eventparam['from'] =  urlData.from || '';
            statistics.eventparam['fromUrl'] = window.location.href;
            statist.setStatisticsData(statistics);
        }

        $(function(){
            var fontType = '';
            $('.font-card').each(function(index,item){
                fontType += $(item).attr('type') + ','
            });
            fontType = fontType.slice(0,fontType.length-1);
            common.resetFontContent($('#fontInput'),$('.font-s-style > p'),25, fontType);
            setStatist();
        });
        
        (function(){
            $(document).scroll(function(){
                if ($(this).scrollTop() > 60){
                    $('.font-input-box').removeClass('font-input-fixed');
                }else{
                    $('.font-input-box').addClass('font-input-fixed');
                }
            })
        })();
        
        (function(){
            var expertSay = [
                { 
                    say: '如果你是一个在意对话框字体的漫画创作者，说明你对细节的把控十分上心，而这正是真正漫画家必不可少的。',
                    job: '新漫画主编',
                    authorName: '栗原一二'
                },
                { 
                    say: '想要讲好一个故事，自然离不开文字。字体能够影响读者对于作品的第一印象。',
                    job: '新漫画主编',
                    authorName: '御木基宏'
                },
                { 
                    say: '一款优秀的标准漫画字体，必须做到1、不影响用户阅读 2、美观简洁 3、极具特色。这也是书正系列字体一直以来坚持的设计原则。',
                    job: '联合优创＆新漫画CEO',
                    authorName: '朱槿'
                }   
            ];
            var hoverTime = null;
            $('.author-img > li').hover(function(){
                clearTimeout(hoverTime);
                var index = $(this).index()
                $('.expert-say').removeClass('animatedTextIn').addClass('animatedTextOut');
                hoverTime = setTimeout(function(){
                    $('.expert-say .triangle').css({'left':(400 + index * 160) + 'px'});
                    $('.expert-say .say').html(expertSay[index].say);
                    $('.expert-say .author .job').html(expertSay[index].job);
                    $('.expert-say .author .author-name').html(expertSay[index].authorName);
                    $('.expert-say').removeClass('animatedTextOut').addClass('animatedTextIn');
                },0)
            },function(){
                clearTimeout(hoverTime);
            })
        })();
    });
})
