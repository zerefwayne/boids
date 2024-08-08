function Boid(x, y, v_x, v_y) {
  this.x = x;
  this.y = y;

  this.v_x = v_x;
  this.v_y = v_y;

  this.trail_color = "aqua";

  this.history = [];

  this.show = function (p5) {
    let rotation = Math.atan2(this.v_y, this.v_x);

    p5.noFill();

    for (let i = 1; i < this.history.length; i++) {
      let pos1 = this.history[i - 1];
      let pos2 = this.history[i];

      if (pos2.x === Infinity && pos2.x === Infinity) {
        i++;
        continue;
      }

      let alpha = p5.map(i, 0, this.history.length - 1, 0, 1);
      p5.stroke(
        `rgba(${p5.red(this.trail_color)}, ${p5.green(
          this.trail_color
        )}, ${p5.blue(this.trail_color)}, ${alpha})`
      );
      p5.line(pos1.x, pos1.y, pos2.x, pos2.y);
    }

    p5.push();

    p5.translate(this.x, this.y);
    p5.rotate(rotation);
    p5.strokeWeight(1);
    p5.stroke(100);
    p5.fill(255);

    // Draw a triangle
    p5.beginShape();
    p5.vertex(8, 0); // Tip of the triangle
    p5.vertex(-8, 6); // Bottom left vertex
    p5.vertex(-8, -6); // Bottom right vertex
    p5.endShape(p5.CLOSE);

    p5.pop();
  };

  this.update = function (p5) {
    this.x += this.v_x;
    this.y += this.v_y;

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

    // Limit the history length to 25 for a fading trail effect
    if (this.history.length > 40) {
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

      this.cap_speed();
    });
  };

  this.cap_speed = function () {
    const MAX_SPEED = 3;
    const MIN_SPEED = 1;

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
