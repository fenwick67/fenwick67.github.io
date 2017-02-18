#!/bin/sh

echo "building blog"
cd wwwbuild
npm install
node build.js
cd ..

echo "done"
