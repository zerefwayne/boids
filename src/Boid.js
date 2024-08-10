import BoidTypes from "./BoidTypes";

const MIN_SPEED = 5;
const TRAIL_LENGTH = 30;

function Boid(x, y, v_x, v_y, type) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.v_x = v_x;
  this.v_y = v_y;
  this.birth = Date.now();
  this.history = [];

  this.update = function (p5, margin) {
    this._applyBoundaryForce(p5.width, p5.height, margin);
    this._capSpeed(p5);
    this._moveBoid(p5);
    this._storeCurrentPosition();
  };

  this.show = function (p5, renderTrails) {
    this._drawBoid(p5);
    if (renderTrails) {
      this._drawTrail(p5);
    }
  };

  this.attract = function (
    p5,
    targetX,
    targetY,
    attractionFactor,
    influenceRadius
  ) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    let relativeAttractionFactor = p5.constrain(
      p5.map(distance, 0, influenceRadius, attractionFactor, 0),
      0,
      attractionFactor
    );

    this.v_x += dx * relativeAttractionFactor;
    this.v_y += dy * relativeAttractionFactor;
  };

  this.seperation = function (p5, boids, close_radius, avoidance_factor) {
    boids.forEach((boid) => {
      if (boid === this) return;

      let distance = p5.dist(this.x, this.y, boid.x, boid.y);

      if (distance >= close_radius) return;

      let close_dx = this.x - boid.x;
      let close_dy = this.y - boid.y;

      this.v_x += close_dx * avoidance_factor;
      this.v_y += close_dy * avoidance_factor;
    });
  };

  this.alignment = function (p5, boids, visible_radius, matching_factor) {
    let visible_v_x_avg = 0;
    let visible_v_y_avg = 0;
    let visible_boids = 0;

    boids
      .filter((boid) => boid.type === this.type)
      .forEach((boid) => {
        if (boid === this) return;

        let distance = p5.dist(this.x, this.y, boid.x, boid.y);

        if (distance >= visible_radius) return;

        visible_v_x_avg += boid.v_x;
        visible_v_y_avg += boid.v_y;
        visible_boids++;
      });

    if (visible_boids === 0) return;

    visible_v_x_avg = visible_v_x_avg / visible_boids;
    visible_v_y_avg = visible_v_y_avg / visible_boids;

    this.v_x += (visible_v_x_avg - this.v_x) * matching_factor;
    this.v_y += (visible_v_y_avg - this.v_y) * matching_factor;
  };

  this.cohesion = function (p5, boids, visible_radius, centering_factor) {
    let visible_x_avg = 0;
    let visible_y_avg = 0;
    let visible_boids = 0;

    boids
      .filter((boid) => boid.type === this.type)
      .forEach((boid) => {
        if (boid === this) return;

        let distance = p5.dist(this.x, this.y, boid.x, boid.y);

        if (distance >= visible_radius) return;

        visible_x_avg += boid.x;
        visible_y_avg += boid.y;
        visible_boids++;
      });

    if (visible_boids === 0) return;

    visible_x_avg = visible_x_avg / visible_boids;
    visible_y_avg = visible_y_avg / visible_boids;

    this.v_x += (visible_x_avg - this.x) * centering_factor;
    this.v_y += (visible_y_avg - this.y) * centering_factor;
  };

  this.steerTowardsSeeds = (p5, seeds, visible_radius) => {
    const agility = BoidTypes[this.type].agility;

    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];

      let dx = seed.x - this.x;
      let dy = seed.y - this.y;

      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= visible_radius) continue;

      this.v_x += dx * agility;
      this.v_y += dy * agility;
      break;
    }
  };

  this.eat = (p5, seeds, purgeSeed, spawnBoid) => {
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];

      let dx = seed.x - this.x;
      let dy = seed.y - this.y;

      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 6) continue;

      this._canReproduce() && this._reproduce(spawnBoid);
      purgeSeed(seed.id);

      break;
    }
  };

  this.isDead = (p5) => {
    const lifeSpan = BoidTypes[this.type].lifeSpan;
    const age = (Date.now() - this.birth) / 1000;

    // Adjust the exponent value to control the curve steepness
    const exponent = 3;

    // Calculate death probability using exponential mapping
    const normalizedAge = p5.constrain(age / lifeSpan, 0, 1);
    const deathProbability = p5.constrain(
      Math.pow(normalizedAge, exponent) * 0.01,
      0,
      0.01
    );

    return Math.random() < deathProbability;
  };

  this._applyBoundaryForce = (canvasWidth, canvasHeight, margin) => {
    let turnFactor = 0.2; // How strongly the boid turns back onto the screen

    const originalSpeed = Math.sqrt(this.v_x * this.v_x + this.v_y * this.v_y);

    if (this.x < margin) {
      this.v_x += turnFactor * ((margin - this.x) / margin);
    } else if (this.x > canvasWidth - margin) {
      this.v_x -= turnFactor * ((this.x - (canvasWidth - margin)) / margin);
    }

    if (this.y < margin) {
      this.v_y += turnFactor * ((margin - this.y) / margin);
    } else if (this.y > canvasHeight - margin) {
      this.v_y -= turnFactor * ((this.y - (canvasHeight - margin)) / margin);
    }

    // Rebound boids back when they go too far out of bounds
    if (this.x < -margin || this.x > canvasWidth + margin) {
      this.v_x *= -1;
    }

    if (this.y < -margin || this.y > canvasHeight + margin) {
      this.v_y *= -1;
    }

    // Normalize the velocity to maintain constant speed
    let currentSpeed = Math.sqrt(this.v_x * this.v_x + this.v_y * this.v_y);

    if (originalSpeed > 0) {
      this.v_x = (this.v_x / currentSpeed) * originalSpeed;
      this.v_y = (this.v_y / currentSpeed) * originalSpeed;
    }
  };

  this._capSpeed = function (p5) {
    let maxSpeed = BoidTypes[this.type].maxSpeed;
    const lifeSpan = BoidTypes[this.type].lifeSpan;
    const speed = Math.sqrt(this.v_x * this.v_x + this.v_y * this.v_y);
    const age = (Date.now() - this.birth) / 1000;
    maxSpeed =
      2 + p5.constrain(p5.map(age, 0, lifeSpan, maxSpeed, 0), 0, maxSpeed);

    if (speed > maxSpeed) {
      this.v_x = this.v_x * (maxSpeed / speed);
      this.v_y = this.v_y * (maxSpeed / speed);
    }

    if (speed < MIN_SPEED) {
      this.v_x = this.v_x * (MIN_SPEED / speed);
      this.v_y = this.v_y * (MIN_SPEED / speed);
    }
  };

  this._moveBoid = (p5) => {
    const deltaTime = p5.deltaTime;
    this.x += this.v_x * (deltaTime / 100);
    this.y += this.v_y * (deltaTime / 100);
  };

  this._storeCurrentPosition = () => {
    this.history.push({ x: this.x, y: this.y });

    if (this.history.length > TRAIL_LENGTH) {
      this.history.shift();
    }
  };

  this._drawBoid = function (p5) {
    const rotation = Math.atan2(this.v_y, this.v_x);
    const boidColor = BoidTypes[this.type].boidColor;

    p5.push();

    p5.translate(this.x, this.y);
    p5.rotate(rotation);
    p5.noStroke();
    p5.fill(boidColor);

    p5.beginShape();
    p5.vertex(2, 0);
    p5.vertex(-8, 6);
    p5.vertex(-6, 0);
    p5.vertex(-8, -6);
    p5.endShape(p5.CLOSE);

    p5.pop();
  };

  this._drawTrail = function (p5) {
    const trailColor = BoidTypes[this.type].trailColor;

    p5.noFill();

    for (let i = 5; i < this.history.length; i = i + 5) {
      let pos1 = this.history[i - 5];
      let pos2 = this.history[i];

      let alpha = p5.map(i, 0, this.history.length - 1, 0, 1);
      p5.stroke(
        `rgba(${p5.red(trailColor)}, ${p5.green(trailColor)}, ${p5.blue(
          trailColor
        )}, ${alpha})`
      );
      p5.line(pos1.x, pos1.y, pos2.x, pos2.y);
    }
  };

  this._canReproduce = function () {
    const reproductiveAbility = BoidTypes[this.type].reproductiveAbility;
    return Math.random() < reproductiveAbility;
  };

  this._reproduce = function (spawnBoid) {
    const maxOffsprings = BoidTypes[this.type].maxOffsprings;
    const offsprings = Math.max(1, Math.ceil(Math.random() * maxOffsprings));

    for (let i = 0; i < offsprings; i++) {
      spawnBoid(
        new Boid(
          this.x + 6 + i,
          this.y + 6 + i,
          this.v_x / offsprings,
          this.v_y / offsprings,
          this.type
        )
      );
    }

    this.v_x /= offsprings;
    this.v_y /= offsprings;
  };
}

export default Boid;
