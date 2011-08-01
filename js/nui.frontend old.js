/* NUI V0.7

PLEASE USE nui.frontend.min.js for live sites!

Constructor for the nui namespace. this avoids clobbering (and getting clobbered by) global values.
*/

var nui = function(){
	
	return {
	
	}
}


/* ============= nuiAccordion ================================ */

nui.accordion = (function(){
	
	function hidePane(obj){
		obj.trigger.removeClass('active');
		obj.pane.removeClass('active');
		obj.pane.hide();		
	}
	
	function showPane(obj){
		obj.pane.addClass('active');
		obj.trigger.addClass('active');
		obj.pane.hide();		
		obj.pane.slideDown(300);
	}

	function changePane(target, old){	
		hidePane(old);
		showPane(target);
	}

	return {
		init : function(){
			var $Accordions = $('.nuiAccordion');
			// Loop through accordions an hide all but first.
			$Accordions.each(function(index){
				var $acc = $(this);
						$panes = $acc.find('.pane');
						$triggers = $acc.find('.trigger');
				
				$panes.first()
					.add($triggers.first())
					.addClass("first active");					
				$panes.not('.active').hide();
			});	
		
			
			$Accordions.delegate('.trigger:not(.active), .nextPane', 'click', function(){
				
				var $obj = $(this), 
						$acc = $obj.parents('.nuiAccordion'),  
						target = {}, 
						old = {};
						
				old.trigger = $acc.find('.trigger.active');
				old.pane = $acc.find('.pane.active');
				
				if ($obj.hasClass('trigger')){
					target.trigger = $obj;
					target.pane = target.trigger.next('.pane');
				}
				
				else if ($obj.hasClass('nextPane')){					
					target.trigger = $obj.parents('.pane').next('.trigger');
					target.pane = target.trigger.next('.pane');
					
					old.trigger.addClass('complete');	
				}
				
				changePane(target, old);
				return false;
			});
			
			$Accordions.delegate('.close','click', function(){
				hidePane({
					trigger : $(this).parents('.pane').prev('.trigger'),
					pane: $(this).parents('.pane')
				})
			});
			
		},
		expandAll: function($obj){
			$obj.find('.pane').show();
		},
		collapseAll: function($obj){
			$obj.find('.pane').hide();
		}	
	}
}());

nui.form = (function(){
	return {
		init: function(){
		}
	};
}());

nui.openspace = (function(){
	
	return {
		init : function(){

			var $visual = $('#visual'),
					$clickme = $visual.find('.omnilink').add('.clickme'),
					$nav = $('#nav');
			
			$clickme.show();
			 
			$('#nav').mouseenter(function(e) {
        $(this).toggleClass('inactive', 'active');
        $clickme.hide();
    	});
    	
    	$('#nav').mouseleave(function(e) {
        $(this).toggleClass('inactive', 'active');

        $clickme.show();
    	});		

		}
	}

}());

$(document).ready(function(){
	nui.accordion.init();
	nui.form.init();
});

/* ============= Nui_Cookie ================================

Utitily to set and read cookies.

*/

nui.cookie = function() {

  	var self = this;
		
		return {
			read : function(name) {
	        var nameEQ = name + "=",
	            ca = document.cookie.split(';'),
	            i, c;
		
	        for (i = 0; i < ca.length; i++) {
	            c = ca[i];
	
	            while (c.charAt(0) === ' ') {
	                c = c.substring(1, c.length);
	            }
	
	            if (c.indexOf(nameEQ) === 0) {
	                return c.substring(nameEQ.length, c.length);
	            }
	        }
	
	        return null;
	    },	    
	    create : function(name, value, days, path) {
	        var expires, date, path_to, new_cookie;	        
	        path_to = "path=/";	
	        if (days) {
	            date = new Date();
	            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	            expires = "; expires=" + date.toGMTString();
	        }	
	        else {
	            expires = "";
	        }	        
	        if (path){
	        	path_to = path_to + path;
	        }	
	        document.cookie = name + "=" + value + expires + ";"+ path_to;	        
	        new_cookie = self.read(name);	
	        return self.read(name);	        
	    },
	    
	    // Expires cookie
	    destroy : function(name, path) {
	    	if (self.read(name)){
	    		self.create(name, "", -1, path);     	   	
	    		return true;
	    	}
	    	else {
	    		return false;
	    	}	
	    },	    
	    update : function(name, value, days, path) {
	    	var x;
	    	if (self.read(name)){
	    		x = self.create(name, value, days, path);     	   	
	    		return x;
	    	}
	    	else {
	    		return false;
	    	}	
	    }
    }
}

