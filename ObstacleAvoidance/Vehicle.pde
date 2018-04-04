class Vehicle {
  PVector pos;
  PVector acc;
  PVector vel;
  PVector target;
  float mass = 8;
  PVector f = new PVector();
  
  Vehicle(float x, float y) {
    pos = new PVector(x, y);
    acc = new PVector();
    vel = new PVector();
  }
  
  void setTarget(PVector t) {
    target = t;
  }
  
  void applyForce(PVector force) {
    acc.add(force);
  }
  
  void update() {
    // calculate steering forces
    PVector steer = new PVector();
    //steer = calculateForce();
    
    steer.add(seek(target));
    steer.add(obstacleAvoidance());
    steer.setMag(maxSteeringForce);
    steer.div(mass);
    applyForce(steer);
    
    vel.add(acc);
    vel.setMag(maxVelocity);

    pos.add(vel);
    acc.mult(0);
  }
  
  void render() {
    // draw triangle
    pushMatrix();
    translate(pos.x, pos.y);
    rotate(vel.heading());
    
    fill(255);
    noStroke();
    beginShape();
    vertex(15, 0);
    vertex(-15, 5);
    vertex(-15, -5);
    endShape(CLOSE);
    popMatrix();
  }
  
  /*PVector calculateForce() {
    PVector steer = new PVector();
    
    PVector seekForce = seek(target);
    seekForce.mult(multSeekForce);
    if (!accumulateForce(steer, seekForce)) 
      return steer;
    
    PVector obstacleAvoidanceForce = obstacleAvoidance();
    obstacleAvoidanceForce.mult(multAvoidanceForce);
    if (!accumulateForce(steer, obstacleAvoidanceForce)) 
      return steer;
      
    return steer;
  }*/
  
  /*boolean accumulateForce(PVector steer, PVector forceToAdd) {
    //calculate how much steering force the vehicle has used so far
    float MagnitudeSoFar = steer.mag();
    //calculate how much steering force remains to be used by this vehicle
    float MagnitudeRemaining = maxSteeringForce - MagnitudeSoFar;
    //return false if there is no more force left to use
    if (MagnitudeRemaining <= 0.0) return false;
    //calculate the magnitude of the force we want to add
    float MagnitudeToAdd = forceToAdd.mag();
    
    if (MagnitudeToAdd < MagnitudeRemaining)
    {
      steer.add(forceToAdd);
    }
    else
    {
      //add it to the steering force
      PVector normForce = forceToAdd.normalize();
      PVector s = PVector.mult(normForce, MagnitudeRemaining);
      steer.add(s);
    }
    return true;
  }*/
  
  // STEERING BEHAVIOURS
  PVector seek(PVector target) {
    PVector dir = PVector.sub(target, pos);
    dir.normalize();
    return PVector.sub(dir, vel);
  }
  
  PVector obstacleAvoidance() {
    PVector avoidanceForce = new PVector();
    
    // calculate feeler positions
    float feelerLength = viewDistance;
    PVector[] feelers = new PVector[50];
    for (int i=0; i<feelers.length; i++) {
      PVector feeler1 = pos.copy();
      PVector normVel = PVector.mult(vel.normalize(null), feelerLength);
      feeler1.add(normVel);
      feelers[i] = feeler1;
      feelerLength *= 0.9;
    }
    
    // check, if there is a obstacle in fr 
    Obstacle o = getMostImportantObstacle(feelers);
    if (o != null) {
      avoidanceForce.x = f.x - o.pos.x;
      avoidanceForce.y = f.y - o.pos.y;
      avoidanceForce.normalize();
      avoidanceForce.setMag(maxAvoidanceForce);
      
    } else {
      avoidanceForce.mult(0);
    }
    
    return avoidanceForce;
  }
  
  boolean lineHitsObstacle(PVector[] feeler, Obstacle obstacle) {
    for (PVector v : feeler) {
      if (dist(obstacle.pos.x, obstacle.pos.y, v.x, v.y) <= obstacle.radius) {
        f = v;
        return true;
      }
    }
    return false;
  }
  
  Obstacle getMostImportantObstacle(PVector[] feeler) {
    Obstacle mostImportant = null;
    
    for (Obstacle o : obstacles) {
      boolean collision = lineHitsObstacle(feeler, o);
      
      if (collision && (mostImportant == null || 
        dist(pos.x, pos.y, o.pos.x, o.pos.y) < dist(pos.x, pos.y, mostImportant.pos.x, mostImportant.pos.y))) {
        mostImportant = o;
      }
    }
    
    return mostImportant;
  }
}