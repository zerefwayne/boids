function BoidType(
  boidColor,
  trailColor,
  reproductiveAbility,
  agility,
  maxSpeed,
  visibleRadius,
  lifeSpan,
  maxOffsprings
) {
  this.boidColor = boidColor;
  this.trailColor = trailColor;

  this.reproductiveAbility = reproductiveAbility;
  this.agility = agility;
  this.maxSpeed = maxSpeed;
  this.visibleRadius = visibleRadius;
  this.lifeSpan = lifeSpan;
  this.maxOffsprings = maxOffsprings;
}

const BoidTypes = {
  YELLOW: new BoidType("#ffeb3b", "#ffea00", 0.4, 0.01, 10.5, 100, 200, 3),
  RED: new BoidType("#f44336", "#ff1744", 0.5, 0.05, 10, 120, 100, 2),
  INDIGO: new BoidType("#3f51b5", "#3d5afe", 0.9, 0.03, 11, 90, 130, 1),
  TEAL: new BoidType("#009688", "#1de9b6", 0.2, 0.09, 12, 200, 75, 6),
};

export default BoidTypes;
