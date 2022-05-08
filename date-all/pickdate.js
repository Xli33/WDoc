(function($){
  'use strict';

  $(function(){
    var arr = ['time','day','month','year','quarter','week'],
        k,j = arr.length;    
    for(k = 0;k<j;k++){
      var $type = $(arr[k]);
      if($type.length){
        $type.each(function(i,e){
          var $this = $(e),
              data = $this.data();
          $this.pickDate({
            type: arr[k],
            id: data.id,
            name: data.name,
            fill: data.fill,
            autoFill: data.autoFill,
            readonly: data.readonly,
            format: data.format,
            startDate: data.startDate,
            todayBtn: data.todayBtn,
            changeDate: new Function('return '+ data.changeDate)()
          });
        });
        $type.remove();
      }
    }
    var $dayRange = $('dayrange'),
        $monthRange = $('monthrange');
    if($dayRange.length){
      $dayRange.each(function(i,e){
        var $this = $(e),
            data = $this.data();//console.log(data)
        $this.pickDate({
          type: 'dateRange',
          id: data.id,
          name: data.name,
          changeDate: new Function('return '+ data.changeDate)()
        });
      });
    }
    if($monthRange.length){
      $monthRange.each(function(i,e){
        var $this = $(e),
            data = $this.data();
        $this.pickDate({
          type: 'monthRange',
          id: data.id,
          name: data.beginName,
          name: data.endName,
          beginClass: data.beginClass,
          beginId: data.beginId,
          endClass: data.endClass,
          endId: data.endId,
          fill: data.fill,
          autoFill: data.autoFill,
          changeBeginDate: new Function('return '+ data.changeBegin)(),
          changeEndDate: new Function('return '+ data.changeEnd)()
        });
      });
    }
    
    $dayRange.remove();
    $monthRange.remove();
  });

  function ToPickDate(el,options) {
    this.o = options;
    this.pick = el;
    // el =  undefined;
  }
      
  ToPickDate.prototype = {
    constructor: ToPickDate,
    spanTemplate : function(icon){
      return '<span class="input-group-addon">'
            +'<i class="glyphicon glyphicon-'+icon+'"></i>'
            +'</span>';
    },
    _trigger: function($element,event){
      $element.on('keyup',function(e){
        e.keyCode === 13 && $element.trigger(event);
      });
    },
    pickTDMY: function(type){
      var format,start,min,initial,final,className,use,char,
          d = new Date(),
          year = d.getFullYear(),
          mon = d.getMonth()+1,
          day = d.getDate();
      mon >= 10 || (mon = '0' + mon);
      day >= 10 || (day = '0' + day);
      switch(type){
        case 'time':
          use = 'time';
          className = 'time-pickr';
          format = this.o.format || 'yyyy-mm-dd hh:ii';
          start = 3;
          char = /\W/.exec(format)[0];
          initial = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
          var hour = d.getHours(),
              minute = d.getMinutes();
          hour >= 10 || (hour = '0' + hour);
          minute >= 10 || (minute = '0' + minute);
          final = year+char+mon+char+day + ' ' +hour+':'+minute;
          break;
        case 'day':
          use = 'calendar';
          className = 'day-pickr';
          format = this.o.format || 'yyyy-mm-dd';
          char = /\W/.exec(format)[0];
          start = 3;
          min = 2;
          final = year+char+mon+char+day;
          break;
        case 'month':
          use = 'th';
          className = 'month-pickr';
          format = this.o.format || 'yyyy-mm';
          char = /\W/.exec(format)[0];
          start = min = 3;
          final = year+char+mon;
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
          inner =  '<input name="'+(this.o.name||'')+'" size="16" id="'+this.o.id+'" value="'+(this.o.fill?final:'')+'" type="text" class="form-control"'+(this.o.readonly?'readonly':'')+'>' + this.spanTemplate(use);      
      var that = this;
      $div.append(inner).datetimepicker({
        minuteStep: this.o.minStep || 5,
        language: 'zh-CN',
        pickerPosition: 'bottom',
        // weekStart: 1,
        startDate: this.o.startDate || '2000-01-01',
        endDate: this.o.endDate || '2099-12-31',
        todayBtn: this.o.todayBtn,
        autoclose: 1,
        todayHighlight: 1,
        startView: this.o.startView || start,
        minView: min,
        linkFormat: format,
        format: this.o.format || format,
        pickerPosition: 'bottom-left',
        initialDate: initial || new Date()//new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()) 
      }).on("changeDate",function(){
        that.o.changeDate && that.o.changeDate();
      }).children('input').on({
        input: function(e){
          that.o.autoFill && e.originalEvent.inputType !== 'deleteContentBackward' && that.autoLine(this,type,char);
          that.validateFormat(type,this.value,true) || (this.value = that.value);
        },
        change: function(){
          that.validateFormat(type,this.value) || (this.value = that.value);
        }
      });
      this._trigger($div.children('input'),'changeDate');
      this.value = final;
      ['TIME','DAY','MONTH','YEAR'].indexOf(this.pick[0].nodeName) != -1 ? this.pick.after($div) : this.pick.append($div);      
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
        inner = '<input type="text" name="'+(this.o.name||'')+'" id="'+this.o.id+'" class="form-control" '+(this.o.readonly?'readonly':'')+'><i class="glyphicon glyphicon-calendar fa fa-calendar"></i>';
      var that = this;
      $div.append(inner).children('input').daterangepicker({
        locale: {
          format: this.o.format || 'YYYY-MM-DD',
          applyLabel: '确认',
          cancelLabel: '取消',
          fromLabel : '起始时间',
          toLabel : '结束时间',
          customRangeLabel : '自定义',
          // firstDay : 1,
          separator: ' ~ ',
          daysOfWeek : ['日', '一', '二', '三', '四', '五', '六'],
          monthNames : ['1月', '2月', '3月', '4月', '5月', '6月','7月', '8月', '9月', '10月', '11月', '12月']
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
        that.o.changeDate && that.o.changeDate(start, end, label);
      }).next('i').on('click',function(){
        $(this).prev().trigger('focus');
      });      
      // this._trigger($div.children('input'),'changeDate');
      this.pick[0].tagName === 'DAYRANGE' ? this.pick.after($div) : this.pick.append($div);
      var val = $div.children('input').val();
      that.o.changeDate && that.o.changeDate(moment(val.substr(0,10)), moment(val.substr(13,10)));
      delete this.spanTemplate;
      return this.pick;
    },
    pickWeek: function(){
      var $div = $('<div class="t week"><div id='+this.o.id+' class="input-group input-daterange"></div></div>'),
          inner = '<input type="text" name="'+(this.o.name||'')+'" class="form-control" '+(this.o.readonly?'readonly':'')+'>' + this.spanTemplate('dashboard'),
          weekBegin,weekEnd,weekFormatter,weekEndFirst,defaults;
      weekFormatter = new JsSimpleDateFormat("yyyy年'第'w'周'", 'zh-CN', true);
      // weekFormatter.isLenient = true;
      var that = this;
      $div.children().append(inner).datepicker({
        calendarWeeks: true,
        orientation: 'bottom-left',
        autoclose: true,
        container: '#'+this.o.id,
        format: 'yyyy-MMMM-d',
        language: 'zh-CN',
        // weekStart: 1,
        maxViewMode: 2,
        // todayBtn: true,
        weekPicker: {
          formatWeek: function(startWeekDate, options, $datepicker) {
            weekBegin = startWeekDate.toISOString().substr(0,10);
            weekEnd = options.getWeekEndDate && options.getWeekEndDate.substr(0,10);
            if(weekEnd !== weekEndFirst){
              var simpleVal = $datepicker.val().replace(/\W/g,'');
                  simpleVal = simpleVal.substr(0,4)+'-'+(simpleVal.substr(4)>=10?simpleVal.substr(4):'0'+simpleVal.substr(4));
              weekEndFirst = weekEnd;
              // $datepicker.off('click');
              // defaults = undefined;
              that.o.changeDate && that.o.changeDate(weekBegin,weekEnd,simpleVal,$datepicker);
            }
            return weekFormatter.format(startWeekDate);
          } /*,
          getWeekStart: function(weekString, options, $datepicker) {console.log(arguments)
            return weekFormatter.parse(weekString);
          }*/
        }
      }).children('input').on({
        blur: function(){
          that.validateFormat('week',this.value) || (this.value = that.value);
        },
        input: function(){
          that.validateFormat('week',this.value,true) || (this.value = that.value);
        }
      });
      $div.children().children('span').on('click',function(){
        $(this).prev('input').trigger('focus');
      });
      this.o.fill && $div.children().children().val(moment().year() +'年第'+(moment().week()+0)+'周').one({
        click: function(){
          defaults = this.value;
        },
        change: function(){
          defaults && (defaults = this.value);
        },
        blur:function(){
          defaults && (this.value = defaults);
        }
      });//console.log($div.find('#'+this.o.id));
      this.pick[0].tagName === 'WEEK' ? this.pick.after($div) : this.pick.append($div);
      this.value = $div.children().children().val();
      // $div = inner = undefined;
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
          inner ='<input name="'+(this.o.name||'')+'" id="'+this.o.id+'" type="text" class="form-control" '+(this.o.readonly?'readonly':'')+'>' + this.spanTemplate('th-large');
      var that = this;         
      $div.append(inner).datequarterpicker({
        startDate: this.o.startDate,
        changed: function(a){
          that.o.changeDate && that.o.changeDate(a);
        }
      }).children('input').on({
        change: function(){
          that.validateFormat('quarter',this.value) || (this.value = that.value);
        },
        input: function(){
          that.validateFormat('quarter',this.value,true) || (this.value = that.value);
        }
      });
      this._trigger($div.children('input'),'changed');
      this.o.fill && $div.children('input').val(moment().year()+'年第'+moment().quarter()+'季度');
      this.value = $div.children('input').val();          
      this.pick[0].tagName === 'QUARTER' ? this.pick.after($div) : this.pick.append($div);
      return this.pick;
    },
    pickYear: function(){
      this.pickTDMY('year');
      delete this.spanTemplate;
      return this.pick;
    },
    pickMonthRange: function(){
      var $divS = $('<div class="t input-group date range-month '+(this.o.beginClass||'')+'" data-link-field="'+this.o.beginId+'"></div>'),
          innerB = '<input name="'+(this.o.beginName||'')+'" size="16" id="'+this.o.beginId+'"type="text" class="form-control month-begin" '+(this.o.readonly?'readonly':'')+'>',
          $divE = $('<div class="t input-group date range-month '+(this.o.endClass||'')+'" data-link-field="'+this.o.endId+'"></div>'),
          innerE = '<input name="'+(this.o.endName||'')+'" size="16" id="'+this.o.endId+'" type="text" class="form-control month-end" '+(this.o.readonly?'readonly':'')+'>';
      var that = this,format = this.o.format || 'yyyy-mm',char = /\W/.exec(format)[0];
      $divS.append(innerB).children('input').datetimepicker({
        language: 'zh-CN',
        pickerPosition: 'bottom',
        todayBtn: that.o.todayBtn,
        autoclose: 1,
        startView: 3,
        minView: 3,
        linkFormat: format,
        format: format
      }).on({
          input: function(e){
            that.o.autoFill && e.originalEvent.inputType !== 'deleteContentBackward' && that.autoLine(this,'month',char);
            that.validateFormat('month',this.value,true) || (this.value = that.value);
          },
          keydown: function(e){//console.log(123)
            if(e.keyCode>=37&&e.keyCode<=40){
              $('#'+that.o.endId).datetimepicker('hide');
              $(this).trigger('focus');
            }
            if(e.keyCode === 13){
              $(this).trigger('changeDate');
            }
          },
          changeDate:function(){
            that.validateFormat('month',this.value) || (this.value = that.value);
            var sel = moment($('#'+that.o.beginId).val()).add(1,'months').format('YYYY-MM');
            $('#'+that.o.endId).val(sel).datetimepicker("setStartDate",sel).trigger('focus');
            that.o.changeBegin && that.o.changeBegin();
          }
      });
      $divE.append(innerE).children('input').datetimepicker({
        language: 'zh-CN',
        pickerPosition: 'bottom',
        todayBtn: that.o.todayBtn,
        autoclose: 1,
        startView: 3,
        minView: 3,
        linkFormat: format,
        format: format,
        startDate: moment().add(1,'months')._d
      }).on({
        input: function(e){
          that.o.autoFill && e.originalEvent.inputType !== 'deleteContentBackward' && that.autoLine(this,'month',char);
        },
        blur: function(){
          this.value >= $('#'+that.o.beginId).val() || (this.value = that.valueE);
          that.validateFormat('month',this.value,true) || (this.value = that.value);
        },
        changeDate: function(){
          that.validateFormat('month',this.value) || (this.value = that.valueE);
          that.o.changeEnd && that.o.changeEnd();
        }
      });
      if(this.o.fill){
        $divS.children('input').val(moment().format('YYYY-MM'));
        $divE.children('input').val(moment().add(1,'months').format('YYYY-MM'));
      }
      var $own = $('<div style="display:inline-block"></div>').append($divS,'<label class="sep">至</label>',$divE);
      this.pick[0].tagName === 'MONTHRANGE' ? this.pick.after($own) : this.pick.append($own);
      that.value = $divS.children('input').val();
      that.valueE = $divE.children('input').val();
      // $divS = $divE = innerB = innerE = undefined;
      return this.pick;
    },
    valDate: function(year,month,day){
      var valid = false;
      if(/^0[1-9]$/.test(day) || (day >9 && day < 32) || /元旦|除夕|春节|清明|五一|端午|中秋|国庆/.test(day)){
        valid = true;
        if(/^0[4,6,9]$|^11$/.test(month)){
          day < 31 ? valid = true : valid = false;
        }
        if(month === '02'){
          moment().isLeapYear(year) ? day <30 ? valid = true : valid = false : day <29 ? valid = true : valid = false;
        }
      }
      return valid;
    },
    validateFormat: function(type,val,bool){
      // at least need dyear and valY
      var dyear = val.substr(0,4),
          valY = /\d{4}/.test(dyear) && dyear >= 2000 && dyear <= 2099;

      if(type == 'quarter'){
        return bool ? val.length < 10 : valY && /^年第[1-4]季度$/.test(val.substr(4));
      }
      if(type == 'week'){
        return bool ? val.length < 10 : valY && /^年第\d{1,2}周$/.test(val.substr(4));
      }
      if(type == 'year'){
        return bool ? val.length < 5 : val.length === 4 && valY;
      }

      // need dmonth and valM
      var dmonth = val.substr(5,2),
          valM = /^(0[1-9]|10|11|12)$/.test(dmonth);

      if(type == 'month'){
        return bool ? val.length < 8 : val.length === 7 && valY && valM;
      }

      // need dday
      var dday = val.substr(8,2);

      if(type == 'day'){
        return bool ? val.length < 11 : val.length === 10 && valY && valM && this.valDate(dyear,dmonth,dday);
      }

      // need valH and valMin
      var dhour = val.substr(11,2),
          dminute = val.substr(14,2),
          valH = /^0[0-9]$/.test(dhour) || (dhour > 9 && dhour <24),
          valMin = /^0[1-9]$/.test(dminute) || (dminute > 9 && dminute < 60);

      if(type == 'time'){
        return bool ? val.length < 17 : val.length === 16 && valY && valM && this.valDate(dyear,dmonth,dday) && valH && valMin;
      }
    },
    autoLine: function($el,type,regx){
      var val = $el.value,len = val.length,regxp = new RegExp(regx);

      len===4 && (regxp.test(val.substr(4,1)) || ($el.value = val + regx));
      len===5 && (regxp.test(val.substr(5,1)) || ($el.value = val.substr(0,4) + regx + val.substr(-1,1)));

      if(type == 'month'){
        return ;
      }

      len===7 && (regxp.test(val.substr(7,1)) || ($el.value = val + regx));
      len===8 && (regxp.test(val.substr(8,1)) || ($el.value = val.substr(0,7) + regx + val.substr(-1,1)));

      if(type == 'day'){
        return;      
      }

      len===13 && (/:/.test(val.substr(13,1)) || ($el.value = val + ':'));
      len===14 && (/:/.test(val.substr(14,1)) || ($el.value = val.substr(0,13) + ':' + val.substr(-1,1)));

      if(type == 'time'){
        return;
      }
    }
  }

  $.fn.extend({
    datequarterpicker: function(option){
      if(typeof option != 'object')return;
      var start = option.startDate || 2000,
          minView = option.minView || false,
          container = option.container || 'body';
      var fillYear = function(s){
            var i,k,li,span='',arr=[];
            for(i = 0; i<3; i++){
              i%2 == 0 ? li = '<li></li>' : li = '<li class="mid"></li>';
              for(k = 0; i%2 == 0 ? k<3 : k<4; k++){
                span += '<span class="'+(s>=start?'valid':'invalid')+(s === new Date().getFullYear() ? ' active' : '')+'">'+(s++)+'</span>';
              }
              arr.push($(li).append(span));
              span = '';
            }
            return arr;
          };
      
      var Quarter = {
            quarterPicker: '<div class="quarterpicker dropdown-menu" style="display: none;z-index:5555"></div>',
            quarterHeader: '<div class="quarter-header">'      
                          +'<button class="direct-btn direct-left"><span class="glyphicon glyphicon-arrow-left"></span></button>'
                          +'<h1 class="current-range">'+moment().year()+'</h1>'
                          +'<button class="direct-btn direct-right"><span class="glyphicon glyphicon-arrow-right"></span></button>'
                          +'</div>',
            quarterBody: '<div class="quarter-body"><ul class="quarter-year"></ul></div>',
            quarterQuars: '<ul class="quarter-quars clearfix">'
                          +'<li>第1季度</li>'
                          +'<li>第2季度</li>'
                          +'<li>第3季度</li>'
                          +'<li>第4季度</li>'
                          +'</ul>'
          };
      var $quarterPicker = $(Quarter.quarterPicker),
          $quarterBody = $(Quarter.quarterBody);
      var $quarterYear = $quarterBody.children('.quarter-year');
      var that = this[0].tagName==='INPUT'?this:this.find('input');
      $quarterBody.append($quarterYear.append(fillYear(20+start.toString().substr(2,1)+0)),Quarter.quarterQuars);
      $quarterPicker.append(Quarter.quarterHeader,$quarterBody);
      var $quarters = $quarterBody.children('.quarter-quars');
      var $last = $quarterPicker.find('.direct-left'),
          $next = $quarterPicker.find('.direct-right'),
          $current = $quarterPicker.find('.current-range');
      $quarterPicker.on('click',function(e){
        e.stopPropagation();
        e.cancelBubble = true;
      });
      
      $last.on('click',function(){
        var currentRange = $current.text(),
            currentYear = currentRange.substr(0,4);
        if(currentRange.length>4){
          if(currentYear>start){
            $current.text(currentYear-10+' - '+(currentYear-1));
            $quarterBody.children('.quarter-year').html(fillYear(currentYear-0-10));
            $current.trigger('change');
          }
        }else{
          currentYear>start && $current.html(currentYear-1);
          $current.trigger('change');
        }
      });
      $next.on('click',function(){
        var currentRange = $current.text(),
            currentYear = currentRange.substr(0,4);
        if(currentRange.length>4){
          if(currentYear<2090){
            $current.text(currentYear-0+10+' - '+(currentYear-0+19));
            $quarterBody.children('.quarter-year').html(fillYear(currentYear-0+10));
            $current.trigger('change');
          }
        }else{
          currentYear<2099 && $current.text(currentYear-0+1);
          $current.trigger('change');          
        }
      });
      $current.on({
        click: function(){
          if(this.innerHTML.length<5){
            this.className += ' yearToyear';          
            var r = this.innerHTML.substr(2,1);
            this.innerHTML = 20 + r + 0+ ' - '+ 20 +r+9;
            $quarterYear.show().next().hide();
            $(this).trigger('change');
          }
        },
        change: function(){
          var selectedValue = that.val();
          if(this.innerHTML.length<5){
            var currentYear = this.innerHTML;          
            currentYear - start <= 1 ? $last.css('display','none') : $last.css('display','initial');
            currentYear - 2099 === 0 ? $next.css('display','none') : $next.css('display','initial');
            if(currentYear === selectedValue.substr(0,4)){
              $quarters.children().each(function(i,e){
                e.innerHTML === selectedValue.substr(5) ? e.className = 'active' : e.className = '';
              });
            }else{
              $quarters.children('.active').removeClass('active');
            }
          }else{
            var beginYear = this.innerHTML.substr(0,4),
                endYear = this.innerHTML.substr(7),
                selectedYear = selectedValue.substr(0,4);
            beginYear - start <= 0 ? $last.css('display','none') : $last.css('display','initial');
            beginYear - 2090 === 0 ? $next.css('display','none') : $next.css('display','initial');
            if(selectedYear > beginYear && selectedYear < endYear){
              $quarterYear.find('.valid').each(function(i,e){
                e.innerHTML === selectedYear ? e.className += ' active' : e.className = 'valid';
              });
            }else{
              $quarterYear.find('.active').removeClass('active');
            }
          }
        }
      });
      $quarterYear.on('click','span.valid',function(){
        $quarters.children('li.active').removeClass('active');    
        $current.removeClass('yearToyear').text(this.innerHTML).trigger('change');
        $quarterYear.hide().next().show();        
      }).on('click','span.valid.active',function(){
        var val = that.val().substr(5);
        $current.text(this.innerHTML).trigger('change');
      });
       
      $quarters.children().each(function(i,e){
        $(e).on('click',function(){
          var val = $current.text();
          $quarterYear.find('span.active').removeClass('active').end().find('span.valid').each(function(i,e){
            e.innerHTML === val && (e.className += ' active');
          });
          that.val(val+'年第'+(i+1)+'季度');
          $(this).siblings('.active').removeClass('active');
          this.className += ' active';
          $(document).trigger('click');
          option.changed && option.changed(that.val().substr(0,4)+'0'+/\d/.exec(that.val().substr(5)));
        });
      });
      that.on({
        focus: function(){
          if($current.text().length>4){
            $current.removeClass('yearToyear').text($quarterYear.find('span.valid.active').text());           
            $quarterYear.hide();
            $quarters.show();
          }
          $current.trigger('change');
          $quarterPicker.css({
            left: that.parent().offset().left + 'px',
            top: that.offset().top + that.outerHeight() + 'px'
          }).show();
        },
        click: function(e){
          e.stopPropagation();
        },
        keydown: function(e){
          if(e.keyCode === 13){
            $current.text(this.value.substr(0,4)).trigger('change');
          }
        },
        change: option.changed(that.val().substr(0,4)+'0'+/\d/.exec(that.val().substr(5)))        
      }).next('.input-group-addon').on('click',function(e){
          e.stopPropagation();
          $(this).prev().trigger('focus');
        });
      $(document).on('click',function(){
        $quarterPicker.hide();
      });
      minView ? $quarterYear.show().next().hide() : $quarterYear.hide();
      $(container).append($quarterPicker);
      // Quarter = undefined;
      return this;
    },
    pickDate: function(obj){
      if(!obj.type)return;

      var pick = new ToPickDate(this,obj);      
      
      // 时间选择
      if(obj.type === 'time'){
        return pick.pickTime();
      }
      // 日期选择
      if(obj.type === 'day'){
        return pick.pickDay();
      }
      // 日期范围选择
      if(obj.type === 'dateRange'){
        return pick.pickDayRange();
      }
      // 月份选择
      if(obj.type === 'month'){
        return pick.pickMonth();
      }
      // 周选择
      if(obj.type === 'week'){
        return pick.pickWeek();
      }
      // 月份范围选择
      if(obj.type === 'monthRange'){
        return pick.pickMonthRange();
      }
      if(obj.type === 'quarter'){
        return pick.pickQuarter();
      }
      // 年选择
      if(obj.type === 'year'){
        return pick.pickYear();
      }
    }
  })
  /*$.chooseSkin = function(style){
    !style ? $(document.head).append('<link rel="stylesheet" type="text/css" href="dateAll.css">') : $(document.head).append('<link rel="stylesheet" type="text/css" href="dateAll-'+style+'.css">');
  }*/
}(jQuery));