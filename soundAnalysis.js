/*Functions used to analyze sound.
  Used in determining force multipliers for cohesion, separation and alignment.
*/

//Return a vector of the average amplitudes of "low", "med" and "high" frequencies
function getAmplitudes(){
  //Only use frequencies in the vocal range (100-2000 Hz)
  let min_freq = 20; //Min frequency to analyze
  let med1_freq = 2000; //partition between low and med ranges
  let med2_freq = 10000; // partition between med and high ranges
  let max_freq = 20000; //Max frequency to analaze

  //Run Fast Fourier Transform spectrum analysis
  let spectrum = fft.analyze();

  //getEnergy gives amplitude of the frequency rangep; value is 0-255
  let low = fft.getEnergy(min_freq, med1_freq);
  let med = fft.getEnergy(med1_freq, med2_freq);
  let high = fft.getEnergy(med2_freq, max_freq);

  console.log("LOW = " + low + "\nMED = " + med + "\nHIGH = " + high);

  //Return a vector containing the amplitudes
  return createVector(low,med,high);
//End getAmplitudes
}
