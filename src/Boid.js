import BoidType from "./BoidType";

function Boid(x, y, v_x, v_y, type) {
  const MAX_SPEED = 10;
  const MIN_SPEED = 5;

  this.type = type;

  this.x = x;
  this.y = y;

  this.v_x = v_x;
  this.v_y = v_y;

  const TRAIL_LENGTH = 30;

  this.history = [];

  this.show = function (p5, renderTrails) {
    let rotation = Math.atan2(this.v_y, this.v_x);

    if (renderTrails) {
      p5.noFill();

      for (let i = 5; i < this.history.length; i = i + 5) {
        let pos1 = this.history[i - 5];
        let pos2 = this.history[i];

        const trailColor = BoidType[this.type].trail;

        let alpha = p5.map(i, 0, this.history.length - 1, 0, 1);
        p5.stroke(
          `rgba(${p5.red(trailColor)}, ${p5.green(trailColor)}, ${p5.blue(
            trailColor
          )}, ${alpha})`
        );
        p5.line(pos1.x, pos1.y, pos2.x, pos2.y);
      }
    }

    p5.push();

    p5.translate(this.x, this.y);
    p5.rotate(rotation);
    p5.noStroke();
    p5.fill(BoidType[this.type].body);

    // Draw a triangle
    p5.beginShape();
    p5.vertex(2, 0);
    p5.vertex(-8, 6);
    p5.vertex(-6, 0);
    p5.vertex(-8, -6);
    p5.endShape(p5.CLOSE);

    p5.pop();
  };

  this.update = function (p5, margin) {
    this.cap_speed();

    this.x += this.v_x * (p5.deltaTime / 100);
    this.y += this.v_y * (p5.deltaTime / 100);

    this.applyBoundaryForce(p5.width, p5.height, margin);

    this.history.push({ x: this.x, y: this.y });

    if (this.history.length > TRAIL_LENGTH) {
      this.history.shift();
    }
  };

  this.applyBoundaryForce = (canvasWidth, canvasHeight, margin) => {
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

  this.cap_speed = function () {
    const speed = Math.sqrt(this.v_x * this.v_x + this.v_y * this.v_y);

    if (speed > MAX_SPEED) {
      this.v_x = this.v_x * (MAX_SPEED / speed);
      this.v_y = this.v_y * (MAX_SPEED / speed);
    }

    if (speed < MIN_SPEED) {
      this.v_x = this.v_x * (MIN_SPEED / speed);
      this.v_y = this.v_y * (MIN_SPEED / speed);
    }
  };
}

export default Boid;
