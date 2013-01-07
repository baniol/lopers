$(document).ready(function(){

	// object instance with a common namespace
	var db = new Lopers('lopers_demo');
	// initialization of categories table
	db.setTable('categories',['name']);
	//initialization of todo items table
	db.setTable('todos',['category','name']);

	// add some sample data (if not exists)
	var checkForSample = db.getOne('categories','name','sample category One');
	if(!checkForSample){
		// insert categories
		var catArray = ['One','Two'];
		for(var c in catArray){
			var catName = 'sample category '+catArray[c];
			db.insert('categories',[catName],function(){
			  	// insert some todos
			  	var cid = c == 0 ? 1 : 6;
			  	for(var i=1;i<5;i++){
			  		db.insert('todos',[cid,'todo_'+i]);
			  	}
			});
		}
	}
	displayCategoryTree();

	// debug function for displaying stored data
	function displayCategoryTree(){
		var categories = db.getRecords('categories');
		console.log(categories);
		var html = '<div id="tree">';
		for(var i=0;i<categories.length;i++){
			var c = categories[i];
			html += '<ul data-cid="'+c.cid+'">'
			html += '<div class="cat-name">'+c.name+'</div>';
			var todos = db.getRecords('todos','category',c.cid);
			for(var j=0;j<todos.length;j++){
				var t = todos[j];
				html += '<li data-cid="'+t.cid+'"><span class="name">'+t.name+'</span><span class="edit">edit</span><span class="remove">remove</span></li>';
			}
			html += '</ul>';
		}
		html += '</div>';
		$('#output').html(html);
		bindEvents();
	}

	// bind events for tree data manipulation
	function bindEvents(){

		$('#add-category').submit(function(e){
			e.preventDefault();
			var input = $(this).find('input[type=text]');
			var catName = $.trim(input.val());
			input.val('');
			db.insert('categories',[catName]);
		});

		$(document).on('click','#tree ul li .remove',function(){
			var li = $(this).closest('li');
			var cid = li.data('cid');
			if(db.delete('todos',{cid:cid})){
				li.remove();
			}
		});

		$(document).on('click','#tree ul li .edit',function(){
			var el = $(this);
			var li = el.closest('li');
			el.text('save');
			var cid = li.data('cid');
			var name = li.find('.name');
			name.attr('contenteditable',true).addClass('edited').focus();
			name.on('blur',function(){
				el.text('edit');
				$(this).removeAttr('contenteditable').removeClass('edited');
				var val = $.trim($(this).text());
				db.update('todos',{cid:cid},{name:val});
				name.off('blur');
			});
		});
	}

});