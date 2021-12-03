# SoundAgents
### Created by <a href="https://johncraig.dev" target="_blank" rel="noopener noreferrer">John Craig</a>
&emsp;Sound Agents is a recreation of the Music Boids simulation that I created in conjuction with the <a href="https://www.m3lab.org/" target="blank" rel="noopener noreferrer">M3Lab</a> at the University of Calgary Werklund School of Education during a residency at the Banff Center for the Arts. Using the <a href="https://https://en.wikipedia.org/wiki/Boids" target="_blank" rel="noopener noreferrer">flocking algorithm created by Craig Reynolds'</a> each boid (agent) determines if it should move away, move towards, or align itself with each neighbouring boid. These forces are then modified by the frequencies of the playing sound resulting in the boids moving with the music. How this program differentiates from Music Boids is that this version uses a quad-tree to sort the boids such that a single boid does not have to analyze forces for every other boid, just the ones near it.

View the full ReadMe <a href="https://github.com/jcraig358/SoundAgents/blob/main/README.md" target="_blank" rel="noopener noreferrer">here</a>.

### How it works
Each boid (agent) determines its own motion by analyzing each boid that it is near and determining how much force should be applied to separate, move toward, or align with each neighbours. The forces are then combined to give a single force vector (acceleration).  With each boid doing their own analysis, the result is group of boids that resembles flocking birds.
In this simulation, the sound that is playing affects the calculation of the forces and certain frequency will multiply their respective flocking forces. By default, the multipliers are as follows:
<br>&emsp;Low frequencies = move away from neighbours (Separation)
<br>&emsp;Med frequencies = align with neighbours (Alignment)
<br>&emsp;High frequencies = move toward neighbours (Cohesion)
<br>The boundaries for frequency classifications can be modified and the respective flocking force for each can be changed (see Adjusting Frequency).

Standard approaches to the flocking algorithm have each boid checking in with every other boid. This is very intensive on the processor. This simulation sorts the boids in a quad-tree structure such that only boids in neighboring quad-tree sections are referenced. When "Follow Agent-0" is selected the quad-tree sections being searched are shown as well as the vision radius of the boid and which other boids are being considered neighbours (boids used to calculate steering force). This allows for more boids in the simulation, but this gain is lost when too many boids occupy a small area. The quad-tree structure works best when the distribution of the boids is even across the play space. Selecting "Show QTree" will display all quad-tree sections so that the boid distribution can be monitored.

### Playing sounds
Some music is provided and can be played by pressing the "Music#" buttons. Alternatively, you can drop your own .mp3 or .wav file onto the boid area.

### Adjusting Frequency
The top slider (red/green/blue slider) determines what defines low/med/high frequencies. They can be adjusted by moving the handles on the slider, thus increasing or decreasing the amount of force that the respective range of frequency applies. The force multipliers are determined by using the combined amplitudes within each range such that more frequencies in the range means increasing the total amplitude to use to calculate the force. It is also possible to change which frequency range governs each force by selecting the desired frequency range beside each force.

### Boid Density
The boid density can be changed using the sliders on the right. The top of these two sliders controls the number of boids in play. Increasing the number of boids can create a more visually pleasing flocking dynamic, but can impact performance. Decreasing the number of boids can help performance, but if a boid has no neighbours, then no forces are applied which diminishes the flocking dynamic.
The lower of the two sliders controls the size of the boids. A larger size can be used to compensate for less boids. Not only does their appearance increase, but so does their vision radius and can thus increase the number of neighbours it can see. However, too large can overcrowd the play space diminishing the flocking dynamic. Alternatively, a smaller boid size can decrease the chaos caused by too many boids as well as decrease the number of neighbours which would aide performance.

### Options
Follow Agent-0: Highlight one of the boids by showing its vision radius, the quad-tree sections being analyzed, and the neighbours considered in the force calculations.
<br>Show Q-Tree: Show the entire quad-tree structure. The can be helpful in monitoring boid density.
<br>Spectrum: Show/hide the frequency spectrum visualization. The specturm helps to know how much amplitude is in each frequency range.
<br>Sub Amplitude: Enable/disable subtracting the average amplitube from each frequency. This allows for only the most prominant sounds to be be used in calculations. However, the fact that the human ear can better hear certain frequencies is not considered in this aspect (higher and mid frequencies are more noticable with less amplitude than low frequency sounds).
<br>Reset: At any time, the Reset button can be used to return sliders their default values and rebuild the play space.
