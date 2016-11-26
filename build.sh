#!/bin/sh

echo "building blog"
cd _blog
npm install
node build.js
cd ..

echo "building xmb home"
cd xmb-home
npm install
sh build.sh
cd ..

echo "done"