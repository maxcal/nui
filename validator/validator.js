/* Goals

	1. Check for empty requiered fields
	2. Make user aware of fields that need too be completed.
	
	* 3. Validate input type

*/


var nui = {};

nui.validator = (function(){

	function checkInput($obj){
		
		var err = null,
				$inputRow = $obj.parents('.inputRow');
		
		if (!$obj.val()){
			//console.info('invalid:', $obj);
			$inputRow.addClass('invalid');
				
			err = {
				field : $obj.attr('name'),
				label : $inputRow.find('label').text()
			};					
		}
		
		// Return object if error else null
		return err;
	}

	// Loop through inputs and check each;
	function checkAllInputs($obj){		
		var errors = [], error_string = "";
		
		// Loop though inputs and check each
		$obj.find('input.required').not('[type=hidden], [type=submit]').each(function(){		
			var hasError = checkInput( $(this) );			
			if (hasError){
				errors.push(hasError);
			}			
		});		
		
		// We have errors, notify user
		if (errors.length > 0){
			$.each(errors, function(i){
				error_string += errors[i].label + ', ';			
			});
			
			alert('Please check: ' + error_string);
			
			return false;
		}
		
		// Else - good to go
		else {
			return true;
		}		
	}

	return {
		init: function(){		
			$('#donation-form').submit(function(){
				
				console.info(checkAllInputs($(this)));
				return false;
				/*
				if (checkAllInputs($(this)) ){
					
				}
				else {
				  return false;
				}
				*/
			});
		},
		debug: function(){
			checkAllInputs($('#donation-form'));
		}
		
	};

}());


$(document).ready(function(){
	nui.validator.debug();
});
