var doBlur = true;
var slowSound, fastSound, turnSound, collectSound;
var items = [];
var itemSize = 20;
var fastSoundVolume = 0;

function toggleBlur() {
  doBlur = !doBlur;
  document.getElementById("blurToggle").value = doBlur;
  document.getElementsByTagName("canvas")[0].classList.toggle("blur");
}

function updateItemCounter() {
  document.getElementById("itemCounter").innerHTML = "Items collected: " + collectedItems;
}

function Particle(lifespan = random(100, 300), x = random(width), y = random(height), vel = p5.Vector.random2D()) {
  this.pos = createVector(x, y);
  this.vel = vel;
  this.acc = createVector(0, 0);
  this.lifespan = lifespan;
  this.totalLifespan = lifespan;
  this.isDead = false;
  this.r = 30 + (random(30) - 15);
}

Particle.prototype.update = function () {
  this.acc.set(0, 0);
  this.vel.add(this.acc);
  this.pos.add(this.vel);

  if (this.lifespan <= 0) {
    this.isDead = true;
    return;
  } else {
    this.lifespan -= 1;
  }
  if (this.pos.x > width || this.pos.x < 0) {
    this.vel.x *= -1;
  }
  if (this.pos.y > height || this.pos.y < 0) {
    this.vel.y *= -1;
  }
};

Particle.prototype.show = function () {
  stroke(255, 255 * (1 / this.totalLifespan * this.lifespan), 120, (200 / this.totalLifespan * this.lifespan));
  fill(255, 255 * (1 / this.totalLifespan * this.lifespan), 120, (200 / this.totalLifespan * this.lifespan));
  ellipse(this.pos.x, this.pos.y, this.r, this.r);
};

var numParticles = 100;
var spawnRate = 1;
var ttl = 100;
var particles = [];
var lastPrint;
var oldMouseX = 0;
var oldMouseY = 0;
var rotation = 0;
var targetRotation = 0;
var rotationSpeed = 0.23;
var itemCount = 5;
var collectedItems = 0;

function preload() {
  rocket = loadImage("assets/rocket.png");
  slowSound = loadSound("assets/slow.mp3");
  fastSound = loadSound("assets/fast.mp3");
  collectSound = loadSound("assets/collect.mp3");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  fill(255);
  lastPrint = millis() - spawnRate;
  angleMode(DEGREES);
  slowSound.loop();
  fastSound.loop();

  // Generate random items
  for (var i = 0; i < itemCount; i++) {
    items.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(0, 0, 0);
  var timeElapsed = millis() - lastPrint;
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height && timeElapsed > spawnRate) {
    particles.push(new Particle(ttl + random(ttl), mouseX, mouseY, createVector((random(10) - 5) / 10, -1 + (random(18) - 9) / 10)));
    lastPrint = millis();
  }
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].isDead) {
      particles.splice(i, 1);
      i--;
    } else {
      particles[i].update();
      particles[i].show();
    }
  }

  var dx = mouseX - oldMouseX;
  var dy = mouseY - oldMouseY;
  var speed = sqrt(dx * dx + dy * dy);
  var newTargetRotation = atan2(dy, dx) + 90;
  var angleDifference = newTargetRotation - targetRotation;
  angleDifference = (angleDifference + 180) % 360 - 180;
  targetRotation += angleDifference;

  rotation += (targetRotation - rotation) * rotationSpeed;

  // Adjust sounds based on speed and sharp turns
  slowSound.setVolume(map(speed, 0, 20, 1, 0));

  // Smoothly transition the fast sound volume
  var targetFastSoundVolume = map(speed, 0, 20, 0, 1);
  fastSoundVolume = lerp(fastSoundVolume, targetFastSoundVolume, 0.05);
  fastSound.setVolume(fastSoundVolume);

  if (int(random(1000)) % 155 === 0 && items.length < itemCount) {
    items.push(createVector(random(width), random(height)));
  }

  items = items.filter(function (item) {
    if (dist(mouseX, mouseY, item.x, item.y) < itemSize * 2) {
      collectSound.play();
      collectedItems++;
      return false;
    }
    return dist(mouseX, mouseY, item.x, item.y) > itemSize * 2;
  });

  // Draw and check for item collection
  for (var j = items.length - 1; j >= 0; j--) {
    var item = items[j];
    fill(255, 204, 0);
    ellipse(item.x, item.y, itemSize, itemSize);
  }

  push();
  translate(mouseX, mouseY);
  imageMode(CENTER);
  rotate(rotation);
  image(rocket, 0, 0, 100, 150);
  pop();

  oldMouseX = mouseX;
  oldMouseY = mouseY;
  updateItemCounter();
}
