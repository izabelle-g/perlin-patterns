var pattern = 'Test';
var emotion = 'test';

/***********  ***********/
function initInterface() {
  let button = createButton("SAVE");
  button.position(width, 40);
  button.mousePressed(saveImage);
  
  let pause = createButton("PAUSE");
  pause.position(width, 62);
  pause.mousePressed(toggleLoop);
  
  pattern = createSelect();
  pattern.position(width, 20);
  
  pattern.option('Flow');
  pattern.option('Retro');
  pattern.option('Checkers');
  pattern.option('Scales');
  pattern.option('Circles');
  pattern.option('Triangles');
  pattern.option('Goof');
  pattern.option('Test');
  pattern.selected('Test');
  pattern.changed(initSketch);
  
  let semantics = createSelect();
  semantics.position(width, 0);
  
  semantics.option('happy');
  semantics.option('anger');
  semantics.option('sad');
  semantics.option('fear');
  semantics.option('disgust');
  semantics.option('surprise');
  semantics.option('test');
  semantics.selected('test');
  semantics.changed( () => {
    emotion = semantics.value();
    initSketch();
  });
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