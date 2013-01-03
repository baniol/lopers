$(document).ready(function(){

	// object instance with a common namespace
	var db = new Lopers('lopers_demo');
	// initialization of categories table
	db.setTable('categories',['name']);
	//initialization of todo items table
	db.setTable('todos',['category','name']);

	// add some sample data (if not exists)
	var checkForSample = db.getOne('categories','name','sample category');
	if(!checkForSample){
		// insert category
		var catName = 'sample category';
		db.insertRecord('categories',[catName],function(){
		  	displayCategories();
		});
	}

	// debug function for displaying stored data
	function displayCategories(){
		var categories = db.getRecords('categories');
		console.log(categories);
	}

	// display output debug
	function debugOutput(){

	}

});