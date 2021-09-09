var sldLowMed, sldMedHigh, sldAgentDensity, sldAgentSize;
var lblNumAgents, lblAgentSize;
var cbxSubAmp, cbxShowQTree, cbxShowSpectrum, cbxMic;
var btnMusic1, btnMusic2, btnMusic3, btnPause;
var divUI, divFreqSld, divOptionCbx, divMusicBtn;

var uiHeight;

function createUI(){
  divUI = select("#divUI")
  divFreqSld = select('#divFreqSld');
  let divOptionCbx1 = select('#divOptionCbx1');
  let divOptionCbx2 = select('#divOptionCbx2');
  let divOptionCbx3 = select('#divOptionCbx3');
  divMusicBtn = select('#divMusicBtn');

  sldLowMed = createSlider(0,1,0.20,0.005);
  sldLowMed.parent(divFreqSld);
  sldMedHigh = createSlider(0,1,0.50,0.005);
  sldMedHigh.parent(divFreqSld);

  cbxSubAmp = createCheckbox('Subtract Amplitude', true);
  cbxSubAmp.style('color', 'white');
  cbxSubAmp.parent(createDiv().parent(divOptionCbx1));
  cbxShowQTree = createCheckbox('QTree Bounds', false);
  cbxShowQTree.style('color', 'white');
  cbxShowQTree.parent(divOptionCbx2);
  cbxShowSpectrum = createCheckbox('Spectrum', true);
  cbxShowSpectrum.style('color', 'white');
  cbxShowSpectrum.parent(divOptionCbx3);
  cbxMic = createCheckbox('Mic', false);
  cbxMic.parent(divUI);
  cbxMic.changed(toggleMic);
  cbxMic.style('color', 'white');
  cbxMic.hide(); //Mic is currently not working

  btnMusic1 = createButton('Music1');
  btnMusic1.mousePressed(() => toggleMusic(music1));
  btnMusic1.parent(divMusicBtn);
  btnMusic2 = createButton('Music2');
  btnMusic2.mousePressed(() => toggleMusic(music2));
  btnMusic2.parent(divMusicBtn);
  btnMusic3 = createButton('Music3');
  btnMusic3.mousePressed(() => toggleMusic(music3));
  btnMusic3.parent(divMusicBtn);
  btnPause = createButton('Pause');
  btnPause.mousePressed(() => {if(activeMusic.isPlaying()){activeMusic.pause();}
                               else if(activeMusic.isPaused()){activeMusic.play();}});
  btnPause.parent(divMusicBtn);

  sldAgentDensity = createSlider(0.00001, 0.00100, 0.0002, 0);
  sldAgentDensity.parent(select('#divAgentSld'));
  sldAgentDensity.size(250, 20);
  sldAgentDensity.input(SldAgentDensityInput);
  lblNumAgents = createP("Agents: " + num_agents);
  lblNumAgents.parent(select('#divAgentLbl'));
  lblNumAgents.style('margin', '0px');
  lblNumAgents.style('color', 'white');

  sldAgentSize = createSlider(0.25, 5.0, 1.0, 0);
  sldAgentSize.parent(select('#divSizeSld'));
  sldAgentSize.size(250, 20);
  sldAgentSize.input(SldAgentSizeInput);
  lblAgentSize = createP("Size: " + nf(sldAgentSize.value(),1,2));
  lblAgentSize.parent(select('#divSizeLbl'));
  lblAgentSize.style('margin', '0px');
  lblAgentSize.style('color', 'white');

  uiHeight = parseInt(divUI.style('height'));
}
//------------------------------------------------------------------------------
function SldAgentDensityInput(){
  //Determine desired number of agents
  let desiredNum = round(sldAgentDensity.value() * width * height);

  //Add/remove agents until desired number is reached
  while(num_agents != desiredNum){
    if(num_agents > desiredNum){
      num_agents--;
      agents.pop();
    }
    else{
      num_agents++;
      agents.push(new Agent(num_agents));
    }
    lblNumAgents.html("Agents: " + num_agents);
  }
  MinQTreeDepth();
}
//------------------------------------------------------------------------------
function SldAgentSizeInput(){
  sizeMult = sldAgentSize.value();
  lblAgentSize.html("Size: " + nf(sizeMult,1,2));
}
//------------------------------------------------------------------------------
function ResizeSliders(){
  sldWidth = width*0.20;
  sldAgentDensity.size(sldWidth, 20);
  sldAgentSize.size(sldWidth, 20);
  sldLowMed.size(sldWidth,20);
  sldMedHigh.size(sldWidth,20);
}
//------------------------------------------------------------------------------
function toggleMic(){
  if(cbxMic.checked() == true){
    mic.start();
    console.log("mic on " + mic.currentSource);
  }
  else{
    console.log("mic off");
    mic.stop();
  }
}
//------------------------------------------------------------------------------
function selectSource(deviceList){
  mic.selectSource(deviceList[0]);
  console.log(deviceList[0].deviceId);
}
