import React, { useState } from "react";
import Sketch from "react-p5";
import Boid from "./Boid";

function P5Sketch({
  closeRadius,
  visibleRadius,
  avoidanceFactor,
  matchingFactor,
  centeringFactor,
  setFrameRate,
  isSeperationEnabled,
  isAlignmentEnabled,
  isCohesionEnabled,
  renderTrails
}) {
  const NUMBER_OF_BOIDS = 300;

  const [boids, setBoids] = useState([]);

  function generateRandomBoids(p5, numBoids) {
    let newBoids = [];
    for (let i = 0; i < numBoids; i++) {
      let x = p5.random(p5.width - 10);
      let y = p5.random(p5.height - 10);
      let v_x = p5.random(3) * (Math.random() < 0.5 ? 1 : -1);
      let v_y = p5.random(3) * (Math.random() < 0.5 ? 1 : -1);

      newBoids.push(new Boid(x, y, v_x, v_y));
    }
    return newBoids;
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    setBoids(generateRandomBoids(p5, NUMBER_OF_BOIDS));
  };

  const draw = (p5) => {
    p5.background(10, 10, 10);

    setFrameRate(p5.frameRate().toFixed(2));

    if (isSeperationEnabled) {
      boids.forEach((boid) =>
        boid.seperation(p5, boids, closeRadius, avoidanceFactor)
      );
    }

    if (isAlignmentEnabled) {
      boids.forEach((boid) =>
        boid.alignment(p5, boids, visibleRadius, matchingFactor)
      );
    }

    if (isCohesionEnabled) {
      boids.forEach((boid) =>
        boid.cohesion(p5, boids, visibleRadius, centeringFactor)
      );
    }
    
    boids.forEach((boid) => boid.update(p5));

    boids.forEach((boid) => boid.show(p5, renderTrails));
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default P5Sketch;
