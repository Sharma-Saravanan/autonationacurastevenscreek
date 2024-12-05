/*	US2855 AutoNation Accordant Media Pixel Tracking */
(function ($, DDC) {
	"use strict";

	var $header = $('.page-header.responsive-centered-nav.prox-header'),
		$proxWidget = $header.find('.contact-info-proximity'),

	contactInfoNameSplit = function () {
		$header.find('.org').each(function () {
			var	autonationTitle = $(this).text().substring(0,14),
				dealernameTitle = $(this).text().substring(15),
				newTitle = autonationTitle + '<br />' + dealernameTitle;

			$(this).html(newTitle);

		});
		$proxWidget.removeClass('hide');
	}

	$(document).ready(function () {
		contactInfoNameSplit();
	});

}(jQuery, window.DDC));
