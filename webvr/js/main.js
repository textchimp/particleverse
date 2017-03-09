

var app = app || {};

app.step = 0;

app.useSphere = false;

app.axes_old = {x: 0, y: 0};
app.axes_delta = {x: 0, y: 0};

app.numCubes = 10; //1000; //1000;
app.cubeDistribution = 300;

app.numParticles = 1000;
app.particleDistribution = 80;

app.lastMouseTime = Date.now();

app.cameraPositionIndex = 0;

app.controller = {
  rotationSpeed: 0.02,
  bouncingSpeed: 0.02
};


app.randRange = function( min, max ){

  var range = max - min;
  return min + Math.random() * range;

};

app.init = function () {
  console.log('hello (my) w0rld');

	if ( WEBVR.isAvailable() === false ) {
			// document.body.appendChild( WEBVR.getMessage() );
	}



  var BallWave = function() {
    this.waveHeight = 0.06;
    this.castShadow = true;
    this.explode = function() { console.log(1); };
    // Define render logic ...
  };
  var ballwave = new BallWave();



  app.scene = new THREE.Scene();

  app.width = window.innerWidth;
  app.height = window.innerHeight;

  var randomPoints = [];

  for (var i = 0; i < 10; i++) {
    randomPoints.push(new THREE.Vector3(
      Math.random() * 100 - 50,
      Math.random() * 100 - 50,
      Math.random() * 100 - 50
    ));
  }

  app.spline = new THREE.CatmullRomCurve3( randomPoints );

  app.splines = [];
  for (var i = 0; i < 10; i++) {
      randomPoints = [];
      for (var j = 0; j < 3; j++) {
        randomPoints.push(new THREE.Vector3(
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 500
        ));
      }
      randomPoints.push(randomPoints[0]);

      app.splines.push( new THREE.CatmullRomCurve3( randomPoints ) );

    }


  // Define what the browser is looking at; 4 parameters
  // field of view
  // screen ratio
  // how close to render things
  // how far to render things
  app.camera = new THREE.PerspectiveCamera(70, app.width/app.height, 0.1, 1000); //5000 );

  // app.camera.position.x = -300;
  // app.camera.position.y = 30;
  // app.camera.position.z = 20;

   app.cbody = new THREE.Object3D();
   app.cbody.position.set(0, 0, 0);


  app.camera.position.x = 1;
  app.camera.position.y = 1;
  app.camera.position.z = 1;

  // Where is the camera looking?
  app.camera.lookAt( app.scene.position );

  app.renderer = new THREE.WebGLRenderer( { antialias: true } );

  // if you don't have WebGL
  // app.renderer = new THREE.SoftwareRenderer();

  app.renderer.setPixelRatio( window.devicePixelRatio );
  app.renderer.sortObjects = false;
  app.renderer.setSize( app.width, app.height );
  app.renderer.setClearColor( 0x000000 ); //background
  // app.renderer.shadowMap.enabled = true; // disabled by default
  // app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //
  // app.axes = new THREE.AxisHelper( 40 );
  // app.scene.add( app.axes );
  //
  //
  // var planeGeometry = new THREE.PlaneGeometry( 120, 20 ); // width, length
  // var planeMaterial = new THREE.MeshLambertMaterial({
  //   color: 0xCFD8DC  // a kind of boring gray
  // });
  //
  // app.plane = new THREE.Mesh( planeGeometry, planeMaterial );
  //
  // app.plane.rotation.x = -0.5 * Math.PI;  // don't ask, just obey
  //
  // app.plane.position.x = 15;
  // app.plane.position.y = 0;
  // app.plane.position.z = 0;
  //
  // // if you have WebGL
  // // app.plane.receiveShadow = true;
  //
  // app.scene.add( app.plane );
  //
  //

//
//
//]
// app.lines = [];



app.cbody.add( app.camera );
app.scene.add( app.cbody );

// app.scene.add( app.camera );




// app.crosshair = new THREE.Mesh(
// 			new THREE.RingGeometry( 0.02, 0.03, 32 ),
// 			new THREE.MeshBasicMaterial( {
// 				color: 0xffffff,
// 				opacity: 0.5,
// 				transparent: true
// 			} )
// 		);
// app.crosshair.position.z = - 2;
// app.camera.add( app.crosshair );


// From https://workshop.chromeexperiments.com/examples/guiVR/#2--User-Input
var gui = dat.GUIVR.create( 'Ball Wave' );
gui.add(ballwave, 'waveHeight')
gui.add(ballwave, 'castShadow')
gui.add(ballwave, 'explode')

app.scene.add( gui ); // Add GUI to the scene
//


  // var input = dat.GUIVR.addInputObject( new THREE.ViveController(0) );
  // app.scene.add( input ); // this will add helpers to your scene (laser & cursor)
  //





if(false){
          console.log('splines', app.splines.length);
          for (var i = 0; i < app.splines.length; i++) {
            var spline = app.splines[i];
            console.log('iii', i);
            var smaterial = new THREE.LineBasicMaterial({
              color: new THREE.Color(Math.random(), Math.random(), Math.random()) //0xff00f0,
            });

            var sgeometry = new THREE.Geometry();
            var splinePoints = spline.getPoints(100);

            for(var j = 0; j < splinePoints.length; j++){
                sgeometry.vertices.push(splinePoints[j]);
            }

            var line = new THREE.Line(sgeometry, smaterial);
            // app.lines.push( line );
            app.scene.add( line );

          }
}
//
//


  var cubeGeometry = new THREE.BoxGeometry( 4, 4, 4 ); // width, height, breadth/depth
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF8F00,
    wireframe: false
  });

  app.cube = new THREE.Mesh( cubeGeometry, cubeMaterial);

  app.cube.position.set( -10, 0, 0 ); //set x,y,z position in one line
  // app.cube.castShadow = true; // only for WebGL aristocracy

  app.scene.add( app.cube );

  if(app.useSphere){

    var sphereGeometry = new THREE.SphereGeometry( 30, 30, 30 );

    var sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      wireframe: false,
      map: THREE.ImageUtils.loadTexture("img/earth.jpg"),
      // side: THREE.BackSide
    });

    app.sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

    app.sphere.position.set( 0, 0, 0 );
    // app.sphere.castShadow = true; //webGL only

    app.scene.add( app.sphere );

    var cloudGeometry = new THREE.SphereGeometry( 8.1, 32, 32);
    var cloudMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: false,
      map: THREE.ImageUtils.loadTexture("img/cloudmap.jpg"),
      opacity: 0.3,
      transparent: true,
      depthWrite: false
    });

    app.clouds = new THREE.Mesh( cloudGeometry, cloudMaterial );
    app.clouds.position.set(0, 0, 0);
    app.scene.add( app.clouds );

  } // if(app.useSphere)


  app.particleSystem = app.createParticleSystem();
  app.scene.add( app.particleSystem );

  app.light = new THREE.AmbientLight(); //soft white light from everywhere
  app.light.color.set( 0x999999 );
  app.scene.add( app.light );


  app.spotlight = new THREE.SpotLight( 0xFFFFFF );
  app.spotlight.position.set( -10, 60, 10 );
  // app.spotlight.castShadow = true;
  // app.spotlight.shadow.mapSize.width = 2048;
  // app.spotlight.shadow.mapSize.height = 2048;

  app.scene.add( app.spotlight );


  app.cubeFleet = app.createCubes( app.numCubes, app.cubeDistribution );

  app.cubeFleet.forEach(function( cube ){
    app.scene.add( cube );
  });




  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );

  //
  // app.gui = new dat.GUI();
  // app.gui.add( app.controller, 'rotationSpeed', 0, 0.2 );
  // app.gui.add( app.controller, 'bouncingSpeed', 0, 1.0 );

  app.renderer.domElement.addEventListener('mousemove', function () {
    app.lastMouseTime = Date.now();
  });



  // Put the three.js canvas element into our page DOM
  document.getElementById("output").appendChild( app.renderer.domElement );

  // actually render something
  // app.renderer.render( app.scene, app.camera  );

  // console.log('vr controls loading...');

	app.controls = new THREE.VRControls( app.camera );
	app.effect = new THREE.VREffect( app.renderer );

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays()
			.then( function ( displays ) {
				app.effect.setVRDisplay( displays[ 0 ] );
				app.controls.setVRDisplay( displays[ 0 ] );
			} )
			.catch( function () {
				// no displays
			} );

  	document.body.appendChild( WEBVR.getButton( app.effect ) );
  }


  // console.log('here gamepad');


  app.gamepad = new THREE.DaydreamController();
  app.gamepad.position.set( 0.25, - 0.5, 0 );
  app.scene.add( app.gamepad );

  //

  var gamepadHelper = new THREE.Line( new THREE.BufferGeometry(), new THREE.LineBasicMaterial( { linewidth: 4 } ) );
  gamepadHelper.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 10 ], 3 ) );
  app.gamepad.add( gamepadHelper );

  //

  console.log('gamepad: ', app.gamepad );

  app.gamepad.addEventListener( 'axischanged', function(e, a, b){
    console.log(e.axes, a, b)

   // hack to fix delta-not-resetting-to-zero issues
    if(e.axes[0] != 0 || e.axes[1] != 0 ){
      app.axes_delta.x = e.axes[0] - app.axes_old.x;
      app.axes_delta.y = e.axes[1] - app.axes_old.y;

      app.axes_old.x = e.axes[0];
      app.axes_old.y = e.axes[1];
    } else {
      app.axes_delta.x = app.axes_delta.y = 0;
    }
    // console.log(app.axes_delta.x, app.axes_delta.y)

  });





  // app.stats = app.addStats();

  app.animate();

}; // init


