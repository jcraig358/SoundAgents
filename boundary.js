class Boundary {
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.top = y - (h/2);
    this.bottom = y + (h/2);
    this.right = x + (w/2);
    this.left = x - (w/2);
  }
//------------------------------------------------------------------------------
  contains(x,y){
    return( (x >= this.left) && (x <= this.right) &&
            (y >= this.top) && (y <= this.bottom)    )
  }
//------------------------------------------------------------------------------
  intersectCircle(circle_x, circle_y, circle_r){
    let check_x = circle_x;
    let check_y = circle_y;

    //Determine boundary corner to check
    if(circle_x < this.left) { check_x = this.left; }
    else if(circle_x > this.right) { check_x = this.right; }

    if(circle_y < this.top) { check_y = this.top; }
    else if(circle_y > this.bottom){ check_y = this.bottom; }

    //Get distance
    let distance = dist(circle_x, circle_y, check_x, check_y);
    if(distance <= circle_r){ return true; }
    else{ return false; }
  }
}
