import BoidTypes from "./BoidTypes";
import { chance, exlerp, getMagnitude, getRandomNumber, lerp } from "./utils";

const MIN_SPEED = 2;
const TRAIL_LENGTH = 30;
const TRAIL_SEGMENT_LENGTH = 5;
const MAX_DISTANCE_TO_EAT_SEED = 6;
const BOUNDARY_TURN_FACTOR = 0.2;
const DELTA_TIME_SCALE_FACTOR = 100;
const REPRODUCTION_SPAWN_RADIUS = 20;
const STEER_TOWARDS_SEED_RADIUS = 25;

function Boid(x, y, v_x, v_y, type) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.v_x = v_x;
  this.v_y = v_y;
  this.birth = Date.now();
  this.history = [];

  this.update = (p5, margin) => {
    this._applyBoundaryForce(p5.width, p5.height, margin);
    this._capSpeed();
    this._moveBoid(p5.deltaTime);
    this._storeCurrentPosition();
  };

  this.show = (p5, renderTrails) => {
    this._drawBoid(p5);
    renderTrails && this._drawTrail(p5);
  };

  // Behaviour methods
  this.attract = (targetX, targetY, attractionFactor, influenceRadius) => {
    const [dx, dy] = [targetX - this.x, targetY - this.y];
    const distance = getMagnitude(dx, dy);
    const relativeAttractionFactor = lerp(
      distance,
      0,
      influenceRadius,
      attractionFactor,
      0
    );

    this.v_x += dx * relativeAttractionFactor;
    this.v_y += dy * relativeAttractionFactor;
  };

  this.separation = (boids, avoidanceFactor) => {
    boids.forEach((boid) => {
      if (boid === this) return;

      const [dx, dy] = [this.x - boid.x, this.y - boid.y];

      this.v_x += dx * avoidanceFactor;
      this.v_y += dy * avoidanceFactor;
    });
  };

  this.alignment = (boids, matchingFactor) => {
    const filteredBoids = boids.filter(
      (boid) => boid.type === this.type && boid !== this
    );
    if (filteredBoids.length === 0) return;

    let { avgVX, avgVY } = filteredBoids.reduce(
      (acc, boid) => {
        acc.avgVX += boid.v_x;
        acc.avgVY += boid.v_y;
        return acc;
      },
      { avgVX: 0, avgVY: 0 }
    );

    avgVX /= filteredBoids.length;
    avgVY /= filteredBoids.length;

    this.v_x += (avgVX - this.v_x) * matchingFactor;
    this.v_y += (avgVY - this.v_y) * matchingFactor;
  };

  this.cohesion = (boids, centeringFactor) => {
    const filteredBoids = boids.filter(
      (boid) => boid.type === this.type && boid !== this
    );
    if (filteredBoids.length === 0) return;

    let { avgX, avgY } = filteredBoids.reduce(
      (acc, boid) => {
        acc.avgX += boid.x;
        acc.avgY += boid.y;
        return acc;
      },
      { avgX: 0, avgY: 0 }
    );

    avgX /= filteredBoids.length;
    avgY /= filteredBoids.length;

    this.v_x += (avgX - this.x) * centeringFactor;
    this.v_y += (avgY - this.y) * centeringFactor;
  };

  this.steerTowardsSeeds = (seeds, visibleRadius) => {
    const agility = BoidTypes[this.type].agility;
    let nearestDistance = Infinity;
    let direction = [0, 0];
    const currentSpeed = getMagnitude(this.v_x, this.v_y);

    seeds.forEach((seed) => {
      const [dx, dy] = [seed.x - this.x, seed.y - this.y];
      const distance = getMagnitude(dx, dy);

      if (distance < visibleRadius && distance < nearestDistance) {
        nearestDistance = distance;
        direction = [dx, dy];
      }
    });

    if (nearestDistance < STEER_TOWARDS_SEED_RADIUS) {
      const newSpeed = getMagnitude(...direction);
      this.v_x = direction[0] * (currentSpeed / newSpeed);
      this.v_y = direction[1] * (currentSpeed / newSpeed);
    } else {
      this.v_x += direction[0] * agility;
      this.v_y += direction[1] * agility;
    }
  };

  this.eat = (seeds, despawnSeed, spawnBoidAt) => {
    seeds.some((seed) => {
      const distance = getMagnitude(seed.x - this.x, seed.y - this.y);
      if (distance <= MAX_DISTANCE_TO_EAT_SEED) {
        despawnSeed(seed.id);
        if (this._canReproduce()) this._reproduce(spawnBoidAt);
        return true;
      }
      return false;
    });
  };

  // Helper methods
  this.isDead = () => {
    const lifeSpan = BoidTypes[this.type].lifeSpan;
    if (lifeSpan <= 0) return true;

    const age = (Date.now() - this.birth) / 1000;
    const normalizedAge = Math.min(Math.max(age / lifeSpan, 0), 1);

    const deathProbability = exlerp(normalizedAge, 0, 1, 0, 0.01, 3);

    return chance(deathProbability);
  };

  this._applyBoundaryForce = (canvasWidth, canvasHeight, margin) => {
    let turnFactor = BOUNDARY_TURN_FACTOR;

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

    if (this.x < -margin || this.x > canvasWidth + margin) {
      this.v_x *= -1;
    }

    if (this.y < -margin || this.y > canvasHeight + margin) {
      this.v_y *= -1;
    }

    let currentSpeed = Math.sqrt(this.v_x * this.v_x + this.v_y * this.v_y);

    if (originalSpeed > 0) {
      this.v_x = (this.v_x / currentSpeed) * originalSpeed;
      this.v_y = (this.v_y / currentSpeed) * originalSpeed;
    }
  };

  this._capSpeed = () => {
    const { maxSpeed, lifeSpan } = BoidTypes[this.type];
    const age = this._getAgeInSeconds();
    let currentSpeed = this._getSpeed();

    if (currentSpeed === 0) {
      this.v_x = MIN_SPEED;
      this.v_y = MIN_SPEED;
      currentSpeed = MIN_SPEED;
    }

    const cappedSpeed = lerp(age, 0, lifeSpan, maxSpeed, MIN_SPEED);

    if (currentSpeed !== cappedSpeed) {
      const scaleFactor = cappedSpeed / currentSpeed;
      this.v_x *= scaleFactor;
      this.v_y *= scaleFactor;
    }
  };

  this._moveBoid = (dt) => {
    dt /= DELTA_TIME_SCALE_FACTOR;
    this.x += this.v_x * dt;
    this.y += this.v_y * dt;
  };

  this._storeCurrentPosition = () => {
    this.history.push({ x: this.x, y: this.y });

    if (this.history.length > TRAIL_LENGTH) {
      this.history.splice(0, this.history.length - TRAIL_LENGTH);
    }
  };

  this._drawBoid = (p5) => {
    const boidColor = BoidTypes[this.type].boidColor;
    const angle = this._getRotationInRad();

    p5.push();

    p5.translate(this.x, this.y);
    p5.rotate(angle);
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

  this._drawTrail = (p5) => {
    const trailColor = BoidTypes[this.type].trailColor;

    p5.noFill();

    for (
      let i = TRAIL_SEGMENT_LENGTH;
      i < this.history.length;
      i = i + TRAIL_SEGMENT_LENGTH
    ) {
      let pos1 = this.history[i - TRAIL_SEGMENT_LENGTH];
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

  this._canReproduce = () => {
    return chance(BoidTypes[this.type].reproductiveAbility);
  };

  this._reproduce = (spawnBoidAt) => {
    const maxOffsprings = BoidTypes[this.type].maxOffsprings;
    const offsprings = Math.max(1, Math.ceil(Math.random() * maxOffsprings));

    for (let i = 0; i < offsprings; i++) {
      const angle = getRandomNumber(0, 2 * Math.PI);
      const distance = getRandomNumber(0, REPRODUCTION_SPAWN_RADIUS);

      const [x, y, v_x, v_y] = [
        this.x + Math.cos(angle) * distance,
        this.y + Math.sin(angle) * distance,
        this.v_x / offsprings,
        this.v_y / offsprings,
      ];

      spawnBoidAt(x, y, v_x, v_y, this.type);
    }

    this.v_x /= offsprings;
    this.v_y /= offsprings;
  };

  this._getAgeInSeconds = () => {
    return (Date.now() - this.birth) / 1000;
  };

  this._getSpeed = () => {
    return getMagnitude(this.v_x, this.v_y);
  };

  this._getRotationInRad = () => {
    return Math.atan2(this.v_y, this.v_x);
  };
}

export default Boid;
