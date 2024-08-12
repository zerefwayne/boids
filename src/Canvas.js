import React, { useState } from "react";
import Sketch from "react-p5";
import Boid from "./Boid";
import BoidTypes from "./BoidTypes";
import Seed from "./Seed";
import KDTree from "./KDTree";

function Canvas({
  boids,
  setBoids,
  closeRadius,
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
  spawnSeedsOnClick,
}) {
  const NUMBER_OF_BOIDS = 30;
  const MAX_SEED_PER_SPAWN = 5;
  const SEED_SPAWN_INTERVAL = 1000;

  const [seeds, setSeeds] = useState([]);
  const [seedLastGeneratedAt, setSeedLastGeneratedAt] = useState(Date.now());

  function getRandomBoidType() {
    const keys = Object.keys(BoidTypes);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  function generateRandomBoids(p5, numBoids) {
    let newBoids = [];
    for (let i = 0; i < numBoids; i++) {
      let x = p5.random(p5.width - 10);
      let y = p5.random(p5.height - 10);
      let v_x = p5.random(10) * (Math.random() < 0.5 ? 1 : -1);
      let v_y = p5.random(10) * (Math.random() < 0.5 ? 1 : -1);
      let type = getRandomBoidType();
      newBoids.push(new Boid(x, y, v_x, v_y, type));
    }
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

  const purgeSeed = (id) => {
    setSeeds((prevSeeds) => prevSeeds.filter((seed) => seed.id !== id));
  };

  const spawnBoid = (boid) => {
    setBoids((prev) => [...prev, boid]);
  };

  const purgeDeadBoids = (p5) => {
    setBoids((prevBoids) => prevBoids.filter((boid) => !boid.isDead(p5)));
  };

  const mouseClicked = (p5) => {
    const ignoreClickBounds = [[0, 200, 0, 65]];

    const shouldIgnoreClick = ignoreClickBounds.some(
      ([xStart, xEnd, yStart, yEnd]) =>
        p5.mouseX >= xStart &&
        p5.mouseX <= xEnd &&
        p5.mouseY >= yStart &&
        p5.mouseY <= yEnd
    );

    if (shouldIgnoreClick) return;

    spawnSeedsOnClick &&
      _generateRandomSeedsAt(p5, p5.mouseX, p5.mouseY, MAX_SEED_PER_SPAWN);
  };

  const draw = (p5) => {
    const isMousePressed = p5.mouseIsPressed;
    const [mouseX, mouseY] = [p5.mouseX, p5.mouseY];

    const kdTree = new KDTree(boids);

    function getNeighbors(boid, visibleRadius) {
      return kdTree.rangeSearch(boid, visibleRadius);
    }

    // ----- COMPUTE FRAME ----- //
    // For every boid compute all behaviours
    boids.forEach((boid) => {
      const visibleRadius = BoidTypes[boid.type].visibleRadius;
      const closeNeighbours = getNeighbors(boid, closeRadius);
      const visibleNeighbours = getNeighbors(boid, visibleRadius);

      boid.eat(p5, seeds, purgeSeed, spawnBoid);
      boid.seperation(p5, closeNeighbours, avoidanceFactor);
      boid.steerTowardsSeeds(p5, seeds, visibleRadius);
      boid.alignment(p5, visibleNeighbours, matchingFactor);
      boid.cohesion(p5, visibleNeighbours, centeringFactor);

      isMousePressed &&
        !spawnSeedsOnClick &&
        boid.attract(
          p5,
          mouseX,
          mouseY,
          mouseAttractionFactor,
          mouseInfluenceRadius
        );
    });

    boids.forEach((boid) => boid.update(p5, margin));

    if (Date.now() - seedLastGeneratedAt >= SEED_SPAWN_INTERVAL) {
      _generateRandomSeeds(p5);
      setSeedLastGeneratedAt(Date.now());
    }

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

    // Render each seed
    seeds.forEach((seed) => seed.show(p5));

    // ----- CLEAN UP ----- //
    purgeDeadBoids(p5);
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const _renderMouseInfluence = (p5, mouseX, mouseY) => {
    p5.noStroke();
    p5.fill("rgba(15, 15, 15, 0.5)");
    p5.circle(mouseX, mouseY, mouseInfluenceRadius * 2);
  };

  const _generateSeedAt = (x, y) => {
    setSeeds((prevSeeds) => [...prevSeeds, new Seed(x, y)]);
  };

  const _generateRandomSeedsAt = (p5, x, y, count) => {
    const seedsToRender = Math.ceil(Math.random() * count);
    const clusterRadius = 30; // Adjust this value to control the spread of the cluster

    for (let i = 0; i < seedsToRender; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * clusterRadius;

      const seedX = x + Math.cos(angle) * distance;
      const seedY = y + Math.sin(angle) * distance;

      _generateSeedAt(seedX, seedY);
    }
  };

  const _generateRandomSeeds = (p5) => {
    const x = Math.random() * (p5.width - 2 * margin) + margin;
    const y = Math.random() * (p5.height - 2 * margin) + margin;

    _generateRandomSeedsAt(p5, x, y, MAX_SEED_PER_SPAWN);
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      windowResized={windowResized}
      mouseClicked={mouseClicked}
    />
  );
}

export default Canvas;