app.animate = function () {

  // app.stats.update();

  // spline camera tour - only if no mouse for 15 seconds
  if( (Date.now() - app.lastMouseTime) > 15000 ){

    app.cameraPositionIndex++;
    if( app.cameraPositionIndex > 10000 ){
      app.cameraPositionIndex = 0;
    }

    var cpos = app.spline.getPoint( app.cameraPositionIndex / 3000 );
    var crot = app.spline.getTangent( app.cameraPositionIndex / 3000 );
    app.camera.position.set( cpos.x, cpos.y, cpos.z );
    app.camera.rotation.set( crot.x, crot.y, crot.z );

    //app.camera.lookAt( app.spline.getPoint( (app.cameraPositionIndex + 1)/30000 ));
    app.camera.lookAt( app.scene.position );

  }

  if (app.useSphere) {
    app.sphere.rotation.y += app.controller.rotationSpeed;
    app.clouds.rotation.y += app.controller.rotationSpeed * 1.5;
  }

  app.step += app.controller.bouncingSpeed; //increment

  // app.sphere.position.x = 20 + (10 * Math.cos( app.step ));
  // app.sphere.position.y = 5 + (10 * ( Math.sin( app.step )) );

  app.cube.rotation.x += app.controller.rotationSpeed;
  app.cube.rotation.y += app.controller.rotationSpeed;
  app.cube.rotation.z += app.controller.rotationSpeed;

  app.animateParticles();

  app.animateCubes();

  app.controls.update();

  app.gamepad.update();

  if(app.axes_delta.y != 0.0) {
    // cbody.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.y );
    app.cbody.position.add( app.camera.getWorldDirection().multiplyScalar(app.axes_delta.y*2) );
  }

  // app.renderer.render( app.scene, app.camera );
	app.effect.render( app.scene, app.camera );

  app.effect.requestAnimationFrame( app.animate );


};





