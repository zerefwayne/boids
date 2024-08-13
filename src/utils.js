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
