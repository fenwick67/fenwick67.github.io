var build = require('./build').build
var watch = require('watch')
const connect = require('connect')
var livereload = require('livereload');

watch.watchTree('.',{
    filter: s=>s.indexOf('src') > -1 || s.indexOf('static') > -1
},async function(f,curr,prev){
    await build({dev:true});
    console.log('built')
});

const app = connect()

app.use(require('serve-static')(__dirname+'/dist'));
app.listen(8080);

var lrserver = livereload.createServer();
lrserver.watch(__dirname + "/dist");