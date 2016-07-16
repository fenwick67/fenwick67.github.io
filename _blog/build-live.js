//build live

var build = require('./lib/build.js');
var fs = require('fs');
var ecstatic = require('ecstatic');
var http = require('http');
var path = require('path');
var _ = require('lodash');

var rebuild = _.throttle(function (){
  console.log('rebuilding...');
  
  build(function(er){
    if(er){
      console.error('problem:');
      console.error(er);
    } 
    console.log('rebuilt successfully');
  });
},500);


fs.watch(path.join(__dirname,'src'),rebuild);
fs.watch(__dirname,{recursive:false},rebuild);

http.createServer(
  ecstatic({ root: path.join(__dirname,'../') })
).listen(8080);

console.log('Listening on :8080');

rebuild();