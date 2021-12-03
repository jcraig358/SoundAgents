var sldAgentDensity, sldAgentSize, sldFreqs;
var selSAC;
var lblNumAgents, lblAgentSize, lblSep, lblAli, lblCoh;
var cbxSubAmp, cbxShowQTree, cbxShowSpectrum, cbxFollow, cbxMic;
var btnMusic1, btnMusic2, btnMusic3, btnPause, btnInfo, btnReset;
var divUI, divFreqSld, divOptionCbx, divMusicBtn;

var uiHeight;

const defaultDensity = 0.0002;
const defaultSize = 1.0;
var defaultLowMed, defaultMedHi;

function createUI(){
  divUI = select("#divUI")
  divFreqSld = select('#divFreqSld');
  let divOptionCbx1 = select('#divOptionCbx1');
  let divOptionCbx2 = select('#divOptionCbx2');
  let divOptionCbx3 = select('#divOptionCbx3');
  let divOptionCbx4 = select('#divOptionCbx4');
  divMusicBtn = select('#divMusicBtn');

  cbxFollow = createCheckbox('Follow Agent-0', true);
  cbxFollow.class('checkbox');
  cbxFollow.parent(divOptionCbx1);
  cbxShowQTree = createCheckbox('Show QTree', false);
  cbxShowQTree.class('checkbox');
  cbxShowQTree.parent(divOptionCbx2);
  cbxShowSpectrum = createCheckbox('Spectrum', true);
  cbxShowSpectrum.class('checkbox');
  cbxShowSpectrum.parent(divOptionCbx3);
  cbxSubAmp = createCheckbox('Sub Amplitude', true);
  cbxSubAmp.class('checkbox');
  cbxSubAmp.parent(divOptionCbx4);
  cbxMic = createCheckbox('Mic', false);
  cbxMic.parent(divUI);
  cbxMic.changed(toggleMic);
  cbxMic.class('checkbox');
  cbxMic.hide(); //Mic is currently not working

  selSAC = [3];
  for(let i=0; i<3; i++){
    selSAC[i] = document.getElementById("selSAC"+(i+1));
    selSAC[i].selectedIndex = i;
    selSAC[i].setAttribute('onchange', 'SelSACChanged(this)');
    SelSACChanged(selSAC[i]);
  }
  lblSep = select('#lblSep');
  lblAli = select('#lblAli');
  lblCoh = select('#lblCoh');

  let buttonSize = createVector(60,20);
  let divBtnRow1 = createDiv();
  divBtnRow1.parent(divMusicBtn);
  let divBtnRow2 = createDiv();
  divBtnRow2.parent(divMusicBtn);
  let divBtnRow3 = createDiv();
  divBtnRow3.parent(divMusicBtn);

  btnMusic1 = createButton('Music1');
  btnMusic1.mouseClicked(() => toggleMusic(music[0]));
  btnMusic1.parent(divBtnRow1);
  btnMusic1.style('margin', '2px');
  btnMusic1.size(buttonSize.x, buttonSize.y);

  btnMusic2 = createButton('Music2');
  btnMusic2.mouseClicked(() => toggleMusic(music[1]));
  btnMusic2.parent(divBtnRow1);
  btnMusic2.style('margin', '2px');
  btnMusic2.size(buttonSize.x, buttonSize.y);

  btnMusic3 = createButton('Music3');
  btnMusic3.mouseClicked(() => toggleMusic(music[2]));
  btnMusic3.parent(divBtnRow1);
  btnMusic3.style('margin', '2px');
  btnMusic3.size(buttonSize.x, buttonSize.y);

  btnMusic4 = createButton('Music4');
  btnMusic4.mouseClicked(() => toggleMusic(music[3]));
  btnMusic4.parent(divBtnRow2);
  btnMusic4.style('margin', '2px');
  btnMusic4.size(buttonSize.x, buttonSize.y);

  btnMusic5 = createButton('Music5');
  btnMusic5.mouseClicked(() => toggleMusic(music[4]));
  btnMusic5.parent(divBtnRow2);
  btnMusic5.style('margin', '2px');
  btnMusic5.size(buttonSize.x, buttonSize.y);

  btnMusic6 = createButton('Music6');
  btnMusic6.mouseClicked(() => toggleMusic(music[5]));
  btnMusic6.parent(divBtnRow2);
  btnMusic6.style('margin', '2px');
  btnMusic6.size(buttonSize.x, buttonSize.y);

  btnPause = createButton('Pause');
  btnPause.mouseClicked(() => {if(activeMusic.isPlaying()){activeMusic.pause();}
                               else if(activeMusic.isPaused()){activeMusic.play();}});
  btnPause.parent(divBtnRow3);
  btnPause.style('margin', '2px');
  btnPause.size(buttonSize.x, buttonSize.y);

  btnInfo = createButton('Info');
  btnInfo.mouseClicked(() => {if(!infoActive){showInfoUI();}
                              else {hideInfoUI();}});
  btnInfo.parent(divBtnRow3);
  btnInfo.style('margin', '2px');
  btnInfo.size(buttonSize.x, buttonSize.y);

  btnReset = createButton('Reset');
  btnReset.mouseClicked(() => { resetSliders();
                                generateCanvas()});
  btnReset.parent(divBtnRow3);
  btnReset.style('margin', '2px');
  btnReset.size(buttonSize.x, buttonSize.y);

  sldAgentDensity = createSlider(0.00001, 0.00100, defaultDensity, 0);
  sldAgentDensity.parent(select('#divAgentSld'));
  sldAgentDensity.size(250, 20);
  sldAgentDensity.input(SldAgentDensityInput);
  lblNumAgents = createP("Agents: " + num_agents);
  lblNumAgents.parent(select('#divAgentLbl'));
  lblNumAgents.style('margin', '0px');
  lblNumAgents.style('color', 'white');

  sldAgentSize = createSlider(0.25, 5.0, defaultSize, 0);
  sldAgentSize.parent(select('#divSizeSld'));
  sldAgentSize.size(250, 20);
  sldAgentSize.input(SldAgentSizeInput);
  lblAgentSize = createP("Size: " + nf(sldAgentSize.value(),1,2));
  lblAgentSize.parent(select('#divSizeLbl'));
  lblAgentSize.style('margin', '0px');
  lblAgentSize.style('color', 'white');

  uiHeight = parseInt($("#divUI").innerHeight());

  //Pull starting freq slider values
  var defVal = $("#divFreqSld").slider("values");
  defaultLowMed = defVal[0];
  defaultMedHi = defVal[1];
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
  sldWidth = width*0.25;
  sldAgentDensity.size(sldWidth, 20);
  sldAgentSize.size(sldWidth, 20);
}
//------------------------------------------------------------------------------
function resetSliders(){
  sldAgentDensity.value(defaultDensity);
  SldAgentDensityInput();
  sldAgentSize.value(defaultSize);
  SldAgentSizeInput();
  $("#divFreqSld").slider("values",0,defaultLowMed);
  $("#divFreqSld").slider("values",1,defaultMedHi);
  if(activeMusic != null && activeMusic.isPlaying) activeMusic.pause();
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
//------------------------------------------------------------------------------
function selChanged(event){
  console.log(this.value());
}
//------------------------------------------------------------------------------
function updateUIShadow(amplitude){
  let intensity = map(amplitude, 0, 0.25, -7.5, 5)
  values = $("#divFreqSld").slider("values");
  let red = min((values[0]/33.33)*255,255);
  let green = min((values[1]-values[0])*255/33.33,255);
  let blue = min((100-values[1])*255/33.33,255);
  $("#divUI").css("box-shadow",
                  "0px -10px 10px "+ intensity +"px rgba("+ red +
                        ","+ green +
                        ","+ blue +", 0.75)");
}
//------------------------------------------------------------------------------
function updateSelSACValues(array){
  for(let i=0; i<3; i++){
    opts = selSAC[i].options;
    for(let j=0; j<3; j++){
      opts[j].setAttribute('data-value2',array[j]);
    }
  }

  result = [];
  for(let i=0; i<3; i++){
    result.push(parseFloat(selSAC[i].options[selSAC[i].selectedIndex].getAttribute('data-value2')));
  }

  return result;
}
//------------------------------------------------------------------------------
function SelSACChanged(sel){
  if(sel.value == 0){
    sel.style.backgroundColor = "rgb(200,0,0)";
    sel.style.color = "white";
  }
  else if(sel.value == 1){
    sel.style.backgroundColor = "rgb(0,200,0)";
    sel.style.color = "black";
  }
  else if(sel.value == 2){
    sel.style.backgroundColor = "rgb(0,0,200)";
    sel.style.color = "white";
  }
}
//------------------------------------------------------------------------------
function updateSACLabels(array){
  if(array == null){ return; }

  lblSep.html(nf(array[0],1,2));
  lblAli.html(nf(array[1],1,2));
  lblCoh.html(nf(array[2],1,2));
}
//------------------------------------------------------------------------------
