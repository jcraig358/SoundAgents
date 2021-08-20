class Agent {

  constructor(id){
    this.maxForce = 0.05;
    this.maxSpeed = 3;
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-1,1), random(-1,1));
    this.acceleration = createVector();
    this.group;
    this.range = 30;
    this.id = id;
    this.size = 7;
  }
//------------------------------------------------------------------------------
  wrap(){
    //Top wall
    if(this.position.y < 0){
      this.position.y = height;
    }

    //Right wall
    else if(this.position.x > width){
      this.position.x = 0;
    }

    //Bottom wall
    else if(this.position.y > height){
      this.position.y = 0;
    }

    //Left wall
    else if(this.position.x < 0){
      this.position.x = width;
    }
  }
//----------------------------------------------------------------------------
  //Check if other boid is closer through the edge(s)
  //If it isn't, return original position
  //If it is, determine a reflected position and return it
  /*Parameters:
      other: the boid that is being tested compared to this boid
  */
  altPosition(other){
    let edgeConsideration = true;
    if(edgeConsideration){ //Toggle for turning edge consideration on/off
      //calc dist between points
      let xdist = abs(this.position.x - other.position.x);
      let ydist = abs(this.position.y - other.position.y);

      //preload variables to be returned, in case they are not changed
      //(eg. boid is not closer through edge)
      let xpos = other.position.x;
      let ypos = other.position.y;

      //is the horizontal distance greater than half width? then use reflected xpos
      if (xdist < width/2) {  //boid is not closer through edge
        xpos = other.position.x;
      }
      else if(this.position.x < other.position.x){
        xpos = other.position.x - width;
      }
      else if(this.position.x > other.position.x){
        xpos = other.position.x + width;
      }

      //same for Vertical
      if (ydist < height/2){ //boid is not closer through edge
        ypos = other.position.y;
      }
      else if(this.position.y < other.position.y){ //if other on the right of this boid...
        ypos = other.position.y - height; //determine reflective position to left of this boid
      }
      else if(this.position.y > other.position.y){ //if other is on right of this boid...
        ypos = other.position.y + height; //determine reflective position to right of this boid
      }

      //Return determined positions
      return createVector(xpos,ypos);
    }
    else {
      return other.position;
    }
  //End altPosition
  }
//------------------------------------------------------------------------------
  setGroup(group){
    this.group = group;
  }
//------------------------------------------------------------------------------
  getListOfAgents(base_qtree){


    let agents = [];
    agents = base_qtree.findElementsInRange(this.position.x,
                                                this.position.y,
                                                this.range,
                                                agents,
                                                this.id == 0);

    //return agents;

    //Check reflections
    let n_refl = false;
    let s_refl = false;
    let w_refl = false;
    let e_refl = false;
    let alt_x = this.position.x;
    let alt_y = this.position.y;

    //East reflection
    if(this.position.x < this.range){
      e_refl = true;
      alt_x = this.position.x + width;
    }
    //West reflection
    else if(width - this.position.x < this.range){
      w_refl = true;
      alt_x = this.position.x - width;
    }
    //Get E-W reflection agents
    if(e_refl || w_refl){
      agents = base_qtree.findElementsInRange(alt_x,
                                              this.position.y,
                                              this.range,
                                              agents,
                                              this.id == 0);
    }

    //South reflection
    if(this.position.y < this.range){
      s_refl = true;
      alt_y = this.position.y + height;
    }
    //North reflection
    else if(height - this.position.y < this.range){
      n_refl = true;
      alt_y = this.position.y - height;
    }
    //Get N-S reflection agents
    if(s_refl || n_refl){
      agents = base_qtree.findElementsInRange(this.position.x,
                                              alt_y,
                                              this.range,
                                              agents,
                                              this.id == 0);
    }

    //Corner reflections agents
    if((n_refl && w_refl) || (n_refl && e_refl) ||
       (s_refl && w_refl) || (s_refl && e_refl)){
         agents = base_qtree.findElementsInRange(alt_x,
                                                 alt_y,
                                                 this.range,
                                                 agents,
                                                 this.id == 0);
    }

    return agents;
  }
