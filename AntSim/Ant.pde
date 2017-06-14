class Ant extends SimObject {
  String name;
  int vitality = 100;
  float lifetime = 42;
  float speed = 2;
  AntHill antHill;
  SimObject target = null;
  SimObject lastTarget = null;
  boolean targetReached = false;
  float speedModificator = 1;
  int carryFood = 0;
  float markerTimer = 0;
  
  float foodSenseRadius = 40;
  float targetReachDist = 5;
  float carryFoodModificator = 0.5;
  int maxCarryAmount = 5;
 
  Ant(String name, PVector position, PVector rotation, PVector scale, float speed, AntHill antHill) {
    super(position, rotation, scale);
    
    this.name = name;
    this.speed = speed;
    this.antHill = antHill;
  }
  
  void update(float deltaTime) {
    lifetime -= deltaTime;
    if (lifetime < 0) lifetime = 0;
    
    if (lifetime == 0) return;
    
    updateVision();
    updateSmelling();
    
    if (target != null) {
      PVector t = target.position;
      
      if (position.dist(t) > targetReachDist) {
        targetReached = false;
        turnTo(t);
      
        move();
      } else {
        // STOP!
        if (!targetReached) {
          targetReached = true;
          
          if (target != null) {
            if (target instanceof Food) {
              targetReached((Food)target);
            } else if (target instanceof AntHill) {
              targetReached((AntHill)antHill);
            }
          }
        }
      }
    } else {
      rotation.rotate(radians(random(-10, 10)));
      move();
    }
    
    markerTimer += deltaTime;
    if (carryFood > 0 && lastTarget != null && markerTimer > 0.5) {
      markerTimer = 0;
      //PVector behind = new PVector(rotation.x, rotation.y);
      //behind.rotate(radians(180));
      //behind.normalize();
      setMarker(10, lastTarget);
    }
  }
  
  void render() {
    pushMatrix();
    translate(position.x, position.y);
    rotate(rotation.heading());
    fill(20);
    rect(0, 0, scale.x, scale.y);
    
    if (carryFood > 0) {
      fill(250);
      rect(0, 0, 5, 5);
    }
    
    popMatrix();
    
    if (displayAntNames) {
      fill(20);
      text(name, position.x - 20, position.y - 15);
    }
  }
  
  void move() {
    position.x += rotation.x * speed * speedModificator;
    position.y += rotation.y * speed * speedModificator;
  }
  
  void setMarker(float radius, SimObject direction) {
    antHill.setMarkerAtPosition(this, position, radius, direction);
  }
  
  void setMarker(float radius) {
    antHill.setMarkerAtPosition(this, position, radius, null);
  }
  
  // MOVING
  void moveTo(PVector target) {
    moveTo(target);
    
  }
  
  void moveAwayFrom(PVector target) {
    
  }
  
  // TURNING
  void turnTo(PVector target) {
    PVector dir = PVector.sub(target, position);
    rotation = dir.normalize();
  }
  
  void turnAround() {
    
  }
  
  void targetReached(Food food) {
    carryFood = food.pickup(maxCarryAmount);
    if (carryFood == 0) lastTarget = null;
    else lastTarget = food;
    
    target = antHill;
    speedModificator = carryFoodModificator;
    
    //println("FOOD REACHED!!!: " + carryFood);
  }
  
  void targetReached(AntHill antHill) {
    //println("HILL!!!");
    foodCollected += carryFood;
    
    if (lastTarget != null)
      target = lastTarget;
    else 
      target = null;
    
    speedModificator = 1;
    carryFood = 0;
  }
  
  // SENSING
  void sees(Food food) {
    if (target == null) {
      println("SEES FOOD!!!");
      target = food;
    }
  }
  
  void smells(Marker marker) {
    if (target == null) {
      target = marker.direction;
      
      //println("SMELLS MARKER!!!");
    }
  }
  
  // FOOD
  void take(Food food) {
    
  }
  
  void drop() {
  
  }
  
  private void updateVision() {
    for (Food f : food) {
      if (position.dist(f.position) < foodSenseRadius) {
        sees(f);
      }
    }
  }
  
  void updateSmelling() {
    for (Marker m : antHill.marker) {
      if (position.dist(m.position) < m.radius) {
        smells(m);
      }
    }
  }
}