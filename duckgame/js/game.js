
if (!Detector.webgl)
	Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer, objects;
var particleLight, sun;
var mesh, duck;
var game;
var controls;
var animationSpeed = 1;

var clock = new THREE.Clock();
var mixers = [];
var MAX_BREADS = 40;
var MAX_SPIKES = 20;
var HIDDEN_POS = {x:0,y:-150,z:0};
var useShadows = true;
var materialType = THREE.MeshLambertMaterial;//polyfill the THREE.MeshBasicMaterial or THREE.MeshLabmertMaterial

//some mobile detection
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

  
  //HACK
if (isMobile){
  useShadows = false;
  materialType = THREE.MeshBasicMaterial;
}

init();

function init() {
  //set up the scene and renderer
  
	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.set(100, 30, 0);

	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2( 0x000000, 0.035 );

	// Add Blender exported Collada model


	var loader = new THREE.JSONLoader();

	loader.load('models/animated/monster/duck-rigged.json', function (geometry, materials) {

		var material = materials[0];
		material.skinning = true;

		var faceMaterial = new THREE.MeshFaceMaterial(materials);

		mesh = new THREE.SkinnedMesh(geometry, faceMaterial);
		mesh.castShadow = true;

		//var s = 1;
		//mesh.scale.set( s, s, s );

		mesh.position.set(0, 0, 0);
		//mesh.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );

		//mesh.matrixAutoUpdate = false;
		//mesh.updateMatrix();

		scene.add(mesh);

		mixer = new THREE.AnimationMixer(mesh);
		mixer.addAction(new THREE.AnimationAction(mesh.geometry.animations[1]));

		animate();

		//add ground
		var groundGeo = new THREE.PlaneGeometry(500, 500);
		var groundMatl = new materialType({
				color : 0x00dd20
			});
		var ground = new THREE.Mesh(groundGeo, groundMatl);
		ground.position.y =  - .1;
		ground.receiveShadow = true;

		ground.rotation.set(-Math.PI / 2, 0, 0);
		scene.add(ground);

    
    //create object pools
    
    initSpikePool();
    initBreadPool();
    
		gameStart();

	});

	// Lights

	var spotLight = new THREE.SpotLight(0xffff00);
	spotLight.position.set(100, 500, 0);
  if (useShadows){
    spotLight.castShadow = true;

    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 100;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 30;
  }
	

	scene.add(spotLight);

	var spotLightHelper = new THREE.SpotLightHelper(spotLight);
	//scene.add(spotLightHelper);

	scene.add(new THREE.AmbientLight(0xcceeee));

	// Renderer

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);

	//shadows
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// Stats

	//stats = new Stats();
	//container.appendChild(stats.domElement);

	// Events

	window.addEventListener('resize', onWindowResize, false);

	//Controls


}

//

function onWindowResize(event) {

	renderer.setSize(window.innerWidth, window.innerHeight);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

}

function animate() {

	requestAnimationFrame(animate);

	//mesh.skeleton.bones[3].rotation.y+=.1;

	var delta = clock.getDelta();

	mixer.update(delta * animationSpeed);

  if (controls){
    controls.update;
  }

	render();
	//stats.update();

}

function render() {
	renderer.render(scene, camera);
}

//constants
var PLAY_HEIGHT = 30;
var SPIKE_SIZE = 15;
var JUMP_STRENGTH = 1.3;
var BREAD_SIZE = 4;
var BREAD_THICKNESS = 1;
var G = .1;
var DISSAPPEAR_POINT = 70;
var START_POINT = -150;
var DUCK_SIZE = 10;

