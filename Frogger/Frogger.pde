float grid = 50;

Frog frog;
Car[] cars;
Log[] logs;

void resetGame() {
  frog = new Frog(width/2-grid/2, height-grid, grid);
}

void setup() {
  size(500, 500);
  
  cars = new Car[8];
  
  int index = 0;
  
  // ROW 1
  for (int i=0; i<2; i++) {
    float x = i * 300 + 50;
    cars[index] = new Car(x, height-grid*2, grid*2, grid, 2);
    index++;
  }
  
  // ROW 2
  for (int i=0; i<2; i++) {
    float x = i * 200 + 150;
    cars[index] = new Car(x, height-grid*3, grid, grid, 3.5);
    index++;
  }
  
  // ROW 3
  for (int i=0; i<4; i++) {
    float x = i * 150 + 25;
    cars[index] = new Car(x, height-grid*4, grid, grid, 1.2);
    index++;
  }
  
  logs = new Log[7];
  
  index = 0;
  
  // ROW 5
  for (int i=0; i<2; i++) {
    float x = i * 250 + 100;
    logs[index] = new Log(x, height-grid*6, grid*3, grid, 2.3);
    index++;
  }
  
  // ROW 6
  for (int i=0; i<3; i++) {
    float x = i * 200 + 30;
    logs[index] = new Log(x, height-grid*7, grid*2, grid, -1.3);
    index++;
  }
  
  // ROW 7
  for (int i=0; i<2; i++) {
    float x = i * 400 + 10;
    logs[index] = new Log(x, height-grid*8, grid*4, grid, 0.5);
    index++;
  }
  
  resetGame();
}

void draw() {
  background(0);
  fill(200);
  rect(0, height-grid, width, grid);
  rect(0, height-grid*5, width, grid);
  rect(0, 0, width, grid*2);
  
  // water
  fill(64, 164, 223);
  rect(0, height-grid*8, width, grid*3);
  
  for (Car car : cars) {
    car.move();
    car.show();
    
    if (frog.intersecting(car)) {
      resetGame();
    }
  }
  
  for (Log log : logs) {
    log.move();
    log.show();
  }
  
  // test for game over
  if (frog.y < height-grid*5 && frog.y >= grid*2) {
    boolean ok = false;
    for (Log log : logs) {
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
  frog.show();
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