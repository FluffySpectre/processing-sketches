class Environment {
  AntColony antHill;
  ArrayList<Food> food = new ArrayList<Food>();
  ArrayList<Bug> bugs = new ArrayList<Bug>();
  
  float bugSpawnTime = 0.0;
  SimSettings simSettings;
  
  Environment(SimSettings simSettings) {
    this.simSettings = simSettings;
    
    antHill = new AntColony(new PVector(250, 250), new PVector(0, 0), new PVector(50, 50));
    
    for (int i=0; i<simSettings.maxSugarHills; i++) {
      spawnSugarHill();
    }
    
    for (int i=0; i<simSettings.maxBugs; i++) {
      spawnBug();
    }
  }
  
  void update(float deltaTime) {
    // ANTS
    for (Ant a : antHill.ants) {
      a.lifetime -= deltaTime;
      if (a.lifetime < 0) a.lifetime = 0;
      
      a.move();
    }
    
    antHill.update(deltaTime);
    antHill.render();
    
    // BUGS
    if (bugs.size() < simSettings.maxBugs) {
      bugSpawnTime += deltaTime;  
      
      if (bugSpawnTime > simSettings.bugSpawnDelay) {
        spawnBug();
        bugSpawnTime = 0;
      }
    } else {
      bugSpawnTime = 0;
    }
    
    for (Bug b : bugs) {
      b.update(deltaTime);
      b.render();
      
      if (b.hitsWalls()) {
        b.rotation.rotate(radians(180));
      }
    }
    
    ArrayList<Food> emptyFood = new ArrayList<Food>();
    for (Food f : food) {
      f.render();
      
      if (f.amount == 0) {
        emptyFood.add(f);
      }
    }
    if (emptyFood.size() > 0) {
      food.removeAll(emptyFood);
      
      for (int i=0; i<emptyFood.size(); i++) {
        spawnSugarHill();
      }
      
      emptyFood = null;
    }
  }
  
  private void updateVision(Ant ant) {
    for (Food f : food) {
      if (ant.position.dist(f.position) < simSettings.antSenseRange) {
        ant.sees(f);
      }
    }
    
    for (Bug b : bugs) {
      if (ant.position.dist(b.position) < simSettings.antSenseRange) {
        ant.sees(b);
      }
    }
  }
  
  private void updateSmelling(Ant ant) {
    for (Marker m : antHill.marker) {
      if (ant.position.dist(m.position) < m.radius) {
        ant.smells(m);
      }
    }
  }
  
  void spawnSugarHill() {
    int amount = (int)random(50, 250);
    PVector fScale = new PVector(10 + amount * 0.08, 10 + amount * 0.08);
    Food f = new Food(getRandomPoint(), new PVector(0, 0), fScale, amount);
    food.add(f);
  }
  
  void spawnBug() {
    Bug b = new Bug(getRandomPoint(), getRandomRotation(), new PVector(10, 6));
    bugs.add(b);
  }
  
  PVector getRandomPoint() {
    return new PVector(random(20, 500-20), random(20, 500-20));
  }
  
  PVector getRandomRotation() {
    return new PVector(random(-1, 1), random(-1, 1));
  }
}