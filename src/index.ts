function SELECT(X: number[], L: number, R: number, K: number): void {
  while (R > L) {
    if (R - L > 600) {
      const N = R - L + 1;
      const I = K - L + 1;
      const Z = Math.log(N);
      const S = 0.5 * Math.exp((2 * Z) / 3);
      const SD = 0.5 * Math.sqrt((Z * S * (N - S)) / N) * Math.sign(I - N / 2);
      const LL = Math.max(L, Math.floor(K - (I * S) / N + SD));
      const RR = Math.min(R, Math.floor(K + ((N - I) * S) / N + SD));
      SELECT(X, LL, RR, K);
    }

    const T = X[K];
    let I = L;
    let J = R;

    swap(X, L, K);
    if (X[R] > T) swap(X, R, L);

    while (I < J) {
      swap(X, I, J);
      I++;
      J--;
      while (X[I] < T) I++;
      while (X[J] > T) J--;
    }

    if (X[L] === T) swap(X, L, J);
    else {
      J++;
      swap(X, J, R);
    }

    if (J <= K) L = J + 1;
    if (K <= J) R = J - 1;
  }
}

function swap(arr: number[], i: number, j: number): void {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

export function findMedian(arr: number[]): number {
  const n = arr.length;
  const k = Math.floor(n / 2);
  SELECT(arr, 0, n - 1, k);

  if (n % 2 === 0) {
    SELECT(arr, 0, n - 1, k - 1);
    return (arr[k - 1] + arr[k]) / 2;
  } else {
    return arr[k];
  }
}

export default findMedian;
