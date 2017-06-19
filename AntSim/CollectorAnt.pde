class CollectorAnt extends Ant {
  CollectorAnt(String name, PVector position, PVector rotation, PVector scale, float speed, AntHill antHill) {
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
}