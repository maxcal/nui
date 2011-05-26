/*		########################################################################
Nui.builder v0.7
========================================================================

A javascript user interface to create ui components.

Goals:

# Output valid HTML code to use on sites
# Work as a repository and testing ground for the modules in the nui.css

------------------------------------------------------------------------
*/

function builder() {

/*	########################################################################
LOGGER
========================================================================

A simple log system:

Writes to browser console if available
creates a log on the page.


usage:

logger(message), logger.info(message), logger.error(message);

------------------------------------------------------------------------	*/

    function Logger(message) {

        // References
        var $logger = $("#logger");
        var $log = $logger.find("#log");

        // Add our message to the log and scroll to bottom


        function addtolog(message, type) {

            if (message !== "undefined") {
                $log.append('<li class="entry ' + type + '">' + message + "</li>");
                var log_height = $logger.height();
                $logger.animate({
                    scrollTop: log_height
                }, "fast");

            }

        }

        // Types of logs...
        this.info = function(message) {
            addtolog(message, "info");
/*
if (typeof console.info == "function"){
//console.info(message);
}
*/
        };

        this.error = function(message) {
            addtolog(message, "error");
/*
if (typeof console.error == "function"){
//console.error(message);
}
*/
        };

        this.log = function(message) {
            addtolog(message, "log");
/*
if (typeof console.log == "function"){
//console.log(message);
}
*/
        };

        this.clear = function() {
            $log.empty();
        };



    }

    var logger = new Logger();


/*	########################################################################
Sandbox
========================================================================

Preview of the constructed module

------------------------------------------------------------------------	*/

    function Sandbox() {
        var $sandbox = $("#sandbox");

        this.fill = function(o) {
            $sandbox.empty();
            $sandbox.append(o);
        };

        this.clear = function() {
            $sandbox.empty();
        };

        this.setup = function(css) {
            $sandbox.css(css);
        };
    }

    var sandbox = new Sandbox();

/*	########################################################################
Source
========================================================================

Html code output

------------------------------------------------------------------------	*/

    function Source() {
        var $code = $("#source textarea");

        this.print = function(o) {
        	
        	// Clean up HTML output with REGEX.
        	var formatted_u =  $("#sandbox").html();        	
        	formatted_u = formatted_u.replace(/&quot;/gi, "\'").replace(/<br>/gi, '<br />').replace(/<hr>/gi, '<hr />');
        	
        	// PRINT TO TEXTAREA 
            $code.text(style_html(formatted_u));
        };
    }

    var source = new Source();


/*	########################################################################
Modules
========================================================================

The different types of UI components created by NUI are referred to as modules.

A module consist of:

# An options object in literal form.

- base.
- pane.

base contains settings for the entire object.
pane contains settings for each item (such as in a list).

For available options see ui.pane & ui.base.

Properties defined in a module take precidence over the values in ui.

# A this.getValues method.

Used to access current values of the ui. Can be called to reset the values.

# A this.build method

creates the module with user input. Returns a jQuery object or HTML snippet.

creating new modules:

A new module should ALWAYS be created with:

myModule = createModule("myModule");

this creates a reference to the module in the VAR modules.

------------------------------------------------------------------------	*/

    // Object constructor for a module - things inherited by all modules.


    function Module(name) {

        // Used to access current values of the ui. Can be called to reset the values.
        this.getValues = function() {
            this.val_template = $("#template .user_input").val();
            this.val_skin = $("#skin .user_input").val();
            this.val_elements = $("#elements .user_input").val();
            this.val_border = $("#border .user_input").val();
            this.val_header = $("#panes .pane .header .user_input").val();
            this.val_image = $("#panes .pane .image .user_input").val();
            this.val_url = $("#panes .pane .url .user_input").val();
            this.val_copyright = $("#panes .pane .copyright .user_input").val();
            this.val_title = $("#panes .pane .title .user_input").val();
            this.val_content = $("#panes .pane .content .user_input").val();
            this.val_omnilink = $("#panes .pane .omnilink .user_input").is(':checked');
            this.val_link_text = $("#panes .pane .link_text .user_input").val();
        };

        // Set at creation.
        this.name = name;
        this.build = function() {};
        
        this.init = function(){
        
        };
    }

    // List of the all modules
    var modules = [];

    // Object builder for a module


    function createModule(name) {
        var newModule = new Module(name);
        modules.push(newModule);
        return newModule;
    }

/*
Openspace
A css / html visual item for use in the big old openspace.

*/
    var openspace = createModule("openspace");

    openspace.options = {

        base: {
            template: {
                properties: ['Pane on left', 'Pane on Right', 'Pane above', 'Pane Below', 'Pane in Center', 'Minimal Left', 'Minimal Right']
            },
            skin: {
                properties: ['Dark Opaque', 'Light Opaque', 'Solid Dark', 'Solid Light', 'Outlined (experimental!!)', '90% white']
            },
            border: {
                properties: ['none', 'brdr']
            }
        },

        pane: {
            hasMultiplePane: false,
            header: {
                tooltip: "Text/HTML. Use <code>&lt;em&gt;</code> for hightlight (green)"
            },
            content: true,
            title: true,
            image: {
                label: "Background Image",
                tooltip: "Used as a CSS background, input the URL.",
                default_value: "bigspace-template.jpg"
            },
            url: {
                tooltip: "Covers the entire pane. Leave empty to omit."

            },
            copyright: true,
            omnilink: true,
            link_text: true,
        },

        sandboxCSS: {
            padding: 0,
            borderWidth: 0,
            width: 960
        }

    };

    openspace.build = function() {

        // Create the container and skin it.
        var $o, $a, $a_omnilink;

        $o = $('<div class="nuiOpenspace" style="background-image:url(' + this.val_image + ')"></div>')

        .addClass(this.val_template).addClass(this.val_skin);

        // Add Pane.
        $o.append('<div class="pane"></div> ').find('.pane').append('<h3>' + this.val_header + '</h3>')

        .end();
        if (this.val_content) {
            $o.find('.pane').append('<div class="entry_desc">' + this.val_content + '</div>');
        }
        if (this.val_copyright) {
            $o.find('.pane').append('<span class="copyright">' + this.val_copyright + '</span>');
        }

        // Add link; if we have a link
        if (this.val_url) {
            $a = $('<a>');



            // Smart defualts
            if (!this.val_title || !this.val_link_text) {

                if (this.val_link_text) {
                    this.val_title = this.val_link_text;
                }

                else if (this.val_title) {
                    this.val_link_text = this.val_title;
                }

                else {
                    this.val_title = this.val_header;
                    this.val_link_text = this.val_header;
                }
            }

            $a.attr('href', this.val_url).text(this.val_link_text).attr('title', this.val_title);

            if (this.val_omnilink) {
                $a_omnilink = $a.clone();
                $a_omnilink.addClass('omnilink');
                $a_omnilink.wrapInner('<span class="hidden">');
                $o.append($a_omnilink);
            }

            $a.addClass('act');
            $o.find('.pane').append($a);

        }

        // return the finished module.
        return $o;
    };
    
    
    openspace.init = function(){
    	$('#sandbox .omnilink').show();
    }

    //------------ accordion ------------------------------- //


    var accordion = createModule("accordion");

    accordion.options = {

        base: {
            template: {
                properties: ['Horizontal']
            },
            skin: {
                properties: ['P3 standard', 'Speach bubbles', 'p3 styled']
            },
            border: {
                properties: ['none', '1px solid']
            },
            trim: {
                properties: [false, 'bubble', 'numberIcons']
            },
            elements: {
                properties: ['div', 'dl']
            }
        },

        pane: {
            hasMultiplePane: true,
            header: true,
            content: true
        },
        sandboxCSS: {
            padding: 20,
            borderWidth: 1,
            width: "auto"
        }
    };

    accordion.build = function() {
        var $o, $loop, triggerElem, paneElem, header, content, index;

        index = $('#panes .pane').length + 1;

        if (this.val_elements === "div") {
            triggerElem = "div";
            paneElem = "div";
        }

        if (this.val_elements === "dl") {
            triggerElem = "dt";
            paneElem = "dd";
        }

        // Create the wrapper and skin it
        $o = $('<' + this.val_elements + ' class="nuiAccordion"></' + this.val_elements + '>')

        .addClass(this.val_template).addClass(this.val_skin);

        $('#panes .pane').each(function(index) {
            header = $(this).find('.header .user_input').val();
            content = $(this).find('.content .user_input').val();

            $loop = ('<' + triggerElem + ' class="trigger">' + header + '</' + triggerElem + '>');
            $loop += ('<' + paneElem + ' class="pane">' + content + '</' + paneElem + '>');
            $o.append($loop);
        });



        // Add speach bubbles.
        // This should be reworked into a function
        if (this.trim === "bubble") {
            $o.find('.pane').prepend('<div class="bubble"></div>');
        }

        if (this.trim === "numberIcons") {

            var numofPanes = 1;

            $o.find('.trigger').each(function(index) {
                $(this).prepend('<div class="trim numbers">' + numofPanes + '</div>');
                numofPanes++;
            });
        }

        return $o;

    };

    accordion.init = function() {
        nui.accordion.initialize();
    };


    //------------ BUTTONS ------------------------------- //
    var button = createModule("button");
    // Used for UI
    button.options = {
        base: {
            template: {
                properties: ['Rounded Box']
            },
            skin: {
                properties: ['Orange', 'Steel', 'Light']
            },
            elements: {
                properties: ['anchor', 'input']
            }
        },
        pane: {
            hasMultiplePane: false,
            header: {
                label: "Text",
                tooltip: "elements=input, value, text only, elements = anchor, content, text / html"
            },
            url: {
                tooltip: "Only used for anchor "
            }
        },
        sandboxCSS: {
            padding: 20,
            borderWidth: 1,
            width: "auto"
        }

    };

    button.build = function() {
        var $o;
        var $obj;

        if (this.val_elements === "input") {
            $obj = $('<input type="button" class="nuiButton" />').addClass(this.val_template).addClass(this.val_skin).attr('value', this.val_header);
        }

        else {
            $obj = $('<a class="nuiButton" href="' + this.val_url + '"></a>');
            $obj.addClass(this.val_template).addClass(this.val_skin).text(this.val_header);
        }

        return $obj;
    };

    //------------ headerBox ------------------------------- //
    var headerBox = createModule("Header Box");

    headerBox.options = {

        base: {
            template: {
                properties: ['standard']
            },
            skin: {
                properties: ['paper']
            }
        },

        pane: {
            hasMultiplePane: true,
            header: true,
            content: true,
            title: true,
            url: {
                tooltip: "Input URL, Applied to header"
            }
        },

        sandboxCSS: {
            padding: 20,
            borderWidth: 1,
            width: "auto"
        }

    };

    headerBox.build = function() {

        var $o;

        $o = $('<div class="nuiHeaderBox"></div>').addClass(this.val_template).addClass(this.val_skin).append('<div class="trim top">&nbsp;</div>').append('<div class="pane"></div>').find('.pane').append('<h1 class="heading">' + this.val_header + '</h1>').append('<h2 class="cont">' + this.val_content + '</h2>').end().append('<div class="trim bottom">&nbsp;</div>');

        return $o;
    };

    //------------ basicList ------------------------------- //
    var basicList = createModule("basicList");

    basicList.options = {

        base: {
            template: {
                properties: ['Box and Image']
            },
            skin: {
                properties: ['basic (skin1)', 'Rounded and shadowed (skin2)']
            },
            elements: {
                properties: ['div', 'ul']
            }
        },

        pane: {
            hasMultiplePane: true,

            header: {
                tooltip: "text / html"
            },
            content: {
                tooltip: "text / html"
            },
            image: {
                tooltip: "Input url or <code>&lt;img&gt;</code> tag"
            },
            url: true,
            title: true

        },

        sandboxCSS: {
            padding: 20,
            borderWidth: 1,
            width: "auto"
        }

    };

    basicList.build = function() {
        // Declare variables
        var $o, $loop, rows, header, content, image, url, num;

        // Set rows to correct element
        if (this.val_elements === "ul" || this.val_elements === "ol") {
            rows = "li";
        }

        else {
            rows = "div";
        }

        $o = $('<' + this.val_elements + ' class="nuiBasicList"></' + this.val_elements + '>');
        $o.addClass(this.val_template).addClass(this.val_skin);

        // Loop though panes
        $('#panes .pane').each(function(index) {

            // references
            header = $(this).find('.header .user_input').val();
            content = $(this).find('.content .user_input').val();
            url = $(this).find('.url .user_input').val();
            image = $(this).find('.image .user_input').val();

            $loop = $('<' + rows + ' class="pane"></' + rows + '>');

            // Create basic structure
            $loop.append('<div class="imageHolder"></div>');
            $loop.append('<div class="contentHolder"></div>');
            // Add links.
            if (image) {
                // if img is a html <IMG> tag...
                if (image.search("(<img)") !== -1) {
                    $loop.find('.imageHolder').append(image);
                }

                // Else, is URI
                else {
                    $loop.find('.imageHolder').append('<img src="' + image + '" title="' + header + '" />');
                }
            }


            // Add content.
            var $anchor = $('<a href="' + url + '" title="' + header + '"></a>');

            $loop.find(".contentHolder").append('<h3>' + header + '</h3>').append(content);


            if (url) {
                // Create links with .wrap()
                $loop.find('.imageHolder img').wrap($anchor);

                $loop.find('.contentHolder h3').empty().append($anchor).find("a").text(header);
            }
            $o.append($loop);


        });

        return $o;


    };





/*	########################################################################
USER INTERFACE
========================================================================

Contains the methods and objects used to build the user interface.

------------------------------------------------------------------------	*/

    function Ui() {


        this.currentModule = function() {

            var x = $("#module option:selected").index();

            if (x < 0) {
                x = 0;
            }


            return modules[x];
        };

/*	=======================================
References.

Centralise DOM references here...

---------------------------------------	*/

        var $base = $("#base");
        var $panes = $("#panes");
        var state;


/*	=======================================
UTILITIES.

Helpers to create inputs, selectors...

---------------------------------------	*/

        function makeInput(obj, index, options) {
            var $x;
            switch (obj.type) {
            case "text":
                $x = $('<input type="text" class="user_input" name="' + obj.slug + '_' + index + '"/>');
                if (obj.default_value) {
                    $x.attr("value", obj.default_value);
                }
                break;
            case "textarea":
                $x = $('<textarea rows="5" class="user_input" name="' + obj.slug + '_' + index + '">' + obj.label + '</textarea>');
                break;
            case "checkbox":
                $x = $('<input type="checkbox" class="user_input" name="' + obj.slug + '_' + index + '"/>');
                if (obj.default_value) {
                    $x.attr("checked", "checked");
                }

                break;
            }

            return $x;
        }

        function makeOptions(obj) {
            var n = 1,
                prop, $obj;
            // Loop though obj.properties and create an option for each.
            for (var key in obj.properties) {
                if (obj.properties.hasOwnProperty(key)) {
                    prop = obj.properties[key];
                    if (obj.basevalue) {
                        $obj += '<option value="' + obj.basevalue + n + '">' + prop + '</option>';
                    }
                    else {
                        $obj += '<option value="' + prop + '">' + prop + '</option>';
                    }
                    n++;
                }
            }
            return $obj;
        }

        function makeSelect(obj) {
            var $o;

            $o = $('<div class="inputRow ' + obj.slug + '" id="' + obj.slug + '">');
            $o.append('<label for="' + obj.slug + '">' + obj.label + '</label>');
            $o.append('<select class="user_input" name="' + obj.slug + '"></select>');

            return $o;
        }



/*	=======================================
Base.

Common for all modules.
An object literal where each key contains:

# info on how to create itself (label, slug, type)
# A retrieve method that returns its current value

---------------------------------------	*/

        this.base = {

            module: {
                type: "select",
                slug: "module",
                label: "Module",
                options: modules
            },

            template: {
                type: "select",
                slug: "template",
                label: "Template",
                basevalue: 't'

            },

            skin: {
                type: "select",
                slug: "skin",
                label: "Skin",
                basevalue: 'skin'
            },

            elements: {
                type: "select",
                slug: "elements",
                label: "Html Elements"
            },

            border: {
                type: "select",
                slug: "border",
                label: "Border"
            },

            trim: {
                type: "select",
                slug: "trim",
                label: "Trim (decor)"
            }
        };

/*	=======================================
Panes.

Object literal containing:

# inputs: the options on a pane.
# create: a method to create a new pane.
# delete : a method to remove a pane.

---------------------------------------	*/

        this.pane = {
            inputs: {
                header: {
                    type: "text",
                    slug: "header",
                    label: "Header",
                    default_value: "Header",
                    tooltip: "Text / html"
                },

                content: {
                    type: "textarea",
                    slug: "content",
                    label: "Content",
                    default_value: "Content",
                    tooltip: "Text / html"
                },

                title: {
                    type: "text",
                    slug: "title",
                    label: "Title attribute",
                    tooltip: "Text only, leave empty to use header."
                },

                image: {
                    type: "text",
                    slug: "image",
                    label: "Image",
                    tooltip: "Takes a url"
                },

                url: {
                    type: "text",
                    slug: "url",
                    label: "Url",
                    tooltip: "Address to link to, leave empty to omit."
                },

                link_text: {
                    type: "text",
                    slug: "link_text",
                    label: "Link text",
                    tooltip: "Custom text for link. Leave empty to use title. Takes text / html"
                },

                omnilink: {
                    type: "checkbox",
                    slug: "omnilink",
                    label: "Omnilink",
                    tooltip: "Add link to entite pane",
                },

                copyright: {
                    type: "text",
                    slug: "copyright",
                    label: "Copyright",
                    default_value: "&copy;",
                    tooltip: "Photographer credit"
                }

            }
        };

        // Create a user input pane
        this.addPane = function() {
            var ui_input = this.pane.inputs,
                c_module = this.currentModule(),
                mod_input = c_module.options.pane,
                $loop, ui_obj = false,
                mod_obj = false,
                tooltip, label, $new_pane, index = $panes.index('.pane') + 1;

            if (index < 1) {
                index = 1;
            }

            function makeLabel(x_ui, x_mod) {

                if (x_mod.label) {
                    label = mod_obj.label;
                }
                else {
                    label = x_ui.label;
                }

                return $('<label for="' + ui_obj.slug + '_' + index + '">' + label + '</label>');

            }

            function makeTooltip(x_ui, x_mod) {

                if (x_mod.tooltip) {
                    tooltip = mod_obj.tooltip;
                }
                else {
                    tooltip = x_ui.tooltip;
                }

                return $('<p class="tooltip"><strong>tip:</strong> ' + tooltip + '</p>');

            }


            $new_pane = $('<div class="pane" id="pane' + index + '"></div>');
            $new_pane.append('<h4>Pane' + index + '</h4>');

            // Loop though the inputs of UI.pane.inputs
            for (var key in ui_input) {
                // exclude object prototype
                if (ui_input.hasOwnProperty(key)) {
                    ui_obj = ui_input[key];


                    // Does this module have this property?
                    if (mod_input.hasOwnProperty(key)) {
                        mod_obj = mod_input[key];

                        $loop = $('<div class="inputRow ' + ui_obj.slug + ' line"></div>');

                        $loop.append(makeLabel(ui_obj, mod_obj)).append(makeInput(ui_obj, index));

                        if (mod_obj.default_value) {
                            $loop.find('.user_input').val(mod_obj.default_value);
                        }

                        $loop.append(makeTooltip(ui_obj, mod_obj));
                        $new_pane.append($loop);

                    }
                }
            }

            // Add delete button.
            if (mod_input.hasMultiplePane) {
                $new_pane.append('<input class="nuiButton t1 skin2 removePane" type="button" value="Remove this pane"/>');
            }

            // end of loop append our new pane to panes
            $panes.append($new_pane);
        };



/*	=======================================

Refresh.

Refresh the Code and Sandbox:

---------------------------------------	*/
        this.refresh = function() {
            var c_module = this.currentModule();
            c_module.getValues();

            sandbox.fill(c_module.build());
            sandbox.setup(c_module.options.sandboxCSS);
            source.print(c_module.build());

            if (typeof c_module.init === "function") {
                c_module.init();
            }

            if ($("#panes .pane").length === 0) {
                this.addPane();
                logger.error("No input panes! Creating a pane.");
            }

        };

/*	=======================================

changeModule.

When user switches module:

# get module.options and populate the selects
# call a refresh to reset the sandbox and code output.

---------------------------------------	*/

        this.changeModule = function() {
            var base = this.base,
                c_module = this.currentModule(),
                mod_base = c_module.options.base,
                base_obj, mod_obj, $select, $options, $hasMultiplePane = $('#nui_builder').find('.hasMultiplePane');


            // Remove panes so we can create new ones
            $panes.find('.pane').remove();

            logger.info("Changing to " + c_module.name);

            // Remove old inputs.
            $base.find('.inputRow').not('#module').remove();

            // Loop though ui.base
            for (var key in base) {
                if (base.hasOwnProperty(key)) {
                    base_obj = base[key];

                    // Does the module have this key?
                    if (mod_base.hasOwnProperty(key)) {

                        mod_obj = mod_base[key];

                        // Check if mod_obj has properties that should override ui_obj.
                        for (var subkey in base_obj) {

                            if (mod_obj.hasOwnProperty(subkey)) {
                                base_obj[subkey] = mod_obj[subkey];
                            }
                        }

                        // Copy the properties from the mod_obj
                        base_obj.properties = mod_obj.properties;

                        // If the module has this option - create it.
                        $select = makeSelect(base_obj);
                        $options = makeOptions(base_obj);
                        $select.find('.user_input').append($options);
                        $base.append($select);
                    }
                }
            }



            if (c_module.options.pane.hasMultiplePane) {
                $hasMultiplePane.show();
            }
            else {
                $hasMultiplePane.hide();
            }
            if ($('#units .unit').length < 1) {
                this.addPane();
            }

            this.refresh();

        };

/* =======================================

Runs at startup:

# Create a list of modules
# Initialise the first module.
# Add a pane if not present
# call a refresh to reset the sandbox and code output.

---------------------------------------	*/

        // Runs at startup. Creates a list of modules and
        this.startUp = function() {
            logger.info("Starting nui.builder...");
            var mods = this.base.module;

            // Loop through modules and create an option for each


            function createModules() {
                $("#base").empty();
                var $o = makeSelect(mods);

                for (var key in modules) {
                    if (modules.hasOwnProperty(key)) {
                        var obj = modules[key];
                        $o.find('select').append('<option value="' + obj.name + '">' + obj.name + '</option>');
                    }
                }

                $('#base').prepend($o);
            }

            if ($('#base #module').length < 1) {
                createModules();
                this.changeModule();
            }
        };
    }
    var ui = new Ui();
    ui.startUp();

    // Bind user actions
    $("#base").delegate(".inputRow:not(.module)", "change", function() {
        ui.refresh();
        var name = $(this).attr("name");
        logger.info("User changed " + name + ": refreshing...");
    });

    $("#base").delegate("#module .user_input", "change", function() {
        ui.changeModule($(this).val());
    });

    $("#panes").delegate(".pane .user_input", "change", function() {
        var name = $(this).attr("name");
        ui.refresh();
        logger.info("User input detected on " + name + ": refreshing...");
    });

    $("#addpane").click(function() {
        ui.addPane();
        logger.info("Creating user input pane");
        ui.refresh();
    });

    $("#panes").delegate(".removePane", "click", function() {
        $(this).parents('.pane').remove();
        logger.info("Removing user input pane");
        ui.refresh();
    });

    $("#source #inv_source").click(function() {
        $("#source_out").toggleClass("inv");
    });

    $('#trimpane').click(function() {
        $('#panes .pane:last').remove();
    });




}

builder();
