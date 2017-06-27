class Fruit extends Food {
  float targetReachDist = 5;
  ArrayList<Ant> carriers = new ArrayList<Ant>();
  
  Fruit(PVector position, PVector rotation, PVector scale, int amount) {
    super(position, rotation, scale, amount);
  }
  
  void pickup(Ant ant) {
    carriers.add(ant);
  }
  
  void drop(Ant ant) {
    if (carriers.contains(ant))
      carriers.remove(ant);
  }
  
  void update(float deltaTime) {
    if (carriers.size() == 0) return;
    
    // calculate current position towards the anthill
    rotation = PVector.sub(carriers.get(0).antHill.position, position).normalize();
    position.x += rotation.x * fruitBaseSpeed * carriers.size();
    position.y += rotation.y * fruitBaseSpeed * carriers.size();
    
    // set the current direction and velocity for all carriers too
    for (Ant ant : carriers) {
      ant.position = position.copy();
      ant.rotation = rotation.copy();
      ant.target = null;
    }
    
    if (PVector.dist(position, carriers.get(0).antHill.position) < targetReachDist) {
      foodCollected += amount;
      amount = 0;
      
      for (Ant ant : carriers) {
        ant.drop(); 
      }
      
      carriers.clear();
    }
  }
  
  void render() {
    stroke(100);
    fill(10, 230, 10);
    ellipse(position.x, position.y, scale.x, scale.y);
  }
}