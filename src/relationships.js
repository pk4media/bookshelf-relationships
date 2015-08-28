'use strict';

var _ = require('lodash');

module.exports = function(bookshelf) {
  var base = bookshelf.Model;
  var baseExtend = bookshelf.Model.extend;

  bookshelf.Model.extend = function(protoProps, constructorProps) {
    if (protoProps.relationships) {
      var keys = Object.keys(protoProps.relationships);
      for (var i = 0, len = keys.length; i < len; i++) {
        protoProps[keys[i]] = protoProps.relationships[keys[i]];
      }
    }

    var model = baseExtend.call(this, protoProps, constructorProps);

    model.prototype.relationships = model.prototype.relationships || {};
   _.defaults(model.prototype.relationships, this.prototype.relationships || {});

    return model;
  };
};
