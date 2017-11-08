(function($,Date,moment){
  'use strict';

  $.fn.extend({
    datequarterpicker: function(option){
      if(typeof option !== 'object')return;
      var start = option.startDate || 2000,
          minView = option.minView || false,
          container = option.container || 'body',
          fillYear = function(s){     
            var i,k,li,span='',arr=[];
            for(i = 0;i<3;i++){
              i%2===0?li = '<li></li>':li='<li class="mid"></li>';
              for(k = 0;i%2===0?k<3:k<4;k++){
                span += '<span class='+(s>=start?'valid':'invalid')+'>'+(s++)+'</span>';
              }
              arr.push($(li).append(span))
              span = '';
            }
            return arr;
        },
        Quarter = {
          quarterPicker: '<div class="quarterpicker" style="display: none;z-index:33"></div>',
          quarterHeader: '<div class="quarter-header">'      
                        +'<button class="direct-btn direct-left"><span class="glyphicon glyphicon-arrow-left"></span></button>'
                        +'<h1 class="current-range">'+moment().year()+'</h1>'
                        +'<button class="direct-btn direct-right"><span class="glyphicon glyphicon-arrow-right"></span></button>'
                        +'</div>',
          quarterBody: '<div class="quarter-body"><ul class="quarter-year"></ul></div>',
          quarterQuars: '<ul class="quarter-quars clearfix">'
                        +'<li>1季度</li>'
                        +'<li>2季度</li>'
                        +'<li>3季度</li>'
                        +'<li>4季度</li>'
                        +'</ul>'
        };
      var $quarterPicker = $(Quarter.quarterPicker),
          $quarterBody = $(Quarter.quarterBody);//console.log($quarterBody)
      var $quarterYear = $quarterBody.children('.quarter-year');
          
      $quarterBody.append($quarterYear.append(fillYear(20+start.toString().substr(2,1)+0)),Quarter.quarterQuars);
      $quarterPicker.append(Quarter.quarterHeader,$quarterBody);
      var $quarters = $quarterBody.children('.quarter-quars');
      var $last = $quarterPicker.find('.direct-left'),
          $next = $quarterPicker.find('.direct-right'),
          $current = $quarterPicker.find('.current-range');
      $quarterPicker.on('click',function(e){
        e.stopPropagation();
        e.cancelBubble = true;
      })
      $last.on('click',function(){
        var currentRange = $current.html(),
            currentYear = currentRange.substr(0,4);
        if(currentRange.length>4){//console.log(currentYear)
          if(currentYear>start){
            $current.html(currentYear-10+' - '+(currentYear-1));
            $quarterBody.children('.quarter-year').html(fillYear(currentYear-0-10));
          }
        }else{
          if(currentYear>start){
            $current.html(currentYear-1);
          }
        }
      });
      $next.on('click',function(){
        var currentRange = $current.html(),
            currentYear = currentRange.substr(0,4);
        if(currentRange.length>4){
          if(currentYear<2090){
            $current.html(currentYear-0+10+' - '+(currentYear-0+19));
            $quarterBody.children('.quarter-year').html(fillYear(currentYear-0+10));
          }
        }else{
          if(currentYear<2099){
            $current.html(currentYear-0+1);
          }
        }
      });
      $current.on('click',function(){
        if(this.innerHTML.length<5){
          var r = this.innerHTML.substr(2,1);
          this.innerHTML = 20 + r + 0+ ' - '+ 20 +r+9;
          $quarterYear.show().next().hide();
        }
      });
      $quarterYear.on('click','span.valid',function(){
        $quarterYear.find('span.active').removeClass('active');
        this.className += ' active';
        $current.html(this.innerHTML);
        $quarterYear.hide().next().show();        
      });
      var that = this[0].tagName==='INPUT'?this:this.find('input'); 
      $quarters.children().each(function(i,e){
        $(e).on('click',function(){
          that.val($current.html()+' 第 '+(i+1)+' 季度');
          $(document).trigger('click');
          option.changed ? option.changed(that.val().substr(0,4)+'0'+/\d/.exec(that.val().substr(5))) : null;
        });
      });
      that.on({
        focus: function(){
          $quarterPicker.css({
            left: that.parent().offset().left + 'px',
            top: that.offset().top + that.outerHeight() + 'px'
          }).show();
        },
        click: function(e){
          e.stopPropagation();
        },
        change: option.changed
        
      });
      $(document).on('click',function(){
        $quarterPicker.hide();
      });
      minView ? $quarterYear.show().next().hide() : $quarterYear.hide();
      $(container).append($quarterPicker);
      Quarter = null;
      // $quarterPicker = $quarterYear = $quarterBody = $quarters = null;
    },
    pickDate: function(obj){
      if(!obj.type)return;
      var that = this;
      
      function ToPickDate() {
        this.o = obj;
        this.pick = that;
        that =  null;
      }
      
      ToPickDate.prototype = {
        constructor: ToPickDate,
        spanTemplate : function(icon){
          return '<span class="input-group-addon">'
                +'<i class="glyphicon glyphicon-'+icon+'"></i>'
                +'</span>';
        },
        pickTDMY: function(type){
          var format,start,min,initial,final,className,/*createQ,*/use,
              d = new Date(),
              year = d.getFullYear(),
              mon = d.getMonth()+1,
              day = d.getDate();
          mon >= 10 ? null : mon = '0' + mon;
          day >= 10 ? null : day = '0' + day;
          switch(type){
            case 'time':
              use = 'time';
              className = 'time-pickr';
              format = 'yyyy-mm-dd hh:ii';
              start = 2;
              //min = 1;
              initial = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
              var hour = d.getHours(),
                  minute = d.getMinutes();
              hour >= 10 ? null : hour = '0' + hour;
              minute >= 10 ? null : minute = '0' + minute;
              final = year+'-'+mon+'-'+day + ' ' +hour+':'+minute;
              break;
            case 'day':
              use = 'calendar';
              className = 'day-pickr';
              format = 'yyyy-mm-dd';
              start = min = 2;
              final = year+'-'+mon+'-'+day;
              break;
            case 'month':
              use = 'th';
              className = 'month-pickr';
              format = 'yyyy-mm';
              start = min = 3;
              final = year+'-'+mon;
              break;
            case 'year':
              use = 'th';
              className = 'year-pickr';
              format = 'yyyy';
              start = min = 4;
              final = year;
              break;
          }
          var $div = $('<div class="t input-group date '+className+'" data-link-field="'+this.o.id+'"></div>'),
              inner =  this.spanTemplate(use) + '<input size="16" id="'+this.o.id+'" type="text" class="form-control"'+(this.o.readonly?'readonly':'')+'>';      
          var that = this;        
          $div.append(inner).datetimepicker({
            // createQuarter: createQ,
            minuteStep: this.o.minStep,
            language: 'zh-CN',
            pickerPosition: 'bottom',
            weekStart: 1,
            startDate: this.o.startDate,
            todayBtn: this.o.todayBtn,
            autoclose: 1,
            todayHighlight: 1,
            startView: start,
            minView: min,
            linkFormat: format,
            format: format,
            initialDate: initial //new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()) 
          }).on("changeDate",function(){
            that.o.changeDate ? that.o.changeDate() : null;
          });
          // createQ ? $div.children('input').on('input',that.o.quarChosen) : null ;
          this.o.fill ? $div.children('#'+this.o.id).val(final) : null;
          this.pick.append($div);
          $div = inner = d = year = mon = day = hour = minute = final = className = use = null;
        },
        pickTime: function(){
          this.pickTDMY('time');         
          delete this.spanTemplate;
          return this.pick;          
        },
        pickDay: function(){
          this.pickTDMY('day');
          delete this.spanTemplate;
          return this.pick;
        },
        pickDayRange: function(){
          var $div = $('<div class="date-range"></div>'),
            inner = '<input type="text" id="'+this.o.id+'" class="form-control" '+(this.o.readonly?'readonly':'')+'><i class="glyphicon glyphicon-calendar fa fa-calendar"></i>';
          var that = this;
          $div.append(inner).children('input').daterangepicker({
            locale: {
              format: this.o.timePicker ? "YYYY-MM-DD HH:mm" : 'YYYY-MM-DD',
              applyLabel: '确认',
              cancelLabel: '取消',
              fromLabel : '起始时间',
              toLabel : '结束时间',
              customRangeLabel : '自定义',
              firstDay : 1,
              separator: ' ~ ',
              daysOfWeek : ['日', '一', '二', '三', '四', '五', '六'],
              monthNames : ['一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            ranges: {
              '昨日-今日': [moment().subtract(1,'days'), moment()],
              '今日-明日': [moment(), moment().add(1,'days')],
              '上周': [moment().day(1).subtract(7,'days'), moment().day(1).subtract(1,'days')],
              '本周': [moment().day(1), moment().day(7)],
              '本月': [moment().startOf("month"),moment().endOf("month")],
              '上个月': [moment().subtract(1,"month").startOf('month'),moment().subtract(1,"month").endOf('month')]
            },
            alwaysShowCalendars: true,
            showDropdowns: this.o.showDropdowns,
            timePicker: this.o.timePicker,
            timePicker24Hour: this.o.timePicker  
          }, function(start, end, label) {
            that.o.changeRange ? that.o.changeRange(start, end, label) : null;
          });
          this.pick.append($div);
          delete this.spanTemplate;
          return this.pick;
        },
        pickWeek: function(){
          var $div = $('<div class="t week"><div id='+this.o.id+' class="input-group input-daterange"></div></div>'),
              inner = this.spanTemplate('dashboard') + '<input type="text" class="form-control" '+(this.o.readonly?'readonly':'')+'>',
              weekBegin,weekEnd,weekFormatter,weekEndFirst,defaults;
          weekFormatter = new JsSimpleDateFormat("yyyy年 '第 'w' 周'", 'en', true);
          weekFormatter.isLenient = true;
          var that = this;
          $div.children().append(inner).datepicker({
            calendarWeeks: true,
            orientation: 'bottom left',
            autoclose: true,
            container: '#'+this.o.id,
            format: 'yyyy-MMMM-d',
            language: 'zh-CN',
            weekStart: 1,
            maxViewMode: 2,
            weekPicker: {
              formatWeek: function(startWeekDate, options, $datepicker) {
                weekBegin = startWeekDate.toISOString().substr(0,10);
                weekEnd = options.getWeekEndDate ? options.getWeekEndDate.substr(0,10) : null;
                if(weekEnd !== (weekEndFirst || null)){
                  var simpleVal = $datepicker.val().replace(/\W/g,'');
                      simpleVal = simpleVal.substr(0,4)+'-'+(simpleVal.substr(4)>=10?simpleVal.substr(4):'0'+simpleVal.substr(4));
                  weekEndFirst = weekEnd;
                  $datepicker.off('click change blur');
                  defaults = null;
                  that.o.weekChosen ? that.o.weekChosen(weekBegin,weekEnd,simpleVal,$datepicker) : null;
                }
                return weekFormatter.format(startWeekDate);
              },
              getWeekStart: function(weekString, options, $datepicker) {
                return weekFormatter.parse(weekString);
              }
            }
          });
          this.o.fill ? $div.children().children().val(moment().year() +'年 第 '+moment().week()+' 周').on({
            click: function(){
              defaults = this.value;
            },
            change: function(){
              defaults = this.value;
            },
            blur:function(){
              this.value = defaults;
            }
          }) : null;//console.log($div.find('#'+this.o.id));
          this.pick.append($div);
          $div = inner = null;
          delete this.spanTemplate;
          return this.pick;
        },
        pickMonth: function(){
          this.pickTDMY('month');
          delete this.spanTemplate;
          return this.pick;
        },
        pickQuarter: function(){ 
          var $div = $('<div class="t input-group date class="quarter-pickr" data-link-field="'+this.o.id+'"></div>'),
              inner =  this.spanTemplate('th-large') + '<input id="'+this.o.id+'" type="text" class="form-control" '+(this.o.readonly?'readonly':'')+'>';          
          $div.append(inner).datequarterpicker({
            startDate: this.o.startDate,
            changed: this.o.quarChosen
          });
          this.o.fill ? $div.children('input').val(moment().year()+' 第 '+moment().quarter()+' 季度') : null;
          this.pick.append($div);
          return this.pick;
        },
        pickYear: function(){
          this.pickTDMY('year');
          delete this.spanTemplate;
          return this.pick;
        },
        pickMonthRange: function(){
          var $divS = $('<div class="t input-group date '+this.o.beginClass+'" data-link-field="'+this.o.beginId+'"></div>'),
              innerB = '<input size="16" id="'+this.o.beginId+'"type="text" class="form-control month-begin" '+(this.o.readonly?'readonly':'')+'>',
              $divE = $('<div class="t input-group date '+this.o.endClass+'" data-link-field="'+this.o.endId+'"></div>'),
              innerE = '<input size="16" id="'+this.o.endId+'" type="text" class="form-control month-end" '+(this.o.readonly?'readonly':'')+'>';
          var that = this;
          $divS.append(innerB).children('input').datetimepicker({
            language: 'zh-CN',
            pickerPosition: 'bottom',
            todayBtn: that.o.todayBtn,
            autoclose: 1,
            startView: 3,
            minView: 3,
            keyboardNavigation: false,
            linkFormat: 'yyyy-mm',
            format: 'yyyy-mm'
          }).on("changeDate",function(){
            var sel = moment($('#'+that.o.beginId).val()).add(1,'months').format('YYYY-MM');
            $('#'+that.o.endId).val(sel).datetimepicker("setStartDate",sel).trigger('focus');
            that.o.changeBeginDate ? that.o.changeBeginDate() : null;
          });
          $divE.append(innerE).children('input').datetimepicker({
            language: 'zh-CN',
            pickerPosition: 'bottom',
            todayBtn: that.o.todayBtn,
            autoclose: 1,
            startView: 3,
            minView: 3,
            keyboardNavigation: false,
            linkFormat: 'yyyy-mm',
            format: 'yyyy-mm',
            startDate: moment().add(1,'months')._d
          }).on("changeDate",function(){
            that.o.changeEndDate ? that.o.changeEndDate() : null;
          });
          if(this.o.fill){
            $divS.children('input').val(moment().format('YYYY-MM'));
            $divE.children('input').val(moment().add(1,'months').format('YYYY-MM'));
          }
          this.pick.append($divS,'<label class="sep">至</label>',$divE)
          $divS = $divE = innerB = innerE = null;
          return this.pick;
        }
      }

      // 时间选择
      if(obj.type === 'time'){
        return new ToPickDate().pickTime();
      }
      // 日期选择
      if(obj.type === 'day'){
        return new ToPickDate().pickDay();
      }
      // 日期范围选择
      if(obj.type === 'dateRange'){
        return new ToPickDate().pickDayRange();
      }
      // 月份选择
      if(obj.type === 'month'){
        return new ToPickDate().pickMonth();
      }
      // 周选择
      if(obj.type === 'week'){
        return new ToPickDate().pickWeek();
      }
      // 月份范围选择
      if(obj.type === 'monthRange'){
        return new ToPickDate().pickMonthRange();
      }
      if(obj.type === 'quarter'){
        return new ToPickDate().pickQuarter();
      }
      // 年选择
      if(obj.type === 'year'){
        return new ToPickDate().pickYear();
      }
    }
  })
}(jQuery,Date,moment))  