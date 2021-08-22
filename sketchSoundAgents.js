let qtree;
let num_points = 250;
let curr_millis = 0;
let agents = [];

let frate = 0;

let cnv; //Canvas
let music; //music file
let musicToggle;

let fft;

function preload(){
  music = loadSound('rainbow.mp3');
  fft = new p5.FFT();
  musicToggle = false;
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(toggleSound);


  rectMode(CENTER);

  for(let i=0; i<num_points; i++){
    agents.push(new Agent(i));
  }

  frameRate(60);
}
//-----------------------------------------------------------------------------
function draw() {
  background(0);

  //Buid QTree
  qtree = new QTree(new Boundary(width/2, height/2, width, height), 8);
  for(a of agents){
    qtree.insert(a);
  }

  //Get Amplitudes / ASC multipliers
  let ascVector;
  if(music != null && music.isPlaying()){
    ascVector = getAmplitudes();
  }
  else {
    ascVector = createVector(1.5,1.0,1.0);
  }
  text(ascVector.y + '\n' + ascVector.x + '\n' + ascVector.z, 10, 50);

  //Run agents
  for(a of agents){
    a.run(qtree, ascVector);
  }

  //Draw agents


  //Draw QTree boundaries
  //qtree.show();

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
    //fft = new p5.FFT();
    music.play();
  }
  else{
    music.stop();
  }
}

function loaded(){
  music.play();
}
