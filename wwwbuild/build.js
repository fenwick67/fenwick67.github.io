var _ = require('lodash'),
    Metalsmith = require('metalsmith'),
    path = require('path')


Metalsmith(path.resolve('./'))
    .source('../wwwsrc')
    .destination('../')
    .use(msIgnores)
    .use(buildIndex)    
    .use(puggify)
    .build(function(err) {      // build process
        if (err) throw err;       // error handling is required
    });


function msIgnores(files,metalsmith,done){
    _.each(files,function(file,name){
        if (name.charAt(0) == "_"){
            delete files[name];
        }
    });
    return done();
}

function puggify(files,metalsmith,done){
    _.each(files,function(file,name){
        ext = path.extname(name).toLowerCase();
        if (ext == 'jade' || ext == "pug"){
            console.log(file);
        }
    })
}

function buildIndex(files,metalsmith,done){
    _.each(files,function(file,name){

    });
}