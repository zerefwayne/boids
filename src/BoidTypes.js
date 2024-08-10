function BoidType(boidColor, trailColor, reproductiveAbility, agility) {
  this.boidColor = boidColor;
  this.trailColor = trailColor;
  this.reproductiveAbility = reproductiveAbility;
  this.agility = agility;
}

const BoidTypes = {
  YELLOW: new BoidType("#ffeb3b", "#ffea00", 0.3, 0.01),
  RED: new BoidType("#f44336", "#ff1744", 0.5, 0.2),
  INDIGO: new BoidType("#3f51b5", "#3d5afe", 0.9, 0.05),
  TEAL: new BoidType("#009688", "#1de9b6", 0.2, 0.7),
};

export default BoidTypes;