//------------------------------------------------------------------------------
  alignment(agents){
    //Create zero-vector and sum all other agent velocities
    let steer_force = createVector(0,0);
    for(let other of agents){
      if(other == this){continue;}
      steer_force.add(other.velocity);
      if(this.id == 0){other.highlight();}
    }

    //Determine desired vector
    if(agents.length-1 > 0){
      steer_force.setMag(this.maxSpeed);
      steer_force.sub(this.velocity);
    }

    return steer_force;
  }
//------------------------------------------------------------------------------
  separation(agents){
    //Create zero vector
    let steer_force = createVector(0,0);
    let neighbourFactor = 1.25;

    for(let other of agents){
      if(other == this){continue;}

      let otherPos = this.altPosition(other);

      if(p5.Vector.dist(this.position, otherPos) > this.range/neighbourFactor){continue;}

      let desired = p5.Vector.sub(this.position, otherPos);
      let distance = p5.Vector.dist(otherPos, this.position);

      //Determine signifcance factor
      //let factor = lerp(0.0001, 1.0,distance/(this.range/neighbourFactor));
      //desired.div(factor);
      desired.div(max(distance*distance, 0.0001));

      //Sum desired vectors together
      steer_force.add(desired);
    }

    //Set overall desired separation vector
    if(agents.length-1 > 0){
      steer_force.setMag(this.maxSpeed);
      steer_force.sub(this.velocity);
    }

    return steer_force;
  }
//------------------------------------------------------------------------------
  cohesion(agents){
    let steer_force = createVector(0,0);

    for(let other of agents){
      if(other == this){continue;}

      let otherPos = this.altPosition(other);

      let desired = p5.Vector.sub(otherPos, this.position);
      let distance = p5.Vector.dist(otherPos, this.position);

      //Determine signifcance factor
      let factor = lerp(0.0,1.0, min(distance, this.range)/this.range);
      desired.mult(factor);

      //Sum desired vectors together
      steer_force.add(desired);
    }

    //Set overall desired separation vector
    if(agents.length-1 > 0){
      //steer_force.sub(this.position);
      steer_force.setMag(this.maxSpeed);
      steer_force.sub(this.velocity);
    }

    return steer_force;
  }
//------------------------------------------------------------------------------
  calcAcceleration(agents){
    let ali = this.alignment(agents);
    let sep = this.separation(agents);
    let coh = this.cohesion(agents);

    ali.mult(1.0);
    sep.mult(1.5);
    coh.mult(1.0);

    let total_force = createVector();
    total_force.add(ali);
    total_force.add(sep);
    total_force.add(coh);

    total_force.limit(this.maxForce);

    this.acceleration = total_force;
  }
//------------------------------------------------------------------------------
  update(){
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.wrap();

    this.acceleration.mult(0);
  }
//------------------------------------------------------------------------------
  render(){
    if(this.id == 0){
      stroke(0,250,0);
      noFill();
      circle(this.position.x, this.position.y, this.range*2);
      fill(50,250,125)
      stroke(250);
      strokeWeight(1);
    }
    else if(this.highlighted){
      fill(255,0,0)
      stroke(250);
      strokeWeight(1);
    }
    else{
      fill(255)
      stroke(250);
      strokeWeight(1);
    }
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.size, -this.size/2, -this.size, this.size/2, this.size, 0)
    pop();
    this.highlighted = false;
  }
//------------------------------------------------------------------------------
  run(base_qtree){
    let agents = this.getListOfAgents(base_qtree);
    this.calcAcceleration(agents);
    this.update();
    this.render();
  }
//------------------------------------------------------------------------------
  highlight(){
    //stroke(250,0,0);
    //noFill();
    //circle(this.position.x, this.position.y, this.range);
    this.highlighted = true;
  }
//------------------------------------------------------------------------------
}
