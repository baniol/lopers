## A Small Javascript Library for Local Storage Persistence
---
Lopers.js is a small javascript library for web application using local storage for client-side data persistence. The library uses a more database-like approach, providing a common namespace for multiple tables (nested associative arrays) where you can store data in JSON format.
---

### Initialization

```javascript
var db = new Lopers('lopers_demo'); // object instance with a common namespace
db.setTable('categories',['name']); // initialization of categories table
db.setTable('todos',['category','name','done']); //initialization of todo items table
```

### CRUD

Getting all records from a table:

```javascript
var categories = db.select('categories');
```

Records by a foreign key:

```javascript
// this will get all todo items with 'category' property equal to '2'
var todos = db.select('todos',{category:2});
```

Lopers supports selecting with multiple conditions. Getting all items belonging to category 2 with done flag set to 1:

```javascript
db.select('todos',{category:2,done:1});
```

### Inserting records

The insert method takes 2 arguments: name of the table and property list. Number and sequence of properties must match those from the initialization method.

```javascript
// insert category
var catName = 'first category';
db.insrt('categories',[catName]);

// insert todo item with category id and done flag
var catID = 1;
var todoName = 'first todo item';
db.insert('todos',[catID,todoName,0]);
```

Each insert appends a client id internal property and a timestamp, so after you have inserted a new record, for example: db.insert(‘todos’,[‘wash the dishes’,2,0]) - (name, category id, done flag) the actual record object would look:

```javascript
{
  cid:3,
  name:'wash the dishes',
  category:2,
  done:0,
  time:1359054312629
}
```

### Updating records

The update methods takes 3 arguments: table name, fields to update and update conditions.

```javascript
// update name to `edited` for a record with cliend id = 3
db.update('categories',{name:'edited'},{cid:3});
``

Setting all items belonging to category 2 to done would involve:

```javascript
db.update('categories',{done:1},{category:2});
```

### Deleting records

```javascript
// delete record by client id
db.delete('categories',{cid:4});
// delete all items with category = 2 and done = 1
db.delete('todos',{category:2,done:1});
```

### Additional methods

```javascript
// destroying lopers oblects and accompanying local storage items
db.destroyDB();
// getting table length, total or with condidions
db.getCount('categories');
db.getCount('todos',{category:2});
// dumping db structure. This method takes an argument, if true the output is a string, otherwise it's an object
db.dump(true);
```