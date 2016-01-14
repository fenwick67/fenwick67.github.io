
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

// Collada model

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

		//DREW YOU DID THIS
		mixer = new THREE.AnimationMixer(mesh);
		mixer.addAction(new THREE.AnimationAction(mesh.geometry.animations[1]));

		animate();

		//add ground
		var groundGeo = new THREE.PlaneGeometry(500, 500);
		var groundMatl = new THREE.MeshLambertMaterial({
				color : 0x00dd20
			});
		var ground = new THREE.Mesh(groundGeo, groundMatl);
		ground.position.y =  - .1;
		ground.receiveShadow = true;

		ground.rotation.set(-Math.PI / 2, 0, 0);
		scene.add(ground);

		gameStart();

	});

	// Lights

	var spotLight = new THREE.SpotLight(0xffff00);
	spotLight.position.set(100, 500, 0);

	spotLight.castShadow = true;

	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;

	spotLight.shadowCameraNear = 100;
	spotLight.shadowCameraFar = 4000;
	spotLight.shadowCameraFov = 30;

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
var JUMP_STRENGTH = 1.5;
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

		var grounded = duck.position.y <= 0;
    
    if (grounded){
      duck.jumpsUsed = 0;
    }
    
		if (keys.jump && !oldKeys.jump && duck.jumpsUsed < duck.maxJumps) {
			// begin a jump
      duck.jumpsUsed ++;
			duck.jumpVelocity = JUMP_STRENGTH * game.speed;
		}

		//move duck
		if (duck.jumpVelocity || !grounded) {
			duck.position.y += duck.jumpVelocity;
			duck.jumpVelocity = duck.jumpVelocity - (G * game.sqSpeed * delta / 2);//equations of motion, bitch!

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
				scene.remove(obstacle);
        delete obstacles[id];
			}
      //check for collision with obstacle
     
    });

		//handle breads
		_.forEach(breads, function (bread, id) {
			bread.position.z += 1 * game.speed * delta;
			bread.rotation.set(0, bread.rotation.y + .05* game.speed, 0);

			if (bread.position.z > DISSAPPEAR_POINT) {
				scene.remove(bread);
				delete breads[id];
        //check for "collision"
			} else if (playerSphereCollision(bread, DUCK_SIZE * .75)) {
				scene.remove(bread);
        game.score ++;
				delete breads[id];
			}
		});

		//check for game over


		//generate new obstacles
		//todo only do this so often
		var obs = obstacleType();
		if (obs === TerrainTypes.SPIKES) {
			var spikes = spikeModel();
			scene.add(spikes);
			obstacles[spikes.uuid] = spikes;
		}

		//place breads
		var br = breadExists();
		if (br) {
			var bread = breadModel();
			scene.add(bread);
			breads[bread.uuid] = bread;
		}

    //set old key presses
    oldKeys = _.clone(keys);
    
	};

	function spikeModel() {
		var geometry = new THREE.BoxGeometry(SPIKE_SIZE, SPIKE_SIZE, SPIKE_SIZE);
		var material = new THREE.MeshLambertMaterial({
				color : 0x555555
			});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.z = START_POINT;
		mesh.position.y = SPIKE_SIZE / 2;
        mesh.castShadow = true;
    mesh.receiveShadow = true;
		return mesh;
	}

	function breadModel() {
		var geometry = new THREE.BoxGeometry(BREAD_SIZE, BREAD_SIZE, BREAD_THICKNESS);
		var material = new THREE.MeshLambertMaterial({
				color : 0xBD9132
			});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.z = START_POINT;
		mesh.position.y = Math.random() * PLAY_HEIGHT + BREAD_SIZE / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
		return mesh;
	}

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