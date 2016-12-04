var _ = require('lodash'),
    Metalsmith = require('metalsmith'),
    path = require('path'),
    markdown = require('metalsmith-markdown'),
    pug = require('jade')

var source = '../wwwsrc'


Metalsmith(path.resolve('./'))
    .clean(false)
    .source(source)
    .use(sourceMeta)
    .destination('../')
    .use(loadTemplates)         // load templates and add to metadata
    .use(msIgnores)             // ignore _ dirs
    .use(addMeta)               // add metadata to each file
    .use(markdown())            // load markdown
    .use(puggify)               // load pug templates
    .use(template)              // last step: wrap everything with main template 
    .build(function(err) {      // build process
        if (err) throw err;     // error handling is required
    });


function msIgnores(files,metalsmith,done){
    _.each(files,function(file,name){
        if (name.charAt(0) == "_"){
            delete files[name];
        }
    });
    return done();
}

function loadTemplates(files,ms,done){
    var meta = ms.metadata();
    meta.templates = {};

    _.each(files,function(file,name){

        if (path.dirname(name) == "_templates"){
            // add to metatdata
            var filename = path.resolve(path.join(source,name));
            var templateName = path.parse(name).name;

            console.log(filename)
            meta.template = file.contents.toString();
            meta.templateFilename = filename;
            // delete from transform files
            delete files[name];
        }
    });
    return done()
}

function sourceMeta(files,ms,done){
    var toMatch = "site.json";
    var meta= ms.metadata();
    _.each(files,function(file,name){
        if (name.toLowerCase().indexOf(toMatch) > -1){
            _.extend(meta,JSON.parse(file.contents.toString()))
        }
    });
    return done();
}

function addMeta(files,ms,done){
    var md = ms.metadata();
    // add metadata to each file
    _.each(files,function(file,name){
        file.meta = {};
        file.meta.meta = md;// english: each file points to global MS Metadata.
        file.meta.files = files;// point to all files within metadata
        file.meta.title = "";
        file.meta.permalink = name;        
        file.meta.category = getCategoryForFilename(name);
    });

    return done()
}

function template(files,metalsmith,done){
    var meta = metalsmith.metadata();

    var template = pug.compile(meta.template,{filename:meta.templateFilename});

    _.each(files,function(file,name){
        //pug var "html" is the file content
        if (!file.meta.contents){
            file.meta.content = _.extend({},file.meta)
            file.meta.content.html = file.contents.toString()
        }
        file.contents = template( _.extend({},file.meta,meta) );
    });

    return done();
}

// raw pug to HTML.  Pug can pull in vars about other files, so index pages can be built dynamically.
function puggify(files,metalsmith,done){
    _.each(files,function(file,name){
        var parsed = path.parse(name);
        var ext = parsed.ext.toLowerCase();
        if (ext == ".pug" || ext == ".jade"){
            console.log(file.meta)
            var contents = pug.render(file.contents.toString(),file.meta);
            file.contents = contents;
            delete files[name];
            files[path.join(parsed.dir,parsed.name+".html")] = file;
        }
    });
    return done();
}

function getCategoryForFilename(name){
    return (path.dirname(name)||path.win32.basename(name)).toLowerCase()
}