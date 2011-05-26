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
			
			var ff, $ff, field_tagName;
		
			for (var key in form_fields) {
			   if (form_fields.hasOwnProperty(key)) {
			     ff = form_fields[key];
			     $ff = $(ff.id);  
			     
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
		
		// add the signature to the textarea
		function update_body(){
			get_fields();
			var sig, $email_body, email_content, fn_prev, splitter;
			
			splitter = "\n - - - - - ";
			
			sig = [];
			sig[0] = form_fields.first_name.value;
			sig[1] = form_fields.last_name.value;
			sig[2] = form_fields.country.value;				
			
			$email_body = $("#ctl00_cphContentArea_Action1_txtBody");
			email_content = $email_body.val();			
			
			// Split content to remove old signature.
			email_content = email_content.split( splitter )[0];
			
			// If firstname / lastname
			if (sig[0] && sig[1]){
				// Add stupid splitter
				email_content = email_content + splitter;
			
				// Add firstname / lastname
				email_content = email_content + "\n" + sig[0] + " " + sig[1];
				
				// Add country
				if (sig[2]){
					email_content = email_content + ",\n" + sig[2];
				}
				
				$email_body.val(email_content);	
			
			}
		}	
		
		this.initialize = function(){
			
			// Update once to catch logged in users
			update_body();
						
			// Bind event handlers to the form fields
			for (var key in form_fields){							
				if (form_fields.hasOwnProperty(key)) {
					$(form_fields[key].id).change(function(){
						update_body();			
					});
				}				
			}			
		}

		this.initialize();		
	}

	add_petition_signature();

});

