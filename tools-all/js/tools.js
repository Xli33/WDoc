;(function(window,Object,document,$){
	'use strict';

	var Tools = function($el,options){
		this.$el = $el;
		this.o = options;
	},
	sprintf = function(str,rep){
		return str.replace('%s',rep);
	};
	
	Tools.prototype = {
		constructor: Tools,

		// create tip
		initTip: function(){
			var options = this.o;
			this.$tooltipOuter = $(['<div class="tooltip-outer">',
													  '<div class="tooltip-content"></div>',
													  '</div>',
													  ].join(''));
			options.id && this.$tooltipOuter.attr('id',options.id);
			this.$tooltipOuter.addClass(options.placement || 'bottom');
			this.$tooltipContent = this.$tooltipOuter.children('.tooltip-content');
			
			options.border && this.$tooltipContent.css('border','1px solid #333');

			/*if(options.tag){
				this.$tooltipContent.html(this.$el.html() || options.text);
				this.$tooltipBox = $(['<span class="btn btn-default tooltip-box">',
															'<span>'+options.text+'</span>',
															'</span>'].join('')).append(this.$tooltipOuter);
				this.$el[0].nodeName != 'TIP' ? this.$el.append(this.$tooltipBox) : this.$el.after(this.$tooltipBox);
			}else{*/
				this.$tooltipContent.html($.isFunction(options.html) ? options.html() : options.text || this.$el.html());
			 	this.$el.on({
			 		'mouseenter.tip': $.proxy(function(){
			 			this.$tooltipOuter.addClass('show');
			 		},this),
			 		'mouseleave.tip': $.proxy(function(){
			 			this.$tooltipOuter.removeClass('show');
			 		},this)
			 	}).append(this.$tooltipOuter).data('tip',this);
			// }
		},
		// create alert box
		initAlert: function(){
			var options = this.o;
			this.$alert = $(['<div class="alert-box">',
										'<div class="layer"></div>',
										'<div class="alert-content">',
										'<div class="alert-title">',
										'<h1>提示</h1>',
										'<i class="glyphicon glyphicon-remove"></i>',
										'</div>',
										'<div class="alert-body"></div>',
										'<div class="alert-bar">',
										'<button class="btn btn-primary confirm">确定</button> ',
										'<button class="btn btn-default cancel">取消</button>',
										'</div>',
										'</div>',
										'</div>'].join('')).data('alert',this);
			// 
			this.$alert.on({
				click: $.proxy(function(e){
					this.stopPropagation(e);
					this.hideAlert();
				},this),
				mousewheel: this.stopPropagation
			}).on('click.alert','.alert-content',$.proxy(this.stopPropagation,this))
							.on('click.alert','.alert-title>i',$.proxy(this.hideAlert,this))
							.on('click.alert','.alert-bar>.btn',$.proxy(this.hideAlert,this));
			// 
			options.title && this.$alert.find('.alert-title').children('h1').text(options.title);
			$.isFunction(options.html) && this.$alert.find('.alert-body').append(options.html()); 
			$.isFunction(options.onconfirm) && this.$alert.on('click.alert','.confirm',options.onconfirm);
			$.isFunction(options.oncancel) && this.$alert.on('click.alert','.cancel',options.oncancel);

			(this.$el[0].nodeName == 'ALERT' ? this.$el.after(this.$alert).parent() : this.$el.append(this.$alert)).on('click',$.proxy(this.showAlert,this));
		},
		hideAlert: function(){
			this.$alert.removeClass('show-up');
			$(document.body).css({overflow: 'initial',paddingRight: ''});
			/*this.$alert.removeClass('show-up').addClass('end-status').one('webkitTransitionEnd transitionend',$.proxy(function(){
				this.$alert.removeClass('end-status');
			},this));*/
		},
		showAlert: function(){
			this.$alert.addClass('show-up');
			$(document.body).css({overflow: 'hidden',paddingRight: window.innerWidth - document.body.clientWidth + 'px'})
		},
		stopPropagation: function(e){
			e.stopPropagation();
			(window.event||e.originalEvent).cancelBubble = true;
		},
		// create switch button
		initSwitch: function(){
			var options = this.o,
					$el = this.$el;
			this.ontext = options.ontext || '启用',
			this.offtext = options.offtext || '停用';
			/*if(typeof options == 'string'){
				return this.get(options);
			}*/
			var $switch = this.$switch = $(['<div class="switch-container"><div class="switch-box">',
												'<div class="switcher">',
												sprintf('<span>%s</span>',this.offtext),
												'</div>',
												'</div></div>'].join('')).on('click.switch','.switch-box:not([data-disabled])',$.proxy(this.switchToggle,this)),

				 $switchBox = this.$switchBox = this.$switch.children('.switch-box').data('switch',this);
				 
			options.square && $switchBox.addClass('square').children('.switcher').addClass('square');
			options.on && $switchBox.addClass('on').data('on',true).find('span').html(this.ontext);
			options.disabled && $switchBox.addClass('disabled');
			// this.$switchBox.on('click','.switch-box:not([data-disabled])',$.proxy(this.switchToggle,this));

			$el[0].tagName == 'SWITCH' ? $el.after($switch) : $el.append($switch);
		},
		switchToggle: function(){
			var $switchBox = this.$switchBox;
			if($switchBox.hasClass('disabled'))return;
			var	options = this.o;
			$switchBox.data('on') ? $switchBox.removeClass('on').data('on',false).find('span').html(this.offtext) && $.isFunction(options.onoff) && options.onoff($switchBox.data('on'))
													  : $switchBox.addClass('on').data('on',true).find('span').html(this.ontext) && $.isFunction(options.onon) && options.onon($switchBox.data('on'));
		},
		// create loader
		initLoader: function(){
			var options = this.o,
					$el = this.$el[0].nodeName == 'LOADER' ? this.$el.parent() : this.$el,
					$target = $(options.target || document.body),
					that = this;

			$el.on('click.loader',function(){
				// that.stopPropagation(e);
				if($target.children('canvas').length)return;
	      var canvas = $.canvasProgress__({
	      	target: $target,
	      	canvasWidth: $target.outerWidth(),
	      	canvasHeight: $target.outerHeight(),
	      	text: options.text,
	      	textOffset: options.textOffset,
	      	color: options.color,
	      	fontSize: options.fontSize,
	      	barColor: options.barColor,
	      	barWidth: $target.outerWidth() * 0.6,
	      	barHeight: $target.outerHeight() * 0.02,
	      	particlesColor: options.particlesColor,
	      	speed: options.speed,
	      	shadowColor: options.shadowColor,
					shadowOffsetX: options.shadowOffsetX,
					shadowOffsetY: options.shadowOffsetY,
					shadowBlur: options.shadowBlur
	      });
	      // 
	      Object.defineProperty($target[0],'loaded',{
			    enumerable: true,
			    configurable: true,
	      	set: function(a){
	      		if(a){
	      			canvas.remove ? canvas.remove() : canvas.parentNode.removeChild(canvas);
	      			var c = document.createElement('canvas'),ctx = c.getContext('2d');
		      		c.className = 'canvas',
		      		c.width = $target.outerWidth(),
		      		c.height = $target.outerHeight();
		      		ctx.fillStyle = options.color || '#fff',
		      		ctx.font = (options.fontSize || 36) + 'px serif',
		      		ctx.textAlign = 'center';
		      		ctx.fillText(options.loadedText || '加载完成！',c.width/2,c.height/2 + 5);
		      		$target.append(c);
		      		setTimeout(function(){
		      			c.remove ? c.remove() : c.parentNode.removeChild(c);
		      		},1500);
	      		}
	      	}
	      });

			}).data('loader',this);
		},
		// make input require conditions
		requiredInput: function(){
			var regx,type = (this.o.type || '').trim(),that = this,errortext = '不能为空！';
			switch(type){
				case 'number':
					regx = /^\d+$/;
					errortext = '请输入数字！';
					this.typeCode = 1;
				case 'money':
					regx = /^-?\d*\.?\d*$|^-?\d+$/;
					errortext = '请输入整数或小数！';
					this.typeCode = 2;
			}
			/\//.test(type[0]) && (regx = new RegExp(type.substr(1,type.length-2)));
			this.o.errortext && (errortext = this.o.errortext);
			this.$el.on({
				'input.required': function(){
					(regx ? regx.test(this.value) : this.value.trim() != '') || (this.value = '');
				},
				'blur.required': function(){
					!that.blurValidate(this.value) ? that.$el.addClass('invalid').val('').attr('placeholder',errortext) : that.$el.removeClass('invalid');
				}
			});

		},
		blurValidate: function(value){
			if(this.typeCode == 2){
				return /^-?\d+\.?\d+$|^-?\d+$/.test(value);
			}
			return value != '';
		}

	};

	$.fn.tip = function(obj){
		new Tools(this,obj).initTip();
		return this;
	};
	$.fn.alert = function(obj){
		new Tools(this,obj).initAlert();
		return this;
	};
	$.fn.switch = function(obj){
		new Tools(this,obj).initSwitch();
		return this;
	};
	$.fn.loader = function(obj){
		new Tools(this,obj).initLoader();
		return this;
	};
	$.fn.requiredInput = function(obj){
		new Tools(this,obj).requiredInput();
		return this;
	};



	$(function(){
		var toolsExits = function(o){
			return $.tools__ && $.isPlainObject($.tools__[o]);
		};
		
		$('[data-tip]').each(function(i,e){
			var $this = $(e),
					data = $this.data();
			$this.tip({
				border: data.border,
				placement: data.placement,
				id: data.id,
				text: data.text,
				html: toolsExits('tips') && $.tools__.tips[data.html]
			});
		});

		//alert 
		$('alert').each(function(i,e){
			var $this = $(e),
					data = $this.data();
			$this.alert({
				title: data.title,
				html: toolsExits('alert') && $.tools__.alert[data.html],
				onconfirm: toolsExits('alert') && $.tools__.alert[data.onconfirm],
				oncancel: toolsExits('alert') && $.tools__.alert[data.oncancel]
			}).remove();
		});

		//switch 
		$('switch').each(function(i,e){
			var $this = $(e),
					data = $this.data();
			$this.switch({
				disabled: data.disabled,
				on: data.on,
				ontext: data.ontext,
				offtext: data.offtext,
				onon: toolsExits('switch') && $.tools__.switch[data.onon],
				onoff: toolsExits('switch') && $.tools__.switch[data.onoff],
				square: data.square,
			}).remove();
		});

		//loader 
		$('loader').each(function(i,e){
			var $this = $(e),
					data = $this.data();
			$this.loader({
				target: data.target,
	      text: data.text,
	      loadedText: data.loadedText,
	      textOffset: data.textOffset,
	      fontSize: data.fontSize,
	      color: data.color,
	      barColor: data.barColor,
	      particlesColor: data.particlesColor,
	      speed: data.speed,
	      shadowColor: data.shadowColor,
				shadowOffsetX: data.shadowOffsetX,
				shadowOffsetY: data.shadowOffsetY,
				shadowBlur: data.shadowBlur
			}).remove();
		});

		// required input
		$('input[data-required]').each(function(i,e){
			var $this = $(e),
					data = $this.data();
			$this.requiredInput({
				type: data.type,
				errortext: data.errortext
			});
		});

	});
}(window,Object,document,jQuery))