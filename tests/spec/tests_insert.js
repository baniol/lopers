describe("Insert/remove records to table", function() {
    var dbName = 'test_name',
        lopers;

    beforeEach(function() {
        // clear local storage test key
        lopers = new Lopers(dbName);
    });

    afterEach(function() {
        // clear local storage test key
        localStorage.removeItem(dbName);
    });

    it('if table name does not exist, throw error', function() {
        expect(function(){
            lopers.setTable('tableName',['oneField']);
            lopers.insert('tableNameOne',['oneValue']);
        }).toThrow('Table tableNameOne not found!');
    });

    it('if inserted fields do not correspond table schema, throw error', function() {
        expect(function(){
            lopers.setTable('tableName',['oneField','twoField','threeField']);
            lopers.insert('tableName',['oneValue']);
        }).toThrow('The number of values you trying to insert does not correspod the schema from setTable!');
    });

    xit('additionnal', function() {
        expect(function(){
            lopers.setTable('tableName',['oneField','twoField','threeField']);
            lopers.insert('tableName',['oneValue']);
        }).toThrow('The number of values you trying to insert does not correspod the schema from setTable!');
    });

    // @todo - yet to be written
    xit('after inserting a record, check if it exists.', function() {
        expect(function(){
            lopers.setTable('tableName',['oneField']);
            lopers.insert('tableName',['oneValue']);
        }).toThrow('The number of values you trying to insert does not correspod the schema from setTable!');
    });

    // @todo - yet to be written
    xit('after deleting a record, check if it exists. If so, throw error', function() {
        expect(function(){
            lopers.setTable('tableName',['oneField']);
            lopers.insert('tableName',['oneValue']);
        }).toThrow('The number of values you trying to insert does not correspod the schema from setTable!');
    });

    // @todo - yet to be written
    xit('after deleting a record, check the number of records in collection. If else than minus one, throw error', function() {
        expect(function(){
            lopers.setTable('tableName',['oneField']);
            lopers.insert('tableName',['oneValue']);
        }).toThrow('The number of values you trying to insert does not correspod the schema from setTable!');
    });

    // @todo - tests to be written:
    // * correctness of localStorage string after persistTable
    // * check if cid do not double

});