var THREE = require('three');
var _ = require('lodash');

module.exports = function(opts){

  var defs = {
    size: new THREE.Vector3(100,100,100),
    number:100,
    speed:1
  }
  var o = _.extend(defs,opts);

  var map = THREE.ImageUtils.loadTexture("circle.png");

  var object3d = new THREE.Object3D();

  var sprites = [];

  for (var i = 0; i < o.number;i++){


    //var color = Math.round(Math.random()*0xffffff);
    var material = new THREE.SpriteMaterial({color:0xffffff,map:map,transparent:true});
    //material.color = new THREE.Color(color);
    var spr = new THREE.Sprite(material);
    spr.scale=500;

    spr.position.set(o.size.x*Math.random(),o.size.y*Math.random(),o.size.z*Math.random())
    spr.moveDirection = new THREE.Vector3(0.5-Math.random(),0.5-Math.random(),0.5-Math.random()).normalize();
    object3d.add(spr);
    sprites.push(spr);
  }


  function updateSparks(event){
    sprites.forEach(function(spr,idx){
      spr.position = spr.position.addScaledVector(spr.moveDirection,o.speed*event.deltaTime);
      loopPosition(spr.position,new THREE.Vector3(0,0,0),o.size);
      //console.log(spr.position.z);
      var opacity = 0.7;//baseline
      opacity = opacity * (spr.position.z/o.size.z);//fade with z distance
      opacity = opacity*(1-Math.sin(spr.position.x*3)/2);//flash with dx
      spr.material.opacity = opacity;
    });
  }

  return _.extend(object3d,{updateSparks});

}

function loopPosition(toUpdate,min,max){

  ['x','y','z'].forEach(function(w){
    //console.log(w);
    if (toUpdate[w] < min[w]){
      toUpdate[w]=toUpdate[w]+(max[w]-min[w]);
    }else if (toUpdate[w] >= max[w]){
      toUpdate[w]=toUpdate[w]+(min[w]-max[w]);
    }
  });

  return toUpdate;
}
