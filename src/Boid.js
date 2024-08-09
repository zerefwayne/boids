import BoidType from "./BoidType";

function Boid(x, y, v_x, v_y, type) {
  const MAX_SPEED = 20;
  const MIN_SPEED = 5;

  this.type = type;

  this.x = x;
  this.y = y;

  this.v_x = v_x;
  this.v_y = v_y;

  const TRAIL_LENGTH = 25;

  this.history = [];

  this.show = function (p5, renderTrails) {
    let rotation = Math.atan2(this.v_y, this.v_x);

    if (renderTrails) {
      p5.noFill();

      for (let i = 1; i < this.history.length; i++) {
        let pos1 = this.history[i - 1];
        let pos2 = this.history[i];

        if (pos2.x === Infinity && pos2.x === Infinity) {
          i++;
          continue;
        }

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
    p5.vertex(8, 0); // Tip of the triangle
    p5.vertex(-8, 6); // Bottom left vertex
    p5.vertex(-8, -6); // Bottom right vertex
    p5.endShape(p5.CLOSE);

    p5.pop();
  };

  this.update = function (p5) {
    this.cap_speed();

    this.x += this.v_x * (p5.deltaTime / 100);
    this.y += this.v_y * (p5.deltaTime / 100);

    if (this.x > p5.width) {
      this.x = 0;
      this.history.push({ x: Infinity, y: Infinity });
    }
    if (this.x < 0) {
      this.x = p5.width;
      this.history.push({ x: Infinity, y: Infinity });
    }
    if (this.y > p5.height) {
      this.y = 0;
      this.history.push({ x: Infinity, y: Infinity });
    }
    if (this.y < 0) {
      this.y = p5.height;
      this.history.push({ x: Infinity, y: Infinity });
    }

    this.history.push({ x: this.x, y: this.y });

    if (this.history.length > TRAIL_LENGTH) {
      this.history.shift();
    }
  };

  this.seperation = function (p5, boids, close_radius, avoidance_factor) {
    boids.forEach((boid) => {
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
