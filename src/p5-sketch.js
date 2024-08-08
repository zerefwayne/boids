import React from "react";
import Sketch from "react-p5";
import Boid from "./Boid";

function generateRandomBoids(p5, numBoids) {
  let boids = [];
  for (let i = 0; i < numBoids; i++) {
    let x = p5.random(p5.width - 10);
    let y = p5.random(p5.height - 10);
    let v_x = p5.random(3) * (Math.random() < 0.5 ? 1 : -1);
    let v_y = p5.random(3) * (Math.random() < 0.5 ? 1 : -1);

    boids.push(new Boid(x, y, v_x, v_y));
  }
  return boids;
}

function P5Sketch() {
  let boids = [];

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

    boids.push(...generateRandomBoids(p5, 50));
  };

  const draw = (p5) => {
    p5.background(0, 23, 68);

    boids.forEach((boid) => boid.update(p5));

    boids.forEach((boid) => boid.show(p5));
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default P5Sketch;
