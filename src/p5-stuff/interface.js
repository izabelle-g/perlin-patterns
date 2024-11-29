var pattern = 'Test';

/***********  ***********/
function initInterface() {
  let button = createButton("SAVE");
  button.position(320, 20);
  button.mousePressed(saveImage);
  
  pattern = createSelect();
  pattern.position(320, 0);
  
  pattern.option('Flow');
  pattern.option('Retro');
  pattern.option('Checkers');
  pattern.option('Scales');
  pattern.option('Circles');
  pattern.option('Test');
  pattern.changed(initSketch);
}

function saveButton() {
  let button = createButton("SAVE");
  button.position(320, 0);
  button.mousePressed(saveImage);
}

/*********** media ***********/
function toggleLoop(){
  if(isLoop) {
    noLoop(); 
    isLoop = false;
  }
  else {
    loop(); 
    isLoop = true;
  }
}

function saveImage() {
  if(!isLoop){
    toggleLoop();
    captureFrame();
    toggleLoop();
  }
  else captureFrame();
}

function captureFrame() {
  let filename = 'perlinPattern_' + str(year()) + str(month() + day());
  
  saveCanvas(filename, 'PNG');
}