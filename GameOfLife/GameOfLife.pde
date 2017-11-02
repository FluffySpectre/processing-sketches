int[][] grid;
int w = 10;
int columns, rows;
boolean runSim = false;
int numGenerations = 0;

void reset() {
  grid = new int[columns][rows];
  numGenerations = 0;
  runSim = false;
}

void setup() {
  size(400, 400);
  
  columns = width/w;
  rows = height/w;
  
  reset();
}

void draw() {
  background(51);
  //noStroke();
  
  if (runSim) {
    generate();
    numGenerations++;
  } else {
    // use the mouse 
    if (mousePressed) {
      int x = mouseX/w;
      int y = mouseY/w;
      
      if (mouseButton == LEFT) {
        grid[x][y] = 1;
      }
      if (mouseButton == RIGHT) {
        grid[x][y] = 0;
      }
    }
  }
  
  // draw the grid
  stroke(0);
  for (int x=0; x<columns; x++) {
    for (int y=0; y<rows; y++) {
      int cellState = grid[x][y];
      
      // dead or alive?
      if (cellState == 0) fill(51); 
      else fill(255);
      
      rect(x*w, y*w, w, w);
    }
  }
  
  // display generation and sim state
  String simState = runSim ? "Running" : "Paused";
  fill(0, 200, 0);
  text("Generation: " + numGenerations + " - " + simState, 5, 15);
}

void randomizeGrid() {
  for (int x=1; x<columns-1; x++) {
    for (int y=1; y<rows-1; y++) {
      grid[x][y] = int(random(2));
    }
  }
}

void generate() {
  int[][] next = new int[columns][rows];
  boolean somethingChanged = false;
  
  for (int x=1; x<columns-1; x++) {
    for (int y=1; y<rows-1; y++) {
      int cellState = grid[x][y];
      
      // count neighbors of this cell
      int neighbors = 0;
      for (int i=-1; i<=1; i++) {
        for (int j=-1; j<=1; j++) {
          neighbors += grid[x+i][y+j];
        }
      }
      // remove ourself
      neighbors -= cellState;
      
      // apply rules
      int nextState = 0;
      if (cellState == 0 && neighbors == 3) nextState = 1;     // birth
      else if (cellState == 1 && neighbors < 2) nextState = 0; // death by loneliness
      else if (cellState == 1 && neighbors > 3) nextState = 0; // death by overpopulation
      else nextState = cellState;
      
      next[x][y] = nextState;
      
      // check for change 
      if (cellState != nextState)
        somethingChanged = true;
    }
  }
  
  // check for end of simulation
  if (!somethingChanged) {
    runSim = false;
  }
  
  grid = next;
}

void keyPressed() {
  if (keyCode == ENTER) {
    runSim = !runSim;
  } else if (key == 'r') {
    if (!runSim)
      randomizeGrid();
  } else if (key == 'c') {
    if (!runSim) 
      reset();
  }
}