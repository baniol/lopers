//     Lopers.js 0.0.3
//     (c) 2012 Marcin Baniowski, baniowski.pl
//     Lopers may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://...
var Lopers = function(dbName){
	var self = this;

	// @todo move constructor to init method (or construct ?)
	this.version = '0.0.3';
	this.built = "20130104";
	this.debug = true;

	if(dbName === undefined || dbName === ''){
		throw new Error('db name not defined or empty string');
	}

	// common namespace
	this._dbName = dbName;

	// array with objects with each table structure (fields)
	this._schemas = [];

	// object containing data tables
	this._db;

	// cid counter
	// this._count = 1;

	if(localStorage.getItem('lopers_cid_count') === undefined){
		this._lastCid = 0;
		localStorage.setItem('lopers_cid_count',this._lastCid);
	}else{
		this._lastCid = localStorage.getItem('lopers_cid_count');
	}

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
		this._schemas.push(tableStr);

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
	this._getTableSchema = function(table){
		var out;
		for(var i in this._schemas){
			if(this._schemas[i].table == table){
				out = this._schemas[i].fields;
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
		var fields = this._getTableSchema(table);

		// console.log(arr);
		// console.log(fields);
		var fieldsLength = fields.length;
		if(fields['cid'] !== undefined){
			fieldsLength++;
		}
		if(arr.length !== fieldsLength)
			throw new Error('The number of values you trying to insert does not correspod the schema from setTable!');

		for(var i in fields){
			el[fields[i]] = arr[i];
		}

		// console.log(this._count);

		el['cid'] = this._getFirstCid();

		// get first avaliable cid number
		// el['cid'] = this.getFreeCid(table);

		// insert new record
		for(var i in this._db){
			if(this._db[i].table == table){
				this._db[i].records.push(el);
			}
		}
		// save to localStorage
		this.persistTable(fn);
	};

	this._getFirstCid = function(){
		var newCid = this._lastCid + 1;
		localStorage.setItem('lopers_cid_count',newCid);
		return newCid;
	};



	// updates a record
	// @todo - implement multiple conditions
	this.update = function(table,cond,fields){
		var index = this._pickRecords(table,cond);
		var record = this._pickRecordByIndex(table,index);
		for(var i in record){
			for(j in fields){
				if(i == j){
					record[i] = fields[j];
				}
			}
		}
		this.persistTable();
	};

	// @todo - implement multiple conditions
	this._pickRecordByIndex = function(table,index){
		var records = this._getTableData(table);
		return records[index];
	};
	
	// delete a record
	this.delete = function(table,cond){
		var found = this._pickRecords(table,cond);
		// @todo 2nd time called getTableData - maybe to temp cache ? - really necessary?
		var td = this._getTableData(table);
		for(var i in found){
			td.splice(found[i],1);
		}
		this.persistTable();
		return true;
	};

	// returns indexes of picked record by condition
	// @todo - implements multiple condigions (AND)
	// @todo maybe change name to _pickRecordIndex ?
	this._pickRecords = function(table,cond){
		var data = this._getTableData(table);
		var picked = [];
		for(var i=0;i<data.length;i++){
			var el = data[i];
			for(var j in cond){
				var key = j;
				var value = cond[j];
				if(el[key] == value){
					var index = this._getIndexByCid(table,el.cid);
					picked.push(index);
				}
			}
		}
		return picked;
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
	this._getIndexByCid = function(table,cid){
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

}