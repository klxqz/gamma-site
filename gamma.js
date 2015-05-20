$(window).load(function () {
    if (use_uniform) {
        $("select.form-control, input[type='checkbox']:not(.comparator), input[type='radio'], input[type='file']").uniform();
    }
});

function initTagcanvas() {
    if ($('#tag-cloud-canvas #canvas').tagcanvas({
        textColour: $('#tag-cloud a').css('color'),
        outlineColour: '#000',
        outlineMethod: "colour",
        outlineThickness: 1,
        reverse: true,
        hideTags: true,
        depth: 0.8,
        maxSpeed: 0.05
    }, 'tag-cloud')) {
        $('#tag-cloud-canvas').show();
        $('#tag-cloud').hide();
    }
}


function initDialogHendler(d, url) {
    var c = d.find('.cart');
    c.prepend('<a href="#" class="dialog-close">&times;</a>');

    if ((c.height() > c.find('form').height())) {
        c.css('bottom', 'auto');
    } else {
        c.css('bottom', '15%');
    }
    c.find('form').submit(function () {
        postDialogForm(d, $(this), url + '?content_only=1');
        return false;
    });
    c.find('a').click(function () {
        if ($(this).attr('href') != '#') {
            if ($(this).closest('.wa-auth-adapters').length) {
                $(".dialog:visible").hide().find('.cart').empty();
                return false;
            }
            loadDialogContent(d, $(this).attr('href'));
            return false;
        }
    });
}


function postDialogForm(d, f, url) {
    var c = d.find('.cart');
    $.post(url, f.serializeArray(), function (response) {
        if (!$(response).find('.wa-value .wa-error-msg').length) {
            window.location.href = url;
        } else {
            c.html(response);
            initFormControl();
            initDialogHendler(d, url);
        }
    });
}

function loadDialogContent(d, url) {
    var c = d.find('.cart');
    c.load(url + '?content_only=1', function () {
        initFormControl();
        d.show();
        initDialogHendler(d, url);
    });
}

function initFormControl() {
    $('input[type="text"],input[type="search"],input[type="password"],input[type="checkbox"],textarea, select').addClass('form-control');
    $('input[type="submit"], input[type="button"], button:not(.btn-default)').addClass('button btn');

}

function HoverWatcher(selector)
{
    this.hovering = false;
    var self = this;

    this.isHoveringOver = function () {
        return self.hovering;
    }

    $(selector).hover(function () {
        self.hovering = true;
    }, function () {
        self.hovering = false;
    })
}

function initCart() {
    var cart_block = new HoverWatcher('#header .cart_block');
    var shopping_cart = new HoverWatcher('#header .shopping_cart');

    if ('ontouchstart' in document.documentElement)
    {
        $('.shopping_cart > a:first').on('click', function (e) {
            e.preventDefault();
        });

        $(document).on('touchstart', '#header .shopping_cart a:first', function () {
            if ($(this).next('.cart_block:visible').length)
                $("#header .cart_block").stop(true, true).slideUp(450);
            else
                $("#header .cart_block").stop(true, true).slideDown(450);
            e.preventDefault();
            e.stopPropagation();
        });
    }
    else {
        $("#header .shopping_cart a:first").hover(
                function () {

                    $("#header .cart_block").stop(true, true).slideDown(450);
                },
                function () {
                    setTimeout(function () {
                        if (!shopping_cart.isHoveringOver() && !cart_block.isHoveringOver())
                            $("#header .cart_block").stop(true, true).slideUp(450);

                    }, 200);
                }
        );
    }

    $("#header .cart_block").hover(
            function () {
            },
            function () {
                setTimeout(function () {
                    if (!shopping_cart.isHoveringOver())
                        $("#header .cart_block").stop(true, true).slideUp(450);
                }, 200);
            }
    );
}

