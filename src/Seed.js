const generateId = (length) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) =>
    String.fromCharCode((byte % 94) + 33)
  ).join("");
};

function Seed(x, y) {
  this.x = x;
  this.y = y;

  this.radius = 4;
  this.color = "white";
  this.id = generateId(5);

  this.show = (p5) => {
    p5.noStroke();
    p5.fill(this.color);
    p5.circle(this.x, this.y, this.radius * 2);
  };
}

export default Seed;
