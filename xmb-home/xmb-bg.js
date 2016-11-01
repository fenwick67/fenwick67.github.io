var THREE = window.THREE = require('three');
var mc = require('month-colors');
var Ribbon = require('./ribbon.js');
var Sparks = require('./sparks.js');
var TESTING = (window.location.search.indexOf('test') > -1);

//set up the scene and renderer
var scene= window.scene = new THREE.Scene();
var camera = window.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = window.renderer =  new THREE.WebGLRenderer({alpha:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// do some boilerplate stuff for handling window resize et cetera
require('./boilerplate.js')(renderer,scene,camera);

//create clock
var clock = new THREE.Clock();

//////////////////////////////////////////////////////// add stuff to the scene
var ribbons =  [Ribbon({
  offset:1,
  radius:4,
  opacity:0.5,
  frequency:1.4163
}),Ribbon({
  offset:-1,
  frequency:1.1112
}),Ribbon({
  
})];
ribbons[0].mesh.position.set(0,0,-5);
ribbons[1].mesh.position.set(0,0,5);

var sparks = window.sparks = Sparks({
  size:new THREE.Vector3(250,180,100),
  number:1000
});
sparks.position.set(-125,-90,-80);
scene.add(sparks);

//lights
var light = new THREE.PointLight( 0xffffff, 2, 0 );
light.position.set( 5, 5, 5 );
scene.add( light );

var light2 = new THREE.PointLight( 0xffffff, 1, 0 );
light2.position.set( -10, 5, 0 );
scene.add( light2 );

//initialize objects
ribbons.forEach(function(rib){
  rib.init();
  console.log(rib);
  scene.add(rib.mesh);
});

///////////////////////////////////////////// kick off scene

window.requestAnimationFrame(frame);

function frame(ts){
  update(ts);
  render(ts);
  window.requestAnimationFrame(frame);
}

slowUpdate();
setInterval(slowUpdate,100);


var t0 = 0;
function update(ts){
  var t = ts/1000;
  var dt = Math.min(t-t0,1);
  t0 = t;

  var evt = {time:t,deltaTime:dt};

  ribbons.forEach(function(rib){
    rib.update(evt);
  });
  sparks.updateSparks(evt);
}

var rand;
function slowUpdate(){
  var date;
  if (TESTING){
    var d = rand || Math.random()*100000000;;
    //console.log(d);
    rand = d = Math.round(d + 36000005);
    date = new Date(rand);
  }else{
    date = new Date();
  }

  document.body.setAttribute('style','background: '+ mc.gradientCss(date,'hex')  );
  var c = new THREE.Color(mc.filter(date,'hex'));
  light.color=c;
  light2.color=c;

}

function render(){
  renderer.render(scene, camera);
}
