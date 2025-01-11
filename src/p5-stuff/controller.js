let particles = [];
let flowfield = [];
let palettes = [];

const grid = 16;
let num = 1500;
let zoff = 0;
let zInc = 0.00009;
var isLoop = true;

let cols, rows;


/*********** particle functions ***********/
/*
 * Creates the particles based on the passed number
 */
function createParticles() {
  for(let i = 0; i < num; i++) {
    particles[i] = new Particle(random(width), random(height));
  }
}

/*
 * Show the individual particles
 */
function showParticles() {
  background(255, 50);
  for(let p of particles) {
    p.showPoints();
    //p.showLines();
  }
}

/*
 * Make the particles follow the flow field
 */
function followField() {
  for(let p of particles) {
    let n = noise(p.pos.x, p.pos.y);
    
    let xIndex = floor(p.pos.x / grid);
    let yIndex = floor(p.pos.y / grid);
    xIndex = constrain(xIndex, 0, cols - 1);
    yIndex = constrain(yIndex, 0, rows - 1);
    
    index = xIndex + yIndex * cols;
    let v = flowfield[index][0];
    p.pos.add(v);
    
    if(!onScreen(p.pos)) {
      p.pos.x = random(width);
      p.pos.y = random(height);
    }
  }
}

/*
 * Checks if the particle is on screen
 */
function onScreen(p) {
  return p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height;
}


/*********** flowfield functions ***********/
/*
 * Create the flowfield array with undefined elements
 */
function setupFlowfield() {
  cols = floor(width / grid);
  rows = floor(height / grid);
  
  flowfield = new Array(cols * rows);
}

/*
 * Generates the flowfield and saves it into an array
 */
function generateFlowfield() {
  let inc = 0.1;
  let yoff = 0;
  
  // create flowfield
  for(let y = 0; y < rows; y++) {
    let xoff = 0;
    for(let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let n = noise(xoff, yoff, zoff);
      let angle = n * TAU;
      let v = p5.Vector.fromAngle(angle);
      
      xoff += inc;
      v.setMag(0.75);
      flowfield[index] = [v, x, y];
    }
    yoff += inc;
    zoff += zInc;
  }
}

/* 
 * Shows the direction the flowfield is pointing to.
 * Also acts as a template for other patterns such as scales()
 */
function showFlowfield() {
  background(255);
  for(let f of flowfield) {
    if(f != undefined) {
      push();
      translate(f[1] * grid, f[2] * grid);
      rotate(f[0].heading());
      strokeWeight(1);
      line(0, 0, grid, 0);
      pop();
    }
  }
}


/*********** sketch functions ***********/
/*
 * Initialize sketch after clearing
 */
function initSketch() {
  clear();
  background(255);
  createPalettes();
  createParticles();
  setupFlowfield();
  loop();
}


/*********** pattern functions ***********/
function checkers() {
  zInc = 0.0009;
  for(let y = 0; y < rows; y++) {
    for(let x = 0; x < cols; x++) {
      let n = noise(x, y, zoff);
      rect(x * grid, y * grid, grid, grid);
      fill(getColour(n));
      }
  }
  zoff += zInc;
}

function retro() {
  zInc = 0.0009;
  for(let y = 0; y < rows; y++) {
    for(let x = 0; x < cols; x++) {
      let n = noise(x, y, zoff);    
      stroke(getColour(n));
      strokeWeight(1);
      circle(x * grid, y * grid, n * TWO_PI);
    }
  }
  zoff += zInc;
}

function scales() {
  background(255, 4);
  zInc = 0.0009;
  for(let f of flowfield) {
    if(f != undefined) {
      let n = noise(f[0].x, f[0].y, zoff);
      stroke(getColour(n));
      push();
      translate(f[1] * grid, f[2] * grid);
      rotate(f[0].heading());
      strokeWeight(1);
      line(0, 0, grid, 0);
      pop();
    }
  }
}

