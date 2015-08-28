'use strict';

var expect = require('must');
var BPromise = require('bluebird');

var knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: "./mytestdb" }
});

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');
bookshelf.plugin(require('../src/relationships'));

describe('Relationship Tests', function() {

  before(function() {
    return BPromise.all([
      knex.schema.dropTableIfExists('posts').then(function() {
        return knex.schema.createTable('posts', function(t) {
          t.increments('id').primary();
          t.text('text');
          t.dateTime('post_date').defaultTo(knex.raw("(DATETIME('now'))"));
        });
      }),
      knex.schema.dropTableIfExists('comments').then(function() {
        return knex.schema.createTable('comments', function(t) {
          t.increments('id').primary();
          t.integer('post_id').unsigned().references('id').inTable('posts');
          t.text('text');
          t.dateTime('comment_date').defaultTo(knex.raw("(DATETIME('now'))"));
        });
      })
    ]);
  });

  var Comment, Post, InternalPost, Note;

  before(function() {
    Comment = bookshelf.Model.extend({
      tableName: 'comments',

      relationships: {
        post: function() {
          return this.belongsTo('Post', 'post_id');
        }
      }
    });

    Comment = bookshelf.model('Comment', Comment);

    Post = bookshelf.Model.extend({
      tableName: 'posts',

      relationships: {
        comments: function() {
          return this.hasMany('Comment');
        }
      }
    });

    Post = bookshelf.model('Post', Post);

    InternalPost = Post.extend({
      relationships: {
        notes: function() {
          return this.hasMany('Note');
        }
      }
    });

    InternalPost = bookshelf.model('InternalPost', InternalPost);

    Note = bookshelf.Model.extend({
      tableName: 'notes',

      relationships: {
        post: function() {
          return this.belongsTo('Post', 'post_id');
        }
      }
    });

    Note = bookshelf.model('Note', Note);
  });

  it('can find a hasMany and blongsTo relationship', function() {
    var testPost = new Post({ text: 'Test Post'});
    return testPost.save().then(function(post) {
      expect(post.relationships).is.an.object();

      expect(post.relationships.comments).is.a.function();
      expect(post.related('comments')).is.a.object();
      expect(post.related('comments').relatedData.type).is.equal('hasMany');

      var testComment = new Comment({ text: 'Test Comment', post_id: post.id });

      return testComment.save().then(function(comment) {
        expect(comment.relationships).is.an.object();

        expect(comment.relationships.post).is.a.function();
        expect(comment.related('post')).is.a.object();
        expect(comment.related('post').relatedData.type).is.equal('belongsTo');
      });
    });
  });

  it('can find and merge relationships from inherited models', function() {
    var testPost = new InternalPost({ text: 'Test Post'});
    return testPost.save().then(function(post) {
      expect(post.relationships).is.an.object();

      expect(post.relationships.comments).is.a.function();
      expect(post.related('comments')).is.a.object();
      expect(post.related('comments').relatedData.type).is.equal('hasMany');

      expect(post.relationships.notes).is.a.function();
      expect(post.related('notes')).is.a.object();
      expect(post.related('notes').relatedData.type).is.equal('hasMany');
    });
  });

});
