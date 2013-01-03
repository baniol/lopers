describe("Lopers set table methods", function() {
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

    it('if table name not string, throw error', function() {
        expect(function(){
            lopers.setTable();
        }).toThrow('Table name must be a string!');
    });

    it('if Fields arg not Array, throw error', function() {
        expect(function(){
            lopers.setTable('category');
        }).toThrow('Fields argument must be an array!');
    });

    it('if Fields arg Empty Array, throw error', function() {
        expect(function(){
            lopers.setTable('category',[]);
        }).toThrow('Fields argument must not be an empty array!');
    });

    // it('if Table Name already exists, throw error', function() {
    //     expect(function(){
    //         lopers.setTable('category',['first']);
    //         // trying to set table with the same name
    //         lopers.setTable('category',['first']);
    //     }).toThrow('Table name must be unique!');
    // });

    // @todo - next tests:
    // checkTableName - if while initialized table name exists - just read from it (localStorage) to object
    // after seting a new table = check if localStorate string correct (with cid)

});