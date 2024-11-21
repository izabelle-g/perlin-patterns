let grid = 16;
let zoff = 0;
let inc = 0.1;
const num = 1000;

let particles = [];
let grdMap = [];

let cols, rows, flowfield, palette, pattern;

function setup() {
  createCanvas(640, 320);
  
  // split the left half into a grid
  cols = floor((width / 2) / grid);
  rows = floor(height / grid);
  
  // create a flowfield and make new particle objects
  flowfield = new Array(cols * rows);
  for(let i = 0; i < num; i++) {
    particles[i] = createVector(random(width / 2), random(height));
  }
  
  /* 
   * Defines a gradient colour palette of 5 colours.
   * The first colour is designated as 'white' and the fifth colour 
   * is designated as 'black' if compared to a grayscale.
   */
  grdMap = [ [color("#02080b"),
              color("#d42a20"),
              color("#fcf3d9"),
              color("#0e638e"),
              color("#fac22b")],
             [color("#9b5de5"),
              color("#f15bb5"),
              color("#fee440"),
              color("#00bbf9"),
              color("#00f5d4")],
             [color("#372134"),
              color("#474476"),
              color("#4888b7"),
              color("#6dbcb9"),
              color("#8cefb6")] ];
  
  // using a select button for now
  palette = createSelect();
  palette.position(321, 0);
  
  palette.option('Palette 1', '0');
  palette.option('Palette 2', '1');
  palette.option('Palette 3', '2');
  palette.selected('Palette 1');
  
  pattern = createSelect();
  pattern.position(321, 20);
  
  pattern.option('Checkers', '0');
  pattern.option('Retro', '1');
  pattern.option('Test', 't');
  pattern.selected('t');
  pattern.changed(clear);
}

/*
*  Returns a colour from the gradient map based on the noise value
*  generated.  The gradient map palette can be selected using the
*  'grd' variable.
*/
function getColour(noiseVal) {
  var grd = parseInt(palette.selected());
  
  if(noiseVal <= 0.375) {
    let n = map(noiseVal, 0, 0.375, 0, 1);
    colour = lerpColor(grdMap[grd][0], grdMap[grd][1], n);
  }
  else if(noiseVal > 0.375 && noiseVal <= 0.50) {
    let n = map(noiseVal, 0.375, 0.50, 0, 1);
    colour = lerpColor(grdMap[grd][1], grdMap[grd][2], n);
  }
  else if(noiseVal >= 0.625) {
    let n = map(noiseVal, 0.625, 1, 0, 1);
    colour = lerpColor(grdMap[grd][3], grdMap[grd][4], n); 
  }
  else {
    let n = map(noiseVal, 0.50, 0.625, 0, 1);
    colour = lerpColor(grdMap[grd][2], grdMap[grd][3], n);
  }
  
  return colour;
}

function onScreen(p) {
  return p.x >= 0 && p.x <= (width / 2) && p.y >= 0 && p.y <=                height;
}

function updateFlowfield() {
  // background(255);  // for drawing the direction
  
  let yoff = 0;
  for(let y = 0; y < rows; y++) {
    let xoff = 0;
    for(let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let n = noise(xoff, yoff, zoff);
      
      // if angle is ~ TAU or TWO_PI, it flows from left to right
      // if angle is > TAU or TWO_PI, it squiggles there
      let angle = n * TAU;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.5);
      xoff += inc;
      
      // store the vector directions
      flowfield[index] = v;
      
      // draw the diretion of the flowfield
      /*
      stroke(getColour(n));
      push();
      translate(x * grid, y * grid);
      rotate(v.heading());
      strokeWeight(1);
      line(0, 0, grid, 0);
      pop();*/
  }
    yoff += inc;
    zoff += 0.0003;
  }
}

/*************** PATTERNS ****************/
function checkers() {
  for(var y = 0; y < rows; y++) {
    for(var x = 0; x < cols; x++) {
      var n = noise(x, y, zoff);
      rect(x * grid, y * grid, grid, grid);
      fill(getColour(n));
  }
     zoff += 0.0009;
  }
}

function retro() {
  for(var y = 0; y < rows; y++) {
    for(var x = 0; x < cols; x++) {
      var n = noise(x, y, zoff);
      stroke(getColour(n));
      circle(x * grid, y * grid, n * TWO_PI);
    }
     zoff += 0.0009;
  }
}

function flowyParticles() {
  background(255, 30);
  updateFlowfield();
  
  for(let i = 0; i < num; i++) {
    let p = particles[i];
    let n = noise(p.x, p.y);
 
    // map them to grid and ensure they're within bounds
    let xIndex = floor(p.x / grid);
    let yIndex = floor(p.y / grid);
    xIndex = constrain(xIndex, 0, cols - 1);
    yIndex = constrain(yIndex, 0, rows - 1);
    
    // get the vector direction and then apply to particle
    index = xIndex + yIndex * cols;
    let v = flowfield[index];
    p.add(v);
    
    // draw particle
    strokeWeight(n * 5);
    stroke(getColour(n));
    point(p.x, p.y);

    // teleport partcile to random part of screen
    if(!onScreen(p)) {
      p.x = random(width / 2);
      p.y = random(height);
    }
  }
}

function test() {
  background(255, 10);
  updateFlowfield();
  
  for(let i = 0; i < num; i++) {
    let p = particles[i];
    let n = noise(p.x, p.y);
 
    // map them to grid and ensure they're within bounds
    let xIndex = floor(p.x / grid);
    let yIndex = floor(p.y / grid);
    xIndex = constrain(xIndex, 0, cols - 1);
    yIndex = constrain(yIndex, 0, rows - 1);
    
    // get the vector direction and then apply to particle
    index = xIndex + yIndex * cols;
    let v = flowfield[index];
    p.add(v);
    
    // draw particle
    strokeWeight(1);
    stroke(getColour(n));
    point(p.x, p.y);
    
    // teleport partcile to random part of screen
    if(!onScreen(p)) {
      p.x = random(width / 2);
      p.y = random(height);
    }
  }
}

function draw() {
  switch(pattern.selected()) {
    case '0': checkers(); break;
    case '1': retro(); break;
    default: test(); break;
  }
}