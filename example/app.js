$(document).ready(function(){

	var exampleData = true;

	// object instance with a common namespace
	var db = new Lopers('lopers_demo');
	// initialization of categories table
	db.setTable('categories',['name']);
	//initialization of todo items table
	db.setTable('todos',['category','name']);

	var countCat = db.getCount('categories');

	// add some sample data (if not exists)
	if(countCat == 0 && exampleData){
		db.resetCounter();
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
	displayCategoryTree(true);

	// console.log(db.serialize(false));

	// testSelect();
	// show();

	// debug function for displaying stored data
	function displayCategoryTree(start){
		var categories = db.select('categories');
		var html = '<div id="tree">';

		for(var i=0;i<categories.length;i++){
			var c = categories[i];
			var todos = db.select('todos',{category:c.cid});
			html += '<ul data-cid="'+c.cid+'">'
			html += '<div class="cat-wrapper">';
			html += '<span class="cat-name">'+c.name+'</span><span> ('+todos.length+')</span><span class="edit">edit</span><span class="delete">delete</span>';
			html += '<div class="add"><input type="text" /><input type="submit" value="add todo" /></div>';
			html += '</div>';
			for(var j=0;j<todos.length;j++){
				var t = todos[j];
				html += '<li data-cid="'+t.cid+'"><span class="name">'+t.name+'</span>';
				html += '<span class="edit">edit</span><span class="remove">remove</span></li>';
			}
			html += '</ul>';
		}

		html += '</div>';
		$('#output').html(html);
		if(start)
			bindEvents();

		// show();
	}

	function show(){
		console.log(db.select('categories'));
		console.log(db.select('todos'));
	}

	function testSelect(){
		var pi = db.select('todos',[{cid:2},{cid:4}]);
		console.log(pi);
	}

	// bind events for tree data manipulation
	function bindEvents(){

		// add category
		$('#add-category').submit(function(e){
			e.preventDefault();
			var input = $(this).find('input[type=text]');
			var catName = $.trim(input.val());
			if(input.val() != ''){
				db.insert('categories',[catName]);
				displayCategoryTree();
				input.val('');
			}
		});

		// edit category
		$(document).on('click','.cat-wrapper .edit',function(){
			var el = $(this);
			var ul = el.closest('ul');
			el.text('save');
			var cid = ul.data('cid');
			var name = ul.find('.cat-name');
			name.attr('contenteditable',true).addClass('edited').focus();
			name.on('blur',function(){
				el.text('edit');
				$(this).removeAttr('contenteditable').removeClass('edited');
				var val = $.trim($(this).text());
				db.update('categories',{name:val},{cid:cid});
				name.off('blur');
			});
		});

		// delete category
		$(document).on('click','.cat-wrapper .delete',function(){
			var el = $(this);
			var ul = el.closest('ul');
			var cid = ul.data('cid');
			var co = db.getCount('todos',{category:cid});
			if(co == 0){
				db.delete('categories',{cid:cid});
				displayCategoryTree();
			}else{
				if(confirm('Are you sure? All items under this category will also be deleted!')){
					// delete all related items
					db.delete('todos',{category:cid});
					db.delete('categories',{cid:cid});
					displayCategoryTree();
				}
			}

		});

		// remove todo
		$(document).on('click','#tree ul li .remove',function(){
			var li = $(this).closest('li');
			var cid = li.data('cid');
			db.delete('todos',{cid:cid});
			// li.remove();
			displayCategoryTree();
		});

		// edit todo
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
				db.update('todos',{name:val},{cid:cid});
				name.off('blur');
			});
		});

		// add todo
		$(document).on('click','.cat-wrapper .add input[type=submit]',function(){
			var el = $(this);
			var ul = el.closest('ul');
			var cid = ul.data('cid');
			var val = ul.find('.add input[type=text]').val();
			if(val != ''){
				db.insert('todos',[cid,val]);
				displayCategoryTree();
			}
		});

		$('#clear-ls').click(function(){
			db.destroyDB();
			$('#output').empty();
		});
	}

});