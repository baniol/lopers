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
			  	var cid = parseInt(c)+1;
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
		var html = '<div>';
		for(var i=0;i<categories.length;i++){
			html += '<ul>'
			var c = categories[i];
			html += c.name;
			var todos = db.getRecords('todos','category',c.cid);
			for(var j=0;j<todos.length;j++){
				var t = todos[j];
				html += '<li>'+t.name+'</li>';
			}
			html += '</ul>';
		}
		html += '</div>';
		$('#output').html(html);
	}

	// display output debug
	function debugOutput(){

	}

});