$(document).ready(function () {

    initCart();
    initFormControl();


    $(document).on('click', '.modal-dialog', function () {
        var url = $(this).attr('href');
        if (url) {
            var d = $('#dialog');
            loadDialogContent(d, url);
            return false;
        }
        return false;
    });


    $(document).on('click', 'a.dialog-close', function () {
        $(this).closest('.dialog').hide().find('.cart').empty();
        return false;
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $(".dialog:visible").hide().find('.cart').empty();
        }
    });

    if (typeof tagcanvas != 'undefined') {
        initTagcanvas();
    }



    $(".cart_block_list").on('click', '.products .ajax_cart_block_remove_link', function () {
        var product_block = $(this).closest('dt');
        var shopping_cart = $(".shopping_cart");
        $.post(cart_url + 'delete/', {
            id: product_block.data('id')
        }, function (response) {
            if (response.status == 'ok') {
                product_block.remove();
                shopping_cart.find('.ajax_block_cart_total').html(response.data.total);
                shopping_cart.find('.ajax_cart_quantity').html(response.data.count);
                shopping_cart.find('.ajax_cart_discount').html(response.data.discount);
                $('#panel .cart .count').text(response.data.count);
                if (!response.data.count) {
                    shopping_cart.find('.ajax_cart_no_product').removeClass('unvisible');
                    shopping_cart.find('.ajax_cart_product_txt').addClass('unvisible');
                    shopping_cart.find('.ajax_cart_quantity').addClass('unvisible');
                    shopping_cart.find('.cart_block_no_products').show();
                    $('#panel .cart').attr('disabled', 'disabled');
                }
            }
        }, 'json');
        return false;
    });

});


