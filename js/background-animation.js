//background animation

var loaded = false;
var img = new Image();
var ctx;
var scale = 30;
var canv;
var clouds = [];
var cloudSpeed = -.00001;
var spinSpeed = .00001;
var nClouds = 20;
var offset = 300;
var borderColors = ['#39544a','#fff','#AEE8D3'];
var fillColors = ['#39544a','rgba(0,0,0,0)','#fff','#AEE8D3'];

var fillColor = function(){  
  return fillColors[Math.floor(Math.random()*fillColors.length)]
}
var borderColor = function(){  
  return borderColors[Math.floor(Math.random()*borderColors.length)]
}

$(function(){
  ctx = document.querySelector('canvas').getContext('2d');
  resize();
});

function resize(){
  canv = $('canvas')[0];
  var reinit = false;
  
  // grew
  if (canv.width < window.innerWidth || canv.height < window.innerHeight){
    reinit = true;
  }
  
  canv.width = window.innerWidth;
  canv.height = window.innerHeight;
  if(ctx){
    ctx.lineWidth = 5;    
    if (reinit){
      delayedInitClouds();
    }
  }
  
}
resize();
$(window).resize(resize);

initClouds();
var cloudTimeout = null;
function delayedInitClouds(){
  if (!cloudTimeout){
    cloudTimeout = window.setTimeout(function(){
      initClouds();
      cloudTimeout=null;
    },1000);
  }
}
function initClouds(){
  clouds = [];
  for (var i = 0; i < nClouds;i++){
    clouds.push({
      x:Math.random()*(window.innerWidth+offset) - offset,
      y:Math.random()*(window.innerHeight+offset) - offset,
      spin:(Math.random()-.5),
      rotation:Math.random()*Math.PI*2,
      z:(1+i/(nClouds))*3,
      size:1.2-i/(nClouds),
      flipped:(Math.random()>.5),
      fill:fillColor(),
      stroke:borderColor()
    });  
  }
}

var t0;
requestAnimationFrame(draw);
function draw(ts){
  requestAnimationFrame(draw);
  if(!t0){ 
    t0 = ts;
    return;
  }
  var dt = Math.min(t0-ts,1);
  t0=ts;
  
  if(!ctx) {
    return;
  }  
    
  ctx.clearRect(0,0,canv.width,canv.height);  
  
  clouds.forEach(function(cloud){
    
    //update cloud position
    if (cloud.y > window.innerHeight + offset){
      cloud.y = cloud.y - offset*2 - window.innerHeight + dt*cloudSpeed*cloud.z;
      cloud.x = Math.random()*(window.innerWidth+offset) - offset;
    }else if(cloud.x > window.innerWidth + offset){
      cloud.x = window.innerWidth;
    }else{
      cloud.y = cloud.y + dt*cloudSpeed*cloud.z;
    }
    cloud.rotation = cloud.rotation + cloud.spin*dt*spinSpeed;
    
    //draw cloud
    ctx.translate(cloud.x,cloud.y);    
    ctx.rotate(cloud.rotation);
    ctx.fillStyle = cloud.fill;
    ctx.strokeStyle = cloud.stroke;
    
    ctx.beginPath();
        
    var s = cloud.size*scale;    
    
    ctx.moveTo(-s,-s);
    ctx.lineTo(-s,s);
    ctx.lineTo(s,s);
    ctx.lineTo(s,-s);
    
    ctx.closePath();
    
    
    ctx.lineWidth = s/2;
    ctx.fill();
    ctx.stroke();
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
  });
    
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
