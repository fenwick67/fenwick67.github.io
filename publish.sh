#!/bin/sh

# publish to github pages from the src branch
branch=`git rev-parse --abbrev-ref HEAD`

if [ branch == 'src' ]
then
  git subtree push --prefix public origin master
else
  echo "you\'re on the wrong branch, dummy"
fi
