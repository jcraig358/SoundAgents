var qtree;
var agentsPerQTree = 8;
const agentsPerQTreeIeal = 8;
var qtreeDepth = 0;
var minQTreeDepth;
var cohRange = 30;

let num_agents = 500;
let curr_millis = 0;
let agents = [];


let frate = 0;

let cnv; //Canvas
let music; //music file
let musicToggle;

let fft;
let osc;

var sldLowMed, sldMedHigh;
//-----------------------------------------------------------------------------
function preload(){
  music = loadSound('levels.mp3');
  musicToggle = false;
}
//-----------------------------------------------------------------------------
function setup() {
  cnv = createCanvas(windowWidth, windowHeight*0.95);
  cnv.mousePressed(toggleSound);

  fft = new p5.FFT(0, 1024);

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
  frameRate(60);
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
  text("MinQTreeDepth: "+minQTreeDepth +"; Depth: "+qtreeDepth+ "; AgentsPerQuad: "+agentsPerQTree+ "; cohRange: "+cohRange, 30, 10);
  // if(qtreeDepth > minQTreeDepth){
  //   agentsPerQTree++;
  // }
  // else if(qtreeDepth < minQTreeDepth){
  //   agentsPerQTree--;
  // }
  //
  // if(agentsPerQTree > agentsPerQTreeIeal){
  //   cohRange = max(cohRange-1, 5);
  // }
  // else if(agentsPerQTree < agentsPerQTreeIeal){
  //   cohRange = min(cohRange+1, 30);
  // }

  //Get Amplitudes / ASC multipliers
  let ascVector;
  if(music != null && music.isPlaying()){
    ascVector = getAmplitudes();
  }
  else {
    ascVector = createVector(1.5,1.0,1.0);
  }
  text("Med-Ali: "+ nf(ascVector.y,2,3) + "\nLow-Sep: " + nf(ascVector.x,2,3) + "\nHigh-Coh: " + nf(ascVector.z,2,3), 10, 50);

  //Run agents------------------
  var velMult = 1;
  if(frameRate()){velMult = 60 / frameRate()};
  rectMode(CENTER);
  for(a of agents){
    a.run(qtree, ascVector, velMult, cohRange);
  }
  //----------------------------

  //Draw QTree boundaries
  qtree.show();

  //Draw framerate
  if(millis() > curr_millis + 1000){
    curr_millis = millis();
    frate = frameRate();
  }
  text(nf(frate,2,0), 10, 30);

  if(musicToggle){
    text("PLAYING", width-150, 30);
    if(music.isPlaying()){
      text("YES IT IS", width-150, 70)
    }
  }
}

function toggleSound(){
  musicToggle = !musicToggle;
  if(musicToggle){
    userStartAudio();
    //music = loadSound('rainbow.mp3',loaded);
    fft = new p5.FFT();
    music.play();
  }
  else{
    music.stop();
  }
}

function loaded(){
  music.play();
}
