//app stuff
var modelRoot = '/stl/';
if (!window.location.port){//hacky way around the git LFS stuff
  modelRoot = '//media.githubusercontent.com/media/fenwick67/fenwick67.github.io/master/stl/';
}


$.get('/stl/models.json')
.success(function(json){
  var $left = $('#left');
  json.stls.forEach(function(stl){
    var thing = $('<div class="model">'+stl.name+'</div>');
    thing.on('click',function(e){
      var ref = modelRoot + stl.file;
      window.loadStl(ref,null,onProgress,clearProgress);
      //register listener for download button
      $('#download').attr('href',ref);
    });
    $left.append(thing);
  });
  //rawgit
  //https://cdn.rawgit.com/fenwick67/fenwick67.github.io/master/stl/duckholder.stl
  
  //load first STL
  var ref = modelRoot + json.stls[0].file;
  window.loadStl(ref,null,onProgress,clearProgress);
  $('#download').attr('href',ref);
  
})
.error(function(){console.log('uhoh',arguments)});

$('#shrink').on('click',function(){
  $('#left').toggleClass('collapsed');
  setTimeout(onWindowResize,501);
});

var $bar = $('#progress');
function onProgress(xhr){
  $bar.parent().removeClass('hidden');
  var pct = (xhr.loaded||0) / (xhr.total||1);
  $bar.css('width', (pct*100) + '%');
}
function clearProgress(){
  $bar.parent().addClass('hidden');
}


var spinning = true;
$('#spin').on('click',function(){
  spinning = !spinning;
  tLast = 0;
  if (spinning){
    $(this).addClass('active');
  }else{
    $(this).removeClass('active');
  }
});

var timer = 0;
var tLast = 0;

//threejs stuff:
			var container, stats, controls;
			var camera, cameraTarget, scene, renderer;
			init();
			animate();
			function init() {
				container = document.getElementById( 'viewer' );
				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 15 );
				camera.position.set( 2.3, -0.2, 0 );
				cameraTarget = new THREE.Vector3( 0, -.5, 0 );
        camera.lookAt(cameraTarget);
        
				scene = new THREE.Scene();
				scene.fog = new THREE.Fog( 0x888888, 2, 15 );
				// Ground
				var plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 40, 40 ),
					new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
				);
				plane.rotation.x = -Math.PI/2;
				plane.position.y = -0.5;
				scene.add( plane );
				plane.receiveShadow = true;
				// ASCII file
				var loader = new THREE.STLLoader();
        
        window.theMesh = null;
        window.loadStl = function(path,color,onProgress,onFinish){
          // color: 0xff5533
          
          loader.load( path, function ( geometry ) {
            
            geometry.center();
            geometry.computeBoundingSphere();  
            geometry.computeBoundingBox(); 
            
            
            //get the biggest dimension of the model (x,y,or z) and use that to scale it to the scene
            var biggestDim = Math.max(
              geometry.boundingBox.max.z - geometry.boundingBox.min.z,
              geometry.boundingBox.max.y - geometry.boundingBox.min.y,
              geometry.boundingBox.max.x - geometry.boundingBox.min.x
            );
            
            var sc = 1/biggestDim; 
            if (sc < 0 || isNaN(sc)){
              console.error('couldnt get scale of STL');
              sc = 1;
            }            
            
            if (window.theMesh != null){
              scene.remove(theMesh);
              window.theMesh = null;
            }
            var material = new THREE.MeshPhongMaterial( { color: color || 0xff5533, specular: 0x111111, shininess: 200 } );
            var mesh = new THREE.Mesh( geometry, material );
            
                      
            mesh.scale.set( sc,sc,sc );
            // get position to set bottom on the ground
            var bottom = geometry.boundingBox.min.z;
            
            mesh.position.set(0,-sc*bottom - .5,0);
            
             
            mesh.rotation.set( - Math.PI / 2, 0 , 0 );
            mesh.castShadow = true;
            mesh.receiveShadow = false;
            scene.add( mesh );
            //TODO: get size of mesh
            
            window.theMesh = mesh;
            //set rotation
            theMesh.rotation.set(-Math.PI/2 , 0, timer);
            onFinish(geometry);
          },onProgress||function(){} );
        }
        
        /*
				
				// Binary files
				var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
				loader.load( './models/stl/binary/pr2_head_pan.stl', function ( geometry ) {
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.set( 0, - 0.37, - 0.6 );
					mesh.rotation.set( - Math.PI / 2, 0, 0 );
					mesh.scale.set( 2, 2, 2 );
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					scene.add( mesh );
				} );
				loader.load( './models/stl/binary/pr2_head_tilt.stl', function ( geometry ) {
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.set( 0.136, - 0.37, - 0.6 );
					mesh.rotation.set( - Math.PI / 2, 0.3, 0 );
					mesh.scale.set( 2, 2, 2 );
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					scene.add( mesh );
				} );
				// Colored binary STL
				loader.load( './models/stl/binary/colored.stl', function ( geometry ) {
					var meshMaterial = material;
					if (geometry.hasColors) {
						meshMaterial = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
					}
					var mesh = new THREE.Mesh( geometry, meshMaterial );
					mesh.position.set( 0.5, 0.2, 0 );
					mesh.rotation.set( - Math.PI / 2, Math.PI / 2, 0 );
					mesh.scale.set( 0.3, 0.3, 0.3 );
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					scene.add( mesh );
				} );
        
        */
        
				// Lights
				scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
				addShadowedLight( 1.5, 1, 0, 0xffffff, 1.35 );
				//addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );
				// renderer
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setClearColor( scene.fog.color );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( $(container).width(), $(container).height() );
				renderer.gammaInput = true;
				renderer.gammaOutput = true;
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.renderReverseSided = false;
				container.appendChild( renderer.domElement );
				// stats (removed)
				//
				window.addEventListener( 'resize', onWindowResize, false );
        onWindowResize();
        //controls        
        
        controls = new THREE.OrbitControls( camera, renderer.domElement );
				//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
				controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = true;        
				controls.zoomSpeed = 0.6;
        controls.panSpeed = controls.rotateSpeed = 0.3;    
        
			}
			function addShadowedLight( x, y, z, color, intensity ) {
				var directionalLight = new THREE.DirectionalLight( color, intensity );
				directionalLight.position.set( x, y, z );
				scene.add( directionalLight );
				directionalLight.castShadow = true;
				var d = 1;
				directionalLight.shadow.camera.left = -d;
				directionalLight.shadow.camera.right = d;
				directionalLight.shadow.camera.top = d;
				directionalLight.shadow.camera.bottom = -d;
				directionalLight.shadow.camera.near = 1;
				directionalLight.shadow.camera.far = 4;
				directionalLight.shadow.mapSize.width = 1024;
				directionalLight.shadow.mapSize.height = 1024;
				directionalLight.shadow.bias = -0.005;
			}
			function onWindowResize() {
				camera.aspect = container.offsetWidth / container.offsetHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( $(container).width(), $(container).height());
			}
			function animate() {
				requestAnimationFrame( animate );
				render();
				//stats.update();
			}
			function render() {
        
				
				//camera.position.x = 0;
        if (spinning && theMesh){//this is a bit hacky but works
          if (tLast){
            var dt = Date.now() - tLast;
            timer = timer + dt * 0.0005;   
            theMesh.rotation.set(-Math.PI/2 , 0, timer);  
          }
          tLast = Date.now();
        }
				//camera.lookAt( cameraTarget );
				renderer.render( scene, camera );
			}
      
      
      
