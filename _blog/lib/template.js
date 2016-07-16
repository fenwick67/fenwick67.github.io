// my template!
var fs = require('fs');
var _ = require('lodash');
var jade = require('pug');  
var path = require('path');

var util = require('util');


module.exports = function(files, metalsmith, callback){
  
  //post template 
  var postTmpl = fs.readFileSync(path.join(__dirname, '../post.jade'));
  var compiler = jade.compile(postTmpl,{pretty:true});
  
  var recent = [];// TODO
  
  _.each(files,function(file,name){
        
    var post = _.extend({},file);
    post.contents = post.contents.toString();
    
    var locals = {post:post,recent:recent};
    
    file.contents = new Buffer(compiler(locals));
  });
  callback();
};