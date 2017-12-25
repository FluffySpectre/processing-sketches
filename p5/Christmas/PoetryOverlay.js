function PoetryOverlay(bSound) {
  this.nextPoemTime = 0;
  this.bellSound = bSound;
  this.currentPoemIndex = 0;
  this.poemElement;
  this.poems = [
    'Voller Sanftmut sind die Mienen<br>und voll Güte ist die Seele,<br>sie sind stets bereit zu dienen,<br>deshalb nennt man sie Kamele.',
    'Frieden auf Erden bliebe bestehen,<br>wenn die Besinnung von Weihnachten nicht würde gehen.',
    'Weihnachten ist eine sehr schöne Zeit,<br>sie soll Euch bringen Freude, Glück und Zufriedenheit.',
    'Leise kommt ein Glockenklang<br>Und singt von Freude, Hoffnung, Liebe.<br>Sag, was ist das für ein Zauberklang<br>Und wann beginnt der Friede?',
    //'Niemand weiß, was wird noch kommen,<br>darum sollten wir besonnen<br>vorwärts schauen und bedenken,<br>das dass, was wir zur Weihnacht schenken,<br>nur ein Ausdruck der Liebe ist,<br>wobei dabei man oft vergisst:<br>Es kommt besonders darauf an,<br>das man mit Liebe schenken kann.',
    'Kerzenschein und Christlaterne<br>leuchten hell die Weihnacht\' ein.<br>Glocken läuten nah und ferne,<br>Friede soll auf Erden sein.',
    'Bei Tannenduft und Kerzenschein<br>möge alles fröhlich und friedlich sein.',
    'Fichten, Lametta, Kugeln und Lichter,<br>Bratäpfelduft und frohe Gesichter,<br>Freude am Schenken - das Herz wird so weit.<br>Ich wünsch allen: Eine fröhliche Weihnachtszeit!',
    'Zeit für Liebe und Gefühl,<br>heute bleibt\'s nur draußen kühl.<br>Kerzenschein und Plätzchenduft -<br>Weihnachten liegt in der Luft.',
    'Nun leuchten helle Weihnachtskerzen<br>und zaubern Glück und Freud’ in allen Herzen.',
    'Geschenke kaufen, gutes Essen,<br>darüber sollten wir eines nicht vergessen,<br>den Sinn der Weihnacht, Zeit zum Lieben und zum Danken haben<br>und uns freuen über diese einfachen Gaben.',
    'Die Glocken läuten zur Heiligen Nacht,<br>ein jeder sich auf den Weg in die Kirche macht.<br>Doch Weihnachten sollte jeden Tag in den Herzen sein,<br>nicht nur bei Plätzchenduft und Kerzenschein.',
    'Eisenbahn und Puppenhaus, Puzzle, Bücher oder Spiele,<br>Wünsche hab ich ganz schön viele.<br>Auf das Christkind ist Verlass, das weiß ich ganz bestimmt,<br>jetzt muss ich nur noch artig sein, damit\'s kein böses Ende nimmt.',
    //'Bratäpfel knistern im Ofen, der Punsch kocht auf dem Herd,<br>wir sitzen in der guten Stube und sind so unbeschwert.<br>Schau, war da nicht ein Blitzen und ein Leuchten, ein Kind mit Flügeln im weißen Kleid?<br>Das Christkind kommt uns wieder besuchen wie jedes Jahr zur Weihnachtszeit.',
    'Hörst Du die Glocke so zierlich und hell?<br>Lass uns ins Wohnzimmer eilen schnell.<br>Dort steht der schöne Weihnachtsbaum<br>und erfüllt mit Tannenduft den ganzen Raum.',
    'Winterzeit ist Weihnachtszeit<br>und die Herzen werden weit.<br>Harmonie wohin man blickt, friedliches Beisammensein.<br>Ach könnte das doch immer so sein.',
    'Kannst Du Dich erinnern an die Weihnachten deiner Kindheit?<br>Die Jungs im Anzug, die Mädchen im schönen Kleid,<br>knisternde Spannung und scheinbar endlose Zeit,<br>bis zur Bescherung schien es unendlich weit.'
  ];
  
  this.poemElement = createP('').size(width/2, height/2);
  this.poemElement.center();
  this.poemElement.addClass('poem-text');

  this.run = function() {
    this.update();
    this.render();
  };

  this.update = function() {
    if (millis() > this.nextPoemTime) {
      this.nextPoem();
      this.nextPoemTime = millis() + 1000*60*15;
    }
  };
  
  this.render = function() {
    push();
    noStroke();
    fill(0, 130);
    rect(0, 0, width, height);
    pop();
  };
  
  this.nextPoem = function() {
    this.currentPoemIndex++;
    if (this.currentPoemIndex >= this.poems.length)
      this.currentPoemIndex = 0;
    this.poemElement.html(this.poems[this.currentPoemIndex]);
    
    // play some jingle
    this.bellSound.setVolume(1);
    this.bellSound.play();
  };
}