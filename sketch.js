// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/Pn1g1wjxl_0

var song;
var sliderRate;
var sliderPan;
var cnv;

function setup() {
  cnv = createCanvas(200, 200);
  cnv.mousePressed(startSound);
}

function loaded() {
  song.play();
}

function draw() {
  background(random(255));
}

function startSound(){
  userStartAudio();
  song = loadSound('rainbow.mp3', loaded);
}
