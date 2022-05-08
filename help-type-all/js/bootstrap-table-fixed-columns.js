/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * @version: v1.0.1
 */

(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        fixedColumns: false,
        fixedNumber: 1
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initHeader = BootstrapTable.prototype.initHeader,
        _initBody = BootstrapTable.prototype.initBody,
        _resetView = BootstrapTable.prototype.resetView;

    BootstrapTable.prototype.initFixedColumns = function () {
        this.$fixedHeader = this.$fixedHeader || $([
            '<div class="fixed-table-header-columns">',
            '<table>',
            '<thead></thead>',
            '</table>',
            '</div>'].join(''));

        this.timeoutHeaderColumns_ = 0;
        this.$fixedHeader.find('table').attr('class', this.$el.attr('class'));
        this.$fixedHeaderColumns = this.$fixedHeader.find('thead');
        this.$tableHeader.before(this.$fixedHeader);

        this.$fixedBody = this.$fixedBody || $([
            '<div class="fixed-table-body-columns">',
            '<table>',
            '<thead></thead>',
            '<tbody></tbody>',
            '</table>',
            '</div>'].join(''));

        this.timeoutBodyColumns_ = 0;
        this.$fixedBody.find('table').attr('class', this.$el.attr('class'));
        this.$fixedBodyHeader = this.$fixedBody.find('thead');
        this.$fixedBodyColumns = this.$fixedBody.find('tbody');
        this.$tableBody.before(this.$fixedBody);
    };

    BootstrapTable.prototype.initHeader = function () {
        _initHeader.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.fixedColumns) {
            return;
        }

        this.initFixedColumns();
        var that = this,$trs = this.$header.find('tr').clone();
        $trs.each(function () {
            $(this).find('th:gt(' + (that.options.fixedNumber-1) + ')').remove();
        });
        this.$fixedHeaderColumns.html('').append($trs).find('th:first-child input[type=checkbox]').on('click',function(){
            var $fixedBody = that.$fixedBodyColumns;
            $fixedBody.find('input[type=checkbox]').prop('checked',this.checked);
            if(!this.checked){
                $fixedBody.find('tr').removeClass('selected').find('input[type=checkbox]').prop('checked',false);
                that.$body.find('tr').removeClass('selected').find('input[type=checkbox]').prop('checked',false);
            }else{
                $fixedBody.find('tr').addClass('selected').find('input[type=checkbox]').prop('checked',true);
                that.$body.find('tr').addClass('selected').find('input[type=checkbox]').prop('checked',true);
            }
        });
        this.$fixedBodyHeader.html('').append($trs.clone());
    };

    BootstrapTable.prototype.initBody = function () {
        _initBody.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.fixedColumns) {
            return;
        }

        var that = this,
            rowspan = 0;

        this.$fixedBodyColumns.html('');
        this.$body.find('> tr[data-index]').each(function () {
            var $tr = $(this).clone(),
                $tds = $tr.find('td');

            $tr.html('');
            var end = that.options.fixedNumber;
            if (rowspan > 0) {
                --end;
                --rowspan;
            }
            for (var i = 0; i < end; i++) {
                $tr.append($tds.eq(i).clone());
            }
            that.$fixedBodyColumns.append($tr);
            
            if ($tds.eq(0).attr('rowspan')){
            	rowspan = $tds.eq(0).attr('rowspan') - 1;
            }
        });
    };

    BootstrapTable.prototype.resetView = function () {
        _resetView.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.fixedColumns) {
            return;
        }

        clearTimeout(this.timeoutHeaderColumns_);
        this.timeoutHeaderColumns_ = setTimeout($.proxy(this.fitHeaderColumns, this), this.$el.is(':hidden') ? 100 : 0);

        clearTimeout(this.timeoutBodyColumns_);
        this.timeoutBodyColumns_ = setTimeout($.proxy(this.fitBodyColumns, this), this.$el.is(':hidden') ? 100 : 0);
    };

    BootstrapTable.prototype.fitHeaderColumns = function () {
        var that = this,
            visibleFields = this.getVisibleFields(),
            headerWidth = 0;

        this.$body.find('tr:first-child:not(.no-records-found) > *').each(function (i) {
            var $this = $(this),
                index = i;

            if (i >= that.options.fixedNumber) {
                return false;
            }

            if (that.options.detailView && !that.options.cardView) {
                index = i - 1;
            }

            that.$fixedHeader.find('th[data-field="' + visibleFields[index] + '"]')
                .find('.fht-cell').width($this.innerWidth());
            headerWidth += $this.outerWidth();
        });
        this.$fixedHeader.width(headerWidth + 1).show();
    };

    BootstrapTable.prototype.fitBodyColumns = function () {
        var that = this,
            top = -(parseInt(this.$el.css('margin-top')) - 2),
            // the fixed height should reduce the scorll-x height
            height = this.$tableBody.height();

        if (!this.$body.find('> tr[data-index]').length) {
            this.$fixedBody.hide();
            return;
        }
        // console.log(this)
        /*if (!this.options.height) {
            top = this.$fixedHeader.height();
            height = height - top;
        }*/

        this.$fixedBody.children('table').css('margin-top',-top+1).end().css({
            width: this.$fixedHeader.width(),
            height: this.$tableBody.height() - 2,
            top: top
        }).show();

        this.$body.find('> tr').each(function (i) {
            // that.$fixedBody.find('tr:eq(' + i + ')').height($(this).height() - 1);
        });
        var addStyle = function(sel,which,node){
            sel ? node.find('tr[data-index="' + which + '"]').addClass('hover')
                : node.find('tr[data-index="' + which + '"]').removeClass('hover');
        };
        // events
        this.$tableBody.on('scroll', function () {
            that.$fixedBody.scrollTop(this.scrollTop);
        });
        this.$body.find('> tr[data-index]').off('hover').hover(function(){
            addStyle(true,$(this).data('index'),that.$fixedBody);
        }, function(){
            addStyle(false,$(this).data('index'),that.$fixedBody);
        });
        this.$fixedBody.on('mousewheel',function (event){
            var delta = 0,
                $tableBody = that.$tableBody,
                scrollTop = $tableBody.scrollTop();
            !event ? event = window.event : event = event.originalEvent;
            if (event.wheelDelta) {
                delta = event.wheelDelta/120; 
                window.opera ? delta = -delta : undefined;
            } else if (event.detail) {
                delta = -event.detail/3;
            }
            delta<0 ? $tableBody.scrollTop(scrollTop+16*2.5) : $tableBody.scrollTop(scrollTop-16*2.5);
        }).find('tr[data-index]').off('hover').hover(function(){
            addStyle(true,$(this).data('index'),that.$body);
        }, function(){
            addStyle(false,$(this).data('index'),that.$body);
        });//console.log(this)
        if(this.options.clickToSelect){
            this.$body.on('click','> tr[data-index]',function(e){
                e.stopPropagation();
                var $this = $(this),thatR = that.$fixedBodyColumns.find('tr[data-index]').eq($this[0].rowIndex-1);
                thatR.trigger('click');
            });
            this.$fixedBodyColumns.on('click','> tr[data-index]',function(e){
                e.stopPropagation();
                var $this = $(this),thatR = that.$body.find('tr[data-index]').eq($this[0].rowIndex-1);
                if($this.hasClass('selected')){
                    $this.removeClass('selected').find('input[type=checkbox]').prop('checked',false);
                    // thatR.trigger('click');
                    thatR.removeClass('selected').find('input[type=checkbox]').prop('checked',false);
                }else{
                    $this.addClass('selected').find('input[type=checkbox]').prop('checked',true);
                    // thatR.trigger('click');
                    thatR.addClass('selected').find('input[type=checkbox]').prop('checked',true);
                }
                that.$fixedHeaderColumns.find('input[type=checkbox]').prop('checked',$this.parent().find('input:not(:checked)').length === 0 ? true : false);
            });
        }
    };

})(jQuery);
