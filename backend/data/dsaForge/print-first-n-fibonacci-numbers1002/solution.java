class Solution {
    static long[] printFibb(int n) {
        long[] fib = new long[n];
        if (n >= 1) fib[0] = 1;
        if (n >= 2) fib[1] = 1;
        for (int i = 2; i < n; i++) {
            fib[i] = fib[i - 1] + fib[i - 2];
        }
        return fib;
    }
}