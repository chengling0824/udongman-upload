// alert
(function($){
	$.UdmAlert = function(popHtml, type, options) {
	    var btnType = $.UdmAlert.btnEnum;
		var eventType = $.UdmAlert.eventEnum;
		var popType = {
			info: {
				title: "信息",
                btn: btnType.ok,
                btnClass: 'btn default'
			},
			success: {
				title: "成功",
				icon: "",//绿色对勾
                btn: btnType.ok,
                btnClass: 'btn default'
			},
			error: {
				title: "错误",
				icon: "",//红色叉
                btn: btnType.ok,
                btnClass: 'btn default'
			},
			confirm: {
				title: "提示",
				icon: "",//黄色问号
                btn: btnType.okcancel,
                btnClass: 'btn default'
			},
			warning: {
				title: "警告",
				icon: "",//黄色叹号
                btn: btnType.okcancel,
                btnClass: 'btn default'
			},
			input: {
				title: "输入",
				icon: "",
                btn: btnType.ok,
                btnClass: 'btn default'
			},
			custom: {
				title: "",
				icon: "",
                btn: btnType.ok,
                btnClass: 'btn default'
			}
		};
		var itype = type ? type instanceof Object ? type : popType[type] || {} : {};//格式化输入的参数:弹窗类型
		var config = $.extend(true, {
			title: "", //自定义的标题
			icon: "", //图标
			btn: btnType.ok, //按钮,默认单按钮
			onOk: $.noop,//点击确定的按钮回调
			onCancel: $.noop,//点击取消的按钮回调
			onClose: $.noop//弹窗关闭的回调,返回触发事件
		}, itype, options);
		
        var $txt = $("<p>").html(popHtml);//弹窗文本dom
        var $assistTxt = $("<p>").html(config.assistText || '');//辅助信息文本文本dom
		var $tt = $("<span>").text(config.title);//标题
		var icon = config.icon;
		var $icon = icon ? $("<div>").addClass("bigIcon").css("backgroundPosition",icon) : "";
		var btn = config.btn;//按钮组生成参数
		
		var popId = creatPopId();//弹窗索引
		
		var $box = $("<div>").addClass("message-box-wrap");//弹窗插件容器
		var $layer = $("<div>").addClass("message-mask");//遮罩层
		var $popBox = $("<div>").addClass("message-box");//弹窗盒子
		var $ttBox = $("<div>").addClass("message-box-tit");//弹窗顶部区域
		var $txtBox = $("<div>").addClass("message-box-content");//弹窗内容主体区
		var $btnArea = $("<div>").addClass("message-box-btn");//按钮区域
        var $assistInfo = $("<div>").addClass("message-box-assist");//按钮下辅助信息区
        
		var $ok = $("<a>").addClass(config.btnClass).addClass("ok").text(config.btnText);//确定按钮
		var $cancel = $("<a>").addClass(config.btnCancelClass).addClass("cancel").text("取消");//取消按钮
		var $input = $("<input>").addClass("inputBox");//输入框
		var $clsBtn = $("<a>").addClass("message-box-close");//关闭按钮
		
		//建立按钮映射关系
		var btns = {
			ok: $ok,
			cancel: $cancel
		};
		
		init();
		
		function init(){
			//处理特殊类型input
			if(popType["input"] === itype){
				$txt.append($input);
			}
			
			creatDom();
			bind();
		}
		
		function creatDom(){
			$popBox.append(
				$ttBox.append(
					$clsBtn
				).append(
					$tt
				)
			).append(
				$txtBox.append($icon).append($txt)
			).append(
				$btnArea.append(creatBtnGroup(btn))
			).append(
                $assistInfo.append($assistTxt)
            );
			$box.attr("id", popId).append($layer).append($popBox);
			$("body").append($box);
		}
		
		function bind(){
			//点击确认按钮
			$ok.click(doOk);
			
			//回车键触发确认按钮事件
			$(window).bind("keydown", function(e){
				if(e.keyCode == 13) {
					if($("#" + popId).length == 1){
						doOk();
					}
				}
			});
			
			//点击取消按钮
			$cancel.click(doCancel);
			
			//点击关闭按钮
			$clsBtn.click(doClose);
		}

		//确认按钮事件
		function doOk(){
            var $o = $(this);
            var len = $("#" + popId + " input").length;
            if ( len > 0){
                var v = $.trim($("#" + popId + " input").val());
                config.onOk(v,popId); 
            }else{
		        config.onOk();
                $("#" + popId).remove(); 
                config.onClose(eventType.ok);
            }
		}
		
		//取消按钮事件
		function doCancel(){
			var $o = $(this);
			config.onCancel();
			$("#" + popId).remove(); 
			config.onClose(eventType.cancel);
		}
		
		//关闭按钮事件
		function doClose(){
			$("#" + popId).remove();
			config.onClose(eventType.close);
			$(window).unbind("keydown");
		}
		
		//生成按钮组
		function creatBtnGroup(tp){
			var $bgp = $("<div>").addClass("btnGroup");
			$.each(btns, function(i, n){
				if( btnType[i] == (tp & btnType[i]) ){
					$bgp.append(n);
				}
			});
			return $bgp;
		}

		//重生popId,防止id重复
		function creatPopId(){
			var i = "pop_" + (new Date()).getTime()+parseInt(Math.random()*100000);//弹窗索引
			if($("#" + i).length > 0){
				return creatPopId();
			}else{
				return i;
			}
		}
	};
	
	//按钮类型
	$.UdmAlert.btnEnum = {
		ok: parseInt("0001",2), //确定按钮
		cancel: parseInt("0010",2), //取消按钮
		okcancel: parseInt("0011",2) //确定&&取消
	};
	
	//触发事件类型
	$.UdmAlert.eventEnum = {
		ok: 1,
		cancel: 2,
		close: 3
	};
	
	//弹窗类型
	$.UdmAlert.typeEnum = {
		info: "info",
		success: "success",
		error:"error",
		confirm: "confirm",
		warning: "warning",
		input: "input",
		custom: "custom"
	};

})(jQuery);

