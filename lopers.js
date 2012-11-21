//     Lopers.js 0.1
//     (c) 2012 Marcin Baniowski, baniowski.pl
//     Lopers may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://...
var Lopers = function(dbName){
	var self = this;

	this.version = '0.1';
	this.built = "20121111";
	this.debug = true;

	// common namespace
	this._dbName = dbName;

	// array with objects width each table structure (fields)
	this._tables = [];

	// object containing data tables
	this._db;

	var i = localStorage.getItem(self._dbName);
	if(i === null){
		this._db = localStorage.setItem(self._dbName,JSON.stringify([]));
		this._db = [];
	}else{
		this._db = JSON.parse(i);
	}

	// initialize table - name and data structure
	this.setTable = function(tableName,fields){
		if(tableName === undefined){
			this._error('Undefined table name');
		}
		if(fields === undefined){
			this._error('Undefined fields argument');
		}
		if(fields instanceof Array == false){
			this._error('Fields argument must an array');
		}
		// table structure
		var tableStr = {table:tableName,fields:fields};
		this._tables.push(tableStr);

		// check if tableName exists - prevents table doubling
		var c = this.getTableData(tableName);
		if(c !== undefined)
			return false;
		// add client ID
		fields.push('cid');
		this._db.push({table:tableName,records:[]});
		this.persistTable();
	};

	// Returns table data
	this.getTableData = function(table){
		var out;
		for(var i in this._db){
			if(this._db[i].table == table){
				out = this._db[i].records;
			}
		}
		if(out === undefined){
			this._error('Table '+ table +' not found!');
		}
		return out;
	};

	// Gets table fields (structure)
	this.getTableFields = function(table){
		var out;
		for(var i in this._tables){
			if(this._tables[i].table == table){
				out = this._tables[i].fields;
			}
		}
		if(out === undefined){
			this._error('Table '+ table +' not found!');
		}
		return out;
	};
	
	// Creates new record 
	this.insertRecord = function(table,arr,callback){
		// check arguments
		if(table === undefined){
			this._error('Undefined table name');
		}
		if(arr instanceof Array == false){
			this._error('Inserted values object argument must be of Array type');
		}

		// init empty object to insert
		var el = {};

		// get table structure - fields names
		var fields = this.getTableFields(table);
		for(var i in fields){
			el[fields[i]] = arr[i];
		}

		// get first avaliable cid number
		el['cid'] = this.getFreeCid(table);

		// insert new record
		this._pushRecord(el,table);

		// exec callback if defined
		if(typeof callback == 'function'){
			callback.call(this);
		}
	};

	// Inserts a new record
	this._pushRecord = function(el,table){
		for(var i in this._db){
			if(this._db[i].table == table){
				this._db[i].records.push(el);
			}
		}
		// save to localStorage
		this.persistTable();
	};
	
	// revrites record with new values
	this.editRecord = function(table,arr,key,callback){
		arr.push(key);
		var el = this.getItemByCid(table,key);
		var fields = this.getTableFields(table);
		for(var i=0;i<=arr.length;i++){
			el[fields[i]] = arr[i];
		}
		var index = this.getIndexByCid(table,key);
		var td = this.getTableData(table);
		td[index] = el;
		this.persistTable();
		if(typeof callback == 'function'){
			callback.call(this);
		}
	};
	
	// Updates specific field
	this.updateField = function(table,whereField,whereValue,targetField,newValue){
		var record = this.getRecords(table,whereField,whereValue);
		for(var i in record){
			var cid = record[i]['cid'];
			var index = self.getIndexByCid(table,cid);
			var td = this.getTableData(table);
			td[index][targetField]= newValue;
		}
		this.persistTable();
	};

	// deletes related records by key
	this.deleteRelated = function(table,whereField,whereValue){
		var rec = this.getRecords(table,whereField,whereValue);
		for(var i in rec){
			var cid = rec[i]['cid'];
			var index = self.getIndexByCid(table,cid);
			var td = this.getTableData(table);
			td.splice(index,1);
			this.persistTable();
		}
	};
	
	// Returns first free cid for a new record
	this.getFreeCid = function(table){
		var tableData = this.getTableData(table);
		var arr = [];
		for(var i in tableData){
			arr.push(tableData[i]['cid']);
		}
		if(arr.length == 0)
			return 1;
		else
			return Math.max.apply(Math,arr) + 1;
	};
	
	this.getIndexByCid = function(table,cid){
		var td = this.getTableData(table);
		var out;
		for(var i in td){
			if(td[i]['cid'] == cid)
				out = i;
		}
		return out;
	};
	
	this.persistTable = function(){
		localStorage.removeItem(self._dbName);
		localStorage.setItem(self._dbName,JSON.stringify(self._db));
	};
	
	/**
	 * Returns record by its client id
	 * @deprecated
	 */
	this.getItemByCid = function(table,cid){
		return this.getRecords(table,'cid',cid)[0];
	};
	
	/**
	 * Returns collection key by client id
	 */
	this.getIdByCid = function(table,cid){
		var out = null;
		var td = this.getTableData(table);
		for(var i in td){
			if(td[i]['cid'] == cid)
				out = i;
		}
		if(out !== null){
			return out;
		}else{
			this._error('object doesn`t exist');
		}
	};
	
	/**
	 * Gets all records from a table
	 * @todo - in case of 1 element return not array (otherwise [0] needed)
	 */
	this.getRecords = function(table,field,value){
		// get called table
		if(table === undefined){
			// @todo throw error - no table name
		}
		var tableData = this.getTableData(table);
		var out = [];
		for(var i in tableData){
			if(field !== undefined && value !== undefined){
				if(tableData[i][field] == value)
					out.push(tableData[i]);
			}else{
				out.push(tableData[i]);
			}
		}
		return out;
	};
	
	/**
	 * gets all values by the given key
	 */
	this.getValues = function(table,key){
		var out = [];
		var td = this.getTableData(table);
		for(var i in td){
			var obj = {};
			obj.value = td[i][key];
			obj.key = td[i]['cid'];
			out.push(obj);
		}
		return out;
	};

	/**
	 * Removes a record
	 */
	this.deleteRecord = function(table,cid,callback){
		var index = this.getIdByCid(table,cid);
		var td = this.getTableData(table);
		td.splice(index,1);
		this.persistTable();
		if(typeof callback == 'function'){
			callback.call(this);
		}
	};
	
	this.resetTable = function(){
		this.db = [];
		this.persistTable();
	};
	
	this.deleteTable = function(){
		delete this.db;
		this.persistTable();
	}
	
	/**
	 * @todo - unused for the moment
	 */
	this.countRecords = function(table){
		var td = this.getTableData(table);
		var c = 0;
		for(var i in td){
			c++;
		}
		return c;
	};

	/**
	 * Custom error handler
	 */
	this._error = function(msg){
		if(self.debug){
			// var m = "Lopers error: " + msg
			// console.log(m);
			throw new Error(msg);
		}
	};
}