app.addStats = function () {
  var stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.getElementById("stats").appendChild( stats.domElement );

  return stats;
};


app.onResize = function () {
  app.width = window.innerWidth;
  app.height = window.innerHeight;

  app.camera.aspect = app.width / app.height;
  app.camera.updateProjectionMatrix();

  app.renderer.setSize(app.width, app.height);
};

window.addEventListener("resize", app.onResize, false);


app.createParticleSystem = function () {

  // We will treat particles as individual vertices (points) in a generic Geometry
  var particles = new THREE.Geometry();

  for (var p = 0; p < app.numParticles; p++) {

    var x = app.randRange(-app.particleDistribution, app.particleDistribution);
    var y = app.randRange(-app.particleDistribution, app.particleDistribution);
    var z = app.randRange(-app.particleDistribution, app.particleDistribution); //120

    var particle = new THREE.Vector3(x, y, z);


    var sp = 0.05;

    particle.vx = app.randRange(-sp, sp);
    particle.vy = app.randRange(-sp, sp);
    particle.vz = app.randRange(-sp, sp);


    particles.vertices.push( particle );

  } //for

  var particleMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 1,
    map: THREE.ImageUtils.loadTexture("img/snowflake.png"),
    blending: THREE.AdditiveBlending,
    transparent: false,
    alphaTest: 0.5
  });

  var particleSystem = new THREE.Points( particles, particleMaterial );

  return particleSystem;
};