/* ============= Nui_PopUp ================================

NuiPopup is a Jquery / CSS module in the NUI family. Its purpose is to display messages to the user in a "modal" dialog. It is nonblocking and can be used to display any content.

http://www.greenpeace.org/finland/nui/documentation/nuiPopup/

*/

nui.popup = (function(){

  var popups = {},        
      default_settings = {
        template: 't1',
        skin: 'skin1',
        dialog_width: 700,
        dialog_height: 700,
        dialog_custom_css: false,
        mask_opacity: 0.7,
        mask_custom_css: false,
        anim_fadeIn_speed: 500,
        anim_fadeOut_speed: 400,
        cookie_name: false,
        cookie_expires_days: 14,
        cookie_disabled: false,
        ga_tracking_page: false,
        close_title: "Close",
        onClose : function(){}
      };
    
  function display(id){
    var docH, offset_pos, popup, settings;        
 
    if (popups.hasOwnProperty(id)){   
      // HALT OPENSPACE
      stopMoving = true;
      settings = popups[id].settings;
      popup = popups[id];
      
    
      docH = $(document).height();
      popup.content.show();
      popup.$dialog.append(popup.content)
        .append(popup.$close)
        .css('marginLeft', -(settings.dialog_width / 2))
        .width(settings.dialog_width)
        .hide();
      popup.$mask.height(docH)
        .hide();
      $('body').append(popup.$mask)
      	.append(popup.$dialog);
      
      popup.$mask.add(popup.$close)
        .bind('click', function(){
          close(id);
        }); 
            
      // Set dialog position.
      popup.$dialog.fadeTo(0, 0.001, function(){
        var d_offset = popup.$dialog.height() / 2 + 50;      
        if ($(this).height() > docH){
          $(this).css('marginTop', -d_offset);
        }
        else {
          $(this).css('top', '20%');
        }       
      })
      .fadeTo(settings.anim_fadeInSpeed, 1);
      popup.$mask.fadeTo(settings.anim_fadeInSpeed, settings.mask_opacity);     
    }
    
  }
  
  function close(id){
    var popup = popups[id];
    //popup.$dialog.empty().add(popup.$mask).animate({}, 100, function(){});
    
    popup.$dialog.animate({
    	opacity: 0
    }, popup.settings.anim_fadeOutSpeed, function(){
    	popup.$dialog.empty();
    	popup.$mask.fadeOut(300);    
    });
      
      //Restart openspace
      stopMoving = false;
  }


  // Public methods
  return {
    
    
    // Create a new popup with unique settings
    create : function(id, settings){
          
      var tstamp = new Date();
                
      if (typeof id !== 'string'){
        id = 'nuipopup_' + tstamp.valueOf();
      }
      
      popups[id] = {};
      
      // Merge defualts and passed settings.
      (function(A, B) {
        if (B) {
            for (var key in A) {
                if (B[key]) {
                    A[key] = B[key];
                }
            }
        }

        // bind settings to instance
        popups[id].settings = A;
      }(default_settings, settings));
      
      popups[id].$mask = $('<div class="nuiPopUp mask">');
      popups[id].$dialog = $('<div class="nuiPopUp dialog">');
      popups[id].$close = $('<a class="nuiButton close" href="#">');    
      
      // Setup mask
      popups[id].$mask.addClass(id);    
      
      // Setup Dialog
      popups[id].$dialog.addClass(id)
        .addClass(popups[id].settings.template)
        .addClass(popups[id].settings.skin);
      
      // Setup Close button
      popups[id].$close.addClass(id)
        .attr('title', popups[id].settings.close_title);
      
      // Apply custom CSS
      if (popups[id].settings.dialog_custom_css) {
        popups[id].$dialog.css(popups[id].settings.dialog_custom_css);
      }
      if (popups[id].settings.mask_custom_css) {
        popups[id].$mask.css(popups[id].settings.mask_custom_css);
      }      
      return id;        
    },

    attr : function (id, key, val){
      var cpopup;
       
      if (typeof id === 'string'){
        cpopup = popups[id];
        
        if (!val){
          return cpopup.settings[key];
        }
        else {
          cpopup.settings[key] = val;
        }       
      }
    },
    
    load: function (id, url, sel, onClose){
      var $nonce = $('<div class="nonce">');
          
      if (sel) {
      	url = url + ' ' + sel;
      }     
      $nonce.load(url, function(response, status) {
        popups[id].content = $nonce;
        display(id, onClose);
      });
     
    },
    
    frag : function (id, $obj, onClose){
      var c_popup = popups[id];
          
      if (typeof $obj === 'string') {
          $obj = $($obj);
      } 
      
      $obj = $obj.clone();
      c_popup.content = "";
      c_popup.content = $obj;
      display(id, onClose);   
    }
  };

}());

