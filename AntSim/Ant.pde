abstract class Ant extends SimObject {
  String name;
  int vitality = 100;
  float lifetime = 999;
  float speed = 2;
  int attackStrength = 10;
  AntHill antHill;
  SimObject target = null;
  SimObject lastTarget = null;
  boolean targetReached = false;
  float speedModificator = 1;
  int carryFood = 0;
  float markerTimer = 0;
  color col;
  boolean canMove = true;
  ArrayList<Marker> smelledMarkers = new ArrayList<Marker>();
  Fruit carryFruit = null;
  
  float visionSenseRange = 40;
  float targetReachDist = 5;
  float carryFoodModificator = 0.5;
  float carryFruitModificator = 0.1;
  int maxCarryAmount = 5;
 
  Ant(String name, PVector position, PVector rotation, PVector scale, float speed, AntHill antHill) {
    super(position, rotation, scale);
    
    this.name = name;
    this.speed = speed;
    this.antHill = antHill;
    
    col = color(20);
  }
  
  void update(float deltaTime) {
    lifetime -= deltaTime;
    if (lifetime < 0) lifetime = 0;
    
    if (lifetime == 0 || vitality == 0 || carryFruit != null) return;
    
    updateVision();
    updateSmelling();
    
    if (!canMove) return;
    
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
          
          if (target instanceof Food) {
            targetReached((Food)target);
          } else if (target instanceof AntHill) {
            targetReached((AntHill)antHill);
          }
        }
      }
    } else {
      // we have no target, so just roam on the playground
      rotation.rotate(radians(random(-10, 10)));
      move();
    }
    
    markerTimer += deltaTime;
    if (carryFood > 0 && lastTarget != null && markerTimer > 0.5) {
      markerTimer = 0;
      PVector behind = new PVector(rotation.x, rotation.y);
      behind.rotate(radians(180));
      behind.normalize();
      setMarker(30, behind);
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
    
    if (displayAntSenseRange) {
      // draw sense radius
      noStroke();
      fill(150, 0, 150, 50);
      ellipse(scale.x/2, scale.y/2, visionSenseRange, visionSenseRange);
    }
    
    popMatrix();
    
    if (displayLabels) {
      fill(20);
      text(name, position.x - 20, position.y - 15);
    }
  }
  
  void move() {
    position.x += rotation.x * speed * speedModificator;
    position.y += rotation.y * speed * speedModificator;
  }
  
  void setMarker(float radius, PVector direction) {
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
    if (food instanceof Fruit) {
      Fruit f = (Fruit)food;
      carryFood = f.amount;
      f.pickup(this);
      carryFruit = f;
      
    } else {
      carryFood = food.pickup(maxCarryAmount);
      if (carryFood == 0) lastTarget = null;
      else lastTarget = food;
      
      speedModificator = carryFoodModificator;
    }
  }
  
  final void drop() {
    carryFood = 0;
    
    if (carryFruit != null) {
      //carryFruit.drop(this);
      carryFruit = null;
    }
  }
  
  // NAV
  void targetReached(Food food) {}
  void targetReached(AntHill antHill) {}
  
  // SENSING
  void sees(Food food) {}
  void sees(Fruit fruit) {}
  void sees(Bug bug) {}
  void smells(Marker marker) {}
  
  private void updateVision() {
    for (Food f : food) {
      if (position.dist(f.position) < visionSenseRange) {
        if (f instanceof Fruit)
          sees((Fruit)f);
        else 
          sees(f);
      }
    }
    
    for (Bug b : bugs) {
      if (position.dist(b.position) < visionSenseRange) {
        sees(b);
      }
    }
  }
  
  private void updateSmelling() {
    for (Marker m : antHill.marker) {
      if (position.dist(m.position) < visionSenseRange && !smelledMarkers.contains(m)) {
        smelledMarkers.add(m);
        smells(m);
      }
    }
  }
}