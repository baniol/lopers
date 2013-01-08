var exampleData = {

	db: new Lopers('lopers_tests_cats'),

	makeCats: function(db){
		
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
	},

	destroyCats: function(db){
		db.destroyDB();
	}

};