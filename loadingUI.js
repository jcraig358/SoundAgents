// LoadingUI
var divLoading, txtLoading, barLoading, progLoading, divShadow;
var itemsToLoad, itemsLoaded, totalProgress;
var playOnLoad = false;

function LoadingUI(items, play=false){
  divLoading = createDiv();
  divLoading.size(240,100);
  divLoading.position((windowWidth - divLoading.width)/2, 150);
  divLoading.style('background-color', '#B4B');
  divLoading.style('display', 'grid');
  divLoading.style('justify-align', 'center');
  divLoading.style('align-items', 'center');
  divLoading.style('border', 'solid');
  divLoading.style('box-shadow', '5px 10px 20px');

  //Loading Text
  txtLoading = createP("LOADING...");
  txtLoading.parent(divLoading);
  txtLoading.size(divLoading.width, 20);
  txtLoading.style('text-align', 'center');
  txtLoading.style('margin-top', '7.5%');
  txtLoading.style('margin-bottom', '0%');
  txtLoading.style('font', 'bold');

  //Loading bar
  barLoading = createDiv();
  barLoading.parent(divLoading);
  barLoading.size(100, 20);
  barLoading.style('width', '80%');
  barLoading.style('margin', '10%');
  barLoading.style('margin-top', '7.5%');
  barLoading.style('border', 'solid');
  barLoading.style('background-color', '#B4B');

  progLoading = createDiv();
  progLoading.parent(barLoading);
  progLoading.size(0, barLoading.height);
  progLoading.style('background-color', '#000');

  if(!Array.isArray(items)){
    itemsToLoad=[];
    itemsToLoad.push(items);
    playOnLoad = play;
  }
  else{
    itemsToLoad = items;
    playOnLoad = false;
  }
  itemsLoaded = [];
  totalProgress = 0;

  loadNextFile(); //Start loading requested sound files

  return itemsLoaded;
}
//------------------------------------------------------------------------------
function loadingProgessCallback(progress){
  let size = (100/itemsToLoad.length)*(itemsLoaded.length-1 + progress) + 1;
  progLoading.style('width', size + '%');

  if(playOnLoad){ console.log(itemsLoaded.length-1+progress);}
}

function loadSuccessCallback(){
  if(playOnLoad){ itemsLoaded[0].play(); }
  loadNextFile();
}

function loadFailCallback(){
  console.log("Failed to load: "+itemsToLoad[itemsLoaded.length]);
  itemsToLoad.splice(itemsLoaded.length, 1);
  loadNextFile();
}
function loadNextFile(){
  if(itemsToLoad.length == itemsLoaded.length){
    divLoading.remove();
  }
  else{
    itemsLoaded.push(loadSound(itemsToLoad[itemsLoaded.length],
                               loadSuccessCallback,
                               loadFailCallback,
                               loadingProgessCallback));
  }
}
