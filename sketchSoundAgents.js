var qtree;
var agentsPerQTree = 8;
const agentsPerQTreeIeal = 8;
var qtreeDepth = 0;
var minQTreeDepth;

let num_agents = 0;
let startAgentDensity = 0.0002;
var maxSpeedBase = 3.0;
var maxForceBase = 0.1;
var rangeBase = 30.0;
var sizeBase = 5.0;
var sizeMult = 1.0;

let curr_millis = 0;
let agents = [];

let frate = 0;

let cnv; //Canvas
let music1, music2, music3, activeMusic; //music file
let musicToggle;

let fft;
let amp;
let osc;

//-----------------------------------------------------------------------------
function preload(){
  music1 = loadSound('Singularity.mp3');
  music1.onended(() => musicEnded(this));
  music2 = loadSound('Solarium.mp3');
  music2.onended(() => musicEnded(this));
  music3 = loadSound('Flocking.mp3');
  music3.onended(() => musicEnded(this));
  musicToggle = false;

  createUI(); //ui.js
}
//-----------------------------------------------------------------------------
function setup() {
  fft = new p5.FFT(0.5, 1024);
  amp = new p5.Amplitude(0.8);

  frameRate(60);

  generateCanvas();
  divCanvas = select('#divCanvas');
  cnv.parent(divCanvas);
}
//-----------------------------------------------------------------------------
function draw() {
  background(0);

  //Buid QTree
  qtreeDepth = 0;
  qtree = new QTree(new Boundary(width/2, height/2, width, height), agentsPerQTree);
  for(a of agents){
    qtree.insert(a);
  }
  fill(255);
  text("MinQTreeDepth: "+minQTreeDepth +"; Depth: "+qtreeDepth+ "; AgentsPerQuad: "+agentsPerQTree, 30, 10);
  // if(qtreeDepth > minQTreeDepth){
  //   agentsPerQTree++;
  // }
  // else if(qtreeDepth < minQTreeDepth){
  //   agentsPerQTree--;
  // }

  //Get Amplitudes / ASC multipliers
  let ascVector;
  if(activeMusic != null && activeMusic.isPlaying()){
    ascVector = getAmplitudes();
  }
  else {
    ascVector = createVector(1.5,1.0,1.0);
  }
  fill(255);
  text("Med-Ali: "+ nf(ascVector.y,2,3) + "\nLow-Sep: " + nf(ascVector.x,2,3) + "\nHigh-Coh: " + nf(ascVector.z,2,3), 10, 50);

  //Run agents------------------
  var velMult = 1;
  if(frameRate()){velMult = 60 / frameRate()};
  rectMode(CENTER);
  let maxSpeed = maxSpeedBase * velMult * pow(sizeMult,0.75);
  let maxForce = maxForceBase * pow(velMult, 1.5);
  let range = rangeBase * sizeMult;
  let size = sizeBase * sizeMult;
  text("VelMult: " + nf(velMult, 1, 3) + "; MaxForce: "+ nf(maxForce,1,3) + "; SizeMult: "+nf(sizeMult,1,2), 30, 100);
  for(a of agents){
    a.run(qtree, ascVector, maxSpeed, maxForce, range, size);
  }
  //----------------------------

  //Draw QTree boundaries
  if(cbxShowQTree.checked()){ qtree.show(); }

  //Draw framerate
  if(millis() > curr_millis + 1000){
    curr_millis = millis();
    frate = frameRate();
  }
  text(nf(frate,2,0), 10, 30);

  if(musicToggle){
    text("PLAYING", width-150, 30);
    if(activeMusic.isPlaying()){
      text("YES IT IS", width-150, 70)
    }
  }
}
//------------------------------------------------------------------------------
function toggleSound(){
  musicToggle = !musicToggle;
  if(musicToggle){
    userStartAudio();
    //music = loadSound('rainbow.mp3',loaded);
    //fft = new p5.FFT();
    music.play();
  }
  else{
    music.stop();
  }
}
//------------------------------------------------------------------------------
function toggleMusic(music){
  if(activeMusic == null || !activeMusic.isPlaying()){
    userStartAudio();
    activeMusic = music;
    activeMusic.play();
    musicToggle = true;
  }
  else if(activeMusic.isPlaying()){
    activeMusic.stop();
    musicToggle = false;
    activeMusic = music;
    activeMusic.play();
    musicToggle = true;
  }
}
//------------------------------------------------------------------------------
function loaded(){
  music.play();
}
//------------------------------------------------------------------------------
function musicEnded(btn){
}
//------------------------------------------------------------------------------
function generateCanvas(){
  if(cnv == null){
    cnv = createCanvas(windowWidth, windowHeight - uiHeight - windowHeight*0.01);
  }
  else {
    resizeCanvas(windowWidth, windowHeight - uiHeight - windowHeight*0.01);
  }
  //cnv.mousePressed(toggleSound);

  ResizeSliders();

  num_agents = round(sldAgentDensity.value()*width*height);
  lblNumAgents.html("Agents: " + num_agents);

  agents = [];
  for(let i=0; i<num_agents; i++){
    agents.push(new Agent(i));
  }

  //Determine ideal QTree depth in uniform agent density.
  //1) Determine number of quads; 2) Find lowest pow4 greater than quads; 3) depth=log4(lowPow4)
  let min_quads = num_agents / agentsPerQTree;
  minQTreeDepth = 0;
  while(pow(4, minQTreeDepth) < min_quads){
    minQTreeDepth++;
  }
  minQTreeDepth += 0;
}
//------------------------------------------------------------------------------
function windowResized(){
  generateCanvas();
}
