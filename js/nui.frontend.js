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

    this.create = function(name, value, days, path) {


        var expires, date, path_to;
        
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
    };

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
}

nui.cookie = new NuiCookie();


/* ============= Remove Greenpeace from site title================================ */
// jQuery Cookie plugin
/* ============= Nui_PopUp ================================

NuiPopup is a Jquery / CSS module in the NUI family. Its purpose is to display messages to the user in a "modal" dialog. It is nonblocking and can be used to display any content.

http://www.greenpeace.org/finland/nui/documentation/nuiPopup/

*/

function Nui_PopUp_blueprint(settings) {

    // Blueprint to create a new popup.
    // Create a refrefence to "this".
    var that = this;

    var default_settings = {
        name: 'unnamed_nuiPopup',
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
        close_title: "Close"
    };

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
        that.settings = A;
    }(default_settings, settings));

    // Template objects
    that.$mask = $('<div class="nuiPopUp mask"><div>');
    that.$dialog = $('<div class="nuiPopUp dialog"></div>');
    that.$close = $('<a class="nuiButton close" href="#">');
    that.$close.attr('title', that.settings.close_title);

    // skin template objects
    that.$dialog.addClass(that.settings.skin);
    that.$dialog.addClass(that.settings.template);
    that.$mask.addClass(that.settings.skin);
    that.$mask.addClass(that.settings.template);

    // Apply custom CSS
    if (that.settings.dialog_custom_css) {
        that.$dialog.css(that.settings.dialog_custom_css);
    }

    if (that.settings.mask_custom_css) {
        that.$mask.css(that.settings.mask_custom_css);
    }


    //Bind event handlers
    this.bindPopUp = function() {
        $('.nuiPopUp.mask').live('click', function() {
            that.closePopUp();
        });
        $('.nuiPopUp .close').live('click', function() {
            that.closePopUp();
            return false;
        });
    };

/* Display object in a popup dialog

arguments:
$obj = the jQuery object you wish to display.

*/

    this.displayPopUp = function($obj) {
        if ($obj) {

            var docH = $(document).height(),
                offset_pos = {
                    'marginLeft': -(that.settings.dialog_width / 2)
                };

            // HALT OPENSPACE
            stopMoving = true;

            that.$dialog.append($obj).append(that.$close).css(offset_pos).width(that.settings.dialog_width);
            that.$mask.height(docH).hide();
            $('body').append(that.$mask).append(that.$dialog);

            // Set dialog position.
            this.$dialog.fadeTo(0, 0.001, function() {

                if (that.$dialog.height() > $(document).height()) {
                    var d_offset = that.$dialog.height() / 2 + 50;
                    that.$dialog.css('marginTop', -d_offset);
                }

                else {
                    that.$dialog.css('top', '20%');
                }

            }).add().fadeTo(that.settings.anim_fadeInSpeed, 1);


            this.$mask.fadeTo(that.settings.anim_fadeInSpeed, that.settings.mask_opacity);
            this.bindPopUp();
        }
    };

    /*		Hides and empties the dialog.	*/
    this.closePopUp = function() {
        that.$dialog.add(that.$mask).fadeOut(that.settings.anim_fadeOutSpeed, function() {
            $(this).die();
            that.$dialog.empty();
            $(this).remove();
        });

        //Restart openspace
        stopMoving = true;

    };

/* Load page with AJAX,

arguments:
url = target page you want to load
frag = (optional) fragment of target page to load. Takes a jQuery selector.

*/

    this.ajaxloadPopUp = function(url, frag) {

        if (that.settings.cookie_disabled || !nui.cookie.read(escape(that.settings.name))) {

            nui.cookie.create(that.settings.name, 'displayed', that.settings.cookie_expires_days);

            var $nonce = $('<div id="nonce"> ');

            if (typeof frag === 'string') {
                url = url + ' ' + frag;
            }

            $nonce.load(url, function(response, status) {

                that.displayPopUp($nonce);

            });

        }

    };
    // Shortened alias
    this.load = this.ajaxloadPopUp;

/* Get page fragment

arguments:
$obj = a jQuery selector or a jQuery object.

*/

    this.loadPopUp = function($obj) {

        if (that.settings.cookie_disabled || !nui.cookie.read(escape(that.settings.name))) {

            nui.cookie.create(that.settings.name, 'displayed', that.settings.cookie_expires_days);

            var $objclone;

            if (typeof $obj === "string") {
                $obj = $($obj);
            }

            $objclone = $obj.clone();
            $objclone.show();
            that.displayPopUp($objclone);

        }
    };

    // Shortened alias
    this.frag = this.loadPopUp;

    /* Set google analytics tracking */
    this.setTracker = function() {};
}


/* ============= Safe-fire Modules @ Doc ready ================================ */
$(document).ready(function() {


    if (typeof nui.accordion.initialize === 'function') {
        nui.accordion.initialize();
    }



    if (typeof nui.openspace.initialize === 'function') {
        nui.openspace.initialize();
    }

});
