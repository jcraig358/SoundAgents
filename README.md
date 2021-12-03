# SoundAgents
### Created by <a href="https://johncraig.dev" target="_blank" rel="noopener noreferrer">John Craig</a>
$emsp;Sound Agents is a recreation of the Music Boids simulation that I created in conjuction with the <a href="https://www.m3lab.org/" target="blank" rel="noopener noreferrer">M3Lab</a> at the University of Calgary Werklund School of Education during a residency at the Banff Center for the Arts. Using the <a href="https://https://en.wikipedia.org/wiki/Boids" target="_blank" rel="noopener noreferrer">flocking algorithm created by Craig Reynolds'</a> each boid (agent) determines if it should move away, move towards, or align itself with each neighbouring boid. These forces are then modified by the frequencies of the playing sound resulting in the boids moving with the music. How this program differentiates from Music Boids is that this version uses a quad-tree to sort the boids such that a single boid does not have to analyze forces for every other boid, just the ones near it.

View the full ReadMe <a href="https://github.com/jcraig358/SoundAgents/blob/main/README.md" target="_blank" rel="noopener noreferrer">here</a>.

### How it works
Each boid (agent) determines its own motion by analyzing each boid that it is near and determining how much force should be applied to separate, move toward, or align with each neighbours. The forces are then combined to give a single force vector (acceleration).  With each boid doing their own analysis, the result is group of boids that resembles flocking birds.
In this simulation, the sound that is playing affects the calculation of the forces and certain frequency will multiply their respective flocking forces. By default, the multipliers are as follows:
<br>&emsp;Low frequencies = move away from neighbours (Separation)
<br>&emsp;Med frequencies = align with neighbours (Alignment)
<br>&emsp;High frequencies = move toward neighbours (Cohesion)
The boundaries for frequency classifications can be modified and the respective flocking force for each can be changed (see Adjusting Frequency).

Standard approaches to the flocking algorithm have each boid checking in with every other boid. This is very intensive on the processor. This simulation sorts the boids in a quad-tree structure such that only boids in neighboring quad-tree sections are referenced. When "Follow Agent-0" is selected the quad-tree sections being searched are shown as well as the vision radius of the boid and which other boids are being considered neighbours (boids used to calculate steering force). This allows for more boids in the simulation, but this gain is lost when too many boids occupy a small area. The quad-tree structure works best when the distribution of the boids is even across the play space.


### Playing sounds
Some music is provided and can be played by pressing the "Music#" buttons. Alternatively, you can drop your own .mp3 or .wav file onto the boid area.

### Adjusting Frequency

<br>The top slider (red/green/blue slider) determines what defines low/med/high frequencies. They can be adjusted by moving the handles on the slider, thus increasing or decreasing the amount of force that the respective range of frequency applies. The force is determined by using the combined amplitudes within each range such that more frequencies in the range means increasing the total amplitude to use to calculate the force. It is also possible to change which frequency range governs each force by selecting the desired range beside each force.

### 
