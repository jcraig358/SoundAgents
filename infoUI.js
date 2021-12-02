var divInfo, txtTitle, txtInfo, btnClose, infoActive;

function setupInfoUI(){
  //divInfo = select('#divInfo');
  divInfo = createDiv();
  divInfo.size(300,300);
  divInfo.style('position', 'fixed');
  divInfo.style('display', 'grid');
  divInfo.style('grid-template-rows', '10% 80% 10%');
  divInfo.style('z-index', '5');
  divInfo.style('background-color', 'B4B');
  divInfo.style('justify-align', 'center');
  divInfo.style('align-items', 'center');
  divInfo.style('border', 'solid');
  divInfo.style('box-shadow', '5px 10px 20px');
  divInfo.style('overflow', 'hidden');
  // divInfo.style('resize', 'both');
  // divInfo.mouseClicked(updateInfoUI);

  //Loading Text
  //txtTitle = select("#txtTitle");
  txtTitle = createP("Sound Agents");
  txtTitle.parent(divInfo);
  // txtTitle.size(divInfo.width, 40);
  // txtTitle.position(divInfo.width/2-txtTitle.width/2, 5);
  txtTitle.style('text-align', 'center');
  txtTitle.style('margin-top', '5px');
  txtTitle.style('font-weight', 'bold');

  //Info text
  //txtInfo = select("#txtInfo");
  txtInfo = createP();
  txtInfo.parent(divInfo);
  // txtInfo.size(divInfo.width*0.8, divInfo.height*0.8);
  // txtInfo.position(divInfo.width/2-txtInfo/2, txtTitle.height);
  txtInfo.style('text-align', 'justify');
  // txtInfo.style('margin-top', '0%');
  // txtInfo.style('margin-bottom', '0%');
  txtInfo.style('margin', '5px');
  txtInfo.style('white-space', 'normal');

  //Close text
  //btnClose = select('#btnClose');
  btnClose = createButton("Close");
  btnClose.mouseClicked(() => hideInfoUI());
  btnClose.parent(divInfo);
  btnClose.style('margin', '2px');
  btnClose.size(75,30);
  // btnClose.position(divInfo.width/2 - btnClose.width/2, divInfo.height - btnClose.height);

  //Hide UI
  hideInfoUI();
  loadStrings('README.md', finishedLoadingUIText, errorLoadingUIText);
  updateInfoUI();
}
//-----------------------------------------------------------------------------
function showInfoUI(){
  divInfo.show();
  updateInfoUI();
  infoActive = true;
}
//-----------------------------------------------------------------------------
function hideInfoUI(){
  divInfo.hide();
  updateInfoUI();
  infoActive = false;
}
//-----------------------------------------------------------------------------
function errorLoadingUIText(){
  console.log("Error loading txt file");
}
//-----------------------------------------------------------------------------
function finishedLoadingUIText(result){
  let full_str = "";
  for(let str of result){
    full_str += str + " ";
  }
  txtInfo.html(full_str);
}
//-----------------------------------------------------------------------------
function updateInfoUI(event = null){
  if(event){
    console.log(event);
    console.log("\n"+divInfo.width + " x " + divInfo.height);
    txtTitle.size(divInfo.width, 25);
    txtTitle.position(divInfo.width/2-txtTitle.width/2, 5);
    txtInfo.size(divInfo.width, divInfo.height - txtTitle.height);
    txtInfo.position(divInfo.width/2-txtInfo/2, txtTitle.height);
    btnClose.position(divInfo.width/2 - btnClose.width/2, divInfo.height - btnClose.height - 15);
  }
  else{
    //Set default values for height width
    let size_y = 150;
    let size_x = 300;
    let area = size_y * size_x;

    //Determine adjustments in sizing.
    if(window.width >= window.height){
      size_y = Math.min(200, height);
      size_x = Math.min(area / size_y, width);
    }
    else{
      size_x = Math.min(300, width);;
      size_y = Math.min(area / size_x, height);
    }

    //Set size
    txtInfo.size(size_x, size_y);
    txtTitle.size(size_x, 25);
    divInfo.size(txtInfo.width + 20, txtTitle.height + txtInfo.height + btnClose.height);
    divInfo.position(window.width/2 - size_x/2, 15);
    txtTitle.position(divInfo.width/2-txtTitle.width/2, 5);
    txtInfo.position(divInfo.width/2-txtInfo/2, txtTitle.height);
    btnClose.position(divInfo.width/2 - btnClose.width/2, divInfo.height - btnClose.height - 15);
  }
}
