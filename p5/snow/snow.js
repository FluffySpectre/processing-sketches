var quantity = 300;
var xPosition = [];
var yPosition = [];
var flakeSize = [];
var direction = [];
var minFlakeSize = 1;
var maxFlakeSize = 6;
var snowColor = 220;
var snowSpeed = 0.6;

var shootingStars = [];
var santa; 
var houses = [];
var nextShootingStar;

var nextPoemTime = 0;
var bellSound;
var currentPoemIndex = 0;
var poemElement;
var poems = [
  'Voller Sanftmut sind die Mienen<br>und voll Güte ist die Seele,<br>sie sind stets bereit zu dienen,<br>deshalb nennt man sie Kamele.',
  'Frieden auf Erden bliebe bestehen,<br>wenn die Besinnung von Weihnachten nicht würde gehen.',
  'Weihnachten ist eine sehr schöne Zeit,<br>sie soll Euch bringen Freude, Glück und Zufriedenheit.',
  'Leise kommt ein Glockenklang<br>Und singt von Freude, Hoffnung, Liebe.<br>Sag, was ist das für ein Zauberklang<br>Und wann beginnt der Friede?',
  //'Niemand weiß, was wird noch kommen,<br>darum sollten wir besonnen<br>vorwärts schauen und bedenken,<br>das dass, was wir zur Weihnacht schenken,<br>nur ein Ausdruck der Liebe ist,<br>wobei dabei man oft vergisst:<br>Es kommt besonders darauf an,<br>das man mit Liebe schenken kann.',
  'Kerzenschein und Christlaterne<br>leuchten hell die Weihnacht\' ein.<br>Glocken läuten nah und ferne,<br>Friede soll auf Erden sein.',
  'Bei Tannenduft und Kerzenschein<br>möge alles fröhlich und friedlich sein.',
  'Fichten, Lametta, Kugeln und Lichter,<br>Bratäpfelduft und frohe Gesichter,<br>Freude am Schenken - das Herz wird so weit.<br>Ich wünsch allen: Eine fröhliche Weihnachtszeit!',
  'Zeit für Liebe und Gefühl,<br>heute bleibt´s nur draußen kühl.<br>Kerzenschein und Plätzchenduft -<br>Weihnachten liegt in der Luft.',
  'Nun leuchten helle Weihnachtskerzen<br>und zaubern Glück und Freud’ in allen Herzen.',
  'Geschenke kaufen, gutes Essen,<br>darüber sollten wir eines nicht vergessen,<br>den Sinn der Weihnacht, Zeit zum Lieben und zum Danken haben<br>und uns freuen über diese einfachen Gaben.',
  'Die Glocken läuten zur Heiligen Nacht,<br>ein jeder sich auf den Weg in die Kirche macht.<br>Doch Weihnachten sollte jeden Tag in den Herzen sein,<br>nicht nur bei Plätzchenduft und Kerzenschein.',
  'Eisenbahn und Puppenhaus, Puzzle, Bücher oder Spiele,<br>Wünsche hab ich ganz schön viele.<br>Auf das Christkind ist Verlass, das weiß ich ganz bestimmt,<br>jetzt muss ich nur noch artig sein, damit´s kein böses Ende nimmt.',
  //'Bratäpfel knistern im Ofen, der Punsch kocht auf dem Herd,<br>wir sitzen in der guten Stube und sind so unbeschwert.<br>Schau, war da nicht ein Blitzen und ein Leuchten, ein Kind mit Flügeln im weißen Kleid?<br>Das Christkind kommt uns wieder besuchen wie jedes Jahr zur Weihnachtszeit.',
  'Hörst Du die Glocke so zierlich und hell?<br>Lass uns ins Wohnzimmer eilen schnell.<br>Dort steht der schöne Weihnachtsbaum<br>und erfüllt mit Tannenduft den ganzen Raum.',
  'Winterzeit ist Weihnachtszeit<br>und die Herzen werden weit.<br>Harmonie wohin man blickt, friedliches Beisammensein.<br>Ach könnte das doch immer so sein.',
  'Kannst Du Dich erinnern an die Weihnachten deiner Kindheit?<br>Die Jungs im Anzug, die Mädchen im schönen Kleid,<br>knisternde Spannung und scheinbar endlose Zeit,<br>bis zur Bescherung schien es unendlich weit.'
];

function preload() {
  soundFormats('mp3', 'ogg');
  bellSound = loadSound('assets/bells.mp3');
}

function nextPoem() {
  currentPoemIndex++;
  if (currentPoemIndex >= poems.length)
    currentPoemIndex = 0;
  poemElement.html(poems[currentPoemIndex]);
  
  // play some jingle
  bellSound.setVolume(1);
  bellSound.play();
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
  noStroke();
  
  poemElement = createP('').size(width/2, height/2);
  poemElement.center();
  poemElement.addClass('poem-text');

  for(var i = 0; i < quantity; i++) {
    flakeSize[i] = round(random(minFlakeSize, maxFlakeSize));
    xPosition[i] = random(0, width);
    yPosition[i] = random(0, height);
    direction[i] = round(random(0, 1));
  }
  
  santa = new Santa();
  houses.push(new SmallHouse(100, height*(4/5)-60));
  houses.push(new SmallHouse(180, height*(4/5)-60));
  houses.push(new SmallHouse(260, height*(4/5)-60));
  
  nextShootingStar = millis() + random(30000, 80000);
}

