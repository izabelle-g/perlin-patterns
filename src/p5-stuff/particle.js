class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(1, 4);
    this.prevPos = this.pos.copy();
    this.colour = getColour(noise(x, y));
  }
  
  showPoints() {
    strokeWeight(this.size);
    stroke(this.colour);
    point(this.pos.x, this.pos.y);
  }
  
  showLines() {
    strokeWeight(this.size);
    stroke(this.colour);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
  }
  
  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
  
  update() {
    let n = noise(this.pos.x, this.pos.y);
    updatePrev();
    this.pos.x += cos(n) * this.speed;
    this.pos.y += sin(n) * this.speed;
  }
}