import React, { useState } from "react";
import Sketch from "react-p5";
import Boid from "./Boid";
import BoidTypes from "./BoidTypes";

function P5Sketch({
  closeRadius,
  visibleRadius,
  avoidanceFactor,
  matchingFactor,
  centeringFactor,
  setFrameRate,
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
    const keys = Object.keys(BoidTypes);
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

    setInterval(() => {
      setFrameRate(p5.frameRate().toFixed(0));
    }, 1000);
  };

  const draw = (p5) => {
    const isMousePressed = p5.mouseIsPressed;
    const [mouseX, mouseY] = [p5.mouseX, p5.mouseY];

    // ----- COMPUTE FRAME ----- //
    // For every boid compute all behaviours
    boids.forEach((boid) => {
      boid.alignment(p5, boids, visibleRadius, matchingFactor);
      boid.cohesion(p5, boids, visibleRadius, centeringFactor);
      boid.seperation(p5, boids, closeRadius, avoidanceFactor);

      isMousePressed &&
        boid.attract(
          p5,
          mouseX,
          mouseY,
          mouseAttractionFactor,
          mouseInfluenceRadius
        );
    });

    boids.forEach((boid) => boid.update(p5, margin));

    // ----- RENDER FRAME ----- //
    // Set background color
    p5.background(10, 10, 10);

    // Draw turnaround margin if enabled
    isMarginVisible && drawBoundary(p5, margin);

    // Draw mouse influence radius if enabled
    if (isMousePressed && renderMouseInfluence) {
      _renderMouseInfluence(p5, mouseX, mouseY);
    }

    // Render each boid
    boids.forEach((boid) => boid.show(p5, renderTrails, isMousePressed));
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const _renderMouseInfluence = (p5, mouseX, mouseY) => {
    p5.noStroke();
    p5.fill("rgba(15, 15, 15, 0.5)");
    p5.circle(mouseX, mouseY, mouseInfluenceRadius * 2);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default P5Sketch;
