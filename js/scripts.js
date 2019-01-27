(function ( $ ){
	/* Animate nav */
	var $currentband = $('<div class="current-band" />');
	var $current = $('.navigation ul li.active');
	var position, left, width;
	
	$('.navigation').prepend($currentband);
	
	 moveCurrentBand($current);
	
	$(".navigation ul li").mouseenter(
		function(){
			moveCurrentBand($(this));		
	}).mouseleave(
		function(){
			if (!$(this).hasClass('active')){	
		    	moveCurrentBand($current);
			} 
	}).on('click touchend', function(e){
		$(this).addClass('active').siblings().removeClass('active');
		 $current = $('.navigation ul li.active');
		return true;
	})
	
	function moveCurrentBand($elem){
		position = $elem.position();
		left = position.left;
		width = $elem.innerWidth();
		$currentband.stop(true, false).animate({left:left, width:width},{duration:1000, easing:'easeOutElastic'});
	}
	
	/* Animate Scroll */
	var barHeight = 87;
	
	$('.navigation a[href*=#], a[href*=#top]').on('click touchend',function(e) {
		e.preventDefault();
		var target = $(this).attr('href');
	
		$('html,body').animate({
			scrollTop: $('a[name='+target.replace(/#/g, "")+']').offset().top - barHeight
		}, 'fast' ,'linear', function (){
			//location.hash = target;
		});
	});
	
	/* Animate nav on Window Scroll */
	var arrayOffset = [];	
		
	$('a[name="experience"]').each(function(i){
		arrayOffset[i] = $(this).offset().top - barHeight;
	})
	
	$(window).load(function(){
		$('.hero').slideDown('slow', function(){
			$('.division').each(function(i){			
				arrayOffset[i] = $(this).offset().top;
			})
		});
	})
	
	$(window).scroll(function(){
		for (var index = 0; index < arrayOffset.length; index++) {
			if (($(this).scrollTop() >= arrayOffset[index] - barHeight) && ($(this).scrollTop() < arrayOffset[index + 1] - barHeight)
			&& index < arrayOffset.length - 1){
				$('.navigation ul li').eq(index).click();
				moveCurrentBand($('.navigation ul li').eq(index));			
								
				if ($(this).scrollTop() == ($(document).height() - $(this).height())){ 
					$(".navigation ul li").eq(arrayOffset.length - 1).click();
					moveCurrentBand($(".navigation ul li").eq(arrayOffset.length - 1));								
				} 
				
			}			
		}
	})
	
	/* Animate Name on nav var */
	var $me =  $('.me-name'),
	    brandW = - $me.width() - 10,
		paddingLeft = 10;
	
	$me.css('left', brandW);
	
	//$me.click(function(e){
		//return false;
	//})
	
	$(window).scroll(function(){
		
		$me.stop();
		if ($(this).scrollTop() > 10 ){
			$me.animate({
				left : paddingLeft,
				opacity : 1
			}, 'fast');
		} else {
			$me.animate({
				left : paddingLeft + brandW,
				opacity : 0
			},'fast');
		}
		
	})
	
	/* Remove click event from responsive nav */
	$('.btn-navbar').on('click', function(e){
		$('.navigation').toggle();
	});
	
	/* Animate Top button */	
	$(window).scroll(function(){
		if ($(window).width() > 768 ){
			if($(this).scrollTop() > 300 ){
				 $('.go-to-top').fadeIn();
			} else {
				$('.go-to-top').fadeOut();
			}
		}
	})
	
	
	function getDocHeight() {
		var D = document;
		return Math.max(
			Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
			Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
			Math.max(D.body.clientHeight, D.documentElement.clientHeight)
			);
	}
	
	
	/* Animate lightbox */		
	function AnimateLightBox($elem){
		var screenWidth = ($(window).width() * 0.75) > 800 ?  800 : $(window).width() * 0.75;
		var marginLeft =  screenWidth / 2;
		var imgHeight =  screenWidth * $elem.find('.page').find('img')[0].naturalHeight / $elem.find('.page').find('img')[0].naturalWidth;
		if( /iPhone/i.test(navigator.userAgent) ){
			var marginTop = (($(window).height() - imgHeight) / 2) + $(window).scrollTop();	
		} else {
			var marginTop = ($(window).height() - imgHeight) / 2;	
		}
		
		$('body').addClass('no-scroll').append('<div class="overlay"/>');
		$('.overlay').height(getDocHeight());
		$('.overlay').animate({ opacity : '0.35' },'fast', function(){
			$('body').append('<div class="popup"></div>');
			$('.popup').empty()
				.css({marginLeft :- marginLeft + 'px',  width : screenWidth + 'px', height : imgHeight + 'px',  marginTop : marginTop + 'px'})
				.append('<div class="close-btn">X</div>')
				.fadeIn('fast', function(){	
					var $page = $elem.find('.page').clone();	
					$('.close-btn').fadeIn();	
					$(this).append($page.fadeIn());	
				});
			
			$('.overlay, .close-btn').on ('click', function(e){
				$('body').removeClass('no-scroll');
				$('.overlay, .popup, .close-btn').fadeOut('fast',function(){
					$(this).remove();
				});
				
				
			})
		});
	}	
	
	$('.thumbnails-portfolio li').on('click touchend', function(e){
		e.preventDefault();
		if ($(this).find('.page').length > 0){
			AnimateLightBox($(this));
		}
	})
	
	/* Send Email */
	$('form').submit(function(e){
		e.preventDefault();
		$('.loading').show();
		$.post('sendmail.php', $('.form').serialize(), function(data){
			$('.results').html(data);
		}).success(function(){
			$('.loading').hide();
		})
	})
	

})( jQuery );