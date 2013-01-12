xdescribe("Test structure on example data", function() {

    var db;

    beforeEach(function() {
        db = exampleData.db;
        exampleData.makeCats(db);
    });

    afterEach(function() {
        // clear local storage test key
        exampleData.destroyCats(db);
    });

    xit('some some some ...', function() {
        var h = testHelpers;
        console.log(h.getCids(db));
        // expect(function(){
        //     lopers.setTable('tableName',['oneField']);
        //     lopers.insert('tableNameOne',['oneValue']);
        // }).toThrow('Table tableNameOne not found!');
    });

});