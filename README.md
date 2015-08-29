# bookshelf-relationships

Bookshelf currently doesn't have a way to list relationships. If you add this
plug-in into bookshelf you can add you relationship functions to a relationships
object like so:

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
