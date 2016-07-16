//parse metadata from post filenames
var _ = require('lodash');

module.exports = function(files, metalsmith, callback){
  
  // add metadata to each file
  _.each(files,(file,filename)=>{
    
    // title and date from the filename
    var split = filename.split(' ');
    var date = new Date(split[0]);    
    split.shift();    
    var title = split.join(' ').replace(/\.\w*$/,'');//remove file extension    
    file.title = title;
    file.date = date;
    
    // href
    
    file.href = `/blog/${filename}`;
    
  });
  
  //get prev and next posts
  var sorted = _.sortBy(files,function(file){
    return file.date.getTime();
  });
  
  sorted.forEach((file,index)=>{
    if (index > 0){
      file.previous = sorted[index-1];
    }else{
      file.previous = null;
    }
    
    if (index < sorted.length - 1){
      file.next = sorted[index+1];
    }else{
      file.next = null;
    }
    
  });
  
  callback();
};