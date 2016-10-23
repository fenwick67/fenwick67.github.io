//ribbons
var _ = require('lodash');
var THREE = require('three');

var CIRCLE=32;

module.exports = function(opts){

  var defaults = {
    length:80,
    radius:2,
    amplitude:1,
    frequency:1,
    wavelength:2,
    offset:0,
    opacity:0.7
  };

  var o = _.extend({},defaults,opts);

  var geometry = new THREE.CylinderGeometry( o.radius, o.radius, o.length, CIRCLE, 100 );
  var material = new THREE.MeshStandardMaterial( {color: 0xcccccc,emissive:0xcccccc,transparent:true,opacity:o.opacity} );
  var mesh = new THREE.Mesh( geometry, material );
  var orig;//original position
  mesh.quaternion.setFromEuler(new THREE.Euler(Math.PI/2,0,Math.PI/2,"XYZ"));
  console.log(mesh.quaternion);

  var init = function(){
    var r = geometry.vertices;
    orig = new Array(r.length)

    var offsets = [];
    for (var i = 0; i < r.length; i ++){
      offsets.push(new THREE.Vector3(Math.random(),Math.random(),Math.random() ));
    }

    var circleOffsets = [];
    for (var i = 0; i < CIRCLE; i ++){
      circleOffsets.push(new THREE.Vector3(Math.random(),Math.random(),Math.random() ));
    }


    for (var i = 0; i < r.length;i++){
      var offset = offsets[i];
      var circleOffset = circleOffsets[i%CIRCLE];
      r[i] = r[i].addScaledVector(offset,0.01).addScaledVector(circleOffset,0.5);

      orig[i] = r[i];
    }

  }

  var update = function(event){
    var v = geometry.vertices;
    for (var i = 0; i < v.length; i ++){

      v[i].z = orig[i].z + (Math.sin(o.offset + orig[i].y/(o.length/o.wavelength)+event.time*o.frequency/(Math.PI) ))*o.amplitude/80;

    }
    //console.log(v);
    geometry.verticesNeedUpdate = true;
  }

  return {init,mesh,update};

}
