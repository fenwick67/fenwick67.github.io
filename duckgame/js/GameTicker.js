// game loop handler

// is this the best way to do this?  
function GameTicker(){
  var me = this;
  var frameLength = 1/60 * 1000;
  
  me.onTick = function(){};

  // Let's play this game!
  var then = Date.now();
  
	function run(now) {
    //now is when the frame is being fired
    var delta = now - then;
    
    if (delta < 0){//first tick will be crazy
      delta = frameLength;
    }
    
    me.onTick(delta / frameLength);
    then = now;
    window.requestAnimationFrame(run)
  }
  
  window.requestAnimationFrame(run);
  
}