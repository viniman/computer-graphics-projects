import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// create a cube
var cubeGeometry1 = new THREE.BoxGeometry(2, 2, 2);
var cubeGeometry2 = new THREE.BoxGeometry(5, 5, 5);
var cubeGeometry3 = new THREE.BoxGeometry(7, 7, 7);
var cubeMaterial = new THREE.MeshNormalMaterial();
var cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial);
var cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial);
var cube3 = new THREE.Mesh(cubeGeometry3, cubeMaterial);

// position the cube
cube1.position.set(-5.5, 7.0, 1.0);
// add the cube to the scene
scene.add(cube1);

// position the cube
cube2.position.set(-4.5, -5.0, 2.5);
// add the cube to the scene
scene.add(cube2);

// position the cube
cube3.position.set(6.5, 3.0, 3.5);
// add the cube to the scene
scene.add(cube3);

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}