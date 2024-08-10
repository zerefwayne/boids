function BoidType(boidColor, trailColor) {
  this.boidColor = boidColor;
  this.trailColor = trailColor;
}

const BoidTypes = {
  YELLOW: new BoidType("#ffeb3b", "#ffea00"),
  RED: new BoidType("#f44336", "#ff1744"),
  INDIGO: new BoidType("#3f51b5", "#3d5afe"),
  TEAL: new BoidType("#009688", "#1de9b6"),
};

export default BoidTypes;
