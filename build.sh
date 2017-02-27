#!/bin/sh

echo "building blog"
# build
cd wwwbuild
npm install
node build.js
cd ..

# copy to public dir
mkdir public
cp -r ms-build/* public/
cp -r static/* public/
echo "done"
