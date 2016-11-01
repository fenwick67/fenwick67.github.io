#!/bin/bash
# Build this shiz
# deps: browserify 12.0.1, lessc 2.7.1

comps=dead_code,sequences,unsafe,drop_debugger,conditionals,comparisons,evaluate,booleans,loops,unused,collapse_vars,reduce_vars,join_vars,drop_console,properties,drop_debugger,cascade,keep_fargs=false,keep_fnames=false

./node_modules/.bin/browserify index.js > build.js
./node_modules/.bin/lessc style.less > style.less.css
./node_modules/.bin/uglifyjs --compress ${comps} --mangle -- build.js > build.min.js
