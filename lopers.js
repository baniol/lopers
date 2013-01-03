//     Lopers.js 0.0.2
//     (c) 2012 Marcin Baniowski, baniowski.pl
//     Lopers may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://...
var Lopers = function(dbName){
	var self = this;

	// @todo move constructor to init method (or construct ?)
	this.version = '0.0.2';
	this.built = "20130103";
	this.debug = true;

	if(dbName === undefined || dbName === ''){
		throw new Error('db name not defined or empty string');
	}

	// common namespace
	this._dbName = dbName;

	// array with objects with each table structure (fields)
	this._tables = [];

	// object containing data tables
	this._db;

	var i = localStorage.getItem(self._dbName);
	if(i === null){
		this._db = localStorage.setItem(self._dbName,JSON.stringify([]));
		this._db = [];
	}else{
		try{
			this._db = JSON.parse(i);
		}
		catch(e){
			throw new Error('String from localStorage is not in valid JSON format');
		}
	}

	// initialize table - name and data structure
	this.setTable = function(tableName,fields){
		var $this = this;
		if(typeof tableName !== 'string'){
			throw new Error('Table name must be a string!');
		}
		if(fields instanceof Array == false){
			throw new Error('Fields argument must be an array!');
		}
		if(fields.length == 0){
			throw new Error('Fields argument must not be an empty array!');
		}
		// table structure
		var tableStr = {table:tableName,fields:fields};
		this._tables.push(tableStr);

		// check if tableName exists - prevents table doubling
		this._checkTableName(tableName,function(){
			// add client ID
			fields.push('cid');
			$this._db.push({table:tableName,records:[]});
			$this.persistTable();
		});
	};

	// checks for table name availability - if already exists returns false: @todo - decribe more
	this._checkTableName = function(tableName,fn){
		for(var i in this._db){
			if(this._db[i].table == tableName){
				return false;
				// throw new Error('Table name must be unique!');
			}
		}
		if(typeof fn === 'function'){
			fn();
		}
	};

	// Returns table data
	this._getTableData = function(table){
		// @todo check if table exists
		var out;
		for(var i in this._db){
			if(this._db[i].table == table){
				out = this._db[i].records;
			}
		}
		if(out === undefined){
			throw new Error('Table '+ table +' not found!');
		}
		return out;
	};

	// Gets table fields (structure)
	this._getTableFields = function(table){
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
	this.insert = function(table,arr,fn){
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
		var fields = this._getTableFields(table);
		for(var i in fields){
			el[fields[i]] = arr[i];
		}

		// get first avaliable cid number
		el['cid'] = this.getFreeCid(table);

		// insert new record
		for(var i in this._db){
			if(this._db[i].table == table){
				this._db[i].records.push(el);
			}
		}
		// save to localStorage
		this.persistTable(fn);
	};

	// revrites record with new values
	this.editRecord = function(table,arr,key,fn){
		arr.push(key);
		var el = this.getItemByCid(table,key);
		var fields = this._getTableFields(table);
		for(var i=0;i<=arr.length;i++){
			el[fields[i]] = arr[i];
		}
		var index = this.getIndexByCid(table,key);
		var td = this._getTableData(table);
		td[index] = el;
		this.persistTable(fn);
	};
	
	// Updates specific field
	this.updateField = function(table,whereField,whereValue,targetField,newValue,fn){
		var record = this.getRecords(table,whereField,whereValue);
		for(var i in record){
			var cid = record[i]['cid'];
			var index = self.getIndexByCid(table,cid);
			var td = this._getTableData(table);
			td[index][targetField]= newValue;
		}
		this.persistTable(fn);
	};

	// deletes related records by key
	this.deleteRelated = function(table,whereField,whereValue,fn){
		var rec = this.getRecords(table,whereField,whereValue);
		for(var i in rec){
			var cid = rec[i]['cid'];
			var index = self.getIndexByCid(table,cid);
			var td = this._getTableData(table);
			td.splice(index,1);
			this.persistTable(fn);
		}
	};
	
	// Returns first free cid for a new record
	this.getFreeCid = function(table){
		var tableData = this._getTableData(table);
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
		var td = this._getTableData(table);
		var out;
		for(var i in td){
			if(td[i]['cid'] == cid)
				out = i;
		}
		return out;
	};
	
	this.persistTable = function(fn){
		localStorage.removeItem(self._dbName);
		localStorage.setItem(self._dbName,JSON.stringify(self._db));
		if(typeof fn === 'function')
			fn();
	};
	
	/**
	 * Returns collection key by client id
	 */
	this.getIdByCid = function(table,cid){
		var out = null;
		var td = this._getTableData(table);
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
	 * Gets first field value
	 * @todo - throw exception if field || value undefined
	 */
	this.getOne = function(table,field,value){
		var tableData = this._getTableData(table);
		var out = false;
		for(var i in tableData){
			if(field !== undefined && value !== undefined){ // @todo exception instead
				if(tableData[i][field] == value)
					out = tableData[i];
			}
		}
		return out;
	};
	
	/**
	 * Gets all records from a table
	 * @todo - in case of 1 element return not array (otherwise [0] needed)
	 * @todo - rename to getSet ?
	 */
	this.getRecords = function(table,field,value){
		// get called table
		if(table === undefined){
			// @todo throw error - no table name
		}
		var tableData = this._getTableData(table);
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
		var td = this._getTableData(table);
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
	this.deleteRecord = function(table,cid,fn){
		var index = this.getIdByCid(table,cid);
		var td = this._getTableData(table);
		td.splice(index,1);
		this.persistTable();
		if(typeof fn == 'function'){
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
		var td = this._getTableData(table);
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