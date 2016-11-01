#!/bin/bash
# Build this shiz
# deps: browserify 12.0.1, lessc 2.7.1

browserify index.js > build.js
lessc style.less > style.less.css
