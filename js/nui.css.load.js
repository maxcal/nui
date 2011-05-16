(function() {
	
	console.log('hello wrrrld');
	
	// Get all link elements
	var	headtag = document.getElementsByTagName("head")[0],
		loadedStyles = headtag.getElementsByTagName('link'),
		isLoaded = false;
	
	// our new link object
	var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = 'http://www.greenpeace.org/finland/nui/nuifrontendcss/';
		cssNode.media = 'screen';
		cssNode.title = 'dynamicLoadedSheet';		
		
	//Loop though LINK tags to see if cssNode is allready loaded.	
	for (var key in loadedStyles) {
				  			
		// Current HREF in loop
		var currentHref = loadedStyles[key].href;
		
		// Style loaded - bail! 
		if (currentHref === cssNode.href){
			isLoaded = true;
		}
	}
	
	// If stylesheet is not loaded attach it to DOM.
	if (!isLoaded) {
		headtag.appendChild(cssNode);
	}

})();