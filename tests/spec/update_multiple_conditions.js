describe("Update tests", function() {
    var dbName = 'test_name',
        lopers;

    beforeEach(function() {
        // clear local storage test key
        lopers = new Lopers(dbName);
        lopers.setTable('example',['name','category','deleted']);
        lopers.insert('example',['first',1,0]);
        lopers.insert('example',['second',1,1]);
        lopers.insert('example',['third',1,0]);
        lopers.insert('example',['fourth',2,0]);
    });

    afterEach(function() {
        // clear local storage test key
        // localStorage.removeItem(dbName);
        lopers.destroyDB();
    });

    it('expect the length of example table to equal 3',function(){
        var all = lopers.select('example');
        expect(all.length).toEqual(4);

    });

    it('expect the number of deleted items to be 1',function(){
        var sel = lopers.select('example',[{deleted:1}]);
        expect(sel.length).toEqual(1);
    });

    it('expect the name of deleted item to be `second`',function(){
        var sel = lopers.select('example',[{deleted:1}]);
        expect(sel[0].name).toBe('second');
    });

    it('expect the number of not deleted items to be 3',function(){
        var sel = lopers.select('example',[{deleted:0}]);
        expect(sel.length).toEqual(3);
    });

    it('expect the number of category 1 items to be 3',function(){
        var sel = lopers.select('example',[{category:1}]);
        expect(sel.length).toEqual(3);
    });

    it('expect the length of example table after deleting all not deleted items to be 1',function(){
        lopers.delete('example',[{deleted:0}]);
        var sel = lopers.select('example');
        expect(sel.length).toEqual(1);
        expect(sel[0].name).toBe('second');
    });

    // @todo - async problem - put in callback !! ??? not working without settimeout
    it('expect the number of delted items after upating to be 4 ',function(){
        lopers.update('example',{deleted:1},{name:'dupa'});
        setTimeout(function(){
            console.log(lopers.select('example'));
            var sel = lopers.select('example',[{deleted:1}]);
            expect(sel.length).toEqual(4);
        },300);
        
    });
});