function Boid(x, y, v_x, v_y) {
  this.x = x;
  this.y = y;

  this.v_x = v_x;
  this.v_y = v_y;

  this.show = function (p5) {
    let rotation = Math.atan2(this.v_y, this.v_x);

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
    this.x += v_x;
    this.y += v_y;

    if (this.x > p5.width) this.x = 0;
    if (this.x < 0) this.x = p5.width;
    if (this.y > p5.height) this.y = 0;
    if (this.y < 0) this.y = p5.height;
  };
}

export default Boid;
