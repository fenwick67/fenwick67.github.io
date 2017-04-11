#!/bin/sh

# publish to github pages from the src branch
branch=`git rev-parse --abbrev-ref HEAD`

if [ ${branch} == 'src' ]
then
  echo "pushing..."
  git subtree push --prefix public origin master
else
  echo "you're on the wrong branch, dummy: "
  echo "you're on: '${branch}', expected 'src'"
fi
