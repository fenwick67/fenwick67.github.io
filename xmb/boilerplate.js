//do some boilerplate stuff for handling window resize et cetera
module.exports = function(renderer,scene,camera){

  var initialFov = camera.fov;
  //set window size
  setInterval(updateCameraStuff,1000);

  function updateCameraStuff(){
    var aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    if (aspect > 2){
      camera.fov = 170 * Math.atan2(window.innerHeight, window.innerWidth);
    }else{
      camera.fov = initialFov;
    }
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  updateCameraStuff();

  camera.position.set(0,0,20);
  camera.lookAt(scene.position);
  renderer.setClearColor("#aaaaaa",0);
}
