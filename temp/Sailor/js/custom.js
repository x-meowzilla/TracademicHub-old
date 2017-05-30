jQuery(document).ready(function($) {
    "use strict";

    // logo animation
    $(".box").hover(
        function() {
            // also try: animated shake
            $(this).find('.icon').addClass("animated fadeInDown");
            $(this).find('p').addClass("animated fadeInUp");
        },
        function() {
            $(this).find('.icon').removeClass("animated fadeInDown");
            $(this).find('p').removeClass("animated fadeInUp");
        }
    );

    // //stats
    // jQuery('.appear').appear();
    // var runOnce = true;
    // jQuery(".stats").on("appear", function(data) {
    //     var counters = {};
    //     var i = 0;
    //     if (runOnce) {
    //         jQuery('.number').each(function() {
    //             counters[this.id] = $(this).html();
    //             i++;
    //         });
    //         jQuery.each(counters, function(i, val) {
    //             //console.log(i + ' - ' +val);
    //             jQuery({
    //                 countNum: 0
    //             }).animate({
    //                 countNum: val
    //             }, {
    //                 duration: 3000,
    //                 easing: 'linear',
    //                 step: function() {
    //                     jQuery('#' + i).text(Math.floor(this.countNum));
    //                 }
    //             });
    //         });
    //         runOnce = false;
    //     }
    // });

    // //parallax
    // if ($('.parallax').length) {
    //     $(window).stellar({
    //         responsive: true,
    //         scrollProperty: 'scroll',
    //         parallaxElements: false,
    //         horizontalScrolling: false,
    //         horizontalOffset: 0,
    //         verticalOffset: 0
    //     });
    // }
});