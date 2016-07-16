// build the pages

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var parseMeta = require('./parse-meta');
var template = require('./template');
var buildIndex = require('./build-index');
  
module.exports = function(cb){
  
  var cb = cb || function(){};

  Metalsmith(__dirname)
  .source('../src')
  .destination('../../blog')
  .use(markdown({
    smartypants: true,
    gfm: true,
    tables: true
  }))
  .use(parseMeta)
  .use(template)
  .use(buildIndex)
  .build(cb);
  
}

