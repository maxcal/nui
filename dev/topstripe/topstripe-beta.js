function Nui_top_stripe_const(settings){
	
	// Create a refrefence to "this" so that inner functions can access the outer "this".
	var that = this; 

	var default_settings = {
	
		height:				50,
		backgroundColor:	'#CCC',
		animInSpeed:		150,
		delay:				false
			
	};
	
	
	// Merge defualts and user settings. User overrides defualt.
	( function (A, B) {		
		if (B){
			for (var key in A) {	
				if (B[key]){
					A[key] = B[key];				
				}
			}
		}
		
		// bind settings to instance
		that.settings = A;
	} ( default_settings, settings ) );
	
	that.$wrapper = $('<div class="nui_top_stripe">');
	that.$body = $('body');
	
	// Display top stripe. Pass it the query object you wish to display.
	this.displayStripe = function($obj){
		
		var pos_string = "(0 "+ that.settings.height + ")",
		css_obj = {
			height: 0,
			backgroundColor: that.settings.backgroundColor
		};
		
		that.$body.prepend(that.$wrapper);
		that.$wrapper.hide().append('<div class="inner">').find('.inner').append($obj);
		that.$wrapper.hide().css(css_obj);
		
			
		// Push page background down.
		that.$body.animate( {backgroundPosition: pos_string},that.settings.animInSpeed, function(){
		
			// Animation complete... do this.
		
		});
		
		// expand stripe
		that.$wrapper.animate( {height : that.settings.height},that.settings.animInSpeed, function(){
		
			// Animation complete... do this.
		});			
	}; 
	
	this.loadObj = function(sel){
	
		var $obj; 
		this.callback = that.displayStripe($obj);
		
		if (typeof sel === "string"){
			$obj = $(sel);
		}
		
		if (that.settings.delay) {		
			window.setTimeout("this.callback", that.settings.delay);		
		}
		
		else {
			that.displayStripe($obj);		
		}			
	};
	
	this.ajaxLoad = function(url, frag){
	
		var url_str = url, 
		$nonce = $('<div class="nonce">');
		
		if (frag) {
			url_str = url_str + " " + frag;
		}
		
		$($nonce).load(url_str, function(){
		
			this.callback = that.displayStripe($nonce.children());
		
			if (that.settings.delay) {
				window.setTimeout("this.callback", that.settings.delay);	
			}
			
			else {
				that.displayStripe($nonce.children());
			}
		
		});			
	};			
}


// Call our module @ doc ready.

jQuery(document).ready(function($) {
  
  // Instanciate a top stripe
  var my_stripe = new Nui_top_stripe_const({
  	
  		height:				50,
		backgroundColor:	'#000',
		animInSpeed:		150,
		delay:				300 
  });
  
  // Load page fragment with id #my_top_stripe
  my_stripe.loadObj($('#my_top_stripe'));
  
  // Ajax load page fragment
  // my_stripe.ajaxLoad('http://www.example.com', '#content');
  
});





