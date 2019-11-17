let population;
let target;
let lifespan = 1000;
let maxforce = 0.2;
let count = 0;
let popCount = 1;
let lifeP, popP, bestFitnessP;
//let ox = 150, oy = 350, ow = 300, oh = 20;
let obstacles;
let bestFitness = 0;

function setup() {
  createCanvas(600, 600);

  population = new Population();
  target = createVector(width/2, 50);

  obstacles = [];
  obstacles[0] = { x: 150, y: 300, w: 300, h: 20 };
  //obstacles[1] = { x: width-300, y: 200, w: 300, h: 20 };

  lifeP = createP();
  popP = createP();
  bestFitnessP = createP();
}

function draw() {
  background(51);

  population.run();

  lifeP.html('Lebensdauer: ' + count);
  popP.html('Generation: ' + popCount);
  bestFitnessP.html('Beste Fitness: ' + bestFitness);
  count++;
  if (count === lifespan || population.allComplete()) {
    population.evaluation();
    population.selection();

    count = 0;
    popCount++;
    if (popCount > 200) {
      //population = new Population();
      //popCount = 0;
    }
  }

  noStroke();
  fill(255);
  for (let o of obstacles) {
    rect(o.x, o.y, o.w, o.h);
  } 

  fill(0, 220, 0);
  ellipse(target.x, target.y, 30, 30);
}


// objects
class Population {
  constructor() {
    this.rockets = [];
    this.popsize = 50;
    this.matingpool = [];

    for (let i=0; i<this.popsize; i++) {
      this.rockets[i] = new Rocket();
    }
  }

  allComplete() {
    let allComplete = true;
    for (let r of this.rockets) {
      if (!r.completed && !r.crashed) allComplete = false;
    }
    return allComplete;
  }

  evaluation() {
    let maxfit = 0;

    for (let r of this.rockets) {
      r.calcFitness();

      if (r.fitness > maxfit) maxfit = r.fitness;
    }

    if (maxfit > bestFitness) bestFitness = maxfit;

    for (let r of this.rockets) {
      r.fitness /= maxfit;
    } 

    this.matingpool = [];
    for (let i=0; i<this.popsize; i++) {
      let n = this.rockets[i].fitness * 100;
      for (let j=0; j<n; j++) {
        this.matingpool.push(this.rockets[i]);
      }
    }
  }

  selection() {
    let newrockets = [];

    for (let i=0; i<this.rockets.length; i++) {
      let parentA = random(this.matingpool).dna;
      let parentB = random(this.matingpool).dna;
      let child = parentA.crossover(parentB);
      child.mutation();
      newrockets[i] = new Rocket(child);
    }

    this.rockets = newrockets;
  }

  run() {
    for (let rocket of this.rockets) {
      rocket.update();
      rocket.render();
    }
  }
}

class Rocket {
  constructor(dna) {
    this.acc = createVector();
    this.vel = createVector();
    this.pos = createVector(width/2, height);
    this.fitness = 0;
    this.completed = false;
    this.crashed = false;
    if (dna)
      this.dna = dna;
    else 
      this.dna = new DNA();
  }

  calcFitness() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    this.fitness = map(d, 0, width, width, 0);

    if (this.completed) this.fitness *= 10;
    if (this.crashed) this.fitness /= 10;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    if (d < 15) this.completed = true;

    // check for obstacles
    for (let o of obstacles) {
      if (this.pos.x > o.x && this.pos.x < o.x + o.w && this.pos.y > o.y && this.pos.y < o.y + o.h) {
        this.crashed = true;
      }
    }

    if (this.pos.x < 0 || this.pos.x > width) this.crashed = true;
    if (this.pos.y < 0 || this.pos.y > height) this.crashed = true;

    this.applyForce(this.dna.genes[count]);
    if (!this.completed && !this.crashed) {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.vel.limit(4);
    }
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    noStroke();
    fill(200, 150);
    rect(0, 0, 20, 5);
    pop();
  }
}

class DNA {
  constructor(genes) {
    if (genes) {
      this.genes = genes;
    } else {
      this.genes = [];
      for (let i=0; i<lifespan; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxforce);
      }
    }
  }

  crossover(partner) {
    let newgenes = [];
    let mid = floor(random(this.genes.length));
    
    for (let i=0; i<this.genes.length; i++) {
      if (i > mid) {
        newgenes[i] = this.genes[i];
      } else {
        newgenes[i] = partner.genes[i];
      }
    }

    return new DNA(newgenes);
  }

  mutation() {
    for (let i=0; i<this.genes.length; i++) {
      if (random(1) < 0.01) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxforce);
      }
    }
  }
}