function draw() {
  background(0,30,80);
  
  if (millis() > nextPoemTime) {
    nextPoem();
    nextPoemTime = millis() + 1000*60*15;
  }
  
  drawMoon();
  
  if (millis() > nextShootingStar) {
    shootingStars.push(new ShootingStar(floor(random(50, width-100)), 0));
    nextShootingStar = millis() + random(30000, 80000);
  }
  
  for(var i=shootingStars.length-1; i>=0; i--) {
    var s = shootingStars[i];
    s.update();
    s.render();
    
    if (s.isDead()) {
      shootingStars.splice(i, 1);
    }
  }
  
  fill(snowColor);
  rect(0,height*(4/5),width,height/5);
  
  drawSnowMan();
  drawTree();
  
  santa.update();
  santa.render();
  
  for (var h of houses) {
    h.update();
    h.render();
  }

  drawSnow();  
  drawRandomPoetry();
}

function drawSnow() {
  for(var i = 0; i < xPosition.length; i++) {
    
    ellipse(xPosition[i], yPosition[i], flakeSize[i], flakeSize[i]);
    
    if(direction[i] == 0) {
      xPosition[i] += map(flakeSize[i], minFlakeSize, maxFlakeSize, .1, .5);
    } else {
      xPosition[i] -= map(flakeSize[i], minFlakeSize, maxFlakeSize, .1, .5);
    }
    
    yPosition[i] += (flakeSize[i] + direction[i]) * snowSpeed; 
    
    if(xPosition[i] > width + flakeSize[i] || xPosition[i] < -flakeSize[i] || yPosition[i] > height + flakeSize[i]) {
      xPosition[i] = random(0, width);
      yPosition[i] = -flakeSize[i];
    } 
  }
}

function drawSnowMan() {
  var centerX = width*0.93;
  var centerY = height - 200;
  var offsetHand = 30;
  strokeWeight(1);
  stroke(210);
  fill(250);
  // Bottom circle (x,y,width,height) 
  
  // shadow
  push();
  noStroke();
  fill(21, 21, 21, 30);
  ellipse(centerX, centerY + 120, 100, 40);
  pop();
  
  ellipse(centerX,centerY+70,100,100);
  ellipse(centerX,centerY,80,80);
  
  push();
  translate(centerX,centerY-50);
  ellipse(0,0,60,60);
  // eyes
  fill(30);
  ellipse(-10, -10, 10, 10);
  ellipse(10, -10, 10, 10);
  // nose
  fill(255,165,0);
  ellipse(0, 0, 5, 5);
  // mouth
  fill(30);
  ellipse(-10, 10, 5, 5);
  ellipse(-6, 14, 5, 5);
  ellipse(0, 14, 5, 5);
  ellipse(6, 14, 5, 5);
  ellipse(10, 10, 5, 5);
  pop();
  
  // hands
  push();
  stroke(193,126,42);
  strokeWeight(4);
  line(centerX-80,centerY-offsetHand,centerX-40,centerY - 15);
  line(centerX+80,centerY-offsetHand,centerX+40,centerY - 15);
  pop();
}

function drawTree() {
  var centerX = width*0.8;
  var centerY = height/2;
  
  push();
  translate(centerX, centerY);
  // tree
  fill(0, 205, 50);
  triangle(-100, 300, 0, 0, 100, 300);
  
  // shadow
  noStroke();
  fill(21, 21, 21, 30);
  ellipse(0, 360, 200, 40);
  
  // stump
  fill(137, 100, 90);
  rect(-25, 300, 50, 60);  
  
  // star
  noStroke();
  //fill(255, 236, 23);
  fill(255, 255, 0);
  triangle(-25, 45, 0, 0, 25, 45);
  translate(0, 17);
  triangle(-25, 0, 0, 45, 25, 0);
  
  // lights
  fill(255, 0, 0);
  ellipse(10, 60, 10, 10);
  ellipse(-15, 90, 10, 10);
  ellipse(0, 140, 10, 10);
  ellipse(-40, 170, 10, 10);
  ellipse(50, 180, 10, 10);
  ellipse(10, 210, 10, 10);
  ellipse(-50, 230, 10, 10);
  ellipse(60, 240, 10, 10);
  ellipse(-5, 260, 10, 10);
  
  pop();
}

function drawMoon() {
  var centerX = width/4;
  var centerY = 200;
  
  push();
  noStroke();
  translate(centerX, centerY);
  fill(255);
  ellipse(0, 0, 100, 100);
  fill(0,30,80);
  ellipse(40, 0, 100, 100);
  pop();
}

function drawRandomPoetry() {
  push();
  noStroke();
  fill(0, 130);
  rect(0, 0, width, height);
  pop();
}