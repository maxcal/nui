/* NUI V0.7

PLEASE USE nui.frontend.min.js for live sites!

Constructor for the nui namespace. this avoids clobbering (and getting clobbered by) global values.
*/

var nui = function(){ 
  return {  
  };
};

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
        var $acc = $(this),
            $panes = $acc.find('.pane'),
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
        });
      });
      
    },
    expandAll: function($obj){
      $obj.find('.pane').show();
    },
    collapseAll: function($obj){
      $obj.find('.pane').hide();
    } 
  };
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
       
      $nav.mouseenter(function(e) {
        $(this).toggleClass('inactive', 'active');
        $clickme.hide();
      });
      
      $nav.mouseleave(function(e) {
        $(this).toggleClass('inactive', 'active');

        $clickme.show();
      });   

    }
  };
}());

nui.pdf = (function() {  
	return {
		init : function(){
			  // Check for PDF links
		  $('a').each(function(){
		      var pdfExt = /\.pdf$/i,
		      		href = $(this).attr('href');
		  
		      if ( pdfExt.test(href)) {
		          $(this).addClass('pdf');
		      }
		  });
		  
		  // Google track PDFs
		  $('a.pdf').live('click', function($){
		    
		    var base_url, absolute_url;
		    // test for P3 env variable resources.baseurl
		    
		    base_url = resources.baseurl || "http://www.greenpeace.org/international/";
		    
		    // Self-Invoking Function - returns abs
		    absolute_url = (function(url, base_url){  
		     if (url.charAt(0) === '/') {
		        url = base_url + url.substr(1);
		     }  
		     return url;
		    }( $(this).attr('href'), base_url));
		    
		    // Push it too ye old google
		    _gaq.push(['_trackPageview', absolute_url]);  
		  });	
		}
	};
}());


$(document).ready(function(){
  nui.accordion.init();
  nui.form.init();
  nui.pdf.init();
});

/* ============= Nui_Cookie ================================

Utitily to set and read cookies.

*/

nui.cookie = (function(){
    
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
          new_cookie = this.read(name); 
          return new_cookie;         
      },      
      // Expires cookie
      destroy : function(name, path) {
        if (self.read(name)){
          this.create(name, "", -1, path);          
          return true;
        }
        else {
          return false;
        } 
      },      
      update : function(name, value, days, path) {
        var x;
        if (this.read(name)){
          x = this.create(name, value, days, path);           
          return x;
        }
        else {
          return false;
        } 
      }
    };
}());

/* ============= Nui_PopUp ================================

NuiPopup is a Jquery / CSS module in the NUI family. Its purpose is to display messages to the user in a "modal" dialog. It is nonblocking and can be used to display any content.

http://www.greenpeace.org/finland/nui/documentation/nuiPopup/

*/

