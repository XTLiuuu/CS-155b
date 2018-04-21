	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer   // all threejs programs need these
	var camera, avatarCam, edgeCam   // we have two cameras in the main scene
	var avatar
	var redball
	var suzanne

	var npc
	var npc1
	var npc2
	var npc3

	var endScene, endScene1, endCamera, endCamera1, endText, startScene, startCamera

	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, reset:false,
		    camera:camera}

	var gameState =
	     {money:0, health:10, scene:'start', camera:'none' }


	// Here is the main game control
  init()  //
	initControls()
	animate()   // start the animation loop!

	function createEndScene(){
		endScene = initScene()
		endText = createSkyBox('image/won.png',10)
		//endText.rotateX(Math.PI)
		endScene.add(endText)
		var light1 = createPointLight()
		light1.position.set(0,200,20)
		endScene.add(light1)
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 )
		endCamera.position.set(0,50,1)
		endCamera.lookAt(0,0,0)

	}

	function createEndScene1(){
		endScene1 = initScene()
		endText1 = createSkyBox('image/youlose.png',10)
		endScene1.add(endText1)
		var light1 = createPointLight()
		light1.position.set(0,200,20)
		endScene1.add(light1)
		endCamera1 = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 )
		endCamera1.position.set(0,50,1)
		endCamera1.lookAt(0,0,0)
	}

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs()
			scene = initScene()
			createStartScene()
			createEndScene()
			createEndScene1()
			initRenderer()
			createMainScene()
	}

	function createMainScene(){
      // setup lighting
			var light1 = createPointLight()
			light1.position.set(0,200,20)
			scene.add(light1)
			var light0 = new THREE.AmbientLight( 0xffffff,0.25)
			scene.add(light0)

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 )
			camera.position.set(0,250,0)
			camera.lookAt(0,0,0)

			// create the ground and the skybox
			var ground = createGround('image/grass.jpg')
			//var ground = createGround('image/mingrui.jpeg')
			scene.add(ground)
			var skybox = createSkyBox('image/P2.jpg',5)
			scene.add(skybox)

			// create the avatar camera
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 )
			avatarCam.translateY(-4)
			avatarCam.translateZ(3)
			gameState.camera = avatarCam

			// create the edge camera
      edgeCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 )
			edgeCam.translateY(-4)
			edgeCam.translateZ(3)

			addBalls()
			addCoins()

			redball = createRedBall()
			redball.position.set(randN(180),5,randN(180))
			redball.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.scene='youwon'
        }
      })
			scene.add(redball)

			npc = createBoxMesh2(0xffffff,4,4,4)
			npc.position.set(100,5,-120)
      npc.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health--
					if(gameState.health==0){
						gameState.scene='youlose'
					}
					avatar.__dirtyPosition = true
					avatar.position.set (-(randN(49)), 5, -(randN(40)))
        }
      })
			scene.add(npc)

			npc1 = createBoxMesh2(0xffffff,4,4,4)
			npc1.position.set(120,5,120)
      npc1.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health--
					if(gameState.health==0){
						gameState.scene='youlose'
					}
					avatar.__dirtyPosition = true
					avatar.position.set (-(randN(49)), 5, -(randN(40)))
        }
      })
			scene.add(npc1)

			npc2 = createBoxMesh2(0xffffff,4,4,4)
			npc2.position.set(-140,5,-120)
      npc2.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health--
					if(gameState.health==0){
						gameState.scene='youlose'
					}
					avatar.__dirtyPosition = true
					avatar.position.set (-(randN(49)), 5, -(randN(40)))
        }
      })
			scene.add(npc2)

			npc3 = createBoxMesh2(0xffffff,4,4,4)
			npc3.position.set(-120,5,120)
      npc3.addEventListener('collision',function(other_object){
        if (other_object==avatar){
          gameState.health--
					if(gameState.health==0){
						gameState.scene='youlose'
					}
					avatar.__dirtyPosition = true
					avatar.position.set (-(randN(49)), 5, -(randN(40)))
        }
      })
			scene.add(npc3)

			initSuzanneJSON()
		//	initSuzanneOBJ()

			//createAvatar()

			var b1 = createBoxMesh3(0x0000ff,1,40,220)
			b1.position.set(100,0,90)
			scene.add(b1)

			var b2 = createBoxMesh3(0x0000ff,1,40,180)
			b2.position.set(190,0,70)
			scene.add(b2)

			var b3 = createBoxMesh3(0x0000ff,1,40,180)
			b3.position.set(150,0,110)
			scene.add(b3)

			var b4 = createBoxMesh3(0x0000ff,1,40,40)
			b4.position.set(170,0,200)
			b4.rotateY(Math.PI/2)
			scene.add(b4)

			var b5 = createBoxMesh3(0x0000ff,1,40,40)
			b5.position.set(210,0,-20)
			b5.rotateY(Math.PI/2)
			scene.add(b5)

			var b6 = createBoxMesh3(0x0000ff,1,40,40)
			b6.position.set(120,0,-20)
			b6.rotateY(Math.PI/2)
			scene.add(b6)

			var b7 = createBoxMesh3(0x0000ff,1,40,40)
			b7.position.set(80,0,200)
			b7.rotateY(Math.PI/2)
			scene.add(b7)

			var b8 = createBoxMesh3(0x0000ff,1,40,220)
			b8.position.set(60,0,90)
			scene.add(b8)



			var r1 = createBoxMesh3(0xff0000,1,40,220)
			r1.position.set(-100,0,-90)
			scene.add(r1)

			var r2 = createBoxMesh3(0xff0000,1,40,180)
			r2.position.set(-190,0,-70)
			scene.add(r2)

			var r3 = createBoxMesh3(0xff0000,1,40,180)
			r3.position.set(-150,0,-110)
			scene.add(r3)

			var r4 = createBoxMesh3(0xff0000,1,40,40)
			r4.position.set(-170,0,-200)
			r4.rotateY(Math.PI/2)
			scene.add(r4)

			var r5 = createBoxMesh3(0xff0000,1,40,40)
			r5.position.set(-210,0,20)
			r5.rotateY(Math.PI/2)
			scene.add(r5)

			var r6 = createBoxMesh3(0xff0000,1,40,40)
			r6.position.set(-120,0,20)
			r6.rotateY(Math.PI/2)
			scene.add(r6)

			var r7 = createBoxMesh3(0xff0000,1,40,40)
			r7.position.set(-80,0,-200)
			r7.rotateY(Math.PI/2)
			scene.add(r7)

			var r8 = createBoxMesh3(0xff0000,1,40,220)
			r8.position.set(-60,0,-90)
			scene.add(r8)



			var y1 = createBoxMesh3(0xabcd00,1,40,220)
			y1.position.set(90,0,-100)
			y1.rotateY(Math.PI/2)
			scene.add(y1)

			var y2 = createBoxMesh3(0xabcd00,1,40,180)
			y2.position.set(70,0,-190)
			y2.rotateY(Math.PI/2)
			scene.add(y2)

			var y3 = createBoxMesh3(0xabcd00,1,40,180)
			y3.position.set(110,0,-150)
			y3.rotateY(Math.PI/2)
			scene.add(y3)

			var y4 = createBoxMesh3(0xabcd00,1,40,40)
			y4.position.set(200,0,-170)
			scene.add(y4)

			var y5 = createBoxMesh3(0xabcd00,1,40,40)
			y5.position.set(-20,0,-210)
			scene.add(y5)

			var y6 = createBoxMesh3(0xabcd00,1,40,40)
			y6.position.set(-20,0,-120)
			scene.add(y6)

			var y7 = createBoxMesh3(0xabcd00,1,40,40)
			y7.position.set(200,0,-80)
			scene.add(y7)

			var y8 = createBoxMesh3(0xabcd00,1,40,220)
			y8.position.set(90,0,-60)
			y8.rotateY(Math.PI/2)
			scene.add(y8)



			var l1 = createBoxMesh3(0x00abcd,1,40,220)
			l1.position.set(-90,0,100)
			l1.rotateY(Math.PI/2)
			scene.add(l1)

			var l2 = createBoxMesh3(0x00abcd,1,40,180)
			l2.position.set(-70,0,190)
			l2.rotateY(Math.PI/2)
			scene.add(l2)

			var l3 = createBoxMesh3(0x00abcd,1,40,180)
			l3.position.set(-110,0,150)
			l3.rotateY(Math.PI/2)
			scene.add(l3)

			var l4 = createBoxMesh3(0x00abcd,1,40,40)
			l4.position.set(-200,0,170)
			scene.add(l4)

			var l5 = createBoxMesh3(0x00abcd,1,40,40)
			l5.position.set(20,0,210)
			scene.add(l5)

			var l6 = createBoxMesh3(0x00abcd,1,40,40)
			l6.position.set(20,0,120)
			scene.add(l6)

			var l7 = createBoxMesh3(0x00abcd,1,40,40)
			l7.position.set(-200,0,80)
			scene.add(l7)

			var l8 = createBoxMesh3(0x00abcd,1,40,220)
			l8.position.set(-90,0,60)
			l8.rotateY(Math.PI/2)
			scene.add(l8)



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
		return Math.random()*n
	}

	function addBalls(){
		var numBalls = 20


		for(i=0; i<numBalls; i++){
			var ball = createBall()
			if(i >= 15){
				ball.position.set(randN(180),5,randN(180))
			}
			else if(i >= 10 && i< 15){
				ball.position.set(randN(-180),5,randN(-180))
			}
			else if(i >= 5 && i< 10){
				ball.position.set(randN(-180),5,randN(180))
			}
			else{
				ball.position.set(randN(180),5,randN(-180))
			}
			scene.add(ball)

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						avatar.scale.x/=1.05
						avatar.scale.y/=1.05
						avatar.scale.z/=1.05
						soundEffect('sound/good.wav')
						gameState.health--
						if(gameState.health==0){
							gameState.scene='youlose'
						}
						this.position.y = this.position.y - 100
						this.__dirtyPosition = true
					}
				}
			)
		}
	}


		function initSuzanneJSON(){
			//load the monkey avatar into the scene, and add a Physics mesh and camera
			var loader = new THREE.JSONLoader()
			loader.load("../models/suzanne.json",
						function ( geometry, materials ) {
							console.log("loading suzanne")
							var material = //materials[ 0 ]
							new THREE.MeshLambertMaterial( { color: 0x00ff00 } )
							//geometry.scale.set(0.5,0.5,0.5)
							suzanne = new Physijs.BoxMesh( geometry, material )

							avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 )
							gameState.camera = avatarCam

							avatarCam.position.set(0,6,-15)
							avatarCam.lookAt(0,4,10)
							suzanne.add(avatarCam)
							suzanne.position.set(-40,20,-40)
							suzanne.castShadow = true
							suzanne.scale.set(2, 2, 2)
							scene.add( suzanne  )
							avatar=suzanne
						},
						function(xhr){
							console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ) },
						function(err){console.log("error in loading: "+err) }
					)
		}

	function addCoins(){
		var numCoins = 20

		for(i=0; i<numCoins; i++){
			var coin = createCoin()
			if(i > 15){
				coin.position.set(randN(180),3,randN(180))
			}
			else if(i >= 10 && i<= 15){
				coin.position.set(randN(-180),3,randN(180))
			}
			else if(i >= 5 && i< 10){
				coin.position.set(randN(180),3,randN(-180))
			}
			else{
				coin.position.set(randN(-180),3,randN(-180))
			}

			scene.add(coin)

			coin.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						soundEffect('sound/good.wav')
						gameState.money ++
						this.position.y = this.position.y - 100
						this.__dirtyPosition = true
					}
				}
			)
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener()
		camera.add( listener )

		// create a global audio source
		var sound = new THREE.Audio( listener )

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader()
		audioLoader.load( 'sound/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer )
			sound.setLoop( true )
			sound.setVolume( 0.05 )
			sound.play()
		})
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener()
		camera.add( listener )

		// create a global audio source
		var sound = new THREE.Audio( listener )

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader()
		audioLoader.load( file, function( buffer ) {
			sound.setBuffer( buffer )
			sound.setLoop( false )
			sound.setVolume( 0.5 )
			sound.play()
		})
	}


	function initScene(){
    var scene = new Physijs.Scene()
		return scene
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js'
    Physijs.scripts.ammo = '/js/ammo.js'
  }

	function initRenderer(){
		renderer = new THREE.WebGLRenderer()
		renderer.setSize( window.innerWidth, window.innerHeight-50 )
		document.body.appendChild( renderer.domElement )
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
	}


	function createPointLight(){
		var light
		light = new THREE.PointLight( 0xffffff)
		light.castShadow = true
		light.shadow.mapSize.width = 2048   // default
		light.shadow.mapSize.height = 2048  // default
		light.shadow.camera.near = 0.5        // default
		light.shadow.camera.far = 500      // default
		return light
	}



	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1)
		var material = new THREE.MeshLambertMaterial( { color: color} )
		mesh = new Physijs.BoxMesh( geometry, material )
		mesh.castShadow = true
		return mesh
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d)
		var material = new THREE.MeshLambertMaterial( { color: color} )
		mesh = new Physijs.BoxMesh( geometry, material )
		//mesh = new Physijs.BoxMesh( geometry, material,0 )
		mesh.castShadow = true
		return mesh
	}

	function createBoxMesh3(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d)
		var material = new THREE.MeshLambertMaterial( { color: color} )
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05)
		//mesh = new THREE.Mesh( geometry, material )
		mesh = new Physijs.BoxMesh( geometry, pmaterial,0 )
		mesh.castShadow = true
		return mesh
	}


	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 500, 500 )
		var texture = new THREE.TextureLoader().load( image )
		texture.wrapS = THREE.RepeatWrapping
		texture.wrapT = THREE.RepeatWrapping
		texture.repeat.set( 20, 20 )
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} )
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05)
		//var mesh = new THREE.Mesh( geometry, material )
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 )

		mesh.receiveShadow = true

		mesh.rotateX(Math.PI/2)
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 300, 300, 300 )
		var texture = new THREE.TextureLoader().load(image )
		texture.wrapS = THREE.RepeatWrapping
		texture.wrapT = THREE.RepeatWrapping
		texture.repeat.set( k, k )
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} )
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5)
		//var mesh = new THREE.Mesh( geometry, material )
		var mesh = new THREE.Mesh( geometry, material, 0 )

		mesh.receiveShadow = false


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}
	function createSkyBox2(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.BoxGeometry( 300, 3, 300 )
		var texture = new THREE.TextureLoader().load(image )
		texture.wrapS = THREE.RepeatWrapping
		texture.wrapT = THREE.RepeatWrapping
		//texture.repeat.set( k, k )
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} )
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5)
		//var mesh = new THREE.Mesh( geometry, material )
		var mesh = new THREE.Mesh( geometry, material, 0 )

		mesh.receiveShadow = false


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}

	function createBall(){
		var geometry = new THREE.SphereGeometry( 2, 20, 20)
		//var geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 32 )
		var material = new THREE.MeshLambertMaterial( { color: 0x228b22} )
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95)
    var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0.00001 )
		mesh.setDamping(0.1,0.1)
		mesh.castShadow = true
		return mesh
	}

	function createRedBall(){
		var geometry = new THREE.SphereGeometry( 2, 20, 20)
		var material = new THREE.MeshLambertMaterial( { color: 0xff0000} )
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95)
    var mesh = new Physijs.BoxMesh( geometry, pmaterial )
		mesh.setDamping(0.1,0.1)
		mesh.castShadow = true
		return mesh
	}

	function createCoin(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20)
		var geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 32 )
		var material = new THREE.MeshLambertMaterial( { color: 0xDAA520} )
		var pmaterial = new Physijs.createMaterial(material,0.1, 0)
    var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 )
		mesh.setDamping(0.1,0.1)
		mesh.castShadow = true
		mesh.rotateX(Math.PI/2)
		return mesh
	}

	var clock

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock()
			clock.start()

			window.addEventListener( 'keydown', keydown)
			window.addEventListener( 'keyup',   keyup )
  }

	function keydown(event){
		console.log("Keydown: '"+event.key+"'")
		// first we handle the "play again" key in the "youwon" scene
		if (gameState.scene == 'start' && event.key=='p') {
			gameState.scene = 'main'
			gameState.money = 0
			addBalls()
			addCoins()
			return
		}
		if (gameState.scene == 'youwon' && event.key=='r') {
			gameState.scene = 'main'
			gameState.money = 0
			avatar.__dirtyPosition = true
			avatar.position.set(-40,20,-40)
			redball.__dirtyPosition = true
			redball.position.set(randN(180),5,randN(180))
			addBalls()
			addCoins()
			return
		}

		if (gameState.scene == 'youlose' && event.key=='r') {
			gameState.scene = 'main'
			gameState.money = 0
			gameState.health = 10
			avatar.position.set(0,0,0)
			avatar.__dirtyPosition = true
			redball.__dirtyPosition = true
			redball.position.set(randN(180),5,randN(180))
			npc = createBoxMesh2(0xffffff,4,4,4)
			npc1 = createBoxMesh2(0xffffff,4,4,4)
			npc2 = createBoxMesh2(0xffffff,4,4,4)
			npc3 = createBoxMesh2(0xffffff,4,4,4)
			addBalls()
			addCoins()
			return
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;   break
			case "s": controls.bwd = true;  break
			case "a": controls.left = true;  break
			case "d": controls.right = true;  break
			case "m":
			  if(gameState.money >= 5){
					controls.speed = 30
					gameState.money -= 5
				}
				break
      case "h": controls.reset = true;  break

			// switch cameras
			case "1": gameState.camera = camera;  break
			case "2": gameState.camera = avatarCam;  break
      case "3": gameState.camera = edgeCam;  break

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1); break
			case "ArrowRight": avatarCam.translateY(-1); break
			case "ArrowUp": avatarCam.translateZ(-1); break
			case "ArrowDown": avatarCam.translateZ(1); break
			case "q": avatarCam.rotateY(0.01);  break
			case "e": avatarCam.rotateY(-0.01);  break

		}

	}

	function keyup(event){
		switch (event.key){
			case "w": controls.fwd   = false;   break
			case "s": controls.bwd   = false;  break
			case "a": controls.left  = false;  break
			case "d": controls.right = false;  break
			case "m": controls.speed = 10;  break
      case "h": controls.reset = false;  break
		}
	}

	function updateNPC(){
		if(Math.pow(npc.position.x-avatar.position.x,2)+Math.pow(npc.position.z-avatar.position.z,2)<10000){
			npc.lookAt(avatar.position)
			npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(10))
		}
	}

	function updateNPC1(){
		if(Math.pow(npc1.position.x-avatar.position.x,2)+Math.pow(npc1.position.z-avatar.position.z,2)<10000){
			npc1.lookAt(avatar.position)
			npc1.setLinearVelocity(npc1.getWorldDirection().multiplyScalar(10))
		}
	}

	function updateNPC2(){
		if(Math.pow(npc2.position.x-avatar.position.x,2)+Math.pow(npc2.position.z-avatar.position.z,2)<10000){
			npc2.lookAt(avatar.position)
			npc2.setLinearVelocity(npc2.getWorldDirection().multiplyScalar(10))
		}
	}

	function updateNPC3(){
		if(Math.pow(npc3.position.x-avatar.position.x,2)+Math.pow(npc3.position.z-avatar.position.z,2)<10000){
			npc3.lookAt(avatar.position)
			npc3.setLinearVelocity(npc3.getWorldDirection().multiplyScalar(10))
		}
	}

  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection()

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed))
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed))
		} else {
			var velocity = avatar.getLinearVelocity()
			velocity.x=velocity.z=0
			avatar.setLinearVelocity(velocity)  //stop the xz motion
		}

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0))
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0))
		}

    if (controls.reset){
      avatar.__dirtyPosition = true
			avatar.__dirtyRotation = true
      avatar.position.set(40,10,40)
			avatar.rotation.set(0, 0, 0)
    }

	}
	function createStartScene(){
			startScene = initScene()
			startText = createSkyBox2('image/p1.png',10)
			startScene.add(startText)
			var light1 = createPointLight()
			light1.position.set(0,200,0)
			startScene.add(light1)
			startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 )
			startCamera.position.set(0,150,0)
			startCamera.lookAt(0,0,0)

		}


	function animate() {

		requestAnimationFrame( animate )

		switch(gameState.scene) {

			case "start":
				renderer.render( startScene, startCamera )
				break
			case "youwon":
				renderer.render( endScene, endCamera )
				break

			case "youlose":
				renderer.render( endScene1, endCamera1 )
				break

			case "main":
				updateAvatar()
				updateNPC()
				updateNPC1()
				updateNPC2()
				updateNPC3()
				edgeCam.position.set(0,4,0)
				edgeCam.translateY(10)
				edgeCam.translateZ(30)
        edgeCam.lookAt(0,4,45)
				scene.add(edgeCam)
				avatar.add(edgeCam)
	    	scene.simulate()
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera )
				}
				break

			default:
			  console.log("don't know the scene "+gameState.scene)

		}

		//draw heads up display ..
	  var info = document.getElementById("info")
		info.innerHTML='<div style="font-size:24pt">money: '
    + gameState.money
    + " health="+gameState.health
    + '</div>'
	}