app.animateParticles = function () {

  var vertices = app.particleSystem.geometry.vertices;

  for (var i = 0; i < vertices.length; i++) {
    var vert = vertices[i];

    var dist = Math.sqrt( (vert.x * vert.x) + (vert.y * vert.y) + (vert.z * vert.z) );


    var force = -0.005 * (5.0 / (dist * dist) );

    // vert.vx += force * vert.x;
    // vert.vy += force * vert.y;
    // vert.vz += force * vert.z;

    vert.x += vert.vx;
    vert.y += vert.vy;
    vert.z += vert.vz;


    // if( vert.y < -app.particleDistribution ){
    //   vert.y = app.particleDistribution;
    // }
    //
    // vert.y -= 0.8;

  }

  app.particleSystem.geometry.verticesNeedUpdate = true;

};


app.createCubes = function( cubeCount, placementRange ){

  var cubes = new Array( cubeCount );

  for( var i = 0; i < cubes.length; i++) {

    var cubeSize =  app.randRange(2, 20);
    var cubeGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
    var cubeMaterial = new THREE.MeshLambertMaterial({
      //color: 0xFF8F00,
      wireframe: false
    });

    cubes[i] = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cubes[i].position.set(
      100, //app.randRange( -placementRange, placementRange ),
      app.randRange( -placementRange, placementRange ),
      app.randRange( -placementRange, placementRange )
    );
    // cubes[i].material.color.setRGB( Math.random(), Math.random(), Math.random() );
    cubes[i].material.color.setHSL( Math.random(),  1.0, 0.5);
    cubes[i].rotate_step = app.randRange( -0.05, 0.05 );
    cubes[i].wave_step = app.randRange( 0.0, 1.0 );
    cubes[i].ystep = 0;
    cubes[i].castShadow = false;
  }
  return cubes;
};


app.animateCubes = function(){
  for( var i = 0; i < app.cubeFleet.length; i++ ){
    var cube = app.cubeFleet[i];

    var hsl  = cube.material.color.getHSL();
    cube.material.color.setHSL((hsl.h + 0.003)%1.0, 1.0, 0.5);

    cube.rotation.x += cube.rotate_step;
    cube.rotation.y += cube.rotate_step;
    cube.rotation.z += cube.rotate_step;

    // YESS
    cube.position.x =  Math.sin( app.step ) * cube.rotate_step * 10000;

    // weird wave layers
    cube.position.y =  Math.cos( (app.step + cube.rotate_step*200) ) * cube.rotate_step * 10000;

    // variable
    // cube.position.x = 10 + Math.sin( cube.wave_step+=0.05 ) * cube.rotate_step * 10000;  //Math.sqrt(cube.position.y);

  }
};



window.onload = app.init; // no jquery, booo