nui.popup  = (function(){

   var gc = 0, popupData = [], Popup_Const, def_popup = {}, default_settings;
   
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
    maskcolor : 'black',
    onClose : function(){}
  };
  
   Popup_Const = function(settings, name){   
      var _settings = {}, $mask, $dialog, $closeBtn, key;      
      
      function CreateSettings(s) {
         
         var y = {};
        
         for (key in default_settings){
            y[key] = default_settings[key];
         }        
         for (key in s){
            y[key] = s[key];
         }  
         _settings = y;
      }      
      CreateSettings(settings);
      
      $mask = $('<div class="nuiPopUp mask">');
      $dialog = $('<div class="nuiPopUp dialog">');
      $closeBtn = $('<a class="nuiButton close" href="#">');
      
      function Reset(){
        // Reset to avoid duplicate properties
        $mask.add($dialog)
          .removeClass(_settings.template)
          .removeClass(_settings.skin);
      }     
      // Setup
      function setup_components(){
         // Add skins 
        Reset();
        $mask.add($dialog)
          .addClass(_settings.template)
          .addClass(_settings.skin);
        if (_settings.mask_custom_css){
        	$mask.css(_settings.mask_custom_css);
        }
        if (_settings.dialog_custom_css){
        	$dialog.css(_settings.dialog_custom_css);
        }
      }
      setup_components();
      
      function Close(){
         $dialog.animate({
            opacity: 0
         }, _settings.anim_fadeOutSpeed, function(){
            //$dialog.empty();
            $dialog.empty().remove();
            $mask.fadeOut(300, function(){
            	 $mask.empty().remove();
            });
         });
         $mask.removeClass('busy');
         $closeBtn.removeClass('busy');
         //$dialog.remove();
         stopMoving = false;
         // Remove event handlers
         $(window).unbind('resize');
         $(document).unbind('keyup');
      }
      
      function Display(self, obj, onClose, target){
      	
         var scrolltop, $target;
         
         if ( target && typeof target === 'object'){
         	$target = target;
         }
         else {
         	$target = $("body");
         }
         
         $mask.hide();
         $dialog.css('visibility', 'hidden');
         $('body').append($mask);
         $target.append($dialog);
         // Setup object
         $dialog.append(obj)
            .append($closeBtn)
            .width(_settings.dialog_width)
            .css({
               // Center box with negative margins.
               marginLeft: (function(){
                  return (- ($dialog.outerWidth() / 2)) + 'px';
               }()),
               opacity: 0,  
               visibility: 'visible'          
            });
  
         $dialog.fadeIn();
        	// Gecko has scroll on HTML element
         if ($('html').scrollTop() > $('body').scrollTop()){
         	scrolltop = $('html').scrollTop();         	 
         }
         // Webkit has scroll on Body element
         else {
         	scrolltop = $('body').scrollTop();
         }

         $dialog.css('top', scrolltop + 25 + "px");           
         $mask.height($(document).height());
         
         // Bind event handlers
         $mask.add($closeBtn).bind('click', function(){
          Close(self);   
          return false;                
         });
         // Adjust mask height so that it covers window
         $(window).bind('resize scroll', function() {
         	$mask.height($(document).height());
         	$mask.width($('body').width());
         });
         
         // Bind escape button
         $(document).bind('keyup', function(e){
						if (e.keyCode == 27) { Close(); }   // esc
				 });
				 
				 // Fade in popup
         $mask.fadeTo(400, _settings.mask_opacity);
         $dialog.animate({
            opacity : 1
         }, 600);  
      }

      function Load(self, url, params, onClose, target){
         var $nonce = $('<div class="nonce">');
         if (params){
            $nonce.load(url, params, function(response, status) {
             $(this).unwrap('.nonce');
             Display($(this), onClose);
          });
         }
         else {
            $nonce.load(url, function(response, status) {
             $(this).unwrap('.nonce');
             Display($(this), onClose);
         });
         }
      }
      
      function Frag(self, obj, clone, onClose, target){        
         if (clone){
            obj = obj.clone(true, true);
         }
         Display(self, obj, onClose, target);     
      }
      
      function Attr(self, key, val){
      	 if (typeof key === 'object'){
      	 	Reset();
      	 	CreateSettings(key);
      	 	setup_components();      	 	
      	 }
      	 
         if (val){
            _settings[key] = val;
         }
         else {
            return _settings[key];
         }
      }
      return {
         load: function(url, params, onClose, target){         		
            Load(this, url, params, onClose, target);
         },
         frag: function(obj, clone, onClose, target){
            Frag(this, obj, clone, onClose, target);
         },
         attr: function(key, val){
            val = val || null;
            key = key || null;
            return Attr(this, key, val);
         },
         setup: function(obj){
          Reset();
          CreateSettings(obj);
          setup_components();
         }
      };
   };

   return {
      create: function(settings, name){
         var new_popup;
         if (!settings){
            settings = null;
         }    
         new_popup = new Popup_Const(settings, name);
         new_popup.guid = gc;       
         popupData.push(new_popup);
         gc++;
         return new_popup; 
      },
      init: function(setup){
         def_popup = this.create();
         nui.popup.set_defualt(0);         
      },
      set_defualt : function(id){
         def_popup = popupData[id];
         this.load = function(url, params, onClose, target){
            def_popup.load(url, params, onClose);
         };
         this.frag = function(obj, clone, onClose, target){
            def_popup.frag(obj, clone, onClose, target);
         };
         this.attr = function(key, val){
            if (val){
              def_popup.attr(key, val);
            }
            else {
              return def_popup.attr(key);
            }
         };
         this.setup = function(obj){
          def_popup.setup(obj);
         };
      },
      name : name,
      load : null,
      frag : null,
      attr : null    
   };
}());

$(document).ready(function(){
	nui.popup.init();
});

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
    var ff, $ff, ff_tagName, key;
  
    for (key in form_fields) {
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
      email_content = email_content + " " + form_fields.first_name.value;
      
      if (form_fields.last_name.value){
        email_content = email_content + " " + form_fields.last_name.value;
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
    	var key;
      if ($('body').hasClass('letter')){
        update_body();
        for (key in form_fields){             
          if (form_fields.hasOwnProperty(key)) {
            add_hander($(form_fields[key].id)); 
          }
        }       
      } 
    }
  };
}());

/* ============= Safe-fire Modules @ Doc ready ================================ */
$(document).ready(function(){
  for (var key in nui){
    if (nui.hasOwnProperty(key)){
      if (nui[key].hasOwnProperty('init')){
        if (typeof nui[key].init === 'function'){
          nui[key].init();
        }
      }
    }
  }
  
  // Fire NUI READY CUSTOM EVENT
  $(document).trigger('nuiReady', ['foo', 'bar']);
  
});