class AntHill extends SimObject {
  ArrayList<Ant> ants = new ArrayList<Ant>();
  ArrayList<Marker> marker = new ArrayList<Marker>();
  float time;
  
  String[] antNames = new String[] {
    "Magda", "Horst", "Wilhelm", "Bernhard", "Anna", "Joachim", "Hannelore", "Björn", "Anja", "Carsten", "Benjamin"
  };
  
  AntHill(PVector position, PVector rotation, PVector scale) {
    super(position, rotation, scale);
  }
  
  void spawnAnt() {
    String antName = antNames[Math.round(random(antNames.length-1))];
    
    Ant ant = new Ant(antName, new PVector(position.x, position.y), new PVector(random(-1, 1), random(-1, 1)), new PVector(5, 2), random(1.3, 2), this);
    ants.add(ant);
  }
  
  void removeAnt(Ant ant) {
    ants.remove(ant);
  }
  
  void setMarkerAtPosition(Ant ant, PVector position, float radius, java.lang.Object payload) {
    Marker m = new Marker(new PVector(position.x, position.y), new PVector(0, 0), new PVector(1, 1), radius, payload);
    marker.add(m);
  }
  
  void update(float deltaTime) {
    ArrayList<Ant> deadAnts = new ArrayList<Ant>();
    
    // update ants
    for (Ant ant : ants) {
      ant.update(deltaTime);
      ant.render();
      
      if (ant.hitsWalls()) {
        ant.rotation.rotate(radians(180));
      }
      
      time += deltaTime;
      if (time > 5) {
        ant.setMarker(random(40));
        time = 0;
      }
      
      //ant.turnTo(new PVector(mouseX, mouseY));
      
      if (ant.lifetime <= 0) {
        deadAnts.add(ant);
      }
    }
    
    // remove dead ants from the game and add new instead
    if (deadAnts.size() > 0) {
      ants.removeAll(deadAnts);
      
      for (int i=0; i<deadAnts.size(); i++)
        spawnAnt();
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