Remember jQuery plugins?  I do.  They used to be the cool way to implement everything in javascript.  The even pop up in StackOverflow answers for things like "how do I sort an array".

> I wrote a jQuery plugin for this!  Just import jquery and my library, then call `var sortedArray =  jquery.coolSort(yourArray,true,false,false)` - an unhelpful user

But now, jQuery plugins are out of style.  People realized a few things.

1. DOM manipulation isn'te really that hard
2. Not everybody uses jQuery
4. I want people to use my library, so I should make it stand on its own feet

Recently, the jQuery plugin registry moved to NPM, like some other registries have (cordova etc.).  If you look, there are [about 2000](https://www.npmjs.com/search?q=jquery+plugin) jQuery plugins in NPM to date.  That's a lot, right?  

## Not Really
[There are about 6 thousand hits in NPM for "react component"](https://www.npmjs.com/search?q=react+component).  6 freakin' thousand!  There must be some really great stuff in there! 

Let's look at page one...

![a bunch of components](http://i.imgur.com/fTEHE5v.png)

Out of the first six (excluding the non-english one), two were scaffolders, one was boilerplate, one was empty.  Not a great start.

The other two?  

*rand-char-react-component* is what it sounds like.  It's a react component that gets set to a "random" character (when I say "random", I mean "[a random choice in the author's chosen list](https://github.com/cartogram/rand-char-loader/blob/master/lib/rand-char-react-component.jsx#L9)").  It even has [a fake test](https://github.com/cartogram/rand-char-loader/blob/master/spec/rand-char-react-component.spec.jsx#L18). 

*react-component-list* is also just what it sounds like.  It's a list.  I can't tell you if this would be useful beacuse I'm not a react developer.  Which brings me around to a point...

## History is Repeating Itself

Remember my list up above about jQuery plugins?  The same thing goes for the six thousand react components (not to mention the eight thousand angular components).  If you actually have a neato little component to publish and show the world, try to decouple it from your favorite framework, be it CSS, Javascript, what have you.

## NPM is Not Just for You

I have to tell myself this sometimes too, but don't commit stuff to NPM that isn't useful to anybody but yourself.  Npm is meant to be different from github.  You can install packages from github URLs and it isn't hard.  Even moreso, stop dumping empty repositories on there.