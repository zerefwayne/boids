import BoidTypes from "./BoidTypes";

export const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

export const getRandomInteger = (min, max, includeMax = false) => {
  const adjustedMax = includeMax ? max + 1 : max;
  return Math.floor(getRandomNumber(min, adjustedMax));
};

export const getRandomBoidType = () => {
  const keys = Object.keys(BoidTypes);
  return keys[getRandomInteger(0, keys.length)];
};

export const getMagnitude = (x, y) => Math.sqrt(x ** 2 + y ** 2);

export const lerp = (val, from_min, from_max, to_min, to_max) => {
  const lerpedValue =
    ((val - from_min) * (to_max - to_min)) / (from_max - from_min) + to_min;

  return to_min < to_max
    ? Math.min(Math.max(lerpedValue, to_min), to_max)
    : Math.max(Math.min(lerpedValue, to_min), to_max);
};

export const exlerp = (val, from_min, from_max, to_min, to_max, exp) => {
  const normalizedVal = (val - from_min) / (from_max - from_min);
  const exponentiatedVal = Math.pow(normalizedVal, exp);
  const interpolatedVal = exponentiatedVal * (to_max - to_min) + to_min;

  return to_min < to_max
    ? Math.min(Math.max(interpolatedVal, to_min), to_max)
    : Math.max(Math.min(interpolatedVal, to_min), to_max);
};

export const chance = (probability) => Math.random() < probability;
