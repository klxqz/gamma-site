//global variables
var responsiveflag = false;

$(document).ready(function () {
    $(".tab-content ul>li.first-in-line").each(function () {
        $(this).before("<li class='clear'><span /></li>");
    })
    $("#htmlcontent_home").prependTo("#center_column");

    highdpiInit();
    responsiveResize();
    $(window).resize(responsiveResize);
    if (navigator.userAgent.match(/Android/i))
    {
        var viewport = document.querySelector('meta[name="viewport"]');
        viewport.setAttribute('content', 'initial-scale=1.0,maximum-scale=1.0,user-scalable=0,width=device-width,height=device-height');
        window.scrollTo(0, 1);
    }
    blockHover();

    dropDown();

    if (typeof page_name != 'undefined' && !in_array(page_name, ['index', 'product']))
    {
        

        $(document).on('change', '.selectProductSort', function (e) {
            if (typeof request != 'undefined' && request)
                var requestSortProducts = request;
            var splitData = $(this).val().split(':');
            if (typeof requestSortProducts != 'undefined' && requestSortProducts)
                document.location.href = requestSortProducts + ((requestSortProducts.indexOf('?') < 0) ? '?' : '&') + 'orderby=' + splitData[0] + '&orderway=' + splitData[1];
        });

        $(document).on('change', 'select[name="n"]', function () {
            $(this.form).submit();
        });

        $(document).on('change', 'select[name="manufacturer_list"], select[name="supplier_list"]', function () {
            if (this.value != '')
                location.href = this.value;
        });

        $(document).on('change', 'select[name="currency_payement"]', function () {
            setCurrency($(this).val());
        });
    }

    $(document).on('click', '.back', function (e) {
        e.preventDefault();
        history.back();
    });

    jQuery.curCSS = jQuery.css;
    if (!!$.prototype.cluetip)
        $('a.cluetip').cluetip({
            local: true,
            cursor: 'pointer',
            dropShadow: false,
            dropShadowSteps: 0,
            showTitle: false,
            tracking: true,
            sticky: false,
            mouseOutClose: true,
            fx: {
                open: 'fadeIn',
                openSpeed: 'fast'
            }
        }).css('opacity', 0.8);

    if (!!$.prototype.fancybox)
        $.extend($.fancybox.defaults.tpl, {
            closeBtn: '<a title="' + FancyboxI18nClose + '" class="fancybox-item fancybox-close" href="javascript:;"></a>',
            next: '<a title="' + FancyboxI18nNext + '" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
            prev: '<a title="' + FancyboxI18nPrev + '" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
        });
});

function highdpiInit()
{
    if ($('.replace-2x').css('font-size') == "1px")
    {
        var els = $("img.replace-2x").get();
        for (var i = 0; i < els.length; i++)
        {
            src = els[i].src;
            extension = src.substr((src.lastIndexOf('.') + 1));
            src = src.replace("." + extension, "2x." + extension);

            var img = new Image();
            img.src = src;
            img.height != 0 ? els[i].src = src : els[i].src = els[i].src;
        }
    }
}

function responsiveResize()
{
    if ($(document).width() <= 767 && responsiveflag == false)
    {
        accordion('enable');
        accordionFooter('enable');
        responsiveflag = true;
    }
    else if ($(document).width() >= 768)
    {
        accordion('disable');
        accordionFooter('disable');
        responsiveflag = false;
    }
}

function blockHover(status)
{
    $(document).off('mouseenter').on('mouseenter', '.product_list.grid li.ajax_block_product .product-container', function (e) {

        if ('ontouchstart' in document.documentElement)
            return;
        if ($('body').find('.container').width() == 1170)
        {
            //var pcHeight = $(this).parent().outerHeight();
            //var pcPHeight = $(this).parent().find('.button-container').outerHeight() + $(this).parent().find('.comments_note').outerHeight() + $(this).parent().find('.functional-buttons').outerHeight();
            $(this).parent().addClass('hovered');
            //$(this).parent().css('height', pcHeight + pcPHeight).css('margin-bottom', pcPHeight * (-1));
        }
    });

    $(document).off('mouseleave').on('mouseleave', '.product_list.grid li.ajax_block_product .product-container', function (e) {
        if ($('body').find('.container').width() == 1170)
            $(this).parent().removeClass('hovered').removeAttr('style');
    });
}







function dropDown()
{
    elementClick = '#header .current';
    elementSlide = 'ul.toogle_content';
    activeClass = 'active';

    $(elementClick).on('click', function (e) {
        e.stopPropagation();
        var subUl = $(this).next(elementSlide);
        if (subUl.is(':hidden'))
        {
            subUl.slideDown();
            $(this).addClass(activeClass);
        }
        else
        {
            subUl.slideUp();
            $(this).removeClass(activeClass);
        }
        $(elementClick).not(this).next(elementSlide).slideUp();
        $(elementClick).not(this).removeClass(activeClass);
        e.preventDefault();
    });

    $(elementSlide).on('click', function (e) {
        e.stopPropagation();
    });

    $(document).on('click', function (e) {
        e.stopPropagation();
        var elementHide = $(elementClick).next(elementSlide);
        $(elementHide).slideUp();
        $(elementClick).removeClass('active');
    });
}

function accordionFooter(status)
{
    if (status == 'enable')
    {
        $('#footer .footer-block h4').on('click', function () {
            $(this).toggleClass('active').parent().find('.toggle-footer').stop().slideToggle('medium');
        })
        $('#footer').addClass('accordion').find('.toggle-footer').slideUp('fast');
    }
    else
    {
        $('.footer-block h4').removeClass('active').off().parent().find('.toggle-footer').removeAttr('style').slideDown('fast');
        $('#footer').removeClass('accordion');
    }
}

//   TOGGLE COLUMNS
function accordion(status) {
    leftColumnBlocks = $('#left_column');
    if (status == 'enable') {
        $(leftColumnBlocks).remove();
  
        $(leftColumnBlocks).insertAfter('#center_column').find('#categories_block_left ul.block_content').slideToggle('fast');
        $.uniform.update("#layered_form input[type='checkbox'], #layered_form input[type='radio'], select.form-control");
        if (typeof (categoryReload) != 'undefined') {
            categoryReload()
        }
        if (typeof (sliderList) != 'undefined') {
            initSliders()
        }
        $('#right_column .block:not(#layered_block_left) .title_block, #left_column .block:not(#layered_block_left) .title_block, #left_column #newsletter_block_left h4').on('click', function () {
            $(this).toggleClass('active').parent().find('.block_content').stop().slideToggle('medium');
        })
        $('#right_column, #left_column').addClass('accordion').find('.block:not(#layered_block_left) .block_content').slideUp('fast');
    } else {
        $(leftColumnBlocks).remove();
      
        $(leftColumnBlocks).insertBefore('#center_column');
        $.uniform.update("#layered_form input[type='checkbox'], #layered_form input[type='radio'], select.form-control");
        if (typeof (categoryReload) != 'undefined') {
            categoryReload()
        }
        if (typeof (sliderList) != 'undefined') {
            initSliders()
        }
        $('#right_column .block:not(#layered_block_left) .title_block, #left_column .block:not(#layered_block_left) .title_block, #left_column #newsletter_block_left h4').removeClass('active').off().parent().find('.block_content').removeAttr('style').slideDown('fast');
        $('#left_column, #right_column').removeClass('accordion');
    }
    
    if (filter_slider) {
        initFilterSlider();
    }
}