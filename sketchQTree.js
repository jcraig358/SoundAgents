let qtree;
let num_points = 3000;
let curr_millis = 0;
let agents = [];

let frate = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  let bounds = new Boundary(width/2, height/2, width, height);
  qtree = new QTree(bounds, 10);
  for(let i=0; i<num_points; i++){
    qtree.insert(new Agent());
  }

  agents = qtree.getAllElements(agents);
  console.log("Agent size = " + agents.length);

}

function draw() {
  background(0);
  noFill();
  stroke(255);
  strokeWeight(1);
  for(let a of agents){
    circle(a.position.x, a.position.y, 2);
  }

  qtree.show();

  if(millis() > curr_millis + 1000){
    curr_millis = millis();
    frate = frameRate();
  }
  text(nf(frate,2,0), 10, 30);
}
