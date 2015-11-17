$(document).ready(function() {

	// CLICKS //
	// BALISE <a>
	// @LINK https://docs.google.com/document/d/1o8-w0ccGAgqXR63BmU5dodvn7pIJk44umtgo25erZgY/edit#heading=h.rhr4yv3oh36p

	console.log("• Loading : ", "icon-wait-on-click");

	var disableAllIconWait = function() {
		$('body .fa-spin').each(function() {
			$(this).removeClass('fa-spin');
			if($(this).data('oldIcon').length) {
				$(this).removeClass().addClass($(this).data('oldIcon'));
			}
		});
	}

	$('body').on('click', "a, button, [type='submit']", function(event) {
		// icon wait on click
		$(this).find('.icon-wait-on-click').each(function() {
			$turningIcon = $(this).attr('data-icon-wait');
			if($turningIcon == undefined) $turningIcon = 'fa-refresh';
			// annule les autres actions si existantes
			disableAllIconWait();
			// mémorise ancien icone
			$(this).data('oldIcon', $(this).attr('class').toString());
			if($turningIcon != '_self') {
				$(this).removeClass().addClass('fa '+$turningIcon+' fa-spin');
			} else {
				$(this).addClass('fa-spin');
			}
		});
	});

	$('body').on('click', '.cancel-all-icon-wait-on-click', function(event) {
		disableAllIconWait();
	})

});