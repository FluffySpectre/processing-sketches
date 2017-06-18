abstract class Ant extends Insect {
  AntColony antHill;
  SimObject target = null;
  SimObject lastTarget = null;
  boolean targetReached = false;
  int carryFood = 0;
  boolean canMove = true;
  
  float targetReachDist = 5;
  float carryFoodModificator = 0.5;
  int maxCarryAmount = 5;
 
  Ant(String name, PVector position, PVector rotation, PVector scale, float speed, AntColony antHill) {
    super(name, position, rotation, scale);
    
    this.name = name;
    this.speed = speed;
    this.antHill = antHill;
    
    col = color(20);
  }
  
  final void move() {
    if (!canMove) return;
    
    if (target != null) {
      PVector t = target.position;
      
      if (position.dist(t) > targetReachDist) {
        targetReached = false;
        turnTo(t);
      
        position.x += rotation.x * speed * speedModificator;
        position.y += rotation.y * speed * speedModificator;
      } else {
        // STOP!
        if (!targetReached) {
          targetReached = true;
          
          if (target != null) {
            if (target instanceof Food) {
              targetReached((Food)target);
            } else if (target instanceof AntColony) {
              targetReached((AntColony)antHill);
            }
          }
        }
      }
    } else {
      rotation.rotate(radians(random(-10, 10)));
      position.x += rotation.x * speed * speedModificator;
      position.y += rotation.y * speed * speedModificator;
    }
  }
  
  void render() {
    pushMatrix();
    translate(position.x, position.y);
    rotate(rotation.heading());
    noStroke();
    fill(col);
    rect(0, 0, scale.x, scale.y);
    stroke(150);
    
    if (carryFood > 0) {
      fill(250);
      rect(0, 0, 5, 5);
    }
    
    popMatrix();
    
    if (displayLabels) {
      fill(20);
      text(name, position.x - 20, position.y - 15);
    }
  }
  
  void setMarker(float radius, SimObject direction) {
    antHill.setMarkerAtPosition(this, position, radius, direction);
  }
  
  // MOVING
  final void moveTo(SimObject target) {
    this.target = target;
    canMove = true;
  }
  
  final void moveHome() {
    target = antHill;
    canMove = true;
  }
  
  final void stop() {
    target = null;
    canMove = false;
  }
  
  // TURNING
  final void turnTo(PVector target) {
    PVector dir = PVector.sub(target, position);
    rotation = dir.normalize();
  }
  
  final void turnAround() {
    rotation.rotate(radians(180));
  }
  
  // FOOD
  final void take(Food food) {
    carryFood = food.pickup(maxCarryAmount);
    if (carryFood == 0) lastTarget = null;
    else lastTarget = food;
    speedModificator = carryFoodModificator;
  }
  
  final void drop() {
    carryFood = 0;
  }
  
  // NAV
  void targetReached(Food food) {}
  void targetReached(AntColony antHill) {}
  
  // SENSING
  void sees(Food food) {}
  void sees(Bug bug) {}
  void smells(Marker marker) {}
}