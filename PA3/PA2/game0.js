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
	// here are some mesh objects ...

	var cone;
	var npc;
	var npc1;
	var npc2;
	var npc3;

	var endScene, endScene1, endCamera, endText, startScene, startCamera;





	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {money:0, health:10, scene:'start', camera:'none' }


	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!




	function createEndScene(){
		endScene = initScene();
		endScene1 = initScene();
		endText = createSkyBox('image/youwon.png',10);
		endText1 = createSkyBox('image/youlose.png',10);
		//endText.rotateX(Math.PI);
		endScene.add(endText);
		endScene1.add(endText1);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		endScene1.add(light1);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,1);
		endCamera.lookAt(0,0,0);

	}

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createStartScene();
			createEndScene();
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

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatarCam.translateY(-4);
			avatarCam.translateZ(3);
			gameState.camera = avatarCam;

      edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
      edgeCam.position.set(20,20,10);


			addBalls();
			addCoins();

			cone = createCubeMesh();
			cone.position.set(10,3,7);
			scene.add(cone);

			redball = createRedBall();
			redball.position.set(randN(180),5,randN(180));
			redball.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.scene='youwon';
        }
      })
			scene.add(redball);
      /**
			npc = createBoxMesh2(0x00ffff,4,4,4);
			npc.position.set(150,5,-100);
      npc.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health-=5;
					npc.scale.x*=1.4;
					npc.scale.y*=1.4;
					npc.scale.z*=1.4;
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
        }
      })
			scene.add(npc);
			*/

			npc = createBoxMesh2(0xffffff,4,4,4);
			npc.position.set(100,5,-120);
      npc.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health--;
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
        }
      })
			scene.add(npc);

			npc1 = createBoxMesh2(0xffffff,4,4,4);
			npc1.position.set(120,5,120);
      npc1.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health--;
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
        }
      })
			scene.add(npc1);

			npc2 = createBoxMesh2(0xffffff,4,4,4);
			npc2.position.set(-140,5,-120);
      npc2.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health--;
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
        }
      })
			scene.add(npc2);

			npc3 = createBoxMesh2(0xffffff,4,4,4);
			npc3.position.set(-120,5,120);
      npc3.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health--;
					if(gameState.health==0){
						gameState.scene='youlose';
					}
					avatar.__dirtyPosition = true;
					avatar.position.set (-(randN(49)), 5, -(randN(40)));
        }
      })
			scene.add(npc3);

			createAvatar();

      //var wall = createWall(0xffaa00,50,3,1);
      //wall.position.set(10,0,10);
      ///scene.add(wall);
			//console.dir(npc);
			//playGameMusic();
			for(var i=0; i<4; i++){
				var p = createBoxMesh3(0x0000ff,1,10,150)
				p.position.set(200-50*i,0,100);
				scene.add(p);
			}

			for(var i=0; i<4; i++){
				var p = createBoxMesh3(0xff0000,1,10,150)
				p.position.set(-200+50*i,0,-100);
				scene.add(p);
			}

			for(var i=0; i<4; i++){
				var p = createBoxMesh3(0xabcd00,1,10,150)
				p.position.set(100,0,-60-40*i);
				p.rotateY(Math.PI/2);
				scene.add(p);
			}

			for(var i=0; i<4; i++){
				var p = createBoxMesh3(0x00abcd,1,10,150)
				p.position.set(-100,0,60+40*i);
				p.rotateY(Math.PI/2);
				scene.add(p);
			}

			var wall1 = createBoxMesh3(0x0000ff,1,30,800)
			wall1.position.set(230,0,0)
			scene.add(wall1)

			var wall2 = createBoxMesh3(0x0000ff,1,30,800)
			wall2.position.set(-230,0,0)
			scene.add(wall2)

			var wall3 = createBoxMesh3(0x0000ff,1,30,800)
			wall3.rotateY(Math.PI/2)
			wall3.position.set(0,0,230)
			scene.add(wall3)

			var wall4 = createBoxMesh3(0x0000ff,1,30,800)
			wall4.position.set(0,0,-230)
			wall4.rotateY(Math.PI/2)
			scene.add(wall4)
	}


	function randN(n){
		return Math.random()*n;
	}




	function addBalls(){
		var numBalls = 20;


		for(i=0;i<numBalls;i++){
			var ball = createBall();
			if(i >= 15){
				ball.position.set(randN(180),5,randN(180));
			}
			else if(i >= 10 && i< 15){
				ball.position.set(randN(-180),5,randN(-180));
			}
			else if(i >= 5 && i< 10){
				ball.position.set(randN(-180),5,randN(180));
			}
			else{
				ball.position.set(randN(180),5,randN(-180));
			}
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						console.log("ball "+i+" hit the cone");
						avatar.scale.x/=1.05;
						avatar.scale.y/=1.05;
						avatar.scale.z/=1.05;
						soundEffect('sound/good.wav');
						gameState.health--;  // add one to the money
            //scene.remove(ball);  // this isn't working ...
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
				}
			)
		}
	}

	function addCoins(){
		var numCoins = 20;

		for(i=0;i<numCoins;i++){
			var coin = createCoin();
			if(i > 15){
				coin.position.set(randN(180),3,randN(180));
			}
			else if(i >= 10 && i<= 15){
				coin.position.set(randN(-180),3,randN(180));
			}
			else if(i >= 5 && i< 10){
				coin.position.set(randN(180),3,randN(-180));
			}
			else{
				coin.position.set(randN(-180),3,randN(-180));
			}

			scene.add(coin);

			coin.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						soundEffect('sound/good.wav');
						gameState.money ++;  // add one to the money
						// threejs doesn't let us remove it from the schene...
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

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
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
		//Set up shadow properties for the light
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
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh3(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//mesh = new THREE.Mesh( geometry, material );
		mesh = new Physijs.BoxMesh( geometry, pmaterial,0 );
		mesh.castShadow = true;
		return mesh;
	}

  function createWall(color,w,h,d){
    var geometry = new THREE.BoxGeometry( w, h, d);
    var material = new THREE.MeshLambertMaterial( { color: color} );
    mesh = new Physijs.BoxMesh( geometry, material, 0 );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
    mesh.castShadow = true;
    return mesh;
  }



	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 500, 500 );
		var texture = new THREE.TextureLoader().load( image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 50, 50 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 300, 300, 300 );
		var texture = new THREE.TextureLoader().load(image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}
	function createSkyBox2(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.BoxGeometry( 300, 3, 300 );
		var texture = new THREE.TextureLoader().load(image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		//texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}

	function createAvatar1(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var loader = new THREE.JSONLoader();
		loader.load("image/suzanne.json", function(geometry, materials){
			var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
			var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
			avatar = new Physijs.BoxMesh( geometry, pmaterial );
			avatar.scale.set(1.5,1.5,1.5);
			avatar.translateY(20);
			avatar.castShadow = true;
			avatar.setDamping(0.1,0.1);
			avatarCam.position.set(0,4,0);
			avatarCam.lookAt(0,4,10);
			scene.add(avatar);
			avatar.add(avatarCam);
		},
		function(xhr){
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
		function(err){
			console.log("error in loading: "+err);});
	}

	function createAvatar(){
		var geometry = new THREE.SphereGeometry( 4, 4, 4);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		avatar = new Physijs.BoxMesh( geometry, pmaterial );
		avatar.scale.set(1.5,1.5,1.5);
		avatar.translateY(20);
		avatar.castShadow = true;
		avatar.setDamping(0.1,0.1);
		avatarCam.position.set(0,4,0);
		avatarCam.lookAt(0,4,10);
		scene.add(avatar);
		avatar.add(avatarCam);
	}



	function createCubeMesh(r,h){
		var geometry = new THREE.BoxGeometry(4,10,4);
		var texture = new THREE.TextureLoader().load( 'image/tile.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
		mesh.castShadow = true;
		return mesh;
	}


	function createBall(){
		var geometry = new THREE.SphereGeometry( 2, 20, 20);
		//var geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 32 );
		var material = new THREE.MeshLambertMaterial( { color: 0x228b22} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	function createRedBall(){
		var geometry = new THREE.SphereGeometry( 2, 20, 20);
		//var geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 32 );
		var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	function createCoin(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 32 );
		var material = new THREE.MeshLambertMaterial( { color: 0xDAA520} );
		var pmaterial = new Physijs.createMaterial(material,0.1, 0);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		mesh.rotateX(Math.PI/2);
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
		//console.dir(event);
		// first we handle the "play again" key in the "youwon" scene
		if (gameState.scene == 'start' && event.key=='p') {
			gameState.scene = 'main';
			gameState.money = 0;
			addBalls();
			addCoins();
			return;
		}
		if (gameState.scene == 'youwon' && event.key=='r') {
			gameState.scene = 'main';
			gameState.money = 0;
			addBalls();
			addCoins();
			return;
		}

		if (gameState.scene == 'youlose' && event.key=='r') {
			gameState.scene = 'main';
			gameState.money = 0;
			gameState.health = 10;
			avatar.position.set(0,0,0);
			npc = createBoxMesh2(0xffffff,4,4,4);
			npc1 = createBoxMesh2(0xffffff,4,4,4);
			npc2 = createBoxMesh2(0xffffff,4,4,4);
			npc3 = createBoxMesh2(0xffffff,4,4,4);
			addBalls();
			addCoins();
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      case " ": controls.fly = true;
          console.log("space!!");
          break;
      case "h": controls.reset = true; break;


			// switch cameras
			case "1": gameState.camera = camera; break;
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
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}

	function updateNPC(){
		if(Math.pow(npc.position.x-avatar.position.x,2)+Math.pow(npc.position.z-avatar.position.z,2)<10000){
			npc.lookAt(avatar.position);
			//npc.__dirtyPosition = true;
			npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(10));
		}
	}

	function updateNPC1(){
		if(Math.pow(npc1.position.x-avatar.position.x,2)+Math.pow(npc1.position.z-avatar.position.z,2)<10000){
			npc1.lookAt(avatar.position);
			//npc.__dirtyPosition = true;
			npc1.setLinearVelocity(npc1.getWorldDirection().multiplyScalar(10));
		}
	}

	function updateNPC2(){
		if(Math.pow(npc2.position.x-avatar.position.x,2)+Math.pow(npc2.position.z-avatar.position.z,2)<10000){
			npc2.lookAt(avatar.position);
			//npc.__dirtyPosition = true;
			npc2.setLinearVelocity(npc2.getWorldDirection().multiplyScalar(10));
		}
	}

	function updateNPC3(){
		if(Math.pow(npc3.position.x-avatar.position.x,2)+Math.pow(npc3.position.z-avatar.position.z,2)<10000){
			npc3.lookAt(avatar.position);
			//npc.__dirtyPosition = true;
			npc3.setLinearVelocity(npc3.getWorldDirection().multiplyScalar(10));
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

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
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

	}
	function createStartScene(){
			startScene = initScene();
			startText = createSkyBox2('image/P1.png',10);
			//startText.rotateZ(Math.PI);
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
				//endText.rotateY(0.005);
				renderer.render( startScene, startCamera );
				break;
			case "youwon":
				//endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

			case "youlose":
				renderer.render( endScene1, endCamera );
				break;

			case "main":
				updateAvatar();
				updateNPC();
				updateNPC1();
				updateNPC2();
				updateNPC3();
        edgeCam.lookAt(avatar.position);
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
