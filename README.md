# SoundAgents
Sound Agents is a recreation of the Music Boids simulation that I created in conjuction with the <a href="https://www.m3lab.org/">M3Lab</a> at the University of Calgary Werklund School of Education. Based on the flocking algorithm created by Craig Reynolds' each boid (agent) determines if it should move away, move towards, or align itself with neighbouring boids. These forces are then modified by the sound that is playing resulting in the boids moving with the music. How this program differentiates is that this version uses a quad-tree to sort the boids such that a single boid does not have to analyze forces for every other boid, just the ones near it.

### Playing sounds
Some pre-made music is provided and can be played by pressing the "Music#" buttons. Alternatively, you can drop your own .mp3 or .wav file onto the boid area.

### Adjusting Frequency
By default, the flocking forces are governed as follows:
<br>&emspLow frequencies = move away from neighbours
<br>&emspMed frequencies = align with neighbours
<br>&emspHigh frequencies = move toward neighbours
<br>The top slider (red/green/blue slider) determines what defines low/med/high frequencies. They can be adjusted by moving the handles on the slider, thus increasing or decreasing the amount of force that the respective range of frequency applies. The force is determined by using the combined amplitudes within each range such that more frequencies in the range means increasing the total amplitude to use to calculate the force.
<br>
<br>It is also possible to change which frequency range governs each force by selecting the appropriate range beside each force.
