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
        c.html(response);
        if (c.find('ul.menu-h').length) {
            document.location.href = url;
            $(".dialog:visible").hide().find('.cart').empty();
            return false;
        }
        initFormControl();
        initDialogHendler(d, url);
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

$(document).ready(function () {

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
                shopping_cart.find('.ajax_block_shopping_cart').html(response.data.total);
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
                                text: 'Показать все'
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