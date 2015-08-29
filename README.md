# bookshelf-relationships

Bookshelf currently doesn't have a way to list relationships.

## Install
```bash
npm install bookshelf-relationships --save
```

Then add this to where you are building your bookshelf object:
```javascript
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(require('bookshelf-relationships'));
```

## Usage

Now you can add you relationship functions to a relationships like below. They
will also get added to the model directly so don't worry all code and plug-ins
will still work.

```javascript
var Post = bookshelf.Model.extend({
  tableName: 'posts',

  relationships: {
    comments: function() {
      return this.hasMany('Comment');
    }
  }
});
```

Now you will be able to access the function names via model.relationships like so:

```javascript
return Post.forge({ text: 'Test Post'}).save().then(function(post) {

  Object.keys(post.relationships).forEach(function(key) {

    //list out relationship and the meta info for it
    console.log(key, post.related(key).relatedData);

  });
});
```
