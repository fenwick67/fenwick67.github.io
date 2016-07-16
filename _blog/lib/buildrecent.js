//build "recent posts" metadata

var _ = require('lodash');

module.exports = function(files, metalsmith, callback){
  var sorted = _.sortBy(files,'date');
  // sorted small to high i.e. old to new
  
  
  
}