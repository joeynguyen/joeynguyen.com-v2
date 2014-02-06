

$(document).ready(function() {

	// // Fly Turtle Fly!
	$turtle = $('#turtle');

	function moveTurtle() {
		$turtle.css('top', ( parseInt($turtle.css('top')) - 1) + 'px');
	}
	$turtleFly = setInterval(function() {
	  $turtlePosition = parseInt($turtle.css('top'));
	  moveTurtle();
	  if ($turtlePosition === 0) {
	    clearInterval($turtleFly);
	  }
	 // $('#alert2').text( $turtlePosition );

	}, 50);

	// Navigation links click scroll page
	navigationScroll();

	// Enable Navigation dropdown transformations
	menuTransform();

	// Check for current position of viewport on visit or page refresh
	$window_top = $(window).scrollTop();
	$parallaxBalloonHeight = $("#parallax-balloon").height();
	if ( $window_top >= $parallaxBalloonHeight ) {
		$menu.addClass("fixed");
	}

	// Scroll events handler
		
	$(window).on("scroll", function() {

		$window_top = $(window).scrollTop();

		// Enable Balloon Parallax scrolling
		parallaxScroll();

		// Hide navigation dropdown
		hideNavDropdown();

		// Show Skill Boxes
		showSkills();

		/* Testing window position variables */

		// $('#alert').text( $("#parallax-first").offset().top - $window_top - $(window).height() );
		// $('#alert2').text( $("#parallax-second").offset().top - $window_top - $(window).height() );

		/* Set Nav Menu to fixed position */
		if ( $window_top >= $parallaxBalloonHeight ) {
			$menu.addClass("fixed");
		}
		else {
			$menu.removeClass("fixed");	
		}

	});

	/* Portfolio carousel */
	$workSlideshow = $("#work-slideshow");
	$workImgs = $(".work-img");

	$workSlideshow.carousel();

	$workImgs.on( "click", function() {
		$carouselItem = $(this).attr('title');
		$carouselInner = $("#carousel-inner");

		if (isEmpty( $carouselInner )) {
			$carouselInner.load("work.html");
			$(document).ajaxSuccess(function () {
				$("#" + $carouselItem).addClass('active');
				$workSlideshow.slideDown(1200);
			});
		}
		else {
			$workSlideshow.slideDown(1800);
		}
	});

	$slideshowClose = $("#slideshow-controls-close");

	$slideshowClose.on("click", function(e) {
		$workSlideshow.slideUp(1200);
		return false;
	});

});

/////////////////////////
////// FUNCTIONS ////////
/////////////////////////

// Enable Balloon Parallax scrolling
function parallaxScroll(){
	$scrolled = $(window).scrollTop();
	$balloonA = $('#parallax-balloon-bg-a');
	$balloonB = $('#parallax-balloon-bg-b');
	$balloonC = $('#parallax-balloon-bg-c');
	$balloonD = $('#parallax-balloon-bg-d');

	$balloonA.css('top',(0-($scrolled*1))+'px');
	$balloonB.css('top',(0-($scrolled*1.75))+'px');
	$balloonC.css('top',(0-($scrolled*0.4))+'px');
	$balloonD.css('top',(0-($scrolled*0.2))+'px');
}

// Check if its content is empty
function isEmpty( el ) {
	return !$.trim( el.html() );
}

// Navigation links click scroll page
function navigationScroll() {
	$navLinks = $("#navigation-nav > li > a");
	$navLinks.each(function() {
		$(this).on("click", function (e) {
			$linkName = $(this).attr('id').split('-')[1];
			$pageSection = $("#page-" + $linkName).attr('id');
			$pageSectionPosition = $("#" + $pageSection).offset().top;
			$('html,body').animate({
				scrollTop: $pageSectionPosition - 20
			}, 1000);
			return false;
		});
	});
}

// Enable Navigation dropdown transformations
function menuTransform() {
	$navigationBar = $('#navigation-nav');
	$menu = $('#menu');
	$logoButton = $('#logoButton');

	$logoButton.on("click", function(e) {
		if ( $logoButton.hasClass('default') ){
			$logoButton.removeClass('default');
			$logoButton.addClass('active');
			$navigationBar.slideDown("slow");
			return false;
		}
		else if ( $logoButton.hasClass('active') ){
			$logoButton.removeClass('active');
			$logoButton.addClass('active-wide');
			$menu.addClass("wide");
			return false;
		}
		else if ( $logoButton.hasClass('active-wide') ) {
			$logoButton.removeClass('active-wide');
			$logoButton.addClass('default triggered');
			$navigationBar.slideUp(1200);			
			$menu.removeClass("wide");
			return false;
		}
	});
}

// Hide navigation dropdown
function hideNavDropdown() {
	$navigationBar = $('#navigation-nav');
	$menu = $('#menu');
	$logoButton = $('#logoButton');

	if ( ($window_top >= $parallaxBalloonHeight + 40) && ($logoButton.hasClass('active-wide')) && (!$logoButton.hasClass('triggered')) )  {
		$logoButton.removeClass('active-wide');
		$logoButton.addClass('default triggered');
		$navigationBar.slideUp(1200);
		$menu.removeClass("wide");				
	}
}

// Show Skill Boxes
function showSkills() {
    $skillBoxes = $("#page-skills .skill-box");
	$skillBoxes.each(function() {
		$boxCurrentPos = $(this).offset().top;
		if ( $window_top >= $boxCurrentPos - 550 ) {
			$(this).addClass("in");
		}
	});
}

Modernizr.load([
  // Presentational polyfills
  {
    // Logical list of things we would normally need
    test : Modernizr.touch,
    // Modernizr.load loads css and javascript by default
    nope : 'js/jquery.stellar.min.js',
    complete : function () {
      // Run this after everything in this group has downloaded
      // and executed, as well everything in all previous groups
      // Enable Parallax
      $.stellar({});
      // Hide Skill Boxes
      $skillBoxes = $("#page-skills .skill-box");
      $skillBoxes.addClass("fade");
      $(window).on("scroll", function() {
        /* Activate Skills Animation */
        if ( $window_top >= $parallaxBalloonHeight + 145 ) {
            $('.progress-bar').addClass('active');
            $('.progress-bar-label').addClass('active');
        }
        else {
            $('.progress-bar').removeClass('active');
            $('.progress-bar-label').removeClass('active');
        }
      });

    }
  }
]);