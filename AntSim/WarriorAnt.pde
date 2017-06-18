class WarriorAnt extends Ant {
  WarriorAnt(String name, PVector position, PVector rotation, PVector scale, float speed, AntColony antHill) {
    super(name, position, rotation, scale, speed, antHill);
    
    col = color(255, 0, 0);
  }
  
  void sees(Bug bug) {
    moveTo(bug);
  }
}