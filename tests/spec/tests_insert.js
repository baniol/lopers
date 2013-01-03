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


});