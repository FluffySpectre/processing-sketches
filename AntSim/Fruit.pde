class Fruit extends Food {
  Ant carrier = null;
  int numCarriers = 0;
  
  Fruit(PVector position, PVector rotation, PVector scale, int amount) {
    super(position, rotation, scale, amount);
  }
  
  boolean pickup(Ant ant) {
    numCarriers++;
    if (carrier == null) {
      carrier = ant;
      return true;
    }
    
    carrier.speedModificator *= 2;
    
    return false;
  }
  
  void drop(Ant ant) {
    numCarriers--;
    if (ant == carrier) {
      carrier = null;
    }
    carrier.speedModificator /= 2;
  }
  
  void update(float deltaTime) {
    if (carrier != null) {
      //float newSpeed = carrier.speedModificator * numCarriers;
      //carrier.speedModificator = newSpeed;
      
      rotation = carrier.rotation;
      position.x += rotation.x * carrier.speed * carrier.speedModificator;
      position.y += rotation.y * carrier.speed * carrier.speedModificator;
    }
  }
  
  void render() {
    fill(10, 230, 10);
    ellipse(position.x, position.y, scale.x, scale.y);
  }
}