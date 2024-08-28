import median from 'median';
import fs from 'fs/promises';
import fastMedian from 'fast-median';
import fasterMedian from 'faster-median';
import computeMedian from 'compute-median';
import mlArrayMedian from 'ml-array-median';
import quickSelect from 'median-quickselect';
import quickMedian from '../dist/index.js';

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * size));
}

const sizes = [10, 100, 1000, 10000, 100000, 1000000, 10000000];
const algorithms = [
  { name: 'median', func: median },
  // { name: 'fast-median', func: fastMedian },
  { name: 'faster-median', func: (arr) => fasterMedian({ nums: arr }) },
  { name: 'compute-median', func: computeMedian },
  //   { name: 'stats-median', func: statsMedian },
  { name: 'quick-median', func: quickMedian },
  { name: 'ml-array-median', func: mlArrayMedian },
  { name: 'median-quickselect', func: quickSelect },
];

const WARM_UP_ITERATIONS = 10;
const BENCHMARK_ITERATIONS = 50;
const COOL_DOWN_MS = 500;

function warmUp(func, arr) {
  for (let i = 0; i < WARM_UP_ITERATIONS; i++) {
    func(arr);
  }
}

function measureSingleRun(func, arr) {
  const start = process.hrtime.bigint();
  func(arr);
  const end = process.hrtime.bigint();
  return Number(end - start) / 1e6;
}

function printBoxedTitle(title) {
  const line = '─'.repeat(title.length + 4);
  console.log(`┌${line}┐`);
  console.log(`│  ${title}  │`);
  console.log(`└${line}┘`);
}

function printDivider() {
  console.log('─'.repeat(80));
}

// Function to generate the m3killer sequence
function generateM3Killer(n) {
  if (n % 4 !== 0) {
    throw new Error('n must be divisible by 4 for m3killer sequence');
  }

  const k = n / 2;
  const result = new Array(n);

  // Fill the first half
  for (let i = 0; i < k; i++) {
    result[i] = i + 1;
  }

  // Fill the second half using the m3killer pattern
  let index = k;
  for (let i = 0; i < k / 2; i++) {
    result[index++] = i * 2 + 1;
    result[index++] = k + i * 2 + 1;
  }

  return result;
}

// Functions for other special sequences
function generateRandom(n) {
  return randomArray(n);
}

function generateOnezero(n) {
  const arr = new Array(n).fill(0);
  for (let i = 0; i < n / 2; i++) {
    arr[i] = 1;
  }
  return shuffleArray(arr);
}

function generateSorted(n) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

function generateRotated(n) {
  const arr = generateSorted(n);
  return [...arr.slice(1), arr[0]];
}

function generateOrganpipe(n) {
  const half = Math.floor(n / 2);
  return [
    ...Array.from({ length: half }, (_, i) => i + 1),
    ...Array.from({ length: n - half }, (_, i) => half - i),
  ];
}

function generateTwofaced(n) {
  const m3killer = generateM3Killer(n);
  const log2n = Math.floor(Math.log2(n));

  // Shuffle the specified ranges
  shuffleRange(m3killer, 4 * log2n, n / 2 - 1);
  shuffleRange(m3killer, n / 2 + 4 * log2n - 1, n - 2);

  return m3killer;
}

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Helper function to shuffle a range within an array
function shuffleRange(array, start, end) {
  const range = array.slice(start, end + 1);
  shuffleArray(range);
  for (let i = start; i <= end; i++) {
    array[i] = range[i - start];
  }
}

function runBenchmark(func, arr) {
  const start = process.hrtime.bigint();
  const startCPU = process.cpuUsage();

  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    func(arr);
  }

  const end = process.hrtime.bigint();
  const endCPU = process.cpuUsage(startCPU);

  const timeInMs = Number(end - start) / 1e6;
  const opsPerSec = BENCHMARK_ITERATIONS / (timeInMs / 1000);
  const msPerOp = timeInMs / BENCHMARK_ITERATIONS;

  return {
    opsPerSec: opsPerSec.toFixed(2),
    msPerOp: msPerOp.toFixed(3),
    totalTimeMs: timeInMs.toFixed(3),
    cpuUser: endCPU.user,
    cpuSystem: endCPU.system,
  };
}

// Modify the main benchmarking function
async function runBenchmarks() {
  const results = {};
  const specialCases = [
    { name: 'Random', func: generateRandom },
    { name: 'Onezero', func: generateOnezero },
    { name: 'Sorted', func: generateSorted },
    { name: 'Rotated', func: generateRotated },
    { name: 'Organpipe', func: generateOrganpipe },
    { name: 'M3killer', func: generateM3Killer },
    { name: 'Twofaced', func: generateTwofaced },
  ];

  for (const size of sizes) {
    printBoxedTitle(`Benchmarking for array size: ${size}`);

    for (const specialCase of specialCases) {
      printBoxedTitle(`Special case: ${specialCase.name}`);

      let arr;
      try {
        arr = specialCase.func(size);
      } catch (error) {
        console.log(
          `Skipping ${specialCase.name} for size ${size}: ${error.message}`
        );
        continue;
      }

      let summaryResults = `Benchmarking ${specialCase.name} dataset of ${size} numbers\n`;

      for (const algo of algorithms) {
        console.log(`Warming up ${algo.name}...`);
        warmUp(algo.func, arr);

        console.log(`Running benchmark for ${algo.name}...`);
        const result = runBenchmark(algo.func, arr);

        const singleRunTime = measureSingleRun(algo.func, arr);

        // Store the result
        if (!results[algo.name]) {
          results[algo.name] = [];
        }
        results[algo.name].push({
          size,
          specialCase: specialCase.name,
          time: singleRunTime,
        });

        summaryResults += `${algo.name}: ${singleRunTime.toFixed(3)}ms `;

        console.log(`${algo.name}:`);
        console.log(`  Time for single run: ${singleRunTime.toFixed(3)}ms`);
        console.log(`  Time per operation (avg): ${result.msPerOp}ms`);
        console.log(
          `  Total time for ${BENCHMARK_ITERATIONS} iterations: ${result.totalTimeMs}ms`
        );
        console.log(`  Operations per second: ${result.opsPerSec} ops/sec`);
        console.log(
          `  CPU usage: ${result.cpuUser + result.cpuSystem} microseconds`
        );

        printDivider();

        // Cool down
        await new Promise((resolve) => setTimeout(resolve, COOL_DOWN_MS));
      }

      console.log(summaryResults);
      console.log('\n');
    }
  }

  await fs.writeFile(
    './benchmark/benchmark_results.json',
    JSON.stringify(results, null, 2)
  );
  console.log('Results saved to benchmark_results.json');
}

runBenchmarks().catch(console.error);
