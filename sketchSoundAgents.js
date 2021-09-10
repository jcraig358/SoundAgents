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
let edgeConsideration = true;

let curr_millis = 0;
let agents = [];

let frate = 0;

let cnv; //Canvas
let fileHover = false;
let initialFiles = ['Singularity.mp3','Solarium.mp3','Flocking.mp3']
let music = [];    //music files
let activeMusic;
let musicToggle;

let fft;
let amp;
let mic;

//-----------------------------------------------------------------------------
function preload(){
  soundFormats('mp3','wav');
  musicToggle = false;
}
//-----------------------------------------------------------------------------
function setup() {
  music = LoadingUI(initialFiles);
  createUI(); //ui.js
  fft = new p5.FFT(0.8, 1024);
  amp = new p5.Amplitude(0.8);
  mic = new p5.AudioIn();
  //mic.getSources(selectSource);

  frameRate(60);

  generateCanvas();
  divCanvas = select('#divCanvas');
  cnv.parent(divCanvas);
  cnv.drop(fileDrop);
  cnv.dragOver(fileOver);
  cnv.dragLeave(fileLeft);
  generateCanvas();
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
  if((activeMusic != null && activeMusic.isPlaying()) || cbxMic.checked()){
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
  let maxForce = maxForceBase * pow(velMult, 1.5) * sizeMult;
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

  //Draw file-hover overlay
  if(fileHover){
    background(0,200,0,75);
  }

  updateUIShadow(max(amp.getLevel(), 0));
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
  if(music == null || !music.isLoaded()){return;}

  if(activeMusic == null || (!activeMusic.isPlaying() && !activeMusic.isPaused())) {
    userStartAudio();
    activeMusic = music;
    activeMusic.play();
    musicToggle = true;
  }
  else if(activeMusic.isPlaying() || activeMusic.isPaused()){
    activeMusic.stop();
    musicToggle = false;
    activeMusic = music;
    activeMusic.play();
    musicToggle = true;
  }
}
//------------------------------------------------------------------------------
function soundLoaded(){
  activeMusic.play();
}
//------------------------------------------------------------------------------
function musicEnded(btn){
}
//------------------------------------------------------------------------------
function generateCanvas(){
  uiHeight = parseInt($("#divUI").innerHeight());
  if(cnv == null){
    cnv = createCanvas(windowWidth, windowHeight - uiHeight);
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

  MinQTreeDepth();
}
//------------------------------------------------------------------------------
function windowResized(){
  generateCanvas();
}
//------------------------------------------------------------------------------
function MinQTreeDepth(){
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
function fileOver(){
  fileHover = true;
}
function fileLeft(){
  fileHover = false;
}
function fileDrop(file){
  if(file.name.endsWith('.mp3') || file.name.endsWith('.wav')){
    if(activeMusic != null && (activeMusic.isPlaying() || activeMusic.isPaused())) {
      activeMusic.stop();
    }
    userStartAudio();
    activeMusic = LoadingUI(file, true)[0];
  }
  fileHover = false;
}
