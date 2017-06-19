class ScoutAnt extends Ant {
  ScoutAnt(String name, PVector position, PVector rotation, PVector scale, float speed, AntHill antHill) {
    super(name, position, rotation, scale, speed, antHill);
  }
  
  void sees(Food food) {
    moveTo(food);
  }
  
  void targetReached(Food food) {
    
  }
}