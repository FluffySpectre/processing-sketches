class CollectorAnt extends Ant {
  float markerTimer = 0;
  
  CollectorAnt(String name, PVector position, PVector rotation, PVector scale, float speed, AntColony antHill) {
    super(name, position, rotation, scale, speed, antHill);
  }
  
  void sees(Food food) {
    if (target == null) {
      //println("SEES FOOD!!!");
      target = food;
    }
  }
  
  void smells(Marker marker) {
    if (target == null) {
      //target = marker.direction;
      
      //println("SMELLS MARKER!!!");
    }
  }
  
  void targetReached(Food food) {
    take(food);
    moveHome();
  }
  
  void targetReached(AntColony antHill) {
    //println("HILL!!!");
    foodCollected += carryFood;
    
    if (lastTarget != null)
      target = lastTarget;
    else 
      target = null;
    
    speedModificator = 1;
    carryFood = 0;
  }
  
  void tick(float deltaTime) {
    markerTimer += deltaTime;
    if (carryFood > 0 && lastTarget != null && markerTimer > 0.5) {
      markerTimer = 0;
      //PVector behind = new PVector(rotation.x, rotation.y);
      //behind.rotate(radians(180));
      //behind.normalize();
      setMarker(10, lastTarget);
    }
  }
}