/**
 * @author mrdoob / http://mrdoob.com/
 */
if(!requestAnimationFrame){
	window.requestAnimationFrame = (function(){ 
		return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame || 
			function(/* function */ callback, /* DOMElement */ element){ 
				window.setTimeout(callback, 1000 / 60); 
			}; 
	})(); 
}

function webglAvailable() {
		try {
			var canvas = document.createElement( 'canvas' );
			return !!( window.WebGLRenderingContext && (
				canvas.getContext( 'webgl' ) ||
				canvas.getContext( 'experimental-webgl' ) )
			);
		} catch ( e ) {
			return false;
		}
	}

	if ( webglAvailable() ) {
		renderer = new THREE.WebGLRenderer();
	} else {
		renderer = new THREE.CanvasRenderer();
	}

var camera, scene, renderer;

			var texture_placeholder,
			isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 90, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0,
			target = new THREE.Vector3();

			

			function init() {

				var container, mesh;

				container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );

				scene = new THREE.Scene();

				// texture

				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var texture = new THREE.Texture();

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};


				var Tloader = new THREE.ImageLoader( manager );
				Tloader.load( 'test.png', function ( image ) {

					texture.image = image;
					texture.needsUpdate = true;

				} );

				// model

				var loader = new THREE.OBJLoader( manager );
				var objArry=["house1.obj","house2.obj","house3.obj","house4.obj","house5.obj","house6.obj","house7.obj"]
				$.each(objArry,function(i,n){
					loader.load( n, function ( object ) {

					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {
							console.log(child)
							child.material=new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );;

						}

					} );

						scene.add( object.children[0] );
						console.log(scene)

					}, onProgress, onError );
				})
				


				renderer = new THREE.CanvasRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
				document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function loadTexture( path ) {

				var texture = new THREE.Texture( texture_placeholder );
				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

				var image = new Image();
				image.onload = function () {

					texture.image = this;
					texture.needsUpdate = true;

				};
				image.src = path;

				return material;

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				isUserInteracting = true;

				onPointerDownPointerX = event.clientX;
				onPointerDownPointerY = event.clientY;

				onPointerDownLon = lon;
				onPointerDownLat = lat;

			}

			function onDocumentMouseMove( event ) {

				if ( isUserInteracting === true ) {

					lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
					lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

				}
			}

			function onDocumentMouseUp( event ) {

				isUserInteracting = false;

			}

			function onDocumentMouseWheel( event ) {

				// WebKit

				if ( event.wheelDeltaY ) {

					camera.fov -= event.wheelDeltaY * 0.05;

				// Opera / Explorer 9

				} else if ( event.wheelDelta ) {

					camera.fov -= event.wheelDelta * 0.05;

				// Firefox

				} else if ( event.detail ) {

					camera.fov -= event.detail * 0.05;

				}

				camera.updateProjectionMatrix();

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					onPointerDownPointerX = event.touches[ 0 ].pageX;
					onPointerDownPointerY = event.touches[ 0 ].pageY;

					onPointerDownLon = lon;
					onPointerDownLat = lat;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
					lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

				}

			}

			function animate() {

				requestAnimationFrame( animate );
				update();

			}

			function update() {

				if ( isUserInteracting === false ) {

					lon += 0.1;

				}

				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );

				target.x = 500 * Math.sin( phi ) * Math.cos( theta );
				target.y = 500 * Math.cos( phi );
				target.z = 500 * Math.sin( phi ) * Math.sin( theta );

				camera.position.copy( target ).negate();
				camera.lookAt( target );

				renderer.render( scene, camera );

			}

			init();
			animate();