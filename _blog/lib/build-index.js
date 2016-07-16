// index = first post
var _ = require('lodash');

module.exports = function(files, metalsmith, callback){
    
  var mostRecent = _.last(_.sortBy(files,file=>{return file.date.getTime()}));
  
  files['index.html'] = mostRecent;
  
  callback();
};