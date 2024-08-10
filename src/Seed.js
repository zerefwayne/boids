function Seed(x, y) {
  this.x = x;
  this.y = y;

  this.radius = 4;
  this.color = "white";

  this.show = (p5) => {
    p5.noStroke();
    p5.fill(this.color);
    p5.circle(this.x, this.y, this.radius * 2);
  };
}

export default Seed;
