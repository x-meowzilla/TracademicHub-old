jQuery(document).ready(function ($) {
    "use strict";

    // logo animation
    $(".app-container").hover(
        function () {
            // also try: animated shake
            $(this).find('.app-icon').addClass("animated fadeInDown");
            $(this).find('p').addClass("animated fadeInUp");
        },
        function () {
            $(this).find('.app-icon').removeClass("animated fadeInDown");
            $(this).find('p').removeClass("animated fadeInUp");
        }
    );

});
