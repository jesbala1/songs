
let song, fft, amplitude;
let blobs = [];
let particles = [];
let started = false;

function preload() {
  song = loadSound("song.m4a");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  for (let i = 0; i < 5; i++) {
    blobs.push(new Blob());
  }
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }

  let btn = document.getElementById('startButton');
  btn.addEventListener('click', () => {
    song.play();
    started = true;
    btn.style.display = 'none';
  });
}

function draw() {
  if (!started) return;

  background(10, 10, 20, 100);

  let level = amplitude.getLevel();
  let spectrum = fft.analyze();

  // Draw fluid blobs
  for (let blob of blobs) {
    blob.update(level);
    blob.display();
  }

  // Draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  // Optional morphing shape in center
  push();
  translate(width / 2, height / 2);
  stroke(255);
  noFill();
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    let r = 100 + sin(a * 3 + frameCount * 0.02) * 30 * level * 10;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

class Blob {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(50, 120);
    this.color = color(random(100, 255), random(100, 255), random(100, 255), 150);
  }

  update(level) {
    this.rr = this.r + level * 500;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.rr);
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.alpha = random(50, 150);
    this.size = random(1, 4);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }

  display() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}
