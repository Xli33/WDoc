(function($,window,document,undefined){
	'use strict'

	$.fn.select2.defaults.set( "theme", "bootstrap" );

	$(function(){
		var $sel = $('sel'),
				$popup = $('pop'),
				$dg = $('datagrid'),
				$tree = $('tree'),
				$horitree = $('areatree');

    if($sel.length){
      $sel.each(function(i,e){
        var $this = $(e),
            data = $this.data();
        $this.helpOut({
					type: 'drop',
					name: data.name,
					url: data.url,
					id: data.id,
					width: data.width,
					placeholder: data.placeholder,
					multiple: data.multiple,
					maxItem: data.maxItem,
					code: data.code,
					autoWidth: data.autoWidth
				});
      });
    }
    if($popup. length){
      $popup.each(function(i,e){
        var $this = $(e),
            data = $this.data();
        $this.helpOut({
					type: 'popup',
					id: data.id,
					title: data.title,
					width: data.width,
					url: data.url,
					placeholder: data.placeholder,
					content: data.content && $.formatter__[data.content]
				});
      });
    }
    if($dg.length){
    	$dg.each(function(i,e){
    		var $this = $(e),
    				data = $this.data();
    		$this.helpOut({
    			type: 'grid',
    			id: data.id,
    			url: data.url,
    			class: data.class,
    			code: data.code,
    			clickToSelect: data.clickToSelect && $.formatter__[data.clickToSelect],
    			detailView: data.detailView && $.formatter__[data.detailView],
    			detailFormatter: data.detailFormatter && $.formatter__[data.detailFormatter],
    			height: data.height,
    			toolBar: data.toolBar,
    			pagination: data.pagination,
    			pageSize: data.pageSize,
    			search: data.search,
    			striped: data.striped,
    			sortable: data.sortable,
    			sidePagination: data.sidePagination,
    			striped: data.striped,
    			clickRow: data.clickRow && $.formatter__[data.clickRow],
    			clickCell: data.clickCell && $.formatter__[data.clickCell],
    			fixedColumns: data.fixedColumns,
    			fixedNum: data.fixedNum,
    			onLoadSuccess: data.onLoadSuccess && $.formatter__[data.onLoadSuccess]
    			// onLoadSuccess: new Function('a','$.formatter__.' + data.onLoadSuccess+'(a)') || new Function('return $.formatter__.' + data.onLoadSuccess)()
    		});
    	});
    }
    if($tree.length){
    	$tree.each(function(i,e){
    		var $this = $(e),
    				data = $this.data();
    		$this.treeViewer({
    			type: 'tree',
    			id: data.id,
    			multiple: data.multiple,
    			placeholder: data.placeholder,
    			which: data.which,
    			tags: data.tags,
    			disableScroll: data.disableScroll,
    			onselected: data.onselected && $.treeViewer__[data.onselected],
    			onunselected: data.onunselected && $.treeViewer__[data.onunselected]
    		});
    	})
    }
    if($horitree.length){
    	$horitree.each(function(i,e){
    		var $this = $(e),
    				data = $this.data();
    		$this.areaTree({
    			type: data.type || 'area',
    			placeholder: data.placeholder
    		});
    	});
    }
    $sel.remove();
    $popup.remove();
    $tree.remove();
    $horitree.remove();
	});



	function CreateHelper($ele,obj){
		this.o = obj;
		this.$el = $ele;
	}

	CreateHelper.prototype = {
			constructor: CreateHelper,

			dropHelper: function(){
				var $select = $('<select class="select2_group form-control" name="'+this.o.name+'" '+(this.o.multiple&&'multiple')+' id="'+this.o.id+'" tabindex="-1" style="display: none;"></select>'),
						that = this,url = this.o.url || ('http://' + location.hostname +':8888/?code=' + (this.o.code || ''));
  	  	
				this.$el.selector ? this.$el.append($select) : this.$el.after($select);
				function formatState (state){
				  if (!state.id) {
				    return state.text;
				  }
				  var txt = state.text,index = txt.indexOf('-'),
				  		$state = $('<span class="cell">'+ txt.substring(0,index) + '</span><span class="cell">'+ state.id + '</span>');
				  return $state;
				}
				this.$el.data('dropHelper') || this.$el.data('dropHelper',$select);
  	  	$.get(url,function(data){
  	  		typeof data != 'object' && (data = $.parseJSON(data));
  	  		var i,k,options = '',list = data.list;
					for(i = 0,k=list.length;i<k;i++){
						options += '<option value='+list[i].code+'>'+list[i].descript + '-' + list[i].code +'</option>'
					}
					$select.append(options).select2({
						placeholder: that.o.placeholder,
						width: that.o.width,
						dropdownAutoWidth: that.o.autoWidth,
						maximumSelectionLength: that.o.maxItem,
					  templateResult: formatState,
					  closeOnSelect: that.o.multiple ? false : true
					}).on('select2:opening',function(e){
						e.stopPropagation();
					});
					
					/*that.o.change && $select.on('change',function(e){
					});*/

					// i = k = options = list = data = undefined;
				});
			},
			popHelper: function(){
				var $select = $('<span class="select-win"></span>'),
						spans = '<span class="select-win-value">'+this.o.placeholder+'</span>'
										+'<span class="select-win-arrow"><b></b></span>';
				
 				var $popWindow = $('<div class="pop-window"></div>'),
 						$popContainer = $('<div class="pop-container"></div>'),
 						html = '<div class="pop-header">'
										+'<h1 class="pop-window-title"></h1>'
										+'<i class="fa fa-window-close-o" aria-hidden="true"></i>'
										+'</div>'
										+'<div class="pop-content">'
										+'</div>';
				this.popup = $popWindow.html($popContainer.html(html)).on('mousedown',function(e){
					e.stopPropagation();
				});
				var $popContent = $popContainer.children('.pop-content');
				$(document).on({
					'keyup.popup': $.proxy(function(e){
							e.keyCode === 27 && this.closeWindow(this.popup)();
						},this),
					'mousedown.popup': this.closeWindow(this.popup)
				});
				// 若传入参数
				if(this.o){
					this.o.width && $popContent.width(this.o.width);
					this.o.height && $popContent.height(this.o.height);
					this.o.title && $popContainer.find('.pop-window-title').text(this.o.title); 
					$.isFunction(this.o.content) && $popContent.html(this.o.content());
				}
				this.closed = true;
				this.selector = $select.html(spans).on({
					click: $.proxy(function(e){
						if(!this.closed){
							// $popContent.data('dropHelper').select2('close');
							this.closeWindow(this.popup)();
							return ;
						}						
						this.place();
						this.selector.children().children('b').addClass('win-open');
						this.popup.removeClass('fadeOut').addClass('fadeIn').children().addClass('pop-up');
						// $popContent.data('dropHelper').select2('open');
						this.closed = false;
					},this),
					mousedown: function(e){
						e.stopPropagation();
					}
				}).data('pop',this);

				this.$el[0].nodeName != 'POP' ? this.$el.append($select) : this.$el.after($select);
				$select.after($popWindow);
				/*$popContent.helpOut({
					type: 'drop',
					name: 'pop-up',
					url: this.o.url,
					id: this.o.id,
					width: this.o.width,
					placeholder: this.o.placeholder,
					multiple: true,
					maxItem: this.o.maxItem,
					code: this.o.code,
					autoWidth: this.o.autoWidth
				});*/
				this.place();
				// html = spans = $select = $popContainer = $popWindow = undefined;
 			},
 			place: function(){
 				var popupWidth = this.popup.outerWidth(),
 						popupHeight = this.popup.outerHeight(),
 						offset = this.selector.offset(),
 						selectorWidth = this.selector.outerWidth(),
 						selectorHeight = this.selector.outerHeight(),
 						docScrollLeft = document.documentElement.scrollLeft,
 						docScrollTop = document.documentElement.scrollTop,
 						left = offset.left + selectorWidth - docScrollLeft,
 						top = offset.top + selectorHeight - docScrollTop,
 						clientWidth = window.innerWidth,
 						clientHeight = window.innerHeight,
 						orient = '0 0',both;
 				
 				selectorWidth === clientWidth && (left = 0);
 				selectorHeight === clientHeight && (top = 0);
 				
 				if(popupWidth>clientWidth - left){
 					left = offset.left - popupWidth - docScrollLeft;
 					orient = '100% 0';
 					both = 1;
 				}
 				if(popupHeight>clientHeight - top){
 					top = offset.top - popupHeight - docScrollTop;
 					orient = '0 100%';
 					both += 1;
 				}
 				both === 2 && (orient = '100% 100%');
 				this.popup.css({
 					left: left + 'px',
 					top: top + 'px',
 				}).children().css('transform-origin', orient);
 			},
 			closeWindow: function($ele){
 				var that = this;
				return function(){
					that.selector.children().children('b').removeClass('win-open');
					$ele.removeClass('fadeIn').addClass('fadeOut').children().removeClass('pop-up');
					that.closed = true;
					/*setTimeout(function(){
	 			    $ele.removeClass('locker');
	 			  },600);*/
				}
			},
			gridHelper: function(){
				var	others = '&pagination='+ (this.o.pagination || '') + '&firstResult='+ (this.o.firstResult || '') + '&pageSize='+ (this.o.pageSize || ''),
						orig = location.origin,
				    wurl = this.o.url||(orig.substring(0,orig.lastIndexOf(':'))+':8888/?code='+this.o.code + others),
						that = this,options = this.o;
					 // console.log(wurl)
				$.ajax({
					url: wurl,
					dataType: 'json',
					success: function(data){
						// var columns;
						$.each(data.columns,function(i,e){
							e.formatter && (e.formatter = $.formatter__[e.formatter]);
						});
						// columns = data.columns;
						// console.log(data.columns);
						var $container = $('<div class='+options.class+'></div>'),
								$table = $('<table id="'+options.id+'"></table>');
						// options.toolbar		
						// $(dg).after($container).remove(); 
						// $container.html($table);
						!that.$el.selector ? that.$el.after($table).remove() : that.$el.append($table);
						$table.bootstrapTable({
							// url: wurl,   //url一般是请求后台的url地址,调用ajax获取数据。此处我用本地的json数据来填充表格。
	        	  method: "get",                    //使用get请求到服务器获取数据
	        	  data: data.rows,
	        	  // dataType: "json",
	        	  // contentType: 'application/json,charset=utf-8',
	        	  toolbar: ".toolbar",                //一个jQuery 选择器，指明自定义的toolbar 例如:#toolbar, .toolbar.
	        	  height: options.height,//document.body.clientHeight-165,   //动态获取高度值，可以使表格自适应页面
	        	  // cache: false,                       // 不缓存
	        	  striped: options.striped,                      // 隔行加亮
	        	  // queryParamsType: "limit",           //设置为"undefined",可以获取pageNumber，pageSize，searchText，sortName，sortOrder 
	        	                                      //设置为"limit",符合 RESTFul 格式的参数,可以获取limit, offset, search, sort, order 
	        	  sidePagination: options.sidePagination,           //分页方式：client客户端分页，server服务端分页（*）
	        	  showColumns: true,                  //是否显示所有的列
	        	  pageNumber: 1,                   //初始化加载第一页，默认第一页
	        	  pageSize: options.pagesize,                    //每页的记录行数（*）
	        	  pageList: options.pageList || [10, 25, 50, 100],     //可供选择的每页的行数（*）
	        	  paginationPreText: "上页",
	        	  paginationNextText: "下页",
	        	  paginationFirstText: "首页",
	        	  paginationLastText: "尾页",
	        	  pagination: options.pagination,
	        	  columns: data.columns,
	        	  onLoadSuccess: function (data) { //加载成功时执行
	        	      // console.log(data);
	        	      $.isFunction(options.onLoadSuccess) && options.onLoadSuccess($table);
	        	  },
	        	  onLoadError: function (res) { //加载失败时执行
	        	      // console.log(res);	              
	        	      $.isFunction(options.onLoadError) && options.onLoadError($table);
	        	  },
	        	  detailView: options.detailView,
	        	  detailFormatter: options.detailFormatter,
	        	  onClickRow: options.clickRow,
	        	  onClickCell: options.clickCell,
	        	  search: options.search,
	        	  clickToSelect: options.clickToSelect,
	        	  fixedColumns: options.fixedColumns,
	        	  fixedNumber: options.fixedNum
						});
					}
				});
			}
	}

	// 纵向树形
	function CreateTree($ele,obj){
		CreateHelper.call(this,$ele,obj);
	}

	CreateTree.prototype = {
		constructor: CreateTree,

		treeStruct: function(){
			this.template = '<div class="tree">'
											+'<input type="text" class="form-control tree-input" placeholder="'+(this.o.placeholder||'请选择')+'">'
											+'<div class="tree-container">'
											+'<div class="tree-toolbar">'
											+(this.o.multiple ? '<span class="choose-all btn btn-primary">全选</span><span class="cancel-all btn btn-default">取消全选</span>' : '<span class="cancel-all btn btn-default">取消</span>')
											+'<span class="back-top btn btn-default">返回顶部</span>'
											+'</div>'
											+'<div '+(this.o.id&&'id='+this.o.id)+'" class="tree-creater"></div>'
											+'</div>'
											+'</div>';
			var options = {
        ignoreCase: this.o.caseSensitive,
        exactMatch: this.o.regMatch,
        revealResults: this.o.expandRes
      },
			$tree = $(this.template),
			that = this,
			$treeViewer = $tree.find('.tree-creater');
			
			this.o.which == 'test-group' ? this.getTree('test','GROUP',$treeViewer)
																		: this.o.which == 'group-scaffold' ? this.getTree('GROUP','scaffold',$treeViewer) 
																																		: this.o.which == 'u-g-h' ? this.getTree('test','GROUP','scaffold',$treeViewer) : undefined;

			$tree.on('change','input',function(){
				var options = {},arr = [];
        var res = $(this).next().find('.tree-creater').treeview('search',[this.value,options]);
        $.each(res,function(i,e){
        	e.state.selected = true;
        	arr.push('<p>'+e.text+' found</p>');
        });
        // $('#show-res').html(arr.join(''));
			}).find('.tree-toolbar').on('click','.choose-all',function(){
      	$(this).parent().next().treeview('selectAll');
      }).on('click','.cancel-all',function(){
      	$(this).parent().next().treeview('unselectAll').treeview('clearSearch');
      }).on('click','.back-top',function(){
      	var $target = $(this).parent().parent(),each = 1;
      	if(!$target.scrollTop()){
      		return;
      	}
      	if(that.o.disableScroll){
      		$target.scrollTop(0);
      		return;
      	} 
      	
      	var scroll2Top = function(){
	      	var dis = $target.scrollTop();
	      	dis && (each += 12*(Math.random()*5)) && $target.scrollTop(dis - each*Math.random()*.5) && that.startAnimation()(scroll2Top);
	      };
				that.startAnimation()(scroll2Top);
      });
      this.$el[0].nodeName != 'TREE' ? this.$el.append($tree) : this.$el.after($tree);
		},
		startAnimation: function(){
    	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.setTimeout;
    },
    endAnimation: function(){
    	return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.clearTimeout;
    },
		getTree: function(root,parent,child,el){
			var url = this.o.url || 'http://' + location.hostname + ':8888/?code=',that = this,
					deep = arguments.length;

			$.get(url + root,function(d){
				var test = d.list;
				$.get(url+parent,function(d){
					var group = d.list, childTree = [], tree = [], rootTree = [];
					if(deep==3){
						$.each(test,function(i,e){
							childTree = [];
							for(var i = 0;i<5;i++){
								childTree.push({text: group[i].descript + '(' + group[i].code + ')'});
							}
							tree.push({
								text: e.descript + '(' + e.code + ')',
								state: {expanded: false},
								nodes: childTree,
								tags:  [childTree.length]
							});
						});
						return $(child).treeview({
							data: tree,
							multiSelect: that.o.multiple,
							showTags: that.o.tags,
							onNodeSelected: function(event, data){
								$.isFunction(that.o.onselected) && that.o.onselected(data,event);
							},
							onNodeUnselected: function(event, data){
								$.isFunction(that.o.onunselected) && that.o.onunselected(data,event);
							}
						});
					}else{
						$.get(url + child,function(d){
							var hotels = d.list;
							$.each(test,function(i,e){
								$.each(group,function(i,e){
									childTree = [];
									for(var i = 0;i<5;i++){
										childTree.push({text:hotels[i].descript + '(' + hotels[i].code + ')'});
									}
									tree.push({
										text: e.descript + '(' + e.code + ')',
										state: {expanded: false},
										nodes: childTree
									});
								});
								childTree = [];
								for(var i = 0;i<5;i++){
									childTree.push({text: tree[i].text ,nodes: tree[i].nodes,tags: [tree[i].nodes.length]});
								}
								rootTree.push({
									text: e.descript + '(' + e.code + ')',
									state: {expanded: false},
									nodes: childTree,
									tags: [childTree.length]
								});
								$(el).treeview({
									data: rootTree,
									multiSelect: that.o.multiple,
									showTags: that.o.tags,
									onNodeSelected: function(event, data){
										$.isFunction(that.o.onselected) && that.o.onselected(data,event);
									},
									onNodeUnselected: function(event, data){
										$.isFunction(that.o.onunselected) && that.o.onunselected(data,event);
									}
								});
							});
						});
					}
				});
			});				
			
		}
	};

	// 横向树形
	function HorizontalTree($ele,obj){
		CreateHelper.call(this,$ele,obj);
	}

	HorizontalTree.prototype = {
		constructor: HorizontalTree,

		init: function(){
			this.template = '<div class="cascader-box form-group">'
											+'<div class="cascader-switch">'
											+'<input type="text" class="form-control" readonly placeholder="'+ this.o.placeholder +'">'
											+'</div>'
											+'<div class="cascader">'
											+'<div>'
											+'<ul class="cascader-ul list-group"></ul>'
											+'</div>'
											+'</div>'
											+'</div>';

			this.$cascaderBox = $(this.template).on('click',function(e){
					e.stopPropagation();
					(window.event || e.originalEvent).cancelBubble = true;
				});
			this.$cascaderSwitch = this.$cascaderBox.find('.cascader-switch');
			this.$cascaderInput = this.$cascaderSwitch.children();
			this.$cascader = this.$cascaderSwitch.next();

			// 绑定基础事件
			this.eventSubscribe();
			this.render('BANDAREA');
			this.$el.selector ? this.$el.data('horitree',this).append(this.$cascaderBox) : this.$el.after(this.$cascaderBox.data('horitree',this));
		},
		eventSubscribe: function(){
			var that = this;
			$(document).on('click.closeArea',$.proxy(this.close,this));
			this.$cascaderSwitch.on('click',$.proxy(this.toggle,this));
			this.$cascader.on('click','.cascader-li',function(){
					$(this).addClass('selected').siblings('.selected').removeClass('selected');
			}).on('click','.cascader-ul:first-of-type .cascader-li',function(){
					that.render('PROVINCE',$(this.parentNode));
			}).on('click','.cascader-ul:nth-of-type(2) .cascader-li',function(){				
					that.render('CITY',$(this.parentNode));
			}).on('click','.cascader-ul:nth-of-type(3) .cascader-li',function(){
					var arr = [];
					that.$cascaderBox.find('li.selected').each(function(i,e){
						arr.push(e.innerHTML);
					});
					arr = arr.join(' / ');
					that.$cascaderInput.val(arr).attr('title',arr);
					that.close();
			});	
		},
		open: function(){
			this.$cascaderSwitch.addClass('open');
			this.$cascader.addClass('open');
		},
		close: function(){
			this.$cascaderSwitch.removeClass('open');
			this.$cascader.removeClass('open');
		},
		toggle: function(){
			this.$cascaderSwitch.toggleClass('open');
			this.$cascader.toggleClass('open');
		},
		render: function(url,$el){
			var sprintf = function(str,rep){
					return str.replace('%s',rep);
			},
			renderList = function(list){
				var arr = [];
				$.each(list,function(i,e){
					arr.push(sprintf('<li class="cascader-li list-group-item">%s</li>',e.descript));
				});
				$el ? $el.nextAll().remove().end().after('<ul class="cascader-ul list-group">' + arr.join('') +'</ul>') : this.$cascader.find('ul').append(arr.join(''));
			},
			cache = window.localStorage[url],
			json = window.JSON;
			cache ? renderList.call(this,json.parse(cache)) : $.get(url && sprintf('http://' + location.hostname +':8888/?code=%s',url),$.proxy(function(data){
				window.localStorage[url] = json.stringify(data.list);
				renderList.call(this,data.list);
			},this));
		}
	};




	$.fn.helpOut = function(obj){
		if(typeof obj !== 'object')return;
		 		
		var createHelper = new CreateHelper(this,obj);
		if(obj.type === 'drop'){
			createHelper.dropHelper();
			return this;
		}
		if(obj.type === 'popup'){
			createHelper.popHelper();
			return this;
		}
		if(obj.type === 'grid'){
			createHelper.gridHelper();
			return this;
		}
	};

	// 
	$.fn.treeViewer = function(obj){
		if(typeof obj!== 'object') return;
/*
		var treeViewer = new createHelper(this,obj);
		if(obj.type === 'drop'){
			treeViewer.dropHelper();
			return this;
		}*/
		if(obj.type === 'tree'){
			new CreateTree(this,obj).treeStruct();
			return this;
		}
	}

	// 
	$.fn.areaTree = function(obj){
		if(typeof obj !== 'object') return;

		if(obj.type === 'area'){
			new HorizontalTree(this,obj).init();
			return this;
		}
	}


}(jQuery,window,document));




/*var F = function(el,op){
	this.el = el;
	this.op = op;
};

F.prototype = {
	constructor: F,
	say: function(w){
		console.log(w || 'Hello World ~');
	}
};

var f = new F();

var H = function(el,op){
	this.el = el;
	this.op = op;
};
H.prototype = F.prototype;
H.prototype.tell = function(w){
		console.log(w || 'this is an H');
	}
H.prototype = {
	constructor: H,
	tell: function(w){
		console.log(w || 'this is an H');
	}
};

var h = new H();*/