xdescribe("Test structure on example data", function() {

    var db = new Lopers('lopers_tests_cats');

    beforeEach(function() {
        db.setTable('items',['name','parent']);
        var p = 0;
        for(var i=0;i<1000;i++){
            if(i % 10 == 0)
                p++;
            db.insert('items',['item_'+i,p]);
            // console.log(db._lastCid);
        }

        // select groups 10 x 10
        var groups = [];
        var c = 0;
        for(var i=1;i<10;i++){
            var picked = db.select('items',{parent:i});
            // for(var j=1;j<picked.length;j++){
            //     var k = i*j;
            //     // console.log(k);
            //     db.update('items',{parent:k},{parent:k+1});
            // }
            c = c +  picked.length;
            groups.push(picked);

        }
        console.log(db.getCount('items'));
        console.log(c);
        // console.log(groups);
        // var sel = db.select('items',{parent:10});
        // console.log(sel);
    });

    afterEach(function() {
        db.destroyDB();
    });

    it('some some some ...', function() {
        var items = db.select('items');
        // console.log(items);
        // var h = testHelpers;
        // console.log(h.getCids(db));
        // expect(function(){
        //     lopers.setTable('tableName',['oneField']);
        //     lopers.insert('tableNameOne',['oneValue']);
        // }).toThrow('Table tableNameOne not found!');
    });

});