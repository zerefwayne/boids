import React, { useState } from "react";
import Sketch from "react-p5";
import Boid from "./Boid";
import BoidTypes from "./BoidTypes";
import Seed from "./Seed";
import KDTree from "./KDTree";

import { getRandomBoidType, getRandomInteger, getRandomNumber } from "./utils";

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
  const INITIAL_BOID_COUNT = 30;

  const MAX_SEED_PER_SPAWN = 5;
  const SEED_SPAWN_INTERVAL = 1000;
  const SEED_CLUSTER_RADIUS = 30;

  const [MARGIN_COLOR, MARGIN_WEIGHT] = ["#333", 1];

  const [seeds, setSeeds] = useState([]);
  const [seedLastGeneratedAt, setSeedLastGeneratedAt] = useState(Date.now());

  // P5 functions
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    _spawnRandomBoids(p5, INITIAL_BOID_COUNT);

    setInterval(() => {
      setFrameRate(p5.frameRate().toFixed(0));
    }, 1000);
  };

  const draw = (p5) => {
    _computeFrame(p5);
    _drawFrame(p5);
    _cleanup(p5);
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
      _spawnSeedsAt(p5.mouseX, p5.mouseY, MAX_SEED_PER_SPAWN);
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  // Helper methods for simulation
  const _computeFrame = (p5) => {
    const isMousePressed = p5.mouseIsPressed;
    const [mouseX, mouseY] = [p5.mouseX, p5.mouseY];

    const kdTree = new KDTree(boids);

    function getNeighbors(boid, visibleRadius) {
      return kdTree.rangeSearch(boid, visibleRadius);
    }

    boids.forEach((boid) => {
      const visibleRadius = BoidTypes[boid.type].visibleRadius;
      const closeNeighbours = getNeighbors(boid, closeRadius);
      const visibleNeighbours = getNeighbors(boid, visibleRadius);

      boid.separation(closeNeighbours, avoidanceFactor);
      boid.alignment(visibleNeighbours, matchingFactor);
      boid.cohesion(visibleNeighbours, centeringFactor);
      boid.steerTowardsSeeds(seeds, visibleRadius);
      boid.eat(seeds, despawnSeed, spawnBoidAt);

      if (isMousePressed && !spawnSeedsOnClick) {
        boid.attract(
          mouseX,
          mouseY,
          mouseAttractionFactor,
          mouseInfluenceRadius
        );
      }
    });

    boids.forEach((boid) => boid.update(p5, margin));

    if (_shouldSpawnSeeds()) {
      _spawnRandomSeeds(p5);
      setSeedLastGeneratedAt(Date.now());
    }
  };

  const _drawFrame = (p5) => {
    p5.background(10, 10, 10);

    isMarginVisible && _drawMargin(p5, margin);
    p5.isMousePressed && renderMouseInfluence && _drawMouseInfluence(p5);

    boids.forEach((boid) => boid.show(p5, renderTrails, p5.isMousePressed));
    seeds.forEach((seed) => seed.show(p5));
  };

  const _cleanup = (p5) => {
    _despawnDeadBoids(p5);
  };

  // Helper functions for boids
  const spawnBoidAt = (x, y, v_x, v_y, type) => {
    setBoids((prev) => [...prev, new Boid(x, y, v_x, v_y, type)]);
  };

  const _spawnRandomBoids = (p5, numBoids) => {
    for (let i = 0; i < numBoids; i++) {
      let x = getRandomNumber(0, p5.width);
      let y = getRandomNumber(0, p5.height);
      let v_x = getRandomNumber(0, 10) * (Math.random() < 0.5 ? 1 : -1);
      let v_y = getRandomNumber(0, 10) * (Math.random() < 0.5 ? 1 : -1);
      let type = getRandomBoidType();
      spawnBoidAt(x, y, v_x, v_y, type);
    }
  };

  const _despawnDeadBoids = (p5) => {
    setBoids((prevBoids) => prevBoids.filter((boid) => !boid.isDead(p5)));
  };

  // Helper functions for seeds
  const _spawnSeedAt = (x, y) => {
    setSeeds((prevSeeds) => [...prevSeeds, new Seed(x, y)]);
  };

  const _spawnSeedsAt = (x, y, count) => {
    const seedsToRender = getRandomInteger(1, count, true);

    for (let i = 0; i < seedsToRender; i++) {
      const angle = getRandomNumber(0, 2 * Math.PI);
      const distance = getRandomNumber(0, SEED_CLUSTER_RADIUS);

      const [seedX, seedY] = [
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance,
      ];

      _spawnSeedAt(seedX, seedY);
    }
  };

  const _spawnRandomSeeds = (p5) => {
    const x = getRandomNumber(margin, p5.width - 2 * margin);
    const y = getRandomNumber(margin, p5.height - 2 * margin);

    _spawnSeedsAt(x, y, MAX_SEED_PER_SPAWN);
  };

  const despawnSeed = (id) => {
    setSeeds((prevSeeds) => prevSeeds.filter((seed) => seed.id !== id));
  };

  const _shouldSpawnSeeds = () => {
    return Date.now() - seedLastGeneratedAt >= SEED_SPAWN_INTERVAL;
  };

  // Helper functions for drawing
  const _drawLine = (p5, x1, y1, x2, y2) => {
    p5.line(x1, y1, x2, y2);
  };

  const _drawMargin = (p5, margin) => {
    p5.stroke(MARGIN_COLOR);
    p5.strokeWeight(MARGIN_WEIGHT);

    const topLeft = { x: margin, y: margin };
    const topRight = { x: p5.width - margin, y: margin };
    const bottomLeft = { x: margin, y: p5.height - margin };
    const bottomRight = { x: p5.width - margin, y: p5.height - margin };

    const lines = [
      [topLeft, topRight], // Top line
      [bottomLeft, bottomRight], // Bottom line
      [topLeft, bottomLeft], // Left line
      [topRight, bottomRight], // Right line
    ];

    lines.forEach(([start, end]) =>
      _drawLine(p5, start.x, start.y, end.x, end.y)
    );
  };

  const _drawMouseInfluence = (p5) => {
    p5.noStroke();
    p5.fill("rgba(15, 15, 15, 0.5)");
    p5.circle(p5.mouseX, p5.mouseY, mouseInfluenceRadius * 2);
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
