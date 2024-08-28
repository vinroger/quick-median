import { expect } from 'chai';
import findMedian from '../dist/index.js';

describe('findMedian', () => {
  it('should correctly find the median of a hard-coded array', () => {
    const hardCodedArray = [1, 5, 2, 8, 7, 3, 6, 4];
    const result = findMedian(hardCodedArray);
    expect(result).to.equal(4.5);
  });

  function generateRandomArray(size, min, max) {
    return Array.from(
      { length: size },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  function simpleMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  const testCases = 1000;
  for (let i = 1; i <= testCases; i++) {
    it(`should correctly find the median of a random array (test case ${i})`, () => {
      const size = Math.floor(Math.random() * 20000) + 10;
      const randomArray = generateRandomArray(size, 1, 100);
      console.log('random array: ', randomArray);
      const medianResult = findMedian(randomArray);
      console.log('algorithm result: ', medianResult);
      const expectedMedian = simpleMedian(randomArray);

      expect(Math.abs(medianResult - expectedMedian)).to.be.lessThan(0.0001);
    });
  }
});
