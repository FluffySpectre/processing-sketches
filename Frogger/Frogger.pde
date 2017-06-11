float grid = 50;

Frog frog;
MoveableSprite[] cars;
MoveableSprite[] logs;

PImage curbstoneImg;

void resetGame() {
  frog = new Frog(width/2-grid/2, height-grid, grid, "frog.png");
}

void setup() {
  size(500, 600);
  
  // load required images
  curbstoneImg = loadImage("curbstone.png");
  
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
  fill(200);
  
  rect(0, 0, width, grid);
  
  // water
  fill(24, 24, 90);
  rect(0, height-grid*11, width, grid*4);
  
  drawSafetyZone(1);
  drawSafetyZone(7);
  
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
  
  frog.update();
  frog.render();
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
  }
}

void drawSafetyZone(int y) {
  for (int i=0; i<10; i++) {
    image(curbstoneImg, i*grid, height-grid*y, grid, grid);
  }
}