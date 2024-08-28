# Quick-Median

## Why this project?

Many existing median-finding packages on npm are not optimized for performance. This project implements the Floyd-Rivest algorithm, a highly efficient selection algorithm that outperforms traditional quickselect in practice.

## Algorithm

Quick-Median uses the Floyd-Rivest algorithm, an optimized selection algorithm with the following characteristics:

- Expected running time: $O(n)$
- Expected number of comparisons: $n + \min(k, n - k) + O(n^{1/2} \log^{1/2} n)$


The algorithm works by:
1. Selecting a small random sample from the input array
2. Recursively selecting two pivot elements
3. Partitioning the array into three sets based on these pivots
4. Recursively applying the algorithm to the appropriate partition

This approach significantly reduces the number of comparisons needed, especially for large datasets.

### Comparison with Other Algorithms

| Algorithm | Average Case | Worst Case | Space Complexity |
|-----------|--------------|------------|------------------|
| Floyd-Rivest | $O(n)$ | $O(n^2)$ | $O(1)$ |
| Quickselect | $O(n)$ | $O(n^2)$ | $O(1)$ |
| Median of Medians | $O(n)$ | $O(n)$ | $O(1)$ |
| Sorting-based | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ to $O(n)$ |

While Floyd-Rivest and Quickselect have the same big-O complexity, Floyd-Rivest performs fewer comparisons on average, leading to better real-world performance.

The worst-case scenario for Floyd-Rivest (and Quickselect) occurs when the pivot choices consistently result in unbalanced partitions. However, this is extremely rare in practice due to the algorithm's use of random sampling.


## Benchmarks

This implementation consistently outperforms other popular median-finding packages on npm:


| Algorithm | 10 | 100 | 1000 | 10000 | 100000 | 1000000 | 10000000 |
|-----------|----|----|------|-------|--------|---------|----------|
| median | 0.00 | 0.00 | 0.02 | 0.27 | 0.99 | 9.52 | 97.26 |
| faster-median | 0.00 | 0.01 | 0.05 | 0.24 | 2.76 | 68.41 | 693.28 |
| compute-median | 0.00 | 0.01 | 0.03 | 0.19 | 1.85 | 17.04 | 205.33 |
| **quick-median** | **0.00** | **0.00** | **0.01** | **0.04** | **0.28** | **1.70** | **17.04** |
| ml-array-median | 0.00 | 0.00 | 0.01 | 0.08 | 0.67 | 2.24 | 25.22 |
| median-quickselect | 0.00 | 0.00 | 0.01 | 0.03 | 0.26 | 1.59 | 17.91 |

(Times in milliseconds)

As shown, Quick-Median is consistently faster, especially for larger datasets. For an input size of 10,000,000 elements, Quick-Median is:
- 5.7x faster than the 'median' package
- 40.7x faster than 'faster-median'
- 12x faster than 'compute-median'
- 1.48x faster than 'ml-array-median'

## TypeScript Support

This package is written in TypeScript and includes type definitions, ensuring type safety in TypeScript projects.

## Acknowledgements

This implementation is based on the Floyd-Rivest algorithm, originally described in:

Floyd, Robert W.; Rivest, Ronald L. (March 1975). "Expected time bounds for selection". Communications of the ACM. 18 (3): 165–172. 

For more information about the algorithm, see the [Wikipedia article on the Floyd-Rivest algorithm](https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.