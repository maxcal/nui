$(document).ready(function(){
	var $embed = $('<iframe width="560" height="349" src="" frameborder="0" allowfullscreen></iframe>');
					$embed.attr('src', 'http://www.youtube.com/embed/JOHxrbqLb74');
	nui.popup.attr({
		'skin': 'bar',
		'dialog_width' : 560
	});
	nui.popup.frag($embed);			
	
});