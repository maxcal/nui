jQuery(document).ready(function($) {

	function add_petition_signature(){
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
		
		// Get the field values from the form and add them to form_fields object
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
				     	ff.value = $(ff.id).find(":selected").text();
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
		
		this.initialize = function(){
		
			// Update once to catch logged in users - such as webbies.
			update_body();
			
			function add_hander($obj){
				$obj.change(function(){
						update_body();		
				});
			}
						
			// Bind event handlers to the form fields
			for (var key in form_fields){							
				if (form_fields.hasOwnProperty(key)) {
					add_hander($(form_fields[key].id));	
				}				
			}				
		};
		
		if ($('body').hasClass('letter')){
			this.initialize();
		}				
	}

});

