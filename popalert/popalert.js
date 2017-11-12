(function($){
 var popWindow = function cW(obj){
 		//若传入参数不为object类型则提示参数类型错误
 		if(obj && typeof obj!=='object'){
 			console.log('Wrong type of argument, which should be of object!');
 			return;
 		}
 		var $popWindow = $('<div class="pop-window fade"></div>'),
 				$popContainer = $('<div class="pop-container"></div>'),
 				html = '<div class="pop-header">'
								+'<h1 class="pop-window-title">Hello</h1>'
								+'<i class="fa fa-window-close-o" aria-hidden="true"></i>'
							+'</div>'
							+'<div class="pop-content">此处可添加HTML片段'
							+'</div>'
							+'<div class="pop-footer clearfix">'
								+'<button class="pop-cancel right">取消</button>'
								+'<button class="pop-sure right">确定</button>'
							+'</div>';
		$popContainer.append(html);
		// console.log($popContainer.height());
		html = null;
		
		// console.log($popContainer.children('#pop-content'));
		var $popTitle = $popContainer.children().children('.pop-window-title'),
				$close = $popTitle.next(),
				$popContent = $popContainer.children('.pop-content'),
				$sure = $popContainer.find('.pop-sure'),
				$cancel = $popContainer.find('.pop-cancel'),
				closeWindow = function(){
					$popWindow.removeClass('fadeIn').removeClass('locker').addClass('fadeOut').children().removeClass('pop-up');
					$(window.event.target).blur();
				},
				posWindow = function(){
					$popContainer.css({
						'margin-left': -$popContainer.outerWidth() / 2 + 'px',
						'margin-top': -$popContainer.outerHeight() / 2 + 'px'
					});					
					posWindow = null;
				};
		// 给控件按钮绑定基本事件
		$close.on('click',closeWindow);
		$sure.on('click',closeWindow);
		$cancel.on('click',closeWindow);
		$(document).off('keyup').on('keyup',function(e){
			if($popWindow.css('display')==='none'){
				return ;
			}
			switch(e.keyCode){
				case 27: 
					$close.trigger('click');
					break;
				case 13:
					$sure.trigger('click');
					break;
			}
		});
		// 若传入参数
		if(obj){
			obj.title ? $popTitle.text(obj.title) : null;
			obj.lock ? $popWindow.addClass('locker') : null;
			obj.onclose ? $close.on('click',obj.onclose) : null;
			obj.onsure ? $sure.on('click',obj.onsure) : null;
			obj.oncancel ? $cancel.on('click',obj.oncancel) : null;//console.log($popContainer.outerWidth())
			obj.funcs ? $popContent.html(obj.funcs) : null;
			$(document.body).append($popWindow.append($popContainer));//console.log($popContainer.outerWidth())
			obj.position ? obj.position === 'center' ? posWindow() : $popContainer.css({
				top: obj.position[0] + 'px',
				left: obj.position[1] + 'px',
			}) : posWindow();
		}else{
			$(document.body).append($popWindow.append($popContainer));
			posWindow();
		}//console.log(this)
		// 若调用方式为元素触发事件生成弹窗
			this.on('click',function(){
				$popWindow.removeClass('fadeOut').addClass('locker fadeIn').children().addClass('pop-up');
			});

		obj = null;//console.log(obj);
 }
 // 将popWindow扩展至jQuery上
 $.fn.extend({popWindow:popWindow});
 popWindow = null;
}($))

/* 弹窗HTML构成
<div id="pop-window" class="locker">
	<div id="pop-container">
		<div class="pop-header">
			<h1 id="pop-window-title">Hello</h1>
			<i class="fa fa-window-close-o" aria-hidden="true"></i>
		</div>			
		<div id="pop-content">
		</div>
		<div class="pop-footer clearfix">
			<button class="pop-sure right">确定</button>
			<button class="pop-cancel right">取消</button>
		</div>
	</div>
</div>
 */