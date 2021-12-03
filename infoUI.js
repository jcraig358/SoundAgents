var divInfo, txtTitle, txtInfo, btnClose, infoActive;

const defaultInfoSize_x = 500;
const defaultInfoSize_y = 500;

function setupInfoUI(){
  //divInfo = select('#divInfo');
  divInfo = createDiv();
  divInfo.size(300,300);
  divInfo.style('position', 'fixed');
  // divInfo.style('display', 'grid');
  // divInfo.style('grid-template-rows', '10% 80% 10%');
  divInfo.style('z-index', '5');
  divInfo.style('background-color', 'B9B');
  divInfo.style('justify-align', 'center');
  divInfo.style('align-items', 'center');
  divInfo.style('border', 'solid');
  divInfo.style('box-shadow', '5px 10px 20px');
  divInfo.style('overflow', 'hidden');
  divInfo.style('padding', '0px');
  divInfo.style('margin', '0px');
  // divInfo.style('resize', 'both');
  // divInfo.mouseClicked(updateInfoUI);

  //Loading Text
  //txtTitle = select("#txtTitle");
  txtTitle = createP("Sound Agents");
  txtTitle.parent(divInfo);
  // txtTitle.size(divInfo.width, 40);
  // txtTitle.position(divInfo.width/2-txtTitle.width/2, 5);
  txtTitle.style('text-align', 'center');
  txtTitle.style('padding-top', '5px');
  txtTitle.style('margin', '0px');
  txtTitle.style('font-weight', 'bold');
  txtTitle.style('backgroundColor', 'rgba(50, 50, 50, 0.25');

  //Info text
  //txtInfo = select("#txtInfo");
  txtInfo = createP();
  txtInfo.parent(divInfo);
  // txtInfo.size(divInfo.width*0.8, divInfo.height*0.8);
  // txtInfo.position(divInfo.width/2-txtInfo/2, txtTitle.height);
  txtInfo.style('text-align', 'justify');
  // txtInfo.style('margin-top', '0%');
  // txtInfo.style('margin-bottom', '0%');
  txtInfo.style('padding', '15px');
  txtInfo.style('white-space', 'normal');
  txtInfo.style('overflow-y', 'scroll');

  //Close text
  //btnClose = select('#btnClose');
  btnClose = createButton("Close");
  btnClose.mouseClicked(() => hideInfoUI());
  btnClose.parent(divInfo);
  btnClose.style('margin', '0px');
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
  //Prime the storage string
  let full_str = "";

  //Pull the title and created by
  //full_str += removeLeadingHashtag(result[0]) + "<br>";
  full_str += removeLeadingHashtag(result[1]) + "<br><br>";
  result = result.slice(2);

  //Add the rest of the info text
  for(let str of result){
    //Remove any leading '#'
    if (str.charAt(0) == '#') {
      str = removeLeadingHashtag(str);
      str = "<b>" + str + "</b>";
    }
    full_str += str + "<br>";
  }
  txtInfo.html(full_str);
}
//-----------------------------------------------------------------------------
function removeLeadingHashtag(str){
  while(str.charAt(0) == '#' || str.charAt(0) == ' '){
    str = str.slice(1);
  }

  return str;
}
//-----------------------------------------------------------------------------
function updateInfoUI(event = null){
  if(event){
    console.log(event);
    console.log("\n"+divInfo.width + " x " + divInfo.height);
    txtTitle.size(divInfo.width, 25);
    txtTitle.position(divInfo.width/2-txtTitle.width/2, 0);
    txtInfo.size(divInfo.width, divInfo.height - txtTitle.height);
    txtInfo.position(divInfo.width/2-txtInfo/2, txtTitle.height);
    btnClose.position(divInfo.width/2 - btnClose.width/2, divInfo.height - btnClose.height - 15);
  }
  else{
    //Set default values for height width
    let size_y = defaultInfoSize_y;
    let size_x = defaultInfoSize_x;
    let area = size_y * size_x;
    let spacer = 100; //Space between window edge and text

    //Determine adjustments in sizing.
    if(window.width >= window.height){
      size_y = Math.min(defaultInfoSize_y, height - spacer);
      size_x = Math.min(area / size_y, width - spacer);
    }
    else{
      size_x = Math.min(defaultInfoSize_x, width - spacer);;
      size_y = Math.min(area / size_x, height - spacer);
    }

    //Set size
    txtInfo.size(size_x, size_y);
    txtTitle.size(size_x, 25);
    let total_y = txtTitle.height + txtInfo.height + btnClose.height + 25;
    divInfo.size(txtInfo.width + 20, total_y);
    divInfo.position(window.width/2 - divInfo.width/2, 15);
    txtTitle.position(divInfo.width/2-txtTitle.width/2, 5);
    txtInfo.position(divInfo.width/2-txtInfo/2, txtTitle.height);
    btnClose.position(divInfo.width/2 - btnClose.width/2, divInfo.height - btnClose.height - 10);
  }
}
