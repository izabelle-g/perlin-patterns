function setup() {
  createCanvas(480, 480);
  initSketch();
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
    case 'Retro':
      retro();
      break;
    case 'Checkers':
      checkers();
      break;
    case 'Triangles':
      triangles();
      break;
    case 'Goof':
      goof();
      break;
    default:
      followField();
      showParticles();
      break;
  }
}