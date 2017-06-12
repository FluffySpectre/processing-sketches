class AntHill extends Object {
  ArrayList<Ant> ants = new ArrayList<Ant>();
  
  String[] antNames = new String[] {
    "Magda", "Horst", "Wilhelm", "Bernhard", "Anna", "Joachim", "Hannelore", "Björn"
  };
  
  AntHill(PVector position, PVector rotation, PVector scale) {
    super(position, rotation, scale);
  }
  
  void spawnAnt() {
    String antName = antNames[Math.round(random(antNames.length-1))];
    
    Ant ant = new Ant(antName, new PVector(position.x, position.y), new PVector(random(-1, 1), random(-1, 1)), new PVector(5, 2), random(1.3, 2));
    ants.add(ant);
  }
  
  void removeAnt(Ant ant) {
    ants.remove(ant);
  }
  
  void update() {
    ArrayList<Ant> deadAnts = new ArrayList<Ant>();
    
    // update ants
    for (Ant ant : ants) {
      ant.update();
      ant.render();
      
      if (ant.hitsWalls()) {
        ant.turnTo(new PVector(random(-1, 1), random(-1, 1)));
      }
      
      //ant.turnTo(new PVector(mouseX, mouseY));
      
      if (ant.lifetime <= 0) {
        deadAnts.add(ant);
      }
    }
    
    // rmeove dead ants from the game and add new instead
    if (deadAnts.size() > 0) {
      ants.removeAll(deadAnts);
      
      for (int i=0; i<deadAnts.size(); i++)
        spawnAnt();
    }
  }
  
  void render() {
    fill(222, 184, 135);
    ellipse(position.x, position.y, scale.x, scale.y);
  }
}