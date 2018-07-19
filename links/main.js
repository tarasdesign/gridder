// JavaScript Document

$(document).ready(function(){
	'use strict';

	var points = true;
	var rgb = true;
	var format = 'letter';
	var vertical = true;
	var chained = false;
	var numberOfLines;
	
	var pageWidth;
	var pageHeight;
	var increment;
	var numberOfRows;
	var numberOfCols;
	var linesInHorizGutter;
	var linesInVertGutter;

	var horizGutter;
	var vertGutter;
	var rowHeight;
	var colWidth;

	var marginTop;
	var marginRight;
	var marginLeft;
	var marginBottomMin;
	
	var convPageWidth;
	var convPageHeight;
	var convMarginTop;
	var convMarginRight;
	var convMarginLeft;
	var convMarginBottom;
	var convMarginBottomMin;

	var scaledMarginTop;
	var scaledMarginRight;
	var scaledMarginLeft;
	var scaledMarginBottom;
	var scaledMarginBottomMin;
	var scaledPageWidth;
	var scaledPageHeight;
	
	updateLayout();
	drawCanvas();
	
	// WINDOW RESIZED
	
	$(window).resize(function() {
		drawCanvas();
	});
	
	// iOS Bug
	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		$('input').addClass('ios');
		$('.sizeGroup .data span').addClass('ios');
	}
	
	// LIMIT INPUT
	/*
	var maxChars = 4;

	$('input').keydown( function(){
		if ($(this).val().length >= maxChars) { 
			$(this).val($(this).val().substr(0, maxChars));
		}
	});
	
	$('input').keyup( function(){
		if ($(this).val().length >= maxChars) { 
			$(this).val($(this).val().substr(0, maxChars));
		}
	});
	*/

	// MOUSE CONTROL
	
	var pwPressed = false;
	var phPressed = false;
	var inPressed = false;
	var nrPressed = false;
	var ncPressed = false;
	var hgPressed = false;
	var vgPressed = false;
	var mtPressed = false;
	var mbPressed = false;
	var mlPressed = false;
	var mrPressed = false;
	
	$('.pageWidth').mousedown(function() {pwPressed = true;});
	$('.pageHeight').mousedown(function() {phPressed = true;});
	$('.increment').mousedown(function() {inPressed = true;});
	$('.numberOfRows').mousedown(function() {nrPressed = true;});
	$('.numberOfCols').mousedown(function() {ncPressed = true;});
	$('.linesInHorizGutter').mousedown(function() {hgPressed = true;});
	$('.linesInVertGutter').mousedown(function() {vgPressed = true;});
	$('.marginTop').mousedown(function() {mtPressed = true;});
	$('.marginBottom').mousedown(function() {mbPressed = true;});
	$('.marginLeft').mousedown(function() {mlPressed = true;});
	$('.marginRight').mousedown(function() {mrPressed = true;});
	
	var pwOutput = $('.pageWidth input');
	var phOutput = $('.pageHeight input');
	var inOutput = $('.increment input');
	var nrOutput = $('.numberOfRows input');
	var ncOutput = $('.numberOfCols input');
	var hgOutput = $('.linesInHorizGutter input');
	var vgOutput = $('.linesInVertGutter input');
	var mtOutput = $('.marginTop input');
	var mbOutput = $('.marginBottom input');
	var mlOutput = $('.marginLeft input');
	var mrOutput = $('.marginRight input');

	$(document).mouseup(function() {
		pwPressed = phPressed = inPressed = nrPressed = ncPressed = hgPressed = vgPressed = mtPressed = mbPressed = mlPressed = mrPressed = false;
		$('*').css({'user-select':'auto'});
	});
	
	var lastPosition = {};
	
	$(document).on('mousemove', function (event) {
		var pwValue = parseInt(pwOutput.val());
		var phValue = parseInt(phOutput.val());
		var inValue = parseInt(inOutput.val());
		var nrValue = parseInt(nrOutput.val());
		var ncValue = parseInt(ncOutput.val());
		var hgValue = parseInt(hgOutput.val());
		var vgValue = parseInt(vgOutput.val());
		var mtValue = parseInt(mtOutput.val());
		var mbValue = parseInt(mbOutput.val());
		var mlValue = parseInt(mlOutput.val());
		var mrValue = parseInt(mrOutput.val());
		
		var delta;
		var inc;
		
		// VERTICAL MOVEMENT
		
		// Page Height
		if ((typeof(lastPosition.x) !== 'undefined') && phPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.y - event.offsetY;
			if (delta > 0 && phValue < 10000) {
				phOutput.val(phValue + 1);
				if (chained) {chainWidth();}
				checkSizes();
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && phValue > 50) {
				phOutput.val(phValue - 1);
				if (chained) {chainWidth();}
				checkSizes();
				updateLayout();
				drawCanvas();
			}
		}
		
		// Increment		
		if ((typeof(lastPosition.x) !== 'undefined') && inPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.y - event.offsetY;
			if (delta > 0 && inValue < 50) {
				inOutput.val(inValue + 1);
				checkIncrement();
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && inValue > 4) {
				inOutput.val(inValue - 1);
				checkIncrement();
				updateLayout();
				drawCanvas();
			}
		}
		
		// Number of Rows
		if ((typeof(lastPosition.x) !== 'undefined') && nrPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.y - event.offsetY;
			if (delta > 0 && nrValue < 16) {
				nrOutput.val(nrValue + 1);
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && nrValue > 1) {
				nrOutput.val(nrValue - 1);
				updateLayout();
				drawCanvas();
			}
		}
		
		// Horizontal Gutter
		if ((typeof(lastPosition.x) !== 'undefined') && hgPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.y - event.offsetY;
			if (delta > 0 && hgValue < 8) {
				hgOutput.val(hgValue + 1);
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && hgValue > 0) {
				hgOutput.val(hgValue - 1);
				updateLayout();
				drawCanvas();
			}
		}
		
		// Margin Top
		if ((typeof(lastPosition.x) !== 'undefined') && mtPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.y - event.offsetY;
			if (points) {
				inc = parseInt($('.increment input').val());
			} else {
				inc = 1;
			}
			if (delta > 0 && mtValue < 1000) {
				mtOutput.val(mtValue + inc);
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && mtValue > 0) {
				mtOutput.val(mtValue - inc);
				updateLayout();
				drawCanvas();
			}
		}
		
		// Margin Bottom
		if ((typeof(lastPosition.x) !== 'undefined') && mbPressed) {
			$('*').css({'user-select':'none'});
			if (points) {
				inc = parseInt($('.increment input').val());
			} else {
				inc = 1;
			}
			delta = lastPosition.y - event.offsetY;
			if (delta > 0 && mbValue < 1000) {
				mbOutput.val(mbValue + inc);
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && mbValue > 0) {
				mbOutput.val(mbValue - inc);
				updateLayout();
				drawCanvas();
			}
		}
		
		// HORIZONTAL MOVEMENT
		
		// Page Width
		if ((typeof(lastPosition.x) !== 'undefined') && pwPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.x - event.offsetX;
			if (delta > 0 && pwValue > 100) {
				pwOutput.val(pwValue - 1);
				if (chained) {chainHeight();}
				checkSizes();
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && pwValue < 10000) {
				pwOutput.val(pwValue + 1);
				if (chained) {chainHeight();}
				checkSizes();
				updateLayout();
				drawCanvas();
			}
		}
		
		// Number of Columns
		if ((typeof(lastPosition.x) !== 'undefined') && ncPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.x - event.offsetX;
			if (delta > 0 && ncValue > 1) {
				ncOutput.val(ncValue - 1);
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && ncValue < 16) {
				ncOutput.val(ncValue + 1);
				updateLayout();
				drawCanvas();
			}
		}
		
		// Vertical Gutter
		if ((typeof(lastPosition.x) !== 'undefined') && vgPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.x - event.offsetX;
			if (delta > 0 && vgValue > 0) {
				vgOutput.val(vgValue - 1);
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && vgValue < 8) {
				vgOutput.val(vgValue + 1);
				updateLayout();
				drawCanvas();
			}
		}
		
		// Margin Left
		if ((typeof(lastPosition.x) !== 'undefined') && mlPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.x - event.offsetX;
			if (delta > 0 && mlValue > 0) {
				mlOutput.val(mlValue - 1);
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && mlValue < 1000) {
				mlOutput.val(mlValue + 1);
				updateLayout();
				drawCanvas();
			}
		}
		
		// Margin Right
		if ((typeof(lastPosition.x) !== 'undefined') && mrPressed) {
			$('*').css({'user-select':'none'});
			delta = lastPosition.x - event.offsetX;
			if (delta > 0 && mrValue > 0) {
				mrOutput.val(mrValue - 1);
				updateLayout();
				drawCanvas();
			} else if (delta < 0 && mrValue < 1000) {
				mrOutput.val(mrValue + 1);
				updateLayout();
				drawCanvas();
			}
		}
		
		lastPosition = {x: event.offsetX, y: event.offsetY};
	});
	
	// FORMAT TYPE CHANGED
		
	$('.defaultFormats li:not(.orient)').click(function() {
		
		format = $(this).text();
		format = format.toLowerCase();
		setFormatButtonColors();
		var w;
		var h;
		
		// Vert
		
		if (format === 'letter') {
			w = 612;
			h = 792;
			if (!points) {
				gotoPt();
			}
		} else if (format === 'legal') {
			w = 612;
			h = 1008;
			if (!points) {
				gotoPt();
			}
		} else if (format === 'a4') {
			w = 210;
			h = 297;
			if (points) {
				gotoMm();
			}
		} else if (format === 'a3') {
			w = 297;
			h = 420;
			if (points) {
				gotoMm();
			}
		}
		
		// Horiz
		if (!vertical) {
			var wConverted = w;
			w = h;
			h = wConverted;
		}
		
		$('.pageWidth input').val(w);
		$('.pageHeight input').val(h);
		updateLayout();
		drawCanvas();
	});
		
	// SIZE CHANGED
	$('.sizeGroup .data input').bind('keyup change', function() {
		var data = $(this).val();
		if (parseFloat(data) >= 100 && parseFloat(data) < 10000) {
			$(this).removeClass('error');
			
			// Chain
			if (chained) {
				if ($(this).hasClass('w')) {chainHeight();}
				else if ($(this).hasClass('h')) {chainWidth();}
			}
			checkSizes();
			updateLayout();
			drawCanvas();
		} else {
			$(this).addClass('error');
		}
	});
	
	// Chain Height to Width
	function chainHeight() {
		var newW = parseFloat($('.pageWidth input').val());
		var oldH = parseFloat($('.pageHeight input').val());
		var oldW = pageWidth;
		var newH = (newW * oldH) / oldW;
		$('.pageHeight input').val(Math.round(newH));
	}
	
	// Chain Width to Height
	function chainWidth() {
		var oldW = parseFloat($('.pageWidth input').val());
		var newH = parseFloat($('.pageHeight input').val());
		var oldH = pageHeight;
		var newW = (newH * oldW) / oldH;
		$('.pageWidth input').val(Math.round(newW));
	}
	
	// Check Sizes
	function checkSizes() {
		var w = parseFloat($('.pageWidth input').val());
		var h = parseFloat($('.pageHeight input').val());
		
		if (((w === 612 && h === 792) || (w === 792 && h === 612)) && points) {
			format = 'letter';
		} else if (((w === 612 && h === 1008) || (w === 1008 && h === 612)) && points) {
			format = 'legal';
		} else if (((w === 210 && h === 297) || (w === 297 && h === 210)) && !points) {
			format = 'a4';
		} else if (((w === 297 && h === 420) || (w === 420 && h === 297)) && !points) {
			format = 'a3';
		} else {
			format = 'custom';
		}
		
		setFormatButtonColors();
		
		// Orientation
		if (w < h) {
			// Vert
			$('.orient').removeClass('selected');
			vertical = true;
		} else {
			// Horiz
			$('.orient').addClass('selected');
			vertical = false;
		}
	}
	
	function setFormatButtonColors() {
		$('.defaultFormats li:not(.orient)').removeClass('selected');
		if (format === 'letter') {
			$('.letter').addClass('selected');
		} else if (format === 'legal') {
			$('.legal').addClass('selected');
		} else if (format === 'a4') {
			$('.a4').addClass('selected');
		} else if (format === 'a3') {
			$('.a3').addClass('selected');
		}
	}
		
	// Chain Button
	$('.chain').click(function() {
		
		if ($(this).hasClass('selected')) {
			// unchain
			chained = false;
			$('.chain').removeClass('selected');
		} else {
			// chain
			chained = true;
			$('.chain').addClass('selected');
		}
	});
	
	// Question Button
	$('.question').click(function() {
		
		if ($(this).hasClass('selected')) {
			// hide guide
			$('.question').removeClass('selected');
			$('.guide').removeClass('selected');
		} else {
			// show guide
			chained = true;
			$('.question').addClass('selected');
			$('.guide').addClass('selected');
		}
	});
	
	// Hide guide if click outside
	
	$(document).mouseup(function (e) {
		var container = $('.question');
		
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			$('.question').removeClass('selected');
			$('.guide').removeClass('selected');
		}
	});
	
	// MARGIN HIGHLIGHT
	
	highlightMargins();
	
	function highlightMargins() {
		
		function highlightTop() {
			$('.marginHighlight').css({'width': '100%'});
			$('.marginHighlight').css({'height': scaledMarginTop});
			$('.marginHighlight').css({'top': '0'});
			$('.marginHighlight').css({'left': '0'});
			$('.marginHighlight').css({'display': 'block'});
		}
		function highlightRight() {
			$('.marginHighlight').css({'width': scaledMarginRight});
			$('.marginHighlight').css({'height': scaledPageHeight});
			$('.marginHighlight').css({'top': '0'});
			$('.marginHighlight').css({'left': scaledPageWidth - scaledMarginRight});
			$('.marginHighlight').css({'display': 'block'});
		}
		function highlightLeft() {
			$('.marginHighlight').css({'width': scaledMarginLeft});
			$('.marginHighlight').css({'height': scaledPageHeight});
			$('.marginHighlight').css({'top': '0'});
			$('.marginHighlight').css({'left': '0'});
			$('.marginHighlight').css({'display': 'block'});
		}
		function highlightBottomMin() {
			$('.marginHighlight').css({'width': '100%'});
			$('.marginHighlight').css({'height': scaledMarginBottomMin});
			$('.marginHighlight').css({'top': scaledPageHeight - scaledMarginBottomMin});
			$('.marginHighlight').css({'left': '0'});
			$('.marginHighlight').css({'display': 'block'});
		}
		function highlightBottom() {
			$('.marginHighlight').css({'width': '100%'});
			$('.marginHighlight').css({'height': scaledMarginBottom});
			$('.marginHighlight').css({'top': scaledPageHeight - scaledMarginBottom});
			$('.marginHighlight').css({'left': '0'});
			$('.marginHighlight').css({'display': 'block'});
		}
		
		$('.marginTop input').bind('mouseover keyup change', function() { highlightTop(); });
		$('.marginTop').mouseover(function() { highlightTop(); });
		$('.marginRight input').bind('mouseover keyup change', function() { highlightRight(); });
		$('.marginRight').mouseover(function() { highlightRight(); });
		$('.marginLeft input').bind('mouseover keyup change', function() { highlightLeft(); });
		$('.marginLeft').mouseover(function() { highlightLeft(); });
		$('.marginBottom input').bind('mouseover keyup change', function() { highlightBottomMin(); });
		$('.marginBottom').mouseover(function() { highlightBottomMin(); });
		$('.finalMarginBottom').mouseover(function() { highlightBottom(); });
		
		$('.data').mouseleave(function() {
			$('.marginHighlight').css({'display':'none'});
		});
		
		$('.finalMarginBottom').mouseleave(function() {
			$('.marginHighlight').css({'display':'none'});
		});
	}
		
	// VALUE CHANGED: Increment
	$('.increment input').bind('keyup change', function() {
		var inc = $(this).val();								
		if (parseInt(inc) >= 4 &&
			parseInt(inc) < 100 &&
			parseInt(inc) === parseFloat(inc)) {
			checkIncrement();
			$(this).removeClass('error');
			updateLayout();
			drawCanvas();
		} else {
			$(this).addClass('error');
		}
	});
	
	function checkIncrement() {
		var inc = $('.increment input').val();
		if (points) {
			var newMarginTop = inc * marginTop / increment;
			var newMarginBottom = inc * marginBottomMin / increment;
			$('.marginTop input').val(newMarginTop);
			$('.marginTop input').attr('step', inc);
			$('.marginBottom input').val(newMarginBottom);
			$('.marginBottom input').attr('step', inc);
		} else {
			$('.marginTop input').attr('step', '1');
			$('.marginBottom input').attr('step', '1');
		}
	}

	// VALUE CHANGED: Margin Top
	$('.marginTop input').bind('keyup change', function() {
		var m = $('.marginTop input').val();
		var inc = $('.increment input').val();
		var ratio = parseFloat(m) / parseFloat(inc);
		
		if (parseInt(m) >= 0 &&
			parseInt(m) < 1000 &&
			parseInt(m) === parseFloat(m) &&
			parseInt(inc) >= 4 && parseInt(inc) < 1000 &&
			parseInt(inc) === parseFloat(inc) &&
			parseInt(ratio) === parseFloat(ratio) && points) {
			$(this).removeClass('error');
			updateLayout();
			drawCanvas();
			
		} else if (parseInt(m) >= 0 && parseInt(m) < 1000 && !points) {
			$(this).removeClass('error');
			updateLayout();
			drawCanvas();
			
		} else {
			$(this).addClass('error');
		}
	});
	
	// VALUE CHANGED: Margin Bottom
	$('.marginBottom input').bind('keyup change', function() {
		var m = $('.marginBottom input').val();
		var inc = $('.increment input').val();
		var ratio = parseFloat(m) / parseFloat(inc);
		
		if (parseInt(m) >= 0 &&
			parseInt(m) < 1000 &&
			parseInt(m) === parseFloat(m) &&
			parseInt(inc) >= 4 && parseInt(inc) < 1000 &&
			parseInt(inc) === parseFloat(inc) &&
			parseInt(ratio) === parseFloat(ratio) && points) {
			$(this).removeClass('error');
			updateLayout();
			drawCanvas();
			
		} else if (parseInt(m) >= 0 && parseInt(m) < 1000 && !points) {
			$(this).removeClass('error');
			updateLayout();
			drawCanvas();
			
		} else {
			$(this).addClass('error');
		}
	});

	// VALUE CHANGED: Margin Left & Right
	$('.sideMargin input').bind('keyup change', function() {
		var m = $(this).val();
		if (parseInt(m) >= 0 && parseInt(m) < 1000) {
			$(this).removeClass('error');
			updateLayout();
			drawCanvas();
		} else {
			$(this).addClass('error');
		}
	});
	
	// VALUE CHANGED: Layout Integers
	$('.integer input').bind('keyup change', function() {
		var data = $(this).val();
		if (parseInt(data) >= 1 &&
			parseInt(data) <= 16 &&
			parseInt(data) === parseFloat(data)) {
			$(this).removeClass('error');
			updateLayout();
			drawCanvas();
		} else {
			$(this).addClass('error');
		}
	});

	// VALUE CHANGED: Gutter Integers
	$('.gutterInteger input').bind('keyup change', function() {
		var data = $(this).val();
		if (parseInt(data) >= 0 &&
			parseInt(data) <= 16 &&
			parseInt(data) === parseFloat(data)) {
			$(this).removeClass('error');
			updateLayout();
			drawCanvas();
		} else {
			$(this).addClass('error');
		}
	});
	
	// COLOR TOGGLE
	
	$('.color').click(function() {
		
		if ($(this).hasClass('selected')) {
			// from cmy to rgb
			rgb = true;
			$('.color').removeClass('selected');
			$('.color span').text('rgb');
		} else {
			// from rgb to cmy
			rgb = false;
			$('.color').addClass('selected');
			$('.color span').text('cmy');
		}
	});

	// UNIT TOGGLE
	
	$('.unit').click(function() {
		
		var w = $('.pageWidth input').val();
		var h = $('.pageHeight input').val();

		if ($(this).hasClass('selected')) {
			w = (Math.round(w * 1000 * 2.83464567))/1000;
			h = (Math.round(h * 1000 * 2.83464567))/1000;
			gotoPt();
		} else {
			w = (Math.round(w * 1000 / 2.83464567))/1000;
			h = (Math.round(h * 1000 / 2.83464567))/1000;			
			gotoMm();
		}
		
		$('.pageWidth input').val(w);
		$('.pageHeight input').val(h);
		
		updateLayout();
		drawCanvas();
	});
	
	// GO TO MM
	
	function gotoMm() {
		
		var t = parseFloat($('.marginTop input').val());
		var r = parseFloat($('.marginRight input').val());
		var l = parseFloat($('.marginLeft input').val());
		var b = parseFloat($('.marginBottom input').val());
		
		t = Math.round(t / 2.83464567);
		r = Math.round(r / 2.83464567);
		l = Math.round(l / 2.83464567);
		b = Math.round(b / 2.83464567);
		
		$('.marginTop input').val(t);
		$('.marginRight input').val(r);
		$('.marginLeft input').val(l);
		$('.marginBottom input').val(b);
		$('.marginTop input').attr('step', 1);
		$('.marginBottom input').attr('step', 1);
		
		$('.unit').addClass('selected');
		$('.unit span').text('mm');
		points = false;
	}
	
	// GO TO POINTS
	
	function gotoPt() {
		
		var t = parseFloat($('.marginTop input').val());
		var r = parseFloat($('.marginRight input').val());
		var l = parseFloat($('.marginLeft input').val());
		var b = parseFloat($('.marginBottom input').val());
		
		t = Math.round(t * 2.83464567);
		r = Math.round(r * 2.83464567);
		l = Math.round(l * 2.83464567);
		b = Math.round(b * 2.83464567);
		
		t = Math.round(t / increment) * increment;
		b = Math.round(b / increment) * increment;

		$('.marginTop input').val(t);
		$('.marginRight input').val(r);
		$('.marginLeft input').val(l);
		$('.marginBottom input').val(b);
		$('.marginTop input').attr('step', increment);
		$('.marginBottom input').attr('step', increment);
		
		$('.unit').removeClass('selected');
		$('.unit span').text('pt');
		points = true;
	}		
	
	// ORIENTATION CHANGED
	
	$('.orient').click(function() {
		
		var w = $('.pageWidth input').val();
		var h = $('.pageHeight input').val();
		$('.pageWidth input').val(h);
		$('.pageHeight input').val(w);

		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
			vertical = true;
		} else {
			$(this).addClass('selected');
			vertical = false;
		}
	
		updateLayout();
		drawCanvas();
	});	
	
	// ERROR CORRECTION
	
	$('input').focusout(function() {
		errorCorrection();
	});
	
	function errorCorrection() {
		
		if ($('.pageWidth input').hasClass('error') && !$('.pageWidth input').is(':focus')) {
			$('.pageWidth input').val(pageWidth);
		}

		if ($('.pageHeight input').hasClass('error') && !$('.pageHeight input').is(':focus')) {
			$('.pageHeight input').val(pageHeight);
		}		

		if ($('.increment input').hasClass('error') && !$('.increment input').is(':focus')) {
			$('.increment input').val(increment);
		}

		if ($('.numberOfRows input').hasClass('error') && !$('.numberOfRows input').is(':focus')) {
			$('.numberOfRows input').val(numberOfRows);
		}		

		if ($('.numberOfCols input').hasClass('error') && !$('.numberOfCols input').is(':focus')) {
			$('.numberOfCols input').val(numberOfCols);
		}

		if ($('.linesInHorizGutter input').hasClass('error') && !$('.linesInHorizGutter input').is(':focus')) {
			$('.linesInHorizGutter input').val(linesInHorizGutter);
		}		

		if ($('.linesInVertGutter input').hasClass('error') && !$('.linesInVertGutter input').is(':focus')) {
			$('.linesInVertGutter input').val(linesInVertGutter);
		}

		if ($('.marginTop input').hasClass('error') && !$('.marginTop input').is(':focus')) {
			$('.marginTop input').val(marginTop);
		}
		
		if ($('.marginBottom input').hasClass('error') && !$('.marginBottom input').is(':focus')) {
			$('.marginBottom input').val(marginBottomMin);
		}
		
		if ($('.marginRight input').hasClass('error') && !$('.marginRight input').is(':focus')) {
			$('.marginRight input').val(marginRight);
		}
		
		if ($('.marginLeft input').hasClass('error') && !$('.marginLeft input').is(':focus')) {
			$('.marginLeft input').val(marginLeft);
		}
		
		$('input').removeClass('error');
	}
		
	// GENERATE SECTIONS
	
	function generateSections() {
		$('.column').remove();
		$('.lineContainer').remove();
		$('.line').remove();
		$('.marginHighlight').remove();
		
		convertToPoints();
		
		numberOfRows = $('.numberOfRows input').val();
		numberOfCols = $('.numberOfCols input').val();
		
		for(var c = 0; c < numberOfCols; c++) {
			$('.sectionContainer').append("<div class='column'></div>");
		}
		
		for(var r = 0; r < numberOfRows; r++) {
			$('.column').append("<div class='section'></div>");
		}
		
		$('.canvas').append("<div class='lineContainer'></div>");
		
		if (points) {
			numberOfLines = convPageHeight / increment;
		} else {
			numberOfLines = (convPageHeight - convMarginTop) / increment;
		}
			
		for(var l = 0; l < numberOfLines; l++) {
			$('.lineContainer').append("<div class='line'></div>");
		}
		
		$('.canvas').append("<div class='marginHighlight'></div>");
		
		// Chess-board style
		var light = $('.section').css('opacity');
		var dark = 0.25;
		if ($('.linesInHorizGutter input').val() === '0' && $('.linesInVertGutter input').val() === '0') {
			$('.column:nth-child(even) .section:nth-child(odd), .column:nth-child(odd) .section:nth-child(even)').css({'opacity': dark});
		} else if ($('.linesInHorizGutter input').val() === '0') {
			$('.section:nth-child(even)').css({'opacity': dark});
		} else if ($('.linesInVertGutter input').val() === '0') {
			$('.column:nth-child(even) .section').css({'opacity': dark});
		} else {
			$('.section').css({'opacity': light});
		}
		
	}

	// CONVERT TO POINTS
	
	function convertToPoints() {
		pageWidth = parseFloat($('.pageWidth input').val());
		pageHeight = parseFloat($('.pageHeight input').val());
		marginTop = parseFloat($('.marginTop input').val());
		marginRight = parseFloat($('.marginRight input').val());
		marginLeft = parseFloat($('.marginLeft input').val());
		marginBottomMin = parseFloat($('.marginBottom input').val());
		
		if (!points) {
			convPageWidth = pageWidth * 2.83464567;
			convPageHeight = pageHeight * 2.83464567;
			convMarginTop = marginTop * 2.83464567;
			convMarginRight = marginRight * 2.83464567;
			convMarginLeft = marginLeft * 2.83464567;
			convMarginBottomMin = marginBottomMin * 2.83464567;
		} else {
			convPageWidth = pageWidth;
			convPageHeight = pageHeight;
			convMarginTop = marginTop;
			convMarginRight = marginRight;
			convMarginLeft = marginLeft;
			convMarginBottomMin = marginBottomMin;
		}
	}
	
	// UPDATE LAYOUT
	
	function updateLayout() {
		
		var isInteger = false;
		var linesAvailable;

		numberOfRows = parseFloat($('.numberOfRows input').val());
		linesInHorizGutter = parseFloat($('.linesInHorizGutter input').val());
		linesInVertGutter = parseFloat($('.linesInVertGutter input').val());
		increment = parseFloat($('.increment input').val());	
		horizGutter = parseFloat(linesInHorizGutter) * increment;
		vertGutter = parseFloat(linesInVertGutter) * increment;
		
		convertToPoints();
		generateSections();

		// Calculations
				
		var cutOff;
		if (points) {
			cutOff = convPageHeight % increment;
		} else {
			cutOff = (convPageHeight - convMarginTop) % increment;
		}
				
		function calculate() {
			
			if (points) {
				convMarginBottom = convMarginBottomMin + cutOff;
			} else {
				convMarginBottom = Math.round(convMarginBottomMin / increment) * increment + cutOff;
			}

			linesAvailable = (convPageHeight - convMarginTop - convMarginBottom) / increment;
		    rowHeight = (linesAvailable * increment - (numberOfRows - 1) * increment * linesInHorizGutter) / numberOfRows;
		    isInteger = Math.floor(rowHeight/increment) === rowHeight/increment;
		}
				
		while (!isInteger) {
		    calculate();
		    if (!isInteger) {
		        cutOff = cutOff + increment;
			}
		}
		
		colWidth = (convPageWidth - convMarginLeft - convMarginRight - vertGutter * (numberOfCols - 1)) / numberOfCols;
	}
	
	// DRAW CANVAS AND ALIGN
	
	function drawCanvas() {
		
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		// Aligning
		
		var canvasMarginTop;
		var canvasMarginLeft;
		var bodyHeight;
		
		if (windowWidth > 760) {
			
			// DESKTOP			
			if (((convPageHeight * windowWidth) / (convPageWidth * 2)) < windowHeight * 3 / 5) {
				// Fixed Width
				scaledPageWidth = windowWidth / 2;
				scaledPageHeight = convPageHeight * scaledPageWidth / convPageWidth;
			} else {
				// Fixed Height
				scaledPageHeight = windowHeight * 3 / 5;
				scaledPageWidth = convPageWidth * scaledPageHeight / convPageHeight;
			}
			canvasMarginTop = windowHeight * 0.2 - 20;
			canvasMarginLeft = (windowWidth - 280)/2 + 280 - scaledPageWidth/2;
			bodyHeight = windowHeight - 20;
			
		} else {
			
			// TABLET
			if (convPageHeight > convPageWidth) {
				// Vert
				scaledPageWidth = windowWidth * 2 / 3;
				scaledPageHeight = convPageHeight * scaledPageWidth / convPageWidth;
				canvasMarginLeft = windowWidth / 6;
			} else {
				// Horiz
				scaledPageWidth = windowWidth - 80;
				scaledPageHeight = convPageHeight * scaledPageWidth / convPageWidth;
				canvasMarginLeft = 40;
			}
			
			canvasMarginTop = 500;
			bodyHeight = scaledPageHeight + canvasMarginTop + 100;
			
			if (windowWidth < 580) {
				// MOBILE
				canvasMarginTop = 800;
				bodyHeight = scaledPageHeight + canvasMarginTop + 100;
			}
		}
		
		$('.canvas').css({'top': canvasMarginTop});
		$('.canvas').css({'left': canvasMarginLeft});
		$('body').css({'height': bodyHeight});
		
		// Scaling
		
		var scaledIncrement = increment * scaledPageHeight / convPageHeight;
		var scaledHorizGutter = horizGutter * scaledPageHeight / convPageHeight;
		var scaledVertGutter = vertGutter * scaledPageHeight / convPageHeight;
		var scaledRowHeight = rowHeight * scaledPageHeight / convPageHeight;
		var scaledColWidth = colWidth * scaledPageHeight / convPageHeight;
		
		scaledMarginTop = convMarginTop * scaledPageHeight / convPageHeight;
		scaledMarginRight = convMarginRight * scaledPageHeight / convPageHeight;
		scaledMarginLeft = convMarginLeft * scaledPageHeight / convPageHeight;
		scaledMarginBottom = convMarginBottom * scaledPageHeight / convPageHeight;
		scaledMarginBottomMin = convMarginBottomMin * scaledPageHeight / convPageHeight;
		
		// Scaled Result
		
		$('.canvas').css({'width': scaledPageWidth});
		$('.canvas').css({'height': scaledPageHeight});
		$('.section').css({'width': scaledColWidth});
		$('.section').css({'height': scaledRowHeight});
		$('.column').css({'margin-left': scaledVertGutter});
		$('.column:first-child').css({'margin-left': 0});
		$('.section').css({'margin-bottom': scaledHorizGutter});
		$('.sectionContainer').css({'margin-top': scaledMarginTop});
		$('.sectionContainer').css({'margin-left': scaledMarginLeft});
		$('.line').css({'margin-bottom': scaledIncrement - 1});
		
		if (points) {
			$('.lineContainer').css({'margin-top': 0});
		} else {
			$('.lineContainer').css({'margin-top': scaledMarginTop});
		}
		
		// Bottom margin Label Value
		
		var value;
		if (points) {
			value = (Math.round(convMarginBottom * 1000))/1000;
		} else {
			value = (Math.round(convMarginBottom * 1000 / 2.83464567))/1000;
		}
		$('.finalMarginBottom').text(value);
		
		// Highlight Margins
		highlightMargins();
	}
	
	// DOWNLOAD PDF
	
	$('.block.download').click(function(){
		
		/*
		https://github.com/MrRio/jsPDF
		
		var doc = new jsPDF(orientation, unit, format)
		orientation: 'p', 'l'
		unit: 'mm', 'cm', 'pt', 'in'
		format: 'a5', 'a4', 'a3', 'letter', 'legal', [w,h]
		
		doc.setLineWidth(0.1);
		doc.setDrawColor(0, 255, 255); // RGB
		doc.setDrawColor(100, 0, 0, 0); // CMYK
		doc.line(x1, y1, x2, y2);
		
		*/
		
		var orientation;
				
		if (vertical) {
			orientation = 'p';
		} else {
			orientation = 'l';
		}
		
		if (format === 'custom') {	
			format = [convPageWidth, convPageHeight];
		}
		
		var doc = new jsPDF(orientation, 'pt', format);

		// Blue 0.25
		doc.setLineWidth(0.25);
		if (rgb) {
			doc.setDrawColor(0, 255, 255);
		} else {
			doc.setDrawColor(100, 0, 0, 0);
		}
		
		// Baselines
		var m;
		if (points) {
			m = 0;
		} else {
			m = convMarginTop;
		}
		
		for (var i = 0; i <= numberOfLines; i++) {
			doc.line(0, i * increment + m, convPageWidth, i * increment + m);
		}
		
		// Pink 0.5
		doc.setLineWidth(0.5);
		if (rgb) {
			doc.setDrawColor(255, 0, 255);
		} else {
			doc.setDrawColor(0, 100, 0, 0);
		}
		
		// Margin Top
		doc.line(0, convMarginTop, convPageWidth, convMarginTop);
		
		// Margin Bottom
		doc.line(0, convPageHeight - convMarginBottom, convPageWidth, convPageHeight - convMarginBottom);
		
		// Margin Left
		doc.line(convMarginLeft, 0, convMarginLeft, convPageHeight);

		// Margin Right
		doc.line(convPageWidth - convMarginRight, 0, convPageWidth - convMarginRight, convPageHeight);

		// Horiz Gutters
		var hg = linesInHorizGutter * increment;
		
		for(var a = 1; a < numberOfRows; a++) {
			var y = convMarginTop + (rowHeight * a) + hg * (a - 1);
			doc.line(convMarginLeft, y, convPageWidth - convMarginRight, y);
			if ($('.linesInHorizGutter input').val() !== '0') {
				doc.line(convMarginLeft, y + hg, convPageWidth - convMarginRight, y + hg);
			}
		}

		// Vert Gutters
		var vg = linesInVertGutter * increment;
		
		for(var b = 1; b < numberOfCols; b++) {
			var x = convMarginLeft + (colWidth * b) + vg * (b - 1);
			doc.line(x, convMarginTop, x, convPageHeight - convMarginBottom);
			if ($('.linesInVertGutter input').val() !== '0') {
				doc.line(x + vg, convMarginTop, x + vg, convPageHeight - convMarginBottom);
			}
		}		
		
		// File Name
		var fileName;
		var formatName;
		var unitName;
		if (format === 'letter') {	
			formatName = 'Letter';
		} else if (format === 'legal') {	
			formatName = 'Legal';
		} else if (format === 'a4') {	
			formatName = 'A4';
		} else if (format === 'a3') {	
			formatName = 'A3';
		} else {
			if (points) {unitName = 'pt';} else {unitName = 'mm';}
			formatName = pageWidth + 'x' + pageHeight + unitName;
		}

		fileName = 'Template_' + formatName + '.pdf';
		
		doc.save(fileName);
	});


});
