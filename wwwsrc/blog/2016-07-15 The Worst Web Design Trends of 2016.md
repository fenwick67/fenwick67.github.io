---
title: The Worst Web Design Trends of 2016
date: 2016-07-15
---

In 2015 we had Parallax scrolling.  Okay, parallax scrolling still exists, but I think most people agree it's tacky and overused.  Let's move on.

Speaking as a user, this is my official list of irritating web design trends in 2016.

## #5: Scrollwheel Smoothing

Example: [Smoothwheel Library](http://fatlinesofcode.github.io/jquery.smoothwheel/demo/smoothwheel.html)

Yeah, smooth scrolling was terrible a few years ago, but it still hasn't gone away.  Why??? I want my browser to work the same way no matter which page I go to.  And implementations of smooth scrolling are usually painfully slow, making this even worse.  Stop it!

## #4: Scroll Jumping

Example: [Apple Watch](http://www.apple.com/watch/)

Apple's watch page isn't the worst example, but demonstrates the idea.

This is similar to my problem with smooth scrolling.  When I hit the scroll wheel on my mouse, I expect the page to scroll down slightly.  This is everybody's expectation.  I don't want it to jump down an entire screen.  Even worse, if I discover that your site works like this, I expect it to scroll consistently, in other words, move once per mousewheel stop.  Inevitably *doesn't* work this way, and the page scrolls twice when I wanted it to happen once, or it doesn't scroll at all with one motion of the mousewheel.

## #3: Infinite Scroll Done Wrong

Example: [NodeBB](https://community.nodebb.org/category/3/nodebb-development)

The way Facebook does infinite scroll works.  It loads more content as you scroll, and doesn't remove content above you.  Unfortunately, this isn't how infinite scroll is always implemented.  Sometimes content is removed from the top of the page.  This is infuriating when I want to just go back to the top of the page, either to get to the nav bar or see the early content

## #2: Share Buttons when Highlighting Text

Example: [Mashable](http://mashable.com/2016/07/16/thrawn-rebels/?utm_cid=hp-hh-pri#w0iMnXNkQuqF)

I am somebody who sometimes highlights text when I read a blog, news story et cetera.  It's how I sometimes keep track of my place if I have to look away, or sometimes I just do it out of habit.  What it *doesn't* mean is that I want to share a quote on Twitter, facebook, or anything.  

This trend has even extended to include highlights of "most tweeted" sections of the article.  But this is mostly on garbage trendy news sites anyway, so I don't run into it that often.  I pray it doesn't spread.

## #1: Half of a 1080p Screen is *not* a Mobile Device

Example: [Node.js Docs](https://nodejs.org/dist/latest-v4.x/docs/api/url.html)

The progressive enhancement / graceful degredation / responsive design, whatever you want to call it trend is a good idea.  Scratch that, it's a great idea.  Make your webpage work on multiple different screen sizes.  But that doesn't mean that a narrow viewport is a phone.

Windows, MacOS, and most linux distros have a viewport snapping feature which lets you snap a window to half of your screen.  This is really useful for multitasking.  But I don't want the mobile version of your website when I want to multitask.  

Yes, even the [nodejs docs](https://nodejs.org/dist/latest-v4.x/docs/api/url.html) are victims of this plague.  Visit that link and make your browser about 800 pixels wide.  The font size explodes and it becomes a chore to read.  Move it over the threshold, and it becomed readable again.

The proper way to do scale-up on mobile is via the [viewport meta tag](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag?redirectlocale=en-US&redirectslug=Mobile%2FViewport_meta_tag), not a CSS media query.  

Hamburger buttons *do* work fine with a mouse.  It's a perfectly acceptable way to provide a menu on a narrow viewport on the desktop.  But don't change your whole experience to blow up your icons/fonts and use swipe interactions.