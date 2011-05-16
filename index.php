<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<?php 
		// Current Versions
		$builder_version = "1.0.1";
		$css_version = "1.0";
		$js_version = "1.0";
	
	?>
	
<html xml:lang="en-us" xmlns="http://www.w3.org/1999/xhtml" lang="en-us">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link href="styles/nui.frontend.css" rel="stylesheet" media="screen"/>
    <link href="styles/nui.builder.css" rel="stylesheet" media="screen" />
    <link rel="stylesheet" href="http://www.greenpeace.org/international/Templates/Planet3/Styles/all.css" type="text/css" />

    <title>nui.builder <?php echo $builder_version; ?></title>
    
        
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js" type="text/javascript"></script>
    <script src="builder/js/utils/encoder.js" type="text/javascript"></script>
    <script src="builder/js/utils/htmlStyle.js" type="text/javascript"></script>
    <script src="js/nui.frontend.js" type="text/javascript"></script>
    
</head>

<body class="builder">
	<?php include("builder/builder.php") ?>
	<?php include("builder/documentation.php") ?>
	<script src="builder/js/nui.builder.js" type="text/javascript"></script>
</body>
</html>