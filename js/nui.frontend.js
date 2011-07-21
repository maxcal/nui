/* NUI V0.7

PLEASE USE nui.frontend.min.js for live sites!

Constructor for the nui namespace. this avoids clobbering (and getting clobbered by) global values.
*/

function Nui_contruct() {

/* Module Constructor

Here you can add functions which are shared by all components
to add a new component use:

New operator:
nui.myModule = new nui.ModuleBuilder();

Prototype:
nui.prototype.myModule = function(){......}

*/

    this.ModuleBuilder = function() {
        this.startUp = function() {};
    };

    /* Utilities */

/* Convert array to literal
http://snook.ca/archives/javascript/testing_for_a_v

use:
if( name in oc(['bobby', 'sue','smith']) ) { ... }
*/
    this.oc = function(a) {
        var o = {};
        for (var i = 0; i < a.length; i++) {
            o[a[i]] = '';
        }
        return o;
    };
}

// Create nui object from constructor.
nui = new Nui_contruct();

/* ============= nuiAccordion ================================ */

nui.accordion = new nui.ModuleBuilder();

nui.accordion.initialize = function() {
    var ac = $('.nuiAccordion');
    ac.each(function(index) {

        var currentAccordion = $(this);
        var collapse = currentAccordion.hasClass("collapse");

        if (currentAccordion.children('.active').length === 0 && !collapse) {
            currentAccordion.find('.trigger:first').addClass("first active");
            currentAccordion.find('.pane:first').addClass("first active");

            currentAccordion.find('.first').addClass("active").show();
            currentAccordion.find('.pane').not('.active').hide();
        }

        else {
            currentAccordion.find('.pane').not('.active').hide();
        }

    });

    // Delegate clicks to tabs that are not currently active.
    ac.delegate('.nuiAccordion .trigger:not(.active)', 'click', function() {
        nui.accordion.ChangePane($(this));
        return false;
    });

    // Delegate clicks to next button
    ac.delegate('.nuiAccordion .pane .nextPane', 'click', function() {
        nui.accordion.ChangePane($(this));
        return false;
    });

    ac.delegate('.nuiAccordion .pane .close', 'click', function() {
        nui.accordion.ChangePane($(this));
        return false;
    });
};

nui.accordion.ChangePane = function(o) {
    // o = the object called upon
    // $pp = previous pane, $np = next pane, $pt = previous trigger, $pp = next trigger
    var $pt, $pp, $np, $nt, newParent;

    // Check the type of trigger & set the references
    if (o.hasClass('nextPane')) {
        $pt = o.parents('.nuiAccordion').find('.trigger.active');
        $pp = $pt.next('.pane');
        newParent = o.attr('href');
        $np = o.parents('.nuiAccordion').find(newParent);
        $nt = $np.prev('.trigger');
    }

    else if (o.hasClass('trigger')) {
        $nt = o;
        $np = o.next('.pane');
        $pt = o.parent('.nuiAccordion').find('.trigger.active');
        $pp = $pt.next('.pane');
    }

    else if (o.hasClass('close')) {
        $pt = o.parents('.nuiAccordion').find('.trigger.active');
        $pp = $pt.next('.pane');
        newParent = o.attr('href');
        $np = $('.doesntexist');
        $nt = $('.doesntexist');
    }

    // Call hidePane
    nui.accordion.hidePane($pp, $np, $pt, $nt);
};

nui.accordion.hidePane = function($pp, $np, $pt, $nt) {

    $pt.removeClass("active");
    $pp.removeClass("active");
    $nt.addClass('active');
    $np.addClass('active');

    nui.accordion.showPane($np, $nt);
    $pp.animate({
        'opacity': 0
    }, 200, function() {});
    $pp.slideUp(400);
};

nui.accordion.showPane = function($np, $nt) {
    if ($nt) {
        $np.css('opacity', 0).slideDown(400).animate({
            'opacity': 1
        }, 410);
    }
};

nui.accordion.expandAll = function($obj) {
    var $all_panes = $obj.find('.pane');
    nui.accordion.showPane($all_panes, true);
    $obj.find('.trigger').addClass('active');
};


/* ============= nuiForm ================================ */

nui.form = new nui.ModuleBuilder();

nui.form.reLink = function() {

    $('.nuiForm .nuiAccordion').undelegate('.nuiAccordion .trigger:not(.active)', 'click');
    $('.nuiForm .nuiAccordion').undelegate('.nuiAccordion .pane .nextPane', 'click');


    var validate = true;

    $('.nuiForm').delegate('.nuiAccordion .pane .nextPane', 'click', function() {

        // ADD VALIDATE HERE!
        $(this).parents('.pane').prev('.trigger').addClass('complete');
        nui.accordion.ChangePane($(this));

        return false;

    });

    // Delegate handler to allow going back to completed sections
    $('.nuiForm').delegate('.nuiAccordion .trigger.complete:not(.active)', 'click', function() {
        nui.accordion.ChangePane($(this));
    });

};

nui.form.startUp = function() {
    nui.form.reLink();
};


/* ============= nuiOpenspace ================================ */

// Fancy cheatlinks
nui.openspace = new nui.ModuleBuilder();


// Bind cheatlinks
nui.openspace.initialize = function() {

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


};

/* ============= Nui_Cookie ================================

Utitily to set and read cookies.

*/

function NuiCookie() {

  	var self = this;

    this.read = function(name) {
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
    };
    
    this.create = function(name, value, days, path) {


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
        
    };
    
    // Expires cookie
    this.destroy = function(name, path) {
    	if (self.read(name)){
    		self.create(name, "", -1, path);     	   	
    		return true;
    	}
    	else {
    		return false;
    	}	
    };
    
    this.update = function(name, value, days, path) {
    	var x;
    	if (self.read(name)){
    		x = self.create(name, value, days, path);     	   	
    		return x;
    	}
    	else {
    		return false;
    	}	
    };
}

nui.cookie = new NuiCookie();

// nui.cookie.create('foo', 'bar', 14,'norway');

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
    popup.$dialog.empty().add(popup.$mask)
      .fadeOut(popup.settings.anim_fadeOutSpeed, function(){
      
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

function Nui_signature() {

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
			      var iso =	 $(ff.id).find(":selected").val();	     	
			     	ff.value = iso_3166_eng[iso.toUpperCase()];
			     }
		     }
		   }
		}	
	}		

	// add the signature to the textarea
	function update_body(){
		get_fields();
		var $email_body, email_content, splitter;
		
		splitter = "\n - - - - - ";
				
		
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
	
	this.initialize = function(){
		
		if ($('body').hasClass('letter')){
			
			// Update once to catch logged in users - such as webbies.
			update_body();
		
						
			// Bind event handlers to the form fields
			for (var key in form_fields){							
				if (form_fields.hasOwnProperty(key)) {
					add_hander($(form_fields[key].id));	
				}				
			}	
		}			
	};	
}	

nui.sign_petition = new Nui_signature();

/* ============= Safe-fire Modules @ Doc ready ================================ */
$(document).ready(function() {

    if (typeof nui.accordion.initialize === 'function') {
        nui.accordion.initialize();
    }
    
    if (typeof nui.sign_petition.initialize === 'function'){
    	nui.sign_petition.initialize();
    }
    
    if (typeof nui.openspace.initialize === 'function') {
        nui.openspace.initialize();
    }

});
