//run build script

var build = require('./lib/build.js');

build(function(er){
  if(er){
    console.error('problem:');
    console.error(er);
  }
  console.log('done');
});