jQuery(document).ready(function () {
    var IE = '\v' == 'v';
    // hide #back-top first
    jQuery("#back-top").hide();
    // fade in #back-top
    jQuery(function () {
        jQuery(window).scroll(function () {
            if (!IE) {
                if (jQuery(this).scrollTop() > 100) {
                    jQuery('#back-top').fadeIn();
                } else {
                    jQuery('#back-top').fadeOut();
                }
            }
            else {
                if (jQuery(this).scrollTop() > 100) {
                    jQuery('#back-top').show();
                } else {
                    jQuery('#back-top').hide();
                }
            }
        });

        // scroll body to 0px on click
        jQuery('#back-top a').click(function () {
            jQuery('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });

});



jQuery(function ($) {

    $(document).ready(function () {
        if (!is_floating_shopping_cart) {
            return false;
        }

        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > 250) {
                jQuery('#header .shopping_cart').addClass('floating');
            } else {
                jQuery('#header .shopping_cart').removeClass('floating');
            }
        });
    });
});


jQuery(function ($) {
    $(document).ready(function () {
        if (!is_autocomplete) {
            return false;
        }
        $('#search_query_top').autocomplete({
            delay: 500,
            minLength: 3,
            source: function (request, response) {
                request.term = request.term.replace(/^\s+|\s+$/g, '');
                var query = request.term.replace(/\s+/g, '+');
                $.ajax({
                    url: shop_search_url + '?query=' + encodeURIComponent(query),
                    type: "GET",
                    dataType: "html",
                    success: function (data) {
                        var items = $.map($(data).find('.product_list li:lt(' + 5 + ') .ajax_product_info'), function (item) {
                            return {
                                label: $(item).data('name'),
                                value: $(item).data('name'),
                                url: $(item).data('url'),
                                text: '<div>\
                                        <img src="' + $(item).data('img') + '" />\
                                        <span class="item-name">' + $(item).data('name') + '</span>\
                                        <span class="item-price">' + $(item).data('price') + '</span>\
                                        </div>'
                            }
                        });
                        if ($(data).find('.product_list li').length > 5) {
                            items[items.length] = {
                                label: '' + query,
                                value: '' + query,
                                url: shop_search_url + '?query=' + encodeURIComponent(query),
                                text: show_all_text
                            }
                        }

                        response(items);
                    }
                });
            },
            select: function (event, ui) {
                location.href = ui.item.url;
            }
        }).data("autocomplete")._renderMenu = function (ul, items) {
            $.each(items, function (index, item) {
                $('<li></li>')
                        .data('item.autocomplete', item)
                        .append('<a href="' + item.url + '">' + item.text + '</a>')
                        .appendTo(ul);
            });
        };
    });
});


jQuery(document).ready(function () {
    $('#newsletter_block_left .block_content div').css({
        'padding': 0,
        'width': 'auto'
    });
    $('#newsletter_block_left .block_content .wa-name').css({
        'width': 'auto',
        'float': 'none'
    });
    $('#newsletter_block_left .block_content .wa-value').css({
        'margin-left': '0'
    });


});



$(document).ready(function () {
    $(".tab-content ul>li.first-in-line").each(function () {
        $(this).before("<li class='clear'><span /></li>");
    })
    $("#htmlcontent_home").prependTo("#center_column");


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


    $(document).on('click', '.back', function (e) {
        e.preventDefault();
        history.back();
    });

});



function responsiveResize()
{
    var responsiveflag = false;

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
    var elementClick = '#header .current';
    var elementSlide = 'ul.toogle_content';
    var activeClass = 'active';

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
    var leftColumnBlocks = $('#left_column');
    if (status == 'enable') {
        $(leftColumnBlocks).remove();

        $(leftColumnBlocks).insertAfter('#center_column').find('#categories_block_left ul.block_content').slideToggle('fast');
        if (use_uniform) {
            $.uniform.update("#layered_form input[type='checkbox'], #layered_form input[type='radio'], select.form-control");
        }
        if (typeof (categoryReload) != 'undefined') {
            categoryReload()
        }

        $('#right_column .block:not(#layered_block_left) .title_block, #left_column .block:not(#layered_block_left) .title_block, #left_column #newsletter_block_left h4').on('click', function () {
            $(this).toggleClass('active').parent().find('.block_content').stop().slideToggle('medium');
        })
        $('#right_column, #left_column').addClass('accordion').find('.block:not(#layered_block_left) .block_content').slideUp('fast');
    } else {
        $(leftColumnBlocks).remove();

        $(leftColumnBlocks).insertBefore('#center_column');
        if (use_uniform) {
            $.uniform.update("#layered_form input[type='checkbox'], #layered_form input[type='radio'], select.form-control");
        }
        if (typeof (categoryReload) != 'undefined') {
            categoryReload()
        }
        $('#right_column .block:not(#layered_block_left) .title_block, #left_column .block:not(#layered_block_left) .title_block, #left_column #newsletter_block_left h4').removeClass('active').off().parent().find('.block_content').removeAttr('style').slideDown('fast');
        $('#left_column, #right_column').removeClass('accordion');
    }

}

function categoryReload() {
    function openBranch(jQueryElement, noAnimation)
    {
        jQueryElement.addClass('OPEN').removeClass('CLOSE');
        if (noAnimation)
            jQueryElement.parent().find('ul:first').show();
        else
            jQueryElement.parent().find('ul:first').slideDown();
    }

    function closeBranch(jQueryElement, noAnimation)
    {
        jQueryElement.addClass('CLOSE').removeClass('OPEN');
        if (noAnimation)
            jQueryElement.parent().find('ul:first').hide();
        else
            jQueryElement.parent().find('ul:first').slideUp();
    }

    function toggleBranch(jQueryElement, noAnimation)
    {
        if (jQueryElement.hasClass('OPEN'))
            closeBranch(jQueryElement, noAnimation);
        else
            openBranch(jQueryElement, noAnimation);
    }

    $('.column ul.tree.dhtml ul').parent().find("span.grower").remove();
    $('.column ul.tree.dhtml ul').prev().before("<span class='grower OPEN'> </span>");

    $('.column ul.tree.dhtml ul li:last-child, .column ul.tree.dhtml li:last-child').addClass('last');

    $('.column ul.tree.dhtml span.grower.OPEN').addClass('CLOSE').removeClass('OPEN').parent().find('ul:first').hide();
    $('.column ul.tree.dhtml').show();

    $('.column ul.tree.dhtml .selected').parents().each(function () {
        if ($(this).is('ul'))
            toggleBranch($(this).prev().prev(), true);
    });
    toggleBranch($('.column ul.tree.dhtml .selected').prev(), true);

    $('.column ul.tree.dhtml span.grower').click(function () {
        toggleBranch($(this));
    });
}