function circles() {
  zInc = 0.0000002;
  for(let f of flowfield) {
    if(f != undefined) {
      let n = noise(f[1], f[2]);
      rotate(f[0].heading(PI));
      stroke(getColour(n));
      push();
      translate(f[1] * grid, f[2] * grid);
      strokeWeight(1);
      line(0, 0, grid, 0);
      pop();
    }
  }
}

function triangles() {
  zInc = 0.0005;
  for(let y = 0; y < rows; y++) {
    for(let x = 0; x < cols; x++) {
      let n = noise(x, y, zoff);
      let ax = x * grid;
      let ay = y * grid;
      let bx = (x * grid) + grid;
      let by = (y * grid) + grid;

      strokeWeight(0);
      fill(getColour(n));
      switch(floor(map(n, 0, 1, 0, 4))) {
        case 0:
          // NW
          triangle(ax, by, ax, ay, bx, ay);
          break;
        case 1:
          // NE
          triangle(ax, ay, bx, ay, bx, by);
          break;
        case 2:
          // SW
          triangle(ax, ay, ax, by, bx, by);
          break;
        default:
          // SE
          triangle(ax, by, bx, by, bx, ay);
          break;
      }
    }
  }
  zoff += zInc;
}

function goof() {
  // comment this line to un-goof
  background(255);
  for(let f of flowfield) {
    if(f != undefined) {
      let n = noise(f[1], f[2], zoff);
      push();
      translate(f[1] * grid, f[2] * grid);
      rotate(f[0].heading());
      strokeWeight(0);
      fill(getColour(n));
      rect(f[1] * grid, f[2] * grid, grid, grid);
      pop();
    }
  }
}

function test() {
  
}

/*********** colour functions ***********/
/*
 * Creates the palettes associated with each emotion
 */
function createPalettes() {
  palettes = {
    happy:    [ color("#C99AC5"),
                color("#D52379"),
                color("#78B1D2"),
                color("#FECA77"),
                color("#CAC257") ],
    sad:      [ color("#4655A6"),
                color("#10496A"),
                color("#9BB0DB"),
                color("#1862AF"),
                color("#3649A1") ],
    fear:     [ color("#AA503C"),
                color("#D93126"),
                color("#F68C74"),
                color("#22406F"),
                color("#716879") ],
    disgust:  [ color("#467048"),
                color("#817C34"),
                color("#7B471D"),
                color("#B7D431"),
                color("#461310") ],
    surprise: [ color("#7459A6"),
                color("#476CB3"),
                color("#F69BAE"),
                color("#F37E38"),
                color("#EA2A57") ],
    anger:    [ color("#80311A"),
                color("#EE3524"),
                color("#F36C22"),
                color("#AA1E24"),
                color("#000000") ],
    test:     [ color("#ffd670"),
                color("#ff70a6"),
                color("#e9ff70"),
                color("#70d6ff"),
                color("#ff9770") ]
  };
}

const emotionColours = {
  happy: [color("#FFD3ACA")],
  sad: [],
  anger: [],
  neutral: [],
  disgust: [],
  fear: [],
  surprise: []
};

/*
 * Returns the colour based on the emotion analysis and the noise
 */
function getColour(noiseVal) {
  let colour;
  let p = palettes[emotion];
  
  if(noiseVal <= 0.375) {
    let n = map(noiseVal, 0, 0.375, 0, 1);
    colour = lerpColor(p[0], p[1], n);
  }
  else if(noiseVal > 0.375 && noiseVal <= 0.50) {
    let n = map(noiseVal, 0.375, 0.50, 0, 1);
    colour = lerpColor(p[1], p[2], n);
  }
  else if(noiseVal >= 0.625) {
    let n = map(noiseVal, 0.625, 1, 0, 1);
    colour = lerpColor(p[3], p[4], n); 
  }
  else {
    let n = map(noiseVal, 0.50, 0.625, 0, 1);
    colour = lerpColor(p[2], p[3], n);
}
  
  return colour;
}
