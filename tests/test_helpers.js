var testHelpers = {
	getCids: function(db){
		var tables = db._db;
		var out = [];
		for(var i=0;i<tables.length;i++){
			var t = tables[i];
			var records = t.records;
			for(var j=0;j<records.length;j++){
				var cid = records[j]['cid'];
				out.push(cid);
			}
		}
		return out;
	}
};