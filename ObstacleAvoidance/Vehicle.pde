class Vehicle {
  PVector pos;
  PVector acc;
  PVector vel;
  PVector target;
  float mass = 8;
  PVector f = new PVector();
  PVector[] feelers = new PVector[0];
  float perceptionRadius = 120;
  
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
    steer.add(seek(target));
    steer.add(obstacleAvoidance());
    steer.add(separation(vehicles));
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
    
    // draw perception radius
    //stroke(255, 100);
    //noFill();
    //ellipse(0, 0, perceptionRadius, perceptionRadius); 
    
    popMatrix();
  }
  
  // STEERING BEHAVIOURS
  PVector seek(PVector target) {
    PVector dir = PVector.sub(target, pos);
    dir.normalize();
    return PVector.sub(dir, vel);
  }
  
  PVector obstacleAvoidance() {
    PVector avoidanceForce = new PVector();
    
    // calculate feeler positions
    float feelerLength = viewDistance / numFeelers;
    feelers = new PVector[numFeelers];
    for (int i=0; i<feelers.length; i++) {
      PVector feeler = pos.copy();
      PVector normVel = PVector.mult(vel.normalize(null), i*feelerLength);
      feeler.add(normVel);
      feelers[i] = feeler;
    }
    
    // check, if there is a obstacle in front
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
  
  PVector separation(Vehicle[] vehicles) {
    PVector steering = new PVector();
    int total = 0;
    for (Vehicle other: vehicles) {
      float d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (other != this && d < perceptionRadius) {
        PVector diff = PVector.sub(this.pos, other.pos);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(maxVelocity);
      steering.sub(this.vel);
      steering.limit(maxSeparationForce);
    }
    return steering;
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