// toast
(function($){
    "use strict";
    $.UdmToast = function(title, message, type, options){
        var defaultOptions = {
            appendTo: "body",
            stack: false,
            position_class: "toast-bottom-right",
            fullscreen:false,
            width: 250,
            spacing:20,
            timeout: 4000,
            has_close_btn:true,
            has_icon:false,
            sticky:false,
            border_radius:6,
            has_progress:false,
            rtl:false
        }

        var $element = null;

        var $options = $.extend(true, {}, defaultOptions, options);

        var spacing = $options.spacing;

        var css = {
            "position":($options.appendTo == "body") ? "fixed" : "absolute",
            "min-width":$options.width,
            "display":"none",
            "border-radius":$options.border_radius,
            "z-index":99999
        }

        $element = $('<div class="toast-item-wrapper ' + type + ' ' + $options.position_class + '"></div>');
        $('<p class="toast-title">' + title + '</p>').appendTo($element);
        $('<p class="toast-message">' + message + '</p>').appendTo($element);

        if($options.fullscreen){
            $element.addClass( "fullscreen" );
        }

        if($options.rtl){
            $element.addClass( "rtl" );
        }

        if($options.has_close_btn){
            $('<span class="toast-close">&times;</span>').appendTo($element);
            if( $options.rtl){
                css["padding-left"] = 20;
            } else {
                css["padding-right"] = 20;
            }
        }

        if($options.has_icon){
            $('<i class="toast-icon toast-icon-' + type + '"></i>').appendTo($element);
            if( $options.rtl){
                css["padding-right"] = 50;
            } else {
                css["padding-left"] = 50;
            }            
        }else{
			css["text-align"] = 'center';
		}

        if($options.has_progress && $options.timeout > 0){
            $('<div class="toast-progress"></div>').appendTo($element);
        }

        if($options.sticky){
            $options.spacing = 0;
            spacing = 0;

            switch($options.position_class){
                case "toast-top-left" : {
                    css["top"] = 0;
                    css["left"] = 0;
                    break;
                }
                case "toast-top-right" : {
                    css["top"] = 0;
                    css["left"] = 0;                    
                    break;
                }
                case "toast-top-center" : {
                    css["top"] = 0;
                    css["left"] = css["right"] = 0;  
                    css["width"] = "100%";                  
                    break;
                }
                case "toast-bottom-left" : {
                    css["bottom"] = 0;
                    css["left"] = 0;                     
                    break;
                }
                case "toast-bottom-right" : {
                    css["bottom"] = 0;
                    css["right"] = 0;                     
                    break;
                }
                case "toast-bottom-center" : {
                    css["bottom"] = 0;
                    css["left"] = css["right"] = 0;  
                    css["width"] = "100%";                     
                    break;
                }
                default : {
                    break;
                }                                                                        
            }
        }

        if($options.stack){
            if($options.position_class.indexOf("toast-top") !== -1 ){
                $($options.appendTo).find('.toast-item-wrapper').each(function(){
                    // css["top"] = parseInt($(this).css("top")) + this.offsetHeight + spacing;
                    css["top"] = parseInt($(this).css("top"));
                });
            } else if($options.position_class.indexOf("toast-bottom") !== -1 ){
                $($options.appendTo).find('.toast-item-wrapper').each(function(){
                    css["bottom"] = parseInt($(this).css("bottom")) + this.offsetHeight + spacing;
                });
            }
        }        

        $element.css(css);

        $element.appendTo($options.appendTo);

		if($element.fadeIn) {
            $element.fadeIn();
        }else {
            $alert.css({display: 'block', opacity: 1});
        }

		function removeToast(){          
			$.UdmToast.remove( $element );
		}

		if($options.timeout > 0){
			setTimeout(removeToast, $options.timeout);
            if($options.has_progress){
                $(".toast-progress", $element).animate({"width":"100%"}, $options.timeout);
            }
		}        

        $(".toast-close", $element).click(removeToast)

        return $element;
    }

    $.UdmToast.remove = function( $element ){
        "use strict";        
		if($element.fadeOut)
		{
			$element.fadeOut(function(){
				return $element.remove();
			});
		}
		else{
			$element.remove();
		}        
    }
})(jQuery);