function gameStart() {
  setCameraPlay();
	//game contains game info (score, level, speed, etc)
	game = {
		score : 0,
    time:0
	};

	game.setSpeed = function (s) {
		game.sqSpeed = s * s;
		game.speed = s;
		game.animSpeed = s* 2;
    animationSpeed = game.animSpeed;
	}
  game.setSpeed(1);
  
  //obstacles are rendered
	var obstacles = {};
	//bread
	var breads = {};
  
	// duck contains player info
	duck = mesh;
	duck.jumpVelocity = 0;
  duck.jumpsUsed = 0;
  duck.maxJumps = 2;

	// keys contains key info
	var keys = {
		jump : false
	};
	// oldKeys is key info from last tick
	var oldKeys = _.clone(keys);

	//add key / touch listeners
	window.addEventListener('keydown', function (e) {
		if (e.which === 32) { //jump
			keys.jump = true;
		}
	});
  
  window.addEventListener('touchstart',function(e){
    keys.jump = true;
  });
  
  window.addEventListener('touchend',function(e){
    keys.jump = false;
  });

	window.addEventListener('keyup', function (e) {
		if (e.which === 32) {
			keys.jump = false;
		}
	});

	var TerrainTypes = {
		BLANK : 0,
		SPIKES : 1,
		CHAIR : 2
	}

	var prevTerrain = TerrainTypes.BLANK;
	//get obstacle or nothing
	function obstacleType() {
		if (prevTerrain != TerrainTypes.BLANK) {
			return prevTerrain = TerrainTypes.BLANK;
		}
		var r = Math.random();
		if (r < .99) {
			return prevTerrain = TerrainTypes.BLANK;
		}
		return prevTerrain = TerrainTypes.SPIKES;
	}

	function breadExists() {
		var r = Math.random();
		return (r > .95);
	}

	//game ticker
	var ticker = new GameTicker();
	ticker.onTick = function (delta) {
    game.time += delta;
    
    if (game.time > 500){
      game.setSpeed(game.speed + .0005 * delta);
    }
		//jump behavior

    var jumpedThisFrame = false;
		var grounded = duck.position.y <= 0;
    
    if (grounded){
      duck.jumpsUsed = 0;
    }
    // begin a jump
    if (keys.jump && !oldKeys.jump && duck.jumpsUsed < duck.maxJumps) {
      duck.jumpsUsed ++;
			duck.jumpVelocity = JUMP_STRENGTH * game.speed;
      jumpedThisFrame = true;
		}

		//move duck
    
    //todo: need to better integrate delta into deceleration
    //right now slower framerates makes you jump a bit higher
		if (duck.jumpVelocity || !grounded) {
			duck.position.y += duck.jumpVelocity * delta;
      if (!jumpedThisFrame){//slow the duck down
        duck.jumpVelocity = duck.jumpVelocity - (G * game.sqSpeed * delta  / 2);
      }
			//handle ground collisions and ground duck
			if (duck.position.y < 0) {
				duck.position.y = 0;
				duck.jumpVelocity = 0;
			}
		}
    



		//move obstacles
		_.each(obstacles,function(obstacle,id){
      obstacle.position.z += 1 * game.speed * delta;
      
      var collides = playerCubeCollision(obstacle,SPIKE_SIZE,SPIKE_SIZE);
      if (collides){
        alert('GAME OVER. score: '+game.score * 100);
        console.log('GAME OVER. score: '+game.score * 100);
        window.location = window.location;
      }
      
			if (obstacle.position.z > DISSAPPEAR_POINT) {
				hideOffscreen(obstacle);
        delete obstacles[id];
			}
      //check for collision with obstacle
     
    });

		//handle breads
		_.forEach(breads, function (bread, id) {
			bread.position.z += 1 * game.speed * delta;
			bread.rotation.set(0, bread.rotation.y + .05* game.speed, 0);

			if (bread.position.z > DISSAPPEAR_POINT) {
				hideOffscreen(bread);
				delete breads[id];
        //check for "collision"
			} else if (playerSphereCollision(bread, DUCK_SIZE * .75)) {
				hideOffscreen(bread);
        game.score ++;
				delete breads[id];
			}
		});

		//check for game over


		//place new obstacles
		//todo only do this so often
		var obs = obstacleType();
		if (obs === TerrainTypes.SPIKES) {
			var spike = placeSpike();
			obstacles[spike.uuid] = spike;
		}

		//place breads
		var br = breadExists();
		if (br) {
			var bread = placeBread();
			breads[bread.uuid] = bread;
		}

    //set old key presses
    oldKeys = _.clone(keys);
    
	};

	

}


