import React, { useState } from "react";
import Sketch from "react-p5";
import Boid from "./Boid";
import BoidType from "./BoidType";

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
  renderTrails,
  margin,
  isMarginVisible,
  renderMouseInfluence,
  mouseInfluenceRadius,
  mouseAttractionFactor,
}) {
  const NUMBER_OF_BOIDS = 500;

  const [boids, setBoids] = useState([]);

  function getRandomBoidType() {
    const keys = Object.keys(BoidType);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  function generateRandomBoids(p5, numBoids) {
    let newBoids = [];
    for (let i = 0; i < numBoids; i++) {
      let x = p5.random(p5.width - 10);
      let y = p5.random(p5.height - 10);
      let v_x = p5.random(3) * (Math.random() < 0.5 ? 1 : -1);
      let v_y = p5.random(3) * (Math.random() < 0.5 ? 1 : -1);
      let type = getRandomBoidType();
      newBoids.push(new Boid(x, y, v_x, v_y, type));
    }
    console.log(newBoids);
    return newBoids;
  }

  const drawLine = (p5, x1, y1, x2, y2) => {
    p5.line(x1, y1, x2, y2);
  };

  const drawBoundary = (p5, margin) => {
    p5.stroke("#333"); // Set the stroke color to black
    p5.strokeWeight(1); // Set the stroke weight (line thickness)

    // Draw the dotted margin lines
    drawLine(p5, margin, margin, p5.width - margin, margin); // Top line
    drawLine(
      p5,
      margin,
      p5.height - margin,
      p5.width - margin,
      p5.height - margin
    ); // Bottom line
    drawLine(p5, margin, margin, margin, p5.height - margin); // Left line
    drawLine(
      p5,
      p5.width - margin,
      margin,
      p5.width - margin,
      p5.height - margin
    ); // Right line
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    setBoids(generateRandomBoids(p5, NUMBER_OF_BOIDS));
  };

  const draw = (p5) => {
    p5.background(10, 10, 10);

    const isMousePressed = p5.mouseIsPressed;

    if (isMarginVisible) {
      drawBoundary(p5, margin);
    }

    setFrameRate(p5.frameRate().toFixed(2));

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

    if (isSeperationEnabled) {
      boids.forEach((boid) =>
        boid.seperation(p5, boids, closeRadius, avoidanceFactor)
      );
    }

    if (isMousePressed) {
      boids.forEach((boid) => {
        boid.attract(
          p5,
          p5.mouseX,
          p5.mouseY,
          mouseAttractionFactor,
          mouseInfluenceRadius
        );
      });

      if (renderMouseInfluence) {
        p5.noStroke();
        p5.fill("rgba(15, 15, 15, 0.5)");
        p5.circle(p5.mouseX, p5.mouseY, mouseInfluenceRadius * 2);
      }
    }

    boids.forEach((boid) => boid.update(p5, margin));

    boids.forEach((boid) => boid.show(p5, renderTrails, isMousePressed));
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default P5Sketch;
