import {vec3, vec4, mat4, quat} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
import LSystem from './LSystem';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  axiom: 'FF[+F][-F][+F]X',
  expansionDepth: 3,
  angle: 135.0
};

let square: Square;
let screenQuad: ScreenQuad;
let cyl: Mesh;
let bean: Mesh;
let tree: LSystem;
let time: number = 0.0;

let currAxiom : string = 'FF[+F][-F][+F]X';
let currDepth : number = 3;
let currAngle : number = 135.0;

function loadScene() {
  // square = new Square();
  // square.create();

  screenQuad = new ScreenQuad();
  screenQuad.create();

  let obj0 : string = readTextFile('../resources/cylinder.obj');
  cyl = new Mesh(obj0, vec3.fromValues(0, 1, 0));
  cyl.create();

  // TODO -- make jellybean
  let obj1 : string = readTextFile('../resources/sphere.obj');
  bean = new Mesh(obj1, vec3.fromValues(0, 0, 0));
  bean.create();

  tree = new LSystem(controls.axiom, controls.expansionDepth, controls.angle);
  let branches : mat4[] = tree.drawBranch();
  let leaves : mat4[] = tree.drawLeaf(); // TODO: ADD THIS!

  let bOffsetArr = [];
  let bRotArr = [];
  let bScaleArr = [];
  let bColorArr = [];
  // let col1 = [];
  // let col2 = [];
  // let col3 = [];
  // let col4 = [];
  for (var i = 0; i < branches.length; ++i) {
    let curr : mat4 = branches[i];

    // let c1 : vec4 = curr[0];
    // let c2 : vec4 = curr[1];
    // let c3 : vec4 = curr[2];
    // let c4 : vec4 = curr[3];

    // for (let i = 0; i < 4; ++i) {
    //   col1.push(c1[i]);
    //   col2.push(c2[i]);
    //   col3.push(c3[i]);
    //   col4.push(c4[i]);
    // }

    let t : vec3 = vec3.create(); 
    mat4.getTranslation(t, curr);
    vec3.scale(t, t, 0.008);
  
    bOffsetArr.push(t[0]);
    bOffsetArr.push(t[1]);
    bOffsetArr.push(t[2]);

    let r : quat = quat.create();
    mat4.getRotation(r, curr);
    bRotArr.push(r[0]);
    bRotArr.push(r[1]);
    bRotArr.push(r[2]);
    bRotArr.push(r[3]);

    let s : vec3 = vec3.create();
    mat4.getScaling(s, curr);
    bScaleArr.push(s[0]);
    bScaleArr.push(s[1]);
    bScaleArr.push(s[2]);

    bColorArr.push(1.0);
    bColorArr.push(1.0);
    bColorArr.push(1.0);
    bColorArr.push(1.0); // Alpha
  }

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  // let offsetsArray = [];
  // let colorsArray = [];
  // let n: number = 100.0;
  // for(let i = 0; i < n; i++) {
  //   for(let j = 0; j < n; j++) {
  //     offsetsArray.push(i);
  //     offsetsArray.push(j);
  //     offsetsArray.push(0);

  //     colorsArray.push(i / n);
  //     colorsArray.push(j / n);
  //     colorsArray.push(1.0);
  //     colorsArray.push(1.0); // Alpha channel
  //   }
  // }
  // let offsets: Float32Array = new Float32Array(offsetsArray);
  // let colors: Float32Array = new Float32Array(colorsArray);
  // square.setInstanceVBOs(offsets, colors);
  // square.setNumInstances(n * n); // grid of "particles"
  
  let bOffsets : Float32Array = new Float32Array(bOffsetArr);
  let bRots : Float32Array = new Float32Array(bRotArr);
  let bScales : Float32Array = new Float32Array(bScaleArr);
  // let b1 : Float32Array = new Float32Array(col1);
  // let b2 : Float32Array = new Float32Array(col2);
  // let b3 : Float32Array = new Float32Array(col3);
  // let b4 : Float32Array = new Float32Array(col4);
  let bColors : Float32Array = new Float32Array(bColorArr);
  cyl.setInstanceVBOs(bOffsets, bRots, bScales, bColors);
  cyl.setNumInstances(branches.length);

  // let sOffsets : Float32Array = new Float32Array(sOffsetArr);
  // sph.setInstanceVBOs(sOffsets, sColors);
  // sph.setNumInstances(leaves.length);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'axiom');
  gui.add(controls, 'expansionDepth', 0, 5).step(1);
  gui.add(controls, 'angle', 20.0, 150.0).step(0.5);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    if (controls.axiom != currAxiom || controls.expansionDepth != currDepth || controls.angle != currAngle) {
      currAxiom = controls.axiom;
      currDepth = controls.expansionDepth;
      currAngle = controls.angle;
      loadScene();
    }
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      cyl
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
