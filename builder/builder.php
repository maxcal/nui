	<h1 id="builder_title">nui.builder <?php echo $builder_version; ?></h1>
	<div id="nui_builder" class="line">
		<div class="label_holder">
			<h2 class="builder_label left">preview</h2>			
		</div>
		<div class="sandbox" id="sandbox">
		</div>
		<div class="label_holder">
			<h2 class="builder_label left">Basic Options</h2>			
		</div>
		<div class="base clearfix" id="base">
		</div>
		<div class="label_holder">
			<h2 class="builder_label left">Controls</h2>			
		</div>
		<div class="controls clearfix">
			<input value="Refresh" id="refresh" class="nuiButton t1 skin1 refresh" type="button" />
			<input value="Add pane" id="addpane" class="nuiButton t1 skin3 add hasMultiplePane" type="button" />
			<input value="Remove last pane" id="trimpane" class="nuiButton t1 skin3 trimpane hasMultiplePane" type="button" />
		</div>
		<div class="label_holder">
			<h2 class="builder_label left">Panes</h2>			
			<h2 class="builder_label right">html Output</h2>
		</div>

		
		<div class="panes" id="panes">
			<h2 class="builder_label left">Panes</h2>
		</div>
		
				
		<div class="source" id="source">
			<!-- <input value="Copy" id="copy_source" class="nuiButton t1 skin2 add" type="button" /> -->
			<input value="Invert Colors" id="inv_source" class="nuiButton t1 skin2 add" type="button" />
			<textarea class="source_out" id="source_out" rows="20"></textarea>
			
		</div>
		<div class="label_holder">
			<h2 class="builder_label left">Log</h2>			
		</div>
		<div class="logger" id="logger">
			<ol id="log">
			</ol>
		</div>
		
		
	</div>