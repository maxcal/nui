// Code viewer
$(document). ready ( 
  function() {
    $('a.codeExample').each (
      function( i ) {
        $( this ).after( '<pre class="codeExample"><code></code></pre>' );
      }
    )
    $( 'pre.codeExample' ).hide();
    $('a.codeExample').toggle ( 
      function() {
    if( !this.old ){
      this.old = $(this).html();
    }
        $(this).html('Hide Code');
        parseCode(this);
      },
      function() {
        $(this).html(this.old);
        $(this.nextSibling).hide();
      }
    )
    function parseCode(o){
      if(!o.nextSibling.hascode){
          $.get (o.href,
            function(gcode){
              gcode=gcode.replace(/&/mg,'&#38;');
              gcode=gcode.replace(/</mg,'&#60;');
              gcode=gcode.replace(/>/mg,'&#62;');
              gcode=gcode.replace(/\"/mg,'&#34;');
              gcode=gcode.replace(/\t/g,'  ');
              gcode=gcode.replace(/\r?\n/g,'<br>');
              gcode=gcode.replace(/<br><br>/g,'<br>');
              gcode=gcode.replace(/ /g,'&nbsp;');
              o.nextSibling.innerHTML='<code>'+gcode+'</code>';
              o.nextSibling.hascode=true;
            }
          );
      }
      $(o.nextSibling).show();
    }
  }
);