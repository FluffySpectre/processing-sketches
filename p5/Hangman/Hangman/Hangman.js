let words = ['alphabet', 'flower', 'beautiful', 'hello world'];
let word = '';
let guess = '';
let incorrectGuesses = [];

function setup() {
  createCanvas(600, 600);
  
  nextWord();
}


function draw() {
  background(51);
  
  // draw current word
  textSize(16);
  stroke(255);
  
  const wordWidth = textWidth(word) + word.length * 15;
  const singleCharWidth = wordWidth / word.length;
  
  for (let i = 0; i < word.length; i++) {
    if (word[i] == ' ') continue;
    
    const x1 = (width / 2 - wordWidth / 2) + (wordWidth * i / wordWidth * singleCharWidth);
    strokeWeight(2);
    line(singleCharWidth / 2 + x1, 300, x1 + singleCharWidth, 300);
    
    if (guess[i] != '-') {
      fill(255);
      strokeWeight(1);
      text(guess[i], 10 + x1, 290);
    }
  }
  
  // draw hangman
  strokeWeight(2);
  push();
  translate(width / 2, height);
  if (numIncorrectGuesses() >= 1) {
    line(0, 0, 0, -200);
  }
  if (numIncorrectGuesses() >= 2) {
    line(0, -200, 100, -200);
  }
  if (numIncorrectGuesses() >= 3) {
    line(0, -180, 20, -200);
  }
  if (numIncorrectGuesses() >= 4) {
    line(100, -200, 100, -170);
  }
  if (numIncorrectGuesses() >= 5) {
    circle(100, -160, 10);
  }
  if (numIncorrectGuesses() >= 6) {
    line(100, -160, 100, -100);
    line(100, -130, 120, -145);
    line(100, -130, 80, -145);
    line(100, -100, 80, -80);
    line(100, -100, 120, -80);
  }
  pop();
 
  // draw wrong guesses
  if (numIncorrectGuesses() > 0) {
    strokeWeight(1);
    fill(255);
    text("Wrong tries:", 20, height-30);
    text(incorrectGuesses.join(', '), 110, height-30);
  }
 
  // game over?
  if (gameOver()) {
    strokeWeight(1);
    fill(255);
    text("GAME OVER", width/2, 100);
    text("Press 'space' to restart", width/2, 120);
  }
}

function keyTyped() {
  if (gameOver()) {
    if (key === ' ')
      nextWord();
    return;
  }
  
  checkGuess(key);
}

function numIncorrectGuesses() {
  return incorrectGuesses.length;
}

function gameOver() {
  return numIncorrectGuesses() >= 6 || word === guess;
}

function nextWord() {
  word = random(words);
  guess = '';
  incorrectGuesses = [];
  for (let i = 0; i < word.length; i++) {
    if (word[i] != ' ') guess += '-';
    else guess += ' ';
  }
}

function checkGuess(character) {
  let guessCorrect = false;
  for (let i = 0; i < word.length; i++) {
    if (word[i] == character) {
      guess = setCharAt(guess, i, character);
      guessCorrect = true;
    } 
  }
  
  if (!guessCorrect) {
    incorrectGuesses.push(character);
  }
}

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + chr + str.substr(index + 1);
}
