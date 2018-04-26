/*
Game 0
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone
*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam;  // we have two cameras in the main scene
	var avatar;
	var redball;
	var bonusball1;
	var bonusball2;
	var suzanne;

	var npc;
	var npc1;
	var npc2;
	var npc3;

	var endScene, endScene1, endCamera, endCamera1, endText, startScene, startCamera;

	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:15, reset:false,
		    camera:camera}

	var gameState =
	     {money:0, health:15, scene:'start', camera:'none' }


	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!

	function createEndScene(){
		endScene = initScene();
		endText = createSkyBox2('image/P3.png',10);
		endScene.add(endText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,50);
		endCamera.lookAt(0,0,0);
	}

	function createEndScene1(){
		endScene1 = initScene();
		endText1 = createSkyBox2('image/P4.png',10);
		endScene1.add(endText1);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene1.add(light1);
		endCamera1 = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera1.position.set(0,50,50);
		endCamera1.lookAt(0,0,0);
	}

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createStartScene();
			createEndScene();
			createEndScene1();
			initRenderer();
			createMainScene();
	}

	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,250,0);
			camera.lookAt(0,0,0);

			// create the ground and the skybox
			var ground = createGround('image/grass.jpg');
			scene.add(ground);
			var skybox = createSkyBox('image/P2.jpg',5);
			scene.add(skybox);

			// create the avatar camera
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatarCam.translateY(-4);
			avatarCam.translateZ(3);
			gameState.camera = avatarCam;

			// create the edge camera
      edgeCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			edgeCam.translateY(-4);
			edgeCam.translateZ(3);

			addBalls(100);
			addGoldBalls(7);
			addDiamond();
			addCoins(80);

			redball = createRedBall();
			redball.position.set(randN(130)+80,5,randN(130)+80);
			redball.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.scene='youwon';
        }
      })
			scene.add(redball);

			bonusball1 = createBonusBall();
			bonusball1.position.set(randN(180),5,randN(180));
			bonusball1.addEventListener('collision',function(other_object){
        if (other_object==avatar){
					gameState.health += 5;
					soundEffect('sound/good.wav');
					bonusball1.position.y = this.position.y - 100;
					bonusball1.__dirtyPosition = true;
					console.log("Congratulations! You find one of the bonus balls!!");
        }
      })
			scene.add(bonusball1);

			bonusball2 = createBonusBall();
			bonusball2.position.set(randN(180),5,randN(180));
			bonusball2.addEventListener('collision',function(other_object){
        if (other_object==avatar){
					gameState.health += 7;
					soundEffect('sound/good.wav');
					bonusball2.position.y = this.position.y - 100;
					bonusball2.__dirtyPosition = true;
					console.log("Congratulations! You find one of the bonus balls!!");
        }
      })
			scene.add(bonusball2);

			npc = createBoxMesh2(0xffffff,4,4,4);
			npc.position.set(100,5,-120);
      npc.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health-=3;
					soundEffect('sound/bad.wav');
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
					addBalls(15);
        }
      })
			scene.add(npc);

			npc1 = createBoxMesh2(0xffffff,4,4,4);
			npc1.position.set(120,5,120);
      npc1.addEventListener('collision',function(other_object){
        if (other_object==avatar){
					soundEffect('sound/bad.wav');
          gameState.health-=3;
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
					addBalls(15);
        }
      })
			scene.add(npc1);

			npc2 = createBoxMesh2(0xffffff,4,4,4);
			npc2.position.set(-140,5,-120);
      npc2.addEventListener('collision',function(other_object){
        if (other_object==avatar){
					soundEffect('sound/bad.wav');
          gameState.health-=3;
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
					addBalls(15);
        }
      })
			scene.add(npc2);

			npc3 = createBoxMesh2(0xffffff,4,4,4);
			npc3.position.set(-120,5,120);
      npc3.addEventListener('collision',function(other_object){
        if (other_object==avatar){
					soundEffect('sound/bad.wav');
          gameState.health-=3;
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
					addBalls(15);
        }
      })
			scene.add(npc3);

			initSuzanneJSON();

			var b1 = createBoxMesh3( 1,40,220,'wall2.jpg')
			b1.position.set(100,0,90);
			scene.add(b1);

			var b2 = createBoxMesh3( 1,40,180,'wall2.jpg')
			b2.position.set(190,0,70);
			scene.add(b2);

			var b3 = createBoxMesh3( 1,40,180,'wall2.jpg')
			b3.position.set(150,0,110);
			scene.add(b3);

			var b4 = createBoxMesh3( 1,40,40,'wall2.jpg')
			b4.position.set(170,0,200);
			b4.rotateY(Math.PI/2);
			scene.add(b4);

			var b5 = createBoxMesh3( 1,40,40,'wall2.jpg')
			b5.position.set(210,0,-20);
			b5.rotateY(Math.PI/2);
			scene.add(b5);

			var b6 = createBoxMesh3( 1,40,40,'wall2.jpg')
			b6.position.set(120,0,-20);
			b6.rotateY(Math.PI/2);
			scene.add(b6);

			var b7 = createBoxMesh3( 1,40,40,'wall2.jpg')
			b7.position.set(80,0,200);
			b7.rotateY(Math.PI/2);
			scene.add(b7);

			var b8 = createBoxMesh3(1,40,220,'wall2.jpg')
			b8.position.set(60,0,90);
			scene.add(b8);





			var r1 = createBoxMesh3( 1,40,220,'wall3.jpg')
			r1.position.set(-100,0,-90);
			scene.add(r1);

			var r2 = createBoxMesh3( 1,40,180,'wall3.jpg')
			r2.position.set(-190,0,-70);
			scene.add(r2);

			var r3 = createBoxMesh3( 1,40,180,'wall3.jpg')
			r3.position.set(-150,0,-110);
			scene.add(r3);

			var r4 = createBoxMesh3( 1,40,40,'wall3.jpg')
			r4.position.set(-170,0,-200);
			r4.rotateY(Math.PI/2);
			scene.add(r4);

			var r5 = createBoxMesh3( 1,40,40,'wall3.jpg')
			r5.position.set(-210,0,20);
			r5.rotateY(Math.PI/2);
			scene.add(r5);

			var r6 = createBoxMesh3( 1,40,40,'wall3.jpg')
			r6.position.set(-120,0,20);
			r6.rotateY(Math.PI/2);
			scene.add(r6);

			var r7 = createBoxMesh3( 1,40,40,'wall3.jpg')
			r7.position.set(-80,0,-200);
			r7.rotateY(Math.PI/2);
			scene.add(r7);

			var r8 = createBoxMesh3(1,40,220,'wall3.jpg')
			r8.position.set(-60,0,-90);
			scene.add(r8);





			var y1 = createBoxMesh3(1,40,220,'wall.jpg')
			y1.position.set(90,0,-100);
			y1.rotateY(Math.PI/2);
			scene.add(y1);

			var y2 = createBoxMesh3(1,40,180,'wall.jpg')
			y2.position.set(70,0,-190);
			y2.rotateY(Math.PI/2);
			scene.add(y2);

			var y3 = createBoxMesh3(1,40,180,'wall.jpg')
			y3.position.set(110,0,-150);
			y3.rotateY(Math.PI/2);
			scene.add(y3);

			var y4 = createBoxMesh3(1,40,40,'wall.jpg')
			y4.position.set(200,0,-170);
			scene.add(y4);

			var y5 = createBoxMesh3(1,40,40,'wall.jpg')
			y5.position.set(-20,0,-210);
			scene.add(y5);

			var y6 = createBoxMesh3(1,40,40,'wall.jpg')
			y6.position.set(-20,0,-120);
			scene.add(y6);

			var y7 = createBoxMesh3(1,40,40,'wall.jpg')
			y7.position.set(200,0,-80);
			scene.add(y7);

			var y8 = createBoxMesh3(1,40,220,'wall.jpg')
			y8.position.set(90,0,-60);
			y8.rotateY(Math.PI/2);
			scene.add(y8);



			var l1 = createBoxMesh3(1,40,220,'wall4.jpg')
			l1.position.set(-90,0,100);
			l1.rotateY(Math.PI/2);
			scene.add(l1);

			var l2 = createBoxMesh3( 1,40,180,'wall4.jpg')
			l2.position.set(-70,0,190);
			l2.rotateY(Math.PI/2);
			scene.add(l2);

			var l3 = createBoxMesh3( 1,40,180,'wall4.jpg')
			l3.position.set(-110,0,150);
			l3.rotateY(Math.PI/2);
			scene.add(l3);

			var l4 = createBoxMesh3( 1,40,40,'wall4.jpg')
			l4.position.set(-200,0,170);
			scene.add(l4);

			var l5 = createBoxMesh3( 1,40,40,'wall4.jpg')
			l5.position.set(20,0,210);
			scene.add(l5);

			var l6 = createBoxMesh3( 1,40,40,'wall4.jpg')
			l6.position.set(20,0,120);
			scene.add(l6);

			var l7 = createBoxMesh3( 1,40,40,'wall4.jpg')
			l7.position.set(-200,0,80);
			scene.add(l7);

			var l8 = createBoxMesh3( 1,40,220,'wall4.jpg')
			l8.position.set(-90,0,60);
			l8.rotateY(Math.PI/2);
			scene.add(l8);




			var wall1 = createBoxMesh3( 1,30,800,'wall4.jpg')
			wall1.position.set(230,0,0)
			scene.add(wall1)

			var wall2 = createBoxMesh3( 1,30,800,'wall4.jpg')
			wall2.position.set(-230,0,0)
			scene.add(wall2)

			var wall3 = createBoxMesh3( 1,30,800,'wall4.jpg')
			wall3.rotateY(Math.PI/2)
			wall3.position.set(0,0,230)
			scene.add(wall3)

			var wall4 = createBoxMesh3( 1,30,800,'wall4.jpg')
			wall4.position.set(0,0,-230)
			wall4.rotateY(Math.PI/2)
			scene.add(wall4)
	}


	function randN(n){
		return Math.random()*n;
	}

	function addBalls(numBalls){


		for(i=0;i<numBalls;i++){
			var ball = createBall();
			var R1;
			var R2;
			if(randN(10)>5)
				R1=-1;
			else
				R1=1;
			if(randN(10)>5)
				R2=-1;
			else
				R2=1;
			ball.position.set(randN(180)*R1, 5, randN(180)*R2);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						avatar.scale.x/=1.05;
						avatar.scale.y/=1.05;
						avatar.scale.z/=1.05;
						soundEffect('sound/bad.wav');
						gameState.health--;
						if(gameState.health==0){
							gameState.scene='youlose';
						}
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
						addBalls(15);
						addSpike();
						console.log("Difficulty increased. 20 balls added");
					}
				}
			)
		}
	}
	function addGoldBalls(numBalls){


		for(i=0;i<numBalls;i++){
			var Gball = createGoldBall();
			var R1;
			var R2;
			if(randN(10)>5)
				R1=-1;
			else
				R1=1;
			if(randN(10)>5)
				R2=-1;
			else
				R2=1;
			Gball.position.set(randN(180)*R1, 5, randN(180)*R2);
			scene.add(Gball);

			Gball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						soundEffect('sound/good.wav');
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
						addCoins(20);
						console.log("Treasury Found!!! 30 Coins Added");
					}
				}
			)
		}
	}

	function addDiamond(){
		var dia1 = createDiamond();
		dia1.position.set(5, 5, 5);
		scene.add(dia1)
		console.log("dia1Add");

		var dia2 = createDiamond();
		dia2.position.set(-130, 5, -130);
		scene.add(dia2)
		console.log("dia2Add");

		var dia3 = createDiamond();
		dia3.position.set(-130, 5, 130);
		scene.add(dia3)
		console.log("dia3Add");

		dia1.addEventListener( 'collision',
		function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			if (other_object==avatar){
				soundEffect('sound/good.wav');
				console.log("dia1hit");
				this.position.y = this.position.y - 100;
				this.__dirtyPosition = true;
				gameState.health+=5;
			}
		})

		dia2.addEventListener( 'collision',
		function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			if (other_object==avatar){
				soundEffect('sound/good.wav');
				console.log("dia2hit");
				this.position.y = this.position.y - 100;
				this.__dirtyPosition = true;
				gameState.health+=5;
			}
		})

		dia3.addEventListener( 'collision',
		function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			if (other_object==avatar){
				soundEffect('sound/good.wav');
				console.log("dia3hit");
				this.position.y = this.position.y - 100;
				this.__dirtyPosition = true;
				gameState.health+=5;
			}
		})
	}

	function addSpike(){
			var spike = createCone();

			spike.position.set(avatar.position.x, 15, avatar.position.z);
			scene.add(spike);

			spike.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						soundEffect('sound/bad.wav');
						gameState.health--;
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
						console.log("Dodge the spike!!!");
					}
				}
			)
	}

		function initSuzanneJSON(){
			//load the monkey avatar into the scene, and add a Physics mesh and camera
			var loader = new THREE.JSONLoader();
			loader.load("../models/suzanne.json",
						function ( geometry, materials ) {
							console.log("loading suzanne");
							var material =
							new THREE.MeshLambertMaterial( { color: 0x0066ff } );
							suzanne = new Physijs.BoxMesh( geometry, material );

							avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
							gameState.camera = avatarCam;

							avatarCam.position.set(0,4,-10);
							avatarCam.lookAt(0,4,10);
							suzanne.add(avatarCam);
							suzanne.position.set(-40,20,-40);
							suzanne.castShadow = true;
							suzanne.scale.set(3, 3, 3);
							scene.add( suzanne  );
							avatar=suzanne;
						},
						function(xhr){
							console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
						function(err){console.log("error in loading: "+err);}
					)
		}

	function addCoins(numCoins){

		for(i=0;i<numCoins;i++){
			var coin = createCoin();
			var R1;
			var R2;
			if(randN(10)>5)
				R1=-1;
			else
				R1=1;
			if(randN(10)>5)
				R2=-1;
			else
				R2=1;
			coin.position.set(randN(180)*R1, 5, randN(180)*R2);
			scene.add(coin);

			coin.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						soundEffect('sound/good.wav');
						gameState.money ++;
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
				}
			)
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( 'sound/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}


	function initScene(){
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }

	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}


	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh3(w,h,d,image){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var texture = new THREE.TextureLoader().load('image/'+image);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 5, 2 );
		var material = new THREE.MeshLambertMaterial( {map: texture, side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		mesh = new Physijs.BoxMesh( geometry, pmaterial,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createGround(image){
		var geometry = new THREE.PlaneGeometry( 500, 500 );
		var texture = new THREE.TextureLoader().load( image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 20, 20 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.receiveShadow = true;
		mesh.rotateX(Math.PI/2);
		return mesh
	}

	function createSkyBox(image,k){
		var geometry = new THREE.SphereGeometry( 300, 300, 300 );
		var texture = new THREE.TextureLoader().load(image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh
	}
	function createSkyBox2(image,k){
		var geometry = new THREE.BoxGeometry( 300, 3, 300 );
		var texture = new THREE.TextureLoader().load(image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh


	}

	function createBall(){
		var geometry = new THREE.SphereGeometry( 2, 20, 20);
		var material = new THREE.MeshLambertMaterial( { color: 0x228b22} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0.00001 );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	function createGoldBall(){
		var geometry = new THREE.SphereGeometry( 2, 20, 20);
		var material = new THREE.MeshLambertMaterial( { color: 0xFFD700} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0.00001 );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	function createRedBall(){
		var geometry = new THREE.SphereGeometry( 2, 20, 20);
		var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	function createBonusBall(){
		var geometry = new THREE.SphereGeometry( 1, 20, 20);
		var material = new THREE.MeshLambertMaterial( { color: 0x6FA8DC} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0,0);
		mesh.castShadow = true;
		return mesh;
	}

	function createCoin(){
		var geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 32 );
		var material = new THREE.MeshLambertMaterial( { color: 0xDAA520} );
		var pmaterial = new Physijs.createMaterial(material,0.1, 0);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		mesh.rotateX(Math.PI/2);
		return mesh;
	}

	function createDiamond(){
		var geometry = new THREE.OctahedronGeometry(5,0);
		var material = new THREE.MeshLambertMaterial( { color: 0x7060A1, transparent: true, opacity:0.8} );
		var pmaterial = new Physijs.createMaterial(material,1, 0);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0.0001 );
		mesh.setDamping(1,1);
		mesh.castShadow = true;
		return mesh;
	}

	function createCone(){
		var geometry = new THREE.ConeGeometry( 2, 6, 6);
		var material = new THREE.MeshLambertMaterial( { color: 0xff3300} );
		var pmaterial = new Physijs.createMaterial(material,1, 0);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial, 1 );
		mesh.setDamping(1,1);
		mesh.castShadow = true;
		mesh.rotateX(Math.PI);
		return mesh;
	}

	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown: '"+event.key+"'");
		// first we handle the "play again" key in the "youwon" scene
		if (gameState.scene == 'start' && event.key=='p') {
			gameState.scene = 'main';
		}
		if (gameState.scene == 'youwon' && event.key=='r') {
			gameState.scene = 'main';
			gameState.money = 0;
			avatar.__dirtyPosition = true;
			avatar.position.set(-40,20,-40);
			redball.__dirtyPosition = true;
			redball.position.set(randN(130)+80,5,randN(130)+80);
			addBalls(100);
			addGoldBalls(7);
			addDiamond();
			addCoins(80);
			return;
		}

		if (gameState.scene == 'youlose' && event.key=='r') {
			gameState.scene = 'main';
			gameState.money = 0;
			gameState.health = 15;
			avatar.position.set(0,0,0);
			avatar.__dirtyPosition = true;
			redball.__dirtyPosition = true;
			redball.position.set(randN(130)+80,5,randN(130)+80);
			npc = createBoxMesh2(0xffffff,4,4,4);
			npc1 = createBoxMesh2(0xffffff,4,4,4);
			npc2 = createBoxMesh2(0xffffff,4,4,4);
			npc3 = createBoxMesh2(0xffffff,4,4,4);
			addBalls(100);
			addGoldBalls(7);
			addDiamond();
			addCoins(80);
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "m":
			  if(gameState.money >= 5){
					controls.speed = 30;
					gameState.money -= 5;
				}
				break;
      case "h": controls.reset = true; break;

			// switch cameras
			case "|": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
      case "3": gameState.camera = edgeCam; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "q": avatarCam.rotateY(0.01); break;
			case "e": avatarCam.rotateY(-0.01); break;

		}

	}

	function keyup(event){
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "m": controls.speed = 10; break;
      case "h": controls.reset = false; break;
		}
	}

	function updateNPC(){
		if(Math.pow(npc.position.x-avatar.position.x,2)+Math.pow(npc.position.z-avatar.position.z,2)<20000){
			npc.lookAt(avatar.position);
			npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(20));
		}
	}

	function updateNPC1(){
		if(Math.pow(npc1.position.x-avatar.position.x,2)+Math.pow(npc1.position.z-avatar.position.z,2)<20000){
			npc1.lookAt(avatar.position);
			npc1.setLinearVelocity(npc1.getWorldDirection().multiplyScalar(20));
		}
	}

	function updateNPC2(){
		if(Math.pow(npc2.position.x-avatar.position.x,2)+Math.pow(npc2.position.z-avatar.position.z,2)<20000){
			npc2.lookAt(avatar.position);
			npc2.setLinearVelocity(npc2.getWorldDirection().multiplyScalar(20));
		}
	}

	function updateNPC3(){
		if(Math.pow(npc3.position.x-avatar.position.x,2)+Math.pow(npc3.position.z-avatar.position.z,2)<20000){
			npc3.lookAt(avatar.position);
			npc3.setLinearVelocity(npc3.getWorldDirection().multiplyScalar(20));
		}
	}

  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
			avatar.__dirtyRotation = true;
      avatar.position.set(40,10,40);
			avatar.rotation.set(0, 0, 0);
    }

		if(Math.pow(avatar.position.x-redball.position.x,2)+Math.pow(avatar.position.z-redball.position.z,2)<10000){
			npc.lookAt(avatar.position);
			npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(20));
			npc1.lookAt(avatar.position);
			npc1.setLinearVelocity(npc.getWorldDirection().multiplyScalar(20));
			npc2.lookAt(avatar.position);
			npc2.setLinearVelocity(npc.getWorldDirection().multiplyScalar(20));
			npc3.lookAt(avatar.position);
			npc3.setLinearVelocity(npc.getWorldDirection().multiplyScalar(20));
		}

	}
	function createStartScene(){
			startScene = initScene();
			startText = createSkyBox2('image/p1.png',10);
			startScene.add(startText);
			var light1 = createPointLight();
			light1.position.set(0,200,0);
			startScene.add(light1);
			startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			startCamera.position.set(0,150,0);
			startCamera.lookAt(0,0,0);

		}


	function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {

			case "start":
				renderer.render( startScene, startCamera );
				break;
			case "youwon":
				renderer.render( endScene, endCamera );
				break;

			case "youlose":
				renderer.render( endScene1, endCamera1 );
				break;

			case "main":
				updateAvatar();
				updateNPC();
				updateNPC1();
				updateNPC2();
				updateNPC3();
				edgeCam.position.set(0,4,0);
				edgeCam.translateY(10);
				edgeCam.translateZ(30);
        edgeCam.lookAt(0,4,45);
				scene.add(edgeCam);
				avatar.add(edgeCam);
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//draw heads up display ..
	  var info = document.getElementById("info");
		info.innerHTML='<div style="font-size:24pt">money: '
    + gameState.money
    + " health="+gameState.health
    + '</div>';
	}
