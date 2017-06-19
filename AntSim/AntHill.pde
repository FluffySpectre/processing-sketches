class AntHill extends SimObject {
  ArrayList<Ant> ants = new ArrayList<Ant>();
  ArrayList<Marker> marker = new ArrayList<Marker>();
  float time;
  float antSpawnTime;
  int antCount = 0;
  
  final float warriorAntProbabilty = 0.05;
  
  String[] antNames = new String[] {
    "Magda", "Horst", "Wilhelm", "Bernhard", "Anna", "Joachim", "Hannelore", "Björn", "Anja", "Carsten", "Benjamin"
  };
  
  AntHill(PVector position, PVector rotation, PVector scale) {
    super(position, rotation, scale);
  }
  
  void spawnAnt() {
    spawnAntAtPos(position.x, position.y);
  }
  
  void spawnAntAtPos(float x, float y) {
    String antName = antNames[Math.round(random(antNames.length-1))];
    
    Ant ant;
    if (random(1) < warriorAntProbabilty) {
      ant = new WarriorAnt(antName, new PVector(x, y), new PVector(random(-1, 1), random(-1, 1)), new PVector(5, 2), random(1.3, 2), this);
    } else {
      ant = new CollectorAnt(antName, new PVector(x, y), new PVector(random(-1, 1), random(-1, 1)), new PVector(5, 2), random(1.3, 2), this);
    }
    ants.add(ant);
    antCount++;
  }
  
  void removeAnt(Ant ant) {
    ants.remove(ant);
    antCount--;
  }
  
  void setMarkerAtPosition(Ant ant, PVector position, float radius, SimObject direction) {
    Marker m = new Marker(new PVector(position.x, position.y), new PVector(0, 0), new PVector(1, 1), radius, direction);
    marker.add(m);
  }
  
  void update(float deltaTime) {
    ArrayList<Ant> deadAnts = new ArrayList<Ant>();
    ArrayList<Bug> deadBugs = new ArrayList<Bug>();
    
    antSpawnTime += deltaTime;
    if (antCount < maxAnts && antSpawnTime > antSpawnDelay) {
      spawnAnt();
      antSpawnTime = 0;
    }
    
    // update ants
    for (Ant ant : ants) {
      ant.update(deltaTime);
      ant.render();
      
      if (ant.hitsWalls()) {
        ant.rotation.rotate(radians(180));
      }
      
      for (Bug b : bugs) {
        if (ant.intersecting(b)) {
           ant.lifetime = 0;
           killedAntsThroughBugs++;
           
           // hit the bug
           b.vitality -= ant.attackStrength;
           if (b.vitality <= 0) {
             deadBugs.add(b);
             killedBugs++;
           }
        }
      }
      
      //ant.turnTo(new PVector(mouseX, mouseY));
      
      if (ant.lifetime <= 0) {
        deadAnts.add(ant);
      }
    }
    
    // remove dead ants from the game and add new instead
    if (deadAnts.size() > 0) {
      ants.removeAll(deadAnts);
      antCount -= deadAnts.size();
    }
    
    // remove dead bugs from the game and add new instead
    if (deadBugs.size() > 0) {
      bugs.removeAll(deadBugs);
      //bugCount -= deadBugs.size();
    }
    
    // update marker
    ArrayList<Marker> deadMarker = new ArrayList<Marker>();
    for (Marker m : marker) {
      m.update(deltaTime);
      m.render();
      
      if (m.radius <= 0) {
        deadMarker.add(m);
      }
    }
    
    // remove invisible marker from the game
    if (deadMarker.size() > 0) {
      marker.removeAll(deadMarker);
    }
  }
  
  void render() {
    stroke(100);
    fill(222, 184, 135, 255);
    ellipse(position.x, position.y, scale.x, scale.y);
  }
}