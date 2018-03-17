String pi;
int[] directions = new int[] { 0, 36, 72, 108, 144, 180, 216, 252, 288, 324 };
int index = 0;
ArrayList<Point> points = new ArrayList<Point>();
PGraphics pg;
int iterationsPerFrame = 10;
boolean fastForward = false;

void setup() {
  size(800, 800);
  pg = createGraphics(2000, 2000);
  
  pi = loadStrings("pi-2000.txt")[0];
  
  points.add(new Point(0, 0, 3));
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

  float radius = pg.width*0.023; // 2000
  //float radius = width*0.035; // 500
  float x = cos(radians(dir)) * radius;
  float y = sin(radians(dir)) * radius;
  
  points.add(new Point(x, y, digit));
}

void render() {
  pg.beginDraw();
  pg.colorMode(HSB, 1.0);
  pg.background(0, 0, 0);
  pg.strokeWeight(2);
  
  // draw pi in the background
  pg.fill(0, 0, 0.2);
  int w = 51;
  int margin = 80;
  
  pg.textSize(w/2);
  int idx = 0;
  for (int y=margin; y<pg.height-margin-30; y+=w) {
    for (int x=margin; x<pg.width-margin-30; x+=w) {
      int digit = points.get(idx).digit;
      idx++;
      if (idx >= points.size()-1) {
        idx = points.size()-1;
        digit = 0;
      }
      
      pg.noStroke();
      pg.fill(0, 0, 0.2);
      pg.textAlign(CENTER, CENTER);
      pg.text(digit, x+30, y+30);
    }
  }
  
  //translate(pg.width*0.3, pg.height*0.82); // 1000
  pg.translate(pg.width*0.29, pg.height*0.855); // 2000 square
  //translate(width*0.29, height*0.825); // 2000 rectangular
  //translate(width*0.1, height*0.6); // 500
  pg.rotate(radians(-90));
  
  int i = 0;
  for (Point p : points) {
    float hue = map(i, 0, pi.length(), 0.0, 1.0);
    pg.fill(hue, 1, 1, 0.9);
    pg.stroke(hue, 1, 1, 0.9);
    pg.line(0, 0, p.x, p.y);
    
    //float elSize = map(p.digit, 0, 9, 1, 8);
    if (i == 0) {
      pg.fill(0, 0, 1, 0.9);
      pg.stroke(0, 0, 1, 0.9);
    } else if (i == points.size()-1) {
      pg.fill(0, 0, 1, 0.9);
      pg.stroke(0, 0, 1, 0.9);
    }
    pg.ellipse(p.x, p.y, pg.width*0.005, pg.width*0.005);
    
    //pg.noFill();
    //pg.stroke(1);
    //pg.rect(x, y, w, w);
    //pg.textAlign(CENTER, CENTER);
    //pg.text(p.digit, i*, p.y);
    
    pg.translate(p.x, p.y);
    
    i++;
  }
  
  pg.endDraw();
  image(pg, 0, 0, width, height);
  pg.save("pi-lines.png");
}
