describe("Lopers init instance, checks for errors", function() {
    var dbName = 'test_name';

    afterEach(function() {
        // clear local storage test key
        localStorage.removeItem(dbName);
    });

    it('if dbName param not provided, throw error', function() {
        expect(function(){
            new Lopers();
        }).toThrow('db name not defined or empty string');
    });

    it('if dbName param is empty string, throw error', function() {
        expect(function(){
            new Lopers('');
        }).toThrow('db name not defined or empty string');
    });

    it('if lopers init successful, check if localStorage namespace exists and its value is `[]`', function() {
        localStorage.removeItem(dbName);
        var lopers = new Lopers(dbName);
        var check = localStorage.getItem(dbName);
        expect(check).toEqual('[]');
    });

    it('if value of localStorage item is not valid JSON, throw error', function() {
        localStorage.setItem(dbName,'some string');
        expect(function(){
            new Lopers(dbName);
        }).toThrow('String from localStorage is not in valid JSON format');
    });
	
});