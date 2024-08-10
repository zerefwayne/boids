function BoidType(boidColor, trailColor, reproductiveAbility) {
  this.boidColor = boidColor;
  this.trailColor = trailColor;
  this.reproductiveAbility = reproductiveAbility;
}

const BoidTypes = {
  YELLOW: new BoidType("#ffeb3b", "#ffea00", 0.3),
  RED: new BoidType("#f44336", "#ff1744", 0.5),
  INDIGO: new BoidType("#3f51b5", "#3d5afe", 0.9),
  TEAL: new BoidType("#009688", "#1de9b6", 0.2),
};

export default BoidTypes;
