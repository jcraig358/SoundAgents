/*Functions used to analyze sound.
  Used in determining force multipliers for cohesion, separation and alignment.
*/

//Return a vector of the average amplitudes of "low", "med" and "high" frequencies
function getAmplitudes(){
  //Only use frequencies in the vocal range (100-2000 Hz)
  let min_freq = 20; //Min frequency to analyze
  let max_freq = 20000; //Max frequency to analaze
  //let midFreq1 = 1000;
  //let midFreq2 = 6000;
  let size = max_freq - min_freq;
  let values = $("#divFreqSld").slider("values");
  let perMed = values[0]/100; //partition between low and med ranges
  let perHigh = values[1]/100; // partition between med and high ranges
  let midFreq1 = min_freq + (size * perMed);
  let midFreq2 = min_freq + (size * perHigh);


  //Run Fast Fourier Transform spectrum analysis
  var spectrum = fft.analyze();
  var amplitude = amp.getLevel();
  var level;
  if(cbxSubAmp.checked()){ level = amplitude * (10-exp(1))/10; }
  else { level = 0; };

  //getEnergy gives amplitude of the frequency range; value is 0-255
  // let low = fft.getEnergy(min_freq, midFreq1)*(midFreq1 - min_freq);
  // let med = fft.getEnergy(midFreq1, midFreq2)*(midFreq2 - midFreq1);
  // let high = fft.getEnergy(midFreq2, max_freq)*(max_freq - midFreq2);

  // let total = (low + med + high) / 10;
  //
  // low = max(low / total, 0);
  // med = max(med / total, 0);
  // high = max(high / total, 0);

  //Sum the amplitude in each frequency for that spectrum
  let low = max(sum(spectrum, level, 0, parseInt(spectrum.length*perMed)),1.5);
  let med = max(sum(spectrum, level, parseInt(spectrum.length*perMed), parseInt(spectrum.length*perHigh)),1.0);
  let high = max(sum(spectrum, level, parseInt(spectrum.length*perHigh), parseInt(spectrum.length)),1.0);

  //console.log("LOW = " + low + "\nMED = " + med + "\nHIGH = " + high);

  //Draw spectrum
  if(cbxShowSpectrum.checked()){
    rectMode(CORNER);
    text("Spec-length: " + spectrum.length + "; Amplitude: "+ nf(level,1,2) + "; lowmed: "+perMed+"; medHi: "+perHigh, 30, 150);
    for(let i=0; i<spectrum.length; i++){
      if(i < spectrum.length*perMed){ fill(255,0,0); }
      else if(i < spectrum.length*perHigh){ fill(0,255,0); }
      else {fill(0,0,255);}
      stroke(0,0,0,0);
      rect(i*(width/spectrum.length), height - map(spectrum[i], 0, 255, 0, height), width/spectrum.length, map(spectrum[i], 0, 255, 0, height));
    }
    fill(0,0,0,150);
    rect(0,height - level*height, width, level*height);
  }

  //Return a vector containing the amplitudes
  //return createVector(low,med,high);
  return createVector(low,med,high);
//End getAmplitudes
}

function sum(array, level, min_index, max_index){
  let start = parseInt(min_index);
  let end = parseInt(max_index);
  //console.log("avg: " + min_index + " - " + max_index);

  let sum = 0.0;
  let i = start;

  for(let i=min_index; i<max_index; i++){
    //Only add bins that have amplitude > average amplitude; put more weight on larger values.
    sum += max((array[i] / 255)-level,0);
  }
  //sum = sum / (max_index-min_index);

  // while(i<end){
  //   i += 1;
  //   if(i>=array.length){ break; }
  //   sum += array[i] / 255;
  // }

  return sum;
}
