var _ = require('lodash'),
    Metalsmith = require('metalsmith'),
    path = require('path').win32,
    markdown = require('metalsmith-markdown'),
    pug = require('pug'),
    request = require('request'),
    uncss = require('metalsmith-uncss')

var source = path.resolve('../wwwsrc')
var dest = path.resolve('../ms-build')

//todo:
// sort files by date when showing on index pages

Metalsmith(path.resolve('./'))
    .clean(false)
    .source(source)
    .use(sourceMeta)
    .destination(dest)
    .use(require('metalsmith-sass')({
        includePaths:["./node_modules/bulma"]
    }))

    .use(loadTemplates)         // load templates and add to metadata
    .use(msIgnores)             // ignore _ dirs
    .use(addMeta)               // add metadata to each file
    .use(markdown())            // load markdown
    .use(summarize)             // summarize
    .use(puggify)               // load pug templates
    .use(template)              // last step: wrap everything with main template
    .use(uncss({
        css: ['style.css'],	    // CSS files to run through UnCSS
        output: 'style.css',		// output CSS filename
        basepath: 'css',				 // optional base path where all your css files are stored
        removeOriginal: true,			// remove original CSS files from the build
        uncss: {							     // uncss options - passed directly to UnCSS
            ignore: [/\.nav-toggle/,/\.nav-menu/]  // nav toggle and nav menu are modified at runtime
        }
    }))
    .build(function(err) {      // build process
        if (err) throw err;     // error handling is required
    })

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

            //console.log(filename)
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
        file.meta.meta = md;                    // english: each file points to global MS Metadata.
        file.meta.files = files;                // point to all files within metadata
        file.meta.title = file.title || name;
        file.meta.date = file.date?(dateToEnglish(file.date)):"";
        file.meta.permalink = name;
        file.meta.summary = file.summary || '';
        file.meta.category = getCategoryForFilename(name);
        file.meta.isIndex = name.indexOf('index') > -1;

        if (file.title){
            file.meta.pagetitle = file.title;
        }else if (!file.meta.isIndex){
            file.meta.pagetitle = getGetNameForFilename(name);
        }else{
            file.meta.pagetitle = "";
        }

    });

    return done()
}

function template(files,metalsmith,done){
    var meta = metalsmith.metadata();
    var template = pug.compile(meta.template,{filename:meta.templateFilename});

    _.each(files,function(file,name){
        //pug var "html" is the file content
        if (path.parse(name).ext.toLowerCase() != ".html") return;
        if (!file.meta.contents){
            file.meta.content = _.extend({},file.meta)
            file.meta.content.html = file.contents.toString()
        }
        file.contents = template( _.extend({"_":_},file.meta,meta) );
    });

    return done();
}

// raw pug to HTML.  Pug can pull in vars about other files, so index pages can be built dynamically.
function puggify(files,metalsmith,done){

    _.each(files,function(file,name){
        file.meta.name = name;
        file.meta.permalink = "/"+name;
        file.meta.category = getCategoryForFilename(name);
    });

    _.each(files,function(file,name){
        var parsed = path.parse(name);
        var ext = parsed.ext.toLowerCase();
        var meta = metalsmith.metadata();
        if (ext == ".pug" || ext == ".jade"){
            var contents = pug.render(file.contents.toString(),_.extend({"_":_},file.meta,meta));
            file.contents = contents;
            delete files[name];
            files[path.join(parsed.dir,parsed.name+".html")] = file;
        }
    });
    return done();
}

// create the summary of a page if it doesn't already exist
function summarize(files,metalsmith,done){
  _.each(files,function(file,name){
    if (!file.meta.summary && path.parse(name).ext.toLowerCase() == ".html"){
      //get the first paragraph
      var c = file.contents.toString();
      var p0 = c.indexOf(c.match( /\<p\>/i )) + 3; // NOTE: this requires a strict <p> or <P>
      var p1 = c.indexOf(c.match(/\<\/p\>/i));
      if (p0 >= 0 || p1 >= 0){
        //first p
        file.meta.summary = c.slice(p0,p1);
      }

    }
  });
  return done();
}

function getCategoryForFilename(name){
    cat = ( path.dirname(name)||path.basename(name) ).toLowerCase();
    if (cat  == "."){
        return "";
    }
    return cat;
}

function getGetNameForFilename(name){
    return path.parse(name).name;
}

function dateToEnglish(d){
    var d = new Date(d);
    var mos = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var year = d.getFullYear();
    var month = mos[d.getMonth()];
    var day = d.getDate();

    return day + " " + month + " " + year;
}