/* ============= Nui_Sign_petition ================================

	Signs a petition email with the details entered by the user.

*/


nui.sign_petition = (function(){
	
	var form_fields = {
		"first_name" : {
			"id" : "#ctl00_cphContentArea_Action1_txtFullname_txtFirstName"
		},
		"last_name" : {
			"id" : "#ctl00_cphContentArea_Action1_txtFullname_txtLastName"
		},
		"country" : {
			"id" : "#ctl00_cphContentArea_Action1_ddlCountries"		
		},
		"mobile" : {
			"id" : "#ctl00_cphContentArea_Action1_txtCellPhone"
		}
	};
	
	function get_fields(){			
		var ff, $ff, ff_tagName;
	
		for (var key in form_fields) {
		   if (form_fields.hasOwnProperty(key)) {
		     ff = form_fields[key];
		     $ff = $(ff.id);  
		     
		     if ($ff.length > 0){
		     	 ff_tagName = $ff[0].tagName;			     			     
			     
			     if (ff_tagName === "INPUT"){			     	
			     	ff.value = $(ff.id).val();			     	
			     }
			     
			     else if (ff_tagName === "SELECT"){	     	
			     	ff.value = $(ff.id).find(":selected").val();
			     }
		     }
		   }
		}	
	}		

	// add the signature to the textarea
	function update_body(){
		get_fields();
		var $email_body, email_content, splitter;
		
		splitter = " - - - - - ";
				
		
		$email_body = $("#ctl00_cphContentArea_Action1_txtBody");
		email_content = $email_body.val();			
		
		// Split content to remove old signature.
		email_content = email_content.split( splitter )[0];
		
		// If firstname / lastname
		if (form_fields.first_name.value){
			// Add stupid splitter
			email_content = email_content + splitter;
		
			// Add firstname / lastname
			email_content = email_content + "\n" + form_fields.first_name.value;
			
			if (form_fields.last_name.value){
				email_content = email_content + " " + form_fields.last_name.value;
			}
			
			// Add country
			if (form_fields.country.value){
				email_content = email_content + ",\n" + form_fields.country.value;
			}
			
			$email_body.val(email_content);				
		}
	}

	function add_hander($obj){
		$obj.change(function(){
			update_body();		
		});
	}
	
	return {
		init : function(){
			if ($('body').hasClass('letter')){
				update_body();
				for (var key in form_fields){							
					if (form_fields.hasOwnProperty(key)) {
						add_hander($(form_fields[key].id));	
					}
				}				
			}	
		}	
	}
}());

/* ============= Safe-fire Modules @ Doc ready ================================ */
$(document).ready(function(){
	for (var key in nui){
		if (nui.hasOwnProperty(key)){
			if (nui[key].hasOwnProperty('init')){
				if (typeof nui[key].init === 'function'){
					console.info('initalising', key)
					nui[key].init();
				}
			}
		}
	}	
});



