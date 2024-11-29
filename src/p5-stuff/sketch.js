function setup() {
  createCanvas(320, 320);
  createPalettes();
  createParticles();
  setupFlowfield();
  initInterface();
}

function draw() {
  generateFlowfield();
  //showFlowfield();
  
  switch(pattern.selected()) {
    case 'Flow':
      followField();
      showParticles();
      break;
    case 'Scales':
      scales();
      break;
    case 'Circles':
      circles();
      break;
    default: 
      gridBased(pattern.selected());
      break;
  }
}