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
let initialFiles = ['assets/dreams.mp3','assets/endlessmotion.mp3',
                    'assets/house.mp3','assets/moose.mp3',
                    'assets/popdance.mp3','assets/summer.mp3'];
let music = [];    //music files
let activeMusic;
let musicToggle;
let hideUI = false;
let totalOffset = 0;

let fft;
let amp;
let mic;

//-----------------------------------------------------------------------------
function preload(){
  soundFormats('mp3','wav');
  musicToggle = false;
  setupInfoUI();
}
//-----------------------------------------------------------------------------
function setup() {
  music = LoadingUI(initialFiles);
  ascVector = createVector(0,0,0);
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
  cnv.mousePressed(canvasClicked)
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
  // fill(255);
  // text("MinQTreeDepth: "+minQTreeDepth +"; Depth: "+qtreeDepth+ "; AgentsPerQuad: "+agentsPerQTree, 30, 10);
  // if(qtreeDepth > minQTreeDepth){
  //   agentsPerQTree++;
  // }
  // else if(qtreeDepth < minQTreeDepth){
  //   agentsPerQTree--;
  // }

  //Get Amplitudes / ASC multipliers
  var multipliers;
  if((activeMusic != null && activeMusic.isPlaying()) || cbxMic.checked()){
    let ascArray = getAmplitudes();
    multipliers = updateSelSACValues(ascArray);
    //multipliers = createVector(1.5,1.0,1.0);
  }
  else {
    multipliers = [1.5,1.0,1.0];
  }

  //fill(255);
  //text("Ali: "+ nf(multipliers[1],2,3) + "\nSep: " + nf(multipliers[0],2,3) + "\nCoh: " + nf(multipliers[2],2,3), 10, 50);

  //Run agents------------------
  var velMult = 1;
  if(frameRate()){velMult = 60 / frameRate()};
  rectMode(CENTER);
  let maxSpeed = maxSpeedBase * velMult * pow(sizeMult,0.75);
  let maxForce = maxForceBase * pow(velMult, 1.5) * sizeMult;
  let range = rangeBase * sizeMult;
  let size = sizeBase * sizeMult;
  //text("VelMult: " + nf(velMult, 1, 3) + "; MaxForce: "+ nf(maxForce,1,3) + "; SizeMult: "+nf(sizeMult,1,2), 30, 100);

  for(a of agents){
    a.run(qtree, multipliers, maxSpeed, maxForce, range, size);
  }
  //----------------------------

  //Draw QTree boundaries
  if(cbxShowQTree.checked()){ qtree.show(); }

  //Draw framerate
  if(millis() > curr_millis + 100){
    curr_millis = millis();
    //frate = frameRate();
    updateSACLabels(multipliers);
  }
  //text(nf(frate,2,0), 10, 30);

  //Draw file-hover overlay
  if(fileHover){
    background(0,200,0,75);
  }

  updateUIShadow(max(amp.getLevel(), 0))
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
  if(!hideUI){uiHeight = parseInt($("#divUI").outerHeight());}
  else{uiHeight = 0;}
  if(cnv == null){
    cnv = createCanvas(windowWidth, windowHeight - uiHeight);
  }
  else {
    resizeCanvas(windowWidth, windowHeight - uiHeight);
  }
  //cnv.mousePressed(toggleSound);

  ResizeSliders();

  num_agents = round(sldAgentDensity.value()*width*height);
  lblNumAgents.html("Agents: " + num_agents);

  agents = [];
  for(let i=0; i<num_agents; i++){
    agents.push(new Agent(i));
  }

  //MinQTreeDepth();
}
//------------------------------------------------------------------------------
function windowResized(){
  generateCanvas();
  if(infoActive){
    updateInfoUI();
  }
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
//------------------------------------------------------------------------------
function toggleUI(){
  hideUI = !hideUI;
  if(hideUI){
    divUI.hide();
    resizeCanvas(windowWidth, windowHeight);
    //generateCanvas();
  }
  else{
    divUI.show();
    resizeCanvas(windowWidth, windowHeight-uiHeight);
    //generateCanvas();
  }
}
//------------------------------------------------------------------------------
function keyTyped(){
  if(key === 'F' || key === 'f'){
    toggleUI();
  }
}
//------------------------------------------------------------------------------
function canvasClicked(){
  toggleUI();
}
//------------------------------------------------------------------------------
function mouseWheel(event){
//   if(hideUI){return false;}
//
//   totalOffset += event.delta/10;
//   totalOffset = constrain(totalOffset, 0, uiHeight);
//   resizeCanvas(windowWidth, windowHeight-uiHeight+totalOffset);
//   if(totalOffset <= 0 || totalOffset >= uiHeight){return false;}
//   divUI.style('transform', 'translateY('+event.delta/10+'px)');
//
//
//   return false; //prevent default behaviour
}
