import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        initDefaultLighting,
        onWindowResize, 
        degreesToRadians, 
        lightFollowingCamera} from "../libs/util/util.js";

        
var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(7, 7, 7)); // Init camera in this position
var light  = initDefaultLighting(scene, new THREE.Vector3(7, 7, 7));
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Set angles of rotation
var angle = [-1.57, 0, 0, 0, 0]; // In degreesToRadians

// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var s1 = createSphere();
scene.add(s1);

var c1 = createCylinder();
s1.add(c1);

var s2 = createSphere();
c1.add(s2);

var c2 = createCylinder();
s2.add(c2);

var s3 = createSphere();
c2.add(s3);

var c3 = createCylinder();
s3.add(c3);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();

function createSphere()
{
  var sphereGeometry = new THREE.SphereGeometry(0.17, 32, 32);
  var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(200,200,200)'} );
  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  return sphere;
}

function createCylinder()
{
  var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
  var cylinderMaterial = new THREE.MeshPhongMaterial( {color:'rgb(170,50,200)'} );
  var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  return cylinder;
}

function rotateCylinder()
{
  // More info:
  // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
  c1.matrixAutoUpdate = false;
  s2.matrixAutoUpdate = false;
  c2.matrixAutoUpdate = false;
  s3.matrixAutoUpdate = false;
  c3.matrixAutoUpdate = false;

  var mat4 = new THREE.Matrix4();

  // resetting matrices
  c1.matrix.identity();
  s2.matrix.identity();
  c2.matrix.identity();
  s3.matrix.identity();
  c3.matrix.identity();

  // Will execute T1 and then R1
  c1.matrix.multiply(mat4.makeRotationZ(angle[0])); // R1
  c1.matrix.multiply(mat4.makeRotationY(angle[3])); // R1
  c1.matrix.multiply(mat4.makeRotationX(angle[4])); // R1
  c1.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1
  
  // Just need to translate the sphere to the right position
  s2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

  // Will execute T2 and then R2
  c2.matrix.multiply(mat4.makeRotationZ(angle[1])); // R2
  c2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T2

  // Just need to translate the sphere to the right position
  s3.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

  // Will execute T2 and then R2
  c3.matrix.multiply(mat4.makeRotationZ(angle[2])); // R2
  c3.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T2

  
}

function buildInterface()
{
  var controls = new function ()
  {
    this.joint1_z = 270;
    this.joint2 = 0;
    this.joint3 = 0;
    this.joint1_y = 0
    this.joint1_x = 0

    this.rotate = function(){
      angle[0] = degreesToRadians(this.joint1_z);
      angle[1] = degreesToRadians(this.joint2);
      angle[2] = degreesToRadians(this.joint3);
      angle[3] = degreesToRadians(this.joint1_y);
      angle[4] = degreesToRadians(this.joint1_x);
      rotateCylinder();
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'joint1_z', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("First Joint Z");
  gui.add(controls, 'joint1_y', 0, 360)
  .onChange(function(e) { controls.rotate() })
  .name("First Joint X");
  gui.add(controls, 'joint1_x', 0, 360)
  .onChange(function(e) { controls.rotate() })
  .name("First Joint Y");
  gui.add(controls, 'joint2', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("Second Joint");
  gui.add(controls, 'joint3', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("Third Joint");
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  rotateCylinder();
  lightFollowingCamera(light, camera);
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
