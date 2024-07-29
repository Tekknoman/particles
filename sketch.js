var doBlur = true
function toggleBlur() {
    doBlur = !doBlur;
    document.getElementById("blurToggle").value = doBlur;
    document.getElementsByTagName("canvas")[0].classList.toggle("blur")
}
function Particle(lifespan=random(100, 300), x = random(width), y = random(height), vel = p5.Vector.random2D()) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.acc = createVector(0, 0);
    this.lifespan = lifespan; // Set the initial lifespan
    this.totalLifespan = lifespan;
    this.isDead = false;
    this.r = 30 + (random(30) - 15)
  }

  Particle.prototype.update = function() {
    this.acc.set(0, 0);
    // Add any forces (e.g., gravity) to the acceleration vector here
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    if (this.lifespan <= 0) {
      this.isDead = true;
      return; // Remove the particle when its lifespan reaches zero
    } else {
      this.lifespan -= 1; // Decrease the lifespan by one each frame
    }
    if (this.pos.x > width || this.pos.x < 0) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      this.vel.y *= -1;
    }
  };

  Particle.prototype.show = function() {
    stroke(255, 255 * (1 / this.totalLifespan * this.lifespan), 120);
    fill(255, 255 * (1 / this.totalLifespan * this.lifespan), 120);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  };

  var numParticles = 100; // Change the number of particles here
  var spawnRate = 1;
  var particles = [];
var lastPrint;

  function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    noStroke();
    fill(255);
    lastPrint = millis() - spawnRate;

  }

  function draw() {
    background(0, 0, 0);
    var timeElapsed = millis() - lastPrint;
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height && timeElapsed > spawnRate) {
      particles.push(new Particle(100 + random(100), mouseX, mouseY, createVector((random(10) - 5)/10, -1 + (random(18) - 9)/10)));
      lastPrint = millis();
    }
    for (var i = 0; i < particles.length; i++) {
      if(particles[i].isDead){
        delete[i]
      }else {    
        particles[i].update();
        particles[i].show();
      }
    }
  }