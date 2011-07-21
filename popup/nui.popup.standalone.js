var nui = {};

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



