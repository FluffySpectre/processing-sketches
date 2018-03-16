String pi;
int[] directions = new int[] { 0, 36, 72, 108, 144, 180, 216, 252, 288, 324 };
int index = 0;
ArrayList<Point> points = new ArrayList<Point>();
PGraphics pg;
int iterationsPerFrame = 5;
boolean fastForward = false;

void setup() {
  size(800, 800);
  pg = createGraphics(1000, 1000);
  
  pi = loadStrings("pi-1000.txt")[0];
}

void draw() {
  println(index);
  
  if (keyPressed && key == ' ') {
    // fast forward
    iterationsPerFrame = 100000;
    fastForward = true;
  }
  
  for (int i=0; i<iterationsPerFrame; i++) {
    addPoint();

    index++;
    if (index >= pi.length()) {
      println("Calculation done. Rendering...");
      render();
      println("Finished!");
      noLoop();
      return;
    }
  }
  
  if (!fastForward)
    render();
}

void addPoint() {
  String s = "" + pi.charAt(index);
  int digit = int(s);
  int dir = directions[digit];

  float radius = 20;
  float x = cos(radians(dir)) * radius;
  float y = sin(radians(dir)) * radius;
  
  points.add(new Point(x, y, digit));
}

void render() {
  pg.beginDraw();
  pg.colorMode(HSB, 1.0);
  pg.translate(pg.width/4, pg.height*0.7);
  pg.background(0, 0, 0);
  pg.rotate(radians(-90));
  pg.strokeWeight(2);
  
  int i = 0;
  for (Point p : points) {
    float hue = map(i, 0, pi.length(), 0.0, 1.0);
    pg.stroke(hue, 1, 1, 0.7);
    pg.line(0, 0, p.x, p.y);
    pg.ellipse(p.x, p.y, 5, 5);
    //pg.textAlign(CENTER, CENTER);
    //pg.text(p.digit, p.x, p.y);
    pg.translate(p.x, p.y);
    
    i++;
  }
  
  pg.endDraw();
  image(pg, 0, 0, width, height);
  pg.save("pi-lines.png");
}