function playerSphereCollision(obj, dist) {
	var duckCenter = duck.position.clone().add({
			x : 0,
			y : DUCK_SIZE / 2,
			z : 0
		});
	var d = duckCenter.distanceTo(obj.position);
	return (d < dist);
}

function playerCubeCollision(obj,width,height){
  //remember... Z axis is how stuff swooses in, y is up, x is worthless
  
    if (duck.position.z < obj.position.z - (width / 2)){
      return false;
      //duck is "left" of object
    }
    if (duck.position.z > obj.position.z + (width / 2)){
      return false;
      //duck is "right" of object
    }
    if (duck.position.y > obj.position.y + (height * 3/8) ){//lenient on the top
      //duck is above object
      return false;
    }
    if ( (duck.position.y + DUCK_SIZE ) < obj.position.y - (height / 2) ){
      //duck is below object
      return false;
    }
    
    // duck is not outside object... so it must be inside!
    return true;
}

function setCameraZoomed(){
  camera.position.set(  5.275489271607287,14.650010427656056,-13.235869197100351);
  camera.lookAt(duck.position);
}

function setCameraPlay(){
  camera.position.set(95, 20, -35);
  camera.lookAt( new THREE.Vector3(0,20,-35) );
}

function enableCameraControls(){
      
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;    

}
//spike object pool
var spikePool = [];
var spikeIndex = 0;
function initSpikePool(){
  for (var i = 0; i <= MAX_SPIKES; i ++){
    spikePool.push(spikeModel());
  }
}
function getSpikeFromPool(){//this is assuming that you spikes will fly off to the left before being reused
  var spike = spikePool[spikeIndex];
  spikeIndex ++;
  if (spikeIndex > MAX_SPIKES){
    spikeIndex = 0;
  }
  return spike;
}

function spikeModel() {
  var geometry = new THREE.BoxGeometry(SPIKE_SIZE, SPIKE_SIZE, SPIKE_SIZE);
  var material = new materialType({
      color : 0x555555
    });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  hideOffscreen(mesh);
  scene.add(mesh);
  return mesh;
}
function placeSpike(){
  var mesh = getSpikeFromPool();
  mesh.position.z = START_POINT;
  mesh.position.y = SPIKE_SIZE / 2;
  mesh.inPlay = true;
  return mesh;
}

//bread object pool
var breadPool = [];
var breadIndex = 0;
function initBreadPool(){
  for (var i = 0; i <= MAX_BREADS; i ++){
    breadPool.push(breadModel());
  }
}
function getBreadFromPool(){//this is assuming that you breads will fly off to the left before being reused
  var bread = breadPool[breadIndex];
  breadIndex ++;
  if (breadIndex > MAX_BREADS){
    breadIndex = 0;
  }
  return bread;
}

function breadModel() {
  var geometry = new THREE.BoxGeometry(BREAD_SIZE, BREAD_SIZE, BREAD_THICKNESS);
  var material = new materialType({
      color : 0xBD9132
    });
  var mesh = new THREE.Mesh(geometry, material);
  hideOffscreen(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}
function placeBread(){
  var mesh = getBreadFromPool();
  mesh.position.z = START_POINT;
  mesh.position.y = Math.random() * PLAY_HEIGHT;
  mesh.inPlay = true;
  return mesh;
}

function hideOffscreen(obj){
  obj.position.set(HIDDEN_POS.x,HIDDEN_POS.y,HIDDEN_POS.z);
  obj.inPlay = false;
}
