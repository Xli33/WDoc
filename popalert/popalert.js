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
		console.log($popWindow)
		// console.log($popContainer.children('#pop-content'));
		var $popTitle = $popContainer.children().children('.pop-window-title'),
				$close = $popTitle.next(),
				$popContent = $popContainer.children('.pop-content'),
				$sure = $popContainer.find('.pop-sure'),
				$cancel = $popContainer.find('.pop-cancel'),
				closeWindow = function(){
					$popWindow.removeClass('fadeIn').addClass('fadeOut').children().removeClass('pop-up');
					setTimeout(function () {
                        $popWindow.removeClass('locker');
                    },600);
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
	 return this;
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

(function($){
    'use strict';

    $.fn.helpOut = function(obj) {
        if (typeof obj !== 'object') return;

        var that = this;

        function CreateHelper() {
            this.o = obj;
            this.help = that;
            that = null;
        }

        CreateHelper.prototype = {
            constructor: CreateHelper,

            dropHelper: function () {
                var $select = $('<select class="select2_group form-control" name="' + this.o.name + '" ' + (this.o.multiple ? 'multiple' : null) + ' id="' + this.o.id + '" tabindex="-1" style="display: none;"></select>'),
                    that = this;

                this.help.append($select);

                $.get(this.o.url, function (data) {
                    var i, k, options, list = data.list;
                    for (i = 0, k = list.length; i < k; i++) {
                        options += '<option value=' + list[i].code + '>' + list[i].descript + '</option>'
                    }
                    $select.append(options).select2({
                        placeholder: that.o.placeholder,
                        width: that.o.width,
                        dropdownAutoWidth: that.o.autoWidth,
                        maximumSelectionLength: that.o.maxItem,
                        /*ajax: {
                        url: "https://api.github.com/search/repositories",
                        data: function (params) {
                          var query = {
                            search: params.term,
                            type: 'public'
                          }
                          console.log(params)
                          console.log(query)
                          // Query parameters will be ?search=[term]&type=public
                          return query;
                          },
                            processResults: function (data, params) {console.log(data);console.log(params)
                              params.page = params.page || 1;
                              return {
                                results: data.list,
                                pagination: {
                                    more: (params.page * 10) < data.count_filtered
                                }
                              };
                            }
                      }*/
                        /*templateResult: function(){
                            return $('<input type="checkbox" />'+options)
                        },*/
                        closeOnSelect: that.o.multiple ? false : true
                    });
                    that.o.change ? $select.on('change', function (e) {
                        console.log(e)
                    }) : null;
                    i = k = options = list = data = null;
                    $select = null;
                });
            },
            winHelper: function () {
                var $popWindow = $('<div class="pop-window fade" style="display:none"></div>'),
                    $popContainer = $('<div class="pop-container"></div>'),
                    html = '<div class="pop-header">'
                        + '<h1 class="pop-window-title">Hello</h1>'
                        + '<i class="fa fa-window-close-o" aria-hidden="true"></i>'
                        + '</div>'
                        + '<div class="pop-content">此处可添加HTML片段'
                        + '</div>'
                        + '<div class="pop-footer clearfix">'
                        + '<button class="pop-cancel right">取消</button>'
                        + '<button class="pop-sure right">确定</button>'
                        + '</div>';
                $popContainer.append(html);
                html = null;
                // console.log($popContainer.children('#pop-content'));
                var $popTitle = $popContainer.children().children('.pop-window-title'),
                    $close = $popTitle.next(),
                    $popContent = $popContainer.children('.pop-content'),
                    $sure = $popContainer.find('.pop-sure'),
                    $cancel = $popContainer.find('.pop-cancel'),
                    posWindow = function () {
                        $popContainer.css({
                            'margin-left': -$popContainer.outerWidth() / 2 + 'px',
                            'margin-top': -$popContainer.outerHeight() / 2 + 'px'
                        });
                        posWindow = null;
                    };
                // 给控件按钮绑定基本事件
                $close.on('click', this.closeWindow($popWindow));
                $sure.on('click', this.closeWindow($popWindow));
                $cancel.on('click', this.closeWindow($popWindow));
                $(document).off('keyup').on('keyup', function (e) {
                    if ($popWindow.width() === 0) {
                        return;
                    }
                    switch (e.keyCode) {
                        case 27:
                            $close.trigger('click');
                            break;
                        case 13:
                            $sure.trigger('click');
                            break;
                    }
                });
                // 若传入参数
                if (this.o) {
                    this.o.title ? $popTitle.text(this.o.title) : null;
                    this.o.onclose ? $close.on('click', this.o.onclose) : null;
                    this.o.onsure ? $sure.on('click', this.o.onsure) : null;
                    this.o.oncancel ? $cancel.on('click', this.o.oncancel) : null;//console.log($popContainer.outerWidth())
                    this.o.funcs ? $popContent.html(this.o.funcs) : null;
                    $(document.body).append($popWindow.append($popContainer));//console.log($popContainer.outerWidth())
                }
                posWindow();
                this.on('click', function () {
                    $popWindow.removeClass('fadeOut').addClass('locker fadeIn').children().addClass('pop-up');
                });
                $popContainer = $popTitle = $close = $popContent = $sure = $cancel = null;
            },
            closeWindow: function ($el) {
                $el.removeClass('fadeIn').addClass('fadeOut').children().removeClass('pop-up');
                setTimeout(function () {
                    $el.removeClass('locker');
                }, 600);
                $(window.event.target).blur();
            }
        };


        var createHelper = new CreateHelper();
        if (obj.type === 'dropdown') {
            createHelper.dropHelper();
            return this;
        }
        if (obj.type === 'winpop') {
            createHelper.winHelper();
            return this;
        }
    }

    }(jQuery))

$.ajax({
	method: 'get',
	url: 'http://192.168.1.135:8089/ipmsaccount/sysHelpTask/getdata?code=PROVICE',
	dataType: 'json',
	success: function (d) {
		console.log(d.responseText);
    }
});