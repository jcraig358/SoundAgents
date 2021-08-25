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
  let perMed = 0.25; //partition between low and med ranges
  let perHigh = 0.667; // partition between med and high ranges
  let midFreq1 = min_freq + (size * perMed);
  let midFreq2 = min_freq + (size * perHigh);


  //Run Fast Fourier Transform spectrum analysis
  let spectrum = fft.analyze();

  //getEnergy gives amplitude of the frequency range; value is 0-255
  let low = fft.getEnergy(min_freq, midFreq1)*(midFreq1 - min_freq);
  let med = fft.getEnergy(midFreq1, midFreq2)*(midFreq2 - midFreq1);
  let high = fft.getEnergy(midFreq2, max_freq)*(max_freq - midFreq2);

  let total = (low + med + high) / 10;

  low = max(low / total, 0);
  med = max(med / total, 0);
  high = max(high / total, 0);

  //Sum the amplitude in each frequency for that spectrum
  // let low = average(spectrum, 0, spectrum.length*perMed);
  // let med = average(spectrum, spectrum.length*perMed, spectrum.length*perHigh);
  // let high = average(spectrum, spectrum.length*perHigh, spectrum.length);

  //console.log("LOW = " + low + "\nMED = " + med + "\nHIGH = " + high);

  //Return a vector containing the amplitudes
  return createVector(low,med,high);
//End getAmplitudes
}

function average(array, min_index, max_index){
  let start = min_index - (min_index%1);
  let end = max_index - (max_index%1);
  //console.log("avg: " + min_index + " - " + max_index);

  let sum = 0.0;
  let i = start;
  while(i<end){
    i += 1;
    if(i>=array.length){ break; }
    sum += array[i] / 255;
  }

  return sum;
}
