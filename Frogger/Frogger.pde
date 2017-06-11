float grid = 50;

boolean gameOver = false;

Frog frog;
Sprite[] finishedFrogs;
MoveableSprite[] cars;
MoveableSprite[] logs;
Endzone[] endZones;

PImage curbstoneImg;

void resetGame() {
  frog = new Frog(width/2-grid/2, height-grid, grid, "frog.png");
  
  if (gameOver) {
    frog.isControllable = false;
  }
}

void restartGame() {
  setup();
}

void setup() {
  size(500, 600);
  
  gameOver = false;
  
  // load required images
  curbstoneImg = loadImage("curbstone.png");
  
  endZones = new Endzone[4];
  endZones[0] = new Endzone(0, 0, grid, grid, "safezone.png");
  endZones[1] = new Endzone(width*0.33-grid/2, 0, grid, grid, "safezone.png");
  endZones[2] = new Endzone(width*0.66-grid/2, 0, grid, grid, "safezone.png");
  endZones[3] = new Endzone(width-grid, 0, grid, grid, "safezone.png");
  
  finishedFrogs = new Sprite[endZones.length];
  
  cars = new MoveableSprite[11];
  
  int index = 0;
  int row = 2;
  
  // ROW 1
  for (int i=0; i<2; i++) {
    float x = i * 300 + 50;
    cars[index] = new MoveableSprite(x, height-grid*row, grid, grid, "car_1.png", -2);
    index++;
  }
  row++;
  
  // ROW 2
  for (int i=0; i<2; i++) {
    float x = i * 200 + 150;
    cars[index] = new MoveableSprite(x, height-grid*row, grid, grid, "car_2.png", 3.5);
    index++;
  }
  row++;
  
  // ROW 3
  for (int i=0; i<4; i++) {
    float x = i * 150 + 25;
    cars[index] = new MoveableSprite(x, height-grid*row, grid, grid, "car_3.png", -1.2);
    index++;
  }
  row++;
  
  // ROW 4
  for (int i=0; i<1; i++) {
    float x = i * 275 + 20;
    cars[index] = new MoveableSprite(x, height-grid*row, grid, grid, "car_4.png", 2.3);
    index++;
  }
  row++;
  
  // ROW 4
  for (int i=0; i<2; i++) {
    float x = i * 300 + 50;
    cars[index] = new MoveableSprite(x, height-grid*row, grid*3, grid, "truck.png", -0.9);
    index++;
  }
  row++;
  row++;
  
  logs = new MoveableSprite[10];
  
  index = 0;
  
  // ROW 5
  for (int i=0; i<2; i++) {
    float x = i * 250 + 100;
    logs[index] = new MoveableSprite(x, height-grid*row, grid*2, grid, "log_1.png", 2.3);
    index++;
  }
  row++;
  
  // ROW 6
  for (int i=0; i<3; i++) {
    float x = i * 200 + 30;
    logs[index] = new MoveableSprite(x, height-grid*row, grid*3, grid, "log_2.png", -1.3);
    index++;
  }
  row++;
  
  // ROW 7
  for (int i=0; i<2; i++) {
    float x = i * 400 + 10;
    logs[index] = new MoveableSprite(x, height-grid*row, grid*4, grid, "log_2.png", 0.5);
    index++;
  }
  row++;
  
  // ROW 8
  for (int i=0; i<3; i++) {
    float x = i * 300 + 80;
    logs[index] = new MoveableSprite(x, height-grid*row, grid*4, grid, "log_2.png", -0.8);
    index++;
  }
  row++;
  
  resetGame();
}

void draw() {
  background(24, 24, 24);
  
  // water
  fill(24, 24, 90);
  rect(0, 0, width, grid*5);
  
  drawSafetyZone(1);
  drawSafetyZone(7);
  
  int endZoneIndex = 0;
  for (Endzone endZone : endZones) {
    endZone.render();
    
    if (endZone.isFree && frog.intersecting(endZone)) {
      // if the player (frog) reached an endzone, create a new frog at this position and reset the game
      Sprite finishedFrog = new Sprite(endZone.x, endZone.y, grid, grid, "frog.png");
      finishedFrogs[endZoneIndex] = finishedFrog;
      
      endZone.isFree = false;
      
      // check for end of game
      boolean gameFinished = true;
      for (Endzone ez : endZones) {
        if (ez.isFree) gameFinished = false;
      }
      if (gameFinished) {
        gameOver = true; 
      }
      
      resetGame();
    }
    
    endZoneIndex++;
  }
  
  for (Sprite frog : finishedFrogs) {
    if (frog != null) {
      frog.render();
    }
  }
  
  for (MoveableSprite car : cars) {
    car.update();
    car.render();
    
    if (frog.intersecting(car)) {
      resetGame();
    }
  }
  
  for (MoveableSprite log : logs) {
    log.update();
    log.render();
  }
  
  // test for game over
  if (frog.y < height-grid*7 && frog.y >= grid) {
    boolean ok = false;
    for (MoveableSprite log : logs) {
      if (frog.intersecting(log)) {
        ok = true;
        frog.attach(log);
      }
    }
    if (!ok)
      resetGame();
  } else {
    frog.attach(null);
  }
  
  if (frog != null) {
    frog.update();
    frog.render();
  }
  
  // draw game over state
  if (gameOver) {
    fill(0);
    rect(width/2-150, height/2-50, 300, 100);
    fill(0, 102, 153);
    textSize(32);
    text("You won!", width/2-75, height/2-10);
    textSize(16);
    text("Press R to start again.", width/2-80, height/2+30);
  }
}

void keyPressed() {
  if (keyCode == UP) {
    frog.move(0, -1);
  } else if (keyCode == DOWN) {
    frog.move(0, 1);
  } else if (keyCode == LEFT) {
    frog.move(-1, 0);
  } else if (keyCode == RIGHT) {
    frog.move(1, 0);
  } else if (key == 'r') {
    restartGame();
  }
}

void drawSafetyZone(int y) {
  for (int i=0; i<10; i++) {
    image(curbstoneImg, i*grid, height-grid*y, grid, grid);
  }
}