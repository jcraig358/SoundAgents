let qtree;
let num_points = 500;
let curr_millis = 0;
let agents = [];

let frate = 0;

let cnv; //Canvas
let music; //music file
let musicToggle;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(toggleSound);
  musicToggle = false;

  rectMode(CENTER);

  for(let i=0; i<num_points; i++){
    agents.push(new Agent(i));
  }

  frameRate(60);
}

function draw() {
  background(0);

  //Buid QTree
  qtree = new QTree(new Boundary(width/2, height/2, width, height), 8);
  for(a of agents){
    qtree.insert(a);
  }

  //Run agents
  for(a of agents){
    a.run(qtree);
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
}

function toggleSound(){
  musicToggle = !musicToggle;
  if(musicToggle){
    userStartAudio();
    music = loadSound('rainbow.mp3', loaded);
  }
  else{
    music.stop();
  }
}

function loaded(){
  music.play();
}
